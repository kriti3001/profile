"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Mock-only auth. No real backend, no real sessions — just localStorage
// so the demo "remembers" the logged-in role across page navigations.
const AuthContext = createContext(null);

const STORAGE_KEY = "bharosaghar_mock_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // Reading persisted mock-session state on mount — localStorage is an
      // external system, not derivable from props/state, so this is exempt.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore
    }
    setReady(true);
  }, []);

  const login = ({ name, role, phone }) => {
    const mockUser = {
      name: name || (role === "broker" ? "Rohan Mehta" : "Anjali Sharma"),
      role: role === "broker" ? "broker" : "owner",
      phone: phone || "+91 98765 43210",
    };
    setUser(mockUser);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
    } catch {
      // ignore
    }
  };

  const logout = () => {
    setUser(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider value={{ user, ready, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
