import React from "react";
import { motion } from "framer-motion";

export const Tabs = ({
  tabs = [
    { id: "all", label: "All Hospitals" },
    { id: "icu", label: "ICU Beds" },
    { label: "Pediatrics", id: "pediatric" },
  ],
  activeTab = "all",
  onChange,
}) => {
  return (
    <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl border border-slate-200/80 w-fit">
      {tabs.map((t) => {
        const isActive = t.id === activeTab;
        return (
          <button
            key={t.id}
            onClick={() => onChange && onChange(t.id)}
            className={`relative px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              isActive ? "text-blue-600" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabBadge"
                className="absolute inset-0 bg-white rounded-lg shadow-sm border border-slate-200/60 z-0"
                transition={{ type: "spring", duration: 0.3 }}
              />
            )}
            <span className="relative z-10">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
};
