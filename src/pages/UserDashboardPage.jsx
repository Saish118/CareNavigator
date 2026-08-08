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

  const highlightedHospital = HOSPITALS_DATA[0]; // 98% Match
  const nearbyHospitals = HOSPITALS_DATA; // 6 hospitals

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
      title: "Favorite Hospitals",
      icon: Bookmark,
      color: "bg-purple-50 text-purple-600 border-purple-100",
      action: () => navigate("/profile"),
    },
    {
      title: "Nearby Pharmacies",
      icon: Pill,
      color: "bg-sky-50 text-sky-600 border-sky-100",
      action: () => addToast("14 Pharmacies Open 24/7 in Sector 4", "info"),
    },
  ];

  const recentAppointments = [
    {
      doctor: "Dr. Sarah Jenkins",
      hospital: "St. Jude Metro Cardiac Center",
      dateTime: "Today, 06:30 PM",
      status: "Confirmed Hold",
      badgeColor: "bg-emerald-100 text-emerald-800",
    },
    {
      doctor: "Dr. Anita Desai",
      hospital: "Mercy General & Children's Center",
      dateTime: "Yesterday, 02:15 PM",
      status: "Admitted",
      badgeColor: "bg-blue-100 text-blue-800",
    },
    {
      doctor: "Dr. Maya Lin",
      hospital: "Apex Neuroscience Hospital",
      dateTime: "Aug 02, 10:00 AM",
      status: "Completed",
      badgeColor: "bg-slate-100 text-slate-700",
    },
  ];

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

  const notifications = [
    {
      id: 1,
      type: "reminder",
      title: "Appointment Reminder",
      message: "ICU Bed Hold at St. Jude Cardiac Center expires in 25 mins.",
      time: "5m ago",
      icon: Calendar,
      color: "bg-blue-50 border-blue-200 text-blue-900",
    },
    {
      id: 2,
      type: "update",
      title: "Bed Availability Update",
      message: "2 new Ventilator beds opened up at Trinity Pulmonary Facility.",
      time: "12m ago",
      icon: BedDouble,
      color: "bg-emerald-50 border-emerald-200 text-emerald-900",
    },
    {
      id: 3,
      type: "alert",
      title: "Emergency Regional Alert",
      message: "Priority Siren Corridor active on East Highway Bypass.",
      time: "30m ago",
      icon: Activity,
      color: "bg-rose-50 border-rose-200 text-rose-900",
    },
    {
      id: 4,
      type: "system",
      title: "System Announcement",
      message: "CareNavigator platform updated with 2026 Emergency Guidelines.",
      time: "2h ago",
      icon: Info,
      color: "bg-purple-50 border-purple-200 text-purple-900",
    },
  ];

  const recentActivityTimeline = [
    {
      action: "Saved Hospital to Passport",
      location: "St. Jude Cardiac Center",
      timestamp: "10 mins ago",
      icon: BedDouble,
    },
    {
      action: "Ran Symptom Assessment",
      location: "Generated Level 1 Critical Result",
      timestamp: "45 mins ago",
      icon: Flame,
    },
    {
      action: "Saved Hospital to Passport",
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
            <p className="text-xs text-slate-500 font-medium">
              CareNavigator Personal Medical Command Center
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

        {/* Search Bar */}
        <div className="max-w-2xl">
          <SearchBar
            placeholder="Search hospitals, specialties, or symptoms e.g., 'Cardiology ICU'"
            onSearch={(q) => navigate(`/hospitals?q=${encodeURIComponent(q)}`)}
          />
        </div>
      </div>

      {/* 2. QUICK ACTIONS (5 CARDS) */}
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

      {/* 3. NEARBY HOSPITALS (6 CARDS GRID) */}
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

              <div className="pt-3 border-t border-slate-100">
                <SecondaryButton
                  onClick={() => setSelectedHospitalForDetail(hosp)}
                  size="sm"
                  fullWidth
                >
                  View Details
                </SecondaryButton>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. NOTIFICATIONS PANEL & RECENT ACTIVITY TIMELINE */}
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

        {/* Recent Activity Timeline */}
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

      {/* 5. HEALTH TIPS ROTATING CARDS */}
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
