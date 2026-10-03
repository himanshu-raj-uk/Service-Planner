import { useState } from "react";

import { Mail, Sparkles, ShieldCheck } from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import { forgotPassword } from "../../Services/AuthAPI";

import AuthLayout, {
  AuthField,
  authButtonClass,
} from "./AuthLayout";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
  });

  const handleChange = (event) => {
    const { value } = event.target;

    setEmail(value);

    setErrors((previous) => ({
      ...previous,
      email: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      newErrors.email = "Enter a valid email address.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const goToVerify = (cleanEmail) => {
    navigate("/verify-otp", {
      replace: true,
      state: {
        email: cleanEmail,
        type: "forgot-password",
      },
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    const cleanEmail = email.trim().toLowerCase();

    try {
      setLoading(true);

      // Wipe any leftovers from a previous attempt so a stale token
      // can never be used to verify the new OTP.
      localStorage.removeItem("verificationToken");
      localStorage.removeItem("resetToken");
      sessionStorage.removeItem("otpEmail");
      sessionStorage.removeItem("otpType");

      const res = await forgotPassword(cleanEmail);

      if (res?.data?.status) {
        const verificationToken =
          res.data.verificationToken ||
          res.data.token ||
          res.data.data?.verificationToken;

        // Without a token the next step cannot work, so stop here.
        if (!verificationToken) {
          setErrors((previous) => ({
            ...previous,
            email:
              "Could not start verification. Please try again.",
          }));
          return;
        }

        localStorage.setItem(
          "verificationToken",
          verificationToken
        );

        localStorage.setItem("forgotPasswordEmail", cleanEmail);

        toast.success(
          res.data.message || "OTP sent successfully."
        );

        goToVerify(cleanEmail);
        return;
      }

      setErrors((previous) => ({
        ...previous,
        email:
          res?.data?.message ||
          res?.data?.error ||
          "Unable to send OTP. Please try again.",
      }));
    } catch (err) {
      console.error("FORGOT PASSWORD ERROR:", err);

      const status = err?.response?.status;
      const data = err?.response?.data || {};
      const message = data?.message || "";

      if (status === 429) {
        setErrors((previous) => ({
          ...previous,
          email:
            "Too many attempts. Please try again after some time.",
        }));
        return;
      }

      setErrors((previous) => ({
        ...previous,
        email:
          message ||
          data?.error ||
          "Unable to send OTP. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      heading="Secure your"
      highlight="account again."
      description="Reset your password securely and get back to planning trips, birthdays and events in one simple planning space."
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
          Forgot your password?
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
          Enter your registered email and we'll send you an OTP
          to verify your account.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-5 space-y-3"
      >
        <AuthField
          id="email"
          name="email"
          type="email"
          label="Email"
          icon={Mail}
          value={email}
          onChange={handleChange}
          error={errors.email}
          disabled={loading}
          autoComplete="email"
          placeholder="Enter your registered email"
        />

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
            We'll send a one-time verification code to your
            registered email address.
          </p>
        </div>

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

              Sending OTP...
            </>
          ) : (
            "Send OTP"
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

export default ForgotPassword;