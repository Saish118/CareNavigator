/**
 * Navigation & Traffic Simulation Service
 */

export const navigationService = {
  /**
   * Calculate turn-by-turn route and ETA between GPS and hospital
   */
  async calculateRoute(destinationHospital, options = {}) {
    await new Promise((res) => setTimeout(res, 300));

    const isSirenActive = options.emergencySirenMode || false;
    const baseMinutes = destinationHospital.estimatedDriveMin || 10;
    const distanceKm = destinationHospital.distanceKm || 3.2;

    // Siren mode speeds up route by 35%
    const finalMinutes = isSirenActive
      ? Math.max(2, Math.round(baseMinutes * 0.65))
      : baseMinutes;

    const steps = [
      { id: 1, instruction: "Head East on Main Street toward Sector 4", distance: "0.5 km", time: "1 min" },
      { id: 2, instruction: "Take Emergency Bypass Highway Entrance (Siren Corridor)", distance: "1.8 km", time: `${Math.max(1, finalMinutes - 4)} min` },
      { id: 3, instruction: "Turn Right into Hospital Emergency Bay & Ambulance Ramp", distance: "0.4 km", time: "1 min" },
      { id: 4, instruction: "Arrive at ER Triage Gate", distance: "0.1 km", time: "Direct Access" },
    ];

    return {
      destination: destinationHospital.name,
      address: destinationHospital.address,
      distanceKm: distanceKm,
      etaMinutes: finalMinutes,
      trafficCondition: isSirenActive ? "Priority Siren Clear" : destinationHospital.trafficLevel,
      sirenActive: isSirenActive,
      steps: steps,
    };
  },
};
