// Emergency Helplines and Dispatch Hotline Directory

export const EMERGENCY_HOTLINES = [
  { name: "National Emergency Dispatch", number: "911 / 108", description: "Immediate Police, Ambulance, & Fire response", primary: true },
  { name: "Cardiac & Stroke Rapid Response", number: "1-800-HEART-ER", description: "Direct line to regional interventional cardiology units" },
  { name: "National Poison Control Center", number: "1-800-222-1222", description: "24/7 toxicologist consultation helpline" },
  { name: "Pediatric Emergency Hotline", number: "1-800-KIDS-EMERGENCY", description: "Specialized pediatric triage & transport" },
];

export const MOCK_AMBULANCES = [
  { id: "AMB-101", type: "ALS (Advanced Life Support)", status: "En Route to Patient", etaMin: 4, driver: "Officer Ray Miller", paramedic: "Sarah Connor, RN" },
  { id: "AMB-204", type: "Cardiac Care Mobile Unit", status: "Available - Stationed Sector 4", etaMin: 7, driver: "Tom Vance", paramedic: "David Kim, EMT" },
  { id: "AMB-309", type: "Pediatric Transport Unit", status: "Available - Stationed Sector 2", etaMin: 9, driver: "Lisa Wong", paramedic: "James Ford, EMT" },
];
