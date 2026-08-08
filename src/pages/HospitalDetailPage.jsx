import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Clock,
  Star,
  Sparkles,
  BedDouble,
  Navigation,
  PhoneCall,
  Bookmark,
  ShieldCheck,
  Award,
  Stethoscope,
  Users,
  Building2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Activity,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { HOSPITALS_DATA } from "../data/hospitalsData";
import { RatingStars } from "../components/status/RatingStars";
import { HospitalStatusIndicator } from "../components/status/HospitalStatusIndicator";
import { PrimaryButton } from "../components/buttons/PrimaryButton";
import { SecondaryButton } from "../components/buttons/SecondaryButton";
import { BedBookingModal } from "../components/hospital/BedBookingModal";
import { HospitalCard } from "../components/hospital/HospitalCard";
import { useEmergency } from "../context/EmergencyContext";
import { useBookmark } from "../context/BookmarkContext";

export const HospitalDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setDestination } = useEmergency();
  const { toggleSaveHospital, isHospitalSaved } = useBookmark();

  const hospital = HOSPITALS_DATA.find((h) => h.id === id) || HOSPITALS_DATA[0];
  const isSaved = isHospitalSaved(hospital.id);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const handleNavigate = () => {
    setDestination(hospital);
    navigate("/map");
  };

  const similarHospitals = HOSPITALS_DATA.filter((h) => h.id !== hospital.id).slice(0, 2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <div className="bg-gradient-to-tr from-slate-900 via-slate-800 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-700 relative overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700/80 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center gap-1.5 text-xs font-bold mr-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 font-extrabold text-xs rounded-full border border-emerald-500/30 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> {hospital.matchScore}% Recommended
            </span>
          </div>

          <div className="flex items-center gap-3">
            <HospitalStatusIndicator status="Operational" />
            <button
              onClick={() => toggleSaveHospital(hospital.id)}
              className={`p-2.5 rounded-full backdrop-blur-md transition-all ${
                isSaved ? "bg-rose-500 text-white shadow-lg" : "bg-slate-800 text-slate-300 hover:text-rose-400"
              }`}
              title={isSaved ? "Remove from saved" : "Save Hospital"}
            >
              <Bookmark className="w-5 h-5 fill-current shrink-0" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Hospital Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">{hospital.name}</h1>
              <p className="text-sm text-slate-300 mt-2 font-medium">{hospital.tagline}</p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 font-medium">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{hospital.address}</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Navigation className="w-4 h-4 shrink-0" />
                <span>{hospital.distanceKm} km away ({hospital.estimatedDriveMin} mins)</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                <Star className="w-4 h-4 fill-amber-300 shrink-0" />
                <span>{hospital.rating} ({hospital.reviewCount} verified reviews)</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <PrimaryButton onClick={handleNavigate} size="lg" icon={Navigation} className="bg-sky-600 hover:bg-sky-700">
                Navigate Now
              </PrimaryButton>

              <a
                href={`tel:${hospital.erDirectPhone}`}
                className="h-12 px-6 text-base font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition-colors inline-flex items-center gap-2 shadow-lg shadow-rose-600/30"
              >
                <PhoneCall className="w-5 h-5 shrink-0" /> Emergency Call ({hospital.erDirectPhone})
              </a>

              <SecondaryButton
                onClick={() => toggleSaveHospital(hospital.id)}
                size="lg"
                icon={Bookmark}
                className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700"
              >
                {isSaved ? "Saved in Passport" : "Save Hospital"}
              </SecondaryButton>
            </div>
          </div>

          {/* Banner Image Preview */}
          <div className="relative h-64 w-full rounded-2xl overflow-hidden border border-slate-700 shadow-xl">
            <img src={hospital.image} alt={hospital.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
              <span className="font-bold bg-slate-900/80 px-3 py-1 rounded-xl backdrop-blur-md">
                Level 1 Trauma Facility
              </span>
              <span className="font-bold bg-rose-600/90 px-3 py-1 rounded-xl backdrop-blur-md">
                ER Wait: {hospital.erWaitTimeMin} mins
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. LIVE HOSPITAL RESOURCE DASHBOARD (7 METRICS) */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Activity className="w-6 h-6 text-emerald-600 shrink-0" /> Live Hospital Resource Telemetry
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs text-center space-y-1">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">General Beds</span>
            <span className="text-2xl font-black text-slate-900">{hospital.beds.general.available}</span>
            <span className="text-[10px] text-slate-500 block font-semibold">of {hospital.beds.general.total} total</span>
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 shadow-xs text-center space-y-1">
            <span className="text-[10px] font-bold text-emerald-800 block uppercase">ICU Beds</span>
            <span className="text-2xl font-black text-emerald-700">{hospital.beds.icu.available}</span>
            <span className="text-[10px] text-emerald-600 block font-semibold">of {hospital.beds.icu.total} total</span>
          </div>

          <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200 shadow-xs text-center space-y-1">
            <span className="text-[10px] font-bold text-sky-800 block uppercase">Oxygen Beds</span>
            <span className="text-2xl font-black text-sky-700">{hospital.beds.oxygen.available}</span>
            <span className="text-[10px] text-sky-600 block font-semibold">of {hospital.beds.oxygen.total} total</span>
          </div>

          <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 shadow-xs text-center space-y-1">
            <span className="text-[10px] font-bold text-purple-800 block uppercase">Ventilators</span>
            <span className="text-2xl font-black text-purple-700">{hospital.beds.ventilator.available}</span>
            <span className="text-[10px] text-purple-600 block font-semibold">of {hospital.beds.ventilator.total} total</span>
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 shadow-xs text-center space-y-1">
            <span className="text-[10px] font-bold text-amber-800 block uppercase">Ambulances</span>
            <span className="text-2xl font-black text-amber-700">{hospital.telemetry.ambulancesAvailable}</span>
            <span className="text-[10px] text-amber-600 block font-semibold">Stationed ER</span>
          </div>

          <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 shadow-xs text-center space-y-1">
            <span className="text-[10px] font-bold text-rose-800 block uppercase">ER Wait Time</span>
            <span className="text-2xl font-black text-rose-700">{hospital.erWaitTimeMin}m</span>
            <span className="text-[10px] text-rose-600 block font-semibold">Immediate Triage</span>
          </div>

          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 shadow-xs text-center space-y-1 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold text-blue-800 block uppercase">Duty Doctors</span>
            <span className="text-2xl font-black text-blue-700">{hospital.doctorsOnDuty.length}</span>
            <span className="text-[10px] text-blue-600 block font-semibold">On Shift Now</span>
          </div>
        </div>
      </section>

      {/* 3. DOCTORS ON DUTY & HOSPITAL FACILITIES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Doctors Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600 shrink-0" /> Doctors On Duty
          </h2>

          <div className="space-y-3">
            {hospital.doctorsOnDuty.map((doc, idx) => (
              <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
                <img src={doc.image} alt={doc.name} className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0" />
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 text-sm">{doc.name}</h4>
                  <p className="text-xs text-slate-500 font-medium">{doc.specialty} • {doc.experienceYears} yrs exp</p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-md">
                    {doc.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Facilities Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600 shrink-0" /> Hospital Facilities & Tech
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {hospital.facilities.map((fac, i) => (
              <div key={i} className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2.5 text-xs font-bold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{fac}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. HOSPITAL INFORMATION & ASSESSMENT SUMMARY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Hospital Information (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600 shrink-0" /> Hospital Information
          </h2>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            <p>{hospital.description}</p>

            <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="font-bold text-slate-900 block">Accepted Insurance Networks:</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {hospital.insuranceAccepted.map((ins, i) => (
                    <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold">
                      {ins}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-900 block">Emergency Direct Contacts:</span>
                <p className="mt-1 text-xs text-slate-600">
                  Direct Triage Desk: <strong>{hospital.erDirectPhone}</strong><br />
                  Helipad Dispatch: <strong>+1 (800) 555-HELI</strong>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Assessment Summary (1 col) */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-emerald-600 shrink-0" /> Hospital Assessment Summary
          </h2>

          <div className="bg-gradient-to-br from-emerald-900 via-slate-900 to-teal-950 text-white p-6 rounded-3xl border border-slate-800 shadow-lg space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <span className="font-bold text-emerald-400">Match Rank score</span>
              <span className="text-lg font-black text-white">{hospital.matchScore}%</span>
            </div>

            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Level 1 Trauma capability with 24/7 senior surgeon availability.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{hospital.beds.icu.available} open ICU beds ready for immediate patient admission.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Average ER wait time is under 10 minutes.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 5. MAP PREVIEW & PATIENT REVIEWS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map Preview */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Map & Siren Route</h2>
          <div className="bg-slate-900 p-5 rounded-3xl text-white space-y-4 border border-slate-800 shadow-md">
            <div className="h-44 bg-slate-800 rounded-2xl border border-slate-700 flex items-center justify-center text-center p-4">
              <p className="text-xs text-sky-400 font-bold">
                📍 Mock Vector Route Preview to {hospital.name}<br />
                {hospital.distanceKm} km ({hospital.estimatedDriveMin} mins drive time)
              </p>
            </div>
            <PrimaryButton onClick={handleNavigate} fullWidth icon={Navigation}>
              Launch Siren Navigation
            </PrimaryButton>
          </div>
        </div>

        {/* Patient Reviews (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Verified Patient Reviews</h2>
          <div className="space-y-3">
            {hospital.reviews.map((rev, i) => (
              <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{rev.user}</span>
                  <RatingStars rating={rev.rating} />
                </div>
                <p className="text-slate-600 leading-relaxed font-medium">{rev.comment}</p>
                <span className="text-[10px] text-slate-400 block pt-1 border-t border-slate-100">{rev.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. SIMILAR HOSPITALS */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Similar Recommended Facilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {similarHospitals.map((h) => (
            <HospitalCard
              key={h.id}
              hospital={h}
              onNavigate={() => {
                setDestination(h);
                navigate("/map");
              }}
              onBookBed={() => setIsBookingOpen(true)}
              onSelectDetails={(selected) => navigate(`/hospital/${selected.id}`)}
            />
          ))}
        </div>
      </section>

      {/* Booking Modal */}
      <BedBookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        hospital={hospital}
      />
    </div>
  );
};
