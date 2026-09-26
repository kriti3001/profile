import type { Request } from 'express';
import type { User } from '../../generated/prisma/client';

/** The caller's identity, taken from a validated Entra External ID access token. */
export interface EntraIdentity {
  /** Entra object ID (`oid` claim); stored as User.entraObjectId. */
  oid: string;
  email: string | null;
  name: string | null;
}

export interface AuthenticatedRequest extends Request {
  auth: EntraIdentity;
  /** The caller's User record, or null if they haven't called GET /users/me yet to create it. */
  user: User | null;
}
