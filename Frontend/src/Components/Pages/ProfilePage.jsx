import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Home,
  Camera,
  Edit3,
  Save,
  X,
  Globe,
  Building2,
  KeyRound,
  LogOut,
  Search,
  Check,
  LayoutDashboard,
  Plane,
  Cake,
  CalendarDays,
  Clock3,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import {
  getUserProfile,
  updateUserProfile,
  logoutUser,
  getUserDashboard,
} from "../../Services/AuthAPI";

import showSuccess from "../../Utils/toast";
import Dashboard from "./Dashboard";
import Navbar from "../Layout/Navbar";

const countries = [
  "India",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "Singapore",
  "United Arab Emirates",
];

const statesByCountry = {
  India: [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
  ],
  "United States": [
    "California",
    "Texas",
    "Florida",
    "New York",
    "Washington",
    "Arizona",
    "Nevada",
    "Illinois",
    "Ohio",
    "Georgia",
  ],
  "United Kingdom": [
    "England",
    "Scotland",
    "Wales",
    "Northern Ireland",
  ],
  Canada: [
    "Ontario",
    "Quebec",
    "British Columbia",
    "Alberta",
    "Manitoba",
    "Saskatchewan",
  ],
  Australia: [
    "New South Wales",
    "Victoria",
    "Queensland",
    "Western Australia",
    "South Australia",
    "Tasmania",
  ],
  Germany: [
    "Bavaria",
    "Berlin",
    "Hamburg",
    "Hesse",
    "Saxony",
  ],
  France: [
    "Île-de-France",
    "Occitanie",
    "Nouvelle-Aquitaine",
    "Auvergne-Rhône-Alpes",
  ],
  Japan: [
    "Tokyo",
    "Osaka",
    "Kyoto",
    "Hokkaido",
    "Aichi",
    "Fukuoka",
  ],
  Singapore: ["Singapore"],
  "United Arab Emirates": [
    "Abu Dhabi",
    "Dubai",
    "Sharjah",
    "Ajman",
    "Fujairah",
    "Ras Al Khaimah",
    "Umm Al Quwain",
  ],
};

const fieldWrap =
  "group relative min-h-[64px] w-full rounded-xl border border-slate-200 bg-[#f5f7fb] px-3 pb-2 pt-5 shadow-[0_2px_8px_rgba(15,23,42,.025)] transition-all duration-200 sm:min-h-[70px] sm:rounded-2xl sm:px-4 sm:pb-2.5 sm:pt-5.5";

const labelCls =
  "pointer-events-none absolute left-3 top-2 z-10 text-[clamp(0.58rem,0.55vw,0.7rem)] font-medium uppercase tracking-[0.08em] text-slate-500 transition-colors duration-200 sm:left-4 sm:tracking-[0.1em] group-focus-within:text-indigo-500";

const iconBoxCls =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-500 transition-all duration-200 group-hover:bg-indigo-100 group-hover:text-indigo-600 sm:h-9 sm:w-9";

const dropdownCls =
  "absolute left-0 right-0 top-[68px] z-[9999] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,.12)] sm:top-[76px] sm:rounded-2xl";

const dropdownMotion = {
  initial: {
    opacity: 0,
    y: -6,
    scale: 0.985,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  exit: {
    opacity: 0,
    y: -5,
    scale: 0.985,
  },
  transition: {
    duration: 0.16,
    ease: "easeOut",
  },
};

const SectionCard = ({
  icon: Icon,
  title,
  subtitle,
  children,
  delay = 0,
  className = "",
}) => (
  <motion.div
    initial={{
      opacity: 0,
      y: 10,
    }}
    animate={{
      opacity: 1,
      y: 0,
    }}
    transition={{
      delay,
      duration: 0.25,
    }}
    className={`flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-3.5 shadow-[0_6px_24px_rgba(15,23,42,.045)] sm:p-4 lg:p-5 ${className}`}
  >
    {(Icon || title) && (
      <div className="mb-3 flex min-w-0 shrink-0 items-center gap-2.5 sm:mb-4 sm:gap-3">
        {Icon && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500 sm:h-10 sm:w-10">
            <Icon size={17} />
          </div>
        )}

        <div className="min-w-0">
          <h2 className="truncate text-[clamp(0.88rem,0.95vw,1.08rem)] font-semibold leading-5 text-[#0f172a]">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-0.5 truncate text-[clamp(0.68rem,0.68vw,0.8rem)] font-normal leading-4 text-slate-500">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    )}

    <div className="min-h-0 flex-1">{children}</div>
  </motion.div>
);

const InputField = ({
  icon: Icon,
  label,
  name,
  value,
  onChange,
  editing,
  type = "text",
  inputMode,
  placeholder,
  maxLength,
  error,
}) => (
  <div className="relative z-0 w-full min-w-0">
    <div
      className={`${fieldWrap} ${
        error
          ? "border-red-300 bg-red-50/40 focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-100"
          : "focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100"
      }`}
    >
      <label
        className={`${labelCls} ${
          error ? "text-red-500" : ""
        }`}
      >
        {label}
      </label>

      <div className="flex min-w-0 items-center gap-2">
        <span
          className={`${iconBoxCls} ${
            error
              ? "bg-red-100 text-red-500 group-hover:bg-red-100 group-hover:text-red-500"
              : ""
          }`}
        >
          <Icon size={15} />
        </span>

        <input
          type={type}
          inputMode={inputMode}
          name={name}
          value={value}
          onChange={onChange}
          disabled={!editing}
          placeholder={placeholder}
          maxLength={maxLength}
          autoComplete="off"
          className={`min-w-0 w-full bg-transparent text-[clamp(0.76rem,0.72vw,0.9rem)] font-normal leading-5 text-[#0f172a] outline-none placeholder:text-slate-400/70 ${
            !editing ? "cursor-default" : ""
          }`}
        />
      </div>
    </div>

    {error && (
      <p
        role="alert"
        className="mt-1 px-1 text-[clamp(0.66rem,0.6vw,0.78rem)] font-normal leading-4 text-red-500"
      >
        {error}
      </p>
    )}
  </div>
);

const LocationSearch = ({
  label,
  icon: Icon,
  editing,
  value,
  search,
  options,
  show,
  setShow,
  setOtherShow,
  onInput,
  onSelect,
  placeholder,
}) => {
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!show) return;

    const handleClickOutside = (event) => {
      if (!wrapperRef.current?.contains(event.target)) {
        setShow(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, [show, setShow]);

  const handleFocus = () => {
    if (!editing) return;

    setShow(true);
    setOtherShow?.(false);
  };

  return (
    <div
      ref={wrapperRef}
      className={`relative w-full min-w-0 ${
        show ? "z-[100]" : "z-10"
      }`}
    >
      <div className={fieldWrap}>
        <label className={labelCls}>{label}</label>

        <div className="flex min-w-0 items-center gap-2">
          <span className={iconBoxCls}>
            <Icon size={15} />
          </span>

          <input
            type="text"
            value={value}
            disabled={!editing}
            placeholder={placeholder}
            autoComplete="off"
            spellCheck="false"
            onFocus={handleFocus}
            onChange={onInput}
            className={`min-w-0 flex-1 bg-transparent text-[clamp(0.76rem,0.72vw,0.9rem)] font-normal leading-5 text-[#0f172a] outline-none placeholder:text-slate-400/70 ${
              !editing ? "cursor-default" : ""
            }`}
          />

          {editing && (
            <Search
              size={15}
              strokeWidth={1.8}
              className="shrink-0 text-slate-400"
            />
          )}
        </div>

        <AnimatePresence>
          {editing && show && (
            <motion.div
              {...dropdownMotion}
              className={dropdownCls}
            >
              <div className="max-h-52 overflow-y-auto p-1.5 sm:max-h-56 sm:p-2">
                {options.length > 0 ? (
                  options.map((option) => {
                    const selected = option === value;

                    return (
                      <button
                        key={option}
                        type="button"
                        onMouseDown={(event) =>
                          event.preventDefault()
                        }
                        onClick={() => onSelect(option)}
                        className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[clamp(0.68rem,0.65vw,0.8rem)] font-normal transition-all sm:rounded-xl sm:px-3 sm:py-2.5 ${
                          selected
                            ? "bg-indigo-50 text-indigo-600"
                            : "text-[#0f172a] hover:bg-indigo-50 hover:text-indigo-600"
                        }`}
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-500">
                          <MapPin size={13} />
                        </span>

                        <span className="min-w-0 flex-1 truncate">
                          {option}
                        </span>

                        {selected && (
                          <Check
                            size={14}
                            className="ml-auto shrink-0 text-indigo-500"
                          />
                        )}
                      </button>
                    );
                  })
                ) : search.trim() ? (
                  <button
                    type="button"
                    onMouseDown={(event) =>
                      event.preventDefault()
                    }
                    onClick={() => onSelect(search)}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[clamp(0.68rem,0.65vw,0.8rem)] font-normal text-[#0f172a] transition-all hover:bg-indigo-50 hover:text-indigo-600 sm:rounded-xl sm:px-3 sm:py-2.5"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-500">
                      <MapPin size={13} />
                    </span>

                    <span className="truncate">
                      Use "{search}"
                    </span>
                  </button>
                ) : (
                  <div className="px-3 py-5 text-center text-[clamp(0.68rem,0.65vw,0.8rem)] font-normal text-slate-400">
                    Start typing to search...
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [activePage, setActivePage] = useState("profile");
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const [stateSearch, setStateSearch] = useState("");
  const [showCountries, setShowCountries] = useState(false);
  const [showStates, setShowStates] = useState(false);

  const [dashboardData, setDashboardData] = useState({
    allTrips: [],
    confirmedTrips: [],
    cancelledTrips: [],
    allBirthdays: [],
    confirmedBirthdays: [],
    cancelledBirthdays: [],
  });

  const [dashboardLoading, setDashboardLoading] =
    useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      fullName: "",
      houseNo: "",
      area: "",
      city: "",
      state: "",
      country: "India",
      pincode: "",
    },
  });

  const getAddress = (data) => ({
    fullName: data?.address?.fullName || "",
    houseNo: data?.address?.houseNo || "",
    area: data?.address?.area || "",
    city: data?.address?.city || "",
    state: data?.address?.state || "",
    country: data?.address?.country || "India",
    pincode: data?.address?.pincode || "",
  });

  const setProfileData = (data) => {
    const address = getAddress(data);

    setUser(data);

    setForm({
      name: data?.name || "",
      email: data?.email || "",
      phone: String(data?.phone || "")
        .replace(/\D/g, "")
        .slice(0, 10),
      address,
    });

    setPhoneError("");
    setCountrySearch(address.country);
    setStateSearch(address.state);
    setImagePreview(data?.profileImage?.url || "");
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const response = await getUserProfile();

      setProfileData(response.data.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load profile",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setDashboardLoading(true);

      const response = await getUserDashboard();

      if (!response?.status) {
        throw new Error(
          response?.message ||
            "Unable to load dashboard",
        );
      }

      const data = response?.data || {};

      setDashboardData({
        allTrips: Array.isArray(data.allTrips)
          ? data.allTrips
          : [],
        confirmedTrips: Array.isArray(
          data.confirmedTrips,
        )
          ? data.confirmedTrips
          : [],
        cancelledTrips: Array.isArray(
          data.cancelledTrips,
        )
          ? data.cancelledTrips
          : [],
        allBirthdays: Array.isArray(
          data.allBirthdays,
        )
          ? data.allBirthdays
          : [],
        confirmedBirthdays: Array.isArray(
          data.confirmedBirthdays,
        )
          ? data.confirmedBirthdays
          : [],
        cancelledBirthdays: Array.isArray(
          data.cancelledBirthdays,
        )
          ? data.cancelledBirthdays
          : [],
      });
    } catch (error) {
      console.error(
        "PROFILE DASHBOARD ERROR:",
        error,
      );

      setDashboardData({
        allTrips: [],
        confirmedTrips: [],
        cancelledTrips: [],
        allBirthdays: [],
        confirmedBirthdays: [],
        cancelledBirthdays: [],
      });
    } finally {
      setDashboardLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchDashboardData();
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "phone") {
      const numericValue = value
        .replace(/\D/g, "")
        .slice(0, 10);

      setForm((prev) => ({
        ...prev,
        phone: numericValue,
      }));

      if (phoneError) {
        setPhoneError(
          numericValue.length === 10
            ? ""
            : "Phone number must be exactly 10 digits",
        );
      }

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  const handleCountryInput = (event) => {
    const value = event.target.value;

    setCountrySearch(value);

    setForm((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        country: value,
      },
    }));

    setShowCountries(true);
    setShowStates(false);
  };

  const handleStateInput = (event) => {
    const value = event.target.value;

    setStateSearch(value);

    setForm((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        state: value,
      },
    }));

    setShowStates(true);
    setShowCountries(false);
  };

  const selectCountry = (country) => {
    setForm((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        country,
        state:
          country === prev.address.country
            ? prev.address.state
            : "",
      },
    }));

    setCountrySearch(country);

    if (country !== form.address.country) {
      setStateSearch("");
    }

    setShowCountries(false);
    setShowStates(false);
  };

  const selectState = (state) => {
    setForm((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        state,
      },
    }));

    setStateSearch(state);
    setShowStates(false);
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleEdit = () => {
    setEditing(true);
    setPhoneError("");
    setCountrySearch(form.address.country);
    setStateSearch(form.address.state);
  };

  const handleCancel = () => {
    if (!user) return;

    const address = getAddress(user);

    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setEditing(false);
    setPhoneError("");
    setImageFile(null);
    setShowCountries(false);
    setShowStates(false);

    setForm({
      name: user.name || "",
      email: user.email || "",
      phone: String(user.phone || "")
        .replace(/\D/g, "")
        .slice(0, 10),
      address,
    });

    setCountrySearch(address.country);
    setStateSearch(address.state);
    setImagePreview(user.profileImage?.url || "");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!form.email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!/^\d{10}$/.test(form.phone.trim())) {
      setPhoneError(
        "Phone number must be exactly 10 digits",
      );
      return;
    }

    setPhoneError("");

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("name", form.name.trim());
      formData.append("email", form.email.trim());
      formData.append("phone", form.phone.trim());

      formData.append(
        "address",
        JSON.stringify({
          fullName: form.address.fullName.trim(),
          houseNo: form.address.houseNo.trim(),
          area: form.address.area.trim(),
          city: form.address.city.trim(),
          state: form.address.state.trim(),
          country: form.address.country.trim(),
          pincode: form.address.pincode.trim(),
        }),
      );

      if (imageFile) {
        formData.append("profileImage", imageFile);
      }

      const response =
        await updateUserProfile(formData);

      setProfileData(response.data.data);

      setImageFile(null);
      setPhoneError("");
      setEditing(false);
      setShowCountries(false);
      setShowStates(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      showSuccess(
        response.data.message ||
          "Profile updated successfully",
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update profile",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = () => {
    navigate("/change-password", {
      state: {
        email: user?.email || "",
      },
    });
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logoutUser();
    } catch {
    } finally {
      localStorage.removeItem("userToken");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("verificationToken");
      localStorage.removeItem("resetToken");

      navigate("/login", {
        replace: true,
      });

      setLoggingOut(false);
    }
  };

  const handleViewTrip = (tripId) => {
    if (!tripId) {
      toast.error("Trip ID is missing");
      return;
    }

    navigate(`/tour/${tripId}`);
  };

  const handleViewBirthday = (birthdayId) => {
    if (!birthdayId) {
      toast.error("Birthday ID is missing");
      return;
    }

    navigate(`/birthday/${birthdayId}`);
  };

  const availableStates =
    statesByCountry[form.address.country] || [];

  const filteredCountries = countries.filter(
    (country) =>
      country
        .toLowerCase()
        .includes(countrySearch.toLowerCase()),
  );

  const filteredStates = availableStates.filter(
    (state) =>
      state
        .toLowerCase()
        .includes(stateSearch.toLowerCase()),
  );

  const navItems = [
    {
      key: "profile",
      label: "Profile",
      icon: User,
      activeClass:
        "bg-blue-50 text-blue-600",
      hoverClass:
        "hover:bg-blue-50 hover:text-blue-600",
      iconActive:
        "bg-white text-blue-600",
    },
    {
      key: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      activeClass:
        "bg-emerald-50 text-emerald-600",
      hoverClass:
        "hover:bg-emerald-50 hover:text-emerald-600",
      iconActive:
        "bg-white text-emerald-600",
    },
  ];

  const totalTrips = dashboardData.allTrips.length;
  const confirmedTrips =
    dashboardData.confirmedTrips.length;
  const cancelledTrips =
    dashboardData.cancelledTrips.length;
  const totalBirthdays =
    dashboardData.allBirthdays.length;

  const getDisplayStatus = (status) => {
    if (!status) return "Generated";

    const normalized = String(status)
      .trim()
      .toLowerCase();

    if (
      normalized === "booked" ||
      normalized === "booking"
    ) {
      return "Confirmed";
    }

    if (normalized === "cancelled") {
      return "Canceled";
    }

    return status;
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <section className="flex min-h-[calc(100vh-68px)] items-center justify-center bg-[#f4f6fa] px-4 lg:min-h-[calc(100vh-76px)]">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-500 sm:h-9 sm:w-9" />

            <p className="mt-3 text-[clamp(0.72rem,0.75vw,0.9rem)] font-normal text-slate-500">
              Loading profile...
            </p>
          </div>
        </section>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />

        <section className="flex min-h-[calc(100vh-68px)] items-center justify-center bg-[#f4f6fa] px-4 lg:min-h-[calc(100vh-76px)]">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-[0_8px_30px_rgba(15,23,42,.05)] sm:rounded-3xl sm:p-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500 sm:h-14 sm:w-14 sm:rounded-2xl">
              <User size={24} />
            </div>

            <h2 className="mt-4 text-[clamp(1rem,1.3vw,1.3rem)] font-semibold text-[#0f172a]">
              Unable to load profile
            </h2>

            <p className="mt-2 text-[clamp(0.72rem,0.75vw,0.9rem)] font-normal leading-5 text-slate-500">
              Something went wrong while loading your
              account information.
            </p>

            <button
              type="button"
              onClick={fetchProfile}
              className="mt-5 w-full rounded-xl bg-indigo-600 px-5 py-3 text-[clamp(0.72rem,0.75vw,0.9rem)] font-medium text-white transition hover:bg-indigo-700 sm:w-auto"
            >
              Try Again
            </button>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <section className="min-h-[calc(100vh-68px)] overflow-x-hidden bg-[#f4f6fa] px-2.5 py-3 text-[#0f172a] sm:px-4 sm:py-5 md:px-5 lg:min-h-[calc(100vh-76px)] lg:px-6 lg:py-6 xl:px-8">
        <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-3 sm:gap-4 lg:flex-row lg:items-start xl:gap-5">
          <motion.aside
            initial={{
              opacity: 0,
              x: -15,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            className="w-full shrink-0 lg:sticky lg:top-[92px] lg:w-[220px] xl:w-[235px] 2xl:w-[250px]"
          >
            <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_6px_24px_rgba(15,23,42,.045)] sm:p-3 lg:min-h-[calc(100vh-108px)]">
              <div className="flex items-center gap-2.5 px-2 py-2 sm:gap-3 sm:px-2.5 sm:py-3">
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-indigo-50 sm:h-12 sm:w-12 sm:rounded-2xl">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt={user.name || "Profile"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-indigo-500">
                      <User size={20} />
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-[clamp(0.7rem,0.7vw,0.85rem)] font-medium leading-5 text-[#0f172a]">
                    {user.name}
                  </p>

                  <p className="truncate text-[clamp(0.6rem,0.6vw,0.75rem)] font-normal leading-4 text-slate-500">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="my-1.5 border-t border-slate-100 sm:my-2" />

              <div className="grid grid-cols-2 gap-1.5 lg:flex lg:flex-col lg:gap-1.5">
                {navItems.map(
                  ({
                    key,
                    label,
                    icon: Icon,
                    activeClass,
                    hoverClass,
                    iconActive,
                  }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setActivePage(key);
                        setEditing(false);
                      }}
                      className={`flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-[clamp(0.66rem,0.68vw,0.8rem)] font-medium transition-all duration-200 lg:justify-start lg:px-3 sm:min-h-[44px] sm:gap-2 ${
                        activePage === key
                          ? activeClass
                          : `text-slate-600 ${hoverClass}`
                      }`}
                    >
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                          activePage === key
                            ? iconActive
                            : "bg-slate-50 text-slate-500"
                        }`}
                      >
                        <Icon size={15} />
                      </span>

                      <span>{label}</span>
                    </button>
                  ),
                )}
              </div>

              <div className="mt-4 hidden lg:block">
                <div className="rounded-xl bg-[#f8f9fc] p-3">
                  <p className="text-[clamp(0.6rem,0.55vw,0.72rem)] font-medium uppercase tracking-[0.12em] text-slate-400">
                    Account
                  </p>

                  <p className="mt-1.5 text-[clamp(0.66rem,0.65vw,0.8rem)] font-normal leading-5 text-slate-500">
                    Manage your personal information and
                    dashboard.
                  </p>
                </div>
              </div>
            </div>
          </motion.aside>

          <main className="min-w-0 flex-1">
            <AnimatePresence mode="wait">
              {activePage === "dashboard" ? (
                <motion.div
                  key="dashboard"
                  initial={{
                    opacity: 0,
                    x: 10,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: -10,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                >
                  <Dashboard />
                </motion.div>
              ) : (
                <motion.div
                  key="profile"
                  initial={{
                    opacity: 0,
                    x: 10,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: -10,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                >
                  <form
                    id="profile-form"
                    onSubmit={handleSave}
                    className="space-y-3.5 sm:space-y-4 lg:space-y-5"
                  >
                    <SectionCard className="h-auto min-h-[110px] sm:min-h-[120px]">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
                        <div className="flex min-w-0 items-center gap-3 sm:gap-4 lg:gap-5">
                          <div className="relative h-[64px] w-[64px] shrink-0 sm:h-20 sm:w-20 lg:h-[86px] lg:w-[86px]">
                            <div className="h-full w-full overflow-hidden rounded-full border-4 border-white bg-indigo-50 shadow-md ring-1 ring-slate-200">
                              {imagePreview ? (
                                <img
                                  src={imagePreview}
                                  alt={
                                    user.name ||
                                    "Profile"
                                  }
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-indigo-500">
                                  <User size={30} />
                                </div>
                              )}
                            </div>

                            {editing && (
                              <button
                                type="button"
                                onClick={() =>
                                  fileInputRef.current?.click()
                                }
                                className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg transition hover:bg-indigo-700 sm:h-8 sm:w-8"
                              >
                                <Camera size={14} />
                              </button>
                            )}

                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                            />
                          </div>

                          <div className="min-w-0">
                            <p className="text-[clamp(0.6rem,0.6vw,0.75rem)] font-medium uppercase tracking-[0.14em] text-indigo-500">
                              Account
                            </p>

                            <h1 className="mt-0.5 text-[clamp(1.35rem,2vw,2rem)] font-medium leading-tight tracking-tight text-[#3530c9]">
                              Profile
                            </h1>

                            <p className="mt-0.5 text-[clamp(0.68rem,0.72vw,0.88rem)] font-normal leading-5 text-slate-500">
                              Manage your personal
                              information.
                            </p>




                            <div className="mt-1.5">
                              <h2 className="truncate text-[clamp(0.9rem,1.1vw,1.2rem)] font-medium leading-5 text-[#0f172a]">
                                {user.name}
                              </h2>

                              <p className="mt-0.5 truncate text-[clamp(0.66rem,0.7vw,0.85rem)] font-normal leading-4 text-slate-500">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="w-full shrink-0 sm:w-auto">
                          {!editing ? (
                            <motion.button
                              type="button"
                              onClick={handleEdit}
                              whileHover={{
                                y: -2,
                              }}
                              whileTap={{
                                scale: 0.98,
                              }}
                              className="flex min-h-[40px] w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-[clamp(0.7rem,0.75vw,0.88rem)] font-medium text-white shadow-md transition hover:bg-indigo-700 sm:min-h-[42px] sm:w-auto sm:px-5"
                            >
                              <Edit3 size={15} />
                              Edit Profile
                            </motion.button>
                          ) : (
                            <div className="flex w-full gap-2 sm:w-auto">
                              <motion.button
                                type="button"
                                onClick={handleCancel}
                                disabled={saving}
                                whileTap={{
                                  scale: 0.98,
                                }}
                                className="flex min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-[clamp(0.68rem,0.72vw,0.86rem)] font-medium text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-50 sm:min-h-[42px] sm:flex-none sm:px-4"
                              >
                                <X size={15} />
                                Cancel
                              </motion.button>

                              <motion.button
                                type="submit"
                                form="profile-form"
                                disabled={saving}
                                whileTap={{
                                  scale: 0.98,
                                }}
                                className="flex min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-2.5 text-[clamp(0.68rem,0.72vw,0.86rem)] font-medium text-white shadow-md transition hover:bg-indigo-700 disabled:opacity-60 sm:min-h-[42px] sm:flex-none sm:px-4"
                              >
                                {saving ? (
                                  <>
                                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Saving...
                                  </>
                                ) : (
                                  <>
                                    <Save size={15} />
                                    Save
                                  </>
                                )}
                              </motion.button>
                            </div>
                          )}
                        </div>
                      </div>
                    </SectionCard>

                    <div className="grid min-w-0 grid-cols-1 items-stretch gap-3.5 sm:gap-4 xl:grid-cols-[1fr_1fr_0.9fr]">
                      <SectionCard
                        icon={User}
                        title="Personal Information"
                        subtitle="Your basic account details"
                        className="h-full"
                      >
                        <div className="flex h-full flex-col gap-2 sm:gap-2.5">
                          <div className="flex-1">
                            <InputField
                              icon={User}
                              label="Full Name"
                              name="name"
                              value={form.name}
                              onChange={handleChange}
                              editing={editing}
                              placeholder="Enter your name"
                            />
                          </div>

                          <div className="flex-1">
                            <InputField
                              icon={Mail}
                              label="Email Address"
                              name="email"
                              value={form.email}
                              onChange={handleChange}
                              editing={editing}
                              type="email"
                              placeholder="Enter your email"
                            />
                          </div>

                          <div className="flex-1">
                            <InputField
                              icon={Phone}
                              label="Phone Number"
                              name="phone"
                              value={form.phone}
                              onChange={handleChange}
                              editing={editing}
                              type="text"
                              inputMode="numeric"
                              maxLength={10}
                              error={phoneError}
                              placeholder="Enter 10 digit phone number"
                            />
                          </div>

                          <div className="flex min-h-[64px] flex-1 items-center gap-3 rounded-xl bg-[#f8f9fc] p-3 sm:min-h-[70px] sm:p-3.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-500 sm:h-9 sm:w-9">
                              <ShieldCheck size={16} />
                            </div>

                            <div className="min-w-0">
                              <p className="text-[clamp(0.66rem,0.65vw,0.8rem)] font-normal text-slate-400">
                                Account Verified
                              </p>

                              <p className="mt-0.5 text-[clamp(0.78rem,0.75vw,0.92rem)] font-medium text-slate-700">
                                {user.isVerified
                                  ? "Verified"
                                  : "Not Verified"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </SectionCard>

                      <SectionCard
                        icon={MapPin}
                        title="Location"
                        subtitle="Your address and location"
                        className="h-full"
                      >
                        <div className="flex h-full flex-col gap-2 sm:gap-2.5">
                          <div className="flex-1">
                            <InputField
                              icon={User}
                              label="Full Name"
                              name="fullName"
                              value={
                                form.address.fullName
                              }
                              onChange={
                                handleAddressChange
                              }
                              editing={editing}
                              placeholder="Enter full name"
                            />
                          </div>

                          <div className="flex-1">
                            <InputField
                              icon={Home}
                              label="House / Flat No."
                              name="houseNo"
                              value={
                                form.address.houseNo
                              }
                              onChange={
                                handleAddressChange
                              }
                              editing={editing}
                              placeholder="Enter house or flat number"
                            />
                          </div>

                          <div className="flex-1">
                            <InputField
                              icon={MapPin}
                              label="Area"
                              name="area"
                              value={form.address.area}
                              onChange={
                                handleAddressChange
                              }
                              editing={editing}
                              placeholder="Enter area"
                            />
                          </div>

                          <div className="flex-1">
                            <InputField
                              icon={Building2}
                              label="City"
                              name="city"
                              value={form.address.city}
                              onChange={
                                handleAddressChange
                              }
                              editing={editing}
                              placeholder="Enter city"
                            />
                          </div>

                          <div className="grid min-w-0 flex-1 grid-cols-1 gap-2 sm:grid-cols-2">
                            <LocationSearch
                              label="Country"
                              icon={Globe}
                              editing={editing}
                              value={
                                form.address.country
                              }
                              search={countrySearch}
                              options={
                                filteredCountries
                              }
                              show={showCountries}
                              setShow={
                                setShowCountries
                              }
                              setOtherShow={
                                setShowStates
                              }
                              onInput={
                                handleCountryInput
                              }
                              onSelect={
                                selectCountry
                              }
                              placeholder="Search country"
                            />

                            <LocationSearch
                              label="State"
                              icon={MapPin}
                              editing={editing}
                              value={
                                form.address.state
                              }
                              search={stateSearch}
                              options={filteredStates}
                              show={showStates}
                              setShow={setShowStates}
                              setOtherShow={
                                setShowCountries
                              }
                              onInput={
                                handleStateInput
                              }
                              onSelect={selectState}
                              placeholder="Search state"
                            />
                          </div>

                          <div className="flex-1">
                            <InputField
                              icon={MapPin}
                              label="Pincode"
                              name="pincode"
                              value={
                                form.address.pincode
                              }
                              onChange={
                                handleAddressChange
                              }
                              editing={editing}
                              placeholder="Enter pincode"
                            />
                          </div>
                        </div>
                      </SectionCard>

                      <SectionCard
                        icon={ShieldCheck}
                        title="Profile Overview"
                        subtitle="Account information"
                        className="h-full"
                      >
                        <div className="grid h-full min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-1">
                          <div className="flex min-h-[64px] min-w-0 flex-1 items-center gap-3 rounded-xl bg-[#f8f9fc] p-3 sm:min-h-[70px] sm:p-3.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-500 sm:h-9 sm:w-9">
                              <Plane size={16} />
                            </div>

                            <div className="min-w-0">
                              <p className="text-[clamp(0.66rem,0.65vw,0.8rem)] font-normal text-slate-400">
                                Total Trips
                              </p>

                              <p className="mt-0.5 text-[clamp(0.8rem,0.85vw,1rem)] font-medium text-slate-700">
                                {totalTrips}
                              </p>
                            </div>
                          </div>

                          <div className="flex min-h-[64px] min-w-0 flex-1 items-center gap-3 rounded-xl bg-[#f8f9fc] p-3 sm:min-h-[70px] sm:p-3.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-500 sm:h-9 sm:w-9">
                              <CalendarDays size={16} />
                            </div>

                            <div className="min-w-0">
                              <p className="text-[clamp(0.66rem,0.65vw,0.8rem)] font-normal text-slate-400">
                                Confirmed Plans
                              </p>

                              <p className="mt-0.5 text-[clamp(0.8rem,0.85vw,1rem)] font-medium text-slate-700">
                                {confirmedTrips}
                              </p>
                            </div>
                          </div>

                          <div className="flex min-h-[64px] min-w-0 flex-1 items-center gap-3 rounded-xl bg-[#f8f9fc] p-3 sm:min-h-[70px] sm:p-3.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-500 sm:h-9 sm:w-9">
                              <Clock3 size={16} />
                            </div>

                            <div className="min-w-0">
                              <p className="text-[clamp(0.66rem,0.65vw,0.8rem)] font-normal text-slate-400">
                                Canceled Plans
                              </p>

                              <p className="mt-0.5 text-[clamp(0.8rem,0.85vw,1rem)] font-medium text-slate-700">
                                {cancelledTrips}
                              </p>
                            </div>
                          </div>

                          <div className="flex min-h-[64px] min-w-0 flex-1 items-center gap-3 rounded-xl bg-[#f8f9fc] p-3 sm:min-h-[70px] sm:p-3.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-pink-50 text-pink-500 sm:h-9 sm:w-9">
                              <Cake size={16} />
                            </div>

                            <div className="min-w-0">
                              <p className="text-[clamp(0.66rem,0.65vw,0.8rem)] font-normal text-slate-400">
                                Birthday Plans
                              </p>

                              <p className="mt-0.5 text-[clamp(0.8rem,0.85vw,1rem)] font-medium text-slate-700">
                                {totalBirthdays}
                              </p>
                            </div>
                          </div>
                        </div>
                      </SectionCard>
                    </div>

                    {!dashboardLoading &&
                      dashboardData.allTrips.length >
                        0 && (
                        <SectionCard
                          icon={Plane}
                          title="Recent Trips"
                          subtitle="Your latest travel plans"
                        >
                          <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
                            {dashboardData.allTrips
                              .slice(0, 3)
                              .map((trip) => (
                                <button
                                  key={trip?._id}
                                  type="button"
                                  onClick={() =>
                                    handleViewTrip(
                                      trip?._id,
                                    )
                                  }
                                  className="min-w-0 rounded-xl border border-slate-100 bg-[#f8f9fc] p-3 text-left transition-all hover:border-blue-200 hover:bg-blue-50 active:scale-[0.99]"
                                >
                                  <div className="flex min-w-0 items-center gap-2.5">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
                                      <MapPin size={15} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                      <p className="truncate text-[clamp(0.74rem,0.7vw,0.9rem)] font-medium leading-5 text-slate-800">
                                        {trip?.destination ||
                                          trip?.place ||
                                          trip?.title ||
                                          "Travel Plan"}
                                      </p>

                                      <p className="mt-0.5 truncate text-[clamp(0.66rem,0.6vw,0.78rem)] font-normal leading-4 text-slate-500">
                                        {getDisplayStatus(
                                          trip?.status,
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                </button>
                              ))}
                          </div>
                        </SectionCard>
                      )}

                    {!dashboardLoading &&
                      dashboardData.allBirthdays.length >
                        0 && (
                        <SectionCard
                          icon={Cake}
                          title="Birthday Plans"
                          subtitle="Your latest birthday plans"
                        >
                          <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
                            {dashboardData.allBirthdays
                              .slice(0, 3)
                              .map((birthday) => (
                                <button
                                  key={birthday?._id}
                                  type="button"
                                  onClick={() =>
                                    handleViewBirthday(
                                      birthday?._id,
                                    )
                                  }
                                  className="min-w-0 rounded-xl border border-pink-100 bg-pink-50/40 p-3 text-left transition-all hover:border-red-200 hover:bg-red-50 active:scale-[0.99]"
                                >
                                  <div className="flex min-w-0 items-center gap-2.5">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500">
                                      <Cake size={15} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                      <p className="truncate text-[clamp(0.74rem,0.7vw,0.9rem)] font-medium leading-5 text-slate-800">
                                        {birthday?.name ||
                                          birthday?.Name ||
                                          birthday?.title ||
                                          "Birthday Plan"}
                                      </p>

                                      <p className="mt-0.5 truncate text-[clamp(0.66rem,0.6vw,0.78rem)] font-normal leading-4 text-slate-500">
                                        {getDisplayStatus(
                                          birthday?.status,
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                </button>
                              ))}
                          </div>
                        </SectionCard>
                      )}

                    <SectionCard
                      icon={KeyRound}
                      title="Account & Security"
                      subtitle="Manage your account access"
                    >
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={handleChangePassword}
                          className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[clamp(0.7rem,0.75vw,0.88rem)] font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 active:scale-[0.99]"
                        >
                          <KeyRound size={16} />
                          Change Password
                        </button>

                        <button
                          type="button"
                          onClick={handleLogout}
                          disabled={loggingOut}
                          className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-[clamp(0.7rem,0.75vw,0.88rem)] font-medium text-white transition hover:bg-red-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {loggingOut ? (
                            <>
                              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              Logging out...
                            </>
                          ) : (
                            <>
                              <LogOut size={16} />
                              Logout
                            </>
                          )}
                        </button>
                      </div>

                      {editing && (
                        <div className="mt-2.5 grid w-full grid-cols-2 gap-2 sm:hidden">
                          <button
                            type="button"
                            onClick={handleCancel}
                            disabled={saving}
                            className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-[clamp(0.68rem,0.72vw,0.84rem)] font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50"
                          >
                            <X size={15} />
                            Cancel
                          </button>

                          <button
                            type="submit"
                            disabled={saving}
                            className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-2.5 text-[clamp(0.68rem,0.72vw,0.84rem)] font-medium text-white transition hover:bg-indigo-700 disabled:opacity-60"
                          >
                            {saving ? (
                              <>
                                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save size={15} />
                                Save Changes
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </SectionCard>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </section>
    </>
  );
};

export default Profile;