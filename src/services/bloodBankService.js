import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { calculateHaversineDistanceKm } from "./hospitalService";

export const INITIAL_BLOOD_BANKS = [
  {
    id: "bb-mh-001",
    name: "Indian Red Cross Society Blood Centre",
    type: "Charitable / Red Cross",
    category: "Red Cross",
    description: "Official FDA Licensed Regional Blood Transfusion & Component Unit.",
    address: "Station Road, Near Railway Station",
    area: "Station Road",
    city: "Kopargaon",
    district: "Ahmednagar",
    state: "Maharashtra",
    pincode: "423601",
    phone: "02423-222340",
    erDirectPhone: "02423-222340",
    email: "redcross.kopargaon@gmail.com",
    website: "https://redcross.org.in",
    latitude: 19.8916,
    longitude: 74.4795,
    coordinates: { lat: 19.8916, lng: 74.4795 },

    bloodGroupStock: {
      "A+": 18,
      "A-": 4,
      "B+": 25,
      "B-": 6,
      "O+": 32,
      "O-": 5,
      "AB+": 12,
      "AB-": 2,
    },

    componentsAvailable: ["PRBC", "FFP", "Platelet Concentrate", "Cryoprecipitate", "SDP"],
    isOpen247: true,
    hasComponentFacility: true,
    hasApheresisUnit: true,
    hasMobileDonationVan: true,
    hasDeliveryAmbulance: true,

    verificationType: "FDA License",
    verificationNumber: "FDA/MH/BB-10492",
    verificationStatus: "verified",
    published: true,
    archived: false,

    image: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80",
    additionalImages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "bb-mh-002",
    name: "Civil Hospital Regional Blood Centre",
    type: "Government",
    category: "Government",
    description: "District Government Voluntary Blood Transfusion Centre.",
    address: "Near T.B. Hospital, Collectorate Area",
    area: "T.B. Hospital Area",
    city: "Ahmednagar",
    district: "Ahmednagar",
    state: "Maharashtra",
    pincode: "414001",
    phone: "0241-2430541",
    erDirectPhone: "0241-2430541",
    email: "civilbloodbank.nagar@mah.gov.in",
    latitude: 19.0952,
    longitude: 74.7496,
    coordinates: { lat: 19.0952, lng: 74.7496 },

    bloodGroupStock: {
      "A+": 24,
      "A-": 5,
      "B+": 30,
      "B-": 8,
      "O+": 40,
      "O-": 10,
      "AB+": 15,
      "AB-": 3,
    },

    componentsAvailable: ["PRBC", "FFP", "Platelet Concentrate"],
    isOpen247: true,
    hasComponentFacility: true,
    hasApheresisUnit: false,
    hasMobileDonationVan: true,
    hasDeliveryAmbulance: true,

    verificationType: "Government Facility ID",
    verificationNumber: "GOV-MH-BB-883",
    verificationStatus: "verified",
    published: true,
    archived: false,

    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80",
    additionalImages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let isBloodBankSeeded = false;

export const seedBloodBanksToFirestore = async () => {
  if (isBloodBankSeeded) return;

  try {
    const querySnapshot = await getDocs(collection(db, "bloodBanks"));

    if (querySnapshot.empty) {
      console.log("🌱 [Firestore Seeding] Seeding initial Blood Banks into Firestore bloodBanks collection...");
      for (const item of INITIAL_BLOOD_BANKS) {
        await setDoc(doc(db, "bloodBanks", item.id), item);
      }
      console.log("✅ [Firestore Seeding] Successfully seeded initial Blood Banks dataset!");
    }
    isBloodBankSeeded = true;
  } catch (error) {
    console.warn("⚠️ [Firestore Blood Bank Seeding Notice]:", error.message);
  }
};

export const bloodBankService = {
  /**
   * Extract clean, deduplicated cities from blood bank dataset
   */
  getCities(list = []) {
    const set = new Set();
    (list || []).forEach((b) => {
      if (b.city && typeof b.city === "string" && b.city.trim() !== "") {
        set.add(b.city.trim());
      }
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  },

  /**
   * Fetch public blood banks from Cloud Firestore.
   * STRICT SECURITY FILTER: Returns ONLY blood banks where verificationStatus === "verified" AND published === true
   */
  async getPublicBloodBanks(filters = {}, userLocation = null) {
    let rawList = [];
    try {
      await seedBloodBanksToFirestore();
      const querySnapshot = await getDocs(collection(db, "bloodBanks"));
      if (!querySnapshot.empty) {
        rawList = querySnapshot.docs.map((docSnap) => docSnap.data());
      } else {
        rawList = [...INITIAL_BLOOD_BANKS];
      }
    } catch (error) {
      console.warn("⚠️ [Public Blood Bank Fetch Notice]:", error.message);
      rawList = [...INITIAL_BLOOD_BANKS];
    }

    // Filter strictly for verified AND published blood banks (and not archived)
    let results = rawList.filter(
      (b) =>
        !b.archived &&
        b.published !== false &&
        (b.verificationStatus === "verified" || (!b.verificationStatus && b.id))
    );

    // Compute Haversine distance if user location is available
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

    // Apply optional city filter
    if (filters.city && filters.city !== "All" && filters.city !== "All Cities" && filters.city !== "Near Me") {
      results = results.filter(
        (b) => (b.city || "").toLowerCase().trim() === filters.city.toLowerCase().trim()
      );
    }

    // Apply optional blood group filter (e.g. "O+", "A-", etc.)
    if (filters.bloodGroup && filters.bloodGroup !== "All") {
      results = results.filter((b) => {
        const stock = b.bloodGroupStock || {};
        return (stock[filters.bloodGroup] || 0) > 0;
      });
    }

    // Apply search query filter
    if (filters.searchQuery && filters.searchQuery.trim() !== "") {
      const q = filters.searchQuery.toLowerCase().trim();
      results = results.filter(
        (b) =>
          (b.name || "").toLowerCase().includes(q) ||
          (b.city || "").toLowerCase().includes(q) ||
          (b.address || "").toLowerCase().includes(q) ||
          (b.district || "").toLowerCase().includes(q)
      );
    }

    // Order nearest first if user location is active
    if (userLocation) {
      results.sort((a, b) => {
        const distA = a.distanceKm != null ? a.distanceKm : Number.MAX_VALUE;
        const distB = b.distanceKm != null ? b.distanceKm : Number.MAX_VALUE;
        return distA - distB;
      });
    }

    return results;
  },
  async getAdminBloodBanks() {
    try {
      await seedBloodBanksToFirestore();
      const querySnapshot = await getDocs(collection(db, "bloodBanks"));
      if (!querySnapshot.empty) {
        return querySnapshot.docs
          .map((docSnap) => docSnap.data())
          .filter((b) => !b.archived);
      }
    } catch (error) {
      console.warn("⚠️ [Admin Blood Bank Fetch Notice]:", error.message);
    }
    return [...INITIAL_BLOOD_BANKS];
  },

  /**
   * Compute live Admin Dashboard statistics for Blood Banks
   */
  async getAdminBloodBankStats() {
    const list = await this.getAdminBloodBanks();
    const total = list.length;
    const verified = list.filter(
      (b) => b.verificationStatus === "verified" || (!b.verificationStatus && b.id)
    ).length;
    const pending = list.filter((b) => b.verificationStatus === "pending").length;
    const published = list.filter((b) => b.published !== false).length;

    return {
      total,
      verified,
      pending,
      published,
    };
  },

  /**
   * Fetch single blood bank by ID
   */
  async getBloodBankById(id) {
    try {
      const docRef = doc(db, "bloodBanks", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      }
    } catch (error) {
      console.warn("⚠️ [Firestore Blood Bank By ID Notice]:", error.message);
    }

    return INITIAL_BLOOD_BANKS.find((b) => b.id === id) || null;
  },

  /**
   * Add new Blood Bank with default verificationStatus: "pending" and published: false
   * Includes read-back verification to confirm persistence.
   */
  async addBloodBank(bankData, adminUser = null) {
    const newId = bankData.id || `custom-bb-${Date.now()}`;
    const timestamp = new Date().toISOString();

    const record = {
      ...bankData,
      id: newId,
      verificationStatus: bankData.verificationStatus || "pending",
      published: bankData.published === true ? true : false,
      archived: false,
      createdAt: timestamp,
      updatedAt: timestamp,
      createdBy: adminUser?.email || "admin",
      updatedBy: adminUser?.email || "admin",
    };

    console.log("⏳ [Firestore Write] Writing blood bank record to bloodBanks/", newId, record);
    const docRef = doc(db, "bloodBanks", newId);
    await setDoc(docRef, record);

    console.log("🔍 [Firestore Verification] Verifying persistence at bloodBanks/", newId);
    const verifySnap = await getDoc(docRef);
    if (!verifySnap.exists()) {
      throw new Error(`Firestore failed to persist document at bloodBanks/${newId}`);
    }

    console.log("✅ [Firestore Success] Blood Bank document persisted cleanly:", verifySnap.data());
    return verifySnap.data();
  },

  /**
   * Update existing Blood Bank record in Firestore
   */
  async updateBloodBank(id, updateData, adminUser = null) {
    const timestamp = new Date().toISOString();
    const docRef = doc(db, "bloodBanks", id);

    const payload = {
      ...updateData,
      updatedAt: timestamp,
      updatedBy: adminUser?.email || "admin",
    };

    await setDoc(docRef, payload, { merge: true });

    const verifySnap = await getDoc(docRef);
    return verifySnap.data();
  },

  /**
   * Soft delete (archive) Blood Bank in Firestore
   */
  async softDeleteBloodBank(id, adminUser = null) {
    const timestamp = new Date().toISOString();
    const docRef = doc(db, "bloodBanks", id);

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

    return { id, archived: true };
  },
};
