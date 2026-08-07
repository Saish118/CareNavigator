import React, { useState } from "react";
import { Flame, Sparkles } from "lucide-react";
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-black rounded-full border border-amber-200">
          <Flame className="w-4 h-4 text-amber-600" /> AI Triage Protocol Engine
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          AI Symptom Checker & Emergency Triage
        </h1>
        <p className="text-sm text-slate-600 font-medium">
          Answer a 4-step emergency triage questionnaire to receive immediate severity scoring and clinical direction.
        </p>
      </div>

      {/* Main Container */}
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
