"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, MessageCircle, Pencil, Phone, Plus, Send, Trash2, Undo2 } from "lucide-react";
import PropertyImage from "../PropertyImage";
import VerifiedBadge from "../VerifiedBadge";
import EditListingModal from "./EditListingModal";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/format";
import { loadMyListings, SOURCE_LABELS } from "@/lib/dashboardData";
import { propertyHref, toViewProperty } from "@/lib/propertyLabels";

const sourceColors = {
  NINETY_NINE_ACRES: "bg-[#7a1f2b]/10 text-[#7a1f2b]",
  MAGICBRICKS: "bg-[#e2231a]/10 text-[#e2231a]",
  HOUSING_COM: "bg-[#00a3a3]/10 text-[#00a3a3]",
  NOBROKER: "bg-[#6c3fc5]/10 text-[#6c3fc5]",
  DIRECT: "bg-primary-50 text-primary-700",
};

const statusChip = {
  DRAFT: ["Draft", "bg-amber-50 text-amber-700"],
  PUBLISHED: ["Live", "bg-emerald-50 text-emerald-700"],
  RENTED: ["Rented", "bg-black/10 text-black/60"],
  ARCHIVED: ["Archived", "bg-black/5 text-black/45"],
};

// My Listings: GET /properties/mine (+ each listing's enquiries); status changes and edits use PATCH.
export default function MyListingsClient() {
  const { getAccessToken } = useAuth();
  const [state, setState] = useState({ status: "loading", items: [] });
  const [retry, setRetry] = useState(0);
  const [busyId, setBusyId] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    loadMyListings(getAccessToken, { signal: controller.signal })
      .then((items) => setState({ status: "ready", items }))
      .catch((err) => {
        if (err.name !== "AbortError") setState({ status: "error", items: [], message: err.message });
      });
    return () => controller.abort();
  }, [getAccessToken, retry]);

  const replaceProperty = (updated) =>
    setState((s) => ({
      ...s,
      items: s.items.map((it) => (it.property.id === updated.id ? { ...it, property: toViewProperty(updated) } : it)),
    }));

  const setStatus = async (property, status) => {
    setBusyId(property.id);
    setActionError(null);
    try {
      const token = await getAccessToken();
      replaceProperty(await apiFetch(`/properties/${property.id}`, { method: "PATCH", token, body: { status } }));
    } catch (err) {
      setActionError({ id: property.id, message: err.message });
    } finally {
      setBusyId(null);
    }
  };

  if (state.status === "loading") {
    return (
      <div aria-busy="true">
        <h1 className="text-xl font-bold text-primary-800">My Listings</h1>
        <div className="mt-6 space-y-3">
          {[0, 1].map((i) => (
            <div key={i} className="h-36 rounded-xl border border-black/10 bg-black/[0.03] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }
  if (state.status === "error") {
    return (
      <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-5 py-8 text-center">
        <AlertCircle size={28} className="mx-auto text-red-500" />
        <p className="mt-2 text-sm font-medium text-red-700">Couldn&apos;t load your listings</p>
        <p className="mt-1 text-xs text-red-600/80">{state.message}</p>
        <button
          onClick={() => {
            setState({ status: "loading", items: [] });
            setRetry((n) => n + 1);
          }}
          className="mt-4 rounded-lg bg-white border border-red-200 text-red-700 text-sm font-medium px-4 py-1.5 hover:bg-red-100"
        >
          Try again
        </button>
      </div>
    );
  }

  const listings = state.items;
  return (
    <div>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-primary-800">My Listings</h1>
          <p className="text-sm text-black/50 mt-1">
            {listings.length} propert{listings.length === 1 ? "y" : "ies"} posted
          </p>
        </div>
        <Link
          href="/post-property"
          className="flex items-center gap-1.5 rounded-lg bg-accent-500 hover:bg-accent-600 text-white text-sm font-semibold px-4 py-2.5"
        >
          <Plus size={16} /> Post New Property
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {listings.map(({ property: p, enquiries }) => {
          const [chipLabel, chipClass] = statusChip[p.status] ?? [p.status, "bg-black/5 text-black/50"];
          const busy = busyId === p.id;
          const isPublic = p.status === "PUBLISHED" || p.status === "RENTED";
          return (
            <div key={p.id} className="rounded-xl border border-black/10 p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <PropertyImage src={p.photoUrls[0]} seed={p.id} label={p.title} className="h-28 sm:w-40 rounded-lg shrink-0" iconSize={16} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {isPublic ? (
                      <Link href={propertyHref(p.id)} className="font-medium text-primary-900 hover:text-primary-600 line-clamp-1">
                        {p.title}
                      </Link>
                    ) : (
                      <span className="font-medium text-primary-900 line-clamp-1">{p.title}</span>
                    )}
                    {p.verified && <VerifiedBadge />}
                    <span className={`text-[11px] font-medium rounded-full px-2 py-0.5 ${chipClass}`}>{chipLabel}</span>
                  </div>
                  <p className="text-xs text-black/50 mt-1">{p.locality}, {p.city}</p>
                  <p className="mt-1.5 text-sm font-semibold text-primary-700">{formatPrice(p.price, p.category)}</p>
                  <p className="mt-1 text-xs text-black/40">
                    {p.photoUrls.length} photo{p.photoUrls.length === 1 ? "" : "s"} · Posted {formatDate(p.createdAt)}
                  </p>
                  {actionError?.id === p.id && (
                    <p role="alert" className="mt-2 text-xs text-red-600">{actionError.message}</p>
                  )}
                </div>
                <div className="flex sm:flex-col gap-2 sm:items-end justify-start shrink-0 flex-wrap">
                  {p.status === "PUBLISHED" && (
                    <ActionButton onClick={() => setStatus(p, "RENTED")} disabled={busy} className="border-emerald-200 text-emerald-700 bg-emerald-50">
                      <CheckCircle2 size={13} /> {busy ? "Saving…" : "Mark as Rented"}
                    </ActionButton>
                  )}
                  {p.status === "RENTED" && (
                    <ActionButton onClick={() => setStatus(p, "PUBLISHED")} disabled={busy} className="border-black/15 text-black/60">
                      <Undo2 size={13} /> {busy ? "Saving…" : "Mark Available"}
                    </ActionButton>
                  )}
                  {p.status === "DRAFT" && (
                    <ActionButton onClick={() => setStatus(p, "PUBLISHED")} disabled={busy} className="border-primary-200 text-primary-700 bg-primary-50">
                      <Send size={13} /> {busy ? "Saving…" : "Publish"}
                    </ActionButton>
                  )}
                  <div className="flex gap-2">
                    <ActionButton onClick={() => setEditing(p)} disabled={busy} className="border-black/15 text-black/60">
                      <Pencil size={12} /> Edit
                    </ActionButton>
                    <ActionButton
                      disabled
                      title="Deleting listings isn't available yet. Mark it as rented to take it off the market."
                      className="border-black/10 text-black/30"
                    >
                      <Trash2 size={12} /> Delete
                    </ActionButton>
                  </div>
                  <span className="text-[10px] text-black/35 sm:text-right">Delete not available yet</span>
                </div>
              </div>

              <div className="mt-4 border-t border-black/5 pt-3">
                <p className="flex items-center gap-1.5 text-xs font-medium text-black/60 mb-2">
                  <MessageCircle size={13} />
                  Interested people
                  {enquiries.length > 0 && (
                    <span className="text-[11px] font-semibold bg-accent-50 text-accent-700 rounded-full px-1.5 py-0.5">
                      {enquiries.length}
                    </span>
                  )}
                </p>

                {enquiries.length === 0 ? (
                  <p className="text-xs text-black/40">No enquiries yet for this listing.</p>
                ) : (
                  <div className="space-y-2">
                    {enquiries.slice(0, 3).map((lead) => (
                      <div
                        key={lead.id}
                        className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 rounded-lg bg-black/[0.02] px-3 py-2 text-xs"
                      >
                        <span className="font-medium text-primary-900 shrink-0">{lead.tenantName}</span>
                        <span className="flex items-center gap-1 text-black/45 shrink-0">
                          <Phone size={11} /> {lead.tenantContact}
                        </span>
                        <span className="text-black/55 line-clamp-1 flex-1">{lead.message}</span>
                        <span className={`shrink-0 text-[10px] font-medium rounded-full px-1.5 py-0.5 ${sourceColors[lead.source] || "bg-black/5 text-black/60"}`}>
                          via {SOURCE_LABELS[lead.source] ?? lead.source}
                        </span>
                        <span className="shrink-0 text-black/35">{formatDate(lead.createdAt)}</span>
                      </div>
                    ))}
                    {enquiries.length > 3 && (
                      <Link href="/dashboard/leads" className="block text-xs font-medium text-primary-600 hover:underline">
                        See all {enquiries.length} in Leads Inbox
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {listings.length === 0 && (
          <div className="text-center py-16 text-sm text-black/45 border border-dashed border-black/15 rounded-xl">
            No listings yet.{" "}
            <Link href="/post-property" className="text-primary-600 font-medium">
              Post your first property
            </Link>
            .
          </div>
        )}
      </div>

      {editing && (
        <EditListingModal
          property={editing}
          onClose={() => setEditing(null)}
          onSaved={(updated) => {
            replaceProperty(updated);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function ActionButton({ children, className = "", ...props }) {
  return (
    <button
      type="button"
      {...props}
      className={`flex items-center gap-1.5 text-xs font-medium rounded-lg px-3 py-1.5 border disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}
