import React from "react";
import { BedDouble, Clock, CheckCircle2 } from "lucide-react";

export const RecentAppointmentCard = ({
  appointment = {
    hospitalName: "Mercy General Medical Center",
    patientName: "Sai Joshi",
    bedType: "ICU Bed",
    status: "Confirmed",
    refCode: "CN-884920",
    time: "15 mins ago",
  },
}) => {
  return (
    <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-between text-xs">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
          <BedDouble className="w-5 h-5" />
        </div>
        <div>
          <h5 className="font-bold text-slate-900">{appointment.hospitalName}</h5>
          <span className="text-slate-500 text-[11px] block">
            {appointment.patientName} • <strong className="text-blue-600">{appointment.bedType}</strong>
          </span>
        </div>
      </div>

      <div className="text-right">
        <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-md block w-fit ml-auto">
          {appointment.status}
        </span>
        <span className="text-[10px] text-slate-400 mt-0.5 block">{appointment.refCode}</span>
      </div>
    </div>
  );
};
