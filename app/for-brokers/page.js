import Link from "next/link";
import { Layers, RefreshCw, Inbox, ShieldCheck } from "lucide-react";
import PricingTable from "@/components/PricingTable";

export const metadata = { title: "For Brokers | BharosaGhar" };

const pitches = [
  {
    icon: Layers,
    title: "Bulk listing management",
    body: "Upload and manage dozens of listings at once, with shared templates for repeat property types.",
  },
  {
    icon: RefreshCw,
    title: "Sync across every portal",
    body: "Update a price or availability once, and it propagates to 99acres, MagicBricks, Housing.com and NoBroker automatically.",
  },
  {
    icon: Inbox,
    title: "One unified leads dashboard",
    body: "Stop checking four different inboxes. Every enquiry, tagged by source, lands in a single dashboard.",
  },
];

export default function ForBrokersPage() {
  return (
    <div>
      <section className="bg-primary-900 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-25"
          style={{ backgroundImage: "linear-gradient(120deg, hsl(172 55% 30%), hsl(20 70% 45%))" }}
        />
        <div className="relative container-page py-16 sm:py-20 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 text-white text-xs font-medium px-3 py-1 border border-white/15">
            <ShieldCheck size={13} /> Built for brokers, not against them
          </span>
          <h1 className="mt-5 text-3xl sm:text-4xl font-bold text-white max-w-xl mx-auto">
            Manage every listing, lead and portal from one place
          </h1>
          <p className="mt-4 text-white/70 max-w-lg mx-auto text-sm sm:text-base">
            BharosaGhar gives brokers the bulk tools and cross-portal reach of an enterprise platform, without the enterprise price tag.
          </p>
          <Link
            href="/post-property"
            className="mt-7 inline-flex items-center rounded-lg bg-accent-500 hover:bg-accent-600 text-white text-sm font-semibold px-6 py-3"
          >
            List Your First Property Free
          </Link>
        </div>
      </section>

      <section className="container-page py-14 sm:py-20">
        <div className="grid sm:grid-cols-3 gap-5">
          {pitches.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-black/10 p-6">
              <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary-50 text-primary-600">
                <Icon size={22} />
              </span>
              <h3 className="mt-4 font-semibold text-primary-800">{title}</h3>
              <p className="mt-2 text-sm text-black/55 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-black/[0.02] py-14 sm:py-20">
        <div className="container-page">
          <div className="text-center max-w-lg mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-800">Simple, transparent pricing</h2>
            <p className="mt-2 text-sm text-black/55">Start free, upgrade as your listing volume grows.</p>
          </div>
          <div className="mt-10">
            <PricingTable />
          </div>
        </div>
      </section>
    </div>
  );
}
