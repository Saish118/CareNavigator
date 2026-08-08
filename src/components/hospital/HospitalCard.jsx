import React from "react";
import {
  MapPin,
  Clock,
  Navigation,
  PhoneCall,
  BedDouble,
  Star,
  Bookmark,
  Sparkles,
  Info,
  HeartPulse,
} from "lucide-react";
import { Card } from "../common/Card";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";
import { useBookmark } from "../../context/BookmarkContext";

export const HospitalCard = ({
  hospital,
  onNavigate,
  onBookBed,
  onSelectDetails,
}) => {
  const { toggleSaveHospital, isHospitalSaved } = useBookmark();
  const isSaved = isHospitalSaved(hospital.id);

  const oxygenAvailable = hospital.beds?.oxygen?.available ?? 12;

  return (
    <Card className="h-full flex flex-col justify-between overflow-hidden border border-slate-200/80 hover:border-sky-300">
      {/* Card Header Banner Image */}
      <div>
        <div className="relative h-48 w-full overflow-hidden bg-slate-800 shrink-0">
          <img
            src={hospital.image}
            alt={hospital.name}
            className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent" />

          {/* Recommended Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <Badge variant="success" size="lg" className="shadow-lg backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              {hospital.matchScore}% Recommended
            </Badge>

            {hospital.badge && (
              <Badge variant="sky" size="sm" className="hidden sm:inline-flex">
                {hospital.badge}
              </Badge>
            )}
          </div>

          {/* Save / Bookmark Button */}
          <button
            onClick={() => toggleSaveHospital(hospital.id)}
            className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all ${
              isSaved
                ? "bg-rose-500 text-white shadow-lg"
                : "bg-white/80 hover:bg-white text-slate-700 hover:text-rose-600 shadow-sm"
            }`}
            title={isSaved ? "Remove from saved" : "Save Hospital"}
          >
            <Bookmark className="w-4 h-4 fill-current shrink-0" />
          </button>

          {/* Rating & ER wait time floating bar */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
            <div className="flex items-center gap-1.5 bg-slate-900/75 px-3 py-1 rounded-xl backdrop-blur-md border border-white/10">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
              <span>{hospital.rating}</span>
              <span className="text-slate-400">({hospital.reviewCount})</span>
            </div>

            <div className="flex items-center gap-1.5 bg-rose-600/90 px-3 py-1 rounded-xl backdrop-blur-md text-white font-bold border border-rose-400/40">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>ER Wait: {hospital.erWaitTimeMin} mins</span>
            </div>
          </div>
        </div>

        {/* Card Content Body */}
        <div className="p-5 space-y-4">
          <div>
            <h3
              onClick={() => onSelectDetails(hospital)}
              className="text-lg font-bold text-slate-900 hover:text-sky-600 transition-colors cursor-pointer line-clamp-1"
            >
              {hospital.name}
            </h3>
            <p className="text-xs font-medium text-slate-500 mt-0.5 line-clamp-1">
              {hospital.tagline}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-2">
              <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span className="truncate">{hospital.address}</span>
              <span className="font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100 shrink-0">
                {hospital.distanceKm} km ({hospital.estimatedDriveMin} min)
              </span>
            </div>
          </div>

          {/* Resource Telemetry Indicators */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1">
                <BedDouble className="w-4 h-4 text-sky-600 shrink-0" /> Live Resource Telemetry
              </span>
              <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" /> Updated 5s ago
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className={`p-2 rounded-xl border ${hospital.beds.icu.available > 0 ? "bg-emerald-50/70 border-emerald-200 text-emerald-900" : "bg-rose-50 border-rose-200 text-rose-800"}`}>
                <span className="block text-[10px] font-bold uppercase text-slate-500">ICU Beds</span>
                <span className="text-sm font-extrabold">{hospital.beds.icu.available} Free</span>
              </div>

              <div className="p-2 rounded-xl border bg-slate-100/70 border-slate-200 text-slate-800">
                <span className="block text-[10px] font-bold uppercase text-slate-500">General Beds</span>
                <span className="text-sm font-extrabold">{hospital.beds.general.available} Free</span>
              </div>

              <div className="p-2 rounded-xl border bg-sky-50/70 border-sky-200 text-sky-900">
                <span className="block text-[10px] font-bold uppercase text-slate-500">Oxygen Beds</span>
                <span className="text-sm font-extrabold">{oxygenAvailable} Free</span>
              </div>
            </div>
          </div>

          {/* Specialties Tags */}
          <div className="flex flex-wrap items-center gap-1.5">
            {hospital.specialties.slice(0, 4).map((spec, i) => (
              <span
                key={i}
                className="px-2 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-700 rounded-lg border border-slate-200/60"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons Footer */}
      <div className="p-5 pt-0 border-t border-slate-100 grid grid-cols-2 gap-2">
        <a
          href={`tel:${hospital.erDirectPhone}`}
          className="inline-flex items-center justify-center h-9 px-2 sm:px-3 text-xs font-semibold rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors gap-1 sm:gap-1.5 w-full min-w-0"
        >
          <PhoneCall className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">Call ER</span>
        </a>

        <Button
          onClick={() => onSelectDetails(hospital)}
          variant="primary"
          size="sm"
          icon={Info}
          className="w-full"
        >
          View Details
        </Button>
      </div>
    </Card>
  );
};
