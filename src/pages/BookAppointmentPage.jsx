import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, ArrowLeft, BedDouble } from "lucide-react";
import { Breadcrumb } from "../components/ui/Breadcrumb";
import { TextInput } from "../components/inputs/TextInput";
import { SelectInput } from "../components/inputs/SelectInput";
import { DatePicker } from "../components/inputs/DatePicker";
import { PrimaryButton } from "../components/buttons/PrimaryButton";
import { HOSPITALS_DATA } from "../data/hospitalsData";
import { useToast } from "../components/ui/ToastNotification";

export const BookAppointmentPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [patientName, setPatientName] = useState("Sai Joshi");
  const [selectedHospital, setSelectedHospital] = useState(HOSPITALS_DATA[0].name);
  const [bedType, setBedType] = useState("ICU Bed");
  const [date, setDate] = useState("2026-08-07");

  const handleSubmit = (e) => {
    e.preventDefault();
    addToast("Appointment booked successfully! Hold code generated.", "success");
    setTimeout(() => navigate("/appointments"), 800);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumb items={[{ label: "Appointments", path: "/appointments" }, { label: "Book Appointment" }]} />
        <button
          onClick={() => navigate(-1)}
          className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl max-w-xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100">
            <Calendar className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Book Hospital Bed or Specialist</h1>
          <p className="text-xs text-slate-500 font-medium">
            Direct priority hold at 500+ verified partner hospitals.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <TextInput
            label="Patient Name"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            required
          />

          <SelectInput
            label="Target Hospital"
            value={selectedHospital}
            onChange={(e) => setSelectedHospital(e.target.value)}
            options={HOSPITALS_DATA.map((h) => h.name)}
          />

          <SelectInput
            label="Bed / Department Type"
            value={bedType}
            onChange={(e) => setBedType(e.target.value)}
            options={["ICU Bed (Ventilator)", "Pediatric ICU", "Oxygen Ward", "General Emergency"]}
          />

          <DatePicker
            label="Hold Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <PrimaryButton type="submit" size="lg" fullWidth icon={BedDouble}>
            Confirm Bed Reservation
          </PrimaryButton>
        </form>
      </div>
    </div>
  );
};
