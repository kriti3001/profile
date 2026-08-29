"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatINR } from "@/lib/format";

function TrendTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-black/10 bg-white px-3 py-2 shadow-md text-xs">
      <p className="font-medium text-primary-800">{label} 2026</p>
      <p className="text-primary-600 mt-0.5">₹{formatINR(payload[0].value)}/mo avg</p>
    </div>
  );
}

export default function RentTrendChart({ data, height = 260 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="rentTrendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f5c54" stopOpacity={0.28} />
            <stop offset="100%" stopColor="#0f5c54" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#00000012" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12, fill: "#16211f99" }}
          axisLine={{ stroke: "#00000015" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#16211f99" }}
          axisLine={false}
          tickLine={false}
          width={56}
          tickFormatter={(v) => `₹${Math.round(v / 1000)}k`}
        />
        <Tooltip content={<TrendTooltip />} />
        <Area
          type="monotone"
          dataKey="avgRent"
          stroke="#0f5c54"
          strokeWidth={2.5}
          fill="url(#rentTrendFill)"
          dot={{ r: 3, fill: "#0f5c54", strokeWidth: 0 }}
          activeDot={{ r: 5, fill: "#f4791e" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
