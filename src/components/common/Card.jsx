import React from "react";
import { motion } from "framer-motion";

export const Card = ({
  children,
  className = "",
  hoverEffect = true,
  onClick,
  glass = true,
}) => {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -4 } : {}}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onClick={onClick}
      className={`rounded-2xl transition-all duration-300 ${
        glass
          ? "bg-white/90 backdrop-blur-md border border-slate-100/90 shadow-xl shadow-slate-900/5"
          : "bg-white border border-slate-200 shadow-md"
      } ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      {children}
    </motion.div>
  );
};
