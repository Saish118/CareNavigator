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
    <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-4">
      <div>
        <h3 className="font-extrabold text-slate-900 text-base">
          Emergency Arrivals by Medical Specialty (Today)
        </h3>
        <p className="text-xs text-slate-500">
          Distribution of patient Triage cases processed across emergency departments
        </p>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ER_ARRIVALS_BY_SPECIALTY} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="category" stroke="#94a3b8" fontSize={10} interval={0} />
            <YAxis stroke="#94a3b8" fontSize={11} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#1e293b",
                borderRadius: "12px",
                color: "#ffffff",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="count" name="Emergency Patient Count" fill="#0284c7" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
