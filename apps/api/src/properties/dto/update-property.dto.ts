import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PropertyStatus } from '../../../generated/prisma/enums';
import { CreatePropertyDto } from './create-property.dto';

// skipNullProperties: false => sending null for a required field (e.g. "title": null) is a 400,
// while fields that are nullable in the schema (deposit, bhk, address) can still be cleared with null.
export class UpdatePropertyDto extends PartialType(OmitType(CreatePropertyDto, ['status', 'photoUrls'] as const), {
  skipNullProperties: false,
}) {
  @ApiPropertyOptional({ enum: PropertyStatus, enumName: 'PropertyStatus', example: PropertyStatus.RENTED })
  @IsOptional()
  @IsEnum(PropertyStatus)
  status?: PropertyStatus;
}
