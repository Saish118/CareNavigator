import React from "react";
import { motion } from "framer-motion";

export const IconButton = ({
  icon: Icon,
  onClick,
  variant = "glass", // "primary", "secondary", "danger", "glass"
  size = "md", // "sm", "md", "lg"
  title,
  disabled = false,
  className = "",
}) => {
  const sizes = {
    sm: "w-9 h-9 rounded-xl text-xs",
    md: "w-11 h-11 rounded-xl text-sm",
    lg: "w-12 h-12 rounded-2xl text-base",
  };

  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200",
    danger: "bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200",
    glass: "bg-white/80 hover:bg-white text-slate-700 border border-slate-200 shadow-sm backdrop-blur-md",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.92 }}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title || "Icon button"}
      className={`inline-flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 cursor-pointer shrink-0 ${
        sizes[size]
      } ${variants[variant]} ${className}`}
    >
      {Icon && <Icon className={iconSizes[size]} />}
    </motion.button>
  );
};
