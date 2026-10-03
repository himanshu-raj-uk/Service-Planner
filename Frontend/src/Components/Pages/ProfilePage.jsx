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
  KeyRound,
  LogOut,
  Search,
  Check,
  LayoutDashboard,
  Plane,
  Cake,
  CalendarDays,
  Clock3,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import {
  getUserProfile,
  updateUserProfile,
  logoutUser,
  getUserDashboard,
} from "../../Services/AuthAPI";

import {
  INDIA_REGIONS,
  isValidIndianPincode,
} from "../../Data/TouristPlaces";

import showSuccess from "../../Utils/toast";
import Dashboard from "./Dashboard";
import Navbar from "../Layout/Navbar";

const styles = `
  .pf-root {
    --page-bg: #f4f6fa;

    --text: #0f172a;
    --text-soft: #475569;
    --muted: #64748b;

    --teal: #4f46e5;
    --ink: #ffffff;

    --accent-soft: rgba(79, 70, 229, 0.09);
    --accent-ring: rgba(79, 70, 229, 0.18);

    --surface-solid: #ffffff;
    --input: #ffffff;

    --border: rgba(15, 23, 42, 0.09);
    --border-hover: rgba(15, 23, 42, 0.18);

    --pf-pattern: rgba(15, 23, 42, 0.045);

    --ok: #059669;
    --bad: #dc2626;
    --pink: #ec4899;

    background: var(--page-bg);
    color: var(--text);
    transition: background-color 500ms ease, color 500ms ease;
  }

  .dark .pf-root {
    --page-bg: #0f172a;

    --text: #f8fafc;
    --text-soft: #cbd5e1;
    --muted: #94a3b8;

    --teal: #34d399;
    --ink: #04211c;

    --accent-soft: rgba(52, 211, 153, 0.12);
    --accent-ring: rgba(52, 211, 153, 0.2);

    --surface-solid: #111b30;
    --input: rgba(15, 23, 42, 0.7);

    --border: rgba(148, 163, 184, 0.16);
    --border-hover: rgba(148, 163, 184, 0.32);

    --pf-pattern: rgba(148, 163, 184, 0.07);

    --ok: #34d399;
    --bad: #f87171;
    --pink: #f472b6;
  }

  .pf-page {
    position: relative;
    isolation: isolate;
    overflow-x: clip;
  }

  .pf-label {
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    line-height: 1;
    color: var(--muted);
  }

  .pf-card {
    border: 1px solid var(--border);
    border-radius: 1.25rem;
    background: transparent;
  }

  .pf-tile {
    border: 1px solid var(--border);
    background: transparent;
  }

  .pf-icon {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    border-radius: 0.75rem;
    background: var(--accent-soft);
    color: var(--teal);
  }

  .pf-tone-ok {
    color: var(--ok);
    background: color-mix(in srgb, var(--ok) 12%, transparent);
  }

  .pf-tone-bad {
    color: var(--bad);
    background: color-mix(in srgb, var(--bad) 12%, transparent);
  }

  .pf-tone-pink {
    color: var(--pink);
    background: color-mix(in srgb, var(--pink) 12%, transparent);
  }

  .pf-pill-ok {
    color: var(--ok);
    background: color-mix(in srgb, var(--ok) 12%, transparent);
  }

  .pf-pill-bad {
    color: var(--bad);
    background: color-mix(in srgb, var(--bad) 12%, transparent);
  }

  .pf-pill-muted {
    color: var(--text-soft);
    background: var(--accent-soft);
  }

  .pf-field {
    position: relative;
    min-width: 0;
    border: 1px solid var(--border);
    background: var(--input);
    transition:
      border-color 160ms ease,
      background-color 160ms ease,
      box-shadow 160ms ease;
  }

  .pf-field[data-editing="true"]:hover {
    border-color: var(--border-hover);
  }

  .pf-field[data-editing="true"]:focus-within {
    border-color: var(--teal);
    box-shadow: 0 0 0 3px var(--accent-ring);
  }

  .pf-field[data-editing="true"]:focus-within .pf-label {
    color: var(--teal);
  }

  .pf-field[data-editing="false"] {
    background: transparent;
  }

  .pf-field[data-error="true"] {
    border-color: var(--bad);
  }

  .pf-field[data-error="true"]:focus-within {
    border-color: var(--bad);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--bad) 14%, transparent);
  }

  .pf-input {
    color: var(--text);
    font-size: 0.9rem;
    font-weight: 500;
    line-height: 1.4;
  }

  .pf-field input {
    padding: 0;
    border: 0 !important;
    outline: 0 !important;
    box-shadow: none !important;
    background: transparent !important;
    -webkit-appearance: none;
    appearance: none;
  }

  .pf-input::placeholder {
    color: var(--muted);
    opacity: 0.6;
  }

  .pf-input:disabled {
    opacity: 1;
    -webkit-text-fill-color: var(--text);
    cursor: default;
  }

  .pf-error {
    margin-top: 5px;
    padding-left: 4px;
    color: var(--bad);
    font-size: 0.72rem;
    font-weight: 600;
    line-height: 1.3;
  }

  .pf-btn {
    border: 1px solid var(--border-hover);
    background: var(--surface-solid);
    color: var(--text);
    transition: border-color 160ms ease, color 160ms ease;
  }

  .pf-btn:hover:not(:disabled) {
    border-color: var(--teal);
    color: var(--teal);
  }

  .pf-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .pf-cta {
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
    color: #ffffff;
    border: 1px solid transparent;
    box-shadow: 0 14px 34px rgba(79, 70, 229, 0.28);
    transition: transform 160ms ease, filter 160ms ease;
  }

  .dark .pf-cta {
    background: linear-gradient(135deg, #10b981, #0d9488);
    box-shadow: 0 14px 34px rgba(16, 185, 129, 0.22);
  }

  .pf-cta:hover:not(:disabled) {
    filter: brightness(1.06);
    transform: translateY(-1px);
  }

  .pf-cta:active:not(:disabled) {
    transform: translateY(0);
  }

  .pf-cta:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .pf-nav {
    color: var(--text-soft);
    border: 1px solid transparent;
    transition:
      color 160ms ease,
      background-color 200ms ease,
      border-color 200ms ease;
  }

  .pf-nav:hover {
    color: var(--teal);
  }

  .pf-nav[data-active="true"] {
    background: var(--accent-soft);
    border-color: var(--teal);
    color: var(--teal);
  }

  .pf-danger {
    color: var(--bad);
    transition: filter 160ms ease;
  }

  .pf-danger:hover:not(:disabled) {
    filter: brightness(1.1);
  }

  .pf-danger:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .pf-dropdown {
    border: 1px solid var(--border-hover);
    background: var(--surface-solid);
    box-shadow: 0 22px 55px rgba(15, 23, 42, 0.16);
  }

  .dark .pf-dropdown {
    box-shadow: 0 22px 55px rgba(0, 0, 0, 0.5);
  }

  .pf-option {
    color: var(--text);
    transition: background-color 140ms ease;
  }

  .pf-option:hover,
  .pf-option.selected {
    background: var(--accent-soft);
  }

  html,
  body {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  html::-webkit-scrollbar,
  body::-webkit-scrollbar {
    width: 0;
    height: 0;
    display: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .pf-root,
    .pf-field,
    .pf-cta,
    .pf-nav {
      transition: none;
    }
  }
`;

const fieldWrap =
  "pf-field group relative min-h-[68px] w-full rounded-2xl px-3.5 pb-2.5 pt-6 sm:min-h-[78px] sm:px-5 sm:pb-3 sm:pt-7";

const labelCls =
  "pf-label pointer-events-none absolute left-3.5 top-2.5 z-10 transition-colors sm:left-5";

const iconBoxCls = "pf-icon h-8 w-8 !rounded-lg sm:h-9 sm:w-9";

const dropdownCls =
  "pf-dropdown absolute left-0 right-0 top-[calc(100%+6px)] z-[9999] overflow-hidden rounded-2xl";

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

const PageShell = ({ children }) => (
  <div className="pf-root w-full overflow-x-clip">
    <style>{styles}</style>

    <Navbar />

    <main className="pf-page min-h-[calc(100vh-110px)] px-3 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage: `
            linear-gradient(
              90deg,
              var(--page-pattern-color, var(--pf-pattern)) 1px,
              transparent 1px
            ),
            linear-gradient(
              0deg,
              var(--page-pattern-color, var(--pf-pattern)) 1px,
              transparent 1px
            )
          `,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 mx-auto w-full min-w-0 max-w-[1700px]">
        {children}
      </div>
    </main>
  </div>
);

const SectionCard = ({
  icon: Icon,
  title,
  subtitle,
  children,
  delay = 0,
  action,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.25 }}
    className="pf-card p-4 sm:p-6 lg:p-7"
  >
    {(Icon || title || action) && (
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 sm:mb-6">
        <div className="flex min-w-0 items-center gap-3">
          {Icon && (
            <span className="pf-icon h-10 w-10">
              <Icon size={19} />
            </span>
          )}

          <div className="min-w-0">
            <h2 className="text-base font-bold leading-6 text-[var(--text)] sm:text-lg">
              {title}
            </h2>

            {subtitle && (
              <p className="mt-0.5 text-[13px] leading-5 text-[var(--muted)] sm:text-sm">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {action}
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
  error = "",
  disabled = false,
  inputMode,
  maxLength,
}) => (
  <div className="relative z-0 w-full">
    <div
      className={fieldWrap}
      data-editing={editing}
      data-error={Boolean(error)}
    >
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
          disabled={disabled || !editing}
          placeholder={placeholder}
          autoComplete="off"
          inputMode={inputMode}
          maxLength={maxLength}
          className="pf-input min-w-0 w-full bg-transparent outline-none"
        />
      </div>
    </div>

    {error && <p className="pf-error">{error}</p>}
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
  error = "",
  disabled = false,
  emptyMessage = "No matching options found.",
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
    if (!editing || disabled) return;

    setShow(true);
    setOtherShow?.(false);
  };

  const handleBlur = () => {
    if (!editing || disabled) return;

    const query = String(search || "").trim();

    if (!query || options.length !== 1) return;

    const onlyOption = options[0];

    if (
      String(onlyOption).toLowerCase() !==
      String(value || "").trim().toLowerCase()
    ) {
      onSelect(onlyOption);
    }
  };

  return (
    <div
      ref={wrapperRef}
      className={`relative w-full ${show ? "z-[100]" : "z-10"}`}
    >
      <div
        className={fieldWrap}
        data-editing={editing}
        data-error={Boolean(error)}
      >
        <label className={labelCls}>{label}</label>

        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <span className={iconBoxCls}>
            <Icon size={16} />
          </span>

          <input
            type="text"
            value={editing ? search : value}
            disabled={!editing || disabled}
            placeholder={placeholder}
            autoComplete="off"
            spellCheck="false"
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={onInput}
            className="pf-input min-w-0 flex-1 bg-transparent outline-none"
          />

          {editing && !disabled && (
            <Search
              size={16}
              strokeWidth={1.8}
              className="shrink-0 text-[var(--muted)]"
            />
          )}
        </div>

        <AnimatePresence>
          {editing && !disabled && show && (
            <motion.div {...dropdownMotion} className={dropdownCls}>
              <div className="max-h-56 overflow-y-auto p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:max-h-60 sm:p-2">
                {options.length > 0 ? (
                  options.map((option) => {
                    const selected = option === value;

                    return (
                      <button
                        key={option}
                        type="button"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => onSelect(option)}
                        className={`pf-option ${selected ? "selected" : ""
                          } flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium sm:px-4 sm:py-3`}
                      >
                        <span className={iconBoxCls}>
                          <MapPin size={14} />
                        </span>

                        <span className="truncate">{option}</span>

                        {selected && (
                          <Check
                            size={15}
                            className="ml-auto shrink-0 text-[var(--teal)]"
                          />
                        )}
                      </button>
                    );
                  })
                ) : (
                  <div className="px-4 py-5 text-center text-sm text-[var(--muted)]">
                    {emptyMessage}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && <p className="pf-error">{error}</p>}
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, tone = "indigo" }) => {
  const tones = {
    indigo: "",
    emerald: "pf-tone-ok",
    rose: "pf-tone-bad",
  };

  return (
    <div className="pf-tile rounded-2xl p-3.5 sm:p-4">
      <div className="flex items-center gap-3">
        <span className={`pf-icon h-10 w-10 ${tones[tone]}`}>
          <Icon size={18} />
        </span>

        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-[var(--muted)]">
            {label}
          </p>

          <p className="mt-0.5 text-lg font-bold text-[var(--text)] sm:text-xl">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

const getEventTitle = (event, type) => {
  if (type === "birthday") {
    return (
      event?.name ||
      event?.fullName ||
      event?.birthdayName ||
      event?.title ||
      "Birthday Event"
    );
  }

  return (
    event?.destination ||
    event?.place ||
    event?.location ||
    event?.title ||
    event?.tripName ||
    "Travel Plan"
  );
};

const getEventDate = (event) =>
  event?.date ||
  event?.travelDate ||
  event?.birthdayDate ||
  event?.startDate ||
  event?.eventDate ||
  event?.createdAt ||
  "";

const getEventStatus = (event) =>
  event?.status || event?.bookingStatus || event?.planStatus || "Planned";

const EventRow = ({ event, type }) => {
  const isBirthday = type === "birthday";
  const Icon = isBirthday ? Cake : Plane;

  const title = getEventTitle(event, type);
  const date = getEventDate(event);
  const status = getEventStatus(event);

  const formattedDate = date
    ? (() => {
      const parsed = new Date(date);

      if (Number.isNaN(parsed.getTime())) {
        return String(date);
      }

      return parsed.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    })()
    : "";

  const statusText = String(status);

  const statusClass =
    statusText.toLowerCase() === "confirmed"
      ? "pf-pill-ok"
      : statusText.toLowerCase() === "cancelled" ||
        statusText.toLowerCase() === "canceled"
        ? "pf-pill-bad"
        : "pf-pill-muted";

  return (
    <div className="pf-tile flex items-center gap-3 rounded-2xl px-3.5 py-3 sm:px-4">
      <span
        className={`pf-icon h-10 w-10 ${isBirthday ? "pf-tone-pink" : ""}`}
      >
        <Icon size={18} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="break-words text-sm font-bold leading-5 text-[var(--text)] sm:text-[15px]">
          {title}
        </p>

        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
          {formattedDate && (
            <span className="flex items-center gap-1 text-xs leading-5 text-[var(--muted)] sm:text-[13px]">
              <CalendarDays size={13} />
              {formattedDate}
            </span>
          )}

          {event?.time && (
            <span className="flex items-center gap-1 text-xs leading-5 text-[var(--muted)] sm:text-[13px]">
              <Clock3 size={13} />
              {event.time}
            </span>
          )}
        </div>
      </div>

      <span
        className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize sm:text-xs ${statusClass}`}
      >
        {statusText}
      </span>
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

  const [stateSearch, setStateSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");

  const [showStates, setShowStates] = useState(false);
  const [showCities, setShowCities] = useState(false);

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    address: {
      state: "",
      area: "",
      city: "",
      houseNo: "",
      pincode: "",
    },
  });

  const [dashboardLoading, setDashboardLoading] = useState(true);

  const [dashboardData, setDashboardData] = useState({
    allTrips: [],
    confirmedTrips: [],
    cancelledTrips: [],
    allBirthdays: [],
    confirmedBirthdays: [],
    cancelledBirthdays: [],
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      houseNo: "",
      area: "",
      city: "",
      state: "",
      country: "India",
      pincode: "",
    },
  });

  const states = INDIA_REGIONS.map((region) => region.name);

  const getCitiesForState = (state) => {
    if (!state) return [];

    const region = INDIA_REGIONS.find(
      (item) =>
        String(item?.name || "").toLowerCase() ===
        String(state).toLowerCase(),
    );

    if (!region) return [];

    const cities = Array.isArray(region.cities)
      ? region.cities
      : Array.isArray(region.city)
        ? region.city
        : region.city
          ? [region.city]
          : [];

    return [
      ...new Set(
        cities
          .map((city) =>
            typeof city === "string"
              ? city
              : city?.name || city?.city || "",
          )
          .map((city) => String(city).trim())
          .filter(Boolean),
      ),
    ];
  };

  const getAddress = (data) => ({
    houseNo: data?.address?.houseNo || "",
    area: data?.address?.area || "",
    city: data?.address?.city || "",
    state: data?.address?.state || "",
    country: "India",
    pincode: String(data?.address?.pincode || "")
      .replace(/\D/g, "")
      .slice(0, 6),
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

    setStateSearch(address.state);
    setCitySearch(address.city);

    setShowStates(false);
    setShowCities(false);

    setErrors({
      name: "",
      email: "",
      address: {
        state: "",
        area: "",
        city: "",
        houseNo: "",
        pincode: "",
      },
    });

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

  const fetchDashboardData = async () => {
    try {
      setDashboardLoading(true);

      const response = await getUserDashboard();

      const data = response?.data?.data || response?.data || {};

      setDashboardData({
        allTrips: Array.isArray(data.allTrips) ? data.allTrips : [],
        confirmedTrips: Array.isArray(data.confirmedTrips)
          ? data.confirmedTrips
          : [],
        cancelledTrips: Array.isArray(data.cancelledTrips)
          ? data.cancelledTrips
          : [],
        allBirthdays: Array.isArray(data.allBirthdays)
          ? data.allBirthdays
          : [],
        confirmedBirthdays: Array.isArray(data.confirmedBirthdays)
          ? data.confirmedBirthdays
          : [],
        cancelledBirthdays: Array.isArray(data.cancelledBirthdays)
          ? data.cancelledBirthdays
          : [],
      });
    } catch (error) {
      console.error("PROFILE DASHBOARD ERROR:", error);

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

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleAddressChange = (event) => {
    const { name, value } = event.target;

    let nextValue = value;

    if (name === "pincode") {
      nextValue = value.replace(/\D/g, "").slice(0, 6);
    }

    setForm((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: nextValue,
      },
    }));

    setErrors((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: "",
        ...(name === "state" ? { pincode: "" } : {}),
      },
    }));
  };

  const handleStateInput = (event) => {
    const value = event.target.value;

    setStateSearch(value);

    setForm((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        state: value,
        city: "",
      },
    }));

    setCitySearch("");

    setErrors((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        state: "",
        city: "",
        pincode: "",
      },
    }));

    setShowStates(true);
    setShowCities(false);
  };

  const selectState = (state) => {
    setForm((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        state,
        city: "",
      },
    }));

    setStateSearch(state);
    setCitySearch("");

    setErrors((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        state: "",
        city: "",
        pincode: "",
      },
    }));

    setShowStates(false);
    setShowCities(false);
  };

  const handleCityInput = (event) => {
    const value = event.target.value;

    setCitySearch(value);

    setForm((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        city: value,
      },
    }));

    setErrors((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        city: "",
      },
    }));

    setShowCities(true);
    setShowStates(false);
  };

  const selectCity = (city) => {
    setForm((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        city,
      },
    }));

    setCitySearch(city);

    setErrors((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        city: "",
      },
    }));

    setShowCities(false);
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

    setStateSearch(form.address.state);
    setCitySearch(form.address.city);

    setErrors({
      name: "",
      email: "",
      address: {
        state: "",
        area: "",
        city: "",
        houseNo: "",
        pincode: "",
      },
    });
  };

  const handleCancel = () => {
    if (!user) return;

    const address = getAddress(user);

    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setEditing(false);
    setImageFile(null);
    setShowStates(false);
    setShowCities(false);

    setForm({
      name: user.name || "",
      email: user.email || "",
      phone: String(user.phone || "")
        .replace(/\D/g, "")
        .slice(0, 10),
      address,
    });

    setStateSearch(address.state);
    setCitySearch(address.city);

    setErrors({
      name: "",
      email: "",
      address: {
        state: "",
        area: "",
        city: "",
        houseNo: "",
        pincode: "",
      },
    });

    setImagePreview(user.profileImage?.url || "");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateForm = () => {
    const nextErrors = {
      name: "",
      email: "",
      address: {
        state: "",
        area: "",
        city: "",
        houseNo: "",
        pincode: "",
      },
    };

    const name = form.name.trim();
    const email = form.email.trim();

    const state = form.address.state.trim();
    const area = form.address.area.trim();
    const city = form.address.city.trim();
    const houseNo = form.address.houseNo.trim();
    const pincode = form.address.pincode.trim();

    const citiesForState = getCitiesForState(state);

    if (!name) {
      nextErrors.name = "Name is required";
    }

    if (!email) {
      nextErrors.email = "Email is required";
    }

    if (!state) {
      nextErrors.address.state = "State is required";
    } else if (!states.includes(state)) {
      nextErrors.address.state = "Please select a valid Indian state";
    }

    if (!area) {
      nextErrors.address.area = "Area is required";
    }

    if (!city) {
      nextErrors.address.city = "City is required";
    } else if (
      states.includes(state) &&
      citiesForState.length > 0 &&
      !citiesForState.includes(city)
    ) {
      nextErrors.address.city = `Please select a valid city in ${state}`;
    }

    if (!houseNo) {
      nextErrors.address.houseNo = "House / Flat No. is required";
    }

    if (!pincode) {
      nextErrors.address.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(pincode)) {
      nextErrors.address.pincode = "Pincode must be exactly 6 digits";
    } else if (state && states.includes(state)) {
      if (!isValidIndianPincode(pincode, state)) {
        nextErrors.address.pincode = `Pincode does not match ${state}`;
      }
    }

    setErrors(nextErrors);

    return (
      !nextErrors.name &&
      !nextErrors.email &&
      !nextErrors.address.state &&
      !nextErrors.address.area &&
      !nextErrors.address.city &&
      !nextErrors.address.houseNo &&
      !nextErrors.address.pincode
    );
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
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
          houseNo: form.address.houseNo.trim(),
          area: form.address.area.trim(),
          city: form.address.city.trim(),
          state: form.address.state.trim(),
          country: "India",
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
      setShowStates(false);
      setShowCities(false);

      setErrors({
        name: "",
        email: "",
        address: {
          state: "",
          area: "",
          city: "",
          houseNo: "",
          pincode: "",
        },
      });

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

  const filteredStates = states.filter((state) =>
    state.toLowerCase().includes(stateSearch.toLowerCase()),
  );

  const availableCities = getCitiesForState(form.address.state);

  const filteredCities = availableCities.filter((city) =>
    city.toLowerCase().includes(citySearch.toLowerCase()),
  );

  const totalPlans =
    dashboardData.allTrips.length + dashboardData.allBirthdays.length;

  const confirmedPlans =
    dashboardData.confirmedTrips.length +
    dashboardData.confirmedBirthdays.length;

  const cancelledPlans =
    dashboardData.cancelledTrips.length +
    dashboardData.cancelledBirthdays.length;

  const allEvents = [
    ...dashboardData.allTrips.map((event) => ({
      ...event,
      __eventType: "trip",
    })),

    ...dashboardData.allBirthdays.map((event) => ({
      ...event,
      __eventType: "birthday",
    })),
  ].sort((a, b) => {
    const dateA = new Date(getEventDate(a) || a.createdAt || 0).getTime();

    const dateB = new Date(getEventDate(b) || b.createdAt || 0).getTime();

    return dateA - dateB;
  });

  const navButtonClass =
    "pf-nav flex min-h-[50px] w-full shrink-0 items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-semibold";

  if (loading) {
    return (
      <PageShell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[var(--border-hover)] border-t-[var(--teal)]" />

            <p className="mt-4 text-sm text-[var(--muted)]">
              Loading profile...
            </p>
          </div>
        </div>
      </PageShell>
    );
  }

  if (!user) {
    return (
      <PageShell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="pf-card w-full max-w-md p-6 text-center sm:p-8">
            <span className="pf-icon mx-auto h-14 w-14 !rounded-2xl">
              <User size={26} />
            </span>

            <h2 className="mt-5 text-xl font-bold text-[var(--text)]">
              Unable to load profile
            </h2>

            <p className="mt-2 text-[13px] leading-6 text-[var(--muted)] sm:text-sm">
              Something went wrong while loading your account information.
            </p>

            <button
              type="button"
              onClick={fetchProfile}
              className="pf-cta mt-6 w-full rounded-xl px-6 py-3 text-sm font-semibold sm:w-auto"
            >
              Try Again
            </button>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-7">
        <motion.aside
          initial={{
            opacity: 0,
            x: -15,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          className="w-full shrink-0 lg:fixed lg:left-7 lg:top-1/2 lg:z-40 lg:w-[285px] lg:-translate-y-1/2 xl:left-10 xl:w-[300px]"
        >
          <div className="pf-card w-full p-3.5 sm:p-4">
            <div className="flex flex-col items-center px-2 pt-2 text-center">
              <div className="relative h-20 w-20 shrink-0 sm:h-24 sm:w-24">
                <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-[var(--page-bg)] bg-[var(--accent-soft)] shadow-md ring-1 ring-[var(--border-hover)] sm:h-24 sm:w-24">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt={user.name || "Profile"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[var(--teal)]">
                      <User size={34} />
                    </div>
                  )}
                </div>

                {editing && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Change profile photo"
                    className="pf-cta absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center !rounded-full"
                  >
                    <Camera size={15} />
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

              <h2 className="mt-3 w-full truncate text-lg font-bold text-[var(--text)]">
                {user.name}
              </h2>

              <p className="mt-0.5 w-full break-all text-[13px] font-medium text-[var(--muted)]">
                {user.email}
              </p>

              {user.isVerified && (
                <span className="pf-pill-ok mt-3 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold">
                  <CheckCircle2 size={13} />
                  Verified Account
                </span>
              )}
            </div>

            <div className="my-3 border-t border-[var(--border)] sm:my-4" />

            <div className="flex w-full flex-col gap-1.5">
              <button
                type="button"
                data-active={activePage === "profile"}
                onClick={() => {
                  setActivePage("profile");
                  setEditing(false);
                }}
                className={navButtonClass}
              >
                <span className="pf-icon h-9 w-9">
                  <User size={18} />
                </span>

                <span>Profile</span>
              </button>

              <button
                type="button"
                data-active={activePage === "dashboard"}
                onClick={() => {
                  setActivePage("dashboard");
                  setEditing(false);
                }}
                className={navButtonClass}
              >
                <span className="pf-icon h-9 w-9">
                  <LayoutDashboard size={18} />
                </span>

                <span>Dashboard</span>
              </button>

              <button
                type="button"
                onClick={handleChangePassword}
                className={navButtonClass}
              >
                <span className="pf-icon h-9 w-9">
                  <KeyRound size={18} />
                </span>

                <span>Change Password</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="pf-danger flex min-h-[50px] w-full shrink-0 items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-semibold"
              >
                <span className="pf-icon pf-tone-bad h-9 w-9">
                  {loggingOut ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <LogOut size={18} />
                  )}
                </span>

                <span>{loggingOut ? "Logging out..." : "Logout"}</span>
              </button>
            </div>
          </div>
        </motion.aside>

        <div className="min-w-0 w-full lg:ml-[315px] lg:w-[calc(100%-315px)] xl:ml-[330px] xl:w-[calc(100%-330px)]">
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
                <Dashboard embedded />
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
                  className="space-y-4 sm:space-y-5"
                >
                  <SectionCard
                    icon={User}
                    title="Personal Details"
                    subtitle="Your basic account information"
                    delay={0.05}
                    action={
                      <div className="flex shrink-0 items-center gap-2">
                        {!editing ? (
                          <motion.button
                            type="button"
                            onClick={handleEdit}
                            whileTap={{
                              scale: 0.98,
                            }}
                            className="pf-cta flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold sm:text-sm"
                          >
                            <Edit3 size={16} />
                            <span>Edit Profile</span>
                          </motion.button>
                        ) : (
                          <>
                            <motion.button
                              type="button"
                              onClick={handleCancel}
                              disabled={saving}
                              whileTap={{
                                scale: 0.98,
                              }}
                              className="pf-btn flex items-center justify-center gap-2 rounded-xl px-3.5 py-2.5 text-[13px] font-semibold sm:text-sm"
                            >
                              <X size={16} />
                              Cancel
                            </motion.button>

                            <motion.button
                              type="submit"
                              disabled={saving}
                              whileTap={{
                                scale: 0.98,
                              }}
                              className="pf-cta flex items-center justify-center gap-2 rounded-xl px-3.5 py-2.5 text-[13px] font-semibold sm:text-sm"
                            >
                              {saving ? (
                                <>
                                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <Save size={16} />
                                  Save
                                </>
                              )}
                            </motion.button>
                          </>
                        )}
                      </div>
                    }
                  >
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                      <InputField
                        icon={User}
                        label="Full Name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        editing={editing}
                        placeholder="Enter your name"
                        error={errors.name}
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
                        error={errors.email}
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
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                      <InputField
                        icon={Globe}
                        label="Country"
                        name="country"
                        value="India"
                        onChange={() => { }}
                        editing={editing}
                        disabled
                        placeholder="India"
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
                        setOtherShow={setShowCities}
                        onInput={handleStateInput}
                        onSelect={selectState}
                        placeholder="Search state"
                        error={errors.address.state}
                        emptyMessage="No matching state or union territory found."
                      />

                      <LocationSearch
                        label="City"
                        icon={MapPin}
                        editing={editing}
                        value={form.address.city}
                        search={citySearch}
                        options={filteredCities}
                        show={showCities}
                        setShow={setShowCities}
                        setOtherShow={setShowStates}
                        onInput={handleCityInput}
                        onSelect={selectCity}
                        placeholder={
                          form.address.state
                            ? "Search city"
                            : "Select state first"
                        }
                        error={errors.address.city}
                        disabled={!form.address.state}
                        emptyMessage={
                          form.address.state
                            ? `No city found in ${form.address.state}`
                            : "Select a state first"
                        }
                      />

                      <InputField
                        icon={MapPin}
                        label="Area"
                        name="area"
                        value={form.address.area}
                        onChange={handleAddressChange}
                        editing={editing}
                        placeholder="Enter area"
                        error={errors.address.area}
                      />

                      <InputField
                        icon={Home}
                        label="House / Flat No."
                        name="houseNo"
                        value={form.address.houseNo}
                        onChange={handleAddressChange}
                        editing={editing}
                        placeholder="Enter house or flat number"
                        error={errors.address.houseNo}
                      />

                      <InputField
                        icon={MapPin}
                        label="Pincode"
                        name="pincode"
                        value={form.address.pincode}
                        onChange={handleAddressChange}
                        editing={editing}
                        placeholder="Enter pincode"
                        inputMode="numeric"
                        maxLength={6}
                        error={errors.address.pincode}
                      />
                    </div>
                  </SectionCard>

                  <SectionCard
                    icon={CalendarDays}
                    title="Plans & Recent Events"
                    subtitle="Your travel and birthday activity"
                    delay={0.15}
                  >
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <StatCard
                        icon={CalendarDays}
                        label="Total Plans"
                        value={totalPlans}
                        tone="indigo"
                      />

                      <StatCard
                        icon={CheckCircle2}
                        label="Confirmed"
                        value={confirmedPlans}
                        tone="emerald"
                      />

                      <StatCard
                        icon={X}
                        label="Cancelled"
                        value={cancelledPlans}
                        tone="rose"
                      />
                    </div>

                    <div className="mt-5">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                          <h3 className="text-base font-bold leading-6 text-[var(--text)]">
                            Recent Events
                          </h3>

                          <p className="mt-0.5 text-[13px] leading-5 text-[var(--muted)]">
                            Travel and birthday events
                          </p>
                        </div>

                        {allEvents.length > 4 && (
                          <span className="shrink-0 text-xs font-medium text-[var(--muted)]">
                            Scroll for more
                          </span>
                        )}
                      </div>

                      {dashboardLoading ? (
                        <div className="pf-tile rounded-2xl px-4 py-8 text-center">
                          <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-[var(--border-hover)] border-t-[var(--teal)]" />

                          <p className="mt-3 text-[13px] font-medium text-[var(--muted)]">
                            Loading events...
                          </p>
                        </div>
                      ) : allEvents.length === 0 ? (
                        <div className="pf-tile rounded-2xl border-dashed px-4 py-8 text-center">
                          <CalendarDays
                            size={25}
                            className="mx-auto text-[var(--muted)]"
                          />

                          <p className="mt-3 text-sm font-semibold text-[var(--text-soft)]">
                            No events yet
                          </p>

                          <p className="mt-1 text-[13px] text-[var(--muted)]">
                            Your travel and birthday plans will appear here.
                          </p>
                        </div>
                      ) : (
                        <div
                          className={`space-y-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${allEvents.length > 4
                              ? "max-h-[340px] overflow-y-auto"
                              : ""
                            }`}
                        >
                          {allEvents.map((event, index) => (
                            <EventRow
                              key={
                                event?._id ||
                                event?.id ||
                                `${event.__eventType}-${index}`
                              }
                              event={event}
                              type={event.__eventType}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </SectionCard>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageShell>
  );
};

export default Profile;