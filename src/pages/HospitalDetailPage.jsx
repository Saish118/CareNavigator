import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  PhoneCall,
  Clock,
  BedDouble,
  Navigation,
  Star,
  CheckCircle2,
  Sparkles,
  Bookmark,
  Activity,
  Building,
  Stethoscope,
  Award,
} from "lucide-react";
import { HOSPITALS_DATA } from "../data/hospitalsData";
import { PrimaryButton } from "../components/buttons/PrimaryButton";
import { SecondaryButton } from "../components/buttons/SecondaryButton";
import { BedBookingModal } from "../components/hospital/BedBookingModal";
import { HospitalCard } from "../components/hospital/HospitalCard";
import { ReviewCard } from "../components/cards/ReviewCard";
import { useEmergency } from "../context/EmergencyContext";
import { useBookmark } from "../context/BookmarkContext";
import { useToast } from "../components/ui/ToastNotification";

export const HospitalDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setDestination } = useEmergency();
  const { toggleSaveHospital, isHospitalSaved } = useBookmark();
  const { addToast } = useToast();

  const [hospital, setHospital] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    const found = HOSPITALS_DATA.find((h) => h.id === id) || HOSPITALS_DATA[0];
    setHospital(found);
  }, [id]);

  if (!hospital) return null;

  const isSaved = isHospitalSaved(hospital.id);

  const handleNavigate = () => {
    setDestination(hospital);
    navigate("/map");
  };

  const similarHospitals = HOSPITALS_DATA.filter((h) => h.id !== hospital.id).slice(0, 2);

  const reviewsData = [
    {
      patientName: "Marcus Vance",
      hospitalName: hospital.name,
      rating: 5,
      date: "3 days ago",
      comment:
        "The emergency siren routing saved precious minutes during my father's cardiac event. The ICU bed was ready the second our ambulance arrived.",
      verified: true,
    },
    {
      patientName: "Dr. Elena Rostova",
      hospitalName: hospital.name,
      rating: 5,
      date: "1 week ago",
      comment:
        "Outstanding ER triage response time and state-of-the-art ventilator capability. The doctors on duty were coordinated and attentive.",
      verified: true,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" /> Back to Hospital List
        </button>
      </div>

      {/* 1. HERO SECTION */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden space-y-6">
        <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-slate-950">
          <img
            src={hospital.image}
            alt={hospital.name}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Badges Overlay */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 z-10">
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1.5 bg-emerald-500 text-white font-black text-xs rounded-full shadow-lg flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 shrink-0" />
                {hospital.matchScore}% AI Match Score
              </span>
              <span className="px-3 py-1 bg-slate-900/80 backdrop-blur-md text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/40 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                Open 24/7 Triage
              </span>
            </div>

            <button
              onClick={() => toggleSaveHospital(hospital.id)}
              className={`p-3 rounded-full backdrop-blur-md transition-all shadow-md cursor-pointer ${
                isSaved
                  ? "bg-rose-500 text-white"
                  : "bg-white/80 hover:bg-white text-slate-700 hover:text-rose-600"
              }`}
              title={isSaved ? "Saved in Medical Passport" : "Save Hospital"}
            >
              <Bookmark className="w-5 h-5 fill-current shrink-0" />
            </button>
          </div>

          {/* Title & Key Quick Metrics Overlay */}
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2 z-10">
            <span className="px-2.5 py-0.5 bg-blue-600/90 text-white font-extrabold text-[10px] uppercase rounded-md">
              {hospital.traumaLevel}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black">{hospital.name}</h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl">
              {hospital.tagline}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs pt-2 font-semibold text-slate-200">
              <span className="flex items-center gap-1 text-amber-400">
                <Star className="w-4 h-4 fill-amber-400 shrink-0" />
                <strong>{hospital.rating}</strong> ({hospital.reviewCount} reviews)
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                {hospital.distanceKm} km away ({hospital.estimatedDriveMin} mins ETA)
              </span>
              <span className="flex items-center gap-1 text-rose-400">
                <Clock className="w-4 h-4 shrink-0" />
                ER Wait: <strong>{hospital.erWaitTimeMin} mins</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="p-6 pt-0 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <PrimaryButton onClick={handleNavigate} size="lg" icon={Navigation}>
            Navigate
          </PrimaryButton>

          <PrimaryButton onClick={() => setIsBookingOpen(true)} size="lg" icon={BedDouble} className="bg-emerald-600 hover:bg-emerald-700">
            Book Appointment / Bed
          </PrimaryButton>

          <a
            href={`tel:${hospital.erDirectPhone}`}
            className="h-12 px-4 inline-flex items-center justify-center font-black text-sm rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 transition-all gap-2 cursor-pointer"
          >
            <PhoneCall className="w-4 h-4 shrink-0" /> Call Emergency
          </a>

          <SecondaryButton
            onClick={() => {
              toggleSaveHospital(hospital.id);
              addToast(isSaved ? "Removed from saved" : "Saved to Passport", "info");
            }}
            size="lg"
            icon={Bookmark}
            className={isSaved ? "bg-rose-50 text-rose-700 border-rose-200" : ""}
          >
            {isSaved ? "Saved in Passport" : "Save Hospital"}
          </SecondaryButton>
        </div>
      </div>

      {/* 2. LIVE HOSPITAL RESOURCE DASHBOARD */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-black text-emerald-600 uppercase tracking-wider">
              <Activity className="w-4 h-4 animate-pulse" /> Live Telemetry Dashboard
            </div>
            <h2 className="text-2xl font-black text-slate-900">Hospital Real-Time Resource Capacity</h2>
          </div>
          <span className="text-xs text-slate-400 font-semibold">
            Telemetry sync: <strong>Every 5 seconds</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">General Beds</span>
            <span className="text-xl font-black text-slate-900">{hospital.beds.general.available} / {hospital.beds.general.total}</span>
            <span className="text-[10px] text-emerald-600 font-bold block">Available</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">ICU Beds</span>
            <span className="text-xl font-black text-emerald-700">{hospital.beds.icu.available} / {hospital.beds.icu.total}</span>
            <span className="text-[10px] text-emerald-600 font-bold block">Open</span>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-center space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Oxygen Beds</span>
            <span className="text-xl font-black text-blue-700">{hospital.beds.oxygen?.available || 12} / {hospital.beds.oxygen?.total || 50}</span>
            <span className="text-[10px] text-blue-600 font-bold block">Active</span>
          </div>

          <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-center space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Ventilators</span>
            <span className="text-xl font-black text-sky-700">{hospital.beds.ventilator.available} / {hospital.beds.ventilator.total}</span>
            <span className="text-[10px] text-sky-600 font-bold block">Ready</span>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Ambulances</span>
            <span className="text-xl font-black text-rose-700">6 Units</span>
            <span className="text-[10px] text-rose-600 font-bold block">Active Fleet</span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Wait Time</span>
            <span className="text-xl font-black text-amber-700">{hospital.erWaitTimeMin} Mins</span>
            <span className="text-[10px] text-amber-600 font-bold block">Avg Triage</span>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-center space-y-1 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Doctors On Duty</span>
            <span className="text-xl font-black text-purple-700">{hospital.doctorsOnDuty.length + 8} Active</span>
            <span className="text-[10px] text-purple-600 font-bold block">Specialists</span>
          </div>
        </div>
      </div>

      {/* 3. AI RECOMMENDATION SUMMARY & CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: AI Summary, Doctors & Facilities */}
        <div className="lg:col-span-2 space-y-8">
          {/* AI Recommendation Summary */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-950 p-6 sm:p-8 rounded-3xl text-white shadow-lg space-y-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-amber-400 tracking-wider">
              <Sparkles className="w-4 h-4" /> AI Recommendation Evaluation
            </div>
            <h3 className="text-xl font-black">Why CareNavigator Recommends {hospital.name}</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Ranked with a <strong>{hospital.matchScore}% clinical match score</strong> based on real-time open ICU bed capacity, short 5-minute ER triage response, and verified specialty coverage for your location.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Proximity Match</span>
                <span className="text-sm font-bold text-emerald-400">99% Optimal</span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">ICU Capacity</span>
                <span className="text-sm font-bold text-blue-400">{hospital.beds.icu.available} Beds Free</span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Specialty Coverage</span>
                <span className="text-sm font-bold text-purple-400">100% Matched</span>
              </div>
            </div>
          </div>

          {/* Doctors On Duty */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-blue-600" /> Doctors Currently On Duty
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {hospital.doctorsOnDuty.map((doc, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-xs shrink-0">
                    Dr
                  </div>
                  <div className="min-w-0">
                    <h5 className="font-bold text-slate-900 text-sm truncate">{doc.name}</h5>
                    <p className="text-xs text-blue-600 font-semibold truncate">{doc.role}</p>
                    <span className="text-[10px] font-bold text-emerald-600">● {doc.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hospital Facilities */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Building className="w-5 h-5 text-emerald-600" /> Medical Facilities & Infrastructure
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {hospital.amenities.map((amenity, i) => (
                <div key={i} className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center gap-2 text-xs font-bold text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Patient Reviews */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xl font-black text-slate-900">Verified Patient Reviews</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {reviewsData.map((r, i) => (
                <ReviewCard key={i} review={r} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Hospital Info, Map Preview & Similar Hospitals */}
        <div className="space-y-8">
          {/* Hospital Information */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs">
            <h3 className="text-lg font-black text-slate-900 border-b pb-3">Facility Information</h3>
            <div className="space-y-3 text-slate-600">
              <div>
                <span className="text-slate-400 font-bold block text-[10px] uppercase">Address</span>
                <span className="font-bold text-slate-900 text-sm">{hospital.address}, {hospital.city} {hospital.zip}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block text-[10px] uppercase">ER Direct Phone</span>
                <a href={`tel:${hospital.erDirectPhone}`} className="font-bold text-rose-600 hover:underline text-sm">
                  {hospital.erDirectPhone}
                </a>
              </div>
              <div>
                <span className="text-slate-400 font-bold block text-[10px] uppercase">General Desk</span>
                <span className="font-bold text-slate-900">{hospital.phone}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block text-[10px] uppercase">Accreditation</span>
                <span className="font-bold text-emerald-700">JCI & NABH Level 1 Accredited</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block text-[10px] uppercase">Operating Hours</span>
                <span className="font-bold text-slate-900">24/7 Emergency & Triage Desk</span>
              </div>
            </div>
          </div>

          {/* Interactive Mock Map Preview */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-black text-slate-900">Location Map Preview</h3>
            <div className="relative h-48 rounded-2xl bg-slate-900 overflow-hidden flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 300 150">
                <path d="M 30 120 Q 120 30 270 80" stroke="#10b981" strokeWidth="4" fill="none" strokeDasharray="6 3" />
                <circle cx="30" cy="120" r="10" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
                <circle cx="270" cy="80" r="12" fill="#e11d48" stroke="#ffffff" strokeWidth="2" />
                <text x="45" y="125" fill="#38bdf8" fontSize="10" fontWeight="bold">GPS</text>
                <text x="180" y="70" fill="#f43f5e" fontSize="10" fontWeight="bold">{hospital.name}</text>
              </svg>
              <div className="absolute bottom-2 left-2 right-2 bg-slate-900/90 text-white p-2 rounded-xl text-[11px] font-bold flex justify-between">
                <span>Distance: {hospital.distanceKm} km</span>
                <span className="text-emerald-400">Drive: {hospital.estimatedDriveMin} mins</span>
              </div>
            </div>
            <PrimaryButton onClick={handleNavigate} fullWidth icon={Navigation}>
              Launch Siren Navigation
            </PrimaryButton>
          </div>

          {/* Similar Hospitals */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-900">Similar Nearby Facilities</h3>
            <div className="space-y-4">
              {similarHospitals.map((hosp) => (
                <HospitalCard
                  key={hosp.id}
                  hospital={hosp}
                  onNavigate={handleNavigate}
                  onBookBed={() => setIsBookingOpen(true)}
                  onSelectDetails={() => navigate(`/hospital/${hosp.id}`)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bed Hold Modal */}
      <BedBookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        hospital={hospital}
      />
    </div>
  );
};
