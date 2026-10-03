import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  MapPin,
  Navigation,
  Wallet,
  Users,
  CalendarDays,
  Building2,
  Utensils,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Minus,
  Plus,
  Search,
  Coffee,
  Map,
  ShoppingBag,
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
  Camera,
  Music,
  PartyPopper,
  Presentation,
  Image,
  Sparkles,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../Layout/Navbar";
import {
  createEvent,
  getEventById,
  confirmEvent,
  cancelEvent,
} from "../../Services/AuthAPI";
import INDIA_REGIONS, { loadIndiaAdministrativeData } from "../../Data/TouristPlaces";

const locationSearchOptions = [
  ...INDIA_REGIONS.flatMap((region) => [
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
      type: "City / Tourist Place",
    })),
  ]),
  ...INDIA_REGIONS.map((region) => ({
    name: region.name,
    city: region.capital,
    state: region.name,
    type: region.type === "state" ? "State" : "Union Territory",
  })),
].filter(
  (item, index, array) =>
    array.findIndex(
      (candidate) =>
        candidate.name.toLowerCase() === item.name.toLowerCase() &&
        candidate.state.toLowerCase() === item.state.toLowerCase() &&
        candidate.type === item.type,
    ) === index,
);
const eventTypeOptions = [
  "Corporate",
  "Wedding",
  "Anniversary",
  "Engagement",
  "Conference",
  "Workshop",
  "Seminar",
  "Meetup",
  "College",
  "School",
  "Festival",
  "Religious",
  "Sports",
  "Cultural",
  "Exhibition",
  "Networking",
  "Product Launch",
  "Award Ceremony",
  "Charity",
  "Other",
];
const venueTypeOptions = [
  "Office",
  "Home",
  "Restaurant",
  "Cafe",
  "Hotel",
  "Banquet",
  "Conference Hall",
  "Rooftop",
  "Outdoor",
  "Resort",
  "Community Hall",
  "Stadium",
  "Exhibition Hall",
  "Other",
  "Any",
];
const foodOptions = [
  "Vegetarian",
  "Non-Vegetarian",
  "Vegan",
  "Jain",
  "Any",
];
const loadingMessages = [
  "Creating your personalized event plan...",
  "Finding suitable venues for your event...",
  "Calculating your event budget...",
  "Planning your event schedule...",
  "Finding catering and service options...",
  "Adding entertainment and event ideas...",
  "Almost there, your event is taking shape...",
  "Your event plan is being prepared...",
];
const loadingSteps = [
  { label: "Finding suitable venues", icon: Building2 },
  { label: "Calculating your event budget", icon: Wallet },
  { label: "Building your event schedule", icon: CalendarDays },
  { label: "Choosing catering & services", icon: Utensils },
  { label: "Adding event ideas & recommendations", icon: Lightbulb },
];
const styles = `
  .event-root {
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
    --event-pattern: rgba(15, 23, 42, 0.045);
    background: var(--page-bg);
    color: var(--text);
    transition: background-color 500ms ease, color 500ms ease;
  }
  .dark .event-root {
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
    --event-pattern: rgba(148, 163, 184, 0.07);
  }
  .event-page {
    position: relative;
    isolation: isolate;
    overflow-x: clip;
  }
  .event-label {
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    line-height: 1;
    color: var(--muted);
  }
  .event-title-gradient {
    background: linear-gradient(90deg, #4f46e5, #9333ea, #ec4899);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .dark .event-title-gradient {
    background: linear-gradient(90deg, #34d399, #2dd4bf, #22d3ee);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .event-badge {
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
  .dark .event-badge {
    border-color: rgba(52, 211, 153, 0.22);
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
  .ticket-notch-left {
    left: -0.6rem;
  }
  .ticket-notch-right {
    right: -0.6rem;
  }
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
  .field-focus:focus-within .event-label {
    color: var(--teal);
  }
  .event-input {
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
  .event-input::placeholder {
    color: var(--muted);
    opacity: 0.6;
  }
  .event-input[type="number"]::-webkit-outer-spin-button,
  .event-input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .event-input[type="number"] {
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
  .event-dropdown {
    border: 1px solid var(--border-hover);
    background: var(--surface-solid);
    box-shadow: 0 22px 55px rgba(15, 23, 42, 0.16);
  }
  .dark .event-dropdown {
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
  .event-root ::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }
  .location-scroll::-webkit-scrollbar-thumb,
  .custom-dropdown-scroll::-webkit-scrollbar-thumb,
  .event-root ::-webkit-scrollbar-thumb {
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
  .event-button {
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
    color: #ffffff;
    border: 1px solid transparent;
    box-shadow: 0 14px 34px rgba(79, 70, 229, 0.28);
    transition:
      transform 160ms ease,
      box-shadow 160ms ease,
      filter 160ms ease;
  }
  .dark .event-button {
    background: linear-gradient(135deg, #10b981, #0d9488);
    box-shadow: 0 14px 34px rgba(16, 185, 129, 0.22);
  }
  .event-button:hover:not(:disabled) {
    filter: brightness(1.06);
    transform: translateY(-1px);
  }
  .event-button:active:not(:disabled) {
    transform: translateY(0);
  }
  .event-button:disabled {
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
  .event-progress-track {
    position: relative;
    overflow: hidden;
  }
  .event-progress-bar {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 40%;
    border-radius: 9999px;
    background: var(--teal);
    animation: event-progress-slide 1.6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }
  @keyframes event-progress-slide {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(250%);
    }
  }
  .result-card,
  .event-loading-card {
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
    .event-input {
      font-size: 0.975rem;
    }
    .ticket-perf {
      margin: 0 2rem;
    }
    .ticket-card {
      border-radius: 1.5rem;
    }
    .ticket-route {
      border-radius: 1.5rem 1.5rem 0 0;
    }
  }
  @media (max-width: 640px) {
    .location-scroll,
    .custom-dropdown-scroll {
      max-height: 210px;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .field-focus,
    .event-button,
    .step-btn,
    .event-root {
      transition: none;
    }
    .event-progress-bar {
      animation: none;
      width: 100%;
      opacity: 0.6;
    }
  }
`;
const extractEventId = (source) => {
  if (!source || typeof source !== "object") return null;
  const candidates = [
    source.eventId,
    source._id,
    source.id,
    source.event?._id,
    source.event?.eventId,
    source.event?.id,
    source.data?._id,
    source.data?.eventId,
    source.data?.id,
  ];
  return candidates.find(Boolean) || null;
};
const fieldWrap =
  "field-focus group relative min-h-[68px] w-full rounded-2xl px-3.5 pb-2.5 pt-6 sm:min-h-[78px] sm:px-5 sm:pb-3 sm:pt-7";
const labelCls =
  "event-label pointer-events-none absolute left-3.5 top-2.5 z-10 transition-colors sm:left-5";
const iconBoxCls =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--teal)] sm:h-9 sm:w-9";
const dropdownCls =
  "event-dropdown absolute left-0 right-0 top-[calc(100%+6px)] z-[9999] overflow-hidden rounded-2xl";
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
  options,
}) => {
  const open = activeLocation === name;
  const query = value.trim().toLowerCase();
  const sourceOptions = options || locationSearchOptions;
  const locations = query
    ? sourceOptions
      .filter((item) =>
        [item.name, item.city, item.state, item.type].some((field) =>
          field.toLowerCase().includes(query),
        ),
      )
      .slice(0, 80)
    : sourceOptions.slice(0, 80);
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
            className="event-input min-w-0 flex-1 bg-transparent outline-none"
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
const GroupedAreaField = ({
  value,
  selectedState,
  groups,
  setForm,
  setFieldErrors,
  error,
}) => {
  const [open, setOpen] = useState(false);
  const query = value.trim().toLowerCase();
  const filteredGroups = groups
    .map((group) => ({
      ...group,
      items: query
        ? group.items.filter((item) =>
            item.name.toLowerCase().includes(query),
          )
        : group.items,
    }))
    .filter((group) => group.items.length > 0);
  const selectArea = (item) => {
    setForm((prev) => ({
      ...prev,
      area: item.name,
    }));
    clearFieldError(setFieldErrors, "area");
    setOpen(false);
  };
  return (
    <div
      className={`relative w-full ${open ? "z-[100]" : "z-10"}`}
      data-area-field
    >
      <div className={`${fieldWrap} ${error ? "field-error" : ""}`}>
        <label className={labelCls}>Area</label>
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <span className={iconBoxCls}>
            <MapPin size={16} />
          </span>
          <input
            type="text"
            name="area"
            value={value}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, area: e.target.value }));
              clearFieldError(setFieldErrors, "area");
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 0)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setOpen(false);
              if (e.key === "Enter" && filteredGroups.length === 1 && filteredGroups[0].items.length === 1) {
                e.preventDefault();
                selectArea(filteredGroups[0].items[0]);
              }
            }}
            autoComplete="off"
            spellCheck="false"
            placeholder={selectedState ? "Search event area" : "Select a state first"}
            className="event-input min-w-0 flex-1 bg-transparent outline-none"
          />
        </div>
        <FieldError message={error} />
        <AnimatePresence>
          {open && selectedState && (
            <motion.div {...dropdownMotion} className={dropdownCls}>
              <div className="location-scroll p-2 sm:p-2.5">
                <div className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                  Suggested locations in {selectedState}
                </div>
                {filteredGroups.length ? (
                  filteredGroups.map((group) => (
                    <div key={group.label} className="mb-2 last:mb-0">
                      <div className="px-2 pb-1.5 pt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                        {group.label}
                      </div>
                      <div className="space-y-0.5">
                        {group.items.map((item) => (
                          <button
                            key={`${group.label}-${item.name}`}
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              selectArea(item);
                            }}
                            className={`dropdown-option flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm font-medium sm:px-4 sm:py-3 ${value === item.name ? "selected" : ""}`}
                          >
                            <span className="min-w-0 flex-1 truncate">
                              {item.name}
                            </span>
                            {value === item.name && (
                              <Check size={16} className="ml-3 shrink-0 text-[var(--teal)]" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-5 text-center text-sm text-[var(--muted)]">
                    No matching suggestion found. You can enter an area manually.
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
              <span className="event-input mr-1.5 shrink-0">{prefix}</span>
            )}
            <input
              type="number"
              inputMode="numeric"
              min={minimum}
              step={step}
              name={name}
              value={value}
              onChange={handleNumberChange}
              className="event-input w-full min-w-0 bg-transparent outline-none"
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
  return (
    <div
      className={`relative w-full ${open ? "z-[100]" : "z-10"}`}
      data-select-field
    >
      <div
        className={`${fieldWrap} cursor-pointer ${error ? "field-error" : ""
          }`}
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
            <Icon size={16} />
          </span>
          <div className="min-w-0 flex-1">
            <span
              className={`event-input block truncate ${value ? "" : "!text-[var(--muted)] opacity-70"
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
                  const selected = value === option;

                  return (
                    <button
                      key={option}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleChange({
                          target: {
                            name,
                            value: option,
                          },
                        });
                        setActiveSelect(null);
                      }}
                      className={`dropdown-option ${selected ? "selected" : ""
                        } flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium sm:px-4 sm:py-3`}
                    >
                      <span className={iconBoxCls}>
                        <Icon size={15} />
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

const ToggleField = ({
  name,
  label,
  icon: Icon,
  value,
  setForm,
}) => (
  <button
    type="button"
    onClick={() =>
      setForm((prev) => ({
        ...prev,
        [name]: !prev[name],
      }))
    }
    className={`flex min-h-[64px] w-full items-center gap-3 rounded-2xl border px-3.5 py-3 text-left transition sm:min-h-[72px] sm:px-4 ${value
      ? "border-[var(--teal)] bg-[var(--accent-soft)]"
      : "border-[var(--border)] bg-[var(--input)] hover:border-[var(--border-hover)]"
      }`}
  >
    <span className={iconBoxCls}>
      <Icon size={16} />
    </span>

    <span className="min-w-0 flex-1">
      <span className="block text-sm font-semibold text-[var(--text)]">
        {label}
      </span>

      <span className="mt-0.5 block text-xs text-[var(--muted)]">
        {value ? "Included" : "Not included"}
      </span>
    </span>

    <span
      className={`flex h-6 w-11 shrink-0 items-center rounded-full p-1 transition ${value
        ? "justify-end bg-[var(--teal)]"
        : "justify-start bg-slate-300 dark:bg-slate-700"
        }`}
    >
      <span className="h-4 w-4 rounded-full bg-white shadow-sm" />
    </span>
  </button>
);

const EventLoading = ({ message, step }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="event-loading-card mx-auto w-full min-w-0 max-w-2xl rounded-[1.25rem] p-5 sm:rounded-3xl sm:p-9"
  >
    <div className="flex min-w-0 flex-col items-center text-center">
      <p className="event-label">Event Planner</p>

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

              <span className="min-w-0 flex-1 truncate">
                {item.label}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="event-progress-track mt-5 h-1.5 w-full max-w-sm rounded-full bg-[var(--accent-soft)] sm:mt-6">
        <div className="event-progress-bar" />
      </div>

      <p className="mt-4 text-[11px] leading-5 text-[var(--muted)] sm:mt-5 sm:text-xs">
        Your event details are being prepared securely.
      </p>
    </div>
  </motion.div>
);

const EventResult = ({
  result,
  onConfirm,
  onCancel,
  actionLoading,
}) => {
  if (!result) return null;

  const plan = result.eventPlan || result.aiPlan || {};
  const budgetBreakdown = plan.budgetBreakdown || {};

  const asArray = (value) =>
    Array.isArray(value) ? value : [];

  const venueRecommendations = asArray(
    plan.venueRecommendations,
  );

  const cateringRecommendations = asArray(
    plan.cateringRecommendations,
  );

  const decorationRecommendations = asArray(
    plan.decorationRecommendations,
  );

  const entertainmentRecommendations = asArray(
    plan.entertainmentRecommendations,
  );

  const photographyRecommendations = asArray(
    plan.photographyRecommendations,
  );

  const musicRecommendations = asArray(
    plan.musicRecommendations,
  );

  const activities = asArray(plan.activities);
  const foodMenu = asArray(plan.foodMenu);
  const timeline = asArray(plan.timeline);
  const services = asArray(plan.services);
  const notes = asArray(plan.notes);

  const isConfirmed =
    result.status === "Booked" || result.isBooked === true;

  const isCancelled = result.status === "Cancelled";

  const money = (value) => {
    const number = Number(value);

    return Number.isFinite(number)
      ? `₹${number.toLocaleString("en-IN")}`
      : "₹0";
  };

  const text = (item) =>
    typeof item === "string"
      ? item
      : JSON.stringify(item);

  const withProtocol = (url) =>
    /^https?:\/\//i.test(url)
      ? url
      : `https://${url}`;

  const getMapsUrl = (place) =>
    place?.googleMapsUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${place?.name || ""} ${result.location?.area || ""
        } ${result.location?.city || ""}`.trim(),
    )}`;

  const renderRecommendationCard = (item, index) => {
    const name =
      item?.name ||
      item?.title ||
      item?.venueName ||
      `Recommendation ${index + 1}`;

    const description =
      item?.description ||
      item?.reason ||
      item?.speciality ||
      item?.details;

    return (
      <div
        key={`${name}-${index}`}
        className="result-item p-4 sm:p-5"
      >
        <div className="flex items-start justify-between gap-3">
          <h4 className="min-w-0 break-words font-bold text-[var(--text)]">
            {name}
          </h4>

          {item?.rating && (
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-[var(--accent-soft)] px-2 py-1 text-xs font-semibold text-[var(--teal)]">
              <Star size={12} />
              {item.rating}
            </span>
          )}
        </div>

        {item?.price && (
          <p className="mt-2 text-sm font-semibold text-[var(--teal)]">
            {item.price}
          </p>
        )}

        {item?.estimatedCost && (
          <p className="mt-2 text-sm font-semibold text-[var(--teal)]">
            Estimated cost: {item.estimatedCost}
          </p>
        )}

        {item?.address && (
          <p className="mt-2 flex items-start gap-1.5 text-xs leading-5 text-[var(--muted)]">
            <MapPin size={13} className="mt-0.5 shrink-0" />
            <span className="break-words">
              {item.address}
            </span>
          </p>
        )}

        {description && (
          <p className="mt-3 text-[13px] leading-6 text-[var(--text-soft)] sm:text-sm">
            {text(description)}
          </p>
        )}

        {(item?.googleMapsUrl ||
          item?.websiteUrl ||
          item?.latitude ||
          item?.longitude) && (
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={getMapsUrl(item)}
                target="_blank"
                rel="noopener noreferrer"
                className="ghost-button inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
              >
                <MapPin size={13} />
                View on Maps
                <ExternalLink size={12} />
              </a>

              {item?.websiteUrl && (
                <a
                  href={withProtocol(item.websiteUrl)}
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
          )}
      </div>
    );
  };

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
            <p className="event-label">
              Your Personalized Event
            </p>

            <h2 className="mt-2.5 break-words text-2xl font-bold leading-tight tracking-tight text-[var(--text)] sm:text-4xl">
              {result.eventName || "Your Event"}
            </h2>

            <p className="mt-2 text-sm font-semibold text-[var(--teal)]">
              {result.eventType || "Event"}
            </p>

            <p className="mt-3 max-w-3xl text-[13px] leading-6 text-[var(--text-soft)] sm:text-sm sm:leading-7">
              {plan.summary ||
                "Your event plan has been prepared according to your selected requirements."}
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
          ["Budget", money(result.budget)],
          ["Venue", result.venueType || "Any"],
          ["Food", result.foodPreference || "Any"],
        ].map(([label, value]) => (
          <div
            key={label}
            className="tile min-w-0 rounded-2xl p-3.5 sm:p-4"
          >
            <p className="event-label">{label}</p>

            <p className="mt-2 truncate text-base font-bold text-[var(--text)] sm:text-lg">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-3 grid gap-2.5 sm:mt-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-3">
        <div className="tile rounded-2xl p-4 sm:p-5">
          <p className="event-label">Event Date</p>

          <p className="mt-2 text-sm font-semibold text-[var(--text)] sm:text-base">
            {result.eventDate
              ? new Date(result.eventDate).toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                },
              )
              : "Not specified"}
          </p>
        </div>

        <div className="tile rounded-2xl p-4 sm:p-5">
          <p className="event-label">Time</p>

          <p className="mt-2 text-sm font-semibold text-[var(--text)] sm:text-base">
            {result.startTime || "Not specified"}
            {result.endTime
              ? ` – ${result.endTime}`
              : ""}
          </p>
        </div>

        <div className="tile rounded-2xl p-4 sm:p-5">
          <p className="event-label">Theme</p>

          <p className="mt-2 text-sm font-semibold text-[var(--text)] sm:text-base">
            {result.theme || "Not specified"}
          </p>
        </div>

        <div className="tile rounded-2xl p-4 sm:p-5">
          <p className="event-label">Location</p>

          <p className="mt-2 truncate text-sm font-semibold text-[var(--text)] sm:text-base">
            {result.location?.area ||
              result.location?.city ||
              "Not specified"}
          </p>
        </div>
      </div>

      {result.location && (
        <div className="result-section mt-4 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <span className={iconBoxCls}>
              <MapPin size={17} />
            </span>

            <div className="min-w-0">
              <p className="event-label">
                Event Location
              </p>

              <p className="mt-2 text-sm font-semibold text-[var(--text)]">
                {[
                  result.location.area,
                  result.location.city,
                  result.location.state,
                  result.location.country,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>

              {result.location.address && (
                <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                  {result.location.address}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {result.specialRequest && (
        <div className="result-section mt-3 p-4 sm:mt-4 sm:p-5">
          <p className="event-label">
            Special Request
          </p>

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
              plan.estimatedCost ??
              result.estimatedCost ??
              result.budget,
            )}`}
          />

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6 sm:gap-3">
            {Object.entries(budgetBreakdown)
              .slice(0, 6)
              .map(([label, value]) => (
                <div
                  key={label}
                  className="soft-tile rounded-xl p-3.5 sm:p-4"
                >
                  <p className="text-xs capitalize text-[var(--muted)]">
                    {label.replace(/([A-Z])/g, " $1")}
                  </p>

                  <p className="mt-1 text-sm font-bold text-[var(--text)] sm:text-base">
                    {money(value)}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}

      {plan.budgetReality && (
        <div className="result-section mt-6 p-4 sm:mt-8 sm:p-6">
          <SectionTitle
            icon={Wallet}
            title="Budget Reality"
          />

          <p className="text-sm leading-6 text-[var(--text-soft)]">
            {typeof plan.budgetReality === "string"
              ? plan.budgetReality
              : plan.budgetReality?.message ||
              plan.budgetReality?.summary ||
              text(plan.budgetReality)}
          </p>
        </div>
      )}

      {timeline.length > 0 && (
        <div className="mt-6 sm:mt-8">
          <SectionTitle
            icon={Clock}
            title="Event Timeline"
            subtitle="A practical schedule for your event."
          />

          <div className="space-y-3 sm:space-y-4">
            {timeline.map((item, index) => (
              <div
                key={index}
                className="result-item flex items-start gap-3 p-4 sm:gap-4 sm:p-5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--teal)] text-sm font-bold text-[var(--ink)]">
                  {index + 1}
                </div>

                <div className="min-w-0 flex-1">
                  {typeof item === "object" &&
                    item?.time && (
                      <p className="text-xs font-bold uppercase tracking-wide text-[var(--teal)]">
                        {item.time}
                      </p>
                    )}

                  <p className="mt-1 text-sm leading-6 text-[var(--text-soft)]">
                    {text(
                      typeof item === "object"
                        ? item.activity ||
                        item.description ||
                        item
                        : item,
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activities.length > 0 && (
        <div className="result-section mt-6 p-4 sm:mt-8 sm:p-6">
          <SectionTitle
            icon={PartyPopper}
            title="Activities"
            subtitle="Activities and experiences suitable for your event."
          />

          <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
            {activities.map((item, index) => (
              <div
                key={index}
                className="tile flex items-start gap-2 rounded-xl px-4 py-3 text-[13px] leading-6 text-[var(--text-soft)] sm:text-sm"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--teal)]" />
                <span className="break-words">
                  {text(item)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {foodMenu.length > 0 && (
        <div className="result-section mt-6 p-4 sm:mt-8 sm:p-6">
          <SectionTitle
            icon={Utensils}
            title="Food Menu"
            subtitle="Food and menu suggestions for your event."
          />

          <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
            {foodMenu.map((item, index) => (
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

      {venueRecommendations.length > 0 && (
        <div className="result-section mt-6 p-4 sm:mt-8 sm:p-6">
          <SectionTitle
            icon={Building2}
            title="Venue Recommendations"
            subtitle="Venue options matching your event requirements."
          />

          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            {venueRecommendations.map(
              renderRecommendationCard,
            )}
          </div>
        </div>
      )}

      {cateringRecommendations.length > 0 && (
        <div className="result-section mt-6 p-4 sm:mt-8 sm:p-6">
          <SectionTitle
            icon={Utensils}
            title="Catering Recommendations"
            subtitle="Catering and food service options."
          />

          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            {cateringRecommendations.map(
              renderRecommendationCard,
            )}
          </div>
        </div>
      )}

      {decorationRecommendations.length > 0 && (
        <div className="result-section mt-6 p-4 sm:mt-8 sm:p-6">
          <SectionTitle
            icon={Sparkles}
            title="Decoration Ideas"
            subtitle="Decoration concepts suitable for your event."
          />

          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            {decorationRecommendations.map(
              renderRecommendationCard,
            )}
          </div>
        </div>
      )}

      {entertainmentRecommendations.length > 0 && (
        <div className="result-section mt-6 p-4 sm:mt-8 sm:p-6">
          <SectionTitle
            icon={PartyPopper}
            title="Entertainment"
            subtitle="Entertainment options for your guests."
          />

          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            {entertainmentRecommendations.map(
              renderRecommendationCard,
            )}
          </div>
        </div>
      )}

      {photographyRecommendations.length > 0 && (
        <div className="result-section mt-6 p-4 sm:mt-8 sm:p-6">
          <SectionTitle
            icon={Camera}
            title="Photography"
            subtitle="Photography and coverage recommendations."
          />

          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            {photographyRecommendations.map(
              renderRecommendationCard,
            )}
          </div>
        </div>
      )}

      {musicRecommendations.length > 0 && (
        <div className="result-section mt-6 p-4 sm:mt-8 sm:p-6">
          <SectionTitle
            icon={Music}
            title="Music"
            subtitle="Music and sound options for your event."
          />

          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            {musicRecommendations.map(
              renderRecommendationCard,
            )}
          </div>
        </div>
      )}

      {(services.length > 0 || notes.length > 0) && (
        <div className="mt-6 grid gap-4 sm:mt-8 sm:gap-5 lg:grid-cols-2">
          {services.length > 0 && (
            <div className="result-section p-4 sm:p-6">
              <SectionTitle
                icon={ShieldCheck}
                title="Services"
              />

              <div className="space-y-2">
                {services.map((item, index) => (
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

          {notes.length > 0 && (
            <div className="result-section p-4 sm:p-6">
              <SectionTitle
                icon={MessageSquare}
                title="Important Notes"
              />

              <div className="space-y-2">
                {notes.map((item, index) => (
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

      <div className="mt-8 border-t border-[var(--border)] pt-7 sm:mt-10 sm:pt-8">
        <div className="text-center">
          <p className="event-label">
            Event Plan Status
          </p>

          <p className="mt-2 text-[13px] leading-6 text-[var(--muted)] sm:text-sm">
            Confirm or cancel your event plan.
          </p>
        </div>

        <div className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-2">
          <button
            type="button"
            onClick={onConfirm}
            disabled={
              actionLoading ||
              isConfirmed ||
              isCancelled
            }
            className="event-button flex min-h-[52px] items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold"
          >
            {actionLoading ? (
              <Loader2
                size={17}
                className="animate-spin"
              />
            ) : (
              <Check size={17} />
            )}

            {isConfirmed
              ? "Event Confirmed"
              : "Confirm Event"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={
              actionLoading ||
              isCancelled ||
              isConfirmed
            }
            className="flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-400"
          >
            {actionLoading ? (
              <Loader2
                size={17}
                className="animate-spin"
              />
            ) : (
              <AlertCircle size={17} />
            )}

            {isCancelled
              ? "Event Cancelled"
              : "Cancel Event"}
          </button>
        </div>

        {isConfirmed && (
          <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-600 dark:text-emerald-400">
            <Check size={16} />
            Your event plan has been confirmed.
          </div>
        )}

        {isCancelled && (
          <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-red-500/10 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400">
            <AlertCircle size={16} />
            Your event plan has been cancelled.
          </div>
        )}
      </div>
    </motion.div>
  );
};

const PageShell = ({ children }) => (
  <div className="event-root min-h-screen w-full overflow-x-clip">
    <style>{styles}</style>

    <Navbar />

    <main
      className="
        event-page
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
              var(--page-pattern-color, var(--event-pattern)) 1px,
              transparent 1px
            ),
            linear-gradient(
              0deg,
              var(--page-pattern-color, var(--event-pattern)) 1px,
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

const EventPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { eventId } = useParams();

  const isViewingEvent = Boolean(eventId);

  const [form, setForm] = useState({
    eventName: "",
    eventType: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    people: "10",
    budget: "10000",
    state: "",
    area: "",
    address: "",
    venueType: "Any",
    theme: "",
    foodPreference: "Any",
    catering: false,
    decoration: false,
    photography: false,
    entertainment: false,
    music: false,
    specialRequest: "",
  });

  const [activeLocation, setActiveLocation] = useState(null);
  const [activeSelect, setActiveSelect] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [locationRegions, setLocationRegions] = useState(INDIA_REGIONS);
  const [loading, setLoading] = useState(false);
  const [loadingEvent, setLoadingEvent] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [eventResult, setEventResult] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState(
    loadingMessages[0],
  );
  const [loadingStep, setLoadingStep] = useState(0);

  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const controller = new AbortController();

    loadIndiaAdministrativeData({ signal: controller.signal })
      .then((regions) => {
        if (!controller.signal.aborted && Array.isArray(regions) && regions.length) {
          setLocationRegions(regions);
        }
      })
      .catch((error) => {
        if (error?.name !== "AbortError") {
          console.error("LOAD INDIA ADMINISTRATIVE DATA ERROR:", error);
        }
      });

    return () => controller.abort();
  }, []);


  const stateOptions = useMemo(
    () => locationRegions.map((region) => region.name),
    [locationRegions],
  );

  const selectedRegion = useMemo(
    () =>
      locationRegions.find(
        (region) =>
          region.name.toLowerCase() === form.state.trim().toLowerCase(),
      ) || null,
    [locationRegions, form.state],
  );

  const areaGroups = useMemo(() => {
    if (!selectedRegion) return [];

    const capital = selectedRegion.capital
      ? [{ name: selectedRegion.capital }]
      : [];

    const touristPlaces = (selectedRegion.touristPlaces || [])
      .map((place) => ({ name: place.name }))
      .filter((place) => place.name);

    const districts = (selectedRegion.districts || [])
      .map((district) => ({ name: district.name }))
      .filter((district) => district.name);

    const subDistricts = (selectedRegion.districts || []).flatMap((district) =>
      (district.subDistricts || []).map((subDistrict) => ({
        name: subDistrict.name,
      })),
    ).filter((subDistrict) => subDistrict.name);

    const dedupe = (items) =>
      items.filter(
        (item, index, array) =>
          array.findIndex(
            (candidate) =>
              candidate.name.toLowerCase() === item.name.toLowerCase(),
          ) === index,
      );

    return [
      { label: "Capital", items: dedupe(capital) },
      { label: "Tourist Places", items: dedupe(touristPlaces) },
      { label: "Districts", items: dedupe(districts) },
      { label: "Sub-Districts", items: dedupe(subDistricts) },
    ].filter((group) => group.items.length);
  }, [selectedRegion]);




  const activeEventId =
    eventId || extractEventId(eventResult);

  const budgetNumber = Number(form.budget);

  const budgetIsInvalid =
    form.budget !== "" &&
    (!Number.isFinite(budgetNumber) ||
      budgetNumber < 10000);

  useEffect(() => {
    if (!loading) {
      setLoadingMessage(loadingMessages[0]);
      setLoadingStep(0);
      return;
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    let tick = 0;

    const interval = setInterval(() => {
      tick += 1;

      setLoadingMessage(
        loadingMessages[
        tick % loadingMessages.length
        ],
      );

      if (tick % 2 === 0) {
        setLoadingStep((previous) =>
          Math.min(
            previous + 1,
            loadingSteps.length - 1,
          ),
        );
      }
    }, 2600);

    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    if (location.state?.eventName && !eventId) {
      setForm((prev) => ({
        ...prev,
        eventName: location.state.eventName,
      }));
    }
  }, [location.state, eventId]);

  useEffect(() => {
    const loadEvent = async () => {
      if (!eventId) {
        setEventResult(null);
        return;
      }

      try {
        setLoadingEvent(true);
        setEventResult(null);

        const response = await getEventById(eventId);
        const responseData = response?.data ?? response;

        if (!responseData) {
          throw new Error(
            "Saved event was not found",
          );
        }

        const event =
          responseData?.data ??
          responseData?.event ??
          responseData;

        if (
          !event ||
          typeof event !== "object"
        ) {
          throw new Error(
            "Saved event data was not found",
          );
        }

        setEventResult(event);

        setForm({
          eventName: event.eventName || "",
          eventType: event.eventType || "",
          eventDate: event.eventDate
            ? String(event.eventDate).slice(0, 10)
            : "",
          startTime: event.startTime || "",
          endTime: event.endTime || "",
          people: String(event.people ?? 10),
          budget: String(event.budget ?? 10000),
          state: event.location?.state || "",
          area: event.location?.area || "",
          address: event.location?.address || "",
          venueType: event.venueType || "Any",
          theme: event.theme || "",
          foodPreference:
            event.foodPreference || "Any",
          catering: Boolean(event.catering),
          decoration: Boolean(event.decoration),
          photography: Boolean(event.photography),
          entertainment: Boolean(
            event.entertainment,
          ),
          music: Boolean(event.music),
          specialRequest:
            event.specialRequest || "",
        });

        requestAnimationFrame(() => {
          setTimeout(() => {
            document
              .querySelector(".result-card")
              ?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
          }, 150);
        });
      } catch (error) {
        console.error(
          "LOAD EVENT ERROR:",
          error,
        );

        setEventResult(null);

        toast.error(
          error?.response?.data?.message ||
          error?.message ||
          "Unable to load your saved event",
        );
      } finally {
        setLoadingEvent(false);
      }
    };

    loadEvent();
  }, [eventId]);


  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest("[data-location-field]")) {
        setActiveLocation(null);
      }

      if (!event.target.closest("[data-select-field]")) {
        setActiveSelect(null);
      }

    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    };
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    clearFieldError(
      setFieldErrors,
      name,
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setActiveLocation(null);
    setActiveSelect(null);

    const requiredFields = [
      ["eventName", "Event name"],
      ["eventType", "Event type"],
      ["eventDate", "Event date"],
      ["startTime", "Start time"],
      ["people", "Number of people"],
      ["budget", "Budget"],
      ["state", "State"],
      ["area", "Area"],
      ["venueType", "Venue type"],
      ["foodPreference", "Food preference"],
    ];

    const nextErrors = {};

    requiredFields.forEach(
      ([key, label]) => {
        if (
          String(form[key] ?? "").trim() === ""
        ) {
          nextErrors[key] =
            `${label} is required`;
        }
      },
    );

    if (Object.keys(nextErrors).length) {
      setFieldErrors(nextErrors);
      return;
    }

    const budget = Number(form.budget);
    const people = Number(form.people);

    if (
      !Number.isFinite(budget) ||
      budget < 10000
    ) {
      setFieldErrors((prev) => ({
        ...prev,
        budget: "Minimum event budget is ₹10,000",
      }));

      return;
    }

    if (
      !Number.isInteger(people) ||
      people < 10
    ) {
      setFieldErrors((prev) => ({
        ...prev,
        people:
          "Minimum number of people is 10",
      }));

      return;
    }

    setFieldErrors({});

    try {
      setLoading(true);
      setEventResult(null);

      const payload = {
        eventName: form.eventName.trim(),
        eventType: form.eventType,
        eventDate: form.eventDate,
        startTime: form.startTime,
        endTime: form.endTime,
        people,
        budget,
        location: {
          country: "India",
          state: form.state.trim(),
          area: form.area.trim(),
          address: form.address.trim(),
        },
        venueType: form.venueType,
        theme: form.theme.trim(),
        foodPreference:
          form.foodPreference,
        catering: Boolean(form.catering),
        decoration: Boolean(form.decoration),
        photography: Boolean(form.photography),
        entertainment: Boolean(
          form.entertainment,
        ),
        music: Boolean(form.music),
        specialRequest:
          form.specialRequest.trim(),
      };

      const response =
        await createEvent(payload);

      const responseData = response?.data;

      if (!responseData?.status) {
        toast.error(
          responseData?.message ||
          "Unable to generate event plan",
        );
        return;
      }

      const createdEvent =
        responseData?.data ??
        responseData?.event;

      if (!createdEvent) {
        toast.error(
          responseData?.message ||
          "Event was created but no event data was returned",
        );
        return;
      }

      const createdEventId =
        extractEventId(createdEvent) ||
        extractEventId(responseData);

      if (!createdEventId) {
        console.warn(
          "CREATE EVENT: no event id in response",
          responseData,
        );

        setEventResult(
          createdEvent.event ||
          createdEvent,
        );

        return;
      }

      navigate(
        `/event/${createdEventId}`,
        {
          replace: true,
        },
      );
    } catch (error) {
      console.error(
        "CREATE EVENT ERROR:",
        error,
      );

      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error?.message;

      toast.error(
        backendMessage ||
        "Unable to create your event plan. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const extractUpdated = (body) => {
    if (
      body?.data?.data &&
      typeof body.data.data === "object"
    ) {
      return body.data.data;
    }

    if (
      body?.data &&
      typeof body.data === "object"
    ) {
      return body.data;
    }

    return null;
  };

  const handleConfirmEvent = async () => {
    if (
      !activeEventId ||
      actionLoading ||
      eventResult?.status === "Booked" ||
      eventResult?.status === "Cancelled"
    ) {
      return;
    }

    try {
      setActionLoading(true);

      const response =
        await confirmEvent(activeEventId);

      const body =
        response?.data &&
          typeof response.data === "object"
          ? response.data
          : response;

      if (body?.status === false) {
        throw new Error(
          body.message ||
          "Unable to confirm event plan",
        );
      }

      setEventResult((previous) => ({
        ...previous,
        ...(extractUpdated(body) || {}),
        status: "Booked",
        isBooked: true,
      }));

      toast.success(
        body?.message ||
        "Event plan confirmed successfully",
      );
    } catch (error) {
      console.error(
        "CONFIRM EVENT ERROR:",
        error,
      );

      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Unable to confirm event plan",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelEvent = async () => {
    if (
      !activeEventId ||
      actionLoading ||
      eventResult?.status === "Cancelled" ||
      eventResult?.status === "Booked"
    ) {
      return;
    }

    try {
      setActionLoading(true);

      const response =
        await cancelEvent(activeEventId);

      const body =
        response?.data &&
          typeof response.data === "object"
          ? response.data
          : response;

      if (body?.status === false) {
        throw new Error(
          body.message ||
          "Unable to cancel event plan",
        );
      }

      setEventResult((previous) => ({
        ...previous,
        ...(extractUpdated(body) || {}),
        status: "Cancelled",
        isBooked: false,
      }));

      toast.success(
        body?.message ||
        "Event plan cancelled successfully",
      );
    } catch (error) {
      console.error(
        "CANCEL EVENT ERROR:",
        error,
      );

      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Unable to cancel event plan",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const fadeIn = reduceMotion
    ? {}
    : {
      initial: {
        opacity: 0,
        y: 18,
      },
      animate: {
        opacity: 1,
        y: 0,
      },
      transition: {
        duration: 0.55,
        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
      },
    };

  const showResult =
    isViewingEvent ||
    Boolean(eventResult);

  if (loadingEvent) {
    return (
      <PageShell>
        <div className="mx-auto flex min-h-[50vh] w-full max-w-md flex-col items-center justify-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent-soft)]">
            <Loader2
              size={25}
              className="animate-spin text-[var(--teal)]"
            />
          </div>

          <h2 className="mt-5 text-xl font-bold text-[var(--text)] sm:text-2xl">
            Loading your event
          </h2>

          <p className="mt-2 text-sm text-[var(--muted)]">
            Fetching your saved event plan...
          </p>
        </div>
      </PageShell>
    );
  }

  if (isViewingEvent && !eventResult) {
    return (
      <PageShell>
        <div className="mx-auto flex min-h-[50vh] w-full max-w-md flex-col items-center justify-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent-soft)]">
            <CalendarDays
              size={28}
              className="text-[var(--teal)]"
            />
          </div>

          <h2 className="mt-5 text-xl font-bold text-[var(--text)] sm:text-2xl">
            Event not found
          </h2>

          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            We could not find this saved event plan.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/dashboard")
            }
            className="event-button mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold"
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
              setEventResult(null);
              navigate("/event");
            }}
            className="ghost-button mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold sm:mb-5 sm:text-sm"
          >
            <ArrowLeft size={15} />
            Plan another event
          </button>

          <EventResult
            result={eventResult}
            onConfirm={handleConfirmEvent}
            onCancel={handleCancelEvent}
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
                Create Your Perfect Event
              </h1>
              
              <p className="mx-auto mt-3 max-w-xl px-2 text-[13px] leading-6 text-slate-600 dark:text-slate-300 sm:mt-4 sm:text-base sm:leading-7">
                Choose your event details, location,
                budget and services to create a
                personalized event plan.
              </p>
            </motion.div>
          )}

          {loading ? (
            <EventLoading
              message={loadingMessage}
              step={loadingStep}
            />
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
                    <p className="event-label">
                      Event
                    </p>

                    <p className="ticket-route-value mt-1.5 truncate text-sm sm:text-lg">
                      {form.eventName ||
                        "Your Event"}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-[var(--teal)] sm:gap-2">
                    <span className="hidden h-px w-6 border-t border-dashed border-current opacity-50 sm:block sm:w-10" />

                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent-soft)] sm:h-10 sm:w-10">
                      <CalendarDays
                        size={16}
                        className="sm:h-[18px] sm:w-[18px]"
                      />
                    </span>

                    <span className="hidden h-px w-6 border-t border-dashed border-current opacity-50 sm:block sm:w-10" />
                  </div>

                  <div className="min-w-0 text-right">
                    <p className="event-label">
                      Type
                    </p>

                    <p className="ticket-route-value mt-1.5 truncate text-sm sm:text-lg">
                      {form.eventType ||
                        "Event Type"}
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
                  <div className="relative z-10 w-full">
                    <div
                      className={`${fieldWrap} ${fieldErrors.eventName
                        ? "field-error"
                        : ""
                        }`}
                    >
                      <label
                        className={labelCls}
                      >
                        Event Name
                      </label>

                      <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                        <span
                          className={
                            iconBoxCls
                          }
                        >
                          <Sparkles size={16} />
                        </span>

                        <input
                          type="text"
                          name="eventName"
                          value={form.eventName}
                          onChange={handleChange}
                          placeholder="Enter event name"
                          className="event-input min-w-0 flex-1 bg-transparent outline-none"
                        />
                      </div>

                      <FieldError
                        message={
                          fieldErrors.eventName
                        }
                      />
                    </div>
                  </div>

                  <SelectField
                    name="eventType"
                    label="Event Type"
                    icon={PartyPopper}
                    options={eventTypeOptions}
                    value={form.eventType}
                    handleChange={
                      handleChange
                    }
                    activeSelect={
                      activeSelect
                    }
                    setActiveSelect={
                      setActiveSelect
                    }
                    error={
                      fieldErrors.eventType
                    }
                  />

                  <div className="relative z-10 w-full">
                    <div
                      className={`${fieldWrap} ${fieldErrors.eventDate
                        ? "field-error"
                        : ""
                        }`}
                    >
                      <label
                        className={labelCls}
                      >
                        Event Date
                      </label>

                      <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                        <span
                          className={
                            iconBoxCls
                          }
                        >
                          <CalendarDays
                            size={16}
                          />
                        </span>

                        <input
                          type="date"
                          name="eventDate"
                          value={form.eventDate}
                          onChange={handleChange}
                          className="event-input min-w-0 flex-1 bg-transparent outline-none"
                        />
                      </div>

                      <FieldError
                        message={
                          fieldErrors.eventDate
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative z-10 w-full">
                      <div
                        className={`${fieldWrap} ${fieldErrors.startTime
                          ? "field-error"
                          : ""
                          }`}
                      >
                        <label
                          className={labelCls}
                        >
                          Start Time
                        </label>

                        <div className="flex min-w-0 items-center gap-2">
                          <span
                            className={
                              iconBoxCls
                            }
                          >
                            <Clock size={16} />
                          </span>

                          <input
                            type="time"
                            name="startTime"
                            value={
                              form.startTime
                            }
                            onChange={
                              handleChange
                            }
                            className="event-input min-w-0 flex-1 bg-transparent outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="relative z-10 w-full">
                      <div className={fieldWrap}>
                        <label
                          className={labelCls}
                        >
                          End Time
                        </label>

                        <div className="flex min-w-0 items-center gap-2">
                          <span
                            className={
                              iconBoxCls
                            }
                          >
                            <Clock size={16} />
                          </span>

                          <input
                            type="time"
                            name="endTime"
                            value={form.endTime}
                            onChange={
                              handleChange
                            }
                            className="event-input min-w-0 flex-1 bg-transparent outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <NumberField
                    name="people"
                    label="Number of People"
                    icon={Users}
                    step={1}
                    minimum={10}
                    value={form.people}
                    setForm={setForm}
                    setFieldErrors={
                      setFieldErrors
                    }
                    error={
                      fieldErrors.people
                    }
                  />

                  <NumberField
                    name="budget"
                    label="Budget"
                    icon={Wallet}
                    step={1000}
                    minimum={10000}
                    prefix="₹"
                    value={form.budget}
                    setForm={setForm}
                    setFieldErrors={
                      setFieldErrors
                    }
                    error={
                      fieldErrors.budget ||
                      (budgetIsInvalid
                        ? "Minimum budget is ₹10,000"
                        : undefined)
                    }
                  />

                  <LocationField
                    name="state"
                    label="State"
                    icon={Navigation}
                    value={form.state}
                    activeLocation={
                      activeLocation
                    }
                    setActiveLocation={
                      setActiveLocation
                    }
                    setForm={setForm}
                    setFieldErrors={
                      setFieldErrors
                    }
                    error={
                      fieldErrors.state
                    }
                    options={stateOptions.map((stateName) => ({
                      name: stateName,
                      city:
                        locationRegions.find(
                          (region) => region.name === stateName,
                        )?.capital || "India",
                      state: stateName,
                      type:
                        locationRegions.find(
                          (region) => region.name === stateName,
                        )?.type === "state"
                          ? "State"
                          : "Union Territory",
                    }))}
                  />

                  <GroupedAreaField
                    value={form.area}
                    selectedState={form.state}
                    groups={areaGroups}
                    setForm={setForm}
                    setFieldErrors={setFieldErrors}
                    error={fieldErrors.area}
                  />

                  <div className="relative z-10 w-full">
                    <div className={fieldWrap}>
                      <label
                        className={labelCls}
                      >
                        Address
                      </label>

                      <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                        <span
                          className={
                            iconBoxCls
                          }
                        >
                          <Map size={16} />
                        </span>

                        <input
                          type="text"
                          name="address"
                          value={form.address}
                          onChange={
                            handleChange
                          }
                          placeholder="Optional full address"
                          className="event-input min-w-0 flex-1 bg-transparent outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <SelectField
                    name="venueType"
                    label="Venue Type"
                    icon={Building2}
                    options={venueTypeOptions}
                    value={form.venueType}
                    handleChange={
                      handleChange
                    }
                    activeSelect={
                      activeSelect
                    }
                    setActiveSelect={
                      setActiveSelect
                    }
                    error={
                      fieldErrors.venueType
                    }
                  />

                  <SelectField
                    name="foodPreference"
                    label="Food Preference"
                    icon={Utensils}
                    options={foodOptions}
                    value={
                      form.foodPreference
                    }
                    handleChange={
                      handleChange
                    }
                    activeSelect={
                      activeSelect
                    }
                    setActiveSelect={
                      setActiveSelect
                    }
                    error={
                      fieldErrors.foodPreference
                    }
                  />

                  <div className="relative z-10 w-full">
                    <div className={fieldWrap}>
                      <label
                        className={labelCls}
                      >
                        Event Theme
                      </label>

                      <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                        <span
                          className={
                            iconBoxCls
                          }
                        >
                          <Sparkles size={16} />
                        </span>

                        <input
                          type="text"
                          name="theme"
                          value={form.theme}
                          onChange={
                            handleChange
                          }
                          placeholder="Elegant, modern, traditional..."
                          className="event-input min-w-0 flex-1 bg-transparent outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <div className="mb-3">
                      <p className="event-label">
                        Event Services
                      </p>

                      <p className="mt-1 text-xs text-[var(--muted)]">
                        Select the services you want included.
                      </p>
                    </div>

                    <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                      <ToggleField
                        name="catering"
                        label="Catering"
                        icon={Utensils}
                        value={form.catering}
                        setForm={setForm}
                      />

                      <ToggleField
                        name="decoration"
                        label="Decoration"
                        icon={Sparkles}
                        value={form.decoration}
                        setForm={setForm}
                      />

                      <ToggleField
                        name="photography"
                        label="Photography"
                        icon={Camera}
                        value={
                          form.photography
                        }
                        setForm={setForm}
                      />

                      <ToggleField
                        name="entertainment"
                        label="Entertainment"
                        icon={PartyPopper}
                        value={
                          form.entertainment
                        }
                        setForm={setForm}
                      />

                      <ToggleField
                        name="music"
                        label="Music"
                        icon={Music}
                        value={form.music}
                        setForm={setForm}
                      />
                    </div>
                  </div>

                  <div className="relative z-10 md:col-span-2">
                    <div className={fieldWrap}>
                      <label
                        className={labelCls}
                      >
                        Special Request (Optional)
                      </label>

                      <div className="flex min-w-0 items-start gap-2.5 sm:gap-3">
                        <span
                          className={`${iconBoxCls} mt-0.5`}
                        >
                          <MessageSquare
                            size={16}
                          />
                        </span>

                        <textarea
                          name="specialRequest"
                          rows={3}
                          value={
                            form.specialRequest
                          }
                          onChange={
                            handleChange
                          }
                          placeholder="Guest requirements, accessibility, special arrangements..."
                          className="event-input min-w-0 flex-1 resize-none bg-transparent outline-none"
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
                  className="event-button group flex min-h-[52px] w-full items-center justify-center gap-3 rounded-xl px-5 text-sm font-bold sm:min-h-14 sm:text-base"
                >
                  Create Event Plan
                </button>

                <p className="mt-3 text-center text-[11px] text-[var(--muted)] sm:text-xs">
                  Minimum 10 people • Minimum budget ₹10,000 • Your plan is saved automatically
                </p>
              </div>
            </motion.form>
          )}
        </>
      )}
    </PageShell>
  );
};

export default EventPage;
