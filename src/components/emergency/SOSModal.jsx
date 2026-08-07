import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert,
  PhoneCall,
  X,
  MapPin,
  Ambulance,
  CheckCircle2,
  AlertTriangle,
  Radio,
} from "lucide-react";
import { useEmergency } from "../../context/EmergencyContext";
import { Button } from "../common/Button";
import { MOCK_AMBULANCES } from "../../data/emergencyContacts";

export const SOSModal = () => {
  const {
    isSosActive,
    sosCountdown,
    sosDispatched,
    cancelSos,
    confirmSosDispatch,
    setSosCountdown,
    userLocation,
  } = useEmergency();

  useEffect(() => {
    let timer;
    if (isSosActive && !sosDispatched && sosCountdown > 0) {
      timer = setInterval(() => {
        setSosCountdown((prev) => prev - 1);
      }, 1000);
    } else if (isSosActive && sosCountdown === 0 && !sosDispatched) {
      confirmSosDispatch();
    }
    return () => clearInterval(timer);
  }, [isSosActive, sosCountdown, sosDispatched, setSosCountdown, confirmSosDispatch]);

  if (!isSosActive) return null;

  const assignedAmbulance = MOCK_AMBULANCES[0];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-rose-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border-4 border-rose-500 overflow-hidden"
        >
          {/* Header Banner */}
          <div className="bg-rose-600 px-6 py-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-lg">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
              <span>CRITICAL SOS EMERGENCY DISPATCH</span>
            </div>
            <button
              onClick={cancelSos}
              className="p-1.5 bg-rose-700 hover:bg-rose-800 rounded-full text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 text-center space-y-6">
            {!sosDispatched ? (
              <>
                {/* Countdown visualizer */}
                <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-rose-200 animate-ping opacity-75" />
                  <div className="w-32 h-32 rounded-full bg-rose-50 border-4 border-rose-500 flex flex-col items-center justify-center shadow-inner">
                    <span className="text-5xl font-black text-rose-600 tracking-tight">
                      {sosCountdown}
                    </span>
                    <span className="text-[11px] font-bold text-rose-500 uppercase tracking-widest mt-1">
                      Seconds
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900">
                    Connecting to Emergency Hotline (911 / 108)
                  </h3>
                  <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
                    Sending GPS position <span className="font-bold text-slate-800">[{userLocation.city}]</span> & alert signals to 3 nearest Trauma Centers.
                  </p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3 text-left">
                  <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                  <p className="text-xs text-amber-800 font-medium">
                    If this is an accidental trigger, press cancel immediately before dispatch locks in.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
                  <Button
                    onClick={confirmSosDispatch}
                    variant="sos"
                    size="lg"
                    icon={PhoneCall}
                    className="w-full sm:w-auto"
                  >
                    DISPATCH NOW IMMEDIATELY
                  </Button>
                  <Button
                    onClick={cancelSos}
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto border-slate-300 text-slate-700"
                  >
                    CANCEL SOS
                  </Button>
                </div>
              </>
            ) : (
              /* Dispatched Confirmation Screen */
              <div className="space-y-6">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-lg">
                  <CheckCircle2 className="w-12 h-12" />
                </div>

                <div>
                  <h3 className="text-2xl font-black text-slate-900">
                    AMBULANCE & TRAUMA DISPATCHED!
                  </h3>
                  <p className="text-sm text-emerald-700 font-bold mt-1">
                    Advanced Life Support Unit #{assignedAmbulance.id} is en route.
                  </p>
                </div>

                {/* Dispatch Details Card */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-xs font-semibold text-slate-500">Dispatch Status</span>
                    <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-1">
                      <Radio className="w-3 h-3 animate-pulse" /> Live Tracking Active
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-500 font-medium block">Ambulance Unit</span>
                      <span className="font-bold text-slate-900">{assignedAmbulance.type}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium block">Estimated Arrival</span>
                      <span className="font-extrabold text-rose-600 text-sm">
                        {assignedAmbulance.etaMin} Mins
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium block">Lead Paramedic</span>
                      <span className="font-bold text-slate-900">{assignedAmbulance.paramedic}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium block">GPS Location</span>
                      <span className="font-bold text-slate-900">{userLocation.city}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <a
                    href="tel:911"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-lg shadow-rose-600/30 text-sm"
                  >
                    <PhoneCall className="w-4 h-4" /> Call 911 Directly
                  </a>
                  <Button onClick={cancelSos} variant="secondary" size="lg" className="w-full sm:w-auto">
                    Close Alert Window
                  </Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
