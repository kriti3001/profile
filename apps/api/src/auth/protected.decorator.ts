import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse, ApiOAuth2, ApiUnauthorizedResponse } from '@nestjs/swagger';
import type { UserRole } from '../../generated/prisma/client';
import { ErrorResponse } from '../common/error-response.entity';
import { AuthGuard, ROLES_KEY } from './auth.guard';

// Swagger security scheme names, registered in common/swagger.ts.
export const BEARER_SCHEME = 'bearer';
export const OAUTH_SCHEME = 'entra';

/**
 * Marks a route as requiring a signed-in user (and, if given, one of `roles`).
 * Documents it in Swagger as accepting either a pasted bearer token or Entra sign-in.
 */
export function Protected(...roles: UserRole[]) {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(AuthGuard),
    ApiBearerAuth(BEARER_SCHEME),
    ApiOAuth2([], OAUTH_SCHEME),
    ApiUnauthorizedResponse({ description: 'Missing, invalid or expired access token', type: ErrorResponse }),
    ApiForbiddenResponse({
      description: roles.length
        ? `Caller has no account yet, or their role is not one of: ${roles.join(', ')}`
        : 'Caller is not allowed to perform this action',
      type: ErrorResponse,
    }),
  );
}
