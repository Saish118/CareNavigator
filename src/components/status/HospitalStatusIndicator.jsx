import React from "react";

export const HospitalStatusIndicator = ({
  status = "Operational", // "Operational", "Surge Capacity", "Diversion / Full"
  showLabel = true,
}) => {
  const styles = {
    Operational: {
      dot: "bg-emerald-500",
      ping: "bg-emerald-400",
      text: "text-emerald-700",
      bg: "bg-emerald-50 border-emerald-200",
    },
    "Surge Capacity": {
      dot: "bg-amber-500",
      ping: "bg-amber-400",
      text: "text-amber-800",
      bg: "bg-amber-50 border-amber-200",
    },
    "Diversion / Full": {
      dot: "bg-rose-500",
      ping: "bg-rose-400",
      text: "text-rose-700",
      bg: "bg-rose-50 border-rose-200",
    },
  };

  const curr = styles[status] || styles.Operational;

  return (
    <span
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-xs font-bold ${curr.bg}`}
    >
      <span className="relative flex h-2 w-2">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${curr.ping}`} />
        <span className={`relative inline-flex rounded-full h-2 w-2 ${curr.dot}`} />
      </span>
      {showLabel && <span className={curr.text}>{status}</span>}
    </span>
  );
};
