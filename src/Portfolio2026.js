import React from "react";
import * as THREE from "three";
import {
  Link,
  NavLink,
  Route,
  Switch,
  useHistory,
  useLocation
} from "react-router-dom";
import {
  capabilities,
  education,
  experiences,
  profile,
  technologies,
  visualProjects
} from "./portfolioData";
import {
  capabilitiesTr,
  educationTr,
  experiencesTr,
  profileTr,
  visualProjectsTr
} from "./portfolioData.tr";
import {
  getInitialLanguage,
  LANGUAGE_STORAGE_KEY,
  uiCopy
} from "./portfolioI18n";
import {trackEvent} from "./analytics";
import {createTechnologyScene} from "./technologyScene";
import "./Portfolio2026.scss";

const navigationItems = [
  {id: "home", href: "/", symbol: "~"},
  {id: "technologies", href: "/technologies", symbol: "<>"},
  {id: "projects", href: "/projects", symbol: "[]"},
  {id: "experience", href: "/experience", symbol: "::"},
  {id: "about", href: "/about", symbol: "@"},
  {id: "contact", href: "/contact", symbol: "#"}
];

export const THEME_STORAGE_KEY = "berkant-portfolio-theme";
export const HOME_INTRO_SESSION_KEY = "berkant-home-intro-seen";
export const HOME_INTRO_DURATION = 1760;

const themeOptions = [
  {id: "dark", labelKey: "warmDark", ariaKey: "warmDarkAria", symbol: "D"},
  {id: "light", labelKey: "paperLight", ariaKey: "paperLightAria", symbol: "L"},
  {id: "cyber", labelKey: "cyber", ariaKey: "cyberAria", symbol: "C"}
];

const themeColors = {
  dark: "#0c0b09",
  light: "#f3ecdc",
  cyber: "#02070b"
};

const experienceTechnologies = {
  Comodif: [
    "Java",
    "Spring",
    "Kafka",
    "PostgreSQL",
    "Cassandra",
    "Redis",
    "Kubernetes",
    "Prometheus / Grafana"
  ],
  Otoparcasan: ["Python", "SQL", "XML", "Excel"]
};

const technologyPalmOrigin = {x: 46, y: 62};

export const resolveInitialTheme = savedTheme =>
  themeOptions.some(option => option.id === savedTheme) ? savedTheme : "dark";

const getInitialTheme = () => {
  if (typeof window === "undefined") {
    return "dark";
  }

  try {
    return resolveInitialTheme(window.localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    return "dark";
  }
};

const getInitialIntroPlayed = () => {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    return window.sessionStorage.getItem(HOME_INTRO_SESSION_KEY) === "true";
  } catch {
    return false;
  }
};

const rememberHomeIntro = () => {
  try {
    window.sessionStorage.setItem(HOME_INTRO_SESSION_KEY, "true");
  } catch {
    // Session storage may be unavailable in privacy-focused browser contexts.
  }
};

const useReducedMotion = () => {
  const getPreference = () =>
    typeof window !== "undefined" &&
    Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches);
  const [reducedMotion, setReducedMotion] = React.useState(getPreference);

  React.useEffect(() => {
    const query = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!query) {
      return undefined;
    }

    const update = event => setReducedMotion(event.matches);
    if (query.addEventListener) {
      query.addEventListener("change", update);
    } else {
      query.addListener?.(update);
    }

    return () => {
      if (query.removeEventListener) {
        query.removeEventListener("change", update);
      } else {
        query.removeListener?.(update);
      }
    };
  }, []);

  return reducedMotion;
};

const ExternalLink = ({href, children, className = "", id, onClick}) => (
  <a
    id={id}
    className={className}
    href={href}
    target="_blank"
    rel="noreferrer noopener"
    onClick={onClick}
  >
    <span>{children}</span>
    <span aria-hidden="true">↗</span>
  </a>
);

const ThemeSwitch = ({theme, onChange, copy, interactive = true}) => (
  <div className="theme-switch" role="group" aria-label={copy.label}>
    {themeOptions.map(option => (
      <button
        className={theme === option.id ? "is-active" : ""}
        type="button"
        key={option.id}
        title={copy[option.labelKey]}
        aria-label={copy[option.ariaKey]}
        aria-pressed={theme === option.id}
        tabIndex={interactive ? undefined : -1}
        onClick={() => onChange(option.id)}
      >
        {option.symbol}
      </button>
    ))}
  </div>
);

const LanguageSwitch = ({language, onChange, copy, interactive = true}) => (
  <div className="language-switch" role="group" aria-label={copy.label}>
    <button
      type="button"
      lang="en"
      className={language === "en" ? "is-active" : ""}
      aria-label={copy.english}
      aria-pressed={language === "en"}
      tabIndex={interactive ? undefined : -1}
      onClick={() => onChange("en")}
    >
      EN
    </button>
    <button
      type="button"
      lang="tr"
      className={language === "tr" ? "is-active" : ""}
      aria-label={copy.turkish}
      aria-pressed={language === "tr"}
      tabIndex={interactive ? undefined : -1}
      onClick={() => onChange("tr")}
    >
      TR
    </button>
  </div>
);

const DOCK_BASE_SIZE = 40;
const DOCK_MAGNIFIED_SIZE = 56;
const DOCK_MAGNIFICATION_DISTANCE = 120;

export const resolveDockMagnification = distance => {
  const resolvedDistance = Math.min(
    Math.abs(
      Number.isFinite(distance) ? distance : DOCK_MAGNIFICATION_DISTANCE
    ),
    DOCK_MAGNIFICATION_DISTANCE
  );
  const influence = 1 - resolvedDistance / DOCK_MAGNIFICATION_DISTANCE;
  const size =
    DOCK_BASE_SIZE + (DOCK_MAGNIFIED_SIZE - DOCK_BASE_SIZE) * influence;

  return {
    size,
    scale: size / DOCK_BASE_SIZE,
    lift: (size - DOCK_BASE_SIZE) * 0.18
  };
};

const RouteDock = ({copy, introPlayed, isHome, reducedMotion}) => {
  const listRef = React.useRef(null);
  const animationFrameRef = React.useRef(null);
  const springsRef = React.useRef([]);
  const introPending = isHome && !introPlayed;

  const ensureSprings = () => {
    const items = Array.from(listRef.current?.children || []);
    if (springsRef.current.length !== items.length) {
      springsRef.current = items.map(() => ({
        value: DOCK_BASE_SIZE,
        velocity: 0,
        target: DOCK_BASE_SIZE
      }));
    }
    return items;
  };

  const renderSprings = () => {
    const items = ensureSprings();
    let moving = false;

    springsRef.current.forEach((spring, index) => {
      const delta = spring.target - spring.value;
      spring.velocity = spring.velocity * 0.72 + delta * 0.18;
      spring.value += spring.velocity;

      if (Math.abs(delta) < 0.05 && Math.abs(spring.velocity) < 0.05) {
        spring.value = spring.target;
        spring.velocity = 0;
      } else {
        moving = true;
      }

      const actualLift = Math.max(0, (spring.value - DOCK_BASE_SIZE) * 0.24);
      items[index]?.style.setProperty(
        "--dock-item-lift",
        `${actualLift.toFixed(2)}px`
      );
      items[index]?.style.setProperty(
        "--dock-item-size",
        `${spring.value.toFixed(2)}px`
      );
      items[index]?.style.setProperty(
        "--dock-icon-size",
        `${(spring.value / 2).toFixed(2)}px`
      );
      items[index]?.style.setProperty(
        "--dock-icon-font-size",
        `${Math.min(21.6, Math.max(11.52, spring.value * 0.3)).toFixed(2)}px`
      );
    });

    if (moving) {
      animationFrameRef.current = window.requestAnimationFrame(renderSprings);
    } else {
      animationFrameRef.current = null;
    }
  };

  const startSpring = () => {
    if (reducedMotion || animationFrameRef.current !== null) {
      return;
    }
    animationFrameRef.current = window.requestAnimationFrame(renderSprings);
  };

  const setDockTargets = clientX => {
    const items = ensureSprings();

    items.forEach((item, index) => {
      const rect = item.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      springsRef.current[index].target =
        clientX === null
          ? DOCK_BASE_SIZE
          : resolveDockMagnification(clientX - center).size;
    });

    startSpring();
  };

  React.useEffect(
    () => () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    },
    []
  );

  return (
    <nav
      className={`route-dock ${introPending ? "route-dock--intro" : ""}`}
      aria-label={copy.navigationLabel}
      aria-hidden={introPending || undefined}
      onMouseMove={event => {
        if (!reducedMotion) {
          setDockTargets(event.clientX);
        }
      }}
      onMouseLeave={() => setDockTargets(null)}
    >
      <ol ref={listRef}>
        {navigationItems.map(item => (
          <li key={item.href}>
            <NavLink
              exact={item.href === "/"}
              activeClassName="is-active"
              to={item.href}
              aria-label={copy.navigation[item.id]}
              tabIndex={introPending ? -1 : undefined}
            >
              <span className="route-dock__symbol" aria-hidden="true">
                {item.symbol}
              </span>
              <span className="route-dock__label">
                {copy.navigation[item.id]}
              </span>
              <span className="route-dock__tooltip" aria-hidden="true">
                {copy.navigation[item.id]}
              </span>
            </NavLink>
          </li>
        ))}
      </ol>
    </nav>
  );
};

const SiteTopbar = ({
  copy,
  pathname,
  theme,
  language,
  onThemeChange,
  onLanguageChange,
  introPlayed,
  isHome
}) => {
  const introPending = isHome && !introPlayed;

  return (
    <header
      className={`site-topbar ${isHome ? "site-topbar--home" : ""} ${
        introPending ? "site-topbar--intro" : ""
      }`}
      aria-hidden={introPending || undefined}
    >
      <Link className="site-index" to="/" aria-label={copy.aria.home}>
        <strong>BK</strong>
        <span>portfolio.index</span>
      </Link>
      <p className="site-route" aria-label={copy.routeLabel} key={pathname}>
        <span>route</span>
        <strong>{pathname === "/" ? "/index" : pathname}</strong>
      </p>
      <div className="site-controls">
        <ThemeSwitch
          theme={theme}
          onChange={onThemeChange}
          copy={copy.theme}
          interactive={!introPending}
        />
        <LanguageSwitch
          language={language}
          onChange={onLanguageChange}
          copy={copy.language}
          interactive={!introPending}
        />
      </div>
    </header>
  );
};

const SPIRAL_DOT_COUNT = 800;
const SPIRAL_GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

export const resolveSpiralDot = ({index, count, time, radius}) => {
  const safeCount = Math.max(count || 1, 1);
  const progress = (index + 0.5) / safeCount;
  const angle = index * SPIRAL_GOLDEN_ANGLE;
  const distance = Math.sqrt(progress) * radius;
  const phase = time * Math.PI * 2 + index * 0.115;
  const pulse = 0.5 + 0.5 * Math.sin(phase);

  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
    size: 0.55 + pulse * 1.15,
    alpha: 0.2 + pulse * 0.62
  };
};

const ParticleSpiral = ({theme, reducedMotion, playIntro}) => {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext?.("2d");
    if (!canvas || !context) {
      return undefined;
    }

    let animationFrame = null;
    let width = 0;
    let height = 0;
    let startTime = null;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(rect.width, 1);
      height = Math.max(rect.height, 1);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const draw = timestamp => {
      if (startTime === null) {
        startTime = timestamp || 0;
      }

      const elapsed = Math.max((timestamp || 0) - startTime, 0);
      const computed = window.getComputedStyle(canvas);
      const dotColor =
        computed.getPropertyValue("--particle-color").trim() || "#f2a638";
      const highlight =
        computed.getPropertyValue("--spiral-highlight").trim() || dotColor;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.47;
      const cycle = reducedMotion ? 0.25 : (elapsed % 2000) / 2000;
      const reveal =
        reducedMotion || !playIntro
          ? 1
          : Math.min(Math.max(elapsed / 420, 0), 1);
      const easedReveal = 1 - Math.pow(1 - reveal, 3);

      context.clearRect(0, 0, width, height);
      context.save();
      context.translate(centerX, centerY);
      context.scale(1.08, 0.68);

      for (let index = 0; index < SPIRAL_DOT_COUNT; index += 1) {
        const dot = resolveSpiralDot({
          index,
          count: SPIRAL_DOT_COUNT,
          time: cycle,
          radius
        });
        const dotReveal = Math.min(
          Math.max(easedReveal * 1.2 - (index / SPIRAL_DOT_COUNT) * 0.2, 0),
          1
        );

        context.globalAlpha = dot.alpha * dotReveal;
        context.fillStyle = index % 17 === 0 ? highlight : dotColor;
        context.beginPath();
        context.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        context.fill();
      }

      context.restore();
      context.globalAlpha = 1;

      if (!reducedMotion && process.env.NODE_ENV !== "test") {
        animationFrame = window.requestAnimationFrame(draw);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    draw(reducedMotion ? 500 : performance.now());

    return () => {
      window.removeEventListener("resize", resize);
      if (animationFrame !== null) {
        window.cancelAnimationFrame?.(animationFrame);
      }
    };
  }, [playIntro, reducedMotion, theme]);

  return (
    <canvas
      className="identity-sequence__spiral"
      ref={canvasRef}
      aria-hidden="true"
    />
  );
};

const HomePage = ({copy, profileData, playIntro, theme, reducedMotion}) => {
  const handleGlyphs = Array.from(copy.home.handle);

  return (
    <section
      className={`identity-sequence ${
        playIntro ? "identity-sequence--play" : "identity-sequence--settled"
      }`}
      aria-labelledby="home-identity"
    >
      <ParticleSpiral
        theme={theme}
        reducedMotion={reducedMotion}
        playIntro={playIntro}
      />
      <div className="identity-sequence__vignette" aria-hidden="true" />
      <div className="identity-sequence__content">
        <p className="identity-sequence__command">{copy.home.command}</p>
        <h1
          id="home-identity"
          tabIndex="-1"
          className="identity-sequence__handle"
          aria-label={copy.home.handle}
        >
          {handleGlyphs.map((glyph, index) => (
            <span
              className={`identity-sequence__glyph ${
                index === handleGlyphs.length - 1
                  ? "identity-sequence__cursor"
                  : ""
              }`}
              style={{"--glyph-index": index}}
              aria-hidden="true"
              key={`${glyph}-${index}`}
            >
              {glyph}
            </span>
          ))}
        </h1>
        <nav
          className="identity-sequence__links"
          aria-label={copy.home.profileLinksLabel}
        >
          <ExternalLink id="profile-github-home" href={profileData.github}>
            GitHub
          </ExternalLink>
          <ExternalLink id="profile-linkedin-home" href={profileData.linkedin}>
            LinkedIn
          </ExternalLink>
        </nav>
      </div>
    </section>
  );
};

const TechnologyStage = ({copy, capabilitiesData, reducedMotion}) => {
  const [activeId, setActiveId] = React.useState(capabilitiesData[0].id);
  const [activeTechnologyId, setActiveTechnologyId] = React.useState(
    capabilitiesData[0].technologyIds[0]
  );
  const [hologramView, setHologramView] = React.useState("groups");
  const [sceneStatus, setSceneStatus] = React.useState("loading");
  const stageRef = React.useRef(null);
  const canvasRef = React.useRef(null);

  const active =
    capabilitiesData.find(capability => capability.id === activeId) ||
    capabilitiesData[0];
  const resolvedTechnologyId = active.technologyIds.includes(activeTechnologyId)
    ? activeTechnologyId
    : active.technologyIds[0];

  React.useEffect(() => {
    if (process.env.NODE_ENV === "test") {
      return undefined;
    }

    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return undefined;

    let cancelled = false;
    let controller = null;
    setSceneStatus("loading");

    createTechnologyScene({
      canvas,
      reducedMotion,
      onReady: () => {
        if (!cancelled) {
          setSceneStatus("ready");
        }
      }
    })
      .then(instance => {
        if (cancelled) {
          instance?.dispose();
          return;
        }
        controller = instance;
      })
      .catch(() => {
        if (!cancelled) {
          setSceneStatus("unavailable");
        }
      });

    return () => {
      cancelled = true;
      controller?.dispose();
    };
  }, [reducedMotion]);

  const openGroup = capability => {
    setActiveId(capability.id);
    setActiveTechnologyId(capability.technologyIds[0]);
    setHologramView("technologies");
  };

  const selectTechnology = technologyId => {
    setActiveTechnologyId(technologyId);
  };

  return (
    <section className="technology-explorer" aria-label={copy.explorerLabel}>
      <header className="technology-explorer__header">
        <code>stack.spline</code>
        <span>
          {String(capabilitiesData.length).padStart(2, "0")} {copy.groupsLabel}
          <i aria-hidden="true"> / </i>
          {String(Object.keys(technologies).length).padStart(2, "0")}{" "}
          {copy.toolsLabel}
        </span>
      </header>

      <div
        className="technology-stage technology-stage--spline"
        id="technology-scene"
        ref={stageRef}
        data-reduced-motion={reducedMotion ? "true" : "false"}
        data-scene-ready={sceneStatus === "ready" ? "true" : "false"}
        data-scene-status={sceneStatus}
        data-active-group={active.id}
        data-selected-technology={resolvedTechnologyId}
        data-hologram-view={hologramView}
        style={{
          "--technology-palm-x": `${technologyPalmOrigin.x}%`,
          "--technology-palm-y": `${technologyPalmOrigin.y}%`
        }}
      >
        <div className="technology-stage__spotlight" aria-hidden="true" />

        <svg
          className="technology-stage__projector"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id="technology-projection-beam"
              x1="0"
              y1="1"
              x2="0"
              y2="0"
            >
              <stop offset="0" stopColor="var(--accent)" stopOpacity="0.22" />
              <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            className="technology-stage__beam"
            d={`M ${technologyPalmOrigin.x - 2.5} ${
              technologyPalmOrigin.y
            } L 17 18 L 42 18 L ${technologyPalmOrigin.x + 2.5} ${
              technologyPalmOrigin.y
            } Z`}
          />
          <ellipse
            className="technology-stage__palm-ring technology-stage__palm-ring--outer"
            cx={technologyPalmOrigin.x}
            cy={technologyPalmOrigin.y}
            rx="6.5"
            ry="2.5"
          />
          <ellipse
            className="technology-stage__palm-ring technology-stage__palm-ring--inner"
            cx={technologyPalmOrigin.x}
            cy={technologyPalmOrigin.y}
            rx="3.8"
            ry="1.35"
          />
        </svg>

        <canvas
          className="technology-stage__canvas technology-stage__canvas--spline"
          ref={canvasRef}
          aria-hidden="true"
        />

        <div className="technology-hologram" aria-live="polite">
          <div className="technology-hologram__chrome" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          {hologramView === "groups" ? (
            <div className="technology-hologram__view technology-hologram__view--groups">
              <header className="technology-hologram__header">
                <span>STACK / GROUPS</span>
                <small>04</small>
              </header>

              <div
                className="technology-hologram__groups"
                role="group"
                aria-label={copy.chooseGroup}
              >
                {capabilitiesData.map((capability, index) => (
                  <button
                    type="button"
                    key={capability.id}
                    data-hologram-group-id={capability.id}
                    onClick={() => openGroup(capability)}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{copy.groups[capability.id]}</strong>
                    <small>
                      {String(capability.technologyIds.length).padStart(2, "0")}
                    </small>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="technology-hologram__view technology-hologram__view--technologies">
              <header className="technology-hologram__header">
                <button
                  type="button"
                  className="technology-hologram__back"
                  onClick={() => setHologramView("groups")}
                  aria-label={copy.chooseGroup}
                >
                  ←
                </button>
                <div>
                  <span>{copy.groups[active.id]}</span>
                  <small>
                    {String(active.technologyIds.length).padStart(2, "0")}{" "}
                    {copy.toolsLabel}
                  </small>
                </div>
              </header>

              <div
                className="technology-hologram__technologies"
                aria-label={copy.groupTechnologies}
              >
                {active.technologyIds.map((technologyId, index) => {
                  const technology = technologies[technologyId];
                  const selected = technologyId === resolvedTechnologyId;

                  return (
                    <button
                      type="button"
                      key={technologyId}
                      className={selected ? "is-selected" : ""}
                      data-hologram-technology-id={technologyId}
                      aria-pressed={selected}
                      onClick={() => selectTechnology(technologyId)}
                      onMouseEnter={() => selectTechnology(technologyId)}
                      onFocus={() => selectTechnology(technologyId)}
                    >
                      <img src={technology.icon} alt="" aria-hidden="true" />
                      <span>
                        <strong>{technology.name}</strong>
                        <small>
                          {String(index + 1).padStart(2, "0")} /{" "}
                          {String(active.technologyIds.length).padStart(2, "0")}
                        </small>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="technology-stage__loader" aria-hidden="true">
          <span />
        </div>
      </div>
    </section>
  );
};

const TechnologiesPage = ({copy, capabilitiesData, reducedMotion}) => (
  <div className="technologies-page route-page">
    <header className="technologies-intro" data-reveal>
      <div>
        <span className="route-kicker">{copy.technologies.kicker}</span>
        <code>{copy.technologies.route}</code>
      </div>
      <h1 tabIndex="-1">{copy.technologies.title}</h1>
    </header>

    <TechnologyStage
      copy={copy.technologies}
      capabilitiesData={capabilitiesData}
      reducedMotion={reducedMotion}
    />
  </div>
);

const clampProjectProgress = value => Math.min(Math.max(value, 0), 1);

export const resolveProjectPerspective = ({
  top,
  height,
  viewportHeight,
  viewportWidth
}) => {
  const safeViewportHeight = Math.max(viewportHeight || 0, 1);
  const safeHeight = Math.max(height || 0, 1);
  const compact = viewportWidth <= 768;
  const progress = clampProjectProgress(
    (safeViewportHeight - top) / (safeHeight + safeViewportHeight)
  );
  const rotate = (1 - progress) * (compact ? 6 : 10);
  const scaleStart = compact ? 0.96 : 0.94;
  const shiftStart = compact ? 18 : 30;
  const shift = shiftStart * (1 - progress);

  return {
    progress,
    tilt: `${rotate.toFixed(2)}deg`,
    scale: (scaleStart + progress * (1 - scaleStart)).toFixed(4),
    shift: `${shift.toFixed(2)}px`,
    galleryShift: `${(shift * 0.35).toFixed(2)}px`,
    opacity: "1"
  };
};

const useProjectPerspective = (stageRef, reducedMotion) => {
  React.useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) {
      return undefined;
    }

    const setRestingState = () => {
      stage.style.setProperty("--project-progress", "1");
      stage.style.setProperty("--project-tilt", "0deg");
      stage.style.setProperty("--project-scale", "1");
      stage.style.setProperty("--project-shift", "0px");
      stage.style.setProperty("--project-gallery-shift", "0px");
      stage.style.setProperty("--project-opacity", "1");
      stage.dataset.projectMotion = "settled";
    };

    if (reducedMotion) {
      setRestingState();
      return undefined;
    }

    let animationFrame = null;
    let ticking = false;

    const update = () => {
      const rect = stage.getBoundingClientRect();
      const motion = resolveProjectPerspective({
        top: rect.top,
        height: rect.height,
        viewportHeight: window.innerHeight,
        viewportWidth: window.innerWidth
      });

      stage.style.setProperty("--project-progress", motion.progress.toFixed(3));
      stage.style.setProperty("--project-tilt", motion.tilt);
      stage.style.setProperty("--project-scale", motion.scale);
      stage.style.setProperty("--project-shift", motion.shift);
      stage.style.setProperty("--project-gallery-shift", motion.galleryShift);
      stage.style.setProperty("--project-opacity", motion.opacity);
      stage.dataset.projectMotion =
        motion.progress >= 0.985 ? "settled" : "approaching";
    };

    const scheduleUpdate = () => {
      if (ticking) {
        return;
      }

      ticking = true;
      animationFrame = window.requestAnimationFrame(() => {
        ticking = false;
        animationFrame = null;
        update();
      });
    };

    update();
    window.addEventListener("scroll", scheduleUpdate, {passive: true});
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, [reducedMotion, stageRef]);
};
const ArchitecturePlate = ({project, copy}) => (
  <div
    className="architecture-plate"
    role="img"
    aria-label={`${project.title}${copy.aria.projectArchitecture}`}
  >
    <header>
      <span>{copy.projects.architectureLabel}</span>
      <strong>{project.title}</strong>
    </header>
    <ol>
      {project.flow.map((step, index) => (
        <li key={step}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <strong>{step}</strong>
          {index < project.flow.length - 1 && <i aria-hidden="true">→</i>}
        </li>
      ))}
    </ol>
    <footer>
      <span>{project.type}</span>
      <span>repo / public</span>
    </footer>
  </div>
);

const ProjectMedia = ({project, copy, reducedMotion}) => {
  const stageRef = React.useRef(null);
  const videoRef = React.useRef(null);
  const [paused, setPaused] = React.useState(reducedMotion);
  const userPausedRef = React.useRef(reducedMotion);
  useProjectPerspective(stageRef, reducedMotion);

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return undefined;
    }

    if (reducedMotion) {
      userPausedRef.current = true;
      video.pause();
      setPaused(true);
      return undefined;
    }

    userPausedRef.current = false;
    video.play()?.catch?.(() => setPaused(true));
    setPaused(false);

    if (!window.IntersectionObserver) {
      return undefined;
    }

    const observer = new window.IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          video.pause();
        } else if (!userPausedRef.current) {
          video.play()?.catch?.(() => setPaused(true));
        }
      });
    });
    observer.observe(video);

    return () => observer.disconnect();
  }, [project.video, reducedMotion]);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    if (video.paused) {
      userPausedRef.current = false;
      video.play()?.catch?.(() => setPaused(true));
      setPaused(false);
    } else {
      userPausedRef.current = true;
      video.pause();
      setPaused(true);
    }
  };

  return (
    <div className="project-stage" ref={stageRef}>
      <div className="project-stage__plane">
        {project.kind === "system" ? (
          <ArchitecturePlate project={project} copy={copy} />
        ) : project.video ? (
          <>
            <video
              ref={videoRef}
              src={project.video}
              poster={project.image}
              preload="metadata"
              muted
              loop
              playsInline
              autoPlay={!reducedMotion}
              aria-label={project.imageAlt}
            />
            <button
              className="project-stage__playback"
              type="button"
              aria-label={
                paused ? copy.projects.playMotion : copy.projects.pauseMotion
              }
              aria-pressed={paused}
              onClick={togglePlayback}
            >
              {paused ? copy.projects.playLabel : copy.projects.pauseLabel}
            </button>
          </>
        ) : (
          <img
            src={project.image}
            alt={project.imageAlt}
            loading={project.number === "01" ? "eager" : "lazy"}
            decoding="async"
          />
        )}
        <span className="project-stage__index" aria-hidden="true">
          {project.number}
        </span>
      </div>
      {project.gallery && (
        <div
          className="project-stage__filmstrip"
          aria-label={copy.projects.mediaLabel}
        >
          {project.gallery.map(image => (
            <img
              src={image.src}
              alt={image.alt}
              loading="lazy"
              decoding="async"
              key={image.src}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ProjectChapter = ({project, copy, reducedMotion, layout}) => {
  const links =
    project.kind === "system"
      ? [{label: copy.projects.sourceLabel, url: project.link}]
      : project.links;

  return (
    <article
      className={`project-chapter project-chapter--${project.kind} project-chapter--${layout}`}
      id={project.id}
      data-layout={layout}
    >
      <header className="project-chapter__marker" data-reveal>
        <span>{project.number}</span>
        <p>{project.type || project.kicker}</p>
        <time>{project.year || "source"}</time>
      </header>

      <div className="project-chapter__details" data-reveal>
        <div>
          <span>{copy.projects.detailsLabel}</span>
          <h2>{project.title}</h2>
        </div>
        <div className="project-chapter__narrative">
          <p>{project.description}</p>
          {project.proof && (
            <p className="project-chapter__proof">
              <span>{copy.projects.proofLabel}</span>
              {project.proof}
            </p>
          )}
        </div>
        <ul
          className="project-chapter__tags"
          aria-label={copy.projects.technologyLabel}
        >
          {project.tags.map(tag => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        <nav
          className="project-chapter__links"
          aria-label={copy.projects.sourceLabel}
        >
          {links.map(link => (
            <ExternalLink key={link.url} href={link.url}>
              {link.label}
            </ExternalLink>
          ))}
        </nav>
      </div>

      <ProjectMedia
        project={project}
        copy={copy}
        reducedMotion={reducedMotion}
      />
    </article>
  );
};

const projectLayouts = [
  "feature",
  "split",
  "panorama",
  "split-reverse",
  "editorial"
];

const ProjectsPage = ({
  copy,
  visualProjectsData,
  profileData,
  reducedMotion
}) => {
  const projects = visualProjectsData.map(project => ({
    ...project,
    kind: "visual"
  }));

  return (
    <div className="projects-page route-page">
      <header className="projects-intro" data-reveal>
        <div>
          <span className="route-kicker">{copy.projects.kicker}</span>
          <code>{copy.projects.route}</code>
        </div>
        <h1 tabIndex="-1">{copy.projects.title}</h1>
        <p>{copy.projects.intro}</p>
        <nav aria-label={copy.projects.archiveLabel}>
          {projects.map(project => (
            <a href={`#${project.id}`} key={project.id}>
              <span>{project.number}</span>
              {project.title}
            </a>
          ))}
        </nav>
      </header>

      <section
        className="project-archive"
        aria-label={copy.projects.archiveLabel}
      >
        {projects.map((project, index) => (
          <ProjectChapter
            project={project}
            copy={copy}
            reducedMotion={reducedMotion}
            layout={projectLayouts[index]}
            key={project.id}
          />
        ))}
      </section>

      <ExternalLink className="projects-page__all" href={profileData.github}>
        {copy.projects.allProjects}
      </ExternalLink>
    </div>
  );
};

const ProductContext = ({product, copy}) => (
  <a
    className="product-context"
    href={product.url}
    target="_blank"
    rel="noreferrer noopener"
  >
    <span className="product-context__media">
      <img src={product.images[0].src} alt={product.images[0].alt} />
      <img src={product.images[1].src} alt={product.images[1].alt} />
    </span>
    <span className="product-context__copy">
      <img src={product.icon} alt="" aria-hidden="true" />
      <strong>{product.name}</strong>
      <small>{product.focus}</small>
      <p>{product.description}</p>
      <em>{copy.experience.externalProduct}</em>
    </span>
    <span className="product-context__arrow" aria-hidden="true">
      ↗
    </span>
  </a>
);

export const resolveTimelineProgress = ({top, height, viewportHeight}) => {
  const safeViewportHeight = Math.max(viewportHeight || 0, 1);
  const safeHeight = Math.max(height || 0, 1);
  const startLine = safeViewportHeight * 0.1;
  const travel = Math.max(safeHeight - safeViewportHeight * 0.4, 1);
  const progress = clampProjectProgress((startLine - top) / travel);

  return {
    progress,
    opacity: clampProjectProgress(progress / 0.1)
  };
};

const useTimelineProgress = (timelineRef, reducedMotion) => {
  React.useLayoutEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline) {
      return undefined;
    }

    const settle = () => {
      timeline.style.setProperty("--timeline-progress", "1");
      timeline.style.setProperty("--timeline-opacity", "1");
    };

    if (reducedMotion) {
      settle();
      return undefined;
    }

    let animationFrame = null;
    let ticking = false;

    const update = () => {
      const rect = timeline.getBoundingClientRect();
      const motion = resolveTimelineProgress({
        top: rect.top,
        height: rect.height,
        viewportHeight: window.innerHeight
      });
      timeline.style.setProperty(
        "--timeline-progress",
        motion.progress.toFixed(4)
      );
      timeline.style.setProperty(
        "--timeline-opacity",
        motion.opacity.toFixed(4)
      );
    };

    const scheduleUpdate = () => {
      if (ticking) {
        return;
      }
      ticking = true;
      animationFrame = window.requestAnimationFrame(() => {
        ticking = false;
        animationFrame = null;
        update();
      });
    };

    update();
    window.addEventListener("scroll", scheduleUpdate, {passive: true});
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, [reducedMotion, timelineRef]);
};

const ExperiencePage = ({copy, experiencesData, reducedMotion}) => {
  const timelineRef = React.useRef(null);
  useTimelineProgress(timelineRef, reducedMotion);

  return (
    <div className="experience-page route-page">
      <header className="experience-intro" data-reveal>
        <span className="route-kicker">{copy.experience.kicker}</span>
        <h1 tabIndex="-1">{copy.experience.title}</h1>
        <p>{copy.experience.intro}</p>
        <code>{copy.experience.route}</code>
      </header>

      <section
        className="work-chronicle"
        aria-label={copy.experience.timelineLabel}
        ref={timelineRef}
      >
        <div className="work-chronicle__beam" aria-hidden="true">
          <span />
        </div>
        {experiencesData.map((experience, index) => (
          <article
            className="chronicle-entry"
            key={`${experience.company}-${experience.period}`}
          >
            <div className="chronicle-entry__rail" aria-hidden="true">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <i />
            </div>
            <header className="chronicle-entry__identity">
              <p>{experience.type}</p>
              <h2>{experience.company}</h2>
              <strong>{experience.role}</strong>
              <time>{experience.period}</time>
              <small>{experience.workplace}</small>
            </header>
            <div className="chronicle-entry__record">
              <p className="chronicle-entry__summary">{experience.summary}</p>
              <h3>{copy.experience.contributionLabel}</h3>
              <ul className="chronicle-entry__highlights">
                {experience.highlights.map(highlight => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
              <div className="chronicle-entry__technology">
                <span>{copy.experience.technologyLabel}</span>
                <p>
                  {(experienceTechnologies[experience.company] || []).join(
                    " · "
                  )}
                </p>
              </div>
            </div>
            {experience.products && (
              <div className="chronicle-entry__products">
                <h3>{copy.experience.productsLabel}</h3>
                <div>
                  {experience.products.map(product => (
                    <ProductContext
                      product={product}
                      copy={copy}
                      key={product.id}
                    />
                  ))}
                </div>
              </div>
            )}
          </article>
        ))}
      </section>
    </div>
  );
};

const SignatureMark = ({label}) => (
  <div className="signature-mark" role="img" aria-label={label}>
    <svg viewBox="0 0 520 170" aria-hidden="true" focusable="false">
      <path
        pathLength="1"
        d="M28 126
           C35 92 36 53 42 28
           C46 13 58 11 63 23
           C69 38 60 60 47 77
           C60 59 82 49 96 57
           C108 64 106 79 96 88
           C83 99 62 96 47 93
           C61 89 85 92 97 103
           C108 114 100 129 84 133
           C66 138 48 130 39 124

           M116 106
           C121 83 139 69 155 74
           C169 79 167 92 154 98
           C143 103 130 101 122 97
           C124 114 141 121 158 112

           M178 114
           C181 99 183 85 184 76
           C185 72 188 71 189 77
           L188 92
           C197 78 208 72 219 78
           C224 81 226 86 226 91

           M244 112
           C247 91 250 66 253 37
           C254 29 258 26 260 34
           L256 94
           C266 82 276 74 288 73
           C297 72 302 79 299 87
           C295 98 283 105 267 107
           C276 107 286 112 292 119

           M316 110
           C318 90 331 76 346 76
           C360 76 367 88 363 100
           C360 112 347 119 335 116
           C323 114 316 105 318 94
           C320 82 331 75 344 77
           C356 79 362 88 361 99

           M385 113
           C388 99 390 85 391 77
           C392 72 396 72 397 78
           L396 91
           C405 78 416 72 427 77
           C436 81 439 90 437 101
           L435 113

           M452 78
           C465 77 478 76 491 76
           M472 53
           C470 70 468 88 467 103
           C466 114 471 119 482 116

           M48 145
           C145 155 278 151 486 132"
      />
    </svg>
  </div>
);

const WOVEN_GRID_X = 40;
const WOVEN_GRID_Y = 26;
const WOVEN_WIDTH = 4.4;
const WOVEN_HEIGHT = 2.75;
const WOVEN_GRAVITY = -3.1;
const WOVEN_DAMPING = 0.985;
const WOVEN_DT = 0.016;

const WovenSample = ({reducedMotion, theme}) => {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    if (process.env.NODE_ENV === "test") {
      return undefined;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    let renderer;
    let geometry;
    let material;
    let texture;
    let animationFrame = null;
    let running = false;
    let time = 0;

    const makeTexture = () => {
      const textureCanvas = document.createElement("canvas");
      const width = 1280;
      const height = 800;
      textureCanvas.width = width;
      textureCanvas.height = height;
      const context = textureCanvas.getContext("2d");
      if (!context) {
        return null;
      }

      const computed = window.getComputedStyle(canvas);
      const ground = computed.getPropertyValue("--woven-a").trim() || "#e9dfca";
      const accent =
        computed.getPropertyValue("--woven-ink").trim() || "#9e1e2a";

      const gradient = context.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, ground);
      gradient.addColorStop(0.5, ground);
      gradient.addColorStop(1, ground);
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);

      context.strokeStyle = accent;
      context.lineWidth = 10;
      context.strokeRect(46, 46, width - 92, height - 92);
      context.globalAlpha = 0.72;
      context.lineWidth = 3;
      context.strokeRect(66, 66, width - 132, height - 132);
      context.globalAlpha = 1;

      context.fillStyle = accent;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.font = 'bold 78px Georgia, "Times New Roman", serif';
      context.fillText("SYSTEMS", width / 2, 190);
      context.font = 'normal 20px "Helvetica Neue", Arial, sans-serif';
      context.fillText("· SOFTWARE ·", width / 2, 246);
      context.font = 'bold 118px Georgia, "Times New Roman", serif';
      context.fillText("BACKEND", width / 2, 400);
      context.fillText("ENGINEERING", width / 2, 520);
      context.font = '600 30px "Helvetica Neue", Arial, sans-serif';
      context.fillText(
        "J A V A   ·   K A F K A   ·   K U B E R N E T E S",
        width / 2,
        626
      );

      for (let y = 0; y < height; y += 3) {
        context.strokeStyle = "rgba(60,30,20,0.05)";
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(0, y + 0.5);
        context.lineTo(width, y + 0.5);
        context.stroke();
      }

      for (let x = 0; x < width; x += 3) {
        context.strokeStyle = "rgba(255,250,235,0.06)";
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(x + 0.5, 0);
        context.lineTo(x + 0.5, height);
        context.stroke();
      }

      const image = context.getImageData(0, 0, width, height);
      for (let index = 0; index < image.data.length; index += 4) {
        const noise = (Math.random() * 2 - 1) * 10;
        image.data[index] += noise;
        image.data[index + 1] += noise;
        image.data[index + 2] += noise;
      }
      context.putImageData(image, 0, 0);

      const nextTexture = new THREE.CanvasTexture(textureCanvas);
      nextTexture.anisotropy = 4;
      nextTexture.colorSpace = THREE.SRGBColorSpace;
      return nextTexture;
    };

    try {
      const scene = new THREE.Scene();
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      texture = makeTexture();
      geometry = new THREE.PlaneGeometry(
        WOVEN_WIDTH,
        WOVEN_HEIGHT,
        WOVEN_GRID_X,
        WOVEN_GRID_Y
      );
      material = new THREE.MeshPhongMaterial({
        map: texture,
        side: THREE.DoubleSide,
        shininess: 6,
        specular: new THREE.Color(0x2a1410),
        color: 0xffffff
      });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      scene.add(new THREE.AmbientLight(0xffe9d0, 0.62));

      const keyLight = new THREE.DirectionalLight(0xfff0dc, 1.15);
      keyLight.position.set(-3, 3.5, 3.2);
      scene.add(keyLight);

      const rimLight = new THREE.DirectionalLight(0xb02330, 0.42);
      rimLight.position.set(3, -1.5, 2);
      scene.add(rimLight);

      const positions = geometry.attributes.position;
      const vertexCount = (WOVEN_GRID_X + 1) * (WOVEN_GRID_Y + 1);
      const current = new Float32Array(vertexCount * 3);
      const previous = new Float32Array(vertexCount * 3);
      const rest = new Float32Array(vertexCount * 3);
      const pinned = new Uint8Array(vertexCount);

      for (let index = 0; index < vertexCount; index += 1) {
        const x = positions.getX(index);
        const y = positions.getY(index);
        current[index * 3] = previous[index * 3] = rest[index * 3] = x;
        current[index * 3 + 1] =
          previous[index * 3 + 1] =
          rest[index * 3 + 1] =
            y;
        current[index * 3 + 2] =
          previous[index * 3 + 2] =
          rest[index * 3 + 2] =
            0;
      }

      for (let x = 0; x <= WOVEN_GRID_X; x += 1) {
        pinned[x] = 1;
      }

      const vertexIndex = (x, y) => x + y * (WOVEN_GRID_X + 1);
      const horizontalRest = WOVEN_WIDTH / WOVEN_GRID_X;
      const verticalRest = WOVEN_HEIGHT / WOVEN_GRID_Y;

      const wind = (x, y, elapsed) => {
        const normalizedX = x / WOVEN_GRID_X;
        const normalizedY = y / WOVEN_GRID_Y;
        const travel = elapsed * 1.7 - normalizedY * 4.2;
        const gust =
          0.6 +
          0.42 * Math.sin(elapsed * 0.6) +
          0.18 * Math.sin(elapsed * 1.9 + 1.3);
        const amplitude = 4.3 * normalizedY;

        return [
          Math.sin(elapsed * 0.9 + normalizedY * 2.2) * 0.6 * normalizedY,
          -0.4 * normalizedY,
          (Math.sin(travel + normalizedX * 3.3) +
            0.5 * Math.sin(travel * 1.7 + normalizedX * 6)) *
            amplitude *
            gust
        ];
      };

      const solve = (a, b, restLength) => {
        let deltaX = current[b * 3] - current[a * 3];
        let deltaY = current[b * 3 + 1] - current[a * 3 + 1];
        let deltaZ = current[b * 3 + 2] - current[a * 3 + 2];
        const distance =
          Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ) ||
          1e-6;
        const difference = ((distance - restLength) / distance) * 0.5;
        deltaX *= difference;
        deltaY *= difference;
        deltaZ *= difference;

        if (!pinned[a] && !pinned[b]) {
          current[a * 3] += deltaX;
          current[a * 3 + 1] += deltaY;
          current[a * 3 + 2] += deltaZ;
          current[b * 3] -= deltaX;
          current[b * 3 + 1] -= deltaY;
          current[b * 3 + 2] -= deltaZ;
        } else if (pinned[a] && !pinned[b]) {
          current[b * 3] -= deltaX * 2;
          current[b * 3 + 1] -= deltaY * 2;
          current[b * 3 + 2] -= deltaZ * 2;
        } else if (!pinned[a] && pinned[b]) {
          current[a * 3] += deltaX * 2;
          current[a * 3 + 1] += deltaY * 2;
          current[a * 3 + 2] += deltaZ * 2;
        }
      };

      const step = elapsed => {
        for (let y = 0; y <= WOVEN_GRID_Y; y += 1) {
          for (let x = 0; x <= WOVEN_GRID_X; x += 1) {
            const index = vertexIndex(x, y);
            if (pinned[index]) {
              continue;
            }

            const forces = wind(x, y, elapsed);
            for (let axis = 0; axis < 3; axis += 1) {
              const offset = index * 3 + axis;
              const acceleration =
                axis === 0
                  ? forces[0]
                  : axis === 1
                  ? forces[1] + WOVEN_GRAVITY
                  : forces[2];
              const velocity =
                (current[offset] - previous[offset]) * WOVEN_DAMPING;
              previous[offset] = current[offset];
              current[offset] += velocity + acceleration * WOVEN_DT * WOVEN_DT;
            }
          }
        }

        for (let iteration = 0; iteration < 3; iteration += 1) {
          for (let y = 0; y <= WOVEN_GRID_Y; y += 1) {
            for (let x = 0; x < WOVEN_GRID_X; x += 1) {
              solve(vertexIndex(x, y), vertexIndex(x + 1, y), horizontalRest);
            }
          }
          for (let y = 0; y < WOVEN_GRID_Y; y += 1) {
            for (let x = 0; x <= WOVEN_GRID_X; x += 1) {
              solve(vertexIndex(x, y), vertexIndex(x, y + 1), verticalRest);
            }
          }
        }

        for (let x = 0; x <= WOVEN_GRID_X; x += 1) {
          const index = x;
          for (let axis = 0; axis < 3; axis += 1) {
            const offset = index * 3 + axis;
            current[offset] = rest[offset];
            previous[offset] = rest[offset];
          }
        }
      };

      const commit = () => {
        for (let index = 0; index < vertexCount; index += 1) {
          positions.setXYZ(
            index,
            current[index * 3],
            current[index * 3 + 1],
            current[index * 3 + 2]
          );
        }
        positions.needsUpdate = true;
        geometry.computeVertexNormals();
      };

      let camera;
      const fit = () => {
        const rect = canvas.getBoundingClientRect();
        const width = Math.max(rect.width, 1);
        const height = Math.max(rect.height, 1);
        renderer.setSize(width, height, false);
        const aspect = width / height;
        camera = new THREE.PerspectiveCamera(42, aspect, 0.1, 100);
        const verticalFit = WOVEN_HEIGHT / 2 / Math.tan((42 * Math.PI) / 360);
        const horizontalFit =
          WOVEN_WIDTH / 2 / Math.tan((42 * Math.PI) / 360) / aspect;
        camera.position.set(
          0,
          0.05,
          Math.max(verticalFit, horizontalFit) * 1.16 + 0.4
        );
        camera.lookAt(0, 0, 0);
      };

      const renderFrame = () => {
        if (!running) {
          return;
        }
        time += WOVEN_DT;
        step(time);
        commit();
        renderer.render(scene, camera);
        animationFrame = window.requestAnimationFrame(renderFrame);
      };

      const start = () => {
        if (running) {
          return;
        }
        running = true;
        animationFrame = window.requestAnimationFrame(renderFrame);
      };

      const stop = () => {
        running = false;
        if (animationFrame !== null) {
          window.cancelAnimationFrame(animationFrame);
          animationFrame = null;
        }
      };

      const handleVisibility = () => {
        if (document.hidden) {
          stop();
        } else if (!reducedMotion) {
          start();
        }
      };

      fit();
      window.addEventListener("resize", fit);

      if (reducedMotion) {
        for (let frame = 0; frame < 220; frame += 1) {
          step(frame * WOVEN_DT);
        }
        commit();
        renderer.render(scene, camera);
      } else {
        for (let frame = 0; frame < 40; frame += 1) {
          step(frame * WOVEN_DT);
        }
        time = 40 * WOVEN_DT;
        start();
        document.addEventListener("visibilitychange", handleVisibility);
      }

      return () => {
        stop();
        window.removeEventListener("resize", fit);
        document.removeEventListener("visibilitychange", handleVisibility);
        geometry.dispose();
        material.dispose();
        texture?.dispose();
        renderer.dispose();
      };
    } catch {
      return undefined;
    }
  }, [reducedMotion, theme]);

  return (
    <div className="woven-sample" data-woven-cloth="threeui" aria-hidden="true">
      <canvas className="woven-sample__canvas" ref={canvasRef} />
    </div>
  );
};

const AboutPage = ({
  copy,
  profileData,
  educationData,
  reducedMotion,
  theme
}) => (
  <div className="about-page route-page">
    <header className="about-intro" data-reveal>
      <div>
        <span className="route-kicker">{copy.about.kicker}</span>
        <code>{copy.about.route}</code>
      </div>
      <h1 tabIndex="-1">{copy.about.title}</h1>
      <p>{copy.about.intro}</p>
    </header>

    <section className="about-collage">
      <div className="about-essay" data-reveal>
        <span>{copy.about.storyLabel}</span>
        {copy.about.story.map(paragraph => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <SignatureMark label={copy.about.signatureLabel} />
      </div>

      <aside className="about-fabric" data-reveal>
        <WovenSample reducedMotion={reducedMotion} theme={theme} />
        <dl>
          <div>
            <dt>{copy.about.locationLabel}</dt>
            <dd>{profileData.location}</dd>
          </div>
          <div>
            <dt>{copy.about.educationLabel}</dt>
            <dd>
              {educationData[0].school}
              <span>{educationData[0].field}</span>
              <small>{educationData[0].period}</small>
            </dd>
          </div>
        </dl>
      </aside>
    </section>
  </div>
);

const ContactRow = ({label, value, href, id, onClick}) => {
  if (!href) {
    return (
      <li className="directory-row directory-row--plain">
        <span>{label}</span>
        <strong>{value}</strong>
        <i aria-hidden="true">—</i>
      </li>
    );
  }

  const external = !href.startsWith("mailto:") && !href.startsWith("/");
  return (
    <li className="directory-row">
      <a
        href={href}
        id={id}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer noopener" : undefined}
        onClick={onClick}
      >
        <span>{label}</span>
        <strong>{value}</strong>
        <i aria-hidden="true">↗</i>
      </a>
    </li>
  );
};

const ContactPage = ({copy, profileData, language}) => (
  <div className="contact-page route-page">
    <header className="contact-intro" data-reveal>
      <span className="route-kicker">{copy.contact.kicker}</span>
      <code>{copy.contact.route}</code>
      <h1 tabIndex="-1">{copy.contact.title}</h1>
      <p>{copy.contact.intro}</p>
    </header>

    <section
      className="personal-directory"
      aria-label={copy.contact.directoryLabel}
    >
      <p>{copy.contact.preferred}</p>
      <ol>
        <ContactRow
          label={copy.contact.emailLabel}
          value={profileData.email}
          href={`mailto:${profileData.email}`}
          id="contact-email-card"
          onClick={() =>
            trackEvent("contact_attempt", {
              method: "email",
              placement: "contact",
              language
            })
          }
        />
        <ContactRow
          label={copy.contact.githubLabel}
          value={profileData.handle}
          href={profileData.github}
          id="profile-github-contact"
        />
        <ContactRow
          label={copy.contact.linkedinLabel}
          value="/in/berkantkubat"
          href={profileData.linkedin}
          id="profile-linkedin-contact"
        />
        <ContactRow
          label={copy.contact.resumeLabel}
          value="Berkant_KUBAT.pdf"
          href={profileData.resume}
          id="resume-contact"
        />
        <ContactRow
          label={copy.contact.locationLabel}
          value={profileData.location}
        />
      </ol>
    </section>
  </div>
);

const NotFoundPage = ({copy}) => (
  <section className="not-found route-page" aria-labelledby="not-found-heading">
    <span>{copy.notFound.code}</span>
    <h1 id="not-found-heading" tabIndex="-1">
      {copy.notFound.title}
    </h1>
    <p>{copy.notFound.copy}</p>
    <Link to="/">{copy.notFound.action} ↗</Link>
  </section>
);

const PageFooter = ({copy, profileData}) => (
  <footer className="page-footer">
    <span>
      © {new Date().getFullYear()} {profileData.name}
    </span>
    <span>{copy.footer.note}</span>
    <a href="#main-content">{copy.footer.backToTop}</a>
  </footer>
);

function Portfolio2026() {
  const location = useLocation();
  const history = useHistory();
  const pathname =
    location.pathname.length > 1
      ? location.pathname.replace(/\/+$/, "")
      : location.pathname;
  const [language, setLanguage] = React.useState(getInitialLanguage);
  const [theme, setTheme] = React.useState(getInitialTheme);
  const themeTransitionTimerRef = React.useRef(null);
  const [introPlayed, setIntroPlayed] = React.useState(getInitialIntroPlayed);
  const previousPathRef = React.useRef(pathname);
  const trackedPathRef = React.useRef(pathname);
  const reducedMotion = useReducedMotion();
  const copy = uiCopy[language];
  const isTurkish = language === "tr";
  const isHome = pathname === "/";
  const profileData = isTurkish ? {...profile, ...profileTr} : profile;
  const experiencesData = isTurkish ? experiencesTr : experiences;
  const visualProjectsData = isTurkish ? visualProjectsTr : visualProjects;
  const capabilitiesData = isTurkish ? capabilitiesTr : capabilities;
  const educationData = isTurkish ? educationTr : education;
  const routeMeta = copy.meta.routes[pathname] || copy.meta.notFound;
  const knownRoute = Boolean(copy.meta.routes[pathname]);
  const introSettled = introPlayed || reducedMotion;

  React.useEffect(() => {
    if (location.pathname !== pathname) {
      history.replace(`${pathname}${location.search}${location.hash}`);
    }
  }, [history, location.hash, location.pathname, location.search, pathname]);

  React.useEffect(() => {
    document.documentElement.lang = language;
    document.title = routeMeta.title;

    const canonicalUrl = `https://furkanberkant.github.io${
      pathname === "/" ? "/" : pathname
    }`;
    const description = document.querySelector('meta[name="description"]');
    const canonical = document.querySelector('link[rel="canonical"]');
    const robots = document.querySelector('meta[name="robots"]');
    const metadata = [
      ['meta[property="og:title"]', routeMeta.title],
      ['meta[property="og:description"]', routeMeta.description],
      ['meta[property="og:url"]', canonicalUrl],
      ['meta[name="twitter:title"]', routeMeta.title],
      ['meta[name="twitter:description"]', routeMeta.description],
      ['meta[name="twitter:url"]', canonicalUrl]
    ];

    description?.setAttribute("content", routeMeta.description);
    canonical?.setAttribute("href", canonicalUrl);
    robots?.setAttribute(
      "content",
      knownRoute
        ? "index, follow, max-image-preview:large, max-snippet:-1"
        : "noindex, nofollow"
    );
    metadata.forEach(([selector, value]) =>
      document.querySelector(selector)?.setAttribute("content", value)
    );

    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // Storage may be unavailable in privacy-focused browser contexts.
    }
  }, [knownRoute, language, pathname, routeMeta.description, routeMeta.title]);

  React.useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", themeColors[theme]);
    document
      .querySelector('meta[name="color-scheme"]')
      ?.setAttribute("content", theme === "light" ? "light" : "dark");

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Storage may be unavailable in privacy-focused browser contexts.
    }
  }, [theme]);

  React.useEffect(
    () => () => {
      if (themeTransitionTimerRef.current) {
        window.clearTimeout(themeTransitionTimerRef.current);
        themeTransitionTimerRef.current = null;
      }
      delete document.documentElement.dataset.themeTransition;
    },
    []
  );

  React.useEffect(() => {
    const revealItems = Array.from(document.querySelectorAll("[data-reveal]"));
    if (reducedMotion || !window.IntersectionObserver) {
      revealItems.forEach(item => item.classList.add("is-visible"));
      return undefined;
    }

    const observer = new window.IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve?.(entry.target);
          }
        });
      },
      {threshold: 0.08, rootMargin: "0px 0px -48px 0px"}
    );
    revealItems.forEach(item => observer.observe(item));

    return () => observer.disconnect();
  }, [language, pathname, reducedMotion]);

  React.useLayoutEffect(() => {
    if (previousPathRef.current !== pathname) {
      previousPathRef.current = pathname;
      window.scrollTo?.(0, 0);
      document.querySelector("#main-content h1[tabindex='-1']")?.focus({
        preventScroll: true
      });
    }
  }, [pathname]);

  React.useEffect(() => {
    if (trackedPathRef.current !== pathname) {
      trackedPathRef.current = pathname;
      trackEvent("page_view", {
        page_path: pathname,
        page_title: routeMeta.title
      });
    }
  }, [pathname, routeMeta.title]);

  React.useEffect(() => {
    if (!isHome || introPlayed) {
      return undefined;
    }

    if (reducedMotion) {
      rememberHomeIntro();
      setIntroPlayed(true);
      return undefined;
    }

    const timer = window.setTimeout(() => {
      rememberHomeIntro();
      setIntroPlayed(true);
    }, HOME_INTRO_DURATION);
    return () => window.clearTimeout(timer);
  }, [introPlayed, isHome, reducedMotion]);

  const changeLanguage = nextLanguage => {
    if (nextLanguage === language) {
      return;
    }

    trackEvent("language_change", {
      previous_language: language,
      selected_language: nextLanguage
    });
    setLanguage(nextLanguage);
  };

  const changeTheme = nextTheme => {
    if (nextTheme === theme) {
      return;
    }

    if (themeTransitionTimerRef.current) {
      window.clearTimeout(themeTransitionTimerRef.current);
    }
    document.documentElement.dataset.themeTransition = "true";
    themeTransitionTimerRef.current = window.setTimeout(() => {
      delete document.documentElement.dataset.themeTransition;
      themeTransitionTimerRef.current = null;
    }, 240);

    trackEvent("theme_change", {
      previous_theme: theme,
      selected_theme: nextTheme
    });
    setTheme(nextTheme);
  };

  return (
    <div
      className={`portfolio-site ${
        isHome ? "portfolio-site--home" : "portfolio-site--route"
      }`}
      data-language={language}
      data-theme={theme}
      data-route={pathname}
    >
      <a className="skip-link" href="#main-content">
        {copy.skipLink}
      </a>
      <SiteTopbar
        copy={copy}
        pathname={pathname}
        theme={theme}
        language={language}
        onThemeChange={changeTheme}
        onLanguageChange={changeLanguage}
        introPlayed={introSettled}
        isHome={isHome}
      />

      <main
        id="main-content"
        key={pathname}
        className={isHome ? "site-main--home" : "site-main--route"}
      >
        <Switch>
          <Route exact path="/">
            <HomePage
              copy={copy}
              profileData={profileData}
              playIntro={!introSettled}
              theme={theme}
              reducedMotion={reducedMotion}
            />
          </Route>
          <Route exact path="/technologies">
            <TechnologiesPage
              copy={copy}
              capabilitiesData={capabilitiesData}
              reducedMotion={reducedMotion}
            />
          </Route>
          <Route exact path="/projects">
            <ProjectsPage
              copy={copy}
              visualProjectsData={visualProjectsData}
              profileData={profileData}
              reducedMotion={reducedMotion}
            />
          </Route>
          <Route exact path="/experience">
            <ExperiencePage
              copy={copy}
              experiencesData={experiencesData}
              reducedMotion={reducedMotion}
            />
          </Route>
          <Route exact path="/about">
            <AboutPage
              copy={copy}
              profileData={profileData}
              educationData={educationData}
              reducedMotion={reducedMotion}
              theme={theme}
            />
          </Route>
          <Route exact path="/contact">
            <ContactPage
              copy={copy}
              profileData={profileData}
              language={language}
            />
          </Route>
          <Route>
            <NotFoundPage copy={copy} />
          </Route>
        </Switch>
      </main>

      {!isHome && <PageFooter copy={copy} profileData={profileData} />}
      <RouteDock
        copy={copy}
        introPlayed={introSettled}
        isHome={isHome}
        reducedMotion={reducedMotion}
      />
    </div>
  );
}

export default Portfolio2026;
