import React from "react";
import { Navigation, Clock, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, Gauge } from "lucide-react";

export const RouteDetails = ({ routeData, isSirenActive }) => {
  if (!routeData) return null;

  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-md space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Navigation className="w-5 h-5 text-sky-600" />
          <h3 className="font-bold text-slate-900 text-base">
            Turn-by-Turn Siren Navigation
          </h3>
        </div>
        <span
          className={`px-3 py-1 text-xs font-bold rounded-full ${
            isSirenActive
              ? "bg-rose-100 text-rose-700 animate-pulse border border-rose-200"
              : "bg-emerald-100 text-emerald-800"
          }`}
        >
          {isSirenActive ? "Siren Priority Lane Clearance" : "Standard Traffic Route"}
        </span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-3 text-center text-xs">
        <div className="p-3 bg-sky-50 rounded-2xl border border-sky-100">
          <span className="block text-[10px] text-slate-500 font-bold uppercase">Estimated Drive</span>
          <span className="text-xl font-black text-sky-700">{routeData.etaMinutes} Mins</span>
        </div>
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
          <span className="block text-[10px] text-slate-500 font-bold uppercase">Distance</span>
          <span className="text-xl font-black text-slate-800">{routeData.distanceKm} km</span>
        </div>
        <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
          <span className="block text-[10px] text-slate-500 font-bold uppercase">Traffic Status</span>
          <span className="text-sm font-bold text-emerald-700">{routeData.trafficCondition}</span>
        </div>
      </div>

      {/* Turn-by-Turn Directions List */}
      <div>
        <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Live Turn Guidance</h4>
        <div className="space-y-2">
          {routeData.steps.map((step) => (
            <div
              key={step.id}
              className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-3 text-xs"
            >
              <div className="w-6 h-6 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center shrink-0">
                {step.id}
              </div>
              <div className="flex-1">
                <span className="font-semibold text-slate-800 block">{step.instruction}</span>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5 font-medium">
                  <span>{step.distance}</span>
                  <span>•</span>
                  <span>{step.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
