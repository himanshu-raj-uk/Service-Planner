import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Cake,
  CheckCircle2,
  Clock3,
  Headphones,
  MapPin,
  Plane,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { getUserDashboard } from "../../Services/AuthAPI";

const Dashboard = () => {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState({
    allTrips: [],
    confirmedTrips: [],
    cancelledTrips: [],
    allBirthdays: [],
    confirmedBirthdays: [],
    cancelledBirthdays: [],
    latestSupportRequest: null,
  });

  const [activeTripTab, setActiveTripTab] = useState("all");
  const [activeBirthdayTab, setActiveBirthdayTab] = useState("all");
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
          allTrips: Array.isArray(data.allTrips)
            ? data.allTrips
            : [],
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
          latestSupportRequest:
            data.latestSupportRequest || null,
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
    latestSupportRequest,
  } = dashboard;

  const tripTabs = [
    {
      id: "all",
      label: "All Trips",
      data: allTrips,
    },
    {
      id: "confirmed",
      label: "Confirmed",
      data: confirmedTrips,
    },
    {
      id: "cancelled",
      label: "Cancelled",
      data: cancelledTrips,
    },
  ];

  const birthdayTabs = [
    {
      id: "all",
      label: "All Birthdays",
      data: allBirthdays,
    },
    {
      id: "confirmed",
      label: "Confirmed",
      data: confirmedBirthdays,
    },
    {
      id: "cancelled",
      label: "Cancelled",
      data: cancelledBirthdays,
    },
  ];

  const activeTrips =
    tripTabs.find((tab) => tab.id === activeTripTab)?.data || [];

  const activeBirthdays =
    birthdayTabs.find(
      (tab) => tab.id === activeBirthdayTab,
    )?.data || [];

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

  const getSupportStatus = (status) => {
    switch (status) {
      case "Resolved":
        return {
          icon: CheckCircle2,
          className: "bg-emerald-50 text-emerald-700",
        };

      case "Closed":
        return {
          icon: XCircle,
          className: "bg-slate-100 text-slate-600",
        };

      case "In Progress":
        return {
          icon: Clock3,
          className: "bg-blue-50 text-blue-700",
        };

      default:
        return {
          icon: Clock3,
          className: "bg-amber-50 text-amber-700",
        };
    }
  };

  const TripCard = ({ trip }) => (
    <button
      type="button"
      onClick={() => handleViewTrip(trip?._id)}
      className="group flex w-full min-w-0 flex-col gap-3 border-b border-slate-100 px-4 py-4 text-left transition-all duration-200 last:border-b-0 hover:bg-slate-50 active:bg-slate-100 sm:gap-4 sm:px-6 sm:py-5 md:flex-row md:items-center md:justify-between md:gap-6"
    >
      <div className="flex min-w-0 w-full items-start gap-3 sm:gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500 transition-all duration-200 group-hover:scale-105 group-hover:bg-indigo-100 sm:h-11 sm:w-11">
          <MapPin className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
        </div>

        <div className="min-w-0 flex-1 overflow-hidden">
          <h3 className="truncate text-sm font-semibold leading-5 text-slate-800 transition-colors duration-200 group-hover:text-indigo-600 sm:text-[15px] sm:leading-6">
            {trip?.destination || "Unknown destination"}
          </h3>

          <p className="mt-1 truncate text-xs leading-5 text-slate-500 sm:text-[13px]">
            {trip?.startLocation || "Unknown location"} →{" "}
            {trip?.destination || "Destination"}
          </p>

          <div className="mt-2 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-xs leading-5 text-slate-500 sm:gap-x-4">
            <span className="whitespace-nowrap">
              {trip?.days ?? 0}{" "}
              {trip?.days === 1 ? "day" : "days"}
            </span>

            <span className="whitespace-nowrap">
              {trip?.people ?? 0}{" "}
              {trip?.people === 1 ? "person" : "people"}
            </span>

            {trip?.travelType && (
              <span className="max-w-full truncate">
                {trip.travelType}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex w-full shrink-0 items-center justify-between border-t border-slate-100 pt-3 sm:border-0 sm:pt-0 md:w-auto md:min-w-[150px] md:justify-end">
        <div className="min-w-0 text-left md:text-right">
          <p className="text-sm font-semibold leading-5 text-slate-800 sm:text-[15px]">
            ₹{Number(trip?.budget || 0).toLocaleString("en-IN")}
          </p>

          <p className="mt-0.5 truncate text-xs leading-5 text-slate-500 sm:text-[13px]">
            {trip?.status || "Generated"}
          </p>
        </div>
      </div>
    </button>
  );

  const BirthdayCard = ({ birthday }) => (
    <button
      type="button"
      onClick={() => handleViewBirthday(birthday?._id)}
      className="group flex w-full min-w-0 flex-col gap-3 border-b border-slate-100 px-4 py-4 text-left transition-all duration-200 last:border-b-0 hover:bg-slate-50 active:bg-slate-100 sm:gap-4 sm:px-6 sm:py-5 md:flex-row md:items-center md:justify-between md:gap-6"
    >
      <div className="flex min-w-0 w-full items-start gap-3 sm:gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-500 transition-all duration-200 group-hover:scale-105 group-hover:bg-pink-100 sm:h-11 sm:w-11">
          <Cake className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
        </div>

        <div className="min-w-0 flex-1 overflow-hidden">
          <h3 className="truncate text-sm font-semibold leading-5 text-slate-800 transition-colors duration-200 group-hover:text-pink-600 sm:text-[15px] sm:leading-6">
            {birthday?.Name || "Birthday Plan"}
          </h3>

          <p className="mt-1 truncate text-xs leading-5 text-slate-500 sm:text-[13px]">
            {birthday?.Area || "Unknown location"}
          </p>

          <div className="mt-2 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-xs leading-5 text-slate-500 sm:gap-x-4">
            <span className="whitespace-nowrap">
              Age {birthday?.Age ?? 0}
            </span>

            <span className="whitespace-nowrap">
              {birthday?.people ?? 0}{" "}
              {birthday?.people === 1 ? "person" : "people"}
            </span>

            {birthday?.venueType && (
              <span className="max-w-full truncate">
                {birthday.venueType}
              </span>
            )}

            {birthday?.eventType && (
              <span className="max-w-full truncate">
                {birthday.eventType}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex w-full shrink-0 items-center justify-between border-t border-slate-100 pt-3 sm:border-0 sm:pt-0 md:w-auto md:min-w-[150px] md:justify-end">
        <div className="min-w-0 text-left md:text-right">
          <p className="text-sm font-semibold leading-5 text-slate-800 sm:text-[15px]">
            ₹
            {Number(birthday?.budget || 0).toLocaleString(
              "en-IN",
            )}
          </p>

          <p className="mt-0.5 truncate text-xs leading-5 text-slate-500 sm:text-[13px]">
            {birthday?.status || "Generated"}
          </p>
        </div>
      </div>
    </button>
  );

  const EmptyState = ({
    icon: Icon,
    title,
    description,
    buttonText,
    onClick,
    type = "trip",
  }) => {
    const birthday = type === "birthday";

    return (
      <div className="flex min-h-[220px] flex-col items-center justify-center px-5 py-9 text-center sm:min-h-[250px] sm:px-6">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl sm:h-14 sm:w-14 ${
            birthday ? "bg-pink-50" : "bg-indigo-50"
          }`}
        >
          <Icon
            className={`h-5 w-5 sm:h-6 sm:w-6 ${
              birthday ? "text-pink-500" : "text-indigo-500"
            }`}
          />
        </div>

        <h3 className="mt-4 text-sm font-semibold leading-5 text-slate-800 sm:text-base">
          {title}
        </h3>

        <p className="mt-1.5 max-w-sm text-xs leading-5 text-slate-500 sm:text-[13px] sm:leading-6">
          {description}
        </p>

        {buttonText && onClick && (
          <button
            type="button"
            onClick={onClick}
            className={`mt-5 inline-flex min-h-10 items-center justify-center rounded-xl px-4 py-2.5 text-xs font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 sm:min-h-11 sm:px-5 sm:text-sm ${
              birthday
                ? "bg-pink-500 hover:bg-pink-600"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {buttonText}
          </button>
        )}
      </div>
    );
  };

  const StatCard = ({
    title,
    count,
    icon: Icon,
    iconClass,
  }) => (
    <div className="min-w-0 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5">
      <div className="flex min-w-0 items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium leading-5 text-slate-500 sm:text-sm">
            {title}
          </p>

          <p className="mt-1.5 text-2xl font-semibold leading-none text-slate-800 sm:mt-2 sm:text-3xl">
            {count}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${iconClass}`}
        >
          <Icon className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
        </div>
      </div>
    </div>
  );

  const TabButton = ({
    active,
    onClick,
    children,
    type = "trip",
  }) => {
    const birthday = type === "birthday";

    return (
      <button
        type="button"
        onClick={onClick}
        className={`min-h-10 shrink-0 whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-semibold transition-all duration-200 sm:min-h-10 sm:px-5 sm:text-sm ${
          active
            ? birthday
              ? "bg-pink-500 text-white shadow-sm"
              : "bg-indigo-600 text-white shadow-sm"
            : "bg-transparent text-slate-500 hover:bg-white hover:text-slate-700"
        }`}
      >
        {children}
      </button>
    );
  };

  const supportStatus = getSupportStatus(
    latestSupportRequest?.status,
  );

  if (loading) {
    return (
      <main className="min-h-screen w-full overflow-x-hidden bg-slate-50 px-4 py-8 font-sans sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[60vh] w-full max-w-7xl items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600 sm:h-9 sm:w-9" />

            <p className="mt-4 text-sm font-medium text-slate-500">
              Loading dashboard...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-page min-h-screen w-full overflow-x-hidden bg-slate-50 px-3 py-4 font-sans sm:px-5 sm:py-6 lg:px-6 lg:py-7">
      <style>{`
        .dashboard-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #c7d2fe transparent;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }

        .dashboard-scrollbar::-webkit-scrollbar {
          width: 5px;
        }

        .dashboard-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 999px;
        }

        .dashboard-scrollbar::-webkit-scrollbar-thumb {
          background: #c7d2fe;
          border-radius: 999px;
        }

        .dashboard-scrollbar::-webkit-scrollbar-button {
          display: none;
          width: 0;
          height: 0;
        }

        .dashboard-tabs {
          scrollbar-width: none;
          -ms-overflow-style: none;
          -webkit-overflow-scrolling: touch;
        }

        .dashboard-tabs::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <div className="mx-auto w-full max-w-7xl">
        <section className="mb-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:mb-5 sm:p-6 md:p-7">
          <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-indigo-600">
                Service Planner
              </p>

              <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-slate-800 sm:mt-2 sm:text-3xl">
                Dashboard
              </h1>

              <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
                Manage your travel plans, birthday plans, and
                support requests from one place.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="inline-flex min-h-11 w-full shrink-0 items-center justify-center rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 active:scale-[0.99] sm:w-auto"
            >
              Back to Home
            </button>
          </div>
        </section>

        <section className="mb-4 grid grid-cols-2 gap-3 sm:mb-5 sm:grid-cols-3 sm:gap-4">
          <StatCard
            title="All Trips"
            count={allTrips.length}
            icon={Plane}
            iconClass="bg-indigo-50 text-indigo-500"
          />

          <StatCard
            title="Confirmed Trips"
            count={confirmedTrips.length}
            icon={CheckCircle2}
            iconClass="bg-emerald-50 text-emerald-500"
          />

          <StatCard
            title="Cancelled Trips"
            count={cancelledTrips.length}
            icon={XCircle}
            iconClass="bg-red-50 text-red-500"
          />

          <StatCard
            title="All Birthdays"
            count={allBirthdays.length}
            icon={Cake}
            iconClass="bg-pink-50 text-pink-500"
          />

          <StatCard
            title="Confirmed Birthdays"
            count={confirmedBirthdays.length}
            icon={CheckCircle2}
            iconClass="bg-emerald-50 text-emerald-500"
          />

          <StatCard
            title="Cancelled Birthdays"
            count={cancelledBirthdays.length}
            icon={XCircle}
            iconClass="bg-red-50 text-red-500"
          />
        </section>

        <section className="w-full overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
          <div className="border-b border-slate-100 px-4 py-5 sm:px-6 sm:py-5">
            <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
                  <Plane className="h-[18px] w-[18px] text-indigo-500 sm:h-5 sm:w-5" />
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-base font-semibold leading-6 text-slate-800 sm:text-lg">
                    Travel Plans
                  </h2>

                  <p className="mt-0.5 text-xs leading-5 text-slate-500 sm:text-sm">
                    View and manage your travel plans.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/tour")}
                className="inline-flex min-h-10 w-full shrink-0 items-center justify-center rounded-xl px-3 text-sm font-semibold text-indigo-600 transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-700 sm:w-auto"
              >
                Create Trip
              </button>
            </div>

            <div className="dashboard-tabs mt-5 flex w-full gap-2 overflow-x-auto">
              {tripTabs.map((tab) => (
                <TabButton
                  key={tab.id}
                  active={activeTripTab === tab.id}
                  onClick={() => setActiveTripTab(tab.id)}
                  type="trip"
                >
                  {tab.label}
                </TabButton>
              ))}
            </div>
          </div>

          {activeTrips.length === 0 ? (
            <EmptyState
              icon={Plane}
              title={
                activeTripTab === "confirmed"
                  ? "No confirmed trips"
                  : activeTripTab === "cancelled"
                    ? "No cancelled trips"
                    : "No trips yet"
              }
              description={
                activeTripTab === "confirmed"
                  ? "Your confirmed travel plans will appear here."
                  : activeTripTab === "cancelled"
                    ? "Your cancelled travel plans will appear here."
                    : "Create your first travel plan and it will appear here."
              }
              buttonText={
                activeTripTab === "cancelled"
                  ? undefined
                  : "Create a trip"
              }
              onClick={
                activeTripTab === "cancelled"
                  ? undefined
                  : () => navigate("/tour")
              }
            />
          ) : (
            <div
              className={
                activeTrips.length > 10
                  ? "dashboard-scrollbar max-h-[620px] overflow-y-auto"
                  : ""
              }
            >
              {activeTrips.map((trip) => (
                <TripCard
                  key={trip?._id}
                  trip={trip}
                />
              ))}
            </div>
          )}
        </section>

        <section className="mt-4 w-full overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 sm:mt-5">
          <div className="border-b border-slate-100 px-4 py-5 sm:px-6 sm:py-5">
            <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-50">
                  <Cake className="h-[18px] w-[18px] text-pink-500 sm:h-5 sm:w-5" />
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-base font-semibold leading-6 text-slate-800 sm:text-lg">
                    Birthday Plans
                  </h2>

                  <p className="mt-0.5 text-xs leading-5 text-slate-500 sm:text-sm">
                    View and manage your birthday plans.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/birthday")}
                className="inline-flex min-h-10 w-full shrink-0 items-center justify-center rounded-xl px-3 text-sm font-semibold text-pink-600 transition-all duration-200 hover:bg-pink-50 hover:text-pink-700 sm:w-auto"
              >
                Plan Birthday
              </button>
            </div>

            <div className="dashboard-tabs mt-5 flex w-full gap-2 overflow-x-auto">
              {birthdayTabs.map((tab) => (
                <TabButton
                  key={tab.id}
                  active={activeBirthdayTab === tab.id}
                  onClick={() => setActiveBirthdayTab(tab.id)}
                  type="birthday"
                >
                  {tab.label}
                </TabButton>
              ))}
            </div>
          </div>

          {activeBirthdays.length === 0 ? (
            <EmptyState
              icon={Cake}
              type="birthday"
              title={
                activeBirthdayTab === "confirmed"
                  ? "No confirmed birthdays"
                  : activeBirthdayTab === "cancelled"
                    ? "No cancelled birthdays"
                    : "No birthday plans yet"
              }
              description={
                activeBirthdayTab === "confirmed"
                  ? "Your confirmed birthday plans will appear here."
                  : activeBirthdayTab === "cancelled"
                    ? "Your cancelled birthday plans will appear here."
                    : "Create your first birthday plan and it will appear here."
              }
              buttonText={
                activeBirthdayTab === "cancelled"
                  ? undefined
                  : "Plan a birthday"
              }
              onClick={
                activeBirthdayTab === "cancelled"
                  ? undefined
                  : () => navigate("/birthday")
              }
            />
          ) : (
            <div
              className={
                activeBirthdays.length > 10
                  ? "dashboard-scrollbar max-h-[620px] overflow-y-auto"
                  : ""
              }
            >
              {activeBirthdays.map((birthday) => (
                <BirthdayCard
                  key={birthday?._id}
                  birthday={birthday}
                />
              ))}
            </div>
          )}
        </section>

        <section className="mt-4 w-full overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 sm:mt-5">
          <div className="border-b border-slate-100 px-4 py-5 sm:px-6 sm:py-5">
            <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
                  <Headphones className="h-[18px] w-[18px] text-indigo-500 sm:h-5 sm:w-5" />
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-base font-semibold leading-6 text-slate-800 sm:text-lg">
                    Support Request
                  </h2>

                  <p className="mt-0.5 text-xs leading-5 text-slate-500 sm:text-sm">
                    Check the status of your latest support request.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/support")}
                className="inline-flex min-h-10 w-full shrink-0 items-center justify-center rounded-xl px-3 text-sm font-semibold text-indigo-600 transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-700 sm:w-auto"
              >
                Contact Support
              </button>
            </div>
          </div>

          {latestSupportRequest ? (
            <div className="p-4 sm:p-6">
              <div className="flex min-w-0 flex-col gap-4 rounded-2xl bg-slate-50 p-4 sm:gap-5 sm:p-5 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0 flex-1 overflow-hidden">
                  <p className="text-xs font-semibold uppercase tracking-[0.06em] text-slate-400">
                    Latest Request
                  </p>

                  <h3 className="mt-1.5 truncate text-sm font-semibold leading-5 text-slate-800 sm:mt-2 sm:text-base sm:leading-6">
                    {latestSupportRequest.subject ||
                      "Support Request"}
                  </h3>

                  <div className="mt-2 flex min-w-0 flex-wrap gap-x-4 gap-y-1 text-xs leading-5 text-slate-500">
                    {latestSupportRequest.category && (
                      <span className="max-w-full truncate">
                        {latestSupportRequest.category}
                      </span>
                    )}

                    {latestSupportRequest.priority && (
                      <span className="max-w-full truncate">
                        Priority: {latestSupportRequest.priority}
                      </span>
                    )}
                  </div>
                </div>

                {(() => {
                  const StatusIcon = supportStatus.icon;

                  return (
                    <div
                      className={`inline-flex w-fit max-w-full shrink-0 items-center gap-2 self-start rounded-full px-3.5 py-2 text-xs font-semibold sm:px-4 sm:text-sm md:self-center ${supportStatus.className}`}
                    >
                      <StatusIcon className="h-4 w-4 shrink-0" />

                      <span className="truncate">
                        {latestSupportRequest.status ||
                          "Pending"}
                      </span>
                    </div>
                  );
                })()}
              </div>
            </div>
          ) : (
            <EmptyState
              icon={Headphones}
              title="No support requests"
              description="If you face any problem, contact our support team and track your request here."
              buttonText="Contact Support"
              onClick={() => navigate("/support")}
            />
          )}
        </section>
      </div>
    </main>
  );
};

export default Dashboard;