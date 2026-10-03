"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, Phone } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/lib/format";
import { loadMyListings, SOURCE_LABELS } from "@/lib/dashboardData";
import { propertyHref } from "@/lib/propertyLabels";

const sourceColors = {
  NINETY_NINE_ACRES: "bg-[#7a1f2b]/10 text-[#7a1f2b]",
  MAGICBRICKS: "bg-[#e2231a]/10 text-[#e2231a]",
  HOUSING_COM: "bg-[#00a3a3]/10 text-[#00a3a3]",
  NOBROKER: "bg-[#6c3fc5]/10 text-[#6c3fc5]",
  DIRECT: "bg-primary-50 text-primary-700",
};

// Every enquiry across the user's listings, newest first.
export default function LeadsInboxClient() {
  const { getAccessToken } = useAuth();
  const [state, setState] = useState({ status: "loading", leads: [] });
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    loadMyListings(getAccessToken, { signal: controller.signal })
      .then((items) => {
        const leads = items
          .flatMap(({ property, enquiries }) => enquiries.map((e) => ({ ...e, property })))
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        setState({ status: "ready", leads });
      })
      .catch((err) => {
        if (err.name !== "AbortError") setState({ status: "error", leads: [], message: err.message });
      });
    return () => controller.abort();
  }, [getAccessToken, retry]);

  return (
    <div>
      <h1 className="text-xl font-bold text-primary-800">Leads Inbox</h1>
      <p className="text-sm text-black/50 mt-1">Every enquiry on your listings, newest first.</p>

      {state.status === "loading" && (
        <div className="mt-6 space-y-3" aria-busy="true">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-24 rounded-xl border border-black/10 bg-black/[0.03] animate-pulse" />
          ))}
        </div>
      )}

      {state.status === "error" && (
        <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-8 text-center">
          <AlertCircle size={28} className="mx-auto text-red-500" />
          <p className="mt-2 text-sm font-medium text-red-700">Couldn&apos;t load your leads</p>
          <p className="mt-1 text-xs text-red-600/80">{state.message}</p>
          <button
            onClick={() => {
              setState({ status: "loading", leads: [] });
              setRetry((n) => n + 1);
            }}
            className="mt-4 rounded-lg bg-white border border-red-200 text-red-700 text-sm font-medium px-4 py-1.5 hover:bg-red-100"
          >
            Try again
          </button>
        </div>
      )}

      {state.status === "ready" && state.leads.length === 0 && (
        <div className="mt-6 text-center py-16 text-sm text-black/45 border border-dashed border-black/15 rounded-xl">
          No enquiries yet. They&apos;ll appear here as soon as someone contacts you about a listing.
        </div>
      )}

      {state.status === "ready" && state.leads.length > 0 && (
        <div className="mt-6 space-y-3">
          {state.leads.map((lead) => (
            <div key={lead.id} className="rounded-xl border border-black/10 p-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <p className="font-medium text-primary-900">{lead.tenantName}</p>
                  <p className="text-xs text-black/50 mt-0.5">
                    Re:{" "}
                    {lead.property.status === "PUBLISHED" || lead.property.status === "RENTED" ? (
                      <Link href={propertyHref(lead.property.id)} className="hover:text-primary-600 underline-offset-2 hover:underline">
                        {lead.property.title}
                      </Link>
                    ) : (
                      lead.property.title
                    )}
                  </p>
                </div>
                <span className={`text-[11px] font-medium rounded-full px-2 py-0.5 ${sourceColors[lead.source] || "bg-black/5 text-black/60"}`}>
                  via {SOURCE_LABELS[lead.source] ?? lead.source}
                </span>
              </div>
              {lead.message && <p className="mt-2.5 text-sm text-black/65 whitespace-pre-line">{lead.message}</p>}
              <div className="mt-3 flex items-center justify-between text-xs text-black/40">
                <span className="flex items-center gap-1">
                  <Phone size={12} /> {lead.tenantContact}
                </span>
                <span>{formatDate(lead.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
