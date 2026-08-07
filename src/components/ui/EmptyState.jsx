import React from "react";
import { FolderOpen, ArrowRight } from "lucide-react";
import { PrimaryButton } from "../buttons/PrimaryButton";

export const EmptyState = ({
  title = "No Data Available",
  description = "There are currently no records matching your request.",
  icon: Icon = FolderOpen,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="bg-white p-8 rounded-xl border border-slate-200 text-center space-y-4 max-w-md mx-auto my-6">
      <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
        <Icon className="w-7 h-7" />
      </div>

      <div>
        <h4 className="text-lg font-bold text-slate-900">{title}</h4>
        <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">{description}</p>
      </div>

      {actionLabel && (
        <PrimaryButton onClick={onAction} size="sm" icon={ArrowRight} className="mx-auto">
          {actionLabel}
        </PrimaryButton>
      )}
    </div>
  );
};
