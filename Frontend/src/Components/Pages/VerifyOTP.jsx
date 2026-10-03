import { useEffect, useRef, useState } from "react";
import { ShieldCheck, Sparkles } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { verifyOTP } from "../../Services/AuthAPI";
import AuthLayout, { authButtonClass } from "./AuthLayout";

const OTP_EMAIL_KEY = "otpEmail";
const OTP_TYPE_KEY = "otpType";

/*
 * Finds a token in the verify-otp response no matter what the
 * backend calls it: known names first, then any key that
 * contains "token", at the top level or inside `data`.
 */
const extractResetToken = (body) => {
  if (!body || typeof body !== "object") return null;

  const containers = [body, body.data].filter(
    (item) => item && typeof item === "object"
  );

  const knownKeys = [
    "resetToken",
    "reset_token",
    "token",
    "accessToken",
    "verificationToken",
  ];

  for (const container of containers) {
    for (const key of knownKeys) {
      if (typeof container[key] === "string" && container[key]) {
        return container[key];
      }
    }
  }

  for (const container of containers) {
    for (const key of Object.keys(container)) {
      if (
        key.toLowerCase().includes("token") &&
        typeof container[key] === "string" &&
        container[key]
      ) {
        return container[key];
      }
    }
  }

  return null;
};

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /*
   * location.state disappears on refresh, so fall back to
   * sessionStorage to keep the email and flow type.
   */
  const email =
    location.state?.email ||
    sessionStorage.getItem(OTP_EMAIL_KEY) ||
    "";

  const type =
    location.state?.type ||
    sessionStorage.getItem(OTP_TYPE_KEY) ||
    "verify-email";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(300);
  const [otpError, setOtpError] = useState("");

  const inputs = useRef([]);

  // Persist email + type so a page refresh doesn't lose them
  useEffect(() => {
    if (location.state?.email) {
      sessionStorage.setItem(OTP_EMAIL_KEY, location.state.email);
    }

    if (location.state?.type) {
      sessionStorage.setItem(OTP_TYPE_KEY, location.state.type);
    }
  }, [location.state]);

  // Single interval for the whole lifetime of the page
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((previous) => (previous > 0 ? previous - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  /*
   * Always use the token issued by the current register /
   * forgot-password / resend step. Never the old resetToken.
   */
  const getToken = () => localStorage.getItem("verificationToken");

  const clearOtpSession = () => {
    localStorage.removeItem("verificationToken");
    sessionStorage.removeItem(OTP_EMAIL_KEY);
    sessionStorage.removeItem(OTP_TYPE_KEY);
  };

  const formatTime = () => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);
    setOtpError("");

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();

    const pastedValue = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedValue) return;

    const newOtp = ["", "", "", "", "", ""];

    pastedValue.split("").forEach((digit, index) => {
      newOtp[index] = digit;
    });

    setOtp(newOtp);
    setOtpError("");

    const focusIndex = Math.min(pastedValue.length, 5);

    inputs.current[focusIndex]?.focus();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setOtpError("");

    const enteredOtp = otp.join("");

    if (seconds <= 0) {
      setOtpError("OTP has expired. Please request a new OTP.");
      return;
    }

    if (enteredOtp.length !== 6) {
      setOtpError("Please enter the complete 6-digit OTP.");
      return;
    }

    const token = getToken();

    if (!token) {
      setOtpError(
        "Verification session expired. Please request a new OTP."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await verifyOTP({
        otp: enteredOtp,
        token,
      });

      if (response.data.status) {
        if (type === "forgot-password") {
          // Temporary debug: shows exactly what your backend returns.
          // Remove once the flow works.
          console.log("VERIFY OTP RESPONSE:", response.data);

          // If the backend issues a separate reset token, use it.
          // Otherwise the token we just verified is the reset token.
          const resetToken =
            extractResetToken(response.data) || token;

          localStorage.setItem("resetToken", resetToken);
          clearOtpSession();

          toast.success(
            response.data.message || "OTP verified successfully."
          );

          navigate("/reset-password", {
            replace: true,
            state: {
              email,
            },
          });

          return;
        }

        clearOtpSession();

        toast.success(
          response.data.message || "OTP verified successfully."
        );

        navigate("/login", { replace: true });
        return;
      }

      setOtpError(
        response.data?.message || "Invalid or expired OTP."
      );
    } catch (error) {
      console.error("VERIFY OTP ERROR:", error);

      setOtpError(
        error.response?.data?.message || "Invalid or expired OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = () => {
    setOtpError("");

    navigate("/resend-otp", {
      replace: true,
      state: {
        email,
        type,
      },
    });
  };

  // "verify-email" is the default type, so treat it like register
  const isRegister = type === "register" || type === "verify-email";

  const backLink = isRegister
    ? {
      to: "/register",
      text: "Wrong email? Register again",
    }
    : {
      to: "/login",
      text: "Back to login",
    };

  return (
    <AuthLayout
      heading="One quick step"
      highlight="and you're in."
      description="We sent a 6-digit code to your email. Enter it to confirm it's really you and keep your plans secure."
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
          Verification
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
            <ShieldCheck size={22} strokeWidth={1.8} />
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
            Verify OTP
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
          Enter the 6-digit OTP sent to
        </p>

        <p
          className="
            mt-0.5
            break-all
            text-[13px]
            font-semibold
            text-indigo-600
            dark:text-emerald-400
          "
        >
          {email || "your email address"}
        </p>
      </div>

      {/* OTP Form */}
      <form onSubmit={handleSubmit} noValidate className="mt-5 w-full">
        {/* OTP Inputs */}
        <div className="flex w-full justify-center gap-2 sm:gap-2.5">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(element) => {
                inputs.current[index] = element;
              }}
              type="text"
              inputMode="numeric"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              maxLength={1}
              value={digit}
              disabled={loading}
              aria-label={`OTP digit ${index + 1}`}
              aria-invalid={Boolean(otpError)}
              aria-describedby={otpError ? "otp-error" : undefined}
              onChange={(event) =>
                handleChange(event.target.value, index)
              }
              onKeyDown={(event) => handleKeyDown(event, index)}
              onPaste={index === 0 ? handlePaste : undefined}
              style={{
                outline: "none",
                boxShadow: "none",
              }}
              className={`
                h-12
                w-10
                appearance-none
                rounded-xl
                border
                text-center
                text-lg
                font-bold
                text-slate-900
                outline-none
                shadow-none
                transition-colors
                duration-200
                hover:border-emerald-400
                focus:border-emerald-400
                focus:outline-none
                focus:ring-0
                focus:ring-offset-0
                focus:shadow-none
                disabled:cursor-not-allowed
                disabled:opacity-60
                dark:text-white
                dark:hover:border-emerald-400
                dark:focus:border-emerald-400
                sm:h-[52px]
                sm:w-11
                ${otpError
                  ? `
                      border-red-400
                      bg-red-50
                      dark:border-red-400/70
                      dark:bg-red-400/10
                    `
                  : digit
                    ? `
                        border-emerald-400
                        bg-emerald-50
                        dark:border-emerald-400/70
                        dark:bg-emerald-400/10
                      `
                    : `
                        border-slate-200
                        bg-white
                        dark:border-slate-700
                        dark:bg-slate-900/70
                      `
                }
              `}
            />
          ))}
        </div>

        {/* OTP Error */}
        {otpError && (
          <p
            id="otp-error"
            role="alert"
            className="
              mt-2.5
              text-center
              text-[11.5px]
              font-medium
              leading-4
              text-red-500
              dark:text-red-400
            "
          >
            {otpError}
          </p>
        )}

        {/* Timer */}
        <div
          className={`
            text-center
            ${otpError ? "mt-3" : "mt-4"}
          `}
        >
          {seconds > 0 ? (
            <p
              className="
                text-[13px]
                font-medium
                text-slate-500
                dark:text-slate-400
              "
            >
              OTP expires in{" "}
              <span
                className="
                  font-semibold
                  text-indigo-600
                  dark:text-emerald-400
                "
              >
                {formatTime()}
              </span>
            </p>
          ) : (
            <p
              className="
                text-[13px]
                font-medium
                text-red-500
                dark:text-red-400
              "
            >
              OTP has expired.
            </p>
          )}
        </div>

        {/* Verify Button */}
        <button
          type="submit"
          disabled={loading || seconds <= 0}
          className={`${authButtonClass} mt-4`}
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
              Verifying...
            </>
          ) : (
            "Verify OTP"
          )}
        </button>

        {/* Resend */}
        <div
          className="
            mt-4
            text-center
            text-[12.5px]
            font-medium
            text-slate-500
            dark:text-slate-400
          "
        >
          Didn't receive the OTP?{" "}
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={loading || seconds > 0}
            className="
              font-semibold
              text-indigo-600
              transition-colors
              duration-200
              hover:text-indigo-700
              disabled:cursor-not-allowed
              disabled:opacity-50
              dark:text-emerald-400
              dark:hover:text-emerald-300
            "
          >
            Resend OTP
          </button>
        </div>
      </form>

      {/* Back Link */}
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
        <Link
          to={backLink.to}
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
          {backLink.text}
        </Link>
      </p>
    </AuthLayout>
  );
};

export default VerifyOTP;