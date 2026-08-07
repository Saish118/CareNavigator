import React from "react";
import { Ambulance, Radio } from "lucide-react";

export const AmbulanceStatusBadge = ({
  status = "En Route to Patient", // "En Route to Patient", "Available", "Dispatched", "In Maintenance"
  unitId = "AMB-101",
}) => {
  const statusStyles = {
    "En Route to Patient": "bg-rose-100 text-rose-800 border-rose-200",
    Dispatched: "bg-amber-100 text-amber-900 border-amber-200",
    Available: "bg-emerald-100 text-emerald-800 border-emerald-200",
    "In Maintenance": "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg border ${
        statusStyles[status] || "bg-slate-100 text-slate-700"
      }`}
    >
      <Ambulance className="w-3.5 h-3.5" />
      <span>{unitId}: {status}</span>
    </span>
  );
};
