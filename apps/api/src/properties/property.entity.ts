import { ApiProperty } from '@nestjs/swagger';
import { FurnishingStatus, ListingCategory, PropertyStatus, PropertyType } from '../../generated/prisma/enums';

// Swagger schemas for property responses.

export class PropertyPhotoEntity {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  propertyId: string;

  @ApiProperty({ example: 'https://example.com/photo-1.jpg' })
  url: string;

  @ApiProperty({ description: 'Set by geo-tag verification (not implemented yet)' })
  isLocationVerified: boolean;

  @ApiProperty()
  createdAt: Date;
}

export class PropertyEntity {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ enum: ListingCategory, enumName: 'ListingCategory' })
  category: ListingCategory;

  @ApiProperty({ enum: PropertyType, enumName: 'PropertyType' })
  propertyType: PropertyType;

  @ApiProperty({ description: 'Whole rupees' })
  price: number;

  @ApiProperty({ type: Number, nullable: true })
  deposit: number | null;

  @ApiProperty({ type: Number, nullable: true })
  bhk: number | null;

  @ApiProperty({ description: 'Sq ft' })
  area: number;

  @ApiProperty({ enum: FurnishingStatus, enumName: 'FurnishingStatus' })
  furnishingStatus: FurnishingStatus;

  @ApiProperty({ format: 'date-time' })
  availableFrom: Date;

  @ApiProperty()
  city: string;

  @ApiProperty()
  locality: string;

  @ApiProperty({ type: String, nullable: true })
  address: string | null;

  @ApiProperty({ enum: PropertyStatus, enumName: 'PropertyStatus' })
  status: PropertyStatus;

  @ApiProperty()
  isVerified: boolean;

  @ApiProperty({ format: 'uuid' })
  ownerId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: [PropertyPhotoEntity] })
  photos: PropertyPhotoEntity[];
}

export class PropertyListEntity {
  @ApiProperty({ type: [PropertyEntity] })
  data: PropertyEntity[];

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;

  @ApiProperty({ example: 42, description: 'Total matching properties across all pages' })
  total: number;

  @ApiProperty({ example: 3 })
  totalPages: number;
}
