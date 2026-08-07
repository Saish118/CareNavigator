import React from "react";
import { Filter, RotateCcw, SlidersHorizontal, ShieldCheck, Plane, Flame } from "lucide-react";
import { SPECIALTY_OPTIONS, INSURANCE_OPTIONS, AMENITY_OPTIONS } from "../../data/hospitalsData";
import { Button } from "../common/Button";

export const HospitalFilter = ({
  filters,
  onChange,
  onReset,
  totalResultsCount = 0,
}) => {
  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-md space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
          <SlidersHorizontal className="w-4 h-4 text-sky-600" />
          <span>Smart AI Hospital Filters</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-sky-600 hover:text-sky-800 flex items-center gap-1 transition-colors"
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
          className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10"
        >
          <option value="aiMatch">Highest AI Match Score</option>
          <option value="distance">Nearest Distance (km)</option>
          <option value="waitTime">Shortest ER Wait Time</option>
          <option value="icuBeds">Most Available ICU Beds</option>
          <option value="rating">Top Patient Rating</option>
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
          className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10"
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
            {filters.maxDistanceKm || 15} km
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="30"
          value={filters.maxDistanceKm || 15}
          onChange={(e) => onChange({ ...filters, maxDistanceKm: Number(e.target.value) })}
          className="w-full accent-sky-600 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1">
          <span>1 km</span>
          <span>15 km</span>
          <span>30 km</span>
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
          className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10"
        >
          {INSURANCE_OPTIONS.map((ins, i) => (
            <option key={i} value={ins}>
              {ins}
            </option>
          ))}
        </select>
      </div>

      {/* Toggle Ticks */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={!!filters.requireIcu}
            onChange={(e) => onChange({ ...filters, requireIcu: e.target.checked })}
            className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 accent-sky-600"
          />
          <span className="text-xs font-semibold text-slate-800">Must have available ICU Bed</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={!!filters.requireHeliport}
            onChange={(e) => onChange({ ...filters, requireHeliport: e.target.checked })}
            className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 accent-sky-600"
          />
          <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
            <Plane className="w-3.5 h-3.5 text-slate-500" /> Helicopter Pad Onsite
          </span>
        </label>
      </div>

      <div className="pt-2 text-xs font-bold text-slate-500 text-center">
        Showing <span className="text-sky-600">{totalResultsCount}</span> hospitals matching criteria
      </div>
    </div>
  );
};
