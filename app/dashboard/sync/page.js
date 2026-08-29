import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { properties } from "@/data/properties";
import { portals } from "@/data/portals";

// Deterministic mock sync status per listing/portal (green = live, yellow =
// pending, red = failed). TODO: replace with real portal API status polling.
function statusFor(propertyId, portalId) {
  let hash = 0;
  const str = propertyId + portalId;
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) % 100;
  if (hash < 78) return "live";
  if (hash < 92) return "pending";
  return "failed";
}

const config = {
  live: { icon: CheckCircle2, label: "Live", className: "text-emerald-600 bg-emerald-50" },
  pending: { icon: Clock, label: "Pending", className: "text-amber-600 bg-amber-50" },
  failed: { icon: XCircle, label: "Failed", className: "text-red-600 bg-red-50" },
};

export default function SyncStatusPage() {
  const listings = properties.slice(0, 5);

  return (
    <div>
      <h1 className="text-xl font-bold text-primary-800">Sync Status</h1>
      <p className="text-sm text-black/50 mt-1">
        See at a glance which listings are live on every connected portal.
      </p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-black/10">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="bg-black/[0.02] text-left text-xs text-black/45">
              <th className="px-4 py-3 font-medium">Listing</th>
              {portals.map((p) => (
                <th key={p.id} className="px-4 py-3 font-medium text-center">{p.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {listings.map((listing) => (
              <tr key={listing.id} className="border-t border-black/5">
                <td className="px-4 py-3 text-primary-900 font-medium max-w-[220px] truncate">
                  {listing.title}
                </td>
                {portals.map((p) => {
                  const status = statusFor(listing.id, p.id);
                  const { icon: Icon, label, className } = config[status];
                  return (
                    <td key={p.id} className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${className}`}>
                        <Icon size={12} /> {label}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
