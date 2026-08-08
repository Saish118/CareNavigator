import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ER_ARRIVALS_BY_SPECIALTY } from "../../data/analyticsData";

export const ERTrendChart = () => {
  return (
    <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-md hover:-translate-y-1 hover:shadow-xl transition-all duration-200 ease-out space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-slate-900 text-base">
            Emergency Arrivals by Medical Specialty (Today)
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Distribution of patient Triage cases processed across emergency departments
          </p>
        </div>
        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-bold text-[11px] rounded-lg border border-slate-200">
          Today's Feed
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ER_ARRIVALS_BY_SPECIALTY} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="category" stroke="#64748b" fontSize={10} interval={0} />
            <YAxis stroke="#64748b" fontSize={11} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#1e293b",
                borderRadius: "12px",
                color: "#ffffff",
                fontSize: "12px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
              }}
              cursor={{ fill: "rgba(241, 245, 249, 0.6)" }}
            />
            <Bar
              dataKey="count"
              name="Emergency Patient Count"
              fill="#2563eb"
              radius={[6, 6, 0, 0]}
              isAnimationActive={true}
              animationDuration={800}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
