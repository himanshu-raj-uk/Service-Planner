import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Wallet,
  Headphones,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Features = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  const features = [
    {
      title: "Smart Planning",
      label: "Make a Trip",
      desc: "Create personalized plans based on your budget, interests, destination, and preferences.",
      icon: Sparkles,
      bg: "from-violet-500 via-purple-600 to-indigo-700",
      glow: "shadow-[0_18px_50px_rgba(139,92,246,0.22)]",
      points: [
        "Personalized plans",
        "Smart recommendations",
        "Time saving",
      ],
    },
    {
      title: "Budget Friendly",
      label: "Plan a Birthday",
      desc: "Find suitable options according to your budget while keeping your experience memorable.",
      icon: Wallet,
      bg: "from-emerald-500 via-teal-600 to-cyan-700",
      glow: "shadow-[0_18px_50px_rgba(20,184,166,0.22)]",
      points: [
        "Budget optimization",
        "Affordable options",
        "Better value",
      ],
    },
    {
      title: "24/7 Support",
      label: "Always Available",
      desc: "Get reliable assistance whenever you need help during your planning and experience.",
      icon: Headphones,
      bg: "from-orange-500 via-pink-500 to-rose-600",
      glow: "shadow-[0_18px_50px_rgba(244,63,94,0.22)]",
      points: [
        "Quick assistance",
        "Always available",
        "Reliable support",
      ],
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
        className="
          pointer-events-none
          absolute
          inset-0
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
        }}
      />

      {/* Main Content */}
      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-7xl
          px-5
          py-9
          sm:px-8
          sm:py-11
          lg:px-10
          lg:py-12
        "
      >
        {/* Header */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.65,
            ease: [0.22, 1, 0.36, 1],
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
              bg-white
              px-4
              py-2
              text-xs
              font-medium
              text-indigo-600
              shadow-sm
              sm:text-sm
              dark:border-emerald-400/20
              dark:bg-slate-900
              dark:text-emerald-400
            "
          >
            <Sparkles size={15} strokeWidth={2} />
            Why Service Planner?
          </span>

          <h2
            className="
              mt-4
              text-3xl
              font-bold
              leading-[1.12]
              tracking-tight
              text-slate-900
              sm:mt-5
              sm:text-4xl
              md:text-5xl
              dark:text-white
            "
          >
            Everything You Need

            <span
              className="
                mt-1
                block
                bg-gradient-to-r
                from-indigo-600
                via-purple-600
                to-pink-500
                bg-clip-text
                text-transparent
                dark:from-emerald-400
                dark:via-teal-400
                dark:to-cyan-400
              "
            >
              In One Place
            </span>
          </h2>

          <p
            className="
              mx-auto
              mt-4
              max-w-2xl
              text-sm
              leading-6
              text-slate-600
              sm:mt-5
              sm:text-base
              sm:leading-7
              dark:text-slate-300
            "
          >
            Smart tools and reliable support to make planning
            easier, faster, and more enjoyable.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div
          className="
            mt-8
            grid
            w-full
            grid-cols-1
            gap-5
            sm:mt-10
            sm:grid-cols-2
            sm:gap-6
            lg:mt-11
            lg:grid-cols-3
            lg:gap-7
          "
        >
          {features.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeIndex === index;

            return (
              <motion.button
                key={item.title}
                type="button"
                onClick={() => handleFeatureClick(index)}
                initial={{
                  opacity: 0,
                  y: 24,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.15,
                }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{
                  y: -6,
                  transition: {
                    duration: 0.3,
                  },
                }}
                whileTap={{
                  scale: 0.985,
                }}
                className={`
                  group
                  relative
                  flex
                  min-h-[350px]
                  w-full
                  min-w-0
                  overflow-hidden
                  rounded-[1.5rem]
                  bg-gradient-to-br
                  p-6
                  text-left
                  text-white
                  transition-[box-shadow]
                  duration-300
                  sm:min-h-[365px]
                  sm:rounded-[1.65rem]
                  sm:p-7
                  lg:min-h-[375px]
                  lg:rounded-[1.75rem]
                  lg:p-7
                  ${item.bg}
                  ${
                    isActive
                      ? item.glow
                      : "shadow-[0_12px_35px_rgba(15,23,42,0.10)] hover:shadow-[0_18px_45px_rgba(15,23,42,0.16)]"
                  }
                `}
              >
                {/* Card Decorative Circle */}
                <div
                  className="
                    pointer-events-none
                    absolute
                    -right-16
                    -top-16
                    h-40
                    w-40
                    rounded-full
                    bg-white/10
                    blur-3xl
                    transition-transform
                    duration-700
                    group-hover:scale-125
                  "
                />

                <div
                  className="
                    pointer-events-none
                    absolute
                    -bottom-20
                    -left-16
                    h-40
                    w-40
                    rounded-full
                    bg-white/10
                    blur-3xl
                    transition-transform
                    duration-700
                    group-hover:scale-125
                  "
                />

                <div className="relative flex h-full min-w-0 flex-col">
                  {/* Card Header */}
                  <div className="flex items-start justify-between">
                    <div
                      className="
                        flex
                        h-12
                        w-12
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-white/15
                        bg-white/15
                        shadow-sm
                        backdrop-blur-md
                        transition-transform
                        duration-300
                        group-hover:scale-105
                        sm:h-[52px]
                        sm:w-[52px]
                        sm:rounded-2xl
                      "
                    >
                      <Icon size={24} strokeWidth={2} />
                    </div>

                    <span
                      className="
                        rounded-full
                        border
                        border-white/20
                        bg-white/10
                        px-3
                        py-1
                        text-[10px]
                        font-semibold
                        tracking-[0.14em]
                        text-white/75
                        backdrop-blur-sm
                      "
                    >
                      0{index + 1}
                    </span>
                  </div>

                  {/* Card Title */}
                  <div className="mt-6">
                    <span
                      className="
                        text-[11px]
                        font-semibold
                        uppercase
                        tracking-[0.14em]
                        text-white/65
                      "
                    >
                      {item.label}
                    </span>

                    <div className="mt-1.5 flex items-center gap-2">
                      <h3
                        className="
                          text-xl
                          font-bold
                          leading-tight
                          tracking-tight
                          sm:text-[22px]
                        "
                      >
                        {item.title}
                      </h3>

                      {isActive && (
                        <motion.div
                          initial={{
                            opacity: 0,
                            scale: 0.7,
                          }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                          }}
                          transition={{
                            duration: 0.3,
                          }}
                        >
                          <CheckCircle2
                            size={19}
                            strokeWidth={2.2}
                            className="text-white/90"
                          />
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p
                    className="
                      mt-3
                      text-sm
                      leading-6
                      text-white/80
                      sm:text-[15px]
                    "
                  >
                    {item.desc}
                  </p>

                  {/* Features List */}
                  <div
                    className="
                      mt-auto
                      border-t
                      border-white/15
                      pt-5
                    "
                  >
                    <div className="space-y-2.5">
                      {item.points.map((point) => (
                        <div
                          key={point}
                          className="
                            flex
                            items-center
                            gap-2.5
                            text-sm
                            font-medium
                            text-white/90
                          "
                        >
                          <span
                            className="
                              flex
                              h-5
                              w-5
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              bg-white/10
                            "
                          >
                            <CheckCircle2
                              size={13}
                              strokeWidth={2.4}
                            />
                          </span>

                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Bottom Hint */}
        <motion.p
          initial={{
            opacity: 0,
            y: 8,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.5,
            delay: 0.25,
          }}
          className="
            mt-6
            text-center
            text-xs
            font-medium
            text-slate-500
            sm:mt-7
            sm:text-sm
            dark:text-slate-400
          "
        >
          Select a feature to start creating your personalized plan
        </motion.p>
      </div>
    </section>
  );
};

export default Features;