import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { FurnishingStatus, ListingCategory, PropertyStatus, PropertyType } from '../../../generated/prisma/enums';

/** Statuses anyone may see. DRAFT and ARCHIVED listings are only visible to their owner (GET /properties/mine). */
export const PUBLIC_STATUSES: PropertyStatus[] = [PropertyStatus.PUBLISHED, PropertyStatus.RENTED];

export const SORT_OPTIONS = ['newest', 'price_asc', 'price_desc', 'price_dec'] as const;
export type SortOption = (typeof SORT_OPTIONS)[number];

/** Accepts `?x=a&x=b` or `?x=a,b` (or a mix); returns undefined when absent. */
const toList = ({ value }: { value: unknown }) =>
  value === undefined
    ? undefined
    : ([] as unknown[])
        .concat(value)
        .flatMap((v) => String(v).split(','))
        .map((v) => v.trim())
        .filter(Boolean);

const toIntList = (arg: { value: unknown }) => toList(arg)?.map((v) => (/^\d+$/.test(v) ? Number(v) : v));

const toBoolean = ({ value }: { value: unknown }) => (value === 'true' ? true : value === 'false' ? false : value);

export class ListPropertiesQueryDto {
  @ApiPropertyOptional({
    example: 'balcony palasia',
    maxLength: 100,
    description:
      'Free-text search, case-insensitive, across title, description, city and locality. Matches partial words. ' +
      'Several words must ALL match (each in any of those fields).',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  q?: string;

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

  @ApiPropertyOptional({
    enum: PUBLIC_STATUSES,
    default: PropertyStatus.PUBLISHED,
    description: 'Only PUBLISHED (default) or RENTED. Drafts and archived listings are never public.',
  })
  @IsOptional()
  @IsIn(PUBLIC_STATUSES)
  status?: PropertyStatus;

  @ApiPropertyOptional({ enum: ListingCategory, enumName: 'ListingCategory', description: 'RENT, BUY, PG or COMMERCIAL' })
  @IsOptional()
  @IsEnum(ListingCategory)
  category?: ListingCategory;

  @ApiPropertyOptional({
    enum: PropertyType,
    enumName: 'PropertyType',
    isArray: true,
    description: 'One or more types (repeat the parameter or comma-separate); matches any of them',
  })
  @IsOptional()
  @Transform(toList)
  @IsArray()
  @ArrayMaxSize(Object.keys(PropertyType).length)
  @IsEnum(PropertyType, { each: true })
  propertyType?: PropertyType[];

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

  @ApiPropertyOptional({
    type: [Number],
    example: [2, 3],
    description: 'Exact BHK, one or more (repeat or comma-separate); matches any of them. Excludes listings without a BHK.',
  })
  @IsOptional()
  @Transform(toIntList)
  @IsArray()
  @ArrayMaxSize(20)
  @IsInt({ each: true })
  @Min(1, { each: true })
  @Max(20, { each: true })
  bhk?: number[];

  @ApiPropertyOptional({ minimum: 1, maximum: 20, description: 'At least this many BHK (e.g. 4 for "4+")' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(20)
  minBhk?: number;

  @ApiPropertyOptional({
    enum: FurnishingStatus,
    enumName: 'FurnishingStatus',
    isArray: true,
    description: 'One or more furnishing states (repeat or comma-separate); matches any of them',
  })
  @IsOptional()
  @Transform(toList)
  @IsArray()
  @ArrayMaxSize(Object.keys(FurnishingStatus).length)
  @IsEnum(FurnishingStatus, { each: true })
  furnishing?: FurnishingStatus[];

  @ApiPropertyOptional({ minimum: 0, description: 'Carpet area in sq ft, inclusive' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minArea?: number;

  @ApiPropertyOptional({ minimum: 0, description: 'Carpet area in sq ft, inclusive' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxArea?: number;

  @ApiPropertyOptional({ type: Boolean, description: 'true = verified listings only; false = unverified only' })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  verified?: boolean;

  @ApiPropertyOptional({
    enum: SORT_OPTIONS,
    default: 'newest',
    description: 'newest (default), price_asc, or price_desc (price_dec is accepted as an alias)',
  })
  @IsOptional()
  @IsIn(SORT_OPTIONS)
  sortBy: SortOption = 'newest';

  @ApiPropertyOptional({ minimum: 1, default: 1, description: 'Page number (1-based)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ minimum: 1, maximum: 100, default: 20, description: 'Results per page' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;
}
