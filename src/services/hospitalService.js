import { HOSPITALS_DATA } from "../data/hospitalsData";

/**
 * Decoupled Service Layer for Hospital Discovery & AI Recommendation
 * Designed for easy backend API replacement in the future.
 */

export const hospitalService = {
  /**
   * Fetch all hospitals or filter with AI search parameters
   */
  async getHospitals(filters = {}) {
    // Simulate network delay for realistic async loading
    await new Promise((res) => setTimeout(res, 350));

    let results = [...HOSPITALS_DATA];

    // Filter by Specialty
    if (filters.specialty && filters.specialty !== "All Specialties") {
      results = results.filter((h) =>
        h.specialties.some((s) => s.toLowerCase().includes(filters.specialty.toLowerCase()))
      );
    }

    // Filter by Insurance
    if (filters.insurance && filters.insurance !== "All Insurance Providers") {
      results = results.filter((h) =>
        h.insuranceAccepted.includes(filters.insurance)
      );
    }

    // Filter by Required Amenity
    if (filters.amenity) {
      results = results.filter((h) => h.amenities.includes(filters.amenity));
    }

    // Filter by Max Distance
    if (filters.maxDistanceKm) {
      results = results.filter((h) => h.distanceKm <= filters.maxDistanceKm);
    }

    // Filter by minimum ICU Bed Availability
    if (filters.requireIcu) {
      results = results.filter((h) => h.beds.icu.available > 0);
    }

    // Filter by Heliport requirement
    if (filters.requireHeliport) {
      results = results.filter((h) => h.heliport === true);
    }

    // AI Natural Language Search query match algorithm
    if (filters.searchQuery && filters.searchQuery.trim() !== "") {
      const q = filters.searchQuery.toLowerCase();
      results = results.map((h) => {
        let scoreBoost = 0;
        if (h.name.toLowerCase().includes(q)) scoreBoost += 20;
        if (h.specialties.some((s) => s.toLowerCase().includes(q))) scoreBoost += 30;
        if (h.tagline.toLowerCase().includes(q)) scoreBoost += 15;
        if (q.includes("icu") && h.beds.icu.available > 0) scoreBoost += 25;
        if (q.includes("pediatric") && h.specialties.includes("Pediatrics")) scoreBoost += 30;
        if (q.includes("cardiac") || q.includes("heart") || q.includes("chest")) {
          if (h.specialties.includes("Cardiology")) scoreBoost += 35;
        }
        if (q.includes("stroke") || q.includes("brain")) {
          if (h.specialties.includes("Neurology & Stroke")) scoreBoost += 35;
        }

        const calculatedMatch = Math.min(99, Math.max(70, h.matchScore + Math.floor(scoreBoost / 4)));
        return { ...h, matchScore: calculatedMatch };
      });
    }

    // Sort by criteria
    const sortBy = filters.sortBy || "aiMatch";
    if (sortBy === "aiMatch") {
      results.sort((a, b) => b.matchScore - a.matchScore);
    } else if (sortBy === "distance") {
      results.sort((a, b) => a.distanceKm - b.distanceKm);
    } else if (sortBy === "waitTime") {
      results.sort((a, b) => a.erWaitTimeMin - b.erWaitTimeMin);
    } else if (sortBy === "icuBeds") {
      results.sort((a, b) => b.beds.icu.available - a.beds.icu.available);
    } else if (sortBy === "rating") {
      results.sort((a, b) => b.rating - a.rating);
    }

    return results;
  },

  /**
   * Fetch single hospital by ID
   */
  async getHospitalById(id) {
    await new Promise((res) => setTimeout(res, 200));
    const hosp = HOSPITALS_DATA.find((h) => h.id === id);
    if (!hosp) throw new Error("Hospital not found");
    return hosp;
  },
};
