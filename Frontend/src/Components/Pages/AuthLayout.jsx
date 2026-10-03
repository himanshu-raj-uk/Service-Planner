import {
    Plane,
    Cake,
    CalendarDays,
    Heart,
    Sparkles,
    MapPin,
    Star,
} from "lucide-react";

const PHOTOS = [
    {
        src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=85",
        alt: "Travel planning",
        label: "Travel",
        Icon: Plane,
        className:
            "login-photo-one left-[3%] top-[7%] h-[125px] w-[98px] rounded-[20px] border-indigo-500 shadow-[0_15px_35px_rgba(79,70,229,0.16)] hover:-rotate-1 dark:border-emerald-400 dark:shadow-[0_0_0_1px_rgba(52,211,153,0.10),0_0_30px_rgba(52,211,153,0.20)] dark:hover:shadow-[0_0_0_1px_rgba(52,211,153,0.25),0_0_38px_rgba(52,211,153,0.38)] sm:h-[138px] sm:w-[108px]",
    },
    {
        src: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1000&q=85",
        alt: "Celebration planning",
        label: "Celebrate",
        Icon: Cake,
        className:
            "login-photo-two right-[3%] top-[2%] h-[135px] w-[106px] rounded-[22px] border-fuchsia-500 shadow-[0_15px_35px_rgba(217,70,239,0.16)] hover:rotate-1 dark:border-cyan-400 dark:shadow-[0_0_0_1px_rgba(34,211,238,0.10),0_0_30px_rgba(34,211,238,0.20)] dark:hover:shadow-[0_0_0_1px_rgba(34,211,238,0.25),0_0_38px_rgba(34,211,238,0.38)] sm:h-[150px] sm:w-[118px]",
    },
    {
        src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=85",
        alt: "Event planning",
        label: "Events",
        Icon: CalendarDays,
        className:
            "login-photo-three bottom-[3%] left-[17%] h-[132px] w-[106px] rounded-[22px] border-amber-500 shadow-[0_15px_35px_rgba(245,158,11,0.16)] hover:-rotate-1 dark:border-violet-400 dark:shadow-[0_0_0_1px_rgba(167,139,250,0.10),0_0_30px_rgba(167,139,250,0.20)] dark:hover:shadow-[0_0_0_1px_rgba(167,139,250,0.25),0_0_38px_rgba(167,139,250,0.38)] sm:h-[146px] sm:w-[118px]",
    },
    {
        src: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1000&q=85",
        alt: "Memorable experiences",
        label: "Memories",
        Icon: Heart,
        className:
            "login-photo-four bottom-[7%] right-[13%] h-[126px] w-[100px] rounded-[20px] border-rose-500 shadow-[0_15px_35px_rgba(244,63,94,0.16)] hover:rotate-1 dark:border-pink-400 dark:shadow-[0_0_0_1px_rgba(244,114,182,0.10),0_0_30px_rgba(244,114,182,0.20)] dark:hover:shadow-[0_0_0_1px_rgba(244,114,182,0.25),0_0_38px_rgba(244,114,182,0.38)] sm:h-[140px] sm:w-[110px]",
    },
];

// Theme hover used by every outlined button/link on the auth pages
// light -> soft emerald tint | dark -> emerald glow
export const authHoverClass =
    "hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:border-emerald-400 dark:hover:bg-emerald-400/10 dark:hover:text-emerald-300";

// Primary submit button (both pages)
export const authButtonClass = `flex h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-transparent px-5 text-[13px] font-bold text-slate-700 outline-none transition-colors duration-200 focus:outline-none focus:ring-0 dark:border-slate-700 dark:text-slate-200 disabled:cursor-not-allowed disabled:opacity-60 ${authHoverClass}`;

// Reusable input with icon, label, error and optional right-side slot
export const AuthField = ({
    id,
    label,
    icon: Icon,
    error,
    labelRight = null,
    rightSlot = null,
    ...inputProps
}) => (
    <div>
        <div className="mb-0.5 flex items-center justify-between">
            <label
                htmlFor={id}
                className="block text-[12px] font-semibold text-slate-700 dark:text-slate-300"
            >
                {label}
            </label>
            {labelRight}
        </div>

        <div
            className={`login-input group flex h-[40px] items-center sm:h-[42px] rounded-xl border bg-white transition-colors duration-200 dark:bg-slate-900/70 ${error
                    ? "border-red-400 dark:border-red-400/70"
                    : "border-slate-200 hover:border-emerald-400 focus-within:border-emerald-400 dark:border-slate-700 dark:hover:border-emerald-400 dark:focus-within:border-emerald-400"
                }`}
        >
            <Icon
                size={17}
                className={`ml-3 shrink-0 transition-colors duration-200 ${error
                        ? "text-red-400"
                        : "text-slate-400 group-hover:text-emerald-500 group-focus-within:text-emerald-500 dark:text-slate-500 dark:group-hover:text-emerald-400 dark:group-focus-within:text-emerald-400"
                    }`}
            />

            <input
                id={id}
                {...inputProps}
                className="login-field h-full min-w-0 flex-1 border-0 bg-transparent px-3 text-[14px] font-medium text-slate-900 outline-none ring-0 shadow-none placeholder:text-slate-400 focus:border-0 focus:outline-none focus:ring-0 focus:shadow-none disabled:cursor-not-allowed disabled:opacity-70 dark:text-white dark:placeholder:text-slate-500"
            />

            {rightSlot}
        </div>

        {error && (
            <p className="mt-1 text-[11px] font-medium leading-4 text-red-500 dark:text-red-400">
                {error}
            </p>
        )}
    </div>
);

const AuthLayout = ({
    heading = "Plan something",
    highlight = "worth remembering.",
    description = "Organize trips, birthdays, events and experiences in one simple planning space.",
    children,
}) => {
    return (
        <>
            <main className="login-page relative min-h-[calc(100vh-1px)] w-full overflow-hidden bg-[#f4f6fa] text-slate-900 transition-colors duration-500 dark:bg-[#0f172a] dark:text-slate-100">
                {/* Background grid */}
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        backgroundImage: `
              linear-gradient(90deg, var(--page-pattern-color) 1px, transparent 1px),
              linear-gradient(0deg, var(--page-pattern-color) 1px, transparent 1px)
            `,
                        backgroundSize: "48px 48px",
                    }}
                />

                {/* Soft background lights */}
                <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-indigo-400/10 blur-3xl dark:bg-emerald-400/[0.06]" />
                <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-pink-400/10 blur-3xl dark:bg-cyan-400/[0.05]" />

                {/* Page */}
                <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1020px] items-center px-3 py-2 sm:px-6 sm:py-4 lg:px-8">
                    <div className="mx-auto grid w-full max-w-[400px] overflow-hidden rounded-[22px] border border-slate-200/80 bg-white/80 shadow-[0_20px_60px_rgba(15,23,42,0.10)] backdrop-blur-xl sm:max-w-[430px] dark:border-slate-700/70 dark:bg-slate-950/70 dark:shadow-[0_20px_70px_rgba(0,0,0,0.28)] lg:max-w-none lg:grid-cols-[1.05fr_0.95fr] lg:rounded-[26px]">
                        {/* LEFT VISUAL SECTION (desktop only) */}
                        <section className="relative hidden min-w-0 overflow-hidden border-r border-slate-200/80 p-7 lg:flex lg:flex-col lg:justify-between dark:border-slate-700/70">
                            <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl dark:bg-emerald-400/10" />
                            <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-pink-500/10 blur-3xl dark:bg-cyan-400/10" />

                            {/* Header */}
                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-3.5 py-1.5 text-[11px] font-semibold text-indigo-600 shadow-sm dark:border-emerald-400/20 dark:bg-slate-900 dark:text-emerald-400">
                                    <Sparkles size={14} strokeWidth={2} />
                                    Service Planner
                                </div>

                                <h1 className="mt-3 max-w-[440px] text-[30px] font-bold leading-[1.08] tracking-[-0.035em] text-slate-900 dark:text-white">
                                    {heading}
                                    <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400">
                                        {highlight}
                                    </span>
                                </h1>

                                <p className="mt-2.5 max-w-[420px] text-[13.5px] leading-6 text-slate-600 dark:text-slate-300">
                                    {description}
                                </p>
                            </div>

                            {/* Floating photos */}
                            <div className="relative mx-auto my-3 flex min-h-[265px] w-full max-w-[440px] items-center justify-center">
                                {PHOTOS.map(({ src, alt, label, Icon, className }) => (
                                    <div
                                        key={label}
                                        className={`login-photo group absolute overflow-hidden border-[2px] bg-slate-200 transition-all duration-500 hover:z-30 hover:scale-[1.06] dark:bg-slate-800 ${className}`}
                                    >
                                        <img
                                            src={src}
                                            alt={alt}
                                            loading="lazy"
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />

                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent px-3 pb-2.5 pt-7">
                                            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-white">
                                                <Icon size={12} />
                                                {label}
                                            </span>
                                        </div>
                                    </div>
                                ))}

                                {/* Center marker */}
                                <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 flex h-[56px] w-[56px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/85 shadow-[0_15px_35px_rgba(15,23,42,0.13)] backdrop-blur-md dark:border-slate-600/80 dark:bg-slate-900/85 dark:shadow-[0_0_35px_rgba(45,212,191,0.16)]">
                                    <Sparkles
                                        size={22}
                                        className="text-indigo-600 dark:text-emerald-400"
                                    />
                                </div>
                            </div>

                            {/* Bottom info */}
                            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-2 text-[12px] font-medium text-slate-500 dark:text-slate-400">
                                    <MapPin
                                        size={14}
                                        className="text-indigo-500 dark:text-emerald-400"
                                    />
                                    Plan anywhere, anytime
                                </div>

                                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                                    <Star
                                        size={13}
                                        fill="currentColor"
                                        className="text-amber-500"
                                    />
                                    Simple planning
                                </div>
                            </div>
                        </section>

                        {/* RIGHT FORM SECTION */}
                        <section className="flex min-w-0 items-center justify-center px-4 py-3 sm:px-6 sm:py-5 lg:p-7">
                            <div className="w-full max-w-[360px]">
                                {/* Mobile brand */}
                                <div className="mb-2.5 flex items-center gap-2.5 lg:hidden">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-[0_8px_20px_rgba(99,102,241,0.22)] dark:from-emerald-400 dark:to-cyan-500">
                                        <Sparkles size={16} strokeWidth={2} />
                                    </div>

                                    <div>
                                        <p className="text-[14px] font-bold leading-tight text-slate-900 dark:text-white">
                                            Service Planner
                                        </p>
                                        <p className="hidden text-[11px] font-medium leading-tight text-slate-500 sm:block dark:text-slate-400">
                                            Plan better. Experience more.
                                        </p>
                                    </div>
                                </div>

                                {children}
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            <style>{`
        :root {
          --page-pattern-color: rgba(100, 116, 139, 0.10);
        }

        .dark {
          --page-pattern-color: rgba(148, 163, 184, 0.075);
        }

        .login-input,
        .login-input:hover,
        .login-input:focus,
        .login-input:focus-within {
          outline: none !important;
          box-shadow: none !important;
        }

        .login-input input,
        .login-input input:hover,
        .login-input input:focus,
        .login-input input:active {
          border: 0 !important;
          outline: none !important;
          box-shadow: none !important;
          --tw-ring-shadow: 0 0 #0000 !important;
          --tw-ring-offset-shadow: 0 0 #0000 !important;
        }

        .login-input input:-webkit-autofill,
        .login-input input:-webkit-autofill:hover,
        .login-input input:-webkit-autofill:focus,
        .login-input input:-webkit-autofill:active {
          -webkit-text-fill-color: inherit !important;
          -webkit-box-shadow: 0 0 0 1000px transparent inset !important;
          box-shadow: 0 0 0 1000px transparent inset !important;
          transition: background-color 9999s ease-in-out 0s;
        }

        .login-input button,
        .login-input button:hover,
        .login-input button:focus {
          outline: none !important;
          box-shadow: none !important;
        }

        .login-photo-one { animation: loginFloatOne 5.4s ease-in-out infinite; }
        .login-photo-two { animation: loginFloatTwo 6.2s ease-in-out infinite; animation-delay: -1.2s; }
        .login-photo-three { animation: loginFloatThree 5.8s ease-in-out infinite; animation-delay: -2.2s; }
        .login-photo-four { animation: loginFloatFour 6.4s ease-in-out infinite; animation-delay: -0.8s; }

        .login-photo:hover { animation-play-state: paused; }

        @keyframes loginFloatOne {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(-3deg); }
          50% { transform: translate3d(0, -9px, 0) rotate(-1deg); }
        }
        @keyframes loginFloatTwo {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(4deg); }
          50% { transform: translate3d(0, -11px, 0) rotate(2deg); }
        }
        @keyframes loginFloatThree {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(2deg); }
          50% { transform: translate3d(0, -8px, 0) rotate(4deg); }
        }
        @keyframes loginFloatFour {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(-4deg); }
          50% { transform: translate3d(0, -10px, 0) rotate(-2deg); }
        }

        @media (max-width: 640px) {
          .login-page { min-height: 100svh; }
        }

        @media (prefers-reduced-motion: reduce) {
          .login-photo-one,
          .login-photo-two,
          .login-photo-three,
          .login-photo-four {
            animation: none;
          }

          .login-photo,
          .login-photo img,
          button,
          a {
            transition: none !important;
          }
        }
      `}</style>
        </>
    );
};

export default AuthLayout;