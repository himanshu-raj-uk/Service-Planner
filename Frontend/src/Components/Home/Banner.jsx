import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  const handleStartPlanning = () => {
    const token = localStorage.getItem("userToken");

    if (token) {
      navigate("/tour");
    } else {
      navigate("/register");
    }
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

      {/* Main Content */}
      <div
        className="
          relative
          z-10
          mx-auto
          flex
          w-full
          max-w-7xl
          items-center
          px-5
          pb-0
          pt-8
          sm:px-8
          sm:pb-0
          sm:pt-10
          lg:px-10
          lg:pb-0
          lg:pt-12
        "
      >
        <div
          className="
            grid
            w-full
            items-center
            gap-10
            lg:grid-cols-2
            lg:gap-14
            xl:gap-16
          "
        >
          {/* Left Content */}
          <div className="relative z-10 text-center">
            <h1
              className="
                mx-auto
                max-w-2xl
                text-4xl
                font-bold
                leading-[1.12]
                tracking-tight
                text-slate-900
                sm:text-5xl
                lg:text-6xl
                dark:text-white
              "
            >
              Plan Your Perfect
              <span
                className="
                  block
                  bg-gradient-to-r
                  from-indigo-600
                  via-purple-600
                  to-pink-500
                  bg-clip-text
                  text-transparent
                  dark:from-indigo-400
                  dark:via-purple-400
                  dark:to-pink-400
                "
              >
                Journey With Ease
              </span>
            </h1>

            <p
              className="
                mx-auto
                mt-4
                max-w-xl
                text-sm
                leading-6
                text-slate-600
                sm:text-base
                sm:leading-7
                lg:text-lg
                dark:text-slate-300
              "
            >
              Organize your tours, birthdays, events, and corporate plans in
              one simple place. Create memorable experiences without the
              planning stress.
            </p>

            {/* Benefits */}
            <div
              className="
                mt-5
                flex
                flex-wrap
                justify-center
                gap-x-5
                gap-y-3
                text-sm
                font-medium
                text-slate-700
                dark:text-slate-300
              "
            >
              <span className="flex items-center gap-2">
                <span
                  className="
                    flex
                    h-5
                    w-5
                    items-center
                    justify-center
                    rounded-full
                    bg-emerald-100
                    text-xs
                    font-bold
                    text-emerald-600
                    dark:bg-emerald-400/10
                    dark:text-emerald-400
                  "
                >
                  ✓
                </span>
                Easy Planning
              </span>

              <span className="flex items-center gap-2">
                <span
                  className="
                    flex
                    h-5
                    w-5
                    items-center
                    justify-center
                    rounded-full
                    bg-emerald-100
                    text-xs
                    font-bold
                    text-emerald-600
                    dark:bg-emerald-400/10
                    dark:text-emerald-400
                  "
                >
                  ✓
                </span>
                Smart Organization
              </span>

              <span className="flex items-center gap-2">
                <span
                  className="
                    flex
                    h-5
                    w-5
                    items-center
                    justify-center
                    rounded-full
                    bg-emerald-100
                    text-xs
                    font-bold
                    text-emerald-600
                    dark:bg-emerald-400/10
                    dark:text-emerald-400
                  "
                >
                  ✓
                </span>
                Stress-Free Experience
              </span>
            </div>

            {/* CTA */}
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={handleStartPlanning}
                className="
                  rounded-xl
                  bg-gradient-to-r
                  from-indigo-600
                  to-purple-600
                  px-7
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  shadow-lg
                  shadow-indigo-500/20
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:shadow-xl
                  active:translate-y-0
                  dark:from-indigo-500
                  dark:to-purple-500
                  dark:shadow-indigo-500/10
                "
              >
                Start Planning
              </button>
            </div>
          </div>

          {/* Image */}
          <div
            className="
              relative
              flex
              min-h-[300px]
              items-center
              justify-center
              sm:min-h-[380px]
              lg:min-h-[450px]
            "
          >
            <div
              className="
                relative
                z-10
                w-full
                max-w-[500px]
                animate-[bannerFloat_3.5s_ease-in-out_infinite]
              "
            >
              {/* Image Card */}
              <div
                className="
                  relative
                  overflow-hidden
                  rounded-[1.75rem]
                  border
                  border-white
                  bg-white
                  p-2
                  shadow-[0_18px_50px_rgba(15,23,42,0.14)]
                  transition-transform
                  duration-500
                  hover:scale-[1.015]
                  dark:border-emerald-400/60
                  dark:bg-slate-900
                  dark:shadow-[0_18px_50px_rgba(0,0,0,0.35)]
                "
              >
                {!imageLoaded && (
                  <div
                    className="
                      absolute
                      inset-2
                      z-20
                      flex
                      items-center
                      justify-center
                      rounded-[1.4rem]
                      bg-slate-100
                      dark:bg-slate-800
                    "
                  >
                    <div
                      className="
                        h-9
                        w-9
                        animate-spin
                        rounded-full
                        border-4
                        border-slate-200
                        border-t-indigo-600
                        dark:border-slate-700
                        dark:border-t-emerald-400
                      "
                    />
                  </div>
                )}

                <div className="relative overflow-hidden rounded-[1.4rem]">
                  <img
                    src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85"
                    alt="Beautiful tropical travel destination"
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageLoaded(true)}
                    className="
                      aspect-[4/3]
                      w-full
                      object-cover
                      transition-transform
                      duration-700
                      hover:scale-105
                    "
                  />

                  <div
                    className="
                      pointer-events-none
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-slate-950/25
                      via-transparent
                      to-transparent
                      dark:from-slate-950/45
                    "
                  />
                </div>
              </div>

              {/* Floating Info */}
              <div
                className="
                  absolute
                  -bottom-4
                  -left-3
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  px-4
                  py-2.5
                  shadow-lg
                  sm:-left-5
                  dark:border-slate-700
                  dark:bg-slate-900
                  dark:shadow-black/30
                "
              >
                <p
                  className="
                    text-[11px]
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  Your next adventure
                </p>

                <p
                  className="
                    mt-0.5
                    text-sm
                    font-semibold
                    text-slate-900
                    dark:text-white
                  "
                >
                  Starts here ✈️
                </p>
              </div>

              {/* Floating Discovery */}
              <div
                className="
                  absolute
                  -right-3
                  -top-4
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  px-4
                  py-2.5
                  shadow-lg
                  sm:-right-5
                  dark:border-slate-700
                  dark:bg-slate-900
                  dark:shadow-black/30
                "
              >
                <div className="flex items-center gap-2">
                  <span
                    className="
                      flex
                      h-7
                      w-7
                      items-center
                      justify-center
                      rounded-full
                      bg-indigo-50
                      text-sm
                      dark:bg-emerald-400/10
                    "
                  >
                    📍
                  </span>

                  <div>
                    <p
                      className="
                        text-[10px]
                        text-slate-500
                        dark:text-slate-400
                      "
                    >
                      Discover
                    </p>

                    <p
                      className="
                        text-xs
                        font-semibold
                        text-slate-900
                        dark:text-white
                      "
                    >
                      New Places
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;