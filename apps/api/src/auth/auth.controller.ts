import { BadRequestException, Controller, Get, Query, UseGuards } from '@nestjs/common';
import { User, UserRole } from '../../generated/prisma/client';
import { UsersService } from '../users/users.service';
import { AuthGuard } from './auth.guard';
import { CurrentIdentity } from './current-identity.decorator';
import type { EntraIdentity } from './entra-identity';

@Controller('auth')
export class AuthController {
  constructor(private readonly users: UsersService) {}

  /**
   * The signed-in user's database record, created on first sign-in.
   * `role` (OWNER | BROKER | TENANT) is the role picked at sign-up; it is only used when creating the record.
   */
  @Get('me')
  @UseGuards(AuthGuard)
  me(@CurrentIdentity() identity: EntraIdentity, @Query('role') role?: string): Promise<User> {
    if (role !== undefined && !Object.values(UserRole).includes(role as UserRole)) {
      throw new BadRequestException(`role must be one of ${Object.values(UserRole).join(', ')}`);
    }
    return this.users.findOrCreateByEntraId(identity, role as UserRole | undefined);
  }
}
