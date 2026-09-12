import { Check } from "lucide-react";

const steps = ["Role", "Basics", "Price", "Photos", "Trust", "Publish"];

export default function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-between max-w-2xl mx-auto mb-10 overflow-x-auto no-scrollbar">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-colors ${
                  done
                    ? "bg-primary-500 border-primary-500 text-white"
                    : active
                    ? "border-primary-500 text-primary-600"
                    : "border-black/15 text-black/35"
                }`}
              >
                {done ? <Check size={14} /> : i + 1}
              </div>
              <span
                className={`text-[10px] sm:text-xs font-medium whitespace-nowrap ${
                  active ? "text-primary-700" : "text-black/40"
                }`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-0.5 flex-1 mx-1.5 sm:mx-2 ${done ? "bg-primary-500" : "bg-black/10"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
