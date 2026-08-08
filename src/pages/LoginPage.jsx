import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogIn, ArrowLeft, Loader2 } from "lucide-react";
import { TextInput } from "../components/inputs/TextInput";
import { PasswordInput } from "../components/inputs/PasswordInput";
import { PrimaryButton } from "../components/buttons/PrimaryButton";
import { Breadcrumb } from "../components/ui/Breadcrumb";
import { useToast } from "../components/ui/ToastNotification";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/authService";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { currentUser, loading: authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Requirement 7: If user is already logged in, redirect away from Login page
  useEffect(() => {
    if (!authLoading && currentUser) {
      navigate("/", { replace: true });
    }
  }, [currentUser, authLoading, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      // Requirement 1 & 2: Authenticate using Firebase Email/Password
      await loginUser(email, password);
      addToast("Signed in successfully!", "success");
      // Requirement 6: Redirect user to Home page after login
      navigate("/", { replace: true });
    } catch (error) {
      // Requirement 9: Show Firebase error in user-friendly language
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
        <Breadcrumb items={[{ label: "Home", path: "/" }, { label: "Login" }]} />
        <button
          onClick={() => navigate(-1)}
          className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl max-w-md mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100">
            <LogIn className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Sign In to CareNavigator</h1>
          <p className="text-xs text-slate-500 font-medium">
            Access your personal Medical profile, bed holds, and triage history.
          </p>
        </div>

        {/* User-friendly Firebase Error Alert */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold">
            ⚠️ {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <TextInput
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            required
            disabled={isSubmitting}
          />

          <PasswordInput
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isSubmitting}
          />

          {/* Requirement 8: Loading state during login */}
          <PrimaryButton
            type="submit"
            size="lg"
            fullWidth
            icon={isSubmitting ? Loader2 : LogIn}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing In..." : "Sign In to Account"}
          </PrimaryButton>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Don't have an account? </span>
          <Link to="/register" className="font-bold text-blue-600 hover:underline">
            Register Account
          </Link>
        </div>
      </div>
    </div>
  );
};
