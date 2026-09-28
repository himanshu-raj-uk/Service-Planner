import { useEffect, useRef, useState } from "react";
import {
  X,
  ChevronRight,
  User,
  Bell,
  Plane,
  Cake,
  CheckCircle2,
  Clock,
  Trash2,
  Search,
  Sparkles,
  Headphones,
  CalendarDays,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

import {
  getUserProfile,
  getNotifications,
  getUnreadNotification,
  deleteNotification,
  deleteAllNotifications,
  markAllNotificationsAsRead,
} from "../../Services/AuthAPI";

import searchPlanner from "../../Services/SearchServices";
import { searchItems } from "../../Data/SearchData";

const LAST_KNOWN_USER_KEY = "sp_navbar_last_known_user";

const readLastKnownUser = () => {
  try {
    const raw = window.localStorage.getItem(LAST_KNOWN_USER_KEY);

    if (!raw) return null;

    const parsed = JSON.parse(raw);

    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed;
    }

    return null;
  } catch {
    return null;
  }
};

const writeLastKnownUser = (userData) => {
  try {
    if (userData) {
      window.localStorage.setItem(
        LAST_KNOWN_USER_KEY,
        JSON.stringify({
          name: userData?.name || "",
          profileImage: userData?.profileImage || null,
        })
      );
    } else {
      window.localStorage.removeItem(LAST_KNOWN_USER_KEY);
    }
  } catch {
    // Ignore storage errors (private browsing, quota, etc.)
  }
};

let cachedUser = readLastKnownUser();

let inFlightRequest = null;
const runProfileCheck = () => {
  if (inFlightRequest) return inFlightRequest;

  inFlightRequest = getUserProfile()
    .then((response) => {
      const userData = response?.data?.data || null;

      const normalized =
        userData &&
          typeof userData === "object" &&
          !Array.isArray(userData)
          ? userData
          : null;

      cachedUser = normalized;
      writeLastKnownUser(normalized);

      return normalized;
    })
    .catch((error) => {
      console.error("FETCH USER PROFILE ERROR:", error);

      cachedUser = null;
      writeLastKnownUser(null);

      return null;
    })
    .finally(() => {
      inFlightRequest = null;
    });

  return inFlightRequest;
};

/* =========================================================
   SEARCH ICON
========================================================= */

const getSearchIcon = (item) => {
  const value = `${item?.title || ""} ${item?.category || ""} ${item?.type || ""
    }`.toLowerCase();

  if (
    value.includes("travel") ||
    value.includes("tour") ||
    value.includes("trip")
  ) {
    return <Plane size={18} strokeWidth={2} />;
  }

  if (
    value.includes("birthday") ||
    value.includes("party") ||
    value.includes("surprise")
  ) {
    return <Cake size={18} strokeWidth={2} />;
  }

  if (value.includes("event")) {
    return <CalendarDays size={18} strokeWidth={2} />;
  }

  if (
    value.includes("support") ||
    value.includes("customer")
  ) {
    return <Headphones size={18} strokeWidth={2} />;
  }

  return <Sparkles size={18} strokeWidth={2} />;
};

/* =========================================================
   DYNAMIC PLACEHOLDER COLORS
========================================================= */

const getPlaceholderColor = (value = "") => {
  const text = value.toLowerCase();

  if (
    text.includes("birthday party") ||
    text.includes("birthday planning")
  ) {
    return "text-blue-600 dark:text-blue-400";
  }

  if (
    text.includes("birthday surprise") ||
    text.includes("surprise")
  ) {
    return "text-pink-500 dark:text-pink-400";
  }

  if (
    text.includes("travel") ||
    text.includes("tour") ||
    text.includes("trip")
  ) {
    return "text-emerald-500 dark:text-emerald-400";
  }

  if (
    text.includes("event") ||
    text.includes("events")
  ) {
    return "text-cyan-500 dark:text-cyan-400";
  }

  if (
    text.includes("support") ||
    text.includes("customer")
  ) {
    return "text-orange-500 dark:text-orange-400";
  }

  if (
    text.includes("dashboard") ||
    text.includes("planner")
  ) {
    return "text-violet-500 dark:text-violet-400";
  }

  if (
    text.includes("service") ||
    text.includes("home")
  ) {
    return "text-indigo-500 dark:text-indigo-400";
  }

  return "text-blue-600 dark:text-blue-400";
};

/* =========================================================
   SEARCH BOX
========================================================= */

const SearchBox = ({
  mobile = false,
  searchRef,
  mobileSearchRef,
  searchQuery,
  setSearchQuery,
  searchFocused,
  setSearchFocused,
  currentPlaceholder,
  searchResults,
  showSearchResults,
  handleSearchSubmit,
  handleSearchSelect,
  clearSearch,
}) => {
  const wrapperRef = mobile ? mobileSearchRef : searchRef;

  const placeholderColor =
    getPlaceholderColor(currentPlaceholder);

  return (
    <div
      ref={wrapperRef}
      className={`
        relative
        w-full
        min-w-0
        ${mobile ? "max-w-none" : "max-w-none flex-1"}
      `}
    >
      <form
        onSubmit={handleSearchSubmit}
        className="w-full"
      >
        <div
          className="
            flex
            h-11
            w-full
            min-w-0
            items-center
            overflow-hidden
            rounded-full
            border
            border-transparent
            bg-[var(--app-surface-secondary)]
            shadow-[0_2px_10px_rgba(15,23,42,0.07)]
            transition-all
            duration-150
            focus-within:border-blue-500
            dark:focus-within:border-blue-400
            sm:h-12
          "
        >
          <Search
            size={20}
            strokeWidth={2.5}
            className="
              ml-3
              shrink-0
              text-[var(--text-secondary)]
              sm:ml-4
              sm:h-[21px]
              sm:w-[21px]
            "
          />

          <div className="relative h-full min-w-0 flex-1">
            {!searchQuery && (
              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  z-0
                  flex
                  h-full
                  w-full
                  min-w-0
                  items-center
                  overflow-hidden
                  whitespace-nowrap
                  px-2.5
                  sm:px-3
                "
              >
                <span
                  className="
                    shrink-0
                    text-[13px]
                    font-bold
                    leading-none
                    text-[var(--text-primary)]
                    sm:text-[15px]
                  "
                >
                  Search&nbsp;
                </span>

                <span
                  className={`
                    min-w-0
                    flex-1
                    truncate
                    text-[13px]
                    font-bold
                    leading-none
                    sm:text-[15px]
                    ${placeholderColor}
                  `}
                >
                  {currentPlaceholder}
                </span>
              </div>
            )}

            <input
              type="text"
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setSearchFocused(true);
              }}
              onFocus={() => {
                setSearchFocused(true);
              }}
              aria-label="Search plans and services"
              autoComplete="off"
              spellCheck="false"
              className="
                navbar-search-input
                relative
                z-10
                block
                h-full
                w-full
                min-w-0
                !cursor-text
                !border-0
                !outline-none
                !ring-0
                !shadow-none
                bg-transparent
                px-2.5
                text-[13px]
                font-bold
                leading-none
                text-[var(--text-primary)]
                caret-blue-600
                placeholder:text-transparent
                dark:caret-blue-400
                sm:px-3
                sm:text-[15px]
              "
            />
          </div>

          {searchQuery && (
            <button
              type="button"
              onMouseDown={(event) => {
                event.preventDefault();
              }}
              onClick={clearSearch}
              aria-label="Clear search"
              className="
                mr-1.5
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-transparent
                text-[var(--text-muted)]
                transition-colors
                duration-150
                hover:bg-[var(--app-surface)]
                hover:text-[var(--text-primary)]
                active:scale-90
                sm:mr-2
              "
            >
              <X size={17} strokeWidth={2} />
            </button>
          )}
        </div>
      </form>

      {showSearchResults && (
        <div
          className="
            absolute
            left-0
            right-0
            top-[calc(100%+8px)]
            z-[180]
            overflow-hidden
            rounded-2xl
            border
            border-[var(--border-color)]
            bg-[var(--app-surface)]
            shadow-[0_18px_45px_rgba(15,23,42,0.16)]
          "
        >
          <div
            className="
              border-b
              border-[var(--border-color)]
              px-4
              py-3
            "
          >
            <p
              className="
                text-[11px]
                font-bold
                uppercase
                tracking-[0.12em]
                text-[var(--text-muted)]
              "
            >
              Search Results
            </p>
          </div>

          <div
            className="
              max-h-[min(430px,calc(100vh-150px))]
              overflow-y-auto
              overscroll-contain
              p-2
            "
          >
            {searchResults.length > 0 ? (
              searchResults.map((item, index) => (
                <button
                  key={
                    item?.id ||
                    item?.route ||
                    `${item?.title}-${index}`
                  }
                  type="button"
                  onMouseDown={(event) => {
                    event.preventDefault();
                  }}
                  onClick={() =>
                    handleSearchSelect(item)
                  }
                  className="
                    group
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-xl
                    px-2.5
                    py-3
                    text-left
                    transition-colors
                    duration-150
                    hover:bg-blue-50
                    dark:hover:bg-blue-500/10
                    focus:bg-blue-50
                    focus:outline-none
                    dark:focus:bg-blue-500/10
                  "
                >
                  <span
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-indigo-50
                      text-indigo-600
                      dark:bg-indigo-500/10
                      dark:text-indigo-400
                    "
                  >
                    {getSearchIcon(item)}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span
                      className="
                        block
                        truncate
                        text-[14px]
                        font-bold
                        text-[var(--text-primary)]
                        sm:text-[15px]
                      "
                    >
                      {item?.title}
                    </span>

                    {item?.description && (
                      <span
                        className="
                          mt-0.5
                          block
                          truncate
                          text-[12px]
                          leading-5
                          text-[var(--text-secondary)]
                          sm:text-[13px]
                        "
                      >
                        {item?.description}
                      </span>
                    )}
                  </span>

                  <ChevronRight
                    size={17}
                    className="
                      shrink-0
                      text-[var(--text-disabled)]
                      transition-colors
                      duration-150
                      group-hover:text-blue-500
                    "
                  />
                </button>
              ))
            ) : (
              <div className="px-5 py-8 text-center">
                <div
                  className="
                    mx-auto
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    bg-[var(--app-surface-secondary)]
                    text-[var(--text-muted)]
                  "
                >
                  <Search size={18} />
                </div>

                <p
                  className="
                    mt-3
                    text-sm
                    font-medium
                    text-[var(--text-primary)]
                  "
                >
                  No results found
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    text-[var(--text-muted)]
                  "
                >
                  Try another plan, event or service.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================
   NAVBAR
========================================================= */

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] =
    useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] =
    useState(false);

  const [placeholderIndex, setPlaceholderIndex] =
    useState(0);

  const [user, setUser] = useState(cachedUser);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [notificationLoading, setNotificationLoading] =
    useState(false);

  const [deletingId, setDeletingId] = useState(null);
  const [deletingAll, setDeletingAll] = useState(false);

  const [profileImageFailed, setProfileImageFailed] =
    useState(false);

  const desktopNotificationRef = useRef(null);
  const mobileNotificationRef = useRef(null);
  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileToggleRef = useRef(null);

  const searchPlaceholders = searchItems
    .filter((item) => item?.title)
    .map((item) => item.title)
    .filter(
      (title, index, array) =>
        array.indexOf(title) === index
    )
    .slice(0, 12);

  useEffect(() => {
    if (!searchPlaceholders.length) return;

    const interval = window.setInterval(() => {
      setPlaceholderIndex(
        (previous) =>
          (previous + 1) %
          searchPlaceholders.length
      );
    }, 2600);

    return () => {
      window.clearInterval(interval);
    };
  }, [searchPlaceholders.length]);

  const currentPlaceholder =
    searchPlaceholders[placeholderIndex] ||
    "plans, events or services";

  const searchResults = searchQuery.trim()
    ? searchPlanner(searchQuery, {
      limit: 7,
    })
    : [];

  const showSearchResults =
    searchFocused &&
    searchQuery.trim().length > 0;

  const handleSearchSelect = (item) => {
    if (!item?.route) return;

    setSearchQuery("");
    setSearchFocused(false);
    setMobileOpen(false);

    navigate(item.route);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    if (!searchQuery.trim()) return;

    const firstResult = searchResults[0];

    if (firstResult) {
      handleSearchSelect(firstResult);
      return;
    }

    toast.error(
      "No matching plans or services found."
    );
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchFocused(false);
  };

  const displayFirstName =
    user?.name?.trim()?.split(/\s+/)?.[0] || "";

  const profileImage =
    user?.profileImage?.url || "";

  useEffect(() => {
    setProfileImageFailed(false);
  }, [profileImage]);

  const showProfileImage =
    Boolean(profileImage) && !profileImageFailed;

  /* =========================================================
     NOTIFICATION HELPERS
  ========================================================= */

  const getId = (notification) => {
    return (
      notification?._id ||
      notification?.id ||
      notification?.notificationId
    );
  };

  const getTripId = (notification) => {
    return (
      notification?.tripId ||
      notification?.data?.tripId ||
      notification?.metadata?.tripId
    );
  };

  const getBirthdayId = (notification) => {
    return (
      notification?.birthdayId ||
      notification?.data?.birthdayId ||
      notification?.metadata?.birthdayId
    );
  };

  const getNotificationTitle = (notification) => {
    return (
      notification?.title ||
      notification?.message ||
      "Notification"
    );
  };

  const getNotificationMessage = (notification) => {
    return (
      notification?.description ||
      notification?.body ||
      notification?.message ||
      ""
    );
  };

  const getNotificationDate = (notification) => {
    const date =
      notification?.createdAt ||
      notification?.date ||
      notification?.timestamp;

    if (!date) return "";

    try {
      return new Date(date).toLocaleDateString(
        undefined,
        {
          day: "numeric",
          month: "short",
        }
      );
    } catch {
      return "";
    }
  };

  const getNotificationIcon = (notification) => {
    const type =
      `${notification?.type || ""} ${notification?.category || ""
        } ${notification?.title || ""}`.toLowerCase();

    if (
      type.includes("birthday") ||
      type.includes("party")
    ) {
      return (
        <Cake
          size={17}
          strokeWidth={2}
        />
      );
    }

    if (
      type.includes("travel") ||
      type.includes("trip") ||
      type.includes("tour")
    ) {
      return (
        <Plane
          size={17}
          strokeWidth={2}
        />
      );
    }

    if (
      type.includes("success") ||
      type.includes("complete")
    ) {
      return (
        <CheckCircle2
          size={17}
          strokeWidth={2}
        />
      );
    }

    return (
      <Clock
        size={17}
        strokeWidth={2}
      />
    );
  };

  const refreshUnreadCount = async () => {
    try {
      const response = await getUnreadNotification();

      const count =
        response?.data?.count ??
        response?.count ??
        response?.data?.unreadCount ??
        response?.unreadCount ??
        0;

      setUnreadCount(Number(count) || 0);
    } catch {
      setUnreadCount(0);
    }
  };

  const fetchNotifications = async () => {
    /*
     * Never request notification data while logged out.
     */
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    try {
      setNotificationLoading(true);

      const response =
        await getNotifications();

      const notificationData =
        response?.data?.notifications ||
        response?.notifications ||
        response?.data ||
        [];

      setNotifications(
        Array.isArray(notificationData)
          ? notificationData
          : []
      );
    } catch {
      setNotifications([]);
    } finally {
      setNotificationLoading(false);
    }
  };

  const openNotifications = async () => {
    /*
     * Extra protection against opening notification APIs
     * while the Navbar is logged out.
     */
    if (!user) return;

    const nextState = !notificationOpen;

    setNotificationOpen(nextState);

    if (nextState) {
      await fetchNotifications();

      try {
        await markAllNotificationsAsRead();
        setUnreadCount(0);
      } catch {
        // Preserve existing behavior.
      }
    }
  };

  const getNotificationRoute = (notification) => {
    const tripId = getTripId(notification);
    const birthdayId = getBirthdayId(notification);

    // Routes defined in App.jsx: /tour/:tripId, /birthday/:birthdayId
    if (tripId) return `/tour/${tripId}`;
    if (birthdayId) return `/birthday/${birthdayId}`;

    // Explicit route sent by the backend (only accept in-app paths)
    const explicitRoute =
      notification?.route ||
      notification?.data?.route ||
      notification?.metadata?.route;

    if (
      typeof explicitRoute === "string" &&
      explicitRoute.startsWith("/") &&
      !explicitRoute.startsWith("//")
    ) {
      return explicitRoute;
    }

    // Fall back to the notification type
    const type =
      `${notification?.type || ""} ${notification?.category || ""
        }`.toLowerCase();

    if (type.includes("corporate")) return "/corporate";
    if (type.includes("event")) return "/event";
    if (type.includes("birthday") || type.includes("party")) {
      return "/birthday";
    }
    if (
      type.includes("travel") ||
      type.includes("trip") ||
      type.includes("tour")
    ) {
      return "/tour";
    }
    if (type.includes("support") || type.includes("ticket")) {
      return "/support";
    }

    // Unknown type: open the full notifications page
    return "/notification";
  };

  const handleNotificationClick = (notification) => {
    setNotificationOpen(false);
    setMobileOpen(false);

    navigate(getNotificationRoute(notification));
  };

  const handleDeleteNotification = async (
    notification
  ) => {
    const id = getId(notification);

    if (!id) return;

    try {
      setDeletingId(id);

      await deleteNotification(id);

      setNotifications((previous) =>
        previous.filter(
          (item) => getId(item) !== id
        )
      );

      setUnreadCount((previous) =>
        Math.max(0, previous - 1)
      );
    } catch {
      toast.error(
        "Unable to delete notification."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteAllNotifications =
    async () => {
      if (!notifications.length) return;

      try {
        setDeletingAll(true);

        await deleteAllNotifications();

        setNotifications([]);
        setUnreadCount(0);
      } catch {
        toast.error(
          "Unable to delete notifications."
        );
      } finally {
        setDeletingAll(false);
      }
    };

  const handleViewAllNotifications = () => {
    setNotificationOpen(false);
    setMobileOpen(false);
    navigate("/notification");
  };

  const closeMenu = () => {
    setMobileOpen(false);
  };

  /* =========================================================
     LIVE AUTH CHECK

     Runs on the initial mount AND every time the route
     changes. This is intentionally simple and has no
     "already checked, skip it" branch - runProfileCheck()
     always asks the API, and its own in-flight dedupe stops
     that from turning into duplicate network calls when
     several triggers fire close together (mount + userLogin
     event + a navigate() call all landing in the same tick,
     for example).

     Net effect: log in anywhere in the app and the very next
     render of the Navbar (no reload needed) shows the correct
     name and photo, because the check re-runs the moment the
     URL changes - which a login redirect always does.
  ========================================================= */

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      const authenticatedUser = await runProfileCheck();

      if (cancelled) return;

      setUser(authenticatedUser);

      if (authenticatedUser) {
        await refreshUnreadCount();
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    };

    check();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  /* =========================================================
     LOGIN EVENT (optional, extra safety net)

     If a login page dispatches:

       window.dispatchEvent(new Event("userLogin"))

     the Navbar re-checks immediately instead of waiting for
     the next navigation. Not required for correctness (the
     effect above already covers navigation), but makes a
     login that doesn't navigate anywhere feel instant too.
  ========================================================= */

  useEffect(() => {
    const handleUserLogin = async () => {
      const authenticatedUser = await runProfileCheck();

      setUser(authenticatedUser);

      if (authenticatedUser) {
        await refreshUnreadCount();
      }
    };

    window.addEventListener("userLogin", handleUserLogin);

    return () =>
      window.removeEventListener(
        "userLogin",
        handleUserLogin
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* =========================================================
     RE-CHECK WHEN THE TAB REGAINS FOCUS

     Covers logging in/out in another tab, or a session that
     expired while this tab was in the background.
  ========================================================= */

  useEffect(() => {
    const handleFocus = async () => {
      const authenticatedUser = await runProfileCheck();
      setUser(authenticatedUser);
    };

    window.addEventListener("focus", handleFocus);

    return () =>
      window.removeEventListener("focus", handleFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* =========================================================
     CLEAR NOTIFICATIONS WHEN USER IS LOGGED OUT
  ========================================================= */

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setNotificationOpen(false);
    }
  }, [user]);

  /* =========================================================
     OUTSIDE CLICK
  ========================================================= */

  useEffect(() => {
    const handleOutsideClick = (event) => {
      const target = event.target;

      const insideDesktopSearch =
        searchRef.current?.contains(target);

      const insideMobileSearch =
        mobileSearchRef.current?.contains(target);

      if (
        !insideDesktopSearch &&
        !insideMobileSearch
      ) {
        setSearchFocused(false);
      }

      const insideMobileMenu =
        mobileMenuRef.current?.contains(target);

      const insideMobileToggle =
        mobileToggleRef.current?.contains(target);

      if (
        !insideMobileMenu &&
        !insideMobileToggle &&
        mobileOpen
      ) {
        setMobileOpen(false);
      }

      const insideNotification =
        desktopNotificationRef.current?.contains(target) ||
        mobileNotificationRef.current?.contains(target);

      if (notificationOpen && !insideNotification) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, [
    mobileOpen,
    notificationOpen,
  ]);

  /* =========================================================
     ESCAPE
  ========================================================= */

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key !== "Escape") return;

      setSearchFocused(false);
      setMobileOpen(false);
      setNotificationOpen(false);
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  /* =========================================================
     MOBILE BODY SCROLL
  ========================================================= */

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const navItemClass = `
    flex
    h-11
    shrink-0
    items-center
    gap-2
    rounded-full
    px-4
    text-[14px]
    font-semibold
    text-[var(--text-secondary)]
    transition-colors
    duration-150
    hover:bg-[var(--app-surface)]
    hover:text-[var(--text-primary)]
  `;


  const loginButtonClass = `
  flex
  shrink-0
  items-center
  justify-center
  gap-1.5
  rounded-md
  border-2
  border-green-500
  px-4
  py-2
  text-[14px]
  font-semibold

  text-black
  dark:text-white

  transition-colors
  duration-150

  hover:border-blue-400
  hover:bg-blue-50
  hover:text-blue-600

  dark:hover:border-blue-700
  dark:hover:bg-blue-950/30
  dark:hover:text-blue-300

  focus:border-blue-400
  focus:bg-blue-50
  focus:text-blue-600

  dark:focus:border-blue-700
  dark:focus:bg-blue-950/30
  dark:focus:text-blue-300

  focus:outline-none
`;

  return (
    <header
      className="
        sticky
        top-0
        z-[100]
        w-full
        border-b
        border-[var(--border-color)]
        bg-[var(--app-surface)]
        text-[var(--text-primary)]
        shadow-[0_1px_10px_rgba(15,23,42,0.04)]
      "
    >
      {/* ===================================================
          DESKTOP HEADER
      =================================================== */}

      <div
        className="
          mx-auto
          hidden
          min-h-[76px]
          w-full
          max-w-[1800px]
          items-center
          gap-4
          px-5
          lg:flex
          lg:px-7
          xl:gap-5
          xl:px-9
          2xl:px-10
        "
      >
        {/* LOGO */}

        <Link
          to="/"
          onClick={closeMenu}
          className="
            group
            flex
            shrink-0
            cursor-default
            items-center
          "
        >
          <div
            className="
              flex
              h-[52px]
              w-[205px]
              items-center
              xl:h-[54px]
              xl:w-[220px]
              2xl:w-[235px]
            "
          >
            <img
              src="/Service-Planner/Service_Planner_Logo.png"
              alt="Service Planner"
              className="
                block
                h-full
                w-full
                object-contain
                object-left
              "
              draggable="false"
              decoding="async"
              fetchPriority="high"
            />
          </div>
        </Link>

        {/* SEARCH */}

        <div
          className="
            min-w-[180px]
            flex-1
          "
        >
          <SearchBox
            searchRef={searchRef}
            mobileSearchRef={mobileSearchRef}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchFocused={searchFocused}
            setSearchFocused={setSearchFocused}
            currentPlaceholder={currentPlaceholder}
            searchResults={searchResults}
            showSearchResults={showSearchResults}
            handleSearchSubmit={handleSearchSubmit}
            handleSearchSelect={handleSearchSelect}
            clearSearch={clearSearch}
          />
        </div>

        {/* NAVIGATION */}

        <nav
          className="
            flex
            shrink-0
            items-center
            gap-1
            rounded-full
            bg-[var(--app-surface-secondary)]
            p-1
          "
        >
          <Link
            to="/tour"
            className={navItemClass}
          >
            <Plane
              size={19}
              strokeWidth={2}
              className="text-emerald-500"
            />
            <span>Travel</span>
          </Link>

          <Link
            to="/birthday"
            className={navItemClass}
          >
            <Cake
              size={19}
              strokeWidth={2}
              className="text-pink-500"
            />
            <span>Birthday</span>
          </Link>

          <Link
            to="/event"
            className={navItemClass}
          >
            <CalendarDays
              size={19}
              strokeWidth={2}
              className="text-cyan-500"
            />
            <span>Event</span>
          </Link>

          <Link
            to="/support"
            className={navItemClass}
          >
            <Headphones
              size={19}
              strokeWidth={2}
              className="text-orange-500"
            />
            <span>Support</span>
          </Link>
        </nav>

        {/* NOTIFICATION */}

        {user && (
          <div
            ref={desktopNotificationRef}
            className="relative shrink-0"
          >
            <button
              type="button"
              onClick={openNotifications}
              aria-label="Notifications"
              aria-expanded={notificationOpen}
              className="
                relative
                flex
                h-11
                w-11
                cursor-pointer
                items-center
                justify-center
                rounded-full
                bg-transparent
                text-[var(--text-secondary)]
                transition-colors
                duration-150
                hover:bg-[var(--app-surface-secondary)]
                hover:text-[var(--text-primary)]
                active:scale-95
              "
            >
              <Bell
                size={21}
                strokeWidth={2}
              />

              {unreadCount > 0 && (
                <span
                  className="
                    absolute
                    right-1
                    top-1
                    flex
                    min-h-[17px]
                    min-w-[17px]
                    items-center
                    justify-center
                    rounded-full
                    bg-red-500
                    px-1
                    text-[9px]
                    font-bold
                    leading-none
                    text-white
                  "
                >
                  {unreadCount > 99
                    ? "99+"
                    : unreadCount}
                </span>
              )}
            </button>

            {notificationOpen && (
              <div
                className="
                  absolute
                  right-0
                  top-[calc(100%+10px)]
                  z-[220]
                  w-[min(390px,calc(100vw-24px))]
                  overflow-hidden
                  rounded-2xl
                  border
                  border-[var(--border-color)]
                  bg-[var(--app-surface)]
                  shadow-[0_20px_55px_rgba(15,23,42,0.18)]
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    border-b
                    border-[var(--border-color)]
                    px-4
                    py-3.5
                  "
                >
                  <div>
                    <h3
                      className="
                        text-[15px]
                        font-bold
                        text-[var(--text-primary)]
                      "
                    >
                      Notifications
                    </h3>

                    <p
                      className="
                        mt-0.5
                        text-[11px]
                        text-[var(--text-muted)]
                      "
                    >
                      Your latest updates
                    </p>
                  </div>

                  {notifications.length > 0 && (
                    <button
                      type="button"
                      onClick={
                        handleDeleteAllNotifications
                      }
                      disabled={deletingAll}
                      className="
                        flex
                        items-center
                        gap-1.5
                        rounded-lg
                        px-2
                        py-1.5
                        text-[11px]
                        font-semibold
                        text-red-500
                        hover:bg-red-50
                        dark:hover:bg-red-500/10
                        disabled:opacity-50
                      "
                    >
                      <Trash2 size={14} />

                      {deletingAll
                        ? "Clearing..."
                        : "Clear all"}
                    </button>
                  )}
                </div>

                <div
                  className="
                    max-h-[420px]
                    overflow-y-auto
                  "
                >
                  {notificationLoading ? (
                    <div
                      className="
                        flex
                        min-h-[180px]
                        items-center
                        justify-center
                      "
                    >
                      <div
                        className="
                          h-6
                          w-6
                          animate-spin
                          rounded-full
                          border-2
                          border-[var(--border-color)]
                          border-t-blue-500
                        "
                      />
                    </div>
                  ) : notifications.length > 0 ? (
                    notifications.map(
                      (
                        notification,
                        index
                      ) => {
                        const id =
                          getId(notification);

                        return (
                          <div
                            key={
                              id ||
                              `${index}-${getNotificationTitle(
                                notification
                              )}`
                            }
                            className="
                              flex
                              gap-3
                              border-b
                              border-[var(--border-light)]
                              px-4
                              py-3.5
                              hover:bg-[var(--app-surface-secondary)]
                            "
                          >
                            <button
                              type="button"
                              onClick={() =>
                                handleNotificationClick(
                                  notification
                                )
                              }
                              className="
                                flex
                                min-w-0
                                flex-1
                                gap-3
                                text-left
                              "
                            >
                              <span
                                className="
                                  flex
                                  h-9
                                  w-9
                                  shrink-0
                                  items-center
                                  justify-center
                                  rounded-xl
                                  bg-indigo-50
                                  text-indigo-600
                                  dark:bg-indigo-500/10
                                  dark:text-indigo-400
                                "
                              >
                                {getNotificationIcon(
                                  notification
                                )}
                              </span>

                              <span className="min-w-0 flex-1">
                                <span
                                  className="
                                    block
                                    truncate
                                    text-[13px]
                                    font-bold
                                    text-[var(--text-primary)]
                                  "
                                >
                                  {getNotificationTitle(
                                    notification
                                  )}
                                </span>

                                <span
                                  className="
                                    mt-0.5
                                    block
                                    line-clamp-2
                                    text-[12px]
                                    leading-5
                                    text-[var(--text-secondary)]
                                  "
                                >
                                  {getNotificationMessage(
                                    notification
                                  )}
                                </span>

                                {getNotificationDate(
                                  notification
                                ) && (
                                    <span
                                      className="
                                      mt-1
                                      block
                                      text-[10px]
                                      font-medium
                                      text-[var(--text-muted)]
                                    "
                                    >
                                      {getNotificationDate(
                                        notification
                                      )}
                                    </span>
                                  )}
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteNotification(
                                  notification
                                )
                              }
                              disabled={
                                deletingId === id
                              }
                              aria-label="Delete notification"
                              className="
                                flex
                                h-7
                                w-7
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                text-[var(--text-muted)]
                                hover:bg-red-50
                                hover:text-red-500
                                dark:hover:bg-red-500/10
                                disabled:opacity-50
                              "
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        );
                      }
                    )
                  ) : (
                    <div
                      className="
                        flex
                        min-h-[200px]
                        flex-col
                        items-center
                        justify-center
                        px-6
                        text-center
                      "
                    >
                      <span
                        className="
                          flex
                          h-11
                          w-11
                          items-center
                          justify-center
                          rounded-full
                          bg-[var(--app-surface-secondary)]
                          text-[var(--text-muted)]
                        "
                      >
                        <Bell size={19} />
                      </span>

                      <p
                        className="
                          mt-3
                          text-sm
                          font-semibold
                          text-[var(--text-primary)]
                        "
                      >
                        No notifications
                      </p>

                      <p
                        className="
                          mt-1
                          text-xs
                          text-[var(--text-muted)]
                        "
                      >
                        You're all caught up.
                      </p>
                    </div>
                  )}
                </div>

                <div
                  className="
                    border-t
                    border-[var(--border-color)]
                    p-2
                  "
                >
                  <button
                    type="button"
                    onClick={
                      handleViewAllNotifications
                    }
                    className="
                      flex
                      w-full
                      items-center
                      justify-center
                      gap-1.5
                      rounded-xl
                      px-3
                      py-2.5
                      text-[12px]
                      font-semibold
                      text-blue-600
                      hover:bg-blue-50
                      dark:text-blue-400
                      dark:hover:bg-blue-500/10
                    "
                  >
                    View all notifications
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PROFILE */}

        {user ? (
          <Link
            to="/profile"
            className="
              flex
              shrink-0
              items-center
              gap-2
              rounded-full
              px-2
              py-1.5
              transition-colors
              duration-150
              hover:bg-[var(--app-surface-secondary)]
            "
          >
            {showProfileImage ? (
              <img
                src={profileImage}
                alt={
                  displayFirstName ||
                  "Profile"
                }
                onError={() =>
                  setProfileImageFailed(true)
                }
                className="
                  h-9
                  w-9
                  shrink-0
                  rounded-full
                  object-cover
                "
              />
            ) : (
              <span
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-indigo-100
                  text-indigo-600
                  dark:bg-indigo-500/15
                  dark:text-indigo-400
                "
              >
                <User
                  size={18}
                  strokeWidth={2}
                />
              </span>
            )}

            <span
              className="
                max-w-[120px]
                truncate
                text-[14px]
                font-semibold
                text-[var(--text-primary)]
              "
            >
              {displayFirstName}
            </span>
          </Link>
        ) : (
          <Link
            to="/login"
            className={loginButtonClass}
          >
            Login
          </Link>
        )}
      </div>

      {/* =====================================================
          TABLET / MOBILE HEADER
      ===================================================== */}

      <div
        className="
          mx-auto
          flex
          w-full
          max-w-[900px]
          flex-col
          px-3
          py-2.5
          sm:px-5
          sm:py-3
          lg:hidden
        "
      >
        {/* TOP ROW */}

        <div
          className="
            flex
            min-h-[52px]
            w-full
            items-center
            gap-2
            sm:min-h-[58px]
            sm:gap-3
          "
        >
          {/* LOGO */}

          <Link
            to="/"
            onClick={closeMenu}
            className="
              group
              flex
              min-w-0
              shrink-0
              cursor-default
              items-center
            "
          >
            <div
              className="
                flex
                h-[42px]
                w-[138px]
                items-center
                sm:h-[48px]
                sm:w-[170px]
                md:h-[52px]
                md:w-[190px]
              "
            >
              <img
                src="/Service-Planner/Service_Planner_Logo.png"
                alt="Service Planner"
                className="
                  block
                  h-full
                  w-full
                  object-contain
                  object-left
                "
                draggable="false"
                decoding="async"
                fetchPriority="high"
              />
            </div>
          </Link>

          <div
            className="
              ml-auto
              flex
              shrink-0
              items-center
              gap-3
              sm:gap-4
            "
          >
            {/* LOGIN (shown in navbar only when logged out) */}

            {!user && (
              <Link
                to="/login"
                className={`
                  ${loginButtonClass}
                  !px-3.5
                  !py-1.5
                  sm:!px-4
                  sm:!py-2
                `}
              >
                Login
              </Link>
            )}

            {/* NOTIFICATION */}

            {user && (
              <div ref={mobileNotificationRef}>
                <button
                  type="button"
                  onClick={openNotifications}
                  aria-label="Notifications"
                  aria-expanded={notificationOpen}
                  className="
                    relative
                    flex
                    h-10
                    w-10
                    cursor-pointer
                    items-center
                    justify-center
                    rounded-full
                    text-[var(--text-secondary)]
                    transition-colors
                    duration-150
                    hover:bg-[var(--app-surface-secondary)]
                    hover:text-[var(--text-primary)]
                    active:scale-95
                    sm:h-11
                    sm:w-11
                  "
                >
                  <Bell size={21} strokeWidth={2} />

                  {unreadCount > 0 && (
                    <span
                      className="
                        absolute
                        right-1
                        top-1
                        flex
                        min-h-[17px]
                        min-w-[17px]
                        items-center
                        justify-center
                        rounded-full
                        bg-red-500
                        px-1
                        text-[9px]
                        font-bold
                        leading-none
                        text-white
                      "
                    >
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>

                {/* Always mounted so it can animate open/closed.
                    Anchored to the sticky <header>, so it always sits
                    fully on-screen right under the navbar. */}
                <div
                  aria-hidden={!notificationOpen}
                  className={`
                    absolute
                    left-3
                    right-3
                    top-full
                    z-[220]
                    mt-2
                    flex
                    max-h-[min(56dvh,400px)]
                    origin-top
                    flex-col
                    overflow-hidden
                    rounded-2xl
                    border
                    border-[var(--border-color)]
                    bg-[var(--app-surface)]
                    shadow-[0_20px_55px_rgba(15,23,42,0.18)]
                    transition-[opacity,transform,visibility]
                    duration-200
                    ease-out
                    sm:left-auto
                    sm:right-5
                    sm:w-[390px]
                    ${notificationOpen
                      ? "visible translate-y-0 scale-100 opacity-100"
                      : "pointer-events-none invisible -translate-y-2 scale-[0.98] opacity-0"
                    }
                  `}
                >
                  {/* HEADER (fixed) */}
                  <div
                    className="
                      flex
                      shrink-0
                      items-center
                      justify-between
                      border-b
                      border-[var(--border-color)]
                      px-4
                      py-3.5
                    "
                  >
                    <div>
                      <h3
                        className="
                          text-[15px]
                          font-bold
                          text-[var(--text-primary)]
                        "
                      >
                        Notifications
                      </h3>

                      <p
                        className="
                          mt-0.5
                          text-[11px]
                          text-[var(--text-muted)]
                        "
                      >
                        Your latest updates
                      </p>
                    </div>

                    {notifications.length > 0 && (
                      <button
                        type="button"
                        onClick={handleDeleteAllNotifications}
                        disabled={deletingAll}
                        className="
                          flex
                          items-center
                          gap-1.5
                          rounded-lg
                          px-2
                          py-1.5
                          text-[11px]
                          font-semibold
                          text-red-500
                          hover:bg-red-50
                          dark:hover:bg-red-500/10
                          disabled:opacity-50
                        "
                      >
                        <Trash2 size={14} />

                        {deletingAll ? "Clearing..." : "Clear all"}
                      </button>
                    )}
                  </div>

                  {/* LIST (only this part scrolls) */}
                  <div
                    className="
                      min-h-0
                      flex-1
                      overflow-y-auto
                      overscroll-contain
                    "
                  >
                    {notificationLoading ? (
                      <div
                        className="
                          flex
                          min-h-[160px]
                          items-center
                          justify-center
                        "
                      >
                        <div
                          className="
                            h-6
                            w-6
                            animate-spin
                            rounded-full
                            border-2
                            border-[var(--border-color)]
                            border-t-blue-500
                          "
                        />
                      </div>
                    ) : notifications.length > 0 ? (
                      notifications.map((notification, index) => {
                        const id = getId(notification);

                        return (
                          <div
                            key={
                              id ||
                              `${index}-${getNotificationTitle(
                                notification
                              )}`
                            }
                            className="
                              flex
                              gap-3
                              border-b
                              border-[var(--border-light)]
                              px-4
                              py-3.5
                              hover:bg-[var(--app-surface-secondary)]
                            "
                          >
                            <button
                              type="button"
                              onClick={() =>
                                handleNotificationClick(notification)
                              }
                              className="
                                flex
                                min-w-0
                                flex-1
                                gap-3
                                text-left
                              "
                            >
                              <span
                                className="
                                  flex
                                  h-9
                                  w-9
                                  shrink-0
                                  items-center
                                  justify-center
                                  rounded-xl
                                  bg-indigo-50
                                  text-indigo-600
                                  dark:bg-indigo-500/10
                                  dark:text-indigo-400
                                "
                              >
                                {getNotificationIcon(notification)}
                              </span>

                              <span className="min-w-0 flex-1">
                                <span
                                  className="
                                    block
                                    truncate
                                    text-[13px]
                                    font-bold
                                    text-[var(--text-primary)]
                                  "
                                >
                                  {getNotificationTitle(notification)}
                                </span>

                                <span
                                  className="
                                    mt-0.5
                                    block
                                    line-clamp-2
                                    text-[12px]
                                    leading-5
                                    text-[var(--text-secondary)]
                                  "
                                >
                                  {getNotificationMessage(notification)}
                                </span>

                                {getNotificationDate(notification) && (
                                  <span
                                    className="
                                      mt-1
                                      block
                                      text-[10px]
                                      font-medium
                                      text-[var(--text-muted)]
                                    "
                                  >
                                    {getNotificationDate(notification)}
                                  </span>
                                )}
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteNotification(notification)
                              }
                              disabled={deletingId === id}
                              aria-label="Delete notification"
                              className="
                                flex
                                h-8
                                w-8
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                text-[var(--text-muted)]
                                hover:bg-red-50
                                hover:text-red-500
                                dark:hover:bg-red-500/10
                                disabled:opacity-50
                              "
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        );
                      })
                    ) : (
                      <div
                        className="
                          flex
                          min-h-[180px]
                          flex-col
                          items-center
                          justify-center
                          px-6
                          text-center
                        "
                      >
                        <span
                          className="
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-full
                            bg-[var(--app-surface-secondary)]
                            text-[var(--text-muted)]
                          "
                        >
                          <Bell size={19} />
                        </span>

                        <p
                          className="
                            mt-3
                            text-sm
                            font-semibold
                            text-[var(--text-primary)]
                          "
                        >
                          No notifications
                        </p>

                        <p
                          className="
                            mt-1
                            text-xs
                            text-[var(--text-muted)]
                          "
                        >
                          You're all caught up.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* FOOTER (always visible at the bottom) */}
                  <div
                    className="
                      shrink-0
                      border-t
                      border-[var(--border-color)]
                      bg-[var(--app-surface)]
                      p-2
                    "
                  >
                    <button
                      type="button"
                      onClick={handleViewAllNotifications}
                      className="
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-1.5
                        rounded-xl
                        px-3
                        py-3
                        text-[13px]
                        font-semibold
                        text-blue-600
                        hover:bg-blue-50
                        dark:text-blue-400
                        dark:hover:bg-blue-500/10
                      "
                    >
                      View all notifications
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* MENU */}

            <button
              ref={mobileToggleRef}
              type="button"
              onClick={() =>
                setMobileOpen(
                  (previous) => !previous
                )
              }
              aria-label={
                mobileOpen
                  ? "Close menu"
                  : "Open menu"
              }
              aria-expanded={mobileOpen}
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-transparent
                transition-all
                duration-150
                active:scale-90
                sm:h-11
                sm:w-11
              "
            >
              <span
                aria-hidden="true"
                className="relative block h-[18px] w-[22px]"
              >
                <span
                  className={`
                    absolute
                    left-0
                    top-[3px]
                    block
                    h-[2px]
                    w-full
                    rounded-full
                    transition-all
                    duration-300
                    ease-in-out
                    ${mobileOpen
                      ? "translate-y-[5px] rotate-45 bg-red-500"
                      : "bg-[var(--text-primary)]"
                    }
                  `}
                />

                <span
                  className={`
                    absolute
                    left-0
                    top-[8px]
                    block
                    h-[2px]
                    w-full
                    rounded-full
                    transition-all
                    duration-300
                    ease-in-out
                    ${mobileOpen
                      ? "scale-x-0 bg-red-500 opacity-0"
                      : "bg-[var(--text-primary)] opacity-100"
                    }
                  `}
                />

                <span
                  className={`
                    absolute
                    left-0
                    top-[13px]
                    block
                    h-[2px]
                    w-full
                    rounded-full
                    transition-all
                    duration-300
                    ease-in-out
                    ${mobileOpen
                      ? "-translate-y-[5px] -rotate-45 bg-red-500"
                      : "bg-[var(--text-primary)]"
                    }
                  `}
                />
              </span>
            </button>
          </div>
        </div>

        {/* SEARCH BELOW TOP ROW */}

        <div
          className="
            mt-2
            w-full
            sm:mt-2.5
          "
        >
          <SearchBox
            mobile
            searchRef={searchRef}
            mobileSearchRef={mobileSearchRef}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchFocused={searchFocused}
            setSearchFocused={setSearchFocused}
            currentPlaceholder={currentPlaceholder}
            searchResults={searchResults}
            showSearchResults={showSearchResults}
            handleSearchSubmit={handleSearchSubmit}
            handleSearchSelect={handleSearchSelect}
            clearSearch={clearSearch}
          />
        </div>
      </div>

      {/* =====================================================
          MOBILE / TABLET MENU
      ===================================================== */}

      <div
        ref={mobileMenuRef}
        aria-hidden={!mobileOpen}
        className={`
          grid
          border-[var(--border-color)]
          bg-[var(--app-surface)]
          transition-[grid-template-rows,opacity,visibility]
          duration-300
          ease-in-out
          lg:hidden
          ${mobileOpen
            ? "visible grid-rows-[1fr] border-t opacity-100"
            : "pointer-events-none invisible grid-rows-[0fr] border-t-0 opacity-0"
          }
        `}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className="
              mx-auto
              flex
              max-h-[calc(100vh-76px)]
              flex-col
              overflow-y-auto
              px-4
              pb-5
              pt-4
              sm:px-5
            "
          >
            <div className="grid gap-2">
              <Link
                to="/tour"
                onClick={closeMenu}
                className="
                  flex
                  min-h-12
                  items-center
                  gap-3
                  rounded-xl
                  px-3
                  text-[14px]
                  font-semibold
                  text-[var(--text-primary)]
                  hover:bg-[var(--app-surface-secondary)]
                "
              >
                <span
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    bg-emerald-50
                    text-emerald-500
                    dark:bg-emerald-500/10
                  "
                >
                  <Plane size={18} />
                </span>

                Travel
              </Link>

              <Link
                to="/birthday"
                onClick={closeMenu}
                className="
                  flex
                  min-h-12
                  items-center
                  gap-3
                  rounded-xl
                  px-3
                  text-[14px]
                  font-semibold
                  text-[var(--text-primary)]
                  hover:bg-[var(--app-surface-secondary)]
                "
              >
                <span
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    bg-pink-50
                    text-pink-500
                    dark:bg-pink-500/10
                  "
                >
                  <Cake size={18} />
                </span>

                Birthday
              </Link>

              <Link
                to="/event"
                onClick={closeMenu}
                className="
                  flex
                  min-h-12
                  items-center
                  gap-3
                  rounded-xl
                  px-3
                  text-[14px]
                  font-semibold
                  text-[var(--text-primary)]
                  hover:bg-[var(--app-surface-secondary)]
                "
              >
                <span
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    bg-cyan-50
                    text-cyan-500
                    dark:bg-cyan-500/10
                  "
                >
                  <CalendarDays size={18} />
                </span>

                Event
              </Link>
              <Link
                to="/support"
                onClick={closeMenu}
                className="
                  flex
                  min-h-12
                  items-center
                  gap-3
                  rounded-xl
                  px-3
                  text-[14px]
                  font-semibold
                  text-[var(--text-primary)]
                  hover:bg-[var(--app-surface-secondary)]
                "
              >
                <span
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    bg-orange-50
                    text-orange-500
                    dark:bg-orange-500/10
                  "
                >
                  <Headphones size={18} />
                </span>

                Customer Support
              </Link>
            </div>

            {user && (
              <div
                className="
                  mt-4
                  border-t
                  border-[var(--border-color)]
                  pt-4
                "
              >
                <Link
                  to="/profile"
                  onClick={closeMenu}
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    py-3
                    hover:bg-[var(--app-surface-secondary)]
                  "
                >
                  {showProfileImage ? (
                    <img
                      src={profileImage}
                      alt={displayFirstName || "Profile"}
                      onError={() => setProfileImageFailed(true)}
                      className="
                        h-10
                        w-10
                        shrink-0
                        rounded-full
                        object-cover
                      "
                    />
                  ) : (
                    <span
                      className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-indigo-100
                        text-indigo-600
                        dark:bg-indigo-500/15
                        dark:text-indigo-400
                      "
                    >
                      <User size={19} />
                    </span>
                  )}

                  <span className="min-w-0 flex-1">
                    <span
                      className="
                        block
                        truncate
                        text-[14px]
                        font-bold
                        text-[var(--text-primary)]
                      "
                    >
                      {displayFirstName}
                    </span>

                    <span
                      className="
                        mt-0.5
                        block
                        text-[11px]
                        text-[var(--text-muted)]
                      "
                    >
                      View profile
                    </span>
                  </span>

                  <ChevronRight
                    size={17}
                    className="text-[var(--text-muted)]"
                  />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;