import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Cake,
  Wallet,
  Users,
  PartyPopper,
  Building2,
  Utensils,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Minus,
  Plus,
  User,
  Sparkles,
  ListChecks,
  Star,
  ChevronDown,
  Check,
  Clock,
  MapPin,
  AlertCircle,
  Search,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import toast from "react-hot-toast";

import Navbar from "../Layout/Navbar";
import {
  createBirthday,
  getBirthdayById,
  confirmBirthday,
  cancelBirthday,
} from "../../Services/AuthAPI";
import {
  INDIA_REGIONS,
  loadIndiaAdministrativeData,
} from "../../Data/TouristPlaces";

const stateOptions = INDIA_REGIONS.map((region) => region.name);

const eventTypeOptions = [
  "Kids Party",
  "Teen Party",
  "Adult Gathering",
  "Milestone Birthday",
  "Surprise Party",
];

const venueTypeOptions = [
  "Cafe",
  "Home",
  "Hotel",
  "Restaurant",
  "Rooftop",
  "Banquet",
  "Community Hall",
  "Resort",
  "Outdoor",
  "Any",
];

const foodPreferenceOptions = [
  "Vegetarian",
  "Non-Vegetarian",
  "Vegan",
  "Jain",
  "Any",
];

const prankOptions = ["Yes", "No"];

const cakeFlavourOptions = [
  "Vanilla",
  "Chocolate",
  "Black Forest",
  "White Forest",
  "Red Velvet",
  "Butterscotch",
  "Strawberry",
  "Pineapple",
  "Mango",
  "Blueberry",
  "Raspberry",
  "Coffee",
  "Caramel",
  "KitKat",
  "Oreo",
  "Ferrero Rocher",
  "Choco Truffle",
  "Belgian Chocolate",
  "Fruit Cake",
  "Black Currant",
  "Almond",
  "Pistachio",
  "Rasmalai",
  "Gulab Jamun",
  "Kesar Pista",
  "Kulfi",
  "Lotus Biscoff",
];

const cakeWeightOptions = [
  { value: "0.5", label: "0.5 kg" },
  { value: "1", label: "1 kg" },
  { value: "1.5", label: "1.5 kg" },
  { value: "2", label: "2 kg" },
  { value: "2.5", label: "2.5 kg" },
  { value: "3", label: "3 kg" },
  { value: "4", label: "4 kg" },
  { value: "5", label: "5 kg" },
];

const loadingMessages = [
  "Creating your personalized birthday plan...",
  "Working out your party budget...",
  "Planning the perfect birthday schedule...",
  "Finding suitable nearby venues...",
  "Adding cake, food and decoration ideas...",
  "Adding fun games and activities...",
  "Almost there, your birthday plan is coming together...",
];

const loadingSteps = [
  { label: "Choosing themes & venues", icon: Sparkles },
  { label: "Calculating your budget", icon: Wallet },
  { label: "Picking cake & decorations", icon: Cake },
  { label: "Adding games & surprises", icon: PartyPopper },
  { label: "Building the event timeline", icon: Clock },
];

const styles = `
  .bday-root {
    --page-bg: #fdf2f5;

    --text: #2a1220;
    --text-soft: #5b3542;
    --muted: #9c7684;

    --rose: #d6537a;
    --rose-2: #e3a85f;
    --gold: #e3a85f;
    --gold-light: #eab8c4;
    --ink: #ffffff;

    --accent-soft: rgba(214, 83, 122, 0.09);
    --accent-ring: rgba(214, 83, 122, 0.18);

    --surface: rgba(255, 255, 255, 0.9);
    --surface-solid: #ffffff;
    --tile: rgba(253, 242, 245, 0.85);
    --input: #ffffff;

    --border: rgba(42, 18, 32, 0.09);
    --border-hover: rgba(42, 18, 32, 0.18);

    --scrollbar-track: rgba(42, 18, 32, 0.045);
    --scrollbar-thumb: rgba(42, 18, 32, 0.22);
    --scrollbar-thumb-hover: rgba(42, 18, 32, 0.34);

    --shadow: 0 24px 70px rgba(42, 18, 32, 0.08);
    --bday-pattern: rgba(42, 18, 32, 0.045);

    background: var(--page-bg);
    color: var(--text);
    transition: background-color 500ms ease, color 500ms ease;
  }

  .dark .bday-root {
    --page-bg: #1b0f16;

    --text: #fbeef1;
    --text-soft: #dcb7c2;
    --muted: #a9838f;

    --rose: #f472a0;
    --rose-2: #f3c26e;
    --gold: #f3c26e;
    --gold-light: #f9d9e2;
    --ink: #260f18;

    --accent-soft: rgba(244, 114, 160, 0.12);
    --accent-ring: rgba(244, 114, 160, 0.2);

    --surface: rgba(38, 15, 24, 0.78);
    --surface-solid: #2a1420;
    --tile: rgba(58, 24, 37, 0.55);
    --input: rgba(38, 15, 24, 0.7);

    --border: rgba(249, 217, 226, 0.16);
    --border-hover: rgba(249, 217, 226, 0.32);

    --scrollbar-track: rgba(0, 0, 0, 0.16);
    --scrollbar-thumb: rgba(249, 217, 226, 0.26);
    --scrollbar-thumb-hover: rgba(249, 217, 226, 0.42);

    --shadow: 0 24px 70px rgba(0, 0, 0, 0.42);
    --bday-pattern: rgba(249, 217, 226, 0.07);
  }

  .bday-page {
    position: relative;
    isolation: isolate;
    overflow-x: clip;
  }

  .bday-label {
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    line-height: 1;
    color: var(--muted);
  }

  .bday-title-gradient {
    background: linear-gradient(90deg, #d6537a, #e3a85f, #d6537a);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .dark .bday-title-gradient {
    background: linear-gradient(90deg, #f472a0, #f3c26e, #f472a0);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .invite-card {
    position: relative;
    width: 100%;
    border: 1px solid var(--border);
    border-radius: 1.25rem;
    background: var(--surface);
    box-shadow: var(--shadow);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
  }

  .invite-route {
    border-bottom: 1px solid var(--border);
    border-radius: 1.25rem 1.25rem 0 0;
    background: linear-gradient(135deg, var(--accent-soft), transparent 70%);
  }

  .invite-route-value {
    min-width: 0;
    color: var(--text);
    font-weight: 700;
    line-height: 1.3;
  }

  .invite-perf {
    position: relative;
    height: 1px;
    margin: 0 1.75rem;
    border-top: 1px dashed var(--border-hover);
  }

  .invite-notch {
    position: absolute;
    top: 50%;
    width: 1.2rem;
    height: 1.2rem;
    border: 1px solid var(--border);
    border-radius: 9999px;
    background: var(--page-bg);
    transform: translateY(-50%);
  }

  .invite-notch-left { left: -0.6rem; }
  .invite-notch-right { right: -0.6rem; }

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
    border-color: var(--rose);
    box-shadow: 0 0 0 3px var(--accent-ring);
  }

  .field-error,
  .field-error:hover,
  .field-error:focus-within {
    border-color: rgba(239, 68, 68, 0.75);
  }

  .field-focus:focus-within .bday-label {
    color: var(--rose);
  }

  .bday-input {
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

  .bday-input::placeholder {
    color: var(--muted);
    opacity: 0.6;
  }

  .bday-input[type="number"]::-webkit-outer-spin-button,
  .bday-input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .bday-input[type="number"] {
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
    border-color: var(--rose);
    color: var(--rose);
  }

  .step-btn:active {
    transform: scale(0.92);
  }

  .bday-dropdown {
    border: 1px solid var(--border-hover);
    background: var(--surface-solid);
    box-shadow: 0 22px 55px rgba(42, 18, 32, 0.16);
  }

  .dark .bday-dropdown {
    box-shadow: 0 22px 55px rgba(0, 0, 0, 0.5);
  }

  .custom-dropdown-scroll {
    max-height: 240px;
    overflow-y: auto;
    overscroll-behavior: contain;
  }

  .custom-dropdown-scroll,
  .bday-root {
    scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
    scrollbar-width: auto;
  }

  .custom-dropdown-scroll::-webkit-scrollbar,
  .bday-root ::-webkit-scrollbar {
    width: 20px;
    height: 20px;
  }

  .custom-dropdown-scroll::-webkit-scrollbar-track,
  .bday-root ::-webkit-scrollbar-track {
    background: var(--scrollbar-track);
    border-radius: 9999px;
  }

  .custom-dropdown-scroll::-webkit-scrollbar-thumb,
  .bday-root ::-webkit-scrollbar-thumb {
    min-height: 44px;
    border: 9px solid transparent;
    border-radius: 9999px;
    background-clip: padding-box;
    background: var(--scrollbar-thumb);
  }

  .custom-dropdown-scroll::-webkit-scrollbar-thumb:hover,
  .bday-root ::-webkit-scrollbar-thumb:hover {
    background: var(--scrollbar-thumb-hover);
  }

  .custom-dropdown-scroll::-webkit-scrollbar-corner,
  .bday-root ::-webkit-scrollbar-corner {
    background: transparent;
  }

  .dropdown-option {
    color: var(--text);
    transition: background-color 140ms ease;
  }

  .dropdown-option:hover,
  .dropdown-option.selected {
    background: var(--accent-soft);
  }

  .area-suggestion-panel {
    border: 1px solid var(--border-hover);
    background: var(--surface-solid);
    color: var(--text);
    box-shadow: 0 22px 55px rgba(42, 18, 32, 0.16);
  }

  .dark .area-suggestion-panel {
    background: #21171d;
    box-shadow: 0 22px 55px rgba(0, 0, 0, 0.5);
  }

  .area-suggestion-group + .area-suggestion-group {
    margin-top: 0.7rem;
    padding-top: 0.7rem;
    border-top: 1px solid var(--border);
  }

  .area-suggestion-heading {
    margin: 0 0 0.35rem;
    padding: 0 0.65rem;
    color: var(--muted);
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.13em;
    line-height: 1.2;
    text-transform: uppercase;
  }

  .area-suggestion-option {
    display: flex;
    width: 100%;
    min-height: 42px;
    align-items: center;
    border: 1px solid transparent;
    border-radius: 0.75rem;
    background: transparent;
    padding: 0.65rem;
    text-align: left;
    color: var(--text);
    font-family: inherit;
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.35;
    transition: background-color 140ms ease, border-color 140ms ease, color 140ms ease;
  }

  .area-suggestion-option:hover,
  .area-suggestion-option:focus-visible {
    border-color: var(--accent-ring);
    background: var(--accent-soft);
    color: var(--rose);
    outline: none;
  }

  .bday-button {
    background: linear-gradient(135deg, #d6537a, #e3a85f);
    color: #ffffff;
    border: 1px solid transparent;
    box-shadow: 0 14px 34px rgba(214, 83, 122, 0.28);
    transition:
      transform 160ms ease,
      box-shadow 160ms ease,
      filter 160ms ease;
  }

  .dark .bday-button {
    background: linear-gradient(135deg, #f472a0, #f3c26e);
    box-shadow: 0 14px 34px rgba(244, 114, 160, 0.22);
  }

  .bday-button:hover:not(:disabled) {
    filter: brightness(1.06);
    transform: translateY(-1px);
  }

  .bday-button:active:not(:disabled) {
    transform: translateY(0);
  }

  .bday-button:disabled {
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
    border-color: var(--rose);
    color: var(--rose);
  }

  .bday-progress-track {
    position: relative;
    overflow: hidden;
  }

  .bday-progress-bar {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 40%;
    border-radius: 9999px;
    background: var(--rose);
    animation: bday-progress-slide 1.6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }

  @keyframes bday-progress-slide {
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
    .bday-input { font-size: 0.975rem; }
    .invite-perf { margin: 0 2rem; }
    .invite-card { border-radius: 1.5rem; }
    .invite-route { border-radius: 1.5rem 1.5rem 0 0; }
  }

  @media (max-width: 640px) {
    .custom-dropdown-scroll { max-height: 210px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .field-focus,
    .bday-button,
    .step-btn,
    .bday-root { transition: none; }

    .bday-progress-bar { animation: none; width: 100%; opacity: 0.6; }
  }
`;

const extractBirthdayId = (source) => {
  if (!source || typeof source !== "object") return null;

  const candidates = [
    source.birthdayId,
    source._id,
    source.id,
    source.data?._id,
    source.data?.birthdayId,
    source.data?.id,
  ];

  return candidates.find(Boolean) || null;
};

const fieldWrap =
  "field-focus group relative min-h-[68px] w-full rounded-2xl px-3.5 pb-2.5 pt-6 sm:min-h-[78px] sm:px-5 sm:pb-3 sm:pt-7";

const labelCls =
  "bday-label pointer-events-none absolute left-3.5 top-2.5 z-10 transition-colors sm:left-5";

const iconBoxCls =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--rose)] sm:h-9 sm:w-9";

const dropdownCls =
  "bday-dropdown absolute left-0 right-0 top-[calc(100%+6px)] z-[9999] overflow-hidden rounded-2xl";

const dropdownMotion = {
  initial: { opacity: 0, y: -6, scale: 0.985 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -5, scale: 0.985 },
  transition: { duration: 0.16, ease: "easeOut" },
};

const FieldError = ({ message }) =>
  message ? (
    <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-500">
      <AlertCircle size={14} className="shrink-0" />
      <span>{message}</span>
    </div>
  ) : null;

const TextField = ({
  name,
  label,
  icon: Icon,
  value,
  setForm,
  placeholder,
  disabled = false,
  suggestionGroups = [],
  error,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const normalizedValue = String(value || "").trim().toLowerCase();

  const filteredSuggestionGroups = suggestionGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        item.toLowerCase().includes(normalizedValue),
      ),
    }))
    .filter((group) => group.items.length > 0);

  const hasSuggestions = filteredSuggestionGroups.length > 0;

  const handleSuggestionSelect = (suggestion) => {
    setForm((prev) => ({ ...prev, [name]: suggestion }));
    setShowSuggestions(false);
  };

  return (
    <div className={`relative z-10 w-full ${showSuggestions ? "z-[100]" : ""}`}>
      <div className={`${fieldWrap} ${disabled ? "opacity-60" : ""}`}>
        <label className={labelCls}>{label}</label>

        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <span className={iconBoxCls}>
            <Icon size={16} />
          </span>

          <input
            disabled={disabled}
            type="text"
            name={name}
            value={value}
            onFocus={() => {
              if (!disabled && suggestionGroups.length > 0) {
                setShowSuggestions(true);
              }
            }}
            onBlur={() => {
              window.setTimeout(() => setShowSuggestions(false), 120);
            }}
            onChange={(e) => {
              let nextValue = e.target.value;

              if (name === "name") {
                nextValue = nextValue.replace(/[^a-zA-Z\s]/g, "");

                if (nextValue.length > 0) {
                  nextValue =
                    nextValue.charAt(0).toUpperCase() + nextValue.slice(1);
                }
              }

              setForm((prev) => ({ ...prev, [name]: nextValue }));

              if (!disabled && suggestionGroups.length > 0) {
                setShowSuggestions(true);
              }
            }}
            autoComplete="off"
            placeholder={
              disabled
                ? "Select a state first"
                : placeholder || `Enter ${label.toLowerCase()}`
            }
            className="bday-input min-w-0 flex-1 bg-transparent outline-none"
          />
        </div>
        <FieldError message={error} />
      </div>

      <AnimatePresence>
        {showSuggestions && suggestionGroups.length > 0 && (
          <motion.div
            {...dropdownMotion}
            className={`${dropdownCls} area-suggestion-panel`}
          >
            <div className="custom-dropdown-scroll max-h-[240px] p-2 sm:p-2.5">
              {hasSuggestions ? (
                filteredSuggestionGroups.map((group) => (
                  <div key={group.label} className="area-suggestion-group">
                    <p className="area-suggestion-heading">{group.label}</p>

                    <div className="space-y-0.5">
                      {group.items.map((suggestion) => (
                        <button
                          key={`${group.label}-${suggestion}`}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleSuggestionSelect(suggestion);
                          }}
                          className="area-suggestion-option"
                        >
                          <span>{suggestion}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-3 py-5 text-center text-sm text-[var(--muted)]">
                  No matching area found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
              <span className="bday-input mr-1.5 shrink-0">{prefix}</span>
            )}

            <input
              type="number"
              inputMode="numeric"
              min={minimum}
              step={step}
              name={name}
              value={value}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, [name]: e.target.value }))
              }
              className="bday-input w-full min-w-0 bg-transparent outline-none"
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

const StateField = ({
  value,
  onChange,
  activeSelect,
  setActiveSelect,
  options = stateOptions,
  error,
}) => {
  const isOpen = activeSelect === "state";
  const deletingRef = useRef(false);

  const searchValue = String(value || "").trim();

  const filteredStates = options.filter((state) =>
    state.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const handleStateInput = (inputValue) => {
    const rawValue = inputValue;
    const trimmedValue = rawValue.trim();
    const isDeleting = deletingRef.current;

    deletingRef.current = false;

    if (!trimmedValue) {
      onChange("");
      setActiveSelect("state");
      return;
    }

    const exactState = options.find(
      (state) => state.toLowerCase() === trimmedValue.toLowerCase(),
    );

    if (exactState) {
      onChange(exactState);
      setActiveSelect(null);
      return;
    }

    const prefixMatches = options.filter((state) =>
      state.toLowerCase().startsWith(trimmedValue.toLowerCase()),
    );

    if (!isDeleting && trimmedValue.length >= 2 && prefixMatches.length === 1) {
      onChange(prefixMatches[0]);
      setActiveSelect(null);
      return;
    }

    onChange(rawValue);
    setActiveSelect("state");
  };

  const handleStateSelect = (state) => {
    onChange(state);
    setActiveSelect(null);
    deletingRef.current = false;
  };

  return (
    <div
      className={`relative w-full ${isOpen ? "z-[100]" : "z-10"}`}
      data-select-field
    >
      <div className={fieldWrap}>
        <label className={labelCls}>State</label>

        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <span className={iconBoxCls}>
            <MapPin size={16} />
          </span>

          <input
            type="text"
            value={value}
            autoComplete="off"
            placeholder="Type or select your state"
            onFocus={() => setActiveSelect("state")}
            onKeyDown={(e) => {
              deletingRef.current =
                e.key === "Backspace" || e.key === "Delete";
            }}
            onChange={(e) => handleStateInput(e.target.value)}
            className="bday-input min-w-0 flex-1 bg-transparent outline-none"
          />

          <Search size={17} className="shrink-0 text-[var(--muted)]" />
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div {...dropdownMotion} className={dropdownCls}>
              <div className="custom-dropdown-scroll p-1.5 sm:p-2">
                {filteredStates.length > 0 ? (
                  filteredStates.map((state) => {
                    const isSelected =
                      String(value).toLowerCase() === state.toLowerCase();

                    return (
                      <button
                        key={state}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleStateSelect(state);
                        }}
                        className={`dropdown-option ${
                          isSelected ? "selected" : ""
                        } flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm sm:px-4 sm:py-3`}
                      >
                        <span className={iconBoxCls}>
                          <MapPin size={15} />
                        </span>

                        <span className="flex-1">{state}</span>

                        {isSelected && (
                          <Check size={16} className="text-[var(--rose)]" />
                        )}
                      </button>
                    );
                  })
                ) : (
                  <div className="px-4 py-5 text-center text-sm text-[var(--muted)]">
                    No matching state found
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
  const isOpen = activeSelect === name;

  const selected = options.find((option) => {
    const optionValue = typeof option === "object" ? option.value : option;
    return String(optionValue) === String(value);
  });

  const selectedLabel = selected
    ? typeof selected === "object"
      ? selected.label
      : selected
    : "";

  return (
    <div
      className={`relative w-full ${isOpen ? "z-[100]" : "z-10"}`}
      data-select-field
    >
      <div
        className={`${fieldWrap} cursor-pointer`}
        onClick={() => setActiveSelect(isOpen ? null : name)}
        tabIndex={0}
        role="button"
        aria-expanded={isOpen}
        onKeyDown={(e) => {
          if (e.key === "Escape") setActiveSelect(null);

          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setActiveSelect(isOpen ? null : name);
          }
        }}
      >
        <label className={labelCls}>{label}</label>

        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <span className={iconBoxCls}>
            <Icon size={16} />
          </span>

          <span
            className={`bday-input min-w-0 flex-1 truncate ${
              selectedLabel ? "" : "!text-[var(--muted)] opacity-70"
            }`}
          >
            {selectedLabel || `Select ${label}`}
          </span>

          <ChevronDown
            size={17}
            className={`shrink-0 text-[var(--muted)] transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              {...dropdownMotion}
              className={dropdownCls}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="custom-dropdown-scroll p-1.5 sm:p-2">
                {options.map((option, index) => {
                  const optionValue =
                    typeof option === "object" ? option.value : option;

                  const optionLabel =
                    typeof option === "object" ? option.label : option;

                  const isSelected = String(value) === String(optionValue);

                  return (
                    <button
                      key={`${name}-${index}`}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();

                        handleChange({
                          target: { name, value: optionValue },
                        });

                        setActiveSelect(null);
                      }}
                      className={`dropdown-option ${
                        isSelected ? "selected" : ""
                      } flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium sm:px-4 sm:py-3`}
                    >
                      <span className={iconBoxCls}>
                        <Icon size={15} />
                      </span>

                      <span className="flex-1 truncate">{optionLabel}</span>

                      {isSelected && (
                        <Check size={16} className="text-[var(--rose)]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <FieldError message={error} />
      </div>
    </div>
  );
};

const SectionTitle = ({ icon: Icon, title, subtitle }) => (
  <div className="mb-4 flex items-start gap-3 sm:mb-5">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--rose)] sm:h-10 sm:w-10">
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

const BirthdayLoading = ({ message, step }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="ai-loading-card mx-auto w-full min-w-0 max-w-2xl rounded-[1.25rem] p-5 sm:rounded-3xl sm:p-9"
  >
    <div className="flex min-w-0 flex-col items-center text-center">
      <p className="bday-label">Birthday Planner</p>

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
              className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-[13px] font-medium transition-all duration-500 sm:px-4 sm:py-3 sm:text-sm ${
                active
                  ? "border-[var(--rose)] bg-[var(--accent-soft)] text-[var(--text)]"
                  : done
                    ? "border-transparent text-[var(--text-soft)]"
                    : "border-transparent text-[var(--muted)] opacity-60"
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg sm:h-8 sm:w-8 ${
                  done
                    ? "bg-[var(--rose)] text-[var(--ink)]"
                    : "bg-[var(--accent-soft)] text-[var(--rose)]"
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

      <div className="bday-progress-track mt-5 h-1.5 w-full max-w-sm rounded-full bg-[var(--accent-soft)] sm:mt-6">
        <div className="bday-progress-bar" />
      </div>

      <p className="mt-4 text-[11px] leading-5 text-[var(--muted)] sm:mt-5 sm:text-xs">
        Your data is safe. Please don't refresh or close this page.
      </p>
    </div>
  </motion.div>
);

const BirthdayResult = ({ result, onConfirm, onCancel, actionLoading }) => {
  if (!result) return null;

  const plan = result.aiPlan || result.birthdayPlan || {};
  const budgetBreakdown = plan.budgetBreakdown || {};
  const budgetReality = plan.budgetReality || {};

  const asArray = (value) => (Array.isArray(value) ? value : []);

  const themeSuggestions = asArray(plan.themeSuggestions);
  const recommendedVenues = asArray(plan.recommendedVenues);
  const cakeIdeas = asArray(plan.cakeIdeas);
  const decorationIdeas = asArray(plan.decorationIdeas);
  const gamesAndActivities = asArray(plan.gamesAndActivities);
  const prankIdeas = asArray(plan.prankIdeas);
  const eventTimeline = asArray(plan.eventTimeline);
  const foodMenuSuggestions = asArray(plan.foodMenuSuggestions);
  const checklist = asArray(plan.checklist);

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

  const getMapsUrl = (venue) =>
    venue.googleMapsUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${venue.name || ""} ${venue.address || result.Area || ""}`.trim(),
    )}`;

  const budgetInsufficient =
    budgetReality.status === "Budget may be insufficient";

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
            <p className="bday-label">Your Personalized Birthday Plan</p>

            <h2 className="mt-2.5 break-words text-2xl font-bold leading-tight tracking-tight text-[var(--text)] sm:text-4xl">
              {result.Name || "Birthday"}{" "}
              <span className="text-[var(--rose)]">🎉</span>
            </h2>

            <p className="mt-3 max-w-3xl text-[13px] leading-6 text-[var(--text-soft)] sm:text-sm sm:leading-7">
              {plan.summary ||
                "Your personalized birthday celebration plan is ready."}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 rounded-full bg-[var(--accent-soft)] px-3.5 py-2 text-xs font-semibold text-[var(--rose)] sm:px-4 sm:text-sm">
            <PartyPopper size={16} />
            {result.status || "Plan Ready"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
        {[
          ["Age", result.Age],
          ["People", result.people],
          ["Budget", money(result.budget)],
          ["Event", result.eventType || "Not specified"],
        ].map(([label, value]) => (
          <div key={label} className="tile min-w-0 rounded-2xl p-3.5 sm:p-4">
            <p className="bday-label">{label}</p>
            <p className="mt-2 truncate text-base font-bold text-[var(--text)] sm:text-lg">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-3 grid gap-2.5 sm:mt-4 sm:grid-cols-3 sm:gap-3">
        {[
          ["Venue", result.venueType],
          ["Food", result.foodPreference],
          [
            "Cake",
            `${result.cakeFlavour || ""}${
              result.cakeWeight ? ` • ${result.cakeWeight} kg` : ""
            }`,
          ],
        ].map(([label, value]) => (
          <div key={label} className="tile rounded-2xl p-4 sm:p-5">
            <p className="bday-label">{label}</p>
            <p className="mt-2 text-sm font-semibold text-[var(--text)] sm:text-base">
              {value || "Not specified"}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-3 grid gap-2.5 sm:mt-4 sm:grid-cols-2 sm:gap-3">
        <div className="tile rounded-2xl p-4 sm:p-5">
          <p className="bday-label">Celebration Area</p>
          <p className="mt-2 flex items-start gap-1.5 text-sm font-semibold text-[var(--text)] sm:text-base">
            <MapPin size={15} className="mt-0.5 shrink-0 text-[var(--rose)]" />
            <span className="break-words">
              {result.Area || "Not specified"}
            </span>
          </p>
        </div>

        <div className="tile rounded-2xl p-4 sm:p-5">
          <p className="bday-label">Birthday Prank</p>
          <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-[var(--text)] sm:text-base">
            <Sparkles size={15} className="shrink-0 text-[var(--rose)]" />
            {result.prank || "No"}
          </p>
        </div>
      </div>

      {result.specialRequest && (
        <div className="result-section mt-3 p-4 sm:mt-4 sm:p-5">
          <p className="bday-label">Special Request</p>
          <p className="mt-2 break-words text-sm leading-6 text-[var(--text-soft)]">
            {result.specialRequest}
          </p>
        </div>
      )}

      {budgetReality.message && (
        <div className="result-section mt-3 flex items-start gap-3 p-4 sm:mt-4 sm:p-5">
          {budgetInsufficient ? (
            <ShieldAlert size={18} className="mt-0.5 shrink-0 text-amber-500" />
          ) : (
            <Check size={18} className="mt-0.5 shrink-0 text-emerald-500" />
          )}

          <div className="min-w-0">
            <p className="bday-label">
              {budgetReality.status || "Budget Check"}
            </p>
            <p className="mt-2 break-words text-sm leading-6 text-[var(--text-soft)]">
              {budgetReality.message}
            </p>
          </div>
        </div>
      )}

      {Object.keys(budgetBreakdown).length > 0 && (
        <div className="result-section mt-6 p-4 sm:mt-8 sm:p-6">
          <SectionTitle
            icon={Wallet}
            title="Budget Breakdown"
            subtitle={`Estimated total: ${money(
              plan.estimatedCost || result.estimatedCost || result.budget,
            )}`}
          />

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5">
            {[
              ["Venue & Food", budgetBreakdown.venueAndFood],
              ["Cake & Decor", budgetBreakdown.cakeAndDecorations],
              ["Entertainment", budgetBreakdown.entertainment],
              ["Misc", budgetBreakdown.miscellaneous],
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

      {eventTimeline.length > 0 && (
        <div className="mt-6 sm:mt-8">
          <SectionTitle
            icon={Clock}
            title="Event Timeline"
            subtitle="A practical schedule for the celebration."
          />

          <div className="space-y-3 sm:space-y-4">
            {eventTimeline.map((event, index) => (
              <motion.div
                key={`${event.time || index}-${index}`}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="result-item overflow-hidden p-4 sm:p-5"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="flex h-10 min-w-[3.5rem] shrink-0 items-center justify-center rounded-xl bg-[var(--rose)] px-2 text-xs font-bold text-[var(--ink)] sm:h-11">
                    {event.time || `#${index + 1}`}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold leading-6 text-[var(--text)] sm:text-base">
                      {event.activity || text(event)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {themeSuggestions.length > 0 && (
        <div className="result-section mt-6 p-4 sm:mt-8 sm:p-6">
          <SectionTitle
            icon={Sparkles}
            title="Theme Suggestions"
            subtitle="Personalized themes for the celebration."
          />

          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            {themeSuggestions.map((item, index) => (
              <div key={index} className="result-item p-4 sm:p-5">
                <div className="flex items-start gap-2 text-[13px] leading-6 text-[var(--text-soft)] sm:text-sm">
                  <Sparkles
                    size={15}
                    className="mt-0.5 shrink-0 text-[var(--rose)]"
                  />
                  <span className="break-words">{text(item)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {recommendedVenues.length > 0 && (
        <div className="result-section mt-6 p-4 sm:mt-8 sm:p-6">
          <SectionTitle
            icon={Building2}
            title="Recommended Venues"
            subtitle="Nearby venues matching your preferences."
          />

          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            {recommendedVenues.map((venue, index) => (
              <div
                key={`${venue.name || "venue"}-${index}`}
                className="result-item p-4 sm:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <h4 className="min-w-0 break-words font-bold text-[var(--text)]">
                    {venue.name}
                  </h4>

                  {venue.rating && (
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-[var(--accent-soft)] px-2 py-1 text-xs font-semibold text-[var(--rose)]">
                      <Star size={12} />
                      {venue.rating}
                    </span>
                  )}
                </div>

                {venue.address && (
                  <p className="mt-2 flex items-start gap-1.5 text-xs leading-5 text-[var(--muted)]">
                    <MapPin size={13} className="mt-0.5 shrink-0" />
                    <span className="break-words">{venue.address}</span>
                  </p>
                )}

                {venue.reason && (
                  <p className="mt-3 text-[13px] leading-6 text-[var(--text-soft)] sm:text-sm">
                    {venue.reason}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={getMapsUrl(venue)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ghost-button inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
                  >
                    <MapPin size={13} />
                    View on Maps
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {cakeIdeas.length > 0 && (
        <div className="result-section mt-6 p-4 sm:mt-8 sm:p-6">
          <SectionTitle
            icon={Cake}
            title="Cake Ideas"
            subtitle="Ideas based on your selected flavour and weight."
          />

          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            {cakeIdeas.map((cake, index) => (
              <div
                key={`${cake.flavor || "cake"}-${index}`}
                className="result-item p-4 sm:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <h4 className="min-w-0 break-words font-bold text-[var(--text)]">
                    {cake.flavor || `Cake Idea ${index + 1}`}
                  </h4>

                  {cake.estimatedCost != null && (
                    <span className="shrink-0 rounded-full bg-[var(--accent-soft)] px-2 py-1 text-xs font-semibold text-[var(--rose)]">
                      {money(cake.estimatedCost)}
                    </span>
                  )}
                </div>

                {cake.design && (
                  <p className="mt-3 text-[13px] leading-6 text-[var(--text-soft)] sm:text-sm">
                    {cake.design}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {decorationIdeas.length > 0 && (
        <div className="result-section mt-6 p-4 sm:mt-8 sm:p-6">
          <SectionTitle icon={PartyPopper} title="Decoration Ideas" />

          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            {decorationIdeas.map((item, index) => (
              <div
                key={index}
                className="result-item flex items-start gap-2 p-4 text-[13px] leading-6 text-[var(--text-soft)] sm:p-5 sm:text-sm"
              >
                <PartyPopper
                  size={15}
                  className="mt-0.5 shrink-0 text-[var(--rose)]"
                />
                <span className="break-words">{text(item)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {gamesAndActivities.length > 0 && (
        <div className="result-section mt-6 p-4 sm:mt-8 sm:p-6">
          <SectionTitle icon={Users} title="Games & Activities" />

          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            {gamesAndActivities.map((activity, index) => (
              <div
                key={`${activity.name || "activity"}-${index}`}
                className="result-item p-4 sm:p-5"
              >
                <h4 className="break-words font-bold text-[var(--text)]">
                  {activity.name || `Activity ${index + 1}`}
                </h4>

                {activity.description && (
                  <p className="mt-3 text-[13px] leading-6 text-[var(--text-soft)] sm:text-sm">
                    {activity.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {prankIdeas.length > 0 && (
        <div className="result-section mt-6 p-4 sm:mt-8 sm:p-6">
          <SectionTitle
            icon={Sparkles}
            title="Prank Ideas"
            subtitle="Harmless and age-appropriate birthday pranks."
          />

          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            {prankIdeas.slice(0, 5).map((prank, index) => (
              <div
                key={`${prank.name || "prank"}-${index}`}
                className="result-item p-4 sm:p-5"
              >
                <h4 className="break-words font-bold text-[var(--text)]">
                  {prank.name || `Prank Idea ${index + 1}`}
                </h4>

                {prank.description && (
                  <p className="mt-3 text-[13px] leading-6 text-[var(--text-soft)] sm:text-sm">
                    {prank.description}
                  </p>
                )}

                {prank.howToDo && (
                  <div className="mt-3">
                    <p className="bday-label">How To Do It</p>
                    <p className="mt-1 text-[13px] leading-6 text-[var(--text-soft)] sm:text-sm">
                      {prank.howToDo}
                    </p>
                  </div>
                )}

                {prank.safetyNote && (
                  <div className="soft-tile mt-3 rounded-xl p-3">
                    <p className="text-xs font-semibold text-[var(--rose)]">
                      Safety Note
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[var(--text-soft)]">
                      {prank.safetyNote}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {foodMenuSuggestions.length > 0 && (
        <div className="result-section mt-6 p-4 sm:mt-8 sm:p-6">
          <SectionTitle icon={Utensils} title="Food Menu Suggestions" />

          <div className="space-y-2">
            {foodMenuSuggestions.map((item, index) => (
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

      {checklist.length > 0 && (
        <div className="result-section mt-6 p-4 sm:mt-8 sm:p-6">
          <SectionTitle icon={ListChecks} title="Birthday Checklist" />

          <div className="grid gap-2 sm:grid-cols-2">
            {checklist.map((item, index) => (
              <div
                key={index}
                className="tile flex items-start gap-2 rounded-xl px-4 py-3 text-[13px] text-[var(--text-soft)] sm:text-sm"
              >
                <Check size={15} className="mt-0.5 shrink-0 text-[var(--rose)]" />
                <span className="break-words">{text(item)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 border-t border-[var(--border)] pt-7 sm:mt-10 sm:pt-8">
        <div className="text-center">
          <p className="bday-label">Birthday Plan Status</p>

          <p className="mt-2 text-[13px] leading-6 text-[var(--muted)] sm:text-sm">
            Confirm or cancel your birthday plan.
          </p>
        </div>

        <div className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-2">
          <button
            type="button"
            onClick={onConfirm}
            disabled={actionLoading || isConfirmed || isCancelled}
            className="bday-button flex min-h-[52px] items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold"
          >
            {actionLoading ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <Check size={17} />
            )}

            {isConfirmed ? "Birthday Confirmed" : "Confirm Birthday"}
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

            {isCancelled ? "Birthday Cancelled" : "Cancel Birthday"}
          </button>
        </div>

        {isConfirmed && (
          <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-600 dark:text-emerald-400">
            <Check size={16} />
            Your birthday plan has been confirmed.
          </div>
        )}

        {isCancelled && (
          <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-red-500/10 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400">
            <AlertCircle size={16} />
            Your birthday plan has been cancelled.
          </div>
        )}
      </div>
    </motion.div>
  );
};

const PageShell = ({ children }) => (
  <div className="bday-root min-h-screen w-full overflow-x-clip">
    <style>{styles}</style>

    <Navbar />

    <main
      className="
        bday-page
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
              var(--page-pattern-color, var(--bday-pattern)) 1px,
              transparent 1px
            ),
            linear-gradient(
              0deg,
              var(--page-pattern-color, var(--bday-pattern)) 1px,
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

const Birthday = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { birthdayId } = useParams();

  const isViewingBirthday = Boolean(birthdayId);

  const [form, setForm] = useState({
    name: location.state?.name || location.state?.personName || "",
    age: "1",
    state: location.state?.state || "",
    area: location.state?.area || "",
    budget: "1000",
    people: "1",
    eventType: "",
    cakeFlavour: "",
    cakeWeight: "",
    prank: "No",
    venueType: "Any",
    foodPreference: "Any",
    specialRequest: "",
  });

  const [activeSelect, setActiveSelect] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [locationRegions, setLocationRegions] = useState(() => [
    ...INDIA_REGIONS,
  ]);
  const [loading, setLoading] = useState(false);
  const [loadingBirthday, setLoadingBirthday] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [birthdayResult, setBirthdayResult] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
  const [loadingStep, setLoadingStep] = useState(0);

  const reduceMotion = useReducedMotion();

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

  useEffect(() => {
    setFieldErrors((previous) => {
      const next = { ...previous };
      let changed = false;

      Object.keys(next).forEach((key) => {
        if (String(form[key] ?? "").trim()) {
          delete next[key];
          changed = true;
        }
      });

      return changed ? next : previous;
    });
  }, [form]);

  const areaSuggestionGroups = useMemo(() => {
    const selectedRegion = locationRegions.find(
      (region) =>
        region.name.toLowerCase() ===
        String(form.state || "").trim().toLowerCase(),
    );

    if (!selectedRegion) return [];

    const uniqueItems = (items) =>
      items.filter(
        (item, index, array) =>
          item &&
          array.findIndex(
            (candidate) => candidate.toLowerCase() === item.toLowerCase(),
          ) === index,
      );

    const groups = [
      {
        label: "Capital",
        items: uniqueItems([selectedRegion.capital]),
      },
      {
        label: "Tourist Places",
        items: uniqueItems(
          selectedRegion.touristPlaces.map((place) => place.name),
        ),
      },
      {
        label: "Districts",
        items: uniqueItems(
          selectedRegion.districts.map((district) => district.name),
        ),
      },
      {
        label: "Sub-districts",
        items: uniqueItems(
          selectedRegion.districts.flatMap((district) =>
            district.subDistricts.map((subDistrict) => subDistrict.name),
          ),
        ),
      },
    ];

    return groups.filter((group) => group.items.length > 0);
  }, [form.state, locationRegions]);

  const activeBirthdayId = birthdayId || extractBirthdayId(birthdayResult);

  const budgetNumber = Number(form.budget);

  const budgetIsInvalid =
    form.budget !== "" &&
    (!Number.isFinite(budgetNumber) || budgetNumber < 1000);

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
    const handleOutsideClick = (event) => {
      if (!event.target.closest("[data-select-field]")) {
        setActiveSelect(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const loadBirthday = async () => {
      if (!birthdayId) {
        setBirthdayResult(null);
        return;
      }

      try {
        setLoadingBirthday(true);
        setBirthdayResult(null);

        const response = await getBirthdayById(birthdayId);
        const responseData = response?.data ?? response;

        if (!responseData) {
          throw new Error("Saved birthday plan was not found");
        }

        const birthday =
          responseData?.data ?? responseData?.birthday ?? responseData;

        if (!birthday || typeof birthday !== "object") {
          throw new Error("Saved birthday data was not found");
        }

        setBirthdayResult(birthday);

        const savedArea = String(birthday.Area || "");

        const parts = savedArea
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);

        let savedState = "";
        let savedLocality = savedArea;

        const matchingState = stateOptions.find(
          (state) => state.toLowerCase() === parts[0]?.toLowerCase(),
        );

        if (matchingState) {
          savedState = matchingState;
          savedLocality = parts.slice(1).join(", ");
        } else if (parts.length > 1) {
          savedState = parts[0];
          savedLocality = parts.slice(1).join(", ");
        }

        setForm({
          name: birthday.Name || "",
          age: String(birthday.Age ?? 1),
          state: savedState,
          area: savedLocality,
          budget: String(birthday.budget ?? 1000),
          people: String(birthday.people ?? 1),
          eventType: birthday.eventType || "",
          cakeFlavour: birthday.cakeFlavour || "",
          cakeWeight:
            birthday.cakeWeight != null ? String(birthday.cakeWeight) : "",
          prank: birthday.prank || "No",
          venueType: birthday.venueType || "Any",
          foodPreference: birthday.foodPreference || "Any",
          specialRequest: birthday.specialRequest || "",
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
        console.error("LOAD BIRTHDAY ERROR:", error);

        setBirthdayResult(null);

        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            "Unable to load your saved birthday plan",
        );
      } finally {
        setLoadingBirthday(false);
      }
    };

    loadBirthday();
  }, [birthdayId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleStateChange = (value) => {
    setForm((prev) => {
      const previousState = String(prev.state || "").trim();
      const nextState = String(value || "").trim();

      const changed = previousState.toLowerCase() !== nextState.toLowerCase();

      return {
        ...prev,
        state: value,
        ...(changed && nextState ? { area: "" } : {}),
      };
    });
  };

  const extractBirthday = (response) => {
    const body =
      response?.data &&
      typeof response.data === "object" &&
      !Array.isArray(response.data)
        ? response.data
        : response;

    if (!body) {
      throw new Error("No birthday response received");
    }

    if (body.status === false) {
      throw new Error(body.message || "Unable to create birthday plan");
    }

    const birthday =
      body.data?.data && typeof body.data.data === "object"
        ? body.data.data
        : body.data && typeof body.data === "object" && !Array.isArray(body.data)
          ? body.data
          : body;

    return { body, birthday };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setActiveSelect(null);

    const required = [
      ["name", "Birthday person's name"],
      ["age", "Age"],
      ["state", "State"],
      ["area", "Area"],
      ["budget", "Budget"],
      ["people", "Number of people"],
      ["eventType", "Event type"],
      ["cakeFlavour", "Cake flavour"],
      ["cakeWeight", "Cake weight"],
    ];

    const missing = required.find(([key]) => !String(form[key]).trim());

    if (missing) {
      setFieldErrors({ [missing[0]]: `${missing[1]} is required` });
      return;
    }

    setFieldErrors({});

    const name = form.name.trim();
    const age = Number(form.age);
    const budget = Number(form.budget);
    const people = Number(form.people);
    const cakeWeight = Number(form.cakeWeight);

    const selectedState = stateOptions.find(
      (state) => state.toLowerCase() === form.state.trim().toLowerCase(),
    );

    if (!selectedState) {
      setFieldErrors({ state: "Please select a valid state" });
      return;
    }

    if (name.length < 3) {
      setFieldErrors({ name: "Name must contain at least 3 characters" });
      return;
    }

    if (!Number.isInteger(age) || age < 1) {
      setFieldErrors({ age: "Please enter a valid age" });
      return;
    }

    if (!Number.isFinite(budget) || budget < 1000) {
      setFieldErrors({ budget: "Birthday budget must be ₹1,000 or above" });
      return;
    }

    if (!Number.isInteger(people) || people < 1) {
      setFieldErrors({ people: "Number of people must be at least 1" });
      return;
    }

    if (![0.5, 1, 1.5, 2, 2.5, 3, 4, 5].includes(cakeWeight)) {
      setFieldErrors({ cakeWeight: "Please select a valid cake weight" });
      return;
    }

    try {
      setLoading(true);
      setBirthdayResult(null);

      const payload = {
        name,
        age,
        area: `${selectedState}, ${form.area.trim()}`,
        budget,
        people,
        eventType: form.eventType,
        cakeFlavour: form.cakeFlavour,
        cakeWeight,
        prank: form.prank,
        venueType: form.venueType,
        foodPreference: form.foodPreference,
        specialRequest: form.specialRequest.trim(),
      };

      const response = await createBirthday(payload);

      const { birthday } = extractBirthday(response);

      const id = extractBirthdayId(birthday) || extractBirthdayId(response);

      if (!id) {
        setBirthdayResult(birthday.birthday || birthday);
        return;
      }

      navigate(`/birthday/${id}`, { replace: true });
    } catch (error) {
      console.error("CREATE BIRTHDAY ERROR:", error);

      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error?.message;

      const statusCode =
        error?.response?.status || error?.response?.data?.error?.code;

      if (
        statusCode === 503 ||
        String(backendMessage || "")
          .toLowerCase()
          .includes("busy")
      ) {
        toast.error(
          "😅 Our planner is a little busy right now. Please try again in a moment.",
        );
      } else if (
        String(backendMessage || "")
          .toLowerCase()
          .includes("fetch failed")
      ) {
        toast.error(
          "🚧 Our birthday planner is temporarily unavailable. Please try again shortly.",
        );
      } else {
        toast.error(
          backendMessage ||
            "Unable to create your birthday plan. Please try again.",
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

  const handleConfirmBirthday = async () => {
    if (
      !activeBirthdayId ||
      actionLoading ||
      birthdayResult?.status === "Booked" ||
      birthdayResult?.status === "Cancelled"
    ) {
      return;
    }

    try {
      setActionLoading(true);

      const response = await confirmBirthday(activeBirthdayId);

      const body =
        response?.data && typeof response.data === "object"
          ? response.data
          : response;

      if (body?.status === false) {
        throw new Error(body.message || "Unable to confirm birthday plan");
      }

      setBirthdayResult((previous) => ({
        ...previous,
        ...(extractUpdated(body) || {}),
        status: "Booked",
        isBooked: true,
      }));

      toast.success(body?.message || "Birthday plan confirmed successfully");
    } catch (error) {
      console.error("CONFIRM BIRTHDAY ERROR:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to confirm birthday plan",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelBirthday = async () => {
    if (
      !activeBirthdayId ||
      actionLoading ||
      birthdayResult?.status === "Cancelled" ||
      birthdayResult?.status === "Booked"
    ) {
      return;
    }

    try {
      setActionLoading(true);

      const response = await cancelBirthday(activeBirthdayId);

      const body =
        response?.data && typeof response.data === "object"
          ? response.data
          : response;

      if (body?.status === false) {
        throw new Error(body.message || "Unable to cancel birthday plan");
      }

      setBirthdayResult((previous) => ({
        ...previous,
        ...(extractUpdated(body) || {}),
        status: "Cancelled",
        isBooked: false,
      }));

      toast.success(body?.message || "Birthday plan cancelled successfully");
    } catch (error) {
      console.error("CANCEL BIRTHDAY ERROR:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to cancel birthday plan",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const personName = form.name.trim() || "Birthday Person";

  const celebrationArea =
    [form.state.trim(), form.area.trim()].filter(Boolean).join(", ") ||
    "Celebration Area";

  const budgetError = budgetIsInvalid ? "Minimum budget is ₹1,000" : undefined;

  const fadeIn = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
      };

  const showResult = isViewingBirthday || Boolean(birthdayResult);

  if (loadingBirthday) {
    return (
      <PageShell>
        <div className="mx-auto flex min-h-[50vh] w-full max-w-md flex-col items-center justify-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent-soft)]">
            <Loader2 size={25} className="animate-spin text-[var(--rose)]" />
          </div>

          <h2 className="mt-5 text-xl font-bold text-[var(--text)] sm:text-2xl">
            Loading your birthday plan
          </h2>

          <p className="mt-2 text-sm text-[var(--muted)]">
            Fetching your saved plan...
          </p>
        </div>
      </PageShell>
    );
  }

  if (isViewingBirthday && !birthdayResult) {
    return (
      <PageShell>
        <div className="mx-auto flex min-h-[50vh] w-full max-w-md flex-col items-center justify-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent-soft)]">
            <Cake size={28} className="text-[var(--rose)]" />
          </div>

          <h2 className="mt-5 text-xl font-bold text-[var(--text)] sm:text-2xl">
            Birthday plan not found
          </h2>

          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            We could not find this saved birthday plan.
          </p>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="bday-button mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold"
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
              setBirthdayResult(null);
              navigate("/birthday");
            }}
            className="ghost-button mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold sm:mb-5 sm:text-sm"
          >
            <ArrowLeft size={15} />
            Plan another birthday
          </button>

          <BirthdayResult
            result={birthdayResult}
            onConfirm={handleConfirmBirthday}
            onCancel={handleCancelBirthday}
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
              <h1 className="text-[1.9rem] font-bold leading-[1.12] tracking-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl">
                Plan The
                <span className="bday-title-gradient mt-1 block">
                  Perfect Celebration
                </span>
              </h1>

              <p className="mx-auto mt-3 max-w-xl px-2 text-[13px] leading-6 text-slate-600 dark:text-slate-300 sm:mt-4 sm:text-base sm:leading-7">
                Choose the birthday person's details, budget and party
                preferences.
              </p>
            </motion.div>
          )}

          {loading ? (
            <BirthdayLoading message={loadingMessage} step={loadingStep} />
          ) : (
            <motion.form
              {...fadeIn}
              onSubmit={handleSubmit}
              noValidate
              className="invite-card"
            >
              <div className="invite-route px-4 py-4 sm:px-7 sm:py-6 md:px-9">
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-5">
                  <div className="min-w-0">
                    <p className="bday-label">Celebrating</p>
                    <p className="invite-route-value mt-1.5 truncate text-sm sm:text-lg">
                      {personName}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-[var(--rose)] sm:gap-2">
                    <span className="hidden h-px w-6 border-t border-dashed border-current opacity-50 sm:block sm:w-10" />

                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent-soft)] sm:h-10 sm:w-10">
                      <PartyPopper
                        size={16}
                        className="sm:h-[18px] sm:w-[18px]"
                      />
                    </span>

                    <span className="hidden h-px w-6 border-t border-dashed border-current opacity-50 sm:block sm:w-10" />
                  </div>

                  <div className="min-w-0 text-right">
                    <p className="bday-label">Celebration Area</p>
                    <p className="invite-route-value mt-1.5 truncate text-sm sm:text-lg">
                      {celebrationArea}
                    </p>
                  </div>
                </div>
              </div>

              <div className="invite-perf">
                <span className="invite-notch invite-notch-left" />
                <span className="invite-notch invite-notch-right" />
              </div>

              <div className="min-w-0 px-3.5 py-5 sm:px-7 sm:py-8 md:px-9">
                <div className="grid min-w-0 grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
                  <TextField
                    name="name"
                    label="Birthday Person's Name"
                    icon={User}
                    value={form.name}
                    setForm={setForm}
                    error={fieldErrors.name}
                  />

                  <NumberField
                    name="age"
                    label="Age"
                    icon={Cake}
                    step={1}
                    minimum={1}
                    value={form.age}
                    setForm={setForm}
                    error={fieldErrors.age}
                  />

                  <StateField
                    value={form.state}
                    onChange={handleStateChange}
                    activeSelect={activeSelect}
                    setActiveSelect={setActiveSelect}
                    options={stateOptions}
                    error={fieldErrors.state}
                  />

                  <TextField
                    name="area"
                    label="Area"
                    icon={MapPin}
                    value={form.area}
                    setForm={setForm}
                    disabled={!form.state}
                    suggestionGroups={areaSuggestionGroups}
                    error={fieldErrors.area}
                  />

                  <NumberField
                    name="budget"
                    label="Budget"
                    icon={Wallet}
                    step={100}
                    minimum={1000}
                    prefix="₹"
                    value={form.budget}
                    setForm={setForm}
                    error={fieldErrors.budget || budgetError}
                  />

                  <NumberField
                    name="people"
                    label="Number of People"
                    icon={Users}
                    step={1}
                    minimum={1}
                    value={form.people}
                    setForm={setForm}
                    error={fieldErrors.people}
                  />

                  <SelectField
                    name="eventType"
                    label="Event Type"
                    icon={PartyPopper}
                    options={eventTypeOptions}
                    value={form.eventType}
                    handleChange={handleChange}
                    activeSelect={activeSelect}
                    setActiveSelect={setActiveSelect}
                    error={fieldErrors.eventType}
                  />

                  <SelectField
                    name="cakeFlavour"
                    label="Cake Flavour"
                    icon={Cake}
                    options={cakeFlavourOptions}
                    value={form.cakeFlavour}
                    handleChange={handleChange}
                    activeSelect={activeSelect}
                    setActiveSelect={setActiveSelect}
                    error={fieldErrors.cakeFlavour}
                  />

                  <SelectField
                    name="cakeWeight"
                    label="Cake Weight"
                    icon={Cake}
                    options={cakeWeightOptions}
                    value={form.cakeWeight}
                    handleChange={handleChange}
                    activeSelect={activeSelect}
                    setActiveSelect={setActiveSelect}
                    error={fieldErrors.cakeWeight}
                  />

                  <SelectField
                    name="prank"
                    label="Birthday Prank"
                    icon={Sparkles}
                    options={prankOptions}
                    value={form.prank}
                    handleChange={handleChange}
                    activeSelect={activeSelect}
                    setActiveSelect={setActiveSelect}
                  />

                  <SelectField
                    name="venueType"
                    label="Venue Type"
                    icon={Building2}
                    options={venueTypeOptions}
                    value={form.venueType}
                    handleChange={handleChange}
                    activeSelect={activeSelect}
                    setActiveSelect={setActiveSelect}
                  />

                  <SelectField
                    name="foodPreference"
                    label="Food Preference"
                    icon={Utensils}
                    options={foodPreferenceOptions}
                    value={form.foodPreference}
                    handleChange={handleChange}
                    activeSelect={activeSelect}
                    setActiveSelect={setActiveSelect}
                  />

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
                          placeholder="Anything special? Favorite colors, surprise ideas, allergies..."
                          className="bday-input min-w-0 flex-1 resize-none bg-transparent outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="invite-perf">
                <span className="invite-notch invite-notch-left" />
                <span className="invite-notch invite-notch-right" />
              </div>

              <div className="px-3.5 py-5 sm:px-7 sm:py-7 md:px-9 md:py-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="bday-button group flex min-h-[52px] w-full items-center justify-center gap-3 rounded-xl px-5 text-sm font-bold sm:min-h-14 sm:text-base"
                >
                  Create Birthday Plan
                </button>

                <p className="mt-3 text-center text-[11px] text-[var(--muted)] sm:text-xs">
                  Minimum budget ₹1,000 • Your plan is saved automatically
                </p>
              </div>
            </motion.form>
          )}
        </>
      )}
    </PageShell>
  );
};

export default Birthday;