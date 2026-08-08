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
      {/* 1. HERO HEADING & SEARCH BAR */}
      <div className="bg-gradient-to-b from-blue-50/80 via-white to-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-black rounded-full border border-blue-200">
              <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
              <span>Hospital Resource Discovery</span>
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
                <p className="text-xs text-slate-300">Highest resource capacity & nearest emergency response</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 bg-emerald-500 text-white font-extrabold text-xs rounded-full shadow-md flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 shrink-0" /> {topRecommended.matchScore}% Recommended
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              <h2 className="text-3xl font-black text-white">{topRecommended.name}</h2>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                {topRecommended.tagline}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-2">
                <div className="flex items-center gap-1.5 font-semibold">
                  <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>{topRecommended.address} ({topRecommended.distanceKm} km)</span>
                </div>
                <div className="flex items-center gap-1.5 font-semibold text-rose-400">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>ER Wait Time: {topRecommended.erWaitTimeMin} mins</span>
                </div>
                <div className="flex items-center gap-1.5 font-semibold text-amber-300">
                  <Star className="w-4 h-4 fill-amber-300 shrink-0" />
                  <span>{topRecommended.rating} ({topRecommended.reviewCount} reviews)</span>
                </div>
              </div>
            </div>

            {/* Live telemetry counters */}
            <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700/80 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-sky-400 uppercase block tracking-wider">
                  Live Resource Telemetry
                </span>
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-2 bg-slate-900 rounded-xl border border-slate-700">
                    <span className="text-[10px] text-slate-400 block uppercase">ICU Beds</span>
                    <span className="font-extrabold text-emerald-400 text-base">
                      {topRecommended.beds.icu.available} Free
                    </span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-xl border border-slate-700">
                    <span className="text-[10px] text-slate-400 block uppercase">Ventilators</span>
                    <span className="font-extrabold text-sky-400 text-base">
                      {topRecommended.beds.ventilator.available} Free
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-700/80">
                <PrimaryButton
                  onClick={() => handleNavigate(topRecommended)}
                  size="sm"
                  icon={Navigation}
                  className="w-full"
                >
                  Navigate Now
                </PrimaryButton>
                <SecondaryButton
                  onClick={() => setSelectedHospitalForDetail(topRecommended)}
                  size="sm"
                  className="w-full bg-slate-900 text-white border-slate-700 hover:bg-slate-800"
                >
                  View Details
                </SecondaryButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. MAIN SECTION: SMART FILTER SIDEBAR + HOSPITAL CARDS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Smart Filter Sidebar (1 col) */}
        <div className="lg:col-span-1 sticky top-24">
          <HospitalFilter
            filters={filters}
            onFilterChange={(newFilters) => setFilters(newFilters)}
            onResetFilters={handleResetFilters}
            resultCount={hospitals.length}
          />
        </div>

        {/* Hospital Cards Results (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">
              Discovered Facilities ({hospitals.length})
            </h2>
            <span className="text-xs font-medium text-slate-500">
              Sorted by: <strong className="text-slate-800">Recommendation Rank</strong>
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <Sparkles className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
              <p className="text-sm text-slate-600 font-medium">
                Evaluating live telemetry, ER wait times & calculating rankings...
              </p>
            </div>
          ) : hospitals.length > 0 ? (
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
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <Stethoscope className="w-12 h-12 text-slate-400 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">No Hospitals Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  No medical centers matched your specific filter criteria. Try adjusting your specialty or max distance slider.
                </p>
              </div>
              <SecondaryButton onClick={handleResetFilters} size="sm">
                Reset All Filters
              </SecondaryButton>
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
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
