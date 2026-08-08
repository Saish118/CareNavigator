import React from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  Phone,
  ShieldCheck,
  Heart,
  MapPin,
  Lock,
  Mail,
  Sparkles,
  ExternalLink,
  Globe,
  Share2,
} from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-24 lg:pb-12 border-t border-slate-800/80 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand info (2 Columns) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/20">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-white tracking-tight">
                  Care<span className="text-blue-400">Navigator</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium block">
                  Hospital Resource Discovery & Navigation
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Real-time hospital resource discovery platform. Check available ICU beds, ER wait times, oxygen stock, and dispatch ambulances across partner healthcare networks.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-400 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Privacy Focused & Encrypted</span>
              </div>

              {/* Built with React + AI Label */}
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800">
                <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                <span>Built with React + AI</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">
              Platform Modules
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium">
              <li>
                <Link to="/hospitals" className="text-slate-300 hover:text-blue-400 transition-colors">
                  Hospital Discovery
                </Link>
              </li>
              <li>
                <Link to="/triage" className="text-slate-300 hover:text-blue-400 transition-colors">
                  Search by Symptoms
                </Link>
              </li>
              <li>
                <Link to="/map" className="text-slate-300 hover:text-blue-400 transition-colors">
                  Emergency Services
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-slate-300 hover:text-blue-400 transition-colors">
                  Hospital Dashboard
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/Saish118/CareNavigator"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-blue-400 transition-colors inline-flex items-center gap-1"
                >
                  GitHub Repository <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">
              Company & Legal
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium">
              <li>
                <Link to="/about" className="text-slate-300 hover:text-blue-400 transition-colors">
                  About CareNavigator
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-300 hover:text-blue-400 transition-colors">
                  Contact Support
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
              <li>
                <Link to="/hospitals" className="text-slate-300 hover:text-blue-400 transition-colors">
                  Partner Facilities
                </Link>
              </li>
            </ul>
          </div>

          {/* Emergency Disclaimer & Socials */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">
              Emergency Note
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800/80">
              CareNavigator is a healthcare resource discovery platform. In case of life-threatening emergencies, dial 911 / 108 immediately.
            </p>

            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
                Connect With Us
              </span>
              <div className="flex items-center gap-2">
                {/* GitHub */}
                <a
                  href="https://github.com/Saish118/CareNavigator"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-800 transition-all cursor-pointer"
                  title="GitHub Repository"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </a>
                {/* Twitter / X */}
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-800 transition-all cursor-pointer"
                  title="Twitter / X"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                {/* LinkedIn */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-800 transition-all cursor-pointer"
                  title="LinkedIn"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.77a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
                  </svg>
                </a>
                {/* Email */}
                <a
                  href="mailto:support@carenavigator.org"
                  className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-800 transition-all cursor-pointer"
                  title="Email Us"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider line */}
        <div className="border-t border-slate-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} CareNavigator Technologies. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-slate-400 transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-slate-400 transition-colors">
              Terms
            </Link>
            <div className="flex items-center gap-1 text-slate-400">
              <span>Crafted for healthcare discovery</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 ml-0.5" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
