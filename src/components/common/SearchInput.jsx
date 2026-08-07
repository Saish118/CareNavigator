import React, { useState } from "react";
import { Search, Sparkles, ArrowRight, X } from "lucide-react";
import { Button } from "./Button";

export const SearchInput = ({
  placeholder = "Ask AI to find hospitals e.g., 'Need cardiology ICU with ventilator near 3 miles'",
  value = "",
  onChange,
  onSearch,
  quickPrompts = [
    "Cardiology ICU",
    "Pediatric ER",
    "Level 1 Trauma",
    "24/7 MRI & Cath Lab",
  ],
}) => {
  const [query, setQuery] = useState(value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  const handlePromptClick = (prompt) => {
    setQuery(prompt);
    if (onChange) onChange(prompt);
    if (onSearch) onSearch(prompt);
  };

  const clearInput = () => {
    setQuery("");
    if (onChange) onChange("");
    if (onSearch) onSearch("");
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="absolute left-4 text-sky-600 flex items-center gap-2">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (onChange) onChange(e.target.value);
          }}
          placeholder={placeholder}
          className="w-full pl-12 pr-28 py-4 bg-white/95 text-slate-800 placeholder-slate-400 rounded-2xl border-2 border-slate-200/80 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 shadow-lg shadow-sky-900/5 text-base outline-none transition-all"
        />

        <div className="absolute right-2 flex items-center gap-1.5">
          {query && (
            <button
              type="button"
              onClick={clearInput}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <Button type="submit" variant="primary" size="md" icon={ArrowRight}>
            Search
          </Button>
        </div>
      </form>

      {/* Quick Prompts */}
      {quickPrompts && quickPrompts.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-3 pl-1">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
            <Search className="w-3 h-3" /> Quick AI Prompts:
          </span>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handlePromptClick(prompt)}
              className="px-3 py-1 text-xs font-medium bg-slate-100/90 hover:bg-sky-50 hover:text-sky-700 text-slate-600 rounded-full border border-slate-200/70 transition-all cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
