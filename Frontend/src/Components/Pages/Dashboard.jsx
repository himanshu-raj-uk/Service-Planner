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
          throw new Error(response?.message || "Unable to load dashboard");
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
    birthdayTabs.find((tab) => tab.id === activeBirthdayTab)?.data || [];

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

  const getDisplayStatus = (status) => {
    return status === "Booked" ? "Confirmed" : status || "Generated";
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

  const getTabColor = (tabId, type) => {
    if (tabId === "confirmed") {
      return "bg-emerald-500 text-white shadow-sm";
    }

    if (tabId === "cancelled") {
      return "bg-red-500 text-white shadow-sm";
    }

    return type === "birthday"
      ? "bg-pink-500 text-white shadow-sm"
      : "bg-indigo-600 text-white shadow-sm";
  };

  const TripCard = ({ trip }) => (
    <button
      type="button"
      onClick={() => handleViewTrip(trip?._id)}
      className="group flex w-full min-w-0 flex-col gap-3 border-b border-slate-100 px-4 py-4 text-left transition-all duration-300 hover:bg-indigo-50/70 min-[375px]:px-5 min-[375px]:py-4 sm:px-6 sm:py-5 md:flex-row md:items-center md:justify-between"
    >
      <div className="flex min-w-0 items-start gap-3 min-[375px]:gap-3.5 sm:gap-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500 transition-all duration-300 group-hover:bg-indigo-100 min-[375px]:h-10 min-[375px]:w-10 sm:h-11 sm:w-11">
          <MapPin className="h-4 w-4 min-[375px]:h-[18px] min-[375px]:w-[18px] sm:h-5 sm:w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="break-words text-[clamp(0.9rem,3.2vw,1rem)] font-medium leading-5 text-slate-800 transition-colors duration-300 group-hover:text-indigo-600">
            {trip?.destination || "Unknown destination"}
          </h3>

          <p className="mt-1 break-words text-[clamp(0.75rem,2.6vw,0.875rem)] leading-5 text-slate-500">
            {trip?.startLocation || "Unknown location"} →{" "}
            {trip?.destination || "Destination"}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[clamp(0.75rem,2.5vw,0.8125rem)] leading-5 text-slate-500 min-[375px]:gap-x-3 sm:gap-x-4">
            <span>
              {trip?.days ?? 0} {trip?.days === 1 ? "day" : "days"}
            </span>

            <span>
              {trip?.people ?? 0} {trip?.people === 1 ? "person" : "people"}
            </span>

            {trip?.travelType && <span>{trip.travelType}</span>}
          </div>
        </div>
      </div>

      <div className="flex w-full shrink-0 items-center justify-between gap-4 pl-12 md:w-auto md:justify-end md:pl-0">
        <div className="text-left md:text-right">
          <p className="text-[clamp(0.875rem,3vw,1rem)] font-medium text-slate-800">
            ₹{Number(trip?.budget || 0).toLocaleString("en-IN")}
          </p>

          <p className="mt-1 text-[clamp(0.75rem,2.5vw,0.8125rem)] text-slate-500 sm:text-sm">
            {getDisplayStatus(trip?.status)}
          </p>
        </div>
      </div>
    </button>
  );

  const BirthdayCard = ({ birthday }) => (
    <button
      type="button"
      onClick={() => handleViewBirthday(birthday?._id)}
      className="group flex w-full min-w-0 flex-col gap-3 border-b border-slate-100 px-4 py-4 text-left transition-all duration-300 hover:bg-pink-50/70 min-[375px]:px-5 min-[375px]:py-4 sm:px-6 sm:py-5 md:flex-row md:items-center md:justify-between"
    >
      <div className="flex min-w-0 items-start gap-3 min-[375px]:gap-3.5 sm:gap-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-500 transition-all duration-300 group-hover:bg-pink-100 min-[375px]:h-10 min-[375px]:w-10 sm:h-11 sm:w-11">
          <Cake className="h-4 w-4 min-[375px]:h-[18px] min-[375px]:w-[18px] sm:h-5 sm:w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="break-words text-[clamp(0.9rem,3.2vw,1rem)] font-medium leading-5 text-slate-800 transition-colors duration-300 group-hover:text-pink-600">
            {birthday?.Name || "Birthday Plan"}
          </h3>

          <p className="mt-1 break-words text-[clamp(0.75rem,2.6vw,0.875rem)] leading-5 text-slate-500">
            {birthday?.Area || "Unknown location"}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[clamp(0.75rem,2.5vw,0.8125rem)] leading-5 text-slate-500 min-[375px]:gap-x-3 sm:gap-x-4">
            <span>Age {birthday?.Age ?? 0}</span>

            <span>
              {birthday?.people ?? 0}{" "}
              {birthday?.people === 1 ? "person" : "people"}
            </span>

            {birthday?.venueType && <span>{birthday.venueType}</span>}

            {birthday?.eventType && <span>{birthday.eventType}</span>}
          </div>
        </div>
      </div>

      <div className="flex w-full shrink-0 items-center justify-between gap-4 pl-12 md:w-auto md:justify-end md:pl-0">
        <div className="text-left md:text-right">
          <p className="text-[clamp(0.875rem,3vw,1rem)] font-medium text-slate-800">
            ₹{Number(birthday?.budget || 0).toLocaleString("en-IN")}
          </p>

          <p className="mt-1 text-[clamp(0.75rem,2.5vw,0.8125rem)] text-slate-500 sm:text-sm">
            {getDisplayStatus(birthday?.status)}
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
      <div className="flex min-h-[220px] flex-col items-center justify-center px-5 py-8 text-center min-[375px]:min-h-[230px] sm:min-h-[250px] sm:px-6 sm:py-10">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-full min-[375px]:h-12 min-[375px]:w-12 sm:h-14 sm:w-14 ${
            birthday ? "bg-pink-50" : "bg-indigo-50"
          }`}
        >
          <Icon
            className={`h-5 w-5 sm:h-6 sm:w-6 ${
              birthday ? "text-pink-500" : "text-indigo-500"
            }`}
          />
        </div>

        <h3 className="mt-4 text-[clamp(0.875rem,3vw,1rem)] font-medium text-slate-800">
          {title}
        </h3>

        <p className="mt-1 max-w-sm text-[clamp(0.75rem,2.5vw,0.875rem)] leading-5 text-slate-500 sm:leading-6">
          {description}
        </p>

        {buttonText && onClick && (
          <button
            type="button"
            onClick={onClick}
            className={`mt-5 rounded-xl px-4 py-2.5 text-[clamp(0.75rem,2.5vw,0.875rem)] font-medium text-white transition-all duration-300 hover:-translate-y-0.5 sm:px-5 ${
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

  const StatCard = ({ title, count, icon: Icon, iconClass }) => (
    <div
      className={`group min-w-0 cursor-pointer rounded-2xl bg-white p-3.5 shadow-sm ring-1 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md active:translate-y-0 min-[375px]:p-4 sm:p-5 ${iconClass}`}
    >
      <div className="flex items-center justify-between gap-2.5 min-[375px]:gap-3">
        <div className="min-w-0 flex-1">
          <p className="break-words text-[clamp(0.75rem,2.5vw,0.875rem)] leading-5 text-slate-500 transition-colors duration-300 group-hover:text-current">
            {title}
          </p>

          <p className="mt-2 text-[clamp(1.25rem,5vw,1.875rem)] font-medium leading-none text-slate-800 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-current">
            {count}
          </p>
        </div>

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:-rotate-2 min-[375px]:h-10 min-[375px]:w-10 sm:h-11 sm:w-11">
          <Icon className="h-4 w-4 min-[375px]:h-[18px] min-[375px]:w-[18px] sm:h-5 sm:w-5" />
        </div>
      </div>
    </div>
  );

  const TabButton = ({ active, onClick, children, tabId, type = "trip" }) => (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-10 w-full min-w-0 items-center justify-center rounded-lg px-1 py-2 text-center text-[clamp(0.75rem,2.7vw,0.875rem)] font-medium leading-4 transition-all duration-300 ease-out min-[375px]:px-1.5 sm:min-h-11 sm:px-3 sm:py-2.5 ${
        active
          ? getTabColor(tabId, type)
          : tabId === "confirmed"
            ? "text-slate-500 hover:bg-emerald-50 hover:text-emerald-600"
            : tabId === "cancelled"
              ? "text-slate-500 hover:bg-red-50 hover:text-red-600"
              : type === "birthday"
                ? "text-slate-500 hover:bg-pink-50 hover:text-pink-600"
                : "text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
      }`}
    >
      <span className="block w-full whitespace-normal break-words">
        {children}
      </span>
    </button>
  );

  const supportStatus = getSupportStatus(latestSupportRequest?.status);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-3 py-6 min-[375px]:px-4 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600 sm:h-9 sm:w-9" />

            <p className="mt-4 text-[clamp(0.75rem,2.5vw,0.875rem)] text-slate-500">
              Loading dashboard...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-page min-h-screen overflow-x-hidden bg-slate-50 px-3 py-4 min-[375px]:px-4 min-[375px]:py-5 sm:px-6 sm:py-6 lg:px-8">
      <style>{`
        .dashboard-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #c7d2fe transparent;
          scroll-behavior: smooth;
        }

        .dashboard-scrollbar::-webkit-scrollbar {
          width: 6px;
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
      `}</style>

      <div className="mx-auto w-full max-w-7xl min-w-0">
        <section className="mb-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 transition-all duration-300 hover:shadow-md min-[375px]:mb-5 min-[375px]:p-5 sm:mb-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-[clamp(0.625rem,2vw,0.75rem)] font-medium uppercase tracking-wider text-indigo-600">
                Service Planner
              </p>

              <h1 className="mt-2 text-[clamp(1.35rem,5vw,1.875rem)] font-medium tracking-tight text-slate-800">
                Dashboard
              </h1>

              <p className="mt-2 max-w-2xl text-[clamp(0.75rem,2.5vw,0.875rem)] leading-5 text-slate-500 sm:leading-6">
                Manage your travel plans, birthday plans, and support requests
                from one place.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="inline-flex min-h-10 w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-[clamp(0.75rem,2.5vw,0.875rem)] font-medium text-slate-600 transition-all duration-300 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow-sm sm:w-auto"
            >
              Back to Home
            </button>
          </div>
        </section>

        <section className="mb-4 grid grid-cols-2 gap-2.5 min-[375px]:mb-5 min-[375px]:gap-3 sm:mb-6 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
          <StatCard
            title="All Trips"
            count={allTrips.length}
            icon={Plane}
            iconClass="border-indigo-100 ring-indigo-100 text-indigo-500 hover:bg-indigo-50/70"
          />

          <StatCard
            title="Confirmed Trips"
            count={confirmedTrips.length}
            icon={CheckCircle2}
            iconClass="border-emerald-100 ring-emerald-100 text-emerald-500 hover:bg-emerald-50/70"
          />

          <StatCard
            title="Cancelled Trips"
            count={cancelledTrips.length}
            icon={XCircle}
            iconClass="border-red-100 ring-red-100 text-red-500 hover:bg-red-50/70"
          />

          <StatCard
            title="All Birthdays"
            count={allBirthdays.length}
            icon={Cake}
            iconClass="border-indigo-100 ring-indigo-100 text-indigo-500 hover:bg-indigo-50/70"
          />

          <StatCard
            title="Confirmed Birthdays"
            count={confirmedBirthdays.length}
            icon={CheckCircle2}
            iconClass="border-emerald-100 ring-emerald-100 text-emerald-500 hover:bg-emerald-50/70"
          />

          <StatCard
            title="Cancelled Birthdays"
            count={cancelledBirthdays.length}
            icon={XCircle}
            iconClass="border-red-100 ring-red-100 text-red-500 hover:bg-red-50/70"
          />
        </section>

        <section className="w-full min-w-0 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
          <div className="border-b border-slate-100 bg-indigo-50/20 px-4 py-4 min-[375px]:py-5 sm:px-6">
            <div className="flex flex-col gap-3.5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 sm:h-10 sm:w-10">
                  <Plane className="h-4 w-4 text-indigo-500 sm:h-5 sm:w-5" />
                </div>

                <div className="min-w-0">
                  <h2 className="text-[clamp(0.9375rem,3vw,1.125rem)] font-medium text-slate-800">
                    Travel Plans
                  </h2>

                  <p className="mt-1 text-[clamp(0.75rem,2.5vw,0.875rem)] text-slate-500">
                    View and manage your travel plans.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/tour")}
                className="inline-flex min-h-9 items-center justify-center self-start rounded-xl px-3 text-[clamp(0.75rem,2.5vw,0.875rem)] font-medium text-indigo-600 transition-all duration-300 hover:bg-indigo-100 hover:text-indigo-700 lg:self-center"
              >
                Create Trip
              </button>
            </div>

            <div className="mt-4 grid w-full grid-cols-3 gap-1 rounded-xl bg-slate-50 p-1 min-[375px]:mt-5 min-[375px]:gap-1.5">
              {tripTabs.map((tab) => (
                <TabButton
                  key={tab.id}
                  tabId={tab.id}
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
                activeTripTab === "cancelled" ? undefined : "Create a trip"
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
                  ? "dashboard-scrollbar max-h-[500px] overflow-y-auto sm:max-h-[620px]"
                  : ""
              }
            >
              {activeTrips.map((trip) => (
                <TripCard key={trip?._id} trip={trip} />
              ))}
            </div>
          )}
        </section>

        <section className="mt-4 w-full min-w-0 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 min-[375px]:mt-5 sm:mt-6">
          <div className="border-b border-slate-100 bg-pink-50/20 px-4 py-4 min-[375px]:py-5 sm:px-6">
            <div className="flex flex-col gap-3.5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-pink-50 sm:h-10 sm:w-10">
                  <Cake className="h-4 w-4 text-pink-500 sm:h-5 sm:w-5" />
                </div>

                <div className="min-w-0">
                  <h2 className="text-[clamp(0.9375rem,3vw,1.125rem)] font-medium text-slate-800">
                    Birthday Plans
                  </h2>

                  <p className="mt-1 text-[clamp(0.75rem,2.5vw,0.875rem)] text-slate-500">
                    View and manage your birthday plans.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/birthday")}
                className="inline-flex min-h-9 items-center justify-center self-start rounded-xl px-3 text-[clamp(0.75rem,2.5vw,0.875rem)] font-medium text-pink-600 transition-all duration-300 hover:bg-pink-100 hover:text-pink-700 lg:self-center"
              >
                Plan Birthday
              </button>
            </div>

            <div className="mt-4 grid w-full grid-cols-3 gap-1 rounded-xl bg-slate-50 p-1 min-[375px]:mt-5 min-[375px]:gap-1.5">
              {birthdayTabs.map((tab) => (
                <TabButton
                  key={tab.id}
                  tabId={tab.id}
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
                  ? "dashboard-scrollbar max-h-[500px] overflow-y-auto sm:max-h-[620px]"
                  : ""
              }
            >
              {activeBirthdays.map((birthday) => (
                <BirthdayCard key={birthday?._id} birthday={birthday} />
              ))}
            </div>
          )}
        </section>

        {/* --------------------------------CONTACT SUPPORT AT BOTTOM------------------------------------- */}

        <section className="mt-4 w-full min-w-0 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 min-[375px]:mt-5 sm:mt-6">
          <div className="border-b border-slate-100 px-4 py-4 min-[375px]:py-5 sm:px-6">
            <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 sm:h-10 sm:w-10">
                  <Headphones className="h-4 w-4 text-indigo-500 sm:h-5 sm:w-5" />
                </div>

                <div className="min-w-0">
                  <h2 className="text-[clamp(0.9375rem,3vw,1.125rem)] font-medium text-slate-800">
                    Support Request
                  </h2>

                  <p className="mt-1 text-[clamp(0.75rem,2.5vw,0.875rem)] text-slate-500">
                    Check the status of your latest support request.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {latestSupportRequest ? (
            <div className="p-4 min-[375px]:p-5 sm:p-6">
              <div className="group flex flex-col gap-4 rounded-2xl bg-slate-50 p-4 transition-all duration-300 hover:bg-indigo-50 hover:shadow-sm min-[375px]:p-5 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <p className="text-[clamp(0.68rem,2vw,0.75rem)] font-medium uppercase tracking-wider text-slate-400">
                    Latest Request
                  </p>

                  <h3 className="mt-2 break-words text-[clamp(0.875rem,3vw,1rem)] font-medium text-slate-800 transition-colors duration-300 group-hover:text-indigo-700">
                    {latestSupportRequest.subject || "Support Request"}
                  </h3>

                  <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[clamp(0.75rem,2.5vw,0.875rem)] text-slate-500">
                    {latestSupportRequest.category && (
                      <span>{latestSupportRequest.category}</span>
                    )}

                    {latestSupportRequest.priority && (
                      <span>Priority: {latestSupportRequest.priority}</span>
                    )}
                  </div>
                </div>

                {(() => {
                  const StatusIcon = supportStatus.icon;

                  return (
                    <div
                      className={`inline-flex shrink-0 items-center gap-2 self-start rounded-full px-3 py-2 text-[clamp(0.75rem,2.5vw,0.875rem)] font-medium sm:px-4 md:self-center ${supportStatus.className}`}
                    >
                      <StatusIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />

                      {latestSupportRequest.status || "Pending"}
                    </div>
                  );
                })()}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center px-4 py-6 text-center min-[375px]:px-5 sm:py-8">
              <Headphones className="h-10 w-10 text-slate-300" />

              <h3 className="mt-3 text-sm font-medium text-slate-800">
                No support requests
              </h3>

              <p className="mt-1 max-w-md text-[clamp(0.75rem,2.5vw,0.875rem)] leading-5 text-slate-500">
                If you face any problem, contact our support team and track your
                request here.
              </p>

              <button
                type="button"
                onClick={() => navigate("/support")}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-50 px-4 py-3 text-sm font-medium text-blue-600 ring-1 ring-blue-100 transition-colors duration-200 hover:bg-blue-100 hover:text-blue-700 active:bg-[#0f2a43] active:text-white focus:outline-none focus:ring-2 focus:ring-blue-300 sm:w-auto"
              >
                <Headphones className="h-4 w-4" />
                Contact Support
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Dashboard;
