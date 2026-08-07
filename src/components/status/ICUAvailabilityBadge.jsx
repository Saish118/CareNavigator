import React from "react";
import { HeartPulse } from "lucide-react";

export const ICUAvailabilityBadge = ({
  availableCount = 4,
  pulse = true,
}) => {
  const isAvailable = availableCount > 0;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-black rounded-full border ${
        isAvailable
          ? "bg-emerald-500 text-white border-emerald-400 shadow-sm"
          : "bg-rose-600 text-white border-rose-500 animate-pulse"
      }`}
    >
      <HeartPulse className={`w-3.5 h-3.5 ${pulse && isAvailable ? "animate-bounce" : ""}`} />
      <span>{isAvailable ? `${availableCount} ICU Beds Open` : "ICU Full"}</span>
    </span>
  );
};
