import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { calculateHaversineDistanceKm } from "./hospitalService";

export const INITIAL_AMBULANCES = [
  {
    id: "amb-mh-101",
    providerName: "Lifeline ICU Express Ambulance",
    ambulanceRegistrationNumber: "MH-17-AZ-1080",
    ambulanceType: "ICU Ambulance",
    description: "24/7 Mobile ICU equipped with cardiac ventilator, defibrillator, and paramedic doctor.",
    
    // Contact
    primaryPhone: "02423-222340",
    emergencyPhone: "108",
    email: "emergency@lifelineambulance.org",

    // Location
    address: "Station Road, Near Railway Station",
    area: "Station Road",
    city: "Kopargaon",
    district: "Ahmednagar",
    state: "Maharashtra",
    pincode: "423601",
    latitude: 19.8916,
    longitude: 74.4795,
    coordinates: { lat: 19.8916, lng: 74.4795 },

    // Availability
    availabilityStatus: "Available", // "Available" | "On Call" | "Busy" | "Offline"

    // Services / Equipment
    oxygen: true,
    ventilator: true,
    defibrillator: true,
    cardiacMonitor: true,
    stretcher: true,
    otherEquipment: "Suction Machine, Nebulizer, Syringe Pump",

    // Operating Hours
    isOpen247: true,
    opdHours: {
      monday: { open: true, from: "00:00", to: "23:59" },
      tuesday: { open: true, from: "00:00", to: "23:59" },
      wednesday: { open: true, from: "00:00", to: "23:59" },
      thursday: { open: true, from: "00:00", to: "23:59" },
      friday: { open: true, from: "00:00", to: "23:59" },
      saturday: { open: true, from: "00:00", to: "23:59" },
      sunday: { open: true, from: "00:00", to: "23:59" },
    },

    // Verification & Publishing
    verificationType: "State Transport Authority",
    verificationNumber: "RTO-MH-AMB-4029",
    verificationNotes: "Inspected & certified for emergency cardiac dispatch.",
    verificationStatus: "verified",
    published: true,
    archived: false,

    // Audit
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: "admin@medinav.org",
    updatedBy: "admin@medinav.org",

    // Media
    image: "https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=800&q=80",
    additionalImages: [],
  },
  {
    id: "amb-mh-102",
    providerName: "Civil Hospital Regional ALS Ambulance",
    ambulanceRegistrationNumber: "MH-16-BX-9911",
    ambulanceType: "Advanced Life Support (ALS)",
    description: "District Trauma Emergency Response Ambulance with continuous O2 supply.",
    
    // Contact
    primaryPhone: "0241-2430541",
    emergencyPhone: "102",
    email: "civil.ambulance@mah.gov.in",

    // Location
    address: "Near T.B. Hospital, Collectorate Area",
    area: "Collectorate Area",
    city: "Ahmednagar",
    district: "Ahmednagar",
    state: "Maharashtra",
    pincode: "414001",
    latitude: 19.0952,
    longitude: 74.7496,
    coordinates: { lat: 19.0952, lng: 74.7496 },

    // Availability
    availabilityStatus: "Available",

    // Services / Equipment
    oxygen: true,
    ventilator: true,
    defibrillator: true,
    cardiacMonitor: true,
    stretcher: true,
    otherEquipment: "Spine Board, Cervical Collar Kit",

    // Operating Hours
    isOpen247: true,
    opdHours: {
      monday: { open: true, from: "00:00", to: "23:59" },
      tuesday: { open: true, from: "00:00", to: "23:59" },
      wednesday: { open: true, from: "00:00", to: "23:59" },
      thursday: { open: true, from: "00:00", to: "23:59" },
      friday: { open: true, from: "00:00", to: "23:59" },
      saturday: { open: true, from: "00:00", to: "23:59" },
      sunday: { open: true, from: "00:00", to: "23:59" },
    },

    // Verification & Publishing
    verificationType: "Government Health Department",
    verificationNumber: "GOV-MH-AMB-883",
    verificationNotes: "District Government Voluntary Emergency Vehicle.",
    verificationStatus: "verified",
    published: true,
    archived: false,

    // Audit
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: "admin@medinav.org",
    updatedBy: "admin@medinav.org",

    // Media
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    additionalImages: [],
  },
  {
    id: "amb-mh-103",
    providerName: "Apex Cardiac Rescue Response",
    ambulanceRegistrationNumber: "MH-12-PQ-4444",
    ambulanceType: "Basic Life Support (BLS)",
    description: "Rapid BLS paramedic transport unit with folding stretcher and oxygen support.",
    
    // Contact
    primaryPhone: "020-26123456",
    emergencyPhone: "108",
    email: "dispatch@apexrescue.org",

    // Location
    address: "Bund Garden Road, Camp",
    area: "Camp",
    city: "Pune",
    district: "Pune",
    state: "Maharashtra",
    pincode: "411001",
    latitude: 18.5204,
    longitude: 73.8567,
    coordinates: { lat: 18.5204, lng: 73.8567 },

    // Availability
    availabilityStatus: "On Call",

    // Services / Equipment
    oxygen: true,
    ventilator: false,
    defibrillator: true,
    cardiacMonitor: false,
    stretcher: true,
    otherEquipment: "First Aid Kit, Resuscitator Bag",

    // Operating Hours
    isOpen247: true,
    opdHours: {
      monday: { open: true, from: "00:00", to: "23:59" },
      tuesday: { open: true, from: "00:00", to: "23:59" },
      wednesday: { open: true, from: "00:00", to: "23:59" },
      thursday: { open: true, from: "00:00", to: "23:59" },
      friday: { open: true, from: "00:00", to: "23:59" },
      saturday: { open: true, from: "00:00", to: "23:59" },
      sunday: { open: true, from: "00:00", to: "23:59" },
    },

    // Verification & Publishing
    verificationType: "State Transport Authority",
    verificationNumber: "RTO-MH-AMB-9102",
    verificationNotes: "Verified BLS Emergency Transport Vehicle.",
    verificationStatus: "verified",
    published: true,
    archived: false,

    // Audit
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: "admin@medinav.org",
    updatedBy: "admin@medinav.org",

    // Media
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80",
    additionalImages: [],
  },
];

let isAmbulanceSeeded = false;
const CACHE_KEY = "medinav_ambulances_cache";

const loadCachedAmbulances = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn("⚠️ Error reading ambulance local cache:", e);
  }
  return [];
};

const saveCachedAmbulances = (list = []) => {
  try {
    if (Array.isArray(list) && list.length > 0) {
      localStorage.setItem(CACHE_KEY, JSON.stringify(list));
    }
  } catch (e) {
    console.warn("⚠️ Error saving ambulance local cache:", e);
  }
};

const mergeAmbulanceLists = (primaryList = [], secondaryList = []) => {
  const map = new Map();
  (primaryList || []).forEach((item) => {
    if (item && item.id) map.set(item.id, item);
  });
  (secondaryList || []).forEach((item) => {
    if (item && item.id && !map.has(item.id)) map.set(item.id, item);
  });
  return Array.from(map.values());
};

export const seedAmbulancesToFirestore = async () => {
  if (isAmbulanceSeeded) return;

  try {
    const querySnapshot = await getDocs(collection(db, "ambulances"));

    if (querySnapshot.empty) {
      console.log("🌱 [Firestore Seeding] Seeding initial Ambulances into Firestore ambulances collection...");
      for (const item of INITIAL_AMBULANCES) {
        await setDoc(doc(db, "ambulances", item.id), item);
      }
      console.log("✅ [Firestore Seeding] Successfully seeded initial Ambulances dataset!");
    }
    isAmbulanceSeeded = true;
  } catch (error) {
    console.warn("⚠️ [Firestore Ambulance Seeding Notice]:", error.message);
  }
};

export const ambulanceService = {
  getCities(list = []) {
    const set = new Set();
    (list || []).forEach((item) => {
      if (item.city && typeof item.city === "string" && item.city.trim() !== "") {
        set.add(item.city.trim());
      }
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  },

  /**
   * Fetch public ambulances from Cloud Firestore.
   * STRICT PUBLIC VISIBILITY RULE:
   * verificationStatus === "verified" AND published === true AND !archived
   */
  async getPublicAmbulances(filters = {}, userLocation = null) {
    let rawList = [];
    try {
      await seedAmbulancesToFirestore();
      const querySnapshot = await getDocs(collection(db, "ambulances"));
      if (!querySnapshot.empty) {
        rawList = querySnapshot.docs.map((docSnap) => docSnap.data());
        saveCachedAmbulances(rawList);
      } else {
        const cached = loadCachedAmbulances();
        rawList = mergeAmbulanceLists(INITIAL_AMBULANCES, cached);
      }
    } catch (error) {
      console.warn("⚠️ [Public Ambulance Fetch Notice]:", error.message);
      const cached = loadCachedAmbulances();
      rawList = mergeAmbulanceLists(INITIAL_AMBULANCES, cached);
    }

    // STRICT PUBLIC VISIBILITY RULE
    let results = rawList.filter(
      (b) =>
        !b.archived &&
        b.published === true &&
        b.verificationStatus === "verified"
    );

    // Haversine distance computation
    if (userLocation) {
      const uLat = typeof userLocation === "object" ? userLocation.latitude ?? userLocation.lat : null;
      const uLng = typeof userLocation === "object" ? userLocation.longitude ?? userLocation.lng : null;

      if (uLat != null && uLng != null && !isNaN(uLat) && !isNaN(uLng)) {
        results = results.map((b) => {
          const bLat = b.coordinates?.lat ?? b.latitude;
          const bLng = b.coordinates?.lng ?? b.longitude;
          const dist = calculateHaversineDistanceKm(uLat, uLng, bLat, bLng);
          return {
            ...b,
            distanceKm: dist,
          };
        });
      }
    }

    // Optional filters
    if (filters.city && filters.city !== "All" && filters.city !== "All Cities" && filters.city !== "Near Me") {
      results = results.filter(
        (b) => (b.city || "").toLowerCase().trim() === filters.city.toLowerCase().trim()
      );
    }

    if (filters.ambulanceType && filters.ambulanceType !== "All") {
      results = results.filter((b) => b.ambulanceType === filters.ambulanceType);
    }

    if (filters.availabilityStatus && filters.availabilityStatus !== "All") {
      results = results.filter((b) => b.availabilityStatus === filters.availabilityStatus);
    }

    if (filters.searchQuery && filters.searchQuery.trim() !== "") {
      const q = filters.searchQuery.toLowerCase().trim();
      results = results.filter(
        (b) =>
          (b.providerName || "").toLowerCase().includes(q) ||
          (b.ambulanceRegistrationNumber || "").toLowerCase().includes(q) ||
          (b.city || "").toLowerCase().includes(q) ||
          (b.address || "").toLowerCase().includes(q) ||
          (b.ambulanceType || "").toLowerCase().includes(q)
      );
    }

    // Sort order: Nearest first if userLocation is available, preferring "Available" over others
    results.sort((a, b) => {
      // Prioritize Available status
      const statusWeight = { Available: 1, "On Call": 2, Busy: 3, Offline: 4 };
      const weightA = statusWeight[a.availabilityStatus] || 5;
      const weightB = statusWeight[b.availabilityStatus] || 5;

      if (weightA !== weightB) {
        return weightA - weightB;
      }

      if (userLocation) {
        const distA = a.distanceKm != null ? a.distanceKm : Number.MAX_VALUE;
        const distB = b.distanceKm != null ? b.distanceKm : Number.MAX_VALUE;
        return distA - distB;
      }

      return (a.providerName || "").localeCompare(b.providerName || "");
    });

    return results;
  },

  /**
   * Fetch complete ambulance dataset for Admin Panel
   */
  async getAdminAmbulances() {
    try {
      await seedAmbulancesToFirestore();
      const querySnapshot = await getDocs(collection(db, "ambulances"));
      if (!querySnapshot.empty) {
        const list = querySnapshot.docs.map((docSnap) => docSnap.data());
        saveCachedAmbulances(list);
        return list.filter((b) => !b.archived);
      }
    } catch (error) {
      console.warn("⚠️ [Admin Ambulance Fetch Notice]:", error.message);
    }
    const cached = loadCachedAmbulances();
    const merged = mergeAmbulanceLists(INITIAL_AMBULANCES, cached);
    return merged.filter((b) => !b.archived);
  },

  async getAdminAmbulanceStats() {
    const list = await this.getAdminAmbulances();
    const total = list.length;
    const verified = list.filter((b) => b.verificationStatus === "verified").length;
    const pending = list.filter((b) => b.verificationStatus === "pending").length;
    const published = list.filter((b) => b.published === true).length;
    const available = list.filter((b) => b.availabilityStatus === "Available").length;

    return {
      total,
      verified,
      pending,
      published,
      available,
    };
  },

  async getAmbulanceById(id) {
    try {
      const docRef = doc(db, "ambulances", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      }
    } catch (error) {
      console.warn("⚠️ [Firestore Ambulance By ID Notice]:", error.message);
    }

    const cached = loadCachedAmbulances();
    const merged = mergeAmbulanceLists(INITIAL_AMBULANCES, cached);
    return merged.find((b) => b.id === id) || null;
  },

  /**
   * Add new Ambulance with mandatory default state:
   * verificationStatus: "pending"
   * published: false
   * archived: false
   */
  async addAmbulance(ambulanceData, adminUser = null) {
    const newId = ambulanceData.id || `custom-amb-${Date.now()}`;
    const timestamp = new Date().toISOString();

    const record = {
      ...ambulanceData,
      id: newId,
      // MANDATORY DEFAULT CREATION STATE
      verificationStatus: ambulanceData.verificationStatus || "pending",
      published: ambulanceData.published === true ? true : false,
      archived: false,
      createdAt: timestamp,
      updatedAt: timestamp,
      createdBy: adminUser?.email || "admin",
      updatedBy: adminUser?.email || "admin",
    };

    console.log("⏳ [Firestore Write] Writing ambulance record to ambulances/", newId, record);
    const docRef = doc(db, "ambulances", newId);
    await setDoc(docRef, record);

    console.log("🔍 [Firestore Verification] Verifying persistence at ambulances/", newId);
    const verifySnap = await getDoc(docRef);
    if (!verifySnap.exists()) {
      throw new Error(`Firestore failed to persist document at ambulances/${newId}`);
    }

    const savedData = verifySnap.data();

    // Cache sync
    const cached = loadCachedAmbulances();
    const updatedCache = mergeAmbulanceLists([savedData], cached);
    saveCachedAmbulances(updatedCache);

    console.log("✅ [Firestore Success] Ambulance document persisted cleanly:", savedData);
    return savedData;
  },

  async updateAmbulance(id, updateData, adminUser = null) {
    const timestamp = new Date().toISOString();
    const docRef = doc(db, "ambulances", id);

    const payload = {
      ...updateData,
      updatedAt: timestamp,
      updatedBy: adminUser?.email || "admin",
    };

    await setDoc(docRef, payload, { merge: true });

    const verifySnap = await getDoc(docRef);
    const savedData = verifySnap.data();

    // Cache sync
    const cached = loadCachedAmbulances();
    const updatedCache = mergeAmbulanceLists([savedData], cached);
    saveCachedAmbulances(updatedCache);

    return savedData;
  },

  async softDeleteAmbulance(id, adminUser = null) {
    const timestamp = new Date().toISOString();
    const docRef = doc(db, "ambulances", id);

    await setDoc(
      docRef,
      {
        archived: true,
        published: false,
        updatedAt: timestamp,
        updatedBy: adminUser?.email || "admin",
      },
      { merge: true }
    );

    const cached = loadCachedAmbulances();
    const updatedCache = cached.map((b) => (b.id === id ? { ...b, archived: true, published: false } : b));
    saveCachedAmbulances(updatedCache);

    return { id, archived: true };
  },
};
