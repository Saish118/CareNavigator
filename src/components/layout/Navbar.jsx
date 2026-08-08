import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  Stethoscope,
  Navigation,
  Flame,
  BarChart3,
  User,
  ShieldAlert,
  Menu,
  X,
  LogIn,
  UserPlus,
  LogOut,
  Bookmark,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useEmergency } from "../../context/EmergencyContext";
import { useToast } from "../ui/ToastNotification";
import { logoutUser } from "../../services/authService";

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { triggerSos } = useEmergency();
  const { addToast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/", icon: Activity },
    { name: "Hospitals", path: "/hospitals", icon: Stethoscope },
    { name: "Emergency Map", path: "/map", icon: Navigation },
    { name: "Symptom Triage", path: "/triage", icon: Flame },
    { name: "Analytics", path: "/analytics", icon: BarChart3 },
  ];

  const handleLogout = async () => {
    try {
      await logoutUser();
      addToast("Signed out successfully", "success");
      setMobileMenuOpen(false);
      navigate("/");
    } catch (error) {
      addToast(error.message || "Failed to sign out", "error");
    }
  };

  const displayName = currentUser?.displayName || currentUser?.email?.split("@")[0] || "Profile";

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand Logo */}
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

        {/* Center: Desktop Top Navigation Links Bar */}
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
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions (Auth Buttons & SOS Emergency) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Authentication Entry Flow Buttons */}
          {currentUser ? (
            /* Authenticated State Buttons */
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/profile"
                className={`px-3.5 py-2 text-xs font-bold rounded-xl border flex items-center gap-2 transition-all ${
                  location.pathname === "/profile"
                    ? "bg-blue-50 text-blue-700 border-blue-200 shadow-xs"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200"
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black uppercase">
                  {displayName.charAt(0)}
                </div>
                <span className="max-w-[100px] truncate">{displayName}</span>
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Unauthenticated State Buttons */
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-blue-600" />
                <span>Log In</span>
              </Link>

              <Link
                to="/register"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-sm shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Account</span>
              </Link>
            </div>
          )}

          {/* SOS Emergency Button */}
          <button
            onClick={triggerSos}
            className="h-10 sm:h-11 px-3 sm:px-4 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-black text-xs sm:text-xs rounded-xl shadow-lg shadow-rose-600/30 transition-all flex items-center gap-1.5 sm:gap-2 animate-pulse cursor-pointer shrink-0"
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
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200 px-4 py-4 space-y-3 shadow-2xl">
          {/* Auth Bar for Mobile */}
          <div className="pb-3 border-b border-slate-100">
            {currentUser ? (
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black uppercase">
                    {displayName.charAt(0)}
                  </div>
                  <div>
                    <span className="font-extrabold text-slate-900 text-xs block leading-tight">{displayName}</span>
                    <span className="text-[10px] text-blue-600 font-semibold">View Profile →</span>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 bg-rose-50 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl text-center flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-4 h-4 text-blue-600" /> Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl text-center flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <UserPlus className="w-4 h-4" /> Create Account
                </Link>
              </div>
            )}
          </div>

          {/* Navigation Links */}
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

            {/* Profile Link in Mobile List */}
            {currentUser && (
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 p-3 rounded-xl text-xs font-bold transition-all ${
                  location.pathname === "/profile"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <User className="w-4 h-4 shrink-0 text-blue-600" />
                <span className="truncate">My Profile</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
