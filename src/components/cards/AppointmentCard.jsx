import React from "react";
import { Clock, BedDouble } from "lucide-react";
import { SecondaryButton } from "../buttons/SecondaryButton";

export const AppointmentCard = ({
  appointment = {
    referenceNumber: "CN-994821",
    hospitalName: "Mercy General Medical Center",
    bedType: "ICU Bed (Ventilator Capable)",
    patientName: "Sai Joshi",
    date: "Today, 18:30 PM",
    status: "Confirmed Hold",
    address: "1200 Health Parkway, Metro City",
  },
  onCancel,
}) => {
  return (
    <div className="h-full flex flex-col justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <BedDouble className="w-5 h-5 text-blue-600 shrink-0" />
            <span className="font-bold text-slate-900 text-sm">{appointment.hospitalName}</span>
          </div>
          <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-md shrink-0">
            {appointment.status}
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span className="text-slate-400">Ref Code:</span>
            <span className="font-mono font-bold text-slate-900">{appointment.referenceNumber}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span className="text-slate-400">Patient:</span>
            <span className="font-bold text-slate-900">{appointment.patientName}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span className="text-slate-400">Bed Type:</span>
            <span className="font-bold text-blue-600">{appointment.bedType}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 pt-1">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{appointment.date}</span>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
        <SecondaryButton onClick={onCancel} size="sm">
          Cancel Reservation
        </SecondaryButton>
      </div>
    </div>
  );
};
