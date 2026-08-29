import { ShieldCheck, Share2, FileSignature, Users2 } from "lucide-react";

export const metadata = { title: "About & Trust | BharosaGhar" };

const contrasts = [
  {
    icon: Share2,
    title: "Publish once instead of many times",
    body: "Most owners today re-type the same listing on three or four different sites. BharosaGhar fills them all in for you from a single form.",
  },
  {
    icon: FileSignature,
    title: "Built-in agreements and verification",
    body: "Trust shouldn't be an afterthought. Every listing can carry ID-backed verification, and rent agreements generate automatically instead of being emailed PDFs.",
  },
  {
    icon: Users2,
    title: "Made for individual owners, not just big brokers",
    body: "Large portals are optimized for high-volume brokers. We built a simple, guided flow so a single owner listing one flat has just as smooth an experience.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="bg-primary-900 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-25"
          style={{ backgroundImage: "linear-gradient(120deg, hsl(172 55% 30%), hsl(20 70% 45%))" }}
        />
        <div className="relative container-page py-16 sm:py-20 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 text-white text-xs font-medium px-3 py-1 border border-white/15">
            <ShieldCheck size={13} /> Our Mission
          </span>
          <h1 className="mt-5 text-3xl sm:text-4xl font-bold text-white max-w-2xl mx-auto">
            Bringing India&apos;s informal rental market into a trusted, digital system
          </h1>
          <p className="mt-4 text-white/70 max-w-xl mx-auto text-sm sm:text-base">
            Most rentals in India still happen through word of mouth, unverified brokers and
            paper agreements. BharosaGhar exists to make that process trustworthy, transparent
            and fast — starting with India&apos;s fast-growing Tier-2 cities.
          </p>
        </div>
      </section>

      <section className="container-page py-14 sm:py-20">
        <div className="max-w-xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary-800">How we&apos;re different</h2>
          <p className="mt-2 text-black/55 text-sm sm:text-base">
            We&apos;re not trying to replace the portals people already use — we make it easier to
            be present everywhere, without the extra effort.
          </p>
        </div>

        <div className="mt-8 grid sm:grid-cols-3 gap-5">
          {contrasts.map(({ icon: Icon, title, body }) => (
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
        <div className="container-page max-w-2xl">
          <h2 className="text-2xl font-bold text-primary-800">Why &ldquo;Bharosa&rdquo;?</h2>
          <p className="mt-3 text-sm text-black/60 leading-relaxed">
            Bharosa means &ldquo;trust&rdquo; in Hindi. It&apos;s the single word that came up
            most often when we spoke to owners, tenants and brokers across Indore, Coimbatore,
            Nagpur and Lucknow about what was missing from their rental experience. Not more
            listings — more confidence in the ones already there. That&apos;s the problem
            BharosaGhar is built to solve.
          </p>
        </div>
      </section>
    </div>
  );
}
