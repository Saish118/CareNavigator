import React from "react";
import {
  PhoneCall,
  Ambulance,
  ShieldAlert,
  Flame,
  CheckCircle2,
  HeartPulse,
  Activity,
  MapPin,
  Clock,
  Info,
  Building2,
  Phone,
  Zap,
} from "lucide-react";
import { HOSPITALS_DATA } from "../data/hospitalsData";

export const MapPage = () => {
  const emergencyHelplines = [
    {
      title: "National Emergency Helpline",
      number: "112",
      description: "24/7 Unified emergency response service for all urgent medical, police, and safety events.",
      color: "bg-rose-50 text-rose-700 border-rose-200",
      iconColor: "bg-rose-600 text-white",
    },
    {
      title: "Ambulance & Trauma Response",
      number: "102 / 108",
      description: "Immediate emergency ambulance dispatch with oxygen and advanced life support capabilities.",
      color: "bg-emerald-50 text-emerald-800 border-emerald-200",
      iconColor: "bg-emerald-600 text-white",
    },
    {
      title: "Police Control Room",
      number: "100",
      description: "Immediate law enforcement assistance, highway emergency escort, and traffic clearance.",
      color: "bg-blue-50 text-blue-800 border-blue-200",
      iconColor: "bg-blue-600 text-white",
    },
    {
      title: "Fire & Rescue Department",
      number: "101",
      description: "Fire suppression, vehicle extrication, chemical hazard containment, and disaster response.",
      color: "bg-amber-50 text-amber-800 border-amber-200",
      iconColor: "bg-amber-600 text-white",
    },
  ];

  const hospitalAmbulances = HOSPITALS_DATA.map((h) => ({
    hospitalName: h.name,
    address: h.address,
    phone: h.erDirectPhone,
    distanceKm: h.distanceKm,
    fleetType: "Cardiac & Advanced ICU Mobile Unit",
    oxygenSupport: true,
    ventilatorSupport: h.beds.ventilator.available > 0,
    status: "Available Now",
    availableUnits: h.telemetry.ambulancesAvailable,
  }));

  const privateAmbulanceProviders = [
    {
      id: 1,
      name: "Lifeline Emergency Express Ambulance",
      coverage: "Metro Wide (Sector 1 - 12)",
      phone: "+1 (800) 555-LIFE",
      oxygenSupport: true,
      ventilatorSupport: true,
      status: "Available 24/7",
      eta: "8 - 12 mins",
      type: "Advanced Life Support (ALS)",
    },
    {
      id: 2,
      name: "City Trauma Responders Network",
      coverage: "Downtown & Highway Bypass",
      phone: "+1 (800) 555-[#7721]",
      oxygenSupport: true,
      ventilatorSupport: false,
      status: "Available 24/7",
      eta: "10 - 15 mins",
      type: "Basic Life Support (BLS)",
    },
    {
      id: 3,
      name: "Metro Critical Care Transport",
      coverage: "Suburban & Regional Highway",
      phone: "+1 (800) 555-9988",
      oxygenSupport: true,
      ventilatorSupport: true,
      status: "Available 24/7",
      eta: "12 - 18 mins",
      type: "Neonatal & ICU Transport",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 overflow-x-hidden">
      {/* 1. HERO HEADER BANNER */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-slate-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/20 text-rose-300 text-xs font-black rounded-full border border-rose-500/30">
          <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
          <span>Emergency Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Emergency Services Directory
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl">
          Verified direct contact numbers for national emergency helplines, hospital ICU ambulance fleets, and private emergency transport providers.
        </p>
      </div>

      {/* 2. EMERGENCY CONTACT NUMBERS SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <PhoneCall className="w-6 h-6 text-rose-600 shrink-0" /> Primary Emergency Contact Numbers
          </h2>
          <span className="text-xs font-bold text-slate-500">Toll-Free 24/7 Hotlines</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {emergencyHelplines.map((item, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-3xl border shadow-sm space-y-3 flex flex-col justify-between ${item.color}`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-600">
                    {item.title}
                  </span>
                  <div className={`p-2 rounded-xl ${item.iconColor} shrink-0`}>
                    <Phone className="w-4 h-4" />
                  </div>
                </div>
                <span className="text-3xl sm:text-4xl font-black tracking-tight block text-slate-950">
                  {item.number}
                </span>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {item.description}
                </p>
              </div>

              <a
                href={`tel:${item.number}`}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5" /> Call Hotline Now
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* 3. HOSPITAL AMBULANCE FLEETS SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Ambulance className="w-6 h-6 text-blue-600 shrink-0" /> Hospital Ambulance Fleets
          </h2>
          <span className="text-xs font-medium text-slate-500">Direct ER Stationed Units</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hospitalAmbulances.map((amb, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:border-blue-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{amb.hospitalName}</h3>
                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{amb.distanceKm} km away</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-[10px] font-black bg-emerald-100 text-emerald-800 rounded-lg shrink-0 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> {amb.status}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5 text-xs">
                  <span className="font-bold text-slate-700 block">{amb.fleetType}</span>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-md flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Oxygen Support
                    </span>
                    {amb.ventilatorSupport && (
                      <span className="px-2 py-0.5 bg-sky-100 text-sky-800 font-bold text-[10px] rounded-md flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Ventilator ALS
                      </span>
                    )}
                    <span className="px-2 py-0.5 bg-slate-200 text-slate-700 font-bold text-[10px] rounded-md">
                      {amb.availableUnits} Units On Shift
                    </span>
                  </div>
                </div>
              </div>

              <a
                href={`tel:${amb.phone}`}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5" /> Direct Call Dispatch ({amb.phone})
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* 4. PRIVATE AMBULANCE PROVIDERS SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-purple-600 shrink-0" /> Private Ambulance Providers
          </h2>
          <span className="text-xs font-medium text-slate-500">24/7 Independent Services</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {privateAmbulanceProviders.map((prov) => (
            <div
              key={prov.id}
              className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{prov.name}</h3>
                    <span className="text-xs text-slate-500 font-medium block mt-0.5">{prov.coverage}</span>
                  </div>
                  <span className="px-2.5 py-1 text-[10px] font-black bg-purple-100 text-purple-800 rounded-lg shrink-0">
                    {prov.status}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Service Level:</span>
                    <strong className="text-slate-900">{prov.type}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Estimated Response:</span>
                    <strong className="text-emerald-700">{prov.eta}</strong>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {prov.oxygenSupport && (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-md">
                        Oxygen Support Fitted
                      </span>
                    )}
                    {prov.ventilatorSupport && (
                      <span className="px-2 py-0.5 bg-sky-100 text-sky-800 font-bold text-[10px] rounded-md">
                        Ventilator Unit
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <a
                href={`tel:${prov.phone}`}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5" /> Call Private Dispatch ({prov.phone})
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
