import React, { useEffect, useRef } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ui/ToastNotification";

export const AdminRoute = ({ children }) => {
  const { currentUser, isAdmin, loading } = useAuth();
  const { addToast } = useToast();
  const hasNotified = useRef(false);

  useEffect(() => {
    if (!loading && (!currentUser || !isAdmin) && !hasNotified.current) {
      hasNotified.current = true;
      if (!currentUser) {
        addToast("Please sign in to access the MediNAV Admin Panel.", "info");
      } else if (!isAdmin) {
        addToast("Only administrators can perform this action.", "error");
      }
    }
  }, [loading, currentUser, isAdmin, addToast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex items-center gap-2 text-sky-400 font-bold text-xs bg-slate-900 px-5 py-3 rounded-2xl shadow-xl border border-slate-800">
          <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
          <span>Verifying administrator credentials...</span>
        </div>
      </div>
    );
  }

  if (!currentUser || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children ? children : <Outlet />;
};
