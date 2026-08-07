import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { SecondaryButton } from "../buttons/SecondaryButton";

export const ErrorState = ({
  title = "Connection Error",
  message = "Failed to communicate with emergency service. Please check network connection.",
  onRetry,
}) => {
  return (
    <div className="bg-rose-50 p-6 rounded-xl border border-rose-200 text-center space-y-3 max-w-md mx-auto my-6">
      <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
        <AlertCircle className="w-6 h-6" />
      </div>

      <div>
        <h4 className="text-base font-bold text-rose-950">{title}</h4>
        <p className="text-xs text-rose-700 mt-1 font-medium leading-relaxed">{message}</p>
      </div>

      {onRetry && (
        <SecondaryButton
          onClick={onRetry}
          size="sm"
          icon={RotateCcw}
          className="bg-white border-rose-200 hover:bg-rose-100 text-rose-900 mx-auto"
        >
          Try Again
        </SecondaryButton>
      )}
    </div>
  );
};
