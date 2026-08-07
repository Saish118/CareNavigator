import React, { useState, useEffect } from "react";
import { BedDouble, Clock, CheckCircle2, Trash2, MapPin } from "lucide-react";
import { bookingService } from "../../services/bookingService";
import { Button } from "../common/Button";

export const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    setBookings(bookingService.getLocalBookings());
  }, []);

  const handleCancel = async (id) => {
    await bookingService.cancelReservation(id);
    setBookings(bookingService.getLocalBookings());
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
          <BedDouble className="w-5 h-5 text-sky-600" />
          Active Bed Reservations & History
        </h3>
        <span className="text-xs font-bold text-slate-500">
          {bookings.length} Saved Reservations
        </span>
      </div>

      {bookings.length === 0 ? (
        <div className="py-8 text-center text-slate-400 space-y-2">
          <BedDouble className="w-12 h-12 mx-auto text-slate-300" />
          <p className="text-sm font-semibold">No active bed reservations found.</p>
          <p className="text-xs">Use the Hospital Recommender or Bed Tracker to reserve emergency beds.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 text-sm">{b.hospitalName}</span>
                  <span className="px-2.5 py-0.5 bg-sky-100 text-sky-800 font-extrabold rounded-md">
                    Ref: {b.referenceNumber}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-slate-500 font-medium">
                  <span>Patient: {b.patientName}</span>
                  <span>•</span>
                  <span className="uppercase text-emerald-700 font-bold">Bed: {b.bedType}</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Booked at: {new Date(b.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <Button
                  onClick={() => handleCancel(b.id)}
                  variant="outline"
                  size="sm"
                  icon={Trash2}
                  className="text-rose-600 border-rose-200 hover:bg-rose-50"
                >
                  Cancel Hold
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
