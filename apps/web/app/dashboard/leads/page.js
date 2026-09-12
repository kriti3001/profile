import { Phone } from "lucide-react";
import { leads } from "@/data/leads";
import { formatDate } from "@/lib/format";

const sourceColors = {
  "99acres": "bg-[#7a1f2b]/10 text-[#7a1f2b]",
  MagicBricks: "bg-[#e2231a]/10 text-[#e2231a]",
  "Housing.com": "bg-[#00a3a3]/10 text-[#00a3a3]",
  NoBroker: "bg-[#6c3fc5]/10 text-[#6c3fc5]",
  "BharosaGhar direct": "bg-primary-50 text-primary-700",
};

const statusColors = {
  New: "bg-accent-50 text-accent-700",
  Contacted: "bg-primary-50 text-primary-700",
  Closed: "bg-black/5 text-black/50",
};

export default function LeadsPage() {
  return (
    <div>
      <h1 className="text-xl font-bold text-primary-800">Leads Inbox</h1>
      <p className="text-sm text-black/50 mt-1">
        All enquiries in one place, no matter which portal they came from.
      </p>

      <div className="mt-6 space-y-3">
        {leads.map((lead) => (
          <div key={lead.id} className="rounded-xl border border-black/10 p-4">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <p className="font-medium text-primary-900">{lead.name}</p>
                <p className="text-xs text-black/50 mt-0.5">Re: {lead.propertyTitle}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[11px] font-medium rounded-full px-2 py-0.5 ${sourceColors[lead.source] || "bg-black/5 text-black/60"}`}>
                  via {lead.source}
                </span>
                <span className={`text-[11px] font-medium rounded-full px-2 py-0.5 ${statusColors[lead.status]}`}>
                  {lead.status}
                </span>
              </div>
            </div>
            <p className="mt-2.5 text-sm text-black/65">{lead.message}</p>
            <div className="mt-3 flex items-center justify-between text-xs text-black/40">
              <span className="flex items-center gap-1">
                <Phone size={12} /> {lead.phone}
              </span>
              <span>{formatDate(lead.date)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
