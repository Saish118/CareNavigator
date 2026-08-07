import React from "react";
import { motion } from "framer-motion";
import { ShieldAlert, CheckCircle2, PhoneCall, Navigation, RotateCcw, BedDouble } from "lucide-react";
import { Button } from "../common/Button";
import { useEmergency } from "../../context/EmergencyContext";

export const TriageResult = ({ result, onReset, onNavigateHospital }) => {
  const { triggerSos } = useEmergency();

  if (!result) return null;

  const { severity, recommendedSpecialty, score } = result;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`p-6 sm:p-8 rounded-3xl bg-white border-2 shadow-2xl space-y-6 max-w-2xl mx-auto ${severity.borderColor}`}
    >
      {/* Header Severity Badge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className={`px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${severity.badgeColor}`}>
            {severity.title}
          </span>
          <h3 className="text-2xl font-black text-slate-900 mt-2">
            Recommended Protocol: {severity.recommendedAction}
          </h3>
        </div>

        <button
          onClick={onReset}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Retake Triage
        </button>
      </div>

      {/* Protocol Description Card */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
        <h4 className="text-xs font-extrabold uppercase text-slate-500">Clinical Instruction</h4>
        <p className="text-sm font-semibold text-slate-800 leading-relaxed">
          {severity.recommendation}
        </p>
        <div className="pt-2 flex items-center gap-2 text-xs font-bold text-sky-700">
          <span>Target Specialty Required:</span>
          <span className="bg-sky-100 px-2.5 py-0.5 rounded-lg border border-sky-200">
            {recommendedSpecialty}
          </span>
        </div>
      </div>

      {/* Direct Action triggers */}
      <div className="space-y-3 pt-2">
        {severity.code === "RED_CRITICAL" ? (
          <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl space-y-3">
            <p className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-600 animate-bounce" />
              Critical Triage Alert: Immediate ALS Ambulance Dispatch Recommended
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={triggerSos} variant="sos" size="lg" icon={PhoneCall} className="w-full">
                DISPATCH SOS & CALL 911
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={onNavigateHospital}
              variant="emerald"
              size="lg"
              icon={Navigation}
              className="w-full"
            >
              Find & Navigate to Best Recommended ER
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
};
