import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { User } from '../../generated/prisma/client';
import { CurrentIdentity } from '../auth/current-identity.decorator';
import type { EntraIdentity } from '../auth/entra-identity';
import { Protected } from '../auth/protected.decorator';
import { MeQueryDto } from './me-query.dto';
import { UserEntity } from './user.entity';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller()
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('users/me')
  @Protected()
  @ApiOperation({
    summary: 'Get the signed-in user',
    description: 'Returns the caller\'s User record (including role), creating it on first sign-in.',
  })
  @ApiOkResponse({ type: UserEntity })
  me(@CurrentIdentity() identity: EntraIdentity, @Query() query: MeQueryDto): Promise<User> {
    return this.users.findOrCreateByEntraId(identity, query.role);
  }

  // The frontend (apps/web AuthContext) still calls /auth/me; switch it to /users/me in Step 8, then remove this.
  @Get('auth/me')
  @Protected()
  @ApiOperation({ summary: 'Deprecated alias of GET /users/me', deprecated: true })
  @ApiOkResponse({ type: UserEntity })
  legacyMe(@CurrentIdentity() identity: EntraIdentity, @Query() query: MeQueryDto): Promise<User> {
    return this.users.findOrCreateByEntraId(identity, query.role);
  }
}
