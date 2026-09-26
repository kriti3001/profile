import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import type { AuthenticatedRequest } from './entra-identity';
import { EntraTokenVerifier } from './entra-token.verifier';

/** Requires a valid Entra External ID bearer token; attaches the caller's identity as `request.auth`. */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly verifier: EntraTokenVerifier) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const [scheme, token] = request.headers.authorization?.split(' ') ?? [];
    if (scheme !== 'Bearer' || !token) throw new UnauthorizedException('Missing bearer token');

    request.auth = await this.verifier.verify(token);
    return true;
  }
}
