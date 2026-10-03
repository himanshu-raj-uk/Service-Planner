import { motion } from "framer-motion";
import {
    Cake,
    CheckCircle2,
    Headphones,
    MapPin,
    PartyPopper,
    Plane,
    ShieldCheck,
    Sparkles,
    WalletCards,
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../Layout/Navbar";

const services = [
    {
        icon: Plane,
        title: "Travel Planning",
        description:
            "Create organized travel plans around your destination, budget, people, duration and preferences.",
        link: "/tour",
        accent: "indigo",
    },
    {
        icon: Cake,
        title: "Birthday Planning",
        description:
            "Organize birthday celebrations with guests, budget, venue, food preferences and special requests.",
        link: "/birthday",
        accent: "pink",
    },
    {
        icon: PartyPopper,
        title: "Event Planning",
        description:
            "Bring event details, requirements, guests, budget and preferences together in one organized plan.",
        link: "/event",
        accent: "emerald",
    },
];

const features = [
    {
        icon: Sparkles,
        title: "Personalized",
        description:
            "Build plans around your own requirements, preferences and priorities.",
    },
    {
        icon: ShieldCheck,
        title: "Secure",
        description:
            "Your planning information stays connected to your account through secure authentication.",
    },
    {
        icon: WalletCards,
        title: "Budget Focused",
        description:
            "Keep your planning decisions connected to the budget you choose.",
    },
    {
        icon: Headphones,
        title: "Support",
        description:
            "Get assistance whenever you need help with your planning experience.",
    },
];

const steps = [
    {
        number: "01",
        title: "Create",
        description:
            "Start with your account and choose the type of experience you want to organize.",
    },
    {
        number: "02",
        title: "Customize",
        description:
            "Add your requirements, preferences, people, budget and other important details.",
    },
    {
        number: "03",
        title: "Manage",
        description:
            "Keep your plans organized and return to them whenever you need them.",
    },
];

const fadeUp = {
    hidden: {
        opacity: 0,
        y: 14,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.45,
            ease: "easeOut",
        },
    },
};

const stagger = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.07,
        },
    },
};

function ShineCard({ children, className = "" }) {
    const handleMove = (event) => {
        const card = event.currentTarget;
        const rect = card.getBoundingClientRect();

        card.style.setProperty(
            "--shine-x",
            `${event.clientX - rect.left}px`
        );

        card.style.setProperty(
            "--shine-y",
            `${event.clientY - rect.top}px`
        );
    };

    const handleLeave = (event) => {
        event.currentTarget.style.setProperty("--shine-x", "50%");
        event.currentTarget.style.setProperty("--shine-y", "50%");
    };

    return (
        <div
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/40 dark:border-slate-700/70 dark:bg-slate-900/70 dark:hover:border-emerald-400/30 dark:hover:shadow-xl dark:hover:shadow-black/20 ${className}`}
        >
            <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                    background:
                        "radial-gradient(170px circle at var(--shine-x) var(--shine-y), rgba(99,102,241,0.10), transparent 70%)",
                }}
            />

            <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 dark:group-hover:opacity-100"
                style={{
                    background:
                        "radial-gradient(170px circle at var(--shine-x) var(--shine-y), rgba(52,211,153,0.10), transparent 70%)",
                }}
            />

            <div className="relative z-10 h-full">{children}</div>
        </div>
    );
}

const AboutUs = () => {
    return (
        <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
            <Navbar />

            <main
                className="relative min-h-screen"
                style={{
                    backgroundImage:
                        "linear-gradient(var(--page-pattern-color) 1px, transparent 1px), linear-gradient(90deg, var(--page-pattern-color) 1px, transparent 1px)",
                    backgroundSize: "42px 42px",
                }}
            >
                <div className="absolute inset-0 bg-slate-50/90 dark:bg-slate-950/90" />

                <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-4 sm:px-6 sm:pb-14 sm:pt-5 lg:px-8 lg:pb-16 lg:pt-6">
                    <motion.section
                        initial="hidden"
                        animate="visible"
                        variants={stagger}
                        className="grid gap-4 md:grid-cols-12"
                    >
                        <motion.div
                            variants={fadeUp}
                            className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/80 sm:p-7 lg:p-8 md:col-span-8"
                        >
                            <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-indigo-100 blur-3xl dark:bg-emerald-400/5" />

                            <div className="relative">
                                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-indigo-600 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-400">
                                    <Sparkles size={12} />
                                    About All Services Planner
                                </div>

                                <h1 className="mt-4 max-w-2xl text-3xl font-medium leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-[42px] dark:text-white">
                                    A simple space for planning the things that matter.
                                </h1>

                                <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-[15px]">
                                    All Services Planner is a modern planning and management
                                    platform created to bring everyday planning needs into one
                                    organized experience. It helps transform an idea into a
                                    structured plan by keeping important details together and
                                    making them easier to manage.
                                </p>

                                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-[15px]">
                                    From personal trips and birthday celebrations to different
                                    types of events, the platform is designed to give you a
                                    clearer way to organize requirements, preferences, budgets
                                    and other details without making the process unnecessarily
                                    complicated.
                                </p>

                                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                                    <Link
                                        to="/register"
                                        className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
                                    >
                                        Create Account
                                    </Link>

                                    <Link
                                        to="/profile"
                                        className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-emerald-400/40 dark:hover:text-emerald-400"
                                    >
                                        View Profile
                                    </Link>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            variants={fadeUp}
                            className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/80 md:col-span-4"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">
                                        About the platform
                                    </p>

                                    <h2 className="mt-2 text-xl font-medium text-slate-900 dark:text-white">
                                        Built to make planning easier
                                    </h2>
                                </div>

                                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-emerald-400/10 dark:text-emerald-400">
                                    <Sparkles size={18} />
                                </div>
                            </div>

                            <div className="mt-5 space-y-4">
                                <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                                    All Services Planner brings planning, organization and
                                    personalization into one connected platform. Instead of
                                    managing important information across scattered notes,
                                    messages or different tools, users can keep their planning
                                    details in a dedicated space.
                                </p>

                                <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                                    The experience is designed to remain straightforward while
                                    still giving users enough flexibility to describe what they
                                    actually need. Destinations, guests, budgets, preferences,
                                    venues and special requirements can become part of the plan.
                                </p>

                                <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                                    The goal is to make planning feel more structured and
                                    comfortable, so users can spend more time thinking about
                                    their experience and less time worrying about where their
                                    information is stored.
                                </p>
                            </div>

                            <div className="mt-auto grid grid-cols-2 gap-3 pt-5">
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700/70 dark:bg-slate-800/40">
                                    <CheckCircle2
                                        size={17}
                                        className="text-indigo-500 dark:text-emerald-400"
                                    />

                                    <p className="mt-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                                        Organized
                                    </p>
                                </div>

                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700/70 dark:bg-slate-800/40">
                                    <ShieldCheck
                                        size={17}
                                        className="text-indigo-500 dark:text-emerald-400"
                                    />

                                    <p className="mt-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                                        Account based
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            variants={fadeUp}
                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/80 md:col-span-5"
                        >
                            <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-indigo-600 dark:text-emerald-400">
                                Our purpose
                            </p>

                            <h2 className="mt-3 text-xl font-medium leading-7 text-slate-900 dark:text-white">
                                Helping people turn plans into organized experiences.
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                Good planning starts with understanding what matters. The
                                platform is designed to provide a clear structure where users
                                can describe their needs, consider the important details and
                                keep everything related to a plan together.
                            </p>
                        </motion.div>

                        <motion.div
                            variants={fadeUp}
                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/80 md:col-span-7"
                        >
                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-emerald-400/10 dark:text-emerald-400">
                                        <WalletCards size={19} />
                                    </div>

                                    <h3 className="mt-4 text-base font-medium text-slate-900 dark:text-white">
                                        Designed around your requirements
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                        Budgets, people, locations, preferences and special
                                        requests can all become part of the planning process.
                                    </p>
                                </div>

                                <div>
                                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-emerald-400/10 dark:text-emerald-400">
                                        <ShieldCheck size={19} />
                                    </div>

                                    <h3 className="mt-4 text-base font-medium text-slate-900 dark:text-white">
                                        Connected to your account
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                        Your planning experience stays connected to your account,
                                        giving you a consistent place to return to your plans.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.section>

                    <section className="mt-12 sm:mt-16 lg:mt-20">
                        <div className="mb-6 max-w-3xl">
                            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-indigo-600 dark:text-emerald-400">
                                Services
                            </p>

                            <h2 className="mt-2 text-2xl font-medium tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                                Planning tools for different experiences.
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                Each service is designed around the information that matters
                                most for that particular experience, while keeping the overall
                                planning journey familiar and easy to understand.
                            </p>
                        </div>

                        <div className="grid gap-3 md:grid-cols-3">
                            {services.map((service, index) => {
                                const Icon = service.icon;

                                return (
                                    <ShineCard key={service.title}>
                                        <div className="p-4 sm:p-5">
                                            <div className="flex items-center justify-between">
                                                <div
                                                    className={`grid h-10 w-10 place-items-center rounded-xl ${service.accent === "pink"
                                                            ? "bg-pink-50 text-pink-600 dark:bg-pink-400/10 dark:text-pink-300"
                                                            : service.accent === "emerald"
                                                                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400"
                                                                : "bg-indigo-50 text-indigo-600 dark:bg-emerald-400/10 dark:text-emerald-400"
                                                        }`}
                                                >
                                                    <Icon size={18} />
                                                </div>

                                                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                                                    0{index + 1}
                                                </span>
                                            </div>

                                            <h3 className="mt-4 text-base font-medium text-slate-900 dark:text-white">
                                                {service.title}
                                            </h3>

                                            <p className="mt-2 text-[13px] leading-5 text-slate-500 dark:text-slate-400">
                                                {service.description}
                                            </p>

                                            <Link
                                                to={service.link}
                                                className="mt-4 inline-flex rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-emerald-400/40 dark:hover:text-emerald-400"
                                            >
                                                Explore service
                                            </Link>
                                        </div>
                                    </ShineCard>
                                );
                            })}
                        </div>
                    </section>

                    <section className="mt-12 sm:mt-16 lg:mt-20">
                        <div className="mb-6 max-w-3xl">
                            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-indigo-600 dark:text-emerald-400">
                                Platform values
                            </p>

                            <h2 className="mt-2 text-2xl font-medium tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                                Created with practical planning in mind.
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                The platform focuses on making useful planning features
                                accessible without adding unnecessary complexity to the
                                experience.
                            </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            {features.map((feature) => {
                                const Icon = feature.icon;

                                return (
                                    <ShineCard key={feature.title}>
                                        <div className="p-4 sm:p-5">
                                            <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-emerald-400/10 dark:text-emerald-400">
                                                <Icon size={18} />
                                            </div>

                                            <h3 className="mt-4 text-base font-medium text-slate-900 dark:text-white">
                                                {feature.title}
                                            </h3>

                                            <p className="mt-2 text-[13px] leading-5 text-slate-500 dark:text-slate-400">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </ShineCard>
                                );
                            })}
                        </div>
                    </section>

                    <section className="mt-12 sm:mt-16 lg:mt-20">
                        <div className="grid gap-3 lg:grid-cols-12">
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700/70 dark:bg-slate-900/80 lg:col-span-4 lg:p-6">
                                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-indigo-600 dark:text-emerald-400">
                                    How the experience works
                                </p>

                                <h2 className="mt-3 text-xl font-medium tracking-tight text-slate-900 dark:text-white">
                                    A structured approach to planning.
                                </h2>

                                <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                    Start with an idea, provide the details that matter to you
                                    and keep your planning information available through your
                                    account.
                                </p>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-3 lg:col-span-8">
                                {steps.map((step) => (
                                    <ShineCard key={step.number}>
                                        <div className="p-4 sm:p-5">
                                            <span className="text-sm font-medium text-indigo-600 dark:text-emerald-400">
                                                {step.number}
                                            </span>

                                            <h3 className="mt-4 text-base font-medium text-slate-900 dark:text-white">
                                                {step.title}
                                            </h3>

                                            <p className="mt-2 text-[13px] leading-5 text-slate-500 dark:text-slate-400">
                                                {step.description}
                                            </p>
                                        </div>
                                    </ShineCard>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="mt-12 pb-8 sm:mt-16 lg:mt-20 lg:pb-10">
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700/70 dark:bg-slate-900/80 sm:p-7">
                            <div className="max-w-4xl">
                                <div className="flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-emerald-400">
                                    <Sparkles size={16} />
                                    Our vision
                                </div>

                                <h2 className="mt-3 text-2xl font-medium tracking-tight text-slate-900 dark:text-white">
                                    Making planning feel clear, useful and personal.
                                </h2>

                                <p className="mt-4 text-sm leading-7 text-slate-500 dark:text-slate-400">
                                    We believe a useful planning platform should adapt to the
                                    person using it. All Services Planner is being developed with
                                    that idea in mind, giving users a comfortable space to
                                    describe their plans while keeping the important information
                                    structured and accessible.
                                </p>

                                <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
                                    The long-term vision is to bring more planning experiences
                                    into one dependable platform while maintaining a clean,
                                    understandable and user-focused interface. As new services
                                    are introduced, the goal remains to make each experience
                                    easier to organize without losing the flexibility that makes
                                    every plan different.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default AboutUs;