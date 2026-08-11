import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, Sparkles, CheckCircle2, ShieldAlert } from "lucide-react";
import { TRIAGE_QUESTIONS } from "../../data/triageData";
import { Button } from "../common/Button";
import { triageService } from "../../services/triageService";

export const SymptomChecker = ({ onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isEvaluating, setIsEvaluating] = useState(false);

  const currentQuestion = TRIAGE_QUESTIONS[currentStepIndex];

  const handleSelectOption = (option) => {
    if (currentQuestion.isMultiSelect) {
      const existing = answers[currentQuestion.id] || [];
      const updated = existing.some((o) => o.label === option.label)
        ? existing.filter((o) => o.label !== option.label)
        : [...existing, option];
      setAnswers({ ...answers, [currentQuestion.id]: updated });
    } else {
      setAnswers({ ...answers, [currentQuestion.id]: option });
    }
  };

  const handleNext = async () => {
    if (currentStepIndex < TRIAGE_QUESTIONS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      // Final submission
      setIsEvaluating(true);
      try {
        const result = await triageService.evaluateTriage(answers);
        if (onComplete) onComplete(result);
      } catch (e) {
        console.error(e);
      } finally {
        setIsEvaluating(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const currentAnswer = answers[currentQuestion.id];
  const canProceed = currentQuestion.isMultiSelect
    ? Array.isArray(currentAnswer) && currentAnswer.length > 0
    : !!currentAnswer;

  return (
    <div className="bg-gradient-to-b from-white via-white to-slate-50/70 p-4.5 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xl max-w-2xl mx-auto">
      {/* 6. UPGRADED STEP PROGRESS INDICATOR (4-Step Circle Timeline) */}
      <div className="mb-6 sm:mb-8 space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <span className="flex items-center gap-1.5 text-blue-600 truncate">
            <Sparkles className="w-4 h-4 shrink-0" /> Triage Protocol
          </span>
          <span className="text-slate-700 shrink-0">
            Step <strong className="text-blue-600">{currentStepIndex + 1}</strong> of {TRIAGE_QUESTIONS.length}
          </span>
        </div>

        {/* Step Circles Row */}
        <div className="relative flex items-center justify-between px-1 sm:px-2">
          {/* Background Connecting Line */}
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-200 -z-0" />
          {/* Active Progress Line */}
          <motion.div
            className="absolute left-6 top-1/2 -translate-y-1/2 h-1 bg-blue-600 -z-0"
            initial={{ width: "0%" }}
            animate={{
              width: `${(currentStepIndex / (TRIAGE_QUESTIONS.length - 1)) * 100}%`,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ maxWidth: "calc(100% - 48px)" }}
          />

          {TRIAGE_QUESTIONS.map((q, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isActive = idx === currentStepIndex;

            return (
              <div key={q.id} className="relative z-10 flex flex-col items-center gap-1">
                <div
                  className={`w-8 sm:w-9 h-8 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                    isCompleted
                      ? "bg-emerald-500 border-2 border-emerald-500 text-white shadow-md shadow-emerald-500/20"
                      : isActive
                      ? "bg-blue-600 border-2 border-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105 sm:scale-110"
                      : "bg-white border-2 border-slate-300 text-slate-400"
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : idx + 1}
                </div>
                <span className="text-[10px] font-bold text-slate-500 hidden sm:block">
                  Step {idx + 1}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7. QUESTION CONTENT (Smooth Slide / Fade Animation) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="space-y-5"
        >
          <div>
            <h3 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight break-words">
              {currentQuestion.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 leading-relaxed">
              {currentQuestion.subtitle}
            </p>
          </div>

          {/* 5. QUESTIONNAIRE OPTIONS */}
          <div className="space-y-2.5">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = currentQuestion.isMultiSelect
                ? Array.isArray(currentAnswer) && currentAnswer.some((o) => o.label === opt.label)
                : currentAnswer?.label === opt.label;

              return (
                <div
                  key={idx}
                  onClick={() => handleSelectOption(opt)}
                  className={`p-3.5 sm:p-4 min-h-[48px] rounded-2xl border-2 transition-all duration-200 ease-out cursor-pointer flex items-center justify-between group ${
                    isSelected
                      ? "bg-blue-50/90 border-blue-600 text-blue-950 shadow-md shadow-blue-600/10"
                      : "bg-white border-slate-200/80 text-slate-700 hover:bg-blue-50/50 hover:border-blue-300 hover:shadow-sm"
                  }`}
                >
                  <span className="text-xs sm:text-sm font-bold pr-3 leading-snug break-words">{opt.label}</span>
                  <div
                    className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center border transition-all duration-200 shrink-0 ${
                      isSelected
                        ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                        : "border-slate-300 bg-white group-hover:border-blue-400"
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Footer Navigation */}
      <div className="pt-5 mt-6 border-t border-slate-100 flex items-center justify-between gap-3">
        <Button
          onClick={handleBack}
          disabled={currentStepIndex === 0 || isEvaluating}
          variant="secondary"
          size="md"
          icon={ArrowLeft}
          className="min-h-[44px] text-xs font-bold"
        >
          Back
        </Button>

        <Button
          onClick={handleNext}
          disabled={!canProceed || isEvaluating}
          variant="primary"
          size="md"
          icon={ArrowRight}
          className="min-h-[44px] text-xs font-bold"
        >
          {isEvaluating
            ? "Analyzing..."
            : currentStepIndex === TRIAGE_QUESTIONS.length - 1
            ? "Evaluate Triage"
            : "Next Step"}
        </Button>
      </div>

      {/* Loading overlay while Gemini evaluates symptoms */}
      {isEvaluating && (
        <div className="mt-6 p-6 text-center bg-blue-50/80 rounded-2xl border border-blue-200 space-y-2 animate-pulse">
          <div className="flex items-center justify-center gap-2 text-blue-700 font-bold text-sm">
            <Sparkles className="w-5 h-5 animate-spin text-blue-600" />
            <span>Analyzing symptoms...</span>
          </div>
          <p className="text-xs text-slate-600 font-medium">
            Evaluating symptom telemetry with Gemini AI to determine risk severity.
          </p>
        </div>
      )}
    </div>
  );
};
