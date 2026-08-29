"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ListChecks, Inbox, RefreshCw, UserCog, CreditCard, LogIn } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "../AuthModal";

const navItems = [
  { href: "/dashboard", label: "My Listings", icon: ListChecks },
  { href: "/dashboard/leads", label: "Leads Inbox", icon: Inbox },
  { href: "/dashboard/sync", label: "Sync Status", icon: RefreshCw },
  { href: "/dashboard/account", label: "Account", icon: UserCog },
];

export default function DashboardShell({ children }) {
  const { user, ready } = useAuth();
  const pathname = usePathname();
  const [authOpen, setAuthOpen] = useState(false);

  if (!ready) return null;

  if (!user) {
    return (
      <div className="container-page py-24 text-center">
        <div className="max-w-sm mx-auto">
          <h1 className="text-xl font-semibold text-primary-800">Login to view your Dashboard</h1>
          <p className="mt-2 text-sm text-black/55">
            This is a mock login for the demo — pick Owner or Broker to see the dashboard.
          </p>
          <button
            onClick={() => setAuthOpen(true)}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-5 py-2.5"
          >
            <LogIn size={16} /> Login / Signup
          </button>
        </div>
        <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      </div>
    );
  }

  const items =
    user.role === "broker"
      ? [...navItems, { href: "/dashboard/billing", label: "Plans & Billing", icon: CreditCard }]
      : navItems;

  return (
    <div className="container-page py-8 flex flex-col lg:flex-row gap-8">
      <aside className="lg:w-56 shrink-0">
        <div className="rounded-xl border border-black/10 p-4 mb-4">
          <p className="text-xs text-black/45">Welcome back</p>
          <p className="font-semibold text-primary-800">{user.name}</p>
          <span className="mt-1 inline-block text-[11px] font-medium capitalize bg-primary-50 text-primary-700 rounded-full px-2 py-0.5">
            {user.role}
          </span>
        </div>
        <nav className="flex lg:flex-col gap-1 overflow-x-auto no-scrollbar">
          {items.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2.5 whitespace-nowrap px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active ? "bg-primary-500 text-white" : "text-black/60 hover:bg-black/5"
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
