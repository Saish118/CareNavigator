import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Activity, Stethoscope, Navigation, Flame, User, LogIn } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const MobileNav = () => {
  const location = useLocation();
  const { currentUser } = useAuth();

  const navItems = [
    { name: "Home", path: "/", icon: Activity },
    { name: "Hospitals", path: "/hospitals", icon: Stethoscope },
    { name: "Emergency", path: "/map", icon: Navigation },
    { name: "Triage", path: "/triage", icon: Flame },
    currentUser
      ? { name: "Profile", path: "/profile", icon: User }
      : { name: "Sign In", path: "/login", icon: LogIn },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-1 py-1.5 shadow-lg max-w-full overflow-hidden">
      <div className="flex items-center justify-around w-full max-w-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-0.5 px-1.5 py-1 rounded-xl transition-all min-w-0 flex-1 ${
                isActive
                  ? "text-blue-600 font-bold bg-blue-50/80"
                  : "text-slate-500 font-medium hover:text-slate-900"
              }`}
            >
              <Icon className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${isActive ? "text-blue-600 scale-105" : "text-slate-400"}`} />
              <span className="text-[9px] sm:text-[10px] tracking-tight truncate max-w-full">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
