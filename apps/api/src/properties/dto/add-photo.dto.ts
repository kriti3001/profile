import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class AddPhotoDto {
  @ApiProperty({
    description: 'The blobUrl returned by POST /uploads/sas-token, after the file has been uploaded to it',
    example: 'https://<account>.blob.core.windows.net/property-photos/properties/<propertyId>/<uuid>.jpg',
  })
  @IsUrl({ require_protocol: true, protocols: ['https'] })
  blobUrl: string;
}
