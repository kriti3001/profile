import { Info } from "lucide-react";
import { portals } from "@/data/portals";

// Convincing mock/simulation only — BharosaGhar does not perform real
// scraping/automation against partner portals' actual sites.
// TODO: replace with real partner-portal publishing integrations where agreements exist.
export default function Step5Publish({ data, update, onPublish, publishing }) {
  const toggle = (id) => {
    update({
      portals: { ...data.portals, [id]: !data.portals[id] },
    });
  };

  const activeCount = Object.values(data.portals).filter(Boolean).length;

  return (
    <div>
      <h2 className="text-lg font-semibold text-primary-800">Publish Everywhere</h2>
      <p className="text-sm text-black/50 mt-1 flex items-start gap-1.5">
        <Info size={14} className="mt-0.5 shrink-0" />
        We&apos;ll auto-fill your listing on each portal you enable below — no need to log in to each one separately.
      </p>

      <div className="mt-6 space-y-3">
        {portals.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between rounded-xl border border-black/10 px-4 py-3.5"
          >
            <div className="flex items-center gap-3">
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: p.color }}
              >
                {p.name[0]}
              </span>
              <span className="text-sm font-medium text-primary-900">{p.name}</span>
            </div>
            <button
              type="button"
              onClick={() => toggle(p.id)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                data.portals[p.id] ? "bg-primary-500" : "bg-black/20"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                  data.portals[p.id] ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        disabled={publishing}
        onClick={onPublish}
        className="mt-8 w-full rounded-lg bg-accent-500 hover:bg-accent-600 disabled:opacity-60 text-white font-semibold py-3.5 transition-colors"
      >
        {publishing ? "Publishing..." : `Publish to ${activeCount} platform${activeCount === 1 ? "" : "s"}`}
      </button>
    </div>
  );
}
