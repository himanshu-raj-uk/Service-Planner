import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { destinations } from "../../Data/DestinationData";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=90";

const AUTO_SPEED = 0.36;
const HOVER_FACTOR = 0.35;
const EASE = 7;
const DRAG_START_PX = 6;
const MAX_VELOCITY = 8;

const TOP = 16;
const HI_RES_WIDTH = 1200;

const CONFIGS = {
  mobile: {
    w: 120,
    h: 172,
    gap: 14,
    drop: 38,
    scaleLoss: 0.16,
    dimMax: 0.4,
  },
  tablet: {
    w: 190,
    h: 265,
    gap: 22,
    drop: 70,
    scaleLoss: 0.18,
    dimMax: 0.42,
  },
  desktop: {
    w: 240,
    h: 330,
    gap: 28,
    drop: 100,
    scaleLoss: 0.2,
    dimMax: 0.45,
  },
  wide: {
    w: 260,
    h: 355,
    gap: 32,
    drop: 120,
    scaleLoss: 0.2,
    dimMax: 0.45,
  },
};

const getConfigName = (width) => {
  if (width >= 1280) return "wide";
  if (width >= 1024) return "desktop";
  if (width >= 640) return "tablet";
  return "mobile";
};

const toHiRes = (url) => {
  if (!url || typeof url !== "string") return url;
  if (!url.includes("images.unsplash.com")) return url;

  try {
    const parsed = new URL(url);
    const currentWidth =
      Number(parsed.searchParams.get("w")) || 0;

    if (currentWidth < HI_RES_WIDTH) {
      parsed.searchParams.set(
        "w",
        String(HI_RES_WIDTH)
      );
    }

    parsed.searchParams.set("q", "90");
    parsed.searchParams.set("auto", "format");
    parsed.searchParams.set("fit", "crop");

    return parsed.toString();
  } catch {
    return url;
  }
};

const DestinationCard = ({
  place,
  config,
  registerRef,
  onSelect,
}) => {
  const imgRef = useRef(null);

  const sources = useMemo(() => {
    const list = [
      toHiRes(place.img),
      place.img,
      FALLBACK_IMAGE,
    ].filter(Boolean);

    return list.filter(
      (item, index) =>
        list.indexOf(item) === index
    );
  }, [place.img]);

  const [srcIndex, setSrcIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const src = sources[srcIndex];

  useEffect(() => {
    const img = imgRef.current;

    if (
      img &&
      img.complete &&
      img.naturalWidth > 0
    ) {
      setLoaded(true);
    }
  }, [src]);

  const handleLoad = () => {
    setLoaded(true);
    setFailed(false);
  };

  const handleError = () => {
    setLoaded(false);

    if (srcIndex < sources.length - 1) {
      setSrcIndex(
        (previous) => previous + 1
      );
      return;
    }

    setFailed(true);
  };

  const showSpinner =
    !loaded && !failed;

  return (
    <button
      ref={registerRef}
      type="button"
      onClick={() => onSelect(place)}
      aria-label={`Plan a trip to ${place.name}`}
      style={{
        position: "absolute",
        top: TOP,
        left: "50%",
        width: config.w,
        height: config.h,
        marginLeft: -config.w / 2,
        willChange: "transform",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        outline: "1px solid transparent",
        visibility: "hidden",
      }}
      className="
        group
        cursor-pointer
        overflow-hidden
        rounded-2xl
        border
        border-white/80
        bg-slate-200
        text-left
        shadow-none
        outline-none
        transition-[border-color,box-shadow]
        duration-300
        ease-out
        hover:border-blue-500
        hover:shadow-[0_0_0_1px_rgba(59,130,246,0.35)]
        focus-visible:ring-2
        focus-visible:ring-indigo-500
        sm:rounded-3xl
        dark:border-blue-400/40
        dark:bg-slate-800
        dark:shadow-none
        dark:hover:border-blue-400
        dark:hover:shadow-[0_0_0_1px_rgba(96,165,250,0.45)]
      "
    >
      <div
        aria-hidden="true"
        className={`
          absolute
          inset-0
          z-[1]
          flex
          items-center
          justify-center
          bg-slate-200
          transition-opacity
          duration-300
          ease-out
          dark:bg-slate-800
          ${loaded
            ? "pointer-events-none opacity-0"
            : "opacity-100"
          }
        `}
      >
        {showSpinner && (
          <span
            className="
              h-8
              w-8
              animate-spin
              rounded-full
              border-[3px]
              border-slate-300
              border-t-indigo-600
              sm:h-9
              sm:w-9
              sm:border-4
              dark:border-slate-600
              dark:border-t-blue-400
            "
          />
        )}

        {failed && (
          <MapPin className="h-8 w-8 text-slate-400 dark:text-slate-500" />
        )}
      </div>

      {!failed && (
        <img
          ref={imgRef}
          key={src}
          src={src}
          alt={place.name}
          loading="eager"
          decoding="async"
          draggable="false"
          onLoad={handleLoad}
          onError={handleError}
          className={`
            absolute
            inset-0
            h-full
            w-full
            select-none
            object-cover
            transition-opacity
            duration-300
            ease-out
            ${loaded
              ? "opacity-100"
              : "opacity-0"
            }
          `}
        />
      )}

      <div
        className="
          absolute
          inset-0
          z-[2]
          bg-gradient-to-t
          from-black/80
          via-black/15
          to-transparent
        "
      />

      <div
        aria-hidden="true"
        data-dim="true"
        className="
          pointer-events-none
          absolute
          inset-0
          z-[3]
          bg-slate-950
        "
        style={{
          opacity: 0,
          willChange: "opacity",
        }}
      />

      <div
        className="
          absolute
          inset-x-0
          bottom-0
          z-[4]
          p-3
          sm:p-5
        "
      >
        <div
          className="
            mb-0.5
            flex
            items-center
            gap-1
            text-[10px]
            font-medium
            text-white/75
            sm:mb-1
            sm:gap-1.5
            sm:text-xs
          "
        >
          <MapPin className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
          <span>India</span>
        </div>

        <h3
          className="
            truncate
            text-[13px]
            font-bold
            tracking-tight
            text-white
            sm:text-lg
            lg:text-xl
          "
        >
          {place.name}
        </h3>
      </div>
    </button>
  );
};

const PopularDestinations = () => {
  const navigate = useNavigate();

  const stageRef = useRef(null);
  const cardRefs = useRef([]);

  const posRef = useRef(0);
  const velRef = useRef(AUTO_SPEED);
  const hoverRef = useRef(false);
  const draggingRef = useRef(false);
  const reduceRef = useRef(false);
  const inViewRef = useRef(true);
  const dragRef = useRef(null);
  const suppressClickRef = useRef(false);

  const dimsRef = useRef(null);
  const countRef = useRef(0);

  const [stageW, setStageW] = useState(() =>
    typeof window === "undefined"
      ? 1280
      : window.innerWidth
  );

  const configName = getConfigName(stageW);
  const config = CONFIGS[configName];

  const spacing =
    config.w + config.gap;

  const halfW = stageW / 2;
  const total = destinations.length;

  const items = useMemo(() => {
    if (!total) return [];

    const minCount =
      Math.ceil(
        (stageW + 4 * config.w) /
        spacing
      ) + 2;

    const reps = Math.max(
      1,
      Math.ceil(
        minCount / total
      )
    );

    return Array.from(
      {
        length:
          total * reps,
      },
      (_, i) =>
        destinations[
        i % total
        ]
    );
  }, [
    total,
    stageW,
    config.w,
    spacing,
  ]);

  dimsRef.current = {
    cfg: config,
    halfW,
    spacing,
  };

  countRef.current =
    items.length;

  const stageHeight = useMemo(() => {
    const edgeScale =
      1 - config.scaleLoss;

    const tilt = Math.atan(
      (2 * config.drop) /
      halfW
    );

    const extent =
      ((config.h * edgeScale) /
        2) *
      Math.cos(tilt) +
      ((config.w * edgeScale) /
        2) *
      Math.sin(tilt);

    return Math.ceil(
      TOP +
      config.h / 2 +
      config.drop +
      extent +
      18
    );
  }, [
    config,
    halfW,
  ]);

  useEffect(() => {
    const el =
      stageRef.current;

    if (
      !el ||
      typeof ResizeObserver ===
      "undefined"
    ) {
      return undefined;
    }

    const observer =
      new ResizeObserver(
        (entries) => {
          const width =
            Math.round(
              entries[0]
                .contentRect
                .width
            );

          if (width > 0) {
            setStageW(width);
          }
        }
      );

    observer.observe(el);

    return () =>
      observer.disconnect();
  }, []);

  useEffect(() => {
    const query =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      );

    reduceRef.current =
      query.matches;

    const handleChange = (
      event
    ) => {
      reduceRef.current =
        event.matches;
    };

    query.addEventListener?.(
      "change",
      handleChange
    );

    return () =>
      query.removeEventListener?.(
        "change",
        handleChange
      );
  }, []);

  useEffect(() => {
    const el =
      stageRef.current;

    if (
      !el ||
      typeof IntersectionObserver ===
      "undefined"
    ) {
      return undefined;
    }

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          inViewRef.current =
            entry.isIntersecting;
        },
        {
          rootMargin: "200px",
        }
      );

    observer.observe(el);

    return () =>
      observer.disconnect();
  }, []);

  const render =
    useCallback(() => {
      const dims =
        dimsRef.current;

      const n =
        countRef.current;

      if (!dims || !n) return;

      const {
        cfg,
        halfW: hw,
        spacing: gapX,
      } = dims;

      const els =
        cardRefs.current;

      const pos =
        posRef.current;

      const slope =
        (2 * cfg.drop) /
        hw;

      const cullDistance =
        hw + cfg.w * 1.6;

      for (
        let i = 0;
        i < n;
        i += 1
      ) {
        const el = els[i];

        if (!el) continue;

        let offset =
          (((i - pos) % n) +
            n) %
          n;

        if (
          offset >= n / 2
        ) {
          offset -= n;
        }

        const x =
          offset * gapX;

        if (
          Math.abs(x) >
          cullDistance
        ) {
          if (
            el.dataset.hidden !==
            "1"
          ) {
            el.style.visibility =
              "hidden";

            el.dataset.hidden =
              "1";
          }

          continue;
        }

        if (
          el.dataset.hidden !==
          "0"
        ) {
          el.style.visibility =
            "visible";

          el.dataset.hidden =
            "0";
        }

        const nx =
          x / hw;

        const nx2 =
          nx * nx;

        const y =
          cfg.drop * nx2;

        const rotate =
          (Math.atan(
            slope * nx
          ) *
            180) /
          Math.PI;

        const scale =
          Math.max(
            0.72,
            1 -
            cfg.scaleLoss *
            nx2
          );

        el.style.transform = `
          translate3d(
            ${x.toFixed(2)}px,
            ${y.toFixed(2)}px,
            0
          )
          rotate(${rotate.toFixed(
          3
        )}deg)
          scale(${scale.toFixed(
          4
        )})
        `;

        const z =
          100 -
          Math.round(
            Math.min(
              Math.abs(nx),
              1.5
            ) * 60
          );

        if (el._z !== z) {
          el._z = z;
          el.style.zIndex =
            String(z);
        }

        const dim =
          Math.round(
            Math.min(
              cfg.dimMax *
              nx2,
              0.6
            ) * 200
          ) / 200;

        if (
          el._dimValue !== dim
        ) {
          el._dimValue =
            dim;

          if (!el._dimEl) {
            el._dimEl =
              el.querySelector(
                "[data-dim]"
              );
          }

          if (el._dimEl) {
            el._dimEl.style.opacity =
              String(dim);
          }
        }
      }
    }, []);

  useLayoutEffect(() => {
    render();
  }, [
    render,
    items.length,
    stageW,
    configName,
  ]);

  useEffect(() => {
    let raf = 0;
    let last =
      performance.now();

    const tick = (now) => {
      const dt =
        Math.min(
          (now - last) /
          1000,
          0.05
        );

      last = now;

      if (inViewRef.current) {
        if (
          !draggingRef.current
        ) {
          let target =
            AUTO_SPEED;

          if (
            reduceRef.current
          ) {
            target = 0;
          } else if (
            hoverRef.current
          ) {
            target =
              AUTO_SPEED *
              HOVER_FACTOR;
          }

          const smoothing =
            1 -
            Math.exp(
              -EASE * dt
            );

          velRef.current +=
            (target -
              velRef.current) *
            smoothing;

          posRef.current +=
            velRef.current *
            dt;
        }

        render();
      }

      raf =
        requestAnimationFrame(
          tick
        );
    };

    raf =
      requestAnimationFrame(
        tick
      );

    return () =>
      cancelAnimationFrame(
        raf
      );
  }, [render]);

  const handlePointerDown = (
    event
  ) => {
    if (
      event.pointerType ===
      "mouse" &&
      event.button !== 0
    ) {
      return;
    }

    dragRef.current = {
      id: event.pointerId,
      startX: event.clientX,
      startPos:
        posRef.current,
      lastX: event.clientX,
      lastT:
        performance.now(),
      moved: false,
    };
  };

  const handlePointerMove = (
    event
  ) => {
    const drag =
      dragRef.current;

    if (
      !drag ||
      drag.id !==
      event.pointerId
    ) {
      return;
    }

    const dx =
      event.clientX -
      drag.startX;

    if (!drag.moved) {
      if (
        Math.abs(dx) <
        DRAG_START_PX
      ) {
        return;
      }

      drag.moved = true;

      draggingRef.current =
        true;

      stageRef.current?.setPointerCapture?.(
        event.pointerId
      );
    }

    const gapX =
      dimsRef.current.spacing;

    posRef.current =
      drag.startPos -
      dx / gapX;

    const now =
      performance.now();

    const dt =
      (now - drag.lastT) /
      1000;

    if (dt > 0) {
      const instant =
        -(
          (event.clientX -
            drag.lastX) /
          gapX
        ) / dt;

      const blended =
        velRef.current *
        0.6 +
        instant * 0.4;

      velRef.current =
        Math.max(
          -MAX_VELOCITY,
          Math.min(
            MAX_VELOCITY,
            blended
          )
        );
    }

    drag.lastX =
      event.clientX;

    drag.lastT = now;
  };

  const endDrag = (
    event
  ) => {
    const drag =
      dragRef.current;

    if (
      !drag ||
      drag.id !==
      event.pointerId
    ) {
      return;
    }

    if (drag.moved) {
      suppressClickRef.current =
        true;

      window.setTimeout(() => {
        suppressClickRef.current =
          false;
      }, 80);

      if (
        performance.now() -
        drag.lastT >
        80
      ) {
        velRef.current = 0;
      }
    }

    draggingRef.current =
      false;

    dragRef.current = null;

    stageRef.current?.releasePointerCapture?.(
      event.pointerId
    );
  };

  const handleKeyDown = (
    event
  ) => {
    if (
      event.key ===
      "ArrowRight"
    ) {
      event.preventDefault();

      velRef.current = 2.4;
    }

    if (
      event.key ===
      "ArrowLeft"
    ) {
      event.preventDefault();

      velRef.current = -2.4;
    }
  };

  const handleDestinationClick =
    (destination) => {
      if (
        suppressClickRef.current
      ) {
        return;
      }

      navigate("/tour", {
        state: {
          destination:
            destination.name,
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
        pb-4
        text-slate-900
        transition-colors
        duration-500
        sm:pb-6
        lg:pb-8
        dark:bg-[#0f172a]
        dark:text-slate-100
      "
    >
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
          backgroundSize:
            "48px 48px",
        }}
      />

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
        <div
          className="
            mx-auto
            max-w-7xl
            px-4
            sm:px-6
            lg:px-8
          "
        >
          <div
            className="
              flex
              flex-col
              items-center
              text-center
            "
          >
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
              Discover India's most loved
              destinations and find the perfect
              place for your next journey.
            </p>
          </div>
        </div>

        <div
          ref={stageRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="Popular destinations"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onPointerDown={
            handlePointerDown
          }
          onPointerMove={
            handlePointerMove
          }
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerEnter={(event) => {
            if (
              event.pointerType ===
              "mouse"
            ) {
              hoverRef.current =
                true;
            }
          }}
          onPointerLeave={(event) => {
            if (
              event.pointerType ===
              "mouse"
            ) {
              hoverRef.current =
                false;
            }
          }}
          style={{
            height: stageHeight,
            touchAction: "pan-y",
          }}
          className="
            relative
            mt-2
            w-full
            cursor-default
            select-none
            overflow-hidden
            outline-none
            sm:mt-4
          "
        >
          {items.map(
            (place, index) => (
              <DestinationCard
                key={`${place.name}-${index}`}
                place={place}
                config={config}
                registerRef={(el) => {
                  cardRefs.current[
                    index
                  ] = el;
                }}
                onSelect={
                  handleDestinationClick
                }
              />
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;