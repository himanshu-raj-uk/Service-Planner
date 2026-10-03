import React from "react";

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
      <div className="w-12 h-12 border-4 border-slate-700 border-t-indigo-500 rounded-full animate-spin"></div>
      <p className="mt-4 text-sm font-medium text-slate-300">
        Loading Service Planner...
      </p>
    </div>
  );
}