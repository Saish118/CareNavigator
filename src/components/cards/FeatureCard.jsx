import React from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export const FeatureCard = ({
  title = "AI Symptom Triage Protocol",
  description = "Step-by-step clinical evaluation generating immediate severity scores (Level 1 Red to Level 4 Green).",
  icon: Icon = Sparkles,
  badge = "AI Powered",
  onClick,
}) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="h-full flex flex-col justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group space-y-4"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform border border-blue-100 shrink-0">
            <Icon className="w-6 h-6 shrink-0" />
          </div>
          {badge && (
            <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 rounded-md shrink-0">
              {badge}
            </span>
          )}
        </div>

        <div>
          <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
            {title}
          </h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{description}</p>
        </div>
      </div>

      <div className="pt-2 flex items-center gap-1 text-xs font-bold text-blue-600 border-t border-slate-100">
        <span>Explore Feature</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
      </div>
    </motion.div>
  );
};
