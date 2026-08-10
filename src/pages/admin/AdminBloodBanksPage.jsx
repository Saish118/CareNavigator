import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Droplet,
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
} from "lucide-react";
import { bloodBankService } from "../../services/bloodBankService";
import { useToast } from "../../components/ui/ToastNotification";
import { useAuth } from "../../context/AuthContext";
import { Pagination } from "../../components/ui/Pagination";

export const AdminBloodBanksPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { currentUser } = useAuth();

  const [bloodBanks, setBloodBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCity, setFilterCity] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Soft Delete Confirmation Modal State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchBloodBanks = async () => {
    setLoading(true);
    try {
      const data = await bloodBankService.getAdminBloodBanks();
      setBloodBanks(data);
    } catch (err) {
      console.warn("⚠️ Failed to load admin blood banks:", err.message);
      addToast("Failed to load blood banks dataset: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBloodBanks();
  }, []);

  const cities = ["All", ...bloodBankService.getCities(bloodBanks)];

  const filteredBloodBanks = bloodBanks.filter((b) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const name = (b.name || "").toLowerCase();
      const city = (b.city || "").toLowerCase();
      const district = (b.district || "").toLowerCase();
      const type = (b.type || b.category || "").toLowerCase();
      if (!name.includes(q) && !city.includes(q) && !district.includes(q) && !type.includes(q)) {
        return false;
      }
    }

    if (filterCity !== "All") {
      if ((b.city || "").toLowerCase().trim() !== filterCity.toLowerCase().trim()) {
        return false;
      }
    }

    if (filterStatus !== "All") {
      if (filterStatus === "verified") {
        if (b.verificationStatus !== "verified" && (b.verificationStatus || !b.id)) return false;
      } else if (filterStatus === "pending") {
        if (b.verificationStatus !== "pending") return false;
      } else if (filterStatus === "published") {
        if (b.published === false) return false;
      } else if (filterStatus === "draft") {
        if (b.published !== false) return false;
      }
    }
    return true;
  });

  const totalPages = Math.ceil(filteredBloodBanks.length / itemsPerPage) || 1;
  const paginatedBloodBanks = filteredBloodBanks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSoftDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await bloodBankService.softDeleteBloodBank(deleteTarget.id, currentUser);
      addToast(`Blood Bank "${deleteTarget.name}" archived safely.`, "success");
      setDeleteTarget(null);
      fetchBloodBanks();
    } catch (err) {
      addToast("Failed to archive blood bank: " + err.message, "error");
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
            <span className="px-2.5 py-0.5 bg-rose-500/20 text-rose-400 font-extrabold text-[10px] rounded-md uppercase tracking-wider border border-rose-500/30">
              Transfusion Network
            </span>
            <span className="text-xs text-slate-400 font-medium">Regional Blood Banks</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">Blood Bank Management</h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Manage blood bank centers, stock inventory, components, and FDA verification status.
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/blood-banks/new")}
          className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-rose-600/25 flex items-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Blood Bank</span>
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
            placeholder="Search blood banks by name, city, type..."
            className="w-full pl-9 pr-4 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-rose-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
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

          <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-xs text-slate-300">
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-900 text-white">Status: All</option>
              <option value="verified" className="bg-slate-900 text-white">Status: Verified</option>
              <option value="pending" className="bg-slate-900 text-white">Status: Pending</option>
              <option value="published" className="bg-slate-900 text-white">Status: Published</option>
              <option value="draft" className="bg-slate-900 text-white">Status: Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* BLOOD BANK TABLE */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        {loading ? (
          <div className="py-16 text-center text-slate-400 space-y-3">
            <div className="w-8 h-8 border-3 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-semibold">Loading blood bank records...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-[11px] uppercase font-bold text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Blood Centre Name</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Type / Category</th>
                  <th className="py-3.5 px-4">Contact Phone</th>
                  <th className="py-3.5 px-4">Key Stock (O+/O-/A+/B+)</th>
                  <th className="py-3.5 px-4">Verification</th>
                  <th className="py-3.5 px-4">Published</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-medium">
                {paginatedBloodBanks.length > 0 ? (
                  paginatedBloodBanks.map((b) => {
                    const isVerified = b.verificationStatus === "verified" || (!b.verificationStatus && b.id);
                    const isPending = b.verificationStatus === "pending";
                    const isPublished = b.published !== false;
                    const stock = b.bloodGroupStock || {};

                    return (
                      <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 max-w-[240px]">
                          <div className="flex items-start gap-2">
                            <div className="p-1.5 bg-rose-500/10 text-rose-400 rounded-lg shrink-0 mt-0.5 border border-rose-500/20">
                              <Droplet className="w-3.5 h-3.5 fill-rose-500/20" />
                            </div>
                            <div>
                              <span className="font-bold text-white block truncate leading-tight">
                                {b.name}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono block">
                                ID: {b.id}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-semibold text-slate-200 block">{b.city}</span>
                          <span className="text-[10px] text-slate-500 block">{b.district}</span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded-md border border-slate-700 text-[10px] font-semibold">
                            {b.type || b.category || "General Blood Bank"}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px] text-slate-300">
                          {b.phone || b.erDirectPhone || "N/A"}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold">
                            <span className="px-1.5 py-0.5 bg-rose-500/20 text-rose-300 rounded">
                              O+: {stock["O+"] ?? 0}
                            </span>
                            <span className="px-1.5 py-0.5 bg-rose-950 text-rose-400 border border-rose-800/40 rounded">
                              O-: {stock["O-"] ?? 0}
                            </span>
                            <span className="px-1.5 py-0.5 bg-slate-800 text-sky-300 rounded">
                              A+: {stock["A+"] ?? 0}
                            </span>
                            <span className="px-1.5 py-0.5 bg-slate-800 text-amber-300 rounded">
                              B+: {stock["B+"] ?? 0}
                            </span>
                          </div>
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
                            onClick={() => navigate(`/admin/blood-banks/${b.id}/edit`)}
                            className="p-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 rounded-lg border border-rose-500/30 transition-colors cursor-pointer"
                            title="Edit Blood Bank"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setDeleteTarget(b)}
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
                      No blood bank records match your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filteredBloodBanks.length > 0 && (
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
                <h3 className="text-lg font-bold text-white">Archive Blood Bank Record?</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Are you sure you want to archive{" "}
                  <strong className="text-white">{deleteTarget.name}</strong>?
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-xs text-slate-300 space-y-1">
              <span className="font-bold text-rose-400 block">Soft-Delete Protection:</span>
              <p className="text-[11px] text-slate-400">
                This blood bank will be safely hidden from public discovery without erasing historical data.
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
