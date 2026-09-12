import React, { useState } from "react";

const Banner = () => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <section className="relative w-full overflow-hidden bg-[#F4F6FA]">
      <div className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-indigo-200/10 blur-3xl" />

      <div className="absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-indigo-200/10 blur-3xl" />

      <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-indigo-100/10 blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 py-10 sm:px-6 sm:py-12 md:grid-cols-2 md:gap-10 lg:px-8 lg:py-14 xl:gap-14">
        <div className="relative z-10 min-w-0">
          <span className="inline-flex items-center rounded-full bg-indigo-100 px-4 py-2 text-xs font-bold text-indigo-600 shadow-sm sm:text-sm">
            Smart Planning Made Simple
          </span>

          <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Plan Your
            <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              Dream Experience
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-6 text-slate-500 sm:mt-6 sm:text-lg sm:leading-7">
            From luxury vacations to unforgettable birthdays, weddings and
            events. We create complete plans according to your budget and
            requirements.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-4">
            <button
              type="button"
              className="w-full rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 px-8 py-3 font-bold text-white shadow-lg shadow-indigo-200 transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:w-auto"
            >
              Start Planning
            </button>

            <button
              type="button"
              className="w-full rounded-full border border-indigo-200 bg-white px-8 py-3 font-bold text-indigo-600 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-lg sm:w-auto"
            >
              Explore Services
            </button>
          </div>

          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-xs font-medium text-slate-500 sm:mt-8 sm:gap-6 sm:text-sm">
            <div>
              <span className="font-bold text-indigo-600">SP</span> Smart
              Planning
            </div>

            <div>
              <span className="font-bold text-purple-600">24/7</span> Support
            </div>

            <div>
              <span className="font-bold text-pink-500">100%</span> Personalized
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-xl md:max-w-none">
          <div className="absolute -inset-4 rounded-[2.5rem] bg-indigo-200/10 blur-2xl" />

          <div className="relative overflow-hidden rounded-[1.5rem] border border-white/70 bg-white/40 p-1.5 shadow-[0_20px_60px_rgba(79,70,229,0.12)] backdrop-blur-sm sm:rounded-[2rem] sm:p-2">
            <div className="relative h-[280px] w-full overflow-hidden rounded-[1.2rem] bg-gray-200 sm:h-[380px] sm:rounded-[1.6rem] md:h-[400px] lg:h-[460px] xl:h-[480px]">
              {!imageLoaded && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />

                    <span className="text-xs font-medium text-gray-400">
                      Loading image...
                    </span>
                  </div>
                </div>
              )}

              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
                alt="Dream travel destination"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(true)}
                className={`h-full w-full object-cover transition-all duration-700 ${
                  imageLoaded ? "scale-100 opacity-100" : "scale-105 opacity-0"
                }`}
              />
            </div>
          </div>

          <div className="absolute -bottom-4 left-1 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-xl backdrop-blur-md sm:-bottom-5 sm:-left-5 sm:px-5 sm:py-4">
            <p className="text-[10px] font-semibold text-indigo-500 sm:text-xs">
              PLAN SMARTER
            </p>

            <p className="mt-1 text-xs font-bold text-slate-800 sm:text-sm">
              Your perfect experience
            </p>
          </div>

          <div className="absolute right-1 top-6 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-xl backdrop-blur-md sm:-right-5 sm:top-8 sm:px-5 sm:py-4">
            <p className="text-[10px] font-semibold text-indigo-500 sm:text-xs">
              SMART PLANNER
            </p>

            <p className="mt-1 text-xs font-bold text-slate-800 sm:text-sm">
              Built for you
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
