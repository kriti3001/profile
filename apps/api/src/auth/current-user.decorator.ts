import { createParamDecorator, ExecutionContext, ForbiddenException } from '@nestjs/common';
import type { User } from '../../generated/prisma/client';
import { NO_ACCOUNT_MESSAGE } from './auth.guard';
import type { AuthenticatedRequest } from './entra-identity';

/** The caller's User record. Only use on @Protected() routes; rejects callers who have no account yet. */
export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): User => {
  const user = ctx.switchToHttp().getRequest<AuthenticatedRequest>().user;
  if (!user) throw new ForbiddenException(NO_ACCOUNT_MESSAGE);
  return user;
});
