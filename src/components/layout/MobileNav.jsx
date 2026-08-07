import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Activity, Stethoscope, BedDouble, Navigation, Flame, User } from "lucide-react";

export const MobileNav = () => {
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/", icon: Activity },
    { name: "Hospitals", path: "/hospitals", icon: Stethoscope },
    { name: "Beds", path: "/beds", icon: BedDouble },
    { name: "Map", path: "/map", icon: Navigation },
    { name: "Triage", path: "/triage", icon: Flame },
    { name: "Passport", path: "/profile", icon: User },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-2 shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
                isActive
                  ? "text-blue-600 font-bold bg-blue-50"
                  : "text-slate-500 font-medium hover:text-slate-900"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-blue-600 scale-110" : "text-slate-400"}`} />
              <span className="text-[10px] tracking-tight">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
