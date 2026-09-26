import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserRole, type User } from '../../generated/prisma/client';
import { CurrentUser } from '../auth/current-user.decorator';
import { Protected } from '../auth/protected.decorator';
import { ErrorResponse } from '../common/error-response.entity';
import { AddPhotoDto } from './dto/add-photo.dto';
import { CreatePropertyDto } from './dto/create-property.dto';
import { ListPropertiesQueryDto } from './dto/list-properties.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PropertiesService } from './properties.service';
import { PropertyEntity, PropertyListEntity, PropertyPhotoEntity } from './property.entity';

@ApiTags('properties')
@ApiBadRequestResponse({ description: 'Invalid input', type: ErrorResponse })
@Controller('properties')
export class PropertiesController {
  constructor(private readonly properties: PropertiesService) {}

  @Post()
  @Protected(UserRole.OWNER, UserRole.BROKER)
  @ApiOperation({
    summary: 'Create a property',
    description: 'Owners and brokers only. The caller becomes the owner; ownerId cannot be supplied.',
  })
  @ApiCreatedResponse({ type: PropertyEntity })
  create(@CurrentUser() user: User, @Body() dto: CreatePropertyDto) {
    return this.properties.create(user, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'List / filter properties (public)',
    description: 'Only PUBLISHED listings unless status=RENTED is requested. Newest first, paginated.',
  })
  @ApiOkResponse({ type: PropertyListEntity })
  list(@Query() query: ListPropertiesQueryDto) {
    return this.properties.list(query);
  }

  // Declared before :id so "mine" isn't parsed as an ID.
  @Get('mine')
  @Protected()
  @ApiOperation({ summary: "List the caller's own properties", description: 'Includes drafts and archived listings.' })
  @ApiOkResponse({ type: [PropertyEntity] })
  mine(@CurrentUser() user: User) {
    return this.properties.findMine(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a property with its photos (public)', description: 'PUBLISHED or RENTED listings only.' })
  @ApiOkResponse({ type: PropertyEntity })
  @ApiNotFoundResponse({ description: 'No such property, or it is not public', type: ErrorResponse })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.properties.findPublic(id);
  }

  @Patch(':id')
  @Protected()
  @ApiOperation({ summary: 'Update a property', description: "Only the property's owner (its creator)." })
  @ApiOkResponse({ type: PropertyEntity })
  @ApiNotFoundResponse({ description: 'No such property', type: ErrorResponse })
  update(@CurrentUser() user: User, @Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdatePropertyDto) {
    return this.properties.update(user, id, dto);
  }

  @Post(':id/photos')
  @Protected()
  @ApiOperation({
    summary: 'Record an uploaded photo',
    description:
      "Only the property's owner. Upload first with a SAS URL from POST /uploads/sas-token (target property-photos), " +
      'then send its blobUrl here. The stored file is checked (image type, max 10 MB) and deleted if invalid.',
  })
  @ApiCreatedResponse({ type: PropertyPhotoEntity })
  @ApiNotFoundResponse({ description: 'No such property', type: ErrorResponse })
  @ApiConflictResponse({ description: 'Photo already recorded', type: ErrorResponse })
  addPhoto(@CurrentUser() user: User, @Param('id', ParseUUIDPipe) id: string, @Body() dto: AddPhotoDto) {
    return this.properties.addPhoto(user, id, dto.blobUrl);
  }
}
