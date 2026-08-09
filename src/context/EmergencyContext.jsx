import React, { createContext, useContext, useState } from "react";
import { HOSPITALS_DATA } from "../data/hospitalsData";

const EmergencyContext = createContext();

export const EmergencyProvider = ({ children }) => {
  const [isSosActive, setIsSosActive] = useState(false);
  const [sosCountdown, setSosCountdown] = useState(5);
  const [sosDispatched, setSosDispatched] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [activeDestinationHospital, setActiveDestinationHospital] = useState(HOSPITALS_DATA[0]);
  const [isEmergencySirenActive, setIsEmergencySirenActive] = useState(false);

  const triggerSos = () => {
    setIsSosActive(true);
    setSosCountdown(5);
    setSosDispatched(false);
  };

  const cancelSos = () => {
    setIsSosActive(false);
    setSosCountdown(5);
    setSosDispatched(false);
  };

  const confirmSosDispatch = () => {
    setSosDispatched(true);
  };

  const setDestination = (hospital) => {
    setActiveDestinationHospital(hospital);
  };

  const toggleSirenMode = () => {
    setIsEmergencySirenActive((prev) => !prev);
  };

  return (
    <EmergencyContext.Provider
      value={{
        isSosActive,
        sosCountdown,
        sosDispatched,
        userLocation,
        activeDestinationHospital,
        isEmergencySirenActive,
        triggerSos,
        cancelSos,
        confirmSosDispatch,
        setSosCountdown,
        setDestination,
        toggleSirenMode,
      }}
    >
      {children}
    </EmergencyContext.Provider>
  );
};

export const useEmergency = () => {
  const context = useContext(EmergencyContext);
  if (!context) {
    throw new Error("useEmergency must be used within an EmergencyProvider");
  }
  return context;
};
