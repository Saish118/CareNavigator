import React from "react";
import { Calendar } from "lucide-react";

export const DatePicker = ({
  label,
  value,
  onChange,
  min,
  max,
  error,
  required = false,
  className = "",
}) => {
  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
        <input
          type="date"
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          className={`w-full pl-10 pr-3.5 py-2.5 bg-white border rounded-xl text-sm font-medium text-slate-800 focus:outline-none transition-all ${
            error
              ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
              : "border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10"
          }`}
        />
      </div>

      {error && <p className="text-xs text-rose-600 font-semibold">{error}</p>}
    </div>
  );
};
