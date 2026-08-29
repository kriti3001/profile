import { Share2, ShieldCheck, Users2 } from "lucide-react";

const cards = [
  {
    icon: Share2,
    title: "List once, publish everywhere",
    body: "Fill in your property details a single time on BharosaGhar and we auto-fill your listing across 99acres, MagicBricks, Housing.com and NoBroker.",
  },
  {
    icon: ShieldCheck,
    title: "Built-in trust: verification + agreements",
    body: "Every listing can carry a verified badge backed by ID checks, and tenants get an auto-generated rent agreement — no back-and-forth with a lawyer.",
  },
  {
    icon: Users2,
    title: "Made for owners AND brokers",
    body: "A simple flow for individual owners posting one home, and powerful bulk tools with a unified leads inbox for brokers managing dozens.",
  },
];

export default function WhySection() {
  return (
    <section className="container-page py-14 sm:py-20">
      <div className="max-w-xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-primary-800">
          Why BharosaGhar
        </h2>
        <p className="mt-2 text-black/55 text-sm sm:text-base">
          We&apos;re building the trust layer India&apos;s rental market has been missing.
        </p>
      </div>

      <div className="mt-8 grid sm:grid-cols-3 gap-5">
        {cards.map(({ icon: Icon, title, body }) => (
          <div
            key={title}
            className="rounded-2xl border border-black/10 p-6 hover:border-primary-200 hover:shadow-md transition-all"
          >
            <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary-50 text-primary-600">
              <Icon size={22} />
            </span>
            <h3 className="mt-4 font-semibold text-primary-800">{title}</h3>
            <p className="mt-2 text-sm text-black/55 leading-relaxed">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
