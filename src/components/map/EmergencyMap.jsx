import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Search,
  MapPin,
  Navigation,
  PhoneCall,
  Crosshair,
  Activity,
  Star,
  CheckCircle2,
  Clock,
  RotateCcw,
  SlidersHorizontal,
  Building2,
  Zap,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { hospitalService } from "../../services/hospitalService";
import { useToast } from "../ui/ToastNotification";
import { openHospitalDirections } from "../../utils/navigationUtils";
import { Pagination } from "../ui/Pagination";

// Default center: Maharashtra, India (State Center)
const DEFAULT_CENTER = [19.7515, 75.7139];
const DEFAULT_ZOOM = 7;

// Custom Hospital Leaflet SVG DivIcon Generator
const createHospitalIcon = (isSelected = false, isEmergency = true) => {
  const color = isSelected ? "#2563eb" : isEmergency ? "#e11d48" : "#0284c7";
  const size = isSelected ? 42 : 36;
  const shadowColor = isSelected ? "rgba(37,99,235,0.4)" : "rgba(225,29,72,0.35)";

  return L.divIcon({
    className: "custom-hospital-marker",
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border: 3px solid #ffffff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 14px ${shadowColor};
        cursor: pointer;
        transition: all 0.2s ease-out;
      ">
        <svg width="${size * 0.5}" height="${size * 0.5}" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 6v12M6 12h12"/>
        </svg>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2 - 4],
  });
};

// Custom User Location Leaflet SVG DivIcon Generator
const createUserLocationIcon = () => {
  return L.divIcon({
    className: "custom-user-marker",
    html: `
      <div style="
        width: 24px;
        height: 24px;
        background-color: #3b82f6;
        border: 3px solid #ffffff;
        border-radius: 50%;
        box-shadow: 0 0 0 8px rgba(59, 130, 246, 0.3), 0 4px 12px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -14],
  });
};

// Helper sub-component to programmatic fly-to map bounds
const MapFlyTo = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center && Array.isArray(center) && center.length === 2) {
      map.flyTo(center, zoom || 13, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
};

export const EmergencyMap = () => {
  const { addToast } = useToast();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM);

  // Pagination state (10 facilities per page)
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Load Hospitals from hospitalService
  const fetchHospitals = async () => {
    setLoading(true);
    try {
      const filterParams = {
        searchQuery: searchQuery,
        specialties: selectedSpecialty !== "All" ? [selectedSpecialty] : ["All"],
      };
      const data = await hospitalService.getHospitals(filterParams);
      setHospitals(data);

      // Default selected hospital to top recommendation if present
      if (data.length > 0 && !selectedHospital) {
        setSelectedHospital(data[0]);
      }
    } catch (err) {
      console.error("Error loading hospitals for map:", err);
      addToast("Could not load hospital map data. Showing offline fallback.", "warning");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
    setCurrentPage(1);
  }, [searchQuery, selectedSpecialty]);

  // Use My Location Feature with Graceful Permission Error Handling
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      addToast("Browser Geolocation is not supported by your browser.", "error");
      return;
    }

    setIsLocating(true);
    addToast("Locating your GPS coordinates...", "info");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newCoords = [latitude, longitude];
        setUserLocation(newCoords);
        setMapCenter(newCoords);
        setMapZoom(14);
        setIsLocating(false);
        addToast("Current location updated successfully!", "success");
      },
      (error) => {
        setIsLocating(false);
        let errorMsg = "Could not access location.";
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = "Browser location permission was denied. Showing regional hospital grid.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = "GPS signal unavailable. Showing regional hospital grid.";
        } else if (error.code === error.TIMEOUT) {
          errorMsg = "Location request timed out. Showing regional hospital grid.";
        }
        addToast(errorMsg, "warning");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleResetFilters = () => {
    setCurrentPage(1);
    setSearchQuery("");
    setSelectedSpecialty("All");
    setMapCenter(DEFAULT_CENTER);
    setMapZoom(DEFAULT_ZOOM);
    if (hospitals.length > 0) {
      setSelectedHospital(hospitals[0]);
    }
  };

  const openGoogleDirections = (hospital) => {
    openHospitalDirections(hospital, addToast, userLocation);
  };

  const specialtyOptions = [
    "All",
    "Cardiology",
    "Children's",
    "Neurology",
    "Orthopaedics",
    "Emergency",
    "Multi-Specialty",
  ];

  return (
    <div className="space-y-4">
      {/* 1. CONTROLS HEADER BAR (Search Bar + Category Chips + Locate Me Button) */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-md space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Bar Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hospitals by name, specialty, address, city..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/90 rounded-2xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Use My Location Button */}
          <button
            onClick={handleUseMyLocation}
            disabled={isLocating}
            className="w-full sm:w-auto px-4 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md shadow-rose-600/20 shrink-0 cursor-pointer disabled:opacity-50"
          >
            <Crosshair className={`w-4 h-4 ${isLocating ? "animate-spin" : ""}`} />
            <span>{isLocating ? "Locating..." : "Use My Location"}</span>
          </button>
        </div>

        {/* Specialty Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1">
          <span className="text-[11px] font-bold uppercase text-slate-400 shrink-0 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" /> Specialty:
          </span>
          {specialtyOptions.map((spec) => {
            const isActive = selectedSpecialty === spec;
            return (
              <button
                key={spec}
                onClick={() => setSelectedSpecialty(spec)}
                className={`px-3 py-1 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200/80"
                }`}
              >
                {spec}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. LEAFLET MAP INTERACTIVE CANVAS */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-slate-200/80 shadow-xl bg-slate-100">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          scrollWheelZoom={true}
          style={{ height: "460px", width: "100%", zIndex: 1 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapFlyTo center={mapCenter} zoom={mapZoom} />

          {/* User Location Marker if granted */}
          {userLocation && (
            <Marker position={userLocation} icon={createUserLocationIcon()}>
              <Popup>
                <div className="text-xs font-bold text-slate-900 p-1">
                  📍 Your Current Location
                </div>
              </Popup>
            </Marker>
          )}

          {/* Hospital Markers */}
          {hospitals.map((hosp) => {
            const lat = hosp.coordinates?.lat || hosp.latitude;
            const lng = hosp.coordinates?.lng || hosp.longitude;
            if (!lat || !lng) return null;

            const isSelected = selectedHospital?.id === hosp.id;
            const icon = createHospitalIcon(isSelected, hosp.emergencyReady);

            return (
              <Marker
                key={hosp.id}
                position={[lat, lng]}
                icon={icon}
                eventHandlers={{
                  click: () => {
                    setSelectedHospital(hosp);
                    setMapCenter([lat, lng]);
                  },
                }}
              >
                {/* Marker Information Popup Card */}
                <Popup className="custom-leaflet-popup">
                  <div className="p-2 space-y-2 max-w-xs text-xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 gap-2">
                      <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-black rounded-md">
                        {hosp.category || "Emergency Center"}
                      </span>
                      <span className="text-amber-500 font-bold text-[11px] flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-400" /> {hosp.rating ? hosp.rating : "Empanelled"}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm leading-tight">
                      {hosp.name}
                    </h4>

                    <p className="text-[11px] text-slate-500 font-medium line-clamp-1">
                      {hosp.address}
                    </p>

                    <div className="grid grid-cols-2 gap-1.5 text-[10px] pt-1">
                      <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                        <span className="text-slate-400 block font-semibold">ICU Beds</span>
                        <strong className="text-emerald-700 font-bold">
                          {hosp.beds?.icu?.available != null ? `${hosp.beds.icu.available} Open` : "Empanelled Network"}
                        </strong>
                      </div>
                      <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                        <span className="text-slate-400 block font-semibold">ER Wait</span>
                        <strong className="text-sky-700 font-bold">
                          {hosp.erWaitTimeMin != null ? `${hosp.erWaitTimeMin} Mins` : "24/7 Casualty ER"}
                        </strong>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center gap-1.5">
                      <button
                        onClick={() => openGoogleDirections(hosp)}
                        className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <Navigation className="w-3 h-3" /> Get Directions
                      </button>

                      <a
                        href={`tel:${hosp.erDirectPhone || hosp.phone}`}
                        className="p-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl flex items-center justify-center transition-colors cursor-pointer"
                        title="Call ER"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Map Legend Overlay */}
        <div className="absolute bottom-3 left-3 z-[400] bg-slate-900/90 backdrop-blur-md text-white px-3 py-2 rounded-2xl border border-slate-700 text-[11px] shadow-lg flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold">
            <span className="w-3 h-3 rounded-full bg-rose-600 border border-white" /> Emergency Center
          </div>
          <div className="flex items-center gap-1.5 font-bold">
            <span className="w-3 h-3 rounded-full bg-blue-600 border border-white" /> Selected
          </div>
          {userLocation && (
            <div className="flex items-center gap-1.5 font-bold text-sky-300">
              <span className="w-3 h-3 rounded-full bg-blue-500 border border-white animate-ping" /> You
            </div>
          )}
        </div>
      </div>

      {/* 3. SELECTED HOSPITAL DETAIL CARD BELOW MAP */}
      {selectedHospital ? (
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 text-white p-5 rounded-3xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-600/20 text-rose-400 rounded-2xl border border-rose-500/30 shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base sm:text-lg text-white">
                    {selectedHospital.name}
                  </h3>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 font-bold text-[10px] rounded-md border border-emerald-500/30">
                    24/7 Open
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  {selectedHospital.address}, {selectedHospital.city} • {selectedHospital.distanceKm} km away ({selectedHospital.estimatedDriveMin || 6} min drive)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => openGoogleDirections(selectedHospital)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-rose-600/20 cursor-pointer"
              >
                <Navigation className="w-4 h-4" /> Get Directions
              </button>

              <a
                href={`tel:${selectedHospital.erDirectPhone || selectedHospital.phone}`}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all border border-slate-700 cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" /> Call ER
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/80">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Trauma Rating</span>
              <strong className="text-rose-400 font-black text-xs block truncate mt-0.5">
                {selectedHospital.traumaLevel || "Level 1 Trauma"}
              </strong>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/80">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Free ICU Beds</span>
              <strong className="text-emerald-400 font-black text-xs block truncate mt-0.5">
                {selectedHospital.beds?.icu?.available || 0} Open ICU Beds
              </strong>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/80">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Est. ER Wait</span>
              <strong className="text-sky-300 font-black text-xs block truncate mt-0.5">
                {selectedHospital.erWaitTimeMin || 5} Mins Wait
              </strong>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/80">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Specialty</span>
              <strong className="text-purple-300 font-black text-xs block truncate mt-0.5">
                {selectedHospital.category}
              </strong>
            </div>
          </div>
        </div>
      ) : hospitals.length === 0 && !loading ? (
        <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 shadow-md space-y-3">
          <Building2 className="w-10 h-10 text-slate-400 mx-auto" />
          <h4 className="font-bold text-slate-900">No Hospitals Found</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No hospital matches your current search or specialty filter query.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-all cursor-pointer"
          >
            Reset Search & Filters
          </button>
        </div>
      ) : null}

      {/* 4. EMERGENCY FACILITIES LISTING GRID WITH PAGINATION */}
      {hospitals.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-200/80 mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-rose-600 shrink-0" />
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Emergency Healthcare Facilities Directory
              </h3>
            </div>
            <span className="px-3 py-0.5 bg-rose-100 text-rose-800 text-xs font-black rounded-full border border-rose-200 self-start sm:self-auto">
              {hospitals.length} {hospitals.length === 1 ? "Facility" : "Facilities"} Listed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(() => {
              const totalFacilities = hospitals.length;
              const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
              const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalFacilities);
              const paginatedFacilities = hospitals.slice(startIndex, endIndex);

              return paginatedFacilities.map((hosp) => {
                const isSelected = selectedHospital?.id === hosp.id;
                return (
                  <div
                    key={hosp.id}
                    onClick={() => {
                      setSelectedHospital(hosp);
                      const lat = hosp.coordinates?.lat || hosp.latitude;
                      const lng = hosp.coordinates?.lng || hosp.longitude;
                      if (lat && lng) {
                        setMapCenter([lat, lng]);
                        setMapZoom(14);
                      }
                    }}
                    className={`p-4.5 rounded-2xl border transition-all duration-200 cursor-pointer space-y-3 ${
                      isSelected
                        ? "bg-rose-50/70 border-rose-400 shadow-md ring-2 ring-rose-500/20"
                        : "bg-white border-slate-200/80 hover:border-rose-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-extrabold text-sm text-slate-900 line-clamp-1">
                            {hosp.name}
                          </h4>
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-md shrink-0">
                            24/7 ER
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium line-clamp-1 mt-0.5">
                          {hosp.address}, {hosp.city}
                        </p>
                      </div>
                      {hosp.distanceKm != null && (
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-bold text-[11px] rounded-lg shrink-0 border border-slate-200">
                          📍 {hosp.distanceKm} km
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <span className="text-slate-400 block font-semibold">ICU Availability</span>
                        <strong className="text-emerald-700 font-bold">
                          {hosp.beds?.icu?.available != null ? `${hosp.beds.icu.available} Beds Open` : "Empanelled Network"}
                        </strong>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <span className="text-slate-400 block font-semibold">Specialty / Category</span>
                        <strong className="text-slate-800 font-bold truncate block">
                          {hosp.category || "General Hospital"}
                        </strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openGoogleDirections(hosp);
                        }}
                        className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Navigation className="w-3.5 h-3.5" /> Get Directions
                      </button>
                      <a
                        href={`tel:${hosp.erDirectPhone || hosp.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl flex items-center justify-center transition-colors cursor-pointer shrink-0"
                        title="Call ER Desk"
                      >
                        <PhoneCall className="w-4 h-4 text-emerald-400" />
                      </a>
                    </div>
                  </div>
                );
              });
            })()}
          </div>

          {/* Pagination Controls */}
          <Pagination
            currentPage={currentPage}
            totalPages={Math.max(1, Math.ceil(hospitals.length / ITEMS_PER_PAGE))}
            onPageChange={(page) => setCurrentPage(page)}
            totalItems={hospitals.length}
            itemsPerPage={ITEMS_PER_PAGE}
            itemLabel="emergency facilities"
          />
        </div>
      )}
    </div>
  );
};
