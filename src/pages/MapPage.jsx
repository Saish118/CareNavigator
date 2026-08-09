import React from "react";
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
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Stethoscope,
} from "lucide-react";
import { HOSPITALS_DATA } from "../data/hospitalsData";
import { useToast } from "../components/ui/ToastNotification";
import { EmergencyMap } from "../components/map/EmergencyMap";

export const MapPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  // SECTION 1: Hospital Ambulances
  const hospitalAmbulanceFleet = [
    {
      id: "AMB-101",
      hospitalName: "St. Jude Metro Cardiac Center",
      image: "https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=800&q=80",
      vehicleType: "ICU Ambulance",
      oxygenSupport: true,
      ventilatorAvailable: true,
      status: "Ready to Dispatch",
      distanceKm: 1.8,
      driveMin: 5,
      rating: 4.9,
      reviewCount: 210,
      responseTime: "6 - 10 mins",
      contactNumber: "+1 (800) 555-0199",
    },
    {
      id: "AMB-204",
      hospitalName: "Mercy General & Children's Center",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
      vehicleType: "Advanced Life Support",
      oxygenSupport: true,
      ventilatorAvailable: true,
      status: "On Call",
      distanceKm: 4.2,
      driveMin: 11,
      rating: 4.8,
      reviewCount: 185,
      responseTime: "12 - 15 mins",
      contactNumber: "+1 (800) 555-0244",
    },
    {
      id: "AMB-309",
      hospitalName: "Apex Neuroscience Hospital",
      image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80",
      vehicleType: "ICU Ambulance",
      oxygenSupport: true,
      ventilatorAvailable: false,
      status: "Ready to Dispatch",
      distanceKm: 3.5,
      driveMin: 9,
      rating: 4.9,
      reviewCount: 160,
      responseTime: "8 - 11 mins",
      contactNumber: "+1 (800) 555-0309",
    },
    {
      id: "AMB-412",
      hospitalName: "Trinity Pulmonary & Chest Center",
      image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80",
      vehicleType: "Advanced Life Support",
      oxygenSupport: true,
      ventilatorAvailable: true,
      status: "Busy",
      distanceKm: 6.8,
      driveMin: 18,
      rating: 4.7,
      reviewCount: 140,
      responseTime: "20 - 25 mins",
      contactNumber: "+1 (800) 555-0412",
    },
    {
      id: "AMB-505",
      hospitalName: "City Orthopedic & Trauma Institute",
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
      vehicleType: "Basic Life Support",
      oxygenSupport: true,
      ventilatorAvailable: false,
      status: "Ready to Dispatch",
      distanceKm: 2.1,
      driveMin: 6,
      rating: 4.8,
      reviewCount: 195,
      responseTime: "5 - 8 mins",
      contactNumber: "+1 (800) 555-0505",
    },
    {
      id: "AMB-618",
      hospitalName: "Sunrise Emergency & Burn Center",
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
      vehicleType: "ICU Ambulance",
      oxygenSupport: true,
      ventilatorAvailable: true,
      status: "Ready to Dispatch",
      distanceKm: 5.4,
      driveMin: 14,
      rating: 4.9,
      reviewCount: 230,
      responseTime: "7 - 12 mins",
      contactNumber: "+1 (800) 555-0618",
    },
  ];

  // SECTION 2: Private Ambulance Providers
  const privateAmbulanceProviders = [
    {
      id: "PVT-01",
      name: "Lifeline Emergency Express",
      image: "https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=400&q=80",
      vehicleType: "Advanced Life Support (ALS)",
      coverageArea: "Sector 1 to 12 & Central Metro",
      availability: "24×7 Active",
      rating: 4.9,
      eta: "8 - 12 mins",
      contactNumber: "+1 (800) 555-7711",
    },
    {
      id: "PVT-02",
      name: "City Trauma Responders Network",
      image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=400&q=80",
      vehicleType: "Basic Life Support (BLS)",
      coverageArea: "Downtown & Express Highway",
      availability: "24×7 Active",
      rating: 4.8,
      eta: "10 - 15 mins",
      contactNumber: "+1 (800) 555-8822",
    },
    {
      id: "PVT-03",
      name: "Metro Critical Care Transport",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80",
      vehicleType: "Neonatal & ICU Mobile Unit",
      coverageArea: "Suburban & Outer Ring Road",
      availability: "24×7 Active",
      rating: 4.9,
      eta: "12 - 18 mins",
      contactNumber: "+1 (800) 555-9933",
    },
    {
      id: "PVT-04",
      name: "Apex Cardiac Rescue Response",
      image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=400&q=80",
      vehicleType: "Cardiac Life Support Ambulance",
      coverageArea: "North Zone & Healthcare Hub",
      availability: "24×7 Active",
      rating: 4.8,
      eta: "7 - 10 mins",
      contactNumber: "+1 (800) 555-4444",
    },
    {
      id: "PVT-05",
      name: "Rapid Shield Medical Transport",
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=400&q=80",
      vehicleType: "Patient Transfer & BLS Ambulance",
      coverageArea: "Westside Corridor & Airport",
      availability: "24×7 Active",
      rating: 4.7,
      eta: "15 - 20 mins",
      contactNumber: "+1 (800) 555-5555",
    },
    {
      id: "PVT-06",
      name: "Global Helipad & ER Services",
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=400&q=80",
      vehicleType: "Air & Ground Critical ICU Fleet",
      coverageArea: "Regional Highways & Inter-city",
      availability: "24×7 Active",
      rating: 4.9,
      eta: "10 - 14 mins",
      contactNumber: "+1 (800) 555-6666",
    },
  ];

  // SECTION 3: Emergency Numbers
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

  // Requirement 4: Slightly larger status badge with stronger contrast
  const getStatusBadge = (status) => {
    switch (status) {
      case "Ready to Dispatch":
      case "Available":
        return (
          <span className="px-3 py-1.5 text-xs font-black bg-emerald-500 text-white rounded-xl flex items-center gap-1.5 shadow-lg border border-emerald-300/50 shadow-[0_0_14px_rgba(16,185,129,0.5)]">
            <span className="w-2 h-2 rounded-full bg-white animate-ping shrink-0" /> Ready to Dispatch
          </span>
        );
      case "On Call":
        return (
          <span className="px-3 py-1.5 text-xs font-black bg-amber-500 text-white rounded-xl flex items-center gap-1.5 shadow-lg border border-amber-300/50">
            <Clock className="w-3.5 h-3.5 animate-spin shrink-0" style={{ animationDuration: "6s" }} /> On Call
          </span>
        );
      case "Busy":
        return (
          <span className="px-3 py-1.5 text-xs font-black bg-rose-600 text-white rounded-xl flex items-center gap-1.5 shadow-lg border border-rose-400/50 shadow-[0_0_10px_rgba(225,29,72,0.5)]">
            <XCircle className="w-3.5 h-3.5 shrink-0" /> Busy
          </span>
        );
      default:
        return null;
    }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-8 sm:space-y-12 overflow-x-hidden">
      {/* PAGE HEADER */}
      <div className="space-y-2 border-b border-slate-200/80 pb-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-rose-100 text-rose-800 text-xs font-black rounded-full border border-rose-200 shadow-2xs">
          <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
          <span>Emergency Care & Navigation</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
          Emergency Services Directory
        </h1>

        <p className="text-sm sm:text-base text-slate-600 font-medium max-w-3xl leading-relaxed">
          Find nearby emergency hospitals and navigate to verified healthcare facilities.
        </p>
      </div>

      {/* INTERACTIVE EMERGENCY MAP MODULE */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-rose-600 shrink-0" /> Interactive Regional Emergency Map
          </h2>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3.5 py-1 rounded-full border border-slate-200">
            Verified Hospital Map
          </span>
        </div>

        <EmergencyMap />
      </section>

      {/* QUICK EMERGENCY ACTIONS SECTION */}
      <section className="space-y-3">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">
          Quick Emergency Actions
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <button
            onClick={() => scrollToSection("hospital-ambulances")}
            className="p-3.5 bg-gradient-to-b from-white to-rose-50/50 hover:to-rose-100/80 text-rose-900 rounded-2xl border border-slate-200/80 hover:border-rose-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ease-out flex flex-col items-center justify-center gap-1.5 text-center cursor-pointer group"
          >
            <div className="p-2.5 rounded-xl bg-rose-600 text-white group-hover:scale-105 transition-transform duration-200 shadow-sm">
              <Ambulance className="w-4 h-4" />
            </div>
            <span className="font-bold text-xs">Need Ambulance</span>
          </button>

          <button
            onClick={() => navigate("/hospitals?q=Trauma")}
            className="p-3.5 bg-gradient-to-b from-white to-blue-50/50 hover:to-blue-100/80 text-blue-900 rounded-2xl border border-slate-200/80 hover:border-blue-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ease-out flex flex-col items-center justify-center gap-1.5 text-center cursor-pointer group"
          >
            <div className="p-2.5 rounded-xl bg-blue-600 text-white group-hover:scale-105 transition-transform duration-200 shadow-sm">
              <Stethoscope className="w-4 h-4" />
            </div>
            <span className="font-bold text-xs">Trauma Center</span>
          </button>

          <button
            onClick={() => addToast("12 Regional Blood Banks Online with O-Negative Stock", "info")}
            className="p-3.5 bg-gradient-to-b from-white to-emerald-50/50 hover:to-emerald-100/80 text-emerald-900 rounded-2xl border border-slate-200/80 hover:border-emerald-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ease-out flex flex-col items-center justify-center gap-1.5 text-center cursor-pointer group"
          >
            <div className="p-2.5 rounded-xl bg-emerald-600 text-white group-hover:scale-105 transition-transform duration-200 shadow-sm">
              <HeartPulse className="w-4 h-4" />
            </div>
            <span className="font-bold text-xs">Blood Bank</span>
          </button>

          <a
            href="tel:18002221222"
            className="p-3.5 bg-gradient-to-b from-white to-purple-50/50 hover:to-purple-100/80 text-purple-900 rounded-2xl border border-slate-200/80 hover:border-purple-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ease-out flex flex-col items-center justify-center gap-1.5 text-center cursor-pointer group"
          >
            <div className="p-2.5 rounded-xl bg-purple-600 text-white group-hover:scale-105 transition-transform duration-200 shadow-sm">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <span className="font-bold text-xs">Poison Control</span>
          </a>

          <a
            href="tel:112"
            className="p-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl border border-slate-800 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 ease-out flex flex-col items-center justify-center gap-1.5 text-center cursor-pointer group col-span-2 sm:col-span-1"
          >
            <div className="p-2.5 rounded-xl bg-rose-600 text-white group-hover:scale-105 transition-transform duration-200 shadow-sm">
              <PhoneCall className="w-4 h-4" />
            </div>
            <span className="font-bold text-xs">Emergency Hotline (112)</span>
          </a>
        </div>
      </section>



      {/* SECTION 1: HOSPITAL AMBULANCES (Refined with 8% taller image, overlay gradient, small icons, soft red ETA badge) */}
      <section id="hospital-ambulances" className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
          <div>
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Ambulance className="w-6 h-6 text-rose-600 shrink-0" /> Hospital Ambulances
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Direct emergency fleets stationed at level-1 trauma facilities.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3.5 py-1 rounded-full border border-slate-200">
            6 Units Online
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hospitalAmbulanceFleet.map((amb) => (
            <div
              key={amb.id}
              className="bg-gradient-to-b from-white via-white to-slate-50/70 rounded-3xl border border-slate-200/80 shadow-md hover:shadow-2xl hover:-translate-y-1.5 hover:border-rose-400 transition-all duration-300 ease-out overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* 2. Photo Banner (+8% image height: h-48 sm:h-52, 1. Overlay gradient) */}
                <div className="relative h-48 sm:h-52 w-full bg-slate-800 overflow-hidden">
                  <img
                    src={amb.image}
                    alt={amb.hospitalName}
                    className="w-full h-full object-cover opacity-90 group-hover:scale-[1.03] transition-transform duration-500"
                  />
                  {/* 1. Subtle image overlay gradient for text contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent" />

                  {/* ID Badge */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-slate-900/80 text-white font-mono font-bold text-xs rounded-xl backdrop-blur-md border border-white/20 shadow-sm">
                    {amb.id}
                  </span>

                  {/* 4. Status Pill (Slightly larger with stronger contrast) */}
                  <div className="absolute top-3 right-3">{getStatusBadge(amb.status)}</div>

                  {/* Hospital Title, Distance & Rating Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 text-white space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm sm:text-base leading-tight drop-shadow-md line-clamp-1">
                        {amb.hospitalName}
                      </h3>
                      <span className="px-2 py-0.5 bg-slate-900/85 text-amber-400 font-bold text-[10px] rounded-md border border-white/15 shrink-0 flex items-center gap-1 backdrop-blur-md">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {amb.rating}
                      </span>
                    </div>

                    {/* 3. Small icon beside Distance */}
                    <div className="flex items-center gap-1.5 text-slate-300 text-xs font-semibold">
                      <Navigation className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>{amb.distanceKm} km away ({amb.driveMin} min drive)</span>
                    </div>
                  </div>
                </div>

                {/* 6. Details Body with improved spacing between metadata rows */}
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-semibold">Vehicle Type:</span>
                    <strong className="text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200 font-bold">
                      {amb.vehicleType}
                    </strong>
                  </div>

                  {/* 3. Small icons beside Oxygen Support & Ventilator Unit */}
                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div className={`p-2.5 rounded-xl border flex items-center gap-1.5 ${amb.oxygenSupport ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-slate-50 border-slate-200 text-slate-400"}`}>
                      {amb.oxygenSupport ? <HeartPulse className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <XCircle className="w-3.5 h-3.5 shrink-0" />}
                      <span className="font-bold text-[11px]">Oxygen Support</span>
                    </div>

                    <div className={`p-2.5 rounded-xl border flex items-center gap-1.5 ${amb.ventilatorAvailable ? "bg-sky-50 border-sky-200 text-sky-900" : "bg-slate-50 border-slate-200 text-slate-500"}`}>
                      {amb.ventilatorAvailable ? <Zap className="w-3.5 h-3.5 text-sky-600 shrink-0" /> : <XCircle className="w-3.5 h-3.5 shrink-0" />}
                      <span className="font-bold text-[11px]">Ventilator Unit</span>
                    </div>
                  </div>

                  {/* 5. Prominent ETA Badge using soft red background & icon */}
                  <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-100">
                    <span className="text-slate-500 font-semibold">Est. Response Time:</span>
                    <strong className="text-rose-800 bg-rose-100/90 border border-rose-200/90 px-3 py-1 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-xs">
                      <Clock className="w-3.5 h-3.5 text-rose-600 shrink-0" /> ETA: {amb.responseTime}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Call Button Footer */}
              <div className="p-5 pt-0">
                <a
                  href={`tel:${amb.contactNumber}`}
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all duration-200 ease-out cursor-pointer shadow-md shadow-rose-600/20"
                >
                  <PhoneCall className="w-3.5 h-3.5 group-hover:scale-105 transition-transform" /> Call Ambulance ({amb.contactNumber})
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: PRIVATE AMBULANCE PROVIDERS */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
          <div>
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-purple-600 shrink-0" /> Private Ambulance Providers
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Independent 24/7 emergency medical transport providers and patient transfers.
            </p>
          </div>
          <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3.5 py-1 rounded-full border border-purple-200">
            24×7 Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {privateAmbulanceProviders.map((prov) => (
            <div
              key={prov.id}
              className="bg-gradient-to-b from-white via-white to-slate-50/60 rounded-3xl border border-slate-200/70 shadow-md hover:shadow-xl hover:-translate-y-1 hover:border-purple-300 transition-all duration-200 ease-out p-5 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={prov.image}
                    alt={prov.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shrink-0 group-hover:scale-105 transition-transform duration-200"
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <h3 className="font-bold text-slate-900 text-sm leading-snug">{prov.name}</h3>
                      <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" title="Verified Provider" />
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-800 font-bold text-[10px] rounded-md">
                        {prov.availability}
                      </span>
                      <span className="text-amber-500 font-bold text-[11px] flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-400" /> {prov.rating}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Vehicle Type:</span>
                    <strong className="text-slate-900 font-bold">{prov.vehicleType}</strong>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span>Coverage Area:</span>
                    <strong className="text-slate-800 font-medium">{prov.coverageArea}</strong>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 pt-1 border-t border-slate-200/60">
                    <span>Avg Dispatch ETA:</span>
                    <strong className="text-emerald-700 font-bold">{prov.eta}</strong>
                  </div>
                </div>
              </div>

              <a
                href={`tel:${prov.contactNumber}`}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all duration-200 ease-out cursor-pointer shadow-sm"
              >
                <PhoneCall className="w-3.5 h-3.5 group-hover:scale-105 transition-transform" /> Call Provider ({prov.contactNumber})
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: EMERGENCY NUMBERS */}
      <section className="space-y-6">
        <div className="border-b border-slate-200/80 pb-3">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <PhoneCall className="w-6 h-6 text-rose-600 shrink-0" /> Emergency Numbers
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Direct hotlines for national emergency medical services, police, and fire dispatch.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {emergencyNumbers.map((num, idx) => {
            const Icon = num.icon;
            return (
              <div
                key={idx}
                className={`p-6 sm:p-7 rounded-3xl border shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 ease-out space-y-4 flex flex-col justify-between group ${num.color}`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                        {num.title}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">{num.subLabel}</span>
                    </div>
                    <div className={`p-3 rounded-2xl ${num.badgeColor} group-hover:scale-105 transition-transform duration-200 shrink-0`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <span className="text-4xl sm:text-5xl font-black tracking-tight text-slate-950 block">
                    {num.number}
                  </span>

                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    {num.description}
                  </p>
                </div>

                <a
                  href={`tel:${num.number}`}
                  className={`w-full py-3 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${num.buttonBg}`}
                >
                  <PhoneCall className="w-4 h-4" /> Dial {num.number}
                </a>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 4: "BEFORE CALLING" CHECKLIST */}
      <section className="bg-gradient-to-br from-emerald-50/90 via-emerald-50/50 to-teal-50/30 border border-emerald-200/70 rounded-3xl p-6 sm:p-7 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-emerald-900 font-bold text-base">
          <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
          <span>Before Calling Dispatch — Emergency Checklist</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-medium text-emerald-950">
          <div className="p-3.5 bg-white/90 rounded-2xl border border-emerald-200/60 shadow-2xs space-y-1">
            <span className="font-bold text-emerald-800 block">1. Confirm Exact Location</span>
            <p className="text-slate-600 text-[11px]">Note your street address, building gate number, or prominent landmark.</p>
          </div>

          <div className="p-3.5 bg-white/90 rounded-2xl border border-emerald-200/60 shadow-2xs space-y-1">
            <span className="font-bold text-emerald-800 block">2. State Patient Condition</span>
            <p className="text-slate-600 text-[11px]">Specify if oxygen support or an ICU ventilator unit is required.</p>
          </div>

          <div className="p-3.5 bg-white/90 rounded-2xl border border-emerald-200/60 shadow-2xs space-y-1">
            <span className="font-bold text-emerald-800 block">3. Keep Phone Line Free</span>
            <p className="text-slate-600 text-[11px]">Keep your line clear so the paramedic driver can reach you en route.</p>
          </div>

          <div className="p-3.5 bg-white/90 rounded-2xl border border-emerald-200/60 shadow-2xs space-y-1">
            <span className="font-bold text-emerald-800 block">4. Traffic & ETA Note</span>
            <p className="text-slate-600 text-[11px]">Real-time arrival time depends on local traffic density and weather.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
