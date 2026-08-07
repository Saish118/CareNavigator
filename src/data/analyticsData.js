// Mock Data for Regional Healthcare Analytics & ICU Capacity Dashboard

export const ICU_OCCUPANCY_TRENDS = [
  { time: "00:00", totalOccupancy: 78, icuAvailable: 22, ventilatorDemand: 18 },
  { time: "03:00", totalOccupancy: 82, icuAvailable: 18, ventilatorDemand: 20 },
  { time: "06:00", totalOccupancy: 75, icuAvailable: 25, ventilatorDemand: 15 },
  { time: "09:00", totalOccupancy: 88, icuAvailable: 12, ventilatorDemand: 24 },
  { time: "12:00", totalOccupancy: 94, icuAvailable: 6, ventilatorDemand: 28 },
  { time: "15:00", totalOccupancy: 91, icuAvailable: 9, ventilatorDemand: 26 },
  { time: "18:00", totalOccupancy: 89, icuAvailable: 11, ventilatorDemand: 23 },
  { time: "21:00", totalOccupancy: 83, icuAvailable: 17, ventilatorDemand: 19 },
];

export const ER_ARRIVALS_BY_SPECIALTY = [
  { category: "Cardiac & Chest", count: 142, avgWaitMin: 4 },
  { category: "Trauma & Fractures", count: 98, avgWaitMin: 6 },
  { category: "Stroke & Neuro", count: 76, avgWaitMin: 5 },
  { category: "Pediatric Emergency", count: 110, avgWaitMin: 10 },
  { category: "Respiratory / Oxygen", count: 130, avgWaitMin: 8 },
  { category: "General Triage", count: 190, avgWaitMin: 14 },
];

export const SPECIALTY_DEMAND_DISTRIBUTION = [
  { name: "Cardiology", value: 32, color: "#0284c7" },
  { name: "Trauma & Surgery", value: 24, color: "#e11d48" },
  { name: "Neurology", value: 18, color: "#8b5cf6" },
  { name: "Pediatrics", value: 14, color: "#10b981" },
  { name: "Pulmonology", value: 12, color: "#f59e0b" },
];

export const BLOOD_BANK_INVENTORY = [
  { group: "O- (Universal)", units: 14, status: "Critical Shortage", minThreshold: 25 },
  { group: "O+", units: 62, status: "Optimal", minThreshold: 40 },
  { group: "A-", units: 18, status: "Low Supply", minThreshold: 20 },
  { group: "A+", units: 85, status: "Optimal", minThreshold: 50 },
  { group: "B-", units: 22, status: "Moderate", minThreshold: 20 },
  { group: "B+", units: 54, status: "Optimal", minThreshold: 35 },
  { group: "AB-", units: 8, status: "Critical Shortage", minThreshold: 15 },
  { group: "AB+", units: 31, status: "Optimal", minThreshold: 25 },
];

export const REGIONAL_METRICS = {
  totalHospitalsTracked: 18,
  activeAmbulancesDispatched: 34,
  avgRegionalResponseTimeMin: 7.4,
  totalAvailableIcuBeds: 35,
  totalAvailableVentilators: 23,
  systemStatus: "Operational - Normal Triage Level",
};
