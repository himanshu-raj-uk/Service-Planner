import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  MapPin,
  Navigation,
  Wallet,
  Users,
  CalendarDays,
  Heart,
  Hotel,
  Bus,
  Utensils,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Minus,
  Plus,
  Search,
  Plane,
  Train,
  Car,
  Bike,
  Coffee,
  Map,
  ShoppingBag,
  Backpack,
  Lightbulb,
  ShieldCheck,
  Hospital,
  Phone,
  Star,
  ChevronDown,
  Check,
  AlertCircle,
  ExternalLink,
  Globe,
} from "lucide-react";
import toast from "react-hot-toast";

import Navbar from "../Layout/Navbar";
import {
  createTour,
  getTripById,
  confirmTrip,
  cancelTrip,
} from "../../Services/AuthAPI";

import { INDIA_REGIONS, loadIndiaAdministrativeData } from "../../Data/TouristPlaces";

const buildLocationSearchOptions = (regions) => [
  ...regions.flatMap((region) => [
    {
      name: region.capital,
      city: region.capital,
      state: region.name,
      type: "Capital",
    },

    ...region.touristPlaces.map((place) => ({
      name: place.name,
      city: region.capital,
      state: region.name,
      type: "Tourist Place",
      description: place.description || "",
      tags: Array.isArray(place.tags) ? place.tags : [],
    })),

    {
      name: region.name,
      city: region.capital,
      state: region.name,
      type: region.type === "state" ? "State" : "Union Territory",
    },

    ...region.districts.flatMap((district) => [
      {
        name: district.name,
        city: district.name,
        state: region.name,
        type: "District",
      },

      ...district.subDistricts.map((subDistrict) => ({
        name: subDistrict.name,
        city: district.name,
        state: region.name,
        type: "Sub-district",
      })),
    ]),
  ]),
].filter(
  (item, index, array) =>
    array.findIndex(
      (candidate) =>
        candidate.name.toLowerCase() === item.name.toLowerCase() &&
        candidate.state.toLowerCase() === item.state.toLowerCase() &&
        candidate.type === item.type,
    ) === index,
);

const travelTypeOptions = [
  "Solo",
  "Couple",
  "Family",
  "Friends",
  "Honeymoon",
  "Adventure",
  "Business",
];

const hotelTypeOptions = [
  "Budget",
  "Standard",
  "Comfort",
  "Luxury",
  "Homestay",
  "Resort",
];

const transportOptions = ["Car", "Bike", "Train", "Flight", "Bus"];

const foodOptions = ["Any", "Vegetarian", "Non-Vegetarian", "Vegan", "Jain"];

const loadingMessages = [
  "Creating your personalized travel plan...",
  "Finding the best places for your trip...",
  "Calculating your travel budget...",
  "Planning your day-by-day itinerary...",
  "Finding hotels and food options...",
  "Adding hidden gems to your journey...",
  "Almost there, your trip is taking shape...",
  "Your travel plan is being prepared...",
];

const loadingSteps = [
  { label: "Finding the best places", icon: Map },
  { label: "Calculating your budget", icon: Wallet },
  { label: "Building your day-by-day itinerary", icon: CalendarDays },
  { label: "Choosing hotels & food", icon: Hotel },
  { label: "Adding hidden gems & tips", icon: Lightbulb },
];

const styles = `
  .tour-root {
    --page-bg: #f4f6fa;

    --text: #0f172a;
    --text-soft: #475569;
    --muted: #64748b;

    --teal: #4f46e5;
    --accent-2: #7c3aed;
    --gold: #7c3aed;
    --gold-light: #6d28d9;
    --ink: #ffffff;

    --accent-soft: rgba(79, 70, 229, 0.09);
    --accent-ring: rgba(79, 70, 229, 0.18);

    --surface: rgba(255, 255, 255, 0.9);
    --surface-solid: #ffffff;
    --tile: rgba(241, 245, 249, 0.85);
    --input: #ffffff;

    --border: rgba(15, 23, 42, 0.09);
    --border-hover: rgba(15, 23, 42, 0.18);

    --shadow: 0 24px 70px rgba(15, 23, 42, 0.08);
    --tour-pattern: rgba(15, 23, 42, 0.045);

    background: var(--page-bg);
    color: var(--text);
    transition: background-color 500ms ease, color 500ms ease;
  }

  .dark .tour-root {
    --page-bg: #0f172a;

    --text: #f8fafc;
    --text-soft: #cbd5e1;
    --muted: #94a3b8;

    --teal: #34d399;
    --accent-2: #2dd4bf;
    --gold: #2dd4bf;
    --gold-light: #5eead4;
    --ink: #04211c;

    --accent-soft: rgba(52, 211, 153, 0.12);
    --accent-ring: rgba(52, 211, 153, 0.2);

    --surface: rgba(15, 23, 42, 0.78);
    --surface-solid: #111b30;
    --tile: rgba(30, 41, 59, 0.55);
    --input: rgba(15, 23, 42, 0.7);

    --border: rgba(148, 163, 184, 0.16);
    --border-hover: rgba(148, 163, 184, 0.32);

    --shadow: 0 24px 70px rgba(0, 0, 0, 0.38);
    --tour-pattern: rgba(148, 163, 184, 0.07);
  }

  .tour-page {
    position: relative;
    isolation: isolate;
    overflow-x: clip;
  }

  .tour-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.45rem 0.9rem;
    border: 1px solid rgba(79, 70, 229, 0.22);
    border-radius: 9999px;
    background: var(--surface-solid);
    color: var(--teal);
    font-size: 0.75rem;
    font-weight: 600;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05);
  }

  .dark .tour-badge {
    border-color: rgba(52, 211, 153, 0.22);
  }

  .tour-label {
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    line-height: 1;
    color: var(--muted);
  }

  .tour-title-gradient {
    background: linear-gradient(90deg, #4f46e5, #9333ea, #ec4899);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .dark .tour-title-gradient {
    background: linear-gradient(90deg, #34d399, #2dd4bf, #22d3ee);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .ticket-card {
    position: relative;
    width: 100%;
    border: 1px solid var(--border);
    border-radius: 1.25rem;
    background: var(--surface);
    box-shadow: var(--shadow);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
  }

  .ticket-route {
    border-bottom: 1px solid var(--border);
    border-radius: 1.25rem 1.25rem 0 0;
    background: linear-gradient(135deg, var(--accent-soft), transparent 70%);
  }

  .ticket-route-value {
    min-width: 0;
    color: var(--text);
    font-weight: 700;
    line-height: 1.3;
  }

  .ticket-perf {
    position: relative;
    height: 1px;
    margin: 0 1.75rem;
    border-top: 1px dashed var(--border-hover);
  }

  .ticket-notch {
    position: absolute;
    top: 50%;
    width: 1.2rem;
    height: 1.2rem;
    border: 1px solid var(--border);
    border-radius: 9999px;
    background: var(--page-bg);
    transform: translateY(-50%);
  }

  .ticket-notch-left { left: -0.6rem; }
  .ticket-notch-right { right: -0.6rem; }

  .field-focus {
    position: relative;
    min-width: 0;
    border: 1px solid var(--border);
    background: var(--input);
    transition:
      border-color 160ms ease,
      background-color 160ms ease,
      box-shadow 160ms ease;
  }

  .field-focus:hover {
    border-color: var(--border-hover);
  }

  .field-focus:focus-within {
    border-color: var(--teal);
    box-shadow: 0 0 0 3px var(--accent-ring);
  }

  .field-error,
  .field-error:hover,
  .field-error:focus-within {
    border-color: rgba(239, 68, 68, 0.75);
  }

  .field-focus:focus-within .tour-label {
    color: var(--teal);
  }

  .tour-input {
    color: var(--text);
    font-size: 0.9rem;
    font-weight: 500;
    line-height: 1.4;
  }

  .field-focus input,
  .field-focus textarea {
    padding: 0;
    border: 0 !important;
    outline: 0 !important;
    box-shadow: none !important;
    background: transparent !important;
    -webkit-appearance: none;
    appearance: none;
  }

  .tour-input::placeholder {
    color: var(--muted);
    opacity: 0.6;
  }

  .tour-input[type="number"]::-webkit-outer-spin-button,
  .tour-input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .tour-input[type="number"] {
    -moz-appearance: textfield;
  }

  .step-btn {
    display: flex;
    width: 2rem;
    height: 2rem;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--border);
    border-radius: 0.6rem;
    background: var(--tile);
    color: var(--text-soft);
    transition: all 150ms ease;
  }

  .step-btn:hover {
    border-color: var(--teal);
    color: var(--teal);
  }

  .step-btn:active {
    transform: scale(0.92);
  }

  .tour-dropdown {
    border: 1px solid var(--border-hover);
    background: var(--surface-solid);
    box-shadow: 0 22px 55px rgba(15, 23, 42, 0.16);
  }

  .dark .tour-dropdown {
    box-shadow: 0 22px 55px rgba(0, 0, 0, 0.5);
  }

  .location-scroll,
  .custom-dropdown-scroll {
    max-height: 240px;
    overflow-y: auto;
    overscroll-behavior: contain;
  }

  .location-scroll::-webkit-scrollbar,
  .custom-dropdown-scroll::-webkit-scrollbar,
  .tour-root ::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }

  .location-scroll::-webkit-scrollbar-thumb,
  .custom-dropdown-scroll::-webkit-scrollbar-thumb,
  .tour-root ::-webkit-scrollbar-thumb {
    border-radius: 9999px;
    background: var(--border-hover);
  }

  .dropdown-option {
    color: var(--text);
    transition: background-color 140ms ease;
  }

  .dropdown-option:hover,
  .dropdown-option.selected {
    background: var(--accent-soft);
  }

  .tour-button {
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
    color: #ffffff;
    border: 1px solid transparent;
    box-shadow: 0 14px 34px rgba(79, 70, 229, 0.28);
    transition:
      transform 160ms ease,
      box-shadow 160ms ease,
      filter 160ms ease;
  }

  .dark .tour-button {
    background: linear-gradient(135deg, #10b981, #0d9488);
    box-shadow: 0 14px 34px rgba(16, 185, 129, 0.22);
  }

  .tour-button:hover:not(:disabled) {
    filter: brightness(1.06);
    transform: translateY(-1px);
  }

  .tour-button:active:not(:disabled) {
    transform: translateY(0);
  }

  .tour-button:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .ghost-button {
    border: 1px solid var(--border-hover);
    background: var(--surface-solid);
    color: var(--text);
    transition: all 160ms ease;
  }

  .ghost-button:hover {
    border-color: var(--teal);
    color: var(--teal);
  }

  .tour-progress-track {
    position: relative;
    overflow: hidden;
  }

  .tour-progress-bar {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 40%;
    border-radius: 9999px;
    background: var(--teal);
    animation: tour-progress-slide 1.6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }

  @keyframes tour-progress-slide {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(250%); }
  }

  .result-card,
  .ai-loading-card {
    border: 1px solid var(--border);
    background: var(--surface);
    box-shadow: var(--shadow);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
  }

  .result-section {
    border: 1px solid var(--border);
    border-radius: 1.1rem;
    background: var(--tile);
  }

  .result-item {
    border: 1px solid var(--border);
    border-radius: 1rem;
    background: var(--surface-solid);
  }

  .tile {
    border: 1px solid var(--border);
    background: var(--surface-solid);
  }

  .soft-tile {
    background: var(--accent-soft);
  }

  @media (min-width: 640px) {
    .tour-input { font-size: 0.975rem; }
    .ticket-perf { margin: 0 2rem; }
    .ticket-card { border-radius: 1.5rem; }
    .ticket-route { border-radius: 1.5rem 1.5rem 0 0; }
  }

  @media (max-width: 640px) {
    .location-scroll,
    .custom-dropdown-scroll { max-height: 210px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .field-focus,
    .tour-button,
    .step-btn,
    .tour-root { transition: none; }

    .tour-progress-bar { animation: none; width: 100%; opacity: 0.6; }
  }
`;

const extractTripId = (source) => {
  if (!source || typeof source !== "object") return null;

  const candidates = [
    source.tripId,
    source._id,
    source.id,
    source.trip?._id,
    source.trip?.tripId,
    source.trip?.id,
    source.data?._id,
    source.data?.tripId,
    source.data?.id,
  ];

  return candidates.find(Boolean) || null;
};

const fieldWrap =
  "field-focus group relative min-h-[68px] w-full rounded-2xl px-3.5 pb-2.5 pt-6 sm:min-h-[78px] sm:px-5 sm:pb-3 sm:pt-7";

const labelCls =
  "tour-label pointer-events-none absolute left-3.5 top-2.5 z-10 transition-colors sm:left-5";

const iconBoxCls =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--teal)] sm:h-9 sm:w-9";

const dropdownCls =
  "tour-dropdown absolute left-0 right-0 top-[calc(100%+6px)] z-[9999] overflow-hidden rounded-2xl";

const dropdownMotion = {
  initial: { opacity: 0, y: -6, scale: 0.985 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -5, scale: 0.985 },
  transition: { duration: 0.16, ease: "easeOut" },
};

const clearFieldError = (setFieldErrors, name) => {
  setFieldErrors((prev) => {
    if (!prev[name]) return prev;

    const next = { ...prev };
    delete next[name];
    return next;
  });
};

const FieldError = ({ message }) =>
  message ? (
    <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-500">
      <AlertCircle size={14} className="shrink-0" />
      <span>{message}</span>
    </div>
  ) : null;

const LocationField = ({
  name,
  label,
  icon: Icon,
  value,
  activeLocation,
  setActiveLocation,
  setForm,
  setFieldErrors,
  error,
  locationOptions,
}) => {
  const open = activeLocation === name;
  const query = value.trim().toLowerCase();

  const locations = query
    ? locationOptions
      .filter((item) =>
        [
          item.name,
          item.city,
          item.state,
          item.type,
          item.description,
          ...(item.tags || []),
        ].some((field) => String(field || "").toLowerCase().includes(query)),
      )
      .slice(0, 80)
    : locationOptions.slice(0, 80);

  const selectLocation = (location) => {
    setForm((prev) => ({ ...prev, [name]: location.name }));
    clearFieldError(setFieldErrors, name);
    setActiveLocation(null);
  };

  return (
    <div
      className={`relative w-full ${open ? "z-[100]" : "z-10"}`}
      data-location-field
    >
      <div className={`${fieldWrap} ${error ? "field-error" : ""}`}>
        <label className={labelCls}>{label}</label>

        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <span className={iconBoxCls}>
            <Search size={16} />
          </span>

          <input
            type="text"
            name={name}
            value={value}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, [name]: e.target.value }));
              clearFieldError(setFieldErrors, name);
              setActiveLocation(name);
            }}
            onFocus={() => setActiveLocation(name)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && locations.length === 1) {
                e.preventDefault();
                selectLocation(locations[0]);
              }

              if (e.key === "Escape") {
                setActiveLocation(null);
              }
            }}
            autoComplete="off"
            spellCheck="false"
            placeholder={`Search ${label.toLowerCase()}`}
            className="tour-input min-w-0 flex-1 bg-transparent outline-none"
          />

          <Icon
            size={17}
            strokeWidth={1.8}
            className="shrink-0 text-[var(--muted)]"
          />
        </div>

        <FieldError message={error} />

        <AnimatePresence>
          {open && (
            <motion.div {...dropdownMotion} className={dropdownCls}>
              <div className="location-scroll p-1.5 sm:p-2">
                {locations.length ? (
                  locations.map((location, index) => (
                    <button
                      key={`${location.state}-${location.name}-${index}`}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        selectLocation(location);
                      }}
                      className="dropdown-option flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm sm:px-4 sm:py-3"
                    >
                      <span className={iconBoxCls}>
                        <MapPin size={15} />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-semibold">
                          {location.name}
                        </span>

                        <span className="mt-0.5 block truncate text-xs text-[var(--muted)]">
                          {location.city} • {location.state} • {location.type}
                        </span>
                      </span>

                      {value === location.name && (
                        <Check
                          size={16}
                          className="ml-auto shrink-0 text-[var(--teal)]"
                        />
                      )}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-5 text-center text-sm text-[var(--muted)]">
                    No matching place found. You can enter a location manually.
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

const NumberField = ({
  name,
  label,
  icon: Icon,
  step,
  minimum,
  prefix = "",
  value,
  setForm,
  setFieldErrors,
  error,
}) => {
  const changeNumber = (amount) => {
    setForm((prev) => {
      const current = Number(prev[name]);

      const safeCurrent =
        Number.isFinite(current) && current >= minimum ? current : minimum;

      return {
        ...prev,
        [name]: String(Math.max(minimum, safeCurrent + amount)),
      };
    });

    clearFieldError(setFieldErrors, name);
  };

  const handleNumberChange = (e) => {
    setForm((prev) => ({ ...prev, [name]: e.target.value }));
    clearFieldError(setFieldErrors, name);
  };

  return (
    <div className="relative z-10 w-full">
      <div className={`${fieldWrap} ${error ? "field-error" : ""}`}>
        <label className={labelCls}>{label}</label>

        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <span className={iconBoxCls}>
            <Icon size={16} />
          </span>

          <div className="flex min-w-0 flex-1 items-center">
            {prefix && (
              <span className="tour-input mr-1.5 shrink-0">{prefix}</span>
            )}

            <input
              type="number"
              inputMode="numeric"
              min={minimum}
              step={step}
              name={name}
              value={value}
              onChange={handleNumberChange}
              className="tour-input w-full min-w-0 bg-transparent outline-none"
            />
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              aria-label={`Decrease ${label}`}
              onClick={() => changeNumber(-step)}
              className="step-btn"
            >
              <Minus size={14} />
            </button>

            <button
              type="button"
              aria-label={`Increase ${label}`}
              onClick={() => changeNumber(step)}
              className="step-btn"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        <FieldError message={error} />
      </div>
    </div>
  );
};

const getTransportIcon = (value) => {
  switch (value) {
    case "Car":
      return Car;
    case "Bike":
      return Bike;
    case "Train":
      return Train;
    case "Flight":
      return Plane;
    case "Bus":
      return Bus;
    default:
      return Navigation;
  }
};

const SelectField = ({
  name,
  label,
  icon: Icon,
  options,
  value,
  handleChange,
  activeSelect,
  setActiveSelect,
  error,
}) => {
  const open = activeSelect === name;

  const SelectedIcon =
    name === "transport" && value ? getTransportIcon(value) : Icon;

  return (
    <div
      className={`relative w-full ${open ? "z-[100]" : "z-10"}`}
      data-select-field
    >
      <div
        className={`${fieldWrap} cursor-pointer ${error ? "field-error" : ""}`}
        onClick={() => setActiveSelect(open ? null : name)}
        tabIndex={0}
        role="button"
        aria-expanded={open}
        onKeyDown={(e) => {
          if (e.key === "Escape") setActiveSelect(null);

          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setActiveSelect(open ? null : name);
          }
        }}
      >
        <label className={labelCls}>{label}</label>

        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <span className={iconBoxCls}>
            <SelectedIcon size={16} />
          </span>

          <div className="min-w-0 flex-1">
            <span
              className={`tour-input block truncate ${value ? "" : "!text-[var(--muted)] opacity-70"
                }`}
            >
              {value || `Select ${label}`}
            </span>
          </div>

          <ChevronDown
            size={17}
            className={`shrink-0 text-[var(--muted)] transition-transform duration-200 ${open ? "rotate-180" : ""
              }`}
          />
        </div>

        <FieldError message={error} />

        <AnimatePresence>
          {open && (
            <motion.div
              {...dropdownMotion}
              className={dropdownCls}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="custom-dropdown-scroll p-1.5 sm:p-2">
                {options.map((option) => {
                  const OptionIcon =
                    name === "transport" ? getTransportIcon(option) : Icon;

                  const selected = value === option;

                  return (
                    <button
                      key={option}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleChange({ target: { name, value: option } });
                        setActiveSelect(null);
                      }}
                      className={`dropdown-option ${selected ? "selected" : ""
                        } flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium sm:px-4 sm:py-3`}
                    >
                      <span className={iconBoxCls}>
                        <OptionIcon size={15} />
                      </span>

                      <span>{option}</span>

                      {selected && (
                        <Check
                          size={16}
                          className="ml-auto text-[var(--teal)]"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const SectionTitle = ({ icon: Icon, title, subtitle }) => (
  <div className="mb-4 flex items-start gap-3 sm:mb-5">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--teal)] sm:h-10 sm:w-10">
      <Icon size={18} />
    </div>

    <div className="min-w-0">
      <h3 className="text-lg font-bold text-[var(--text)] sm:text-xl">
        {title}
      </h3>

      {subtitle && (
        <p className="mt-1 text-[13px] leading-5 text-[var(--muted)] sm:text-sm sm:leading-6">
          {subtitle}
        </p>
      )}
    </div>
  </div>
);

const TourLoading = ({ message, step }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="ai-loading-card mx-auto w-full min-w-0 max-w-2xl rounded-[1.25rem] p-5 sm:rounded-3xl sm:p-9"
  >
    <div className="flex min-w-0 flex-col items-center text-center">
      <p className="tour-label">Travel Planner</p>

      <h2 className="mt-2.5 text-lg font-bold leading-snug text-[var(--text)] sm:mt-3 sm:text-2xl md:text-3xl">
        {message}
      </h2>

      <ul className="mt-5 w-full max-w-sm space-y-1.5 text-left sm:mt-7 sm:space-y-2">
        {loadingSteps.map((item, index) => {
          const StepIcon = item.icon;
          const done = index < step;
          const active = index === step;

          return (
            <li
              key={item.label}
              className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-[13px] font-medium transition-all duration-500 sm:px-4 sm:py-3 sm:text-sm ${active
                  ? "border-[var(--teal)] bg-[var(--accent-soft)] text-[var(--text)]"
                  : done
                    ? "border-transparent text-[var(--text-soft)]"
                    : "border-transparent text-[var(--muted)] opacity-60"
                }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg sm:h-8 sm:w-8 ${done
                    ? "bg-[var(--teal)] text-[var(--ink)]"
                    : "bg-[var(--accent-soft)] text-[var(--teal)]"
                  }`}
              >
                {done ? (
                  <Check size={15} strokeWidth={3} />
                ) : active ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <StepIcon size={15} />
                )}
              </span>

              <span className="min-w-0 flex-1 truncate">{item.label}</span>
            </li>
          );
        })}
      </ul>

      <div className="tour-progress-track mt-5 h-1.5 w-full max-w-sm rounded-full bg-[var(--accent-soft)] sm:mt-6">
        <div className="tour-progress-bar" />
      </div>

      <p className="mt-4 text-[11px] leading-5 text-[var(--muted)] sm:mt-5 sm:text-xs">
        Your data is safe. Please don't refresh or close this page.
      </p>
    </div>
  </motion.div>
);

const TourResult = ({ result, onConfirm, onCancel, actionLoading }) => {
  if (!result) return null;

  const plan = result.tripPlan || result.aiPlan || {};
  const budgetBreakdown = plan.budgetBreakdown || {};

  const asArray = (value) => (Array.isArray(value) ? value : []);

  const hotels = asArray(plan.hotels);
  const restaurants = asArray(plan.restaurants);
  const touristPlaces = asArray(plan.touristPlaces);
  const hiddenGems = asArray(plan.hiddenGems);
  const dailyPlan = asArray(plan.dailyPlan);
  const packingList = asArray(plan.packingList);
  const travelTips = asArray(plan.travelTips);
  const shoppingPlaces = asArray(plan.shoppingPlaces);
  const localFoods = asArray(plan.localFoods);

  const isConfirmed = result.status === "Booked" || result.isBooked === true;
  const isCancelled = result.status === "Cancelled";

  const money = (value) => {
    const number = Number(value);

    return Number.isFinite(number)
      ? `₹${number.toLocaleString("en-IN")}`
      : "₹0";
  };

  const text = (item) =>
    typeof item === "string" ? item : JSON.stringify(item);

  const withProtocol = (url) =>
    /^https?:\/\//i.test(url) ? url : `https://${url}`;

  const getMapsUrl = (hotel) =>
    hotel.googleMapsUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${hotel.name || ""} ${result.destination || ""}`.trim(),
    )}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="result-card rounded-[1.25rem] p-4 sm:rounded-3xl sm:p-7 lg:p-9"
    >
      <div className="mb-6 border-b border-[var(--border)] pb-6 sm:mb-7 sm:pb-7">
        <div className="flex flex-wrap items-start justify-between gap-4 sm:gap-5">
          <div className="min-w-0">
            <p className="tour-label">Your Personalized Tour</p>

            <h2 className="mt-2.5 break-words text-2xl font-bold leading-tight tracking-tight text-[var(--text)] sm:text-4xl">
              {result.startLocation || "Origin"}{" "}
              <span className="text-[var(--teal)]">→</span>{" "}
              {result.destination || "Destination"}
            </h2>

            <p className="mt-3 max-w-3xl text-[13px] leading-6 text-[var(--text-soft)] sm:text-sm sm:leading-7">
              {plan.summary ||
                "Your travel plan has been prepared according to your selected preferences."}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 rounded-full bg-[var(--accent-soft)] px-3.5 py-2 text-xs font-semibold text-[var(--teal)] sm:px-4 sm:text-sm">
            <ShieldCheck size={16} />
            Plan Ready
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
        {[
          ["People", result.people],
          ["Days", result.days],
          ["Budget", money(result.budget)],
          ["Transport", result.transport || "Any"],
        ].map(([label, value]) => (
          <div key={label} className="tile min-w-0 rounded-2xl p-3.5 sm:p-4">
            <p className="tour-label">{label}</p>
            <p className="mt-2 truncate text-base font-bold text-[var(--text)] sm:text-lg">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-3 grid gap-2.5 sm:mt-4 sm:grid-cols-3 sm:gap-3">
        {[
          ["Travel Type", result.travelType],
          ["Hotel", result.hotelType],
          ["Food", result.foodPreference],
        ].map(([label, value]) => (
          <div key={label} className="tile rounded-2xl p-4 sm:p-5">
            <p className="tour-label">{label}</p>
            <p className="mt-2 text-sm font-semibold text-[var(--text)] sm:text-base">
              {value || "Not specified"}
            </p>
          </div>
        ))}
      </div>

      {(plan.bestTimeToVisit || plan.weather) && (
        <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4">
          {plan.bestTimeToVisit && (
            <div className="result-section p-4 sm:p-5">
              <p className="tour-label">Best Time To Visit</p>
              <p className="mt-2 text-sm font-semibold text-[var(--text)] sm:text-base">
                {plan.bestTimeToVisit}
              </p>
            </div>
          )}

          {plan.weather && (
            <div className="result-section p-4 sm:p-5">
              <p className="tour-label">Weather</p>
              <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">
                {plan.weather}
              </p>
            </div>
          )}
        </div>
      )}

      {result.specialRequest && (
        <div className="result-section mt-3 p-4 sm:mt-4 sm:p-5">
          <p className="tour-label">Special Request</p>
          <p className="mt-2 break-words text-sm leading-6 text-[var(--text-soft)]">
            {result.specialRequest}
          </p>
        </div>
      )}

      {Object.keys(budgetBreakdown).length > 0 && (
        <div className="result-section mt-6 p-4 sm:mt-8 sm:p-6">
          <SectionTitle
            icon={Wallet}
            title="Budget Breakdown"
            subtitle={`Estimated total: ${money(
              plan.estimatedCost || result.budget,
            )}`}
          />

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-6">
            {[
              ["Hotel", budgetBreakdown.hotel],
              ["Food", budgetBreakdown.food],
              ["Transport", budgetBreakdown.transport],
              ["Activities", budgetBreakdown.activities],
              ["Shopping", budgetBreakdown.shopping],
              ["Remaining", budgetBreakdown.remaining],
            ].map(([label, value]) => (
              <div key={label} className="soft-tile rounded-xl p-3.5 sm:p-4">
                <p className="text-xs text-[var(--muted)]">{label}</p>
                <p className="mt-1 text-sm font-bold text-[var(--text)] sm:text-base">
                  {money(value)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {dailyPlan.length > 0 && (
        <div className="mt-6 sm:mt-8">
          <SectionTitle
            icon={CalendarDays}
            title="Daily Itinerary"
            subtitle="A practical day-by-day plan for your journey."
          />

          <div className="space-y-3 sm:space-y-4">
            {dailyPlan.map((day, index) => (
              <motion.div
                key={`${day.day || index}-${index}`}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="result-item overflow-hidden p-4 sm:p-5"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--teal)] text-sm font-bold text-[var(--ink)] sm:h-11 sm:w-11">
                    {day.day || index + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="text-base font-bold text-[var(--text)] sm:text-xl">
                      {day.title || `Day ${index + 1}`}
                    </h4>

                    {Array.isArray(day.activities) &&
                      day.activities.length > 0 && (
                        <div className="mt-3 space-y-2 sm:mt-4">
                          {day.activities.map((activity, activityIndex) => (
                            <div
                              key={activityIndex}
                              className="flex items-start gap-2 text-[13px] leading-6 text-[var(--text-soft)] sm:text-sm"
                            >
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--teal)]" />
                              <span className="break-words">
                                {text(activity)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {hotels.length > 0 && (
        <div className="result-section mt-6 p-4 sm:mt-8 sm:p-6">
          <SectionTitle
            icon={Hotel}
            title="Recommended Hotels"
            subtitle="Accommodation options matching your hotel preference."
          />

          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            {hotels.map((hotel, index) => (
              <div
                key={`${hotel.name || "hotel"}-${index}`}
                className="result-item p-4 sm:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <h4 className="min-w-0 break-words font-bold text-[var(--text)]">
                    {hotel.name}
                  </h4>

                  {hotel.rating && (
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-[var(--accent-soft)] px-2 py-1 text-xs font-semibold text-[var(--teal)]">
                      <Star size={12} />
                      {hotel.rating}
                    </span>
                  )}
                </div>

                {hotel.pricePerNight && (
                  <p className="mt-2 text-sm font-semibold text-[var(--teal)]">
                    {hotel.pricePerNight}
                  </p>
                )}

                {hotel.address && (
                  <p className="mt-2 flex items-start gap-1.5 text-xs leading-5 text-[var(--muted)]">
                    <MapPin size={13} className="mt-0.5 shrink-0" />
                    <span className="break-words">{hotel.address}</span>
                  </p>
                )}

                {hotel.reason && (
                  <p className="mt-3 text-[13px] leading-6 text-[var(--text-soft)] sm:text-sm">
                    {hotel.reason}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={getMapsUrl(hotel)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ghost-button inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
                  >
                    <MapPin size={13} />
                    View on Maps
                    <ExternalLink size={12} />
                  </a>

                  {hotel.websiteUrl && (
                    <a
                      href={withProtocol(hotel.websiteUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ghost-button inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
                    >
                      <Globe size={13} />
                      Website
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {restaurants.length > 0 && (
        <div className="result-section mt-6 p-4 sm:mt-8 sm:p-6">
          <SectionTitle
            icon={Coffee}
            title="Recommended Restaurants"
            subtitle="Places to eat according to your food preference."
          />

          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            {restaurants.map((restaurant, index) => (
              <div
                key={`${restaurant.name || "restaurant"}-${index}`}
                className="result-item p-4 sm:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <h4 className="min-w-0 break-words font-bold text-[var(--text)]">
                    {restaurant.name}
                  </h4>

                  {restaurant.rating && (
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-[var(--accent-soft)] px-2 py-1 text-xs font-semibold text-[var(--teal)]">
                      <Star size={12} />
                      {restaurant.rating}
                    </span>
                  )}
                </div>

                {restaurant.speciality && (
                  <p className="mt-3 text-[13px] leading-6 text-[var(--text-soft)] sm:text-sm">
                    {restaurant.speciality}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {touristPlaces.length > 0 && (
        <div className="result-section mt-6 p-4 sm:mt-8 sm:p-6">
          <SectionTitle
            icon={Map}
            title="Places To Visit"
            subtitle="Must-see attractions for your trip."
          />

          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            {touristPlaces.map((place, index) => (
              <div
                key={`${place.name || "place"}-${index}`}
                className="result-item p-4 sm:p-5"
              >
                <h4 className="break-words font-bold text-[var(--text)]">
                  {place.name}
                </h4>

                {place.description && (
                  <p className="mt-3 text-[13px] leading-6 text-[var(--text-soft)] sm:text-sm">
                    {place.description}
                  </p>
                )}

                {place.entryFee && (
                  <div className="mt-3 inline-flex rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--teal)]">
                    Entry: {place.entryFee}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {hiddenGems.length > 0 && (
        <div className="result-section mt-6 p-4 sm:mt-8 sm:p-6">
          <SectionTitle
            icon={MapPin}
            title="Hidden Gems"
            subtitle="Less obvious places worth exploring."
          />

          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            {hiddenGems.map((gem, index) => (
              <div
                key={`${gem.name || "gem"}-${index}`}
                className="result-item p-4 sm:p-5"
              >
                <h4 className="break-words font-bold text-[var(--text)]">
                  {gem.name}
                </h4>

                {gem.description && (
                  <p className="mt-3 text-[13px] leading-6 text-[var(--text-soft)] sm:text-sm">
                    {gem.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {(shoppingPlaces.length > 0 || localFoods.length > 0) && (
        <div className="mt-6 grid gap-4 sm:mt-8 sm:gap-5 lg:grid-cols-2">
          {shoppingPlaces.length > 0 && (
            <div className="result-section p-4 sm:p-6">
              <SectionTitle icon={ShoppingBag} title="Shopping" />

              <div className="space-y-2">
                {shoppingPlaces.map((item, index) => (
                  <div
                    key={index}
                    className="tile rounded-xl px-4 py-3 text-[13px] leading-6 text-[var(--text-soft)] sm:text-sm"
                  >
                    {text(item)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {localFoods.length > 0 && (
            <div className="result-section p-4 sm:p-6">
              <SectionTitle icon={Utensils} title="Local Foods" />

              <div className="space-y-2">
                {localFoods.map((item, index) => (
                  <div
                    key={index}
                    className="tile rounded-xl px-4 py-3 text-[13px] leading-6 text-[var(--text-soft)] sm:text-sm"
                  >
                    {text(item)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {(packingList.length > 0 || travelTips.length > 0) && (
        <div className="mt-6 grid gap-4 sm:mt-8 sm:gap-5 lg:grid-cols-2">
          {packingList.length > 0 && (
            <div className="result-section p-4 sm:p-6">
              <SectionTitle icon={Backpack} title="Packing List" />

              <div className="grid gap-2 sm:grid-cols-2">
                {packingList.map((item, index) => (
                  <div
                    key={index}
                    className="tile flex items-start gap-2 rounded-xl px-4 py-3 text-[13px] text-[var(--text-soft)] sm:text-sm"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--teal)]" />
                    <span className="break-words">{text(item)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {travelTips.length > 0 && (
            <div className="result-section p-4 sm:p-6">
              <SectionTitle icon={Lightbulb} title="Travel Tips" />

              <div className="space-y-2">
                {travelTips.map((item, index) => (
                  <div
                    key={index}
                    className="tile flex items-start gap-2 rounded-xl px-4 py-3 text-[13px] leading-6 text-[var(--text-soft)] sm:text-sm"
                  >
                    <Lightbulb
                      size={15}
                      className="mt-1 shrink-0 text-[var(--gold)]"
                    />
                    <span className="break-words">{text(item)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {plan.emergencyContacts &&
        (plan.emergencyContacts.hospital ||
          plan.emergencyContacts.police ||
          plan.emergencyContacts.helpline) && (
          <div className="result-section mt-6 p-4 sm:mt-8 sm:p-6">
            <SectionTitle
              icon={ShieldCheck}
              title="Emergency Contacts"
              subtitle="Keep these details available during your journey."
            />

            <div className="grid gap-2.5 sm:grid-cols-3 sm:gap-3">
              {[
                ["Hospital", plan.emergencyContacts.hospital, Hospital],
                ["Police", plan.emergencyContacts.police, ShieldCheck],
                ["Helpline", plan.emergencyContacts.helpline, Phone],
              ]
                .filter(([, value]) => value)
                .map(([label, value, ContactIcon]) => (
                  <div
                    key={label}
                    className="tile flex items-start gap-3 rounded-xl p-4"
                  >
                    <ContactIcon
                      size={18}
                      className="mt-0.5 shrink-0 text-[var(--teal)]"
                    />

                    <div className="min-w-0">
                      <p className="text-xs text-[var(--muted)]">{label}</p>
                      <p className="mt-1 break-words text-sm font-medium text-[var(--text)]">
                        {value}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

      <div className="mt-8 border-t border-[var(--border)] pt-7 sm:mt-10 sm:pt-8">
        <div className="text-center">
          <p className="tour-label">Tour Plan Status</p>

          <p className="mt-2 text-[13px] leading-6 text-[var(--muted)] sm:text-sm">
            Confirm or cancel your tour plan.
          </p>
        </div>

        <div className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-2">
          <button
            type="button"
            onClick={onConfirm}
            disabled={actionLoading || isConfirmed || isCancelled}
            className="tour-button flex min-h-[52px] items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold"
          >
            {actionLoading ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <Check size={17} />
            )}

            {isConfirmed ? "Trip Confirmed" : "Confirm Trip"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={actionLoading || isCancelled || isConfirmed}
            className="flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-400"
          >
            {actionLoading ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <AlertCircle size={17} />
            )}

            {isCancelled ? "Trip Cancelled" : "Cancel Trip"}
          </button>
        </div>

        {isConfirmed && (
          <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-600 dark:text-emerald-400">
            <Check size={16} />
            Your trip plan has been confirmed.
          </div>
        )}

        {isCancelled && (
          <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-red-500/10 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400">
            <AlertCircle size={16} />
            Your trip plan has been cancelled.
          </div>
        )}
      </div>
    </motion.div>
  );
};

const PageShell = ({ children }) => (
  <div className="tour-root min-h-screen w-full overflow-x-clip">
    <style>{styles}</style>

    <Navbar />

    <main
      className="
        tour-page
        min-h-[calc(100vh-110px)]
        px-3
        pb-6
        pt-3
        sm:px-6
        sm:pb-10
        sm:pt-5
        lg:px-8
        lg:pb-14
        lg:pt-6
      "
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage: `
            linear-gradient(
              90deg,
              var(--page-pattern-color, var(--tour-pattern)) 1px,
              transparent 1px
            ),
            linear-gradient(
              0deg,
              var(--page-pattern-color, var(--tour-pattern)) 1px,
              transparent 1px
            )
          `,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 mx-auto w-full min-w-0 max-w-5xl">
        {children}
      </div>
    </main>
  </div>
);

const Tour = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { tripId } = useParams();

  const isViewingTrip = Boolean(tripId);

  const [form, setForm] = useState({
    startLocation: "",
    destination: location.state?.destination || "",
    budget: "5000",
    people: "1",
    days: "1",
    travelType: "",
    hotelType: "",
    transport: "",
    foodPreference: "Any",
    specialRequest: "",
  });

  const [locationRegions, setLocationRegions] = useState(() => [
    ...INDIA_REGIONS,
  ]);

  const locationSearchOptions = useMemo(
    () => buildLocationSearchOptions(locationRegions),
    [locationRegions],
  );

  const [activeLocation, setActiveLocation] = useState(null);
  const [activeSelect, setActiveSelect] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingTrip, setLoadingTrip] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [tourResult, setTourResult] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
  const [loadingStep, setLoadingStep] = useState(0);

  const reduceMotion = useReducedMotion();

  const activeTripId = tripId || extractTripId(tourResult);

  useEffect(() => {
    const controller = new AbortController();

    loadIndiaAdministrativeData({ signal: controller.signal })
      .then((regions) => {
        setLocationRegions([...regions]);
      })
      .catch((error) => {
        if (error?.name !== "AbortError") {
          setLocationRegions([...INDIA_REGIONS]);
        }
      });

    return () => controller.abort();
  }, []);


  const budgetNumber = Number(form.budget);

  const budgetIsInvalid =
    form.budget !== "" &&
    (!Number.isFinite(budgetNumber) || budgetNumber < 5000);

  useEffect(() => {
    if (!loading) {
      setLoadingMessage(loadingMessages[0]);
      setLoadingStep(0);
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });

    let tick = 0;

    const interval = setInterval(() => {
      tick += 1;

      setLoadingMessage(loadingMessages[tick % loadingMessages.length]);

      if (tick % 2 === 0) {
        setLoadingStep((previous) =>
          Math.min(previous + 1, loadingSteps.length - 1),
        );
      }
    }, 2600);

    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    if (isViewingTrip) return;

    const people = Number(form.people);

    if (people === 1) {
      setForm((prev) =>
        prev.travelType === "Solo" ? prev : { ...prev, travelType: "Solo" },
      );
      clearFieldError(setFieldErrors, "travelType");
    } else if (people > 1) {
      setForm((prev) =>
        prev.travelType === "Solo" ? { ...prev, travelType: "" } : prev,
      );
    }
  }, [form.people, isViewingTrip]);

  useEffect(() => {
    if (location.state?.destination && !tripId) {
      setForm((prev) => ({
        ...prev,
        destination: location.state.destination,
      }));
    }
  }, [location.state, tripId]);

  useEffect(() => {
    const loadTrip = async () => {
      if (!tripId) {
        setTourResult(null);
        return;
      }

      try {
        setLoadingTrip(true);
        setTourResult(null);

        const response = await getTripById(tripId);
        const responseData = response?.data ?? response;

        if (!responseData) {
          throw new Error("Saved trip was not found");
        }

        const trip = responseData?.data ?? responseData?.trip ?? responseData;

        if (!trip || typeof trip !== "object") {
          throw new Error("Saved trip data was not found");
        }

        setTourResult(trip);

        setForm({
          startLocation: trip.startLocation || "",
          destination: trip.destination || "",
          budget: String(trip.budget ?? 5000),
          people: String(trip.people ?? 1),
          days: String(trip.days ?? 1),
          travelType: trip.travelType || "",
          hotelType: trip.hotelType || "",
          transport: trip.transport || "",
          foodPreference: trip.foodPreference || "Any",
          specialRequest: trip.specialRequest || "",
        });

        requestAnimationFrame(() => {
          setTimeout(() => {
            document.querySelector(".result-card")?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }, 150);
        });
      } catch (error) {
        console.error("LOAD TRIP ERROR:", error);

        setTourResult(null);

        toast.error(
          error?.response?.data?.message ||
          error?.message ||
          "Unable to load your saved trip",
        );
      } finally {
        setLoadingTrip(false);
      }
    };

    loadTrip();
  }, [tripId]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest("[data-location-field]")) {
        setActiveLocation(null);
      }

      if (!event.target.closest("[data-select-field]")) {
        setActiveSelect(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));
    clearFieldError(setFieldErrors, name);
  };

  const getBudgetMessage = (budget) => {
    if (!Number.isFinite(budget) || budget < 1000) {
      return (
        "😂 Are you kidding? ₹" +
        (Number.isFinite(budget) ? budget.toLocaleString("en-IN") : "0") +
        " won't even cover the basics of a trip!"
      );
    }

    if (budget < 2000) {
      return (
        "🤣 ₹" +
        budget.toLocaleString("en-IN") +
        "? That's more like a snack budget than a travel budget!"
      );
    }

    if (budget < 3000) {
      return (
        "😂 Planning a vacation in ₹" +
        budget.toLocaleString("en-IN") +
        "? Even Google Maps is confused!"
      );
    }

    if (budget < 5000) {
      return (
        "😄 Nice try! ₹" +
        budget.toLocaleString("en-IN") +
        " is a little too optimistic for a proper trip."
      );
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setActiveLocation(null);
    setActiveSelect(null);

    const requiredFields = [
      ["startLocation", "Starting location"],
      ["destination", "Destination"],
      ["budget", "Budget"],
      ["people", "Number of people"],
      ["days", "Number of days"],
      ["travelType", "Travel type"],
      ["hotelType", "Hotel type"],
      ["transport", "Transport"],
      ["foodPreference", "Food preference"],
    ];

    const nextErrors = {};

    requiredFields.forEach(([key, label]) => {
      if (String(form[key] ?? "").trim() === "") {
        nextErrors[key] = `${label} is required`;
      }
    });

    if (Object.keys(nextErrors).length) {
      setFieldErrors(nextErrors);
      return;
    }

    setFieldErrors({});

    const budget = Number(form.budget);
    const people = Number(form.people);
    const days = Number(form.days);

    if (!Number.isFinite(budget) || budget < 5000) {
      const safeBudget = Number.isFinite(budget) ? budget : 0;

      toast.error(
        getBudgetMessage(safeBudget) ||
        "Please enter a realistic travel budget of at least ₹5,000.",
      );

      return;
    }

    if (!Number.isInteger(people) || people < 1) {
      toast.error("Number of people must be at least 1");
      return;
    }

    if (!Number.isInteger(days) || days < 1) {
      toast.error("Number of days must be at least 1");
      return;
    }

    try {
      setLoading(true);
      setTourResult(null);

      const payload = {
        startLocation: form.startLocation.trim(),
        destination: form.destination.trim(),
        budget,
        people,
        days,
        travelType: form.travelType,
        hotelType: form.hotelType,
        transport: form.transport,
        foodPreference: form.foodPreference,
        specialRequest: form.specialRequest.trim(),
      };

      const response = await createTour(payload);
      const responseData = response?.data;

      if (!responseData?.status) {
        toast.error(responseData?.message || "Unable to generate tour plan");
        return;
      }

      const createdTrip = responseData?.data ?? responseData?.trip;

      if (!createdTrip) {
        toast.error(
          responseData?.message ||
          "Tour was created but no trip data was returned",
        );
        return;
      }

      const createdTripId =
        extractTripId(createdTrip) || extractTripId(responseData);

      if (!createdTripId) {
        console.warn("CREATE TOUR: no trip id in response", responseData);

        setTourResult(createdTrip.trip || createdTrip);

        return;
      }

      navigate(`/tour/${createdTripId}`, { replace: true });
    } catch (error) {
      console.error("CREATE TOUR ERROR:", error);

      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error?.message;

      const statusCode =
        error?.response?.status || error?.response?.data?.error?.code;

      if (
        statusCode === 503 ||
        String(backendMessage || "")
          .toLowerCase()
          .includes("high demand")
      ) {
        toast.error(
          "😅 OurTeam member is having a little busy right now. Please try again in a moment.",
        );
      } else if (
        String(backendMessage || "")
          .toLowerCase()
          .includes("fetch failed")
      ) {
        toast.error(
          "🚧 Our travel planner is temporarily unavailable. Please try again shortly.",
        );
      } else {
        toast.error(
          backendMessage ||
          "Unable to create your tour plan. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const extractUpdated = (body) => {
    if (body?.data?.data && typeof body.data.data === "object") {
      return body.data.data;
    }

    if (body?.data && typeof body.data === "object") {
      return body.data;
    }

    return null;
  };

  const handleConfirmTrip = async () => {
    if (
      !activeTripId ||
      actionLoading ||
      tourResult?.status === "Booked" ||
      tourResult?.status === "Cancelled"
    ) {
      return;
    }

    try {
      setActionLoading(true);

      const response = await confirmTrip(activeTripId);

      const body =
        response?.data && typeof response.data === "object"
          ? response.data
          : response;

      if (body?.status === false) {
        throw new Error(body.message || "Unable to confirm trip plan");
      }

      setTourResult((previous) => ({
        ...previous,
        ...(extractUpdated(body) || {}),
        status: "Booked",
        isBooked: true,
      }));

      toast.success(body?.message || "Trip plan confirmed successfully");
    } catch (error) {
      console.error("CONFIRM TRIP ERROR:", error);

      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Unable to confirm trip plan",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelTrip = async () => {
    if (
      !activeTripId ||
      actionLoading ||
      tourResult?.status === "Cancelled" ||
      tourResult?.status === "Booked"
    ) {
      return;
    }

    try {
      setActionLoading(true);

      const response = await cancelTrip(activeTripId);

      const body =
        response?.data && typeof response.data === "object"
          ? response.data
          : response;

      if (body?.status === false) {
        throw new Error(body.message || "Unable to cancel trip plan");
      }

      setTourResult((previous) => ({
        ...previous,
        ...(extractUpdated(body) || {}),
        status: "Cancelled",
        isBooked: false,
      }));

      toast.success(body?.message || "Trip plan cancelled successfully");
    } catch (error) {
      console.error("CANCEL TRIP ERROR:", error);

      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Unable to cancel trip plan",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const origin = form.startLocation.trim() || "Origin";
  const destination = form.destination.trim() || "Destination";

  const budgetError =
    fieldErrors.budget ||
    (budgetIsInvalid ? "Minimum budget is ₹5,000" : undefined);

  const fadeIn = reduceMotion
    ? {}
    : {
      initial: { opacity: 0, y: 18 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    };

  const showResult = isViewingTrip || Boolean(tourResult);

  if (loadingTrip) {
    return (
      <PageShell>
        <div className="mx-auto flex min-h-[50vh] w-full max-w-md flex-col items-center justify-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent-soft)]">
            <Loader2 size={25} className="animate-spin text-[var(--teal)]" />
          </div>

          <h2 className="mt-5 text-xl font-bold text-[var(--text)] sm:text-2xl">
            Loading your trip
          </h2>

          <p className="mt-2 text-sm text-[var(--muted)]">
            Fetching your saved tour plan...
          </p>
        </div>
      </PageShell>
    );
  }

  if (isViewingTrip && !tourResult) {
    return (
      <PageShell>
        <div className="mx-auto flex min-h-[50vh] w-full max-w-md flex-col items-center justify-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent-soft)]">
            <MapPin size={28} className="text-[var(--teal)]" />
          </div>

          <h2 className="mt-5 text-xl font-bold text-[var(--text)] sm:text-2xl">
            Trip not found
          </h2>

          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            We could not find this saved travel plan.
          </p>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="tour-button mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold"
          >
            Back to Dashboard
            <ArrowRight size={17} />
          </button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      {showResult ? (
        <>
          <button
            type="button"
            onClick={() => {
              setTourResult(null);
              navigate("/tour");
            }}
            className="ghost-button mb-4 cursor-pointer inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold sm:mb-5 sm:text-sm"
          >
            Plan another trip
          </button>

          <TourResult
            result={tourResult}
            onConfirm={handleConfirmTrip}
            onCancel={handleCancelTrip}
            actionLoading={actionLoading}
          />
        </>
      ) : (
        <>
          {!loading && (
            <motion.div
              {...fadeIn}
              className="mx-auto mb-5 max-w-3xl px-1 text-center sm:mb-7 md:mb-8"
            >
              <h1 className="whitespace-nowrap text-[clamp(1.5rem,4vw,2.75rem)] font-medium leading-tight tracking-[-0.02em] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Create Your Perfect Tour
              </h1>

              <p className="mx-auto mt-3 max-w-xl px-2 text-[13px] leading-6 text-slate-600 dark:text-slate-300 sm:mt-4 sm:text-base sm:leading-7">
                Choose your starting location, destination, budget and travel
                preferences.
              </p>
            </motion.div>
          )}

          {loading ? (
            <TourLoading message={loadingMessage} step={loadingStep} />
          ) : (
            <motion.form
              {...fadeIn}
              onSubmit={handleSubmit}
              noValidate
              className="ticket-card"
            >
              <div className="ticket-route px-4 py-4 sm:px-7 sm:py-6 md:px-9">
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-5">
                  <div className="min-w-0">
                    <p className="tour-label">From</p>
                    <p className="ticket-route-value mt-1.5 truncate text-sm sm:text-lg">
                      {origin}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-[var(--teal)] sm:gap-2">
                    <span className="hidden h-px w-6 border-t border-dashed border-current opacity-50 sm:block sm:w-10" />

                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent-soft)] sm:h-10 sm:w-10">
                      <Plane size={16} className="sm:h-[18px] sm:w-[18px]" />
                    </span>

                    <span className="hidden h-px w-6 border-t border-dashed border-current opacity-50 sm:block sm:w-10" />
                  </div>

                  <div className="min-w-0 text-right">
                    <p className="tour-label">To</p>
                    <p className="ticket-route-value mt-1.5 truncate text-sm sm:text-lg">
                      {destination}
                    </p>
                  </div>
                </div>
              </div>

              <div className="ticket-perf">
                <span className="ticket-notch ticket-notch-left" />
                <span className="ticket-notch ticket-notch-right" />
              </div>

              <div className="min-w-0 px-3.5 py-5 sm:px-7 sm:py-8 md:px-9">
                <div className="grid min-w-0 grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
                  <LocationField
                    name="startLocation"
                    label="Starting Location"
                    icon={Navigation}
                    value={form.startLocation}
                    activeLocation={activeLocation}
                    setActiveLocation={setActiveLocation}
                    setForm={setForm}
                    setFieldErrors={setFieldErrors}
                    error={fieldErrors.startLocation}
                    locationOptions={locationSearchOptions}
                  />

                  <LocationField
                    name="destination"
                    label="Destination"
                    icon={MapPin}
                    value={form.destination}
                    activeLocation={activeLocation}
                    setActiveLocation={setActiveLocation}
                    setForm={setForm}
                    setFieldErrors={setFieldErrors}
                    error={fieldErrors.destination}
                    locationOptions={locationSearchOptions}
                  />

                  <NumberField
                    name="budget"
                    label="Budget"
                    icon={Wallet}
                    step={1000}
                    minimum={5000}
                    prefix="₹"
                    value={form.budget}
                    setForm={setForm}
                    setFieldErrors={setFieldErrors}
                    error={budgetError}
                  />

                  <NumberField
                    name="people"
                    label="Number of People"
                    icon={Users}
                    step={1}
                    minimum={1}
                    value={form.people}
                    setForm={setForm}
                    setFieldErrors={setFieldErrors}
                    error={fieldErrors.people}
                  />

                  <NumberField
                    name="days"
                    label="Number of Days"
                    icon={CalendarDays}
                    step={1}
                    minimum={1}
                    value={form.days}
                    setForm={setForm}
                    setFieldErrors={setFieldErrors}
                    error={fieldErrors.days}
                  />

                  <SelectField
                    name="travelType"
                    label="Travel Type"
                    icon={Heart}
                    options={travelTypeOptions}
                    value={form.travelType}
                    handleChange={handleChange}
                    activeSelect={activeSelect}
                    setActiveSelect={setActiveSelect}
                    error={fieldErrors.travelType}
                  />

                  <SelectField
                    name="hotelType"
                    label="Hotel Type"
                    icon={Hotel}
                    options={hotelTypeOptions}
                    value={form.hotelType}
                    handleChange={handleChange}
                    activeSelect={activeSelect}
                    setActiveSelect={setActiveSelect}
                    error={fieldErrors.hotelType}
                  />

                  <SelectField
                    name="transport"
                    label="Transport"
                    icon={Bus}
                    options={transportOptions}
                    value={form.transport}
                    handleChange={handleChange}
                    activeSelect={activeSelect}
                    setActiveSelect={setActiveSelect}
                    error={fieldErrors.transport}
                  />

                  <div className="md:col-span-2">
                    <SelectField
                      name="foodPreference"
                      label="Food Preference"
                      icon={Utensils}
                      options={foodOptions}
                      value={form.foodPreference}
                      handleChange={handleChange}
                      activeSelect={activeSelect}
                      setActiveSelect={setActiveSelect}
                      error={fieldErrors.foodPreference}
                    />
                  </div>

                  <div className="relative z-10 md:col-span-2">
                    <div className={fieldWrap}>
                      <label className={labelCls}>
                        Special Request (Optional)
                      </label>

                      <div className="flex min-w-0 items-start gap-2.5 sm:gap-3">
                        <span className={`${iconBoxCls} mt-0.5`}>
                          <MessageSquare size={16} />
                        </span>

                        <textarea
                          name="specialRequest"
                          rows={3}
                          value={form.specialRequest}
                          onChange={handleChange}
                          placeholder="Anything special? Trekking, photography spots, kid-friendly..."
                          className="tour-input min-w-0 flex-1 resize-none bg-transparent outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="ticket-perf">
                <span className="ticket-notch ticket-notch-left" />
                <span className="ticket-notch ticket-notch-right" />
              </div>

              <div className="px-3.5 py-5 sm:px-7 sm:py-7 md:px-9 md:py-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="tour-button group flex min-h-[52px] w-full items-center justify-center gap-3 rounded-xl px-5 text-sm font-bold sm:min-h-14 sm:text-base"
                >
                  Create Tour Plan
                </button>

                <p className="mt-3 text-center text-[11px] text-[var(--muted)] sm:text-xs">
                  Minimum budget ₹5,000 • Your plan is saved automatically
                </p>
              </div>
            </motion.form>
          )}
        </>
      )}
    </PageShell>
  );
};

export default Tour;