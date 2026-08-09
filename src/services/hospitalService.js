import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { HOSPITALS_DATA } from "../data/hospitalsData";

/**
 * Service Layer for Hospital Discovery reading directly from Cloud Firestore ("hospitals" collection)
 */

let isSeeded = false;

/**
 * Seed Firestore "hospitals" collection if empty
 */
export const seedHospitalsToFirestore = async () => {
  if (isSeeded) return;

  try {
    const querySnapshot = await getDocs(collection(db, "hospitals"));
    if (querySnapshot.empty) {
      console.log("🌱 [Firestore Seeding] 'hospitals' collection is empty. Seeding realistic hospital data...");
      for (const hospital of HOSPITALS_DATA) {
        await setDoc(doc(db, "hospitals", hospital.id), hospital);
      }
      console.log("✅ [Firestore Seeding] Successfully seeded", HOSPITALS_DATA.length, "hospitals into Firestore!");
    }
    isSeeded = true;
  } catch (error) {
    console.warn("⚠️ [Firestore Seeding Notice]:", error.message);
  }
};

export const hospitalService = {
  /**
   * Fetch all hospitals from Firestore or filter with multi-select specialty & availability options
   */
  async getHospitals(filters = {}) {
    let rawHospitals = [];

    try {
      // 1. Trigger automatic seeding if Firestore collection is empty
      await seedHospitalsToFirestore();

      // 2. Fetch documents from Cloud Firestore "hospitals" collection
      const querySnapshot = await getDocs(collection(db, "hospitals"));

      if (!querySnapshot.empty) {
        rawHospitals = querySnapshot.docs.map((docSnap) => docSnap.data());
      } else {
        rawHospitals = [...HOSPITALS_DATA];
      }
    } catch (error) {
      console.warn("⚠️ [Firestore Hospital Fetch Fallback]: Reading local data due to notice:", error.message);
      rawHospitals = [...HOSPITALS_DATA];
    }

    let results = [...rawHospitals];

    // Multi-select Specialties & Category filtering
    if (filters.specialties && Array.isArray(filters.specialties) && filters.specialties.length > 0) {
      if (!filters.specialties.includes("All")) {
        results = results.filter((h) =>
          filters.specialties.some((selSpec) => {
            if (selSpec === "Multi-Speciality" || selSpec === "Multi-Specialty") {
              return h.category?.includes("Multi") || h.specialties?.length > 4;
            }
            if (selSpec === "Trauma Center" || selSpec === "Emergency") {
              return h.category === "Emergency" || h.specialties?.some((s) => s.toLowerCase().includes("trauma") || s.toLowerCase().includes("emergency"));
            }
            if (selSpec === "Children's Hospital" || selSpec === "Children's") {
              return h.category === "Children's" || h.specialties?.some((s) => s.toLowerCase().includes("pediatri"));
            }
            if (selSpec === "Cardiology") {
              return h.category === "Cardiology" || h.specialties?.some((s) => s.toLowerCase().includes("cardio") || s.toLowerCase().includes("heart"));
            }
            if (selSpec === "Neurology") {
              return h.category === "Neurology" || h.specialties?.some((s) => s.toLowerCase().includes("neuro") || s.toLowerCase().includes("brain"));
            }
            if (selSpec === "Orthopaedics" || selSpec === "Orthopedics") {
              return h.category === "Orthopaedics" || h.specialties?.some((s) => s.toLowerCase().includes("ortho") || s.toLowerCase().includes("bone"));
            }
            if (selSpec === "Maternity") {
              return h.specialties?.some((s) => s.toLowerCase().includes("maternity") || s.toLowerCase().includes("ob-gyn"));
            }
            if (selSpec === "Blood Bank") {
              return h.hasBloodBank || h.amenities?.includes("Blood Bank Onsite");
            }

            return (
              h.category?.toLowerCase().includes(selSpec.toLowerCase()) ||
              h.specialties?.some((s) => s.toLowerCase().includes(selSpec.toLowerCase()))
            );
          })
        );
      }
    } else if (filters.specialty && filters.specialty !== "All Specialties" && filters.specialty !== "All") {
      results = results.filter((h) =>
        h.category === filters.specialty ||
        h.specialties?.some((s) => s.toLowerCase().includes(filters.specialty.toLowerCase()))
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
          results = results.filter((h) => h.hasBloodBank || h.amenities?.includes("Blood Bank Onsite"));
        } else if (avail === "Ambulance Available") {
          results = results.filter((h) => h.hasAmbulanceFleet || h.amenities?.includes("Ambulance Service"));
        } else if (avail === "Accepting Patients") {
          results = results.filter((h) => h.status === "Accepting Patients" || (h.beds?.general?.available || 0) > 0);
        }
      });
    }

    // Filter by Insurance
    if (filters.insurance && filters.insurance !== "All Insurance Providers") {
      results = results.filter((h) =>
        h.insuranceAccepted?.includes(filters.insurance)
      );
    }

    // Filter by Max Distance
    if (filters.maxDistanceKm) {
      results = results.filter((h) => h.distanceKm <= filters.maxDistanceKm);
    }

    // Filter by minimum ICU Bed Availability
    if (filters.requireIcu) {
      results = results.filter((h) => (h.beds?.icu?.available || 0) > 0);
    }

    // Search Query Filtering (case-insensitive, whitespace tolerant, partial-match friendly)
    if (filters.searchQuery && filters.searchQuery.trim() !== "") {
      const rawQuery = filters.searchQuery.trim();
      const normalize = (str) =>
        (str || "")
          .toLowerCase()
          .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
          .replace(/\s+/g, " ")
          .trim();

      const normalizedQuery = normalize(rawQuery);
      const queryTokens = normalizedQuery.split(" ").filter(Boolean);

      results = results.filter((h) => {
        const hName = normalize(h.name);
        const hCategory = normalize(h.category);
        const hTagline = normalize(h.tagline);
        const hAddress = normalize(h.address);
        const hCity = normalize(h.city || h.location);
        const hTrauma = normalize(h.traumaLevel);
        const hSpecialties = (h.specialties || []).map(normalize).join(" ");
        const hAmenities = (h.amenities || []).map(normalize).join(" ");
        const hInsurance = (h.insuranceAccepted || []).map(normalize).join(" ");

        const combinedText = `${hName} ${hCategory} ${hTagline} ${hAddress} ${hCity} ${hTrauma} ${hSpecialties} ${hAmenities} ${hInsurance}`;

        // 1. Direct exact normalized substring match
        if (combinedText.includes(normalizedQuery)) {
          return true;
        }

        // 2. Token-by-token check (all query tokens must match combined text or match common medical synonyms)
        return queryTokens.every((token) => {
          if (combinedText.includes(token)) return true;

          // Common medical term aliases / synonym tolerances
          if (token === "st" && (combinedText.includes("saint") || combinedText.includes("st"))) return true;
          if (token === "saint" && (combinedText.includes("st") || combinedText.includes("st."))) return true;
          if (token === "cardiac" && combinedText.includes("cardio")) return true;
          if (token === "orthopedics" && combinedText.includes("ortho")) return true;
          if (token === "pediatric" && (combinedText.includes("children") || combinedText.includes("pediatri"))) return true;
          return false;
        });
      });

      // Calculate matchScore boost for remaining filtered hospitals
      results = results.map((h) => {
        let scoreBoost = 0;
        const q = normalizedQuery;
        if (normalize(h.name).includes(q)) scoreBoost += 30;
        if (normalize(h.category).includes(q)) scoreBoost += 25;
        if ((h.specialties || []).some((s) => normalize(s).includes(q))) scoreBoost += 25;

        const calculatedMatch = Math.min(99, Math.max(70, (h.matchScore || 85) + Math.floor(scoreBoost / 4)));
        return { ...h, matchScore: calculatedMatch };
      });
    }

    // Sorting options
    const sortBy = filters.sortBy || "nearest";
    if (sortBy === "nearest" || sortBy === "distance") {
      results.sort((a, b) => a.distanceKm - b.distanceKm);
    } else if (sortBy === "fastestResponse" || sortBy === "fastest" || sortBy === "lowestWaiting" || sortBy === "waitTime") {
      results.sort((a, b) => a.erWaitTimeMin - b.erWaitTimeMin);
    } else if (sortBy === "highestRated" || sortBy === "rating") {
      results.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "mostIcuBeds" || sortBy === "icuBeds") {
      results.sort((a, b) => (b.beds?.icu?.available || 0) - (a.beds?.icu?.available || 0));
    } else if (sortBy === "aiMatch") {
      results.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    }

    return results;
  },

  /**
   * Fetch single hospital by ID from Cloud Firestore
   */
  async getHospitalById(id) {
    try {
      const docRef = doc(db, "hospitals", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      }
    } catch (error) {
      console.warn("⚠️ [Firestore Hospital By ID Notice]: Reading local data:", error.message);
    }

    return HOSPITALS_DATA.find((h) => h.id === id) || null;
  },
};
