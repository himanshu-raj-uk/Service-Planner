import { useState } from "react";
import { User, Mail, Phone, Lock, Eye, EyeOff, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { registerUser, registerUserByGoogle } from "../../Services/AuthAPI";
import AuthLayout, { AuthField, authButtonClass } from "./AuthLayout";
import GoogleAuthButton from "./GoogleAuthButton";

const EyeButton = ({ visible, onClick, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={visible ? "Hide password" : "Show password"}
    className="mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 outline-none transition-colors hover:text-emerald-500 focus:outline-none focus:ring-0 disabled:opacity-50 dark:hover:text-emerald-400"
  >
    {visible ? <EyeOff size={16} /> : <Eye size={16} />}
  </button>
);

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

  const handleChange = (event) => {
    const { name, value } = event.target;

    const updatedValue =
      name === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value;

    setFormData((previous) => ({ ...previous, [name]: updatedValue }));
    setErrors((previous) => ({ ...previous, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const phone = formData.phone.trim();

    if (!name) {
      newErrors.name = "Name is required.";
    } else if (!/^[A-Za-z ]{2,50}$/.test(name)) {
      newErrors.name = "Enter a valid name (letters and spaces only).";
    }

    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!phone) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^[6-9]\d{9}$/.test(phone)) {
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

  const goToVerify = (email) => {
    navigate("/verify-otp", {
      replace: true,
      state: { email, type: "register" },
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      password: formData.password,
    };

    try {
      setLoading(true);

      const res = await registerUser(payload);

      if (res?.data?.status) {
        const verificationToken =
          res.data.verificationToken ||
          res.data.token ||
          res.data.data?.verificationToken;

        if (verificationToken) {
          localStorage.setItem("verificationToken", verificationToken);
        }

        toast.success(res.data.message || "OTP sent successfully.");

        goToVerify(payload.email);
      }
    } catch (err) {
      console.error("REGISTER ERROR:", err);

      const status = err.response?.status;
      const data = err.response?.data || {};
      const message = data.message || "";
      const lowerMessage = message.toLowerCase();

      if (status === 429) {
        toast.error("Too many attempts. Please try again after some time.");
        return;
      }

      // Backend saved the pending user but the OTP email failed (503).
      // Keep the token and let the user use "Resend OTP" on the verify page.
      if (status === 503 && data.verificationToken) {
        localStorage.setItem("verificationToken", data.verificationToken);

        toast.error(
          message || "OTP email could not be sent. Please resend the OTP.",
        );

        goToVerify(payload.email);
        return;
      }

      if (
        lowerMessage.includes("email") &&
        (lowerMessage.includes("exist") ||
          lowerMessage.includes("registered") ||
          lowerMessage.includes("already"))
      ) {
        setErrors((previous) => ({
          ...previous,
          email: "Email is already registered.",
        }));
        return;
      }

      if (lowerMessage.includes("phone") || lowerMessage.includes("mobile")) {
        setErrors((previous) => ({
          ...previous,
          phone: message || "Phone number is already registered.",
        }));
        return;
      }

      toast.error(message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleResponse = async (googleResponse) => {
    const credential = googleResponse?.credential;

    if (!credential) {
      toast.error("Google sign-in failed. Please try again.");
      return;
    }

    try {
      setLoading(true);

      // NOTE: the key name must match what your backend expects
      const response = await registerUserByGoogle({
        credential,
      });
      const responseData = response?.data || {};

      const accessToken =
        responseData?.userToken ||
        responseData?.accessToken ||
        responseData?.token ||
        responseData?.data?.userToken ||
        responseData?.data?.accessToken ||
        responseData?.data?.token;

      const refreshToken =
        responseData?.userRefreshToken ||
        responseData?.refreshToken ||
        responseData?.data?.userRefreshToken ||
        responseData?.data?.refreshToken;

      if (!accessToken) {
        toast.error(responseData?.message || "Google sign-in failed.");
        return;
      }

      localStorage.setItem("userToken", accessToken);

      if (refreshToken) {
        localStorage.setItem("userRefreshToken", refreshToken);
      }

      window.dispatchEvent(new CustomEvent("userLogin"));

      toast.success(responseData?.message || "Login successful!");

      navigate("/profile", { replace: true });
    } catch (error) {
      console.error("GOOGLE AUTH ERROR:", error);

      toast.error(
        error?.response?.data?.message ||
        "Google sign-in failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      heading="Start planning"
      highlight="your first memory."
      description="Create your free account and organize trips, birthdays and events in one simple planning space."
    >
      {/* Heading */}
      <div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-indigo-600 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-400">
          <Sparkles size={11} />
          Get started
        </span>

        <h2 className="mt-2 text-[22px] font-bold leading-tight tracking-[-0.03em] text-slate-900 sm:text-[26px] dark:text-white">
          Create your account
        </h2>

        <p className="mt-1 hidden text-[12.5px] leading-5 text-slate-500 sm:block dark:text-slate-400">
          Register to start planning your journey.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-3 space-y-2 sm:mt-4 sm:space-y-2.5"
      >
        <AuthField
          id="name"
          name="name"
          type="text"
          label="Name"
          icon={User}
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          disabled={loading}
          autoComplete="name"
          placeholder="Enter your name"
        />

        <AuthField
          id="email"
          name="email"
          type="email"
          label="Email"
          icon={Mail}
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          disabled={loading}
          autoComplete="email"
          placeholder="Enter your email"
        />

        <AuthField
          id="phone"
          name="phone"
          type="tel"
          label="Phone"
          icon={Phone}
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
          disabled={loading}
          autoComplete="tel"
          inputMode="numeric"
          maxLength={10}
          placeholder="Enter your phone number"
        />

        <AuthField
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          label="Password"
          icon={Lock}
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          disabled={loading}
          autoComplete="new-password"
          placeholder="Create a password"
          rightSlot={
            <EyeButton
              visible={showPassword}
              disabled={loading}
              onClick={() => setShowPassword((previous) => !previous)}
            />
          }
        />

        <AuthField
          id="confirmPassword"
          name="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          label="Confirm password"
          icon={Lock}
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          disabled={loading}
          autoComplete="new-password"
          placeholder="Confirm your password"
          rightSlot={
            <EyeButton
              visible={showConfirmPassword}
              disabled={loading}
              onClick={() => setShowConfirmPassword((previous) => !previous)}
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
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </button>
      </form>

      {/* Google (below Create account) */}
      <div className="my-2.5 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
          Or
        </span>
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
      </div>

      <GoogleAuthButton
        text="signin_with"
        onCredential={handleGoogleResponse}
        disabled={loading}
      />

      {/* Small login link (plain text, no button) */}
      <p className="mt-3 text-center text-[12px] font-medium text-slate-500 dark:text-slate-400">
        Already have an account?{" "}
        <Link
          to="/login"
          replace
          className="font-semibold text-indigo-600 transition-colors hover:text-indigo-700 dark:text-emerald-400 dark:hover:text-emerald-300"
        >
          Login
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Register;