import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const THEME_KEY = "theme";

const getInitialTheme = () => {
  if (typeof window === "undefined") {
    return "dark";
  }

  const savedTheme = localStorage.getItem(THEME_KEY);

  if (savedTheme === "dark" || savedTheme === "light") {
    return savedTheme;
  }

  // First visit always starts in dark mode.
  return "dark";
};

const applyTheme = (theme) => {
  const root = document.documentElement;

  root.classList.toggle("dark", theme === "dark");
  root.setAttribute("data-theme", theme);
};

const ThemeToggle = () => {
  const [theme, setTheme] = useState(getInitialTheme);

  const isDark = theme === "dark";

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === "dark" ? "light" : "dark",
    );
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        isDark
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
      aria-pressed={isDark}
      title={
        isDark
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
      className={`
        fixed
        left-3
        bottom-3
        z-[200]

        flex
        h-10
        min-w-[94px]
        items-center
        justify-center
        gap-2

        rounded-lg
        border

        px-3.5

        text-[11px]
        font-semibold
        tracking-wide

        transition-all
        duration-300
        ease-out

        active:scale-[0.97]

        sm:left-[18px]
        sm:bottom-[18px]
        sm:h-[42px]
        sm:min-w-[102px]

        lg:h-11
        lg:min-w-[108px]

        ${
          isDark
            ? `
              border-slate-700/90
              bg-slate-900
              text-blue-400

              shadow-md
              shadow-black/25

              hover:border-blue-500
              hover:bg-blue-600
              hover:text-white
              hover:shadow-lg
              hover:shadow-blue-500/25
            `
            : `
              border-gray-200
              bg-white
              text-red-500

              shadow-md
              shadow-gray-900/10

              hover:border-red-400
              hover:bg-red-500
              hover:text-white
              hover:shadow-lg
              hover:shadow-red-500/25
            `
        }
      `}
    >
      {/* Theme icon */}
      <span
        className={`
          flex
          h-6
          w-6
          shrink-0
          items-center
          justify-center

          transition-all
          duration-300
          ease-out

          ${
            isDark
              ? "rotate-0 scale-100"
              : "rotate-[90deg] scale-100"
          }
        `}
      >
        {isDark ? (
          <Moon
            size={18}
            strokeWidth={2.3}
            className="
              transition-all
              duration-300
            "
          />
        ) : (
          <Sun
            size={18}
            strokeWidth={2.3}
            className="
              transition-all
              duration-300
            "
          />
        )}
      </span>

      {/* State */}
      <span
        className="
          leading-none
          whitespace-nowrap
        "
      >
        {isDark ? "ON" : "OFF"}
      </span>
    </button>
  );
};

export default ThemeToggle;