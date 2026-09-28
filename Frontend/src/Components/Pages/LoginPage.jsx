import { useEffect, useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Plane,
  Cake,
  CalendarDays,
  Sparkles,
  MapPin,
  Star,
  Heart,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginUser } from "../../Services/AuthAPI";

const LOGIN_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=85",
    label: "Travel",
    icon: Plane,
  },
  {
    src: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1000&q=85",
    label: "Celebrations",
    icon: Cake,
  },
  {
    src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=85",
    label: "Events",
    icon: CalendarDays,
  },
  {
    src: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1000&q=85",
    label: "Memories",
    icon: Heart,
  },
];

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

  const [activeImage, setActiveImage] = useState(0);
  const [imageDirection, setImageDirection] = useState(1);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setImageDirection(1);

      setActiveImage((previous) => {
        return (previous + 1) % LOGIN_IMAGES.length;
      });
    }, 4200);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

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

          email:
            apiUser?.email ||
            email,

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

      navigate("/profile");
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Login failed. Please check your credentials.";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main
        className="
          login-page
          relative
          min-h-[calc(100vh-1px)]
          w-full
          overflow-hidden
          bg-[#f4f6fa]
          text-slate-900
          transition-colors
          duration-500
          dark:bg-[#0f172a]
          dark:text-slate-100
        "
      >
        {/* Background Grid */}
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            opacity-100
          "
          style={{
            backgroundImage: `
              linear-gradient(
                90deg,
                var(--page-pattern-color) 1px,
                transparent 1px
              ),
              linear-gradient(
                0deg,
                var(--page-pattern-color) 1px,
                transparent 1px
              )
            `,
            backgroundSize: "48px 48px",
          }}
        />

        {/* Soft Background Lights */}
        <div
          className="
            pointer-events-none
            absolute
            -left-32
            top-10
            h-72
            w-72
            rounded-full
            bg-indigo-400/10
            blur-3xl
            dark:bg-emerald-400/[0.06]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -right-32
            bottom-0
            h-80
            w-80
            rounded-full
            bg-pink-400/10
            blur-3xl
            dark:bg-cyan-400/[0.05]
          "
        />

        {/* Main Page */}
        <div
          className="
            relative
            z-10
            mx-auto
            flex
            min-h-[calc(100vh-1px)]
            w-full
            max-w-[1180px]
            items-center
            px-4
            py-5
            sm:px-6
            sm:py-7
            lg:px-8
            lg:py-8
          "
        >
          <div
            className="
              grid
              w-full
              overflow-hidden
              rounded-[26px]
              border
              border-slate-200/80
              bg-white/80
              shadow-[0_25px_70px_rgba(15,23,42,0.10)]
              backdrop-blur-xl
              dark:border-slate-700/70
              dark:bg-slate-950/70
              dark:shadow-[0_25px_80px_rgba(0,0,0,0.28)]
              lg:min-h-[640px]
              lg:grid-cols-[1.05fr_0.95fr]
            "
          >
            {/* LEFT VISUAL SECTION */}
            <section
              className="
                relative
                hidden
                min-w-0
                overflow-hidden
                border-r
                border-slate-200/80
                p-7
                sm:p-9
                lg:flex
                lg:flex-col
                lg:justify-between
                dark:border-slate-700/70
              "
            >
              <div
                className="
                  pointer-events-none
                  absolute
                  -left-24
                  -top-24
                  h-64
                  w-64
                  rounded-full
                  bg-indigo-500/10
                  blur-3xl
                  dark:bg-emerald-400/10
                "
              />

              <div
                className="
                  pointer-events-none
                  absolute
                  -bottom-24
                  -right-24
                  h-72
                  w-72
                  rounded-full
                  bg-pink-500/10
                  blur-3xl
                  dark:bg-cyan-400/10
                "
              />

              {/* Header */}
              <div className="relative z-10">
                <div
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-indigo-200
                    bg-white
                    px-3.5
                    py-2
                    text-[11px]
                    font-semibold
                    text-indigo-600
                    shadow-sm
                    dark:border-emerald-400/20
                    dark:bg-slate-900
                    dark:text-emerald-400
                  "
                >
                  <Sparkles size={14} strokeWidth={2} />
                  Service Planner
                </div>

                <h1
                  className="
                    mt-5
                    max-w-[470px]
                    text-[32px]
                    font-bold
                    leading-[1.08]
                    tracking-[-0.035em]
                    text-slate-900
                    sm:text-[38px]
                    dark:text-white
                  "
                >
                  Plan something

                  <span
                    className="
                      block
                      bg-gradient-to-r
                      from-indigo-600
                      via-purple-600
                      to-pink-500
                      bg-clip-text
                      text-transparent
                      dark:from-emerald-400
                      dark:via-teal-400
                      dark:to-cyan-400
                    "
                  >
                    worth remembering.
                  </span>
                </h1>

                <p
                  className="
                    mt-4
                    max-w-[450px]
                    text-[14px]
                    leading-6
                    text-slate-600
                    sm:text-[15px]
                    dark:text-slate-300
                  "
                >
                  Organize trips, birthdays, events and experiences in one
                  simple planning space.
                </p>
              </div>

              {/* Four Images */}
              <div
                className="
                  relative
                  mx-auto
                  my-5
                  flex
                  min-h-[315px]
                  w-full
                  max-w-[500px]
                  items-center
                  justify-center
                "
              >
                {/* Image 1 */}
                <div
                  className="
                    login-photo
                    login-photo-one
                    group
                    absolute
                    left-[3%]
                    top-[7%]
                    h-[145px]
                    w-[112px]
                    overflow-hidden
                    rounded-[20px]
                    border-[2px]
                    border-indigo-500
                    bg-slate-200
                    shadow-[0_15px_35px_rgba(79,70,229,0.16)]
                    transition-all
                    duration-500
                    hover:z-30
                    hover:scale-[1.06]
                    hover:-rotate-1
                    dark:border-emerald-400
                    dark:bg-slate-800
                    dark:shadow-[0_0_0_1px_rgba(52,211,153,0.10),0_0_30px_rgba(52,211,153,0.20)]
                    dark:hover:shadow-[0_0_0_1px_rgba(52,211,153,0.25),0_0_38px_rgba(52,211,153,0.38)]
                    sm:h-[165px]
                    sm:w-[128px]
                  "
                >
                  <img
                    src={LOGIN_IMAGES[0].src}
                    alt="Travel planning"
                    className="
                      h-full
                      w-full
                      object-cover
                      transition-transform
                      duration-700
                      group-hover:scale-110
                    "
                  />

                  <div
                    className="
                      absolute
                      inset-x-0
                      bottom-0
                      bg-gradient-to-t
                      from-black/65
                      to-transparent
                      px-3
                      pb-3
                      pt-8
                    "
                  >
                    <span
                      className="
                        flex
                        items-center
                        gap-1.5
                        text-[11px]
                        font-semibold
                        text-white
                      "
                    >
                      <Plane size={12} />
                      Travel
                    </span>
                  </div>
                </div>

                {/* Image 2 */}
                <div
                  className="
                    login-photo
                    login-photo-two
                    group
                    absolute
                    right-[3%]
                    top-[2%]
                    h-[158px]
                    w-[124px]
                    overflow-hidden
                    rounded-[22px]
                    border-[2px]
                    border-fuchsia-500
                    bg-slate-200
                    shadow-[0_15px_35px_rgba(217,70,239,0.16)]
                    transition-all
                    duration-500
                    hover:z-30
                    hover:scale-[1.06]
                    hover:rotate-1
                    dark:border-cyan-400
                    dark:bg-slate-800
                    dark:shadow-[0_0_0_1px_rgba(34,211,238,0.10),0_0_30px_rgba(34,211,238,0.20)]
                    dark:hover:shadow-[0_0_0_1px_rgba(34,211,238,0.25),0_0_38px_rgba(34,211,238,0.38)]
                    sm:h-[178px]
                    sm:w-[138px]
                  "
                >
                  <img
                    src={LOGIN_IMAGES[1].src}
                    alt="Celebration planning"
                    className="
                      h-full
                      w-full
                      object-cover
                      transition-transform
                      duration-700
                      group-hover:scale-110
                    "
                  />

                  <div
                    className="
                      absolute
                      inset-x-0
                      bottom-0
                      bg-gradient-to-t
                      from-black/65
                      to-transparent
                      px-3
                      pb-3
                      pt-8
                    "
                  >
                    <span
                      className="
                        flex
                        items-center
                        gap-1.5
                        text-[11px]
                        font-semibold
                        text-white
                      "
                    >
                      <Cake size={12} />
                      Celebrate
                    </span>
                  </div>
                </div>

                {/* Image 3 */}
                <div
                  className="
                    login-photo
                    login-photo-three
                    group
                    absolute
                    bottom-[3%]
                    left-[17%]
                    h-[154px]
                    w-[124px]
                    overflow-hidden
                    rounded-[22px]
                    border-[2px]
                    border-amber-500
                    bg-slate-200
                    shadow-[0_15px_35px_rgba(245,158,11,0.16)]
                    transition-all
                    duration-500
                    hover:z-30
                    hover:scale-[1.06]
                    hover:-rotate-1
                    dark:border-violet-400
                    dark:bg-slate-800
                    dark:shadow-[0_0_0_1px_rgba(167,139,250,0.10),0_0_30px_rgba(167,139,250,0.20)]
                    dark:hover:shadow-[0_0_0_1px_rgba(167,139,250,0.25),0_0_38px_rgba(167,139,250,0.38)]
                    sm:h-[174px]
                    sm:w-[140px]
                  "
                >
                  <img
                    src={LOGIN_IMAGES[2].src}
                    alt="Event planning"
                    className="
                      h-full
                      w-full
                      object-cover
                      transition-transform
                      duration-700
                      group-hover:scale-110
                    "
                  />

                  <div
                    className="
                      absolute
                      inset-x-0
                      bottom-0
                      bg-gradient-to-t
                      from-black/65
                      to-transparent
                      px-3
                      pb-3
                      pt-8
                    "
                  >
                    <span
                      className="
                        flex
                        items-center
                        gap-1.5
                        text-[11px]
                        font-semibold
                        text-white
                      "
                    >
                      <CalendarDays size={12} />
                      Events
                    </span>
                  </div>
                </div>

                {/* Image 4 */}
                <div
                  className="
                    login-photo
                    login-photo-four
                    group
                    absolute
                    bottom-[7%]
                    right-[13%]
                    h-[148px]
                    w-[118px]
                    overflow-hidden
                    rounded-[20px]
                    border-[2px]
                    border-rose-500
                    bg-slate-200
                    shadow-[0_15px_35px_rgba(244,63,94,0.16)]
                    transition-all
                    duration-500
                    hover:z-30
                    hover:scale-[1.06]
                    hover:rotate-1
                    dark:border-pink-400
                    dark:bg-slate-800
                    dark:shadow-[0_0_0_1px_rgba(244,114,182,0.10),0_0_30px_rgba(244,114,182,0.20)]
                    dark:hover:shadow-[0_0_0_1px_rgba(244,114,182,0.25),0_0_38px_rgba(244,114,182,0.38)]
                    sm:h-[168px]
                    sm:w-[132px]
                  "
                >
                  <img
                    src={LOGIN_IMAGES[3].src}
                    alt="Memorable experiences"
                    className="
                      h-full
                      w-full
                      object-cover
                      transition-transform
                      duration-700
                      group-hover:scale-110
                    "
                  />

                  <div
                    className="
                      absolute
                      inset-x-0
                      bottom-0
                      bg-gradient-to-t
                      from-black/65
                      to-transparent
                      px-3
                      pb-3
                      pt-8
                    "
                  >
                    <span
                      className="
                        flex
                        items-center
                        gap-1.5
                        text-[11px]
                        font-semibold
                        text-white
                      "
                    >
                      <Heart size={12} />
                      Memories
                    </span>
                  </div>
                </div>

                {/* Center Marker */}
                <div
                  className="
                    pointer-events-none
                    absolute
                    left-1/2
                    top-1/2
                    z-20
                    flex
                    h-[66px]
                    w-[66px]
                    -translate-x-1/2
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/70
                    bg-white/85
                    shadow-[0_15px_35px_rgba(15,23,42,0.13)]
                    backdrop-blur-md
                    dark:border-slate-600/80
                    dark:bg-slate-900/85
                    dark:shadow-[0_0_35px_rgba(45,212,191,0.16)]
                  "
                >
                  <Sparkles
                    size={25}
                    className="text-indigo-600 dark:text-emerald-400"
                  />
                </div>
              </div>

              {/* Bottom Info */}
              <div
                className="
                  relative
                  z-10
                  flex
                  flex-wrap
                  items-center
                  justify-between
                  gap-3
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-2
                    text-[12px]
                    font-medium
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  <MapPin
                    size={14}
                    className="text-indigo-500 dark:text-emerald-400"
                  />

                  Plan anywhere, anytime
                </div>

                <div
                  className="
                    flex
                    items-center
                    gap-1
                    text-[11px]
                    font-semibold
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  <Star
                    size={13}
                    fill="currentColor"
                    className="text-amber-500"
                  />

                  Simple planning
                </div>
              </div>
            </section>

            {/* RIGHT LOGIN SECTION */}
            <section
              className="
                flex
                min-w-0
                items-center
                justify-center
                p-6
                sm:p-9
                lg:p-10
              "
            >
              <div className="w-full max-w-[390px]">
                {/* Mobile Brand */}
                <div
                  className="
                    mb-7
                    flex
                    items-center
                    gap-2.5
                    lg:hidden
                  "
                >
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      bg-gradient-to-br
                      from-indigo-500
                      to-purple-600
                      text-white
                      shadow-[0_8px_20px_rgba(99,102,241,0.22)]
                      dark:from-emerald-400
                      dark:to-cyan-500
                    "
                  >
                    <Sparkles size={20} strokeWidth={2} />
                  </div>

                  <div>
                    <p
                      className="
                        text-[15px]
                        font-bold
                        text-slate-900
                        dark:text-white
                      "
                    >
                      Service Planner
                    </p>

                    <p
                      className="
                        text-[11px]
                        font-medium
                        text-slate-500
                        dark:text-slate-400
                      "
                    >
                      Plan better. Experience more.
                    </p>
                  </div>
                </div>

                {/* Form Heading */}
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
                      py-1.5
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
                    Welcome back
                  </span>

                  <h2
                    className="
                      mt-4
                      text-[28px]
                      font-bold
                      leading-tight
                      tracking-[-0.03em]
                      text-slate-900
                      sm:text-[32px]
                      dark:text-white
                    "
                  >
                    Sign in to continue
                  </h2>

                  <p
                    className="
                      mt-2
                      text-[13px]
                      leading-5
                      text-slate-500
                      sm:text-[14px]
                      dark:text-slate-400
                    "
                  >
                    Access your plans and keep everything organized in one
                    place.
                  </p>
                </div>

                {/* LOGIN FORM */}
                <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                  {/* EMAIL */}
                  <div>
                    <label
                      htmlFor="email"
                      className="
                        mb-2
                        block
                        text-[12px]
                        font-semibold
                        text-slate-700
                        dark:text-slate-300
                      "
                    >
                      Email address
                    </label>

                    <div
                      className="
                        login-input
                        group
                        flex
                        h-[48px]
                        items-center
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        transition-colors
                        duration-200
                        hover:border-emerald-400
                        dark:border-slate-700
                        dark:bg-slate-900/70
                        dark:hover:border-emerald-400
                      "
                    >
                      <Mail
                        size={18}
                        className="
                          ml-3.5
                          shrink-0
                          text-slate-400
                          transition-colors
                          duration-200
                          group-hover:text-emerald-500
                          dark:text-slate-500
                          dark:group-hover:text-emerald-400
                        "
                      />

                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        autoComplete="email"
                        placeholder="you@example.com"
                        className="
                          login-field
                          h-full
                          min-w-0
                          flex-1
                          border-0
                          bg-transparent
                          px-3
                          text-[14px]
                          font-medium
                          text-slate-900
                          outline-none
                          ring-0
                          shadow-none
                          placeholder:text-slate-400
                          focus:border-0
                          focus:outline-none
                          focus:ring-0
                          focus:shadow-none
                          dark:text-white
                          dark:placeholder:text-slate-500
                        "
                      />
                    </div>

                    {/* Email Error */}
                    {fieldErrors.email && (
                      <p
                        className="
                          mt-1.5
                          text-[11px]
                          font-medium
                          text-red-500
                          dark:text-red-400
                        "
                      >
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>

                  {/* PASSWORD */}
                  <div>
                    <div
                      className="
                        mb-2
                        flex
                        items-center
                        justify-between
                      "
                    >
                      <label
                        htmlFor="password"
                        className="
                          block
                          text-[12px]
                          font-semibold
                          text-slate-700
                          dark:text-slate-300
                        "
                      >
                        Password
                      </label>

                      <button
                        type="button"
                        onClick={() => {
                          toast("Password recovery coming soon.", {
                            icon: "🔐",
                          });
                        }}
                        className="
                          text-[11px]
                          font-semibold
                          text-indigo-600
                          transition-colors
                          hover:text-indigo-700
                          dark:text-emerald-400
                          dark:hover:text-emerald-300
                        "
                      >
                        Forgot password?
                      </button>
                    </div>

                    <div
                      className="
                        login-input
                        group
                        flex
                        h-[48px]
                        items-center
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        transition-colors
                        duration-200
                        hover:border-emerald-400
                        dark:border-slate-700
                        dark:bg-slate-900/70
                        dark:hover:border-emerald-400
                      "
                    >
                      <Lock
                        size={18}
                        className="
                          ml-3.5
                          shrink-0
                          text-slate-400
                          transition-colors
                          duration-200
                          group-hover:text-emerald-500
                          dark:text-slate-500
                          dark:group-hover:text-emerald-400
                        "
                      />

                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        className="
                          login-field
                          h-full
                          min-w-0
                          flex-1
                          border-0
                          bg-transparent
                          px-3
                          text-[14px]
                          font-medium
                          text-slate-900
                          outline-none
                          ring-0
                          shadow-none
                          placeholder:text-slate-400
                          focus:border-0
                          focus:outline-none
                          focus:ring-0
                          focus:shadow-none
                          dark:text-white
                          dark:placeholder:text-slate-500
                        "
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((previous) => !previous)
                        }
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        className="
                          mr-1
                          flex
                          h-10
                          w-10
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          text-slate-400
                          outline-none
                          transition-colors
                          hover:bg-transparent
                          hover:text-emerald-500
                          focus:outline-none
                          focus:ring-0
                          dark:hover:bg-transparent
                          dark:hover:text-emerald-400
                        "
                      >
                        {showPassword ? (
                          <EyeOff size={17} />
                        ) : (
                          <Eye size={17} />
                        )}
                      </button>
                    </div>

                    {/* Password Error */}
                    {fieldErrors.password && (
                      <p
                        className="
                          mt-1.5
                          text-[11px]
                          font-medium
                          text-red-500
                          dark:text-red-400
                        "
                      >
                        {fieldErrors.password}
                      </p>
                    )}
                  </div>

                  {/* REMEMBER */}
                  <label
                    className="
                      flex
                      cursor-pointer
                      items-center
                      gap-2
                      pt-0.5
                    "
                  >
                    <input
                      type="checkbox"
                      className="
                        h-4
                        w-4
                        rounded
                        border-slate-300
                        text-indigo-600
                        accent-indigo-600
                        focus:outline-none
                        focus:ring-0
                        dark:border-slate-600
                        dark:accent-emerald-400
                      "
                    />

                    <span
                      className="
                        text-[12px]
                        font-medium
                        text-slate-500
                        dark:text-slate-400
                      "
                    >
                      Remember me
                    </span>
                  </label>

                  {/* SIGN IN */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="
                      mt-1
                      flex
                      h-[48px]
                      w-full
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-slate-200
                      bg-transparent
                      px-5
                      text-[13px]
                      font-bold
                      text-slate-700
                      outline-none
                      transition-colors
                      duration-200
                      hover:border-emerald-400
                      hover:bg-emerald-50
                      hover:text-emerald-700
                      focus:border-slate-200
                      focus:bg-transparent
                      focus:text-slate-700
                      focus:outline-none
                      focus:ring-0
                      dark:border-slate-700
                      dark:bg-transparent
                      dark:text-slate-200
                      dark:hover:border-emerald-400
                      dark:hover:bg-emerald-400/10
                      dark:hover:text-emerald-300
                      dark:focus:border-slate-700
                      dark:focus:bg-transparent
                      dark:focus:text-slate-200
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
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

                        Signing in...
                      </>
                    ) : (
                      "Sign in"
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div
                  className="
                    my-6
                    flex
                    items-center
                    gap-3
                  "
                >
                  <div
                    className="
                      h-px
                      flex-1
                      bg-slate-200
                      dark:bg-slate-700
                    "
                  />

                  <span
                    className="
                      text-[10px]
                      font-medium
                      uppercase
                      tracking-[0.12em]
                      text-slate-400
                      dark:text-slate-500
                    "
                  >
                    New here?
                  </span>

                  <div
                    className="
                      h-px
                      flex-1
                      bg-slate-200
                      dark:bg-slate-700
                    "
                  />
                </div>

                {/* CREATE ACCOUNT */}
                <Link
                  to="/register"
                  className="
                    flex
                    h-[46px]
                    w-full
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-slate-200
                    bg-white/70
                    px-5
                    text-[14px]
                    text-slate-700
                    outline-none
                    transition-colors
                    duration-200
                    hover:border-emerald-400
                    hover:bg-emerald-50
                    hover:text-emerald-700
                    focus:outline-none
                    focus:ring-0
                    dark:border-slate-700
                    dark:bg-slate-900/60
                    dark:text-slate-200
                    dark:hover:border-emerald-400
                    dark:hover:bg-emerald-400/10
                    dark:hover:text-emerald-300
                  "
                >
                  Create an account
                </Link>

                <p
                  className="
                    mt-5
                    text-center
                    text-[10px]
                    leading-5
                    text-slate-400
                    dark:text-slate-500
                  "
                >
                  By continuing, you agree to our

                  <span
                    className="
                      font-semibold
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    {" "}
                    terms and privacy policy.
                  </span>
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <style>{`
        :root {
          --page-pattern-color: rgba(100, 116, 139, 0.10);
        }

        .dark {
          --page-pattern-color: rgba(148, 163, 184, 0.075);
        }

        /* Completely remove input focus/inner borders/rings */
        .login-input,
        .login-input:hover,
        .login-input:focus,
        .login-input:focus-within {
          outline: none !important;
          box-shadow: none !important;
        }

        .login-input input,
        .login-input input:hover,
        .login-input input:focus,
        .login-input input:active {
          border: 0 !important;
          outline: none !important;
          box-shadow: none !important;
          --tw-ring-shadow: 0 0 #0000 !important;
          --tw-ring-offset-shadow: 0 0 #0000 !important;
        }

        .login-input input:-webkit-autofill,
        .login-input input:-webkit-autofill:hover,
        .login-input input:-webkit-autofill:focus,
        .login-input input:-webkit-autofill:active {
          -webkit-text-fill-color: inherit !important;
          -webkit-box-shadow: 0 0 0 1000px transparent inset !important;
          box-shadow: 0 0 0 1000px transparent inset !important;
          transition: background-color 9999s ease-in-out 0s;
        }

        .login-input button,
        .login-input button:hover,
        .login-input button:focus {
          outline: none !important;
          box-shadow: none !important;
        }

        /* Floating images */
        .login-photo-one {
          animation: loginFloatOne 5.4s ease-in-out infinite;
        }

        .login-photo-two {
          animation: loginFloatTwo 6.2s ease-in-out infinite;
          animation-delay: -1.2s;
        }

        .login-photo-three {
          animation: loginFloatThree 5.8s ease-in-out infinite;
          animation-delay: -2.2s;
        }

        .login-photo-four {
          animation: loginFloatFour 6.4s ease-in-out infinite;
          animation-delay: -0.8s;
        }

        .login-photo:hover {
          animation-play-state: paused;
        }

        @keyframes loginFloatOne {
          0%,
          100% {
            transform: translate3d(0, 0, 0) rotate(-3deg);
          }

          50% {
            transform: translate3d(0, -9px, 0) rotate(-1deg);
          }
        }

        @keyframes loginFloatTwo {
          0%,
          100% {
            transform: translate3d(0, 0, 0) rotate(4deg);
          }

          50% {
            transform: translate3d(0, -11px, 0) rotate(2deg);
          }
        }

        @keyframes loginFloatThree {
          0%,
          100% {
            transform: translate3d(0, 0, 0) rotate(2deg);
          }

          50% {
            transform: translate3d(0, -8px, 0) rotate(4deg);
          }
        }

        @keyframes loginFloatFour {
          0%,
          100% {
            transform: translate3d(0, 0, 0) rotate(-4deg);
          }

          50% {
            transform: translate3d(0, -10px, 0) rotate(-2deg);
          }
        }

        @media (max-width: 1023px) {
          .login-photo-one {
            left: 4%;
          }

          .login-photo-two {
            right: 4%;
          }

          .login-photo-three {
            left: 12%;
          }

          .login-photo-four {
            right: 10%;
          }
        }

        @media (max-width: 640px) {
          .login-page {
            min-height: 100svh;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .login-photo-one,
          .login-photo-two,
          .login-photo-three,
          .login-photo-four {
            animation: none;
          }

          .login-photo,
          .login-photo img,
          button,
          a {
            transition: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default Login;