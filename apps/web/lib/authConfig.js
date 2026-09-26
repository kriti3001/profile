// MSAL configuration for Microsoft Entra External ID (public client SPA — no client secret).
// Values come from apps/web/.env.local; see apps/web/.env.example.

const clientId = process.env.NEXT_PUBLIC_ENTRA_CLIENT_ID;
const authority = process.env.NEXT_PUBLIC_ENTRA_AUTHORITY;
const redirectUri = process.env.NEXT_PUBLIC_ENTRA_REDIRECT_URI;
const apiScope = process.env.NEXT_PUBLIC_ENTRA_API_SCOPE;

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

// Scopes requested at sign-in and for API calls (the backend requires access_as_user).
export const apiScopes = apiScope ? [apiScope] : [];

// When unset (e.g. CI builds of the static site), the app still renders with sign-in disabled.
export const authConfigured = Boolean(clientId && authority && redirectUri && apiScope);

export const msalConfig = authConfigured
  ? {
      auth: {
        clientId,
        authority,
        // External ID authorities (*.ciamlogin.com) must be listed as known authorities.
        knownAuthorities: [new URL(authority).host],
        redirectUri,
        postLogoutRedirectUri: redirectUri,
      },
      // localStorage keeps users signed in across tabs, like the previous mock login did.
      cache: { cacheLocation: "localStorage" },
    }
  : null;
