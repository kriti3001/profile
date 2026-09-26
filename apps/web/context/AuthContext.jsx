"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  EventType,
  InteractionRequiredAuthError,
  InteractionStatus,
  PublicClientApplication,
} from "@azure/msal-browser";
import { MsalProvider, useMsal } from "@azure/msal-react";
import { API_BASE_URL, apiScopes, authConfigured, msalConfig } from "@/lib/authConfig";

// Real auth via Microsoft Entra External ID (MSAL). The context keeps the shape the
// mock version exposed — { user, ready, login, logout } with user = { name, role, phone } —
// so Navbar, DashboardShell and the account page work unchanged. `user` is the app's own
// User record from GET /auth/me, with role lowercased ("owner" | "broker" | "tenant").
const AuthContext = createContext(null);

// Role picked in the sign-up modal, held across the Entra redirect and sent on the first
// /auth/me call (the API only applies it when it creates the user record).
const PENDING_ROLE_KEY = "bharosaghar_pending_role";

export function AuthProvider({ children }) {
  // MSAL is browser-only: during static prerendering there is no instance.
  const [instance] = useState(() => {
    if (typeof window === "undefined" || !authConfigured) return null;
    const pca = new PublicClientApplication(msalConfig);
    pca.addEventCallback((event) => {
      if (event.eventType === EventType.LOGIN_SUCCESS && event.payload?.account) {
        pca.setActiveAccount(event.payload.account);
      }
    });
    return pca;
  });

  if (!instance) return <SignedOutAuth>{children}</SignedOutAuth>;
  return (
    <MsalProvider instance={instance}>
      <MsalAuth>{children}</MsalAuth>
    </MsalProvider>
  );
}

// Used while prerendering (ready=false, so nothing auth-dependent flashes before hydration)
// and when sign-in isn't configured (ready=true, signed out).
function SignedOutAuth({ children }) {
  const value = {
    user: null,
    ready: !authConfigured,
    error: authConfigured ? null : "Sign-in isn't configured for this build.",
    login: () => {},
    logout: () => {},
    getAccessToken: async () => {
      throw new Error("Not signed in");
    },
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function MsalAuth({ children }) {
  const { instance, accounts, inProgress } = useMsal();
  const account = instance.getActiveAccount() ?? accounts[0] ?? null;
  const accountId = account?.homeAccountId ?? null;
  // Result of GET /auth/me for `accountId`.
  const [me, setMe] = useState({ accountId: null, user: null, error: null });

  const getAccessToken = useCallback(async () => {
    if (!account) throw new Error("Not signed in");
    try {
      const result = await instance.acquireTokenSilent({ scopes: apiScopes, account });
      return result.accessToken;
    } catch (err) {
      if (err instanceof InteractionRequiredAuthError) {
        await instance.acquireTokenRedirect({ scopes: apiScopes, account });
      }
      throw err;
    }
  }, [instance, account]);

  useEffect(() => {
    if (inProgress !== InteractionStatus.None || !accountId) return;
    let cancelled = false;

    (async () => {
      try {
        const token = await getAccessToken();
        const url = new URL("/auth/me", API_BASE_URL);
        const pendingRole = readSession(PENDING_ROLE_KEY);
        if (pendingRole) url.searchParams.set("role", pendingRole);

        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.message || `GET /auth/me failed (${res.status})`);
        }
        const dbUser = await res.json();
        removeSession(PENDING_ROLE_KEY);
        if (!cancelled) setMe({ accountId, user: toAppUser(dbUser), error: null });
      } catch (err) {
        if (!cancelled) setMe({ accountId, user: null, error: err.message || "Sign-in failed" });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [inProgress, accountId, getAccessToken]);

  const login = useCallback(
    ({ role } = {}) => {
      if (role) writeSession(PENDING_ROLE_KEY, role.toUpperCase());
      instance.loginRedirect({ scopes: apiScopes }).catch(() => {});
    },
    [instance],
  );

  const logout = useCallback(() => {
    removeSession(PENDING_ROLE_KEY);
    instance.logoutRedirect({ account }).catch(() => {});
  }, [instance, account]);

  const settled = me.accountId === accountId;
  const value = {
    user: accountId && settled ? me.user : null,
    ready: inProgress === InteractionStatus.None && (!accountId || settled),
    error: accountId && settled ? me.error : null,
    login,
    logout,
    getAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function toAppUser(dbUser) {
  return {
    id: dbUser.id,
    email: dbUser.email,
    name: dbUser.name,
    phone: dbUser.phone ?? "",
    role: dbUser.role.toLowerCase(),
  };
}

function readSession(key) {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeSession(key, value) {
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

function removeSession(key) {
  try {
    window.sessionStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
