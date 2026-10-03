import React from "react";
import { motion } from "framer-motion";
import {
  Plane,
  Cake,
  Heart,
  Building2,
  Hotel,
  Car,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Services = () => {
  const navigate = useNavigate();

  const services = [
    {
      title: "Tour Planner",
      description:
        "Plan unforgettable trips with personalized destinations, stays, activities, and budgets.",
      icon: Plane,
      iconBg: "bg-indigo-100 dark:bg-indigo-400/10",
      iconColor: "text-indigo-600 dark:text-indigo-300",
      route: "/tour",
    },
    {
      title: "Birthday Planner",
      description:
        "Create memorable birthdays with venues, themes, food, decorations, and complete planning.",
      icon: Cake,
      iconBg: "bg-pink-100 dark:bg-pink-400/10",
      iconColor: "text-pink-600 dark:text-pink-300",
      route: "/birthday",
    },
    {
      title: "Wedding Planner",
      description:
        "Organize beautiful weddings with thoughtful planning, vendors, venues, and arrangements.",
      icon: Heart,
      iconBg: "bg-rose-100 dark:bg-rose-400/10",
      iconColor: "text-rose-600 dark:text-rose-300",
      route: "/event",
    },
    {
      title: "Corporate Events",
      description:
        "Manage professional events, meetings, conferences, and corporate experiences effortlessly.",
      icon: Building2,
      iconBg: "bg-blue-100 dark:bg-blue-400/10",
      iconColor: "text-blue-600 dark:text-blue-300",
      route: "/event",
    },
    {
      title: "Hotel Booking",
      description:
        "Find comfortable stays that match your destination, preferences, and travel budget.",
      icon: Hotel,
      iconBg: "bg-emerald-100 dark:bg-emerald-400/10",
      iconColor: "text-emerald-600 dark:text-emerald-300",
      route: "/corporate",
    },
    {
      title: "Transportation",
      description:
        "Arrange convenient transportation options to make your complete experience smoother.",
      icon: Car,
      iconBg: "bg-orange-100 dark:bg-orange-400/10",
      iconColor: "text-orange-600 dark:text-orange-300",
      route: "/corporate",
    },
  ];

  return (
    <section
      className="
        relative
        w-full
        overflow-hidden
        bg-[#f4f6fa]
        text-slate-900
        transition-colors
        duration-500
        dark:bg-[#0f172a]
        dark:text-slate-100
      "
    >
      {/* Background Grid Pattern */}
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

      {/* Soft Background Accents */}
      <div
        className="
          pointer-events-none
          absolute
          -left-24
          top-20
          h-72
          w-72
          rounded-full
          bg-indigo-300/10
          blur-3xl
          dark:bg-indigo-500/7
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-24
          bottom-10
          h-80
          w-80
          rounded-full
          bg-pink-300/10
          blur-3xl
          dark:bg-blue-500/6
        "
      />

      {/* Main Content */}
      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-7xl
          px-4
          pb-0
          pt-0
          sm:px-6
          lg:px-8
        "
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: 0.7,
            ease: "easeOut",
          }}
          className="mx-auto max-w-3xl text-center"
        >
          <span
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-indigo-200
              bg-indigo-50
              px-4
              py-2
              text-sm
              font-bold
              text-indigo-600
              shadow-sm
              dark:border-indigo-400/25
              dark:bg-indigo-400/10
              dark:text-indigo-200
              dark:shadow-[0_0_22px_rgba(99,102,241,0.08)]
            "
          >
            <Sparkles size={16} />
            What We Offer
          </span>

          <h2
            className="
              mt-5
              text-3xl
              font-bold
              tracking-tight
              text-slate-900
              sm:text-4xl
              lg:text-5xl
              dark:text-white
            "
          >
            Our Services

            <span
              className="
                mt-2
                block
                text-xl
                font-medium
                text-slate-500
                sm:text-2xl
                lg:text-3xl
                dark:text-slate-300
              "
            >
              Made For You
            </span>
          </h2>

          <p
            className="
              mx-auto
              mt-4
              max-w-2xl
              text-sm
              leading-6
              text-slate-500
              sm:text-base
              sm:leading-7
              lg:text-lg
              dark:text-slate-300
            "
          >
            From travel and celebrations to professional events, everything
            you need to create a perfectly organized experience.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div
          className="
            relative
            mt-8
            grid
            grid-cols-1
            gap-5
            sm:mt-10
            sm:grid-cols-2
            sm:gap-x-6
            sm:gap-y-7
            lg:mt-12
            lg:grid-cols-3
            lg:gap-x-7
            lg:gap-y-10
          "
        >
          {services.map((service, index) => {
            const Icon = service.icon;

            const desktopOffset =
              index === 1 || index === 4
                ? "lg:translate-y-5"
                : index === 2 || index === 5
                  ? "lg:translate-y-10"
                  : "";

            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.08,
                  ease: "easeOut",
                }}
                whileHover={{
                  y: -6,
                  scale: 1.015,
                  transition: {
                    duration: 0.35,
                    ease: [0.22, 1, 0.36, 1],
                  },
                }}
                whileTap={{
                  scale: 0.985,
                  transition: {
                    duration: 0.15,
                  },
                }}
                onClick={() => navigate(service.route)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    navigate(service.route);
                  }
                }}
                className={`
                  group
                  relative
                  min-h-[245px]
                  cursor-pointer
                  overflow-hidden
                  rounded-[1.75rem]
                  border
                  border-slate-200/80
                  bg-white/90
                  p-5
                  shadow-sm
                  outline-none
                  backdrop-blur-sm
                  transition-all
                  duration-500
                  hover:border-indigo-300
                  hover:shadow-[0_20px_45px_rgba(79,70,229,0.12)]
                  focus-visible:ring-2
                  focus-visible:ring-indigo-500
                  focus-visible:ring-offset-2
                  sm:min-h-[260px]
                  sm:p-6
                  lg:min-h-[275px]
                  lg:p-7
                  dark:border-slate-700/80
                  dark:bg-slate-900/90
                  dark:hover:border-indigo-400/65
                  dark:hover:bg-slate-900
                  dark:hover:shadow-[0_0_0_1px_rgba(129,140,248,0.08),0_18px_50px_rgba(59,130,246,0.16),0_0_35px_rgba(99,102,241,0.10)]
                  ${desktopOffset}
                `}
              >
                {/* Card Top Glow */}
                <div
                  className="
                    pointer-events-none
                    absolute
                    -right-16
                    -top-16
                    h-44
                    w-44
                    rounded-full
                    bg-indigo-200/30
                    blur-3xl
                    transition-all
                    duration-700
                    group-hover:scale-150
                    group-hover:bg-indigo-300/35
                    dark:bg-indigo-500/5
                    dark:group-hover:bg-indigo-500/12
                  "
                />

                {/* Card Bottom Glow */}
                <div
                  className="
                    pointer-events-none
                    absolute
                    -bottom-20
                    -left-10
                    h-36
                    w-36
                    rounded-full
                    bg-blue-300/10
                    blur-3xl
                    opacity-0
                    transition-opacity
                    duration-500
                    group-hover:opacity-100
                    dark:bg-blue-500/10
                    dark:group-hover:opacity-100
                  "
                />

                {/* Card Content */}
                <div className="relative flex h-full flex-col">
                  {/* Icon */}
                  <div
                    className={`
                      flex
                      h-[52px]
                      w-[52px]
                      items-center
                      justify-center
                      rounded-2xl
                      ${service.iconBg}
                      ${service.iconColor}
                      shadow-sm
                      transition-all
                      duration-500
                      ease-out
                      group-hover:scale-110
                      dark:group-hover:shadow-[0_0_24px_rgba(99,102,241,0.16)]
                    `}
                  >
                    <Icon size={25} strokeWidth={2.2} />
                  </div>

                  {/* Title */}
                  <div className="mt-5 flex items-start justify-between gap-3">
                    <h3
                      className="
                        text-lg
                        font-bold
                        tracking-tight
                        text-slate-900
                        transition-colors
                        duration-300
                        sm:text-xl
                        dark:text-slate-100
                        dark:group-hover:text-white
                      "
                    >
                      {service.title}
                    </h3>

                    {/* Hover Arrow */}
                    <div
                      className="
                        flex
                        h-8
                        w-8
                        shrink-0
                        translate-x-2
                        translate-y-1
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-slate-200
                        bg-slate-50
                        text-slate-500
                        opacity-0
                        transition-all
                        duration-300
                        group-hover:translate-x-0
                        group-hover:translate-y-0
                        group-hover:opacity-100
                        dark:border-indigo-400/25
                        dark:bg-indigo-400/10
                        dark:text-indigo-200
                        dark:group-hover:border-indigo-300/40
                        dark:group-hover:bg-indigo-400/15
                        dark:group-hover:text-indigo-100
                        dark:group-hover:shadow-[0_0_18px_rgba(99,102,241,0.18)]
                      "
                    >
                      <ArrowRight
                        size={16}
                        className="
                          transition-transform
                          duration-300
                          group-hover:-rotate-45
                        "
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <p
                    className="
                      mt-3
                      text-sm
                      leading-6
                      text-slate-500
                      transition-colors
                      duration-300
                      sm:text-[15px]
                      dark:text-slate-300
                      dark:group-hover:text-slate-200
                    "
                  >
                    {service.description}
                  </p>
                </div>

                {/* Floating Connection Indicator */}
                {index < services.length - 1 && (
                  <div
                    className="
                      pointer-events-none
                      absolute
                      -right-5
                      top-1/2
                      z-20
                      hidden
                      lg:block
                    "
                  >
                    <div
                      className="
                        h-px
                        w-8
                        bg-slate-300/70
                        transition-all
                        duration-500
                        group-hover:w-10
                        group-hover:bg-indigo-300
                        dark:bg-slate-700
                        dark:group-hover:bg-indigo-400/70
                        dark:group-hover:shadow-[0_0_10px_rgba(99,102,241,0.55)]
                      "
                    />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Message */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.8,
            delay: 0.4,
          }}
          className="
            mt-16
            flex
            justify-center
            px-2
            pb-12
            sm:mt-20
            sm:pb-14
            lg:mt-24
            lg:pb-16
          "
        >
          <p
            className="
              text-center
              text-sm
              font-medium
              leading-6
              text-slate-600
              transition-colors
              duration-500
              dark:text-slate-300
              sm:text-[15px]
              lg:text-base
            "
          >
            Choose a service and start planning your perfect experience
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;