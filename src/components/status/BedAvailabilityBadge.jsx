import React from "react";
import { BedDouble } from "lucide-react";

export const BedAvailabilityBadge = ({
  available = 12,
  total = 50,
  type = "General",
}) => {
  const isLow = available <= 3;
  const isModerate = available > 3 && available <= 10;

  const colorStyles = isLow
    ? "bg-rose-100 text-rose-800 border-rose-200"
    : isModerate
    ? "bg-amber-100 text-amber-900 border-amber-200"
    : "bg-emerald-100 text-emerald-800 border-emerald-200";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg border ${colorStyles}`}
    >
      <BedDouble className="w-3.5 h-3.5" />
      <span>{type}: {available}/{total} Beds</span>
    </span>
  );
};
