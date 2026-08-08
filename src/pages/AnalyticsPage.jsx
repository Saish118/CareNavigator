import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Activity,
  ShieldCheck,
  HeartPulse,
  RotateCcw,
  Ambulance,
  Building2,
  Clock,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from "lucide-react";
import { CapacityChart } from "../components/analytics/CapacityChart";
import { ERTrendChart } from "../components/analytics/ERTrendChart";
import { BloodBankStats } from "../components/analytics/BloodBankStats";
import { REGIONAL_METRICS } from "../data/analyticsData";

export const AnalyticsPage = () => {
  const [lastUpdatedMin, setLastUpdatedMin] = useState(2);

  // Live feed data items
  const liveFeedEvents = [
    {
      time: "14:16",
      type: "Stroke Alert",
      location: "North Region Dispatch",
      status: "Priority Response",
      color: "bg-rose-500 text-white",
      borderColor: "border-rose-200",
    },
    {
      time: "14:13",
      type: "Blood Request (O-)",
      location: "St. Jude Metro Cardiac Center",
      status: "Accepted & En Route",
      color: "bg-emerald-500 text-white",
      borderColor: "border-emerald-200",
    },
    {
      time: "14:11",
      type: "ICU Bed Allocated",
      location: "Metro General Hospital",
      status: "Telemetry Confirmed",
      color: "bg-blue-500 text-white",
      borderColor: "border-blue-200",
    },
    {
      time: "14:08",
      type: "ALS Ambulance Dispatched",
      location: "City Trauma Center",
      status: "Siren Corridor Active",
      color: "bg-amber-500 text-white",
      borderColor: "border-amber-200",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-7 space-y-6 sm:space-y-7">
      {/* 1. HERO HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-black rounded-full border border-emerald-200/80 flex items-center gap-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
              <span>LIVE Telemetry Connected</span>
            </span>
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider hidden sm:inline">
              Command Intelligence
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Regional Healthcare Command Center
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-3xl leading-relaxed">
            Live operational intelligence for hospitals, emergency dispatch, ICU resources, ambulance fleets, and blood inventory across the healthcare network.
          </p>
        </div>

        {/* 7. Top Right "Last Updated" Status */}
        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-bold bg-white px-3.5 py-2 rounded-2xl border border-slate-200/80 shadow-xs">
            <RotateCcw className="w-3.5 h-3.5 text-blue-600 animate-spin" style={{ animationDuration: "10s" }} />
            <span>Last Updated: {lastUpdatedMin} min ago</span>
          </div>
        </div>
      </div>

      {/* 2. OPERATIONAL KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Hospitals Online (Green = Healthy) */}
        <div className="bg-white p-4.5 rounded-3xl border border-slate-200/80 shadow-md hover:-translate-y-1 hover:shadow-xl transition-all duration-200 ease-out space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Hospitals Online</span>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-black text-[10px] rounded-md border border-emerald-200">
              Healthy
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-1.5">
            <Building2 className="w-5 h-5 text-emerald-600 shrink-0" />
            18 / 18 <span className="text-xs text-slate-500 font-semibold">Operational</span>
          </p>
        </div>

        {/* Card 2: ICU Beds Available (Blue = Informational) */}
        <div className="bg-white p-4.5 rounded-3xl border border-slate-200/80 shadow-md hover:-translate-y-1 hover:shadow-xl transition-all duration-200 ease-out space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">ICU Beds Available</span>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-black text-[10px] rounded-md border border-blue-200">
              Informational
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-1.5">
            <Activity className="w-5 h-5 text-blue-600 shrink-0" />
            35 <span className="text-xs text-slate-500 font-semibold">Beds Free</span>
          </p>
        </div>

        {/* Card 3: Active Ambulances (Green = Healthy) */}
        <div className="bg-white p-4.5 rounded-3xl border border-slate-200/80 shadow-md hover:-translate-y-1 hover:shadow-xl transition-all duration-200 ease-out space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Active Ambulances</span>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-black text-[10px] rounded-md border border-emerald-200">
              Healthy
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-1.5">
            <Ambulance className="w-5 h-5 text-emerald-600 shrink-0" />
            28 <span className="text-xs text-slate-500 font-semibold">Online</span>
          </p>
        </div>

        {/* Card 4: Average Emergency Response (Orange = Warning) */}
        <div className="bg-white p-4.5 rounded-3xl border border-slate-200/80 shadow-md hover:-translate-y-1 hover:shadow-xl transition-all duration-200 ease-out space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Avg Response Time</span>
            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-black text-[10px] rounded-md border border-amber-200">
              Warning
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-amber-700 flex items-center gap-1.5">
            <Clock className="w-5 h-5 text-amber-600 shrink-0" />
            7.4 <span className="text-xs text-slate-500 font-semibold">mins</span>
          </p>
        </div>
      </div>

      {/* 3 & 4. CHARTS AND LIVE EMERGENCY FEED (Main Layout Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: ICU Capacity & ER Trend Charts */}
        <div className="lg:col-span-2 space-y-6">
          <CapacityChart />
          <ERTrendChart />
        </div>

        {/* Right 1 Column: Live Emergency Feed Timeline Panel */}
        <div className="space-y-6">
          {/* Live Operations Feed Panel */}
          <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 shadow-xl space-y-4 hover:-translate-y-1 transition-transform duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
                <h3 className="font-extrabold text-sm text-white">Live Emergency Feed</h3>
              </div>
              <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 font-extrabold text-[10px] rounded-md border border-rose-500/30">
                ACTIVE BROADCAST
              </span>
            </div>

            {/* Timeline Feed Items */}
            <div className="space-y-3.5 relative">
              <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-slate-800" />

              {liveFeedEvents.map((evt, idx) => (
                <div key={idx} className="relative pl-7 space-y-1 group">
                  <span className={`absolute left-1.5 top-1.5 w-3 h-3 rounded-full ${evt.color} ring-4 ring-slate-900 group-hover:scale-125 transition-transform`} />

                  <div className="flex items-center justify-between text-xs">
                    <strong className="text-white font-bold">{evt.type}</strong>
                    <span className="font-mono text-[11px] text-slate-400 font-semibold">{evt.time}</span>
                  </div>

                  <p className="text-[11px] text-slate-400 font-medium leading-snug">
                    {evt.location}
                  </p>

                  <span className="inline-block text-[10px] font-bold text-slate-300 bg-slate-800/90 px-2 py-0.5 rounded-md border border-slate-700">
                    {evt.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick System Telemetry Widget */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-md space-y-3">
            <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
              Network Telemetry Health
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100 font-medium">
                <span className="text-slate-600">ER Gate Telemetry:</span>
                <strong className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 100% Online
                </strong>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100 font-medium">
                <span className="text-slate-600">GPS Paramedic Beacon:</span>
                <strong className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Synced
                </strong>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100 font-medium">
                <span className="text-slate-600">Regional Blood Reserve:</span>
                <strong className="text-amber-600 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> O- Stock Low
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. BLOOD BANK INVENTORY SECTION */}
      <BloodBankStats />
    </div>
  );
};
