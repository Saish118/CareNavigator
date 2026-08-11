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
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  GitCompare,
} from "lucide-react";
import { Card } from "../common/Card";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";
import { useBookmark } from "../../context/BookmarkContext";
import { useToast } from "../ui/ToastNotification";
import { openHospitalDirections } from "../../utils/navigationUtils";

export const HospitalCard = ({
  hospital,
  onNavigate,
  onSelectDetails,
  onSpecialtySelect,
  isCompared = false,
  onToggleCompare,
}) => {
  const { toggleSaveHospital, isHospitalSaved } = useBookmark();
  const { addToast } = useToast();
  const isSaved = isHospitalSaved(hospital.id);
  const [bookmarkAnim, setBookmarkAnim] = useState(false);
  const [showQuickDetails, setShowQuickDetails] = useState(false);

  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    setBookmarkAnim(true);
    toggleSaveHospital(hospital.id);
    setTimeout(() => setBookmarkAnim(false), 400);
  };

  return (
    <Card className="h-full flex flex-col justify-between overflow-hidden border border-slate-200/80 hover:-translate-y-1 hover:shadow-xl hover:border-blue-400 transition-all duration-300 group">
      <div>
        {/* Hospital Card Banner Image */}
        <div className="relative h-44 w-full overflow-hidden bg-slate-900 shrink-0">
          <img
            src={hospital.image}
            alt={hospital.name}
            className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent" />

          {/* Primary Status Badge & Match */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
            <span className="px-2.5 py-1 text-[10px] font-black uppercase bg-emerald-600 text-white rounded-lg shadow-md flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping shrink-0" /> Open 24×7
            </span>

            {hospital.matchScore && (
              <Badge variant="success" size="sm" className="shadow-md font-extrabold bg-white/90 text-slate-900 border-none">
                {hospital.matchScore}% Match
              </Badge>
            )}
          </div>

          {/* Bookmark & Compare Actions */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            {onToggleCompare && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleCompare(hospital);
                }}
                className={`px-2.5 py-1.5 rounded-full text-xs font-bold backdrop-blur-md transition-all flex items-center gap-1 ${
                  isCompared
                    ? "bg-blue-600 text-white shadow-md border border-blue-400"
                    : "bg-white/80 hover:bg-white text-slate-700 hover:text-blue-600 shadow-xs"
                }`}
                title={isCompared ? "Remove from comparison" : "Compare hospital"}
              >
                <GitCompare className="w-3.5 h-3.5" />
                <span className="text-[10px] hidden sm:inline">{isCompared ? "Compared" : "Compare"}</span>
              </button>
            )}

            <button
              onClick={handleBookmarkClick}
              className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                bookmarkAnim ? "scale-125" : "scale-100"
              } ${
                isSaved
                  ? "bg-rose-500 text-white shadow-md"
                  : "bg-white/80 hover:bg-white text-slate-700 hover:text-rose-600 shadow-xs"
              }`}
              title={isSaved ? "Remove from saved" : "Save Hospital"}
            >
              <Bookmark className="w-4 h-4 fill-current shrink-0" />
            </button>
          </div>

          {/* Overlay Rating & Availability Bar */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-bold">
            <div className="flex items-center gap-1 bg-slate-900/80 px-2.5 py-1 rounded-xl border border-white/10">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
              <span>{hospital.rating ? hospital.rating : "Verified"}</span>
            </div>

            <div className="flex items-center gap-1 bg-blue-600/90 px-2.5 py-1 rounded-xl text-white font-bold border border-blue-400/40">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>{hospital.distanceKm != null ? `${hospital.distanceKm} km away` : hospital.city}</span>
            </div>
          </div>
        </div>

        {/* Card Body — DOMINANT VISUAL WEIGHT: Name, Distance, Availability */}
        <div className="p-4 sm:p-5 space-y-3">
          <div>
            <h3
              onClick={() => onSelectDetails(hospital)}
              className="text-base sm:text-lg font-black text-slate-900 hover:text-blue-600 transition-colors cursor-pointer line-clamp-1 tracking-tight break-words"
            >
              {hospital.name}
            </h3>

            {/* Quick Location & Availability Pill */}
            <div className="flex flex-wrap items-center justify-between gap-1.5 mt-1.5">
              <span className="text-xs font-semibold text-slate-600 flex items-center gap-1 min-w-0 truncate">
                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="truncate">{hospital.city || hospital.district}</span>
              </span>

              <span className="px-2 py-0.5 rounded-full text-[11px] sm:text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                {hospital.emergencyReady ? "🟢 Emergency Ready" : "Available"}
              </span>
            </div>
          </div>

          {/* EXPAND/COLLAPSE TOGGLE FOR BED BREAKDOWN & CONTACT INFO */}
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowQuickDetails(!showQuickDetails)}
              className="w-full min-h-[38px] py-2 px-3 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-between transition-colors cursor-pointer"
            >
              <span className="truncate pr-1">{showQuickDetails ? "Hide Capacity & Specs" : "View Capacity & Specs"}</span>
              {showQuickDetails ? <ChevronUp className="w-3.5 h-3.5 text-slate-500 shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />}
            </button>

            {/* EXPANDED BED BREAKDOWN & CONTACT INFO */}
            {showQuickDetails && (
              <div className="mt-3 space-y-3 animate-fadeIn">
                <div className="bg-slate-50 p-2.5 sm:p-3 rounded-2xl border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1">
                      <BedDouble className="w-3.5 h-3.5 text-blue-600 shrink-0" /> Hospital Capacity
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" /> Verified
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1 text-center text-xs">
                    <div className="p-1.5 rounded-xl border bg-white border-slate-200 text-slate-800">
                      <span className="block text-[9px] font-bold uppercase text-slate-500">Govt Beds</span>
                      <span className="text-[11px] sm:text-xs font-extrabold truncate block">{hospital.beds?.total || hospital.beds?.general || "Available"}</span>
                    </div>

                    <div className="p-1.5 rounded-xl border bg-emerald-50/70 border-emerald-200 text-emerald-900">
                      <span className="block text-[9px] font-bold uppercase text-slate-500">24/7 ER</span>
                      <span className="text-[11px] sm:text-xs font-extrabold truncate block">{hospital.erWaitTimeMin ? `${hospital.erWaitTimeMin}m Wait` : "Active"}</span>
                    </div>

                    <div className="p-1.5 rounded-xl border bg-purple-50/70 border-purple-200 text-purple-900">
                      <span className="block text-[9px] font-bold uppercase text-slate-500">CT / MRI</span>
                      <span className="text-[11px] sm:text-xs font-extrabold truncate block">{hospital.hasCtMri ? "Available" : "Standard"}</span>
                    </div>
                  </div>
                </div>

                {/* Specialty Tags */}
                {hospital.specialties && hospital.specialties.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {hospital.specialties.slice(0, 4).map((spec, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSpecialtySelect) onSpecialtySelect(spec);
                        }}
                        className="px-2 py-0.5 text-[10px] sm:text-[11px] font-medium bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 rounded-lg border border-slate-200/60 transition-colors cursor-pointer"
                      >
                        {spec}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons: Call ER, Navigate, Details */}
      <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 grid grid-cols-3 gap-1.5 sm:gap-2">
        <a
          href={`tel:${hospital.erDirectPhone}`}
          className="inline-flex items-center justify-center min-h-[42px] px-1.5 sm:px-2 text-[11px] sm:text-xs font-bold rounded-xl bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-700 border border-rose-200 transition-colors gap-1 w-full min-w-0"
        >
          <PhoneCall className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">Call ER</span>
        </a>

        <button
          type="button"
          onClick={() => openHospitalDirections(hospital, addToast)}
          className="inline-flex items-center justify-center min-h-[42px] px-1.5 sm:px-2 text-[11px] sm:text-xs font-bold rounded-xl bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 text-emerald-800 border border-emerald-200 transition-colors gap-1 w-full min-w-0 cursor-pointer"
        >
          <Navigation className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">Navigate</span>
        </button>

        <Button
          onClick={() => onSelectDetails(hospital)}
          variant="glass"
          size="sm"
          icon={Info}
          className="w-full min-h-[42px] px-1.5 sm:px-2 text-[11px] sm:text-xs font-bold"
        >
          Details
        </Button>
      </div>
    </Card>
  );
};

