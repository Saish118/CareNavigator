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
import { Activity, Clock } from "lucide-react";

export const CapacityChart = () => {
  return (
    <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-md hover:-translate-y-1 hover:shadow-xl transition-all duration-200 ease-out space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-slate-900 text-base">
              Regional ICU Occupancy Rate (24-Hour Timeline)
            </h3>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-extrabold text-[10px] rounded-md border border-emerald-200">
              84% Current
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Real-time percentage utilization across 18 regional hospital ICUs
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 bg-sky-50 text-sky-700 font-bold text-[11px] rounded-lg border border-sky-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-600 animate-ping" /> Live Telemetry
          </span>
          <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
            <Clock className="w-3 h-3" /> Updated 12 sec ago
          </span>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={ICU_OCCUPANCY_TRENDS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="occupancyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0284c7" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="ventGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#e11d48" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
            <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#1e293b",
                borderRadius: "12px",
                color: "#ffffff",
                fontSize: "12px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
            <Area
              type="monotone"
              dataKey="totalOccupancy"
              name="ICU Occupancy %"
              stroke="#0284c7"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#occupancyGrad)"
              isAnimationActive={true}
              animationDuration={800}
            />
            <Area
              type="monotone"
              dataKey="ventilatorDemand"
              name="Ventilator Usage Units"
              stroke="#e11d48"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#ventGrad)"
              isAnimationActive={true}
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
