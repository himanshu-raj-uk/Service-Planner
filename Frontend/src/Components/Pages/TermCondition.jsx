import { motion } from "framer-motion";
import {
    CheckCircle2,
    FileCheck2,
    LockKeyhole,
    Mail,
    ShieldCheck,
    UserRound,
    WalletCards,
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../Layout/Navbar";

const termsSections = [
    {
        icon: UserRound,
        title: "Using Your Account",
        description:
            "You are responsible for providing accurate information and keeping your account details up to date.",
        points: [
            "Provide accurate registration and profile information.",
            "Keep your login credentials private and secure.",
            "Use your account only for legitimate personal planning activities.",
            "Notify us if you believe your account has been accessed without permission.",
        ],
    },
    {
        icon: FileCheck2,
        title: "Planning Services",
        description:
            "All Services Planner helps you organize travel, birthdays and events based on the information and preferences you provide.",
        points: [
            "Planning details should be accurate and complete.",
            "Generated or suggested plans may require your review before use.",
            "You are responsible for checking dates, locations, budgets and other important details.",
            "Service availability and external arrangements may depend on third-party providers.",
        ],
    },
    {
        icon: WalletCards,
        title: "Payments & Budgets",
        description:
            "Budget information helps organize your plans and should be treated as an estimate unless a specific amount is confirmed.",
        points: [
            "Displayed budgets may be estimates rather than final costs.",
            "Actual prices may change based on availability, timing and service providers.",
            "Third-party charges may be subject to their own terms and policies.",
            "You should verify final pricing before making a purchase or booking.",
        ],
    },
    {
        icon: ShieldCheck,
        title: "Responsible Use",
        description:
            "The platform should be used respectfully, lawfully and in a way that does not interfere with other users or the service.",
        points: [
            "Do not misuse, disrupt or attempt to damage the platform.",
            "Do not submit fraudulent, misleading or unlawful information.",
            "Do not attempt unauthorized access to accounts, systems or data.",
            "Do not use the service for activities that violate applicable laws.",
        ],
    },
];

const principles = [
    {
        icon: CheckCircle2,
        title: "Clear Information",
        description:
            "You should have a clear understanding of the information you provide and the plans you create.",
    },
    {
        icon: LockKeyhole,
        title: "Account Responsibility",
        description:
            "Keeping your account credentials secure helps protect your personal planning information.",
    },
    {
        icon: ShieldCheck,
        title: "Fair Use",
        description:
            "Using the platform responsibly helps maintain a reliable experience for everyone.",
    },
];

const fadeUp = {
    hidden: {
        opacity: 0,
        y: 18,
    },
    show: {
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
    show: {
        transition: {
            staggerChildren: 0.08,
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

function TermsAndConditions() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
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

                <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-1.5 sm:px-6 sm:pb-14 sm:pt-2 lg:px-8 lg:pb-16 lg:pt-3">
                    <motion.section
                        variants={stagger}
                        initial="hidden"
                        animate="show"
                        className="grid gap-4 lg:grid-cols-[1.45fr_0.8fr]"
                    >
                        <motion.div
                            variants={fadeUp}
                            className="flex flex-col justify-center"
                        >
                            <p className="mb-1 text-xs font-medium uppercase tracking-[0.16em] text-indigo-600 dark:text-emerald-400">
                                Terms & Conditions
                            </p>

                            <h1 className="max-w-3xl text-2xl font-medium leading-tight tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                                Simple guidelines for using All Services Planner.
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-5 text-slate-500 sm:text-base dark:text-slate-400">
                                These terms explain the basic rules for using All Services
                                Planner, creating plans and managing information through the
                                platform.
                            </p>
                        </motion.div>

                        <motion.div variants={fadeUp}>
                            <ShineCard className="h-full p-5 sm:p-6">
                                <div className="flex h-full flex-col justify-between">
                                    <div>
                                        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-emerald-400/10 dark:text-emerald-400">
                                            <FileCheck2 size={21} />
                                        </div>

                                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                            Using the platform
                                        </h2>

                                        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                            By using All Services Planner, you agree to use the
                                            platform responsibly and follow these terms.
                                        </p>
                                    </div>

                                    <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/70 p-3 dark:border-emerald-400/10 dark:bg-emerald-400/5">
                                        <p className="text-xs leading-5 text-indigo-700 dark:text-emerald-300">
                                            Please review these terms before creating an account or
                                            using planning features.
                                        </p>
                                    </div>
                                </div>
                            </ShineCard>
                        </motion.div>
                    </motion.section>

                    <motion.section
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.15 }}
                        className="mt-5"
                    >
                        <ShineCard className="p-5 sm:p-6">
                            <div className="grid gap-4 lg:grid-cols-[0.9fr_1.5fr] lg:items-center">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600 dark:text-emerald-400">
                                        Our approach
                                    </p>

                                    <h2 className="mt-1.5 text-xl font-semibold text-slate-900 dark:text-white">
                                        Clear expectations create a better experience.
                                    </h2>
                                </div>

                                <div className="space-y-2.5 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                    <p>
                                        All Services Planner is designed to help you organize
                                        different types of plans in one place. The platform
                                        provides tools and information to support your planning
                                        process.
                                    </p>

                                    <p>
                                        You remain responsible for reviewing the details of your
                                        plans and confirming important information before making
                                        decisions, purchases or bookings.
                                    </p>
                                </div>
                            </div>
                        </ShineCard>
                    </motion.section>

                    <motion.section
                        variants={stagger}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.1 }}
                        className="mt-5 grid gap-4 sm:grid-cols-2"
                    >
                        {termsSections.map((section) => {
                            const Icon = section.icon;

                            return (
                                <motion.div key={section.title} variants={fadeUp}>
                                    <ShineCard className="h-full p-5">
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-emerald-400/10 dark:text-emerald-400">
                                                <Icon size={19} />
                                            </div>

                                            <div className="min-w-0">
                                                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                                                    {section.title}
                                                </h3>

                                                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                                    {section.description}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-4 space-y-2.5 border-t border-slate-100 pt-4 dark:border-slate-800">
                                            {section.points.map((point) => (
                                                <div
                                                    key={point}
                                                    className="flex items-start gap-2.5 text-sm leading-5 text-slate-500 dark:text-slate-400"
                                                >
                                                    <CheckCircle2
                                                        size={16}
                                                        className="mt-0.5 shrink-0 text-indigo-500 dark:text-emerald-400"
                                                    />

                                                    <span>{point}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </ShineCard>
                                </motion.div>
                            );
                        })}
                    </motion.section>

                    <motion.section
                        variants={stagger}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.15 }}
                        className="mt-5"
                    >
                        <div className="mb-3">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600 dark:text-emerald-400">
                                Good platform practices
                            </p>

                            <h2 className="mt-1.5 text-xl font-semibold text-slate-900 dark:text-white">
                                A few principles to keep in mind.
                            </h2>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            {principles.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <motion.div key={item.title} variants={fadeUp}>
                                        <ShineCard className="h-full p-5">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-emerald-400/10 dark:text-emerald-400">
                                                <Icon size={19} />
                                            </div>

                                            <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
                                                {item.title}
                                            </h3>

                                            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                                {item.description}
                                            </p>
                                        </ShineCard>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.section>

                    <motion.section
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                        className="mt-5"
                    >
                        <ShineCard className="p-5 sm:p-6">
                            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-emerald-400/10 dark:text-emerald-400">
                                        <Mail size={19} />
                                    </div>

                                    <div>
                                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                            Questions about these terms?
                                        </h2>

                                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                                            If you have questions about how the platform works or
                                            how these terms apply to your account, our support team
                                            can help.
                                        </p>
                                    </div>
                                </div>

                                <Link
                                    to="/support"
                                    className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-200/40 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400 dark:hover:shadow-emerald-400/10 sm:w-auto"
                                >
                                    Contact Support
                                </Link>
                            </div>
                        </ShineCard>
                    </motion.section>

                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="mt-5 text-center"
                    >
                        <p className="text-xs leading-5 text-slate-400 dark:text-slate-500">
                            Terms & Conditions • All Services Planner
                        </p>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}

export default TermsAndConditions;