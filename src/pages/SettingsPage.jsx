import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, ArrowLeft, Bell, Lock, Smartphone, ShieldCheck } from "lucide-react";
import { Breadcrumb } from "../components/ui/Breadcrumb";
import { PrimaryButton } from "../components/buttons/PrimaryButton";
import { useToast } from "../components/ui/ToastNotification";

export const SettingsPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [sosAutoDispatch, setSosAutoDispatch] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [darkTheme, setDarkTheme] = useState(false);

  const handleSave = () => {
    addToast("Settings updated successfully!", "success");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumb items={[{ label: "Dashboard", path: "/dashboard" }, { label: "Settings" }]} />
        <button
          onClick={() => navigate(-1)}
          className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>

      <div className="space-y-1">
        <h1 className="text-3xl font-black text-slate-900">Application Settings</h1>
        <p className="text-xs text-slate-500 font-medium">
          Configure emergency SOS triggers, telemetry alerts, and personal preferences.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Emergency SOS Auto-Dispatch</h4>
              <p className="text-xs text-slate-500">Automatically send GPS coordinates after 5-second SOS countdown.</p>
            </div>
            <input
              type="checkbox"
              checked={sosAutoDispatch}
              onChange={(e) => setSosAutoDispatch(e.target.checked)}
              className="w-5 h-5 accent-blue-600 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Real-time ICU Bed Alerts</h4>
              <p className="text-xs text-slate-500">Receive notifications when ICU beds open up in saved hospitals.</p>
            </div>
            <input
              type="checkbox"
              checked={pushNotifications}
              onChange={(e) => setPushNotifications(e.target.checked)}
              className="w-5 h-5 accent-blue-600 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">HIPAA Privacy Protocol</h4>
              <p className="text-xs text-slate-500">Enforce zero-knowledge encryption on local medical ID passport.</p>
            </div>
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-md">
              Active
            </span>
          </div>
        </div>

        <div className="pt-4 border-t flex justify-end">
          <PrimaryButton onClick={handleSave} icon={ShieldCheck}>
            Save Preferences
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};
