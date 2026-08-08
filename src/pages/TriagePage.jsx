import React, { useState } from "react";
import { Flame, Activity, Stethoscope } from "lucide-react";
import { SymptomChecker } from "../components/triage/SymptomChecker";
import { TriageResult } from "../components/triage/TriageResult";
import { useNavigate } from "react-router-dom";

export const TriagePage = () => {
  const navigate = useNavigate();
  const [triageResult, setTriageResult] = useState(null);

  const handleTriageComplete = (result) => {
    setTriageResult(result);
  };

  const handleReset = () => {
    setTriageResult(null);
  };

  const handleNavigateRecommended = () => {
    if (triageResult?.recommendedSpecialty) {
      navigate(`/recommendations?q=${encodeURIComponent(triageResult.recommendedSpecialty)}`);
    } else {
      navigate("/recommendations");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6 sm:space-y-7">
      {/* 1. HERO SECTION (Height reduced 20-25% with subtle 2-3% medical ECG background) */}
      <div className="text-center max-w-3xl mx-auto space-y-2.5 relative pt-2 pb-1 overflow-hidden">
        {/* Medical-themed SVG ECG Waveform background at 2-3% opacity */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] -z-10">
          <svg className="w-full h-32 text-slate-900" viewBox="0 0 500 150" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M 0 75 L 120 75 L 135 40 L 150 110 L 170 10 L 190 130 L 205 75 L 230 75 M 270 75 L 390 75 L 405 40 L 420 110 L 440 10 L 460 130 L 475 75 L 500 75" />
          </svg>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-900 text-xs font-black rounded-full border border-amber-200/80 shadow-xs">
          <Stethoscope className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>Search by Symptoms Engine</span>
        </div>

        {/* Main Heading (+8-10% size boost) */}
        <h1 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-black text-slate-900 tracking-tight leading-tight">
          Search by Symptoms & Hospital Discovery
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xl mx-auto leading-relaxed">
          Answer a 4-step emergency symptom questionnaire to receive immediate severity guidance and hospital direction.
        </p>
      </div>

      {/* 2. QUESTIONNAIRE CONTAINER (Brought higher on page) */}
      {!triageResult ? (
        <SymptomChecker onComplete={handleTriageComplete} />
      ) : (
        <TriageResult
          result={triageResult}
          onReset={handleReset}
          onNavigateHospital={handleNavigateRecommended}
        />
      )}
    </div>
  );
};
