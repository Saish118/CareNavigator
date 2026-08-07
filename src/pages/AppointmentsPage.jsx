import React from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, ArrowLeft, Plus } from "lucide-react";
import { Breadcrumb } from "../components/ui/Breadcrumb";
import { BookingHistory } from "../components/profile/BookingHistory";
import { PrimaryButton } from "../components/buttons/PrimaryButton";

export const AppointmentsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumb items={[{ label: "Dashboard", path: "/dashboard" }, { label: "Appointments & Holds" }]} />
        <button
          onClick={() => navigate(-1)}
          className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Bed Holds & Consultation Appointments</h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage your active ICU bed reservations, ER holds, and specialist appointments.
          </p>
        </div>
        <PrimaryButton onClick={() => navigate("/appointments/book")} icon={Plus}>
          Book New Bed / Appointment
        </PrimaryButton>
      </div>

      <BookingHistory />
    </div>
  );
};
