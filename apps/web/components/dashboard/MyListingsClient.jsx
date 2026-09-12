"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, CheckCircle2, Plus, Eye, TrendingUp, Phone, MessageCircle } from "lucide-react";
import PlaceholderImage from "../PlaceholderImage";
import VerifiedBadge from "../VerifiedBadge";
import { formatPrice, formatDate } from "@/lib/format";
import { leads } from "@/data/leads";
import { getViewActivity } from "@/data/activity";

const sourceColors = {
  "99acres": "bg-[#7a1f2b]/10 text-[#7a1f2b]",
  MagicBricks: "bg-[#e2231a]/10 text-[#e2231a]",
  "Housing.com": "bg-[#00a3a3]/10 text-[#00a3a3]",
  NoBroker: "bg-[#6c3fc5]/10 text-[#6c3fc5]",
  "BharosaGhar direct": "bg-primary-50 text-primary-700",
};

function formatHoursAgo(hours) {
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export default function MyListingsClient({ initialListings }) {
  const [listings, setListings] = useState(
    initialListings.map((p) => ({ ...p, rented: false }))
  );

  const remove = (id) => setListings((l) => l.filter((p) => p.id !== id));
  const toggleRented = (id) =>
    setListings((l) => l.map((p) => (p.id === id ? { ...p, rented: !p.rented } : p)));

  return (
    <div>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-primary-800">My Listings</h1>
          <p className="text-sm text-black/50 mt-1">{listings.length} properties posted</p>
        </div>
        <Link
          href="/post-property"
          className="flex items-center gap-1.5 rounded-lg bg-accent-500 hover:bg-accent-600 text-white text-sm font-semibold px-4 py-2.5"
        >
          <Plus size={16} /> Post New Property
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {listings.map((p) => {
          const activity = getViewActivity(p.id);
          const interested = leads.filter((l) => l.propertyId === p.id);

          return (
            <div key={p.id} className="rounded-xl border border-black/10 p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <PlaceholderImage seed={p.images[0]} className="h-28 sm:w-40 rounded-lg shrink-0" iconSize={16} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link href={`/property/${p.id}`} className="font-medium text-primary-900 hover:text-primary-600 line-clamp-1">
                      {p.title}
                    </Link>
                    {p.verified && <VerifiedBadge />}
                    {p.rented && (
                      <span className="text-[11px] font-medium bg-black/10 text-black/60 rounded-full px-2 py-0.5">
                        Rented
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-black/50 mt-1">{p.locality}, {p.city}</p>
                  <p className="mt-1.5 text-sm font-semibold text-primary-700">
                    {formatPrice(p.price, p.category)}
                  </p>

                  <div className="mt-2.5 flex items-center gap-4 text-xs text-black/50">
                    <span className="flex items-center gap-1.5" title="Total profile views">
                      <Eye size={13} className="text-primary-500" />
                      <span className="font-medium text-primary-800">{activity.totalViews}</span> views
                    </span>
                    <span className="flex items-center gap-1.5" title="Views in the last 7 days">
                      <TrendingUp size={13} className="text-emerald-500" />
                      <span className="font-medium text-emerald-700">+{activity.viewsThisWeek}</span> this week
                    </span>
                    <span className="hidden sm:inline text-black/35">
                      Last viewed {formatHoursAgo(activity.lastViewedHoursAgo)}
                    </span>
                  </div>
                </div>
                <div className="flex sm:flex-col gap-2 sm:items-end justify-start shrink-0">
                  <button
                    onClick={() => toggleRented(p.id)}
                    className={`flex items-center gap-1.5 text-xs font-medium rounded-lg px-3 py-1.5 border ${
                      p.rented
                        ? "border-black/15 text-black/50"
                        : "border-emerald-200 text-emerald-700 bg-emerald-50"
                    }`}
                  >
                    <CheckCircle2 size={13} /> {p.rented ? "Mark Available" : "Mark as Rented"}
                  </button>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-1 text-xs font-medium rounded-lg px-3 py-1.5 border border-black/15 text-black/60">
                      <Pencil size={12} /> Edit
                    </button>
                    <button
                      onClick={() => remove(p.id)}
                      className="flex items-center gap-1 text-xs font-medium rounded-lg px-3 py-1.5 border border-red-200 text-red-600"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 border-t border-black/5 pt-3">
                <p className="flex items-center gap-1.5 text-xs font-medium text-black/60 mb-2">
                  <MessageCircle size={13} />
                  Interested people
                  {interested.length > 0 && (
                    <span className="text-[11px] font-semibold bg-accent-50 text-accent-700 rounded-full px-1.5 py-0.5">
                      {interested.length}
                    </span>
                  )}
                </p>

                {interested.length === 0 ? (
                  <p className="text-xs text-black/40">No enquiries yet for this listing.</p>
                ) : (
                  <div className="space-y-2">
                    {interested.map((lead) => (
                      <div
                        key={lead.id}
                        className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 rounded-lg bg-black/[0.02] px-3 py-2 text-xs"
                      >
                        <span className="font-medium text-primary-900 shrink-0">{lead.name}</span>
                        <span className="flex items-center gap-1 text-black/45 shrink-0">
                          <Phone size={11} /> {lead.phone}
                        </span>
                        <span className="text-black/55 line-clamp-1 flex-1">{lead.message}</span>
                        <span className={`shrink-0 text-[10px] font-medium rounded-full px-1.5 py-0.5 ${sourceColors[lead.source] || "bg-black/5 text-black/60"}`}>
                          via {lead.source}
                        </span>
                        <span className="shrink-0 text-black/35">{formatDate(lead.date)}</span>
                      </div>
                    ))}
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
    </div>
  );
}
