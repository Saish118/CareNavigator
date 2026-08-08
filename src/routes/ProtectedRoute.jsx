import React, { useEffect, useRef } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ui/ToastNotification";

export const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const { addToast } = useToast();
  const hasNotified = useRef(false);

  useEffect(() => {
    if (!loading && !currentUser && !hasNotified.current) {
      hasNotified.current = true;
      addToast("Please sign in to access your profile and saved account features.", "info");
    }
  }, [loading, currentUser, addToast]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-xs bg-white px-4 py-3 rounded-2xl shadow-sm border border-slate-200">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Verifying session...</span>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
};
