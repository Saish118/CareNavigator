import React from "react";
import { Activity, Clock, MapPin, Radio } from "lucide-react";

export const ActivityCard = ({
  activity = {
    title: "ALS Ambulance Dispatched",
    description: "Unit AMB-101 en route to Downtown Sector 4",
    time: "4 mins ago",
    type: "emergency", // "emergency", "booking", "system"
  },
}) => {
  const badgeStyles = {
    emergency: "bg-rose-100 text-rose-800 border-rose-200",
    booking: "bg-emerald-100 text-emerald-800 border-emerald-200",
    system: "bg-sky-100 text-sky-800 border-sky-200",
  };

  return (
    <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm flex items-start gap-3 text-xs">
      <div className={`p-2 rounded-lg shrink-0 border ${badgeStyles[activity.type] || "bg-slate-100"}`}>
        <Activity className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h5 className="font-bold text-slate-900 truncate">{activity.title}</h5>
          <span className="text-[10px] text-slate-400 font-medium shrink-0 flex items-center gap-1">
            <Clock className="w-3 h-3" /> {activity.time}
          </span>
        </div>
        <p className="text-slate-500 mt-0.5 font-medium truncate">{activity.description}</p>
      </div>
    </div>
  );
};
