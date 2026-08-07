import React, { createContext, useContext, useState, useEffect } from "react";

const BookmarkContext = createContext();

export const BookmarkProvider = ({ children }) => {
  const [savedHospitalIds, setSavedHospitalIds] = useState(() => {
    try {
      const stored = localStorage.getItem("carenavigator_saved_hospitals");
      return stored ? JSON.parse(stored) : ["hosp-001", "hosp-003"];
    } catch {
      return ["hosp-001", "hosp-003"];
    }
  });

  useEffect(() => {
    localStorage.setItem("carenavigator_saved_hospitals", JSON.stringify(savedHospitalIds));
  }, [savedHospitalIds]);

  const toggleSaveHospital = (id) => {
    setSavedHospitalIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isHospitalSaved = (id) => savedHospitalIds.includes(id);

  return (
    <BookmarkContext.Provider
      value={{
        savedHospitalIds,
        toggleSaveHospital,
        isHospitalSaved,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmark = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error("useBookmark must be used within a BookmarkProvider");
  }
  return context;
};
