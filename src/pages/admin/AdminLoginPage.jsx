import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Mail, Lock, LogIn, Activity, AlertCircle, ArrowLeft, Loader2, KeyRound, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/ui/ToastNotification";

export const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login, adminLogin, currentUser, isAdmin, logout, loading: authLoading } = useAuth();
  const { addToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Admin Forgot Password Modal state
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isSendingReset, setIsSendingReset] = useState(false);

  useEffect(() => {
    if (!authLoading && currentUser && isAdmin) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [authLoading, currentUser, isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const loginFn = adminLogin || ((e, p) => login(e, p, true));
      const res = await loginFn(email.trim(), password);
      if (res?.success) {
        addToast("Administrator authenticated successfully.", "success");
        navigate("/admin/dashboard", { replace: true });
      }
    } catch (error) {
      console.error("💥 Admin Login Error:", error);
      setErrorMessage(error.message || "Invalid administrator credentials.");
      addToast(error.message || "Invalid administrator credentials.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminResetPassword = async (e) => {
    e.preventDefault();
    const targetEmail = resetEmail.trim() || email.trim();
    if (!targetEmail) {
      addToast("Please enter your administrator email address.", "error");
      return;
    }

    setIsSendingReset(true);
    try {
      const { adminResetPassword } = await import("../../services/authService");
      await adminResetPassword(targetEmail);
      addToast(`Password reset link sent to ${targetEmail} (Admin Account).`, "success");
      setShowResetModal(false);
      setResetEmail("");
    } catch (err) {
      addToast("Failed to send reset link: " + err.message, "error");
    } finally {
      setIsSendingReset(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex items-center gap-2 text-sky-400 font-bold text-xs bg-slate-900 px-5 py-3 rounded-2xl shadow-xl border border-slate-800">
          <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
          <span>Verifying administrator credentials...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 space-y-6">
        {/* Back Link */}
        <button
          onClick={() => navigate("/")}
          className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5 mx-auto transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Public Website
        </button>

        {/* Header Logo */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 via-blue-600 to-emerald-500 flex items-center justify-center text-white shadow-xl shadow-sky-500/20 mx-auto border border-sky-400/30">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              medi<span className="text-sky-400">NAV</span> Administrator Panel
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Healthcare Provider & Facility Resource Management System
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/90 backdrop-blur-xl py-8 px-6 sm:px-8 shadow-2xl rounded-3xl border border-slate-800 space-y-6">
          {errorMessage && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 text-xs font-semibold flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Administrator Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@medinav.org"
                  className="w-full pl-10 pr-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(email || "admin@medinav.org");
                    setShowResetModal(true);
                  }}
                  className="text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 active:from-sky-700 active:to-blue-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-sky-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In to Admin Panel</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800 text-center">
            <p className="text-[11px] text-slate-500">
              Authorized access only. Administrator identity is strictly verified.
            </p>
          </div>
        </div>
      </div>

      {/* ADMIN FORGOT PASSWORD MODAL */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-5 relative">
            <button
              onClick={() => setShowResetModal(false)}
              className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="p-2.5 bg-sky-500/20 text-sky-400 rounded-xl border border-sky-500/30">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">Reset Administrator Password</h3>
                <p className="text-xs text-slate-400">Trigger password reset for Admin Identity</p>
              </div>
            </div>

            <form onSubmit={handleAdminResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Administrator Email Address
                </label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="admin@medinav.org"
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700 text-xs text-slate-400 leading-relaxed">
                <span className="font-bold text-sky-400 block mb-0.5">Admin Security Notice:</span>
                Password reset emails sent from this portal will update credentials for the administrator account only.
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 cursor-pointer"
                  disabled={isSendingReset}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSendingReset}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs rounded-xl shadow-md shadow-sky-600/30 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSendingReset ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Send Reset Link</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

