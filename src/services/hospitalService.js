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
 * Seed Firestore "hospitals" collection with official Maharashtra DMER Government Hospitals
 */
export const seedHospitalsToFirestore = async () => {
  if (isSeeded) return;

  try {
    const querySnapshot = await getDocs(collection(db, "hospitals"));

    // Check if Firestore has old 7 dummy hospitals (e.g. hsp-001, hsp-002)
    const hasOldDummyDocs = querySnapshot.docs.some(
      (docSnap) => docSnap.id.startsWith("hsp-") || docSnap.id === "hsp-001"
    );

    if (querySnapshot.empty || hasOldDummyDocs) {
      console.log(
        "🌱 [Firestore Seeding] Seeding official Maharashtra DMER Government Hospitals dataset..."
      );

      // Clean up old dummy hospital records from Firestore
      for (const docSnap of querySnapshot.docs) {
        if (docSnap.id.startsWith("hsp-")) {
          await deleteDoc(doc(db, "hospitals", docSnap.id));
        }
      }

      // Seed official 36 Maharashtra DMER Government Hospitals
      for (const hospital of HOSPITALS_DATA) {
        await setDoc(doc(db, "hospitals", hospital.id), hospital);
      }
      console.log(
        "✅ [Firestore Seeding] Successfully seeded",
        HOSPITALS_DATA.length,
        "Maharashtra DMER hospitals into Firestore!"
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

export const hospitalService = {
  /**
   * Fetch all hospitals from Firestore or filter with multi-select specialty & availability options,
   * dynamically computing Haversine distance from userLocation when provided.
   */
  async getHospitals(filters = {}, userLocation = null) {
    let rawHospitals = [];

    try {
      // 1. Trigger automatic seeding if Firestore collection is empty or has old dummy records
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

    // 1. Top Category Chips Filtering (filters.specialties)
    if (filters.specialties && Array.isArray(filters.specialties) && filters.specialties.length > 0) {
      if (!filters.specialties.includes("All")) {
        results = results.filter((h) =>
          filters.specialties.some((selSpec) => matchesSingleSpecialty(h, selSpec))
        );
      }
    }

    // 2. Sidebar Medical Specialty Dropdown Filtering (filters.specialty)
    if (filters.specialty && filters.specialty !== "All Specialties" && filters.specialty !== "All") {
      results = results.filter((h) => matchesSingleSpecialty(h, filters.specialty));
    }

    // 3. Availability Filter Chips (filters.availabilityFilters)
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

    // 4. Filter by Insurance
    if (filters.insurance && filters.insurance !== "All Insurance Providers") {
      results = results.filter((h) =>
        h.insuranceAccepted?.includes(filters.insurance) ||
        (filters.insurance.includes("MJPJAY") && h.insuranceAccepted?.some((ins) => ins.includes("MJPJAY")))
      );
    }

    // 5. Filter by Max Distance
    if (filters.maxDistanceKm) {
      results = results.filter((h) => (h.distanceKm ?? 999) <= filters.maxDistanceKm);
    }

    // 6. Search Query Filtering (case-insensitive, whitespace tolerant, partial-match friendly)
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
        const hDistrict = normalize(h.district);
        const hState = normalize(h.state);
        const hPincode = normalize(h.pincode);
        const hSource = normalize(h.dataSource);
        const hTrauma = normalize(h.traumaLevel);
        const hSpecialties = (h.specialties || []).map(normalize).join(" ");
        const hAmenities = (h.amenities || []).map(normalize).join(" ");
        const hInsurance = (h.insuranceAccepted || []).map(normalize).join(" ");

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
          if (token === "jj" && combinedText.includes("grant")) return true;
          if (token === "sassoon" && combinedText.includes("bj")) return true;
          if (token === "mayo" && combinedText.includes("indira")) return true;
          return false;
        });
      });

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

    // 6.5 Dynamic Haversine Distance Calculation using User Geolocation
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

    // 7. Sorting options
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
