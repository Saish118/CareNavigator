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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-black text-sky-600 uppercase tracking-wider">
          <Navigation className="w-4 h-4" /> Siren Corridor Navigation System
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Emergency Route & GPS Tracker
        </h1>
        <p className="text-sm text-slate-600 font-medium mt-1">
          Turn-by-turn guidance optimized for emergency response vehicles and rapid ER admission.
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
