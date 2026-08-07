import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Tooltip = ({
  content = "Tooltip text",
  children,
  position = "top", // "top", "bottom", "left", "right"
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionStyles = {
    top: "-top-9 left-1/2 -translate-x-1/2",
    bottom: "-bottom-9 left-1/2 -translate-x-1/2",
    left: "top-1/2 -left-28 -translate-y-1/2",
    right: "top-1/2 -right-28 -translate-y-1/2",
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`absolute z-30 px-2.5 py-1 text-[11px] font-bold text-white bg-slate-900 rounded-md shadow-lg pointer-events-none whitespace-nowrap ${positionStyles[position]}`}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
