import { useEffect, useState } from "react";
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
} from "lucide-react";
import toast from "react-hot-toast";
import {
  createTour,
  getTripById,
  confirmTrip,
  cancelTrip,
} from "../../Services/AuthAPI";

const touristLocations = [
  {
    state: "Andhra Pradesh",
    city: "Visakhapatnam",
    places: ["Visakhapatnam", "Araku Valley", "Borra Caves"],
  },
  {
    state: "Andhra Pradesh",
    city: "Tirupati",
    places: ["Tirupati", "Tirumala", "Sri Venkateswara Temple"],
  },
  {
    state: "Arunachal Pradesh",
    city: "Tawang",
    places: [
      "Tawang",
      "Tawang Monastery",
      "Sela Pass",
      "Bum La Pass",
      "Dirang",
      "Bomdila",
      "Ziro",
      "Itanagar",
    ],
  },
  {
    state: "Assam",
    city: "Guwahati",
    places: ["Guwahati", "Kamakhya Temple"],
  },
  {
    state: "Assam",
    city: "Kaziranga",
    places: ["Kaziranga National Park", "Majuli", "Jorhat"],
  },
  {
    state: "Bihar",
    city: "Gaya",
    places: ["Gaya", "Bodh Gaya", "Mahabodhi Temple"],
  },
  {
    state: "Bihar",
    city: "Patna",
    places: ["Patna", "Nalanda", "Rajgir", "Vaishali"],
  },
  {
    state: "Chhattisgarh",
    city: "Jagdalpur",
    places: [
      "Jagdalpur",
      "Chitrakote Falls",
      "Tirathgarh Falls",
      "Kanger Valley National Park",
    ],
  },
  {
    state: "Goa",
    city: "North Goa",
    places: [
      "North Goa",
      "Calangute",
      "Baga",
      "Anjuna",
      "Vagator",
      "Candolim",
      "Fort Aguada",
    ],
  },
  {
    state: "Goa",
    city: "South Goa",
    places: [
      "South Goa",
      "Palolem",
      "Colva",
      "Benaulim",
      "Agonda",
      "Dudhsagar Falls",
    ],
  },
  {
    state: "Gujarat",
    city: "Ahmedabad",
    places: ["Ahmedabad", "Sabarmati Ashram", "Adalaj Stepwell"],
  },
  {
    state: "Gujarat",
    city: "Kutch",
    places: ["Kutch", "Rann of Kutch", "Dhordo", "Mandvi"],
  },
  {
    state: "Gujarat",
    city: "Dwarka",
    places: [
      "Dwarka",
      "Somnath",
      "Gir National Park",
      "Diu",
      "Statue of Unity",
      "Vadodara",
    ],
  },
  {
    state: "Haryana",
    city: "Gurugram",
    places: ["Gurugram", "Kurukshetra", "Panipat"],
  },
  {
    state: "Himachal Pradesh",
    city: "Shimla",
    places: ["Shimla", "Kufri", "Mashobra", "Chail", "Narkanda"],
  },
  {
    state: "Himachal Pradesh",
    city: "Manali",
    places: [
      "Manali",
      "Solang Valley",
      "Rohtang Pass",
      "Kasol",
      "Malana",
      "Naggar",
    ],
  },
  {
    state: "Himachal Pradesh",
    city: "Dharamshala",
    places: ["Dharamshala", "McLeod Ganj", "Triund", "Bir Billing", "Palampur"],
  },
  {
    state: "Himachal Pradesh",
    city: "Spiti",
    places: [
      "Spiti Valley",
      "Kaza",
      "Key Monastery",
      "Chandratal",
      "Kibber",
    ],
  },
  {
    state: "Jammu and Kashmir",
    city: "Srinagar",
    places: [
      "Srinagar",
      "Dal Lake",
      "Gulmarg",
      "Pahalgam",
      "Sonamarg",
      "Doodhpathri",
    ],
  },
  {
    state: "Jharkhand",
    city: "Ranchi",
    places: [
      "Ranchi",
      "Hundru Falls",
      "Dassam Falls",
      "Netarhat",
      "Deoghar",
      "Betla National Park",
    ],
  },
  {
    state: "Karnataka",
    city: "Bengaluru",
    places: ["Bengaluru", "Nandi Hills", "Mysuru", "Coorg", "Chikmagalur"],
  },
  {
    state: "Karnataka",
    city: "Hampi",
    places: ["Hampi", "Badami", "Aihole", "Pattadakal"],
  },
  {
    state: "Karnataka",
    city: "Coastal Karnataka",
    places: [
      "Gokarna",
      "Udupi",
      "Mangalore",
      "Murudeshwar",
      "Jog Falls",
      "Dandeli",
    ],
  },
  {
    state: "Kerala",
    city: "Kochi",
    places: ["Kochi", "Fort Kochi", "Alappuzha", "Kumarakom"],
  },
  {
    state: "Kerala",
    city: "Munnar",
    places: ["Munnar", "Thekkady", "Vagamon", "Wayanad"],
  },
  {
    state: "Kerala",
    city: "Thiruvananthapuram",
    places: ["Thiruvananthapuram", "Kovalam", "Varkala", "Ponmudi"],
  },
  {
    state: "Madhya Pradesh",
    city: "Indore",
    places: ["Indore", "Ujjain", "Omkareshwar", "Mandu"],
  },
  {
    state: "Madhya Pradesh",
    city: "Bhopal",
    places: ["Bhopal", "Sanchi", "Bhimbetka", "Pachmarhi"],
  },
  {
    state: "Madhya Pradesh",
    city: "Khajuraho",
    places: [
      "Khajuraho",
      "Kanha National Park",
      "Bandhavgarh National Park",
      "Pench National Park",
    ],
  },
  {
    state: "Maharashtra",
    city: "Mumbai",
    places: [
      "Mumbai",
      "Gateway of India",
      "Marine Drive",
      "Elephanta Caves",
      "Juhu Beach",
      "Sanjay Gandhi National Park",
    ],
  },
  {
    state: "Maharashtra",
    city: "Pune",
    places: ["Pune", "Lonavala", "Khandala", "Lavasa", "Sinhagad Fort"],
  },
  {
    state: "Maharashtra",
    city: "Mahabaleshwar",
    places: ["Mahabaleshwar", "Panchgani", "Pratapgad Fort", "Kaas Plateau"],
  },
  {
    state: "Maharashtra",
    city: "Nashik",
    places: ["Nashik", "Igatpuri", "Bhandardara", "Trimbakeshwar"],
  },
  {
    state: "Maharashtra",
    city: "Aurangabad",
    places: ["Aurangabad", "Ajanta Caves", "Ellora Caves", "Daulatabad Fort"],
  },
  {
    state: "Manipur",
    city: "Imphal",
    places: ["Imphal", "Loktak Lake", "Keibul Lamjao National Park"],
  },
  {
    state: "Meghalaya",
    city: "Shillong",
    places: [
      "Shillong",
      "Cherrapunji",
      "Mawsynram",
      "Dawki",
      "Mawlynnong",
      "Nongriat",
    ],
  },
  {
    state: "Mizoram",
    city: "Aizawl",
    places: ["Aizawl", "Reiek", "Vantawng Falls"],
  },
  {
    state: "Nagaland",
    city: "Kohima",
    places: ["Kohima", "Dzukou Valley", "Mokokchung"],
  },
  {
    state: "Odisha",
    city: "Bhubaneswar",
    places: ["Bhubaneswar", "Puri", "Konark", "Chilika Lake"],
  },
  {
    state: "Odisha",
    city: "Simlipal",
    places: ["Simlipal National Park", "Gopalpur", "Baripada"],
  },
  {
    state: "Punjab",
    city: "Amritsar",
    places: ["Amritsar", "Golden Temple", "Jallianwala Bagh", "Wagah Border"],
  },
  {
    state: "Rajasthan",
    city: "Jaipur",
    places: [
      "Jaipur",
      "Hawa Mahal",
      "Amber Fort",
      "City Palace",
      "Jantar Mantar",
    ],
  },
  {
    state: "Rajasthan",
    city: "Udaipur",
    places: ["Udaipur", "City Palace Udaipur", "Lake Pichola", "Kumbhalgarh"],
  },
  {
    state: "Rajasthan",
    city: "Jodhpur",
    places: ["Jodhpur", "Mehrangarh Fort", "Umaid Bhawan Palace"],
  },
  {
    state: "Rajasthan",
    city: "Jaisalmer",
    places: ["Jaisalmer", "Sam Sand Dunes", "Jaisalmer Fort", "Khuri"],
  },
  {
    state: "Rajasthan",
    city: "Pushkar",
    places: [
      "Pushkar",
      "Ajmer",
      "Ranthambore",
      "Mount Abu",
      "Bundi",
      "Bikaner",
    ],
  },
  {
    state: "Sikkim",
    city: "Gangtok",
    places: [
      "Gangtok",
      "Tsomgo Lake",
      "Nathula Pass",
      "Pelling",
      "Lachung",
      "Yuksom",
    ],
  },
  {
    state: "Tamil Nadu",
    city: "Chennai",
    places: [
      "Chennai",
      "Marina Beach",
      "Mahabalipuram",
      "Pondicherry",
      "Kanchipuram",
    ],
  },
  {
    state: "Tamil Nadu",
    city: "Ooty",
    places: ["Ooty", "Coonoor", "Kotagiri", "Kodaikanal"],
  },
  {
    state: "Tamil Nadu",
    city: "Madurai",
    places: ["Madurai", "Rameswaram", "Kanyakumari", "Thanjavur"],
  },
  {
    state: "Telangana",
    city: "Hyderabad",
    places: ["Hyderabad", "Charminar", "Golconda Fort", "Ramoji Film City"],
  },
  {
    state: "Uttar Pradesh",
    city: "Agra",
    places: ["Agra", "Taj Mahal", "Agra Fort", "Fatehpur Sikri"],
  },
  {
    state: "Uttar Pradesh",
    city: "Varanasi",
    places: [
      "Varanasi",
      "Kashi Vishwanath Temple",
      "Sarnath",
      "Prayagraj",
      "Ayodhya",
    ],
  },
  {
    state: "Uttarakhand",
    city: "Nainital",
    places: ["Nainital", "Bhimtal", "Sattal", "Naukuchiatal", "Mukteshwar"],
  },
  {
    state: "Uttarakhand",
    city: "Mussoorie",
    places: ["Mussoorie", "Dhanaulti", "Landour", "Kanatal"],
  },
  {
    state: "Uttarakhand",
    city: "Rishikesh",
    places: [
      "Rishikesh",
      "Haridwar",
      "Rajaji National Park",
      "Neer Garh Waterfall",
    ],
  },
  {
    state: "Uttarakhand",
    city: "Kedarnath",
    places: [
      "Kedarnath",
      "Badrinath",
      "Valley of Flowers",
      "Auli",
      "Chopta",
      "Jim Corbett National Park",
    ],
  },
  {
    state: "West Bengal",
    city: "Kolkata",
    places: [
      "Kolkata",
      "Victoria Memorial",
      "Howrah Bridge",
      "Darjeeling",
      "Kalimpong",
    ],
  },
  {
    state: "West Bengal",
    city: "Darjeeling",
    places: ["Darjeeling", "Tiger Hill", "Siliguri", "Dooars", "Sundarbans"],
  },
  {
    state: "Andaman and Nicobar Islands",
    city: "Port Blair",
    places: [
      "Port Blair",
      "Swaraj Dweep (Havelock)",
      "Shaheed Dweep (Neil Island)",
      "Cellular Jail",
      "Radhanagar Beach",
    ],
  },
  {
    state: "Delhi",
    city: "New Delhi",
    places: [
      "New Delhi",
      "India Gate",
      "Red Fort",
      "Qutub Minar",
      "Humayun's Tomb",
      "Lotus Temple",
    ],
  },
  {
    state: "Ladakh",
    city: "Leh",
    places: [
      "Leh",
      "Nubra Valley",
      "Pangong Lake",
      "Khardung La",
      "Tso Moriri",
      "Lamayuru",
    ],
  },
  {
    state: "Puducherry",
    city: "Puducherry",
    places: ["Puducherry", "Auroville", "Promenade Beach", "Paradise Beach"],
  },
  {
    state: "Chandigarh",
    city: "Chandigarh",
    places: ["Chandigarh", "Rock Garden", "Sukhna Lake"],
  },
  {
    state: "Dadra and Nagar Haveli and Daman and Diu",
    city: "Daman",
    places: ["Daman", "Diu", "Silvassa", "Jampore Beach"],
  },
  {
    state: "Lakshadweep",
    city: "Lakshadweep",
    places: ["Lakshadweep", "Agatti", "Bangaram", "Kavaratti", "Minicoy"],
  },
];

const locationSearchOptions = [
  ...touristLocations.flatMap((group) => [
    {
      name: group.city,
      city: group.city,
      state: group.state,
      type: "City",
    },
    ...group.places.map((place) => ({
      name: place,
      city: group.city,
      state: group.state,
      type: "Tourist Place",
    })),
  ]),
  ...[...new Set(touristLocations.map((group) => group.state))].map(
    (state) => ({
      name: state,
      city: state,
      state,
      type: "State",
    }),
  ),
].filter(
  (item, index, array) =>
    array.findIndex(
      (candidate) =>
        candidate.name.toLowerCase() === item.name.toLowerCase() &&
        candidate.state.toLowerCase() === item.state.toLowerCase(),
    ) === index,
);

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

const styles = `
  .tour-page {
    --ink: #0d222c;
    --paper: #f8f2e2;
    --text: #1d2b30;
    --muted: #8a8064;
    --gold: #cf9d4b;
    --gold-light: #e8c17c;
    --teal: #4bb3a0;

    min-height: 100vh;
    background:
      radial-gradient(
        ellipse 70% 55% at 20% -10%,
        rgba(75,179,160,.12),
        transparent 60%
      ),
      radial-gradient(
        ellipse 60% 50% at 100% 110%,
        rgba(207,157,75,.10),
        transparent 60%
      ),
      var(--ink);

    color: var(--text);
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Helvetica, Arial, sans-serif;
  }

  .tour-page *,
  .tour-page *::before,
  .tour-page *::after {
    box-sizing: border-box;
  }

  .tour-page button,
  .tour-page input,
  .tour-page textarea {
    font: inherit;
  }

  .tour-title {
    font-size: clamp(2rem, 5vw, 3.6rem);
    line-height: 1.1;
    font-weight: 500;
    letter-spacing: -0.035em;
  }

  .tour-subtitle {
    font-size: clamp(.9rem, 1.8vw, 1.05rem);
    line-height: 1.6;
    font-weight: 400;
  }

  .tour-label {
    font-size: .65rem;
    letter-spacing: .14em;
    font-weight: 500;
    text-transform: uppercase;
  }

  .tour-input {
    font-size: .95rem;
    line-height: 1.5;
    font-weight: 400;
  }

  .tour-button {
    font-size: .85rem;
    letter-spacing: .04em;
    font-weight: 500;
  }

  .ticket-card {
    background: var(--paper);
    color: var(--text);
    border-radius: 1.5rem;
    box-shadow:
      0 1.5rem 4rem rgba(0,0,0,.32),
      0 0 0 1px rgba(255,255,255,.06);
  }

  .ticket-notch {
    position: absolute;
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 9999px;
    background: var(--ink);
    z-index: 5;
  }

  .ticket-perf {
    border-top: .125rem dashed rgba(29,43,48,.22);
    margin: 0 1.75rem;
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
    border-color: var(--teal);
    box-shadow: 0 8px 25px rgba(75,179,160,.1);
    transform: translateY(-1px);
  }

  .location-scroll,
  .custom-dropdown-scroll {
    max-height: 240px;
    overflow-y: auto;
    overscroll-behavior: contain;
    scrollbar-width: thin;
  }

  .dropdown-option {
    background: transparent;
    color: var(--text);
    transition: background .15s ease, color .15s ease;
  }

  .dropdown-option:hover,
  .dropdown-option:focus {
    background: rgba(75,179,160,.1);
    color: var(--teal);
    outline: none;
  }

  .dropdown-option.selected {
    background: rgba(75,179,160,.1);
    color: var(--teal);
  }

  .result-card {
    background:
      radial-gradient(
        ellipse 80% 80% at 100% 0%,
        rgba(75,179,160,.1),
        transparent 60%
      ),
      #f8f2e2;
  }

  .result-section {
    border: 1px solid rgba(29,43,48,.08);
    background: rgba(255,255,255,.72);
    border-radius: 1.25rem;
  }

  .result-item {
    border: 1px solid rgba(29,43,48,.07);
    background: rgba(255,255,255,.72);
    border-radius: 1rem;
  }

  .ai-loading-card {
    background:
      radial-gradient(
        ellipse 80% 80% at 50% 0%,
        rgba(75,179,160,.12),
        transparent 65%
      ),
      rgba(248,242,226,.98);
    border: 1px solid rgba(255,255,255,.1);
  }

  .budget-warning {
    background: #17343a;
    border: 1px solid rgba(207,157,75,.58);
    color: #ffffff;
    box-shadow:
      0 22px 48px rgba(0,0,0,.4),
      0 8px 20px rgba(13,34,44,.3);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }

  @media (max-width: 640px) {
    .ticket-card {
      border-radius: 1.1rem;
    }

    .ticket-perf {
      margin: 0 1.1rem;
    }

    .ticket-notch {
      width: 1.35rem;
      height: 1.35rem;
    }
  }
`;

const fieldWrap =
  "field-focus group relative min-h-[78px] w-full rounded-2xl border border-[rgba(29,43,48,.12)] px-5 pb-3 pt-7 shadow-[0_2px_8px_rgba(13,34,44,.03)]";

const labelCls =
  "tour-label pointer-events-none absolute left-5 top-2.5 z-10 text-[var(--muted)] transition-colors group-focus-within:text-[var(--teal)]";

const iconBoxCls =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[rgba(75,179,160,.10)] text-[var(--teal)]";

const dropdownCls =
  "absolute left-0 right-0 top-[84px] z-[9999] overflow-hidden rounded-2xl border border-[rgba(29,43,48,.12)] bg-white shadow-[0_20px_50px_rgba(13,34,44,.18)]";

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
}) => {
  const open = activeLocation === name;
  const query = value.trim().toLowerCase();

  const locations = query
    ? locationSearchOptions
        .filter((item) =>
          [item.name, item.city, item.state, item.type].some((field) =>
            field.toLowerCase().includes(query),
          ),
        )
        .slice(0, 80)
    : locationSearchOptions.slice(0, 80);

  const selectLocation = (location) => {
    setForm((prev) => ({
      ...prev,
      [name]: location.name,
    }));

    setFieldErrors((prev) => {
      if (!prev[name]) return prev;

      const next = { ...prev };
      delete next[name];
      return next;
    });

    setActiveLocation(null);
  };

  return (
    <div
      className={`relative w-full ${open ? "z-[100]" : "z-10"}`}
      data-location-field
    >
      <div className={`${fieldWrap} ${error ? "border-red-400/70" : ""}`}>
        <label className={labelCls}>{label}</label>

        <div className="flex min-w-0 items-center gap-3">
          <span className={iconBoxCls}>
            <Search size={16} />
          </span>

          <input
            type="text"
            name={name}
            value={value}
            onChange={(e) => {
              setForm((prev) => ({
                ...prev,
                [name]: e.target.value,
              }));

              setFieldErrors((prev) => {
                if (!prev[name]) return prev;

                const next = { ...prev };
                delete next[name];
                return next;
              });

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
            className="tour-input min-w-0 flex-1 bg-transparent text-[var(--text)] outline-none placeholder:text-[var(--muted)]/45"
          />

          <Icon
            size={17}
            strokeWidth={1.7}
            className="shrink-0 text-[var(--muted)]"
          />
        </div>

        {error && (
          <div className="mt-2 flex items-center gap-2 text-xs font-medium text-red-500">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}

        <AnimatePresence>
          {open && (
            <motion.div {...dropdownMotion} className={dropdownCls}>
              <div className="location-scroll p-2">
                {locations.length ? (
                  locations.map((location, index) => (
                    <button
                      key={`${location.state}-${location.name}-${index}`}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        selectLocation(location);
                      }}
                      className="dropdown-option flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-normal"
                    >
                      <span className={iconBoxCls}>
                        <MapPin size={15} />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">
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

    setFieldErrors((prev) => {
      if (!prev[name]) return prev;

      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const handleNumberChange = (e) => {
    const rawValue = e.target.value;

    if (rawValue === "") {
      setForm((prev) => ({
        ...prev,
        [name]: "",
      }));

      setFieldErrors((prev) => {
        if (!prev[name]) return prev;

        const next = { ...prev };
        delete next[name];
        return next;
      });

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: rawValue,
    }));

    setFieldErrors((prev) => {
      if (!prev[name]) return prev;

      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  return (
    <div className="relative z-10 w-full">
      <div className={`${fieldWrap} ${error ? "border-red-400/70" : ""}`}>
        <label className={labelCls}>{label}</label>

        <div className="flex min-w-0 items-center gap-3">
          <span className={iconBoxCls}>
            <Icon size={16} />
          </span>

          <div className="flex min-w-0 flex-1 items-center">
            {prefix && (
              <span className="mr-1.5 shrink-0 text-base font-normal">
                {prefix}
              </span>
            )}

            <input
              type="number"
              min={minimum}
              step={step}
              name={name}
              value={value}
              onChange={handleNumberChange}
              className="tour-input min-w-0 w-full bg-transparent outline-none"
            />
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => changeNumber(-step)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(29,43,48,.12)] bg-white/70 transition hover:border-[var(--teal)] hover:text-[var(--teal)]"
            >
              <Minus size={14} />
            </button>

            <button
              type="button"
              onClick={() => changeNumber(step)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(29,43,48,.12)] bg-white/70 transition hover:border-[var(--teal)] hover:text-[var(--teal)]"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-2 flex items-center gap-2 text-xs font-medium text-red-500">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}
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
        className={`${fieldWrap} cursor-pointer ${
          error ? "border-red-400/70" : ""
        }`}
        onClick={() => setActiveSelect(open ? null : name)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setActiveSelect(null);
          }

          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setActiveSelect(open ? null : name);
          }
        }}
      >
        <label className={labelCls}>{label}</label>

        <div className="flex min-w-0 items-center gap-3">
          <span className={iconBoxCls}>
            <SelectedIcon size={16} />
          </span>

          <div className="min-w-0 flex-1">
            <span
              className={`tour-input block truncate ${
                value
                  ? "text-[var(--text)]"
                  : "text-[var(--muted)]/45"
              }`}
            >
              {value || `Select ${label}`}
            </span>
          </div>

          <ChevronDown
            size={17}
            className={`shrink-0 text-[var(--muted)] transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>

        {error && (
          <div className="mt-2 flex items-center gap-2 text-xs font-medium text-red-500">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}

        <AnimatePresence>
          {open && (
            <motion.div
              {...dropdownMotion}
              className={dropdownCls}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="custom-dropdown-scroll p-2">
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

                        handleChange({
                          target: {
                            name,
                            value: option,
                          },
                        });

                        setActiveSelect(null);
                      }}
                      className={`dropdown-option ${
                        selected ? "selected" : ""
                      } flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-normal`}
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
  <div className="mb-5 flex items-start gap-3">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[rgba(75,179,160,.12)] text-[var(--teal)]">
      <Icon size={18} />
    </div>

    <div className="min-w-0">
      <h3 className="text-xl font-medium text-[var(--text)]">{title}</h3>

      {subtitle && (
        <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
          {subtitle}
        </p>
      )}
    </div>
  </div>
);

const TourLoading = ({ message }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="ai-loading-card mx-auto mt-8 w-full max-w-3xl rounded-3xl p-6 shadow-2xl sm:p-10"
  >
    <div className="flex flex-col items-center text-center">
      <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[rgba(75,179,160,.12)]">
        <div className="absolute inset-0 animate-ping rounded-full bg-[rgba(75,179,160,.08)]" />

        <Loader2
          size={34}
          className="relative animate-spin text-[var(--teal)]"
        />
      </div>

      <p className="tour-label mt-7 text-[var(--muted)]">Travel Planner</p>

      <h2 className="mt-3 text-2xl font-medium text-[var(--text)] sm:text-3xl">
        {message}
      </h2>

      <p className="mt-3 max-w-lg text-sm leading-6 text-[var(--muted)]">
        Your request is being processed. This can take a little longer while
        we prepare your personalized itinerary.
      </p>

      <div className="mt-7 flex items-center gap-2 text-sm text-[var(--teal)]">
        <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--teal)]" />
        <span>Your data is safe. Response coming soon...</span>
      </div>

      <div className="mt-7 h-1.5 w-full max-w-md overflow-hidden rounded-full bg-[rgba(29,43,48,.08)]">
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            repeat: Infinity,
            duration: 1.7,
            ease: "easeInOut",
          }}
          className="h-full w-1/2 rounded-full bg-[var(--teal)]"
        />
      </div>

      <p className="mt-5 text-xs text-[var(--muted)]">
        Please don't refresh or close this page.
      </p>
    </div>
  </motion.div>
);

const TourResult = ({
  result,
  onConfirm,
  onCancel,
  actionLoading,
}) => {
  if (!result) return null;

  const plan = result.tripPlan || {};
  const budgetBreakdown = plan.budgetBreakdown || {};

  const hotels = Array.isArray(plan.hotels) ? plan.hotels : [];
  const restaurants = Array.isArray(plan.restaurants)
    ? plan.restaurants
    : [];
  const touristPlaces = Array.isArray(plan.touristPlaces)
    ? plan.touristPlaces
    : [];
  const hiddenGems = Array.isArray(plan.hiddenGems) ? plan.hiddenGems : [];
  const dailyPlan = Array.isArray(plan.dailyPlan) ? plan.dailyPlan : [];
  const packingList = Array.isArray(plan.packingList)
    ? plan.packingList
    : [];
  const travelTips = Array.isArray(plan.travelTips) ? plan.travelTips : [];
  const shoppingPlaces = Array.isArray(plan.shoppingPlaces)
    ? plan.shoppingPlaces
    : [];
  const localFoods = Array.isArray(plan.localFoods) ? plan.localFoods : [];

  const isConfirmed =
    result.status === "Booked" || result.isBooked === true;

  const isCancelled = result.status === "Cancelled";

  const money = (value) => {
    const number = Number(value);

    return Number.isFinite(number)
      ? `₹${number.toLocaleString("en-IN")}`
      : "₹0";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="result-card overflow-hidden rounded-3xl p-4 shadow-2xl sm:p-7 lg:p-9"
    >
      <div className="mb-7 border-b border-[rgba(29,43,48,.1)] pb-7">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="min-w-0">
            <p className="tour-label text-[var(--muted)]">
              Your Personalized Tour
            </p>

            <h2 className="mt-2 break-words text-3xl font-medium leading-tight sm:text-4xl">
              {result.startLocation || "Origin"}{" "}
              <span className="text-[var(--teal)]">→</span>{" "}
              {result.destination || "Destination"}
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
              {plan.summary ||
                "Your travel plan has been prepared according to your selected preferences."}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 rounded-full bg-[rgba(75,179,160,.1)] px-4 py-2 text-sm text-[var(--teal)]">
            <ShieldCheck size={16} />
            Plan Ready
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["People", result.people],
          ["Days", result.days],
          ["Budget", money(result.budget)],
          ["Transport", result.transport || "Any"],
        ].map(([label, value]) => (
          <div
            key={label}
            className="min-w-0 rounded-2xl border border-[rgba(29,43,48,.08)] bg-white/80 p-4"
          >
            <p className="tour-label text-[var(--muted)]">{label}</p>
            <p className="mt-2 truncate text-lg font-medium">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {[
          ["Travel Type", result.travelType],
          ["Hotel", result.hotelType],
          ["Food", result.foodPreference],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-white/80 p-5">
            <p className="tour-label text-[var(--muted)]">{label}</p>
            <p className="mt-2 font-normal">{value || "Not specified"}</p>
          </div>
        ))}
      </div>

      {(plan.bestTimeToVisit || plan.weather) && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {plan.bestTimeToVisit && (
            <div className="result-section p-5">
              <p className="tour-label text-[var(--muted)]">
                Best Time To Visit
              </p>
              <p className="mt-2 font-normal">{plan.bestTimeToVisit}</p>
            </div>
          )}

          {plan.weather && (
            <div className="result-section p-5">
              <p className="tour-label text-[var(--muted)]">Weather</p>
              <p className="mt-2 leading-6">{plan.weather}</p>
            </div>
          )}
        </div>
      )}

      {result.specialRequest && (
        <div className="result-section mt-4 p-5">
          <p className="tour-label text-[var(--muted)]">Special Request</p>
          <p className="mt-2 break-words text-sm leading-6">
            {result.specialRequest}
          </p>
        </div>
      )}

      {Object.keys(budgetBreakdown).length > 0 && (
        <div className="result-section mt-8 p-5 sm:p-6">
          <SectionTitle
            icon={Wallet}
            title="Budget Breakdown"
            subtitle={`Estimated total: ${money(
              plan.estimatedCost || result.budget,
            )}`}
          />

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {[
              ["Hotel", budgetBreakdown.hotel],
              ["Food", budgetBreakdown.food],
              ["Transport", budgetBreakdown.transport],
              ["Activities", budgetBreakdown.activities],
              ["Shopping", budgetBreakdown.shopping],
              ["Remaining", budgetBreakdown.remaining],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-xl bg-[rgba(75,179,160,.07)] p-4"
              >
                <p className="text-xs text-[var(--muted)]">{label}</p>
                <p className="mt-1 font-medium">{money(value)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {dailyPlan.length > 0 && (
        <div className="mt-8">
          <SectionTitle
            icon={CalendarDays}
            title="Daily Itinerary"
            subtitle="A practical day-by-day plan for your journey."
          />

          <div className="space-y-4">
            {dailyPlan.map((day, index) => (
              <motion.div
                key={`${day.day || index}-${index}`}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="result-item overflow-hidden p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--teal)] text-sm font-medium text-white">
                    {day.day || index + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="text-xl font-medium">
                      {day.title || `Day ${index + 1}`}
                    </h4>

                    {Array.isArray(day.activities) &&
                      day.activities.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {day.activities.map((activity, activityIndex) => (
                            <div
                              key={activityIndex}
                              className="flex items-start gap-2 text-sm leading-6"
                            >
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--teal)]" />

                              <span className="break-words">
                                {typeof activity === "string"
                                  ? activity
                                  : JSON.stringify(activity)}
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
        <div className="result-section mt-8 p-5 sm:p-6">
          <SectionTitle
            icon={Hotel}
            title="Recommended Hotels"
            subtitle="Accommodation options matching your hotel preference."
          />

          <div className="grid gap-4 md:grid-cols-2">
            {hotels.map((hotel, index) => (
              <div
                key={`${hotel.name || "hotel"}-${index}`}
                className="result-item p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <h4 className="min-w-0 break-words font-medium">
                    {hotel.name}
                  </h4>

                  {hotel.rating && (
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-[rgba(207,157,75,.14)] px-2 py-1 text-xs">
                      <Star size={12} />
                      {hotel.rating}
                    </span>
                  )}
                </div>

                {hotel.pricePerNight && (
                  <p className="mt-2 text-sm text-[var(--teal)]">
                    {hotel.pricePerNight}
                  </p>
                )}

                {hotel.reason && (
                  <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                    {hotel.reason}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {restaurants.length > 0 && (
        <div className="result-section mt-8 p-5 sm:p-6">
          <SectionTitle
            icon={Coffee}
            title="Recommended Restaurants"
            subtitle="Places to eat according to your food preference."
          />

          <div className="grid gap-4 md:grid-cols-2">
            {restaurants.map((restaurant, index) => (
              <div
                key={`${restaurant.name || "restaurant"}-${index}`}
                className="result-item p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <h4 className="min-w-0 break-words font-medium">
                    {restaurant.name}
                  </h4>

                  {restaurant.rating && (
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-[rgba(207,157,75,.14)] px-2 py-1 text-xs">
                      <Star size={12} />
                      {restaurant.rating}
                    </span>
                  )}
                </div>

                {restaurant.speciality && (
                  <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                    {restaurant.speciality}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {touristPlaces.length > 0 && (
        <div className="result-section mt-8 p-5 sm:p-6">
          <SectionTitle
            icon={Map}
            title="Places To Visit"
            subtitle="Must-see attractions for your trip."
          />

          <div className="grid gap-4 md:grid-cols-2">
            {touristPlaces.map((place, index) => (
              <div
                key={`${place.name || "place"}-${index}`}
                className="result-item p-5"
              >
                <h4 className="break-words font-medium">{place.name}</h4>

                {place.description && (
                  <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                    {place.description}
                  </p>
                )}

                {place.entryFee && (
                  <div className="mt-3 inline-flex rounded-full bg-[rgba(75,179,160,.1)] px-3 py-1 text-xs text-[var(--teal)]">
                    Entry: {place.entryFee}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {hiddenGems.length > 0 && (
        <div className="result-section mt-8 p-5 sm:p-6">
          <SectionTitle
            icon={MapPin}
            title="Hidden Gems"
            subtitle="Less obvious places worth exploring."
          />

          <div className="grid gap-4 md:grid-cols-2">
            {hiddenGems.map((gem, index) => (
              <div
                key={`${gem.name || "gem"}-${index}`}
                className="result-item p-5"
              >
                <h4 className="break-words font-medium">{gem.name}</h4>

                {gem.description && (
                  <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                    {gem.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {(shoppingPlaces.length > 0 || localFoods.length > 0) && (
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {shoppingPlaces.length > 0 && (
            <div className="result-section p-5 sm:p-6">
              <SectionTitle icon={ShoppingBag} title="Shopping" />

              <div className="space-y-2">
                {shoppingPlaces.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-xl bg-white/70 px-4 py-3 text-sm leading-6"
                  >
                    {typeof item === "string" ? item : JSON.stringify(item)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {localFoods.length > 0 && (
            <div className="result-section p-5 sm:p-6">
              <SectionTitle icon={Utensils} title="Local Foods" />

              <div className="space-y-2">
                {localFoods.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-xl bg-white/70 px-4 py-3 text-sm leading-6"
                  >
                    {typeof item === "string" ? item : JSON.stringify(item)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {(packingList.length > 0 || travelTips.length > 0) && (
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {packingList.length > 0 && (
            <div className="result-section p-5 sm:p-6">
              <SectionTitle icon={Backpack} title="Packing List" />

              <div className="grid gap-2 sm:grid-cols-2">
                {packingList.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 rounded-xl bg-white/70 px-4 py-3 text-sm"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--teal)]" />

                    <span className="break-words">
                      {typeof item === "string"
                        ? item
                        : JSON.stringify(item)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {travelTips.length > 0 && (
            <div className="result-section p-5 sm:p-6">
              <SectionTitle icon={Lightbulb} title="Travel Tips" />

              <div className="space-y-2">
                {travelTips.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 rounded-xl bg-white/70 px-4 py-3 text-sm leading-6"
                  >
                    <Lightbulb
                      size={15}
                      className="mt-1 shrink-0 text-[var(--gold)]"
                    />

                    <span className="break-words">
                      {typeof item === "string"
                        ? item
                        : JSON.stringify(item)}
                    </span>
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
          <div className="result-section mt-8 p-5 sm:p-6">
            <SectionTitle
              icon={ShieldCheck}
              title="Emergency Contacts"
              subtitle="Keep these details available during your journey."
            />

            <div className="grid gap-3 sm:grid-cols-3">
              {plan.emergencyContacts.hospital && (
                <div className="flex items-start gap-3 rounded-xl bg-white/70 p-4">
                  <Hospital
                    size={18}
                    className="mt-0.5 shrink-0 text-[var(--teal)]"
                  />

                  <div>
                    <p className="text-xs text-[var(--muted)]">Hospital</p>

                    <p className="mt-1 text-sm">
                      {plan.emergencyContacts.hospital}
                    </p>
                  </div>
                </div>
              )}

              {plan.emergencyContacts.police && (
                <div className="flex items-start gap-3 rounded-xl bg-white/70 p-4">
                  <ShieldCheck
                    size={18}
                    className="mt-0.5 shrink-0 text-[var(--teal)]"
                  />

                  <div>
                    <p className="text-xs text-[var(--muted)]">Police</p>

                    <p className="mt-1 text-sm">
                      {plan.emergencyContacts.police}
                    </p>
                  </div>
                </div>
              )}

              {plan.emergencyContacts.helpline && (
                <div className="flex items-start gap-3 rounded-xl bg-white/70 p-4">
                  <Phone
                    size={18}
                    className="mt-0.5 shrink-0 text-[var(--teal)]"
                  />

                  <div>
                    <p className="text-xs text-[var(--muted)]">Helpline</p>

                    <p className="mt-1 text-sm">
                      {plan.emergencyContacts.helpline}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      <div className="mt-10 border-t border-[rgba(29,43,48,.1)] pt-8">
        <div className="text-center">
          <p className="tour-label text-[var(--muted)]">
            Tour Plan Status
          </p>

          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Confirm or cancel your tour plan.
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onConfirm}
            disabled={
              actionLoading ||
              isConfirmed ||
              isCancelled
            }
            className="flex min-h-13 items-center justify-center gap-2 rounded-xl bg-[var(--teal)] px-5 py-3 text-sm font-medium text-white shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
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
            disabled={
              actionLoading ||
              isCancelled ||
              isConfirmed
            }
            className="flex min-h-13 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
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
          <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
            <Check size={16} />
            Your trip plan has been confirmed.
          </div>
        )}

        {isCancelled && (
          <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle size={16} />
            Your trip plan has been cancelled.
          </div>
        )}
      </div>
    </motion.div>
  );
};

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

  const [activeLocation, setActiveLocation] = useState(null);
  const [activeSelect, setActiveSelect] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingTrip, setLoadingTrip] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [tourResult, setTourResult] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState(
    loadingMessages[0],
  );

  const reduceMotion = useReducedMotion();

  const budgetNumber = Number(form.budget);

  const budgetIsInvalid =
    form.budget !== "" &&
    (!Number.isFinite(budgetNumber) || budgetNumber < 5000);

  useEffect(() => {
    if (!loading) {
      setLoadingMessage(loadingMessages[0]);
      return;
    }

    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % loadingMessages.length;
      setLoadingMessage(loadingMessages[index]);
    }, 2600);

    return () => clearInterval(interval);
  }, [loading]);

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

        const trip =
          responseData?.data ??
          responseData?.trip ??
          responseData;

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

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFieldErrors((prev) => {
      if (!prev[name]) return prev;

      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const getBudgetMessage = (budget) => {
    if (!Number.isFinite(budget) || budget < 1000) {
      return (
        "😂 Are you kidding? ₹" +
        (Number.isFinite(budget)
          ? budget.toLocaleString("en-IN")
          : "0") +
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
        toast.error(
          responseData?.message || "Unable to generate tour plan",
        );
        return;
      }

      const createdTrip = responseData?.data;

      if (!createdTrip) {
        toast.error(
          responseData?.message ||
            "Tour was created but no trip data was returned",
        );
        return;
      }

      const createdTripId =
        createdTrip.tripId ||
        createdTrip._id ||
        createdTrip.id ||
        createdTrip.trip?._id ||
        createdTrip.trip?.tripId ||
        createdTrip.trip?.id;

      if (!createdTripId) {
        setTourResult(createdTrip);

        toast.success(
          responseData.message ||
            "Tour plan generated successfully",
        );

        return;
      }

      toast.success(
        responseData.message || "Tour plan saved successfully",
      );

      navigate(`/tour/${createdTripId}`, {
        replace: true,
      });
    } catch (error) {
      console.error("CREATE TOUR ERROR:", error);

      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error?.message;

      const statusCode =
        error?.response?.status ||
        error?.response?.data?.error?.code;

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

  const handleConfirmTrip = async () => {
    if (
      !tripId ||
      actionLoading ||
      tourResult?.status === "Booked" ||
      tourResult?.status === "Cancelled"
    ) {
      return;
    }

    try {
      setActionLoading(true);

      const response = await confirmTrip(tripId);

      const body =
        response?.data &&
        typeof response.data === "object"
          ? response.data
          : response;

      if (body?.status === false) {
        throw new Error(
          body.message || "Unable to confirm trip plan",
        );
      }

      const updated =
        body?.data?.data &&
        typeof body.data.data === "object"
          ? body.data.data
          : body?.data &&
              typeof body.data === "object"
            ? body.data
            : null;

      setTourResult((previous) => ({
        ...previous,
        ...(updated || {}),
        status: "Booked",
        isBooked: true,
      }));

      toast.success(
        body?.message ||
          "Trip plan confirmed successfully",
      );
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
      !tripId ||
      actionLoading ||
      tourResult?.status === "Cancelled" ||
      tourResult?.status === "Booked"
    ) {
      return;
    }

    try {
      setActionLoading(true);

      const response = await cancelTrip(tripId);

      const body =
        response?.data &&
        typeof response.data === "object"
          ? response.data
          : response;

      if (body?.status === false) {
        throw new Error(
          body.message || "Unable to cancel trip plan",
        );
      }

      const updated =
        body?.data?.data &&
        typeof body.data.data === "object"
          ? body.data.data
          : body?.data &&
              typeof body.data === "object"
            ? body.data
            : null;

      setTourResult((previous) => ({
        ...previous,
        ...(updated || {}),
        status: "Cancelled",
        isBooked: false,
      }));

      toast.success(
        body?.message ||
          "Trip plan cancelled successfully",
      );
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

  const origin =
    form.startLocation.trim().toUpperCase() || "ORIGIN";

  const destination =
    form.destination.trim().toUpperCase() || "DESTINATION";

  if (loadingTrip) {
    return (
      <main className="tour-page flex min-h-screen items-center justify-center px-4">
        <style>{styles}</style>

        <div className="w-full max-w-md text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(75,179,160,.12)]">
            <Loader2
              size={25}
              className="animate-spin text-[var(--teal)]"
            />
          </div>

          <h2 className="mt-5 text-2xl font-medium text-white">
            Loading your trip
          </h2>

          <p className="mt-2 text-sm font-normal text-white/50">
            Fetching your saved tour plan...
          </p>
        </div>
      </main>
    );
  }

  if (isViewingTrip && !tourResult) {
    return (
      <main className="tour-page flex min-h-screen items-center justify-center px-4">
        <style>{styles}</style>

        <div className="w-full max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(207,157,75,.12)]">
            <MapPin
              size={28}
              className="text-[var(--gold-light)]"
            />
          </div>

          <h2 className="mt-5 text-2xl font-medium text-white">
            Trip not found
          </h2>

          <p className="mt-2 text-sm leading-6 text-white/50">
            We could not find this saved travel plan.
          </p>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--gold)] to-[var(--gold-light)] px-5 py-3 text-sm font-medium text-[var(--ink)] transition hover:opacity-90"
          >
            Back to Dashboard
            <ArrowRight size={17} />
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="tour-page min-h-screen overflow-x-hidden px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <style>{styles}</style>

      <div className="mx-auto w-full max-w-5xl">
        {isViewingTrip ? (
          <>
            <div className="text-center">
              <h1 className="mb-4 text-4xl text-white">
                Your Tour Plan
              </h1>

              <p className="tour-subtitle mx-auto mb-5 max-w-xl text-white/90">
                Your personalized travel plan is ready.
              </p>
            </div>

            <TourResult
              result={tourResult}
              onConfirm={handleConfirmTrip}
              onCancel={handleCancelTrip}
              actionLoading={actionLoading}
            />
          </>
        ) : (
          <>
            <div className="mb-10 text-center">
              <h1 className="mt-3 text-4xl font-bold text-[#4d4dff]">
                Create Your Tour
              </h1>

              <p className="tour-subtitle mx-auto mt-4 max-w-xl text-white/90">
                Choose your starting location, destination, budget
                and travel preferences.
              </p>
            </div>

            {loading ? (
              <TourLoading message={loadingMessage} />
            ) : (
              <motion.form
                onSubmit={handleSubmit}
                initial={
                  reduceMotion
                    ? false
                    : {
                        opacity: 0,
                        y: 12,
                      }
                }
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.4,
                }}
                className="ticket-card relative overflow-visible"
              >
                <div className="flex flex-col gap-5 px-6 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-9">
                  <div className="min-w-0 flex-1">
                    <p className="tour-label text-[var(--muted)]">
                      From
                    </p>

                    <p className="mt-1 truncate text-xl font-normal">
                      {origin.length > 20
                        ? `${origin.slice(0, 20)}…`
                        : origin}
                    </p>
                  </div>

                  <div className="flex h-10 w-10 shrink-0 self-center items-center justify-center rounded-full bg-[rgba(75,179,160,.15)] text-[var(--teal)]">
                    <Navigation size={17} />
                  </div>

                  <div className="min-w-0 flex-1 sm:text-right">
                    <p className="tour-label text-[var(--muted)]">
                      To
                    </p>

                    <p className="mt-1 truncate text-xl font-normal">
                      {destination.length > 20
                        ? `${destination.slice(0, 20)}…`
                        : destination}
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <span
                    className="ticket-notch -left-3 -translate-x-1/2"
                    style={{ top: "-0.875rem" }}
                  />

                  <span
                    className="ticket-notch -right-3 translate-x-1/2"
                    style={{ top: "-0.875rem" }}
                  />

                  <div className="ticket-perf" />
                </div>

                <div className="px-6 py-7 sm:px-9 sm:py-9">
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <h2 className="tour-label text-[var(--muted)]">
                      Passenger & Trip Details
                    </h2>

                    <span className="tour-label rounded-full border border-[rgba(29,43,48,.15)] bg-white/40 px-2.5 py-1 text-[var(--muted)]">
                      Required Fields
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                    />

                    <div
                      className={`relative w-full ${
                        budgetIsInvalid ? "z-[200]" : "z-10"
                      }`}
                    >
                      <NumberField
                        name="budget"
                        label="Budget"
                        icon={Wallet}
                        step={100}
                        minimum={5000}
                        prefix="₹"
                        value={form.budget}
                        setForm={setForm}
                        setFieldErrors={setFieldErrors}
                        error={fieldErrors.budget}
                      />

                      <AnimatePresence>
                        {budgetIsInvalid && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{
                              duration: 0.18,
                              ease: "easeOut",
                            }}
                            className="budget-warning absolute left-0 right-0 top-[calc(100%+8px)] z-[9999] rounded-2xl px-4 py-3"
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[rgba(207,157,75,.18)]">
                                <AlertCircle
                                  size={17}
                                  className="text-[var(--gold)]"
                                />
                              </div>

                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-white">
                                  Budget must be at least ₹5,000
                                </p>

                                <p className="mt-1 text-xs leading-5 text-white/75">
                                  {getBudgetMessage(budgetNumber) ||
                                    "Please enter a budget of ₹5,000 or more for your trip."}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

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
                      value={form.travelType}
                      handleChange={handleChange}
                      options={[
                        "Solo",
                        "Couple",
                        "Family",
                        "Friends",
                        "Business",
                      ]}
                      activeSelect={activeSelect}
                      setActiveSelect={setActiveSelect}
                      error={fieldErrors.travelType}
                    />

                    <SelectField
                      name="hotelType"
                      label="Hotel Type"
                      icon={Hotel}
                      value={form.hotelType}
                      handleChange={handleChange}
                      options={[
                        "Budget",
                        "Standard",
                        "Luxury",
                      ]}
                      activeSelect={activeSelect}
                      setActiveSelect={setActiveSelect}
                      error={fieldErrors.hotelType}
                    />

                    <SelectField
                      name="transport"
                      label="Transport"
                      icon={Bus}
                      value={form.transport}
                      handleChange={handleChange}
                      options={[
                        "Car",
                        "Bike",
                        "Bus",
                        "Train",
                        "Flight",
                        "Any",
                      ]}
                      activeSelect={activeSelect}
                      setActiveSelect={setActiveSelect}
                      error={fieldErrors.transport}
                    />

                    <SelectField
                      name="foodPreference"
                      label="Food Preference"
                      icon={Utensils}
                      value={form.foodPreference}
                      handleChange={handleChange}
                      options={[
                        "Vegetarian",
                        "Non-Vegetarian",
                        "Vegan",
                        "Jain",
                        "Any",
                      ]}
                      activeSelect={activeSelect}
                      setActiveSelect={setActiveSelect}
                      error={fieldErrors.foodPreference}
                    />

                    <div className="md:col-span-2">
                      <div
                        className={`${fieldWrap} min-h-[130px]`}
                      >
                        <label className={labelCls}>
                          Special Request
                        </label>

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
                            className="tour-input min-h-[90px] w-full resize-none bg-transparent pr-2 outline-none placeholder:text-[var(--muted)]/50"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <span
                    className="ticket-notch -left-3 -translate-x-1/2"
                    style={{ top: "-0.875rem" }}
                  />

                  <span
                    className="ticket-notch -right-3 translate-x-1/2"
                    style={{ top: "-0.875rem" }}
                  />

                  <div className="ticket-perf" />
                </div>

                <div className="px-6 py-6 sm:px-9 sm:py-8">
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={
                      loading ? {} : { y: -2 }
                    }
                    whileTap={
                      loading ? {} : { scale: 0.98 }
                    }
                    className="group flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[var(--gold)] to-[var(--gold-light)] px-6 text-[var(--ink)] shadow-lg transition disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span className="tour-button uppercase">
                      Create Tour Plan
                    </span>

                    <ArrowRight
                      size={18}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </motion.button>
                </div>
              </motion.form>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default Tour;