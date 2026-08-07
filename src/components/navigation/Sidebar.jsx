import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Stethoscope,
  BedDouble,
  Navigation,
  Flame,
  BarChart3,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { useEmergency } from "../../context/EmergencyContext";

export const Sidebar = ({ collapsed = false, onToggleCollapse }) => {
  const location = useLocation();
  const { triggerSos } = useEmergency();
  const [isCollapsed, setIsCollapsed] = useState(collapsed);

  const toggle = () => {
    setIsCollapsed((prev) => !prev);
    if (onToggleCollapse) onToggleCollapse(!isCollapsed);
  };

  const navLinks = [
    { name: "User Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Hospitals Search", path: "/hospitals", icon: Stethoscope },
    { name: "Live Bed Tracker", path: "/beds", icon: BedDouble },
    { name: "Emergency Route", path: "/map", icon: Navigation },
    { name: "AI Symptom Triage", path: "/triage", icon: Flame },
    { name: "Regional Analytics", path: "/analytics", icon: BarChart3 },
    { name: "Medical Passport ID", path: "/profile", icon: Bookmark },
  ];

  return (
    <aside
      className={`bg-slate-900 text-white min-h-screen p-4 border-r border-slate-800 transition-all duration-300 flex flex-col justify-between ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="space-y-6">
        {/* Logo & Toggle */}
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <Link to="/" className="flex items-center gap-2 font-black text-lg tracking-tight">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <span>Care<span className="text-blue-400">Nav</span></span>
            </Link>
          )}

          <button
            onClick={toggle}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors mx-auto cursor-pointer"
            aria-label="Toggle Sidebar"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation items */}
        <nav className="space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;

            return (
              <Link
                key={link.path}
                to={link.path}
                title={isCollapsed ? link.name : ""}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span className="truncate">{link.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Emergency SOS Trigger */}
      <div className="pt-4 border-t border-slate-800">
        <button
          onClick={triggerSos}
          className={`w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition-all cursor-pointer ${
            isCollapsed ? "px-2" : "px-4"
          }`}
        >
          <ShieldAlert className="w-4 h-4 shrink-0 animate-pulse" />
          {!isCollapsed && <span>SOS 911</span>}
        </button>
      </div>
    </aside>
  );
};
