import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Sparkles,
  Stethoscope,
  MapPin,
  Clock,
  Navigation,
  Star,
  CheckCircle2,
  GitCompare,
  RotateCcw,
  SlidersHorizontal,
  X,
  Plus,
  ArrowUpDown,
  Check,
  Building2,
  Activity,
  HeartPulse,
} from "lucide-react";
import { SearchInput } from "../components/common/SearchInput";
import { HospitalFilter } from "../components/hospital/HospitalFilter";
import { HospitalCard } from "../components/hospital/HospitalCard";
import { hospitalService } from "../services/hospitalService";
import { HospitalDetailModal } from "../components/hospital/HospitalDetailModal";
import { useEmergency } from "../context/EmergencyContext";
import { useBookmark } from "../context/BookmarkContext";

export const RecommenderPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { userLocation, requestUserLocation, setDestination } = useEmergency();
  const { toggleSaveHospital, isHospitalSaved } = useBookmark();

  const initialQuery = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [locationName, setLocationName] = useState("Live GPS Location");

  // 1 & 2. Horizontal Specialty Filters (Multi-select)
  const [selectedSpecialties, setSelectedSpecialties] = useState(["All"]);

  // 3. Availability Filter Chips (Multi-select)
  const [selectedAvailability, setSelectedAvailability] = useState([]);

  // 4. Sort Dropdown State
  const [sortBy, setSortBy] = useState("nearest");

  // City Options State
  const [cityOptions, setCityOptions] = useState([]);

  const [filters, setFilters] = useState({
    city: "All Cities",
    specialty: "All Specialties",
    insurance: "All Insurance Providers",
    maxDistanceKm: 500,
    requireIcu: false,
    requireHeliport: false,
    openNow: false,
    emergency247: false,
    acceptsAmbulance: false,
    cashlessInsurance: false,
  });

  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHospitalForBed, setSelectedHospitalForBed] = useState(null);
  const [selectedHospitalForDetail, setSelectedHospitalForDetail] = useState(null);

  // Hospital Comparison State
  const [comparedHospitals, setComparedHospitals] = useState([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  // 1. Specialty Filter Options
  const specialtyOptions = [
    "All",
    "Multi-Speciality",
    "Cardiology",
    "Neurology",
    "Orthopaedics",
    "Children's Hospital",
    "Trauma Center",
    "Maternity",
    "Oncology",
    "Pulmonology",
    "Blood Bank",
    "Eye Hospital",
  ];

  // 3. Availability Filter Options
  const availabilityOptions = [
    "Open Now",
    "ICU Available",
    "Ventilator Available",
    "Blood Bank",
    "Ambulance Available",
    "Emergency 24×7",
    "Accepting Patients",
  ];

  // 4. Sort Dropdown Options
  const sortOptions = [
    { label: "Nearest", value: "nearest" },
    { label: "Fastest Response", value: "fastestResponse" },
    { label: "Highest Rated", value: "highestRated" },
    { label: "Lowest Waiting Time", value: "lowestWaiting" },
    { label: "Most ICU Beds", value: "mostIcuBeds" },
    { label: "Best Match", value: "aiMatch" },
  ];

  const locationsList = [
    "Live Browser Geolocation",
    "Ahilyanagar / Kopargaon Region",
    "Pune Central",
    "Mumbai Metropolitan",
    "Nagpur Vidarbha",
  ];

  useEffect(() => {
    requestUserLocation();
  }, []);

  const loadHospitals = async () => {
    setLoading(true);
    const data = await hospitalService.getHospitals(
      {
        searchQuery: searchQuery,
        specialties: selectedSpecialties,
        availabilityFilters: selectedAvailability,
        sortBy: sortBy,
        ...filters,
      },
      userLocation
    );
    setHospitals(data);
    setLoading(false);
  };

  useEffect(() => {
    loadHospitals();
    const cities = hospitalService.getCities();
    setCityOptions(cities);
  }, [searchQuery, selectedSpecialties, selectedAvailability, sortBy, filters, userLocation]);

  // 2. Toggle Multi-Select Specialty Chips
  const handleSpecialtyToggle = (chip) => {
    if (chip === "All") {
      setSelectedSpecialties(["All"]);
      return;
    }

    let updated = selectedSpecialties.includes(chip)
      ? selectedSpecialties.filter((s) => s !== chip)
      : [...selectedSpecialties.filter((s) => s !== "All"), chip];

    if (updated.length === 0) {
      updated = ["All"];
    }

    setSelectedSpecialties(updated);
  };

  // Toggle Availability Filter Chips
  const handleAvailabilityToggle = (chip) => {
    if (selectedAvailability.includes(chip)) {
      setSelectedAvailability(selectedAvailability.filter((item) => item !== chip));
    } else {
      setSelectedAvailability([...selectedAvailability, chip]);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSearchParams({});
    setSelectedSpecialties(["All"]);
    setSelectedAvailability([]);
    setSortBy("nearest");
    setFilters({
      city: "All Cities",
      specialty: "All Specialties",
      insurance: "All Insurance Providers",
      maxDistanceKm: 500,
      requireIcu: false,
      requireHeliport: false,
      openNow: false,
      emergency247: false,
      acceptsAmbulance: false,
      cashlessInsurance: false,
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
        return [prev[1], hospital];
      }
      return [...prev, hospital];
    });
  };

  // Summary statistics
  const bestMatchHospital = hospitals.length > 0 ? hospitals[0] : null;
  const nearestHospital = hospitals.length > 0 ? [...hospitals].sort((a, b) => a.distanceKm - b.distanceKm)[0] : null;
  const fastestErHospital = hospitals.length > 0 ? [...hospitals].sort((a, b) => a.erWaitTimeMin - b.erWaitTimeMin)[0] : null;
  const totalIcuBeds = hospitals.reduce((sum, h) => sum + (h.beds?.icu?.available || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 overflow-x-hidden">
      {/* 1. HERO SEARCH & FILTER SECTION */}
      <div className="bg-gradient-to-b from-blue-50/80 via-white to-slate-50 p-5 sm:p-7 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-black rounded-full border border-blue-200">
              <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
              <span>Hospital Resource Discovery</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Hospital Discovery & Resource Telemetry
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-2xl">
              Search and filter trauma centers evaluated by live ICU bed availability, ER wait times, distance, and clinical specialties.
            </p>
          </div>

          {/* Location Selector */}
          <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl border border-slate-200 shadow-xs shrink-0">
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

        {/* Geolocation Distance Status Indicator */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 text-white px-4 py-3 rounded-2xl border border-slate-800 text-xs shadow-sm">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            {userLocation ? (
              <span>
                <strong className="text-emerald-400">GPS Location Active:</strong> Hospitals ordered by exact Haversine distance from your position ({userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)})
              </span>
            ) : (
              <span>
                <strong className="text-amber-400 font-bold">Location Permission Needed:</strong> Enable GPS for precise Nearest distance sorting from your exact position.
              </span>
            )}
          </div>

          {!userLocation && (
            <button
              onClick={() => requestUserLocation()}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shrink-0 cursor-pointer shadow-md"
            >
              Enable My Location
            </button>
          )}
        </div>

        {/* Search Input Bar */}
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

        {/* 1 & 2. HORIZONTAL SPECIALTY FILTER BAR (Multi-Selectable Chips) */}
        <div className="space-y-2 pt-1 border-t border-slate-200/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Filter by Specialty (Multi-Select)
            </span>
            {selectedSpecialties.length > 1 && (
              <button
                onClick={() => setSelectedSpecialties(["All"])}
                className="text-[11px] font-bold text-blue-600 hover:underline"
              >
                Clear Specialties
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {specialtyOptions.map((chip) => {
              const isSelected = selectedSpecialties.includes(chip);
              return (
                <button
                  key={chip}
                  onClick={() => handleSpecialtyToggle(chip)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ease-out cursor-pointer shrink-0 border flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm font-black"
                      : "bg-white text-slate-700 border-slate-200/90 hover:border-blue-300 hover:bg-blue-50/50"
                  }`}
                >
                  {isSelected && chip !== "All" && <Check className="w-3 h-3 stroke-[3]" />}
                  <span>{chip}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. AVAILABILITY FILTER CHIPS */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Filter by Availability
          </span>
          <div className="flex flex-wrap gap-2">
            {availabilityOptions.map((chip) => {
              const isSelected = selectedAvailability.includes(chip);
              return (
                <button
                  key={chip}
                  onClick={() => handleAvailabilityToggle(chip)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all duration-200 ease-out cursor-pointer border flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-sm font-black"
                      : "bg-slate-50/80 text-slate-700 border-slate-200 hover:bg-emerald-50/50 hover:border-emerald-300"
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  <span>{chip}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* COMPACT SEARCH SUMMARY CARD */}
      {!loading && hospitals.length > 0 && (
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-medium w-full">
            {/* 5. Result Counter */}
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

      {/* MAIN RESULTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Smart Filter Sidebar (1 col) */}
        <div className="lg:col-span-1 sticky top-24">
          <HospitalFilter
            filters={filters}
            onChange={(newFilters) => setFilters(newFilters)}
            onReset={handleResetFilters}
            cityOptions={cityOptions}
            totalResultsCount={hospitals.length}
          />
        </div>

        {/* Hospital Cards Results (3 cols) */}
        <div className="lg:col-span-3 space-y-5">
          {/* Header Bar with 5. RESULT COUNTER & 4. SORT DROPDOWN */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Discovered Facilities
              </h2>
              {/* 5. Result Counter Badge */}
              <span className="px-3 py-0.5 bg-blue-100 text-blue-800 text-xs font-black rounded-full border border-blue-200">
                {hospitals.length} Hospitals Found
              </span>
            </div>

            <div className="flex items-center gap-3">
              {comparedHospitals.length > 0 && (
                <button
                  onClick={() => setIsComparisonOpen(true)}
                  className="px-3 py-1.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5"
                >
                  <GitCompare className="w-3.5 h-3.5" /> Compare ({comparedHospitals.length}/2)
                </button>
              )}

              {/* 4. SORT DROPDOWN */}
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-2xl border border-slate-200 shadow-xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="text-xs text-slate-500 font-bold hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="font-bold text-slate-900 bg-transparent focus:outline-none cursor-pointer text-xs"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
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
                  onSelectDetails={(h) => setSelectedHospitalForDetail(h)}
                  onSpecialtySelect={(spec) => setSelectedSpecialties([spec])}
                  isCompared={comparedHospitals.some((item) => item.id === hosp.id)}
                  onToggleCompare={toggleHospitalComparison}
                />
              ))}
            </div>
          ) : (
            /* Actionable Empty State */
            <div className="p-10 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-5">
              <Stethoscope className="w-12 h-12 text-slate-400 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">No Hospitals Match Your Criteria</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  No medical centers matched your active specialty or availability filters. Try expanding your search.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 max-w-md mx-auto space-y-2 text-xs font-medium text-slate-700">
                <span className="font-bold text-slate-900 block uppercase text-[10px]">Suggested Actions:</span>
                <div className="flex flex-col gap-2">
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSearchParams({});
                      }}
                      className="w-full py-2 px-3 bg-white hover:bg-blue-50 text-blue-600 font-bold rounded-xl border border-slate-200 text-left flex items-center justify-between cursor-pointer"
                    >
                      <span>Clear search query "{searchQuery}"</span>
                      <X className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedSpecialties(["All"])}
                    className="w-full py-2 px-3 bg-white hover:bg-blue-50 text-blue-600 font-bold rounded-xl border border-slate-200 text-left flex items-center justify-between cursor-pointer"
                  >
                    <span>Reset specialty filters to "All"</span>
                    <Plus className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setSelectedAvailability([])}
                    className="w-full py-2 px-3 bg-white hover:bg-blue-50 text-blue-600 font-bold rounded-xl border border-slate-200 text-left flex items-center justify-between cursor-pointer"
                  >
                    <span>Clear availability filters</span>
                    <X className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleResetFilters}
                    className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-center cursor-pointer"
                  >
                    Reset All Search Criteria
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* HOSPITAL COMPARISON MODAL */}
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
              {comparedHospitals.map((h) => (
                <div key={h.id} className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-2">
                  <h4 className="font-bold text-white text-sm truncate">{h.name}</h4>
                  <div className="space-y-1 text-[11px] text-slate-300">
                    <div className="flex justify-between">
                      <span>Distance:</span>
                      <strong className="text-sky-400">{h.distanceKm} km</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>ER Status:</span>
                      <strong className="text-rose-400">{h.erWaitTimeMin ? `${h.erWaitTimeMin} mins` : "24/7 Casualty ER"}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Govt Beds:</span>
                      <strong className="text-emerald-400">{h.beds?.total || h.beds?.general || "N/A"}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Facility Rating:</span>
                      <strong className="text-amber-400">{h.rating ? `★ ${h.rating}` : "Official DMER"}</strong>
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
      />
    </div>
  );
};
