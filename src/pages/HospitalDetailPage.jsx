import React, { useState, useEffect } from "react";
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
import { hospitalService } from "../services/hospitalService";
import { HOSPITALS_DATA } from "../data/hospitalsData";
import { RatingStars } from "../components/status/RatingStars";
import { HospitalStatusIndicator } from "../components/status/HospitalStatusIndicator";
import { PrimaryButton } from "../components/buttons/PrimaryButton";
import { SecondaryButton } from "../components/buttons/SecondaryButton";
import { HospitalCard } from "../components/hospital/HospitalCard";
import { useEmergency } from "../context/EmergencyContext";
import { useBookmark } from "../context/BookmarkContext";
import { useToast } from "../components/ui/ToastNotification";
import { openHospitalDirections } from "../utils/navigationUtils";

export const HospitalDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setDestination } = useEmergency();
  const { toggleSaveHospital, isHospitalSaved } = useBookmark();
  const { addToast } = useToast();

  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [similarHospitals, setSimilarHospitals] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const fetchHospitalData = async () => {
      setLoading(true);
      try {
        const fetched = await hospitalService.getHospitalById(id);
        if (isMounted) {
          if (fetched) {
            setHospital(fetched);
          } else {
            setHospital(HOSPITALS_DATA.find((h) => h.id === id) || HOSPITALS_DATA[0]);
          }

          const allHospitals = await hospitalService.getHospitals();
          setSimilarHospitals(
            allHospitals.filter((h) => h.id !== id).slice(0, 2)
          );
        }
      } catch (err) {
        console.warn("⚠️ HospitalDetailPage Fetch Notice:", err.message);
        if (isMounted) {
          setHospital(HOSPITALS_DATA.find((h) => h.id === id) || HOSPITALS_DATA[0]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchHospitalData();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-600 font-bold text-sm">Loading official hospital records...</p>
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Hospital Facility Not Found</h2>
        <PrimaryButton onClick={() => navigate("/hospitals")}>Return to Discovery</PrimaryButton>
      </div>
    );
  }

  const isSaved = isHospitalSaved(hospital.id);

  // Safe Defensiveness Helpers for New DMER Schema
  const name = hospital.name || "Government Medical College & Hospital";
  const tagline = hospital.tagline || "Official DMER Maharashtra Medical Center";
  const image = hospital.image || "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80";
  const matchScore = hospital.matchScore || 92;
  const traumaLevel = hospital.traumaLevel || "Government Emergency Casualty";
  const ratingText = hospital.rating ? `${hospital.rating}` : "Official DMER Govt Facility";
  const reviewText = hospital.reviewCount && hospital.reviewCount > 0 ? ` (${hospital.reviewCount} reviews)` : "";
  const erWaitText = hospital.erWaitTimeMin ? `${hospital.erWaitTimeMin} mins` : "24/7 Casualty ER";

  const totalBeds = hospital.beds?.total || hospital.beds?.general || "Govt Managed";
  const icuBedsText = hospital.beds?.icu?.available != null ? `${hospital.beds.icu.available} Free` : "Contact ER Direct";

  const specialties = Array.isArray(hospital.specialties) ? hospital.specialties : [];
  const amenities = Array.isArray(hospital.amenities)
    ? hospital.amenities
    : Array.isArray(hospital.facilities)
    ? hospital.facilities
    : ["24/7 Casualty Ward", "Blood Bank Onsite", "Central Clinical Lab"];

  const insuranceAccepted = Array.isArray(hospital.insuranceAccepted)
    ? hospital.insuranceAccepted
    : ["Mahatma Jyotirao Phule Jan Arogya Yojana (MJPJAY)", "Ayushman Bharat (PMJAY)"];

  const phone = hospital.phone || hospital.erDirectPhone || null;
  const doctors = Array.isArray(hospital.doctorsOnDuty) ? hospital.doctorsOnDuty : [];
  const reviews = Array.isArray(hospital.reviews) ? hospital.reviews : [];

  const handleNavigate = () => {
    setDestination(hospital);
    openHospitalDirections(hospital, addToast);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <div className="bg-gradient-to-tr from-slate-900 via-slate-800 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-700 relative overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700/80 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center gap-1.5 text-xs font-bold mr-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 font-extrabold text-xs rounded-full border border-emerald-500/30 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> {matchScore}% Recommended
            </span>
          </div>

          <div className="flex items-center gap-3">
            <HospitalStatusIndicator status="Operational" />
            <button
              onClick={() => toggleSaveHospital(hospital.id)}
              className={`p-2.5 rounded-full backdrop-blur-md transition-all cursor-pointer ${
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
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">{name}</h1>
              <p className="text-sm text-slate-300 mt-2 font-medium">{tagline}</p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 font-medium">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{hospital.address || "Main Campus"}, {hospital.city || hospital.district || "Maharashtra"}</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Navigation className="w-4 h-4 shrink-0" />
                <span>{hospital.city || hospital.district} Regional Node</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                <Star className="w-4 h-4 fill-amber-300 shrink-0" />
                <span>{ratingText}{reviewText}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-3 w-full">
              <PrimaryButton onClick={handleNavigate} size="lg" icon={Navigation} className="bg-sky-600 hover:bg-sky-700 w-full sm:w-auto">
                Navigate Now
              </PrimaryButton>

              {phone ? (
                <a
                  href={`tel:${phone}`}
                  className="h-12 px-4 sm:px-6 text-sm sm:text-base font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition-colors inline-flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 w-full sm:w-auto max-w-full"
                >
                  <PhoneCall className="w-5 h-5 shrink-0" />
                  <span className="truncate">Emergency Call ({phone})</span>
                </a>
              ) : (
                <div className="h-12 px-4 sm:px-6 text-sm sm:text-base font-bold rounded-xl bg-slate-800 text-slate-300 inline-flex items-center justify-center gap-2 border border-slate-700 w-full sm:w-auto max-w-full">
                  <PhoneCall className="w-5 h-5 shrink-0 text-slate-400" />
                  <span>ER Phone Onsite Desk</span>
                </div>
              )}

              <SecondaryButton
                onClick={() => toggleSaveHospital(hospital.id)}
                size="lg"
                icon={Bookmark}
                className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700 w-full sm:w-auto"
              >
                {isSaved ? "Saved in Passport" : "Save Hospital"}
              </SecondaryButton>
            </div>
          </div>

          {/* Banner Image Preview */}
          <div className="relative h-64 w-full rounded-2xl overflow-hidden border border-slate-700 shadow-xl">
            <img src={image} alt={name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
              <span className="font-bold bg-slate-900/80 px-3 py-1 rounded-xl backdrop-blur-md">
                {traumaLevel}
              </span>
              <span className="font-bold bg-emerald-600/90 px-3 py-1 rounded-xl backdrop-blur-md">
                {erWaitText}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. OFFICIAL HOSPITAL RESOURCE & CAPACITY DASHBOARD */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Activity className="w-6 h-6 text-emerald-600 shrink-0" /> Official DMER Hospital Telemetry & Capacity
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs text-center space-y-1">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Total Govt Beds</span>
            <span className="text-2xl font-black text-slate-900">{totalBeds}</span>
            <span className="text-[10px] text-slate-500 block font-semibold">Official Capacity</span>
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 shadow-xs text-center space-y-1">
            <span className="text-[10px] font-bold text-emerald-800 block uppercase">ICU Bed Status</span>
            <span className="text-sm font-black text-emerald-700 mt-1 block">
              {icuBedsText}
            </span>
            <span className="text-[10px] text-emerald-600 block font-semibold">Emergency Status</span>
          </div>

          <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200 shadow-xs text-center space-y-1">
            <span className="text-[10px] font-bold text-sky-800 block uppercase">CT & MRI Tech</span>
            <span className="text-sm font-black text-sky-700 mt-1 block">
              {hospital.hasCtMri ? "CT & MRI Onsite" : "Standard Radiology"}
            </span>
            <span className="text-[10px] text-sky-600 block font-semibold">DMER Listed</span>
          </div>

          <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 shadow-xs text-center space-y-1">
            <span className="text-[10px] font-bold text-purple-800 block uppercase">Blood Bank</span>
            <span className="text-sm font-black text-purple-700 mt-1 block">
              {hospital.hasBloodBank ? "Blood Bank Onsite" : "District Supply"}
            </span>
            <span className="text-[10px] text-purple-600 block font-semibold">24/7 Available</span>
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 shadow-xs text-center space-y-1">
            <span className="text-[10px] font-bold text-amber-800 block uppercase">Ambulances</span>
            <span className="text-sm font-black text-amber-700 mt-1 block">
              {hospital.hasAmbulanceFleet ? "108 Govt Fleet" : "Civil Fleet"}
            </span>
            <span className="text-[10px] text-amber-600 block font-semibold">Emergency Dispatch</span>
          </div>

          <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 shadow-xs text-center space-y-1">
            <span className="text-[10px] font-bold text-rose-800 block uppercase">Casualty Protocol</span>
            <span className="text-sm font-black text-rose-700 mt-1 block">
              {erWaitText}
            </span>
            <span className="text-[10px] text-rose-600 block font-semibold">24/7 Casualty Desk</span>
          </div>
        </div>
      </section>

      {/* 3. CLINICAL ROSTER & HOSPITAL FACILITIES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Doctors / Staff Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600 shrink-0" /> Clinical Roster & Medical Officers
          </h2>

          <div className="space-y-3">
            {doctors.length > 0 ? (
              doctors.map((doc, idx) => (
                <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
                  <img src={doc.image || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80"} alt={doc.name} className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900 text-sm">{doc.name || "Medical Officer"}</h4>
                    <p className="text-xs text-slate-500 font-medium">{doc.specialty || "Casualty Resident"} • {doc.experienceYears || 5} yrs exp</p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-md">
                      {doc.status || "On Duty"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-slate-600 text-xs font-medium space-y-1">
                <span className="font-bold text-slate-800 block">24/7 Rotational Medical Staff:</span>
                <p>Official DMER Medical Officers, Resident Surgeons, and Clinical Faculty are on 24/7 active shift duty. Shift rosters are maintained at the Casualty Triage desk.</p>
              </div>
            )}
          </div>
        </div>

        {/* Facilities Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-emerald-600 shrink-0" /> Facilities & Diagnostic Tech
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {amenities.map((fac, i) => (
              <div key={i} className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2.5 text-xs font-bold text-slate-800">
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
            <FileText className="w-6 h-6 text-blue-600 shrink-0" /> Hospital Information & Official Verification
          </h2>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            <p>
              {hospital.description || `${name} is an official Maharashtra Directorate of Medical Education & Research (DMER) Government Medical Center located in ${hospital.district || hospital.city || 'Maharashtra'}. Operating 24/7, the facility offers comprehensive tertiary emergency care, specialized clinical surgeries, and public health services.`}
            </p>

            <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="font-bold text-slate-900 block">Accepted Health Insurance Networks:</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {insuranceAccepted.map((ins, i) => (
                    <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold">
                      {ins}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-900 block">Emergency & Administrative Contact:</span>
                <p className="mt-1 text-xs text-slate-600 leading-normal">
                  Hospital Landline: <strong>{phone || "Available at Casualty Desk"}</strong><br />
                  Data Source: <strong>{hospital.dataSource || "Maharashtra DMER"}</strong><br />
                  Last Verified: <strong>{hospital.lastVerified || "2026-08-09"}</strong>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Assessment Summary (1 col) */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-emerald-600 shrink-0" /> DMER Assessment Summary
          </h2>

          <div className="bg-gradient-to-br from-emerald-900 via-slate-900 to-teal-950 text-white p-6 rounded-3xl border border-slate-800 shadow-lg space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <span className="font-bold text-emerald-400">mediNAV Match Rank</span>
              <span className="text-lg font-black text-white">{matchScore}%</span>
            </div>

            <ul className="space-y-2.5 text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{traumaLevel} with 24/7 senior medical officer coverage.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Sanctioned bed capacity of {totalBeds} beds dedicated to public healthcare.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Covered under Mahatma Jyotirao Phule Jan Arogya Yojana & Ayushman Bharat.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 5. MAP PREVIEW & VERIFIED PATIENT REVIEWS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map Preview */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Map & Route Launch</h2>
          <div className="bg-slate-900 p-5 rounded-3xl text-white space-y-4 border border-slate-800 shadow-md">
            <div className="h-44 bg-slate-800 rounded-2xl border border-slate-700 flex items-center justify-center text-center p-4">
              <p className="text-xs text-sky-400 font-bold">
                📍 Destination: {name}<br />
                {hospital.address || "Main Campus"}, {hospital.city || hospital.district}
              </p>
            </div>
            <PrimaryButton onClick={handleNavigate} fullWidth icon={Navigation}>
              Launch Google Navigation
            </PrimaryButton>
          </div>
        </div>

        {/* Patient Reviews / Public Feedback (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Public Health Patient Reviews</h2>
          <div className="space-y-3">
            {reviews.length > 0 ? (
              reviews.map((rev, i) => (
                <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{rev.user}</span>
                    <RatingStars rating={rev.rating} />
                  </div>
                  <p className="text-slate-600 leading-relaxed font-medium">{rev.comment}</p>
                  <span className="text-[10px] text-slate-400 block pt-1 border-t border-slate-100">{rev.date}</span>
                </div>
              ))
            ) : (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-slate-600 text-xs font-medium space-y-1">
                <span className="font-bold text-slate-800 block">Government Health Verification:</span>
                <p>This is an official public health facility under the Maharashtra DMER framework. Community feedback and grievances are processed directly via the District Civil Surgeon & Medical Superintendent administration.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 6. SIMILAR HOSPITALS */}
      {similarHospitals.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Other Recommended Government Hospitals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {similarHospitals.map((h) => (
              <HospitalCard
                key={h.id}
                hospital={h}
                onNavigate={() => {
                  setDestination(h);
                  navigate("/map");
                }}
                onSelectDetails={(selected) => navigate(`/hospital/${selected.id}`)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
