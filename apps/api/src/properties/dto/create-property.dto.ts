import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsIn,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';
import { Facing, FurnishingStatus, ListingCategory, PropertyStatus, PropertyType } from '../../../generated/prisma/enums';
import { AMENITIES, type Amenity } from '../amenities';

/**
 * For optional fields whose column is NOT NULL: skip validation only when the field is absent, so an explicit
 * null fails validation (400). @IsOptional would let null through to Prisma, which rejects it as a 500.
 */
export const presentEvenIfNull = (_obj: object, value: unknown) => value !== undefined;

// ownerId, isVerified and photos are never accepted here; the global ValidationPipe rejects any
// field not declared. Photos are added after creation via POST /uploads/sas-token + POST /properties/:id/photos.
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
  @ValidateIf(presentEvenIfNull)
  @IsIn([PropertyStatus.DRAFT, PropertyStatus.PUBLISHED])
  status?: PropertyStatus;

  @ApiPropertyOptional({
    type: [String],
    enum: AMENITIES,
    example: ['Lift', 'Power Backup', 'Covered Parking'],
    description: 'Amenity labels from the allowed list (no duplicates)',
  })
  @ValidateIf(presentEvenIfNull)
  @IsArray()
  @ArrayMaxSize(AMENITIES.length)
  @ArrayUnique()
  @IsIn(AMENITIES, { each: true })
  amenities?: Amenity[];

  @ApiPropertyOptional({ enum: Facing, enumName: 'Facing', nullable: true })
  @IsOptional()
  @IsEnum(Facing)
  facing?: Facing | null;

  @ApiPropertyOptional({
    type: Number,
    nullable: true,
    minimum: 0,
    maximum: 200,
    example: 7,
    description: '0 = ground floor. Null for a whole building (e.g. a villa). Must not exceed totalFloors.',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(200)
  floorNumber?: number | null;

  @ApiPropertyOptional({
    type: Number,
    nullable: true,
    minimum: 0,
    maximum: 200,
    example: 11,
    description: 'Floors above ground ("7th of 11" -> 11, "G+2" -> 2, single-storey -> 0)',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(200)
  totalFloors?: number | null;
}
