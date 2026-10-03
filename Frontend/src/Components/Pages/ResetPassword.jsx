import { useEffect, useState } from "react";

import {
    LockKeyhole,
    Sparkles,
    ShieldCheck,
    Eye,
    EyeOff,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import { resetPassword } from "../../Services/AuthAPI";

import AuthLayout, {
    AuthField,
    authButtonClass,
} from "./AuthLayout";

const ResetPassword = () => {
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [errors, setErrors] = useState({
        password: "",
        confirmPassword: "",
    });

    // Nobody should land here without having verified an OTP first
    useEffect(() => {
        if (!localStorage.getItem("resetToken")) {
            toast.error("Please verify your OTP first.");
            navigate("/forgot-password", { replace: true });
        }
    }, [navigate]);

    const clearResetSession = () => {
        localStorage.removeItem("verificationToken");
        localStorage.removeItem("resetToken");
        localStorage.removeItem("forgotPasswordEmail");
        sessionStorage.removeItem("otpEmail");
        sessionStorage.removeItem("otpType");
    };

    const handlePasswordChange = (event) => {
        const { value } = event.target;

        setPassword(value);

        setErrors((previous) => ({
            ...previous,
            password: "",
        }));
    };

    const handleConfirmPasswordChange = (event) => {
        const { value } = event.target;

        setConfirmPassword(value);

        setErrors((previous) => ({
            ...previous,
            confirmPassword: "",
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!password.trim()) {
            newErrors.password = "New password is required.";
        } else if (password.length < 6) {
            newErrors.password =
                "Password must be at least 6 characters.";
        } else if (password.length > 20) {
            newErrors.password =
                "Password must not exceed 20 characters.";
        }

        if (!confirmPassword.trim()) {
            newErrors.confirmPassword =
                "Please confirm your new password.";
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) return;

        const resetToken = localStorage.getItem("resetToken");

        if (!resetToken) {
            setErrors((previous) => ({
                ...previous,
                password:
                    "Reset session expired. Please request a new OTP.",
            }));

            return;
        }

        try {
            setLoading(true);

            const response = await resetPassword(password, resetToken);

            if (response?.data?.status) {
                clearResetSession();

                toast.success(
                    response.data.message || "Password reset successfully."
                );

                navigate("/login", {
                    replace: true,
                });

                return;
            }

            setErrors((previous) => ({
                ...previous,
                password:
                    response?.data?.message ||
                    response?.data?.error ||
                    "Unable to reset password. Please try again.",
            }));
        } catch (error) {
            console.error("RESET PASSWORD ERROR:", error);

            const status = error?.response?.status;
            const data = error?.response?.data || {};
            const message = data?.message || "";

            if (status === 401) {
                setErrors((previous) => ({
                    ...previous,
                    password:
                        message ||
                        "Reset session expired. Please request a new OTP.",
                }));

                return;
            }

            if (status === 400) {
                setErrors((previous) => ({
                    ...previous,
                    password:
                        message ||
                        "Password must be between 6 and 20 characters.",
                }));

                return;
            }

            setErrors((previous) => ({
                ...previous,
                password:
                    message ||
                    data?.error ||
                    "Unable to reset password. Please try again.",
            }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            heading="Create your"
            highlight="new password."
            description="Set a new secure password and get back to planning trips, birthdays and events in one simple planning space."
        >
            {/* Heading */}
            <div>
                <span
                    className="
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            border-indigo-200
            bg-indigo-50
            px-3
            py-1
            text-[10px]
            font-bold
            uppercase
            tracking-[0.12em]
            text-indigo-600
            dark:border-emerald-400/20
            dark:bg-emerald-400/10
            dark:text-emerald-400
          "
                >
                    <Sparkles size={12} />
                    Reset password
                </span>

                <h2
                    className="
            mt-3
            text-[24px]
            font-bold
            leading-tight
            tracking-[-0.03em]
            text-slate-900
            sm:text-[28px]
            dark:text-white
          "
                >
                    Create a new password
                </h2>

                <p
                    className="
            mt-1.5
            text-[12.5px]
            leading-5
            text-slate-500
            sm:text-[13px]
            dark:text-slate-400
          "
                >
                    Enter your new password below and confirm it to securely
                    regain access to your account.
                </p>
            </div>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                noValidate
                className="mt-5 space-y-3"
            >
                {/* New Password */}
                <div className="relative">
                    <AuthField
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        label="New Password"
                        icon={LockKeyhole}
                        value={password}
                        onChange={handlePasswordChange}
                        error={errors.password}
                        disabled={loading}
                        autoComplete="new-password"
                        placeholder="Enter your new password"
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword((previous) => !previous)}
                        disabled={loading}
                        aria-label={
                            showPassword ? "Hide password" : "Show password"
                        }
                        className="
              absolute
              right-3
              top-[34px]
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              text-slate-400
              transition-colors
              hover:bg-slate-100
              hover:text-slate-600
              dark:hover:bg-slate-800
              dark:hover:text-slate-200
            "
                    >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>

                {/* Confirm Password */}
                <div className="relative">
                    <AuthField
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        label="Confirm Password"
                        icon={LockKeyhole}
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        error={errors.confirmPassword}
                        disabled={loading}
                        autoComplete="new-password"
                        placeholder="Confirm your new password"
                    />

                    <button
                        type="button"
                        onClick={() =>
                            setShowConfirmPassword((previous) => !previous)
                        }
                        disabled={loading}
                        aria-label={
                            showConfirmPassword
                                ? "Hide confirm password"
                                : "Show confirm password"
                        }
                        className="
              absolute
              right-3
              top-[34px]
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              text-slate-400
              transition-colors
              hover:bg-slate-100
              hover:text-slate-600
              dark:hover:bg-slate-800
              dark:hover:text-slate-200
            "
                    >
                        {showConfirmPassword ? (
                            <EyeOff size={16} />
                        ) : (
                            <Eye size={16} />
                        )}
                    </button>
                </div>

                {/* Security information */}
                <div
                    className="
            flex
            items-start
            gap-2.5
            rounded-xl
            border
            border-slate-200
            bg-slate-50
            px-3
            py-2.5
            dark:border-slate-700/70
            dark:bg-slate-800/30
          "
                >
                    <ShieldCheck
                        size={15}
                        className="
              mt-0.5
              shrink-0
              text-indigo-500
              dark:text-emerald-400
            "
                    />

                    <p
                        className="
              text-[10.5px]
              leading-4
              text-slate-500
              dark:text-slate-400
            "
                    >
                        Your password must contain between 6 and 20
                        characters. Your confirmation is checked before the
                        password is submitted.
                    </p>
                </div>

                {/* Reset Password */}
                <button
                    type="submit"
                    disabled={loading}
                    className={authButtonClass}
                >
                    {loading ? (
                        <>
                            <span
                                className="
                  h-4
                  w-4
                  animate-spin
                  rounded-full
                  border-2
                  border-slate-400/40
                  border-t-slate-500
                  dark:border-slate-500/40
                  dark:border-t-slate-300
                "
                            />
                            Resetting Password...
                        </>
                    ) : (
                        "Reset Password"
                    )}
                </button>
            </form>

            {/* Back to login */}
            <p
                className="
          mt-4
          text-center
          text-[12px]
          font-medium
          text-slate-500
          dark:text-slate-400
        "
            >
                Remember your password?{" "}
                <Link
                    to="/login"
                    replace
                    className="
            font-semibold
            text-indigo-600
            transition-colors
            hover:text-indigo-700
            dark:text-emerald-400
            dark:hover:text-emerald-300
          "
                >
                    Login
                </Link>
            </p>
        </AuthLayout>
    );
};

export default ResetPassword;