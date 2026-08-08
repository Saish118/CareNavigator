import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogIn, ArrowLeft, Loader2, KeyRound, Mail, CheckCircle2 } from "lucide-react";
import { TextInput } from "../components/inputs/TextInput";
import { PasswordInput } from "../components/inputs/PasswordInput";
import { PrimaryButton } from "../components/buttons/PrimaryButton";
import { Breadcrumb } from "../components/ui/Breadcrumb";
import { useToast } from "../components/ui/ToastNotification";
import { useAuth } from "../context/AuthContext";
import { loginUser, resetPassword } from "../services/authService";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { currentUser, loading: authLoading } = useAuth();

  // Mode: "login" | "forgot_password"
  const [mode, setMode] = useState("login");

  // Email & Password State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Reset Password State
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Redirect if user is already logged in
  useEffect(() => {
    if (!authLoading && currentUser) {
      navigate("/", { replace: true });
    }
  }, [currentUser, authLoading, navigate]);

  // Handle Email/Password Login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || email.trim() === "") {
      setErrorMessage("Please enter your email address.");
      return;
    }

    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    setIsSubmitting(true);

    try {
      await loginUser(email, password);
      addToast("Signed in successfully!", "success");
      navigate("/", { replace: true });
    } catch (error) {
      setErrorMessage(error.message);
      addToast(error.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Password Reset Email Request
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!resetEmail || resetEmail.trim() === "") {
      setErrorMessage("Please enter your email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      await resetPassword(resetEmail);
      setResetSent(true);
      addToast("Password reset link sent!", "success");
    } catch (error) {
      setErrorMessage(error.message);
      addToast(error.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Checking authentication status...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumb
          items={[
            { label: "Home", path: "/" },
            { label: mode === "login" ? "Login" : "Reset Password" },
          ]}
        />
        <button
          onClick={() => (mode === "forgot_password" ? setMode("login") : navigate(-1))}
          className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> {mode === "forgot_password" ? "Back to Login" : "Back"}
        </button>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl max-w-md mx-auto space-y-6">
        {mode === "login" ? (
          <>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100">
                <LogIn className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-black text-slate-900">Sign In to CareNavigator</h1>
              <p className="text-xs text-slate-500 font-medium">
                Access your personal Medical profile, bed holds, and triage history.
              </p>
            </div>

            {/* Error Alert */}
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold leading-relaxed">
                ⚠️ {errorMessage}
              </div>
            )}

            {/* EMAIL & PASSWORD SIGN IN FORM */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <TextInput
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                disabled={isSubmitting}
              />

              <div className="space-y-1">
                <PasswordInput
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
                <div className="flex justify-end pt-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setMode("forgot_password");
                      setResetEmail(email);
                      setErrorMessage("");
                      setResetSent(false);
                    }}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>

              <PrimaryButton
                type="submit"
                size="lg"
                fullWidth
                icon={isSubmitting ? Loader2 : LogIn}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing In..." : "Sign In with Email"}
              </PrimaryButton>
            </form>

            <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
              <span>Don't have an account? </span>
              <Link to="/register" className="font-bold text-blue-600 hover:underline">
                Register Account
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-100">
                <KeyRound className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-black text-slate-900">Reset Your Password</h1>
              <p className="text-xs text-slate-500 font-medium">
                Enter your registered email address and we'll send you a password reset link.
              </p>
            </div>

            {/* Error Alert */}
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold leading-relaxed">
                ⚠️ {errorMessage}
              </div>
            )}

            {/* Success Message Banner */}
            {resetSent ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 space-y-3 text-xs">
                <div className="flex items-center gap-2 font-bold text-emerald-900">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Reset Link Dispatched</span>
                </div>
                <p className="leading-relaxed text-emerald-800 font-medium">
                  If an account exists for <strong>{resetEmail}</strong>, a password reset link has been sent. Please check your inbox and spam folder.
                </p>
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-all text-center cursor-pointer mt-1"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <TextInput
                  label="Registered Email Address"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  disabled={isSubmitting}
                />

                <PrimaryButton
                  type="submit"
                  size="lg"
                  fullWidth
                  icon={isSubmitting ? Loader2 : Mail}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending Reset Link..." : "Send Reset Link"}
                </PrimaryButton>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setErrorMessage("");
                    }}
                    className="text-xs font-bold text-slate-500 hover:text-slate-900 hover:underline cursor-pointer"
                  >
                    Cancel & Return to Login
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};
