import { TRIAGE_SEVERITY_LEVELS } from "../data/triageData";
import { geminiService } from "./geminiService";

/**
 * Service for AI Symptom Triage Evaluation with Gemini AI integration and fallback
 */
export const triageService = {
  /**
   * Evaluates user questionnaire responses via Gemini AI, falling back to deterministic rules if AI is unavailable.
   */
  async evaluateTriage(formData) {
    let aiResult = null;
    let isAiPowered = false;
    let fallbackNotice = null;

    try {
      console.log("🤖 [Triage Service] Initiating Gemini AI symptom assessment...");
      aiResult = await geminiService.evaluateSymptomsWithGemini(formData);
      isAiPowered = true;
      console.log("✅ [Triage Service] Gemini AI assessment successful:", aiResult);
    } catch (error) {
      console.warn("⚠️ [Triage Service Gemini Notice]:", error.message, "- Falling back to deterministic triage algorithm.");
      fallbackNotice = "Evaluated via Clinical Protocol Engine (AI unavailable or key unconfigured).";
    }

    // Deterministic Calculation for score & baseline
    let totalScore = 0;
    if (formData.primarySymptom) {
      totalScore += formData.primarySymptom.severityWeight || 3;
    }
    if (formData.onsetDuration) {
      totalScore += formData.onsetDuration.weight || 2;
    }
    if (formData.vitalSigns && Array.isArray(formData.vitalSigns)) {
      formData.vitalSigns.forEach((sign) => {
        totalScore += sign.score || 0;
      });
    }
    if (formData.patientAgeGroup) {
      if (formData.patientAgeGroup.ageCode === "INFANT" || formData.patientAgeGroup.ageCode === "SENIOR") {
        totalScore += 2;
      }
    }

    // Determine Severity Level
    let severityLevel;

    if (isAiPowered && aiResult) {
      if (aiResult.severity === "emergency" || aiResult.emergency === true) {
        severityLevel = totalScore >= 10 ? TRIAGE_SEVERITY_LEVELS.LEVEL_1 : TRIAGE_SEVERITY_LEVELS.LEVEL_2;
      } else if (aiResult.severity === "urgent") {
        severityLevel = TRIAGE_SEVERITY_LEVELS.LEVEL_3;
      } else {
        severityLevel = TRIAGE_SEVERITY_LEVELS.LEVEL_4;
      }
    } else {
      if (totalScore >= 10) {
        severityLevel = TRIAGE_SEVERITY_LEVELS.LEVEL_1;
      } else if (totalScore >= 7) {
        severityLevel = TRIAGE_SEVERITY_LEVELS.LEVEL_2;
      } else if (totalScore >= 4) {
        severityLevel = TRIAGE_SEVERITY_LEVELS.LEVEL_3;
      } else {
        severityLevel = TRIAGE_SEVERITY_LEVELS.LEVEL_4;
      }
    }

    // Custom clinical recommendation override if Gemini summary is present
    const customRecommendation = aiResult?.summary
      ? `${aiResult.summary} ${aiResult.recommendedAction ? `Recommended Action: ${aiResult.recommendedAction}` : ""}`
      : severityLevel.recommendation;

    const recommendedSpecialty = aiResult?.targetSpecialty || formData.primarySymptom?.category || "Emergency Medicine";

    return {
      score: totalScore,
      severity: {
        ...severityLevel,
        recommendation: customRecommendation,
        recommendedAction: aiResult?.recommendedAction || severityLevel.recommendedAction,
      },
      evaluatedAt: new Date().toISOString(),
      recommendedSpecialty: recommendedSpecialty,
      primarySymptomLabel: formData.primarySymptom?.label || "Reported Symptoms",
      warningSigns: aiResult?.warningSigns || [],
      isAiPowered: isAiPowered,
      fallbackNotice: fallbackNotice,
    };
  },
};
