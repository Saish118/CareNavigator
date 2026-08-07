import React from "react";

export const SelectInput = ({
  label,
  options = [],
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  className = "",
}) => {
  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm font-medium text-slate-800 focus:outline-none transition-all disabled:opacity-50 ${
          error
            ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
            : "border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10"
        }`}
      >
        {options.map((opt, i) => (
          <option key={i} value={typeof opt === "object" ? opt.value : opt}>
            {typeof opt === "object" ? opt.label : opt}
          </option>
        ))}
      </select>

      {error && <p className="text-xs text-rose-600 font-semibold">{error}</p>}
    </div>
  );
};
