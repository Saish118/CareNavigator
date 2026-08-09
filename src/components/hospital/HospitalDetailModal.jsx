import React from "react";
import { Modal } from "../common/Modal";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";
import { useToast } from "../ui/ToastNotification";
import { openHospitalDirections } from "../../utils/navigationUtils";
import {
  MapPin,
  PhoneCall,
  Clock,
  Navigation,
  BedDouble,
  ShieldCheck,
  Star,
  UserCheck,
  CheckCircle2,
  Plane,
  HeartPulse,
} from "lucide-react";

export const HospitalDetailModal = ({
  isOpen,
  onClose,
  hospital,
  onNavigate,
}) => {
  const { addToast } = useToast();
  if (!hospital) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={hospital.name}
      subtitle={hospital.tagline}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">
        {/* Banner image & key specs */}
        <div className="relative h-56 rounded-2xl overflow-hidden bg-slate-900">
          <img
            src={hospital.image}
            alt={hospital.name}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/30 to-transparent" />

          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 text-white">
            <div className="flex items-center gap-2">
              <Badge variant="success" size="lg">
                {hospital.matchScore}% AI Match
              </Badge>
              <Badge variant="slate" size="sm">
                {hospital.traumaLevel}
              </Badge>
            </div>

            <div className="flex items-center gap-3 text-xs font-bold bg-slate-900/80 px-3 py-1.5 rounded-xl border border-white/10">
              <span className="flex items-center gap-1 text-amber-400">
                <Star className="w-4 h-4 fill-current" /> {hospital.rating} ({hospital.reviewCount} reviews)
              </span>
              <span className="text-slate-400">|</span>
              <span className="text-rose-400 flex items-center gap-1">
                <Clock className="w-4 h-4" /> Wait: {hospital.erWaitTimeMin} min
              </span>
            </div>
          </div>
        </div>

        {/* Real-time Bed Inventory */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
            <BedDouble className="w-4 h-4 text-sky-600" /> Live Hospital Bed Matrix
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
              <span className="block text-[10px] text-slate-500 font-bold uppercase">ICU Beds</span>
              <span className="text-lg font-black text-emerald-600">{hospital.beds.icu.available}</span>
              <span className="block text-[10px] text-slate-400">of {hospital.beds.icu.total} total</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
              <span className="block text-[10px] text-slate-500 font-bold uppercase">Ventilators</span>
              <span className="text-lg font-black text-sky-600">{hospital.beds.ventilator.available}</span>
              <span className="block text-[10px] text-slate-400">of {hospital.beds.ventilator.total} total</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
              <span className="block text-[10px] text-slate-500 font-bold uppercase">Pediatric ICU</span>
              <span className="text-lg font-black text-purple-600">{hospital.beds.pediatricIcu.available}</span>
              <span className="block text-[10px] text-slate-400">available</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
              <span className="block text-[10px] text-slate-500 font-bold uppercase">General Wards</span>
              <span className="text-lg font-black text-slate-800">{hospital.beds.general.available}</span>
              <span className="block text-[10px] text-slate-400">available</span>
            </div>
          </div>
        </div>

        {/* Doctors on Duty */}
        {hospital.doctorsOnDuty && (
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600" /> ER On-Call Doctors
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {hospital.doctorsOnDuty.map((doc, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">{doc.name}</span>
                    <span className="text-slate-500 text-[11px]">{doc.role}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${doc.status === "Available" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Specialties & Amenities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <h4 className="font-extrabold text-slate-800 uppercase tracking-wider mb-2">
              Clinical Specialties
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {hospital.specialties.map((s, i) => (
                <span key={i} className="px-2.5 py-1 bg-white text-slate-700 font-medium rounded-lg border border-slate-200">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <h4 className="font-extrabold text-slate-800 uppercase tracking-wider mb-2">
              Key Facilities & Tech
            </h4>
            <ul className="space-y-1.5">
              {hospital.amenities.map((a, i) => (
                <li key={i} className="flex items-center gap-2 text-slate-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Insurance Accepted */}
        <div>
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-600" /> Accepted Insurance Networks
          </h4>
          <div className="flex flex-wrap gap-2 text-xs">
            {hospital.insuranceAccepted.map((ins, i) => (
              <span key={i} className="px-3 py-1 bg-sky-50 text-sky-800 font-bold rounded-xl border border-sky-200/80">
                {ins}
              </span>
            ))}
          </div>
        </div>

        {/* Actions Footer */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <a
            href={`tel:${hospital.phone}`}
            className="text-xs font-bold text-slate-600 hover:text-sky-600 flex items-center gap-1.5"
          >
            <PhoneCall className="w-4 h-4 text-slate-400" />
            General Phone: {hospital.phone}
          </a>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => openHospitalDirections(hospital, addToast)}
              variant="secondary"
              size="md"
              icon={Navigation}
            >
              Get Directions
            </Button>

            <Button
              onClick={() => {
                onClose();
                onNavigate(hospital);
              }}
              variant="emerald"
              size="md"
              icon={MapPin}
            >
              Emergency Map
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
