import React from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  Phone,
  Mail,
  ShieldAlert,
  Sparkles,
  ChevronRight,
} from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-14 pb-24 lg:pb-12 border-t border-slate-800/80 relative overflow-hidden">
      {/* Subtle Background Ambient Glow */}
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        {/* Main Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          
          {/* 1. BRAND / ABOUT */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/20 shrink-0">
                <Activity className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-white tracking-tight">
                  medi<span className="text-blue-400">NAV</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium block leading-tight">
                  Healthcare Resource Discovery & Emergency Navigation
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              mediNAV helps users discover nearby hospitals, emergency services, specialized care, and healthcare resources through one platform.
            </p>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-blue-400 text-[11px] font-bold rounded-xl border border-slate-800">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>Healthcare Resource Discovery Platform</span>
            </div>
          </div>

          {/* 2. PLATFORM */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm font-medium">
              <li>
                <Link to="/hospitals" className="text-slate-300 hover:text-blue-400 transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" /> Hospital Discovery
                </Link>
              </li>
              <li>
                <Link to="/blood-banks" className="text-slate-300 hover:text-rose-400 transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" /> Blood Banks
                </Link>
              </li>
              <li>
                <Link to="/map" className="text-slate-300 hover:text-blue-400 transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" /> Emergency Map
                </Link>
              </li>
              <li>
                <Link to="/map" className="text-slate-300 hover:text-blue-400 transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" /> Emergency Map
                </Link>
              </li>
              <li>
                <Link to="/triage" className="text-slate-300 hover:text-blue-400 transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" /> Symptom Triage
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="text-slate-300 hover:text-blue-400 transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" /> Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. QUICK LINKS */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm font-medium">
              <li>
                <Link to="/" className="text-slate-300 hover:text-blue-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/hospitals" className="text-slate-300 hover:text-blue-400 transition-colors">
                  Hospitals
                </Link>
              </li>
              <li>
                <Link to="/map" className="text-slate-300 hover:text-blue-400 transition-colors">
                  Emergency Map
                </Link>
              </li>
              <li>
                <Link to="/triage" className="text-slate-300 hover:text-blue-400 transition-colors">
                  Symptom Triage
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-300 hover:text-blue-400 transition-colors">
                  About mediNAV
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-slate-300 hover:text-blue-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-slate-300 hover:text-blue-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. CONTACT / DEVELOPER */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">
              Contact
            </h4>

            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-black text-xs shrink-0 border border-blue-500/30">
                  SJ
                </div>
                <span className="font-extrabold text-white text-sm">Sai Joshi</span>
              </div>

              <div className="space-y-2 text-xs">
                <a
                  href="tel:9511276511"
                  className="flex items-center gap-2.5 text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold">9511276511</span>
                </a>

                <a
                  href="mailto:saishjoshi2004@gmail.com"
                  className="flex items-center gap-2.5 text-slate-300 hover:text-sky-400 transition-colors cursor-pointer break-all"
                >
                  <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                  <span className="font-semibold">saishjoshi2004@gmail.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 5. PROJECT INFORMATION & 6. EMERGENCY DISCLAIMER */}
        <div className="pt-6 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-400">
          {/* Project Information */}
          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 space-y-1.5">
            <span className="font-black text-slate-200 block text-xs">Developed by Sai Joshi</span>
            <p className="leading-relaxed text-slate-400">
              mediNAV is a healthcare resource discovery and emergency navigation platform that helps users find nearby hospitals, emergency services, specialized care, and healthcare resources.
            </p>
          </div>

          {/* Emergency Disclaimer */}
          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-300 text-xs">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Emergency Disclaimer</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Emergency Disclaimer: mediNAV provides healthcare resource discovery and navigation assistance. It does not replace professional medical advice, diagnosis, treatment, or emergency medical services.
            </p>
          </div>
        </div>

        {/* 7. COPYRIGHT */}
        <div className="border-t border-slate-800/80 pt-6 text-center text-xs text-slate-400 font-semibold">
          <p>© 2026 Sai Joshi & mediNAV. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};
