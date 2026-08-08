import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Activity,
  BedDouble,
  Navigation,
  Stethoscope,
  BarChart3,
  Bookmark,
  ShieldAlert,
  Flame,
  LayoutDashboard,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { useEmergency } from "../../context/EmergencyContext";
import { useBookmark } from "../../context/BookmarkContext";

export const Navbar = () => {
  const location = useLocation();
  const { triggerSos } = useEmergency();
  const { savedHospitalIds } = useBookmark();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/", icon: Activity },
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Hospitals", path: "/recommendations", icon: Stethoscope },
    { name: "Emergency Services", path: "/map", icon: Navigation },
    { name: "Search by Symptoms", path: "/triage", icon: Flame },
    { name: "Analytics", path: "/analytics", icon: BarChart3 },
    { name: "Passport", path: "/profile", icon: Bookmark, badgeCount: savedHospitalIds.length },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand Logo (Always shrink-0) */}
        <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-sky-600 via-blue-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-sky-500/25 group-hover:scale-105 transition-transform shrink-0">
            <Activity className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Care<span className="text-blue-600">Navigator</span>
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700 rounded-full border border-emerald-200 shrink-0">
                LIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">Hospital Resource Discovery</p>
          </div>
        </Link>

        {/* Center: Desktop Top Navigation Links Bar (Visible on lg/xl screens) */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80 shadow-inner overflow-x-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? "bg-white text-blue-600 shadow-md shadow-blue-500/10 border border-slate-200/80 font-black"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/80"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                <span>{link.name}</span>
                {link.badgeCount > 0 && (
                  <span className="px-1.5 py-0.2 text-[10px] font-black bg-blue-600 text-white rounded-full shrink-0">
                    {link.badgeCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions & SOS Emergency Button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* SOS Emergency Button */}
          <button
            onClick={triggerSos}
            className="h-10 sm:h-11 px-3.5 sm:px-5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-rose-600/30 transition-all flex items-center gap-1.5 sm:gap-2 animate-pulse cursor-pointer shrink-0"
          >
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">SOS EMERGENCY</span>
            <span className="sm:hidden font-black">SOS 911</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors shrink-0"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200 px-4 py-4 space-y-2 shadow-2xl">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 p-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-blue-600"}`} />
                  <span className="truncate">{link.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
