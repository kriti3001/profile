"use client";

import { useAuth } from "@/context/AuthContext";

export default function AccountPage() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div>
      <h1 className="text-xl font-bold text-primary-800">Account</h1>
      <p className="text-sm text-black/50 mt-1">Your BharosaGhar profile details.</p>

      <div className="mt-6 max-w-md rounded-xl border border-black/10 p-5 space-y-4">
        <div>
          <label className="text-xs font-medium text-black/50">Full Name</label>
          <input
            readOnly
            value={user.name}
            className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm bg-black/[0.02]"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-black/50">Mobile Number</label>
          <input
            readOnly
            value={user.phone}
            className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm bg-black/[0.02]"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-black/50">Account Type</label>
          <input
            readOnly
            value={user.role === "broker" ? "Broker / Agent" : "Property Owner"}
            className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm bg-black/[0.02] capitalize"
          />
        </div>
        <p className="text-xs text-black/35">
          Profile editing isn&apos;t available yet.
        </p>
      </div>
    </div>
  );
}
