import { useEffect, useRef, useState } from "react";
import {
  Menu,
  X,
  ChevronRight,
  User,
  LogOut,
  Bell,
  Plane,
  CalendarDays,
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

  const handleNotificationClick = async (notification) => {
    if (!notification) return;

    const type = String(notification?.type || "").toLowerCase();

    const tripId = getTripId(notification);
    const birthdayId = getBirthdayId(notification);

    setNotificationOpen(false);
    setMobileOpen(false);

    if (
      type === "tour" ||
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

    if (type === "birthday" || type.includes("birthday")) {
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

    if (type === "event" || type.includes("event")) {
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

  const getNotificationIcon = (notification) => {
    const type = String(notification?.type || "").toLowerCase();

    if (
      type.includes("tour") ||
      type.includes("trip") ||
      type.includes("travel")
    ) {
      return <Plane size={18} />;
    }

    if (
      type.includes("birthday") ||
      type.includes("event") ||
      type.includes("calendar")
    ) {
      return <CalendarDays size={18} />;
    }

    return <CheckCircle2 size={18} />;
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
    const classes = size === "mobile" ? "h-10 w-10" : "h-11 w-11";

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
            <User size={size === "mobile" ? 19 : 20} />
          </div>
        )}
      </div>
    );
  };

  const AuthLoading = ({ mobile = false }) => {
    if (mobile) {
      return (
        <div className="mt-3 h-[58px] animate-pulse rounded-2xl border border-gray-100 bg-gray-50" />
      );
    }

    return (
      <div className="flex items-center gap-3">
        <div className="h-10 w-24 animate-pulse rounded-full bg-gray-100" />
        <div className="h-10 w-24 animate-pulse rounded-full bg-gray-100" />
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
        } ${mobile ? "h-10 w-10 sm:h-11 sm:w-11" : "h-11 w-11"}`}
      >
        <Bell
          size={mobile ? 20 : 21}
          strokeWidth={hasUnread ? 2.4 : 2}
          className="transition-transform duration-200 group-hover:scale-105"
        />

        {hasUnread && (
          <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white shadow-md ring-2 ring-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>
    );
  };

  return (
    <>
      <header className="sticky top-0 z-[100] w-full border-b border-gray-200/80 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
        <div className="mx-auto w-full max-w-[1500px] px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="flex h-[68px] items-center justify-between lg:h-[76px]">
            <Link
              to="/"
              onClick={closeMenu}
              className="group flex min-w-0 items-center gap-3"
            >
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[13px] shadow-[0_6px_18px_rgba(79,70,229,0.25)] transition-transform duration-300 group-hover:scale-105 sm:h-11 sm:w-11 lg:h-12 lg:w-12 lg:rounded-[15px]">
                <img
                  src="/Service-Planner/Service_Planner_Logo.png"
                  alt="Service Planner"
                  className="h-full w-full object-contain"
                />
              </div>

              <div className="min-w-0">
                <h1 className="truncate bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-[18px] font-bold tracking-[-0.02em] text-transparent sm:text-lg lg:text-xl">
                  Service Planner
                </h1>

                <p className="hidden text-[11px] font-medium tracking-wide text-gray-400 sm:block">
                  Plan Everything Smartly
                </p>
              </div>
            </Link>

            <nav className="hidden items-center lg:flex">
              <div className="flex items-center gap-1">
                <Link
                  to="/tour"
                  className="rounded-xl px-4 py-2.5 text-[15px] font-semibold text-gray-700 transition-all hover:bg-gray-50 hover:text-indigo-600"
                >
                  Travel
                </Link>

                <Link
                  to="/birthday"
                  className="rounded-xl px-4 py-2.5 text-[15px] font-semibold text-gray-700 transition-all hover:bg-gray-50 hover:text-indigo-600"
                >
                  Birthday
                </Link>

                <Link
                  to="/event"
                  className="rounded-xl px-4 py-2.5 text-[15px] font-semibold text-gray-700 transition-all hover:bg-gray-50 hover:text-indigo-600"
                >
                  Event
                </Link>
              </div>

              <div className="mx-5 h-7 w-px bg-gray-200 xl:mx-6" />

              {loadingUser ? (
                <AuthLoading />
              ) : user ? (
                <div className="flex items-center gap-3">
                  <Link
                    to="/profile"
                    className="group flex max-w-[190px] items-center gap-2.5 rounded-full py-1 pl-1 pr-3 transition hover:bg-gray-50"
                  >
                    <ProfileImage />

                    <span className="truncate text-sm font-bold text-gray-700 transition group-hover:text-indigo-600">
                      {user.name}
                    </span>
                  </Link>

                  <NotificationButton />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="rounded-full px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 hover:text-indigo-600"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="rounded-full bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-600 hover:shadow-lg active:scale-95"
                  >
                    Register
                  </Link>
                </div>
              )}
            </nav>

            <div className="flex items-center gap-2 lg:hidden">
              {loadingUser ? (
                <div className="h-10 w-10 animate-pulse rounded-full bg-gray-100 sm:h-11 sm:w-11" />
              ) : (
                user && <NotificationButton mobile />
              )}

              <button
                type="button"
                onClick={() => setMobileOpen((previous) => !previous)}
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50 active:scale-95 sm:h-11 sm:w-11"
              >
                {mobileOpen ? <X size={21} /> : <Menu size={21} />}
              </button>
            </div>
          </div>
        </div>

        <div
          className={`overflow-hidden border-t border-gray-100 bg-white transition-all duration-300 ease-out lg:hidden ${
            mobileOpen
              ? "max-h-[600px] opacity-100"
              : "max-h-0 border-transparent opacity-0"
          }`}
        >
          <div className="mx-auto w-full max-w-[1500px] px-4 pb-5 pt-3 sm:px-6 sm:pb-6">
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50/80">
              <div className="px-4 pb-2 pt-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
                  Explore
                </p>
              </div>

              <div className="px-2 pb-2">
                <Link
                  to="/tour"
                  onClick={closeMenu}
                  className="flex items-center justify-between rounded-xl px-3 py-3.5 text-[15px] font-semibold text-gray-800 transition hover:bg-white hover:text-indigo-600"
                >
                  Travel
                  <ChevronRight size={18} className="text-gray-400" />
                </Link>

                <Link
                  to="/birthday"
                  onClick={closeMenu}
                  className="flex items-center justify-between rounded-xl px-3 py-3.5 text-[15px] font-semibold text-gray-800 transition hover:bg-white hover:text-indigo-600"
                >
                  Birthday
                  <ChevronRight size={18} className="text-gray-400" />
                </Link>

                <Link
                  to="/event"
                  onClick={closeMenu}
                  className="flex items-center justify-between rounded-xl px-3 py-3.5 text-[15px] font-semibold text-gray-800 transition hover:bg-white hover:text-indigo-600"
                >
                  Event
                  <ChevronRight size={18} className="text-gray-400" />
                </Link>
              </div>
            </div>

            {loadingUser ? (
              <AuthLoading mobile />
            ) : user ? (
              <div className="mt-3 space-y-2">
                <Link
                  to="/profile"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition hover:border-indigo-100 hover:bg-indigo-50/30"
                >
                  <ProfileImage size="mobile" />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-bold text-gray-900">
                      {user.name}
                    </p>

                    <p className="mt-0.5 text-xs font-medium text-gray-400">
                      View Profile
                    </p>
                  </div>

                  <ChevronRight size={19} className="text-gray-400" />
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100 active:scale-[0.98]"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="rounded-xl border border-gray-200 bg-white py-3 text-center text-sm font-bold text-gray-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="rounded-xl bg-gray-950 py-3 text-center text-sm font-bold text-white shadow-sm transition hover:bg-indigo-600 active:scale-[0.98]"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <div
        onClick={closeNotifications}
        className={`fixed inset-0 z-[150] bg-black/30 backdrop-blur-[2px] transition-opacity duration-300 ${
          notificationOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        ref={notificationDrawerRef}
        className={`fixed right-0 top-0 z-[160] flex h-dvh w-full max-w-[420px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
          notificationOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-4 py-4 sm:px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-50 text-yellow-500 ring-1 ring-yellow-100">
              <Bell size={19} />
            </div>

            <div>
              <h2 className="text-base font-bold text-gray-900 sm:text-lg">
                Notifications
              </h2>

              <p className="text-xs text-gray-500">
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
            className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 active:scale-95"
          >
            <X size={19} />
          </button>
        </div>

        {notifications.length > 0 && (
          <div className="flex shrink-0 justify-end border-b border-gray-100 px-4 py-3 sm:px-5">
            <button
              type="button"
              onClick={handleDeleteAllNotifications}
              disabled={deletingAll}
              className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100 hover:text-red-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deletingAll ? (
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-red-200 border-t-red-600" />
              ) : (
                <Trash2 size={14} />
              )}
              Remove All
            </button>
          </div>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {notificationLoading ? (
            <div className="flex min-h-[320px] items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-indigo-600" />

                <p className="text-xs text-gray-500">
                  Loading notifications...
                </p>
              </div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                <Bell size={24} />
              </div>

              <h3 className="mt-4 text-base font-bold text-gray-900">
                No notifications
              </h3>

              <p className="mt-1.5 max-w-xs text-xs leading-5 text-gray-500">
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
                    className={`group relative cursor-pointer px-4 py-4 transition-colors active:bg-gray-100 sm:px-5 ${
                      isUnread
                        ? "bg-yellow-50/30 hover:bg-yellow-50"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                          isUnread
                            ? "bg-yellow-50 text-yellow-500 ring-1 ring-yellow-100"
                            : "bg-white text-gray-600 ring-1 ring-gray-200"
                        }`}
                      >
                        {getNotificationIcon(notification)}
                      </div>

                      <div className="min-w-0 flex-1 pr-9">
                        <div className="flex items-start gap-2">
                          <h3
                            className={`line-clamp-1 text-sm ${
                              isUnread
                                ? "font-bold text-gray-900"
                                : "font-semibold text-gray-800"
                            }`}
                          >
                            {notification?.title || "Notification"}
                          </h3>

                          {isUnread && (
                            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-yellow-500" />
                          )}
                        </div>

                        <p className="mt-1 text-xs leading-5 text-gray-500">
                          {notification?.message ||
                            "You have a new notification."}
                        </p>

                        {getNotificationDate(notification) && (
                          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-gray-400">
                            <Clock size={11} />
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
                        className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-600 active:scale-95 sm:opacity-0 sm:group-hover:opacity-100"
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

        <div className="shrink-0 border-t border-gray-100 bg-white px-4 py-3 sm:px-5">
          <button
            type="button"
            onClick={handleViewAllNotifications}
            className="w-full rounded-xl bg-gray-950 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-600 hover:shadow-md active:scale-[0.99]"
          >
            View All Notifications
          </button>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
