import React from "react";
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
  systemProjects,
  technologies,
  visualProjects
} from "./portfolioData";
import {
  capabilitiesTr,
  educationTr,
  experiencesTr,
  profileTr,
  systemProjectsTr,
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

const technologyStageSlots = {
  1: [{x: 18, y: 34}],
  2: [
    {x: 17, y: 28},
    {x: 78, y: 28}
  ],
  3: [
    {x: 16, y: 22},
    {x: 78, y: 35},
    {x: 18, y: 66}
  ],
  4: [
    {x: 16, y: 20},
    {x: 78, y: 20},
    {x: 13, y: 58},
    {x: 78, y: 58}
  ],
  5: [
    {x: 15, y: 17},
    {x: 77, y: 17},
    {x: 11, y: 45},
    {x: 79, y: 45},
    {x: 69, y: 70}
  ],
  6: [
    {x: 15, y: 16},
    {x: 76, y: 16},
    {x: 10, y: 43},
    {x: 80, y: 42},
    {x: 17, y: 70},
    {x: 71, y: 70}
  ]
};

const resolveTechnologyStageSlot = (count, index) => {
  const slots = technologyStageSlots[count] || technologyStageSlots[6];
  return slots[index % slots.length];
};

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

const RouteDock = ({copy, introPlayed, isHome}) => {
  const [hoveredIndex, setHoveredIndex] = React.useState(null);
  const introPending = isHome && !introPlayed;

  return (
    <nav
      className={`route-dock ${introPending ? "route-dock--intro" : ""}`}
      aria-label={copy.navigationLabel}
      aria-hidden={introPending || undefined}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <ol>
        {navigationItems.map((item, index) => {
          const distance =
            hoveredIndex === null ? -1 : Math.abs(hoveredIndex - index);

          return (
            <li key={item.href} data-distance={distance}>
              <NavLink
                exact={item.href === "/"}
                activeClassName="is-active"
                to={item.href}
                onMouseEnter={() => setHoveredIndex(index)}
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
          );
        })}
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
      <p className="site-route" aria-label={copy.routeLabel}>
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

const ParticleSpiral = ({theme, reducedMotion, playIntro}) => {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext?.("2d");
    if (!canvas || !context) {
      return undefined;
    }

    let animationFrame;
    let particles = [];
    let width = 0;
    let height = 0;
    let startTime = 0;
    const pointer = {x: 0, y: 0, targetX: 0, targetY: 0};
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    const seeded = value => {
      const result = Math.sin(value * 78.233) * 43758.5453;
      return result - Math.floor(result);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(rect.width, 1);
      height = Math.max(rect.height, 1);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      const count = Math.max(180, Math.min(420, Math.round(width / 3.5)));
      const armCount = width < 640 ? 3 : 4;

      particles = Array.from({length: count}, (_, index) => ({
        arm: index % armCount,
        armCount,
        depth: Math.floor(index / armCount) / Math.ceil(count / armCount),
        jitter: (seeded(index + 1) - 0.5) * 0.34,
        size: 0.45 + seeded(index + 17) * 1.2,
        alpha: 0.22 + seeded(index + 31) * 0.62,
        stretch: 0.92 + seeded(index + 53) * 0.18,
        trail: index % 9 === 0
      }));
    };

    const onPointerMove = event => {
      pointer.targetX =
        (event.clientX / Math.max(window.innerWidth, 1) - 0.5) * 2;
      pointer.targetY =
        (event.clientY / Math.max(window.innerHeight, 1) - 0.5) * 2;
    };

    const projectPoint = (
      particle,
      depth,
      elapsed,
      reveal,
      centerX,
      centerY,
      maxRadius
    ) => {
      const rotation = reducedMotion ? 0.42 : elapsed * 0.000055;
      const angle =
        (particle.arm / particle.armCount) * Math.PI * 2 +
        depth * Math.PI * 5.2 +
        rotation +
        particle.jitter;
      const perspective = 0.16 + Math.pow(depth, 1.55) * 0.84;
      const radius =
        (16 + Math.pow(depth, 1.45) * maxRadius) *
        particle.stretch *
        (0.16 + reveal * 0.84);

      return {
        x:
          centerX +
          Math.cos(angle) * radius * 1.12 +
          pointer.x * 18 * perspective,
        y:
          centerY +
          Math.sin(angle) * radius * 0.53 +
          (depth - 0.5) * maxRadius * 0.08 +
          pointer.y * 12 * perspective,
        perspective
      };
    };

    const draw = timestamp => {
      if (!startTime) {
        startTime = timestamp || 1;
      }

      const elapsed = (timestamp || 1800) - startTime;
      const intro =
        reducedMotion || !playIntro
          ? 1
          : Math.min(Math.max(elapsed / 360, 0), 1);
      const eased = 1 - Math.pow(1 - intro, 3);
      const computed = window.getComputedStyle(canvas);
      const color =
        computed.getPropertyValue("--particle-color").trim() || "#f2a638";
      const highlight =
        computed.getPropertyValue("--spiral-highlight").trim() || color;
      const orbit =
        computed.getPropertyValue("--spiral-orbit").trim() || highlight;
      const centerX = width * 0.5;
      const centerY = height * 0.49;
      const maxRadius = Math.min(
        510,
        Math.max(210, Math.min(width, height) * 0.58)
      );
      const travel = reducedMotion ? 0.18 : elapsed * 0.000032;

      context.clearRect(0, 0, width, height);
      pointer.x += (pointer.targetX - pointer.x) * 0.045;
      pointer.y += (pointer.targetY - pointer.y) * 0.045;

      context.save();
      context.translate(centerX + pointer.x * 5, centerY + pointer.y * 4);
      context.scale(1.1, 0.54);
      context.rotate(reducedMotion ? -0.08 : elapsed * 0.000018 - 0.08);
      context.strokeStyle = orbit;
      context.lineWidth = 0.75;
      [0.32, 0.54, 0.78, 1].forEach((scale, index) => {
        context.globalAlpha = (0.035 + index * 0.012) * eased;
        context.beginPath();
        context.arc(
          0,
          0,
          maxRadius * scale,
          Math.PI * (0.12 + index * 0.16),
          Math.PI * (1.18 + index * 0.24)
        );
        context.stroke();
      });
      context.restore();

      particles.forEach(particle => {
        const depth = (particle.depth + travel) % 1;
        const point = projectPoint(
          particle,
          depth,
          elapsed,
          eased,
          centerX,
          centerY,
          maxRadius
        );

        if (particle.trail && depth > 0.035) {
          const previous = projectPoint(
            particle,
            depth - 0.028,
            elapsed,
            eased,
            centerX,
            centerY,
            maxRadius
          );
          context.globalAlpha =
            particle.alpha * point.perspective * eased * 0.34;
          context.strokeStyle = highlight;
          context.lineWidth = 0.45 + point.perspective * 0.9;
          context.beginPath();
          context.moveTo(previous.x, previous.y);
          context.lineTo(point.x, point.y);
          context.stroke();
        }

        context.globalAlpha =
          particle.alpha * (0.18 + point.perspective * 0.82) * eased;
        context.fillStyle = color;
        context.beginPath();
        context.arc(
          point.x,
          point.y,
          particle.size * (0.42 + point.perspective * 1.18),
          0,
          Math.PI * 2
        );
        context.fill();
      });

      [0, 1].forEach(arm => {
        const head = (0.58 + travel * 3.2 + arm * 0.31) % 1;
        context.globalAlpha = 0.2 * eased;
        context.strokeStyle = highlight;
        context.lineWidth = arm === 0 ? 1.2 : 0.75;
        context.beginPath();
        Array.from({length: 18}, (_, index) => head - index * 0.008)
          .filter(depth => depth > 0.04)
          .forEach((depth, index) => {
            const point = projectPoint(
              {arm, armCount: 4, jitter: 0, stretch: 1},
              depth,
              elapsed,
              eased,
              centerX,
              centerY,
              maxRadius
            );
            if (index === 0) {
              context.moveTo(point.x, point.y);
            } else {
              context.lineTo(point.x, point.y);
            }
          });
        context.stroke();
      });
      context.globalAlpha = 1;

      if (!reducedMotion && process.env.NODE_ENV !== "test") {
        animationFrame = window.requestAnimationFrame(draw);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, {passive: true});
    draw(reducedMotion ? 1800 : performance.now());

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      if (animationFrame) {
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
  const [sceneStatus, setSceneStatus] = React.useState("loading");
  const stageRef = React.useRef(null);
  const canvasRef = React.useRef(null);

  const active =
    capabilitiesData.find(capability => capability.id === activeId) ||
    capabilitiesData[0];
  const resolvedTechnologyId = active.technologyIds.includes(activeTechnologyId)
    ? activeTechnologyId
    : active.technologyIds[0];
  const activeTechnology = technologies[resolvedTechnologyId];

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

  const selectGroup = capability => {
    setActiveId(capability.id);
    setActiveTechnologyId(capability.technologyIds[0]);
  };

  const selectTechnology = technologyId => {
    setActiveTechnologyId(technologyId);
  };

  const moveTabFocus = (event, currentIndex) => {
    const destinations = {
      ArrowRight: (currentIndex + 1) % capabilitiesData.length,
      ArrowDown: (currentIndex + 1) % capabilitiesData.length,
      ArrowLeft:
        (currentIndex - 1 + capabilitiesData.length) % capabilitiesData.length,
      ArrowUp:
        (currentIndex - 1 + capabilitiesData.length) % capabilitiesData.length,
      Home: 0,
      End: capabilitiesData.length - 1
    };
    const nextIndex = destinations[event.key];
    if (nextIndex === undefined) return;
    event.preventDefault();
    const nextCapability = capabilitiesData[nextIndex];
    selectGroup(nextCapability);
    document.getElementById(`technology-tab-${nextCapability.id}`)?.focus();
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

      <div className="technology-explorer__body">
        <div className="technology-panel">
          <p className="technology-panel__label">{copy.chooseGroup}</p>
          <div
            className="technology-panel__groups"
            role="tablist"
            aria-label={copy.chooseGroup}
          >
            {capabilitiesData.map((capability, index) => (
              <button
                type="button"
                role="tab"
                key={capability.id}
                id={`technology-tab-${capability.id}`}
                aria-selected={capability.id === active.id}
                aria-controls="technology-scene"
                tabIndex={capability.id === active.id ? 0 : -1}
                className={capability.id === active.id ? "is-active" : ""}
                onClick={() => selectGroup(capability)}
                onKeyDown={event => moveTabFocus(event, index)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{copy.groups[capability.id]}</strong>
                <small>
                  {String(capability.technologyIds.length).padStart(2, "0")}{" "}
                  {copy.toolsLabel}
                </small>
              </button>
            ))}
          </div>

          <ul
            className="technology-panel__nodes"
            aria-label={copy.groupTechnologies}
          >
            {active.technologyIds.map(technologyId => {
              const technology = technologies[technologyId];
              const selected = technologyId === resolvedTechnologyId;
              return (
                <li
                  key={technologyId}
                  className={selected ? "is-selected" : ""}
                >
                  <button
                    type="button"
                    data-technology-id={technologyId}
                    aria-pressed={selected}
                    onClick={() => selectTechnology(technologyId)}
                    onMouseEnter={() => selectTechnology(technologyId)}
                    onFocus={() => selectTechnology(technologyId)}
                  >
                    <img src={technology.icon} alt="" aria-hidden="true" />
                    <span>{technology.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div
          className="technology-stage technology-stage--spline"
          ref={stageRef}
          data-reduced-motion={reducedMotion ? "true" : "false"}
          data-scene-ready={sceneStatus === "ready" ? "true" : "false"}
          data-scene-status={sceneStatus}
        >
          <div className="technology-stage__spotlight" aria-hidden="true" />
          <canvas
            className="technology-stage__canvas technology-stage__canvas--spline"
            ref={canvasRef}
            aria-hidden="true"
          />

          <div className="technology-stage__group-label" aria-hidden="true">
            <span>{copy.groups[active.id]}</span>
            <small>
              {String(active.technologyIds.length).padStart(2, "0")}{" "}
              {copy.toolsLabel}
            </small>
          </div>

          <div
            className="technology-stage__stack"
            key={active.id}
            aria-label={copy.groupTechnologies}
          >
            {active.technologyIds.map((technologyId, index) => {
              const technology = technologies[technologyId];
              const selected = technologyId === resolvedTechnologyId;
              const slot = resolveTechnologyStageSlot(
                active.technologyIds.length,
                index
              );

              return (
                <button
                  type="button"
                  key={technologyId}
                  className={selected ? "is-selected" : ""}
                  data-floating-technology-id={technologyId}
                  aria-pressed={selected}
                  style={{
                    "--technology-token-x": `${slot.x}%`,
                    "--technology-token-y": `${slot.y}%`,
                    "--technology-token-delay": `${index * 45}ms`
                  }}
                  onClick={() => selectTechnology(technologyId)}
                  onMouseEnter={() => selectTechnology(technologyId)}
                  onFocus={() => selectTechnology(technologyId)}
                >
                  <img src={technology.icon} alt="" aria-hidden="true" />
                  <span>{technology.name}</span>
                </button>
              );
            })}
          </div>

          <div className="technology-stage__loader" aria-hidden="true">
            <span />
          </div>

          <div
            className="technology-stage__readout"
            id="technology-scene"
            role="tabpanel"
            aria-labelledby={`technology-tab-${active.id}`}
            aria-live="polite"
          >
            <span>{copy.selectedTechnology}</span>
            <div className="technology-stage__readout-row">
              <img src={activeTechnology.icon} alt="" aria-hidden="true" />
              <strong>{activeTechnology.name}</strong>
            </div>
            <small>
              {copy.groups[active.id]}
              <i aria-hidden="true"> · </i>
              {String(
                active.technologyIds.indexOf(resolvedTechnologyId) + 1
              ).padStart(2, "0")}
              /{String(active.technologyIds.length).padStart(2, "0")}
            </small>
          </div>
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
  const compact = viewportWidth <= 820;
  const entrySpan = Math.max(
    safeViewportHeight * 0.74,
    Math.min(safeHeight, safeViewportHeight) * 0.82
  );
  const linearProgress = clampProjectProgress(
    (safeViewportHeight * 0.98 - top) / entrySpan
  );
  const progress = linearProgress * linearProgress * (3 - 2 * linearProgress);
  const tilt = (1 - progress) * (compact ? 7.5 : 14);
  const scaleStart = compact ? 0.92 : 0.86;
  const shift = (1 - progress) * (compact ? 30 : 64);

  return {
    progress,
    tilt: `${tilt.toFixed(2)}deg`,
    scale: (scaleStart + progress * (1 - scaleStart)).toFixed(4),
    shift: `${shift.toFixed(2)}px`,
    galleryShift: `${((1 - progress) * (compact ? 18 : 34)).toFixed(2)}px`,
    opacity: (0.92 + progress * 0.08).toFixed(3)
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
  systemProjectsData,
  profileData,
  reducedMotion
}) => {
  const projects = [
    ...visualProjectsData.map(project => ({...project, kind: "visual"})),
    ...systemProjectsData.map(project => ({...project, kind: "system"}))
  ];

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

const ExperiencePage = ({copy, experiencesData}) => (
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
    >
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
                {(experienceTechnologies[experience.company] || []).join(" · ")}
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

const SignatureMark = ({label}) => (
  <div className="signature-mark" role="img" aria-label={label}>
    <svg viewBox="0 0 420 150" aria-hidden="true" focusable="false">
      <path d="M28 112 C34 75 38 28 49 22 C62 15 50 100 43 119 C55 84 79 61 96 70 C118 82 93 119 56 110" />
      <path d="M116 106 C130 84 145 71 157 74 C169 77 165 100 148 108 C132 115 124 102 132 88" />
      <path d="M177 111 C181 90 185 72 188 66 M186 80 C200 65 217 68 211 87 C207 99 204 106 203 111" />
      <path d="M230 108 C237 83 246 70 258 72 C271 74 270 95 258 105 C246 116 232 106 239 91" />
      <path d="M286 34 C282 61 279 87 279 108 M280 91 C294 72 309 68 314 77 C321 90 304 108 282 106" />
      <path d="M326 77 C341 67 355 70 353 84 C351 98 337 108 326 102 C317 96 322 78 338 73 M356 109 C368 102 378 101 390 104" />
      <path
        className="signature-mark__swoop"
        d="M41 129 C140 139 265 134 391 115"
      />
    </svg>
    <span>{"// berkant"}</span>
  </div>
);

const WovenSample = () => (
  <div className="woven-sample" aria-hidden="true">
    <div className="woven-sample__threads" />
    <span>BK / ABOUT</span>
    <strong>
      BERKANT
      <br />
      KUBAT
    </strong>
    <small>PERSONAL NOTES</small>
  </div>
);

const AboutPage = ({copy, profileData, educationData}) => (
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
        <WovenSample />
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
  const systemProjectsData = isTurkish ? systemProjectsTr : systemProjects;
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
    }, 420);

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
              systemProjectsData={systemProjectsData}
              profileData={profileData}
              reducedMotion={reducedMotion}
            />
          </Route>
          <Route exact path="/experience">
            <ExperiencePage copy={copy} experiencesData={experiencesData} />
          </Route>
          <Route exact path="/about">
            <AboutPage
              copy={copy}
              profileData={profileData}
              educationData={educationData}
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
      <RouteDock copy={copy} introPlayed={introSettled} isHome={isHome} />
    </div>
  );
}

export default Portfolio2026;
