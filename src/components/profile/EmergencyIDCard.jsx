import React from "react";
import { QrCode, ShieldAlert, HeartPulse, User, Phone, ShieldCheck, Printer } from "lucide-react";
import { Button } from "../common/Button";

export const EmergencyIDCard = () => {
  const patientProfile = {
    fullName: "Sai Joshi",
    emergencyId: "CN-MED-8842",
    bloodGroup: "O+",
    dateOfBirth: "1998-05-14",
    allergies: ["Penicillin", "Peanuts"],
    chronicConditions: ["Asthma", "Mild Hypertension"],
    primaryContact: {
      name: "Anand Joshi (Father)",
      relation: "Primary Emergency Contact",
      phone: "+1 (555) 349-9921",
    },
    insurance: {
      provider: "BlueCross BlueShield Premier",
      policyNumber: "BCBS-99482710",
      groupNumber: "GRP-4029",
    },
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-sky-100 shadow-xl space-y-6 max-w-xl mx-auto">
      {/* Header Badge */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-emerald-500 text-white flex items-center justify-center font-bold">
            <HeartPulse className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg">
              Patient Medical Emergency ID
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              mediNAV Health Passport
            </span>
          </div>
        </div>

        <span className="px-3 py-1 bg-rose-100 text-rose-700 font-extrabold text-xs rounded-full border border-rose-200">
          ID: {patientProfile.emergencyId}
        </span>
      </div>

      {/* Main Grid Info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
        <div className="sm:col-span-2 space-y-2">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400">Patient Name</span>
            <h4 className="text-lg font-black text-slate-900">{patientProfile.fullName}</h4>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-400 font-semibold block">Blood Group</span>
              <span className="text-base font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 inline-block">
                {patientProfile.bloodGroup}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block">Date of Birth</span>
              <span className="font-bold text-slate-800">{patientProfile.dateOfBirth}</span>
            </div>
          </div>
        </div>

        {/* QR Code Concept */}
        <div className="flex flex-col items-center justify-center p-2 bg-white rounded-xl border border-slate-200 shadow-sm">
          <QrCode className="w-20 h-20 text-slate-800" />
          <span className="text-[9px] font-bold text-slate-400 uppercase mt-1">Paramedic Scan</span>
        </div>
      </div>

      {/* Allergies & Conditions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="p-3.5 bg-rose-50/70 rounded-2xl border border-rose-100">
          <span className="font-extrabold text-rose-900 block mb-1">
            Known Drug / Food Allergies
          </span>
          <div className="flex flex-wrap gap-1">
            {patientProfile.allergies.map((a, i) => (
              <span key={i} className="px-2 py-0.5 bg-white text-rose-700 font-bold rounded-md border border-rose-200">
                {a}
              </span>
            ))}
          </div>
        </div>

        <div className="p-3.5 bg-sky-50/70 rounded-2xl border border-sky-100">
          <span className="font-extrabold text-sky-900 block mb-1">
            Chronic Medical Conditions
          </span>
          <div className="flex flex-wrap gap-1">
            {patientProfile.chronicConditions.map((c, i) => (
              <span key={i} className="px-2 py-0.5 bg-white text-sky-800 font-bold rounded-md border border-sky-200">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Emergency Contact & Insurance */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
        <div className="flex items-center justify-between border-b pb-2">
          <span className="text-slate-500 font-medium">Primary Contact:</span>
          <span className="font-bold text-slate-900">{patientProfile.primaryContact.name} ({patientProfile.primaryContact.phone})</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500 font-medium">Insurance Policy:</span>
          <span className="font-bold text-sky-700">{patientProfile.insurance.provider}</span>
        </div>
      </div>

      {/* Print Button */}
      <div className="pt-2 flex justify-end">
        <Button onClick={handlePrint} variant="glass" size="md" icon={Printer}>
          Print Medical Passport Card
        </Button>
      </div>
    </div>
  );
};
