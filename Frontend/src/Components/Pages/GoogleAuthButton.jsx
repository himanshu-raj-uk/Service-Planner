import { useEffect, useRef, useState } from "react";

let googleInitialized = false;
let currentHandler = null;

const BUTTON_HEIGHT = 44;
const GOOGLE_HEIGHT = 40;

const LABELS = {
  signup_with: "Sign up with Google",
  signin_with: "Sign in with Google",
  continue_with: "Continue with Google",
  signin: "Sign in with Google",
};

const GoogleLogo = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
    />
    <path
      fill="#FBBC05"
      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
    />
  </svg>
);

const GoogleAuthButton = ({
  onCredential,
  text = "signup_with",
  disabled = false,
}) => {
  const wrapperRef = useRef(null);
  const googleRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    currentHandler = onCredential;

    return () => {
      if (currentHandler === onCredential) {
        currentHandler = null;
      }
    };
  }, [onCredential]);

  useEffect(() => {
    const element = wrapperRef.current;

    if (!element) return;

    const update = () => {
      setWidth(Math.round(element.getBoundingClientRect().width));
    };

    update();

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(update);
      observer.observe(element);

      return () => observer.disconnect();
    }

    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    if (!width) return;

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    let attempts = 0;
    let timer = null;

    const setup = () => {
      const google = window.google;

      if (!google?.accounts?.id || !googleRef.current) {
        if (attempts++ < 50) {
          timer = setTimeout(setup, 100);
        } else {
          console.error("Google Identity Services failed to load.");
        }

        return;
      }

      if (!googleInitialized) {
        google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            currentHandler?.(response);
          },
        });

        googleInitialized = true;
      }

      googleRef.current.innerHTML = "";

      google.accounts.id.renderButton(googleRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text,
        shape: "rectangular",
        width: Math.max(200, Math.min(400, width)),
      });
    };

    setup();

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [text, width]);

  const label = LABELS[text] || "Continue with Google";

  return (
    <div
      ref={wrapperRef}
      className="group relative w-full overflow-hidden rounded-xl"
      style={{ height: BUTTON_HEIGHT }}
    >
      <div
        aria-hidden="true"
        className={`
          flex
          h-full
          w-full
          items-center
          justify-center
          gap-2.5
          rounded-xl
          border
          border-slate-200
          bg-white/70
          px-5
          text-[13px]
          font-bold
          text-slate-700
          transition-colors
          duration-200
          group-hover:border-emerald-400
          group-hover:bg-emerald-50
          group-hover:text-emerald-700
          dark:border-slate-700
          dark:bg-slate-900/60
          dark:text-slate-200
          dark:group-hover:border-emerald-400
          dark:group-hover:bg-emerald-400/10
          dark:group-hover:text-emerald-300
          ${disabled ? "opacity-60" : ""}
        `}
      >
        <GoogleLogo />
        {label}
      </div>

      <div
        className={`absolute left-0 top-0 w-full cursor-pointer overflow-hidden opacity-[0.01] ${disabled ? "pointer-events-none" : ""
          }`}
        style={{
          height: GOOGLE_HEIGHT,
          transform: `scaleY(${BUTTON_HEIGHT / GOOGLE_HEIGHT})`,
          transformOrigin: "top",
        }}
      >
        <div ref={googleRef} />
      </div>
    </div>
  );
};

export default GoogleAuthButton;