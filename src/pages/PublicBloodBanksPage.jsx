import React, { useState, useEffect } from "react";
import {
  Droplet,
  MapPin,
  Phone,
  Clock,
  Search,
  Filter,
  Navigation,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  X,
  Activity,
  Layers,
} from "lucide-react";
import { bloodBankService } from "../services/bloodBankService";
import { Pagination } from "../components/ui/Pagination";
import { useToast } from "../components/ui/ToastNotification";

export const PublicBloodBanksPage = () => {
  const { addToast } = useToast();

  const [bloodBanks, setBloodBanks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("All");
  const [userLocation, setUserLocation] = useState(null);
  const [locationActive, setLocationActive] = useState(false);

  // Pagination & Modal
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [selectedBank, setSelectedBank] = useState(null);

  // Geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
          setUserLocation(loc);
          setLocationActive(true);
        },
        () => {
          setLocationActive(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, []);

  // Fetch Public Blood Banks (strictly verified + published)
  useEffect(() => {
    let isMounted = true;
    const loadBanks = async () => {
      setLoading(true);
      try {
        const data = await bloodBankService.getPublicBloodBanks(
          {
            searchQuery,
            city: selectedCity,
            bloodGroup: selectedBloodGroup,
          },
          userLocation
        );
        if (isMounted) {
          setBloodBanks(data);
        }
      } catch (err) {
        console.warn("⚠️ Error loading public blood banks:", err.message);
        addToast("Failed to load blood banks list.", "error");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadBanks();
    return () => {
      isMounted = false;
    };
  }, [searchQuery, selectedCity, selectedBloodGroup, userLocation, addToast]);

  const cities = ["All", ...bloodBankService.getCities(bloodBanks)];
  const bloodGroups = ["All", "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  // Pagination
  const totalPages = Math.ceil(bloodBanks.length / itemsPerPage) || 1;
  const paginatedBanks = bloodBanks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* HERO BANNER */}
      <div className="bg-gradient-to-br from-rose-900 via-slate-900 to-rose-950 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-rose-900/40 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-4 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-rose-500/20 text-rose-300 text-xs font-black uppercase tracking-wider rounded-lg border border-rose-500/30 flex items-center gap-1.5">
              <Droplet className="w-3.5 h-3.5 fill-rose-400" /> Regional Transfusion Network
            </span>
            {locationActive && (
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[11px] font-extrabold rounded-md border border-emerald-500/30">
                📍 Distance Ordered
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Blood Bank & Transfusion Directory
          </h1>
          <p className="text-sm sm:text-base text-rose-100/80 max-w-2xl font-medium leading-relaxed">
            Discover verified FDA-licensed blood banks, check real-time stock availability across blood groups, and connect with regional transfusion units.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* SEARCH & FILTERS BAR */}
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200/80 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search blood banks by name, city, area..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
              />
            </div>

            {/* City Dropdown */}
            <div className="relative">
              <select
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-bold focus:outline-none focus:border-rose-500 cursor-pointer"
              >
                {cities.map((c) => (
                  <option key={c} value={c}>
                    City: {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Blood Group Filter Chips */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {bloodGroups.map((grp) => {
                const isSel = selectedBloodGroup === grp;
                return (
                  <button
                    key={grp}
                    onClick={() => {
                      setSelectedBloodGroup(grp);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer ${
                      isSel
                        ? "bg-rose-600 text-white shadow-md shadow-rose-600/20"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {grp}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* BLOOD BANKS CARDS GRID */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-slate-200/60 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : paginatedBanks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedBanks.map((b) => {
              const stock = b.bloodGroupStock || {};
              const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                `${b.name}, ${b.city}`
              )}`;

              return (
                <div
                  key={b.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  <div className="p-6 space-y-4">
                    {/* Card Header & Badges */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="px-2.5 py-0.5 bg-rose-50 text-rose-700 font-extrabold text-[10px] rounded-md border border-rose-200">
                            {b.type || b.category || "Blood Centre"}
                          </span>
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-extrabold text-[10px] rounded-md border border-emerald-200 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> FDA Verified
                          </span>
                        </div>
                        <h2 className="text-base font-black text-slate-900 group-hover:text-rose-600 transition-colors leading-snug">
                          {b.name}
                        </h2>
                      </div>

                      {b.distanceKm != null && (
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-800 font-extrabold text-xs rounded-xl shrink-0">
                          {b.distanceKm} km
                        </span>
                      )}
                    </div>

                    {/* Location & Address */}
                    <div className="flex items-start gap-2 text-xs text-slate-600">
                      <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <span>
                        {b.address}, {b.city}, {b.district}
                      </span>
                    </div>

                    {/* Phone & 24/7 Availability */}
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        <span>{b.phone || b.erDirectPhone || "Contact Onsite"}</span>
                      </div>
                      {b.isOpen247 && (
                        <span className="px-2 py-0.5 bg-rose-50 text-rose-700 font-bold text-[10px] rounded-md">
                          24/7 Emergency Desk
                        </span>
                      )}
                    </div>

                    {/* Stock Grid Preview */}
                    <div className="space-y-1.5 pt-2">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                        Blood Stock Units
                      </span>
                      <div className="grid grid-cols-4 gap-1.5 text-[11px] font-bold">
                        {["A+", "B+", "O+", "AB+", "A-", "B-", "O-", "AB-"].map((grp) => {
                          const count = stock[grp] ?? 0;
                          return (
                            <div
                              key={grp}
                              className={`p-1.5 rounded-lg border text-center ${
                                count > 0
                                  ? "bg-rose-50/60 border-rose-200 text-rose-900"
                                  : "bg-slate-50 border-slate-200 text-slate-400"
                              }`}
                            >
                              <div className="text-[10px] font-black">{grp}</div>
                              <div className="text-xs font-black">{count}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                    {b.phone ? (
                      <a
                        href={`tel:${b.phone}`}
                        className="flex-1 py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5" /> Call
                      </a>
                    ) : (
                      <button
                        disabled
                        className="flex-1 py-2.5 px-3 bg-slate-200 text-slate-500 font-bold text-xs rounded-xl"
                      >
                        Call
                      </button>
                    )}

                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3 bg-white hover:bg-slate-100 text-slate-800 font-extrabold text-xs rounded-xl border border-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Navigation className="w-3.5 h-3.5 text-sky-600" /> Map
                    </a>

                    <button
                      onClick={() => setSelectedBank(b)}
                      className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
            <Droplet className="w-12 h-12 text-rose-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No verified blood banks found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search query, city filter, or blood group selection.
            </p>
          </div>
        )}

        {/* PAGINATION */}
        {!loading && bloodBanks.length > 0 && (
          <div className="pt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(p) => setCurrentPage(p)}
            />
          </div>
        )}
      </div>

      {/* BLOOD BANK DETAIL MODAL */}
      {selectedBank && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full p-6 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-extrabold text-[10px] rounded-md border border-emerald-200">
                  Verified FDA Facility
                </span>
                <h2 className="text-xl font-black text-slate-900">{selectedBank.name}</h2>
                <p className="text-xs text-slate-500">{selectedBank.type || "Blood Transfusion Unit"}</p>
              </div>
              <button
                onClick={() => setSelectedBank(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Address & License */}
            <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="font-bold flex items-center gap-1.5 text-slate-900">
                <MapPin className="w-4 h-4 text-rose-500" />
                <span>{selectedBank.address}, {selectedBank.city}, {selectedBank.district}</span>
              </div>
              {selectedBank.verificationNumber && (
                <div className="font-mono text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                  License / Registration: {selectedBank.verificationNumber}
                </div>
              )}
            </div>

            {/* Full Stock Table */}
            <div className="space-y-2">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Full Blood Group Stock Availability
              </h3>
              <div className="grid grid-cols-4 gap-2 text-xs font-bold">
                {Object.entries(selectedBank.bloodGroupStock || {}).map(([grp, count]) => (
                  <div
                    key={grp}
                    className="p-2.5 bg-rose-50/50 border border-rose-200 rounded-xl text-center"
                  >
                    <span className="text-xs text-rose-900 font-black block">{grp}</span>
                    <span className="text-sm font-black text-rose-600">{count} Units</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Component Services */}
            {selectedBank.componentsAvailable?.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Component Separation Services
                </h3>
                <div className="flex flex-wrap gap-1.5 text-xs">
                  {selectedBank.componentsAvailable.map((c) => (
                    <span key={c} className="px-2.5 py-1 bg-slate-100 text-slate-800 font-bold rounded-lg border border-slate-200">
                      ✓ {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              {selectedBank.phone && (
                <a
                  href={`tel:${selectedBank.phone}`}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-rose-600/20"
                >
                  <Phone className="w-4 h-4" /> Call Blood Bank
                </a>
              )}
              <button
                onClick={() => setSelectedBank(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
