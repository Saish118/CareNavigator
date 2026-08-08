import React, { useState, useEffect } from "react";
import { Navigation, Siren, PhoneCall, BedDouble, MapPin, Compass } from "lucide-react";
import { InteractiveMap } from "../components/navigation/InteractiveMap";
import { RouteDetails } from "../components/navigation/RouteDetails";
import { navigationService } from "../services/navigationService";
import { useEmergency } from "../context/EmergencyContext";
import { BedBookingModal } from "../components/hospital/BedBookingModal";
import { HOSPITALS_DATA } from "../data/hospitalsData";

export const MapPage = () => {
  const { activeDestinationHospital, setDestination, isEmergencySirenActive } = useEmergency();
  const [routeData, setRouteData] = useState(null);
  const [selectedHospitalForBed, setSelectedHospitalForBed] = useState(null);

  const targetHospital = activeDestinationHospital || HOSPITALS_DATA[0];

  useEffect(() => {
    const fetchRoute = async () => {
      const data = await navigationService.calculateRoute(targetHospital, {
        emergencySirenMode: isEmergencySirenActive,
      });
      setRouteData(data);
    };
    fetchRoute();
  }, [targetHospital, isEmergencySirenActive]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 overflow-x-hidden">
      {/* 1. HERO HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-blue-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-500/20 text-sky-300 text-xs font-black rounded-full border border-sky-500/30">
          <Navigation className="w-4 h-4 text-sky-400 animate-pulse" />
          <span>Siren Priority Corridor Routing</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Emergency Route & GPS Tracker
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl">
          Turn-by-turn interactive guidance optimized for emergency transport vehicles, Siren Priority Corridor traffic clearance, and immediate ER admission.
        </p>
      </div>

      {/* Main Grid: Interactive Canvas + Route Details Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Map Canvas (2 cols) */}
        <div className="lg:col-span-2">
          <InteractiveMap
            destinationHospital={targetHospital}
            onSelectHospital={(h) => setDestination(h)}
            onBookBed={(h) => setSelectedHospitalForBed(h)}
          />
        </div>

        {/* Route Details Panel (1 col) */}
        <div className="lg:col-span-1 space-y-6">
          <RouteDetails routeData={routeData} isSirenActive={isEmergencySirenActive} />
        </div>
      </div>

      <BedBookingModal
        isOpen={!!selectedHospitalForBed}
        onClose={() => setSelectedHospitalForBed(null)}
        hospital={selectedHospitalForBed}
      />
    </div>
  );
};
