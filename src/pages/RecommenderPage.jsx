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

      {/* 2. MAIN SECTION: SMART FILTER SIDEBAR + HOSPITAL CARDS GRID */}
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
