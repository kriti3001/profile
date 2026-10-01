import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { IsEnum, ValidateIf } from 'class-validator';
import { PropertyStatus } from '../../../generated/prisma/enums';
import { CreatePropertyDto, presentEvenIfNull } from './create-property.dto';

// skipNullProperties: false => sending null for a required field (e.g. "title": null) is a 400,
// while fields that are nullable in the schema (deposit, bhk, address, facing, floors) can still be cleared with null.
export class UpdatePropertyDto extends PartialType(OmitType(CreatePropertyDto, ['status'] as const), {
  skipNullProperties: false,
}) {
  @ApiPropertyOptional({ enum: PropertyStatus, enumName: 'PropertyStatus', example: PropertyStatus.RENTED })
  @ValidateIf(presentEvenIfNull)
  @IsEnum(PropertyStatus)
  status?: PropertyStatus;
}
