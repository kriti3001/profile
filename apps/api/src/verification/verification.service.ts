import { Injectable } from '@nestjs/common';
import type { DocumentType, User } from '../../generated/prisma/client';
import { PrismaService } from '../common/prisma.service';
import { StorageService } from '../storage/storage.service';
import { UploadTarget } from '../storage/upload-rules';

@Injectable()
export class VerificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) {}

  /** Records a document the user uploaded; it's moved into the private verification-docs container. */
  async addDocument(user: User, documentType: DocumentType, blobUrl: string) {
    const fileUrl = await this.storage.promoteUpload(UploadTarget.VERIFICATION_DOC, user.id, blobUrl);
    // status defaults to PENDING; review/approval is a later step.
    return this.prisma.verificationDocument.create({ data: { userId: user.id, documentType, fileUrl } });
  }
}
