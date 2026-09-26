import { Body, Controller, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { User } from '../../generated/prisma/client';
import { CurrentUser } from '../auth/current-user.decorator';
import { Protected } from '../auth/protected.decorator';
import { ErrorResponse } from '../common/error-response.entity';
import { AddDocumentDto } from './add-document.dto';
import { VerificationDocumentEntity } from './verification-document.entity';
import { VerificationService } from './verification.service';

@ApiTags('verification')
@Controller('verification')
export class VerificationController {
  constructor(private readonly verification: VerificationService) {}

  @Post('documents')
  @Protected()
  @ApiOperation({
    summary: 'Record an uploaded verification document',
    description:
      'Upload first with a SAS URL from POST /uploads/sas-token (target verification-docs), then send its blobUrl here. ' +
      'The stored file is checked (image or PDF, max 10 MB) and deleted if invalid. Created with status PENDING.',
  })
  @ApiCreatedResponse({ type: VerificationDocumentEntity })
  @ApiBadRequestResponse({ description: 'Invalid input, or the uploaded file is missing or not allowed', type: ErrorResponse })
  @ApiConflictResponse({ description: 'Document already recorded', type: ErrorResponse })
  addDocument(@CurrentUser() user: User, @Body() dto: AddDocumentDto) {
    return this.verification.addDocument(user, dto.documentType, dto.blobUrl);
  }
}
