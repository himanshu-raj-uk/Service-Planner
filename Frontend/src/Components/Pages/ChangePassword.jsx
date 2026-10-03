import { useState } from "react";
import { Lock, Eye, EyeOff, ArrowLeft, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { changePassword } from "../../Services/AuthAPI";
import showSuccess from "../../Utils/toast";
import AuthLayout, { AuthField, authButtonClass } from "./AuthLayout";

const EyeButton = ({ visible, onClick, disabled, label }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={visible ? `Hide ${label}` : `Show ${label}`}
    className="mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 outline-none transition-colors hover:text-emerald-500 focus:outline-none focus:ring-0 disabled:opacity-50 dark:hover:text-emerald-400"
  >
    {visible ? <EyeOff size={16} /> : <Eye size={16} />}
  </button>
);

const ChangePassword = () => {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleCurrentPasswordChange = (e) => {
    setCurrentPassword(e.target.value);
    setErrors((prev) => ({
      ...prev,
      currentPassword: "",
    }));
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
    setErrors((prev) => ({
      ...prev,
      newPassword: "",
      confirmPassword:
        confirmPassword && e.target.value !== confirmPassword
          ? "Passwords do not match."
          : "",
    }));
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setErrors((prev) => ({
      ...prev,
      confirmPassword: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!currentPassword.trim()) {
      newErrors.currentPassword = "Please enter your current password.";
    }

    if (!newPassword.trim()) {
      newErrors.newPassword = "Please enter your new password.";
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters.";
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your new password.";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (
      currentPassword.trim() &&
      newPassword.trim() &&
      currentPassword === newPassword
    ) {
      newErrors.newPassword =
        "New password must be different from current password.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      setLoading(true);

      const response = await changePassword(currentPassword, newPassword);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrors({});

      showSuccess(
        response.data.message || "Password changed successfully.",
      );

      navigate("/", { replace: true });
    } catch (error) {
      console.error("CHANGE PASSWORD ERROR:", error);

      const message =
        error.response?.data?.message || "Unable to change password.";

      const lowerMessage = message.toLowerCase();

      if (
        lowerMessage.includes("current") ||
        lowerMessage.includes("old") ||
        lowerMessage.includes("incorrect")
      ) {
        setErrors((prev) => ({
          ...prev,
          currentPassword: message,
        }));
        return;
      }

      if (
        lowerMessage.includes("password") &&
        !lowerMessage.includes("match")
      ) {
        setErrors((prev) => ({
          ...prev,
          newPassword: message,
        }));
        return;
      }

      if (
        lowerMessage.includes("match") ||
        lowerMessage.includes("confirm")
      ) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: message,
        }));
        return;
      }

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      heading="Keep your account"
      highlight="secure and protected."
      description="Update your password regularly to keep your account and personal information secure."
    >
      {/* Heading */}
      <div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-indigo-600 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-400">
          <Sparkles size={11} />
          Security
        </span>

        <div className="mt-2 flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 sm:h-10 sm:w-10 dark:bg-emerald-400/10 dark:text-emerald-400">
            <Lock size={19} strokeWidth={1.8} />
          </div>

          <h2 className="text-[22px] font-bold leading-tight tracking-[-0.03em] text-slate-900 sm:text-[26px] dark:text-white">
            Change Password
          </h2>
        </div>

        <p className="mt-1.5 hidden text-[12.5px] leading-5 text-slate-500 sm:block dark:text-slate-400">
          Enter your current password and choose a new password for your
          account.
        </p>
      </div>

      <button
        type="button"
        onClick={() => navigate("/profile", { replace: true })}
        disabled={loading}
        className="mt-2.5 flex cursor-pointer items-center gap-1.5 text-[12px] font-semibold text-indigo-600 transition-colors duration-200 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-emerald-400 dark:hover:text-emerald-300"
      >
       
        Back to Profile
      </button>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-3 w-full space-y-2 sm:space-y-2.5"
      >
        <AuthField
          id="currentPassword"
          name="currentPassword"
          type={showCurrent ? "text" : "password"}
          label="Current password"
          icon={Lock}
          value={currentPassword}
          onChange={handleCurrentPasswordChange}
          error={errors.currentPassword}
          disabled={loading}
          autoComplete="current-password"
          placeholder="Enter current password"
          rightSlot={
            <EyeButton
              visible={showCurrent}
              disabled={loading}
              label="current password"
              onClick={() => setShowCurrent((prev) => !prev)}
            />
          }
        />

        <AuthField
          id="newPassword"
          name="newPassword"
          type={showNew ? "text" : "password"}
          label="New password"
          icon={Lock}
          value={newPassword}
          onChange={handleNewPasswordChange}
          error={errors.newPassword}
          disabled={loading}
          autoComplete="new-password"
          placeholder="Enter new password"
          rightSlot={
            <EyeButton
              visible={showNew}
              disabled={loading}
              label="new password"
              onClick={() => setShowNew((prev) => !prev)}
            />
          }
        />

        <AuthField
          id="confirmPassword"
          name="confirmPassword"
          type={showConfirm ? "text" : "password"}
          label="Confirm new password"
          icon={Lock}
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          error={errors.confirmPassword}
          disabled={loading}
          autoComplete="new-password"
          placeholder="Confirm new password"
          rightSlot={
            <EyeButton
              visible={showConfirm}
              disabled={loading}
              label="confirm password"
              onClick={() => setShowConfirm((prev) => !prev)}
            />
          }
        />

        <button
          type="submit"
          disabled={loading}
          className={`${authButtonClass} !mt-3`}
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400/40 border-t-slate-500 dark:border-slate-500/40 dark:border-t-slate-300" />
              Changing Password...
            </>
          ) : (
            <>
              <Lock size={16} strokeWidth={1.9} />
              Change Password
            </>
          )}
        </button>
      </form>
    </AuthLayout>
  );
};

export default ChangePassword;