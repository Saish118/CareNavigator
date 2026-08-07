import React from "react";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

export const AnalyticsCard = ({
  title = "Regional ICU Occupancy Rate",
  value = "88.4%",
  change = "+4.2%",
  isPositive = false,
  timeframe = "vs last 24h",
  icon: Icon = Activity,
}) => {
  return (
    <div className="h-full flex flex-col justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 uppercase">{title}</span>
        <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
          <Icon className="w-4 h-4 shrink-0" />
        </div>
      </div>

      <div className="flex items-baseline justify-between">
        <span className="text-3xl font-black text-slate-900">{value}</span>
        <div
          className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg shrink-0 ${
            isPositive
              ? "bg-emerald-100 text-emerald-800"
              : "bg-rose-100 text-rose-800"
          }`}
        >
          {isPositive ? <TrendingUp className="w-3.5 h-3.5 shrink-0" /> : <TrendingDown className="w-3.5 h-3.5 shrink-0" />}
          <span>{change}</span>
        </div>
      </div>

      <p className="text-[11px] text-slate-400 font-medium">{timeframe}</p>
    </div>
  );
};
