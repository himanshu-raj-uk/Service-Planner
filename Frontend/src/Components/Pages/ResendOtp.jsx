import { useEffect, useState } from "react";
import {
  Mail,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { resendOTP } from "../../Services/AuthAPI";
import AuthLayout, {
  AuthField,
  authButtonClass,
} from "./AuthLayout";

const OTP_EMAIL_KEY = "otpEmail";
const OTP_TYPE_KEY = "otpType";

const ResendOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // location.state is lost on refresh, so fall back to sessionStorage
  const email =
    location.state?.email ||
    sessionStorage.getItem(OTP_EMAIL_KEY) ||
    "";

  const type =
    location.state?.type ||
    sessionStorage.getItem(OTP_TYPE_KEY) ||
    "verify-email";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (location.state?.email) {
      sessionStorage.setItem(OTP_EMAIL_KEY, location.state.email);
    }

    if (location.state?.type) {
      sessionStorage.setItem(OTP_TYPE_KEY, location.state.type);
    }
  }, [location.state]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const token = localStorage.getItem("verificationToken");

    if (!token) {
      setError("Verification session expired. Please start again.");
      return;
    }

    try {
      setLoading(true);

      const response = await resendOTP(token);

      if (response?.data?.status) {
        // If the server issues a fresh token with the new OTP,
        // we must use it, otherwise verification uses a dead token.
        const newToken =
          response.data.verificationToken ||
          response.data.token ||
          response.data.data?.verificationToken;

        if (newToken) {
          localStorage.setItem("verificationToken", newToken);
        }

        toast.success(
          response.data.message || "OTP resent successfully."
        );

        navigate("/verify-otp", {
          replace: true,
          state: {
            email,
            type,
          },
        });

        return;
      }

      setError(
        response?.data?.message ||
          "Unable to resend OTP. Please try again."
      );
    } catch (err) {
      console.error("RESEND OTP ERROR:", err);

      const status = err?.response?.status;
      const message = err?.response?.data?.message || "";

      if (status === 401) {
        setError(
          message ||
            "Verification session expired. Please start again."
        );
        return;
      }

      if (status === 429) {
        setError(
          message ||
            "Too many OTP requests. Please try again later."
        );
        return;
      }

      setError(
        message || "Unable to resend OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBackToVerify = () => {
    navigate("/verify-otp", {
      replace: true,
      state: {
        email,
        type,
      },
    });
  };

  return (
    <AuthLayout
      heading="Need a new code?"
      highlight="We'll send one."
      description="Your previous OTP has expired. Request a fresh 6-digit verification code to continue securely."
    >
      {/* Header */}
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
          New OTP
        </span>

        <div className="mt-3 flex items-center gap-3">
          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-indigo-50
              text-indigo-600
              dark:bg-emerald-400/10
              dark:text-emerald-400
            "
          >
            <RefreshCw size={21} strokeWidth={1.8} />
          </div>

          <h2
            className="
              text-[24px]
              font-bold
              leading-tight
              tracking-[-0.03em]
              text-slate-900
              sm:text-[28px]
              dark:text-white
            "
          >
            Resend OTP
          </h2>
        </div>

        <p
          className="
            mt-2
            text-[12.5px]
            leading-5
            text-slate-500
            sm:text-[13px]
            dark:text-slate-400
          "
        >
          Request a new verification code for your account.
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
          readOnly
          disabled={loading}
          autoComplete="email"
          placeholder="Your registered email"
          error={error}
        />

        {/* Security Info */}
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
            A new 6-digit verification code will be sent to this
            email address.
          </p>
        </div>

        {/* Resend Button */}
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
            <>
              <RefreshCw size={16} />
              Send New OTP
            </>
          )}
        </button>
      </form>

      {/* Back */}
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
        Want to try the current code?{" "}
        <button
          type="button"
          onClick={handleBackToVerify}
          disabled={loading}
          className="
            font-semibold
            text-indigo-600
            transition-colors
            hover:text-indigo-700
            disabled:cursor-not-allowed
            disabled:opacity-50
            dark:text-emerald-400
            dark:hover:text-emerald-300
          "
        >
          Back to verification
        </button>
      </p>
    </AuthLayout>
  );
};

export default ResendOTP;