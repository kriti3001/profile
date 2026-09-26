import { Body, Controller, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { User } from '../../generated/prisma/client';
import { CurrentUser } from '../auth/current-user.decorator';
import { Protected } from '../auth/protected.decorator';
import { ErrorResponse } from '../common/error-response.entity';
import { PropertiesService } from '../properties/properties.service';
import { StorageService } from '../storage/storage.service';
import { UploadTarget } from '../storage/upload-rules';
import { CreateUploadSasDto } from './create-upload-sas.dto';
import { UploadSasEntity } from './upload-sas.entity';

@ApiTags('uploads')
@Controller('uploads')
export class UploadsController {
  constructor(
    private readonly storage: StorageService,
    private readonly properties: PropertiesService,
  ) {}

  @Post('sas-token')
  @Protected()
  @ApiOperation({
    summary: 'Get a SAS URL to upload one file directly to Blob Storage',
    description:
      'property-photos: only for a property you own. verification-docs: stored under your own user. ' +
      'The URL is create-only, for one server-named blob, and expires in 15 minutes. After uploading, record the file ' +
      'with POST /properties/{id}/photos or POST /verification/documents.',
  })
  @ApiCreatedResponse({ type: UploadSasEntity })
  @ApiBadRequestResponse({ description: 'Invalid target, file type, extension or size', type: ErrorResponse })
  @ApiNotFoundResponse({ description: 'No such property', type: ErrorResponse })
  async createSas(@CurrentUser() user: User, @Body() dto: CreateUploadSasDto): Promise<UploadSasEntity> {
    let ownerId = user.id;
    if (dto.target === UploadTarget.PROPERTY_PHOTO) {
      ownerId = (await this.properties.findOwned(user, dto.propertyId!)).id;
    }
    return this.storage.createUploadSas(dto.target, ownerId, dto);
  }
}
