import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginUser, registerUserByGoogle } from "../../Services/AuthAPI";
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

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setFieldErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = formData.email.trim();
    const password = formData.password;

    const errors = {
      email: "",
      password: "",
    };

    if (!email) {
      errors.email = "Email is required.";
    }

    if (!password) {
      errors.password = "Password is required.";
    }

    if (errors.email || errors.password) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({
      email: "",
      password: "",
    });

    setLoading(true);

    try {
      const response = await loginUser({
        email,
        password,
      });

      const responseData = response?.data || response || {};

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

      if (accessToken) {
        localStorage.setItem("userToken", accessToken);
      }

      if (refreshToken) {
        localStorage.setItem("userRefreshToken", refreshToken);
      }

      const apiUser =
        responseData?.user ||
        responseData?.profile ||
        responseData?.account ||
        responseData?.data?.user ||
        responseData?.data?.profile ||
        responseData?.data?.account ||
        null;

      let loggedInUser;

      if (apiUser && typeof apiUser === "object") {
        loggedInUser = {
          id:
            apiUser?.id ||
            apiUser?._id ||
            apiUser?.userId ||
            apiUser?.uuid ||
            null,

          name:
            apiUser?.name ||
            apiUser?.fullName ||
            apiUser?.username ||
            apiUser?.firstName ||
            "",

          email: apiUser?.email || email,

          profileImage:
            apiUser?.profileImage ||
            apiUser?.profile_image ||
            apiUser?.avatar ||
            apiUser?.avatarUrl ||
            apiUser?.image ||
            "",
        };
      } else {
        loggedInUser = {
          id: null,
          name: "",
          email,
          profileImage: "",
        };
      }

      try {
        localStorage.setItem(
          "servicePlannerUser",
          JSON.stringify(loggedInUser)
        );
      } catch (storageError) {
        console.error("USER STORAGE ERROR:", storageError);
      }

      window.dispatchEvent(
        new CustomEvent("userLogin", {
          detail: {
            user: loggedInUser,
          },
        })
      );

      toast.success("Login successful!");

      navigate("/profile", { replace: true });
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Login failed. Please check your credentials.";

      // Show the login error under the password field
      setFieldErrors({
        email: "",
        password: errorMessage,
      });
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
    <AuthLayout>
      {/* Heading */}
      <div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-indigo-600 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-400">
          <Sparkles size={11} />
          Welcome back
        </span>

        <h2 className="mt-2 text-[22px] font-bold leading-tight tracking-[-0.03em] text-slate-900 sm:text-[26px] dark:text-white">
          Sign in to continue
        </h2>

        <p className="mt-1 hidden text-[12.5px] leading-5 text-slate-500 sm:block dark:text-slate-400">
          Access your plans and keep everything organized in one place.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="mt-3 space-y-2 sm:mt-4 sm:space-y-2.5"
      >
        <AuthField
          id="email"
          name="email"
          type="email"
          label="Email address"
          icon={Mail}
          value={formData.email}
          onChange={handleChange}
          error={fieldErrors.email}
          disabled={loading}
          autoComplete="email"
          placeholder="you@example.com"
        />

        <AuthField
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          label="Password"
          icon={Lock}
          value={formData.password}
          onChange={handleChange}
          error={fieldErrors.password}
          disabled={loading}
          autoComplete="current-password"
          placeholder="Enter your password"
          labelRight={
            <button
              type="button"
              onClick={() => navigate("/forgot-password", { replace: true })}
              className="text-[11px] font-semibold text-indigo-600 transition-colors hover:text-indigo-700 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              Forgot password?
            </button>
          }
          rightSlot={
            <EyeButton
              visible={showPassword}
              disabled={loading}
              onClick={() => setShowPassword((previous) => !previous)}
            />
          }
        />

        {/* Remember me */}
        <label className="flex cursor-pointer items-center gap-2 pt-0.5">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 accent-indigo-600 focus:outline-none focus:ring-0 dark:border-slate-600 dark:accent-emerald-400"
          />

          <span className="text-[12px] font-medium text-slate-500 dark:text-slate-400">
            Remember me
          </span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className={authButtonClass}
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400/40 border-t-slate-500 dark:border-slate-500/40 dark:border-t-slate-300" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      {/* Google */}
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

      {/* New here */}
      <div className="my-2.5 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
          New here?
        </span>
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
      </div>

      <Link
        to="/register"
        replace
        className="flex h-[44px] w-full items-center justify-center rounded-xl border border-slate-200 bg-white/70 px-5 text-[13px] font-bold text-slate-700 outline-none transition-colors duration-200 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 focus:outline-none focus:ring-0 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:border-emerald-400 dark:hover:bg-emerald-400/10 dark:hover:text-emerald-300"
      >
        Create an account
      </Link>

      <p className="mt-2.5 text-center text-[10px] leading-4 text-slate-400 dark:text-slate-500">
        By continuing, you agree to our
        <span className="font-semibold text-slate-500 dark:text-slate-400">
          {" "}
          terms and privacy policy.
        </span>
      </p>
    </AuthLayout>
  );
};

export default Login;