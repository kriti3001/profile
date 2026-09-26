import type { Request } from 'express';

/** The caller's identity, taken from a validated Entra External ID access token. */
export interface EntraIdentity {
  /** Entra object ID (`oid` claim); stored as User.entraObjectId. */
  oid: string;
  email: string | null;
  name: string | null;
}

export interface AuthenticatedRequest extends Request {
  auth: EntraIdentity;
}
