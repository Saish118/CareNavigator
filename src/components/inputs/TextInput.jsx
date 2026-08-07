import React from "react";

export const TextInput = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  helperText,
  type = "text",
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

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none transition-all disabled:opacity-50 disabled:bg-slate-50 ${
          error
            ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
            : "border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10"
        }`}
      />

      {error ? (
        <p className="text-xs text-rose-600 font-semibold">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-400 font-medium">{helperText}</p>
      ) : null}
    </div>
  );
};
