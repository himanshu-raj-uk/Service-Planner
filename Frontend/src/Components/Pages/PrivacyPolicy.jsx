import { motion } from "framer-motion";
import {
    CheckCircle2,
    Eye,
    FileText,
    LockKeyhole,
    Mail,
    ShieldCheck,
    UserRound,
} from "lucide-react";
import Navbar from "../Layout/Navbar";

const privacySections = [
    {
        icon: UserRound,
        title: "Information We Collect",
        description:
            "When you use All Services Planner, we may collect information that you provide while creating an account, managing your profile or creating a planning request.",
        points: [
            "Name and contact information",
            "Email address and phone number",
            "Account and profile information",
            "Planning details and preferences",
        ],
    },
    {
        icon: FileText,
        title: "Planning Information",
        description:
            "The information you enter while creating a trip, birthday or event plan is used to provide the requested planning experience.",
        points: [
            "Destination and location details",
            "Budget and number of people",
            "Dates, preferences and requirements",
            "Special requests related to your plan",
        ],
    },
    {
        icon: LockKeyhole,
        title: "How We Protect Information",
        description:
            "We take reasonable measures to protect account information and maintain a secure application environment.",
        points: [
            "Authentication is used to protect account access",
            "Passwords are handled using secure hashing practices",
            "Protected routes require appropriate authentication",
            "Access to user-specific plans is restricted to the account",
        ],
    },
    {
        icon: Eye,
        title: "How Information Is Used",
        description:
            "Information is primarily used to operate, improve and personalize the services available through the platform.",
        points: [
            "Create and manage your account",
            "Process and organize planning requests",
            "Provide relevant application features",
            "Improve reliability and user experience",
        ],
    },
];

const principles = [
    {
        title: "Transparency",
        description:
            "We aim to make the purpose of collecting information understandable and connected to the services you use.",
    },
    {
        title: "Security",
        description:
            "Protecting account information is an important part of building a reliable planning platform.",
    },
    {
        title: "Purpose",
        description:
            "Information should be used in ways that support the application's functionality and your planning experience.",
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

const PrivacyPolicy = () => {
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
                                    <ShieldCheck size={12} />
                                    Privacy & Policy
                                </div>

                                <h1 className="mt-4 max-w-2xl text-3xl font-medium leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-[42px] dark:text-white">
                                    Your information deserves careful handling.
                                </h1>

                                <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-[15px]">
                                    At All Services Planner, we understand that your account and
                                    planning information are important. This Privacy Policy
                                    explains what information may be collected, why it is used
                                    and the measures taken to protect it while you use the
                                    platform.
                                </p>

                                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-[15px]">
                                    Our approach is centered around transparency, responsible
                                    information handling and providing a secure experience for
                                    users who rely on the platform to organize their plans.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            variants={fadeUp}
                            className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/80 md:col-span-4"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">
                                        Your privacy
                                    </p>

                                    <h2 className="mt-2 text-xl font-medium text-slate-900 dark:text-white">
                                        Built around trust
                                    </h2>
                                </div>

                                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-emerald-400/10 dark:text-emerald-400">
                                    <LockKeyhole size={18} />
                                </div>
                            </div>

                            <p className="mt-5 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                Privacy is an important part of the overall experience. We
                                aim to collect information for clear purposes and use it to
                                provide features that are relevant to your account and
                                planning activity.
                            </p>

                            <div className="mt-5 space-y-3">
                                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700/70 dark:bg-slate-800/40">
                                    <CheckCircle2
                                        size={17}
                                        className="shrink-0 text-indigo-500 dark:text-emerald-400"
                                    />

                                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                        Responsible information use
                                    </span>
                                </div>

                                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700/70 dark:bg-slate-800/40">
                                    <ShieldCheck
                                        size={17}
                                        className="shrink-0 text-indigo-500 dark:text-emerald-400"
                                    />

                                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                        Account security
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            variants={fadeUp}
                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/80 md:col-span-5"
                        >
                            <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-indigo-600 dark:text-emerald-400">
                                Our approach
                            </p>

                            <h2 className="mt-3 text-xl font-medium leading-7 text-slate-900 dark:text-white">
                                Privacy should be understandable, not complicated.
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                We aim to explain how information is handled in straightforward
                                language so users can better understand the relationship
                                between their information and the features they use.
                            </p>
                        </motion.div>

                        <motion.div
                            variants={fadeUp}
                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/80 md:col-span-7"
                        >
                            <div className="grid gap-5 sm:grid-cols-3">
                                {principles.map((principle) => (
                                    <div key={principle.title}>
                                        <div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-emerald-400/10 dark:text-emerald-400">
                                            <CheckCircle2 size={17} />
                                        </div>

                                        <h3 className="mt-4 text-sm font-medium text-slate-900 dark:text-white">
                                            {principle.title}
                                        </h3>

                                        <p className="mt-2 text-[13px] leading-5 text-slate-500 dark:text-slate-400">
                                            {principle.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.section>

                    <section className="mt-12 sm:mt-16 lg:mt-20">
                        <div className="mb-6 max-w-3xl">
                            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-indigo-600 dark:text-emerald-400">
                                Information
                            </p>

                            <h2 className="mt-2 text-2xl font-medium tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                                What you should know about your information.
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                The following sections describe the main ways information may
                                be collected and used when you interact with All Services
                                Planner.
                            </p>
                        </div>

                        <div className="grid gap-3 md:grid-cols-2">
                            {privacySections.map((section) => {
                                const Icon = section.icon;

                                return (
                                    <ShineCard key={section.title}>
                                        <div className="p-5 sm:p-6">
                                            <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-emerald-400/10 dark:text-emerald-400">
                                                <Icon size={18} />
                                            </div>

                                            <h3 className="mt-4 text-base font-medium text-slate-900 dark:text-white">
                                                {section.title}
                                            </h3>

                                            <p className="mt-2 text-[13px] leading-5 text-slate-500 dark:text-slate-400">
                                                {section.description}
                                            </p>

                                            <div className="mt-4 space-y-2">
                                                {section.points.map((point) => (
                                                    <div
                                                        key={point}
                                                        className="flex items-start gap-2"
                                                    >
                                                        <CheckCircle2
                                                            size={14}
                                                            className="mt-0.5 shrink-0 text-indigo-500 dark:text-emerald-400"
                                                        />

                                                        <span className="text-[12px] leading-5 text-slate-600 dark:text-slate-400">
                                                            {point}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
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
                                    Your account
                                </p>

                                <h2 className="mt-3 text-xl font-medium tracking-tight text-slate-900 dark:text-white">
                                    You remain in control of your account information.
                                </h2>

                                <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                    Keeping your account information accurate and secure helps
                                    us provide a more consistent planning experience.
                                </p>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-3 lg:col-span-8">
                                <ShineCard>
                                    <div className="p-5">
                                        <UserRound
                                            size={19}
                                            className="text-indigo-600 dark:text-emerald-400"
                                        />

                                        <h3 className="mt-4 text-sm font-medium text-slate-900 dark:text-white">
                                            Account details
                                        </h3>

                                        <p className="mt-2 text-[13px] leading-5 text-slate-500 dark:text-slate-400">
                                            Information associated with your account helps provide
                                            personalized access to the platform.
                                        </p>
                                    </div>
                                </ShineCard>

                                <ShineCard>
                                    <div className="p-5">
                                        <Eye
                                            size={19}
                                            className="text-indigo-600 dark:text-emerald-400"
                                        />

                                        <h3 className="mt-4 text-sm font-medium text-slate-900 dark:text-white">
                                            Responsible access
                                        </h3>

                                        <p className="mt-2 text-[13px] leading-5 text-slate-500 dark:text-slate-400">
                                            User-specific information is intended to remain within
                                            the appropriate account experience.
                                        </p>
                                    </div>
                                </ShineCard>

                                <ShineCard>
                                    <div className="p-5">
                                        <LockKeyhole
                                            size={19}
                                            className="text-indigo-600 dark:text-emerald-400"
                                        />

                                        <h3 className="mt-4 text-sm font-medium text-slate-900 dark:text-white">
                                            Secure access
                                        </h3>

                                        <p className="mt-2 text-[13px] leading-5 text-slate-500 dark:text-slate-400">
                                            Authentication helps protect account features from
                                            unauthorized access.
                                        </p>
                                    </div>
                                </ShineCard>
                            </div>
                        </div>
                    </section>

                    <section className="mt-12 sm:mt-16 lg:mt-20">
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700/70 dark:bg-slate-900/80 sm:p-7">
                            <div className="max-w-4xl">
                                <div className="flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-emerald-400">
                                    <Mail size={16} />
                                    Questions about privacy
                                </div>

                                <h2 className="mt-3 text-2xl font-medium tracking-tight text-slate-900 dark:text-white">
                                    We want you to feel confident using the platform.
                                </h2>

                                <p className="mt-4 text-sm leading-7 text-slate-500 dark:text-slate-400">
                                    If you have questions about how your information is handled,
                                    need clarification about this policy or believe there is an
                                    issue involving your account information, please contact the
                                    appropriate support channel provided by All Services
                                    Planner.
                                </p>

                                <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
                                    This policy may be updated as the platform develops, new
                                    services are introduced or applicable requirements change.
                                    When changes are made, the updated version should be reviewed
                                    before continuing to use the relevant services.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="mt-12 pb-8 sm:mt-16 lg:mt-20 lg:pb-10">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700/70 dark:bg-slate-900/80 sm:p-6">
                            <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                                Privacy Policy
                            </p>

                            <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-500">
                                By using All Services Planner, you acknowledge that you have
                                reviewed this Privacy Policy and understand the general
                                practices described above.
                            </p>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default PrivacyPolicy;