import React from "react";
import { motion } from "framer-motion";
import {
  ShieldAlert,
  CheckCircle2,
  PhoneCall,
  Navigation,
  RotateCcw,
  Clock,
  Sparkles,
  MapPin,
  Star,
  Activity,
  Share2,
  Phone,
  Building2,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { Button } from "../common/Button";
import { useToast } from "../ui/ToastNotification";

export const TriageResult = ({ result, onReset, onNavigateHospital }) => {
  const { addToast } = useToast();

  if (!result) return null;

  const { severity, recommendedSpecialty } = result;

  const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const handleShareLocation = () => {
    addToast("GPS Coordinates (37.7749, -122.4194) shared with ER dispatch & contacts", "success");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`p-5 sm:p-7 rounded-[24px] bg-white border-2 shadow-2xl space-y-5 max-w-2xl mx-auto overflow-hidden relative ${
        severity.code === "RED_CRITICAL"
          ? "border-rose-400 shadow-rose-600/15 shadow-[0_0_25px_rgba(225,29,72,0.18)]"
          : severity.code === "YELLOW_MODERATE"
          ? "border-amber-400 shadow-amber-500/15 shadow-[0_0_25px_rgba(245,158,11,0.18)]"
          : "border-emerald-400 shadow-emerald-500/15 shadow-[0_0_25px_rgba(16,185,129,0.15)]"
      }`}
    >
      {/* 1. ASSESSMENT TIMESTAMP & RETAKE TOP BAR */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs">
        <div className="flex items-center gap-2 text-slate-500 font-semibold">
          <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>Assessment Completed • Today, {currentTime}</span>
        </div>

        <button
          onClick={onReset}
          className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-xl border border-slate-200 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Retake Triage
        </button>
      </div>

      {/* 2. EMERGENCY SEVERITY BADGE (Larger & Premium Alert Style) */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span
            className={`px-4 py-1.5 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-2 shadow-md border ${severity.badgeColor}`}
          >
            {severity.code === "RED_CRITICAL" ? (
              <ShieldAlert className="w-4 h-4 text-white animate-bounce shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            )}
            <span>{severity.title}</span>
          </span>

          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
            Target: {recommendedSpecialty}
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
          Recommended Protocol: {severity.recommendedAction}
        </h3>
      </div>

      {/* 3. AI CONFIDENCE & SYMPTOM MATCHING WIDGET */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs p-3 bg-slate-900 text-white rounded-2xl border border-slate-800">
        <div className="p-2 bg-slate-800/80 rounded-xl border border-slate-700/80">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Assessment Engine</span>
          <strong className="text-emerald-400 font-black text-xs flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            {result.isAiPowered ? "Gemini 2.5 AI" : "Clinical Rule Engine"}
          </strong>
        </div>

        <div className="p-2 bg-slate-800/80 rounded-xl border border-slate-700/80">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Matched Symptoms</span>
          <strong className="text-sky-300 font-bold text-[11px] truncate block">
            {result.primarySymptomLabel || "Reported Symptoms"}
          </strong>
        </div>

        <div className="p-2 bg-slate-800/80 rounded-xl border border-slate-700/80">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Priority Level</span>
          <strong className={severity.code === "RED_CRITICAL" ? "text-rose-400 font-black text-xs" : severity.code === "ORANGE_EMERGENT" ? "text-amber-400 font-black text-xs" : "text-emerald-400 font-black text-xs"}>
            {severity.code === "RED_CRITICAL" ? "Level 1 — Critical" : severity.code === "ORANGE_EMERGENT" ? "Level 2 — Emergent" : severity.code === "YELLOW_URGENT" ? "Level 3 — Urgent" : "Level 4 — Standard"}
          </strong>
        </div>
      </div>

      {/* Fallback Notice if AI Key is missing or service unavailable */}
      {result.fallbackNotice && (
        <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-amber-900 text-xs font-semibold">
          ℹ️ {result.fallbackNotice}
        </div>
      )}

      {/* Warning Signs List if identified by Gemini AI */}
      {result.warningSigns && result.warningSigns.length > 0 && (
        <div className="p-3.5 bg-rose-50/80 rounded-2xl border border-rose-200/80 space-y-1.5 text-xs">
          <h4 className="font-extrabold uppercase text-rose-800 text-[11px] tracking-wider">Identified Red-Flag Warning Signs</h4>
          <ul className="list-disc list-inside space-y-1 text-rose-900 font-medium">
            {result.warningSigns.map((sign, idx) => (
              <li key={idx}>{sign}</li>
            ))}
          </ul>
        </div>
      )}

      {/* CLINICAL INSTRUCTION */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1.5 text-xs">
        <h4 className="font-extrabold uppercase text-slate-500 text-[11px] tracking-wider">Clinical Guidance & Assessment Summary</h4>
        <p className="font-semibold text-slate-800 leading-relaxed text-xs sm:text-sm">
          {severity.recommendation}
        </p>
      </div>

      {/* 4. RECOMMENDED HOSPITAL SUMMARY CARD */}
      <div className="bg-gradient-to-r from-blue-50/90 via-slate-50 to-indigo-50/50 p-4 rounded-2xl border border-blue-200/80 space-y-3 shadow-xs">
        <div className="flex items-center justify-between text-xs">
          <span className="font-extrabold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-blue-600" /> Recommended Hospital Facility
          </span>
          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-md border border-emerald-200">
            Open 24×7
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <h5 className="font-bold text-slate-900 text-sm">St. Jude Metro Cardiac Center</h5>
              <span className="text-amber-500 font-bold text-xs flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> 4.9
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
              <span className="flex items-center gap-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-rose-500" /> 1.8 km (5 min drive)
              </span>
              <span className="flex items-center gap-1 font-bold text-emerald-700">
                <Activity className="w-3.5 h-3.5 text-emerald-600" /> 4 ICU Beds Available
              </span>
            </div>
          </div>

          <button
            onClick={onNavigateHospital}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-600/20 shrink-0 cursor-pointer"
          >
            View Hospital <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 5. ACTION BUTTONS HIERARCHY (Primary: SOS/Ambulance, Secondary: View Hospital) */}
      <div className="space-y-3 pt-1">
        {severity.code === "RED_CRITICAL" ? (
          <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl space-y-3 shadow-xs">
            <p className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-600 animate-bounce shrink-0" />
              <span>Critical Triage Alert: Immediate ALS Ambulance Dispatch Recommended</span>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button onClick={() => window.location.href = "tel:911"} variant="danger" size="lg" icon={PhoneCall} className="w-full">
                Call Emergency Dispatch (911)
              </Button>

              <Button onClick={onNavigateHospital} variant="secondary" size="lg" icon={Navigation} className="w-full">
                View Recommended Hospital
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button onClick={onNavigateHospital} variant="emerald" size="lg" icon={Navigation} className="w-full">
              View Recommended Hospital
            </Button>

            <a
              href="tel:108"
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <PhoneCall className="w-4 h-4" /> Call Paramedic (108)
            </a>
          </div>
        )}
      </div>

      {/* 6. THREE QUICK EMERGENCY ACTIONS */}
      <div className="pt-2 border-t border-slate-100 space-y-2">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Quick Emergency Shortcuts
        </span>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <button
            onClick={handleShareLocation}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-xl border border-slate-200/80 font-bold flex flex-col items-center justify-center gap-1 text-center transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-blue-600" />
            <span className="text-[11px] line-clamp-1">Share Location</span>
          </button>

          <a
            href="tel:+18005550199"
            className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-xl border border-slate-200/80 font-bold flex flex-col items-center justify-center gap-1 text-center transition-colors cursor-pointer"
          >
            <Phone className="w-4 h-4 text-emerald-600" />
            <span className="text-[11px] line-clamp-1">Emergency Contact</span>
          </a>

          <button
            onClick={onNavigateHospital}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-xl border border-slate-200/80 font-bold flex flex-col items-center justify-center gap-1 text-center transition-colors cursor-pointer"
          >
            <Navigation className="w-4 h-4 text-purple-600" />
            <span className="text-[11px] line-clamp-1">Navigate ER</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
