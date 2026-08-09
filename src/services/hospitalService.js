import { collection, getDocs, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { HOSPITALS_DATA } from "../data/hospitalsData";

/**
 * Haversine formula to compute exact great-circle distance between two geographic points in kilometers.
 */
export const calculateHaversineDistanceKm = (lat1, lon1, lat2, lon2) => {
  if (
    lat1 == null ||
    lon1 == null ||
    lat2 == null ||
    lon2 == null ||
    isNaN(lat1) ||
    isNaN(lon1) ||
    isNaN(lat2) ||
    isNaN(lon2)
  ) {
    return null;
  }

  const R = 6371; // Earth's mean radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Round to 1 decimal place (e.g. 12.4 km)
};

/**
 * Service Layer for Hospital Discovery reading directly from Cloud Firestore ("hospitals" collection)
 */

let isSeeded = false;

/**
 * Seed Firestore "hospitals" collection with official Government of Maharashtra Empanelled Hospitals
 */
export const seedHospitalsToFirestore = async () => {
  if (isSeeded) return;

  try {
    const querySnapshot = await getDocs(collection(db, "hospitals"));

    // Check if Firestore has old dummy docs (hsp-) or old 36 DMER docs (dmer-mh-) or count < 150
    const hasOldDocs = querySnapshot.docs.some(
      (docSnap) => docSnap.id.startsWith("hsp-") || docSnap.id.startsWith("dmer-mh-")
    );

    if (querySnapshot.empty || hasOldDocs || querySnapshot.size < 150) {
      console.log(
        "🌱 [Firestore Seeding] Seeding 150 official Government of Maharashtra Empanelled Hospitals dataset..."
      );

      // Clean up old hospital records from Firestore
      for (const docSnap of querySnapshot.docs) {
        if (docSnap.id.startsWith("hsp-") || docSnap.id.startsWith("dmer-mh-")) {
          await deleteDoc(doc(db, "hospitals", docSnap.id));
        }
      }

      // Seed official 150 Maharashtra Empanelled Hospitals
      for (const hospital of HOSPITALS_DATA) {
        await setDoc(doc(db, "hospitals", hospital.id), hospital);
      }
      console.log(
        "✅ [Firestore Seeding] Successfully seeded",
        HOSPITALS_DATA.length,
        "Government of Maharashtra Empanelled Hospitals into Firestore!"
      );
    }
    isSeeded = true;
  } catch (error) {
    console.warn("⚠️ [Firestore Seeding Notice]:", error.message);
  }
};

/**
 * Centralized Single Specialty Matcher used by both Top Category Chips and Sidebar Medical Specialty Filter
 */
export const matchesSingleSpecialty = (h, selSpec) => {
  if (!selSpec || selSpec === "All" || selSpec === "All Specialties") return true;

  const specLower = selSpec.toLowerCase();
  const categoryLower = (h.category || "").toLowerCase();
  const specialtiesLower = (h.specialties || []).map((s) => s.toLowerCase());

  if (selSpec === "Multi-Speciality" || selSpec === "Multi-Specialty") {
    return categoryLower.includes("multi") || (h.specialties && h.specialties.length > 4);
  }
  if (selSpec === "Trauma Center" || selSpec === "Emergency") {
    return (
      categoryLower.includes("emergency") ||
      categoryLower.includes("trauma") ||
      specialtiesLower.some((s) => s.includes("trauma") || s.includes("emergency"))
    );
  }
  if (selSpec === "Children's Hospital" || selSpec === "Children's" || selSpec === "Children") {
    return (
      categoryLower.includes("children") ||
      categoryLower.includes("pediatr") ||
      specialtiesLower.some((s) => s.includes("pediatr") || s.includes("children"))
    );
  }
  if (selSpec === "Cardiology") {
    return categoryLower.includes("cardio") || specialtiesLower.some((s) => s.includes("cardio") || s.includes("heart"));
  }
  if (selSpec === "Neurology") {
    return categoryLower.includes("neuro") || specialtiesLower.some((s) => s.includes("neuro") || s.includes("brain") || s.includes("stroke"));
  }
  if (selSpec === "Orthopaedics" || selSpec === "Orthopedics") {
    return categoryLower.includes("ortho") || specialtiesLower.some((s) => s.includes("ortho") || s.includes("bone"));
  }
  if (selSpec === "General") {
    return categoryLower.includes("general") || categoryLower.includes("multi") || specialtiesLower.some((s) => s.includes("general"));
  }
  if (selSpec === "Maternity") {
    return specialtiesLower.some((s) => s.includes("maternity") || s.includes("ob-gyn") || s.includes("obstetrics"));
  }
  if (selSpec === "Blood Bank") {
    return h.hasBloodBank || h.amenities?.includes("Blood Bank Onsite");
  }

  return (
    categoryLower.includes(specLower) ||
    specialtiesLower.some((s) => s.includes(specLower))
  );
};

export const normalizeCity = (c) => {
  if (!c || typeof c !== "string") return "";
  let cleaned = c.trim().toLowerCase().replace(/\s+/g, " ");
  if (cleaned === "ahilyanagar") cleaned = "ahmednagar";
  return cleaned;
};

export const hospitalService = {
  /**
   * Dynamically extract clean, deduplicated, title-cased city options sorted alphabetically from the dataset
   */
  getCities(hospitalsList = HOSPITALS_DATA) {
    const formatCityTitle = (c) => {
      if (!c || typeof c !== "string") return "";
      const trimmed = c.trim().replace(/\s+/g, " ");
      if (!trimmed) return "";
      return trimmed
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
    };

    const citiesMap = new Map();
    (hospitalsList || []).forEach((h) => {
      if (h.city && typeof h.city === "string" && h.city.trim() !== "") {
        const formatted = formatCityTitle(h.city);
        const normKey = normalizeCity(h.city);
        if (normKey && !citiesMap.has(normKey)) {
          citiesMap.set(normKey, formatted);
        }
      }
    });

    const sortedCities = Array.from(citiesMap.values()).sort((a, b) => a.localeCompare(b));
    return ["Near Me", "All Cities", ...sortedCities];
  },

  /**
   * Recommended logical pipeline flow:
   * Firestore hospitals
   * → Search filter
   * → City filter (Near Me = all cities ordered by distance; Specific City = exact city)
   * → Category filter
   * → Specialty filter
   * → Availability filters
   * → Radius filter
   * → Sorting
   */
  async getHospitals(filters = {}, userLocation = null) {
    let rawHospitals = [];

    try {
      await seedHospitalsToFirestore();
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

    // Compute Haversine distance if userLocation is available
    if (userLocation) {
      const uLat = typeof userLocation === "object" ? userLocation.latitude ?? userLocation.lat : null;
      const uLng = typeof userLocation === "object" ? userLocation.longitude ?? userLocation.lng : null;

      if (uLat != null && uLng != null && !isNaN(uLat) && !isNaN(uLng)) {
        results = results.map((h) => {
          const hLat = h.coordinates?.lat ?? h.latitude;
          const hLng = h.coordinates?.lng ?? h.longitude;
          const dist = calculateHaversineDistanceKm(uLat, uLng, hLat, hLng);
          const driveMin = dist != null ? Math.max(3, Math.round(dist * 1.6)) : null;

          return {
            ...h,
            distanceKm: dist,
            estimatedDriveMin: driveMin,
          };
        });
      }
    }

    // 1. Search Query Filtering
    if (filters.searchQuery && filters.searchQuery.trim() !== "") {
      const rawQuery = filters.searchQuery.trim();
      const normalizeStr = (str) =>
        (str || "")
          .toLowerCase()
          .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
          .replace(/\s+/g, " ")
          .trim();

      const normalizedQuery = normalizeStr(rawQuery);
      const queryTokens = normalizedQuery.split(" ").filter(Boolean);

      results = results.filter((h) => {
        const hName = normalizeStr(h.name);
        const hCategory = normalizeStr(h.category);
        const hTagline = normalizeStr(h.tagline);
        const hAddress = normalizeStr(h.address);
        const hCity = normalizeStr(h.city || h.location);
        const hDistrict = normalizeStr(h.district);
        const hState = normalizeStr(h.state);
        const hPincode = normalizeStr(h.pincode);
        const hSource = normalizeStr(h.dataSource);
        const hTrauma = normalizeStr(h.traumaLevel);
        const hSpecialties = (h.specialties || []).map(normalizeStr).join(" ");
        const hAmenities = (h.amenities || []).map(normalizeStr).join(" ");
        const hInsurance = (h.insuranceAccepted || []).map(normalizeStr).join(" ");

        const combinedText = `${hName} ${hCategory} ${hTagline} ${hAddress} ${hCity} ${hDistrict} ${hState} ${hPincode} ${hSource} ${hTrauma} ${hSpecialties} ${hAmenities} ${hInsurance}`;

        if (combinedText.includes(normalizedQuery)) {
          return true;
        }

        return queryTokens.every((token) => {
          if (combinedText.includes(token)) return true;
          if (token === "st" && (combinedText.includes("saint") || combinedText.includes("st"))) return true;
          if (token === "saint" && (combinedText.includes("st") || combinedText.includes("st."))) return true;
          if (token === "cardiac" && combinedText.includes("cardio")) return true;
          if (token === "orthopedics" && combinedText.includes("ortho")) return true;
          if (token === "pediatric" && (combinedText.includes("children") || combinedText.includes("pediatri"))) return true;
          return false;
        });
      });
    }

    // 2. City Filter (exact match when specific city selected; bypassed when Near Me or All Cities)
    if (filters.city && filters.city !== "Near Me" && filters.city !== "All Cities" && filters.city !== "All") {
      const targetCityNorm = normalizeCity(filters.city);
      const countBeforeCity = results.length;

      results = results.filter((h) => normalizeCity(h.city) === targetCityNorm);

      console.log(`🔍 [City Filter Diagnostic]`);
      console.log(`Selected City: "${filters.city}" (Normalized: "${targetCityNorm}")`);
      console.log(`Number of hospitals before city filter: ${countBeforeCity}`);
      console.log(`Number of hospitals after city filter: ${results.length}`);
      console.log(
        "Example matching hospital names:",
        results.slice(0, 5).map((h) => `${h.name} (${h.city})`)
      );
    }

    // 3. Top Category Chips Filtering (filters.specialties)
    if (filters.specialties && Array.isArray(filters.specialties) && filters.specialties.length > 0) {
      if (!filters.specialties.includes("All")) {
        results = results.filter((h) =>
          filters.specialties.some((selSpec) => matchesSingleSpecialty(h, selSpec))
        );
      }
    }

    // 4. Sidebar Medical Specialty Dropdown Filtering (filters.specialty)
    if (filters.specialty && filters.specialty !== "All Specialties" && filters.specialty !== "All") {
      results = results.filter((h) => matchesSingleSpecialty(h, filters.specialty));
    }

    // 5. Availability Filter Chips (filters.availabilityFilters)
    if (filters.availabilityFilters && Array.isArray(filters.availabilityFilters) && filters.availabilityFilters.length > 0) {
      filters.availabilityFilters.forEach((avail) => {
        if (avail === "Open Now" || avail === "Emergency 24×7") {
          results = results.filter((h) => h.isOpen247 || h.emergencyReady);
        } else if (avail === "ICU Available") {
          results = results.filter((h) => (h.beds?.icu?.available || 0) > 0 || (h.beds?.total || 0) > 0);
        } else if (avail === "Ventilator Available") {
          results = results.filter((h) => h.hasCtMri || h.hasBloodBank);
        } else if (avail === "Blood Bank") {
          results = results.filter((h) => h.hasBloodBank || (h.amenities || []).some((a) => a.includes("Blood Bank")));
        } else if (avail === "Ambulance Available") {
          results = results.filter((h) => h.hasAmbulanceFleet);
        } else if (avail === "Accepting Patients") {
          results = results.filter((h) => h.isOpen247 || h.emergencyReady);
        }
      });
    }

    // 6. Filter by Insurance
    if (filters.insurance && filters.insurance !== "All Insurance Providers") {
      results = results.filter((h) =>
        h.insuranceAccepted?.includes(filters.insurance) ||
        (filters.insurance.includes("MJPJAY") && h.insuranceAccepted?.some((ins) => ins.includes("MJPJAY")))
      );
    }

    // 7. Filter by Max Radius Distance
    if (filters.maxDistanceKm && filters.maxDistanceKm < 500) {
      results = results.filter((h) => h.distanceKm == null || h.distanceKm <= filters.maxDistanceKm);
    }

    // 8. Sorting options
    const sortBy = filters.sortBy || "nearest";
    if (sortBy === "nearest" || sortBy === "distance") {
      results.sort((a, b) => {
        const distA = a.distanceKm != null ? a.distanceKm : Number.MAX_VALUE;
        const distB = b.distanceKm != null ? b.distanceKm : Number.MAX_VALUE;
        return distA - distB;
      });
    } else if (sortBy === "highestRated" || sortBy === "rating") {
      results.sort((a, b) => (b.beds?.total || 0) - (a.beds?.total || 0));
    } else if (sortBy === "mostIcuBeds" || sortBy === "icuBeds" || sortBy === "beds") {
      results.sort((a, b) => (b.beds?.total || 0) - (a.beds?.total || 0));
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
