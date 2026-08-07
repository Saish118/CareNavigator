import React from "react";
import { Clock } from "lucide-react";

export const WaitingTimeBadge = ({ minutes = 5 }) => {
  const isQuick = minutes <= 10;
  const isModerate = minutes > 10 && minutes <= 25;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg border ${
        isQuick
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : isModerate
          ? "bg-amber-50 text-amber-800 border-amber-200"
          : "bg-rose-50 text-rose-700 border-rose-200"
      }`}
    >
      <Clock className="w-3.5 h-3.5" />
      <span>ER Wait: {minutes} mins</span>
    </span>
  );
};
