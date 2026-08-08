import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  MapPin,
  Search,
  Stethoscope,
  Flame,
  BedDouble,
  PhoneCall,
  Bookmark,
  Pill,
  Star,
  Clock,
  Navigation,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Bell,
  Activity,
  HeartPulse,
  Info,
  ChevronRight,
  Lightbulb,
  ExternalLink,
} from "lucide-react";

// Design System components
import { SearchBar } from "../components/inputs/SearchBar";
import { PrimaryButton } from "../components/buttons/PrimaryButton";
import { SecondaryButton } from "../components/buttons/SecondaryButton";
import { EmergencySOSButton } from "../components/buttons/EmergencySOSButton";
import { HospitalStatusIndicator } from "../components/status/HospitalStatusIndicator";
import { RatingStars } from "../components/status/RatingStars";
import { HospitalDetailModal } from "../components/hospital/HospitalDetailModal";
import { BedBookingModal } from "../components/hospital/BedBookingModal";
import { HOSPITALS_DATA } from "../data/hospitalsData";
import { useEmergency } from "../context/EmergencyContext";
import { useToast } from "../components/ui/ToastNotification";

export const UserDashboardPage = () => {
  const navigate = useNavigate();
  const { triggerSos, setDestination } = useEmergency();
  const { addToast } = useToast();

  const [selectedHospitalForBed, setSelectedHospitalForBed] = useState(null);
  const [selectedHospitalForDetail, setSelectedHospitalForDetail] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const highlightedHospital = HOSPITALS_DATA[0]; // 98% Match
  const nearbyHospitals = HOSPITALS_DATA; // 6 hospitals

  // 2. Reordered Quick Actions (Find Hospitals, Search by Symptoms, Emergency Services, Nearby Pharmacies, Saved Hospitals)
  const quickActions = [
    {
      title: "Find Hospitals",
      icon: Stethoscope,
      color: "bg-blue-50 text-blue-600 border-blue-100",
      action: () => navigate("/hospitals"),
    },
    {
      title: "Search by Symptoms",
      icon: Flame,
      color: "bg-amber-50 text-amber-600 border-amber-100",
      action: () => navigate("/triage"),
    },
    {
      title: "Emergency Services",
      icon: PhoneCall,
      color: "bg-rose-50 text-rose-600 border-rose-100",
      action: () => navigate("/map"),
    },
    {
      title: "Nearby Pharmacies",
      icon: Pill,
      color: "bg-sky-50 text-sky-600 border-sky-100",
      action: () => addToast("14 Pharmacies Open 24/7 in Sector 4", "info"),
    },
    {
      title: "Saved Hospitals",
      icon: Bookmark,
      color: "bg-purple-50 text-purple-600 border-purple-100",
      action: () => navigate("/profile"),
    },
  ];

  // 7. Quick Specialty Chips below search bar
  const quickSpecialtyChips = [
    "Cardiology",
    "Neurology",
    "Emergency",
    "Orthopedics",
    "Pediatrics",
    "ICU",
  ];

  const handleChipClick = (chip) => {
    setSearchQuery(chip);
    navigate(`/hospitals?q=${encodeURIComponent(chip)}`);
  };

  const healthTips = [
    {
      title: "Recognizing Early Cardiac Symptoms",
      category: "Heart Health",
      tip: "Sudden pressure, tightness, or pain in chest, shoulders, or arm requires immediate Level 1 ER triage.",
      icon: HeartPulse,
    },
    {
      title: "Stroke BE-FAST Protocol",
      category: "Neurology",
      tip: "Balance loss, Eyesight blur, Facial droop, Arm weakness, Speech difficulty = Time to call 911 instantly.",
      icon: Sparkles,
    },
    {
      title: "Emergency Hydration & Heat Stroke",
      category: "General Safety",
      tip: "During extreme heat, maintain electrolyte levels and seek immediate shade if confusion or dizziness occurs.",
      icon: Lightbulb,
    },
  ];

  // 4. Notifications Feed (Removed Appointment Reminder & System Announcement)
  const notifications = [
    {
      id: 1,
      type: "update",
      title: "Saved Hospital Update",
      message: "ICU beds at St. Jude increased from 2 to 4.",
      time: "2m ago",
      icon: BedDouble,
      color: "bg-emerald-50 border-emerald-200 text-emerald-900",
    },
    {
      id: 2,
      type: "update",
      title: "Hospital Resource Update",
      message: "Mercy General updated ICU availability 3 minutes ago.",
      time: "3m ago",
      icon: Activity,
      color: "bg-blue-50 border-blue-200 text-blue-900",
    },
    {
      id: 3,
      type: "update",
      title: "Bed Availability Update",
      message: "2 new Ventilator beds opened up at Trinity Pulmonary Facility.",
      time: "12m ago",
      icon: BedDouble,
      color: "bg-sky-50 border-sky-200 text-sky-900",
    },
    {
      id: 4,
      type: "alert",
      title: "Emergency Regional Alert",
      message: "Priority Siren Corridor active on East Highway Bypass.",
      time: "30m ago",
      icon: PhoneCall,
      color: "bg-rose-50 border-rose-200 text-rose-900",
    },
  ];

  // 5. Recent User Activity (Removed all Passport references)
  const recentActivityTimeline = [
    {
      action: "Saved Hospital",
      location: "St. Jude Cardiac Center",
      timestamp: "10 mins ago",
      icon: Bookmark,
    },
    {
      action: "Ran Symptom Assessment",
      location: "Generated Level 1 Critical Result",
      timestamp: "45 mins ago",
      icon: Flame,
    },
    {
      action: "Saved Hospital",
      location: "Apex Neuroscience & Critical Care",
      timestamp: "2 hours ago",
      icon: Bookmark,
    },
  ];

  const handleNavigate = (h) => {
    setDestination(h);
    navigate("/map");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 sm:space-y-10 overflow-x-hidden">
      {/* 1. TOP SECTION */}
      <div className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Good Morning, Sai 👋
            </h1>
            {/* 1. Subtitle replaced as requested */}
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Search nearby hospitals, check live bed availability, and access emergency services.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Mock Location Card */}
            <div className="flex items-center justify-center gap-2 px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-700">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Current GPS: Sector 4, Metro City</span>
            </div>

            {/* Emergency SOS Button */}
            <EmergencySOSButton onClick={triggerSos} size="md" className="w-full sm:w-auto">
              SOS EMERGENCY (911)
            </EmergencySOSButton>
          </div>
        </div>

        {/* Search Bar & 7. Quick Specialty Chips */}
        <div className="space-y-3">
          <div className="max-w-2xl">
            <SearchBar
              placeholder="Search hospitals, specialties, or symptoms e.g., 'Cardiology ICU'"
              value={searchQuery}
              onChange={(q) => setSearchQuery(q)}
              onSearch={(q) => navigate(`/hospitals?q=${encodeURIComponent(q)}`)}
            />
          </div>

          {/* Quick Specialty Chips below search bar */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mr-1">
              Quick Search:
            </span>
            {quickSpecialtyChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleChipClick(chip)}
                className="px-3 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-bold text-xs rounded-xl border border-slate-200/80 transition-colors cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. QUICK ACTIONS (5 REORDERED CARDS) */}
      <section className="space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600 shrink-0" /> Quick Actions
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {quickActions.map((act, i) => {
            const Icon = act.icon;
            return (
              <div
                key={i}
                onClick={act.action}
                className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer text-center space-y-2 group"
              >
                <div className={`w-10 h-10 rounded-xl mx-auto flex items-center justify-center border ${act.color} group-hover:scale-110 transition-transform shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                  {act.title}
                </h4>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. COMPACT LOCATION SUMMARY CARD (Above Nearby Hospitals Matrix) */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-md text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Current Location</span>
              <strong className="text-white text-xs">Sector 4, Metro City (Current GPS)</strong>
            </div>
          </div>

          <div className="hidden sm:block text-slate-700 font-bold">|</div>

          <div className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Nearest Hospital</span>
              <strong className="text-emerald-300 text-xs">St. Jude Metro Cardiac Center</strong>
            </div>
          </div>

          <div className="hidden sm:block text-slate-700 font-bold">|</div>

          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="bg-blue-500/20 text-blue-300 px-2.5 py-1 rounded-lg border border-blue-500/30">
              Distance: 1.8 km
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-500/30 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Est. Time: 5 mins
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate("/map")}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-sm"
        >
          <ExternalLink className="w-3.5 h-3.5" /> Open in Google Maps
        </button>
      </div>

      {/* 3. NEARBY HOSPITALS (6 CARDS GRID - Renamed "View Details" to "View Hospital") */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-blue-600 shrink-0" /> Nearby Hospitals Matrix
          </h2>
          <button
            onClick={() => navigate("/hospitals")}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            View All Hospitals <ChevronRight className="w-4 h-4 shrink-0" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {nearbyHospitals.map((hosp) => (
            <div
              key={hosp.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all space-y-3 flex flex-col justify-between overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{hosp.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{hosp.distanceKm} km ({hosp.estimatedDriveMin} mins)</span>
                    </div>
                  </div>
                  <HospitalStatusIndicator status="Operational" showLabel={false} />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <RatingStars rating={hosp.rating} reviewCount={hosp.reviewCount} />
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-md shrink-0">
                    Emergency Services Available
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Total Beds</span>
                    <span className="font-extrabold text-slate-800">{hosp.beds.general.available} Available</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">ICU Beds</span>
                    <span className="font-extrabold text-emerald-600">{hosp.beds.icu.available} Available</span>
                  </div>
                </div>
              </div>

              {/* 3. Renamed button from View Details to View Hospital */}
              <div className="pt-3 border-t border-slate-100">
                <SecondaryButton
                  onClick={() => setSelectedHospitalForDetail(hosp)}
                  size="sm"
                  fullWidth
                >
                  View Hospital
                </SecondaryButton>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. NOTIFICATIONS PANEL & 5. RECENT ACTIVITY TIMELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Notifications Panel */}
        <div className="space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600 shrink-0" /> Notifications Feed
          </h2>

          <div className="space-y-3">
            {notifications.map((n) => {
              const Icon = n.icon;
              return (
                <div key={n.id} className={`p-4 rounded-2xl border shadow-sm flex items-start gap-3 text-xs ${n.color}`}>
                  <div className="p-2 rounded-xl bg-white/80 shrink-0 border border-slate-200">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900">{n.title}</h4>
                      <span className="text-[10px] text-slate-500 font-semibold">{n.time}</span>
                    </div>
                    <p className="text-slate-700 mt-0.5 font-medium">{n.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity Timeline (Passport references removed) */}
        <div className="space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600 shrink-0" /> Recent User Activity
          </h2>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            {recentActivityTimeline.map((act, idx) => {
              const Icon = act.icon;
              return (
                <div key={idx} className="flex items-start gap-3 text-xs border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-600 shrink-0 border border-blue-100">
                    <Icon className="w-4 h-4 shrink-0" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-bold text-slate-900">{act.action}</h5>
                    <p className="text-slate-500 font-medium">{act.location}</p>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">{act.timestamp}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* WELLNESS & EMERGENCY READINESS TIPS */}
      <section className="space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500 shrink-0" /> Wellness & Emergency Readiness Tips
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {healthTips.map((tip, i) => {
            const Icon = tip.icon;
            return (
              <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded-md">
                    {tip.category}
                  </span>
                  <Icon className="w-4 h-4 text-amber-500 shrink-0" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{tip.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{tip.tip}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Modals */}
      <BedBookingModal
        isOpen={!!selectedHospitalForBed}
        onClose={() => setSelectedHospitalForBed(null)}
        hospital={selectedHospitalForBed}
      />

      <HospitalDetailModal
        isOpen={!!selectedHospitalForDetail}
        onClose={() => setSelectedHospitalForDetail(null)}
        hospital={selectedHospitalForDetail}
        onNavigate={handleNavigate}
        onBookBed={(h) => setSelectedHospitalForBed(h)}
      />
    </div>
  );
};
