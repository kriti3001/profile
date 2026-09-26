import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';
import { ListingCategory, PropertyStatus, PropertyType } from '../../../generated/prisma/enums';

/** Statuses anyone may see. DRAFT and ARCHIVED listings are only visible to their owner (GET /properties/mine). */
export const PUBLIC_STATUSES: PropertyStatus[] = [PropertyStatus.PUBLISHED, PropertyStatus.RENTED];

export class ListPropertiesQueryDto {
  @ApiPropertyOptional({ example: 'Indore', description: 'Exact match' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  city?: string;

  @ApiPropertyOptional({ example: 'Palasia', description: 'Exact match' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  locality?: string;

  @ApiPropertyOptional({ enum: PUBLIC_STATUSES, default: PropertyStatus.PUBLISHED })
  @IsOptional()
  @IsIn(PUBLIC_STATUSES)
  status?: PropertyStatus;

  @ApiPropertyOptional({ enum: ListingCategory, enumName: 'ListingCategory' })
  @IsOptional()
  @IsEnum(ListingCategory)
  category?: ListingCategory;

  @ApiPropertyOptional({ enum: PropertyType, enumName: 'PropertyType' })
  @IsOptional()
  @IsEnum(PropertyType)
  propertyType?: PropertyType;

  @ApiPropertyOptional({ minimum: 0, description: 'Whole rupees, inclusive' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ minimum: 0, description: 'Whole rupees, inclusive' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({ minimum: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ minimum: 1, maximum: 100, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;
}
