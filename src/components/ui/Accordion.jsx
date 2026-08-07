import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Accordion = ({
  items = [
    {
      title: "How does the AI calculate hospital match percentage?",
      content:
        "The AI algorithm evaluates required specialty, live ICU bed availability, estimated traffic travel time, insurance acceptance, and past patient rating metrics.",
    },
    {
      title: "What is Emergency Siren Priority Corridor?",
      content:
        "When Siren Priority mode is active, CareNavigator routes the vehicle through clear emergency transit corridors, reducing average drive times by 35%.",
    },
  ],
}) => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-2.5 w-full">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div key={idx} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <button
              onClick={() => toggle(idx)}
              className="w-full p-4 flex items-center justify-between text-left text-sm font-bold text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <span>{item.title}</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  isOpen ? "rotate-180 text-blue-600" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-4 pb-4 text-xs text-slate-600 font-medium leading-relaxed border-t border-slate-100 pt-3"
                >
                  {item.content}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
