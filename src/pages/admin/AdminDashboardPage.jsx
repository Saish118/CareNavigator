import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  CheckCircle2,
  Clock,
  Globe,
  Plus,
  ArrowRight,
  ShieldCheck,
  Activity,
  AlertTriangle,
} from "lucide-react";
import { hospitalService } from "../../services/hospitalService";

export const AdminDashboardPage = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    published: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentHospitals, setRecentHospitals] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const fetchAdminStats = async () => {
      setLoading(true);
      try {
        const liveStats = await hospitalService.getAdminHospitalStats();
        const hospitalsList = await hospitalService.getAdminHospitals();

        if (isMounted) {
          setStats(liveStats);
          setRecentHospitals(hospitalsList.slice(0, 5));
        }
      } catch (err) {
        console.warn("⚠️ Admin dashboard fetch notice:", err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAdminStats();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-8 pb-12">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-sky-500/20 text-sky-400 font-extrabold text-[10px] rounded-md uppercase tracking-wider border border-sky-500/30">
              Overview
            </span>
            <span className="text-xs text-slate-400 font-medium">MediNAV Healthcare Network</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">Admin Dashboard</h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Monitor healthcare provider registries, verification status, and facility publishing.
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

      {/* LIVE STATS CARDS */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-900/60 rounded-2xl border border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Hospitals */}
          <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                Total Hospitals
              </span>
              <div className="p-2 bg-blue-500/15 text-blue-400 rounded-xl border border-blue-500/30">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{stats.total}</span>
              <span className="text-[11px] text-slate-400 font-medium">facilities registered</span>
            </div>
          </div>

          {/* Verified Hospitals */}
          <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                Verified Hospitals
              </span>
              <div className="p-2 bg-emerald-500/15 text-emerald-400 rounded-xl border border-emerald-500/30">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-emerald-400">{stats.verified}</span>
              <span className="text-[11px] text-slate-400 font-medium">verified records</span>
            </div>
          </div>

          {/* Pending Verification */}
          <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                Pending Verification
              </span>
              <div className="p-2 bg-amber-500/15 text-amber-400 rounded-xl border border-amber-500/30">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-amber-400">{stats.pending}</span>
              <span className="text-[11px] text-slate-400 font-medium">awaiting review</span>
            </div>
          </div>

          {/* Published Hospitals */}
          <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-sky-400 tracking-wider">
                Published Hospitals
              </span>
              <div className="p-2 bg-sky-500/15 text-sky-400 rounded-xl border border-sky-500/30">
                <Globe className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-sky-400">{stats.published}</span>
              <span className="text-[11px] text-slate-400 font-medium">live on website</span>
            </div>
          </div>
        </div>
      )}

      {/* QUICK ACTIONS & RECENT HOSPITALS TABLE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-sky-400" /> Recent Hospital Registrations
          </h2>
          <button
            onClick={() => navigate("/admin/hospitals")}
            className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer"
          >
            <span>Manage All Hospitals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-[11px] uppercase font-bold text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Hospital Facility</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Verification</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-medium">
                {recentHospitals.length > 0 ? (
                  recentHospitals.map((h) => (
                    <tr key={h.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-white block truncate max-w-[200px] sm:max-w-[280px]">
                          {h.name}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono block">ID: {h.id}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span>{h.city || "Maharashtra"}</span>
                        <span className="text-slate-500 text-[10px] block">{h.district}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded-md border border-slate-700 text-[10px] font-semibold">
                          {h.type || h.category || "General"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {h.verificationStatus === "verified" || (!h.verificationStatus && h.id) ? (
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 font-bold rounded-md border border-emerald-500/30 text-[10px]">
                            Verified
                          </span>
                        ) : h.verificationStatus === "rejected" ? (
                          <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 font-bold rounded-md border border-rose-500/30 text-[10px]">
                            Rejected
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 font-bold rounded-md border border-amber-500/30 text-[10px]">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {h.published !== false ? (
                          <span className="px-2 py-0.5 bg-sky-500/20 text-sky-300 font-bold rounded-md border border-sky-500/30 text-[10px]">
                            Published
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-slate-800 text-slate-400 font-bold rounded-md border border-slate-700 text-[10px]">
                            Draft
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => navigate(`/admin/hospitals/${h.id}/edit`)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] rounded-lg border border-slate-700 transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-500">
                      No hospital records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
