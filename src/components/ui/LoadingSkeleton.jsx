import React from "react";

export const LoadingSkeleton = ({
  variant = "card", // "card", "text", "avatar", "list"
  count = 1,
  className = "",
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="animate-pulse bg-slate-200 rounded-xl overflow-hidden p-4">
          {variant === "card" && (
            <div className="space-y-3">
              <div className="h-32 bg-slate-300 rounded-lg" />
              <div className="h-4 bg-slate-300 rounded w-3/4" />
              <div className="h-3 bg-slate-300 rounded w-1/2" />
            </div>
          )}

          {variant === "text" && (
            <div className="space-y-2">
              <div className="h-4 bg-slate-300 rounded w-full" />
              <div className="h-4 bg-slate-300 rounded w-5/6" />
            </div>
          )}

          {variant === "avatar" && (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-300 rounded-full shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-slate-300 rounded w-1/2" />
                <div className="h-3 bg-slate-300 rounded w-1/3" />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
