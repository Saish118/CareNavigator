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
} from "lucide-react";

export const HospitalDetailModal = ({
  isOpen,
  onClose,
  hospital,
  onNavigate,
}) => {
  const { addToast } = useToast();
  if (!hospital) return null;

  // Safe Defensiveness Helpers
  const name = hospital.name || "Government Hospital";
  const tagline = hospital.tagline || "Official DMER Maharashtra Facility";
  const image = hospital.image || "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80";
  const matchScore = hospital.matchScore || 90;
  const traumaLevel = hospital.traumaLevel || "Government Emergency Casualty";
  const rating = hospital.rating ? `★ ${hospital.rating}` : "Official DMER Govt Facility";
  const reviewCountStr = hospital.reviewCount && hospital.reviewCount > 0 ? ` (${hospital.reviewCount} reviews)` : "";
  const waitTimeStr = hospital.erWaitTimeMin ? `${hospital.erWaitTimeMin} min` : "24/7 ER";

  const totalBeds = hospital.beds?.total || hospital.beds?.general || "Govt Managed";
  const icuBeds = hospital.beds?.icu?.available != null ? hospital.beds.icu.available : "Not reported";
  const ventBeds = hospital.beds?.ventilator?.available != null ? hospital.beds.ventilator.available : "Not reported";

  const specialties = Array.isArray(hospital.specialties) ? hospital.specialties : [];
  const amenities = Array.isArray(hospital.amenities)
    ? hospital.amenities
    : Array.isArray(hospital.facilities)
    ? hospital.facilities
    : ["24/7 Casualty Ward", "Blood Bank Support"];

  const insuranceAccepted = Array.isArray(hospital.insuranceAccepted)
    ? hospital.insuranceAccepted
    : ["Mahatma Jyotirao Phule Jan Arogya Yojana (MJPJAY)", "Ayushman Bharat (PMJAY)"];

  const phone = hospital.phone || hospital.erDirectPhone || null;
  const doctors = Array.isArray(hospital.doctorsOnDuty) ? hospital.doctorsOnDuty : [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={name}
      subtitle={tagline}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">
        {/* Banner image & key specs */}
        <div className="relative h-56 rounded-2xl overflow-hidden bg-slate-900">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/30 to-transparent" />

          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 text-white">
            <div className="flex items-center gap-2">
              <Badge variant="success" size="lg">
                {matchScore}% Match
              </Badge>
              <Badge variant="slate" size="sm">
                {traumaLevel}
              </Badge>
            </div>

            <div className="flex items-center gap-3 text-xs font-bold bg-slate-900/80 px-3 py-1.5 rounded-xl border border-white/10">
              <span className="flex items-center gap-1 text-amber-400">
                <Star className="w-4 h-4 fill-current" /> {rating}{reviewCountStr}
              </span>
              <span className="text-slate-400">|</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <Clock className="w-4 h-4" /> {waitTimeStr}
              </span>
            </div>
          </div>
        </div>

        {/* Real-time Bed Inventory */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
            <BedDouble className="w-4 h-4 text-sky-600" /> Official DMER Hospital Capacity & Tech
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="block text-[10px] text-slate-500 font-bold uppercase">Total Govt Beds</span>
              <span className="text-lg font-black text-slate-800">{totalBeds}</span>
              <span className="block text-[10px] text-slate-400">Official Capacity</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="block text-[10px] text-slate-500 font-bold uppercase">ICU Bed Status</span>
              <span className="text-base font-black text-emerald-600">{icuBeds}</span>
              <span className="block text-[10px] text-slate-400">Emergency Casualty</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="block text-[10px] text-slate-500 font-bold uppercase">Ventilators</span>
              <span className="text-base font-black text-sky-600">{ventBeds}</span>
              <span className="block text-[10px] text-slate-400">Life Support</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="block text-[10px] text-slate-500 font-bold uppercase">CT & MRI Facility</span>
              <span className="text-xs font-black text-purple-700 mt-1 block">
                {hospital.hasCtMri ? "Available Onsite" : "Standard Radiology"}
              </span>
              <span className="block text-[10px] text-slate-400">DMER Listed</span>
            </div>
          </div>
        </div>

        {/* Doctors on Duty / Staff Roster */}
        <div>
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-600" /> Medical Officers & Clinical Roster
          </h4>
          {doctors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {doctors.map((doc, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">{doc.name || "Medical Officer"}</span>
                    <span className="text-slate-500 text-[11px]">{doc.specialty || doc.role || "Casualty Resident"}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800">
                    {doc.status || "On Duty"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 text-xs font-medium">
              Official DMER Medical Officers & Resident Doctors are on 24/7 rotational duty at the Casualty desk.
            </div>
          )}
        </div>

        {/* Specialties & Amenities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <h4 className="font-extrabold text-slate-800 uppercase tracking-wider mb-2">
              Clinical Specialties
            </h4>
            {specialties.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {specialties.map((s, i) => (
                  <span key={i} className="px-2.5 py-1 bg-white text-slate-700 font-medium rounded-lg border border-slate-200">
                    {s}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 italic">General Medicine, General Surgery & Casualty</p>
            )}
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <h4 className="font-extrabold text-slate-800 uppercase tracking-wider mb-2">
              Key Facilities & Tech
            </h4>
            <ul className="space-y-1.5">
              {amenities.map((a, i) => (
                <li key={i} className="flex items-center gap-2 text-slate-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Insurance Accepted */}
        <div>
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-600" /> Accepted Government Health Schemes
          </h4>
          <div className="flex flex-wrap gap-2 text-xs">
            {insuranceAccepted.map((ins, i) => (
              <span key={i} className="px-3 py-1 bg-sky-50 text-sky-800 font-bold rounded-xl border border-sky-200/80">
                {ins}
              </span>
            ))}
          </div>
        </div>

        {/* Actions Footer */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          {phone ? (
            <a
              href={`tel:${phone}`}
              className="text-xs font-bold text-slate-600 hover:text-sky-600 flex items-center gap-1.5"
            >
              <PhoneCall className="w-4 h-4 text-slate-400" />
              General Phone: {phone}
            </a>
          ) : (
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-slate-300" />
              Phone: Contact ER Desk Onsite
            </span>
          )}

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
