import Link from "next/link";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { portals } from "@/data/portals";

export default function Confirmation({ data }) {
  const activePortals = portals.filter((p) => data.portals[p.id]);

  return (
    <div className="text-center max-w-lg mx-auto">
      <CheckCircle2 size={56} className="mx-auto text-emerald-500" />
      <h2 className="mt-4 text-2xl font-bold text-primary-800">Your listing is live!</h2>
      <p className="mt-2 text-sm text-black/55">
        Your listing is now visible on {activePortals.length} platform{activePortals.length === 1 ? "" : "s"},
        including BharosaGhar direct.
      </p>

      <div className="mt-8 rounded-2xl border border-black/10 overflow-hidden text-left">
        <div className="bg-primary-50 px-5 py-3 flex items-center gap-2">
          <ShieldCheck size={16} className="text-primary-600" />
          <span className="text-sm font-medium text-primary-800">Sync Status</span>
        </div>
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-t border-black/5">
              <td className="px-5 py-3 text-black/70">BharosaGhar (direct)</td>
              <td className="px-5 py-3 text-right">
                <span className="inline-flex items-center gap-1 text-emerald-600 font-medium text-xs">
                  <CheckCircle2 size={13} /> Live
                </span>
              </td>
            </tr>
            {activePortals.map((p) => (
              <tr key={p.id} className="border-t border-black/5">
                <td className="px-5 py-3 text-black/70">{p.name}</td>
                <td className="px-5 py-3 text-right">
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-medium text-xs">
                    <CheckCircle2 size={13} /> Synced
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.generateAgreement && (
        <p className="mt-4 text-xs text-primary-600 bg-primary-50 rounded-lg py-2.5 px-4">
          A rental agreement draft will be ready in your dashboard once a tenant is confirmed.
        </p>
      )}

      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/dashboard"
          className="rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-6 py-2.5"
        >
          Go to Dashboard
        </Link>
        <Link
          href="/"
          className="rounded-lg border border-black/15 text-black/65 text-sm font-medium px-6 py-2.5 hover:bg-black/5"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
