import React from "react";
import { User, Bookmark, BedDouble, HeartPulse } from "lucide-react";
import { EmergencyIDCard } from "../components/profile/EmergencyIDCard";
import { BookingHistory } from "../components/profile/BookingHistory";

export const ProfilePage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-black text-sky-600 uppercase tracking-wider">
          <User className="w-4 h-4" /> Patient Command Profile
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Medical Emergency Passport & Saved Bookings
        </h1>
        <p className="text-sm text-slate-600 font-medium mt-1">
          Manage your personal medical emergency ID, blood type details, and active ICU bed reservations.
        </p>
      </div>

      {/* Grid: Medical ID Card + Booking History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <EmergencyIDCard />
        <BookingHistory />
      </div>
    </div>
  );
};
