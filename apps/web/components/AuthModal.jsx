"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// Hands off to the Microsoft Entra External ID sign-up/sign-in page (redirect).
// Name, email and password are collected there; the role picked here is applied
// only when the account is first created.
export default function AuthModal({ open, onClose }) {
  const { login, error } = useAuth();
  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("owner");

  if (!open) return null;

  const submit = (e) => {
    e.preventDefault();
    login({ role });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-2xl bg-white shadow-xl p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black/40 hover:text-black/70"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-semibold text-primary-700">
          {mode === "login" ? "Login to BharosaGhar" : "Create your account"}
        </h2>
        <p className="text-xs text-black/50 mt-1">
          You&apos;ll continue to BharosaGhar&apos;s secure sign-in page to{" "}
          {mode === "login" ? "sign in" : "create your account"} with your email.
        </p>

        <div className="mt-4 flex rounded-lg bg-black/5 p-1 text-sm">
          <button
            className={`flex-1 rounded-md py-1.5 font-medium transition-colors ${
              mode === "login" ? "bg-white shadow-sm text-primary-700" : "text-black/50"
            }`}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 rounded-md py-1.5 font-medium transition-colors ${
              mode === "signup" ? "bg-white shadow-sm text-primary-700" : "text-black/50"
            }`}
            onClick={() => setMode("signup")}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={submit} className="mt-4 space-y-3">
          <div>
            <label className="text-xs font-medium text-black/60">
              I am a...
              {mode === "login" && <span className="text-black/40"> (used if you&apos;re new here)</span>}
            </label>
            <div className="mt-1 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole("owner")}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  role === "owner"
                    ? "border-primary-500 bg-primary-50 text-primary-700"
                    : "border-black/15 text-black/60"
                }`}
              >
                Property Owner
              </button>
              <button
                type="button"
                onClick={() => setRole("broker")}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  role === "broker"
                    ? "border-primary-500 bg-primary-50 text-primary-700"
                    : "border-black/15 text-black/60"
                }`}
              >
                Broker / Agent
              </button>
            </div>
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold py-2.5 transition-colors"
          >
            {mode === "login" ? "Continue to Login" : "Continue to Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
