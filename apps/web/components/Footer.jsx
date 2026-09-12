import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { localities } from "@/data/localities";

const columns = [
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/about", label: "Trust & Safety" },
      { href: "/for-brokers", label: "For Brokers" },
      { href: "/post-property", label: "Post Property" },
    ],
  },
  {
    title: "Explore",
    links: [
      { href: "/rent", label: "Rent" },
      { href: "/buy", label: "Buy" },
      { href: "/pg-coliving", label: "PG / Co-living" },
      { href: "/commercial", label: "Commercial" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/about", label: "Contact Us" },
      { href: "/about", label: "Terms of Service" },
      { href: "/about", label: "Privacy Policy" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-white/80 mt-16">
      <div className="container-page py-12 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-8">
        <div className="col-span-2 lg:col-span-2">
          <div className="flex items-center gap-1.5">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary-500 text-white">
              <ShieldCheck size={16} strokeWidth={2.5} />
            </span>
            <span className="font-bold text-white tracking-tight">
              Bharosa<span className="text-accent-400">Ghar</span>
            </span>
          </div>
          <p className="mt-3 text-sm text-white/55 max-w-xs">
            India&apos;s trust-first rental platform — list once, publish
            everywhere, with built-in verification and auto-generated rent
            agreements.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-white/40">
              {col.title}
            </h4>
            <ul className="mt-3 space-y-2 text-sm">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="col-span-2 sm:col-span-1">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-white/40">
            Cities We Cover
          </h4>
          <ul className="mt-3 space-y-2 text-sm">
            {localities.slice(0, 5).map((loc) => (
              <li key={loc.id}>
                <Link href={`/rent?city=${encodeURIComponent(loc.city)}`} className="hover:text-white transition-colors">
                  {loc.city}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page py-4 text-xs text-white/40 flex flex-col sm:flex-row gap-2 sm:justify-between">
          <p>© {new Date().getFullYear()} BharosaGhar. Prototype for demonstration purposes only.</p>
          <p>Made for owners and brokers across India.</p>
        </div>
      </div>
    </footer>
  );
}
