import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AuthenticatedRequest, EntraIdentity } from './entra-identity';

/** The identity attached by AuthGuard. Only use on routes protected by AuthGuard. */
export const CurrentIdentity = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): EntraIdentity => ctx.switchToHttp().getRequest<AuthenticatedRequest>().auth,
);
