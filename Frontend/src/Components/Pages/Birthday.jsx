import { useEffect, useRef, useState } from "react";
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
  Heart,
  AlertCircle,
  Search,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  createBirthday,
  getBirthdayById,
  confirmBirthday,
  cancelBirthday,
} from "../../Services/AuthAPI";

const stateOptions = [
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
];

const eventTypeOptions = [
  "Kids Party",
  "Teen Party",
  "Adult Gathering",
  "Milestone Birthday",
  "Surprise Party",
];

const venueTypeOptions = [
  "Cafe",
  "Restaurant",
  "Rooftop",
  "Banquet",
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

const fieldWrap =
  "field-focus group relative min-h-[78px] w-full rounded-2xl border border-[rgba(51,22,31,.12)] px-5 pb-3 pt-7 shadow-[0_2px_8px_rgba(42,18,32,.03)]";

const labelCls =
  "pointer-events-none absolute left-5 top-2.5 z-10 text-[.65rem] font-medium uppercase tracking-[.14em] text-[var(--muted)]";

const iconBoxCls =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[rgba(214,83,122,.10)] text-[var(--rose)]";

const styles = `
.bday-page {
  --ink: #2a1220;
  --paper: #fdf2f5;
  --text: #33161f;
  --muted: #9c7684;
  --rose: #d6537a;
  --rose-light: #eab8c4;
  --gold: #e3a85f;

  min-height: 100vh;
  background:
    radial-gradient(
      ellipse 70% 55% at 20% -10%,
      rgba(214,83,122,.16),
      transparent 60%
    ),
    radial-gradient(
      ellipse 60% 50% at 100% 110%,
      rgba(227,168,95,.10),
      transparent 60%
    ),
    var(--ink);

  color: var(--text);
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    Helvetica,
    Arial,
    sans-serif;
}

.bday-page *,
.bday-page *::before,
.bday-page *::after {
  box-sizing: border-box;
}

.bday-page button,
.bday-page input,
.bday-page textarea {
  font: inherit;
}

.bday-label {
  font-size: .65rem;
  letter-spacing: .14em;
  font-weight: 500;
  text-transform: uppercase;
}

.bday-input {
  font-size: .95rem;
  line-height: 1.5;
  font-weight: 400;
}

.field-focus {
  background: rgba(255,255,255,.7);
  transition:
    border-color .2s ease,
    box-shadow .2s ease,
    transform .2s ease,
    background .2s ease;
}

.field-focus:hover {
  background: rgba(255,255,255,.8);
}

.field-focus:focus-within {
  background: rgba(255,255,255,.85);
  border-color: var(--rose);
  box-shadow: 0 8px 25px rgba(214,83,122,.14);
  transform: translateY(-1px);
}

.invite-card {
  position: relative;
  background: var(--paper);
  color: var(--text);
  border-radius: 1.5rem;
  box-shadow:
    0 1.5rem 4rem rgba(0,0,0,.32),
    0 0 0 1px rgba(255,255,255,.06);
}

.invite-notch {
  position: absolute;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 9999px;
  background: var(--ink);
  z-index: 5;
}

.invite-perf {
  border-top: .125rem dashed rgba(51,22,31,.22);
  margin: 0 1.75rem;
}

.custom-dropdown-scroll {
  max-height: 260px;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.dropdown-option {
  background: transparent;
  color: var(--text);
  transition: background .15s ease, color .15s ease;
}

.dropdown-option:hover,
.dropdown-option.selected {
  background: rgba(214,83,122,.1);
  color: var(--rose);
}

.result-card {
  background:
    radial-gradient(
      ellipse 80% 80% at 100% 0%,
      rgba(214,83,122,.1),
      transparent 60%
    ),
    #fdf2f5;
}

.result-section {
  border: 1px solid rgba(51,22,31,.08);
  background: rgba(255,255,255,.72);
  border-radius: 1.25rem;
}

.result-item {
  border: 1px solid rgba(51,22,31,.07);
  background: rgba(255,255,255,.72);
  border-radius: 1rem;
}

.ai-loading-card {
  background:
    radial-gradient(
      ellipse 80% 80% at 50% 0%,
      rgba(214,83,122,.12),
      transparent 65%
    ),
    rgba(253,242,245,.98);
  border: 1px solid rgba(255,255,255,.1);
}

@media (max-width: 640px) {
  .invite-card {
    border-radius: 1.1rem;
  }

  .invite-perf {
    margin: 0 1.1rem;
  }

  .invite-notch {
    width: 1.35rem;
    height: 1.35rem;
  }
}
`;

const TextField = ({
  name,
  label,
  icon: Icon,
  value,
  setForm,
  placeholder,
  disabled = false,
}) => (
  <div className="relative z-10 w-full">
    <div className={`${fieldWrap} ${disabled ? "opacity-60" : ""}`}>
      <label className={labelCls}>{label}</label>

      <div className="flex min-w-0 items-center gap-3">
        <span className={iconBoxCls}>
          <Icon size={16} />
        </span>

        <input
          required
          disabled={disabled}
          type="text"
          name={name}
          value={value}
          onChange={(e) => {
            let nextValue = e.target.value;

            if (name === "name") {
              nextValue = nextValue.replace(/[^a-zA-Z\s]/g, "");

              if (nextValue.length > 0) {
                nextValue =
                  nextValue.charAt(0).toUpperCase() + nextValue.slice(1);
              }
            }

            setForm((prev) => ({
              ...prev,
              [name]: nextValue,
            }));
          }}
          autoComplete="off"
          placeholder={
            disabled
              ? "Select a state first"
              : placeholder || `Enter ${label.toLowerCase()}`
          }
          className="bday-input min-w-0 w-full bg-transparent text-[var(--text)] outline-none placeholder:text-[var(--muted)]/45"
        />
      </div>
    </div>
  </div>
);

const NumberField = ({
  name,
  label,
  icon: Icon,
  step,
  minimum,
  prefix = "",
  value,
  setForm,
}) => {
  const isBudget = name === "budget";
  const numericValue = Number(value);

  const isInvalid =
    isBudget &&
    value !== "" &&
    (!Number.isFinite(numericValue) || numericValue < minimum);

  const changeNumber = (amount) => {
    setForm((prev) => {
      const current = Number(prev[name]);
      const safeCurrent = Number.isFinite(current) ? current : minimum;

      return {
        ...prev,
        [name]: String(Math.max(minimum, safeCurrent + amount)),
      };
    });
  };

  return (
    <div className="relative z-10 w-full">
      <div
        className={`${fieldWrap} ${
          isInvalid
            ? "border-red-400 bg-red-50/40 shadow-[0_8px_25px_rgba(220,38,38,.10)]"
            : ""
        }`}
      >
        <label className={labelCls}>{label}</label>

        <div className="flex min-w-0 items-center gap-3">
          <span
            className={`${iconBoxCls} ${
              isInvalid ? "bg-red-100 text-red-500" : ""
            }`}
          >
            <Icon size={16} />
          </span>

          <div className="relative min-w-0 flex-1">
            <div className="flex min-w-0 items-center">
              {prefix && (
                <span className="mr-1.5 shrink-0 text-base font-medium">
                  {prefix}
                </span>
              )}

              <input
                required
                type="number"
                min={minimum}
                step={step}
                name={name}
                value={value}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    [name]: e.target.value,
                  }))
                }
                className={`bday-input min-w-0 w-full bg-transparent outline-none ${
                  isInvalid ? "text-red-600" : "text-[var(--text)]"
                }`}
              />
            </div>

            {isInvalid && (
              <div className="pointer-events-none absolute left-0 top-full z-[999999] mt-2 hidden w-max max-w-[280px] rounded-xl bg-red-600 px-3 py-2 text-xs font-semibold text-white shadow-xl group-hover:block">
                Minimum amount must be ₹1,000
              </div>
            )}
          </div>

          <div className="flex shrink-0 gap-1">
            <button
              type="button"
              onClick={() => changeNumber(-step)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(51,22,31,.12)] bg-white/70 transition hover:border-[var(--rose)] hover:text-[var(--rose)]"
            >
              <Minus size={14} />
            </button>

            <button
              type="button"
              onClick={() => changeNumber(step)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(51,22,31,.12)] bg-white/70 transition hover:border-[var(--rose)] hover:text-[var(--rose)]"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StateField = ({ value, onChange, activeSelect, setActiveSelect }) => {
  const isOpen = activeSelect === "state";
  const deletingRef = useRef(false);

  const searchValue = String(value || "").trim();

  const filteredStates = stateOptions.filter((state) =>
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

    const exactState = stateOptions.find(
      (state) => state.toLowerCase() === trimmedValue.toLowerCase(),
    );

    if (exactState) {
      onChange(exactState);
      setActiveSelect(null);
      return;
    }

    const prefixMatches = stateOptions.filter((state) =>
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
      className={`relative w-full ${isOpen ? "z-[9999]" : "z-10"}`}
      data-select-field
    >
      <div className={`${fieldWrap} ${isOpen ? "border-[var(--rose)]" : ""}`}>
        <label className={labelCls}>State</label>

        <div className="flex min-w-0 items-center gap-3">
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
              deletingRef.current = e.key === "Backspace" || e.key === "Delete";
            }}
            onChange={(e) => handleStateInput(e.target.value)}
            className="bday-input min-w-0 flex-1 bg-transparent outline-none placeholder:text-[var(--muted)]/50"
          />

          <Search size={17} className="shrink-0 text-[var(--muted)]" />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-[84px] z-[99999] overflow-hidden rounded-2xl border border-[rgba(51,22,31,.12)] bg-white shadow-2xl"
          >
            <div className="custom-dropdown-scroll p-2">
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
                      } flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm`}
                    >
                      <MapPin size={15} />

                      <span className="flex-1">{state}</span>

                      {isSelected && <Check size={16} />}
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
      className={`relative w-full ${isOpen ? "z-[9999]" : "z-10"}`}
      data-select-field
    >
      <div
        className={`${fieldWrap} cursor-pointer ${
          isOpen ? "border-[var(--rose)]" : ""
        }`}
        onClick={() => setActiveSelect(isOpen ? null : name)}
      >
        <label className={labelCls}>{label}</label>

        <div className="flex min-w-0 items-center gap-3">
          <span className={iconBoxCls}>
            <Icon size={16} />
          </span>

          <span
            className={`bday-input flex-1 truncate ${
              selectedLabel ? "text-[var(--text)]" : "text-[var(--muted)]/50"
            }`}
          >
            {selectedLabel || `Select ${label}`}
          </span>

          <ChevronDown
            size={17}
            className={`text-[var(--muted)] transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-[84px] z-[99999] overflow-hidden rounded-2xl border border-[rgba(51,22,31,.12)] bg-white shadow-2xl"
          >
            <div className="custom-dropdown-scroll p-2">
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
                        target: {
                          name,
                          value: optionValue,
                        },
                      });

                      setActiveSelect(null);
                    }}
                    className={`dropdown-option ${
                      isSelected ? "selected" : ""
                    } flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm`}
                  >
                    <Icon size={15} />

                    <span className="flex-1 truncate">{optionLabel}</span>

                    {isSelected && <Check size={16} />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SectionTitle = ({ icon: Icon, title, subtitle }) => (
  <div className="mb-5 flex items-start gap-3">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[rgba(214,83,122,.12)] text-[var(--rose)]">
      <Icon size={18} />
    </div>

    <div>
      <h3 className="text-xl font-medium">{title}</h3>

      {subtitle && (
        <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{subtitle}</p>
      )}
    </div>
  </div>
);

const BirthdayLoading = ({ message }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="ai-loading-card mx-auto mt-8 max-w-3xl rounded-3xl p-8 text-center shadow-2xl sm:p-12"
  >
    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[rgba(214,83,122,.12)]">
      <Loader2 size={34} className="animate-spin text-[var(--rose)]" />
    </div>

    <p className="bday-label mt-7 text-[var(--muted)]">Birthday Planner</p>

    <h2 className="mt-3 text-2xl font-medium sm:text-3xl">{message}</h2>

    <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[var(--muted)]">
      Your personalized birthday celebration is being prepared.
    </p>

    <div className="mx-auto mt-7 h-1.5 max-w-md overflow-hidden rounded-full bg-black/10">
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          repeat: Infinity,
          duration: 1.7,
          ease: "easeInOut",
        }}
        className="h-full w-1/2 rounded-full bg-[var(--rose)]"
      />
    </div>
  </motion.div>
);

const BirthdayResult = ({ result, onConfirm, onCancel, actionLoading }) => {
  if (!result) return null;

  const plan = result.aiPlan || result.birthdayPlan || {};
  const budgetBreakdown = plan.budgetBreakdown || {};

  const themeSuggestions = Array.isArray(plan.themeSuggestions)
    ? plan.themeSuggestions
    : [];

  const recommendedVenues = Array.isArray(plan.recommendedVenues)
    ? plan.recommendedVenues
    : [];

  const cakeIdeas = Array.isArray(plan.cakeIdeas) ? plan.cakeIdeas : [];

  const decorationIdeas = Array.isArray(plan.decorationIdeas)
    ? plan.decorationIdeas
    : [];

  const gamesAndActivities = Array.isArray(plan.gamesAndActivities)
    ? plan.gamesAndActivities
    : [];

  const eventTimeline = Array.isArray(plan.eventTimeline)
    ? plan.eventTimeline
    : [];

  const foodMenuSuggestions = Array.isArray(plan.foodMenuSuggestions)
    ? plan.foodMenuSuggestions
    : [];

  const checklist = Array.isArray(plan.checklist) ? plan.checklist : [];

  const prankIdeas = Array.isArray(plan.prankIdeas) ? plan.prankIdeas : [];

  const isConfirmed = result.status === "Booked";
  const isCancelled = result.status === "Cancelled";

  const money = (value) => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
      return "₹0";
    }

    return `₹${number.toLocaleString("en-IN")}`;
  };

  const readableValue = (value) => {
    if (value === null || value === undefined) {
      return "";
    }

    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      return String(value);
    }

    if (Array.isArray(value)) {
      return value.map(readableValue).filter(Boolean).join(", ");
    }

    if (typeof value === "object") {
      if (value.name && value.description) {
        return `${value.name}: ${value.description}`;
      }

      if (value.title && value.description) {
        return `${value.title}: ${value.description}`;
      }

      if (value.activity && value.description) {
        return `${value.activity}: ${value.description}`;
      }

      if (value.name) {
        return String(value.name);
      }

      if (value.title) {
        return String(value.title);
      }

      if (value.description) {
        return String(value.description);
      }

      return Object.values(value)
        .map(readableValue)
        .filter(Boolean)
        .join(" • ");
    }

    return "";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="result-card overflow-hidden rounded-3xl p-4 shadow-2xl sm:p-7 lg:p-9"
    >
      <div className="mb-7 border-b border-[rgba(51,22,31,.1)] pb-7">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="bday-label text-[var(--muted)]">
              Your Personalized Birthday Plan
            </p>

            <h2 className="mt-2 text-3xl font-medium sm:text-4xl">
              {result.Name || "Birthday"}
              <span className="text-[var(--rose)]"> 🎉</span>
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
              {plan.summary ||
                "Your personalized birthday celebration plan is ready."}
            </p>
          </div>

          <div
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm ${
              isConfirmed
                ? "bg-green-100 text-green-700"
                : isCancelled
                  ? "bg-red-100 text-red-700"
                  : "bg-[rgba(214,83,122,.1)] text-[var(--rose)]"
            }`}
          >
            {isConfirmed ? (
              <Check size={16} />
            ) : isCancelled ? (
              <AlertCircle size={16} />
            ) : (
              <PartyPopper size={16} />
            )}

            {result.status || "Created"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {[
          ["Age", result.Age],
          ["People", result.people],
          ["Budget", money(result.budget)],
          ["Event", result.eventType],
          ["Venue", result.venueType],
          ["Food", result.foodPreference],
          ["Cake", result.cakeFlavour],
          ["Weight", result.cakeWeight ? `${result.cakeWeight} kg` : ""],
          ["Prank", result.prank || "No"],
        ].map(([label, value]) => (
          <div
            key={label}
            className="min-w-0 rounded-2xl border border-[rgba(51,22,31,.08)] bg-white/80 p-4"
          >
            <p className="bday-label text-[var(--muted)]">{label}</p>

            <p className="mt-2 truncate text-sm font-medium">
              {value || "Not specified"}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-white/80 p-5">
          <div className="flex items-center gap-3">
            <MapPin size={18} className="text-[var(--rose)]" />

            <div>
              <p className="bday-label text-[var(--muted)]">Celebration Area</p>

              <p className="mt-1 font-medium">
                {result.Area || "Not specified"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white/80 p-5">
          <div className="flex items-center gap-3">
            <Heart size={18} className="text-[var(--rose)]" />

            <div>
              <p className="bday-label text-[var(--muted)]">Estimated Cost</p>

              <p className="mt-1 font-medium">
                {money(
                  result.estimatedCost || plan.estimatedCost || result.budget,
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {themeSuggestions.length > 0 && (
        <div className="result-section mt-8 p-5 sm:p-6">
          <SectionTitle
            icon={Sparkles}
            title="Theme Suggestions"
            subtitle="Personalized themes for your birthday."
          />

          <div className="grid gap-3 sm:grid-cols-2">
            {themeSuggestions.map((item, index) => (
              <div key={index} className="result-item p-4 text-sm leading-6">
                <div className="flex gap-3">
                  <Sparkles
                    size={16}
                    className="mt-1 shrink-0 text-[var(--rose)]"
                  />

                  <span>{readableValue(item)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {recommendedVenues.length > 0 && (
        <div className="result-section mt-8 p-5 sm:p-6">
          <SectionTitle
            icon={Building2}
            title="Recommended Venues"
            subtitle="Nearby venue recommendations."
          />

          <div className="grid gap-4 md:grid-cols-2">
            {recommendedVenues.map((venue, index) => (
              <div key={index} className="result-item p-5">
                <h4 className="font-medium">
                  {venue.name || readableValue(venue)}
                </h4>

                {venue.address && (
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    {venue.address}
                  </p>
                )}

                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  {venue.rating != null && (
                    <span className="flex items-center gap-1 rounded-full bg-[rgba(227,168,95,.12)] px-3 py-1.5">
                      <Star size={12} className="text-[var(--gold)]" />
                      {venue.rating}
                    </span>
                  )}

                  {venue.userRatingsTotal != null && (
                    <span className="rounded-full bg-black/5 px-3 py-1.5 text-[var(--muted)]">
                      {venue.userRatingsTotal} reviews
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {cakeIdeas.length > 0 && (
        <div className="result-section mt-8 p-5 sm:p-6">
          <SectionTitle
            icon={Cake}
            title="Cake Ideas"
            subtitle="Cake ideas based on your selected flavour and weight."
          />

          <div className="grid gap-3 sm:grid-cols-2">
            {cakeIdeas.map((item, index) => (
              <div
                key={index}
                className="result-item flex gap-3 p-4 text-sm leading-6"
              >
                <Cake size={16} className="mt-1 shrink-0 text-[var(--rose)]" />

                <span>{readableValue(item)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {decorationIdeas.length > 0 && (
        <div className="result-section mt-8 p-5 sm:p-6">
          <SectionTitle icon={PartyPopper} title="Decoration Ideas" />

          <div className="grid gap-3 sm:grid-cols-2">
            {decorationIdeas.map((item, index) => (
              <div
                key={index}
                className="result-item flex gap-3 p-4 text-sm leading-6"
              >
                <PartyPopper
                  size={16}
                  className="mt-1 shrink-0 text-[var(--rose)]"
                />

                <span>{readableValue(item)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {gamesAndActivities.length > 0 && (
        <div className="result-section mt-8 p-5 sm:p-6">
          <SectionTitle icon={Users} title="Games & Activities" />

          <div className="grid gap-3 sm:grid-cols-2">
            {gamesAndActivities.map((item, index) => (
              <div
                key={index}
                className="result-item flex gap-3 p-4 text-sm leading-6"
              >
                <Users size={16} className="mt-1 shrink-0 text-[var(--rose)]" />

                <span>{readableValue(item)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {Object.keys(budgetBreakdown).length > 0 && (
        <div className="result-section mt-8 p-5 sm:p-6">
          <SectionTitle icon={Wallet} title="Budget Breakdown" />

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(budgetBreakdown).map(([key, value]) => (
              <div key={key} className="result-item p-4">
                <p className="bday-label text-[var(--muted)]">
                  {key.replace(/([A-Z])/g, " $1")}
                </p>

                <p className="mt-2 font-medium">
                  {typeof value === "number"
                    ? money(value)
                    : readableValue(value)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {prankIdeas.length > 0 && (
        <div className="result-section mt-8 p-5 sm:p-6">
          <SectionTitle
            icon={Sparkles}
            title="Prank Ideas"
            subtitle="Five harmless and age-appropriate ideas."
          />

          <div className="grid gap-4 md:grid-cols-2">
            {prankIdeas.slice(0, 5).map((prank, index) => (
              <div key={index} className="result-item p-5">
                <h4 className="font-medium">
                  {prank.name || `Prank Idea ${index + 1}`}
                </h4>

                {prank.description && (
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    {prank.description}
                  </p>
                )}

                {prank.howToDo && (
                  <div className="mt-4">
                    <p className="bday-label text-[var(--muted)]">
                      How To Do It
                    </p>

                    <p className="mt-1 text-sm leading-6">{prank.howToDo}</p>
                  </div>
                )}

                {prank.safetyNote && (
                  <div className="mt-4 rounded-xl bg-[rgba(227,168,95,.10)] p-3">
                    <p className="text-xs font-medium">Safety Note</p>

                    <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                      {prank.safetyNote}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {eventTimeline.length > 0 && (
        <div className="mt-8">
          <SectionTitle icon={Clock} title="Event Timeline" />

          <div className="space-y-4">
            {eventTimeline.map((event, index) => (
              <div key={index} className="result-item p-5">
                <div className="flex gap-4">
                  <div className="flex h-11 min-w-11 items-center justify-center rounded-xl bg-[var(--rose)] px-2 text-xs font-medium text-white">
                    {event.time || `#${index + 1}`}
                  </div>

                  <div>
                    <h4 className="font-medium">
                      {event.activity || event.title || `Activity ${index + 1}`}
                    </h4>

                    {event.description && (
                      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                        {event.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {foodMenuSuggestions.length > 0 && (
        <div className="result-section mt-8 p-5 sm:p-6">
          <SectionTitle icon={Utensils} title="Food Menu Suggestions" />

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {foodMenuSuggestions.map((item, index) => (
              <div
                key={index}
                className="result-item flex gap-3 p-4 text-sm leading-6"
              >
                <Utensils
                  size={15}
                  className="mt-1 shrink-0 text-[var(--rose)]"
                />

                <span>{readableValue(item)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {checklist.length > 0 && (
        <div className="result-section mt-8 p-5 sm:p-6">
          <SectionTitle icon={ListChecks} title="Birthday Checklist" />

          <div className="grid gap-3 sm:grid-cols-2">
            {checklist.map((item, index) => (
              <div key={index} className="result-item flex gap-3 p-4 text-sm">
                <Check size={16} className="mt-1 shrink-0 text-[var(--rose)]" />

                <span>{readableValue(item)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 border-t border-[rgba(51,22,31,.1)] pt-8">
        <div className="text-center">
          <p className="bday-label text-[var(--muted)]">Birthday Plan Status</p>

          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Confirm or cancel your birthday plan.
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onConfirm}
            disabled={actionLoading || isConfirmed || isCancelled}
            className="flex min-h-13 items-center justify-center gap-2 rounded-xl bg-[var(--rose)] px-5 py-3 text-sm font-medium text-white shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
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
            className="flex min-h-13 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
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
          <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
            <Check size={16} />
            Your birthday plan has been confirmed.
          </div>
        )}

        {isCancelled && (
          <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle size={16} />
            Your birthday plan has been cancelled.
          </div>
        )}
      </div>
    </motion.div>
  );
};

const Birthday = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { birthdayId } = useParams();

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
  const [loading, setLoading] = useState(false);
  const [loadingBirthday, setLoadingBirthday] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [birthdayResult, setBirthdayResult] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);

  const reduceMotion = useReducedMotion();

  const budgetNumber = Number(form.budget);

  const budgetInvalid =
    form.budget !== "" &&
    (!Number.isFinite(budgetNumber) || budgetNumber < 1000);

  useEffect(() => {
    if (!loading) return;

    let index = 0;

    const timer = setInterval(() => {
      index = (index + 1) % loadingMessages.length;
      setLoadingMessage(loadingMessages[index]);
    }, 2600);

    return () => clearInterval(timer);
  }, [loading]);

  useEffect(() => {
    const handleOutside = (event) => {
      if (!event.target.closest("[data-select-field]")) {
        setActiveSelect(null);
      }
    };

    document.addEventListener("mousedown", handleOutside);

    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  useEffect(() => {
    if (!birthdayId) {
      setBirthdayResult(null);
      return;
    }

    const loadBirthday = async () => {
      try {
        setLoadingBirthday(true);
        setBirthdayResult(null);

        const response = await getBirthdayById(birthdayId);

        if (!response) {
          throw new Error("Birthday plan was not found");
        }

        if (response.status === false) {
          throw new Error(response.message || "Birthday plan was not found");
        }

        const birthday =
          response.data?.data && typeof response.data.data === "object"
            ? response.data.data
            : response.data &&
                typeof response.data === "object" &&
                !Array.isArray(response.data)
              ? response.data
              : response;

        if (
          !birthday ||
          typeof birthday !== "object" ||
          Array.isArray(birthday) ||
          (!birthday._id &&
            !birthday.Name &&
            !birthday.aiPlan &&
            !birthday.birthdayPlan)
        ) {
          throw new Error("Birthday data was not found");
        }

        setBirthdayResult(birthday);

        const savedArea = String(birthday.Area || "");

        const parts = savedArea
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);

        let savedState = String(birthday.state || "").trim();

        let savedLocality = savedArea;

        if (!savedState) {
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

        setTimeout(() => {
          document.querySelector(".result-card")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 150);
      } catch (error) {
        console.error("LOAD BIRTHDAY ERROR:", error);

        setBirthdayResult(null);

        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            "Unable to load birthday plan",
        );
      } finally {
        setLoadingBirthday(false);
      }
    };

    loadBirthday();
  }, [birthdayId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
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
        : body.data &&
            typeof body.data === "object" &&
            !Array.isArray(body.data)
          ? body.data
          : body;

    return {
      body,
      birthday,
    };
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
      toast.error(`${missing[1]} is required`);
      return;
    }

    const name = form.name.trim();
    const age = Number(form.age);
    const budget = Number(form.budget);
    const people = Number(form.people);
    const cakeWeight = Number(form.cakeWeight);

    const selectedState = stateOptions.find(
      (state) => state.toLowerCase() === form.state.trim().toLowerCase(),
    );

    if (!selectedState) {
      toast.error("Please select a valid state");
      return;
    }

    if (name.length < 3) {
      toast.error("Name must contain at least 3 characters");
      return;
    }

    if (!Number.isInteger(age) || age < 1) {
      toast.error("Please enter a valid age");
      return;
    }

    if (!Number.isFinite(budget) || budget < 1000) {
      toast.error("Birthday budget must be ₹1,000 or above");
      return;
    }

    if (!Number.isInteger(people) || people < 1) {
      toast.error("Number of people must be at least 1");
      return;
    }

    if (![0.5, 1, 1.5, 2, 2.5, 3, 4, 5].includes(cakeWeight)) {
      toast.error("Please select a valid cake weight");
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

      const { body, birthday } = extractBirthday(response);

      const id = birthday._id || birthday.birthdayId || birthday.id;

      if (!id) {
        throw new Error("Birthday ID was not returned");
      }

      setBirthdayResult(birthday);

      toast.success(body?.message || "Birthday plan generated successfully");

      navigate(`/birthday/${id}`, {
        replace: true,
      });
    } catch (error) {
      console.error("CREATE BIRTHDAY ERROR:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to create birthday plan",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBirthday = async () => {
    if (
      !birthdayId ||
      actionLoading ||
      birthdayResult?.status === "Booked" ||
      birthdayResult?.status === "Cancelled"
    ) {
      return;
    }

    try {
      setActionLoading(true);

      const response = await confirmBirthday(birthdayId);

      const body =
        response?.data && typeof response.data === "object"
          ? response.data
          : response;

      if (body?.status === false) {
        throw new Error(body.message || "Unable to confirm birthday plan");
      }

      const updated =
        body?.data?.data && typeof body.data.data === "object"
          ? body.data.data
          : body?.data && typeof body.data === "object"
            ? body.data
            : null;

      setBirthdayResult((previous) => ({
        ...previous,
        ...(updated || {}),
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
      !birthdayId ||
      actionLoading ||
      birthdayResult?.status === "Cancelled" ||
      birthdayResult?.status === "Booked"
    ) {
      return;
    }

    try {
      setActionLoading(true);

      const response = await cancelBirthday(birthdayId);

      const body =
        response?.data && typeof response.data === "object"
          ? response.data
          : response;

      if (body?.status === false) {
        throw new Error(body.message || "Unable to cancel birthday plan");
      }

      const updated =
        body?.data?.data && typeof body.data.data === "object"
          ? body.data.data
          : body?.data && typeof body.data === "object"
            ? body.data
            : null;

      setBirthdayResult((previous) => ({
        ...previous,
        ...(updated || {}),
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

  if (loadingBirthday) {
    return (
      <main className="bday-page flex min-h-screen items-center justify-center px-4">
        <style>{styles}</style>

        <div className="text-center text-white">
          <Loader2
            size={35}
            className="mx-auto animate-spin text-[var(--rose)]"
          />

          <h2 className="mt-5 text-2xl font-medium">
            Loading your birthday plan
          </h2>

          <p className="mt-2 text-sm text-white/50">
            Fetching your saved plan...
          </p>
        </div>
      </main>
    );
  }

  if (birthdayId && !birthdayResult) {
    return (
      <main className="bday-page flex min-h-screen items-center justify-center px-4">
        <style>{styles}</style>

        <div className="max-w-md text-center text-white">
          <Cake size={40} className="mx-auto text-[var(--gold)]" />

          <h2 className="mt-5 text-2xl font-medium">Birthday plan not found</h2>

          <p className="mt-2 text-sm leading-6 text-white/50">
            We could not find this saved birthday plan.
          </p>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--rose)] px-5 py-3 text-sm font-medium text-white"
          >
            Back to Dashboard
            <ArrowRight size={17} />
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="bday-page min-h-screen overflow-x-hidden px-4 py-10 sm:px-6 lg:px-8">
      <style>{styles}</style>

      <div className="mx-auto w-full max-w-5xl">
        {birthdayId ? (
          <>
            <div className="mb-10 text-center">
              <p className="text-3xl font-bold text-rose-300 sm:text-4xl">
                Saved Birthday Plan
              </p>

              <p className="mt-3 text-sm text-white/60">
                Your personalized birthday celebration plan
              </p>
            </div>

            <BirthdayResult
              result={birthdayResult}
              onConfirm={handleConfirmBirthday}
              onCancel={handleCancelBirthday}
              actionLoading={actionLoading}
            />
          </>
        ) : loading ? (
          <BirthdayLoading message={loadingMessage} />
        ) : (
          <>
            <div className="mb-10 text-center">
              <h1 className="text-4xl font-bold text-rose-300">
                Plan The Celebration
              </h1>

              <p className="mt-4 text-sm text-white/60">
                Create a personalized birthday celebration plan.
              </p>
            </div>

            <motion.form
              onSubmit={handleSubmit}
              initial={
                reduceMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 15,
                    }
              }
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="invite-card"
            >
              <div className="px-6 py-7 sm:px-9 sm:py-9">
                <div className="grid gap-4 md:grid-cols-2">
                  <TextField
                    name="name"
                    label="Birthday Person's Name"
                    icon={User}
                    value={form.name}
                    setForm={setForm}
                  />

                  <NumberField
                    name="age"
                    label="Age"
                    icon={Cake}
                    step={1}
                    minimum={1}
                    value={form.age}
                    setForm={setForm}
                  />

                  <StateField
                    value={form.state}
                    onChange={handleStateChange}
                    activeSelect={activeSelect}
                    setActiveSelect={setActiveSelect}
                  />

                  <TextField
                    name="area"
                    label="Area"
                    icon={MapPin}
                    value={form.area}
                    setForm={setForm}
                    disabled={!form.state}
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
                  />

                  <NumberField
                    name="people"
                    label="Number of People"
                    icon={Users}
                    step={1}
                    minimum={1}
                    value={form.people}
                    setForm={setForm}
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

                  <div className="mt-3 md:col-span-2 sm:mt-5">
                    <div className="field-focus rounded-2xl border border-[rgba(51,22,31,.12)] px-5 pb-5 pt-7">
                      <label className={labelCls}>Special Request</label>

                      <div className="flex items-start gap-3">
                        <span className={iconBoxCls}>
                          <MessageSquare size={16} />
                        </span>

                        <textarea
                          name="specialRequest"
                          value={form.specialRequest}
                          onChange={handleChange}
                          rows={4}
                          placeholder="Anything you want us to consider..."
                          className="bday-input min-h-[105px] w-full resize-none bg-transparent outline-none placeholder:text-[var(--muted)]/50"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-7 pt-2 sm:px-9 sm:pb-9">
                <button
                  type="submit"
                  disabled={loading || budgetInvalid}
                  className="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[var(--rose)] to-[var(--rose-light)] text-white shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      Create Birthday Plan
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          </>
        )}
      </div>
    </main>
  );
};

export default Birthday;
