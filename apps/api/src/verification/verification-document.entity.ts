import { ApiProperty } from '@nestjs/swagger';
import { DocumentType, VerificationStatus } from '../../generated/prisma/enums';

/** Swagger schema for a VerificationDocument record. */
export class VerificationDocumentEntity {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  userId: string;

  @ApiProperty({ enum: DocumentType, enumName: 'DocumentType' })
  documentType: DocumentType;

  @ApiProperty({ description: 'Blob URL in the private verification-docs container (not publicly readable)' })
  fileUrl: string;

  @ApiProperty({ enum: VerificationStatus, enumName: 'VerificationStatus' })
  status: VerificationStatus;

  @ApiProperty()
  createdAt: Date;
}
