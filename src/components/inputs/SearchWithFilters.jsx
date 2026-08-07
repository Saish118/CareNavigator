import React, { useState } from "react";
import { Search, SlidersHorizontal, ChevronDown, Check } from "lucide-react";

export const SearchWithFilters = ({
  placeholder = "Search trauma centers or specialties...",
  filterOptions = ["Cardiology", "Trauma", "Pediatrics", "ICU Beds"],
  onSearch,
  onFilterChange,
}) => {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("");

  const handleFilterSelect = (filter) => {
    const next = activeFilter === filter ? "" : filter;
    setActiveFilter(next);
    if (onFilterChange) onFilterChange(next);
  };

  return (
    <div className="space-y-3 w-full">
      <div className="relative flex items-center">
        <Search className="w-5 h-5 text-slate-400 absolute left-3.5" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (onSearch) onSearch(e.target.value);
          }}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 shadow-sm"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
          <SlidersHorizontal className="w-3.5 h-3.5" /> Quick Filter:
        </span>
        {filterOptions.map((opt, idx) => {
          const isActive = activeFilter === opt;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleFilterSelect(opt)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all border cursor-pointer ${
                isActive
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
};
