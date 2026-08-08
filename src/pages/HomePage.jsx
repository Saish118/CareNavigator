import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  Search,
  Sparkles,
  BedDouble,
  Clock,
  Navigation,
  Flame,
  ArrowRight,
  ShieldCheck,
  PhoneCall,
  CheckCircle2,
  HeartPulse,
} from "lucide-react";
import { SearchInput } from "../components/common/SearchInput";
import { HospitalCard } from "../components/hospital/HospitalCard";
import { hospitalService } from "../services/hospitalService";
import { HospitalDetailModal } from "../components/hospital/HospitalDetailModal";
import { useEmergency } from "../context/EmergencyContext";
import { Button } from "../components/common/Button";
import { REGIONAL_METRICS } from "../data/analyticsData";

export const HomePage = () => {
  const navigate = useNavigate();
  const { setDestination } = useEmergency();
  const [topHospitals, setTopHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHospitalForBed, setSelectedHospitalForBed] = useState(null);
  const [selectedHospitalForDetail, setSelectedHospitalForDetail] = useState(null);

  useEffect(() => {
    const fetchHospitals = async () => {
      setLoading(true);
      const data = await hospitalService.getHospitals();
      setTopHospitals(data.slice(0, 3));
      setLoading(false);
    };
    fetchHospitals();
  }, []);

  const handleSearchSubmit = (query) => {
    navigate(`/recommendations?q=${encodeURIComponent(query)}`);
  };

  const handleNavigate = (hospital) => {
    setDestination(hospital);
    navigate("/map");
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-sky-50/80 via-white to-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-black border border-sky-200 shadow-sm">
              <Sparkles className="w-4 h-4 text-sky-600 animate-pulse" />
              <span>Next-Gen AI Emergency Triage & Hospital Routing</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-slate-950 tracking-tight leading-tight">
              Instant Hospital Recommendation &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-blue-600 to-emerald-500">
                Siren Corridor Navigation
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
              Find hospitals by real-time ICU bed availability, ER wait times, and trauma specialty. Dispatches emergency siren routes in seconds.
            </p>

            {/* AI Search Bar */}
            <div className="pt-4 max-w-2xl mx-auto">
              <SearchInput onSearch={handleSearchSubmit} />
            </div>

            {/* Live Metrics Counter Bar */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="p-4 bg-white/90 rounded-2xl border border-slate-200/80 shadow-md">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  {REGIONAL_METRICS.totalHospitalsTracked}
                </span>
                <span className="block text-xs font-bold text-slate-500 uppercase mt-0.5">
                  Live Hospitals Tracked
                </span>
              </div>
              <div className="p-4 bg-white/90 rounded-2xl border border-slate-200/80 shadow-md">
                <span className="text-2xl sm:text-3xl font-black text-emerald-600">
                  {REGIONAL_METRICS.totalAvailableIcuBeds}
                </span>
                <span className="block text-xs font-bold text-slate-500 uppercase mt-0.5">
                  Available ICU Beds
                </span>
              </div>
              <div className="p-4 bg-white/90 rounded-2xl border border-slate-200/80 shadow-md">
                <span className="text-2xl sm:text-3xl font-black text-sky-600">
                  {REGIONAL_METRICS.avgRegionalResponseTimeMin}m
                </span>
                <span className="block text-xs font-bold text-slate-500 uppercase mt-0.5">
                  Avg Response Time
                </span>
              </div>
              <div className="p-4 bg-white/90 rounded-2xl border border-slate-200/80 shadow-md">
                <span className="text-2xl sm:text-3xl font-black text-rose-600">
                  {REGIONAL_METRICS.activeAmbulancesDispatched}
                </span>
                <span className="block text-xs font-bold text-slate-500 uppercase mt-0.5">
                  Active Ambulances
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Map & Navigation Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-lg text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Navigation className="w-4 h-4 animate-pulse" /> Emergency Map & Navigation
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">
              Need Immediate Navigation to Nearby Trauma Centers?
            </h2>
            <p className="text-blue-100 text-xs sm:text-sm font-medium">
              Explore interactive map routes, live travel times, and direct hospital contact numbers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
            <Button
              onClick={() => navigate("/map")}
              variant="glass"
              size="xl"
              icon={Navigation}
              className="w-full sm:w-auto text-blue-900 bg-white font-extrabold hover:bg-blue-50"
            >
              Open Emergency Map
            </Button>
          </div>
        </div>
      </section>

      {/* Top AI Recommended Hospitals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-extrabold text-sky-600 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> Recommended Trauma Facilities
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Top AI Recommended Hospitals
            </h2>
          </div>
          <Button
            onClick={() => navigate("/recommendations")}
            variant="outline"
            size="md"
            icon={ArrowRight}
          >
            Explore All Hospitals
          </Button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 font-semibold">
            Loading AI hospital recommendations...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topHospitals.map((hosp) => (
              <HospitalCard
                key={hosp.id}
                hospital={hosp}
                onNavigate={handleNavigate}
                onSelectDetails={(h) => setSelectedHospitalForDetail(h)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Feature Navigation Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            onClick={() => navigate("/triage")}
            className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-lg hover:border-sky-400 transition-all cursor-pointer group space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
              AI Symptom Triage Assistant
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Step-by-step symptoms evaluation protocol generating immediate severity scores (Level 1 Red to Level 4 Green).
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 pt-2">
              Start Assessment <ArrowRight className="w-4 h-4" />
            </span>
          </div>

          <div
            onClick={() => navigate("/beds")}
            className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-lg hover:border-emerald-400 transition-all cursor-pointer group space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <BedDouble className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
              Real-Time ICU Bed Tracker
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Live telemetry tracking ICU, ventilator, and pediatric beds across regional medical centers.
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 pt-2">
              Track Bed Matrix <ArrowRight className="w-4 h-4" />
            </span>
          </div>

          <div
            onClick={() => navigate("/map")}
            className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-lg hover:border-blue-400 transition-all cursor-pointer group space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Navigation className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
              Emergency Route Navigator
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Interactive vector map with turn-by-turn guidance and Emergency Siren Priority Corridor clearance.
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 pt-2">
              Launch Route Map <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </section>

      {/* Hospital Detail Modal */}
      <HospitalDetailModal
        isOpen={!!selectedHospitalForDetail}
        onClose={() => setSelectedHospitalForDetail(null)}
        hospital={selectedHospitalForDetail}
        onNavigate={handleNavigate}
      />
    </div>
  );
};
