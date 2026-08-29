"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShieldCheck, ChevronDown, User2 } from "lucide-react";
import AuthModal from "./AuthModal";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { href: "/rent", label: "Rent" },
  { href: "/buy", label: "Buy" },
  { href: "/pg-coliving", label: "PG / Co-living" },
  { href: "/commercial", label: "Commercial" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-black/10">
      <div className="container-page flex items-center h-16 gap-4">
        <Link href="/" className="flex items-center gap-1.5 shrink-0">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-500 text-white">
            <ShieldCheck size={18} strokeWidth={2.5} />
          </span>
          <span className="font-bold text-lg text-primary-700 tracking-tight">
            Bharosa<span className="text-accent-500">Ghar</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 ml-4">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  active
                    ? "text-primary-700 bg-primary-50"
                    : "text-black/65 hover:text-primary-600 hover:bg-black/5"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto hidden lg:flex items-center gap-2">
          <Link
            href="/for-brokers"
            className="px-3 py-2 rounded-md text-sm font-medium text-black/65 hover:text-primary-600 hover:bg-black/5"
          >
            For Brokers
          </Link>
          <Link
            href="/post-property"
            className="px-4 py-2 rounded-md text-sm font-semibold bg-accent-500 hover:bg-accent-600 text-white transition-colors"
          >
            Post Property FREE
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-primary-700 hover:bg-black/5"
              >
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 text-primary-700">
                  <User2 size={13} />
                </span>
                {user.name.split(" ")[0]}
                <ChevronDown size={14} />
              </button>
              {userMenuOpen && (
                <div
                  className="absolute right-0 mt-1 w-48 rounded-lg border border-black/10 bg-white shadow-lg py-1 text-sm"
                  onMouseLeave={() => setUserMenuOpen(false)}
                >
                  <p className="px-3 py-1.5 text-xs text-black/40 capitalize">
                    Signed in as {user.role}
                  </p>
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 hover:bg-black/5 text-black/75"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-black/5 text-black/75"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setAuthOpen(true)}
              className="px-3 py-2 rounded-md text-sm font-medium text-primary-700 border border-primary-200 hover:bg-primary-50 transition-colors"
            >
              Login / Signup
            </button>
          )}
        </div>

        <button
          className="ml-auto lg:hidden p-2 text-black/70"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-black/10 bg-white px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-2 py-2.5 rounded-md text-sm font-medium text-black/70 hover:bg-black/5"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/for-brokers"
            onClick={() => setMobileOpen(false)}
            className="block px-2 py-2.5 rounded-md text-sm font-medium text-black/70 hover:bg-black/5"
          >
            For Brokers
          </Link>
          <Link
            href="/post-property"
            onClick={() => setMobileOpen(false)}
            className="block px-2 py-2.5 rounded-md text-sm font-semibold bg-accent-500 text-white text-center mt-2"
          >
            Post Property FREE
          </Link>
          {user ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="block px-2 py-2.5 rounded-md text-sm font-medium text-primary-700 border border-primary-200 text-center mt-2"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="w-full px-2 py-2.5 rounded-md text-sm font-medium text-black/60 text-center"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setAuthOpen(true);
                setMobileOpen(false);
              }}
              className="w-full px-2 py-2.5 rounded-md text-sm font-medium text-primary-700 border border-primary-200 text-center mt-2"
            >
              Login / Signup
            </button>
          )}
        </div>
      )}

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </header>
  );
}
