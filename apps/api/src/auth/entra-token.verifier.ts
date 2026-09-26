import { Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';
import type { EntraIdentity } from './entra-identity';

// Delegated scope the SPA requests for this API (exposed on the app registration as api://<client-id>/access_as_user).
const REQUIRED_SCOPE = 'access_as_user';

interface VerifierConfig {
  jwks: JwksClient;
  issuers: [string, ...string[]];
  audiences: [string, ...string[]];
}

/**
 * Validates access tokens issued by a Microsoft Entra External ID (CIAM) tenant.
 * Signing keys and the issuer come from the tenant's OpenID discovery document on
 * <subdomain>.ciamlogin.com (not login.microsoftonline.com, which serves workforce tenants).
 */
@Injectable()
export class EntraTokenVerifier {
  private readonly logger = new Logger(EntraTokenVerifier.name);
  private configPromise?: Promise<VerifierConfig>;

  constructor(private readonly config: ConfigService) {}

  async verify(token: string): Promise<EntraIdentity> {
    const { jwks, issuers, audiences } = await this.getConfig();

    const decoded = jwt.decode(token, { complete: true });
    const kid = decoded?.header.kid;
    if (!kid) throw new UnauthorizedException('Malformed token');

    let payload: JwtPayload;
    try {
      const key = await jwks.getSigningKey(kid);
      payload = jwt.verify(token, key.getPublicKey(), {
        algorithms: ['RS256'],
        issuer: issuers,
        audience: audiences,
      }) as JwtPayload;
    } catch (err) {
      this.logger.debug(`Token rejected: ${err instanceof Error ? err.message : String(err)}`);
      throw new UnauthorizedException('Invalid or expired token');
    }

    const scopes = typeof payload.scp === 'string' ? payload.scp.split(' ') : [];
    if (!scopes.includes(REQUIRED_SCOPE)) {
      throw new UnauthorizedException(`Token is missing the "${REQUIRED_SCOPE}" scope`);
    }
    if (typeof payload.oid !== 'string') throw new UnauthorizedException('Token has no oid claim');

    return {
      oid: payload.oid,
      email: pickEmail(payload),
      name: typeof payload.name === 'string' && payload.name.trim() ? payload.name.trim() : null,
    };
  }

  private getConfig(): Promise<VerifierConfig> {
    this.configPromise ??= this.loadConfig().catch((err: unknown) => {
      this.configPromise = undefined; // retry discovery on the next request
      throw err;
    });
    return this.configPromise;
  }

  private async loadConfig(): Promise<VerifierConfig> {
    const tenantId = this.config.get<string>('ENTRA_TENANT_ID');
    const clientId = this.config.get<string>('ENTRA_CLIENT_ID');
    const primaryDomain = this.config.get<string>('ENTRA_PRIMARY_DOMAIN');
    if (!tenantId || !clientId || !primaryDomain) {
      throw new InternalServerErrorException(
        'Auth is not configured: set ENTRA_TENANT_ID, ENTRA_CLIENT_ID and ENTRA_PRIMARY_DOMAIN in apps/api/.env',
      );
    }

    // "yourtenant.onmicrosoft.com" -> "yourtenant"
    const subdomain = primaryDomain.split('.')[0];
    const discoveryUrl = `https://${subdomain}.ciamlogin.com/${tenantId}/v2.0/.well-known/openid-configuration`;
    const res = await fetch(discoveryUrl);
    if (!res.ok) {
      this.logger.error(`OpenID discovery failed (${res.status}) for ${discoveryUrl}`);
      throw new InternalServerErrorException('Could not load Entra signing keys');
    }
    const discovery = (await res.json()) as { issuer: string; jwks_uri: string };

    return {
      jwks: new JwksClient({ jwksUri: discovery.jwks_uri, cache: true, rateLimit: true, jwksRequestsPerMinute: 10 }),
      // v2.0 tokens use the discovery issuer; v1.0 tokens (if the app registration's
      // requestedAccessTokenVersion is not 2) use the sts.windows.net form. Both are tenant-specific.
      issuers: [discovery.issuer, `https://sts.windows.net/${tenantId}/`],
      // v2.0 tokens carry the client ID as audience; v1.0 tokens carry the Application ID URI.
      audiences: [clientId, `api://${clientId}`],
    };
  }
}

function pickEmail(payload: JwtPayload): string | null {
  const candidates: unknown[] = [payload.email, payload.preferred_username, payload.upn];
  const email = candidates.find((c): c is string => typeof c === 'string' && c.includes('@'));
  return email ? email.toLowerCase() : null;
}
