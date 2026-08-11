import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Droplet,
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
import { bloodBankService } from "../../services/bloodBankService";
import { ambulanceService } from "../../services/ambulanceService";
import { Ambulance } from "lucide-react";

export const AdminDashboardPage = () => {
  const navigate = useNavigate();

  const [hospitalStats, setHospitalStats] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    published: 0,
  });

  const [bloodBankStats, setBloodBankStats] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    published: 0,
  });

  const [ambulanceStats, setAmbulanceStats] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    published: 0,
  });

  const [loading, setLoading] = useState(true);
  const [recentHospitals, setRecentHospitals] = useState([]);
  const [recentBloodBanks, setRecentBloodBanks] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const fetchAdminStats = async () => {
      setLoading(true);
      try {
        const [hStats, bStats, aStats, hList, bList] = await Promise.all([
          hospitalService.getAdminHospitalStats(),
          bloodBankService.getAdminBloodBankStats(),
          ambulanceService.getAdminAmbulanceStats(),
          hospitalService.getAdminHospitals(),
          bloodBankService.getAdminBloodBanks(),
        ]);

        if (isMounted) {
          setHospitalStats(hStats);
          setBloodBankStats(bStats);
          setAmbulanceStats(aStats);
          setRecentHospitals(hList.slice(0, 5));
          setRecentBloodBanks(bList.slice(0, 5));
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
            Monitor healthcare provider registries, blood banks, verification status, and publishing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => navigate("/admin/hospitals/new")}
            className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-sky-600/25 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Hospital</span>
          </button>

          <button
            onClick={() => navigate("/admin/blood-banks/new")}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-rose-600/25 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Blood Bank</span>
          </button>

          <button
            onClick={() => navigate("/admin/ambulances/new")}
            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-amber-600/25 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Ambulance</span>
          </button>
        </div>
      </div>

      {/* LIVE HOSPITAL STATS CARDS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-sky-400" /> Hospital Network Summary
          </h2>
          <button
            onClick={() => navigate("/admin/hospitals")}
            className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({hospitalStats.total})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-slate-900/60 rounded-2xl border border-slate-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  Total Hospitals
                </span>
                <Building2 className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-2xl font-black text-white">{hospitalStats.total}</div>
            </div>

            <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                  Verified
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-emerald-400">{hospitalStats.verified}</div>
            </div>

            <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                  Pending Review
                </span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-amber-400">{hospitalStats.pending}</div>
            </div>

            <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-sky-400 tracking-wider">
                  Published
                </span>
                <Globe className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-2xl font-black text-sky-400">{hospitalStats.published}</div>
            </div>
          </div>
        )}
      </div>

      {/* LIVE BLOOD BANK STATS CARDS */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Droplet className="w-4 h-4 text-rose-400" /> Blood Transfusion Network Summary
          </h2>
          <button
            onClick={() => navigate("/admin/blood-banks")}
            className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({bloodBankStats.total})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-slate-900/60 rounded-2xl border border-slate-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  Total Blood Banks
                </span>
                <Droplet className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-2xl font-black text-white">{bloodBankStats.total}</div>
            </div>

            <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                  Verified
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-emerald-400">{bloodBankStats.verified}</div>
            </div>

            <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                  Pending Review
                </span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-amber-400">{bloodBankStats.pending}</div>
            </div>

            <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-rose-400 tracking-wider">
                  Published
                </span>
                <Globe className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-2xl font-black text-rose-400">{bloodBankStats.published}</div>
            </div>
          </div>
        )}
      </div>

      {/* LIVE AMBULANCE STATS CARDS */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Ambulance className="w-4 h-4 text-amber-400" /> Ambulance Dispatch Fleet Summary
          </h2>
          <button
            onClick={() => navigate("/admin/ambulances")}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({ambulanceStats.total})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-slate-900/60 rounded-2xl border border-slate-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  Total Ambulances
                </span>
                <Ambulance className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-white">{ambulanceStats.total}</div>
            </div>

            <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                  Verified
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-emerald-400">{ambulanceStats.verified}</div>
            </div>

            <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                  Pending Review
                </span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-amber-400">{ambulanceStats.pending}</div>
            </div>

            <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                  Published
                </span>
                <Globe className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-amber-400">{ambulanceStats.published}</div>
            </div>
          </div>
        )}
      </div>

      {/* RECENT BLOOD BANKS & HOSPITALS SUMMARY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        {/* Recent Hospitals */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Recent Hospitals</span>
            <button
              onClick={() => navigate("/admin/hospitals")}
              className="text-sky-400 hover:text-sky-300 font-bold normal-case text-xs cursor-pointer"
            >
              Manage
            </button>
          </h3>
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden">
            <div className="divide-y divide-slate-800/80">
              {recentHospitals.slice(0, 4).map((h) => (
                <div key={h.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-800/40">
                  <div>
                    <span className="font-bold text-white block">{h.name}</span>
                    <span className="text-[10px] text-slate-400">{h.city} • {h.type || "Multispecialty"}</span>
                  </div>
                  <button
                    onClick={() => navigate(`/admin/hospitals/${h.id}/edit`)}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[10px] rounded-lg border border-slate-700 cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Blood Banks */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Recent Blood Banks</span>
            <button
              onClick={() => navigate("/admin/blood-banks")}
              className="text-rose-400 hover:text-rose-300 font-bold normal-case text-xs cursor-pointer"
            >
              Manage
            </button>
          </h3>
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden">
            <div className="divide-y divide-slate-800/80">
              {recentBloodBanks.slice(0, 4).map((b) => (
                <div key={b.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-800/40">
                  <div className="flex items-start gap-2">
                    <Droplet className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">{b.name}</span>
                      <span className="text-[10px] text-slate-400">{b.city} • {b.type || "Red Cross"}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/admin/blood-banks/${b.id}/edit`)}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[10px] rounded-lg border border-slate-700 cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
