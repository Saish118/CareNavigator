import React from "react";
import { Droplet, AlertTriangle, CheckCircle2, ShieldCheck, Activity } from "lucide-react";
import { BLOOD_BANK_INVENTORY } from "../../data/analyticsData";

export const BloodBankStats = () => {
  return (
    <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-md hover:-translate-y-1 hover:shadow-xl transition-all duration-200 ease-out space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
            <Droplet className="w-5 h-5 text-rose-600 fill-rose-600 shrink-0" />
            Regional Blood Bank Reserve Inventory
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Live supply status for emergency trauma transfusions across partner facilities
          </p>
        </div>

        <span className="px-3 py-1 bg-slate-100 text-slate-700 font-bold text-xs rounded-full border border-slate-200">
          Hospital Supply Status: Active Sync
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {BLOOD_BANK_INVENTORY.map((item, idx) => {
          const isCritical = item.status === "Critical Shortage" || item.status === "Critical";
          const isLow = item.status === "Low Supply" || item.status === "Low";

          const badgeLabel = isCritical ? "Critical" : isLow ? "Low" : "Optimal";

          return (
            <div
              key={idx}
              className={`p-4 rounded-2xl border transition-all ${
                isCritical
                  ? "bg-rose-50/80 border-rose-200 text-rose-950 shadow-xs"
                  : isLow
                  ? "bg-amber-50/80 border-amber-200 text-amber-950 shadow-xs"
                  : "bg-slate-50/80 border-slate-200/80 text-slate-900 shadow-xs"
              }`}
            >
              <div className="flex items-center justify-between text-xs font-black">
                <span className="text-sm font-extrabold">{item.group}</span>
                {isCritical ? (
                  <AlertTriangle className="w-4 h-4 text-rose-600 animate-pulse" />
                ) : isLow ? (
                  <Activity className="w-4 h-4 text-amber-600" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                )}
              </div>

              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-black">{item.units}</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Units</span>
              </div>

              <div className="mt-2">
                <span
                  className={`inline-block text-[10px] font-black px-2.5 py-0.5 rounded-md shadow-xs ${
                    isCritical
                      ? "bg-rose-600 text-white"
                      : isLow
                      ? "bg-amber-500 text-white"
                      : "bg-emerald-600 text-white"
                  }`}
                >
                  {badgeLabel} Reserve
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
