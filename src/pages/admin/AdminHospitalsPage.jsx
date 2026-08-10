import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Globe,
  Trash2,
  Edit,
  Eye,
  AlertTriangle,
  X,
  Filter,
} from "lucide-react";
import { hospitalService } from "../../services/hospitalService";
import { useToast } from "../../components/ui/ToastNotification";
import { useAuth } from "../../context/AuthContext";
import { Pagination } from "../../components/ui/Pagination";

export const AdminHospitalsPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { currentUser } = useAuth();

  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCity, setFilterCity] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Soft Delete Confirmation Modal State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchHospitals = async () => {
    setLoading(true);
    try {
      const data = await hospitalService.getAdminHospitals();
      setHospitals(data);
    } catch (err) {
      console.warn("⚠️ Failed to load admin hospitals:", err.message);
      addToast("Failed to load hospital dataset: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  // Filtered List Computation
  const cities = ["All", ...hospitalService.getCities(hospitals).filter((c) => c !== "Near Me" && c !== "All Cities")];

  const filteredHospitals = hospitals.filter((h) => {
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const name = (h.name || "").toLowerCase();
      const city = (h.city || "").toLowerCase();
      const district = (h.district || "").toLowerCase();
      if (!name.includes(q) && !city.includes(q) && !district.includes(q)) {
        return false;
      }
    }
    // City filter
    if (filterCity !== "All") {
      if ((h.city || "").toLowerCase().trim() !== filterCity.toLowerCase().trim()) {
        return false;
      }
    }
    // Status filter
    if (filterStatus !== "All") {
      if (filterStatus === "verified") {
        if (h.verificationStatus !== "verified" && (h.verificationStatus || !h.id)) return false;
      } else if (filterStatus === "pending") {
        if (h.verificationStatus !== "pending") return false;
      } else if (filterStatus === "published") {
        if (h.published === false) return false;
      } else if (filterStatus === "draft") {
        if (h.published !== false) return false;
      }
    }
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredHospitals.length / itemsPerPage) || 1;
  const paginatedHospitals = filteredHospitals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSoftDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await hospitalService.softDeleteHospital(deleteTarget.id, currentUser);
      addToast(`Hospital "${deleteTarget.name}" archived safely.`, "success");
      setDeleteTarget(null);
      fetchHospitals();
    } catch (err) {
      addToast("Failed to archive hospital: " + err.message, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-sky-500/20 text-sky-400 font-extrabold text-[10px] rounded-md uppercase tracking-wider border border-sky-500/30">
              Provider Registry
            </span>
            <span className="text-xs text-slate-400 font-medium">Healthcare Facilities</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">Hospital Management</h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            View, edit, verify, and manage hospital facility records.
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/hospitals/new")}
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-sky-600/25 flex items-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Hospital</span>
        </button>
      </div>

      {/* SEARCH AND FILTERS TOOLBAR */}
      <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-md">
        {/* Search Bar */}
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
            placeholder="Search hospitals by name, city, district..."
            className="w-full pl-9 pr-4 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-sky-500 transition-colors"
          />
        </div>

        {/* Filters */}
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

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-xs text-slate-300">
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-900 text-white">
                Status: All
              </option>
              <option value="verified" className="bg-slate-900 text-white">
                Status: Verified
              </option>
              <option value="pending" className="bg-slate-900 text-white">
                Status: Pending
              </option>
              <option value="published" className="bg-slate-900 text-white">
                Status: Published
              </option>
              <option value="draft" className="bg-slate-900 text-white">
                Status: Draft
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* HOSPITAL TABLE */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        {loading ? (
          <div className="py-16 text-center text-slate-400 space-y-3">
            <div className="w-8 h-8 border-3 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-semibold">Loading official hospital records...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-[11px] uppercase font-bold text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Hospital Name</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Phone</th>
                  <th className="py-3.5 px-4">Capacity</th>
                  <th className="py-3.5 px-4">Verification</th>
                  <th className="py-3.5 px-4">Published</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-medium">
                {paginatedHospitals.length > 0 ? (
                  paginatedHospitals.map((h) => {
                    const bedText = h.beds?.total || h.beds?.general || "N/A";
                    const isVerified =
                      h.verificationStatus === "verified" || (!h.verificationStatus && h.id);
                    const isPending = h.verificationStatus === "pending";
                    const isPublished = h.published !== false;

                    return (
                      <tr key={h.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 max-w-[240px]">
                          <span className="font-bold text-white block truncate leading-tight">
                            {h.name}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono block">
                            ID: {h.id}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-semibold text-slate-200 block">{h.city}</span>
                          <span className="text-[10px] text-slate-500 block">{h.district}</span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded-md border border-slate-700 text-[10px] font-semibold">
                            {h.type || h.category || "General"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-300 font-mono text-[11px]">
                          {h.phone || h.erDirectPhone || "N/A"}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap font-bold text-slate-200">
                          {bedText} Beds
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {isVerified ? (
                            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 font-bold rounded-md border border-emerald-500/30 text-[10px]">
                              Verified
                            </span>
                          ) : isPending ? (
                            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 font-bold rounded-md border border-amber-500/30 text-[10px]">
                              Pending
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 font-bold rounded-md border border-rose-500/30 text-[10px]">
                              Rejected
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {isPublished ? (
                            <span className="px-2 py-0.5 bg-sky-500/20 text-sky-300 font-bold rounded-md border border-sky-500/30 text-[10px]">
                              Published
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-slate-800 text-slate-400 font-bold rounded-md border border-slate-700 text-[10px]">
                              Draft
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-right space-x-1.5">
                          <button
                            onClick={() => window.open(`/hospital/${h.id}`, "_blank")}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors"
                            title="View Public Page"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => navigate(`/admin/hospitals/${h.id}/edit`)}
                            className="p-1.5 bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 rounded-lg border border-sky-500/30 transition-colors"
                            title="Edit Hospital"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setDeleteTarget(h)}
                            className="p-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-lg border border-rose-500/30 transition-colors"
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
                      No hospitals match your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION */}
        {!loading && filteredHospitals.length > 0 && (
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
                <h3 className="text-lg font-bold text-white">Archive Hospital Record?</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Are you sure you want to archive{" "}
                  <strong className="text-white">{deleteTarget.name}</strong>?
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-xs text-slate-300 space-y-1">
              <span className="font-bold text-sky-400 block">Soft-Delete Safeguard:</span>
              <p className="text-[11px] text-slate-400">
                This facility will be safely hidden from public discovery without permanently erasing historical medical data.
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
