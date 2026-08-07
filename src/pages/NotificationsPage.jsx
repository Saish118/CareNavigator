import React from "react";
import { useNavigate } from "react-router-dom";
import { Bell, ArrowLeft, BedDouble, Calendar, Activity, Info } from "lucide-react";
import { Breadcrumb } from "../components/ui/Breadcrumb";
import { NotificationCard } from "../components/dashboard/NotificationCard";

export const NotificationsPage = () => {
  const navigate = useNavigate();

  const notifications = [
    {
      id: 1,
      type: "warning",
      title: "Bed Hold Expiration Warning",
      message: "Your ICU bed reservation at St. Jude Cardiac Center expires in 25 minutes.",
    },
    {
      id: 2,
      type: "success",
      title: "Telemetry Update",
      message: "2 new Ventilator beds opened up at Trinity Pulmonary Facility.",
    },
    {
      id: 3,
      type: "error",
      title: "Emergency Siren Corridor Alert",
      message: "Priority Siren Corridor active on East Highway Bypass.",
    },
    {
      id: 4,
      type: "info",
      title: "System Update",
      message: "CareNavigator AI algorithm updated with 2026 Triage Guidelines.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumb items={[{ label: "Dashboard", path: "/dashboard" }, { label: "Notifications" }]} />
        <button
          onClick={() => navigate(-1)}
          className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>

      <div>
        <h1 className="text-3xl font-black text-slate-900">Emergency Notifications & Alerts</h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Real-time updates regarding bed holds, telemetry changes, and emergency corridor status.
        </p>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <NotificationCard key={n.id} title={n.title} message={n.message} type={n.type} />
        ))}
      </div>
    </div>
  );
};
