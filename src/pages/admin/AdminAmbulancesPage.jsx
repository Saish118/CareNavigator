import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Ambulance,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Globe,
  Trash2,
  Edit,
  Eye,
  AlertTriangle,
  Filter,
  Activity,
  HeartPulse,
  Zap,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { ambulanceService } from "../../services/ambulanceService";
import { useToast } from "../../components/ui/ToastNotification";
import { useAuth } from "../../context/AuthContext";
import { Pagination } from "../../components/ui/Pagination";

export const AdminAmbulancesPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { currentUser } = useAuth();

  const [ambulances, setAmbulances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCity, setFilterCity] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [filterAvailability, setFilterAvailability] = useState("All");
  const [filterVerification, setFilterVerification] = useState("All");
  const [filterPublished, setFilterPublished] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Soft Delete Confirmation Modal State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAmbulances = async () => {
    setLoading(true);
    try {
      const data = await ambulanceService.getAdminAmbulances();
      setAmbulances(data);
    } catch (err) {
      console.warn("⚠️ Failed to load admin ambulances:", err.message);
      addToast("Failed to load ambulances dataset: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmbulances();
  }, []);

  const cities = ["All", ...ambulanceService.getCities(ambulances)];

  const filteredAmbulances = ambulances.filter((item) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const name = (item.providerName || "").toLowerCase();
      const reg = (item.ambulanceRegistrationNumber || "").toLowerCase();
      const city = (item.city || "").toLowerCase();
      const type = (item.ambulanceType || "").toLowerCase();
      if (!name.includes(q) && !reg.includes(q) && !city.includes(q) && !type.includes(q)) {
        return false;
      }
    }

    if (filterCity !== "All") {
      if ((item.city || "").toLowerCase().trim() !== filterCity.toLowerCase().trim()) {
        return false;
      }
    }

    if (filterType !== "All") {
      if (item.ambulanceType !== filterType) {
        return false;
      }
    }

    if (filterAvailability !== "All") {
      if (item.availabilityStatus !== filterAvailability) {
        return false;
      }
    }

    if (filterVerification !== "All") {
      if (item.verificationStatus !== filterVerification) {
        return false;
      }
    }

    if (filterPublished !== "All") {
      if (filterPublished === "published") {
        if (item.published !== true) return false;
      } else if (filterPublished === "draft") {
        if (item.published === true) return false;
      }
    }

    return true;
  });

  const totalPages = Math.ceil(filteredAmbulances.length / itemsPerPage) || 1;
  const paginatedAmbulances = filteredAmbulances.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSoftDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await ambulanceService.softDeleteAmbulance(deleteTarget.id, currentUser);
      addToast(`Ambulance "${deleteTarget.providerName}" archived safely.`, "success");
      setDeleteTarget(null);
      fetchAmbulances();
    } catch (err) {
      addToast("Failed to archive ambulance: " + err.message, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleQuickToggleVerify = async (item) => {
    try {
      const newStatus = item.verificationStatus === "verified" ? "pending" : "verified";
      await ambulanceService.updateAmbulance(item.id, { verificationStatus: newStatus }, currentUser);
      addToast(`Verification status set to "${newStatus}" for ${item.providerName}`, "info");
      fetchAmbulances();
    } catch (err) {
      addToast("Failed to update verification status: " + err.message, "error");
    }
  };

  const handleQuickTogglePublish = async (item) => {
    try {
      const newPub = !item.published;
      await ambulanceService.updateAmbulance(item.id, { published: newPub }, currentUser);
      addToast(`${item.providerName} is now ${newPub ? "Published" : "Draft (Unpublished)"}`, "info");
      fetchAmbulances();
    } catch (err) {
      addToast("Failed to update publishing status: " + err.message, "error");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-rose-500/20 text-rose-400 font-extrabold text-[10px] rounded-md uppercase tracking-wider border border-rose-500/30">
              Emergency Services
            </span>
            <span className="text-xs text-slate-400 font-medium">Ambulance Fleet & Response Network</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">Ambulance Management</h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Manage regional ambulance fleets, ICU equipment specs, dispatch availability, and verification.
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/ambulances/new")}
          className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-rose-600/25 flex items-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Ambulance</span>
        </button>
      </div>

      {/* SEARCH AND FILTERS TOOLBAR */}
      <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-md">
        <div className="relative flex-1 min-w-[240px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search provider, registration number, city..."
            className="w-full pl-9 pr-4 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-rose-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* City Filter */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-xs text-slate-300">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={filterCity}
              onChange={(e) => {
                setFilterCity(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
            >
              {cities.map((c) => (
                <option key={c} value={c} className="bg-slate-900 text-white">
                  City: {c}
                </option>
              ))}
            </select>
          </div>

          {/* Availability Filter */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-xs text-slate-300">
            <select
              value={filterAvailability}
              onChange={(e) => {
                setFilterAvailability(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-900 text-white">Status: All</option>
              <option value="Available" className="bg-slate-900 text-white">Available</option>
              <option value="On Call" className="bg-slate-900 text-white">On Call</option>
              <option value="Busy" className="bg-slate-900 text-white">Busy</option>
              <option value="Offline" className="bg-slate-900 text-white">Offline</option>
            </select>
          </div>

          {/* Verification Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-xs text-slate-300">
            <select
              value={filterVerification}
              onChange={(e) => {
                setFilterVerification(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-900 text-white">Verification: All</option>
              <option value="verified" className="bg-slate-900 text-white">Verified</option>
              <option value="pending" className="bg-slate-900 text-white">Pending</option>
              <option value="rejected" className="bg-slate-900 text-white">Rejected</option>
            </select>
          </div>

          {/* Published Filter */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-xs text-slate-300">
            <select
              value={filterPublished}
              onChange={(e) => {
                setFilterPublished(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-900 text-white">Publishing: All</option>
              <option value="published" className="bg-slate-900 text-white">Published</option>
              <option value="draft" className="bg-slate-900 text-white">Draft (Unpublished)</option>
            </select>
          </div>
        </div>
      </div>

      {/* AMBULANCES TABLE */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        {loading ? (
          <div className="py-16 text-center text-slate-400 space-y-3">
            <div className="w-8 h-8 border-3 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-semibold">Loading ambulance records...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-[11px] uppercase font-bold text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Provider / Unit Name</th>
                  <th className="py-3.5 px-4">Type & Registration</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Equipment Specs</th>
                  <th className="py-3.5 px-4">Availability</th>
                  <th className="py-3.5 px-4">Verification</th>
                  <th className="py-3.5 px-4">Published</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-medium">
                {paginatedAmbulances.length > 0 ? (
                  paginatedAmbulances.map((item) => {
                    const isVerified = item.verificationStatus === "verified";
                    const isPending = item.verificationStatus === "pending";
                    const isPublished = item.published === true;

                    return (
                      <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 max-w-[220px]">
                          <div className="flex items-start gap-2">
                            <div className="p-1.5 bg-rose-500/10 text-rose-400 rounded-lg shrink-0 mt-0.5 border border-rose-500/20">
                              <Ambulance className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <span className="font-bold text-white block truncate leading-tight">
                                {item.providerName}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono block">
                                ID: {item.id}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="px-2 py-0.5 bg-slate-800 text-sky-300 rounded-md border border-slate-700 text-[10px] font-bold block w-max mb-0.5">
                            {item.ambulanceType}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 block">
                            Reg: {item.ambulanceRegistrationNumber || "N/A"}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-semibold text-slate-200 block">{item.city}</span>
                          <span className="text-[10px] text-slate-500 block">{item.district || item.area}</span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-[10px]">
                            {item.oxygen && (
                              <span className="px-1.5 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800/40 rounded font-bold">
                                O2
                              </span>
                            )}
                            {item.ventilator && (
                              <span className="px-1.5 py-0.5 bg-sky-950 text-sky-300 border border-sky-800/40 rounded font-bold">
                                Vent
                              </span>
                            )}
                            {item.defibrillator && (
                              <span className="px-1.5 py-0.5 bg-amber-950 text-amber-300 border border-amber-800/40 rounded font-bold">
                                Defib
                              </span>
                            )}
                            {item.stretcher && (
                              <span className="px-1.5 py-0.5 bg-slate-800 text-slate-300 border border-slate-700 rounded font-bold">
                                Stretcher
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {item.availabilityStatus === "Available" ? (
                            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 font-bold rounded-md border border-emerald-500/30 text-[10px]">
                              ● Available
                            </span>
                          ) : item.availabilityStatus === "On Call" ? (
                            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 font-bold rounded-md border border-amber-500/30 text-[10px]">
                              ◐ On Call
                            </span>
                          ) : item.availabilityStatus === "Busy" ? (
                            <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 font-bold rounded-md border border-rose-500/30 text-[10px]">
                              ✕ Busy
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-slate-800 text-slate-400 font-bold rounded-md border border-slate-700 text-[10px]">
                              Offline
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <button
                            onClick={() => handleQuickToggleVerify(item)}
                            className="cursor-pointer"
                            title="Click to toggle verification"
                          >
                            {isVerified ? (
                              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 font-bold rounded-md border border-emerald-500/30 text-[10px]">
                                Verified ✓
                              </span>
                            ) : isPending ? (
                              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 font-bold rounded-md border border-amber-500/30 text-[10px]">
                                Pending ⏳
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 font-bold rounded-md border border-rose-500/30 text-[10px]">
                                Rejected
                              </span>
                            )}
                          </button>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <button
                            onClick={() => handleQuickTogglePublish(item)}
                            className="cursor-pointer"
                            title="Click to toggle publish status"
                          >
                            {isPublished ? (
                              <span className="px-2 py-0.5 bg-sky-500/20 text-sky-300 font-bold rounded-md border border-sky-500/30 text-[10px]">
                                Published
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-slate-800 text-slate-400 font-bold rounded-md border border-slate-700 text-[10px]">
                                Draft
                              </span>
                            )}
                          </button>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap text-right space-x-1.5">
                          <button
                            onClick={() => navigate(`/admin/ambulances/${item.id}/edit`)}
                            className="p-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 rounded-lg border border-rose-500/30 transition-colors cursor-pointer"
                            title="Edit Ambulance Record"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setDeleteTarget(item)}
                            className="p-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-lg border border-rose-500/30 transition-colors cursor-pointer"
                            title="Archive / Soft Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="py-12 text-center text-slate-500">
                      No ambulance records match your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filteredAmbulances.length > 0 && (
          <div className="p-4 border-t border-slate-800 bg-slate-900">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(p) => setCurrentPage(p)}
            />
          </div>
        )}
      </div>

      {/* SOFT DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-5 text-white">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-rose-500/20 text-rose-400 rounded-2xl border border-rose-500/30 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Archive Ambulance Unit?</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Are you sure you want to archive{" "}
                  <strong className="text-white">{deleteTarget.providerName}</strong>?
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-xs text-slate-300 space-y-1">
              <span className="font-bold text-rose-400 block">Soft-Delete Protection:</span>
              <p className="text-[11px] text-slate-400">
                This ambulance will be safely hidden from public emergency map discovery without erasing historical record data.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 cursor-pointer"
                disabled={isDeleting}
              >
                Cancel
              </button>

              <button
                onClick={handleSoftDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-rose-600/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Archive Record</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
