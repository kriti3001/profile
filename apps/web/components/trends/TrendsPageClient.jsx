"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Sparkles } from "lucide-react";
import RentTrendChart from "./RentTrendChart";
import { trendCities, getTrend, getOverallChangePct, getInsight } from "@/data/trends";
import { formatINR } from "@/lib/format";

export default function TrendsPageClient() {
  const [city, setCity] = useState(trendCities[0]);

  useEffect(() => {
    // Same static-export-safe pattern as ListingsPage: read the URL only
    // after mount, never via useSearchParams (see ListingsPage.jsx for why).
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("city");
    if (requested && trendCities.includes(requested)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCity(requested);
    }
  }, []);

  const trend = getTrend(city);
  const changePct = getOverallChangePct(city);
  const latest = trend.monthly[trend.monthly.length - 1].avgRent;

  return (
    <div>
      <section className="bg-primary-900 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-25"
          style={{ backgroundImage: "linear-gradient(120deg, hsl(172 55% 30%), hsl(20 70% 45%))" }}
        />
        <div className="relative container-page py-14 sm:py-16 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 text-white text-xs font-medium px-3 py-1 border border-white/15">
            <Sparkles size={13} /> BharosaGhar Rent Trends
          </span>
          <h1 className="mt-5 text-3xl sm:text-4xl font-bold text-white max-w-xl mx-auto">
            A transparent read on India&apos;s rental market
          </h1>
          <p className="mt-4 text-white/70 max-w-lg mx-auto text-sm sm:text-base">
            Average rent movement across our covered cities, updated monthly. Sample data for this
            prototype — a live version would draw on real listing and transaction activity.
          </p>
        </div>
      </section>

      <div className="container-page py-10">
        <div className="flex flex-wrap gap-2">
          {trendCities.map((c) => (
            <button
              key={c}
              onClick={() => setCity(c)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                city === c
                  ? "bg-primary-500 border-primary-500 text-white"
                  : "border-black/15 text-black/60 hover:bg-black/5"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-6 grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl border border-black/10 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="text-xs text-black/45">Average Rent — {city}</p>
                <p className="mt-1 text-2xl font-bold text-primary-800">₹{formatINR(latest)}/mo</p>
              </div>
              <span
                className={`flex items-center gap-1 text-sm font-semibold rounded-full px-3 py-1.5 ${
                  changePct >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
                }`}
              >
                {changePct >= 0 ? <TrendingUp size={15} /> : <TrendingDown size={15} />}
                {changePct >= 0 ? "+" : ""}
                {changePct}% over 8 months
              </span>
            </div>

            <div className="mt-4">
              <RentTrendChart data={trend.monthly} />
            </div>

            <div className="mt-4 rounded-xl bg-primary-50 border border-primary-100 p-4 text-sm text-primary-800 leading-relaxed">
              {getInsight(city)}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 p-5 sm:p-6">
            <p className="font-semibold text-primary-800 mb-1">Locality Breakdown</p>
            <p className="text-xs text-black/45 mb-4">Average rent vs. last quarter</p>
            <div className="space-y-3">
              {trend.localities.map((loc) => (
                <div key={loc.name} className="flex items-center justify-between border-b border-black/5 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium text-primary-900">{loc.name}</p>
                    <p className="text-xs text-black/45">{city}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-primary-800">₹{formatINR(loc.avgRent)}</p>
                    <p
                      className={`text-xs font-medium ${
                        loc.changePct >= 0 ? "text-emerald-600" : "text-red-500"
                      }`}
                    >
                      {loc.changePct >= 0 ? "▲" : "▼"} {Math.abs(loc.changePct)}% vs last quarter
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-6 text-xs text-black/35">
          Sample data for demonstration purposes — not based on real market activity.
        </p>
      </div>
    </div>
  );
}
