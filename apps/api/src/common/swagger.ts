import type { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BEARER_SCHEME, OAUTH_SCHEME } from '../auth/protected.decorator';

export const SWAGGER_PATH = 'docs';

/**
 * Serves Swagger UI at /docs. Its Authorize dialog offers two ways to call protected routes:
 *  - "entra": sign in with Entra External ID directly from Swagger (authorization code + PKCE).
 *    Requires http://localhost:<port>/docs/oauth2-redirect.html as a Single-page application
 *    redirect URI on the app registration.
 *  - "bearer": paste an access token obtained elsewhere.
 */
export function setupSwagger(app: INestApplication) {
  const config = app.get(ConfigService);
  const tenantId = config.get<string>('ENTRA_TENANT_ID');
  const clientId = config.get<string>('ENTRA_CLIENT_ID');
  const subdomain = config.get<string>('ENTRA_PRIMARY_DOMAIN')?.split('.')[0];
  const entraBase =
    tenantId && subdomain ? `https://${subdomain}.ciamlogin.com/${tenantId}/oauth2/v2.0` : 'https://entra-not-configured.invalid';
  const apiScope = `api://${clientId ?? 'CLIENT_ID'}/access_as_user`;

  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('BharosaGhar API')
      .setDescription('Properties, enquiries and users. Protected routes need an Entra External ID access token.')
      .setVersion('0.1.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', description: 'Paste an Entra External ID access token' },
        BEARER_SCHEME,
      )
      .addOAuth2(
        {
          type: 'oauth2',
          description: 'Sign in with Entra External ID (leave client_secret empty)',
          flows: {
            authorizationCode: {
              authorizationUrl: `${entraBase}/authorize`,
              tokenUrl: `${entraBase}/token`,
              scopes: { [apiScope]: 'Call the BharosaGhar API as the signed-in user' },
            },
          },
        },
        OAUTH_SCHEME,
      )
      .build(),
  );

  SwaggerModule.setup(SWAGGER_PATH, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      initOAuth: clientId ? { clientId, usePkceWithAuthorizationCodeGrant: true, scopes: [apiScope] } : undefined,
    },
  });
}
