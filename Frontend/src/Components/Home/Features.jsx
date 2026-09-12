import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Wallet,
  Headphones,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Features = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  const features = [
    {
      title: "Smart Planning",
      desc: "Creates personalized plans according to your budget, interests, destination, and preferences.",
      icon: Sparkles,
      bg: "from-violet-500 via-purple-600 to-indigo-700",
      glow: "shadow-[0_20px_60px_rgba(139,92,246,0.28)]",
      points: ["Personalized plans", "Smart recommendations", "Time saving"],
    },
    {
      title: "Budget Friendly",
      desc: "Get the best options according to your budget without compromising your experience.",
      icon: Wallet,
      bg: "from-emerald-500 via-teal-600 to-cyan-700",
      glow: "shadow-[0_20px_60px_rgba(20,184,166,0.28)]",
      points: ["Budget optimization", "Affordable options", "Better value"],
    },
    {
      title: "24/7 Support",
      desc: "Get reliable assistance whenever you need it during your planning and experience.",
      icon: Headphones,
      bg: "from-orange-500 via-pink-500 to-rose-600",
      glow: "shadow-[0_20px_60px_rgba(244,63,94,0.28)]",
      points: ["Quick assistance", "Always available", "Reliable support"],
    },
  ];

  const handleFeatureClick = (index) => {
    setActiveIndex(index);

    if (index === 1) {
      navigate("/birthday");
      return;
    }

    if (index === 2) {
      navigate("/support");
      return;
    }

    navigate("/tour");
  };

  return (
    <section className="relative overflow-hidden bg-[#F4F6FA] pt-16 sm:pt-20 lg:pt-24">
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-indigo-200/20 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-purple-200/15 blur-3xl" />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-2 text-xs font-bold text-indigo-600 sm:text-sm">
            <Sparkles size={15} />
            Why Service Planner?
          </span>

          <h2 className="mt-4 text-3xl font-black leading-[1.15] tracking-tight text-slate-900 sm:mt-5 sm:text-4xl md:text-5xl">
            Everything You Need
            <span className="mt-1 block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              In One Place
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-500 sm:mt-5 sm:text-base sm:leading-7 lg:text-lg">
            Smart tools and reliable support to make planning easier, faster,
            and more enjoyable.
          </p>
        </motion.div>

        <div className="mt-10 grid w-full grid-cols-1 gap-5 sm:mt-12 sm:gap-6 md:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-7">
          {features.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeIndex === index;

            return (
              <motion.button
                key={item.title}
                type="button"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.65,
                  delay: index * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  transition: {
                    duration: 0.45,
                    ease: [0.22, 1, 0.36, 1],
                  },
                }}
                whileTap={{
                  scale: 0.985,
                  transition: {
                    duration: 0.15,
                  },
                }}
                onClick={() => handleFeatureClick(index)}
                className={`group relative flex w-full min-w-0 overflow-hidden rounded-[1.5rem] bg-gradient-to-br p-6 text-left text-white transition-[box-shadow,transform] duration-500 ease-out sm:rounded-[1.75rem] sm:p-7 lg:rounded-[2rem] lg:p-8 ${
                  item.bg
                } ${
                  isActive
                    ? item.glow
                    : "shadow-[0_12px_35px_rgba(15,23,42,0.10)] hover:shadow-[0_20px_55px_rgba(15,23,42,0.16)]"
                }`}
              >
                <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/10 blur-3xl transition-transform duration-700 ease-out group-hover:scale-125" />

                <div className="pointer-events-none absolute -bottom-20 -left-16 h-44 w-44 rounded-full bg-white/10 blur-3xl transition-transform duration-700 ease-out group-hover:scale-125" />

                <div className="relative flex w-full min-w-0 flex-col">
                  <div className="flex items-start justify-between">
                    <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-white/15 shadow-lg backdrop-blur-md transition-transform duration-500 ease-out group-hover:scale-105 group-hover:rotate-2 sm:h-14 sm:w-14">
                      <Icon size={26} strokeWidth={2} />
                    </div>

                    <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white/80 backdrop-blur-sm">
                      0{index + 1}
                    </span>
                  </div>

                  <div className="mt-7 flex min-w-0 flex-col gap-1">
                    {index === 0 && (
                      <span className="text-xs font-bold uppercase tracking-wider text-white/70">
                        Make a Trip
                      </span>
                    )}

                    {index === 1 && (
                      <span className="text-xs font-bold uppercase tracking-wider text-white/70">
                        Plan a Birthday
                      </span>
                    )}

                    <div className="flex items-center justify-between gap-3">
                      <h3 className="min-w-0 text-xl font-black sm:text-2xl">
                        {item.title}
                      </h3>

                      {isActive && (
                        <motion.div
                          initial={{
                            opacity: 0,
                            scale: 0.6,
                            rotate: -45,
                          }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                            rotate: 0,
                          }}
                          transition={{
                            duration: 0.5,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="shrink-0"
                        >
                          <CheckCircle2 size={23} />
                        </motion.div>
                      )}
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-white/80 sm:text-base sm:leading-7">
                    {item.desc}
                  </p>

                  <div className="mt-6 border-t border-white/20 pt-5">
                    <div className="space-y-3">
                      {item.points.map((point) => (
                        <div
                          key={point}
                          className="flex items-center gap-3 text-sm font-medium text-white/95"
                        >
                          <CheckCircle2 size={17} className="shrink-0" />

                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-7 flex items-center gap-2 text-sm font-bold">
                    <span>Start Planning</span>

                    <ArrowRight
                      size={17}
                      className="transition-transform duration-500 ease-out group-hover:translate-x-2"
                    />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            delay: 0.35,
          }}
          className="mt-7 text-center text-xs font-medium text-slate-400 sm:mt-8 sm:text-sm"
        >
          Select a feature to start creating your personalized plan
        </motion.p>
      </div>
    </section>
  );
};

export default Features;
