// Mock Data for AI Symptom Checker & Emergency Triage Evaluation

export const TRIAGE_QUESTIONS = [
  {
    id: "primarySymptom",
    title: "What is the main emergency or primary symptom?",
    subtitle: "Select the primary condition affecting the patient right now.",
    options: [
      { label: "Chest Pain / Heart Palpitations / Severe Pressure", category: "Cardiology", severityWeight: 4 },
      { label: "Difficulty Breathing / Severe Shortness of Breath", category: "Pulmonology", severityWeight: 4 },
      { label: "Numbness / Facial Droop / Sudden Speech Impairment", category: "Neurology", severityWeight: 5 },
      { label: "Severe Physical Injury / Profuse Bleeding / Bone Fracture", category: "Trauma Surgery", severityWeight: 4 },
      { label: "High Fever / Seizure in Infant or Child", category: "Pediatrics", severityWeight: 3 },
      { label: "Severe Abdominal Pain / Sudden Vomiting", category: "General Emergency", severityWeight: 2 },
    ],
  },
  {
    id: "onsetDuration",
    title: "How quickly did symptoms start?",
    subtitle: "Understanding timing helps determine emergency urgency level.",
    options: [
      { label: "Sudden onset within the last 15-30 minutes", weight: 3 },
      { label: "Gradual worsening over 1 to 4 hours", weight: 2 },
      { label: "Persistent over 24+ hours", weight: 1 },
    ],
  },
  {
    id: "vitalSigns",
    title: "Are any of these critical red-flag signs present?",
    subtitle: "Check all that apply to the patient.",
    isMultiSelect: true,
    options: [
      { label: "Loss of consciousness or fainting", score: 4 },
      { label: "Cold sweat, pale skin, or bluish lips", score: 3 },
      { label: "Inability to speak in full sentences due to breathlessness", score: 3 },
      { label: "Confusion or memory loss", score: 3 },
      { label: "None of the above", score: 0 },
    ],
  },
  {
    id: "patientAgeGroup",
    title: "Patient Age Group",
    subtitle: "Age plays a key factor in triage prioritization.",
    options: [
      { label: "Infant (0-2 years)", ageCode: "INFANT" },
      { label: "Child (3-12 years)", ageCode: "CHILD" },
      { label: "Adult (13-64 years)", ageCode: "ADULT" },
      { label: "Senior (65+ years)", ageCode: "SENIOR" },
    ],
  },
];

export const TRIAGE_SEVERITY_LEVELS = {
  LEVEL_1: {
    code: "RED_CRITICAL",
    title: "Level 1: IMMEDIATE RESUSCITATION NEEDED",
    badgeColor: "bg-rose-500 text-white animate-pulse",
    borderColor: "border-rose-500",
    recommendation: "CALL 911 / 108 IMMEDIATELY! Do not drive yourself. Request an Advanced Life Support (ALS) Ambulance with Cardiac/Ventilator equipment.",
    targetSpecialty: "Cardiology / Level 1 Trauma ICU",
    recommendedAction: "DIRECT EMERGENCY DISPATCH",
  },
  LEVEL_2: {
    code: "ORANGE_EMERGENT",
    title: "Level 2: EMERGENT (Care needed within 15 mins)",
    badgeColor: "bg-amber-500 text-white",
    borderColor: "border-amber-500",
    recommendation: "High Priority Emergency. Head immediately to the nearest recommended Trauma or Specialty ER.",
    targetSpecialty: "Emergency Medicine / ICU",
    recommendedAction: "IMMEDIATE ER VISIT",
  },
  LEVEL_3: {
    code: "YELLOW_URGENT",
    title: "Level 3: URGENT CARE NEEDED",
    badgeColor: "bg-yellow-500 text-slate-900",
    borderColor: "border-yellow-400",
    recommendation: "Patient requires urgent medical evaluation within 30-60 minutes.",
    targetSpecialty: "General Emergency / Fast-Track ER",
    recommendedAction: "RESERVE BED & NAVIGATE",
  },
  LEVEL_4: {
    code: "GREEN_STANDARD",
    title: "Level 4: STANDARD ER / URGENT CARE",
    badgeColor: "bg-emerald-500 text-white",
    borderColor: "border-emerald-500",
    recommendation: "Stable condition. Visit local Urgent Care Center or schedule fast-track outpatient ER admission.",
    targetSpecialty: "Urgent Care",
    recommendedAction: "SCHEDULE / VISIT URGENT CARE",
  },
};
