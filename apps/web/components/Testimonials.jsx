import { Quote } from "lucide-react";
import { testimonials } from "@/data/testimonials";

export default function Testimonials() {
  return (
    <section className="container-page py-14 sm:py-20">
      <h2 className="text-2xl sm:text-3xl font-bold text-primary-800 text-center">
        Trusted by owners and brokers
      </h2>

      <div className="mt-8 grid sm:grid-cols-3 gap-5">
        {testimonials.map((t) => (
          <div key={t.id} className="rounded-2xl bg-primary-50 p-6 flex flex-col">
            <Quote size={22} className="text-primary-300" />
            <p className="mt-3 text-sm text-primary-900/80 leading-relaxed flex-1">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div className="mt-4">
              <p className="text-sm font-semibold text-primary-800">{t.name}</p>
              <p className="text-xs text-primary-600/70">{t.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
