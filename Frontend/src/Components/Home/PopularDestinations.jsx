import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PopularDestinations = () => {
  const navigate = useNavigate();

  const places = [
    {
      name: "Goa",
      img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2",
    },
    {
      name: "Rishikesh",
      img: "https://images.unsplash.com/photo-1720819029162-8500607ae232?w=500&auto=format&fit=crop&q=60",
    },
    {
      name: "Manali",
      img: "https://media.istockphoto.com/id/2094457027/photo/ayder-plateau-in-camlihemsin-rize-ayder-plateau-is-a-famous-plateau-with-wooden-chalets.jpg?s=612x612&w=0&k=20&c=UFF1SALKk5R0Gi5XtsftJ4N1IHwDuhfQSGjYrJ5btww=",
    },
  ];

  const handleDestinationClick = (destination) => {
    navigate("/tour", {
      state: {
        destination,
      },
    });
  };

  return (
   <section className="relative overflow-hidden bg-[#F4F6FA] pt-16 sm:pt-20 lg:pt-24">
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-indigo-300/10 blur-3xl" />

      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-pink-300/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-2 text-sm font-bold text-indigo-600">
            <MapPin size={16} />
            Explore Places
          </span>

          <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Popular Destinations
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base lg:text-lg">
            Explore popular destinations and start planning your next
            unforgettable trip.
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {places.map((place, index) => (
            <motion.div
              key={place.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.7,
                delay: index * 0.12,
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
              onClick={() => handleDestinationClick(place.name)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handleDestinationClick(place.name);
                }
              }}
              role="button"
              tabIndex={0}
              className="group relative h-[360px] cursor-pointer overflow-hidden rounded-[2rem] bg-white shadow-lg outline-none transition-shadow duration-500 hover:shadow-2xl focus:ring-2 focus:ring-indigo-500 focus:ring-offset-4 sm:h-[400px] lg:h-[430px]"
            >
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={place.img}
                  alt={place.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-all duration-700 group-hover:from-black/90 group-hover:via-black/30" />
              </div>

              <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/10 blur-3xl transition-all duration-700 group-hover:scale-125" />

              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 lg:p-7">
                <div className="flex items-end justify-between gap-4">
                  <div className="min-w-0">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">
                        Explore
                      </span>

                      <span className="h-1 w-1 rounded-full bg-white/50" />

                      <MapPin
                        size={13}
                        className="text-white/70"
                      />
                    </div>

                    <h3 className="text-3xl font-black text-white sm:text-4xl">
                      {place.name}
                    </h3>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, x: 15 }}
                    whileHover={{ x: 0 }}
                    className="flex h-11 w-11 shrink-0 translate-x-3 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white opacity-0 backdrop-blur-md transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100"
                  >
                    <ArrowRight size={20} />
                  </motion.div>
                </div>

                <div className="grid transition-all duration-500 ease-out grid-rows-[0fr] opacity-0 group-hover:grid-rows-[1fr] group-hover:opacity-100">
                  <div className="overflow-hidden">
                    <p className="mt-3 text-sm font-medium text-white/80 sm:text-base">
                      Click to create your personalized trip
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-8 text-center text-sm font-medium text-slate-400"
        >
          Choose a destination to start creating your personalized plan
        </motion.p>
      </div>
    </section>
  );
};

export default PopularDestinations;