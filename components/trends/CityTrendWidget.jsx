import Link from "next/link";
import { TrendingUp, ArrowRight } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { getTrend, getOverallChangePct, getInsight } from "@/data/trends";

// Compact "Rent Trends in [City]" widget embedded on a filtered listings page.
export default function CityTrendWidget({ city }) {
  const trend = getTrend(city);
  if (!trend) return null;
  const changePct = getOverallChangePct(city);
  const latest = trend.monthly[trend.monthly.length - 1].avgRent;

  return (
    <Link
      href={`/trends?city=${encodeURIComponent(city)}`}
      className="group flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl border border-primary-100 bg-primary-50/60 hover:bg-primary-50 px-4 py-3.5 transition-colors"
    >
      <div className="flex-1 min-w-0">
        <p className="flex items-center gap-1.5 text-sm font-semibold text-primary-800">
          <TrendingUp size={15} />
          Rent Trends in {city}
        </p>
        <p className="mt-1 text-xs text-primary-700/80 leading-snug line-clamp-2">{getInsight(city)}</p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="w-24 h-10">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend.monthly}>
              <Line
                type="monotone"
                dataKey="avgRent"
                stroke="#0f5c54"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-primary-800">₹{latest.toLocaleString("en-IN")}</p>
          <p
            className={`text-[11px] font-semibold ${changePct >= 0 ? "text-emerald-600" : "text-red-500"}`}
          >
            {changePct >= 0 ? "▲" : "▼"} {Math.abs(changePct)}% / 8mo
          </p>
        </div>
        <ArrowRight size={16} className="text-primary-400 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </Link>
  );
}
