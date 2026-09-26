import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { UserRole } from '../../generated/prisma/client';
import { PrismaService } from '../common/prisma.service';
import type { AuthenticatedRequest } from './entra-identity';
import { EntraTokenVerifier } from './entra-token.verifier';

export const ROLES_KEY = 'roles';
export const NO_ACCOUNT_MESSAGE =
  'No BharosaGhar account exists for this identity yet. Call GET /users/me once to create it.';

/**
 * Requires a valid Entra External ID bearer token. Attaches the caller's identity as
 * `request.auth` and their User record (or null) as `request.user`, and enforces any
 * roles set with @Protected(...roles).
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly verifier: EntraTokenVerifier,
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const [scheme, token] = request.headers.authorization?.split(' ') ?? [];
    if (scheme !== 'Bearer' || !token) throw new UnauthorizedException('Missing bearer token');

    request.auth = await this.verifier.verify(token);
    request.user = await this.prisma.user.findUnique({ where: { entraObjectId: request.auth.oid } });

    const roles = this.reflector.getAllAndOverride<UserRole[] | undefined>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (roles?.length) {
      if (!request.user) throw new ForbiddenException(NO_ACCOUNT_MESSAGE);
      if (!roles.includes(request.user.role)) {
        throw new ForbiddenException(`This action requires one of these roles: ${roles.join(', ')}`);
      }
    }
    return true;
  }
}
