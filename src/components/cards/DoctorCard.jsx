import React from "react";
import { Star, Calendar } from "lucide-react";
import { PrimaryButton } from "../buttons/PrimaryButton";

export const DoctorCard = ({
  doctor = {
    name: "Dr. Sarah Jenkins",
    specialty: "Chief of Emergency Cardiology",
    hospital: "St. Jude Metro Cardiac Center",
    rating: 4.9,
    reviews: 240,
    experienceYears: 14,
    status: "Available Today",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
  },
  onBookAppointment,
}) => {
  return (
    <div className="h-full flex flex-col justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4">
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <img
            src={doctor.image}
            alt={doctor.name}
            className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <h4 className="font-bold text-slate-900 text-base truncate">{doctor.name}</h4>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-md shrink-0">
                {doctor.status}
              </span>
            </div>
            <p className="text-xs text-blue-600 font-semibold mt-0.5">{doctor.specialty}</p>
            <p className="text-xs text-slate-500 truncate">{doctor.hospital}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <div>
            <span className="text-slate-400 text-[10px] block">Rating</span>
            <span className="font-bold text-slate-800 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" /> {doctor.rating} ({doctor.reviews})
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">Experience</span>
            <span className="font-bold text-slate-800">{doctor.experienceYears}+ Years</span>
          </div>
        </div>
      </div>

      <PrimaryButton
        onClick={() => onBookAppointment && onBookAppointment(doctor)}
        size="sm"
        fullWidth
        icon={Calendar}
      >
        Book Consultation
      </PrimaryButton>
    </div>
  );
};
