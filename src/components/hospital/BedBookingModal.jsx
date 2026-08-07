import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Modal } from "../common/Modal";
import { Button } from "../common/Button";
import { BedDouble, CheckCircle2, AlertCircle, Clock, ShieldCheck } from "lucide-react";
import { bookingService } from "../../services/bookingService";

export const BedBookingModal = ({ isOpen, onClose, hospital, onBookingSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      patientName: "",
      contactNumber: "",
      patientAge: "",
      bedType: "icu",
      triageSeverity: "High Urgency",
      estimatedArrivalMin: 15,
      medicalNotes: "",
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await bookingService.createReservation({
        hospitalId: hospital.id,
        hospitalName: hospital.name,
        address: hospital.address,
        ...data,
      });
      setConfirmedBooking(result);
      if (onBookingSuccess) onBookingSuccess(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setConfirmedBooking(null);
    reset();
    onClose();
  };

  if (!hospital) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={confirmedBooking ? "Bed Reserved Successfully" : `Reserve Bed at ${hospital.name}`}
      subtitle={
        confirmedBooking
          ? "Show reference code to ER Triage team upon arrival"
          : "Instant priority bed hold with emergency triage registration"
      }
    >
      {!confirmedBooking ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="bg-sky-50 border border-sky-200 p-3 rounded-2xl flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-sky-900 block">{hospital.name}</span>
              <span className="text-sky-700">ICU Beds Available: {hospital.beds.icu.available}</span>
            </div>
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg border border-emerald-200">
              Direct ER Hold
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Patient Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Patient Full Name *
              </label>
              <input
                type="text"
                {...register("patientName", { required: "Patient name is required" })}
                placeholder="e.g. John Doe"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10"
              />
              {errors.patientName && (
                <span className="text-xs text-rose-600 font-semibold mt-1 block">
                  {errors.patientName.message}
                </span>
              )}
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Emergency Contact Phone *
              </label>
              <input
                type="tel"
                {...register("contactNumber", {
                  required: "Phone number is required",
                  pattern: { value: /^[0-9+-\s()]{7,15}$/, message: "Enter valid phone number" },
                })}
                placeholder="+1 (555) 019-2834"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10"
              />
              {errors.contactNumber && (
                <span className="text-xs text-rose-600 font-semibold mt-1 block">
                  {errors.contactNumber.message}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Patient Age */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Patient Age *
              </label>
              <input
                type="number"
                {...register("patientAge", { required: "Age is required", min: 0, max: 120 })}
                placeholder="e.g. 54"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10"
              />
              {errors.patientAge && (
                <span className="text-xs text-rose-600 font-semibold mt-1 block">
                  {errors.patientAge.message}
                </span>
              )}
            </div>

            {/* Bed Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Bed Type Required
              </label>
              <select
                {...register("bedType")}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-sky-500"
              >
                <option value="icu">ICU Bed (Ventilator Capable)</option>
                <option value="pediatricIcu">Pediatric ICU</option>
                <option value="oxygen">Oxygen Ward Bed</option>
                <option value="general">General Emergency Ward</option>
              </select>
            </div>

            {/* ETA minutes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Estimated Arrival (Mins)
              </label>
              <input
                type="number"
                {...register("estimatedArrivalMin", { min: 1, max: 180 })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Medical Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Brief Medical Condition / Chief Complaint
            </label>
            <textarea
              {...register("medicalNotes")}
              rows="2"
              placeholder="e.g. Acute chest pain, blood pressure elevated, history of hypertension..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-sky-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button type="button" onClick={handleClose} variant="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="emerald" disabled={isSubmitting} icon={BedDouble}>
              {isSubmitting ? "Holding Bed..." : "Confirm Instant Bed Reservation"}
            </Button>
          </div>
        </form>
      ) : (
        /* Booking Confirmation State */
        <div className="text-center space-y-5 py-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase text-slate-400">Reservation Reference Code</span>
            <div className="text-3xl font-black text-sky-600 tracking-wider my-1 bg-sky-50 py-2 rounded-2xl border border-sky-200 w-fit mx-auto px-6">
              {confirmedBooking.referenceNumber}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              A copy of this reservation has been logged to your Medical ID & Profile page.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
            <div className="flex justify-between border-b pb-1">
              <span className="text-slate-500">Patient Name:</span>
              <span className="font-bold text-slate-900">{confirmedBooking.patientName}</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="text-slate-500">Hospital:</span>
              <span className="font-bold text-slate-900">{confirmedBooking.hospitalName}</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="text-slate-500">Bed Type:</span>
              <span className="font-bold text-emerald-700 uppercase">{confirmedBooking.bedType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Hold Timeout:</span>
              <span className="font-bold text-rose-600">Active for 45 Mins</span>
            </div>
          </div>

          <Button onClick={handleClose} variant="primary" className="w-full">
            Done & Return
          </Button>
        </div>
      )}
    </Modal>
  );
};
