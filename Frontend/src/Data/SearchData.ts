export type SearchItemType =
  | "tour"
  | "birthday"
  | "event"
  | "corporate"
  | "feature"
  | "page";

export interface SearchItem {
  id: string;
  title: string;
  description: string;
  type: SearchItemType;
  keywords: string[];
  route: string;
}

export const searchItems: SearchItem[] = [
  // =========================
  // TOURS
  // =========================
  {
    id: "tour-planner",
    title: "Tour Planning",
    description: "Create and organize your perfect tour and travel plans.",
    type: "tour",
    keywords: [
      "tour",
      "travel",
      "trip",
      "vacation",
      "holiday",
      "journey",
      "travel plan",
      "trip planner",
    ],
    route: "/tour",
  },

  {
    id: "goa-tour",
    title: "Goa Tour",
    description: "Plan a relaxing beach vacation and explore Goa.",
    type: "tour",
    keywords: [
      "goa",
      "beach",
      "sea",
      "vacation",
      "holiday",
      "travel",
      "party",
      "tour",
    ],
    route: "/tour",
  },

  {
    id: "manali-tour",
    title: "Manali Tour",
    description: "Plan a mountain getaway and explore Manali.",
    type: "tour",
    keywords: [
      "manali",
      "mountain",
      "snow",
      "hill",
      "hills",
      "winter",
      "travel",
      "tour",
    ],
    route: "/tour",
  },

  {
    id: "weekend-trip",
    title: "Weekend Trip",
    description: "Create a quick and memorable weekend travel plan.",
    type: "tour",
    keywords: [
      "weekend",
      "short trip",
      "holiday",
      "travel",
      "vacation",
      "nearby trip",
      "quick trip",
    ],
    route: "/tour",
  },

  {
    id: "family-trip",
    title: "Family Trip",
    description: "Plan a comfortable and enjoyable family vacation.",
    type: "tour",
    keywords: [
      "family",
      "family trip",
      "family vacation",
      "kids",
      "children",
      "holiday",
      "travel",
    ],
    route: "/tour",
  },

  {
    id: "romantic-trip",
    title: "Romantic Trip",
    description: "Plan a memorable romantic getaway.",
    type: "tour",
    keywords: [
      "romantic",
      "couple",
      "honeymoon",
      "love",
      "date",
      "vacation",
      "travel",
    ],
    route: "/tour",
  },

  {
    id: "adventure-trip",
    title: "Adventure Trip",
    description: "Create an exciting adventure travel plan.",
    type: "tour",
    keywords: [
      "adventure",
      "trek",
      "trekking",
      "camping",
      "hiking",
      "rafting",
      "outdoor",
      "travel",
    ],
    route: "/tour",
  },

  {
    id: "budget-travel",
    title: "Budget Travel",
    description: "Plan a great trip while staying within your budget.",
    type: "feature",
    keywords: [
      "budget",
      "cheap",
      "affordable",
      "low cost",
      "saving",
      "money",
      "budget trip",
      "budget travel",
    ],
    route: "/tour",
  },

  // =========================
  // BIRTHDAY
  // =========================
  {
    id: "birthday-planner",
    title: "Birthday Planning",
    description: "Plan birthdays, parties and memorable celebrations.",
    type: "birthday",
    keywords: [
      "birthday",
      "birthday plan",
      "birthday planner",
      "party",
      "celebration",
      "cake",
      "surprise",
      "birthday party",
    ],
    route: "/birthday",
  },

  {
    id: "birthday-party",
    title: "Birthday Party",
    description: "Organize a fun birthday party for your special day.",
    type: "birthday",
    keywords: [
      "birthday party",
      "party",
      "cake",
      "decoration",
      "celebration",
      "friends",
      "family",
    ],
    route: "/birthday",
  },

  {
    id: "birthday-surprise",
    title: "Birthday Surprise",
    description: "Plan a special surprise birthday experience.",
    type: "birthday",
    keywords: [
      "birthday surprise",
      "surprise",
      "gift",
      "birthday",
      "celebration",
      "party",
    ],
    route: "/birthday",
  },

  // =========================
  // EVENTS
  // =========================
  {
    id: "event-planner",
    title: "Event Planning",
    description: "Create and organize your next event.",
    type: "event",
    keywords: [
      "event",
      "event planning",
      "event planner",
      "function",
      "celebration",
      "program",
      "gathering",
    ],
    route: "/event",
  },

  {
    id: "social-event",
    title: "Social Event",
    description: "Plan gatherings, celebrations and social events.",
    type: "event",
    keywords: [
      "social",
      "party",
      "gathering",
      "celebration",
      "function",
      "event",
    ],
    route: "/event",
  },

  // =========================
  // CORPORATE
  // =========================
  {
    id: "corporate-planner",
    title: "Corporate Planning",
    description: "Plan corporate trips, meetings and business events.",
    type: "corporate",
    keywords: [
      "corporate",
      "business",
      "office",
      "company",
      "team",
      "employee",
      "meeting",
      "business event",
    ],
    route: "/corporate",
  },

  {
    id: "corporate-trip",
    title: "Corporate Trip",
    description: "Organize a professional corporate travel experience.",
    type: "corporate",
    keywords: [
      "corporate trip",
      "business trip",
      "office trip",
      "team trip",
      "company trip",
      "travel",
    ],
    route: "/corporate",
  },

  // =========================
  // FEATURES
  // =========================
  {
    id: "smart-planning",
    title: "Smart Planning",
    description: "Create personalized plans based on your preferences.",
    type: "feature",
    keywords: [
      "smart",
      "smart planning",
      "personalized",
      "recommendation",
      "recommendations",
      "planning",
    ],
    route: "/tour",
  },

  {
    id: "support",
    title: "24/7 Support",
    description: "Get assistance whenever you need help with your plans.",
    type: "feature",
    keywords: [
      "support",
      "help",
      "customer support",
      "assistance",
      "contact",
      "service",
    ],
    route: "/support",
  },

  {
    id: "notifications",
    title: "Notifications",
    description: "View your latest updates and planning notifications.",
    type: "page",
    keywords: [
      "notification",
      "notifications",
      "updates",
      "alerts",
      "messages",
    ],
    route: "/notification",
  },

  // =========================
  // ACCOUNT / PAGES
  // =========================
  {
    id: "profile",
    title: "My Profile",
    description: "View and manage your Service Planner profile.",
    type: "page",
    keywords: [
      "profile",
      "account",
      "user",
      "my account",
      "personal information",
    ],
    route: "/profile",
  },

  {
    id: "dashboard",
    title: "Dashboard",
    description: "View and manage your Service Planner activities.",
    type: "page",
    keywords: ["dashboard", "home", "overview", "plans", "activities"],
    route: "/dashboard",
  },

  {
    id: "change-password",
    title: "Change Password",
    description: "Update your Service Planner account password.",
    type: "page",
    keywords: ["password", "change password", "security", "account security"],
    route: "/change-password",
  },

  {
    id: "home",
    title: "Service Planner Home",
    description: "Explore tours, birthdays, events and planning services.",
    type: "page",
    keywords: ["home", "service planner", "services", "planning", "start"],
    route: "/",
  },
];

export default searchItems;
