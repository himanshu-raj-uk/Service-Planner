import { useState } from "react";
import { User, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { registerUser } from "../../Services/AuthAPI";

const Register = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedValue =
      name === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    const nameRegex = /^[A-Za-z ]{2,50}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const phone = formData.phone.trim();

    if (!name) {
      newErrors.name = "Name is required.";
    } else if (!nameRegex.test(name)) {
      newErrors.name = "Enter a valid name.";
    }

    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!phone) {
      newErrors.phone = "Phone number is required.";
    } else if (!phoneRegex.test(phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
      };

      const res = await registerUser(payload);

      if (res.data.status) {
        const verificationToken =
          res.data.token ||
          res.data.verificationToken ||
          res.data.data?.verificationToken;

        if (verificationToken) {
          localStorage.setItem("verificationToken", verificationToken);
        }

        toast.success(res.data.message || "Registration successful.");

        navigate("/verify-otp", {
          state: {
            email: payload.email,
            type: "register",
          },
        });
      }
    } catch (err) {
      console.error("REGISTER ERROR:", err);

      const status = err.response?.status;
      const message = err.response?.data?.message || "";
      const lowerMessage = message.toLowerCase();

      if (status === 429) {
        toast.error("Too many attempts. Please try again after some time.");
        return;
      }

      if (
        lowerMessage.includes("email") &&
        (lowerMessage.includes("exist") ||
          lowerMessage.includes("registered") ||
          lowerMessage.includes("already"))
      ) {
        setErrors((prev) => ({
          ...prev,
          email: "Email is already registered.",
        }));
        return;
      }

      if (lowerMessage.includes("phone") || lowerMessage.includes("mobile")) {
        setErrors((prev) => ({
          ...prev,
          phone: message || "Phone number is already registered.",
        }));
        return;
      }

      toast.error(message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const getFieldClass = (field) => {
    const hasError = errors[field];

    if (hasError) {
      return "border-red-500 bg-red-50 hover:border-red-500 focus:border-red-500";
    }

    return "border-slate-200 bg-white hover:border-indigo-500 hover:bg-indigo-50 focus:border-indigo-500 focus:bg-indigo-50";
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
            Create Account
          </h2>

          <p className="mt-2 text-xs font-medium text-slate-500 sm:text-sm">
            Register to start planning your journey.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-5">
          <div className="group relative w-full min-w-0">
            <div className="relative h-[78px] w-full">
              <label className="pointer-events-none absolute left-5 top-2.5 z-10 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 transition-colors duration-200 group-hover:text-indigo-500 group-focus-within:text-indigo-500">
                Full Name
              </label>

              <User
                size={17}
                strokeWidth={1.9}
                className={`absolute left-5 top-1/2 z-10 -translate-y-1/2 ${
                  errors.name ? "text-red-500" : "text-indigo-500"
                }`}
              />

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
                autoComplete="name"
                placeholder="Enter your full name"
                style={{
                  outline: "none",
                  boxShadow: "none",
                }}
                className={`h-full w-full appearance-none rounded-2xl border pl-14 pr-5 pt-5 text-[15px] font-medium leading-6 text-[#0f172a] outline-none shadow-none transition-colors duration-200 placeholder:text-slate-400/60 focus:outline-none focus:ring-0 focus:ring-offset-0 focus:shadow-none disabled:cursor-not-allowed disabled:opacity-70 ${getFieldClass(
                  "name",
                )}`}
              />
            </div>

            {errors.name && (
              <p className="mt-2 text-sm font-medium text-red-500">
                {errors.name}
              </p>
            )}
          </div>

          <div className="group relative w-full min-w-0">
            <div className="relative h-[78px] w-full">
              <label className="pointer-events-none absolute left-5 top-2.5 z-10 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 transition-colors duration-200 group-hover:text-indigo-500 group-focus-within:text-indigo-500">
                Email Address
              </label>

              <Mail
                size={17}
                strokeWidth={1.9}
                className={`absolute left-5 top-1/2 z-10 -translate-y-1/2 ${
                  errors.email ? "text-red-500" : "text-indigo-500"
                }`}
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
                className={`h-full w-full appearance-none rounded-2xl border pl-14 pr-5 pt-5 text-[15px] font-medium leading-6 text-[#0f172a] outline-none shadow-none transition-colors duration-200 placeholder:text-slate-400/60 focus:outline-none focus:ring-0 focus:ring-offset-0 focus:shadow-none disabled:cursor-not-allowed disabled:opacity-70 ${getFieldClass(
                  "email",
                )}`}
              />
            </div>

            {errors.email && (
              <p className="mt-2 text-sm font-medium text-red-500">
                {errors.email}
              </p>
            )}
          </div>

          <div className="group relative w-full min-w-0">
            <div className="relative h-[78px] w-full">
              <label className="pointer-events-none absolute left-5 top-2.5 z-10 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 transition-colors duration-200 group-hover:text-indigo-500 group-focus-within:text-indigo-500">
                Phone Number
              </label>

              <Phone
                size={17}
                strokeWidth={1.9}
                className={`absolute left-5 top-1/2 z-10 -translate-y-1/2 ${
                  errors.phone ? "text-red-500" : "text-indigo-500"
                }`}
              />

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={loading}
                autoComplete="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder="Enter your phone number"
                style={{
                  outline: "none",
                  boxShadow: "none",
                }}
                className={`h-full w-full appearance-none rounded-2xl border pl-14 pr-5 pt-5 text-[15px] font-medium leading-6 text-[#0f172a] outline-none shadow-none transition-colors duration-200 placeholder:text-slate-400/60 focus:outline-none focus:ring-0 focus:ring-offset-0 focus:shadow-none disabled:cursor-not-allowed disabled:opacity-70 ${getFieldClass(
                  "phone",
                )}`}
              />
            </div>

            {errors.phone && (
              <p className="mt-2 text-sm font-medium text-red-500">
                {errors.phone}
              </p>
            )}
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
                  errors.password ? "text-red-500" : "text-indigo-500"
                }`}
              />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                autoComplete="new-password"
                placeholder="Create your password"
                style={{
                  outline: "none",
                  boxShadow: "none",
                }}
                className={`h-full w-full appearance-none rounded-2xl border pl-14 pr-14 pt-5 text-[15px] font-medium leading-6 text-[#0f172a] outline-none shadow-none transition-colors duration-200 placeholder:text-slate-400/60 focus:outline-none focus:ring-0 focus:ring-offset-0 focus:shadow-none disabled:cursor-not-allowed disabled:opacity-70 ${getFieldClass(
                  "password",
                )}`}
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

            {errors.password && (
              <p className="mt-2 text-sm font-medium text-red-500">
                {errors.password}
              </p>
            )}
          </div>

          <div className="group relative w-full min-w-0">
            <div className="relative h-[78px] w-full">
              <label className="pointer-events-none absolute left-5 top-2.5 z-10 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 transition-colors duration-200 group-hover:text-indigo-500 group-focus-within:text-indigo-500">
                Confirm Password
              </label>

              <Lock
                size={17}
                strokeWidth={1.9}
                className={`absolute left-5 top-1/2 z-10 -translate-y-1/2 ${
                  errors.confirmPassword ? "text-red-500" : "text-indigo-500"
                }`}
              />

              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                autoComplete="new-password"
                placeholder="Confirm your password"
                style={{
                  outline: "none",
                  boxShadow: "none",
                }}
                className={`h-full w-full appearance-none rounded-2xl border pl-14 pr-14 pt-5 text-[15px] font-medium leading-6 text-[#0f172a] outline-none shadow-none transition-colors duration-200 placeholder:text-slate-400/60 focus:outline-none focus:ring-0 focus:ring-offset-0 focus:shadow-none disabled:cursor-not-allowed disabled:opacity-70 ${getFieldClass(
                  "confirmPassword",
                )}`}
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                disabled={loading}
                style={{
                  outline: "none",
                  boxShadow: "none",
                }}
                className="absolute right-5 top-1/2 z-10 -translate-y-1/2 text-slate-400 outline-none transition-colors duration-200 hover:text-indigo-500 focus:outline-none focus:ring-0 focus:ring-offset-0 focus:shadow-none disabled:opacity-50"
              >
                {showConfirmPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>

            {errors.confirmPassword && (
              <p className="mt-2 text-sm font-medium text-red-500">
                {errors.confirmPassword}
              </p>
            )}
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
                Creating Account...
              </span>
            ) : (
              <>
                <User size={18} className="mr-2" />
                Create Account
              </>
            )}
          </button>

          <p className="text-center text-xs font-medium text-slate-600 sm:text-sm">
            Already have an account?{" "}
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

export default Register;
