import React, { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

export const PasswordInput = ({
  label = "Password",
  placeholder = "Enter secure password",
  value,
  onChange,
  error,
  required = false,
  className = "",
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full pl-10 pr-10 py-2.5 bg-white border rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none transition-all ${
            error
              ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
              : "border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10"
          }`}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3.5 text-slate-400 hover:text-slate-600"
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {error && <p className="text-xs text-rose-600 font-semibold">{error}</p>}
    </div>
  );
};
