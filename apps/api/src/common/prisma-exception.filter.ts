import { ArgumentsHost, Catch, ConflictException, HttpException, NotFoundException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '../../generated/prisma/client';

const byCode: Record<string, () => HttpException> = {
  P2025: () => new NotFoundException('Record not found'),
  P2002: () => new ConflictException('A record with this value already exists'),
  P2003: () => new ConflictException('A related record does not exist or is still in use'),
};

/**
 * Maps known Prisma errors to the same { statusCode, message, error } shape NestJS uses for
 * HttpExceptions. Anything unmapped falls through to Nest's default (a generic 500, no internals leaked).
 */
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    super.catch(byCode[exception.code]?.() ?? exception, host);
  }
}
