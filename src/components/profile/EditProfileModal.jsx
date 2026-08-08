import React, { useState, useEffect } from "react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { User, Phone, MapPin, Calendar, HeartPulse, Mail, Loader2, Save } from "lucide-react";
import { Modal } from "../common/Modal";
import { TextInput } from "../inputs/TextInput";
import { SelectInput } from "../inputs/SelectInput";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { db } from "../../config/firebase";
import { useToast } from "../ui/ToastNotification";

export const EditProfileModal = ({ isOpen, onClose, currentUser, userDoc }) => {
  const { addToast } = useToast();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState("");

  // Preload current user's Firestore & Auth data when modal opens
  useEffect(() => {
    if (isOpen) {
      setName(userDoc?.name || currentUser?.displayName || "");
      setPhone(userDoc?.phone || currentUser?.phoneNumber || "");
      setCity(userDoc?.city || "");
      setDateOfBirth(userDoc?.dateOfBirth || userDoc?.dob || "");
      setBloodGroup(userDoc?.bloodGroup || "");
      setGender(userDoc?.gender || "");
      setEmail(userDoc?.email || currentUser?.email || "");
      setValidationError("");
    }
  }, [isOpen, userDoc, currentUser]);

  const validateForm = () => {
    // 1. Name cannot be empty
    if (!name || name.trim() === "") {
      setValidationError("Full Name is required.");
      return false;
    }

    // 2. Phone number validation (if provided, must be valid 7-15 digits)
    if (phone && phone.trim() !== "") {
      const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,14}$/;
      if (!phoneRegex.test(phone.trim())) {
        setValidationError("Please enter a valid phone number.");
        return false;
      }
    }

    // 3. Date of Birth cannot be in the future
    if (dateOfBirth) {
      const selectedDate = new Date(dateOfBirth);
      const today = new Date();
      if (selectedDate > today) {
        setValidationError("Date of birth cannot be in the future.");
        return false;
      }
    }

    setValidationError("");
    return true;
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!currentUser?.uid) {
      addToast("User authentication session expired. Please sign in again.", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Update Firebase Auth displayName if name changed
      if (name.trim() !== (currentUser.displayName || "")) {
        await updateProfile(currentUser, { displayName: name.trim() });
      }

      // 2. Update Firestore document users/{currentUser.uid}
      const userRef = doc(db, "users", currentUser.uid);
      const updatePayload = {
        uid: currentUser.uid,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        city: city.trim(),
        dateOfBirth: dateOfBirth,
        bloodGroup: bloodGroup,
        gender: gender,
        updatedAt: serverTimestamp(),
      };

      await setDoc(userRef, updatePayload, { merge: true });

      // 3. Show success toast
      addToast("Profile updated successfully.", "success");
      onClose();
    } catch (error) {
      console.error("Error updating profile in Firestore:", error);
      addToast(error.message || "Failed to update profile. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Personal Profile"
      subtitle="Update your personal details and medical information."
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSave} className="space-y-4">
        {validationError && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl flex items-center gap-2">
            ⚠️ {validationError}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="sm:col-span-2">
            <TextInput
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Rivera"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Email (Read-Only) */}
          <div className="sm:col-span-2 space-y-1">
            <label className="block text-xs font-bold text-slate-700">Email Address (Read-Only)</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                readOnly
                disabled
                className="w-full h-11 px-3.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-500 cursor-not-allowed"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <TextInput
              label="Phone Number"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +1 (555) 234-5678"
              disabled={isSubmitting}
            />
          </div>

          {/* City */}
          <div>
            <TextInput
              label="City / Region"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Central Metro City"
              disabled={isSubmitting}
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth</label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              disabled={isSubmitting}
              className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Blood Group */}
          <div>
            <SelectInput
              label="Blood Group"
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              options={["", "O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"]}
              disabled={isSubmitting}
            />
          </div>

          {/* Gender */}
          <div className="sm:col-span-2">
            <SelectInput
              label="Gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              options={["", "Male", "Female", "Non-Binary", "Prefer not to say"]}
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <PrimaryButton
            type="submit"
            size="md"
            icon={isSubmitting ? Loader2 : Save}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  );
};
