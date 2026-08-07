import React from "react";
import { BarChart3, Activity, ShieldCheck, HeartPulse } from "lucide-react";
import { CapacityChart } from "../components/analytics/CapacityChart";
import { ERTrendChart } from "../components/analytics/ERTrendChart";
import { BloodBankStats } from "../components/analytics/BloodBankStats";
import { REGIONAL_METRICS } from "../data/analyticsData";

export const AnalyticsPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-black text-sky-600 uppercase tracking-wider">
          <BarChart3 className="w-4 h-4" /> Healthcare Command Intelligence
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Regional Healthcare Analytics & ICU Capacity
        </h1>
        <p className="text-sm text-slate-600 font-medium mt-1">
          Real-time metrics, emergency arrival trends, and critical blood bank inventory monitoring across 18 hospitals.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-md">
          <span className="text-xs font-bold text-slate-500 uppercase">System Status</span>
          <p className="text-lg font-black text-emerald-600 mt-1 flex items-center gap-1.5">
            <ShieldCheck className="w-5 h-5 text-emerald-500" /> Operational
          </p>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-md">
          <span className="text-xs font-bold text-slate-500 uppercase">Total ICU Capacity</span>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {REGIONAL_METRICS.totalAvailableIcuBeds} <span className="text-xs text-slate-400 font-normal">Beds Free</span>
          </p>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-md">
          <span className="text-xs font-bold text-slate-500 uppercase">Ventilator Supply</span>
          <p className="text-2xl font-black text-sky-600 mt-1">
            {REGIONAL_METRICS.totalAvailableVentilators} <span className="text-xs text-slate-400 font-normal">Units</span>
          </p>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-md">
          <span className="text-xs font-bold text-slate-500 uppercase">Avg Regional Response</span>
          <p className="text-2xl font-black text-rose-600 mt-1">
            {REGIONAL_METRICS.avgRegionalResponseTimeMin} <span className="text-xs text-slate-400 font-normal">mins</span>
          </p>
        </div>
      </div>

      {/* Recharts Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CapacityChart />
        <ERTrendChart />
      </div>

      {/* Blood Bank Stats */}
      <BloodBankStats />
    </div>
  );
};
