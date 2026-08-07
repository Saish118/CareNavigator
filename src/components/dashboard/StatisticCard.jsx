import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export const StatisticCard = ({
  title = "Active ER Admissions",
  value = "142",
  change = "+12%",
  isIncrease = true,
  icon: Icon,
  subtitle = "Past 24 hours",
}) => {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 uppercase">{title}</span>
        {Icon && (
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between">
        <span className="text-3xl font-black text-slate-900">{value}</span>
        {change && (
          <div
            className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md ${
              isIncrease
                ? "bg-emerald-100 text-emerald-800"
                : "bg-rose-100 text-rose-800"
            }`}
          >
            {isIncrease ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            <span>{change}</span>
          </div>
        )}
      </div>

      {subtitle && <p className="text-[11px] text-slate-400 font-medium">{subtitle}</p>}
    </div>
  );
};
