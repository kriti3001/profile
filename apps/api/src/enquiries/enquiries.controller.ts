import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { User } from '../../generated/prisma/client';
import { CurrentUser } from '../auth/current-user.decorator';
import { Protected } from '../auth/protected.decorator';
import { ErrorResponse } from '../common/error-response.entity';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { EnquiriesService } from './enquiries.service';
import { EnquiryEntity } from './enquiry.entity';

@ApiTags('enquiries')
@ApiBadRequestResponse({ description: 'Invalid input', type: ErrorResponse })
@ApiNotFoundResponse({ description: 'No such property', type: ErrorResponse })
@Controller('properties/:id/enquiries')
export class EnquiriesController {
  constructor(private readonly enquiries: EnquiriesService) {}

  @Post()
  @ApiOperation({
    summary: 'Enquire about a property (public)',
    description: 'No account needed. The property must be PUBLISHED or RENTED.',
  })
  @ApiCreatedResponse({ type: EnquiryEntity })
  create(@Param('id', ParseUUIDPipe) propertyId: string, @Body() dto: CreateEnquiryDto) {
    return this.enquiries.create(propertyId, dto);
  }

  @Get()
  @Protected()
  @ApiOperation({ summary: 'List enquiries for a property', description: "Only the property's owner." })
  @ApiOkResponse({ type: [EnquiryEntity] })
  list(@CurrentUser() user: User, @Param('id', ParseUUIDPipe) propertyId: string) {
    return this.enquiries.listForOwner(user, propertyId);
  }
}
