import React, { useState } from "react";
import {
  Navigation,
  MapPin,
  Siren,
  Car,
  Layers,
  Compass,
  AlertTriangle,
  Zap,
  PhoneCall,
  BedDouble,
  Sparkles,
} from "lucide-react";
import { HOSPITALS_DATA } from "../../data/hospitalsData";
import { Button } from "../common/Button";
import { useEmergency } from "../../context/EmergencyContext";

export const InteractiveMap = ({
  destinationHospital = HOSPITALS_DATA[0],
  onSelectHospital,
  onBookBed,
}) => {
  const { isEmergencySirenActive, toggleSirenMode, userLocation } = useEmergency();
  const [selectedPin, setSelectedPin] = useState(destinationHospital);
  const [mapStyle, setMapStyle] = useState("traffic"); // "traffic", "satellite", "clean"

  // Map simulation pin coordinates scaled onto SVG canvas
  const pins = HOSPITALS_DATA.map((h, i) => {
    // Layout points across mock canvas
    const canvasX = 150 + (i % 3) * 260 + (i * 20);
    const canvasY = 120 + Math.floor(i / 3) * 220 + (i * 15);
    return { ...h, canvasX, canvasY };
  });

  const activeTargetPin = pins.find((p) => p.id === (selectedPin?.id || destinationHospital.id)) || pins[0];
  const userPin = { canvasX: 180, canvasY: 420 };

  return (
    <div className="relative w-full h-[620px] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col justify-between">
      {/* Top Map Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 bg-slate-900/85 backdrop-blur-md p-3 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-600/20 text-sky-400 rounded-xl border border-sky-500/30">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              GPS Corridor: {userLocation.city}
              <span className="px-2 py-0.5 text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 rounded-md border border-emerald-500/40">
                Live Signal Locked
              </span>
            </h4>
            <p className="text-xs text-slate-400">
              Navigating to: <span className="font-bold text-sky-400">{activeTargetPin.name}</span> ({activeTargetPin.distanceKm} km)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Emergency Siren Mode Toggle */}
          <button
            onClick={toggleSirenMode}
            className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-lg cursor-pointer ${
              isEmergencySirenActive
                ? "bg-rose-600 text-white animate-pulse shadow-rose-600/50 border-2 border-rose-400"
                : "bg-slate-800 hover:bg-slate-700 text-rose-400 border border-rose-500/40"
            }`}
          >
            <Siren className={`w-4 h-4 ${isEmergencySirenActive ? "animate-bounce" : ""}`} />
            {isEmergencySirenActive ? "Siren Priority Corridor ACTIVE" : "Enable Emergency Siren Route"}
          </button>
        </div>
      </div>

      {/* SVG Interactive Map Vector Canvas */}
      <div className="w-full h-full relative bg-[#0b1329] overflow-hidden cursor-grab active:cursor-grabbing">
        <svg className="w-full h-full" viewBox="0 0 900 600" preserveAspectRatio="xMidYMid slice">
          <defs>
            {/* Grid Pattern */}
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="1" />
            </pattern>
            {/* Pulsing Target Marker glow */}
            <radialGradient id="targetGlow">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Map Grid Background */}
          <rect width="100%" height="100%" fill="#0b1329" />
          <rect width="100%" height="100%" fill="url(#grid)" opacity="0.7" />

          {/* Simulated Road Arteries */}
          <path d="M 50 150 Q 250 180 500 120 T 850 200" stroke="#1e293b" strokeWidth="24" fill="none" strokeLinecap="round" />
          <path d="M 180 550 Q 300 350 480 320 T 750 140" stroke="#1e293b" strokeWidth="20" fill="none" strokeLinecap="round" />

          {/* Active Navigation Polyline with Traffic Heat colors */}
          <path
            d={`M ${userPin.canvasX} ${userPin.canvasY} Q ${userPin.canvasX + 100} ${(userPin.canvasY + activeTargetPin.canvasY) / 2} ${activeTargetPin.canvasX} ${activeTargetPin.canvasY}`}
            stroke={isEmergencySirenActive ? "#f43f5e" : "#10b981"}
            strokeWidth="8"
            strokeDasharray={isEmergencySirenActive ? "12 6" : "none"}
            fill="none"
            strokeLinecap="round"
            className={isEmergencySirenActive ? "animate-pulse" : ""}
          />

          {/* User Location Marker (Pulse Ring) */}
          <g transform={`translate(${userPin.canvasX}, ${userPin.canvasY})`}>
            <circle r="22" fill="url(#targetGlow)" className="animate-ping" />
            <circle r="12" fill="#0284c7" stroke="#ffffff" strokeWidth="3" />
            <circle r="4" fill="#ffffff" />
            <text x="18" y="5" fill="#38bdf8" fontSize="11" fontWeight="bold">
              YOUR LOCATION (GPS)
            </text>
          </g>

          {/* Hospital Pins */}
          {pins.map((pin) => {
            const isSelected = pin.id === activeTargetPin.id;
            return (
              <g
                key={pin.id}
                transform={`translate(${pin.canvasX}, ${pin.canvasY})`}
                onClick={() => {
                  setSelectedPin(pin);
                  if (onSelectHospital) onSelectHospital(pin);
                }}
                className="cursor-pointer group"
              >
                {isSelected && (
                  <circle r="30" fill="none" stroke="#38bdf8" strokeWidth="2" className="animate-ping" />
                )}
                {/* Pin Circle */}
                <circle
                  r={isSelected ? "18" : "14"}
                  fill={isSelected ? "#0284c7" : "#0f172a"}
                  stroke={isSelected ? "#ffffff" : pin.beds.icu.available > 0 ? "#10b981" : "#f43f5e"}
                  strokeWidth="3"
                  className="transition-all duration-300 group-hover:scale-125"
                />

                {/* Cross Icon */}
                <path
                  d="M -5 0 L 5 0 M 0 -5 L 0 5"
                  stroke="#ffffff"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Label Tooltip */}
                <foreignObject x="-75" y="-55" width="150" height="40">
                  <div
                    className={`px-2 py-1 rounded-lg text-[10px] font-extrabold text-center shadow-lg transition-all ${
                      isSelected
                        ? "bg-sky-600 text-white border border-sky-400 scale-105"
                        : "bg-slate-900/90 text-slate-200 border border-slate-700"
                    }`}
                  >
                    {pin.name.split(" ")[0]} ({pin.beds.icu.available} ICU)
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Bottom Floating Hospital Info Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-20 bg-slate-900/95 backdrop-blur-xl p-4 rounded-2xl border border-slate-800 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-12 h-12 rounded-xl bg-sky-600/20 border border-sky-500/40 flex items-center justify-center text-sky-400 shrink-0">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-base text-white">{activeTargetPin.name}</h4>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 rounded-md border border-emerald-500/30">
                {activeTargetPin.matchScore}% Match
              </span>
            </div>
            <p className="text-xs text-slate-400">
              ETA: <span className="font-bold text-emerald-400">{isEmergencySirenActive ? Math.max(2, Math.round(activeTargetPin.estimatedDriveMin * 0.65)) : activeTargetPin.estimatedDriveMin} mins</span> | Wait: {activeTargetPin.erWaitTimeMin} mins | ICU Beds: {activeTargetPin.beds.icu.available} available
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Button
            onClick={() => onBookBed && onBookBed(activeTargetPin)}
            variant="emerald"
            size="sm"
            icon={BedDouble}
          >
            Reserve ICU Bed
          </Button>

          <a
            href={`tel:${activeTargetPin.erDirectPhone}`}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-rose-600/30 transition-colors"
          >
            <PhoneCall className="w-4 h-4" /> Call ER
          </a>
        </div>
      </div>
    </div>
  );
};
