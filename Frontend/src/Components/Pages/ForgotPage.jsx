import { useState } from "react";
import { Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { forgotPassword } from "../../Services/AuthAPI";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      toast.error("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      const res = await forgotPassword(cleanEmail);

      if (res.data.status) {
        localStorage.setItem("verificationToken", res.data.token);

        localStorage.setItem("forgotPasswordEmail", cleanEmail);

        toast.success(res.data.message || "OTP sent successfully.");

        navigate("/verify-otp", {
          replace: true,
          state: {
            email: cleanEmail,
            type: "forgot-password",
          },
        });
      }
    } catch (err) {
      console.error("FORGOT PASSWORD ERROR:", err);

      toast.error(err.response?.data?.message || "Unable to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-screen w-full items-start justify-center bg-[#E8EDF5] px-4 pb-8 pt-12 sm:px-6 sm:pt-16 lg:px-8">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-[#F8FAFC] p-5 shadow-[0_8px_30px_rgba(15,23,42,0.10)] sm:p-8 md:p-10">
        <div className="mb-8 text-center">
          <h1 className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-2xl font-bold tracking-wide text-transparent sm:text-3xl">
            All Services Planner
          </h1>

          <p className="mt-2 text-xs font-medium text-slate-500 sm:text-sm">
            Your Complete Planning & Booking Platform
          </p>

          <h2 className="mt-7 text-xl font-medium text-[#0f172a] sm:text-2xl">
            Forgot Password
          </h2>

          <p className="mt-2 text-xs font-medium leading-5 text-slate-500 sm:text-sm">
            Enter your email address and we'll send you an OTP to reset your
            password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-5">
          <div className="group relative w-full min-w-0">
            <div className="relative h-[78px] w-full">
              <label className="pointer-events-none absolute left-5 top-2.5 z-10 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 transition-colors duration-200 group-hover:text-indigo-500 group-focus-within:text-indigo-500">
                Email Address
              </label>

              <Mail
                size={17}
                strokeWidth={1.9}
                className="absolute left-5 top-1/2 z-10 -translate-y-1/2 text-indigo-500"
              />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                autoComplete="email"
                placeholder="Enter your email address"
                style={{
                  outline: "none",
                  boxShadow: "none",
                }}
                className="h-full w-full appearance-none rounded-2xl border border-slate-200 bg-white pl-14 pr-5 pt-5 text-[15px] font-medium leading-6 text-[#0f172a] outline-none shadow-none transition-colors duration-200 placeholder:text-slate-400/60 hover:border-indigo-500 hover:bg-indigo-50 focus:border-indigo-500 focus:bg-indigo-50 focus:outline-none focus:ring-0 focus:ring-offset-0 focus:shadow-none disabled:cursor-not-allowed disabled:opacity-70"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              outline: "none",
              boxShadow: "none",
            }}
            className="flex h-14 w-full items-center justify-center rounded-2xl bg-indigo-500 px-4 text-sm font-semibold text-white outline-none shadow-none transition-colors duration-200 hover:bg-indigo-600 focus:outline-none focus:ring-0 focus:ring-offset-0 focus:shadow-none disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Sending OTP...
              </span>
            ) : (
              "Send OTP"
            )}
          </button>

          <p className="text-center text-xs font-medium text-slate-600 sm:text-sm">
            Remember your password?{" "}
            <Link
              to="/login"
              className="font-semibold text-indigo-600 transition-colors duration-200 hover:text-indigo-700"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default ForgotPassword;
