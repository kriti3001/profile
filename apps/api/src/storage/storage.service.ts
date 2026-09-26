import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  BlobSASPermissions,
  BlobServiceClient,
  BlockBlobClient,
  ContainerClient,
  RestError,
  SASProtocol,
  StorageSharedKeyCredential,
} from '@azure/storage-blob';
import { randomUUID } from 'crypto';
import {
  ALLOWED_TYPES,
  finalBlobName,
  MAX_UPLOAD_BYTES,
  stagingNamePattern,
  UPLOAD_SAS_TTL_MINUTES,
  UploadTarget,
} from './upload-rules';

export interface UploadSas {
  /** PUT the file here (includes the SAS token). */
  uploadUrl: string;
  /** The uploaded blob's URL (no SAS); send this to the record endpoint after uploading. */
  blobUrl: string;
  blobName: string;
  container: string;
  expiresAt: Date;
  /** Headers the PUT must send. */
  requiredHeaders: Record<string, string>;
}

/**
 * Azure Blob Storage access. File bytes never pass through this API:
 *  1. POST /uploads/sas-token issues a short-lived SAS URL for ONE new blob in the private staging
 *     container (create-only, no read/list).
 *  2. The client PUTs the file there.
 *  3. The record endpoint calls promoteUpload(): the server copies the staged blob into the target
 *     container, checks the copy's real size and Content-Type (a SAS can't enforce either), and deletes
 *     the staged blob. No SAS ever grants write access to a final blob, so a checked file can't be
 *     replaced afterwards, and unchecked uploads are never publicly readable.
 */
@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private client?: BlobServiceClient;
  private stagingReady?: Promise<unknown>;

  constructor(private readonly config: ConfigService) {}

  async createUploadSas(
    target: UploadTarget,
    ownerId: string,
    file: { fileName: string; contentType: string; size: number },
  ): Promise<UploadSas> {
    const ext = assertAllowedFile(target, file);
    const staging = this.stagingContainer();
    this.stagingReady ??= staging.createIfNotExists().catch((err: unknown) => {
      this.stagingReady = undefined;
      throw err;
    }); // private: no public access argument
    await this.stagingReady;

    const blobName = `${target}/${finalBlobName(target, ownerId, `${randomUUID()}.${ext}`)}`;
    const blob = staging.getBlockBlobClient(blobName);
    const now = Date.now();
    const expiresAt = new Date(now + UPLOAD_SAS_TTL_MINUTES * 60_000);
    const uploadUrl = await blob.generateSasUrl({
      permissions: BlobSASPermissions.from({ create: true }),
      startsOn: new Date(now - 5 * 60_000), // tolerate client clock skew
      expiresOn: expiresAt,
      protocol: SASProtocol.Https,
    });

    return {
      uploadUrl,
      blobUrl: blob.url,
      blobName,
      container: staging.containerName,
      expiresAt,
      requiredHeaders: { 'x-ms-blob-type': 'BlockBlob', 'Content-Type': file.contentType },
    };
  }

  /**
   * Moves an upload issued for `target`/`ownerId` from staging into the target container after checking
   * the stored file. Returns the final blob URL to store (never includes a SAS token).
   */
  async promoteUpload(target: UploadTarget, ownerId: string, blobUrl: string): Promise<string> {
    const staging = this.stagingContainer();
    const stagedName = blobNameIn(staging, blobUrl);
    const fileId = stagedName ? stagingNamePattern(target, ownerId).exec(stagedName)?.[1] : undefined;
    if (!stagedName || !fileId) {
      throw new BadRequestException('blobUrl is not an upload issued for this target by POST /uploads/sas-token');
    }

    const staged = staging.getBlockBlobClient(stagedName);
    const stagedProps = await staged.getProperties().catch((err: unknown) => {
      if (err instanceof RestError && err.statusCode === 404) {
        throw new BadRequestException('No file found at blobUrl. Upload it with the SAS URL first (or it was already recorded).');
      }
      throw err;
    });
    // Cheap early rejection; the authoritative check is on the copy below.
    await this.rejectIfInvalid(target, stagedProps, [staged]);

    const final = this.targetContainer(target).getBlockBlobClient(finalBlobName(target, ownerId, fileId));
    const sourceUrl = await staged.generateSasUrl({
      permissions: BlobSASPermissions.from({ read: true }),
      expiresOn: new Date(Date.now() + 5 * 60_000),
      protocol: SASProtocol.Https,
    });
    try {
      await final.syncCopyFromURL(sourceUrl, { conditions: { ifNoneMatch: '*' } });
    } catch (err) {
      if (err instanceof RestError && (err.statusCode === 409 || err.statusCode === 412)) {
        throw new ConflictException('This file has already been recorded');
      }
      throw err;
    }

    // The staged blob could have been overwritten between the check and the copy, so check the copy.
    await this.rejectIfInvalid(target, await final.getProperties(), [final, staged]);
    await staged.deleteIfExists();
    return final.url;
  }

  private async rejectIfInvalid(
    target: UploadTarget,
    props: { contentLength?: number; contentType?: string },
    deleteOnFailure: BlockBlobClient[],
  ) {
    const allowed = ALLOWED_TYPES[target];
    const problem =
      (props.contentLength ?? 0) > MAX_UPLOAD_BYTES
        ? `File is larger than ${MAX_UPLOAD_BYTES / 1024 / 1024} MB`
        : !props.contentType || !(props.contentType in allowed)
          ? `Uploaded Content-Type must be one of: ${Object.keys(allowed).join(', ')}`
          : null;
    if (problem) {
      await Promise.all(deleteOnFailure.map((b) => b.deleteIfExists()));
      throw new BadRequestException(`${problem}. The uploaded file was deleted.`);
    }
  }

  private targetContainer(target: UploadTarget): ContainerClient {
    const name =
      target === UploadTarget.PROPERTY_PHOTO
        ? this.config.get<string>('AZURE_STORAGE_PHOTOS_CONTAINER') || 'property-photos'
        : this.config.get<string>('AZURE_STORAGE_DOCS_CONTAINER') || 'verification-docs';
    return this.getClient().getContainerClient(name);
  }

  private stagingContainer(): ContainerClient {
    return this.getClient().getContainerClient(this.config.get<string>('AZURE_STORAGE_UPLOADS_CONTAINER') || 'uploads');
  }

  private getClient(): BlobServiceClient {
    if (this.client) return this.client;
    const connectionString = this.config.get<string>('AZURE_STORAGE_CONNECTION_STRING');
    if (!connectionString) {
      throw new InternalServerErrorException(
        'Storage is not configured: set AZURE_STORAGE_CONNECTION_STRING in apps/api/.env',
      );
    }
    const client = BlobServiceClient.fromConnectionString(connectionString);
    if (!(client.credential instanceof StorageSharedKeyCredential)) {
      this.logger.error('AZURE_STORAGE_CONNECTION_STRING has no AccountKey, so SAS URLs cannot be signed');
      throw new InternalServerErrorException('Storage connection string must include an AccountKey');
    }
    this.client = client;
    return client;
  }
}

/** The blob name if `blobUrl` points inside `container` (any query string, e.g. a pasted SAS, is ignored). */
function blobNameIn(container: ContainerClient, blobUrl: string): string | null {
  let url: URL;
  try {
    url = new URL(blobUrl);
  } catch {
    return null;
  }
  const base = new URL(container.url);
  if (url.origin !== base.origin || !url.pathname.startsWith(`${base.pathname}/`)) return null;
  return decodeURIComponent(url.pathname.slice(base.pathname.length + 1));
}

/** Throws unless the claimed file suits `target`; returns its (lowercased) extension. */
function assertAllowedFile(target: UploadTarget, file: { fileName: string; contentType: string; size: number }): string {
  const allowed = ALLOWED_TYPES[target];
  const extensions = allowed[file.contentType];
  if (!extensions) {
    throw new BadRequestException(`contentType must be one of: ${Object.keys(allowed).join(', ')}`);
  }
  const ext = file.fileName.includes('.') ? file.fileName.split('.').pop()!.toLowerCase() : '';
  if (!extensions.includes(ext)) {
    throw new BadRequestException(`A ${file.contentType} file must have one of these extensions: ${extensions.join(', ')}`);
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new BadRequestException(`File is larger than ${MAX_UPLOAD_BYTES / 1024 / 1024} MB`);
  }
  return ext;
}
