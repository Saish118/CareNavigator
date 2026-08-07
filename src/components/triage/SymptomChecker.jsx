import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, Sparkles, AlertCircle, ShieldAlert } from "lucide-react";
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
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xl max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-6 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <span className="flex items-center gap-1.5 text-sky-600">
            <Sparkles className="w-4 h-4" /> AI Emergency Triage Protocol
          </span>
          <span>
            Step {currentStepIndex + 1} of {TRIAGE_QUESTIONS.length}
          </span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentStepIndex + 1) / TRIAGE_QUESTIONS.length) * 100}%` }}
            className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full"
          />
        </div>
      </div>

      {/* Question Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {currentQuestion.title}
            </h3>
            <p className="text-xs text-slate-500 mt-1">{currentQuestion.subtitle}</p>
          </div>

          {/* Options Grid */}
          <div className="space-y-3">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = currentQuestion.isMultiSelect
                ? Array.isArray(currentAnswer) && currentAnswer.some((o) => o.label === opt.label)
                : currentAnswer?.label === opt.label;

              return (
                <div
                  key={idx}
                  onClick={() => handleSelectOption(opt)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? "bg-sky-50/80 border-sky-600 text-sky-950 shadow-sm"
                      : "bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100 hover:border-slate-300"
                  }`}
                >
                  <span className="text-sm font-semibold pr-4">{opt.label}</span>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                      isSelected
                        ? "bg-sky-600 border-sky-600 text-white"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4" />}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Footer Navigation */}
      <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
        <Button
          onClick={handleBack}
          disabled={currentStepIndex === 0 || isEvaluating}
          variant="secondary"
          size="md"
          icon={ArrowLeft}
        >
          Back
        </Button>

        <Button
          onClick={handleNext}
          disabled={!canProceed || isEvaluating}
          variant="primary"
          size="md"
          icon={ArrowRight}
        >
          {isEvaluating
            ? "Analyzing Triage..."
            : currentStepIndex === TRIAGE_QUESTIONS.length - 1
            ? "Generate AI Triage Result"
            : "Next Step"}
        </Button>
      </div>
    </div>
  );
};
