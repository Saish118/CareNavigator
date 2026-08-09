/**
 * Centralized Navigation Utility for opening hospital directions in Google Maps.
 * Works generically for ALL hospitals (real or sample data) with lat/lng or address,
 * including user origin coordinates when browser geolocation is available.
 */

export const openHospitalDirections = (hospital, addToast, userLocation = null) => {
  if (!hospital) {
    if (addToast) addToast("No hospital selected for directions.", "warning");
    return;
  }

  const name = hospital.name || "Hospital Facility";
  const address = hospital.address || "";
  const city = hospital.city || "";
  const lat = hospital.coordinates?.lat || hospital.latitude;
  const lng = hospital.coordinates?.lng || hospital.longitude;

  // Build Destination String (Lat/Lng coordinates or Name + Address query)
  let destinationParam = "";

  if (lat && lng && typeof lat === "number" && typeof lng === "number" && !isNaN(lat) && !isNaN(lng)) {
    destinationParam = `${lat},${lng}`;
  } else if (name.trim() !== "") {
    const fullQuery = `${name} ${address} ${city}`.trim();
    destinationParam = encodeURIComponent(fullQuery);
  } else if (address.trim() !== "") {
    destinationParam = encodeURIComponent(`${address} ${city}`.trim());
  } else {
    if (addToast) addToast(`Directions unavailable for ${name} (insufficient location info).`, "warning");
    return;
  }

  // Build Origin String if user location is available
  let originParam = "";
  if (userLocation) {
    const userLat = Array.isArray(userLocation)
      ? userLocation[0]
      : userLocation.latitude || userLocation.lat;
    const userLng = Array.isArray(userLocation)
      ? userLocation[1]
      : userLocation.longitude || userLocation.lng;

    if (userLat && userLng) {
      originParam = `&origin=${userLat},${userLng}`;
    }
  }

  // Construct Google Maps URL
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1${originParam}&destination=${destinationParam}`;

  if (addToast) {
    addToast(`Opening Google Maps directions for ${name}...`, "success");
  }

  window.open(googleMapsUrl, "_blank");
};
