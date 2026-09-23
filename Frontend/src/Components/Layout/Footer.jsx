import { MapPin, Phone, Mail, Send, ArrowUpRight } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";
import { Link } from "react-router-dom";

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

  return (
    <footer className="relative mt-12 overflow-hidden bg-slate-950 text-white sm:mt-16 lg:mt-20">
      <div className="pointer-events-none absolute -left-32 top-0 h-72 w-72 rounded-full bg-indigo-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-purple-600/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 lg:grid-cols-12 lg:gap-10">
          <div className="sm:col-span-2 lg:col-span-5">
             <Link
              to="/"
              onClick={closeMenu}
              className="group flex min-w-0 items-center"
            >
              <div className="flex h-[56px] w-auto min-w-0 max-w-[205px] items-center min-[360px]:h-[58px] min-[360px]:max-w-[220px] sm:h-[62px] sm:max-w-[245px] md:h-[66px] md:max-w-[270px] lg:h-[70px] lg:max-w-[290px] xl:h-[74px] xl:max-w-[315px] 2xl:h-[78px] 2xl:max-w-[340px]">
                <img
                  src="/Service-Planner/Service_Planner_Logo.png"
                  alt="Service Planner"
                  className="block h-full w-auto max-w-full object-contain object-left transition-transform duration-200 group-hover:scale-[1.01]"
                  draggable="false"
                  decoding="async"
                  fetchPriority="high"
                />
              </div>
            </Link>

            <p className="mt-5 max-w-lg text-sm leading-6 text-slate-400 sm:mt-6 sm:text-[15px] sm:leading-7">
              Service Planner is your all-in-one platform to plan travel,
              birthdays, weddings, corporate events, parties and memorable
              experiences with experience agents and members.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 sm:mt-7">
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-sm text-slate-400 transition duration-300 hover:-translate-y-1 hover:border-indigo-500 hover:bg-indigo-600 hover:text-white sm:h-11 sm:w-11"
              >
                <FaFacebookF />
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-sm text-slate-400 transition duration-300 hover:-translate-y-1 hover:border-pink-500 hover:bg-pink-600 hover:text-white sm:h-11 sm:w-11"
              >
                <FaInstagram />
              </a>

              <a
                href="#"
                aria-label="Twitter"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-sm text-slate-400 transition duration-300 hover:-translate-y-1 hover:border-sky-500 hover:bg-sky-500 hover:text-white sm:h-11 sm:w-11"
              >
                <FaTwitter />
              </a>

              <a
                href="#"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-sm text-slate-400 transition duration-300 hover:-translate-y-1 hover:border-blue-500 hover:bg-blue-600 hover:text-white sm:h-11 sm:w-11"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="mb-4 text-sm font-bold text-white sm:mb-5 sm:text-base">
              Planner Services
            </h3>

            <ul className="space-y-2.5 sm:space-y-3">
              {plannerServices.map((service) => (
                <li key={service.label}>
                  <Link
                    to={service.path}
                    className="group inline-flex items-center gap-1 text-sm text-slate-400 transition duration-300 hover:translate-x-1 hover:text-white"
                  >
                    {service.label}

                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition duration-300 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="mb-4 text-sm font-bold text-white sm:mb-5 sm:text-base">
              Company
            </h3>

            <ul className="space-y-2.5 sm:space-y-3">
              {companyLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className="group inline-flex items-center gap-1 text-sm text-slate-400 transition duration-300 hover:translate-x-1 hover:text-white"
                  >
                    {item.label}

                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition duration-300 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <h3 className="mb-4 text-sm font-bold text-white sm:mb-5 sm:text-base">
              Contact
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                  <MapPin size={17} />
                </div>

                <div className="pt-1">
                  <p className="text-xs text-slate-500">Location</p>
                  <p className="mt-0.5 text-sm text-slate-300">India</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Phone size={17} />
                </div>

                <div className="pt-1">
                  <p className="text-xs text-slate-500">Phone</p>
                  <p className="mt-0.5 text-sm text-slate-300">
                    +91 98765 43210
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Mail size={17} />
                </div>

                <div className="min-w-0 pt-1">
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="mt-0.5 break-all text-sm text-slate-300">
                    support@serviceplanner.com
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-7 sm:mt-8">
              <h4 className="mb-3 text-sm font-semibold text-white">
                Stay Updated
              </h4>

              <div className="flex w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900 transition focus-within:border-indigo-500">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="min-w-0 flex-1 bg-transparent px-3.5 py-3 text-xs text-white outline-none placeholder:text-slate-600 sm:px-4 sm:text-sm"
                />

                <button
                  type="button"
                  aria-label="Subscribe"
                  className="flex w-12 shrink-0 items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 transition duration-300 hover:from-indigo-500 hover:to-purple-500 sm:w-14"
                >
                  <Send size={17} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800/80 pt-6 sm:mt-12 sm:pt-7">
          <div className="flex flex-col gap-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <p className="text-xs leading-5 text-slate-500 sm:text-sm">
              © {new Date().getFullYear()} Service Planner. All Rights Reserved.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-500 sm:justify-end sm:text-sm">
              <Link to="/privacy" className="transition hover:text-white">
                Privacy
              </Link>

              <Link to="/terms" className="transition hover:text-white">
                Terms
              </Link>

              <Link to="/cookies" className="transition hover:text-white">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
