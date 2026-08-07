import React from "react";
import { Link } from "react-router-dom";
import { Activity, Phone, ShieldCheck, Heart, MapPin } from "lucide-react";
import { EMERGENCY_HOTLINES } from "../../data/emergencyContacts";

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-24 lg:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Care<span className="text-blue-400">Navigator</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              AI-Powered Hospital Recommendation, Real-time ICU Bed Tracker, & Emergency Siren Corridor Navigation System.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              HIPAA & Medical Protocol Compliant
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Emergency Modules
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/hospitals" className="hover:text-blue-400 transition-colors">
                  AI Hospital Recommender
                </Link>
              </li>
              <li>
                <Link to="/beds" className="hover:text-blue-400 transition-colors">
                  Real-Time ICU Bed Availability
                </Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-blue-400 transition-colors">
                  Emergency Siren Route Navigator
                </Link>
              </li>
              <li>
                <Link to="/triage" className="hover:text-blue-400 transition-colors">
                  AI Symptom Triage Assistant
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="hover:text-blue-400 transition-colors">
                  Regional Healthcare Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Emergency Hotlines */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Regional Helplines
            </h4>
            <ul className="space-y-3">
              {EMERGENCY_HOTLINES.map((h, i) => (
                <li key={i} className="text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-rose-400">
                    <Phone className="w-3.5 h-3.5" />
                    {h.name}: {h.number}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{h.description}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Disclaimer & Location */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Emergency Disclaimer
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed bg-slate-800/50 p-3 rounded-xl border border-slate-800">
              CareNavigator is an emergency response & navigation aid. In case of life-threatening emergencies, dial 911 or your local emergency dispatch immediately.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span>Metro City Healthcare Region</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} CareNavigator Health Technologies. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with precision for healthcare emergency responders</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 ml-1" />
          </div>
        </div>
      </div>
    </footer>
  );
};
