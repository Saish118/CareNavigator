/**
 * Centralized Navigation Utility for opening hospital directions in Google Maps.
 * Ensures mock/demo hospitals do not redirect to random coordinates (like NYC City Hall),
 * and real hospitals open exact Google Maps coordinates or search queries.
 */

export const isDemoHospital = (hospital) => {
  if (!hospital) return true;

  // Explicit demo/mock flag check
  if (hospital.isDemo || hospital.isMock || hospital.isMockData) return true;

  const name = (hospital.name || "").toLowerCase();
  const address = (hospital.address || "").toLowerCase();
  const city = (hospital.city || "").toLowerCase();
  const id = (hospital.id || "").toLowerCase();

  // Known demo entries in mock dataset
  if (
    id.startsWith("hsp-") ||
    address.includes("medical center blvd") ||
    address.includes("health parkway") ||
    address.includes("metro city") ||
    city.includes("metro city") ||
    name.includes("st. jude metro cardiac") ||
    name.includes("mercy general & children")
  ) {
    return true;
  }

  return false;
};

export const openHospitalDirections = (hospital, addToast) => {
  if (!hospital) {
    if (addToast) addToast("No hospital selected for directions.", "warning");
    return;
  }

  // 1. Check if hospital is a Demo / Mock facility with fake coordinates/addresses
  if (isDemoHospital(hospital)) {
    if (addToast) {
      addToast(`Directions are unavailable for demo facility: "${hospital.name}".`, "info");
    }
    return;
  }

  const lat = hospital.coordinates?.lat || hospital.latitude;
  const lng = hospital.coordinates?.lng || hospital.longitude;
  const name = hospital.name || "";
  const address = hospital.address || "";
  const city = hospital.city || "";

  // 2. Real hospital with valid real-world coordinates
  if (lat && lng && typeof lat === "number" && typeof lng === "number" && !isNaN(lat) && !isNaN(lng)) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    if (addToast) addToast(`Opening directions to ${name}...`, "success");
    window.open(url, "_blank");
    return;
  }

  // 3. Real hospital with usable name/address search query
  if (name.trim() !== "") {
    const searchQuery = `${name} ${address} ${city}`.trim();
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery)}`;
    if (addToast) addToast(`Opening Google Maps search for ${name}...`, "success");
    window.open(url, "_blank");
    return;
  }

  // 4. Insufficient location info
  if (addToast) {
    addToast(`Directions are unavailable for "${name}". Insufficient location data.`, "warning");
  }
};
