import React from "react";
import {
  PhoneCall,
  Ambulance,
  ShieldAlert,
  Flame,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Info,
  Building2,
  Phone,
  Zap,
  Check,
  AlertTriangle,
  HeartPulse,
} from "lucide-react";
import { HOSPITALS_DATA } from "../data/hospitalsData";

export const MapPage = () => {
  // SECTION 1: 6 Hospital Ambulances
  const hospitalAmbulanceFleet = [
    {
      id: "AMB-101",
      hospitalName: "St. Jude Metro Cardiac Center",
      image: "https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=800&q=80",
      vehicleType: "ICU Ambulance",
      oxygenSupport: true,
      ventilatorAvailable: true,
      status: "Available",
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
      status: "Available",
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
      status: "Available",
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
      status: "Available",
      responseTime: "7 - 12 mins",
      contactNumber: "+1 (800) 555-0618",
    },
  ];

  // SECTION 2: 6 Private Ambulance Providers
  const privateAmbulanceProviders = [
    {
      id: "PVT-01",
      name: "Lifeline Emergency Express",
      image: "https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=400&q=80",
      vehicleType: "Advanced Life Support (ALS)",
      coverageArea: "Sector 1 to 12 & Central Metro",
      availability: "24×7 Active",
      contactNumber: "+1 (800) 555-7711",
    },
    {
      id: "PVT-02",
      name: "City Trauma Responders Network",
      image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=400&q=80",
      vehicleType: "Basic Life Support (BLS)",
      coverageArea: "Downtown & Express Highway Corridor",
      availability: "24×7 Active",
      contactNumber: "+1 (800) 555-8822",
    },
    {
      id: "PVT-03",
      name: "Metro Critical Care Transport",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80",
      vehicleType: "Neonatal & ICU Mobile Unit",
      coverageArea: "Suburban Districts & Outer Ring Road",
      availability: "24×7 Active",
      contactNumber: "+1 (800) 555-9933",
    },
    {
      id: "PVT-04",
      name: "Apex Cardiac Rescue Response",
      image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=400&q=80",
      vehicleType: "Cardiac Life Support Ambulance",
      coverageArea: "North Zone & Healthcare Hub",
      availability: "24×7 Active",
      contactNumber: "+1 (800) 555-4444",
    },
    {
      id: "PVT-05",
      name: "Rapid Shield Medical Transport",
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=400&q=80",
      vehicleType: "Patient Transfer & BLS Ambulance",
      coverageArea: "Westside Corridor & Airport Zone",
      availability: "24×7 Active",
      contactNumber: "+1 (800) 555-5555",
    },
    {
      id: "PVT-06",
      name: "Global Helipad & ER Ambulance Services",
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=400&q=80",
      vehicleType: "Air & Ground Critical ICU Fleet",
      coverageArea: "Regional State Highways & Inter-city",
      availability: "24×7 Active",
      contactNumber: "+1 (800) 555-6666",
    },
  ];

  // SECTION 3: Emergency Contact Cards
  const emergencyNumbers = [
    {
      title: "National Ambulance",
      number: "108 / 102",
      description: "24/7 National Emergency Medical Service hotline for immediate patient transport and trauma response.",
      color: "bg-rose-50 text-rose-800 border-rose-200",
      badgeColor: "bg-rose-600 text-white",
      icon: Ambulance,
    },
    {
      title: "Police Control Room",
      number: "100 / 911",
      description: "Immediate emergency law enforcement assistance, traffic priority clearance, and accident response.",
      color: "bg-blue-50 text-blue-800 border-blue-200",
      badgeColor: "bg-blue-600 text-white",
      icon: ShieldAlert,
    },
    {
      title: "Fire & Rescue Department",
      number: "101",
      description: "Rapid fire suppression, hazmat containment, vehicle extrication, and disaster rescue operations.",
      color: "bg-amber-50 text-amber-800 border-amber-200",
      badgeColor: "bg-amber-600 text-white",
      icon: Flame,
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "Available":
        return (
          <span className="px-2.5 py-1 text-[11px] font-black bg-emerald-100 text-emerald-800 rounded-lg flex items-center gap-1 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> Available
          </span>
        );
      case "On Call":
        return (
          <span className="px-2.5 py-1 text-[11px] font-black bg-amber-100 text-amber-800 rounded-lg flex items-center gap-1 border border-amber-200">
            <Clock className="w-3 h-3" /> On Call
          </span>
        );
      case "Busy":
        return (
          <span className="px-2.5 py-1 text-[11px] font-black bg-rose-100 text-rose-800 rounded-lg flex items-center gap-1 border border-rose-200">
            <XCircle className="w-3 h-3" /> Busy
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 overflow-x-hidden">
      {/* HERO HEADER BANNER */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-slate-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/20 text-rose-300 text-xs font-black rounded-full border border-rose-500/30">
          <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
          <span>Emergency Response Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Emergency Services Directory
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl">
          Real-time directory of hospital ambulance fleets, private emergency transport providers, and 24/7 national emergency hotlines.
        </p>
      </div>

      {/* SECTION 1: HOSPITAL AMBULANCES */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Ambulance className="w-6 h-6 text-rose-600 shrink-0" /> Hospital Ambulances
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Direct emergency fleets stationed at level-1 trauma facilities.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            6 Units Online
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hospitalAmbulanceFleet.map((amb) => (
            <div
              key={amb.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden hover:border-rose-300 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Photo Banner */}
                <div className="relative h-44 w-full bg-slate-800 overflow-hidden">
                  <img
                    src={amb.image}
                    alt={amb.hospitalName}
                    className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  {/* ID Badge */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-slate-900/80 text-white font-mono font-bold text-xs rounded-xl backdrop-blur-md border border-white/20">
                    {amb.id}
                  </span>

                  {/* Status Pill */}
                  <div className="absolute top-3 right-3">{getStatusBadge(amb.status)}</div>

                  {/* Hospital Title overlay */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-bold text-sm leading-tight drop-shadow-md line-clamp-1">
                      {amb.hospitalName}
                    </h3>
                  </div>
                </div>

                {/* Details Body */}
                <div className="p-5 space-y-3.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-semibold">Vehicle Type:</span>
                    <strong className="text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">
                      {amb.vehicleType}
                    </strong>
                  </div>

                  {/* Features & Equipment Badges */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className={`p-2 rounded-xl border flex items-center gap-1.5 ${amb.oxygenSupport ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-slate-50 border-slate-200 text-slate-400"}`}>
                      {amb.oxygenSupport ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <XCircle className="w-3.5 h-3.5 shrink-0" />}
                      <span className="font-bold text-[11px]">Oxygen Support: {amb.oxygenSupport ? "Yes" : "No"}</span>
                    </div>

                    <div className={`p-2 rounded-xl border flex items-center gap-1.5 ${amb.ventilatorAvailable ? "bg-sky-50 border-sky-200 text-sky-900" : "bg-slate-50 border-slate-200 text-slate-500"}`}>
                      {amb.ventilatorAvailable ? <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" /> : <XCircle className="w-3.5 h-3.5 shrink-0" />}
                      <span className="font-bold text-[11px]">Ventilator: {amb.ventilatorAvailable ? "Yes" : "No"}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                    <span className="text-slate-500 font-semibold">Est. Response Time:</span>
                    <strong className="text-rose-600 font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {amb.responseTime}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Call Button Footer */}
              <div className="p-5 pt-0">
                <a
                  href={`tel:${amb.contactNumber}`}
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md shadow-rose-600/20"
                >
                  <PhoneCall className="w-3.5 h-3.5" /> Call Ambulance ({amb.contactNumber})
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: PRIVATE AMBULANCE PROVIDERS */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-purple-600 shrink-0" /> Private Ambulance Providers
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Independent 24/7 emergency medical transport providers and patient transfers.
            </p>
          </div>
          <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            24×7 Available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {privateAmbulanceProviders.map((prov) => (
            <div
              key={prov.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-5 flex flex-col justify-between space-y-4 hover:border-purple-300 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={prov.image}
                    alt={prov.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug">{prov.name}</h3>
                    <span className="inline-block mt-0.5 px-2 py-0.5 bg-purple-100 text-purple-800 font-bold text-[10px] rounded-md">
                      {prov.availability}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Vehicle Type:</span>
                    <strong className="text-slate-900 font-semibold">{prov.vehicleType}</strong>
                  </div>

                  <div className="flex items-start justify-between text-slate-600">
                    <span className="shrink-0">Coverage Area:</span>
                    <strong className="text-slate-800 text-right font-medium pl-2">{prov.coverageArea}</strong>
                  </div>
                </div>
              </div>

              <a
                href={`tel:${prov.contactNumber}`}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
              >
                <PhoneCall className="w-3.5 h-3.5" /> Call Provider ({prov.contactNumber})
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: EMERGENCY NUMBERS */}
      <section className="space-y-6">
        <div className="border-b border-slate-200 pb-3">
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
                className={`p-6 rounded-3xl border shadow-md space-y-4 flex flex-col justify-between ${num.color}`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                      {num.title}
                    </span>
                    <div className={`p-2.5 rounded-2xl ${num.badgeColor} shadow-sm shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <span className="text-4xl font-black tracking-tight text-slate-950 block">
                    {num.number}
                  </span>

                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    {num.description}
                  </p>
                </div>

                <a
                  href={`tel:${num.number}`}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
                >
                  <PhoneCall className="w-4 h-4" /> Dial {num.number}
                </a>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 4: IMPORTANT INFORMATION */}
      <section className="bg-amber-50/80 border border-amber-200/80 rounded-3xl p-6 sm:p-8 space-y-3 shadow-xs">
        <div className="flex items-center gap-2 text-amber-800 font-bold text-base">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>Important Information & Guidelines</span>
        </div>

        <ul className="space-y-2 text-xs sm:text-sm text-amber-900 font-medium leading-relaxed pl-7 list-disc">
          <li>
            Ambulance availability and live statuses displayed on this directory are illustrative and subject to real-time dispatch updates.
          </li>
          <li>
            Always call the hospital or private ambulance provider directly to confirm vehicle location and dispatch readiness.
          </li>
          <li>
            Estimated response times depend on traffic congestion, weather, and geographical proximity to your location.
          </li>
        </ul>
      </section>
    </div>
  );
};
