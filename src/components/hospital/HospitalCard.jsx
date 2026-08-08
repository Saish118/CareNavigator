import React, { useState } from "react";
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
  Users,
  CheckCircle2,
  ExternalLink,
  GitCompare,
} from "lucide-react";
import { Card } from "../common/Card";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";
import { useBookmark } from "../../context/BookmarkContext";

export const HospitalCard = ({
  hospital,
  onNavigate,
  onSelectDetails,
  onSpecialtySelect,
  isCompared = false,
  onToggleCompare,
}) => {
  const { toggleSaveHospital, isHospitalSaved } = useBookmark();
  const isSaved = isHospitalSaved(hospital.id);
  const [bookmarkAnim, setBookmarkAnim] = useState(false);

  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    setBookmarkAnim(true);
    toggleSaveHospital(hospital.id);
    setTimeout(() => setBookmarkAnim(false), 400);
  };

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospital.name + " " + hospital.address)}`;
  const oxygenAvailable = hospital.beds?.oxygen?.available ?? 12;
  const doctorsCount = hospital.doctorsOnDuty?.length || 4;

  return (
    <Card className="h-full flex flex-col justify-between overflow-hidden border border-slate-200/80 hover:-translate-y-1 hover:shadow-xl hover:border-sky-400 transition-all duration-300 group">
      {/* Card Header Banner Image */}
      <div>
        <div className="relative h-48 w-full overflow-hidden bg-slate-800 shrink-0">
          <img
            src={hospital.image}
            alt={hospital.name}
            className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent" />

          {/* Requirement 2 & 3: Match Badge & Small Green Badge on image */}
          <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
            <Badge variant="success" size="sm" className="shadow-lg backdrop-blur-md font-extrabold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              Best Match • {hospital.matchScore}%
            </Badge>

            <span className="px-2.5 py-1 text-[10px] font-black uppercase bg-emerald-600 text-white rounded-lg shadow-md border border-emerald-400/40 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping shrink-0" /> Open 24×7
            </span>
          </div>

          {/* Bookmark & Compare Buttons */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            {onToggleCompare && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleCompare(hospital);
                }}
                className={`px-2.5 py-1.5 rounded-full text-xs font-bold backdrop-blur-md transition-all flex items-center gap-1 ${
                  isCompared
                    ? "bg-blue-600 text-white shadow-lg border border-blue-400"
                    : "bg-white/80 hover:bg-white text-slate-700 hover:text-blue-600 shadow-sm"
                }`}
                title={isCompared ? "Remove from comparison" : "Compare hospital"}
              >
                <GitCompare className="w-3.5 h-3.5" />
                <span className="text-[10px] hidden sm:inline">{isCompared ? "Compared" : "Compare"}</span>
              </button>
            )}

            <button
              onClick={handleBookmarkClick}
              className={`p-2.5 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                bookmarkAnim ? "scale-125" : "scale-100"
              } ${
                isSaved
                  ? "bg-rose-500 text-white shadow-lg"
                  : "bg-white/80 hover:bg-white text-slate-700 hover:text-rose-600 shadow-sm"
              }`}
              title={isSaved ? "Remove from saved" : "Save Hospital"}
            >
              <Bookmark className="w-4 h-4 fill-current shrink-0" />
            </button>
          </div>

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
        <div className="p-5 space-y-3.5">
          <div>
            <h3
              onClick={() => onSelectDetails(hospital)}
              className="text-lg font-bold text-slate-900 hover:text-sky-600 transition-colors cursor-pointer line-clamp-1"
            >
              {hospital.name}
            </h3>

            {/* Requirement 7: Small Status Line under Hospital Name */}
            <div className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>24×7 Emergency Services Available</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-2">
              <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span className="truncate">{hospital.address}</span>
              <span className="font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100 shrink-0">
                {hospital.distanceKm} km ({hospital.estimatedDriveMin} min)
              </span>
            </div>
          </div>

          {/* Requirement 4: Expanded Live Resource Telemetry (ICU, General, Oxygen, Doctors) */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1">
                <BedDouble className="w-4 h-4 text-sky-600 shrink-0" /> Live Resource Telemetry
              </span>
              <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping shrink-0" /> Updated 5s ago
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
              <div className={`p-1.5 rounded-xl border ${hospital.beds.icu.available > 0 ? "bg-emerald-50/70 border-emerald-200 text-emerald-900" : "bg-rose-50 border-rose-200 text-rose-800"}`}>
                <span className="block text-[9px] font-bold uppercase text-slate-500">ICU</span>
                <span className="text-xs font-extrabold">{hospital.beds.icu.available} Free</span>
              </div>

              <div className="p-1.5 rounded-xl border bg-slate-100/70 border-slate-200 text-slate-800">
                <span className="block text-[9px] font-bold uppercase text-slate-500">General</span>
                <span className="text-xs font-extrabold">{hospital.beds.general.available} Free</span>
              </div>

              <div className="p-1.5 rounded-xl border bg-sky-50/70 border-sky-200 text-sky-900">
                <span className="block text-[9px] font-bold uppercase text-slate-500">Oxygen</span>
                <span className="text-xs font-extrabold">{oxygenAvailable} Free</span>
              </div>

              <div className="p-1.5 rounded-xl border bg-purple-50/70 border-purple-200 text-purple-900">
                <span className="block text-[9px] font-bold uppercase text-slate-500">Doctors</span>
                <span className="text-xs font-extrabold">{doctorsCount} On Duty</span>
              </div>
            </div>
          </div>

          {/* Requirement 5: Clickable Specialty Tags */}
          <div className="flex flex-wrap items-center gap-1.5">
            {hospital.specialties.slice(0, 4).map((spec, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSpecialtySelect) onSpecialtySelect(spec);
                }}
                className="px-2 py-0.5 text-[11px] font-medium bg-slate-100 hover:bg-sky-100 text-slate-700 hover:text-sky-800 rounded-lg border border-slate-200/60 transition-colors cursor-pointer"
              >
                {spec}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Requirement 6: 3 Action Buttons in order: Call ER, Navigate, View Details */}
      <div className="p-5 pt-0 border-t border-slate-100 grid grid-cols-3 gap-2">
        <a
          href={`tel:${hospital.erDirectPhone}`}
          className="inline-flex items-center justify-center h-9 px-2 text-xs font-bold rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors gap-1 w-full min-w-0"
        >
          <PhoneCall className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">Call ER</span>
        </a>

        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center h-9 px-2 text-xs font-bold rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors gap-1 w-full min-w-0"
        >
          <Navigation className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">Navigate</span>
        </a>

        <Button
          onClick={() => onSelectDetails(hospital)}
          variant="glass"
          size="sm"
          icon={Info}
          className="w-full text-xs font-bold"
        >
          Details
        </Button>
      </div>
    </Card>
  );
};
