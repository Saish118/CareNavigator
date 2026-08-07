import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ICU_OCCUPANCY_TRENDS } from "../../data/analyticsData";

export const CapacityChart = () => {
  return (
    <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-slate-900 text-base">
            Regional ICU Occupancy Rate (24-Hour Timeline)
          </h3>
          <p className="text-xs text-slate-500">
            Real-time percentage utilization across 18 regional hospital ICUs
          </p>
        </div>
        <span className="px-3 py-1 bg-sky-50 text-sky-700 font-bold text-xs rounded-full border border-sky-200">
          Live Telemetry Feed
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={ICU_OCCUPANCY_TRENDS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="occupancyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="ventGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#e11d48" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
            <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#1e293b",
                borderRadius: "12px",
                color: "#ffffff",
                fontSize: "12px",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
            <Area
              type="monotone"
              dataKey="totalOccupancy"
              name="ICU Occupancy %"
              stroke="#0284c7"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#occupancyGrad)"
            />
            <Area
              type="monotone"
              dataKey="ventilatorDemand"
              name="Ventilator Usage Units"
              stroke="#e11d48"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#ventGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
