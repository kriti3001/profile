import { Home, Building2 } from "lucide-react";

export default function Step0Role({ data, update }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-primary-800">Tell us who you are</h2>
      <p className="text-sm text-black/50 mt-1">
        This changes a couple of steps below — brokers get a bulk-listing question, owners get a simpler flow.
      </p>

      <div className="mt-6 grid sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => update({ role: "owner" })}
          className={`text-left rounded-2xl border-2 p-6 transition-colors ${
            data.role === "owner" ? "border-primary-500 bg-primary-50" : "border-black/10 hover:border-black/20"
          }`}
        >
          <Home size={24} className="text-primary-600" />
          <p className="mt-3 font-semibold text-primary-900">I am an Owner</p>
          <p className="mt-1 text-sm text-black/55">
            I want to list my own property — a home I own or rent out directly.
          </p>
        </button>

        <button
          type="button"
          onClick={() => update({ role: "broker" })}
          className={`text-left rounded-2xl border-2 p-6 transition-colors ${
            data.role === "broker" ? "border-primary-500 bg-primary-50" : "border-black/10 hover:border-black/20"
          }`}
        >
          <Building2 size={24} className="text-primary-600" />
          <p className="mt-3 font-semibold text-primary-900">I am a Broker / Agent</p>
          <p className="mt-1 text-sm text-black/55">
            I manage multiple listings for clients and want bulk tools and a leads dashboard.
          </p>
        </button>
      </div>
    </div>
  );
}
