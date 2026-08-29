import { Check } from "lucide-react";
import { pricingTiers } from "@/data/pricing";
import { formatINR } from "@/lib/format";

export default function PricingTable({ currentPlan }) {
  return (
    <div className="grid sm:grid-cols-3 gap-5">
      {pricingTiers.map((tier) => (
        <div
          key={tier.id}
          className={`relative rounded-2xl border-2 p-6 flex flex-col ${
            tier.highlighted ? "border-primary-500 shadow-lg" : "border-black/10"
          }`}
        >
          {currentPlan === tier.id ? (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-700 text-white text-[11px] font-semibold rounded-full px-3 py-1">
              Current Plan
            </span>
          ) : (
            tier.highlighted && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent-500 text-white text-[11px] font-semibold rounded-full px-3 py-1">
                Most Popular
              </span>
            )
          )}
          <h3 className="font-semibold text-primary-800">{tier.name}</h3>
          <p className="mt-1 text-xs text-black/50">{tier.tagline}</p>
          <p className="mt-4">
            <span className="text-3xl font-bold text-primary-900">
              {tier.price === 0 ? "Free" : `₹${formatINR(tier.price)}`}
            </span>
            {tier.price > 0 && <span className="text-sm text-black/45">/{tier.period}</span>}
          </p>

          <ul className="mt-5 space-y-2.5 flex-1">
            {tier.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-black/65">
                <Check size={15} className="text-emerald-500 mt-0.5 shrink-0" />
                {f}
              </li>
            ))}
          </ul>

          <button
            className={`mt-6 w-full rounded-lg text-sm font-semibold py-2.5 transition-colors ${
              tier.highlighted
                ? "bg-primary-500 hover:bg-primary-600 text-white"
                : "border border-black/15 text-primary-700 hover:bg-black/5"
            }`}
          >
            {currentPlan === tier.id ? "Manage Plan" : tier.cta}
          </button>
        </div>
      ))}
    </div>
  );
}
