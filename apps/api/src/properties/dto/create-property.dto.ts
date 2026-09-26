import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsIn,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { FurnishingStatus, ListingCategory, PropertyStatus, PropertyType } from '../../../generated/prisma/enums';

// ownerId, isVerified and photo verification are never accepted from clients; the global
// ValidationPipe rejects any field not declared here.
export class CreatePropertyDto {
  @ApiProperty({ example: 'Sunny 2BHK Apartment in Palasia', maxLength: 150 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title: string;

  @ApiProperty({ example: 'Semi-furnished 2BHK close to the main market.', maxLength: 5000 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  description: string;

  @ApiProperty({ enum: ListingCategory, enumName: 'ListingCategory' })
  @IsEnum(ListingCategory)
  category: ListingCategory;

  @ApiProperty({ enum: PropertyType, enumName: 'PropertyType' })
  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @ApiProperty({ example: 16000, minimum: 1, description: 'Whole rupees: monthly rent, or sale price for BUY' })
  @IsInt()
  @Min(1)
  price: number;

  @ApiPropertyOptional({ type: Number, nullable: true, example: 50000, minimum: 0, description: 'Whole rupees; null for BUY' })
  @IsOptional()
  @IsInt()
  @Min(0)
  deposit?: number | null;

  @ApiPropertyOptional({ type: Number, nullable: true, example: 2, minimum: 1, maximum: 20, description: 'Null for commercial/PG' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  bhk?: number | null;

  @ApiProperty({ example: 950, minimum: 1, description: 'Carpet area in sq ft' })
  @IsInt()
  @Min(1)
  area: number;

  @ApiProperty({ enum: FurnishingStatus, enumName: 'FurnishingStatus' })
  @IsEnum(FurnishingStatus)
  furnishingStatus: FurnishingStatus;

  @ApiProperty({ example: '2026-11-01', format: 'date' })
  @IsISO8601({ strict: true })
  availableFrom: string;

  @ApiProperty({ example: 'Indore', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  city: string;

  @ApiProperty({ example: 'Palasia', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  locality: string;

  @ApiPropertyOptional({ type: String, nullable: true, example: '12 MG Road', maxLength: 300 })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  address?: string | null;

  @ApiPropertyOptional({
    enum: [PropertyStatus.DRAFT, PropertyStatus.PUBLISHED],
    default: PropertyStatus.DRAFT,
    description: 'Publish immediately, or save as a draft (hidden from public listings)',
  })
  @IsOptional()
  @IsIn([PropertyStatus.DRAFT, PropertyStatus.PUBLISHED])
  status?: PropertyStatus;

  @ApiPropertyOptional({
    type: [String],
    maxItems: 20,
    example: ['https://example.com/photo-1.jpg'],
    description: 'Photo URLs. Placeholder until uploads to Blob Storage are added.',
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsUrl({ require_protocol: true, protocols: ['https', 'http'] }, { each: true })
  photoUrls?: string[];
}
