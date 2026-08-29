"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";

// Reusable trust badge shown across listing cards and the detail page.
export default function VerifiedBadge({ size = "sm", withTooltip = false }) {
  const [open, setOpen] = useState(false);

  const sizes = {
    sm: "text-[11px] px-1.5 py-0.5 gap-1",
    md: "text-xs px-2 py-1 gap-1.5",
  };
  const iconSizes = { sm: 12, md: 14 };

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => withTooltip && setOpen(true)}
      onMouseLeave={() => withTooltip && setOpen(false)}
    >
      <span
        className={`inline-flex items-center font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ${sizes[size]}`}
      >
        <ShieldCheck size={iconSizes[size]} strokeWidth={2.5} />
        Verified
      </span>
      {withTooltip && open && (
        <span className="absolute z-20 top-full left-0 mt-2 w-56 rounded-lg bg-primary-900 text-white text-xs leading-snug p-3 shadow-lg">
          BharosaGhar has verified this owner/broker&apos;s ID and property
          documents. Verified listings get priority visibility and faster
          responses.
        </span>
      )}
    </span>
  );
}
