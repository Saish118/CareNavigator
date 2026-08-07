import React from "react";
import { Droplet, AlertTriangle, CheckCircle2 } from "lucide-react";
import { BLOOD_BANK_INVENTORY } from "../../data/analyticsData";

export const BloodBankStats = () => {
  return (
    <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
            <Droplet className="w-5 h-5 text-rose-600 fill-rose-600" />
            Regional Blood Bank Reserve Inventory
          </h3>
          <p className="text-xs text-slate-500">Live units available for trauma blood transfusions</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {BLOOD_BANK_INVENTORY.map((item, idx) => {
          const isCritical = item.status === "Critical Shortage";
          const isLow = item.status === "Low Supply";

          return (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl border transition-all ${
                isCritical
                  ? "bg-rose-50 border-rose-200 text-rose-950"
                  : isLow
                  ? "bg-amber-50 border-amber-200 text-amber-950"
                  : "bg-slate-50 border-slate-200 text-slate-900"
              }`}
            >
              <div className="flex items-center justify-between text-xs font-black">
                <span className="text-sm font-extrabold">{item.group}</span>
                {isCritical ? (
                  <AlertTriangle className="w-4 h-4 text-rose-600 animate-pulse" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                )}
              </div>

              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-xl font-black">{item.units}</span>
                <span className="text-[10px] font-bold text-slate-500">Units</span>
              </div>

              <span
                className={`inline-block text-[10px] font-bold mt-1 px-2 py-0.5 rounded-md ${
                  isCritical
                    ? "bg-rose-600 text-white"
                    : isLow
                    ? "bg-amber-500 text-white"
                    : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {item.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
