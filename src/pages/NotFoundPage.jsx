import React from "react";
import { Link } from "react-router-dom";
import { Activity, ArrowLeft } from "lucide-react";
import { Button } from "../components/common/Button";

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-6">
      <div className="w-16 h-16 bg-sky-100 text-sky-600 rounded-3xl flex items-center justify-center">
        <Activity className="w-8 h-8" />
      </div>
      <div>
        <h1 className="text-4xl font-black text-slate-900">404 - Page Not Found</h1>
        <p className="text-sm text-slate-500 mt-2">
          The requested emergency navigation page or triage route does not exist.
        </p>
      </div>
      <Link to="/">
        <Button variant="primary" size="lg" icon={ArrowLeft}>
          Return to Home Dashboard
        </Button>
      </Link>
    </div>
  );
};
