import React from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, ArrowLeft, Stethoscope } from "lucide-react";
import { Breadcrumb } from "../components/ui/Breadcrumb";
import { HospitalCard } from "../components/hospital/HospitalCard";
import { HOSPITALS_DATA } from "../data/hospitalsData";
import { useBookmark } from "../context/BookmarkContext";

export const FavoritesPage = () => {
  const navigate = useNavigate();
  const { savedHospitalIds } = useBookmark();

  const savedHospitals = HOSPITALS_DATA.filter((h) => savedHospitalIds.includes(h.id));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumb items={[{ label: "Dashboard", path: "/dashboard" }, { label: "Saved Favorites" }]} />
        <button
          onClick={() => navigate(-1)}
          className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>

      <div>
        <h1 className="text-3xl font-black text-slate-900">Saved Favorite Hospitals</h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Quick access to your bookmarked emergency trauma centers and preferred medical facilities.
        </p>
      </div>

      {savedHospitals.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <Bookmark className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No Saved Hospitals Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click the bookmark icon on any hospital card to save it for quick emergency retrieval.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedHospitals.map((hosp) => (
            <HospitalCard
              key={hosp.id}
              hospital={hosp}
              onNavigate={() => navigate("/map")}
              onSelectDetails={() => navigate(`/hospital/${hosp.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
