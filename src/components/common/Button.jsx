import React from "react";
import { motion } from "framer-motion";

export const Button = ({
  children,
  onClick,
  variant = "primary", // "primary", "sos", "emerald", "glass", "outline", "secondary"
  size = "md", // "sm", "md", "lg", "xl"
  className = "",
  disabled = false,
  icon: Icon,
  type = "button",
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0";

  const sizeStyles = {
    sm: "h-9 px-3.5 text-xs gap-1.5",
    md: "h-11 px-4.5 text-sm gap-2",
    lg: "h-12 px-6 text-base gap-2.5",
    xl: "h-14 px-8 text-lg gap-3 shadow-lg",
  };

  const variantStyles = {
    primary:
      "bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white shadow-md shadow-sky-600/20 focus:ring-sky-500",
    sos:
      "bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-lg shadow-rose-600/30 focus:ring-rose-500 animate-pulse",
    emerald:
      "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-md shadow-emerald-600/20 focus:ring-emerald-500",
    glass:
      "bg-white/80 hover:bg-white text-slate-800 backdrop-blur-md border border-slate-200 shadow-sm focus:ring-sky-400",
    outline:
      "bg-transparent border-2 border-slate-300 hover:border-sky-600 hover:text-sky-600 text-slate-700 focus:ring-sky-500",
    secondary:
      "bg-slate-100 hover:bg-slate-200 text-slate-800 focus:ring-slate-400",
  };

  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {Icon && <Icon className={`shrink-0 ${size === "sm" ? "w-4 h-4" : size === "lg" ? "w-5 h-5" : "w-4 h-4"}`} />}
      <span className="truncate">{children}</span>
    </motion.button>
  );
};
