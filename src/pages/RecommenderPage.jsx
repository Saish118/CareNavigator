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
  GitCompare,
  RotateCcw,
  SlidersHorizontal,
  X,
  Plus,
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
    openNow: false,
    emergency247: false,
    acceptsAmbulance: false,
    cashlessInsurance: false,
    sortBy: "aiMatch",
  });

  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHospitalForBed, setSelectedHospitalForBed] = useState(null);
  const [selectedHospitalForDetail, setSelectedHospitalForDetail] = useState(null);

  // Requirement 10: Comparison Mode (max 2 hospitals)
  const [comparedHospitals, setComparedHospitals] = useState([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

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
      openNow: false,
      emergency247: false,
      acceptsAmbulance: false,
      cashlessInsurance: false,
      sortBy: "aiMatch",
    });
  };

  const handleNavigate = (h) => {
    setDestination(h);
    navigate("/map");
  };

  const toggleHospitalComparison = (hospital) => {
    setComparedHospitals((prev) => {
      const exists = prev.some((item) => item.id === hospital.id);
      if (exists) {
        return prev.filter((item) => item.id !== hospital.id);
      }
      if (prev.length >= 2) {
        return [prev[1], hospital]; // Keep latest 2
      }
      return [...prev, hospital];
    });
  };

  // Requirement 1: Calculate metrics for Compact Search Summary Card
  const bestMatchHospital = hospitals.length > 0 ? hospitals[0] : null;
  const nearestHospital = hospitals.length > 0 ? [...hospitals].sort((a, b) => a.distanceKm - b.distanceKm)[0] : null;
  const fastestErHospital = hospitals.length > 0 ? [...hospitals].sort((a, b) => a.erWaitTimeMin - b.erWaitTimeMin)[0] : null;
  const totalIcuBeds = hospitals.reduce((sum, h) => sum + (h.beds?.icu?.available || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 overflow-x-hidden">
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

        {/* AI Search Bar with Requirement 9 Placeholder */}
        <div className="max-w-3xl">
          <SearchInput
            placeholder="Describe symptoms or search by specialty (e.g. Chest pain with breathing difficulty)"
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

      {/* Requirement 1: COMPACT SEARCH SUMMARY CARD */}
      {!loading && hospitals.length > 0 && (
        <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-medium w-full">
            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Hospitals Found</span>
              <strong className="text-sm font-black text-white">{hospitals.length} Facilities</strong>
            </div>

            {bestMatchHospital && (
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80">
                <span className="text-[10px] text-emerald-400 uppercase font-bold block">Best Match</span>
                <strong className="text-xs font-bold text-emerald-300 truncate block">
                  {bestMatchHospital.name} ({bestMatchHospital.matchScore}%)
                </strong>
              </div>
            )}

            {nearestHospital && (
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80">
                <span className="text-[10px] text-sky-400 uppercase font-bold block">Nearest Hospital</span>
                <strong className="text-xs font-bold text-sky-300 truncate block">
                  {nearestHospital.name} ({nearestHospital.distanceKm} km)
                </strong>
              </div>
            )}

            {fastestErHospital && (
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80">
                <span className="text-[10px] text-rose-400 uppercase font-bold block">Fastest ER Wait</span>
                <strong className="text-xs font-bold text-rose-300 truncate block">
                  {fastestErHospital.erWaitTimeMin} mins wait time
                </strong>
              </div>
            )}

            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-amber-400 uppercase font-bold block">Total Free ICU Beds</span>
              <strong className="text-sm font-black text-amber-300">{totalIcuBeds} Open Beds</strong>
            </div>
          </div>
        </div>
      )}

      {/* 2. MAIN SECTION: SMART FILTER SIDEBAR + HOSPITAL CARDS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Smart Filter Sidebar (1 col) */}
        <div className="lg:col-span-1 sticky top-24">
          <HospitalFilter
            filters={filters}
            onChange={(newFilters) => setFilters(newFilters)}
            onReset={handleResetFilters}
            totalResultsCount={hospitals.length}
          />
        </div>

        {/* Hospital Cards Results (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">
              Discovered Facilities ({hospitals.length})
            </h2>
            <div className="flex items-center gap-3">
              {comparedHospitals.length > 0 && (
                <button
                  onClick={() => setIsComparisonOpen(true)}
                  className="px-3 py-1.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5"
                >
                  <GitCompare className="w-3.5 h-3.5" /> Compare ({comparedHospitals.length}/2)
                </button>
              )}
              <span className="text-xs font-medium text-slate-500 hidden sm:inline">
                Sorted by: <strong className="text-slate-800">Recommendation Rank</strong>
              </span>
            </div>
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
                  onSpecialtySelect={(spec) => setFilters((prev) => ({ ...prev, specialty: spec }))}
                  isCompared={comparedHospitals.some((item) => item.id === hosp.id)}
                  onToggleCompare={toggleHospitalComparison}
                />
              ))}
            </div>
          ) : (
            /* Requirement 11: Improved Empty State with Actionable Suggestions */
            <div className="p-10 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-5">
              <Stethoscope className="w-12 h-12 text-slate-400 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">No Hospitals Found</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  No medical centers matched your specific query or active filters. Try adjusting your criteria.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 max-w-md mx-auto space-y-2 text-xs font-medium text-slate-700">
                <span className="font-bold text-slate-900 block uppercase text-[10px]">Suggested Actions:</span>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setFilters((prev) => ({ ...prev, maxDistanceKm: 50 }))}
                    className="w-full py-2 px-3 bg-white hover:bg-blue-50 text-blue-600 font-bold rounded-xl border border-slate-200 text-left flex items-center justify-between"
                  >
                    <span>1. Increase radius distance to 50 km</span>
                    <Plus className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setFilters((prev) => ({ ...prev, requireIcu: false }))}
                    className="w-full py-2 px-3 bg-white hover:bg-blue-50 text-blue-600 font-bold rounded-xl border border-slate-200 text-left flex items-center justify-between"
                  >
                    <span>2. Remove ICU-only requirement filter</span>
                    <X className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleResetFilters}
                    className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-center"
                  >
                    3. Reset All Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Requirement 10: HOSPITAL COMPARISON MODAL */}
      {(isComparisonOpen || comparedHospitals.length === 2) && (
        <div className="fixed bottom-4 left-4 right-4 max-w-4xl mx-auto bg-slate-900 text-white p-5 rounded-3xl border border-slate-700 shadow-2xl z-50 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 font-bold text-sm">
              <GitCompare className="w-4 h-4 text-sky-400" />
              <span>Hospital Comparison ({comparedHospitals.length} Selected)</span>
            </div>
            <button
              onClick={() => {
                setIsComparisonOpen(false);
                setComparedHospitals([]);
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {comparedHospitals.length < 2 ? (
            <p className="text-xs text-slate-400">
              Select one more hospital card to compare resources side-by-side.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 text-xs">
              {comparedHospitals.map((h, i) => (
                <div key={h.id} className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-2">
                  <h4 className="font-bold text-white text-sm truncate">{h.name}</h4>
                  <div className="space-y-1 text-[11px] text-slate-300">
                    <div className="flex justify-between">
                      <span>Distance:</span>
                      <strong className="text-sky-400">{h.distanceKm} km</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>ER Wait:</span>
                      <strong className="text-rose-400">{h.erWaitTimeMin} mins</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>ICU Beds:</span>
                      <strong className="text-emerald-400">{h.beds.icu.available} Free</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Oxygen Beds:</span>
                      <strong className="text-sky-300">{h.beds.oxygen?.available ?? 12} Free</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Rating:</span>
                      <strong className="text-amber-400">★ {h.rating}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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
