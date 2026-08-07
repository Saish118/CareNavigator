import React, { useState, useEffect } from "react";
import { BedDouble, RefreshCw, Filter, Sparkles, Navigation, PhoneCall } from "lucide-react";
import { HOSPITALS_DATA } from "../data/hospitalsData";
import { BedBookingModal } from "../components/hospital/BedBookingModal";
import { Button } from "../components/common/Button";
import { useNavigate } from "react-router-dom";
import { useEmergency } from "../context/EmergencyContext";

export const BedTrackerPage = () => {
  const navigate = useNavigate();
  const { setDestination } = useEmergency();
  const [hospitals, setHospitals] = useState(HOSPITALS_DATA);
  const [bedFilter, setBedFilter] = useState("all"); // "all", "icu", "ventilator", "pediatric"
  const [selectedHospitalForBed, setSelectedHospitalForBed] = useState(null);
  const [isLiveUpdating, setIsLiveUpdating] = useState(true);

  // Simulate periodic live telemetry bed updates
  useEffect(() => {
    let interval;
    if (isLiveUpdating) {
      interval = setInterval(() => {
        setHospitals((prev) =>
          prev.map((h) => {
            const randomIcuChange = Math.random() > 0.6 ? (Math.random() > 0.5 ? 1 : -1) : 0;
            const updatedAvailable = Math.max(0, Math.min(h.beds.icu.total, h.beds.icu.available + randomIcuChange));
            return {
              ...h,
              beds: {
                ...h.beds,
                icu: { ...h.beds.icu, available: updatedAvailable },
              },
            };
          })
        );
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isLiveUpdating]);

  const filteredHospitals = hospitals.filter((h) => {
    if (bedFilter === "icu") return h.beds.icu.available > 0;
    if (bedFilter === "ventilator") return h.beds.ventilator.available > 0;
    if (bedFilter === "pediatric") return h.beds.pediatricIcu.available > 0;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-emerald-600 uppercase tracking-wider">
            <BedDouble className="w-4 h-4" /> Live Telemetry Matrix
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Real-Time Regional ICU & Bed Tracker
          </h1>
          <p className="text-sm text-slate-600 font-medium mt-1">
            Live hospital capacity monitor. Updated automatically every 5 seconds.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLiveUpdating((prev) => !prev)}
            className={`px-4 py-2 text-xs font-bold rounded-xl border flex items-center gap-2 transition-all ${
              isLiveUpdating
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-slate-100 text-slate-600 border-slate-200"
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLiveUpdating ? "animate-spin" : ""}`} />
            {isLiveUpdating ? "Live Updates Active" : "Updates Paused"}
          </button>
        </div>
      </div>

      {/* Bed Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/60 w-fit">
        {[
          { label: "All Facilities", value: "all" },
          { label: "ICU Beds Available", value: "icu" },
          { label: "Ventilators Available", value: "ventilator" },
          { label: "Pediatric ICU Beds", value: "pediatric" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setBedFilter(tab.value)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              bedFilter === tab.value
                ? "bg-white text-emerald-700 shadow-sm border border-slate-200/80"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Hospital Bed Matrix Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHospitals.map((hosp) => (
          <div
            key={hosp.id}
            className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-lg space-y-4 hover:border-emerald-300 transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-lg text-slate-900 line-clamp-1">{hosp.name}</h3>
                <p className="text-xs text-slate-500">{hosp.address}</p>
              </div>
              <span className="px-2.5 py-1 text-xs font-black bg-emerald-100 text-emerald-800 rounded-lg shrink-0">
                {hosp.distanceKm} km
              </span>
            </div>

            {/* Bed Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 text-center text-xs pt-2">
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                <span className="block text-[10px] font-bold text-emerald-800 uppercase">Available ICU Beds</span>
                <span className="text-2xl font-black text-emerald-700">{hosp.beds.icu.available}</span>
                <span className="block text-[10px] text-emerald-600 font-semibold">of {hosp.beds.icu.total} Total</span>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200">
                <span className="block text-[10px] font-bold text-sky-800 uppercase">Ventilator Beds</span>
                <span className="text-2xl font-black text-sky-700">{hosp.beds.ventilator.available}</span>
                <span className="block text-[10px] text-sky-600 font-semibold">of {hosp.beds.ventilator.total} Total</span>
              </div>
            </div>

            {/* Additional details */}
            <div className="flex items-center justify-between text-xs text-slate-600 font-medium pt-2 border-t border-slate-100">
              <span>General Ward: <strong className="text-slate-900">{hosp.beds.general.available}</strong> free</span>
              <span>ER Wait: <strong className="text-rose-600">{hosp.erWaitTimeMin}m</strong></span>
            </div>

            {/* Action */}
            <div className="flex items-center gap-2 pt-2">
              <Button
                onClick={() => setSelectedHospitalForBed(hosp)}
                variant="emerald"
                size="sm"
                icon={BedDouble}
                className="w-full"
              >
                Reserve Bed Now
              </Button>
              <Button
                onClick={() => {
                  setDestination(hosp);
                  navigate("/map");
                }}
                variant="glass"
                size="sm"
                icon={Navigation}
              >
                Route
              </Button>
            </div>
          </div>
        ))}
      </div>

      <BedBookingModal
        isOpen={!!selectedHospitalForBed}
        onClose={() => setSelectedHospitalForBed(null)}
        hospital={selectedHospitalForBed}
      />
    </div>
  );
};
