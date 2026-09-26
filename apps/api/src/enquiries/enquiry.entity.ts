import { ApiProperty } from '@nestjs/swagger';
import { EnquirySource } from '../../generated/prisma/enums';

/** Swagger schema for an Enquiry record. */
export class EnquiryEntity {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  propertyId: string;

  @ApiProperty({ example: 'Rahul Verma' })
  tenantName: string;

  @ApiProperty({ example: '+91 91234 56789' })
  tenantContact: string;

  @ApiProperty({ type: String, nullable: true })
  message: string | null;

  @ApiProperty({ enum: EnquirySource, enumName: 'EnquirySource' })
  source: EnquirySource;

  @ApiProperty()
  createdAt: Date;
}
