import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Cake,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Headphones,
  MapPin,
  PartyPopper,
  Plane,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { getUserDashboard } from "../../Services/AuthAPI";

/* ------------------------------------------------------------------
   Theme: same tokens as the Tour page.
   light -> indigo accents | dark (global .dark) -> emerald accents
------------------------------------------------------------------ */

const styles = `
  .dash-root {
    --page-bg: #f4f6fa;

    --text: #0f172a;
    --text-soft: #475569;
    --muted: #64748b;

    --teal: #4f46e5;
    --ink: #ffffff;

    --accent-soft: rgba(79, 70, 229, 0.09);
    --accent-ring: rgba(79, 70, 229, 0.18);

    --surface: rgba(255, 255, 255, 0.9);
    --surface-solid: #ffffff;
    --tile: rgba(241, 245, 249, 0.85);

    --border: rgba(15, 23, 42, 0.09);
    --border-hover: rgba(15, 23, 42, 0.18);

    --shadow: 0 24px 70px rgba(15, 23, 42, 0.08);
    --dash-pattern: rgba(15, 23, 42, 0.045);

    --ok: #059669;
    --bad: #dc2626;
    --warn: #d97706;
    --info: #2563eb;

    --pill-blue: #2563eb;
    --pill-ok: #059669;
    --pill-bad: #dc2626;

    background: var(--page-bg);
    color: var(--text);
    transition: background-color 500ms ease, color 500ms ease;
  }

  .dark .dash-root {
    --page-bg: #0f172a;

    --text: #f8fafc;
    --text-soft: #cbd5e1;
    --muted: #94a3b8;

    --teal: #34d399;
    --ink: #04211c;

    --accent-soft: rgba(52, 211, 153, 0.12);
    --accent-ring: rgba(52, 211, 153, 0.2);

    --surface: rgba(15, 23, 42, 0.78);
    --surface-solid: #111b30;
    --tile: rgba(30, 41, 59, 0.55);

    --border: rgba(148, 163, 184, 0.16);
    --border-hover: rgba(148, 163, 184, 0.32);

    --shadow: 0 24px 70px rgba(0, 0, 0, 0.38);
    --dash-pattern: rgba(148, 163, 184, 0.07);

    --ok: #34d399;
    --bad: #f87171;
    --warn: #fbbf24;
    --info: #60a5fa;

    --pill-blue: #3b82f6;
    --pill-ok: #10b981;
    --pill-bad: #ef4444;
  }

  .dash-page {
    position: relative;
    isolation: isolate;
    overflow-x: clip;
  }

  .dash-root.dash-embedded {
    background: transparent;
  }

  .dash-label {
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    line-height: 1;
    color: var(--muted);
  }

  .dash-title-gradient {
    background: linear-gradient(90deg, #4f46e5, #9333ea, #ec4899);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .dark .dash-title-gradient {
    background: linear-gradient(90deg, #34d399, #2dd4bf, #22d3ee);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .dash-card {
    width: 100%;
    border: 1px solid var(--border);
    border-radius: 1.25rem;
    background: transparent;
  }

  .dash-tile {
    border: 1px solid var(--border);
    background: transparent;
  }

  .dash-icon {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    border-radius: 0.75rem;
    background: var(--accent-soft);
    color: var(--teal);
  }

  /* Buttons (only real buttons react on hover) */
  .dash-btn {
    border: 1px solid var(--border-hover);
    background: var(--surface-solid);
    color: var(--text);
    transition: border-color 160ms ease, color 160ms ease;
  }

  .dash-btn:hover {
    border-color: var(--teal);
    color: var(--teal);
  }

  .dash-cta {
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
    color: #ffffff;
    border: 1px solid transparent;
    box-shadow: 0 14px 34px rgba(79, 70, 229, 0.28);
    transition: transform 160ms ease, filter 160ms ease;
  }

  .dark .dash-cta {
    background: linear-gradient(135deg, #10b981, #0d9488);
    box-shadow: 0 14px 34px rgba(16, 185, 129, 0.22);
  }

  .dash-cta:hover {
    filter: brightness(1.06);
    transform: translateY(-1px);
  }

  .dash-cta:active {
    transform: translateY(0);
  }

  /* Tabs */
  .dash-tabs {
    border: 1px solid var(--border);
    border-radius: 0.95rem;
    background: transparent;
  }

  .dash-tab {
    border: 1px solid transparent;
    border-radius: 0.7rem;
    color: var(--text-soft);
    transition: color 160ms ease, background-color 160ms ease,
      border-color 160ms ease;
  }

  .dash-tab:hover { color: var(--teal); }
  .dash-tab[data-tone="ok"]:hover { color: var(--ok); }
  .dash-tab[data-tone="bad"]:hover { color: var(--bad); }

  .dash-tab[data-active="true"] {
    border-color: var(--teal);
    background: var(--accent-soft);
    color: var(--teal);
  }

  .dash-tab[data-active="true"][data-tone="ok"] {
    border-color: var(--ok);
    background: color-mix(in srgb, var(--ok) 12%, transparent);
    color: var(--ok);
  }

  .dash-tab[data-active="true"][data-tone="bad"] {
    border-color: var(--bad);
    background: color-mix(in srgb, var(--bad) 12%, transparent);
    color: var(--bad);
  }

  /* Smooth collapse (height is measured, so it follows content changes) */
  .dash-collapse {
    overflow: hidden;
    opacity: 0;
    visibility: hidden;
    will-change: height;
    transition:
      height 460ms cubic-bezier(0.22, 1, 0.36, 1),
      opacity 280ms ease,
      visibility 0s linear 460ms;
  }

  .dash-collapse[data-open="true"] {
    opacity: 1;
    visibility: visible;
    transition:
      height 460ms cubic-bezier(0.22, 1, 0.36, 1),
      opacity 360ms ease 60ms,
      visibility 0s linear 0s;
  }

  .dash-collapse-inner {
    transform: translateY(-8px);
    transition: transform 460ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .dash-collapse[data-open="true"] .dash-collapse-inner {
    transform: translateY(0);
  }

  .dash-chevron {
    transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .dash-toggle[aria-expanded="true"] .dash-chevron {
    transform: rotate(180deg);
  }

  .dash-total {
    border: 1px solid transparent;
    background: var(--pill-blue);
    color: #ffffff;
    transition: background-color 320ms ease, filter 160ms ease;
  }

  .dash-total[data-tone="ok"] { background: var(--pill-ok); }
  .dash-total[data-tone="bad"] { background: var(--pill-bad); }

  .dash-toggle:hover .dash-total { filter: brightness(1.08); }

  /* Rows */
  .dash-row-title {
    color: var(--text);
    transition: color 160ms ease;
  }

  .dash-row:hover .dash-row-title {
    color: var(--teal);
  }

  .dash-status-ok { color: var(--ok); }
  .dash-status-bad { color: var(--bad); }
  .dash-status-muted { color: var(--muted); }

  .dash-pill-ok { color: var(--ok); background: color-mix(in srgb, var(--ok) 12%, transparent); }
  .dash-pill-bad { color: var(--bad); background: color-mix(in srgb, var(--bad) 12%, transparent); }
  .dash-pill-warn { color: var(--warn); background: color-mix(in srgb, var(--warn) 12%, transparent); }
  .dash-pill-info { color: var(--info); background: color-mix(in srgb, var(--info) 12%, transparent); }
  .dash-pill-muted { color: var(--text-soft); background: var(--tile); }

  /* Scrollbar */
  .dashboard-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: var(--border-hover) transparent;
    scroll-behavior: smooth;
  }

  .dashboard-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
  .dashboard-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .dashboard-scrollbar::-webkit-scrollbar-thumb {
    border-radius: 9999px;
    background: var(--border-hover);
  }

  @media (prefers-reduced-motion: reduce) {
    .dash-root,
    .dash-collapse,
    .dash-collapse-inner,
    .dash-chevron,
    .dash-total,
    .dash-cta { transition: none; }
  }
`;

/* ------------------------------------------------------------------
   Small helpers / components (module level so they are never remounted)
------------------------------------------------------------------ */

const getStatusClass = (status) => {
  if (status === "Confirmed") return "dash-status-ok";
  if (status === "Cancelled") return "dash-status-bad";
  return "dash-status-muted";
};

const getSupportStatus = (status) => {
  switch (status) {
    case "Resolved":
      return { icon: CheckCircle2, className: "dash-pill-ok" };
    case "Closed":
      return { icon: XCircle, className: "dash-pill-muted" };
    case "In Progress":
      return { icon: Clock3, className: "dash-pill-info" };
    default:
      return { icon: Clock3, className: "dash-pill-warn" };
  }
};

const Shell = ({ children, embedded = false }) =>
  embedded ? (
    <div className="dash-root dash-embedded w-full min-w-0">
      <style>{styles}</style>
      {children}
    </div>
  ) : (
    <div className="dash-root w-full overflow-x-clip">
      <style>{styles}</style>

      <main className="dash-page min-h-[calc(100vh-110px)] px-3 pb-6 pt-3 sm:px-6 sm:pb-10 sm:pt-5 lg:px-8 lg:pb-14 lg:pt-6">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            backgroundImage: `
              linear-gradient(
                90deg,
                var(--page-pattern-color, var(--dash-pattern)) 1px,
                transparent 1px
              ),
              linear-gradient(
                0deg,
                var(--page-pattern-color, var(--dash-pattern)) 1px,
                transparent 1px
              )
            `,
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative z-10 mx-auto w-full min-w-0 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );

const EmptyState = ({
  icon: Icon,
  title,
  description,
  buttonText,
  onClick,
}) => (
  <div className="flex min-h-[200px] flex-col items-center justify-center px-5 py-8 text-center">
    <span className="dash-icon h-12 w-12 !rounded-full sm:h-14 sm:w-14">
      <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
    </span>

    <h3 className="mt-4 text-sm font-bold text-[var(--text)] sm:text-base">
      {title}
    </h3>

    <p className="mt-1 max-w-sm text-[13px] leading-6 text-[var(--muted)] sm:text-sm">
      {description}
    </p>

    {buttonText && onClick && (
      <button
        type="button"
        onClick={onClick}
        className="dash-cta mt-5 rounded-xl px-5 py-2.5 text-[13px] font-semibold sm:text-sm"
      >
        {buttonText}
      </button>
    )}
  </div>
);

const DrawerTabs = ({ active, onChange, tabs }) => (
  <div className="dash-tabs grid grid-cols-3 gap-1 p-1">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        type="button"
        onClick={() => onChange(tab.id)}
        data-active={active === tab.id}
        data-tone={
          tab.id === "confirmed"
            ? "ok"
            : tab.id === "cancelled"
              ? "bad"
              : "primary"
        }
        className="dash-tab min-w-0 whitespace-nowrap px-1 py-2.5 text-[11.5px] font-semibold sm:px-4 sm:text-sm"
      >
        {tab.label}
      </button>
    ))}
  </div>
);

const PlanRow = ({
  icon: Icon,
  title,
  subtitle,
  meta,
  budget,
  status,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className="dash-row flex w-full min-w-0 items-start gap-3 border-b border-[var(--border)] px-3.5 py-3.5 text-left last:border-b-0 sm:gap-4 sm:px-5 sm:py-4"
  >
    <span className="dash-icon h-10 w-10 sm:h-11 sm:w-11">
      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
    </span>

    <span className="min-w-0 flex-1">
      <span className="dash-row-title block break-words text-sm font-bold sm:text-base">
        {title}
      </span>

      <span className="mt-0.5 block break-words text-xs text-[var(--text-soft)] sm:text-sm">
        {subtitle}
      </span>

      {meta.length > 0 && (
        <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-[var(--muted)] sm:text-xs">
          {meta.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </span>
      )}
    </span>

    <span className="shrink-0 text-right">
      <span className="block text-xs font-bold text-[var(--text)] sm:text-sm">
        ₹{Number(budget || 0).toLocaleString("en-IN")}
      </span>

      <span
        className={`mt-0.5 block text-[11px] font-medium sm:text-xs ${getStatusClass(
          status,
        )}`}
      >
        {status}
      </span>
    </span>
  </button>
);

const Collapse = ({ open, children }) => {
  const innerRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const element = innerRef.current;

    if (!element) return undefined;

    const update = () => setHeight(element.offsetHeight);

    update();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", update);

      return () => window.removeEventListener("resize", update);
    }

    const observer = new ResizeObserver(update);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="dash-collapse"
      data-open={open}
      aria-hidden={!open}
      style={{ height: open ? height : 0 }}
    >
      <div ref={innerRef} className="dash-collapse-inner">
        {children}
      </div>
    </div>
  );
};

const PlanSection = ({
  icon: Icon,
  title,
  description,
  count,
  isOpen,
  onToggle,
  activeTab,
  setActiveTab,
  tabs,
  plans,
  getRow,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  emptyButtonText,
  emptyButtonAction,
}) => {
  // Blue by default, green on Confirmed, red on Cancelled (only while open)
  const pillTone = !isOpen
    ? "primary"
    : activeTab === "confirmed"
      ? "ok"
      : activeTab === "cancelled"
        ? "bad"
        : "primary";

  return (
    <section className="dash-card overflow-hidden" data-dash-section>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="dash-toggle flex w-full items-center justify-between gap-3 p-3.5 text-left sm:p-5 lg:p-6"
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className="dash-icon h-10 w-10 sm:h-11 sm:w-11">
            <Icon className="h-5 w-5" />
          </span>

          <span className="min-w-0">
            <span className="block text-base font-bold text-[var(--text)] sm:text-lg">
              {title}
            </span>

            <span className="mt-0.5 block text-[13px] leading-5 text-[var(--muted)] sm:text-sm">
              {description}
            </span>
          </span>
        </span>

        <span
          className="dash-total inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold sm:px-4 sm:text-sm"
          data-tone={pillTone}
        >
          <span className="hidden sm:inline">Total Plans</span>

          <span className="tabular-nums">{count}</span>

          <ChevronDown size={16} className="dash-chevron" />
        </span>
      </button>

      <Collapse open={isOpen}>
        <div className="border-t border-[var(--border)] p-3 sm:p-5">
          <DrawerTabs
            active={activeTab}
            onChange={setActiveTab}
            tabs={tabs}
          />

          <div className="dash-tile mt-3 overflow-hidden rounded-xl">
            {plans.length === 0 ? (
              <EmptyState
                icon={emptyIcon}
                title={emptyTitle}
                description={emptyDescription}
                buttonText={emptyButtonText}
                onClick={emptyButtonAction}
              />
            ) : (
              <div
                className={
                  plans.length > 10
                    ? "dashboard-scrollbar max-h-[520px] overflow-y-auto"
                    : ""
                }
              >
                {plans.slice(0, 10).map((plan, index) => (
                  <PlanRow key={plan?._id || index} {...getRow(plan)} />
                ))}
              </div>
            )}
          </div>
        </div>
      </Collapse>
    </section>
  );
};

/* ------------------------------------------------------------------
   Dashboard
------------------------------------------------------------------ */

const Dashboard = ({ embedded = false }) => {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState({
    allTrips: [],
    confirmedTrips: [],
    cancelledTrips: [],
    allBirthdays: [],
    confirmedBirthdays: [],
    cancelledBirthdays: [],
    allEvents: [],
    confirmedEvents: [],
    cancelledEvents: [],
    latestSupportRequest: null,
  });

  const [openDrawer, setOpenDrawer] = useState(null);
  const [activeTripTab, setActiveTripTab] = useState("all");
  const [activeBirthdayTab, setActiveBirthdayTab] = useState("all");
  const [activeEventTab, setActiveEventTab] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchDashboard = async () => {
      try {
        const response = await getUserDashboard();

        if (!response?.status) {
          throw new Error(
            response?.message || "Unable to load dashboard",
          );
        }

        if (!mounted) return;

        const data = response?.data || {};

        setDashboard({
          allTrips: Array.isArray(data.allTrips) ? data.allTrips : [],
          confirmedTrips: Array.isArray(data.confirmedTrips)
            ? data.confirmedTrips
            : [],
          cancelledTrips: Array.isArray(data.cancelledTrips)
            ? data.cancelledTrips
            : [],
          allBirthdays: Array.isArray(data.allBirthdays)
            ? data.allBirthdays
            : [],
          confirmedBirthdays: Array.isArray(data.confirmedBirthdays)
            ? data.confirmedBirthdays
            : [],
          cancelledBirthdays: Array.isArray(data.cancelledBirthdays)
            ? data.cancelledBirthdays
            : [],
          allEvents: Array.isArray(data.allEvents) ? data.allEvents : [],
          confirmedEvents: Array.isArray(data.confirmedEvents)
            ? data.confirmedEvents
            : [],
          cancelledEvents: Array.isArray(data.cancelledEvents)
            ? data.cancelledEvents
            : [],
          latestSupportRequest: data.latestSupportRequest || null,
        });
      } catch (error) {
        if (!mounted) return;

        console.error("DASHBOARD ERROR:", error);

        toast.error(
          error?.response?.data?.message ||
          error?.message ||
          "Unable to load dashboard",
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  const {
    allTrips,
    confirmedTrips,
    cancelledTrips,
    allBirthdays,
    confirmedBirthdays,
    cancelledBirthdays,
    allEvents,
    confirmedEvents,
    cancelledEvents,
    latestSupportRequest,
  } = dashboard;

  // Close the open drawer when the user taps/clicks anywhere outside the
  // plan sections (or presses Escape).
  useEffect(() => {
    if (!openDrawer) return undefined;

    const handleOutside = (event) => {
      if (!event.target.closest?.("[data-dash-section]")) {
        setOpenDrawer(null);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") setOpenDrawer(null);
    };

    document.addEventListener("pointerdown", handleOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [openDrawer]);

  const tripTabs = [
    { id: "all", label: "All Plans", data: allTrips },
    { id: "confirmed", label: "Confirmed", data: confirmedTrips },
    { id: "cancelled", label: "Cancelled", data: cancelledTrips },
  ];

  const birthdayTabs = [
    { id: "all", label: "All Plans", data: allBirthdays },
    { id: "confirmed", label: "Confirmed", data: confirmedBirthdays },
    { id: "cancelled", label: "Cancelled", data: cancelledBirthdays },
  ];

  const eventTabs = [
    { id: "all", label: "All Plans", data: allEvents },
    { id: "confirmed", label: "Confirmed", data: confirmedEvents },
    { id: "cancelled", label: "Cancelled", data: cancelledEvents },
  ];

  const activeTrips =
    tripTabs.find((tab) => tab.id === activeTripTab)?.data || [];

  const activeBirthdays =
    birthdayTabs.find((tab) => tab.id === activeBirthdayTab)?.data || [];

  const activeEvents =
    eventTabs.find((tab) => tab.id === activeEventTab)?.data || [];

  const toggleDrawer = (section) => {
    setOpenDrawer((current) => (current === section ? null : section));
  };

  const handleViewTrip = (tripId) => {
    if (!tripId) {
      toast.error("Trip ID is missing");
      return;
    }

    navigate(`/tour/${tripId}`);
  };

  const handleViewBirthday = (birthdayId) => {
    if (!birthdayId) {
      toast.error("Birthday ID is missing");
      return;
    }

    navigate(`/birthday/${birthdayId}`);
  };

  const handleViewEvent = (eventId) => {
    if (!eventId) {
      toast.error("Event ID is missing");
      return;
    }

    navigate(`/event/${eventId}`);
  };

  const getTripRow = (trip) => ({
    icon: MapPin,
    title: trip?.destination || "Unknown destination",
    subtitle: `${trip?.startLocation || "Unknown location"} → ${trip?.destination || "Destination"
      }`,
    meta: [
      `${trip?.days ?? 0} ${trip?.days === 1 ? "day" : "days"}`,
      `${trip?.people ?? 0} ${trip?.people === 1 ? "person" : "people"}`,
      ...(trip?.travelType ? [trip.travelType] : []),
    ],
    budget: trip?.budget,
    status: trip?.status || "Generated",
    onClick: () => handleViewTrip(trip?._id),
  });

  const getBirthdayRow = (birthday) => ({
    icon: Cake,
    title: birthday?.Name || "Birthday Plan",
    subtitle: birthday?.Area || "Unknown location",
    meta: [
      `Age ${birthday?.Age ?? 0}`,
      `${birthday?.people ?? 0} ${birthday?.people === 1 ? "person" : "people"
      }`,
      ...(birthday?.venueType ? [birthday.venueType] : []),
      ...(birthday?.eventType ? [birthday.eventType] : []),
    ],
    budget: birthday?.budget,
    status: birthday?.status || "Generated",
    onClick: () => handleViewBirthday(birthday?._id),
  });

  const getEventRow = (event) => {
    const people = event?.people ?? event?.guests ?? event?.attendees ?? 0;
    const eventType = event?.eventType || event?.type;

    return {
      icon: PartyPopper,
      title: event?.name || event?.eventName || event?.title || "Event Plan",
      subtitle:
        event?.location || event?.Area || event?.venue || "Unknown location",
      meta: [
        `${people} ${people === 1 ? "person" : "people"}`,
        ...(eventType ? [eventType] : []),
      ],
      budget: event?.budget,
      status: event?.status || "Generated",
      onClick: () => handleViewEvent(event?._id),
    };
  };

  const supportStatus = getSupportStatus(latestSupportRequest?.status);
  const SupportStatusIcon = supportStatus.icon;

  if (loading) {
    return (
      <Shell embedded={embedded}>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[var(--border-hover)] border-t-[var(--teal)]" />

            <p className="mt-4 text-sm text-[var(--muted)]">
              Loading dashboard...
            </p>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell embedded={embedded}>
      {/* Heading */}
      <section className="dash-card mb-3 p-4 sm:mb-4 sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="dash-label">Service Planner</p>

            <h1 className="dash-title-gradient mt-2.5 text-[clamp(1.5rem,4vw,2.25rem)] font-medium leading-tight tracking-[-0.02em]">
              Dashboard
            </h1>

            <p className="mt-2 max-w-2xl text-[13px] leading-6 text-[var(--text-soft)] sm:text-sm">
              Manage your experiences, plans, and support requests from one
              place.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="dash-btn inline-flex h-10 w-full shrink-0 items-center justify-center rounded-xl px-4 text-[13px] font-semibold sm:w-auto sm:text-sm"
          >
            Back to Home
          </button>
        </div>
      </section>

      {/* Plans */}
      <div className="space-y-3 sm:space-y-4">
        <PlanSection
          icon={Plane}
          title="Tour"
          description="View and manage your tour plans."
          count={allTrips.length}
          isOpen={openDrawer === "tour"}
          onToggle={() => toggleDrawer("tour")}
          activeTab={activeTripTab}
          setActiveTab={setActiveTripTab}
          tabs={tripTabs}
          plans={activeTrips}
          getRow={getTripRow}
          emptyIcon={Plane}
          emptyTitle={
            activeTripTab === "confirmed"
              ? "No confirmed plans"
              : activeTripTab === "cancelled"
                ? "No cancelled plans"
                : "No tour plans yet"
          }
          emptyDescription={
            activeTripTab === "confirmed"
              ? "Your confirmed tour plans will appear here."
              : activeTripTab === "cancelled"
                ? "Your cancelled tour plans will appear here."
                : "Create your first tour plan and it will appear here."
          }
          emptyButtonText={
            activeTripTab === "cancelled" ? undefined : "Create a tour"
          }
          emptyButtonAction={
            activeTripTab === "cancelled" ? undefined : () => navigate("/tour")
          }
        />

        <PlanSection
          icon={Cake}
          title="Birthday"
          description="View and manage your birthday plans."
          count={allBirthdays.length}
          isOpen={openDrawer === "birthday"}
          onToggle={() => toggleDrawer("birthday")}
          activeTab={activeBirthdayTab}
          setActiveTab={setActiveBirthdayTab}
          tabs={birthdayTabs}
          plans={activeBirthdays}
          getRow={getBirthdayRow}
          emptyIcon={Cake}
          emptyTitle={
            activeBirthdayTab === "confirmed"
              ? "No confirmed plans"
              : activeBirthdayTab === "cancelled"
                ? "No cancelled plans"
                : "No birthday plans yet"
          }
          emptyDescription={
            activeBirthdayTab === "confirmed"
              ? "Your confirmed birthday plans will appear here."
              : activeBirthdayTab === "cancelled"
                ? "Your cancelled birthday plans will appear here."
                : "Create your first birthday plan and it will appear here."
          }
          emptyButtonText={
            activeBirthdayTab === "cancelled" ? undefined : "Plan a birthday"
          }
          emptyButtonAction={
            activeBirthdayTab === "cancelled"
              ? undefined
              : () => navigate("/birthday")
          }
        />

        <PlanSection
          icon={PartyPopper}
          title="Event"
          description="View and manage your event plans."
          count={allEvents.length}
          isOpen={openDrawer === "event"}
          onToggle={() => toggleDrawer("event")}
          activeTab={activeEventTab}
          setActiveTab={setActiveEventTab}
          tabs={eventTabs}
          plans={activeEvents}
          getRow={getEventRow}
          emptyIcon={PartyPopper}
          emptyTitle={
            activeEventTab === "confirmed"
              ? "No confirmed plans"
              : activeEventTab === "cancelled"
                ? "No cancelled plans"
                : "No event plans yet"
          }
          emptyDescription={
            activeEventTab === "confirmed"
              ? "Your confirmed event plans will appear here."
              : activeEventTab === "cancelled"
                ? "Your cancelled event plans will appear here."
                : "Create your first event plan and it will appear here."
          }
          emptyButtonText={
            activeEventTab === "cancelled" ? undefined : "Create an event"
          }
          emptyButtonAction={
            activeEventTab === "cancelled"
              ? undefined
              : () => navigate("/event")
          }
        />

        {/* Support */}
        <section className="dash-card overflow-hidden">
          <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 lg:p-6">
            <div className="flex min-w-0 items-center gap-3">
              <span className="dash-icon h-10 w-10 sm:h-11 sm:w-11">
                <Headphones className="h-5 w-5" />
              </span>

              <div className="min-w-0">
                <h2 className="text-base font-bold text-[var(--text)] sm:text-lg">
                  Support Request
                </h2>

                <p className="mt-0.5 text-[13px] leading-5 text-[var(--muted)] sm:text-sm">
                  Check the status of your latest support request.
                </p>
              </div>
            </div>

          </div>

          {latestSupportRequest ? (
            <div className="border-t border-[var(--border)] p-3 sm:p-5 lg:p-6">
              <div className="dash-tile flex flex-col gap-4 rounded-2xl p-4 sm:p-5 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <p className="dash-label">Latest Request</p>

                  <h3 className="mt-2.5 break-words text-sm font-bold text-[var(--text)] sm:text-base">
                    {latestSupportRequest.subject || "Support Request"}
                  </h3>

                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--text-soft)]">
                    {latestSupportRequest.category && (
                      <span>{latestSupportRequest.category}</span>
                    )}

                    {latestSupportRequest.priority && (
                      <span>Priority: {latestSupportRequest.priority}</span>
                    )}
                  </div>
                </div>

                <div
                  className={`inline-flex shrink-0 items-center gap-2 self-start rounded-full px-3.5 py-2 text-xs font-semibold sm:text-sm md:self-center ${supportStatus.className}`}
                >
                  <SupportStatusIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  {latestSupportRequest.status || "Pending"}
                </div>
              </div>
            </div>
          ) : (
            <div className="border-t border-[var(--border)]">
              <EmptyState
                icon={Headphones}
                title="No support requests"
                description="If you face any problem, contact our support team and track your request here."
                buttonText="Contact Support"
                onClick={() => navigate("/support")}
              />
            </div>
          )}
        </section>
      </div>
    </Shell>
  );
};

export default Dashboard;