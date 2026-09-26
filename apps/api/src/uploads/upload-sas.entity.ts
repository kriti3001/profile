import { ApiProperty } from '@nestjs/swagger';

export class UploadSasEntity {
  @ApiProperty({ description: 'PUT the file bytes here. Includes a create-only SAS token valid for 15 minutes.' })
  uploadUrl: string;

  @ApiProperty({
    description: 'URL of the uploaded (staged) blob, no SAS. Send it to the record endpoint after uploading; ' +
      'the recorded file gets its own permanent URL in the target container.',
  })
  blobUrl: string;

  @ApiProperty({ example: 'property-photos/properties/<propertyId>/<uuid>.jpg', description: 'Name in the private staging container' })
  blobName: string;

  @ApiProperty({ example: 'uploads', description: 'Private staging container; the file is moved to its final container when recorded' })
  container: string;

  @ApiProperty()
  expiresAt: Date;

  @ApiProperty({
    example: { 'x-ms-blob-type': 'BlockBlob', 'Content-Type': 'image/jpeg' },
    description: 'Headers the upload PUT must send',
  })
  requiredHeaders: Record<string, string>;
}
