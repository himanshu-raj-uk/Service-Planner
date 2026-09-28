import { ArrowUpRight } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Footer() {
  const plannerServices = [
    { label: "Travel Plan", path: "/tour" },
    { label: "Birthday Plan", path: "/birthday" },
    { label: "Event Plan", path: "/event" },
    { label: "Corporate Party", path: "/corporate" },
  ];

  const companyLinks = [
    { label: "About Us", path: "/about" },
    { label: "Pricing", path: "/pricing" },
    { label: "Privacy Policy", path: "/privacy" },
    { label: "Terms & Conditions", path: "/terms" },
  ];

  const thoughts = [
    "Plan today, create memories that last forever.",
    "Every great journey begins with a thoughtful plan.",
    "Your perfect experience starts with one simple idea.",
    "Turn your plans into moments worth remembering.",
    "Good planning makes every experience more meaningful.",
    "Dream it, plan it, experience it.",
    "Make every destination part of your story.",
    "The best memories are the ones you plan with heart.",
    "Small plans can create unforgettable moments.",
    "Your next beautiful memory may be one plan away.",
    "Plan with purpose and enjoy every moment.",
    "Great experiences begin with great preparation.",
    "Make your special moments truly special.",
    "Where plans become experiences and experiences become memories.",
    "Travel more, celebrate more, remember more.",
    "Every celebration deserves a thoughtful beginning.",
    "Create moments today that you will smile about tomorrow.",
    "A little planning can make every experience extraordinary.",
    "Your journey deserves a plan as unique as you are.",
    "Plan something beautiful. Make it unforgettable.",
    "Explore new places, celebrate meaningful moments.",
    "Better planning brings better experiences.",
    "Make time for moments that matter.",
    "Your next adventure is waiting to be planned.",
  ];

  const [currentThought, setCurrentThought] = useState(0);
  const [thoughtVisible, setThoughtVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setThoughtVisible(false);

      const timeout = setTimeout(() => {
        setCurrentThought((prev) => (prev + 1) % thoughts.length);
        setThoughtVisible(true);
      }, 250);

      return () => clearTimeout(timeout);
    }, 2500);

    return () => clearInterval(interval);
  }, [thoughts.length]);

  return (
    <footer
      className="
        relative
        w-full
        overflow-hidden
        border-t
        border-slate-200/80
        bg-[#f4f6fa]
        text-slate-900
        transition-colors
        duration-500
        dark:border-slate-800
        dark:bg-[#0f172a]
        dark:text-slate-100
      "
    >
      {/* =========================================================
          BACKGROUND GRID
          Same pattern as Services / Features
      ========================================================= */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-100
        "
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
          backgroundPosition: "0 0",
        }}
      />

      {/* =========================================================
          AMBIENT ACCENTS
      ========================================================= */}
      <div
        className="
          pointer-events-none
          absolute
          -left-32
          -top-28
          h-64
          w-64
          rounded-full
          bg-indigo-300/8
          blur-3xl
          dark:bg-indigo-500/8
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-32
          bottom-0
          h-64
          w-64
          rounded-full
          bg-blue-300/8
          blur-3xl
          dark:bg-blue-500/8
        "
      />

      {/* =========================================================
          MAIN FOOTER CONTENT
      ========================================================= */}
      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-7xl
          px-4
          py-5
          sm:px-6
          sm:py-6
          lg:px-8
          lg:py-7
        "
      >
        <div
          className="
            grid
            grid-cols-1
            gap-6
            sm:grid-cols-2
            sm:gap-x-8
            sm:gap-y-6
            lg:grid-cols-12
            lg:gap-8
          "
        >
          {/* =====================================================
              BRAND
          ===================================================== */}
          <div className="sm:col-span-2 lg:col-span-6">
            <Link
              to="/"
              className="group flex min-w-0 items-center"
              aria-label="Service Planner Home"
            >
              <div
                className="
                  flex
                  h-[46px]
                  w-auto
                  min-w-0
                  max-w-[190px]
                  items-center
                  min-[360px]:h-[49px]
                  min-[360px]:max-w-[205px]
                  sm:h-[52px]
                  sm:max-w-[225px]
                  md:h-[55px]
                  md:max-w-[240px]
                  lg:h-[58px]
                  lg:max-w-[260px]
                "
              >
                <img
                  src="/Service-Planner/Service_Planner_Logo.png"
                  alt="Service Planner"
                  className="
                    block
                    h-full
                    w-auto
                    max-w-full
                    object-contain
                    object-left
                    transition-transform
                    duration-200
                    group-hover:scale-[1.01]
                  "
                  draggable="false"
                  decoding="async"
                  fetchPriority="high"
                />
              </div>
            </Link>

            <p
              className="
                mt-2.5
                max-w-xl
                text-sm
                leading-5
                text-slate-500
                transition-colors
                duration-500
                dark:text-slate-400
                sm:mt-3
                sm:text-[15px]
                sm:leading-6
              "
            >
              Service Planner is your all-in-one platform to plan travel,
              birthdays, weddings, corporate events, parties and memorable
              experiences with experience agents and members.
            </p>

            {/* =================================================
                SOCIAL LINKS
            ================================================= */}
            <div className="mt-3 flex flex-wrap gap-2 sm:mt-4">
              {/* Facebook */}
              <a
                href="#"
                aria-label="Facebook"
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-slate-300
                  bg-white/70
                  text-slate-500
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:border-[#1877F2]
                  hover:bg-[#1877F2]
                  hover:text-white
                  hover:shadow-[0_8px_22px_rgba(24,119,242,0.28)]
                  dark:border-slate-700
                  dark:bg-slate-900/70
                  dark:text-slate-400
                  dark:hover:border-[#1877F2]
                  dark:hover:bg-[#1877F2]
                  dark:hover:text-white
                  dark:hover:shadow-[0_8px_22px_rgba(24,119,242,0.32)]
                "
              >
                <FaFacebookF size={14} />
              </a>

              {/* Instagram */}
              <a
                href="#"
                aria-label="Instagram"
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-slate-300
                  bg-white/70
                  text-slate-500
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:border-[#E4405F]
                  hover:bg-[#E4405F]
                  hover:text-white
                  hover:shadow-[0_8px_22px_rgba(228,64,95,0.28)]
                  dark:border-slate-700
                  dark:bg-slate-900/70
                  dark:text-slate-400
                  dark:hover:border-[#E4405F]
                  dark:hover:bg-[#E4405F]
                  dark:hover:text-white
                  dark:hover:shadow-[0_8px_22px_rgba(228,64,95,0.32)]
                "
              >
                <FaInstagram size={14} />
              </a>

              {/* Twitter */}
              <a
                href="#"
                aria-label="Twitter"
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-slate-300
                  bg-white/70
                  text-slate-500
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:border-[#1DA1F2]
                  hover:bg-[#1DA1F2]
                  hover:text-white
                  hover:shadow-[0_8px_22px_rgba(29,161,242,0.28)]
                  dark:border-slate-700
                  dark:bg-slate-900/70
                  dark:text-slate-400
                  dark:hover:border-[#1DA1F2]
                  dark:hover:bg-[#1DA1F2]
                  dark:hover:text-white
                  dark:hover:shadow-[0_8px_22px_rgba(29,161,242,0.32)]
                "
              >
                <FaTwitter size={14} />
              </a>

              {/* LinkedIn */}
              <a
                href="#"
                aria-label="LinkedIn"
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-slate-300
                  bg-white/70
                  text-slate-500
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:border-[#0A66C2]
                  hover:bg-[#0A66C2]
                  hover:text-white
                  hover:shadow-[0_8px_22px_rgba(10,102,194,0.28)]
                  dark:border-slate-700
                  dark:bg-slate-900/70
                  dark:text-slate-400
                  dark:hover:border-[#0A66C2]
                  dark:hover:bg-[#0A66C2]
                  dark:hover:text-white
                  dark:hover:shadow-[0_8px_22px_rgba(10,102,194,0.32)]
                "
              >
                <FaLinkedinIn size={14} />
              </a>
            </div>
          </div>

          {/* =====================================================
              PLANNER SERVICES
          ===================================================== */}
          <div className="lg:col-span-3">
            <h3
              className="
                mb-2.5
                text-sm
                font-bold
                text-slate-800
                transition-colors
                duration-500
                dark:text-slate-100
                sm:text-base
              "
            >
              Planner Services
            </h3>

            <ul className="space-y-2">
              {plannerServices.map((service) => (
                <li key={service.label}>
                  <Link
                    to={service.path}
                    className="
                      group
                      inline-flex
                      items-center
                      gap-1
                      text-sm
                      text-slate-500
                      transition-all
                      duration-300
                      hover:translate-x-1
                      hover:text-indigo-600
                      dark:text-slate-400
                      dark:hover:text-indigo-300
                    "
                  >
                    {service.label}

                    <ArrowUpRight
                      size={13}
                      className="
                        opacity-0
                        transition-all
                        duration-300
                        group-hover:translate-x-0.5
                        group-hover:opacity-100
                      "
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* =====================================================
              COMPANY
          ===================================================== */}
          <div className="lg:col-span-3">
            <h3
              className="
                mb-2.5
                text-sm
                font-bold
                text-slate-800
                transition-colors
                duration-500
                dark:text-slate-100
                sm:text-base
              "
            >
              Company
            </h3>

            <ul className="space-y-2">
              {companyLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className="
                      group
                      inline-flex
                      items-center
                      gap-1
                      text-sm
                      text-slate-500
                      transition-all
                      duration-300
                      hover:translate-x-1
                      hover:text-indigo-600
                      dark:text-slate-400
                      dark:hover:text-indigo-300
                    "
                  >
                    {item.label}

                    <ArrowUpRight
                      size={13}
                      className="
                        opacity-0
                        transition-all
                        duration-300
                        group-hover:translate-x-0.5
                        group-hover:opacity-100
                      "
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* =======================================================
            AUTO CHANGING POSITIVE THOUGHT
        ======================================================= */}
        <div
          className="
            mt-5
            border-t
            border-slate-200/80
            pt-4
            transition-colors
            duration-500
            dark:border-slate-700/60
            sm:mt-6
            sm:pt-5
          "
        >
          <div className="flex flex-col items-center text-center">
            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.18em]
                text-indigo-600
                dark:text-indigo-300
                sm:text-xs
              "
            >
              A Thought for Your Journey
            </p>

            <div
              className="
                mt-1.5
                flex
                min-h-[34px]
                w-full
                max-w-3xl
                items-center
                justify-center
                px-2
                sm:min-h-[38px]
              "
            >
              <p
                aria-live="polite"
                className={`
                  text-sm
                  font-medium
                  leading-5
                  text-slate-600
                  transition-all
                  duration-300
                  dark:text-slate-300
                  sm:text-[15px]
                  sm:leading-6
                  ${
                    thoughtVisible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-1 opacity-0"
                  }
                `}
              >
                {thoughts[currentThought]}
              </p>
            </div>

            {/* Thought Indicator */}
            <div className="mt-1.5 flex items-center gap-1.5">
              {thoughts.slice(0, 5).map((_, index) => (
                <span
                  key={index}
                  className={`
                    h-1.5
                    rounded-full
                    transition-all
                    duration-300
                    ${
                      currentThought % 5 === index
                        ? "w-5 bg-indigo-500 dark:bg-indigo-400"
                        : "w-1.5 bg-slate-300 dark:bg-slate-700"
                    }
                  `}
                />
              ))}
            </div>
          </div>
        </div>

        {/* =======================================================
            COPYRIGHT
            Bottom Privacy / Terms / Cookies removed
        ======================================================= */}
        <div
          className="
            mt-4
            border-t
            border-slate-200/80
            pt-3
            transition-colors
            duration-500
            dark:border-slate-700/60
            sm:mt-5
            sm:pt-4
          "
        >
          <div className="flex items-center justify-center text-center">
            <p
              className="
                text-xs
                leading-5
                text-slate-400
                transition-colors
                duration-500
                dark:text-slate-500
                sm:text-sm
              "
            >
              © {new Date().getFullYear()} Service Planner. All Rights
              Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;