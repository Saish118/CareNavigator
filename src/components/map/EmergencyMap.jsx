import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Search,
  MapPin,
  Navigation,
  PhoneCall,
  Crosshair,
  Droplet,
  Ambulance,
  ShieldCheck,
  Zap,
  Filter,
} from "lucide-react";
import { bloodBankService } from "../../services/bloodBankService";
import { ambulanceService } from "../../services/ambulanceService";
import { useToast } from "../ui/ToastNotification";

const DEFAULT_CENTER = [19.7515, 75.7139];
const DEFAULT_ZOOM = 7;

// Custom Marker Generator for Emergency Resources
const createResourceIcon = (type, isSelected = false) => {
  let color = "#e11d48"; // default rose
  let iconSvg = `<path d="M12 6v12M6 12h12"/>`; // cross

  if (type === "blood-bank") {
    color = "#dc2626"; // red
    iconSvg = `<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>`; // droplet
  } else if (type === "ambulance") {
    color = "#9333ea"; // purple
    iconSvg = `<rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>`;
  }

  const size = isSelected ? 42 : 36;
  const shadowColor = isSelected ? "rgba(37,99,235,0.4)" : "rgba(225,29,72,0.35)";

  return L.divIcon({
    className: "custom-resource-marker",
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
          ${iconSvg}
        </svg>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2 - 4],
  });
};

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

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [resourceTypeFilter, setResourceTypeFilter] = useState("All");
  const [selectedResource, setSelectedResource] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM);

  const fetchResources = async () => {
    setLoading(true);
    try {
      // Load verified public blood banks
      const bloodBanks = await bloodBankService.getPublicBloodBanks();

      const bloodBankMarkers = bloodBanks.map((b) => ({
        id: `bb-${b.id}`,
        name: b.name,
        type: "blood-bank",
        category: "Blood Bank",
        address: `${b.address}, ${b.city}`,
        city: b.city,
        phone: b.phone || b.erDirectPhone,
        lat: b.coordinates?.lat || b.latitude || 19.8916,
        lng: b.coordinates?.lng || b.longitude || 74.4795,
        details: b.bloodGroupStock ? `O+: ${b.bloodGroupStock["O+"] || 0} units, A+: ${b.bloodGroupStock["A+"] || 0} units` : "FDA Licensed Transfusion Center",
      }));

      // Load verified public ambulances dynamically
      const publicAmbulances = await ambulanceService.getPublicAmbulances({}, userLocation);

      const ambulanceMarkers = publicAmbulances.map((amb) => ({
        id: `amb-${amb.id}`,
        name: amb.providerName,
        type: "ambulance",
        category: amb.ambulanceType || "EMS Ambulance",
        address: `${amb.address}, ${amb.city}`,
        city: amb.city,
        phone: amb.primaryPhone || amb.emergencyPhone || "108",
        lat: amb.coordinates?.lat || amb.latitude || 19.8916,
        lng: amb.coordinates?.lng || amb.longitude || 74.4795,
        details: `${amb.availabilityStatus} • ${amb.oxygen ? "O2 " : ""}${amb.ventilator ? "Ventilator" : ""}`,
      }));

      const allResources = [...bloodBankMarkers, ...ambulanceMarkers];
      setResources(allResources);
      if (allResources.length > 0 && !selectedResource) {
        setSelectedResource(allResources[0]);
      }
    } catch (err) {
      console.warn("⚠️ Emergency map resource fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      addToast("Geolocation is not supported by your browser.", "error");
      return;
    }

    setIsLocating(true);
    addToast("Locating GPS coordinates...", "info");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(coords);
        setMapCenter(coords);
        setMapZoom(13);
        setIsLocating(false);
        addToast("Current GPS location updated!", "success");
      },
      (err) => {
        setIsLocating(false);
        addToast("Could not access GPS location. Showing regional emergency grid.", "warning");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const filteredResources = resources.filter((res) => {
    if (resourceTypeFilter !== "All") {
      if (res.type !== resourceTypeFilter) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        res.name.toLowerCase().includes(q) ||
        res.city.toLowerCase().includes(q) ||
        res.address.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* MAP TOOLBAR */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-md space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search emergency ambulances, blood banks, hotlines..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/90 rounded-2xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 transition-all placeholder:text-slate-400"
            />
          </div>

          <button
            onClick={handleUseMyLocation}
            disabled={isLocating}
            className="w-full sm:w-auto px-4 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md shadow-rose-600/20 shrink-0 cursor-pointer disabled:opacity-50"
          >
            <Crosshair className={`w-4 h-4 ${isLocating ? "animate-spin" : ""}`} />
            <span>{isLocating ? "Locating..." : "Use My Location"}</span>
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
          <span className="text-[11px] font-bold uppercase text-slate-400 shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Emergency Resource:
          </span>
          {[
            { id: "All", label: "All Emergency Resources" },
            { id: "ambulance", label: "🚑 Ambulances" },
            { id: "blood-bank", label: "🩸 Blood Banks" },
          ].map((typeItem) => {
            const isActive = resourceTypeFilter === typeItem.id;
            return (
              <button
                key={typeItem.id}
                onClick={() => setResourceTypeFilter(typeItem.id)}
                className={`px-3 py-1 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200/80"
                }`}
              >
                {typeItem.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* MAP CANVAS */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-slate-200/80 shadow-xl bg-slate-100 h-[480px] sm:h-[520px]">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%", zIndex: 1 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapFlyTo center={mapCenter} zoom={mapZoom} />

          {userLocation && (
            <Marker position={userLocation} icon={createUserLocationIcon()}>
              <Popup>
                <div className="text-xs font-bold text-slate-900 p-1">📍 Your Current Position</div>
              </Popup>
            </Marker>
          )}

          {filteredResources.map((res) => {
            if (!res.lat || !res.lng) return null;
            const isSelected = selectedResource?.id === res.id;
            const icon = createResourceIcon(res.type, isSelected);

            return (
              <Marker
                key={res.id}
                position={[res.lat, res.lng]}
                icon={icon}
                eventHandlers={{
                  click: () => {
                    setSelectedResource(res);
                    setMapCenter([res.lat, res.lng]);
                  },
                }}
              >
                <Popup className="custom-leaflet-popup">
                  <div className="p-2 space-y-2 max-w-xs text-xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-1 gap-2">
                      <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-black rounded-md">
                        {res.category}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm leading-tight">{res.name}</h4>
                    <p className="text-[11px] text-slate-500 font-medium">{res.address}</p>

                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 text-[11px]">
                      <span className="text-slate-600 block">{res.details}</span>
                    </div>

                    <div className="pt-1 flex items-center gap-1.5">
                      {res.phone && (
                        <a
                          href={`tel:${res.phone}`}
                          className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <PhoneCall className="w-3 h-3" /> Call ({res.phone})
                        </a>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Legend */}
        <div className="absolute bottom-3 left-3 z-[400] bg-slate-900/90 backdrop-blur-md text-white px-3.5 py-2 rounded-2xl border border-slate-700 text-[11px] shadow-lg flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold">
            <span className="w-3 h-3 rounded-full bg-rose-600 border border-white" /> Ambulances
          </div>
          <div className="flex items-center gap-1.5 font-bold">
            <span className="w-3 h-3 rounded-full bg-red-600 border border-white" /> Blood Banks
          </div>
          {userLocation && (
            <div className="flex items-center gap-1.5 font-bold text-sky-300">
              <span className="w-3 h-3 rounded-full bg-blue-500 border border-white animate-ping" /> You
            </div>
          )}
        </div>
      </div>

      {/* SELECTED EMERGENCY RESOURCE CARD */}
      {selectedResource && (
        <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 shadow-xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 bg-rose-500/20 text-rose-300 font-extrabold text-[10px] rounded-md border border-rose-500/30">
                {selectedResource.category}
              </span>
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                {selectedResource.name}
              </h3>
              <p className="text-xs text-slate-400">{selectedResource.address}</p>
            </div>

            <div className="flex items-center gap-2">
              {selectedResource.phone && (
                <a
                  href={`tel:${selectedResource.phone}`}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-rose-600/20 cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4" /> Call Direct ({selectedResource.phone})
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
