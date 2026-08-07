import { TRIAGE_SEVERITY_LEVELS } from "../data/triageData";

/**
 * Service simulator for AI Symptom Triage Evaluation
 */

export const triageService = {
  /**
   * Evaluates user responses to calculate Triage Level
   */
  async evaluateTriage(formData) {
    await new Promise((res) => setTimeout(res, 500));

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
        totalScore += 2; // Priority bump for vulnerable groups
      }
    }

    let severityLevel;
    if (totalScore >= 10) {
      severityLevel = TRIAGE_SEVERITY_LEVELS.LEVEL_1;
    } else if (totalScore >= 7) {
      severityLevel = TRIAGE_SEVERITY_LEVELS.LEVEL_2;
    } else if (totalScore >= 4) {
      severityLevel = TRIAGE_SEVERITY_LEVELS.LEVEL_3;
    } else {
      severityLevel = TRIAGE_SEVERITY_LEVELS.LEVEL_4;
    }

    return {
      score: totalScore,
      severity: severityLevel,
      evaluatedAt: new Date().toISOString(),
      recommendedSpecialty: formData.primarySymptom?.category || "Emergency Medicine",
    };
  },
};
