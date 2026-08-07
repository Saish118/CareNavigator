import React from "react";
import { motion } from "framer-motion";

export const PrimaryButton = ({
  children,
  onClick,
  size = "md", // "sm", "md", "lg"
  icon: Icon,
  disabled = false,
  fullWidth = false,
  type = "button",
  className = "",
}) => {
  const sizes = {
    sm: "h-9 px-3 text-xs gap-1.5 rounded-xl",
    md: "h-11 px-4.5 text-sm gap-2 rounded-xl",
    lg: "h-12 px-6 text-base gap-2.5 rounded-xl",
  };

  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center font-bold bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-md shadow-blue-600/20 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer min-w-0 ${
        sizes[size]
      } ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {Icon && <Icon className={`shrink-0 ${size === "sm" ? "w-4 h-4" : size === "lg" ? "w-5 h-5" : "w-4 h-4"}`} />}
      <span className="truncate">{children}</span>
    </motion.button>
  );
};
