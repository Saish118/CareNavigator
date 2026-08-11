import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  PhoneCall,
  Ambulance,
  ShieldAlert,
  Flame,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Navigation,
  Info,
  Building2,
  Phone,
  Zap,
  Star,
  Activity,
  HeartPulse,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Stethoscope,
  X,
  Sparkles,
} from "lucide-react";
import { HOSPITALS_DATA } from "../data/hospitalsData";
import { useToast } from "../components/ui/ToastNotification";
import { EmergencyMap } from "../components/map/EmergencyMap";
import { ambulanceService } from "../services/ambulanceService";

export const MapPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [ambulances, setAmbulances] = useState([]);
  const [loadingAmbulances, setLoadingAmbulances] = useState(true);
  const [selectedAmbulanceModal, setSelectedAmbulanceModal] = useState(null);

  // Progressive Disclosure: Collapsible sections below map (collapsed by default)
  const [activeSection, setActiveSection] = useState(null); // null = all collapsed by default, or 'ambulances' | 'hotlines' | 'checklist'
  const [expandedAmbulanceIds, setExpandedAmbulanceIds] = useState({});

  const toggleAmbulanceExpand = (id) => {
    setExpandedAmbulanceIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
    let isMounted = true;
    const fetchAmbulances = async () => {
      setLoadingAmbulances(true);
      try {
        const data = await ambulanceService.getPublicAmbulances();
        if (isMounted) {
          setAmbulances(data);
        }
      } catch (err) {
        console.warn("⚠️ Public map ambulance fetch notice:", err.message);
      } finally {
        if (isMounted) setLoadingAmbulances(false);
      }
    };

    fetchAmbulances();
    return () => {
      isMounted = false;
    };
  }, []);

  const emergencyNumbers = [
    {
      title: "National Ambulance",
      number: "108 / 102",
      subLabel: "Medical Triage Dispatch",
      description: "24/7 National Emergency Medical Service for immediate trauma transport and paramedic dispatch.",
      color: "bg-gradient-to-br from-rose-50 via-rose-100/50 to-rose-100/80 border-rose-300/80 text-rose-950",
      buttonBg: "bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white shadow-lg shadow-rose-600/25",
      badgeColor: "bg-rose-600 text-white shadow-sm",
      icon: Ambulance,
    },
    {
      title: "Police Control Room",
      number: "100 / 911",
      subLabel: "Emergency Patrol & Highway Escort",
      description: "Immediate emergency police assistance, accident response, and green corridor traffic clearance.",
      color: "bg-gradient-to-br from-blue-50 via-blue-100/50 to-blue-100/80 border-blue-300/80 text-blue-950",
      buttonBg: "bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white shadow-lg shadow-blue-600/25",
      badgeColor: "bg-blue-600 text-white shadow-sm",
      icon: ShieldAlert,
    },
    {
      title: "Fire & Rescue Department",
      number: "101",
      subLabel: "Hazmat & Rescue Service",
      description: "Rapid fire suppression, hazmat containment, vehicle extrication, and disaster emergency rescue.",
      color: "bg-gradient-to-br from-amber-50 via-orange-100/50 to-orange-100/80 border-amber-300/80 text-amber-950",
      buttonBg: "bg-amber-600 hover:bg-amber-700 active:scale-[0.98] text-white shadow-lg shadow-amber-600/25",
      badgeColor: "bg-amber-600 text-white shadow-sm",
      icon: Flame,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6 overflow-x-hidden">
      {/* PAGE HEADER & QUICK HOTLINE BAR (1 TAP AWAY MAX) */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-100 text-rose-800 text-[11px] sm:text-xs font-black rounded-full border border-rose-200 max-w-full">
              <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span className="truncate">Emergency Location Grid</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight break-words">
              Emergency Map & Dispatch
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Interactive map of verified medical centers, blood banks, and ambulance fleets.
            </p>
          </div>

          {/* 1-TAP EMERGENCY QUICK DIAL STRIP */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none w-full md:w-auto">
            <a
              href="tel:108"
              className="px-2.5 sm:px-3.5 min-h-[42px] bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-extrabold text-[11px] sm:text-xs rounded-xl shadow-md flex items-center gap-1.5 shrink-0 transition-transform"
            >
              <Ambulance className="w-3.5 h-3.5 shrink-0" />
              <span>Dial 108 (Ambulance)</span>
            </a>
            <a
              href="tel:100"
              className="px-2.5 sm:px-3.5 min-h-[42px] bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold text-[11px] sm:text-xs rounded-xl shadow-md flex items-center gap-1.5 shrink-0 transition-transform"
            >
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span>Dial 100 (Police)</span>
            </a>
            <a
              href="tel:101"
              className="px-2.5 sm:px-3.5 min-h-[42px] bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-extrabold text-[11px] sm:text-xs rounded-xl shadow-md flex items-center gap-1.5 shrink-0 transition-transform"
            >
              <Flame className="w-3.5 h-3.5 shrink-0" />
              <span>Dial 101 (Fire)</span>
            </a>
          </div>
        </div>
      </div>

      {/* 1. DOMINANT VISUAL ELEMENT ON PAGE LOAD: INTERACTIVE EMERGENCY MAP */}
      <section className="space-y-3">
        <EmergencyMap />
      </section>

      {/* 2 & 3. COLLAPSIBLE / TABBED SECTIONS BELOW MAP (COLLAPSED BY DEFAULT) */}
      <section className="space-y-4 pt-2 border-t border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <h2 className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-400">
            Emergency Fleets & Resources
          </h2>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setActiveSection(activeSection === "ambulances" ? null : "ambulances")}
              className={`px-3 py-2 min-h-[42px] text-[11px] sm:text-xs font-bold rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                activeSection === "ambulances"
                  ? "bg-rose-600 text-white border-rose-600 shadow-md"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-rose-50 hover:border-rose-200"
              }`}
            >
              <Ambulance className="w-3.5 h-3.5 shrink-0" />
              <span>Ambulances ({ambulances.length})</span>
              {activeSection === "ambulances" ? <ChevronUp className="w-3.5 h-3.5 shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 shrink-0" />}
            </button>

            <button
              type="button"
              onClick={() => setActiveSection(activeSection === "hotlines" ? null : "hotlines")}
              className={`px-3 py-2 min-h-[42px] text-[11px] sm:text-xs font-bold rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                activeSection === "hotlines"
                  ? "bg-slate-900 text-white border-slate-900 shadow-md"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5 shrink-0" />
              <span>National Hotlines</span>
              {activeSection === "hotlines" ? <ChevronUp className="w-3.5 h-3.5 shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 shrink-0" />}
            </button>

            <button
              type="button"
              onClick={() => setActiveSection(activeSection === "checklist" ? null : "checklist")}
              className={`px-3 py-2 min-h-[42px] text-[11px] sm:text-xs font-bold rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                activeSection === "checklist"
                  ? "bg-emerald-700 text-white border-emerald-700 shadow-md"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-emerald-50 hover:border-emerald-200"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>Checklist</span>
              {activeSection === "checklist" ? <ChevronUp className="w-3.5 h-3.5 shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 shrink-0" />}
            </button>
          </div>
        </div>

        {/* SECTION 1: AMBULANCE FLEET (COLLAPSIBLE, COLLAPSED BY DEFAULT) */}
        {activeSection === "ambulances" && (
          <div className="space-y-4 pt-3 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Ambulance className="w-5 h-5 text-rose-600 shrink-0" /> Verified Ambulance Fleets
              </h3>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-0.5 rounded-full border border-slate-200">
                {ambulances.length} Units Ready
              </span>
            </div>

            {loadingAmbulances ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-56 bg-slate-100 rounded-3xl border border-slate-200 animate-pulse" />
                ))}
              </div>
            ) : ambulances.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {ambulances.map((amb) => {
                  const phone = amb.primaryPhone || amb.emergencyPhone || "108";
                  const isExpanded = !!expandedAmbulanceIds[amb.id];
                  const mapNavUrl = `https://www.google.com/maps/dir/?api=1&destination=${
                    amb.coordinates?.lat || amb.latitude || 19.8916
                  },${amb.coordinates?.lng || amb.longitude || 74.4795}`;

                  return (
                    <div
                      key={amb.id}
                      className="bg-white rounded-3xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                    >
                      {/* AMBULANCE CARD HEADER — TOP VISUAL WEIGHT: Type, Distance, Availability */}
                      <div className="p-5 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="px-2.5 py-0.5 bg-rose-100 text-rose-800 font-extrabold text-[10px] uppercase rounded-md">
                              {amb.ambulanceType}
                            </span>
                            <h4 className="font-black text-slate-900 text-base mt-1 line-clamp-1">
                              {amb.providerName}
                            </h4>
                          </div>

                          {/* Availability Status Badge */}
                          {amb.availabilityStatus === "Available" ? (
                            <span className="px-2.5 py-1 bg-emerald-500 text-white font-extrabold text-[10px] uppercase rounded-full shadow-xs shrink-0">
                              ● Available
                            </span>
                          ) : amb.availabilityStatus === "On Call" ? (
                            <span className="px-2.5 py-1 bg-amber-500 text-white font-extrabold text-[10px] uppercase rounded-full shadow-xs shrink-0">
                              ◐ On Call
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 bg-slate-600 text-white font-extrabold text-[10px] uppercase rounded-full shadow-xs shrink-0">
                              Offline
                            </span>
                          )}
                        </div>

                        {/* Location & Distance Pill */}
                        <div className="flex items-center justify-between text-xs text-slate-600">
                          <span className="flex items-center gap-1 truncate font-medium">
                            <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                            <span className="truncate">{amb.city || amb.address}</span>
                          </span>

                          <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100 shrink-0">
                            {amb.distanceKm != null ? `${amb.distanceKm.toFixed(1)} km away` : amb.city}
                          </span>
                        </div>

                        {/* EXPANDABLE EQUIPMENT SPECS TOGGLE */}
                        <div className="pt-2 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => toggleAmbulanceExpand(amb.id)}
                            className="w-full py-1.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-between transition-colors cursor-pointer"
                          >
                            <span>{isExpanded ? "Hide Equipment Specs" : "View Equipment Specs (O2, Vent)"}</span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-500" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />}
                          </button>

                          {/* EXPANDED EQUIPMENT SPECS */}
                          {isExpanded && (
                            <div className="mt-2 space-y-2 animate-fadeIn">
                              <div className="grid grid-cols-2 gap-1.5 text-xs">
                                <div className={`p-2 rounded-xl border flex items-center gap-1.5 ${amb.oxygen ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-slate-50 border-slate-200 text-slate-400"}`}>
                                  {amb.oxygen ? <HeartPulse className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <XCircle className="w-3.5 h-3.5 shrink-0" />}
                                  <span className="font-bold text-[11px]">Oxygen Cylinder</span>
                                </div>

                                <div className={`p-2 rounded-xl border flex items-center gap-1.5 ${amb.ventilator ? "bg-sky-50 border-sky-200 text-sky-900" : "bg-slate-50 border-slate-200 text-slate-400"}`}>
                                  {amb.ventilator ? <Zap className="w-3.5 h-3.5 text-sky-600 shrink-0" /> : <XCircle className="w-3.5 h-3.5 shrink-0" />}
                                  <span className="font-bold text-[11px]">Ventilator Unit</span>
                                </div>
                              </div>

                              <div className="text-[11px] text-slate-500 flex justify-between bg-slate-50 p-2 rounded-xl border border-slate-100">
                                <span>RTO Reg: <strong className="font-mono text-slate-700">{amb.ambulanceRegistrationNumber || "Verified"}</strong></span>
                                <span>Status: <strong className="text-emerald-700 font-semibold">{amb.verificationStatus || "Active"}</strong></span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* CARD ACTIONS: CALL DISPATCH & GPS */}
                      <div className="p-4 pt-0 grid grid-cols-3 gap-2">
                        <a
                          href={`tel:${phone}`}
                          className="col-span-2 py-2 bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs"
                        >
                          <PhoneCall className="w-3.5 h-3.5" /> Call ({phone})
                        </a>

                        <a
                          href={mapNavUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-all"
                          title="Navigate via Google Maps"
                        >
                          <Navigation className="w-3.5 h-3.5" /> GPS
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-semibold">
                No public ambulance fleets found matching your criteria.
              </div>
            )}
          </div>
        )}

        {/* SECTION 2: EMERGENCY NUMBERS (COLLAPSIBLE, COLLAPSED BY DEFAULT) */}
        {activeSection === "hotlines" && (
          <div className="space-y-4 pt-3 animate-fadeIn">
            <div className="border-b border-slate-200/80 pb-2">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-rose-600 shrink-0" /> National Emergency Directory
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Direct hotlines for national emergency medical services, police, and fire dispatch.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {emergencyNumbers.map((num, idx) => {
                const Icon = num.icon;
                return (
                  <div
                    key={idx}
                    className={`p-6 rounded-3xl border shadow-md hover:shadow-lg transition-all duration-200 space-y-4 flex flex-col justify-between ${num.color}`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                            {num.title}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500">{num.subLabel}</span>
                        </div>
                        <div className={`p-2.5 rounded-2xl ${num.badgeColor} shrink-0`}>
                          <Icon className="w-5 h-5" />
                        </div>
                      </div>

                      <span className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 block">
                        {num.number}
                      </span>

                      <p className="text-xs text-slate-700 font-medium leading-relaxed">
                        {num.description}
                      </p>
                    </div>

                    <a
                      href={`tel:${num.number}`}
                      className={`w-full py-2.5 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${num.buttonBg}`}
                    >
                      <PhoneCall className="w-4 h-4" /> Dial {num.number}
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 3: CHECKLIST (COLLAPSIBLE, COLLAPSED BY DEFAULT) */}
        {activeSection === "checklist" && (
          <div className="bg-gradient-to-br from-emerald-50/90 via-emerald-50/50 to-teal-50/30 border border-emerald-200/70 rounded-3xl p-5 space-y-3 shadow-sm pt-3 animate-fadeIn">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Before Calling Dispatch — Emergency Checklist</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-medium text-emerald-950">
              <div className="p-3 bg-white/90 rounded-2xl border border-emerald-200/60 space-y-1">
                <span className="font-bold text-emerald-800 block">1. Confirm Exact Location</span>
                <p className="text-slate-600 text-[11px]">Note your street address, building gate number, or landmark.</p>
              </div>

              <div className="p-3 bg-white/90 rounded-2xl border border-emerald-200/60 space-y-1">
                <span className="font-bold text-emerald-800 block">2. State Patient Condition</span>
                <p className="text-slate-600 text-[11px]">Specify if oxygen support or an ICU ventilator unit is required.</p>
              </div>

              <div className="p-3 bg-white/90 rounded-2xl border border-emerald-200/60 space-y-1">
                <span className="font-bold text-emerald-800 block">3. Keep Phone Line Free</span>
                <p className="text-slate-600 text-[11px]">Keep your line clear so the paramedic driver can reach you en route.</p>
              </div>

              <div className="p-3 bg-white/90 rounded-2xl border border-emerald-200/60 space-y-1">
                <span className="font-bold text-emerald-800 block">4. Traffic & ETA Note</span>
                <p className="text-slate-600 text-[11px]">Real-time arrival time depends on local traffic density and weather.</p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* AMBULANCE DETAIL MODAL */}
      {selectedAmbulanceModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 p-6 max-w-lg w-full shadow-2xl space-y-6 relative overflow-hidden">
            <button
              onClick={() => setSelectedAmbulanceModal(null)}
              className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4 pr-8">
              <div className="p-3 bg-rose-500/20 text-rose-400 rounded-2xl border border-rose-500/30 shrink-0">
                <Ambulance className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 font-extrabold text-[10px] uppercase rounded-md border border-rose-500/30">
                  {selectedAmbulanceModal.ambulanceType}
                </span>
                <h3 className="text-lg font-bold text-white leading-tight">
                  {selectedAmbulanceModal.providerName}
                </h3>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  {selectedAmbulanceModal.address}, {selectedAmbulanceModal.city}
                </p>
              </div>
            </div>

            {selectedAmbulanceModal.description && (
              <p className="text-xs text-slate-300 bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 leading-relaxed">
                {selectedAmbulanceModal.description}
              </p>
            )}

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Onboard Medical Equipment Specs
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${selectedAmbulanceModal.oxygen ? "bg-emerald-950/60 border-emerald-800/60 text-emerald-300" : "bg-slate-800/60 border-slate-700 text-slate-500"}`}>
                  <HeartPulse className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-bold text-[11px]">Oxygen Cylinder</span>
                </div>

                <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${selectedAmbulanceModal.ventilator ? "bg-sky-950/60 border-sky-800/60 text-sky-300" : "bg-slate-800/60 border-slate-700 text-slate-500"}`}>
                  <Zap className="w-4 h-4 text-sky-400 shrink-0" />
                  <span className="font-bold text-[11px]">Cardiac Ventilator</span>
                </div>

                <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${selectedAmbulanceModal.defibrillator ? "bg-amber-950/60 border-amber-800/60 text-amber-300" : "bg-slate-800/60 border-slate-700 text-slate-500"}`}>
                  <Activity className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-bold text-[11px]">Defibrillator (AED)</span>
                </div>

                <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${selectedAmbulanceModal.stretcher ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-slate-800/60 border-slate-700 text-slate-500"}`}>
                  <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-bold text-[11px]">Stretcher System</span>
                </div>
              </div>

              {selectedAmbulanceModal.otherEquipment && (
                <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700 text-xs text-slate-300">
                  <span className="font-bold text-slate-400 text-[10px] uppercase block mb-0.5">
                    Additional Paramedic Tools:
                  </span>
                  {selectedAmbulanceModal.otherEquipment}
                </div>
              )}
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>RTO Reg #:</span>
                <strong className="text-white font-mono">{selectedAmbulanceModal.ambulanceRegistrationNumber || "N/A"}</strong>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Verification:</span>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 font-bold rounded-md border border-emerald-500/30 text-[10px]">
                  {selectedAmbulanceModal.verificationStatus || "verified"} ({selectedAmbulanceModal.verificationType || "RTO"})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={`tel:${selectedAmbulanceModal.primaryPhone || selectedAmbulanceModal.emergencyPhone || "108"}`}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4" /> Call Dispatch
              </a>

              <button
                onClick={() => setSelectedAmbulanceModal(null)}
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
