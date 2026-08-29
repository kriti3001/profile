import { ShieldCheck, Users, FileSignature, Share2 } from "lucide-react";

const items = [
  { icon: ShieldCheck, label: "Verified Listings" },
  { icon: Users, label: "No Broker Needed" },
  { icon: FileSignature, label: "Auto-Generated Rent Agreements" },
  { icon: Share2, label: "Post on Multiple Portals in One Click" },
];

export default function TrustStrip() {
  return (
    <div className="bg-primary-50 border-y border-primary-100">
      <div className="container-page py-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white text-primary-600 shrink-0 shadow-sm">
              <Icon size={17} />
            </span>
            <span className="text-xs sm:text-sm font-medium text-primary-800 leading-tight">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
