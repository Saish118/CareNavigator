import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, ArrowLeft, Loader2 } from "lucide-react";
import { TextInput } from "../components/inputs/TextInput";
import { PasswordInput } from "../components/inputs/PasswordInput";
import { SelectInput } from "../components/inputs/SelectInput";
import { PrimaryButton } from "../components/buttons/PrimaryButton";
import { Breadcrumb } from "../components/ui/Breadcrumb";
import { useToast } from "../components/ui/ToastNotification";
import { useAuth } from "../context/AuthContext";
import { registerUser } from "../services/authService";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { currentUser, loading: authLoading } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [bloodGroup, setBloodGroup] = useState("O+");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Requirement 7: If user is already logged in, redirect away from Signup page
  useEffect(() => {
    if (!authLoading && currentUser) {
      navigate("/", { replace: true });
    }
  }, [currentUser, authLoading, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log("📝 [RegisterPage] handleRegister form submitted!");
    console.log("📝 [RegisterPage] Form Inputs -> FullName:", fullName, "| Email:", email, "| Password Length:", password?.length);
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      console.log("📝 [RegisterPage] Calling registerUser(fullName, email, password)...");
      const res = await registerUser(fullName, email, password);
      console.log("✅ [RegisterPage] registerUser returned successfully:", res);
      addToast("Account registered successfully! Welcome to CareNavigator.", "success");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("❌ [RegisterPage] Error caught in handleRegister:", error);
      setErrorMessage(error.message);
      addToast(error.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Checking authentication status...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumb items={[{ label: "Home", path: "/" }, { label: "Register" }]} />
        <button
          onClick={() => navigate(-1)}
          className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl max-w-md mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Create CareNavigator Account</h1>
          <p className="text-xs text-slate-500 font-medium">
            Register your emergency profile for instant hospital bed holds & resource clearance.
          </p>
        </div>

        {/* User-friendly Firebase Error Alert */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold">
            ⚠️ {errorMessage}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <TextInput
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Sai Joshi"
            required
            disabled={isSubmitting}
          />

          <TextInput
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            required
            disabled={isSubmitting}
          />

          <SelectInput
            label="Blood Group"
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
            options={["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"]}
            disabled={isSubmitting}
          />

          <PasswordInput
            label="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isSubmitting}
          />

          {/* Requirement 8: Loading state during registration */}
          <PrimaryButton
            type="submit"
            size="lg"
            fullWidth
            icon={isSubmitting ? Loader2 : UserPlus}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </PrimaryButton>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Already have an account? </span>
          <Link to="/login" className="font-bold text-blue-600 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
