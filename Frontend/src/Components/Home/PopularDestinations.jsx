import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { destinations } from "../../Data/DestinationData";

const PopularDestinations = () => {
  const navigate = useNavigate();
  const [isPaused, setIsPaused] = useState(false);

  const marqueePlaces = useMemo(
    () => [...destinations, ...destinations],
    []
  );

  const handleDestinationClick = (destination) => {
    navigate("/tour", {
      state: {
        destination: destination.name,
      },
    });
  };

  return (
    <section
      className="
        relative
        w-full
        overflow-hidden
        bg-[#f4f6fa]
        pb-12
        text-slate-900
        transition-colors
        duration-500
        sm:pb-14
        lg:pb-16
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

      {/* Background Fade */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-gradient-to-b
          from-[#f4f6fa]/70
          via-transparent
          to-[#f4f6fa]/70
          dark:from-[#0f172a]/70
          dark:to-[#0f172a]/70
        "
      />

      <div className="relative z-10 w-full">
        {/* Header */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <span
              className="
                mb-3
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-slate-200/80
                bg-white/70
                px-4
                py-1.5
                text-xs
                font-semibold
                uppercase
                tracking-[0.18em]
                text-slate-600
                backdrop-blur-md
                dark:border-blue-400/30
                dark:bg-slate-900/60
                dark:text-blue-200
              "
            >
              <MapPin className="h-3.5 w-3.5" />
              Explore India
            </span>

            <h2
              className="
                text-3xl
                font-bold
                tracking-tight
                text-slate-900
                sm:text-4xl
                lg:text-5xl
                dark:text-white
              "
            >
              Popular Destinations
            </h2>

            <p
              className="
                mt-3
                max-w-2xl
                text-sm
                leading-6
                text-slate-600
                sm:text-base
                dark:text-slate-300
              "
            >
              Discover India's most loved destinations and find the perfect
              place for your next journey.
            </p>
          </div>
        </div>

        {/* Marquee Area */}
        <div
          className="
            mt-8
            w-full
            overflow-hidden
            px-3
            py-5
            sm:mt-10
            sm:px-5
            sm:py-6
            lg:px-7
            lg:py-7
          "
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className={`popular-destination-marquee flex w-max items-stretch gap-4 sm:gap-5 lg:gap-6 ${
              isPaused ? "marquee-paused" : ""
            }`}
          >
            {marqueePlaces.map((place, index) => (
              <motion.button
                key={`${place.name}-${index}`}
                type="button"
                onClick={() => handleDestinationClick(place)}
                whileHover={{
                  scale: 1.025,
                  y: -5,
                }}
                whileTap={{
                  scale: 0.985,
                }}
                transition={{
                  duration: 0.35,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="
                  group
                  relative
                  h-[250px]
                  w-[190px]
                  shrink-0
                  overflow-hidden
                  rounded-2xl
                  border
                  border-slate-200/90
                  bg-slate-200
                  text-left
                  shadow-sm
                  outline-none
                  transition-[box-shadow,border-color]
                  duration-300
                  hover:shadow-xl
                  focus-visible:ring-2
                  focus-visible:ring-slate-500
                  sm:h-[280px]
                  sm:w-[220px]
                  sm:rounded-3xl
                  md:h-[300px]
                  md:w-[240px]
                  lg:h-[330px]
                  lg:w-[260px]
                  xl:h-[350px]
                  xl:w-[280px]
                  dark:border-blue-400/35
                  dark:bg-slate-800
                  dark:shadow-[0_0_0_1px_rgba(96,165,250,0.08)]
                  dark:hover:border-blue-300/75
                  dark:hover:shadow-[0_0_24px_rgba(59,130,246,0.20)]
                "
              >
                {/* Image */}
                <img
                  src={place.img}
                  alt={place.name}
                  loading="lazy"
                  className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-cover
                    transition-transform
                    duration-700
                    ease-out
                    group-hover:scale-105
                  "
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src =
                      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=85";
                  }}
                />

                {/* Image Overlay */}
                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black/85
                    via-black/20
                    to-transparent
                  "
                />

                {/* Content */}
                <div
                  className="
                    absolute
                    inset-x-0
                    bottom-0
                    flex
                    items-end
                    justify-between
                    gap-3
                    p-4
                    sm:p-5
                  "
                >
                  <div className="min-w-0">
                    <div
                      className="
                        mb-1
                        flex
                        items-center
                        gap-1.5
                        text-xs
                        font-medium
                        text-white/75
                      "
                    >
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span>India</span>
                    </div>

                    <h3
                      className="
                        truncate
                        text-lg
                        font-bold
                        tracking-tight
                        text-white
                        sm:text-xl
                      "
                    >
                      {place.name}
                    </h3>
                  </div>

                  {/* Hover Arrow */}
                  <span
                    className="
                      flex
                      h-8
                      w-8
                      shrink-0
                      translate-y-2
                      scale-75
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-white/30
                      bg-white/10
                      text-white
                      opacity-0
                      backdrop-blur-md
                      transition-all
                      duration-300
                      ease-out
                      group-hover:translate-y-0
                      group-hover:scale-100
                      group-hover:opacity-100
                      sm:h-9
                      sm:w-9
                    "
                  >
                    <ArrowRight
                      className="
                        h-4
                        w-4
                        transition-transform
                        duration-300
                        group-hover:-rotate-45
                      "
                    />
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .popular-destination-marquee {
          animation: popular-destination-scroll 65s linear infinite;
          will-change: transform;
        }

        .popular-destination-marquee.marquee-paused {
          animation-play-state: paused;
        }

        @keyframes popular-destination-scroll {
          from {
            transform: translate3d(0, 0, 0);
          }

          to {
            transform: translate3d(-50%, 0, 0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .popular-destination-marquee {
            animation: none;
            transform: none;
          }
        }
      `}</style>
    </section>
  );
};

export default PopularDestinations;