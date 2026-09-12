import { useEffect, useRef, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { verifyOTP, resendOTP } from "../../Services/AuthAPI";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";
  const type = location.state?.type || "verify-email";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(300);

  const inputs = useRef([]);

  useEffect(() => {
    if (seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  const getToken = () => {
    if (type === "forgot-password") {
      return (
        localStorage.getItem("resetToken") ||
        localStorage.getItem("verificationToken")
      );
    }

    return localStorage.getItem("verificationToken");
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

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pastedValue = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedValue) return;

    const newOtp = ["", "", "", "", "", ""];

    pastedValue.split("").forEach((digit, index) => {
      newOtp[index] = digit;
    });

    setOtp(newOtp);

    const focusIndex = Math.min(pastedValue.length, 5);
    inputs.current[focusIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const enteredOtp = otp.join("");

    if (seconds <= 0) {
      toast.error("OTP has expired. Please request a new OTP.");
      return;
    }

    if (enteredOtp.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP.");
      return;
    }

    const token = getToken();

    if (!token) {
      toast.error("Verification session expired. Please request a new OTP.");
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
          const resetToken =
            response.data.token || response.data.data?.resetToken;

          if (resetToken) {
            localStorage.setItem("resetToken", resetToken);
          }

          localStorage.removeItem("verificationToken");

          toast.success(response.data.message || "OTP verified successfully.");

          navigate("/reset-password", {
            replace: true,
            state: {
              email,
            },
          });
        } else {
          localStorage.removeItem("verificationToken");

          toast.success(response.data.message || "OTP verified successfully.");

          navigate("/login");
        }
      }
    } catch (error) {
      console.error("VERIFY OTP ERROR:", error);

      toast.error(error.response?.data?.message || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    const token = getToken();

    if (!token) {
      toast.error("Verification session expired. Please start again.");
      return;
    }

    try {
      setLoading(true);

      const response = await resendOTP(token);

      if (response.data.status) {
        setOtp(["", "", "", "", "", ""]);
        setSeconds(300);

        inputs.current[0]?.focus();

        toast.success(response.data.message || "OTP resent successfully.");
      }
    } catch (error) {
      console.error("RESEND OTP ERROR:", error);

      toast.error(error.response?.data?.message || "Unable to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-screen w-full items-start justify-center bg-[#E8EDF5] px-4 pb-8 pt-12 sm:px-6 sm:pt-16 lg:px-8">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-[#F8FAFC] p-5 shadow-[0_8px_30px_rgba(15,23,42,0.10)] sm:p-8 md:p-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
            <ShieldCheck size={28} strokeWidth={1.8} />
          </div>

          <h1 className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-2xl font-bold tracking-wide text-transparent sm:text-3xl">
            All Services Planner
          </h1>

          <p className="mt-2 text-xs font-medium text-slate-500 sm:text-sm">
            Your Complete Planning & Booking Platform
          </p>

          <h2 className="mt-7 text-xl font-medium text-[#0f172a] sm:text-2xl">
            Verify OTP
          </h2>

          <p className="mt-2 text-xs font-medium leading-5 text-slate-500 sm:text-sm">
            Enter the 6-digit OTP sent to
          </p>

          <p className="mt-1 break-all text-sm font-semibold text-indigo-600">
            {email || "your email address"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex w-full justify-center gap-2 sm:gap-3">
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
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={index === 0 ? handlePaste : undefined}
                style={{
                  outline: "none",
                  boxShadow: "none",
                }}
                className="h-12 w-10 appearance-none rounded-xl border border-slate-200 bg-white text-center text-lg font-bold text-[#0f172a] outline-none shadow-none transition-colors duration-200 hover:border-indigo-500 hover:bg-indigo-50 focus:border-indigo-500 focus:bg-indigo-50 focus:outline-none focus:ring-0 focus:ring-offset-0 focus:shadow-none disabled:cursor-not-allowed disabled:bg-slate-100 sm:h-14 sm:w-12 sm:rounded-2xl sm:text-xl"
              />
            ))}
          </div>

          <div className="mt-5 text-center">
            {seconds > 0 ? (
              <p className="text-sm font-medium text-slate-500">
                OTP expires in{" "}
                <span className="font-semibold text-indigo-600">
                  {formatTime()}
                </span>
              </p>
            ) : (
              <p className="text-sm font-medium text-red-500">
                OTP has expired.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || seconds <= 0}
            style={{
              outline: "none",
              boxShadow: "none",
            }}
            className="mt-6 flex h-14 w-full items-center justify-center rounded-2xl bg-indigo-500 px-4 text-sm font-semibold text-white outline-none shadow-none transition-colors duration-200 hover:bg-indigo-600 focus:outline-none focus:ring-0 focus:ring-offset-0 focus:shadow-none disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Verifying...
              </span>
            ) : (
              "Verify OTP"
            )}
          </button>

          <div className="mt-5 text-center">
            <span className="text-sm font-medium text-slate-500">
              Didn't receive the OTP?
            </span>{" "}
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={loading || seconds > 0}
              className="text-sm font-semibold text-indigo-600 transition-colors duration-200 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Resend OTP
            </button>
          </div>

          <p className="mt-5 text-center text-xs font-medium text-slate-500 sm:text-sm">
            Make sure you enter the OTP before it expires.
          </p>
        </form>
      </div>
    </section>
  );
};

export default VerifyOTP;
