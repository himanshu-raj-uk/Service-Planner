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
  CheckCircle2,
  Globe,
  Building2,
  KeyRound,
  LogOut,
  Search,
  Check,
  LayoutDashboard,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import {
  getUserProfile,
  updateUserProfile,
  logoutUser,
} from "../../Services/AuthAPI";

import showSuccess from "../../Utils/toast";
import Dashboard from "./Dashboard";

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

  "United Kingdom": ["England", "Scotland", "Wales", "Northern Ireland"],

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

  Germany: ["Bavaria", "Berlin", "Hamburg", "Hesse", "Saxony"],

  France: [
    "Île-de-France",
    "Occitanie",
    "Nouvelle-Aquitaine",
    "Auvergne-Rhône-Alpes",
  ],

  Japan: ["Tokyo", "Osaka", "Kyoto", "Hokkaido", "Aichi", "Fukuoka"],

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
  "profile-field group relative min-h-[72px] sm:min-h-[78px] w-full rounded-2xl border border-slate-200 bg-[#f4f6fa] px-4 sm:px-5 pb-3 pt-6 sm:pt-7 shadow-[0_2px_8px_rgba(15,23,42,.025)] transition-all duration-200";

const labelCls =
  "pointer-events-none absolute left-4 sm:left-5 top-2.5 z-10 text-[10px] font-semibold uppercase tracking-[0.1em] sm:tracking-[0.12em] text-slate-500 transition-colors duration-200 group-focus-within:text-indigo-500";

const iconBoxCls =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-500 transition-all duration-200 group-hover:bg-indigo-100 group-hover:text-indigo-600";

const dropdownCls =
  "absolute left-0 right-0 top-[78px] sm:top-[84px] z-[9999] overflow-hidden rounded-2xl border border-slate-200 bg-[#f4f6fa] shadow-[0_20px_50px_rgba(15,23,42,.12)]";

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

const SectionCard = ({ icon: Icon, title, subtitle, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 lg:p-8 shadow-[0_8px_30px_rgba(15,23,42,.05)]"
  >
    {(Icon || title) && (
      <div className="mb-5 sm:mb-7 flex items-center gap-3">
        {Icon && (
          <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500">
            <Icon size={20} />
          </div>
        )}

        <div className="min-w-0">
          <h2 className="truncate text-lg sm:text-xl font-bold text-[#0f172a]">
            {title}
          </h2>

          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-500">{subtitle}</p>
          )}
        </div>
      </div>
    )}

    {children}
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
  placeholder,
}) => (
  <div className="relative z-0 w-full">
    <div className={fieldWrap}>
      <label className={labelCls}>{label}</label>

      <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
        <span className={iconBoxCls}>
          <Icon size={16} />
        </span>

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          disabled={!editing}
          placeholder={placeholder}
          autoComplete="off"
          className={`min-w-0 w-full bg-transparent text-sm sm:text-[15px] font-medium leading-6 text-[#0f172a] outline-none placeholder:text-slate-400/60 ${
            !editing ? "cursor-default" : ""
          }`}
        />
      </div>
    </div>
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

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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
      className={`relative w-full ${show ? "z-[100]" : "z-10"}`}
    >
      <div className={fieldWrap}>
        <label className={labelCls}>{label}</label>

        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <span className={iconBoxCls}>
            <Icon size={16} />
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
            className={`min-w-0 flex-1 bg-transparent text-sm sm:text-[15px] font-medium leading-6 text-[#0f172a] outline-none placeholder:text-slate-400/60 ${
              !editing ? "cursor-default" : ""
            }`}
          />

          {editing && (
            <Search
              size={17}
              strokeWidth={1.8}
              className="shrink-0 text-slate-400"
            />
          )}
        </div>

        <AnimatePresence>
          {editing && show && (
            <motion.div {...dropdownMotion} className={dropdownCls}>
              <div className="profile-dropdown-scroll max-h-56 sm:max-h-60 overflow-y-auto p-2">
                {options.length > 0 ? (
                  options.map((option) => {
                    const selected = option === value;

                    return (
                      <button
                        key={option}
                        type="button"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => onSelect(option)}
                        className={`profile-dropdown-option flex w-full items-center gap-3 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-left text-sm font-medium text-[#0f172a] transition-all duration-200 ${
                          selected
                            ? "bg-indigo-50 text-indigo-600"
                            : "hover:bg-indigo-50 hover:text-indigo-600"
                        }`}
                      >
                        <span className={iconBoxCls}>
                          <MapPin size={15} />
                        </span>

                        <span className="truncate">{option}</span>

                        {selected && (
                          <Check
                            size={16}
                            className="ml-auto shrink-0 text-indigo-500"
                          />
                        )}
                      </button>
                    );
                  })
                ) : search.trim() ? (
                  <button
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => onSelect(search)}
                    className="profile-dropdown-option flex w-full items-center gap-3 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-left text-sm font-medium text-[#0f172a] transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    <span className={iconBoxCls}>
                      <MapPin size={15} />
                    </span>

                    <span className="truncate">Use "{search}"</span>
                  </button>
                ) : (
                  <div className="px-4 py-5 text-center text-sm text-slate-400">
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

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [countrySearch, setCountrySearch] = useState("");
  const [stateSearch, setStateSearch] = useState("");

  const [showCountries, setShowCountries] = useState(false);
  const [showStates, setShowStates] = useState(false);

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
      phone: data?.phone || "",
      address,
    });

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
      toast.error(error.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
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
        state: country === prev.address.country ? prev.address.state : "",
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
    setImageFile(null);
    setShowCountries(false);
    setShowStates(false);

    setForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
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

      const response = await updateUserProfile(formData);

      setProfileData(response.data.data);

      setImageFile(null);
      setEditing(false);
      setShowCountries(false);
      setShowStates(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      showSuccess(response.data.message || "Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
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

  const availableStates = statesByCountry[form.address.country] || [];

  const filteredCountries = countries.filter((country) =>
    country.toLowerCase().includes(countrySearch.toLowerCase()),
  );

  const filteredStates = availableStates.filter((state) =>
    state.toLowerCase().includes(stateSearch.toLowerCase()),
  );

  const navItems = [
    {
      key: "profile",
      label: "Profile",
      icon: User,
    },
    {
      key: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
  ];

  if (loading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#f4f6fa] px-4">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-500" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading profile...
          </p>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#f4f6fa] px-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 text-center shadow-[0_8px_30px_rgba(15,23,42,.05)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
            <User size={26} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-[#0f172a]">
            Unable to load profile
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Something went wrong while loading your account information.
          </p>

          <button
            type="button"
            onClick={fetchProfile}
            className="mt-6 w-full sm:w-auto rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen overflow-x-hidden bg-[#f4f6fa] px-3 py-4 text-[#0f172a] sm:px-6 sm:py-8 lg:px-10 lg:py-10">
      <div className="mx-auto flex w-full max-w-[1700px] flex-col gap-4 sm:gap-6 lg:flex-row lg:items-start lg:gap-8">
        <motion.aside
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full shrink-0 lg:sticky lg:top-6 lg:w-72 xl:w-80"
        >
          <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-3 sm:p-4 lg:min-h-[430px] shadow-[0_8px_30px_rgba(15,23,42,.05)]">
            <div className="mb-4 sm:mb-5 flex items-center gap-3 px-2 sm:px-3 py-3">
              <div className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 overflow-hidden rounded-2xl bg-indigo-50">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt={user.name || "Profile"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-indigo-500">
                    <User size={24} />
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm sm:text-base font-bold text-[#0f172a]">
                  {user.name}
                </p>

                <p className="truncate text-xs sm:text-sm text-slate-500">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="mb-4 border-t border-slate-100" />

            <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:space-y-2 lg:pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {navItems.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setActivePage(key);
                    setEditing(false);
                  }}
                  className={`flex min-h-[50px] shrink-0 items-center gap-3 rounded-2xl px-4 sm:px-5 py-3 text-sm sm:text-base font-semibold whitespace-nowrap transition-all duration-200 lg:w-full ${
                    activePage === key
                      ? "bg-indigo-50 text-indigo-600 shadow-sm"
                      : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                      activePage === key
                        ? "bg-white text-indigo-600"
                        : "bg-slate-50 text-slate-500"
                    }`}
                  >
                    <Icon size={19} />
                  </span>

                  <span>{label}</span>
                </button>
              ))}
            </div>

            <div className="mt-6 hidden lg:block">
              <div className="rounded-2xl bg-[#f8f9fc] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                  Account
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Manage your personal information and dashboard from here.
                </p>
              </div>
            </div>
          </div>
        </motion.aside>

        <main className="min-w-0 flex-1 pb-6">
          <AnimatePresence mode="wait">
            {activePage === "dashboard" ? (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Dashboard />
              </motion.div>
            ) : (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-5 sm:mb-8 flex flex-col justify-between gap-4 sm:gap-5 sm:flex-row sm:items-end">
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-indigo-500">
                      Account
                    </p>

                    <h1 className="mt-2 sm:mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#0f172a]">
                      Personal Information
                    </h1>

                    <p className="mt-2 sm:mt-3 text-sm leading-6 text-slate-500">
                      Manage your profile and personal information.
                    </p>
                  </div>

                  {!editing ? (
                    <motion.button
                      type="button"
                      onClick={handleEdit}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-indigo-700"
                    >
                      <Edit3 size={18} />
                      Edit Profile
                    </motion.button>
                  ) : (
                    <div className="flex w-full sm:w-auto gap-3">
                      <motion.button
                        type="button"
                        onClick={handleCancel}
                        disabled={saving}
                        whileTap={{ scale: 0.98 }}
                        className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-50"
                      >
                        <X size={18} />
                        Cancel
                      </motion.button>

                      <motion.button
                        type="submit"
                        form="profile-form"
                        disabled={saving}
                        whileTap={{ scale: 0.98 }}
                        className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-md transition hover:bg-indigo-700 disabled:opacity-60"
                      >
                        {saving ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save size={18} />
                            Save Changes
                          </>
                        )}
                      </motion.button>
                    </div>
                  )}
                </div>

                <form
                  id="profile-form"
                  onSubmit={handleSave}
                  className="space-y-4 sm:space-y-6"
                >
                  <SectionCard>
                    <div className="flex flex-col items-center gap-5 sm:gap-7 sm:flex-row">
                      <div className="relative h-24 w-24 sm:h-32 sm:w-32 shrink-0">
                        <div className="h-24 w-24 sm:h-32 sm:w-32 overflow-hidden rounded-full border-4 border-white bg-indigo-50 shadow-md ring-1 ring-slate-200">
                          {imagePreview ? (
                            <img
                              src={imagePreview}
                              alt={user.name || "Profile"}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-indigo-500">
                              <User size={48} />
                            </div>
                          )}
                        </div>

                        {editing && (
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg transition hover:bg-indigo-700"
                          >
                            <Camera size={17} />
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

                      <div className="min-w-0 text-center sm:text-left">
                        <h2 className="truncate text-xl sm:text-2xl font-bold text-[#0f172a]">
                          {user.name}
                        </h2>

                        <p className="mt-1 break-all text-sm text-slate-500">
                          {user.email}
                        </p>

                        <div className="mt-3 sm:mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                          {user.isVerified && (
                            <span className="flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600">
                              <CheckCircle2 size={14} />
                              Verified Account
                            </span>
                          )}

                          <span className="rounded-full bg-purple-50 px-3 py-1.5 text-xs font-bold capitalize text-purple-600">
                            {user.role || "user"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </SectionCard>

                  <SectionCard
                    icon={User}
                    title="Personal Details"
                    subtitle="Your basic account information"
                    delay={0.05}
                  >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                      <InputField
                        icon={User}
                        label="Full Name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        editing={editing}
                        placeholder="Enter your name"
                      />

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

                      <InputField
                        icon={Phone}
                        label="Phone Number"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        editing={editing}
                        placeholder="Enter phone number"
                      />
                    </div>
                  </SectionCard>

                  <SectionCard
                    icon={MapPin}
                    title="Address Information"
                    subtitle="Manage your complete address"
                    delay={0.1}
                  >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                      <InputField
                        icon={User}
                        label="Full Name"
                        name="fullName"
                        value={form.address.fullName}
                        onChange={handleAddressChange}
                        editing={editing}
                        placeholder="Enter full name"
                      />

                      <InputField
                        icon={Home}
                        label="House / Flat No."
                        name="houseNo"
                        value={form.address.houseNo}
                        onChange={handleAddressChange}
                        editing={editing}
                        placeholder="Enter house or flat number"
                      />

                      <InputField
                        icon={MapPin}
                        label="Area"
                        name="area"
                        value={form.address.area}
                        onChange={handleAddressChange}
                        editing={editing}
                        placeholder="Enter area"
                      />

                      <InputField
                        icon={Building2}
                        label="City"
                        name="city"
                        value={form.address.city}
                        onChange={handleAddressChange}
                        editing={editing}
                        placeholder="Enter city"
                      />

                      <LocationSearch
                        label="Country"
                        icon={Globe}
                        editing={editing}
                        value={form.address.country}
                        search={countrySearch}
                        options={filteredCountries}
                        show={showCountries}
                        setShow={setShowCountries}
                        setOtherShow={setShowStates}
                        onInput={handleCountryInput}
                        onSelect={selectCountry}
                        placeholder="Search country"
                      />

                      <LocationSearch
                        label="State"
                        icon={MapPin}
                        editing={editing}
                        value={form.address.state}
                        search={stateSearch}
                        options={filteredStates}
                        show={showStates}
                        setShow={setShowStates}
                        setOtherShow={setShowCountries}
                        onInput={handleStateInput}
                        onSelect={selectState}
                        placeholder="Search state"
                      />

                      <InputField
                        icon={MapPin}
                        label="Pincode"
                        name="pincode"
                        value={form.address.pincode}
                        onChange={handleAddressChange}
                        editing={editing}
                        placeholder="Enter pincode"
                      />
                    </div>
                  </SectionCard>

                  <SectionCard
                    icon={KeyRound}
                    title="Account Actions"
                    subtitle="Manage your account access"
                    delay={0.15}
                  >
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={handleChangePassword}
                        className="flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        <KeyRound size={18} />
                        Change Password
                      </button>

                      <button
                        type="button"
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-3 font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {loggingOut ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Logging out...
                          </>
                        ) : (
                          <>
                            <LogOut size={18} />
                            Logout
                          </>
                        )}
                      </button>
                    </div>
                  </SectionCard>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </section>
  );
};

export default Profile;
