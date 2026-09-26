/** What each upload target accepts. Shared by SAS issuing (claimed values) and recording (actual blob). */

export const UploadTarget = {
  PROPERTY_PHOTO: 'property-photos',
  VERIFICATION_DOC: 'verification-docs',
} as const;
export type UploadTarget = (typeof UploadTarget)[keyof typeof UploadTarget];

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB

const IMAGE_TYPES: Record<string, string[]> = {
  'image/jpeg': ['jpg', 'jpeg'],
  'image/png': ['png'],
  'image/webp': ['webp'],
};

export const ALLOWED_TYPES: Record<UploadTarget, Record<string, string[]>> = {
  [UploadTarget.PROPERTY_PHOTO]: IMAGE_TYPES,
  [UploadTarget.VERIFICATION_DOC]: { ...IMAGE_TYPES, 'application/pdf': ['pdf'] },
};

export const UPLOAD_SAS_TTL_MINUTES = 15;

/**
 * Blob names are chosen by the server, never the client, and encode who may record them.
 * Final blob, in the target's container:
 *   property-photos:   properties/<propertyId>/<uuid>.<ext>
 *   verification-docs: users/<userId>/<uuid>.<ext>
 * Staging blob (what the client uploads to), in the private uploads container:
 *   <target>/<final blob name>
 */
export const finalBlobName = (target: UploadTarget, ownerId: string, fileId: string) =>
  `${target === UploadTarget.PROPERTY_PHOTO ? 'properties' : 'users'}/${ownerId}/${fileId}`;

const UUID = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';
export const stagingNamePattern = (target: UploadTarget, ownerId: string) =>
  new RegExp(`^${target}/${target === UploadTarget.PROPERTY_PHOTO ? 'properties' : 'users'}/${ownerId}/(${UUID}\\.[a-z0-9]+)$`);
