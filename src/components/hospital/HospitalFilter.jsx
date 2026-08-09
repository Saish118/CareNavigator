import React from "react";
import { Filter, RotateCcw, SlidersHorizontal, ShieldCheck, Plane, Flame, Clock, Ambulance, CreditCard, MapPin, Building2 } from "lucide-react";
import { SPECIALTY_OPTIONS, INSURANCE_OPTIONS } from "../../data/hospitalsData";

export const HospitalFilter = ({
  filters,
  onChange,
  onReset,
  cityOptions = [],
  userLocation = null,
  totalResultsCount = 0,
}) => {
  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-md space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
          <SlidersHorizontal className="w-4 h-4 text-sky-600" />
          <span>Hospital Filters</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-sky-600 hover:text-sky-800 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      {/* Sort By Criteria */}
      <div>
        <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
          Sort Results By
        </label>
        <select
          value={filters.sortBy || "aiMatch"}
          onChange={(e) => onChange({ ...filters, sortBy: e.target.value })}
          className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 cursor-pointer"
        >
          <option value="aiMatch">Highest Recommended</option>
          <option value="distance">Nearest Distance (km)</option>
          <option value="waitTime">Shortest ER Wait Time</option>
          <option value="icuBeds">Most Available ICU Beds</option>
          <option value="rating">Top Patient Rating</option>
        </select>
      </div>

      {/* City / Location Selector */}
      <div>
        <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
          City / Location
        </label>
        <select
          value={filters.city || "Near Me"}
          onChange={(e) => onChange({ ...filters, city: e.target.value })}
          className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 cursor-pointer"
        >
          {(cityOptions && cityOptions.length > 0 ? cityOptions : ["Near Me", "All Cities"]).map((c, i) => (
            <option key={i} value={c}>
              {c === "Near Me" ? "📍 Near Me (Current Location)" : c}
            </option>
          ))}
        </select>
      </div>

      {/* Specialty Selector */}
      <div>
        <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
          Medical Specialty
        </label>
        <select
          value={filters.specialty || "All Specialties"}
          onChange={(e) => onChange({ ...filters, specialty: e.target.value })}
          className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 cursor-pointer"
        >
          {SPECIALTY_OPTIONS.map((spec, i) => (
            <option key={i} value={spec}>
              {spec}
            </option>
          ))}
        </select>
      </div>

      {/* Max Distance Slider */}
      <div>
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
          <span>Max Radius Distance</span>
          <span className="text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">
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
          className="w-full accent-sky-600 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1">
          <span>10 km</span>
          <span>250 km</span>
          <span>500 km (All)</span>
        </div>
      </div>

      {/* Insurance Provider */}
      <div>
        <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
          Insurance Provider
        </label>
        <select
          value={filters.insurance || "All Insurance Providers"}
          onChange={(e) => onChange({ ...filters, insurance: e.target.value })}
          className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 cursor-pointer"
        >
          {INSURANCE_OPTIONS.map((ins, i) => (
            <option key={i} value={ins}>
              {ins}
            </option>
          ))}
        </select>
      </div>

      {/* Practical Filters (Requirement 8) */}
      <div className="space-y-3 pt-3 border-t border-slate-100">
        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
          Practical Filters
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={!!filters.openNow}
            onChange={(e) => onChange({ ...filters, openNow: e.target.checked })}
            className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 accent-sky-600"
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
            className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 accent-sky-600"
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
            className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 accent-sky-600"
          />
          <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
            <Ambulance className="w-3.5 h-3.5 text-blue-600" /> Accepts Ambulance
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={!!filters.cashlessInsurance}
            onChange={(e) => onChange({ ...filters, cashlessInsurance: e.target.checked })}
            className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 accent-sky-600"
          />
          <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-purple-600" /> Cashless Insurance
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={!!filters.requireIcu}
            onChange={(e) => onChange({ ...filters, requireIcu: e.target.checked })}
            className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 accent-sky-600"
          />
          <span className="text-xs font-semibold text-slate-800">Must have ICU Bed</span>
        </label>
      </div>

      <div className="pt-2 text-xs font-bold text-slate-500 text-center">
        Showing <span className="text-sky-600">{totalResultsCount}</span> hospitals matching criteria
      </div>
    </div>
  );
};
