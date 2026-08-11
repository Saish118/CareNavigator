import React, { useState } from "react";
import { Filter, RotateCcw, SlidersHorizontal, ChevronDown, ChevronUp, Clock, Flame, Ambulance, CreditCard, MapPin, Building2 } from "lucide-react";
import { SPECIALTY_OPTIONS, INSURANCE_OPTIONS } from "../../data/hospitalsData";

export const HospitalFilter = ({
  filters,
  onChange,
  onReset,
  cityOptions = [],
  userLocation = null,
  totalResultsCount = 0,
}) => {
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-md space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
          <SlidersHorizontal className="w-4 h-4 text-blue-600" />
          <span>Filter Hospitals</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      {/* 1. VISIBLE BY DEFAULT: City / Location Selector */}
      <div>
        <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
          City / Location
        </label>
        <select
          value={filters.city || "Near Me"}
          onChange={(e) => onChange({ ...filters, city: e.target.value })}
          className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
        >
          {(cityOptions && cityOptions.length > 0 ? cityOptions : ["Near Me", "All Cities"]).map((c, i) => (
            <option key={i} value={c}>
              {c === "Near Me" ? "📍 Near Me (Current Location)" : c}
            </option>
          ))}
        </select>
      </div>

      {/* 2. VISIBLE BY DEFAULT: Specialty Selector */}
      <div>
        <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
          Medical Specialty
        </label>
        <select
          value={filters.specialty || "All Specialties"}
          onChange={(e) => onChange({ ...filters, specialty: e.target.value })}
          className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
        >
          {SPECIALTY_OPTIONS.map((spec, i) => (
            <option key={i} value={spec}>
              {spec}
            </option>
          ))}
        </select>
      </div>

      {/* 3. VISIBLE BY DEFAULT: Distance Slider */}
      <div>
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
          <span>Max Distance</span>
          <span className="text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100 font-extrabold">
            {filters.maxDistanceKm >= 500 ? "Any Radius" : `${filters.maxDistanceKm} km`}
          </span>
        </div>
        <input
          type="range"
          min="10"
          max="500"
          step="10"
          value={filters.maxDistanceKm || 500}
          onChange={(e) => onChange({ ...filters, maxDistanceKm: Number(e.target.value) })}
          className="w-full accent-blue-600 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1">
          <span>10 km</span>
          <span>250 km</span>
          <span>500 km</span>
        </div>
      </div>

      {/* MORE FILTERS TOGGLE BUTTON (Closed by default) */}
      <div className="pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={() => setShowMoreFilters(!showMoreFilters)}
          className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 flex items-center justify-between transition-colors cursor-pointer"
        >
          <span>{showMoreFilters ? "Fewer Filters" : "More Filters (Insurance, Beds & Services)"}</span>
          {showMoreFilters ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </button>
      </div>

      {/* COLLAPSIBLE ADVANCED FILTERS PANEL */}
      {showMoreFilters && (
        <div className="space-y-4 pt-2 border-t border-slate-100 animate-fadeIn">
          {/* Sort Criteria */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
              Sort By
            </label>
            <select
              value={filters.sortBy || "aiMatch"}
              onChange={(e) => onChange({ ...filters, sortBy: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="aiMatch">Highest Recommended</option>
              <option value="distance">Nearest Distance</option>
              <option value="waitTime">Shortest ER Wait Time</option>
              <option value="icuBeds">Most Available ICU Beds</option>
              <option value="rating">Top Patient Rating</option>
            </select>
          </div>

          {/* Insurance Provider */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
              Insurance Provider
            </label>
            <select
              value={filters.insurance || "All Insurance Providers"}
              onChange={(e) => onChange({ ...filters, insurance: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {INSURANCE_OPTIONS.map((ins, i) => (
                <option key={i} value={ins}>
                  {ins}
                </option>
              ))}
            </select>
          </div>

          {/* Additional Features / Checkboxes */}
          <div className="space-y-2.5 pt-1">
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
              Facility Requirements
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={!!filters.requireIcu}
                onChange={(e) => onChange({ ...filters, requireIcu: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 accent-blue-600"
              />
              <span className="text-xs font-semibold text-slate-800">Must Have ICU Beds</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={!!filters.openNow}
                onChange={(e) => onChange({ ...filters, openNow: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 accent-blue-600"
              />
              <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-600" /> Open Now
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={!!filters.emergency247}
                onChange={(e) => onChange({ ...filters, emergency247: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 accent-blue-600"
              />
              <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-rose-600" /> 24×7 Emergency
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={!!filters.acceptsAmbulance}
                onChange={(e) => onChange({ ...filters, acceptsAmbulance: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 accent-blue-600"
              />
              <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <Ambulance className="w-3.5 h-3.5 text-blue-600" /> Accepts Ambulances
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={!!filters.cashlessInsurance}
                onChange={(e) => onChange({ ...filters, cashlessInsurance: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 accent-blue-600"
              />
              <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-purple-600" /> Cashless Insurance
              </span>
            </label>
          </div>
        </div>
      )}

      <div className="pt-2 text-xs font-bold text-slate-500 text-center border-t border-slate-100">
        Showing <span className="text-blue-600 font-extrabold">{totalResultsCount}</span> hospitals
      </div>
    </div>
  );
};

