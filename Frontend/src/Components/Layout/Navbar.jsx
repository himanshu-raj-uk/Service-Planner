import { useEffect, useRef, useState } from "react";
import {
  Menu,
  X,
  ChevronRight,
  User,
  LogOut,
  Bell,
  Plane,
  Cake,
  CheckCircle2,
  Clock,
  Trash2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getUserProfile,
  logoutUser,
  getNotifications,
  getUnreadNotification,
  deleteNotification,
  deleteAllNotifications,
  markAllNotificationsAsRead,
} from "../../Services/AuthAPI";

const Navbar = () => {
  const navigate = useNavigate();
  const notificationDrawerRef = useRef(null);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deletingAll, setDeletingAll] = useState(false);

  const closeMenu = () => {
    setMobileOpen(false);
  };

  const closeNotifications = () => {
    setNotificationOpen(false);
  };

  const getId = (value) => {
    if (!value) return null;

    if (typeof value === "string" || typeof value === "number") {
      return String(value);
    }

    if (value?._id) return String(value._id);
    if (value?.id) return String(value.id);

    return null;
  };

  const getTripId = (notification) => {
    return getId(notification?.tripId) || getId(notification?.trip) || null;
  };

  const getBirthdayId = (notification) => {
    return (
      getId(notification?.birthdayId) ||
      getId(notification?.birthday) ||
      getId(notification?.birthdayPlan) ||
      null
    );
  };

  const getNotificationIcon = (notification) => {
    const type = String(notification?.type || "").toLowerCase();

    if (
      type.includes("tour") ||
      type.includes("trip") ||
      type.includes("travel")
    ) {
      return <Plane size={19} />;
    }

    if (
      type.includes("birthday") ||
      type.includes("event") ||
      type.includes("calendar")
    ) {
      return <Cake size={19} />;
    }

    return <CheckCircle2 size={19} />;
  };

  const getNotificationDate = (notification) => {
    if (!notification?.createdAt) return "";

    const date = new Date(notification.createdAt);

    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fetchUser = async () => {
    const token = localStorage.getItem("userToken");

    if (!token) {
      setUser(null);
      setLoadingUser(false);
      return null;
    }

    setLoadingUser(true);

    try {
      const response = await getUserProfile();
      const userData = response?.data?.data || null;

      setUser(userData);

      return userData;
    } catch (error) {
      console.error("FETCH USER ERROR:", error);

      setUser(null);

      if (error?.response?.status === 401) {
        localStorage.removeItem("userToken");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }

      return null;
    } finally {
      setLoadingUser(false);
    }
  };

  const fetchUnreadCount = async () => {
    const token = localStorage.getItem("userToken");

    if (!token) {
      setUnreadCount(0);
      return;
    }

    try {
      const response = await getUnreadNotification();

      const count = Number(
        response?.data?.count ??
          response?.data?.data?.count ??
          response?.data?.unreadCount ??
          response?.data?.data?.unreadCount ??
          response?.data?.total ??
          response?.data?.data?.total ??
          0,
      );

      setUnreadCount(Number.isFinite(count) && count > 0 ? count : 0);
    } catch (error) {
      console.error("FETCH UNREAD COUNT ERROR:", error);
      setUnreadCount(0);
    }
  };

  const fetchNotifications = async () => {
    const token = localStorage.getItem("userToken");

    if (!token) {
      setNotifications([]);
      return [];
    }

    try {
      setNotificationLoading(true);

      const response = await getNotifications();

      const data = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.data?.data)
          ? response.data.data
          : [];

      setNotifications(data);

      return data;
    } catch (error) {
      console.error("FETCH NOTIFICATIONS ERROR:", error);

      setNotifications([]);

      if (error?.response?.status !== 401) {
        toast.error(
          error?.response?.data?.message || "Failed to load notifications",
        );
      }

      return [];
    } finally {
      setNotificationLoading(false);
    }
  };

  const openNotifications = async () => {
    setMobileOpen(false);
    setNotificationOpen(true);

    const data = await fetchNotifications();

    const unread = data.filter(
      (notification) => notification?.isRead === false,
    ).length;

    setUnreadCount(unread);

    if (!data.length || unread === 0) {
      return;
    }

    try {
      await markAllNotificationsAsRead();

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      );

      setUnreadCount(0);
    } catch (error) {
      console.error("MARK ALL NOTIFICATIONS AS READ ERROR:", error);
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification) return;

    const type = String(notification?.type || "").toLowerCase();

    const tripId = getTripId(notification);
    const birthdayId = getBirthdayId(notification);

    setNotificationOpen(false);
    setMobileOpen(false);

    if (
      type.includes("tour") ||
      type.includes("trip") ||
      type.includes("travel")
    ) {
      if (tripId) {
        navigate(`/tour/${tripId}`);
        return;
      }

      if (notification?.link) {
        navigate(notification.link);
        return;
      }

      toast.error("This tour information is no longer available.");
      return;
    }

    if (type.includes("birthday")) {
      if (birthdayId) {
        navigate(`/birthday/${birthdayId}`);
        return;
      }

      if (notification?.link) {
        navigate(notification.link);
        return;
      }

      toast.error("This birthday plan is no longer available.");
      return;
    }

    if (type.includes("event")) {
      if (notification?.link) {
        navigate(notification.link);
        return;
      }

      navigate("/event");
      return;
    }

    if (notification?.link) {
      navigate(notification.link);
      return;
    }

    navigate("/notification");
  };

  const handleDeleteNotification = async (event, notificationId) => {
    event.preventDefault();
    event.stopPropagation();

    if (!notificationId) return;

    try {
      setDeletingId(notificationId);

      await deleteNotification(notificationId);

      setNotifications((previous) =>
        previous.filter((item) => item?._id !== notificationId),
      );

      await fetchUnreadCount();

      toast.success("Notification removed");
    } catch (error) {
      console.error("DELETE NOTIFICATION ERROR:", error);

      toast.error(
        error?.response?.data?.message || "Failed to remove notification",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteAllNotifications = async () => {
    if (!notifications.length) return;

    try {
      setDeletingAll(true);

      await deleteAllNotifications();

      setNotifications([]);
      setUnreadCount(0);

      toast.success("All notifications removed");
    } catch (error) {
      console.error("DELETE ALL NOTIFICATIONS ERROR:", error);

      toast.error(
        error?.response?.data?.message || "Failed to remove notifications",
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

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
    }

    localStorage.removeItem("userToken");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("verificationToken");
    localStorage.removeItem("resetToken");

    setUser(null);
    setUnreadCount(0);
    setNotifications([]);
    setMobileOpen(false);
    setNotificationOpen(false);

    toast.success("Logged out successfully");

    navigate("/");
  };

  useEffect(() => {
    const initializeUser = async () => {
      const userData = await fetchUser();

      if (userData) {
        await fetchUnreadCount();
      }
    };

    initializeUser();

    const handleUserLogin = async () => {
      const userData = await fetchUser();

      if (userData) {
        await fetchUnreadCount();
        await fetchNotifications();
      }
    };

    window.addEventListener("userLogin", handleUserLogin);

    return () => {
      window.removeEventListener("userLogin", handleUserLogin);
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      setNotifications([]);
    }
  }, [user]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        notificationOpen &&
        notificationDrawerRef.current &&
        !notificationDrawerRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [notificationOpen]);

  useEffect(() => {
    if (!notificationOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setNotificationOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [notificationOpen]);

  useEffect(() => {
    document.body.style.overflow = notificationOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [notificationOpen]);

  const ProfileImage = ({ size = "desktop" }) => {
    const classes =
      size === "mobile"
        ? "h-11 w-11 min-[360px]:h-11 min-[360px]:w-11 sm:h-12 sm:w-12"
        : "h-11 w-11 xl:h-12 xl:w-12 2xl:h-[52px] 2xl:w-[52px]";

    return (
      <div
        className={`${classes} shrink-0 overflow-hidden rounded-full border-2 border-white bg-gradient-to-br from-indigo-100 to-purple-100 shadow-sm ring-1 ring-gray-200`}
      >
        {user?.profileImage?.url ? (
          <img
            src={user.profileImage.url}
            alt={user.name || "Profile"}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-indigo-600">
            <User size={size === "mobile" ? 20 : 21} />
          </div>
        )}
      </div>
    );
  };

  const AuthLoading = ({ mobile = false }) => {
    if (mobile) {
      return (
        <div className="mt-4 h-[64px] animate-pulse rounded-2xl border border-gray-100 bg-gray-50 sm:h-[68px]" />
      );
    }

    return (
      <div className="flex items-center gap-2 xl:gap-3">
        <div className="h-10 w-20 animate-pulse rounded-full bg-gray-100 xl:h-11 xl:w-24" />
        <div className="h-10 w-20 animate-pulse rounded-full bg-gray-100 xl:h-11 xl:w-24" />
      </div>
    );
  };

  const NotificationButton = ({ mobile = false }) => {
    const hasUnread = unreadCount > 0;

    return (
      <button
        type="button"
        onClick={openNotifications}
        aria-label="Notifications"
        aria-expanded={notificationOpen}
        className={`group relative flex shrink-0 items-center justify-center rounded-full border shadow-sm transition-all duration-200 active:scale-95 ${
          hasUnread
            ? "border-yellow-200 bg-yellow-50 text-yellow-500 hover:bg-yellow-100 hover:text-yellow-600"
            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800"
        } ${
          mobile
            ? "h-11 w-11 min-[360px]:h-11 min-[360px]:w-11 sm:h-12 sm:w-12"
            : "h-11 w-11 xl:h-12 xl:w-12 2xl:h-[52px] 2xl:w-[52px]"
        }`}
      >
        <Bell
          size={mobile ? 21 : 22}
          strokeWidth={hasUnread ? 2.4 : 2}
          className="transition-transform duration-200 group-hover:scale-105"
        />

        {hasUnread && (
          <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white shadow-md ring-2 ring-white sm:h-5 sm:min-w-[20px]">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>
    );
  };

  return (
    <>
      <header className="sticky top-0 z-[100] w-full border-b border-black/10 bg-white/95 shadow-[0_2px_16px_rgba(15,23,42,0.06)] backdrop-blur-xl">
        <div className="w-full px-3 min-[360px]:px-4 sm:px-6 md:px-7 lg:px-8 xl:px-12 2xl:px-16">
          <div className="flex min-h-[78px] w-full items-center justify-between gap-2 py-2 min-[360px]:gap-3 sm:min-h-[82px] sm:gap-4 md:min-h-[86px] lg:min-h-[90px] xl:min-h-[94px] 2xl:min-h-[100px]">
            {/* Logo */}
            <Link
              to="/"
              onClick={closeMenu}
              className="group flex min-w-0 items-center"
            >
              <div className="flex h-[56px] w-auto min-w-0 max-w-[205px] items-center min-[360px]:h-[58px] min-[360px]:max-w-[220px] sm:h-[62px] sm:max-w-[245px] md:h-[66px] md:max-w-[270px] lg:h-[70px] lg:max-w-[290px] xl:h-[74px] xl:max-w-[315px] 2xl:h-[78px] 2xl:max-w-[340px]">
                <img
                  src="/Service-Planner/Service_Planner_Logo.png"
                  alt="Service Planner"
                  className="block h-full w-auto max-w-full object-contain object-left transition-transform duration-200 group-hover:scale-[1.01]"
                  draggable="false"
                  decoding="async"
                  fetchPriority="high"
                />
              </div>
            </Link>

            {/* Desktop navigation */}
            <nav className="hidden shrink-0 lg:flex">
              <div className="flex h-[52px] w-[600px] shrink-0 items-center justify-center rounded-full border border-gray-200/80 bg-gray-50/90 px-2 shadow-[0_3px_14px_rgba(15,23,42,0.06)] xl:h-[60px] xl:w-[760px] xl:px-3 2xl:h-[66px] 2xl:w-[900px] 2xl:px-4">
                <div className="flex h-full items-center justify-center gap-1.5 xl:gap-2 2xl:gap-2.5">
                  <Link
                    to="/tour"
                    className="flex h-10 w-[150px] shrink-0 items-center justify-center gap-1.5 rounded-full px-3 text-[15px] font-medium text-gray-700 transition-all duration-200 hover:bg-white hover:text-indigo-600 hover:shadow-sm hover:ring-1 hover:ring-black/5 xl:h-[46px] xl:w-[180px] xl:gap-2 xl:px-4 xl:text-base 2xl:h-[50px] 2xl:w-[200px] 2xl:gap-2.5 2xl:px-4 2xl:text-[17px]"
                  >
                    <Plane
                      size={18}
                      strokeWidth={2.2}
                      className="shrink-0 text-indigo-500 xl:h-5 xl:w-5 2xl:h-[22px] 2xl:w-[22px]"
                    />
                    <span>Travel</span>
                  </Link>

                  <Link
                    to="/birthday"
                    className="flex h-10 w-[150px] shrink-0 items-center justify-center gap-1.5 rounded-full px-3 text-[15px] font-medium text-gray-700 transition-all duration-200 hover:bg-white hover:text-pink-500 hover:shadow-sm hover:ring-1 hover:ring-black/5 xl:h-[46px] xl:w-[180px] xl:gap-2 xl:px-4 xl:text-base 2xl:h-[50px] 2xl:w-[200px] 2xl:gap-2.5 2xl:px-4 2xl:text-[17px]"
                  >
                    <Cake
                      size={18}
                      strokeWidth={2.2}
                      className="shrink-0 text-pink-500 xl:h-5 xl:w-5 2xl:h-[22px] 2xl:w-[22px]"
                    />
                    <span>Birthday</span>
                  </Link>

                  <Link
                    to="/event"
                    className="flex h-10 w-[150px] shrink-0 items-center justify-center gap-1.5 rounded-full px-3 text-[15px] font-medium text-gray-700 transition-all duration-200 hover:bg-white hover:text-emerald-600 hover:shadow-sm hover:ring-1 hover:ring-black/5 xl:h-[46px] xl:w-[180px] xl:gap-2 xl:px-4 xl:text-base 2xl:h-[50px] 2xl:w-[200px] 2xl:gap-2.5 2xl:px-4 2xl:text-[17px]"
                  >
                    <CheckCircle2
                      size={18}
                      strokeWidth={2.2}
                      className="shrink-0 text-emerald-500 xl:h-5 xl:w-5 2xl:h-[22px] 2xl:w-[22px]"
                    />
                    <span>Event</span>
                  </Link>
                </div>
              </div>
            </nav>

            {/* Desktop auth area */}
            <div className="hidden shrink-0 items-center lg:flex">
              {loadingUser ? (
                <AuthLoading />
              ) : user ? (
                <div className="flex items-center gap-2 xl:gap-2.5">
                  <Link
                    to="/profile"
                    className="group flex max-w-[170px] items-center gap-2 rounded-full px-2 py-1.5 transition-colors hover:bg-gray-50 xl:max-w-[210px]"
                  >
                    <ProfileImage />

                    <span className="max-w-[100px] truncate text-[15px] font-medium text-gray-700 transition-colors group-hover:text-indigo-600 xl:max-w-[150px] xl:text-base 2xl:text-[17px]">
                      {user.name}
                    </span>
                  </Link>

                  <NotificationButton />
                </div>
              ) : (
                <div className="flex items-center gap-2 xl:gap-2.5">
                  <Link
                    to="/login"
                    className="rounded-full border border-indigo-200 bg-white px-5 py-2.5 text-[15px] font-medium text-indigo-700 shadow-sm transition-all duration-200 hover:border-indigo-500 hover:bg-indigo-50 hover:shadow-md active:scale-[0.97] xl:px-6 xl:py-3 xl:text-base"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="rounded-full bg-indigo-600 px-5 py-2.5 text-[15px] font-medium text-white shadow-[0_5px_14px_rgba(79,70,229,0.22)] transition-all duration-200 hover:bg-indigo-700 hover:shadow-[0_7px_18px_rgba(79,70,229,0.30)] active:scale-[0.97] xl:px-6 xl:py-3 xl:text-base"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile / tablet actions */}
            <div className="flex shrink-0 items-center gap-2 lg:hidden">
              {loadingUser ? (
                <div className="h-11 w-11 animate-pulse rounded-full bg-gray-100 sm:h-12 sm:w-12" />
              ) : (
                user && <NotificationButton mobile />
              )}

              <button
                type="button"
                onClick={() => setMobileOpen((previous) => !previous)}
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gray-200/80 bg-white text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:text-indigo-600 active:scale-95 sm:h-12 sm:w-12"
              >
                {mobileOpen ? (
                  <X size={21} />
                ) : (
                  <Menu size={21} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`border-t border-gray-100 bg-white transition-all duration-300 ease-out lg:hidden ${
            mobileOpen
              ? "max-h-[calc(100dvh-78px)] overflow-y-auto overscroll-contain opacity-100 min-[360px]:max-h-[calc(100dvh-78px)] sm:max-h-[calc(100dvh-82px)] md:max-h-[calc(100dvh-86px)]"
              : "max-h-0 overflow-hidden border-transparent opacity-0"
          }`}
        >
          <div className="w-full px-4 pb-5 pt-3 min-[360px]:px-4 sm:px-6 sm:pb-6 sm:pt-4">
            <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-1.5 sm:p-2">
              <Link
                to="/tour"
                onClick={closeMenu}
                className="flex items-center justify-between rounded-xl px-3 py-3.5 text-[15px] font-medium text-gray-800 transition hover:bg-white hover:text-indigo-600 min-[360px]:py-3.5 sm:py-4 sm:text-base md:text-[17px]"
              >
                <span className="flex items-center gap-2.5">
                  <Plane
                    size={20}
                    className="shrink-0 text-indigo-500"
                  />
                  Travel
                </span>

                <ChevronRight
                  size={19}
                  className="shrink-0 text-gray-400"
                />
              </Link>

              <Link
                to="/birthday"
                onClick={closeMenu}
                className="flex items-center justify-between rounded-xl px-3 py-3.5 text-[15px] font-medium text-gray-800 transition hover:bg-white hover:text-pink-500 min-[360px]:py-3.5 sm:py-4 sm:text-base md:text-[17px]"
              >
                <span className="flex items-center gap-2.5">
                  <Cake
                    size={20}
                    className="shrink-0 text-pink-500"
                  />
                  Birthday
                </span>

                <ChevronRight
                  size={19}
                  className="shrink-0 text-gray-400"
                />
              </Link>

              <Link
                to="/event"
                onClick={closeMenu}
                className="flex items-center justify-between rounded-xl px-3 py-3.5 text-[15px] font-medium text-gray-800 transition hover:bg-white hover:text-emerald-600 min-[360px]:py-3.5 sm:py-4 sm:text-base md:text-[17px]"
              >
                <span className="flex items-center gap-2.5">
                  <CheckCircle2
                    size={20}
                    className="shrink-0 text-emerald-500"
                  />
                  Event
                </span>

                <ChevronRight
                  size={19}
                  className="shrink-0 text-gray-400"
                />
              </Link>
            </div>

            {loadingUser ? (
              <AuthLoading mobile />
            ) : user ? (
              <div className="mt-4 space-y-2">
                <Link
                  to="/profile"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition hover:border-indigo-100 hover:bg-indigo-50/30 sm:p-3.5"
                >
                  <ProfileImage size="mobile" />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-medium text-gray-900 sm:text-base md:text-[17px]">
                      {user.name}
                    </p>

                    <p className="mt-0.5 text-[13px] font-normal text-gray-500 sm:mt-1 sm:text-sm">
                      View Profile
                    </p>
                  </div>

                  <ChevronRight
                    size={20}
                    className="shrink-0 text-gray-400"
                  />
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 py-3.5 text-[15px] font-medium text-red-600 transition hover:bg-red-100 active:scale-[0.98] sm:py-3.5 sm:text-base md:text-[17px]"
                >
                  <LogOut size={19} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-2.5">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="rounded-xl border border-indigo-200 bg-white py-3.5 text-center text-[15px] font-medium text-indigo-700 shadow-sm transition hover:border-indigo-400 hover:bg-indigo-50 active:scale-[0.98] sm:py-3.5 sm:text-base md:text-[17px]"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="rounded-xl bg-indigo-600 py-3.5 text-center text-[15px] font-medium text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.98] sm:py-3.5 sm:text-base md:text-[17px]"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Notification overlay */}
      <div
        onClick={closeNotifications}
        className={`fixed inset-0 z-[150] bg-black/30 backdrop-blur-[2px] transition-opacity duration-300 ${
          notificationOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      {/* Notification drawer */}
      <aside
        ref={notificationDrawerRef}
        className={`fixed right-0 top-0 z-[160] flex h-[100dvh] w-full max-w-[420px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
          notificationOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-gray-200 px-4 py-3.5 sm:px-5 sm:py-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-50 text-yellow-500 ring-1 ring-yellow-100 sm:h-11 sm:w-11">
              <Bell size={20} />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-base font-medium text-gray-900 sm:text-lg">
                Notifications
              </h2>

              <p className="text-xs text-gray-500 sm:text-sm">
                {unreadCount > 0
                  ? `${unreadCount} unread notification${
                      unreadCount > 1 ? "s" : ""
                    }`
                  : "You're all caught up"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeNotifications}
            aria-label="Close notifications"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 active:scale-95 sm:h-10 sm:w-10"
          >
            <X size={20} />
          </button>
        </div>

        {notifications.length > 0 && (
          <div className="flex shrink-0 justify-end border-b border-gray-100 px-4 py-2.5 sm:px-5 sm:py-3">
            <button
              type="button"
              onClick={handleDeleteAllNotifications}
              disabled={deletingAll}
              className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 hover:text-red-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:py-2 sm:text-sm"
            >
              {deletingAll ? (
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-red-200 border-t-red-600" />
              ) : (
                <Trash2 size={15} />
              )}
              Remove All
            </button>
          </div>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {notificationLoading ? (
            <div className="flex min-h-[280px] items-center justify-center sm:min-h-[320px]">
              <div className="flex flex-col items-center gap-3">
                <div className="h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-indigo-600" />

                <p className="text-[13px] text-gray-500 sm:text-sm">
                  Loading notifications...
                </p>
              </div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center sm:min-h-[360px]">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400 sm:h-14 sm:w-14">
                <Bell size={24} />
              </div>

              <h3 className="mt-4 text-base font-medium text-gray-900 sm:text-lg">
                No notifications
              </h3>

              <p className="mt-1.5 max-w-xs text-[13px] leading-relaxed text-gray-500 sm:text-sm">
                New tour plans, birthday plans and activities will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => {
                const notificationId = notification?._id;

                if (!notificationId) return null;

                const isUnread = notification?.isRead === false;
                const isDeleting = deletingId === notificationId;

                return (
                  <div
                    key={notificationId}
                    onClick={() => handleNotificationClick(notification)}
                    className={`group relative cursor-pointer px-4 py-3.5 transition-colors active:bg-gray-100 sm:px-5 sm:py-4 ${
                      isUnread
                        ? "bg-yellow-50/30 hover:bg-yellow-50"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${
                          isUnread
                            ? "bg-yellow-50 text-yellow-500 ring-1 ring-yellow-100"
                            : "bg-white text-gray-600 ring-1 ring-gray-200"
                        }`}
                      >
                        {getNotificationIcon(notification)}
                      </div>

                      <div className="min-w-0 flex-1 pr-8 sm:pr-9">
                        <div className="flex items-start gap-2">
                          <h3
                            className={`line-clamp-1 text-sm font-medium sm:text-base ${
                              isUnread ? "text-gray-900" : "text-gray-800"
                            }`}
                          >
                            {notification?.title || "Notification"}
                          </h3>

                          {isUnread && (
                            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-yellow-500" />
                          )}
                        </div>

                        <p className="mt-1 break-words text-[13px] leading-relaxed text-gray-500 sm:mt-1.5 sm:text-sm">
                          {notification?.message ||
                            "You have a new notification."}
                        </p>

                        {getNotificationDate(notification) && (
                          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-gray-400 sm:text-xs">
                            <Clock size={12} />
                            {getNotificationDate(notification)}
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={(event) =>
                          handleDeleteNotification(event, notificationId)
                        }
                        aria-label="Remove notification"
                        className="absolute right-3 top-3.5 flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-600 active:scale-95 sm:right-4 sm:top-4 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100"
                      >
                        {isDeleting ? (
                          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-gray-200 border-t-red-500" />
                        ) : (
                          <Trash2 size={15} />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-gray-100 bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:px-5 sm:pb-[max(1rem,env(safe-area-inset-bottom))] sm:pt-4">
          <button
            type="button"
            onClick={handleViewAllNotifications}
            className="w-full rounded-xl bg-gray-950 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-600 hover:shadow-md active:scale-[0.99] sm:py-3.5 sm:text-base"
          >
            View All Notifications
          </button>
        </div>
      </aside>
    </>
  );
};

export default Navbar;