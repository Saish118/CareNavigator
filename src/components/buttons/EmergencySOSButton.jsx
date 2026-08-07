import React from "react";
import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";

export const EmergencySOSButton = ({
  children = "SOS EMERGENCY",
  onClick,
  size = "md",
  disabled = false,
  fullWidth = false,
  className = "",
}) => {
  const sizes = {
    sm: "h-9 px-3.5 text-xs gap-1.5 rounded-xl",
    md: "h-11 px-4.5 text-sm gap-2 rounded-xl",
    lg: "h-12 px-6 text-base gap-2.5 rounded-xl shadow-lg",
  };

  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.96 }}
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center font-black bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-lg shadow-rose-600/35 transition-all focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 animate-pulse cursor-pointer shrink-0 ${
        sizes[size]
      } ${fullWidth ? "w-full" : ""} ${className}`}
    >
      <ShieldAlert className={`shrink-0 ${size === "sm" ? "w-4 h-4" : size === "lg" ? "w-5 h-5" : "w-4 h-4"}`} />
      <span className="truncate">{children}</span>
    </motion.button>
  );
};
