import React from "react";
import { Star, ShieldCheck, Quote } from "lucide-react";

export const ReviewCard = ({
  review = {
    patientName: "Marcus Vance",
    hospitalName: "St. Jude Metro Cardiac Center",
    rating: 5,
    date: "2 days ago",
    comment:
      "The emergency siren routing saved precious minutes during my father's cardiac event. The ICU bed was ready the second our ambulance arrived.",
    verified: true,
  },
}) => {
  return (
    <div className="h-full flex flex-col justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 relative">
      <Quote className="w-8 h-8 text-blue-100 absolute top-4 right-4 pointer-events-none" />

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-emerald-500 text-white font-bold flex items-center justify-center text-sm shadow-sm shrink-0">
            {review.patientName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h5 className="font-bold text-slate-900 text-sm">{review.patientName}</h5>
              {review.verified && (
                <span className="text-emerald-600 shrink-0" title="Verified Patient">
                  <ShieldCheck className="w-4 h-4 fill-emerald-100 shrink-0" />
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">{review.hospitalName}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-amber-400">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 shrink-0 ${
                i < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
              }`}
            />
          ))}
          <span className="text-xs font-bold text-slate-600 ml-1.5">{review.date}</span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed font-medium">"{review.comment}"</p>
      </div>
    </div>
  );
};
