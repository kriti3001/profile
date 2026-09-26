import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Prisma, User, UserRole } from '../../generated/prisma/client';
import { PrismaService } from '../common/prisma.service';
import type { EntraIdentity } from '../auth/entra-identity';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns the User linked to this Entra identity, creating it on first sign-in.
   * `roleOnCreate` only applies when the record is created; it never changes an existing user's role.
   */
  async findOrCreateByEntraId(identity: EntraIdentity, roleOnCreate: UserRole = UserRole.TENANT): Promise<User> {
    const existing = await this.prisma.user.findUnique({ where: { entraObjectId: identity.oid } });
    if (existing) return existing;

    if (!identity.email) {
      throw new UnauthorizedException(
        'Access token has no email claim. Add the optional "email" claim to the access token in the app registration.',
      );
    }

    try {
      return await this.prisma.user.create({
        data: {
          entraObjectId: identity.oid,
          email: identity.email,
          name: identity.name ?? identity.email.split('@')[0],
          role: roleOnCreate,
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        // A concurrent first request may have created the same user.
        const created = await this.prisma.user.findUnique({ where: { entraObjectId: identity.oid } });
        if (created) return created;
        // Otherwise the email belongs to a user linked to a different Entra identity.
        // Deliberately not auto-linked: that would let one identity take over another's account.
        throw new ConflictException('An account with this email already exists.');
      }
      throw err;
    }
  }
}
