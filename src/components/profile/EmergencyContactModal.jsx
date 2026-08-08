import React, { useState, useEffect } from "react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { User, Phone, ShieldCheck, Loader2, Save, Star } from "lucide-react";
import { Modal } from "../common/Modal";
import { TextInput } from "../inputs/TextInput";
import { SelectInput } from "../inputs/SelectInput";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { db } from "../../config/firebase";
import { useToast } from "../ui/ToastNotification";

const RELATIONSHIP_OPTIONS = [
  "Mother",
  "Father",
  "Spouse",
  "Partner",
  "Brother",
  "Sister",
  "Friend",
  "Doctor",
  "Other",
];

export const EmergencyContactModal = ({
  isOpen,
  onClose,
  currentUser,
  userDoc,
  contactToEdit = null,
}) => {
  const { addToast } = useToast();

  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("Mother");
  const [phone, setPhone] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState("");

  // Preload contact details if editing, or reset form if adding new
  useEffect(() => {
    if (isOpen) {
      const existingContacts = userDoc?.emergencyContacts || [];
      if (contactToEdit) {
        setName(contactToEdit.name || "");
        setRelationship(contactToEdit.relationship || "Mother");
        setPhone(contactToEdit.phone || "");
        setIsPrimary(!!contactToEdit.isPrimary);
      } else {
        setName("");
        setRelationship("Mother");
        setPhone("");
        // Default first contact to Primary automatically
        setIsPrimary(existingContacts.length === 0);
      }
      setValidationError("");
    }
  }, [isOpen, contactToEdit, userDoc]);

  const validateForm = () => {
    if (!name || name.trim() === "") {
      setValidationError("Contact Full Name is required.");
      return false;
    }

    if (!phone || phone.trim() === "") {
      setValidationError("Phone Number is required.");
      return false;
    }

    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,14}$/;
    if (!phoneRegex.test(phone.trim())) {
      setValidationError("Please enter a valid phone number.");
      return false;
    }

    setValidationError("");
    return true;
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!currentUser?.uid) {
      addToast("User session expired. Please sign in again.", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const existingContacts = Array.isArray(userDoc?.emergencyContacts) ? [...userDoc.emergencyContacts] : [];

      if (!contactToEdit && existingContacts.length >= 3) {
        setValidationError("Maximum 3 emergency contacts allowed.");
        setIsSubmitting(false);
        return;
      }

      let updatedContacts = [];

      if (contactToEdit) {
        // Edit existing contact
        updatedContacts = existingContacts.map((c) => {
          if (c.id === contactToEdit.id) {
            return {
              ...c,
              name: name.trim(),
              relationship: relationship,
              phone: phone.trim(),
              isPrimary: isPrimary,
            };
          }
          // If this contact is set to primary, remove primary flag from all other contacts
          return isPrimary ? { ...c, isPrimary: false } : c;
        });
      } else {
        // Add new contact
        const newContact = {
          id: Date.now().toString(),
          name: name.trim(),
          relationship: relationship,
          phone: phone.trim(),
          isPrimary: isPrimary,
        };

        const listWithAdjustedPrimary = isPrimary
          ? existingContacts.map((c) => ({ ...c, isPrimary: false }))
          : existingContacts;

        updatedContacts = [...listWithAdjustedPrimary, newContact];
      }

      // Update Firestore document users/{currentUser.uid}
      const userRef = doc(db, "users", currentUser.uid);
      await setDoc(
        userRef,
        {
          emergencyContacts: updatedContacts,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      addToast(
        contactToEdit ? "Emergency contact updated successfully." : "Emergency contact added successfully.",
        "success"
      );
      onClose();
    } catch (error) {
      console.error("Error saving emergency contact to Firestore:", error);
      addToast(error.message || "Failed to save emergency contact.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={contactToEdit ? "Edit Emergency Contact" : "Add Emergency Contact"}
      subtitle="Save trusted contacts for instant ambulance hotline dispatches."
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSave} className="space-y-4">
        {validationError && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl flex items-center gap-2">
            ⚠️ {validationError}
          </div>
        )}

        {/* Full Name */}
        <div>
          <TextInput
            label="Full Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Elena Rivera"
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Relationship Dropdown */}
        <div>
          <SelectInput
            label="Relationship *"
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            options={RELATIONSHIP_OPTIONS}
            disabled={isSubmitting}
            required
          />
        </div>

        {/* Phone Number */}
        <div>
          <TextInput
            label="Phone Number *"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. +1 (555) 234-5678"
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Primary Contact Toggle */}
        <div className="pt-2 border-t border-slate-100">
          <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer hover:bg-slate-100/80 transition-colors">
            <input
              type="checkbox"
              checked={isPrimary}
              onChange={(e) => setIsPrimary(e.target.checked)}
              disabled={isSubmitting}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
            />
            <div className="flex-1">
              <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                <Star className={`w-3.5 h-3.5 ${isPrimary ? "text-amber-500 fill-amber-500" : "text-slate-400"}`} />
                Mark as Primary Emergency Contact
              </span>
              <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                Will be dialed first during critical emergency dispatches.
              </p>
            </div>
          </label>
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
            {isSubmitting ? "Saving..." : "Save Contact"}
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  );
};
