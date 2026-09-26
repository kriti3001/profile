import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsInt, IsNotEmpty, IsString, IsUUID, Max, MaxLength, Min, ValidateIf } from 'class-validator';
import { MAX_UPLOAD_BYTES, UploadTarget } from '../storage/upload-rules';

export class CreateUploadSasDto {
  @ApiProperty({ enum: Object.values(UploadTarget), example: UploadTarget.PROPERTY_PHOTO })
  @IsIn(Object.values(UploadTarget))
  target: UploadTarget;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Required for property-photos: the property the photo belongs to (you must own it)',
  })
  @ValidateIf((o: CreateUploadSasDto) => o.target === UploadTarget.PROPERTY_PHOTO)
  @IsUUID()
  propertyId?: string;

  @ApiProperty({ example: 'living-room.jpg', description: 'Only its extension is used; the server names the blob' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  fileName: string;

  @ApiProperty({
    example: 'image/jpeg',
    description: 'property-photos: image/jpeg, image/png, image/webp. verification-docs: those or application/pdf',
  })
  @IsString()
  @IsNotEmpty()
  contentType: string;

  @ApiProperty({ example: 245000, minimum: 1, maximum: MAX_UPLOAD_BYTES, description: 'File size in bytes (max 10 MB)' })
  @IsInt()
  @Min(1)
  @Max(MAX_UPLOAD_BYTES)
  size: number;
}
