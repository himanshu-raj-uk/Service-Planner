import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginUser } from "../../Services/AuthAPI";

const Login = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password") {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setPasswordError("");

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      const res = await loginUser({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      if (res.data.status) {
        const accessToken = res.data.data?.accessToken;
        const refreshToken = res.data.data?.refreshToken;

        if (!accessToken) {
          toast.error("Login token was not received.");
          return;
        }

        localStorage.setItem("userToken", accessToken);

        if (refreshToken) {
          localStorage.setItem("userRefreshToken", refreshToken);
        }

        toast.success(res.data.message || "Login successful");
        navigate("/profile");
      }
    } catch (err) {
      console.error("LOGIN ERROR:", err);

      const message = err.response?.data?.message || "";

      if (
        message.toLowerCase().includes("password") ||
        err.response?.status === 401
      ) {
        setPasswordError("Incorrect password");
      } else {
        toast.error(message || "Login failed");
      }
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
            Welcome Back
          </h2>

          <p className="mt-2 text-xs font-medium text-slate-500 sm:text-sm">
            Login to continue to your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-5">
          <div className="group relative h-[78px] w-full min-w-0">
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
              name="email"
              value={formData.email}
              onChange={handleChange}
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

          <div className="group relative w-full min-w-0">
            <div className="relative h-[78px] w-full">
              <label className="pointer-events-none absolute left-5 top-2.5 z-10 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 transition-colors duration-200 group-hover:text-indigo-500 group-focus-within:text-indigo-500">
                Password
              </label>

              <Lock
                size={17}
                strokeWidth={1.9}
                className={`absolute left-5 top-1/2 z-10 -translate-y-1/2 ${
                  passwordError ? "text-red-500" : "text-indigo-500"
                }`}
              />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                autoComplete="current-password"
                placeholder="Enter your password"
                style={{
                  outline: "none",
                  boxShadow: "none",
                }}
                className={`h-full w-full appearance-none rounded-2xl border bg-white pl-14 pr-14 pt-5 text-[15px] font-medium leading-6 text-[#0f172a] outline-none shadow-none transition-colors duration-200 placeholder:text-slate-400/60 focus:outline-none focus:ring-0 focus:ring-offset-0 focus:shadow-none disabled:cursor-not-allowed disabled:opacity-70 ${
                  passwordError
                    ? "border-red-500 bg-red-50 hover:border-red-500 focus:border-red-500"
                    : "border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 focus:border-indigo-500 focus:bg-indigo-50"
                }`}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={loading}
                style={{
                  outline: "none",
                  boxShadow: "none",
                }}
                className="absolute right-5 top-1/2 z-10 -translate-y-1/2 text-slate-400 outline-none transition-colors duration-200 hover:text-indigo-500 focus:outline-none focus:ring-0 focus:ring-offset-0 focus:shadow-none disabled:opacity-50"
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>

            {passwordError && (
              <p className="mt-2 text-sm font-medium text-red-500">
                {passwordError}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 pt-1 text-xs sm:text-sm">
            <label className="flex cursor-pointer items-center gap-2 text-slate-600">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 accent-indigo-600"
              />
              <span>Remember Me</span>
            </label>

            <Link
              to="/forgot-password"
              className="font-medium text-indigo-600 transition-colors duration-200 hover:text-indigo-700"
            >
              Forgot Password?
            </Link>
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
                Logging in...
              </span>
            ) : (
              <>
                <Lock size={18} className="mr-2" />
                Login
              </>
            )}
          </button>

          <p className="text-center text-xs font-medium text-slate-600 sm:text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-indigo-600 transition-colors duration-200 hover:text-indigo-700"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Login;
