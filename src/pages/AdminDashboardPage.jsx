import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowLeft, Activity, BedDouble, PhoneCall, BarChart3 } from "lucide-react";
import { Breadcrumb } from "../components/ui/Breadcrumb";
import { StatisticCard } from "../components/dashboard/StatisticCard";
import { CapacityChart } from "../components/analytics/CapacityChart";

export const AdminDashboardPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <Breadcrumb items={[{ label: "Dashboard", path: "/dashboard" }, { label: "Admin Console" }]} />
        <button
          onClick={() => navigate(-1)}
          className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 bg-rose-100 text-rose-800 font-extrabold text-[10px] rounded-md uppercase">
            System Admin Role
          </span>
          <h1 className="text-3xl font-black text-slate-900 mt-1">Hospital Emergency Admin Console</h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage regional hospital telemetry, Siren Priority Corridor access, and ICU bed quotas.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatisticCard title="Regional Occupancy" value="94.2%" change="+2.1%" icon={Activity} />
        <StatisticCard title="Active Ambulances" value="34" change="+6" icon={PhoneCall} />
        <StatisticCard title="Total ICU Capacity" value="35 Beds Free" icon={BedDouble} />
        <StatisticCard title="Regional ER Wait Avg" value="7.4 Mins" icon={BarChart3} />
      </div>

      <CapacityChart />
    </div>
  );
};
