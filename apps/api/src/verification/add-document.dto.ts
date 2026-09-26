import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUrl } from 'class-validator';
import { DocumentType } from '../../generated/prisma/enums';

export class AddDocumentDto {
  @ApiProperty({ enum: DocumentType, enumName: 'DocumentType' })
  @IsEnum(DocumentType)
  documentType: DocumentType;

  @ApiProperty({
    description: 'The blobUrl returned by POST /uploads/sas-token (target verification-docs), after uploading to it',
    example: 'https://<account>.blob.core.windows.net/verification-docs/users/<userId>/<uuid>.pdf',
  })
  @IsUrl({ require_protocol: true, protocols: ['https'] })
  blobUrl: string;
}
