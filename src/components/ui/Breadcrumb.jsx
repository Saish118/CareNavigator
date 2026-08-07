import React from "react";
import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

export const Breadcrumb = ({
  items = [
    { label: "Home", path: "/" },
    { label: "AI Recommender", path: "/recommendations" },
    { label: "Hospital Details" },
  ],
}) => {
  return (
    <nav className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 py-2">
      <Link to="/" className="hover:text-blue-600 flex items-center gap-1">
        <Home className="w-3.5 h-3.5" />
      </Link>

      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          {item.path ? (
            <Link to={item.path} className="hover:text-blue-600">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-900 font-bold">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
