import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Sparkles,
  Stethoscope,
  MapPin,
  Clock,
  BedDouble,
  Navigation,
  Star,
  CheckCircle2,
  ShieldAlert,
  Flame,
  Award,
} from "lucide-react";
import { SearchInput } from "../components/common/SearchInput";
import { HospitalFilter } from "../components/hospital/HospitalFilter";
import { HospitalCard } from "../components/hospital/HospitalCard";
import { hospitalService } from "../services/hospitalService";
import { BedBookingModal } from "../components/hospital/BedBookingModal";
import { HospitalDetailModal } from "../components/hospital/HospitalDetailModal";
import { PrimaryButton } from "../components/buttons/PrimaryButton";
import { SecondaryButton } from "../components/buttons/SecondaryButton";
import { useEmergency } from "../context/EmergencyContext";
import { useBookmark } from "../context/BookmarkContext";

export const RecommenderPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setDestination } = useEmergency();
  const { toggleSaveHospital, isHospitalSaved } = useBookmark();

  const initialQuery = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [locationName, setLocationName] = useState("Sector 4, Metro City (Current GPS)");
  const [activeSpecialtyChip, setActiveSpecialtyChip] = useState("All");

  const [filters, setFilters] = useState({
    specialty: "All Specialties",
    insurance: "All Insurance Providers",
    maxDistanceKm: 25,
    requireIcu: false,
    requireHeliport: false,
    sortBy: "aiMatch",
  });

  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHospitalForBed, setSelectedHospitalForBed] = useState(null);
  const [selectedHospitalForDetail, setSelectedHospitalForDetail] = useState(null);

  const specialtyChips = [
    "All",
    "Cardiology",
    "Emergency Trauma",
    "Pediatrics",
    "Neurology",
    "Pulmonology",
    "Orthopedics",
  ];

  const locationsList = [
    "Sector 4, Metro City (Current GPS)",
    "North District, Central Zone",
    "Downtown Healthcare Corridor",
    "Westside Metro Expressway",
  ];

  const loadHospitals = async () => {
    setLoading(true);
    const data = await hospitalService.getHospitals({
      searchQuery: searchQuery,
      ...filters,
    });
    setHospitals(data);
    setLoading(false);
  };

  useEffect(() => {
    loadHospitals();
  }, [searchQuery, filters]);

  const handleChipSelect = (chip) => {
    setActiveSpecialtyChip(chip);
    const mappedSpecialty = chip === "All" ? "All Specialties" : chip;
    setFilters((prev) => ({ ...prev, specialty: mappedSpecialty }));
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSearchParams({});
    setActiveSpecialtyChip("All");
    setFilters({
      specialty: "All Specialties",
      insurance: "All Insurance Providers",
      maxDistanceKm: 25,
      requireIcu: false,
      requireHeliport: false,
      sortBy: "aiMatch",
    });
  };

  const handleNavigate = (h) => {
    setDestination(h);
    navigate("/map");
  };

  const topRecommended = hospitals.length > 0 ? hospitals[0] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. HERO HEADING & AI SEARCH BAR */}
      <div className="bg-gradient-to-b from-blue-50/80 via-white to-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-black rounded-full border border-blue-200">
              <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
              <span>AI Hospital Recommendation Engine</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Hospital Discovery & Live Telemetry Search
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-2xl">
              Discover trauma centers evaluated by live ICU bed availability, ER wait times, distance, and specialized clinical care.
            </p>
          </div>

          {/* Location Selector */}
          <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl border border-slate-200 shadow-sm shrink-0">
            <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
            <div className="text-xs">
              <span className="text-slate-400 font-bold block text-[10px] uppercase">Location</span>
              <select
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer text-xs"
              >
                {locationsList.map((loc, i) => (
                  <option key={i} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* AI Search Bar */}
        <div className="max-w-3xl">
          <SearchInput
            value={searchQuery}
            onChange={(q) => setSearchQuery(q)}
            onSearch={(q) => {
              setSearchQuery(q);
              setSearchParams(q ? { q } : {});
            }}
          />
        </div>

        {/* Specialty Filter Chips */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Quick Specialty Filters
          </span>
          <div className="flex flex-wrap gap-2">
            {specialtyChips.map((chip) => {
              const isSelected = activeSpecialtyChip === chip;
              return (
                <button
                  key={chip}
                  onClick={() => handleChipSelect(chip)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50/50"
                  }`}
                >
                  {chip}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. HIGHLIGHTED TOP RECOMMENDED HOSPITAL */}
      {topRecommended && !loading && (
        <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl border border-slate-800 relative overflow-hidden space-y-6">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700/80 pb-4">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-amber-400/20 text-amber-400 rounded-xl border border-amber-400/30">
                <Award className="w-5 h-5" />
              </span>
              <div>
                <span className="text-xs font-black uppercase text-amber-400 tracking-wider">
                  Top Recommended Facility
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">{topRecommended.name}</h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1.5 bg-emerald-500/20 text-emerald-300 font-extrabold text-xs rounded-full border border-emerald-400/40">
                <Sparkles className="w-4 h-4 inline mr-1" />
                {topRecommended.matchScore}% AI Match Score
              </span>
              <button
                onClick={() => toggleSaveHospital(topRecommended.id)}
                className={`p-2 rounded-full border transition-all ${
                  isHospitalSaved(topRecommended.id)
                    ? "bg-rose-500 text-white border-rose-400"
                    : "bg-slate-800/80 text-slate-300 border-slate-700 hover:text-white"
                }`}
                title="Save Hospital"
              >
                ★
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="space-y-2 md:col-span-2">
              <p className="text-slate-300 font-medium leading-relaxed">
                <strong>Why Recommended:</strong> Highest match rank based on open Cardiac ICU beds, 5-minute ER triage response time, and 1.8 km proximity from your location.
              </p>

              <div className="flex flex-wrap gap-4 text-slate-300 pt-2">
                <span>📍 <strong>{topRecommended.distanceKm} km</strong> ({topRecommended.estimatedDriveMin} mins drive)</span>
                <span>⭐ <strong>{topRecommended.rating}</strong> ({topRecommended.reviewCount} reviews)</span>
                <span>⏱️ ER Wait: <strong className="text-rose-400">{topRecommended.erWaitTimeMin} mins</strong></span>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {topRecommended.specialties.map((s, i) => (
                  <span key={i} className="px-2.5 py-1 bg-slate-800/90 text-slate-200 rounded-lg border border-slate-700 text-[11px] font-bold">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700/80 space-y-3 justify-between flex flex-col">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Live Telemetry Bed Counts</span>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">ICU Beds:</span>
                  <span className="font-extrabold text-emerald-400">{topRecommended.beds.icu.available} Available</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Ventilator Beds:</span>
                  <span className="font-extrabold text-sky-400">{topRecommended.beds.ventilator.available} Available</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">General Beds:</span>
                  <span className="font-bold text-slate-200">{topRecommended.beds.general.available} Available</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <PrimaryButton
                  onClick={() => setSelectedHospitalForBed(topRecommended)}
                  size="sm"
                  className="flex-1"
                  icon={BedDouble}
                >
                  Reserve Bed
                </PrimaryButton>
                <SecondaryButton
                  onClick={() => handleNavigate(topRecommended)}
                  size="sm"
                  className="bg-slate-700 text-white border-slate-600 hover:bg-slate-600"
                  icon={Navigation}
                >
                  Siren Route
                </SecondaryButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. MAIN SEARCH SECTION: FILTER SIDEBAR + HOSPITAL CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Smart Filter Sidebar */}
        <div className="lg:col-span-1">
          <HospitalFilter
            filters={filters}
            onChange={(newF) => setFilters(newF)}
            onReset={handleResetFilters}
            totalResultsCount={hospitals.length}
          />
        </div>

        {/* Hospital Results Cards List */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900">
              Matched Facilities ({hospitals.length})
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Sorted by: <strong className="text-slate-800">AI Match Rank</strong>
            </span>
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-400 font-semibold bg-white rounded-3xl border border-slate-200">
              Evaluating live telemetry, ER wait times & calculating AI match scores...
            </div>
          ) : hospitals.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <Stethoscope className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">No Facilities Found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No hospitals matched your exact filter parameters. Try clearing filters or expanding your maximum search radius.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hospitals.map((hosp) => (
                <HospitalCard
                  key={hosp.id}
                  hospital={hosp}
                  onNavigate={handleNavigate}
                  onBookBed={(h) => setSelectedHospitalForBed(h)}
                  onSelectDetails={(h) => setSelectedHospitalForDetail(h)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Booking & Details Modals */}
      <BedBookingModal
        isOpen={!!selectedHospitalForBed}
        onClose={() => setSelectedHospitalForBed(null)}
        hospital={selectedHospitalForBed}
      />

      <HospitalDetailModal
        isOpen={!!selectedHospitalForDetail}
        onClose={() => setSelectedHospitalForDetail(null)}
        hospital={selectedHospitalForDetail}
        onNavigate={handleNavigate}
        onBookBed={(h) => setSelectedHospitalForBed(h)}
      />
    </div>
  );
};
