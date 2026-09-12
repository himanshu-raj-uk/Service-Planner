import { motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  PartyPopper,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Event = () => {
  const navigate = useNavigate();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f8f2e2] px-4 py-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-[#4bb3a0]/15 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-[#cf9d4b]/20 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-80px)] max-w-6xl items-center justify-center">
        <motion.section
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full overflow-hidden rounded-[2rem] border border-[#cf9d4b]/20 bg-white shadow-2xl shadow-[#0d222c]/10"
        >
          <div className="grid lg:grid-cols-2">
            <div className="relative flex min-h-[430px] items-center justify-center overflow-hidden bg-[#0d222c] p-8 text-white sm:p-12 lg:min-h-[600px]">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-[#cf9d4b]/20" />

              <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full border border-[#4bb3a0]/20" />

              <motion.div
                animate={{
                  y: [0, -12, 0],
                  rotate: [0, 2, -2, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative z-10 flex h-36 w-36 items-center justify-center rounded-full border border-[#cf9d4b]/30 bg-white/5 shadow-2xl backdrop-blur-sm sm:h-44 sm:w-44"
              >
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#cf9d4b]/10 sm:h-28 sm:w-28">
                  <CalendarDays
                    className="text-[#cf9d4b]"
                    size={58}
                    strokeWidth={1.5}
                  />
                </div>

                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-0"
                >
                  <Sparkles
                    className="absolute -right-1 top-8 text-[#4bb3a0]"
                    size={22}
                  />

                  <Sparkles
                    className="absolute -bottom-1 left-8 text-[#cf9d4b]"
                    size={18}
                  />
                </motion.div>
              </motion.div>

              <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between text-xs text-slate-400 sm:bottom-10 sm:left-12 sm:right-12">
                <span className="flex items-center gap-2">
                  <Clock3 size={14} />
                  Coming Soon
                </span>

                <span className="flex items-center gap-2">
                  <PartyPopper size={14} />
                  Something Special
                </span>
              </div>
            </div>

            <div className="flex items-center p-7 sm:p-10 lg:p-14">
              <div className="w-full">
                <motion.div
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.2,
                  }}
                  className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#4bb3a0]/10 px-4 py-2 text-sm font-semibold text-[#0d6f64]"
                >
                  <Sparkles size={16} />
                  Event Planner
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.3,
                  }}
                  className="text-4xl font-black leading-tight tracking-tight text-[#0d222c] sm:text-5xl lg:text-6xl"
                >
                  Events Are
                  <span className="block text-[#cf9d4b]">
                    Coming Soon
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.4,
                  }}
                  className="mt-5 max-w-xl text-sm leading-7 text-slate-500 sm:text-base"
                >
                  We're working on something exciting to make
                  planning your events easier, smarter, and more
                  memorable. From celebrations to special
                  occasions, your perfect event experience is on
                  the way.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.5,
                  }}
                  className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3"
                >
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#4bb3a0]/40 hover:bg-[#4bb3a0]/5">
                    <CalendarDays
                      size={21}
                      className="text-[#4bb3a0]"
                    />

                    <p className="mt-3 text-sm font-bold text-[#0d222c]">
                      Easy Planning
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      Plan your event with ease.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#cf9d4b]/40 hover:bg-[#cf9d4b]/5">
                    <Sparkles
                      size={21}
                      className="text-[#cf9d4b]"
                    />

                    <p className="mt-3 text-sm font-bold text-[#0d222c]">
                      Smart Ideas
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      Create memorable experiences.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#4bb3a0]/40 hover:bg-[#4bb3a0]/5">
                    <PartyPopper
                      size={21}
                      className="text-[#4bb3a0]"
                    />

                    <p className="mt-3 text-sm font-bold text-[#0d222c]">
                      Great Events
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      Celebrate without the stress.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.6,
                  }}
                  className="mt-8"
                >
                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0d222c] px-6 text-sm font-bold text-white shadow-lg shadow-[#0d222c]/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#163542] hover:shadow-xl sm:w-auto"
                  >
                    <ArrowLeft
                      size={17}
                      className="transition-transform duration-300 group-hover:-translate-x-1"
                    />
                    Back to Home
                  </button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.8,
                  }}
                  className="mt-7 flex items-center gap-2 text-xs text-slate-400"
                >
                  <div className="h-2 w-2 animate-pulse rounded-full bg-[#4bb3a0]" />
                  We're building this feature for you.
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
};

export default Event;