import React from "react";
import {
  capabilities,
  education,
  engineeringFocus,
  experiences,
  profile,
  systemProjects,
  technologies,
  visualProjects
} from "./portfolioData";
import {
  capabilitiesTr,
  educationTr,
  engineeringFocusTr,
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
import "./Portfolio2026.scss";

const navigationItems = [
  {id: "experience", href: "#experience"},
  {id: "projects", href: "#projects"},
  {id: "capabilities", href: "#capabilities"},
  {id: "about", href: "#about"},
  {id: "contact", href: "#contact"}
];

const ExternalLink = ({href, children, className = "", id}) => (
  <a
    id={id}
    className={className}
    href={href}
    target="_blank"
    rel="noreferrer noopener"
  >
    <span>{children}</span>
    <span aria-hidden="true">↗</span>
  </a>
);

const LanguageSwitch = ({language, onChange, copy}) => (
  <div className="language-switch" role="group" aria-label={copy.label}>
    <button
      className={language === "en" ? "is-active" : ""}
      type="button"
      lang="en"
      aria-label={copy.english}
      aria-pressed={language === "en"}
      onClick={() => onChange("en")}
    >
      EN
    </button>
    <button
      className={language === "tr" ? "is-active" : ""}
      type="button"
      lang="tr"
      aria-label={copy.turkish}
      aria-pressed={language === "tr"}
      onClick={() => onChange("tr")}
    >
      TR
    </button>
  </div>
);

const SectionHeading = ({eyebrow, title, copy, count}) => (
  <div className="section-heading">
    <div>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
    </div>
    <div className="section-heading__side">
      {count && <span className="section-count">{count}</span>}
      {copy && <p>{copy}</p>}
    </div>
  </div>
);

const SystemMap = ({copy}) => (
  <div className="system-map" aria-hidden="true">
    <div className="system-map__header">
      <span>{copy.flow}</span>
      <span className="system-map__status">
        <i />
        {copy.healthy}
      </span>
    </div>
    <div className="system-map__canvas">
      <div className="system-node system-node--api">
        <span>01</span>
        <strong>API</strong>
        <small>{copy.requests}</small>
      </div>
      <div className="system-connection system-connection--one">
        <i />
      </div>
      <div className="system-node system-node--events">
        <span>02</span>
        <strong>{copy.events}</strong>
        <small>Kafka</small>
      </div>
      <div className="system-connection system-connection--two">
        <i />
      </div>
      <div className="system-node system-node--services">
        <span>03</span>
        <strong>{copy.services}</strong>
        <small>Spring</small>
      </div>
      <div className="system-connection system-connection--three">
        <i />
      </div>
      <div className="system-node system-node--data">
        <span>04</span>
        <strong>{copy.data}</strong>
        <small>SQL · NoSQL</small>
      </div>
      <div className="system-map__telemetry">
        <span>{copy.throughput}</span>
        <div>
          <i style={{height: "26%"}} />
          <i style={{height: "48%"}} />
          <i style={{height: "38%"}} />
          <i style={{height: "72%"}} />
          <i style={{height: "56%"}} />
          <i style={{height: "84%"}} />
          <i style={{height: "68%"}} />
          <i style={{height: "92%"}} />
          <i style={{height: "74%"}} />
        </div>
      </div>
    </div>
    <div className="system-map__footer">
      <span>{copy.requestFlow}</span>
      <strong>{copy.async}</strong>
      <span>{copy.observable}</span>
    </div>
  </div>
);

const ProjectMotion = ({project}) => {
  const videoRef = React.useRef(null);

  React.useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return undefined;
    }

    const reducedMotionQuery = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    );
    let isVisible = false;

    const syncPlayback = () => {
      const shouldPlay =
        isVisible && !document.hidden && !reducedMotionQuery?.matches;

      if (shouldPlay) {
        const playRequest = video.play();
        playRequest?.catch?.(() => {});
        return;
      }

      video.pause();
    };

    const observer = window.IntersectionObserver
      ? new window.IntersectionObserver(
          entries => {
            const entry = entries[0];
            isVisible = Boolean(
              entry?.isIntersecting && entry.intersectionRatio >= 0.2
            );
            syncPlayback();
          },
          {threshold: [0, 0.2]}
        )
      : null;

    if (observer) {
      observer.observe(video);
    } else {
      isVisible = true;
      syncPlayback();
    }

    document.addEventListener("visibilitychange", syncPlayback);

    if (reducedMotionQuery?.addEventListener) {
      reducedMotionQuery.addEventListener("change", syncPlayback);
    } else {
      reducedMotionQuery?.addListener?.(syncPlayback);
    }

    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);

      if (reducedMotionQuery?.removeEventListener) {
        reducedMotionQuery.removeEventListener("change", syncPlayback);
      } else {
        reducedMotionQuery?.removeListener?.(syncPlayback);
      }

      video.pause();
    };
  }, []);

  return (
    <div className="project-motion">
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        poster={project.image}
        aria-label={project.imageAlt}
      >
        <source src={project.video} type="video/mp4" />
      </video>
      <img
        className="project-motion__fallback"
        src={project.image}
        alt={project.imageAlt}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
};

const VisualProject = ({project, index, copy}) => (
  <article
    id={`project-${project.id}`}
    className={`visual-project ${
      index % 2 === 1 ? "visual-project--reverse" : ""
    }`}
  >
    <div className="visual-project__media">
      <div className="visual-project__window">
        <div className="window-bar">
          <div>
            <i />
            <i />
            <i />
          </div>
          <span>{project.id}.local</span>
          <span className={project.video ? "window-bar__status" : ""}>
            {project.video ? copy.projects.fps : project.year}
          </span>
        </div>
        {project.video ? (
          <ProjectMotion project={project} />
        ) : (
          <img
            src={project.image}
            alt={project.imageAlt}
            loading="lazy"
            decoding="async"
          />
        )}
      </div>
      {project.gallery && (
        <div className="visual-project__gallery">
          {project.gallery.map(item => (
            <img
              key={item.src}
              src={item.src}
              alt={item.alt}
              loading="lazy"
              decoding="async"
            />
          ))}
        </div>
      )}
    </div>
    <div className="visual-project__content">
      <div className="project-meta">
        <span>{project.number}</span>
        <span>{project.kicker}</span>
        <span>{project.year}</span>
      </div>
      <h3>{project.title}</h3>
      <p className="project-description">{project.description}</p>
      <p className="project-proof">{project.proof}</p>
      <ul
        className="tag-list"
        aria-label={`${project.title}${copy.aria.technologiesSuffix}`}
      >
        {project.tags.map(tag => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
      <div className="project-links">
        {project.links.map((link, linkIndex) => (
          <ExternalLink
            key={link.url}
            id={`project-${project.id}-link-${linkIndex + 1}`}
            href={link.url}
          >
            {link.label}
          </ExternalLink>
        ))}
      </div>
    </div>
  </article>
);

const SystemProject = ({project, copy}) => (
  <article className="system-project">
    <div className="system-project__top">
      <span>{project.number}</span>
      <span>{project.type}</span>
    </div>
    <h3>{project.title}</h3>
    <p>{project.description}</p>
    <div
      className="mini-flow"
      aria-label={`${project.title}${copy.aria.architectureSuffix}`}
    >
      {project.flow.map((item, index) => (
        <React.Fragment key={item}>
          <span>{item}</span>
          {index < project.flow.length - 1 && <i aria-hidden="true">→</i>}
        </React.Fragment>
      ))}
    </div>
    <ul className="tag-list tag-list--compact">
      {project.tags.map(tag => (
        <li key={tag}>{tag}</li>
      ))}
    </ul>
    <ExternalLink
      id={`project-${project.id}-repository`}
      className="system-project__link"
      href={project.link}
    >
      {copy.projects.exploreCode}
    </ExternalLink>
  </article>
);

const ExperienceProduct = ({product, copy}) => (
  <a
    className={`experience-product ${
      product.primary ? "experience-product--primary" : ""
    }`}
    href={product.url}
    target="_blank"
    rel="noreferrer noopener"
    id={`work-${product.id}-google-play`}
    aria-label={`${product.name}${copy.aria.googlePlaySuffix}`}
  >
    <div
      className={`experience-product__media experience-product__media--${product.id}`}
    >
      <span>{product.owner}</span>
      <div className="experience-product__screens" aria-hidden="true">
        {product.images.map((image, index) => (
          <img
            className={index === 1 ? "experience-product__screen--back" : ""}
            src={image.src}
            alt=""
            loading="lazy"
            decoding="async"
            key={image.src}
          />
        ))}
      </div>
      <img
        className="experience-product__icon"
        src={product.icon}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
      />
    </div>
    <div className="experience-product__content">
      <small>{product.focus}</small>
      <div className="experience-product__title">
        <strong>{product.name}</strong>
        <span aria-hidden="true">↗</span>
      </div>
      <p>{product.description}</p>
      <span className="experience-product__source">{product.source}</span>
    </div>
  </a>
);

const TechnologyTile = ({technologyId}) => {
  const technology = technologies[technologyId];

  return (
    <li className="technology-tile">
      <span className="technology-tile__icon">
        <img
          src={technology.icon}
          alt=""
          aria-hidden="true"
          width="44"
          height="44"
          loading="lazy"
          decoding="async"
        />
      </span>
      <span>{technology.name}</span>
    </li>
  );
};

const CapabilityLane = ({capability, index, copy}) => (
  <article className={`capability-lane capability-lane--${capability.id}`}>
    <div className="capability-lane__intro">
      <span>
        {String(index + 1).padStart(2, "0")} / {capability.verb}
      </span>
      <h3>{capability.title}</h3>
      <p>{capability.description}</p>
    </div>
    <div className="capability-lane__tools">
      <ul
        className="technology-list"
        aria-label={`${capability.title}${copy.aria.technologiesSuffix}`}
      >
        {capability.technologyIds.map(technologyId => (
          <TechnologyTile technologyId={technologyId} key={technologyId} />
        ))}
      </ul>
      <ul
        className="practice-list"
        aria-label={`${capability.title}${copy.aria.practicesSuffix}`}
      >
        {capability.practices.map(practice => (
          <li key={practice}>{practice}</li>
        ))}
      </ul>
    </div>
  </article>
);

const AboutProfile = ({copy, profileData}) => (
  <aside className="about-profile" aria-labelledby="about-profile-heading">
    <div className="about-profile__bar">
      <span>{copy.profileCurrent}</span>
      <span>{profileData.location}</span>
    </div>
    <div className="about-profile__intro">
      <span>{copy.profileRole}</span>
      <h3 id="about-profile-heading">{copy.exploring}</h3>
    </div>
    <div className="about-profile__interests">
      <span>{copy.interestsLabel}</span>
      <ol>
        {copy.interests.map((interest, index) => (
          <li key={interest.title}>
            <small>{String(index + 1).padStart(2, "0")}</small>
            <div>
              <strong>{interest.title}</strong>
              <span>{interest.detail}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
    <div className="about-profile__footer">
      <span>{copy.foundation}</span>
      <strong>KTU · 2023</strong>
    </div>
  </aside>
);

function Portfolio2026() {
  const [language, setLanguage] = React.useState(getInitialLanguage);
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState("top");
  const [headerScrolled, setHeaderScrolled] = React.useState(false);
  const mobileMenuButtonRef = React.useRef(null);
  const firstMobileLinkRef = React.useRef(null);
  const copy = uiCopy[language];
  const isTurkish = language === "tr";
  const profileData = isTurkish ? {...profile, ...profileTr} : profile;
  const engineeringFocusData = isTurkish
    ? engineeringFocusTr
    : engineeringFocus;
  const experiencesData = isTurkish ? experiencesTr : experiences;
  const visualProjectsData = isTurkish ? visualProjectsTr : visualProjects;
  const systemProjectsData = isTurkish ? systemProjectsTr : systemProjects;
  const capabilitiesData = isTurkish ? capabilitiesTr : capabilities;
  const educationData = isTurkish ? educationTr : education;

  React.useEffect(() => {
    document.documentElement.lang = language;
    document.title = copy.meta.title;

    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute("content", copy.meta.description);

    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // Storage may be unavailable in privacy-focused browser contexts.
    }
  }, [copy.meta.description, copy.meta.title, language]);

  React.useEffect(() => {
    const updateHeader = () => setHeaderScrolled(window.scrollY > 20);

    updateHeader();
    window.addEventListener("scroll", updateHeader, {passive: true});

    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  React.useEffect(() => {
    if (!window.IntersectionObserver) {
      return undefined;
    }

    const sections = ["top", ...navigationItems.map(item => item.id)]
      .map(id => document.getElementById(id))
      .filter(Boolean);
    const observer = new window.IntersectionObserver(
      entries => {
        const currentSection = entries.find(entry => entry.isIntersecting);

        if (currentSection) {
          const sectionId = currentSection.target.id;
          setActiveSection(sectionId);
        }
      },
      {
        rootMargin: "-22% 0px -70% 0px",
        threshold: 0
      }
    );

    sections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (!mobileNavOpen) {
      return undefined;
    }

    firstMobileLinkRef.current?.focus();

    const closeOnEscape = event => {
      if (event.key === "Escape") {
        setMobileNavOpen(false);
        mobileMenuButtonRef.current?.focus();
      }
    };
    const desktopQuery = window.matchMedia?.("(min-width: 1281px)");
    const closeAtDesktop = event => {
      if (event.matches) {
        setMobileNavOpen(false);
      }
    };

    document.addEventListener("keydown", closeOnEscape);
    if (desktopQuery?.addEventListener) {
      desktopQuery.addEventListener("change", closeAtDesktop);
    } else {
      desktopQuery?.addListener?.(closeAtDesktop);
    }

    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      if (desktopQuery?.removeEventListener) {
        desktopQuery.removeEventListener("change", closeAtDesktop);
      } else {
        desktopQuery?.removeListener?.(closeAtDesktop);
      }
    };
  }, [mobileNavOpen]);

  const closeMobileNav = () => setMobileNavOpen(false);
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
  const selectSection = sectionId => {
    setActiveSection(sectionId);
    closeMobileNav();
  };

  return (
    <div className="portfolio-site" data-language={language}>
      <a className="skip-link" href="#main-content">
        {copy.skipLink}
      </a>

      <header
        className={[
          "site-header",
          headerScrolled ? "site-header--scrolled" : "",
          mobileNavOpen ? "site-header--menu-open" : ""
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <a
          className="brand-mark"
          href="#top"
          aria-label={copy.aria.home}
          onClick={() => selectSection("top")}
        >
          <span className="brand-mark__name">
            <strong>Berkant Kubat</strong>
            <small>{copy.brandRole}</small>
          </span>
        </a>
        <nav className="site-nav" aria-label={copy.navigationLabel}>
          {navigationItems.map(item => {
            const isActive = activeSection === item.id;

            return (
              <a
                className={isActive ? "is-active" : ""}
                href={item.href}
                key={item.href}
                aria-current={isActive ? "location" : undefined}
                onClick={() => setActiveSection(item.id)}
              >
                {copy.navigation[item.id]}
              </a>
            );
          })}
        </nav>
        <button
          className="mobile-menu-toggle"
          type="button"
          aria-controls="mobile-navigation"
          aria-expanded={mobileNavOpen}
          aria-label={mobileNavOpen ? copy.menu.close : copy.menu.open}
          onClick={() => setMobileNavOpen(isOpen => !isOpen)}
          ref={mobileMenuButtonRef}
        >
          <span>
            {mobileNavOpen ? copy.menu.closeLabel : copy.menu.openLabel}
          </span>
          <span className="mobile-menu-toggle__icon" aria-hidden="true">
            <i />
            <i />
          </span>
        </button>
        <div className="header-actions">
          <LanguageSwitch
            language={language}
            onChange={changeLanguage}
            copy={copy.language}
          />
          <ExternalLink id="profile-github-header" href={profileData.github}>
            GitHub
          </ExternalLink>
          <a
            className="header-contact"
            id="contact-email-header"
            href={`mailto:${profileData.email}`}
            onClick={() =>
              trackEvent("contact_attempt", {
                method: "email",
                placement: "header",
                language
              })
            }
          >
            {copy.headerContact}
          </a>
        </div>
        {mobileNavOpen && (
          <div className="mobile-nav-panel" id="mobile-navigation">
            <div className="mobile-nav-panel__meta">
              <span>{copy.navigationMeta}</span>
              <span>{profileData.location}</span>
            </div>
            <nav className="mobile-nav" aria-label={copy.mobileNavigationLabel}>
              {navigationItems.map((item, index) => {
                const isActive = activeSection === item.id;

                return (
                  <a
                    className={isActive ? "is-active" : ""}
                    href={item.href}
                    key={item.href}
                    aria-current={isActive ? "location" : undefined}
                    onClick={() => selectSection(item.id)}
                    ref={index === 0 ? firstMobileLinkRef : null}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{copy.navigation[item.id]}</strong>
                    <i aria-hidden="true">↘</i>
                  </a>
                );
              })}
            </nav>
            <div className="mobile-nav-panel__footer">
              <p>{copy.mobileSummary}</p>
              <div>
                <ExternalLink
                  id="profile-github-mobile-menu"
                  href={profileData.github}
                >
                  GitHub
                </ExternalLink>
                <ExternalLink id="resume-mobile-menu" href={profileData.resume}>
                  {copy.resume}
                </ExternalLink>
              </div>
            </div>
          </div>
        )}
      </header>

      <main id="main-content">
        <section className="hero" id="top">
          <div className="hero__grid" aria-hidden="true" />
          <div className="hero__content">
            <div className="availability">
              <i />
              <span>{copy.hero.availability}</span>
            </div>
            <span className="eyebrow">
              {copy.hero.eyebrow} · {profileData.location}
            </span>
            <h1>
              {copy.hero.title} <span>{copy.hero.titleAccent}</span>
            </h1>
            <p className="hero__intro">{copy.hero.intro}</p>
            <div className="hero__actions">
              <a className="button button--primary" href="#projects">
                <span>{copy.hero.projectsAction}</span>
                <span aria-hidden="true">↓</span>
              </a>
              <ExternalLink
                id="profile-linkedin-hero"
                className="button button--ghost"
                href={profileData.linkedin}
              >
                LinkedIn
              </ExternalLink>
              <ExternalLink
                id="resume-hero"
                className="text-link"
                href={profileData.resume}
              >
                {copy.resume}
              </ExternalLink>
            </div>
          </div>
          <div className="hero__visual">
            <SystemMap copy={copy.systemMap} />
          </div>
          <div className="hero__rail" aria-hidden="true">
            <span>{copy.hero.rail}</span>
          </div>
        </section>

        <section className="impact" aria-label={copy.hero.focusLabel}>
          {engineeringFocusData.map(item => (
            <div className="impact-card" key={item.value}>
              <strong>{item.value}</strong>
              <div>
                <span>{item.label}</span>
                <small>{item.detail}</small>
              </div>
            </div>
          ))}
        </section>

        <section className="section experience-section" id="experience">
          <SectionHeading
            eyebrow={copy.experience.eyebrow}
            title={copy.experience.title}
            copy={copy.experience.copy}
            count={copy.experience.count}
          />
          <div className="experience-list">
            {experiencesData.map((experience, index) => (
              <article className="experience-card" key={experience.company}>
                <div className="experience-card__index">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div className="experience-card__identity">
                  <span>{experience.type}</span>
                  <h3>{experience.company}</h3>
                  <p>{experience.role}</p>
                  <div className="experience-card__meta">
                    <span>{experience.workplace}</span>
                    <time>{experience.period}</time>
                  </div>
                </div>
                <div className="experience-card__body">
                  <p>{experience.summary}</p>
                  <ul>
                    {experience.highlights.map(highlight => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                  {experience.products && (
                    <div className="experience-products">
                      <span>{copy.experience.productsLabel}</span>
                      <div className="experience-products__grid">
                        {experience.products.map(product => (
                          <ExperienceProduct
                            product={product}
                            copy={copy}
                            key={product.name}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section projects-section" id="projects">
          <SectionHeading
            eyebrow={copy.projects.eyebrow}
            title={copy.projects.title}
            count={copy.projects.count}
          />
          <div className="visual-projects">
            {visualProjectsData.map((project, index) => (
              <VisualProject
                key={project.id}
                project={project}
                index={index}
                copy={copy}
              />
            ))}
          </div>
          <div className="system-projects">
            {systemProjectsData.map(project => (
              <SystemProject key={project.id} project={project} copy={copy} />
            ))}
          </div>
          <div className="all-projects">
            <ExternalLink
              id="github-all-repositories"
              href={`${profileData.github}?tab=repositories`}
            >
              {copy.projects.allProjects}
            </ExternalLink>
          </div>
        </section>

        <section className="section capabilities-section" id="capabilities">
          <SectionHeading
            eyebrow={copy.capabilities.eyebrow}
            title={copy.capabilities.title}
            copy={copy.capabilities.copy}
            count={copy.capabilities.count}
          />
          <div className="capability-lanes">
            {capabilitiesData.map((capability, index) => (
              <CapabilityLane
                capability={capability}
                index={index}
                copy={copy}
                key={capability.id}
              />
            ))}
          </div>
        </section>

        <section className="section about-section" id="about">
          <SectionHeading
            eyebrow={copy.about.eyebrow}
            title={copy.about.title}
            copy={copy.about.copy}
            count={copy.about.count}
          />
          <div className="about-glass">
            <div className="about-glass__identity">
              <AboutProfile copy={copy.about} profileData={profileData} />
            </div>
            <div className="about-glass__story">
              <div className="about-statement">
                {copy.about.story.map(paragraph => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <aside
                className="education-list"
                aria-labelledby="education-heading"
              >
                <h3 className="eyebrow" id="education-heading">
                  {copy.about.education}
                </h3>
                {educationData.map(item => (
                  <article key={item.school}>
                    <time>{item.period}</time>
                    <div>
                      <h3>{item.school}</h3>
                      <p>{item.field}</p>
                    </div>
                  </article>
                ))}
              </aside>
            </div>
          </div>
        </section>

        <section
          className="contact-section"
          id="contact"
          aria-labelledby="contact-heading"
        >
          <div className="contact-section__noise" aria-hidden="true" />
          <div className="contact-section__intro">
            <span className="eyebrow">{copy.contact.eyebrow}</span>
            <h2 id="contact-heading">
              {copy.contact.title}
              <span>{copy.contact.titleAccent}</span>
            </h2>
            <p>{copy.contact.copy}</p>
          </div>
          <aside
            className="contact-card"
            aria-labelledby="contact-card-heading"
          >
            <header className="contact-card__status">
              <span>{copy.contact.availableFor}</span>
              <h3 id="contact-card-heading">
                <i aria-hidden="true" />
                {copy.contact.role}
              </h3>
            </header>
            <a
              className="contact-card__email"
              id="contact-email-card"
              href={`mailto:${profileData.email}`}
              onClick={() =>
                trackEvent("contact_attempt", {
                  method: "email",
                  placement: "contact",
                  language
                })
              }
            >
              <span>{copy.contact.emailLabel}</span>
              <strong>{profileData.email}</strong>
              <span aria-hidden="true">↗</span>
            </a>
            <nav
              className="contact-card__links"
              aria-label={copy.contact.linksLabel}
            >
              <ExternalLink
                id="profile-linkedin-contact"
                href={profileData.linkedin}
              >
                LinkedIn
              </ExternalLink>
              <ExternalLink
                id="profile-github-contact"
                href={profileData.github}
              >
                GitHub
              </ExternalLink>
              <ExternalLink id="resume-contact" href={profileData.resume}>
                {copy.resume}
              </ExternalLink>
            </nav>
            <footer className="contact-card__footer">
              <span>{profileData.location}</span>
              <span>{copy.contact.preferred}</span>
            </footer>
          </aside>
        </section>
      </main>

      <footer className="site-footer">
        <div>
          <strong>
            © {new Date().getFullYear()} {profileData.name}
          </strong>
          <span>
            {copy.footer.role} · {profileData.location}
          </span>
        </div>
        <a href="#top">{copy.footer.backToTop}</a>
      </footer>
    </div>
  );
}

export default Portfolio2026;
