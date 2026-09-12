import toast from "react-hot-toast";
import { CheckCircle2 } from "lucide-react";

export const showSuccess = (message) => {
  toast.custom(
    (t) => (
      <div
        className={`flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-[0_18px_45px_rgba(15,23,42,.14)] transition-all duration-300 ${
          t.visible
            ? "translate-y-0 scale-100 opacity-100"
            : "-translate-y-2 scale-95 opacity-0"
        }`}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50">
          <CheckCircle2
            size={22}
            strokeWidth={2.5}
            className="text-indigo-500"
          />
        </div>

        <span className="text-sm font-semibold text-slate-800">
          {message}
        </span>
      </div>
    ),
    {
      duration: 3000,
    },
  );
};

export default showSuccess;