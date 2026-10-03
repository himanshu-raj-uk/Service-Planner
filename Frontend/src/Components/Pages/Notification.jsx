import React, { useEffect, useRef, useState } from "react";
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock,
  Plane,
  Trash2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// NOTE: adjust this path if your Navbar lives somewhere else.
import Navbar from "../../Components/Layout/Navbar";

import {
  getNotifications,
  getUnreadNotification,
  deleteNotification,
  deleteAllNotifications,
} from "../../Services/AuthAPI";

const SWIPE_THRESHOLD = 70;
const MAX_SWIPE = 110;

// Remove animation: row slides out (300ms), then its height collapses.
const SLIDE_MS = 300;
const COLLAPSE_DELAY_MS = 150;
const COLLAPSE_MS = 300;
const REMOVE_TOTAL_MS = COLLAPSE_DELAY_MS + COLLAPSE_MS + 30;
const STAGGER_MS = 40;
const MAX_STAGGER_ITEMS = 8;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const Notification = () => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [deletingAll, setDeletingAll] = useState(false);
  const [removingIds, setRemovingIds] = useState(() => new Set());
  const [swipeId, setSwipeId] = useState(null);
  const [swipeX, setSwipeX] = useState(0);

  const startX = useRef(0);
  const currentX = useRef(0);
  const dragging = useRef(false);

  const getNotificationId = (notification) =>
    notification?._id || notification?.id || null;

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const response = await getNotifications();

      const data = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.notifications)
          ? response.notifications
          : [];

      setNotifications(data);
    } catch (error) {
      setNotifications([]);

      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to load notifications",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await getUnreadNotification();
      const count = Number(response?.data?.count || 0);

      setUnreadCount(Number.isNaN(count) ? 0 : count);
    } catch {
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  const getTitle = (notification) =>
    notification?.title ||
    notification?.subject ||
    notification?.type ||
    "Notification";

  const getMessage = (notification) =>
    notification?.message ||
    notification?.description ||
    notification?.text ||
    "You have a new notification.";

  const getDate = (notification) => {
    const date =
      notification?.createdAt ||
      notification?.created_at ||
      notification?.date;

    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "";

    return parsedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getIcon = (notification) => {
    const type = String(
      notification?.type || notification?.category || "",
    ).toLowerCase();

    if (
      type.includes("travel") ||
      type.includes("trip") ||
      type.includes("tour")
    ) {
      return <Plane size={20} strokeWidth={2} />;
    }

    if (
      type.includes("birthday") ||
      type.includes("event") ||
      type.includes("wedding")
    ) {
      return <CalendarDays size={20} strokeWidth={2} />;
    }

    return <CheckCircle2 size={20} strokeWidth={2} />;
  };

  const handleNotificationClick = (notification) => {
    if (dragging.current) {
      dragging.current = false;
      return;
    }

    if (notification?.link) {
      navigate(notification.link);
      return;
    }

    const type = String(
      notification?.type || notification?.category || "",
    ).toLowerCase();

    const isTourNotification =
      type.includes("travel") || type.includes("trip") || type.includes("tour");

    const isBirthdayNotification = type.includes("birthday");

    const tripId =
      notification?.tripId?._id ||
      notification?.tripId?.id ||
      notification?.tripId ||
      notification?.trip?._id ||
      notification?.trip?.id ||
      notification?.trip?.tripId ||
      notification?.data?.tripId ||
      notification?.data?.trip?._id ||
      notification?.data?.trip?.id ||
      null;

    const birthdayId =
      notification?.birthdayId?._id ||
      notification?.birthdayId?.id ||
      notification?.birthdayId ||
      notification?.birthday?._id ||
      notification?.birthday?.id ||
      notification?.birthday?.birthdayId ||
      notification?.data?.birthdayId ||
      notification?.data?.birthday?._id ||
      notification?.data?.birthday?.id ||
      null;

    if (isTourNotification) {
      if (tripId) {
        navigate(`/tour/${tripId}`);
      } else {
        toast.error("This tour is no longer available.");
      }

      return;
    }

    if (isBirthdayNotification) {
      if (birthdayId) {
        navigate(`/birthday/${birthdayId}`);
      } else {
        toast.error("This birthday plan is no longer available.");
      }

      return;
    }

    if (
      type.includes("event") ||
      type.includes("wedding") ||
      type.includes("corporate")
    ) {
      navigate("/event");
    }
  };

  /* =========================================================
     REMOVE (animated)

     1. Mark the row as "removing" -> it slides out, then its
        height collapses smoothly.
     2. The API call runs in parallel with the animation.
     3. Once both are done the row is dropped from state.
     4. If the API fails, the row slides back in.
  ========================================================= */

  const removeNotification = async (notificationId) => {
    if (!notificationId) {
      toast.error("Invalid notification ID");
      return;
    }

    if (removingIds.has(notificationId)) return;

    setDeletingId(notificationId);
    setSwipeId(null);
    setSwipeX(0);

    setRemovingIds((previous) => new Set(previous).add(notificationId));

    try {
      await Promise.all([
        deleteNotification(notificationId),
        wait(SLIDE_MS + COLLAPSE_DELAY_MS + COLLAPSE_MS),
      ]);

      setNotifications((previous) =>
        previous.filter(
          (notification) => getNotificationId(notification) !== notificationId,
        ),
      );

      setUnreadCount((previous) => Math.max(previous - 1, 0));

      toast.success("Notification removed");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to remove notification",
      );
    } finally {
      setRemovingIds((previous) => {
        const next = new Set(previous);
        next.delete(notificationId);
        return next;
      });

      setDeletingId(null);
    }
  };

  const removeAllNotifications = async () => {
    if (!notifications.length || deletingAll) return;

    const allIds = notifications.map(getNotificationId).filter(Boolean);

    setDeletingAll(true);
    setSwipeId(null);
    setSwipeX(0);
    setRemovingIds(new Set(allIds));

    const staggerTotal =
      Math.min(allIds.length, MAX_STAGGER_ITEMS) * STAGGER_MS;

    try {
      await Promise.all([
        deleteAllNotifications(),
        wait(staggerTotal + SLIDE_MS + COLLAPSE_DELAY_MS + COLLAPSE_MS),
      ]);

      setNotifications([]);
      setUnreadCount(0);

      toast.success("All notifications removed");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to remove notifications",
      );
    } finally {
      setRemovingIds(new Set());
      setDeletingAll(false);
    }
  };

  const handlePointerDown = (event, notificationId) => {
    if (!notificationId || removingIds.has(notificationId)) return;

    startX.current = event.clientX;
    currentX.current = event.clientX;
    dragging.current = false;

    setSwipeId(notificationId);
    setSwipeX(0);

    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event, notificationId) => {
    if (swipeId !== notificationId) return;

    currentX.current = event.clientX;

    const distance = currentX.current - startX.current;

    if (distance < -8) {
      dragging.current = true;

      const nextX = Math.max(distance, -MAX_SWIPE);
      setSwipeX(nextX);
    }

    if (distance > 5) {
      setSwipeX(0);
    }
  };

  const handlePointerUp = async (event, notificationId) => {
    if (swipeId !== notificationId) return;

    const distance = currentX.current - startX.current;

    event.currentTarget.releasePointerCapture?.(event.pointerId);

    if (distance <= -SWIPE_THRESHOLD) {
      await removeNotification(notificationId);
      return;
    }

    setSwipeX(0);

    setTimeout(() => {
      setSwipeId(null);
      dragging.current = false;
    }, 180);
  };

  const handlePointerCancel = () => {
    setSwipeX(0);
    setSwipeId(null);
    dragging.current = false;
  };

  const closeSwipe = () => {
    setSwipeX(0);
    setSwipeId(null);
    dragging.current = false;
  };

  return (
    <>
      <Navbar />

      <main
        className="
          relative
          min-h-[calc(100vh-76px)]
          overflow-hidden
          bg-[#f4f6fa]
          px-3
          py-5
          text-[var(--text-primary)]
          transition-colors
          duration-500
          sm:px-6
          sm:py-7
          lg:px-8
          lg:py-8
          dark:bg-[#0f172a]
        "
      >
        {/* Background grid pattern (same as Banner) */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(
                90deg,
                var(--page-pattern-color) 1px,
                transparent 1px
              ),
              linear-gradient(
                0deg,
                var(--page-pattern-color) 1px,
                transparent 1px
              )
            `,
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative z-10 mx-auto w-full max-w-5xl">
          {/* HEADER */}
          <div className="mb-5 flex flex-col gap-4 sm:mb-7 sm:flex-row sm:items-center sm:gap-5">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <h1 className="truncate text-xl font-bold tracking-tight text-[var(--text-primary)] sm:text-2xl">
                  Notifications
                </h1>

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-yellow-50 text-yellow-500 shadow-sm ring-1 ring-yellow-100 dark:bg-yellow-500/10 dark:text-yellow-400 dark:ring-yellow-500/25">
                  <Bell size={18} strokeWidth={2.2} />
                </div>
              </div>

              <p className="mt-1 text-xs leading-5 text-[var(--text-secondary)] sm:text-sm">
                Stay updated with your latest activities
              </p>
            </div>

            <div className="flex w-full items-center justify-between gap-2 sm:ml-auto sm:w-auto sm:justify-end sm:gap-2.5">
              {unreadCount > 0 && (
                <div className="min-w-0 rounded-full border border-indigo-100 bg-[var(--app-surface)] px-3 py-1.5 text-center text-xs font-semibold text-indigo-600 shadow-sm dark:border-indigo-500/30 dark:text-indigo-300">
                  {unreadCount} unread
                  {unreadCount !== 1 ? " notifications" : " notification"}
                </div>
              )}

              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={removeAllNotifications}
                  disabled={deletingAll}
                  className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 text-xs font-semibold text-red-600 shadow-sm transition-all duration-200 hover:border-red-300 hover:bg-red-100 hover:text-red-700 hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:h-auto sm:px-4 sm:py-2.5 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400 dark:hover:border-red-500/50 dark:hover:bg-red-500/20 dark:hover:text-red-300"
                >
                  {deletingAll ? (
                    <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-red-200 border-t-red-600 dark:border-red-500/30 dark:border-t-red-400" />
                  ) : (
                    <Trash2
                      size={16}
                      strokeWidth={2}
                      className="h-4 w-4 shrink-0"
                    />
                  )}

                  <span className="whitespace-nowrap">Remove All</span>
                </button>
              )}
            </div>
          </div>

          {/* LIST CARD */}
          <section className="overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--app-surface)] shadow-[0_10px_40px_rgba(15,23,42,0.06)] transition-colors duration-500 dark:shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
            {loading ? (
              <div className="flex min-h-[320px] items-center justify-center px-5">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--border-color)] border-t-indigo-600 dark:border-t-indigo-400" />

                  <p className="text-sm font-medium text-[var(--text-secondary)]">
                    Loading notifications...
                  </p>
                </div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex min-h-[360px] flex-col items-center justify-center px-5 py-10 text-center">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[var(--app-surface-secondary)] text-[var(--text-secondary)]">
                  <Bell size={27} strokeWidth={2} />
                </div>

                <h2 className="mt-5 text-lg font-bold text-[var(--text-primary)]">
                  No notifications
                </h2>

                <p className="mt-2 max-w-sm text-sm leading-6 text-[var(--text-secondary)]">
                  You're all caught up. New notifications will appear here.
                </p>

                {/* Default = theme base. Hover / focus / click = brand colour. */}
                <button
                  type="button"
                  onClick={() => navigate("/tour")}
                  className="
                    mt-6
                    rounded-xl
                    border
                    border-[var(--border-color)]
                    bg-[var(--app-surface-secondary)]
                    px-5
                    py-2.5
                    text-sm
                    font-semibold
                    text-[var(--text-primary)]
                    transition-all
                    duration-300
                    hover:border-indigo-600
                    hover:bg-indigo-600
                    hover:text-white
                    hover:shadow-lg
                    hover:shadow-indigo-500/20
                    focus:border-indigo-600
                    focus:bg-indigo-600
                    focus:text-white
                    focus:outline-none
                    active:scale-95
                    active:border-indigo-700
                    active:bg-indigo-700
                    active:text-white
                    dark:hover:border-indigo-500
                    dark:hover:bg-indigo-500
                    dark:focus:border-indigo-500
                    dark:focus:bg-indigo-500
                    dark:active:border-indigo-600
                    dark:active:bg-indigo-600
                  "
                >
                  Start Planning
                </button>
              </div>
            ) : (
              <div>
                {notifications.map((notification, index) => {
                  const notificationId = getNotificationId(notification);

                  if (!notificationId) return null;

                  const isUnread =
                    notification?.isRead === false ||
                    notification?.read === false;

                  const isSwiping = swipeId === notificationId;
                  const isDeleting = deletingId === notificationId;
                  const isRemoving = removingIds.has(notificationId);
                  const isLast = index === notifications.length - 1;

                  const staggerDelay = deletingAll
                    ? Math.min(index, MAX_STAGGER_ITEMS) * STAGGER_MS
                    : 0;

                  const isDragging = isSwiping && swipeX < 0;

                  return (
                    /* Collapsing wrapper: height animates 1fr -> 0fr */
                    <div
                      key={notificationId}
                      style={{
                        transitionDelay: isRemoving
                          ? `${staggerDelay + COLLAPSE_DELAY_MS}ms`
                          : "0ms",
                        transitionDuration: `${COLLAPSE_MS}ms`,
                      }}
                      className={`grid transition-[grid-template-rows,opacity] ease-in-out ${isRemoving
                          ? "grid-rows-[0fr] opacity-0"
                          : "grid-rows-[1fr] opacity-100"
                        }`}
                    >
                      <div className="min-h-0 overflow-hidden">
                        <div
                          className={`relative overflow-hidden bg-[var(--app-surface)] ${isLast
                              ? ""
                              : "border-b border-[var(--border-light)]"
                            }`}
                        >
                          {/* Red action revealed behind the row */}
                          <div
                            className={`absolute inset-y-0 right-0 flex w-[110px] items-center justify-center bg-red-500 transition-opacity duration-200 sm:w-[135px] ${isSwiping || isRemoving
                                ? "opacity-100"
                                : "opacity-0"
                              }`}
                          >
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                removeNotification(notificationId);
                              }}
                              disabled={isDeleting}
                              className="flex h-full w-full flex-col items-center justify-center gap-1 bg-red-500 text-white transition-colors duration-200 hover:bg-red-600 active:bg-red-700 disabled:cursor-not-allowed"
                              aria-label="Remove notification"
                            >
                              {isDeleting ? (
                                <span className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                              ) : (
                                <Trash2
                                  size={20}
                                  strokeWidth={2}
                                  className="h-5 w-5 shrink-0"
                                />
                              )}

                              <span className="text-[11px] font-semibold">
                                Remove
                              </span>
                            </button>
                          </div>

                          {/* Sliding row */}
                          <div
                            role="button"
                            tabIndex={0}
                            onClick={() =>
                              handleNotificationClick(notification)
                            }
                            onKeyDown={(event) => {
                              if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                handleNotificationClick(notification);
                              }
                            }}
                            onPointerDown={(event) =>
                              handlePointerDown(event, notificationId)
                            }
                            onPointerMove={(event) =>
                              handlePointerMove(event, notificationId)
                            }
                            onPointerUp={(event) =>
                              handlePointerUp(event, notificationId)
                            }
                            onPointerCancel={handlePointerCancel}
                            style={{
                              transform: isRemoving
                                ? "translateX(-100%)"
                                : `translateX(${isSwiping ? swipeX : 0}px)`,
                              transitionDelay: isRemoving
                                ? `${staggerDelay}ms`
                                : "0ms",
                            }}
                            className={`relative z-10 cursor-pointer touch-pan-y select-none px-3.5 py-4 text-left sm:px-6 sm:py-5 ${isRemoving
                                ? "pointer-events-none transition-transform duration-300 ease-in"
                                : isDragging
                                  ? "transition-none"
                                  : "transition-[transform,background-color] duration-200 ease-out"
                              } ${isUnread
                                ? "bg-[var(--app-surface-secondary)]"
                                : "bg-[var(--app-surface)] hover:bg-[var(--app-surface-secondary)]"
                              }`}
                          >
                            <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                              <div
                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${isUnread
                                    ? "bg-indigo-600 text-white dark:bg-indigo-500"
                                    : "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                                  }`}
                              >
                                {getIcon(notification)}
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex min-w-0 items-start justify-between gap-3">
                                  <h2
                                    className={`min-w-0 break-words text-sm leading-5 text-[var(--text-primary)] sm:text-base sm:leading-6 ${isUnread ? "font-bold" : "font-semibold"
                                      }`}
                                  >
                                    {getTitle(notification)}
                                  </h2>

                                  {isUnread && (
                                    <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                                  )}
                                </div>

                                <p className="mt-1.5 break-words text-xs leading-5 text-[var(--text-secondary)] sm:text-sm sm:leading-6">
                                  {getMessage(notification)}
                                </p>

                                {getDate(notification) && (
                                  <div className="mt-2 flex min-w-0 items-center gap-1.5 text-[10px] leading-4 text-[var(--text-muted)] sm:text-xs sm:leading-5">
                                    <Clock
                                      size={13}
                                      strokeWidth={2}
                                      className="shrink-0"
                                    />

                                    <span className="break-words">
                                      {getDate(notification)}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {isSwiping && swipeX < -20 && (
                                <button
                                  type="button"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    closeSwipe();
                                  }}
                                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--app-surface-secondary)] text-[var(--text-muted)] transition-colors duration-200 hover:text-[var(--text-primary)]"
                                  aria-label="Close remove action"
                                >
                                  <X size={16} strokeWidth={2} />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {!loading && notifications.length > 0 && (
            <div className="mt-4 px-2 text-center">
              <p className="text-[10px] font-medium leading-4 text-[var(--text-muted)] sm:text-xs sm:leading-5">
                Swipe left on a notification to remove it
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Notification;