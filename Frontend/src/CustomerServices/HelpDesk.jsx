import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Headphones,
  Mail,
  MessageCircle,
  Clock3,
  Send,
  Paperclip,
  ChevronDown,
  CircleHelp,
  ShieldCheck,
  Zap,
  X,
  AlertCircle,
} from "lucide-react";
import { createSupportRequest } from "../Services/AuthAPI";
import Navbar from "../Components/Layout/Navbar";

const categories = [
  "Login Problem",
  "Registration Problem",
  "OTP / Verification",
  "Tour Planning",
  "Birthday Planning",
  "Profile Problem",
  "Notification Problem",
  "Website Error",
  "Other",
];

const priorities = ["Low", "Normal", "High", "Urgent"];

const initialForm = {
  name: "",
  email: "",
  category: "",
  priority: "Normal",
  subject: "",
  message: "",
};

const initialErrors = {
  name: "",
  email: "",
  category: "",
  subject: "",
  message: "",
  file: "",
};

const fieldStyle =
  "helpdesk-field w-full rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 outline-none ring-0 transition-colors duration-300 ease-in-out hover:border-indigo-400 hover:bg-[#eef0ff] focus:border-indigo-500 focus:bg-[#eef0ff] focus:outline-none focus:ring-0 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-100 dark:hover:border-emerald-400/60 dark:hover:bg-emerald-400/5 dark:focus:border-emerald-400 dark:focus:bg-emerald-400/5";

const errorFieldStyle =
  "border-red-400 bg-red-50 hover:border-red-500 hover:bg-red-50 focus:border-red-500 focus:bg-red-50 dark:border-red-500/70 dark:bg-red-500/5 dark:hover:border-red-400 dark:hover:bg-red-500/10 dark:focus:border-red-400 dark:focus:bg-red-500/10";

const Helpdesk = () => {
  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [errors, setErrors] = useState(initialErrors);

  const categoryRef = useRef(null);
  const priorityRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        !categoryRef.current?.contains(event.target) &&
        !priorityRef.current?.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const clearFieldError = (field) => {
    setErrors((previous) => ({
      ...previous,
      [field]: "",
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    clearFieldError(name);
  };

  const handleDropdownChange = (name, value) => {
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    clearFieldError(name);
    setOpenDropdown(null);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    if (selectedFile.size > 5 * 1024 * 1024) {
      setErrors((previous) => ({
        ...previous,
        file: "File size must be less than 5MB.",
      }));

      event.target.value = "";
      return;
    }

    setErrors((previous) => ({
      ...previous,
      file: "",
    }));

    setFile(selectedFile);
  };

  const removeFile = () => {
    setFile(null);

    setErrors((previous) => ({
      ...previous,
      file: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {
      ...initialErrors,
    };

    const trimmedName = form.name.trim();
    const trimmedEmail = form.email.trim();
    const trimmedSubject = form.subject.trim();
    const trimmedMessage = form.message.trim();

    if (!trimmedName) {
      newErrors.name = "Please enter your name.";
    } else if (trimmedName.length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    }

    if (!trimmedEmail) {
      newErrors.email = "Please enter your email address.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(trimmedEmail)) {
        newErrors.email = "Please enter a valid email address.";
      }
    }

    if (!form.category) {
      newErrors.category = "Please select a problem category.";
    }

    if (!trimmedSubject) {
      newErrors.subject = "Please enter a subject.";
    } else if (trimmedSubject.length < 3) {
      newErrors.subject = "Subject must be at least 3 characters.";
    }

    if (!trimmedMessage) {
      newErrors.message = "Please describe your problem.";
    } else if (trimmedMessage.length < 10) {
      newErrors.message =
        "Please describe your problem in at least 10 characters.";
    }

    setErrors(newErrors);

    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    try {
      setLoading(true);

      await createSupportRequest({
        name: form.name.trim(),
        email: form.email.trim(),
        category: form.category,
        priority: form.priority,
        subject: form.subject.trim(),
        message: form.message.trim(),
      });

      toast.success(
        "Your support request has been submitted successfully.",
      );

      setForm(initialForm);
      setFile(null);
      setErrors(initialErrors);
      setOpenDropdown(null);
    } catch (error) {
      console.error("SUPPORT REQUEST ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to submit your support request.",
      );
    } finally {
      setLoading(false);
    }
  };

  const renderError = (message) => {
    if (!message) return null;

    return (
      <motion.p
        initial={{ opacity: 0, y: -3 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-500 dark:text-red-400"
      >
        <AlertCircle size={13} className="shrink-0" />
        {message}
      </motion.p>
    );
  };

  const renderDropdown = (
    name,
    options,
    placeholder,
    dropdownRef,
  ) => {
    const isOpen = openDropdown === name;
    const selectedValue = form[name];

    return (
      <div ref={dropdownRef} className="relative">
        <button
          type="button"
          onClick={() =>
            setOpenDropdown(isOpen ? null : name)
          }
          className={`${fieldStyle} ${
            errors[name] ? errorFieldStyle : ""
          } flex h-12 items-center justify-between px-4 text-left ${
            isOpen
              ? "border-indigo-500 bg-[#eef0ff] dark:border-emerald-400 dark:bg-emerald-400/5"
              : ""
          }`}
        >
          <span
            className={
              selectedValue
                ? "text-slate-800 dark:text-slate-100"
                : "text-slate-400 dark:text-slate-500"
            }
          >
            {selectedValue || placeholder}
          </span>

          <ChevronDown
            size={18}
            className={`shrink-0 transition-transform duration-300 ${
              isOpen
                ? "rotate-180 text-indigo-500 dark:text-emerald-400"
                : "text-slate-400 dark:text-slate-500"
            }`}
          />
        </button>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
            }}
            className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-xl border border-indigo-100 bg-white shadow-xl shadow-indigo-500/10 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/20"
          >
            <div className="helpdesk-scrollbar max-h-52 overflow-y-auto p-1.5">
              {options.map((option) => {
                const isSelected = selectedValue === option;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() =>
                      handleDropdownChange(name, option)
                    }
                    className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition-all duration-200 ${
                      isSelected
                        ? "bg-indigo-100 font-semibold text-indigo-600 dark:bg-emerald-400/10 dark:text-emerald-400"
                        : "text-slate-700 hover:bg-[#eef0ff] hover:pl-4 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-emerald-400/5 dark:hover:text-emerald-400"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <>
      <Navbar />

      <style>{`
        .helpdesk-field,
        .helpdesk-field:hover,
        .helpdesk-field:focus,
        .helpdesk-field:active,
        .helpdesk-field:focus-visible {
          outline: none !important;
          box-shadow: none !important;
        }

        .helpdesk-field:focus {
          border-color: #6366f1 !important;
        }

        .helpdesk-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #a5b4fc #f8f9ff;
        }

        .helpdesk-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .helpdesk-scrollbar::-webkit-scrollbar-track {
          background: #f8f9ff;
          border-radius: 999px;
        }

        .helpdesk-scrollbar::-webkit-scrollbar-thumb {
          background: #a5b4fc;
          border-radius: 999px;
        }

        .helpdesk-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6366f1;
        }

        .helpdesk-scrollbar::-webkit-scrollbar-button {
          display: none;
          width: 0;
          height: 0;
        }

        .dark .helpdesk-field:focus {
          border-color: #34d399 !important;
        }

        .dark .helpdesk-scrollbar {
          scrollbar-color: #34d399 #1e293b;
        }

        .dark .helpdesk-scrollbar::-webkit-scrollbar-track {
          background: #1e293b;
        }

        .dark .helpdesk-scrollbar::-webkit-scrollbar-thumb {
          background: #34d399;
        }

        .dark .helpdesk-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6ee7b7;
        }
      `}</style>

      <main className="min-h-screen bg-[#f4f6fa] text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-8 text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600 transition-colors duration-300 dark:bg-emerald-400/10 dark:text-emerald-400">
              <Headphones size={17} />
              24/7 Helpdesk Support
            </div>

            <h1 className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-4xl lg:text-5xl dark:from-emerald-300 dark:via-emerald-400 dark:to-teal-300">
              How Can We Help You?
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500 transition-colors duration-300 sm:text-base dark:text-slate-400">
              Facing a problem while using Service Planner?
              Tell us what happened and our support team will
              help you.
            </p>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden rounded-3xl bg-[#0d222c] p-6 text-white shadow-xl transition-all duration-300 sm:p-8 dark:border dark:border-slate-800"
            >
              <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-indigo-500/10 dark:bg-emerald-400/10" />

              <div className="absolute -bottom-24 -left-20 h-60 w-60 rounded-full bg-cyan-400/10 dark:bg-emerald-400/10" />

              <div className="relative z-10">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                  <Headphones size={28} />
                </div>

                <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-cyan-300 dark:text-emerald-300">
                  We're Here For You
                </p>

                <h2 className="text-2xl font-bold leading-tight sm:text-3xl">
                  Need help with Service Planner?
                </h2>

                <p className="mt-4 text-sm leading-7 text-slate-300">
                  Whether you have trouble logging in,
                  creating a plan, updating your profile, or
                  using any feature, send us the details and
                  we'll help you resolve it.
                </p>

                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/20 hover:bg-white/10">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                      <Clock3 size={20} />
                    </div>

                    <div>
                      <p className="font-semibold">
                        24/7 Support
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        We're available whenever you need help.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/20 hover:bg-white/10">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                      <Mail size={20} />
                    </div>

                    <div>
                      <p className="font-semibold">
                        Support Requests
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Describe your issue clearly for faster
                        assistance.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/20 hover:bg-white/10">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                      <ShieldCheck size={20} />
                    </div>

                    <div>
                      <p className="font-semibold">
                        Safe & Secure
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Your support information is handled
                        carefully.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5 transition-all duration-300 hover:border-cyan-300/20 hover:bg-white/10">
                  <div className="flex gap-3">
                    <CircleHelp
                      size={20}
                      className="mt-0.5 shrink-0 text-cyan-300 dark:text-emerald-300"
                    />

                    <div>
                      <p className="font-semibold">
                        Before submitting
                      </p>

                      <p className="mt-1 text-xs leading-6 text-slate-400">
                        Please provide enough information about
                        your problem so it can be understood
                        easily.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-500 hover:shadow-xl hover:shadow-indigo-500/5 sm:p-8 dark:border-slate-700/70 dark:bg-slate-900/70 dark:hover:border-emerald-400/20 dark:hover:shadow-black/20"
            >
              <div className="mb-7">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-all duration-300 hover:scale-105 hover:bg-indigo-100 dark:bg-emerald-400/10 dark:text-emerald-400 dark:hover:bg-emerald-400/15">
                    <MessageCircle size={21} />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      Submit a Support Request
                    </h2>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Fields marked with * are required.
                    </p>
                  </div>
                </div>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Your Name{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      className={`${fieldStyle} ${
                        errors.name ? errorFieldStyle : ""
                      } h-12 px-4 placeholder:text-slate-400 dark:placeholder:text-slate-500`}
                    />

                    {renderError(errors.name)}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Email Address{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className={`${fieldStyle} ${
                        errors.email ? errorFieldStyle : ""
                      } h-12 px-4 placeholder:text-slate-400 dark:placeholder:text-slate-500`}
                    />

                    {renderError(errors.email)}
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Problem Category{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    {renderDropdown(
                      "category",
                      categories,
                      "Select problem category",
                      categoryRef,
                    )}

                    {renderError(errors.category)}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Priority
                    </label>

                    {renderDropdown(
                      "priority",
                      priorities,
                      "Select priority",
                      priorityRef,
                    )}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Subject{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="Briefly describe your problem"
                    autoComplete="off"
                    className={`${fieldStyle} ${
                      errors.subject ? errorFieldStyle : ""
                    } h-12 px-4 placeholder:text-slate-400 dark:placeholder:text-slate-500`}
                  />

                  {renderError(errors.subject)}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Describe Your Problem{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={6}
                    placeholder="Tell us what happened, what you were trying to do, and what problem you faced..."
                    autoComplete="off"
                    className={`${fieldStyle} ${
                      errors.message ? errorFieldStyle : ""
                    } resize-none px-4 py-3 leading-6 placeholder:text-slate-400 dark:placeholder:text-slate-500`}
                  />

                  {renderError(errors.message)}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Attachment{" "}
                    <span className="font-normal text-slate-400 dark:text-slate-500">
                      (Optional)
                    </span>
                  </label>

                  {!file ? (
                    <label
                      className={`${fieldStyle} ${
                        errors.file ? errorFieldStyle : ""
                      } group flex min-h-24 cursor-pointer flex-col items-center justify-center border-2 border-dashed px-4 py-5 text-center`}
                    >
                      <Paperclip
                        size={22}
                        className="mb-2 text-slate-400 transition-all duration-300 group-hover:scale-110 group-hover:text-indigo-500 dark:text-slate-500 dark:group-hover:text-emerald-400"
                      />

                      <span className="text-sm font-medium text-slate-600 transition-colors duration-300 group-hover:text-indigo-600 dark:text-slate-300 dark:group-hover:text-emerald-400">
                        Click to attach a file
                      </span>

                      <span className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                        Maximum file size: 5MB
                      </span>

                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div
                      className={`${fieldStyle} flex items-center justify-between gap-3 px-4 py-3`}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-emerald-400">
                          <Paperclip size={18} />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-700 dark:text-slate-200">
                            {file.name}
                          </p>

                          <p className="text-xs text-slate-400 dark:text-slate-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={removeFile}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-all duration-300 hover:bg-white hover:text-red-500 hover:shadow-sm dark:hover:bg-slate-800"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  )}

                  {renderError(errors.file)}
                </div>

                <div
                  className={`${fieldStyle} cursor-default px-4 py-3`}
                >
                  <div className="flex gap-3">
                    <Zap
                      size={18}
                      className="mt-0.5 shrink-0 text-indigo-500 dark:text-emerald-400"
                    />

                    <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
                      Please avoid sharing passwords, OTPs, or
                      other sensitive information in your support
                      message.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl active:translate-y-0 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-emerald-500 dark:text-slate-950 dark:shadow-emerald-500/10 dark:hover:bg-emerald-400"
                >
                  {loading ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-slate-950/30 dark:border-t-slate-950" />
                      Submitting Request...
                    </>
                  ) : (
                    <>
                      <Send
                        size={18}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                      Submit Support Request
                    </>
                  )}
                </button>
              </form>
            </motion.section>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.15,
            }}
            className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition-all duration-300 hover:border-indigo-100 hover:shadow-md dark:border-slate-700/70 dark:bg-slate-900/70 dark:hover:border-emerald-400/20 dark:hover:shadow-black/20"
          >
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Can't find the right category?
            </p>

            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              Select{" "}
              <span className="font-semibold text-slate-500 dark:text-slate-400">
                Other
              </span>{" "}
              and explain your issue in the message.
            </p>
          </motion.div>
        </div>
      </main>
    </>
  );
};

export default Helpdesk;