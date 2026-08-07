import React from "react";

export const Badge = ({
  children,
  variant = "info", // "critical", "warning", "success", "info", "sky", "purple", "slate"
  size = "md", // "sm", "md", "lg"
  pulse = false,
  className = "",
  icon: Icon,
}) => {
  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs font-semibold gap-1",
    md: "px-2.5 py-1 text-xs font-bold gap-1.5",
    lg: "px-3.5 py-1.5 text-sm font-bold gap-2",
  };

  const variantStyles = {
    critical: "bg-rose-100 text-rose-700 border border-rose-200",
    warning: "bg-amber-100 text-amber-800 border border-amber-200",
    success: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    info: "bg-sky-100 text-sky-800 border border-sky-200",
    sky: "bg-blue-100 text-blue-800 border border-blue-200",
    purple: "bg-purple-100 text-purple-800 border border-purple-200",
    slate: "bg-slate-100 text-slate-700 border border-slate-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full transition-all ${sizeStyles[size]} ${variantStyles[variant]} ${
        pulse ? "animate-pulse" : ""
      } ${className}`}
    >
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {children}
    </span>
  );
};
