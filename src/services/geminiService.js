import { GoogleGenAI, Type } from "@google/genai";

/**
 * Gemini AI Triage Service
 * Integrates Google Gemini AI (@google/genai) for intelligent symptom evaluation.
 */

const getApiKey = () => {
  return (
    import.meta.env.VITE_GEMINI_API_KEY ||
    import.meta.env.GEMINI_API_KEY ||
    ""
  );
};

export const geminiService = {
  /**
   * Evaluates patient symptoms using Gemini AI model.
   * Returns a structured triage object or throws an error if unavailable/unconfigured.
   */
  async evaluateSymptomsWithGemini(answers) {
    const apiKey = getApiKey();

    if (!apiKey || apiKey.trim() === "") {
      throw new Error("VITE_GEMINI_API_KEY is not configured in environment variables.");
    }

    const ai = new GoogleGenAI({ apiKey: apiKey.trim() });

    // Format structured summary of patient selections
    const primarySymptom = answers.primarySymptom?.label || "Not specified";
    const onsetDuration = answers.onsetDuration?.label || "Not specified";
    const patientAgeGroup = answers.patientAgeGroup?.label || "Not specified";
    const vitalSignsList = Array.isArray(answers.vitalSigns)
      ? answers.vitalSigns.map((v) => v.label).join(", ")
      : "None selected";

    const promptText = `
You are a clinical emergency triage assistant for mediNAV.
Evaluate the following patient symptom report:

- Main Symptom: ${primarySymptom}
- Onset Timing: ${onsetDuration}
- Critical Red-Flag Signs: ${vitalSignsList}
- Patient Age Group: ${patientAgeGroup}

INSTRUCTIONS:
1. Do NOT claim to diagnose the patient. Provide emergency triage risk assessment guidance only.
2. If symptoms indicate a life-threatening emergency (e.g. chest pain, severe shortness of breath, sudden numbness/facial droop, loss of consciousness, stroke/cardiac signs), set "emergency" to true and "severity" to "emergency".
3. For urgent but non-life-threatening conditions, set "severity" to "urgent" and "emergency" to false.
4. For non-urgent symptoms, set "severity" to "non_urgent" and "emergency" to false.
5. Return STRICT JSON conforming to the schema.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: promptText,
      config: {
        systemInstruction: "You are a clinical emergency triage assistant. Provide strict JSON triage assessment guidance only. Do NOT provide a medical diagnosis.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            severity: {
              type: Type.STRING,
              enum: ["emergency", "urgent", "non_urgent"],
              description: "Triage classification: 'emergency', 'urgent', or 'non_urgent'.",
            },
            emergency: {
              type: Type.BOOLEAN,
              description: "True if symptoms indicate a possible life-threatening emergency.",
            },
            summary: {
              type: Type.STRING,
              description: "Concise clinical triage summary explaining the symptom assessment.",
            },
            warningSigns: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Key red flag symptoms identified.",
            },
            recommendedAction: {
              type: Type.STRING,
              description: "Immediate action guidance (e.g. 'CALL 911 IMMEDIATELY', 'IMMEDIATE ER VISIT', 'RESERVE BED & NAVIGATE').",
            },
            targetSpecialty: {
              type: Type.STRING,
              description: "Recommended medical specialty (e.g. Cardiology, Neurology, Pulmonology, Trauma Surgery, Pediatrics, General Emergency).",
            },
          },
          required: ["severity", "emergency", "summary", "warningSigns", "recommendedAction", "targetSpecialty"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response returned from Gemini API.");
    }

    const data = JSON.parse(text);
    return data;
  },
};
