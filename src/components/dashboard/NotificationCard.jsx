import React from "react";
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from "lucide-react";

export const NotificationCard = ({
  title = "ICU Capacity Alert",
  message = "St. Jude Metro Cardiac Center has reached 90% ICU occupancy.",
  type = "warning", // "info", "success", "warning", "error"
  onDismiss,
}) => {
  const styles = {
    info: {
      bg: "bg-blue-50 border-blue-200 text-blue-900",
      icon: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
    },
    success: {
      bg: "bg-emerald-50 border-emerald-200 text-emerald-900",
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    },
    warning: {
      bg: "bg-amber-50 border-amber-200 text-amber-900",
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
    },
    error: {
      bg: "bg-rose-50 border-rose-200 text-rose-900",
      icon: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
    },
  };

  const curr = styles[type] || styles.info;

  return (
    <div className={`p-4 rounded-xl border flex items-start justify-between gap-3 text-xs shadow-sm ${curr.bg}`}>
      <div className="flex items-start gap-3">
        {curr.icon}
        <div>
          <h5 className="font-bold text-slate-900">{title}</h5>
          <p className="text-slate-700 mt-0.5 font-medium">{message}</p>
        </div>
      </div>

      {onDismiss && (
        <button
          onClick={onDismiss}
          className="p-1 text-slate-400 hover:text-slate-700 rounded-full shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
