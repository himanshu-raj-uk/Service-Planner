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
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
      route: "/tour",
    },
    {
      title: "Birthday Planner",
      description:
        "Create memorable birthdays with venues, themes, food, decorations, and complete planning.",
      icon: Cake,
      iconBg: "bg-pink-100",
      iconColor: "text-pink-600",
      route: "/birthday",
    },
    {
      title: "Wedding Planner",
      description:
        "Organize beautiful weddings with thoughtful planning, vendors, venues, and arrangements.",
      icon: Heart,
      iconBg: "bg-rose-100",
      iconColor: "text-rose-600",
      route: "/event",
    },
    {
      title: "Corporate Events",
      description:
        "Manage professional events, meetings, conferences, and corporate experiences effortlessly.",
      icon: Building2,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      route: "/event",
    },
    {
      title: "Hotel Booking",
      description:
        "Find comfortable stays that match your destination, preferences, and travel budget.",
      icon: Hotel,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      route: "/event",
    },
    {
      title: "Transportation",
      description:
        "Arrange convenient transportation options to make your complete experience smoother.",
      icon: Car,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      route: "/event",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#F4F6FA] pt-16 sm:pt-20 lg:pt-24">
      <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-indigo-300/10 blur-3xl" />

      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-pink-300/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: 0.7,
            ease: "easeOut",
          }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-2 text-sm font-bold text-indigo-600">
            <Sparkles size={16} />
            What We Offer
          </span>
          <h1 className="mt-6 text-3xl font-bold tracking-[-0.025em] text-slate-900 sm:text-4xl lg:text-5xl">
            Our Services
            <span className="mt-2 block text-xl font-medium text-slate-500 sm:text-2xl lg:text-3xl">
              Made For You
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base lg:text-lg">
            From travel and celebrations to professional events, everything you
            need to create a perfectly organized experience.
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                whileHover={{
                  y: -8,
                  scale: 1.025,
                  transition: {
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  },
                }}
                whileTap={{
                  scale: 0.98,
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
                className="group relative min-h-[260px] cursor-pointer overflow-hidden rounded-[2rem] border border-white/80 bg-white p-6 shadow-lg outline-none transition-shadow duration-500 hover:shadow-2xl focus:ring-2 focus:ring-indigo-500 focus:ring-offset-4 sm:min-h-[275px] sm:p-7 lg:min-h-[285px] lg:p-8"
              >
                <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-indigo-100/40 blur-3xl transition-transform duration-700 group-hover:scale-125" />

                <div className="relative flex h-full flex-col">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${service.iconBg} ${service.iconColor} shadow-sm transition-transform duration-500 ease-out group-hover:scale-110`}
                  >
                    <Icon size={27} strokeWidth={2.2} />
                  </div>

                  <div className="mt-6 flex items-start justify-between gap-4">
                    <h3 className="text-xl font-black text-slate-900 sm:text-2xl">
                      {service.title}
                    </h3>

                    <div className="flex h-9 w-9 shrink-0 translate-x-2 items-center justify-center rounded-full bg-slate-100 text-slate-500 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
                      <ArrowRight size={17} />
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base sm:leading-7">
                    {service.description}
                  </p>

                  <div className="mt-auto flex items-center gap-2 pt-6 text-sm font-bold text-indigo-600">
                    Explore Service
                    <ArrowRight
                      size={17}
                      className="transition-transform duration-500 ease-out group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.8,
            delay: 0.4,
          }}
          className="mt-8 text-center text-sm font-medium text-slate-400"
        >
          Choose a service and start planning your perfect experience
        </motion.p>
      </div>
    </section>
  );
};

export default Services;
