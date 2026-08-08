import { HOSPITALS_DATA } from "../data/hospitalsData";

/**
 * Decoupled Service Layer for Hospital Discovery & Telemetry Search
 */

export const hospitalService = {
  /**
   * Fetch all hospitals or filter with multi-select specialty & availability options
   */
  async getHospitals(filters = {}) {
    // Simulate network delay for realistic async loading
    await new Promise((res) => setTimeout(res, 200));

    let results = [...HOSPITALS_DATA];

    // Multi-select Specialties filtering
    if (filters.specialties && Array.isArray(filters.specialties) && filters.specialties.length > 0) {
      if (!filters.specialties.includes("All")) {
        results = results.filter((h) =>
          filters.specialties.some((selSpec) => {
            if (selSpec === "Multi-Speciality") return h.category?.includes("Multi") || h.specialties.length > 4;
            if (selSpec === "Trauma Center") return h.specialties.some((s) => s.toLowerCase().includes("trauma")) || h.category?.includes("Trauma");
            if (selSpec === "Children's Hospital") return h.specialties.some((s) => s.toLowerCase().includes("pediatri"));
            if (selSpec === "Maternity") return h.specialties.some((s) => s.toLowerCase().includes("maternity") || s.toLowerCase().includes("ob-gyn"));
            if (selSpec === "Blood Bank") return h.hasBloodBank || h.amenities?.includes("Blood Bank");
            if (selSpec === "Eye Hospital") return h.specialties.some((s) => s.toLowerCase().includes("ophthalmology") || s.toLowerCase().includes("eye"));

            return h.specialties.some((s) => s.toLowerCase().includes(selSpec.toLowerCase()));
          })
        );
      }
    } else if (filters.specialty && filters.specialty !== "All Specialties" && filters.specialty !== "All") {
      results = results.filter((h) =>
        h.specialties.some((s) => s.toLowerCase().includes(filters.specialty.toLowerCase()))
      );
    }

    // Availability Filter Chips
    if (filters.availabilityFilters && Array.isArray(filters.availabilityFilters) && filters.availabilityFilters.length > 0) {
      filters.availabilityFilters.forEach((avail) => {
        if (avail === "Open Now" || avail === "Emergency 24×7") {
          results = results.filter((h) => h.isOpen247 || h.emergencyReady);
        } else if (avail === "ICU Available") {
          results = results.filter((h) => (h.beds?.icu?.available || 0) > 0);
        } else if (avail === "Ventilator Available") {
          results = results.filter((h) => (h.telemetry?.ventilatorsAvailable || 0) > 0 || (h.beds?.icu?.available || 0) > 2);
        } else if (avail === "Blood Bank") {
          results = results.filter((h) => h.hasBloodBank || h.amenities?.includes("Blood Bank"));
        } else if (avail === "Ambulance Available") {
          results = results.filter((h) => h.hasAmbulanceFleet || h.amenities?.includes("Ambulance Service"));
        } else if (avail === "Accepting Patients") {
          results = results.filter((h) => h.status === "Accepting Patients" || h.beds?.general?.available > 0);
        }
      });
    }

    // Filter by Insurance
    if (filters.insurance && filters.insurance !== "All Insurance Providers") {
      results = results.filter((h) =>
        h.insuranceAccepted.includes(filters.insurance)
      );
    }

    // Filter by Max Distance
    if (filters.maxDistanceKm) {
      results = results.filter((h) => h.distanceKm <= filters.maxDistanceKm);
    }

    // Filter by minimum ICU Bed Availability
    if (filters.requireIcu) {
      results = results.filter((h) => h.beds.icu.available > 0);
    }

    // AI Natural Language Search query match algorithm
    if (filters.searchQuery && filters.searchQuery.trim() !== "") {
      const q = filters.searchQuery.toLowerCase();
      results = results.map((h) => {
        let scoreBoost = 0;
        if (h.name.toLowerCase().includes(q)) scoreBoost += 20;
        if (h.specialties.some((s) => s.toLowerCase().includes(q))) scoreBoost += 30;
        if (h.tagline?.toLowerCase().includes(q)) scoreBoost += 15;
        if (q.includes("icu") && h.beds.icu.available > 0) scoreBoost += 25;
        if (q.includes("pediatric") && h.specialties.includes("Pediatrics")) scoreBoost += 30;
        if (q.includes("cardiac") || q.includes("heart") || q.includes("chest")) {
          if (h.specialties.includes("Cardiology")) scoreBoost += 35;
        }

        const calculatedMatch = Math.min(99, Math.max(70, h.matchScore + Math.floor(scoreBoost / 4)));
        return { ...h, matchScore: calculatedMatch };
      });
    }

    // Sorting options
    const sortBy = filters.sortBy || "aiMatch";
    if (sortBy === "nearest" || sortBy === "distance") {
      results.sort((a, b) => a.distanceKm - b.distanceKm);
    } else if (sortBy === "fastestResponse" || sortBy === "fastest" || sortBy === "lowestWaiting" || sortBy === "waitTime") {
      results.sort((a, b) => a.erWaitTimeMin - b.erWaitTimeMin);
    } else if (sortBy === "highestRated" || sortBy === "rating") {
      results.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "mostIcuBeds" || sortBy === "icuBeds") {
      results.sort((a, b) => (b.beds?.icu?.available || 0) - (a.beds?.icu?.available || 0));
    } else if (sortBy === "aiMatch") {
      results.sort((a, b) => b.matchScore - a.matchScore);
    }

    return results;
  },

  /**
   * Fetch single hospital by ID
   */
  async getHospitalById(id) {
    await new Promise((res) => setTimeout(res, 150));
    const hosp = HOSPITALS_DATA.find((h) => h.id === id);
    if (!hosp) throw new Error("Hospital not found");
    return hosp;
  },
};
