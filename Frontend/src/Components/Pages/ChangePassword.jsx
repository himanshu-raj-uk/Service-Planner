import { useState } from "react";
import { Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { changePassword } from "../../Services/AuthAPI";
import showSuccess from "../../Utils/toast";

const passwordInput =
  "h-full w-full rounded-2xl border-0 bg-transparent pl-14 pr-14 pt-5 text-[15px] font-medium leading-6 text-[#0f172a] outline-none placeholder:text-slate-400/60 disabled:cursor-not-allowed disabled:opacity-70";

const ChangePassword = () => {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentPassword.trim()) {
      toast.error("Please enter your current password.");
      return;
    }

    if (!newPassword.trim()) {
      toast.error("Please enter your new password.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (!confirmPassword.trim()) {
      toast.error("Please confirm your new password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      toast.error(
        "New password must be different from current password.",
      );
      return;
    }

    try {
      setLoading(true);

      const response = await changePassword(
        currentPassword,
        newPassword,
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      showSuccess(
        response.data.message || "Password changed successfully.",
      );

      navigate("/", { replace: true });
    } catch (error) {
      console.error("CHANGE PASSWORD ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to change password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen w-full bg-[#f4f6fa] px-4 py-8 text-[#0f172a] sm:px-6 sm:py-12">
      <div className="mx-auto flex w-full max-w-lg  ">
        <div className="w-full rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,.05)] sm:p-7 md:p-8">
          <button
            type="button"
            onClick={() => navigate("/profile")}
            disabled={loading}
            className="mb-7 flex items-center gap-2 text-sm font-semibold text-indigo-500 transition-colors duration-200 hover:text-indigo-600 disabled:opacity-50"
          >
            <ArrowLeft size={17} />
            Back to Profile
          </button>

          <div className="mb-8">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500">
                <Lock size={21} />
              </div>

              <div className="min-w-0">
                <h1 className="text-2xl font-medium tracking-tight text-[#0f172a] sm:text-3xl">
                  Change Password
                </h1>

                <p className="mt-1 text-sm leading-6 text-slate-500 font-medium">
                  Update your account password securely.
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="w-full space-y-5"
          >
            <div className="profile-field group relative h-[78px] w-full min-w-0">
              <label className="pointer-events-none absolute left-5 top-2.5 z-10 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 transition-colors duration-200 group-focus-within:text-indigo-500 group-hover:text-indigo-500">
                Current Password
              </label>

              <Lock
                size={17}
                strokeWidth={1.9}
                className="absolute left-5 top-1/2 z-10 -translate-y-1/2 text-indigo-500"
              />

              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) =>
                  setCurrentPassword(e.target.value)
                }
                disabled={loading}
                autoComplete="current-password"
                placeholder="Enter current password"
                className={passwordInput}
              />

              <button
                type="button"
                onClick={() =>
                  setShowCurrent((prev) => !prev)
                }
                disabled={loading}
                className="absolute right-5 top-1/2 z-10 -translate-y-1/2 text-slate-400 transition-colors duration-200 hover:text-indigo-500 disabled:opacity-50"
              >
                {showCurrent ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>

            <div className="profile-field group relative h-[78px] w-full min-w-0">
              <label className="pointer-events-none absolute left-5 top-2.5 z-10 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 transition-colors duration-200 group-focus-within:text-indigo-500 group-hover:text-indigo-500">
                New Password
              </label>

              <Lock
                size={17}
                strokeWidth={1.9}
                className="absolute left-5 top-1/2 z-10 -translate-y-1/2 text-indigo-500"
              />

              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
                disabled={loading}
                autoComplete="new-password"
                placeholder="Enter new password"
                className={passwordInput}
              />

              <button
                type="button"
                onClick={() => setShowNew((prev) => !prev)}
                disabled={loading}
                className="absolute right-5 top-1/2 z-10 -translate-y-1/2 text-slate-400 transition-colors duration-200 hover:text-indigo-500 disabled:opacity-50"
              >
                {showNew ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>

            <div className="profile-field group relative h-[78px] w-full min-w-0">
              <label className="pointer-events-none absolute left-5 top-2.5 z-10 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 transition-colors duration-200 group-focus-within:text-indigo-500 group-hover:text-indigo-500">
                Confirm New Password
              </label>

              <Lock
                size={17}
                strokeWidth={1.9}
                className="absolute left-5 top-1/2 z-10 -translate-y-1/2 text-indigo-500"
              />

              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                disabled={loading}
                autoComplete="new-password"
                placeholder="Confirm new password"
                className={passwordInput}
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirm((prev) => !prev)
                }
                disabled={loading}
                className="absolute right-5 top-1/2 z-10 -translate-y-1/2 text-slate-400 transition-colors duration-200 hover:text-indigo-500 disabled:opacity-50"
              >
                {showConfirm ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-4 font-semibold text-white shadow-md transition-all duration-200 hover:bg-indigo-600 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Changing Password...
                </>
              ) : (
                <>
                  <Lock size={18} />
                  Change Password
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ChangePassword;