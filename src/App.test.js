import React from "react";
import ReactDOM from "react-dom";
import {act} from "react-dom/test-utils";
import App from "./App";
import {shouldEnableAnalytics, trackEvent} from "./analytics";
import {
  HOME_INTRO_DURATION,
  HOME_INTRO_SESSION_KEY,
  THEME_STORAGE_KEY,
  resolveDockMagnification,
  resolveProjectPerspective,
  resolveSpiralDot,
  resolveTimelineProgress,
  resolveInitialTheme
} from "./Portfolio2026";
import {
  LANGUAGE_STORAGE_KEY,
  resolveInitialLanguage,
  uiCopy
} from "./portfolioI18n";

jest.mock("three", () => ({}));

let reduceMotion = false;
let intersectionObservers = [];

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: query === "(prefers-reduced-motion: reduce)" && reduceMotion,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
});

Object.defineProperty(window.HTMLMediaElement.prototype, "muted", {
  writable: true,
  value: false
});

window.IntersectionObserver = jest.fn();
window.HTMLMediaElement.prototype.play = jest.fn();
window.HTMLMediaElement.prototype.pause = jest.fn();
window.scrollTo = jest.fn();
window.requestAnimationFrame = jest.fn(callback => callback());
window.cancelAnimationFrame = jest.fn();

const ensureHeadElement = (selector, attributes) => {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement(attributes.tag || "meta");
    Object.entries(attributes).forEach(([name, value]) => {
      if (name !== "tag") {
        element.setAttribute(name, value);
      }
    });
    document.head.appendChild(element);
  }

  return element;
};

const renderAt = (path = "/") => {
  window.history.replaceState({}, "", path);
  const div = document.createElement("div");
  document.body.appendChild(div);

  act(() => {
    ReactDOM.render(<App />, div);
  });

  return {
    div,
    cleanup() {
      act(() => {
        ReactDOM.unmountComponentAtNode(div);
      });
      div.remove();
    }
  };
};

const click = element => {
  act(() => {
    element.dispatchEvent(
      new MouseEvent("click", {bubbles: true, cancelable: true, button: 0})
    );
  });
};

const keyDown = (element, key) => {
  act(() => {
    element.dispatchEvent(
      new KeyboardEvent("keydown", {bubbles: true, cancelable: true, key})
    );
  });
};

beforeEach(() => {
  delete window.gtag;
  delete window.dataLayer;
  reduceMotion = false;
  document.body.innerHTML = "";
  window.history.replaceState({}, "", "/");
  window.localStorage.clear();
  window.sessionStorage.clear();
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, "en");
  window.localStorage.setItem(THEME_STORAGE_KEY, "dark");
  document.documentElement.lang = "en";
  document.documentElement.dataset.theme = "dark";
  window.matchMedia.mockImplementation(query => ({
    matches: query === "(prefers-reduced-motion: reduce)" && reduceMotion,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }));
  window.scrollTo.mockClear();
  window.requestAnimationFrame.mockClear();
  window.cancelAnimationFrame.mockClear();

  ensureHeadElement('meta[name="description"]', {
    name: "description",
    content: ""
  });
  ensureHeadElement('meta[name="robots"]', {
    name: "robots",
    content: "index, follow"
  });
  ensureHeadElement('link[rel="canonical"]', {
    tag: "link",
    rel: "canonical",
    href: ""
  });

  intersectionObservers = [];
  window.IntersectionObserver.mockClear();
  window.IntersectionObserver.mockImplementation((callback, options) => {
    const observedTargets = [];
    const observer = {
      callback,
      options,
      observedTargets,
      observe: jest.fn(target => observedTargets.push(target)),
      unobserve: jest.fn(),
      disconnect: jest.fn()
    };

    intersectionObservers.push(observer);
    return observer;
  });
  window.HTMLMediaElement.prototype.play.mockClear();
  window.HTMLMediaElement.prototype.play.mockImplementation(() =>
    Promise.resolve()
  );
  window.HTMLMediaElement.prototype.pause.mockClear();
});

it("renders the sequenced identity home without portfolio previews", () => {
  const {div, cleanup} = renderAt("/");

  expect(div.querySelector(".identity-sequence__command").textContent).toBe(
    "$ whoami"
  );
  expect(div.querySelector("h1").textContent).toBe("/berkant.dev_");
  expect(div.querySelectorAll(".identity-sequence__glyph")).toHaveLength(13);
  expect(div.textContent).not.toContain("Berkant Kubat");
  expect(div.textContent).not.toContain("Software Engineer / Java Backend");
  expect(div.textContent).not.toContain("Systems · data · reliability");
  expect(div.querySelector(".identity-sequence__person")).toBeNull();
  expect(div.querySelector(".identity-sequence__coordinate")).toBeNull();
  expect(div.querySelector(".identity-sequence__spiral")).not.toBeNull();
  expect(div.querySelector("#profile-github-home")).not.toBeNull();
  expect(div.querySelector("#profile-linkedin-home")).not.toBeNull();
  expect(div.querySelectorAll(".route-dock__tooltip")).toHaveLength(6);
  expect(
    Array.from(div.querySelectorAll(".route-dock__tooltip")).map(
      tooltip => tooltip.textContent
    )
  ).toEqual([
    "Home",
    "Technologies",
    "Projects",
    "Experience",
    "About",
    "Contact"
  ]);
  expect(div.querySelector(".page-footer")).toBeNull();
  expect(div.querySelector(".project-chapter")).toBeNull();
  expect(div.querySelector(".chronicle-entry")).toBeNull();
  expect(div.querySelector(".technology-index")).toBeNull();
  expect(div.querySelector(".about-collage")).toBeNull();
  expect(div.querySelector(".personal-directory")).toBeNull();

  cleanup();
});

it("stages the home intro once per session and skips it on return", () => {
  jest.useFakeTimers();

  try {
    let rendered = renderAt("/");
    const handle = rendered.div.querySelector(".identity-sequence__handle");

    expect(
      rendered.div.querySelector(".identity-sequence--play")
    ).not.toBeNull();
    expect(rendered.div.querySelector(".site-topbar--intro")).not.toBeNull();
    expect(rendered.div.querySelector(".route-dock--intro")).not.toBeNull();
    expect(handle.getAttribute("aria-label")).toBe("/berkant.dev_");
    expect(
      rendered.div.querySelector(".route-dock a").getAttribute("tabindex")
    ).toBe("-1");
    expect(
      rendered.div
        .querySelector(".site-controls button")
        .getAttribute("tabindex")
    ).toBe("-1");

    act(() => {
      jest.advanceTimersByTime(HOME_INTRO_DURATION - 1);
    });
    expect(
      rendered.div.querySelector(".identity-sequence--play")
    ).not.toBeNull();
    expect(window.sessionStorage.getItem(HOME_INTRO_SESSION_KEY)).toBeNull();

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(
      rendered.div.querySelector(".identity-sequence--settled")
    ).not.toBeNull();
    expect(rendered.div.querySelector(".site-topbar--intro")).toBeNull();
    expect(rendered.div.querySelector(".route-dock--intro")).toBeNull();
    expect(
      rendered.div.querySelector(".route-dock").hasAttribute("aria-hidden")
    ).toBe(false);
    expect(
      rendered.div.querySelector(".route-dock a").getAttribute("tabindex")
    ).toBeNull();
    expect(window.sessionStorage.getItem(HOME_INTRO_SESSION_KEY)).toBe("true");

    click(rendered.div.querySelector(".route-dock a[href='/projects']"));
    click(rendered.div.querySelector(".route-dock a[href='/']"));
    expect(
      rendered.div.querySelector(".identity-sequence--settled")
    ).not.toBeNull();
    rendered.cleanup();

    rendered = renderAt("/");
    expect(
      rendered.div.querySelector(".identity-sequence--settled")
    ).not.toBeNull();
    expect(rendered.div.querySelector(".site-topbar--intro")).toBeNull();
    expect(rendered.div.querySelector(".route-dock--intro")).toBeNull();
    rendered.cleanup();
  } finally {
    jest.useRealTimers();
  }
});

it("renders every route independently with the preserved real content", () => {
  let rendered = renderAt("/technologies");
  expect(rendered.div.querySelector(".technologies-page h1").textContent).toBe(
    "Technologies"
  );
  expect(uiCopy.en.technologies.title).toBe("Technologies");
  expect(uiCopy.tr.technologies.title).toBe("Teknolojiler");
  expect(
    rendered.div.querySelectorAll(
      ".technology-hologram__groups [data-hologram-group-id]"
    )
  ).toHaveLength(4);
  expect(rendered.div.querySelector(".technology-index")).toBeNull();
  expect(
    rendered.div.querySelector(".technology-explorer__header").textContent
  ).toContain("17 technologies");
  expect(rendered.div.textContent).not.toContain("Spring Boot");

  click(
    rendered.div.querySelector(
      ".technology-hologram__groups [data-hologram-group-id='build']"
    )
  );

  expect(rendered.div.textContent).toContain("Spring Boot");
  expect(rendered.div.querySelector(".project-chapter")).toBeNull();
  rendered.cleanup();

  rendered = renderAt("/projects");
  expect(rendered.div.querySelector(".projects-page h1").textContent).toBe(
    "Selected Projects"
  );
  expect(uiCopy.en.projects.title).toBe("Selected Projects");
  expect(uiCopy.tr.projects.title).toBe("Seçili projeler");
  expect(
    JSON.stringify({en: uiCopy.en.projects, tr: uiCopy.tr.projects})
  ).not.toMatch(/staged|sahne/i);
  expect(rendered.div.querySelectorAll(".project-chapter")).toHaveLength(3);
  expect(
    Array.from(rendered.div.querySelectorAll(".project-chapter")).map(
      chapter => chapter.dataset.layout
    )
  ).toEqual(["feature", "split", "panorama"]);
  expect(rendered.div.querySelectorAll(".project-stage")).toHaveLength(3);
  expect(rendered.div.textContent).toContain("NewDrive");
  expect(rendered.div.textContent).not.toContain("Fund Search");
  expect(rendered.div.textContent).not.toContain("Randevio");
  expect(
    rendered.div.querySelector(
      "video[src='/images/projects/reelshelf-motion.mp4']"
    )
  ).not.toBeNull();
  expect(
    rendered.div.querySelector("a[href='https://tugrulhukuk.av.tr/']")
  ).not.toBeNull();
  expect(rendered.div.querySelector(".architecture-plate")).toBeNull();
  rendered.cleanup();

  rendered = renderAt("/experience");
  expect(rendered.div.querySelectorAll(".chronicle-entry")).toHaveLength(2);
  expect(rendered.div.querySelector(".work-chronicle__beam")).not.toBeNull();
  expect(rendered.div.textContent).toContain("60K+");
  expect(rendered.div.textContent).toContain("Remote · İstanbul office");
  expect(rendered.div.textContent).toContain("On-site · Samsun");
  expect(
    rendered.div.querySelector("img[src='/images/work/acep-hero.webp']")
  ).not.toBeNull();
  rendered.cleanup();

  rendered = renderAt("/about");
  expect(rendered.div.querySelector(".about-collage")).not.toBeNull();
  expect(rendered.div.querySelector(".signature-mark svg")).not.toBeNull();
  expect(rendered.div.querySelectorAll(".signature-mark path")).toHaveLength(1);
  expect(
    rendered.div
      .querySelector(".signature-mark path")
      .getAttribute("pathLength")
  ).toBe("1");
  expect(
    rendered.div.querySelector(".signature-mark").getAttribute("aria-label")
  ).toBe("Handwritten Berkant signature");
  expect(
    Array.from(rendered.div.querySelectorAll(".about-fabric dt")).map(
      item => item.textContent
    )
  ).toEqual(["Location", "Education"]);
  expect(
    rendered.div.querySelector(".woven-sample[data-woven-cloth='threeui']")
  ).not.toBeNull();
  expect(rendered.div.querySelector(".woven-sample__canvas")).not.toBeNull();
  expect(rendered.div.querySelector(".woven-sample__threads")).toBeNull();
  expect(rendered.div.querySelector(".about-interests")).toBeNull();
  expect(rendered.div.textContent).toContain("Statistics and Computer Science");
  rendered.cleanup();

  rendered = renderAt("/contact");
  expect(rendered.div.querySelectorAll(".directory-row")).toHaveLength(5);
  expect(
    rendered.div.querySelector("a[href='mailto:berkantkubat.dev@gmail.com']")
  ).not.toBeNull();
  expect(
    rendered.div.querySelector("a[href='/Berkant_KUBAT.pdf']")
  ).not.toBeNull();
  expect(rendered.div.textContent).not.toMatch(/available for work/i);
  rendered.cleanup();
});

it("uses Fibonacci spiral geometry with a repeating pulse", () => {
  const first = resolveSpiralDot({
    index: 0,
    count: 800,
    time: 0,
    radius: 300
  });
  const next = resolveSpiralDot({
    index: 1,
    count: 800,
    time: 0,
    radius: 300
  });
  const pulsed = resolveSpiralDot({
    index: 0,
    count: 800,
    time: 0.25,
    radius: 300
  });

  expect(first.x).toBeGreaterThan(0);
  expect(Math.abs(first.y)).toBeLessThan(0.001);
  expect(next.x).toBeLessThan(0);
  expect(next.y).toBeGreaterThan(0);
  expect(pulsed.size).toBeGreaterThan(first.size);
  expect(pulsed.alpha).toBeGreaterThan(first.alpha);
});

it("keeps dock magnification noticeable without overpowering the page", () => {
  const center = resolveDockMagnification(0);
  const neighbor = resolveDockMagnification(75);
  const edge = resolveDockMagnification(150);
  const mirrored = resolveDockMagnification(-75);

  expect(center.size).toBeCloseTo(56, 3);
  expect(center.scale).toBeCloseTo(1.4, 3);
  expect(neighbor.size).toBeCloseTo(46, 3);
  expect(mirrored.size).toBeCloseTo(neighbor.size, 5);
  expect(edge.size).toBeCloseTo(40, 3);
  expect(edge.lift).toBeCloseTo(0, 3);
});

it("keeps container-scroll motion readable for project screenshots", () => {
  const approaching = resolveProjectPerspective({
    top: 800,
    height: 640,
    viewportHeight: 800,
    viewportWidth: 1280
  });
  const halfway = resolveProjectPerspective({
    top: 80,
    height: 640,
    viewportHeight: 800,
    viewportWidth: 1280
  });
  const settled = resolveProjectPerspective({
    top: -640,
    height: 640,
    viewportHeight: 800,
    viewportWidth: 1280
  });
  const compact = resolveProjectPerspective({
    top: 800,
    height: 420,
    viewportHeight: 800,
    viewportWidth: 390
  });

  expect(approaching.progress).toBe(0);
  expect(approaching.tilt).toBe("10.00deg");
  expect(approaching.scale).toBe("0.9400");
  expect(approaching.shift).toBe("30.00px");
  expect(halfway.progress).toBeCloseTo(0.5, 4);
  expect(halfway.tilt).toBe("5.00deg");
  expect(halfway.scale).toBe("0.9700");
  expect(halfway.shift).toBe("15.00px");
  expect(settled.progress).toBe(1);
  expect(settled.tilt).toBe("0.00deg");
  expect(settled.scale).toBe("1.0000");
  expect(settled.shift).toBe("0.00px");
  expect(compact.tilt).toBe("6.00deg");
  expect(compact.scale).toBe("0.9600");
  expect(compact.shift).toBe("18.00px");
});

it("matches Aceternity timeline start and end scroll offsets", () => {
  const before = resolveTimelineProgress({
    top: 800,
    height: 1600,
    viewportHeight: 800
  });
  const halfway = resolveTimelineProgress({
    top: -560,
    height: 1600,
    viewportHeight: 800
  });
  const complete = resolveTimelineProgress({
    top: -1200,
    height: 1600,
    viewportHeight: 800
  });

  expect(before.progress).toBe(0);
  expect(before.opacity).toBe(0);
  expect(halfway.progress).toBeCloseTo(0.5, 4);
  expect(halfway.opacity).toBe(1);
  expect(complete.progress).toBe(1);
  expect(complete.opacity).toBe(1);
});

it("marks exactly one clean route as current in the dock", () => {
  const paths = [
    "/",
    "/technologies",
    "/projects",
    "/experience",
    "/about",
    "/contact"
  ];

  paths.forEach(path => {
    const {div, cleanup} = renderAt(path);
    const current = div.querySelector(`.route-dock a[href='${path}']`);

    expect(current.classList.contains("is-active")).toBe(true);
    expect(current.getAttribute("aria-current")).toBe("page");
    expect(current.querySelector(".route-dock__label").textContent).toBe(
      path === "/" ? "Home" : current.getAttribute("aria-label")
    );
    expect(
      div.querySelectorAll(".route-dock a[aria-current='page']")
    ).toHaveLength(1);
    cleanup();
  });
});

it("uses one palm hologram for group and technology selection", () => {
  const {div, cleanup} = renderAt("/technologies");
  const stage = div.querySelector("#technology-scene");
  const groupButtons = () =>
    Array.from(
      div.querySelectorAll(
        ".technology-hologram__groups [data-hologram-group-id]"
      )
    );
  const technologyButtons = () =>
    Array.from(
      div.querySelectorAll(
        ".technology-hologram__technologies [data-hologram-technology-id]"
      )
    );

  expect(div.querySelector(".technology-panel")).toBeNull();
  expect(div.querySelector(".technology-stage__groups")).toBeNull();
  expect(div.querySelector(".technology-stage__stack")).toBeNull();
  expect(stage.dataset.hologramView).toBe("groups");
  expect(div.querySelector(".technology-stage__canvas--spline")).not.toBeNull();
  expect(div.querySelector(".technology-stage__projector")).not.toBeNull();
  expect(div.querySelector(".technology-stage__beam")).not.toBeNull();
  expect(div.querySelector(".technology-hologram")).not.toBeNull();
  expect(groupButtons()).toHaveLength(4);
  expect(groupButtons().map(button => button.textContent)).toEqual([
    "01Backend04",
    "02Messaging / Data06",
    "03Infrastructure / Delivery05",
    "04Observability02"
  ]);

  click(groupButtons()[1]);

  expect(stage.dataset.hologramView).toBe("technologies");
  expect(stage.dataset.activeGroup).toBe("move");
  expect(stage.dataset.selectedTechnology).toBe("kafka");
  expect(technologyButtons()).toHaveLength(6);
  expect(technologyButtons().map(button => button.textContent)).toContain(
    "PostgreSQL02 / 06"
  );

  const redisButton = technologyButtons().find(button =>
    button.textContent.startsWith("Redis")
  );
  click(redisButton);

  expect(redisButton.getAttribute("aria-pressed")).toBe("true");
  expect(stage.dataset.selectedTechnology).toBe("redis");
  expect(redisButton.textContent).toContain("04 / 06");

  click(div.querySelector(".technology-hologram__back"));

  expect(stage.dataset.hologramView).toBe("groups");
  expect(groupButtons()).toHaveLength(4);

  cleanup();
});

it("switches language and route metadata without leaving the route", () => {
  const {div, cleanup} = renderAt("/experience");
  const turkishButton = div.querySelector(
    ".site-controls .language-switch button[lang='tr']"
  );
  window.gtag = jest.fn();

  expect(document.title).toBe("Experience — Berkant Kubat");
  expect(document.querySelector('meta[name="description"]').content).toContain(
    "professional software engineering experience"
  );
  click(turkishButton);
  expect(window.location.pathname).toBe("/experience");
  expect(document.documentElement.lang).toBe("tr");
  expect(document.title).toBe("Deneyim — Berkant Kubat");
  expect(div.querySelector(".experience-page h1").textContent).toBe("Deneyim");
  expect(div.textContent).toContain("Uzaktan · İstanbul ofisi");
  expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe("tr");
  expect(window.gtag).toHaveBeenCalledWith("event", "language_change", {
    previous_language: "en",
    selected_language: "tr"
  });

  cleanup();
});

it("preserves theme and language through client navigation and direct entry", () => {
  let rendered = renderAt("/projects");
  const themeButtons = rendered.div.querySelectorAll(
    ".site-controls .theme-switch button"
  );
  const turkishButton = rendered.div.querySelector(
    ".site-controls .language-switch button[lang='tr']"
  );

  click(themeButtons[2]);
  click(turkishButton);
  click(rendered.div.querySelector(".route-dock a[href='/about']"));

  expect(window.location.pathname).toBe("/about");
  expect(rendered.div.querySelector(".portfolio-site").dataset.theme).toBe(
    "cyber"
  );
  expect(document.documentElement.lang).toBe("tr");
  expect(rendered.div.querySelector(".about-page h1").textContent).toBe(
    "Hakkımda"
  );
  rendered.cleanup();

  rendered = renderAt("/contact");
  expect(rendered.div.querySelector(".portfolio-site").dataset.theme).toBe(
    "cyber"
  );
  expect(document.documentElement.lang).toBe("tr");
  expect(rendered.div.textContent).toContain("Öncelikli iletişim: e-posta");
  rendered.cleanup();
});

it("restores valid preferences and rejects unknown values", () => {
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, "tr");
  window.localStorage.setItem(THEME_STORAGE_KEY, "light");
  const {div, cleanup} = renderAt("/");

  expect(document.documentElement.lang).toBe("tr");
  expect(div.querySelector(".portfolio-site").dataset.theme).toBe("light");
  expect(div.querySelector("h1").textContent).toBe("/berkant.dev_");
  expect(resolveInitialLanguage(null, "tr-TR")).toBe("tr");
  expect(resolveInitialLanguage("en", "tr-TR")).toBe("en");
  expect(resolveInitialLanguage("tr", "en-US")).toBe("tr");
  expect(resolveInitialLanguage("de", "de-DE")).toBe("en");
  expect(resolveInitialTheme("dark")).toBe("dark");
  expect(resolveInitialTheme("light")).toBe("light");
  expect(resolveInitialTheme("cyber")).toBe("cyber");
  expect(resolveInitialTheme("sepia")).toBe("dark");
  expect(resolveInitialTheme(null)).toBe("dark");

  cleanup();
});

it("marks the selected theme and repaints a reduced-motion home on change", () => {
  reduceMotion = true;
  const context = {
    arc: jest.fn(),
    beginPath: jest.fn(),
    clearRect: jest.fn(),
    fill: jest.fn(),
    lineTo: jest.fn(),
    moveTo: jest.fn(),
    restore: jest.fn(),
    rotate: jest.fn(),
    save: jest.fn(),
    scale: jest.fn(),
    setTransform: jest.fn(),
    stroke: jest.fn(),
    translate: jest.fn()
  };
  const getContext = jest
    .spyOn(window.HTMLCanvasElement.prototype, "getContext")
    .mockReturnValue(context);
  const {div, cleanup} = renderAt("/");
  const themeButtons = Array.from(
    div.querySelectorAll(".site-controls .theme-switch button")
  );
  const drawCount = () => context.clearRect.mock.calls.length;
  const initialDrawCount = drawCount();

  expect(
    themeButtons.filter(
      button => button.getAttribute("aria-pressed") === "true"
    )
  ).toEqual([themeButtons[0]]);

  click(themeButtons[1]);

  expect(
    themeButtons.filter(
      button => button.getAttribute("aria-pressed") === "true"
    )
  ).toEqual([themeButtons[1]]);
  expect(div.querySelector(".portfolio-site").dataset.theme).toBe("light");
  expect(drawCount()).toBeGreaterThan(initialDrawCount);
  expect(window.requestAnimationFrame).not.toHaveBeenCalled();

  cleanup();
  getContext.mockRestore();
});

it("localizes the About detail labels", () => {
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, "tr");
  const {div, cleanup} = renderAt("/about");

  expect(div.querySelector(".signature-mark").getAttribute("aria-label")).toBe(
    "El yazısıyla Berkant imzası"
  );
  expect(
    Array.from(div.querySelectorAll(".about-fabric dt")).map(
      item => item.textContent
    )
  ).toEqual(["Konum", "Eğitim"]);

  cleanup();
});

it("tracks contact and client-side route events without personal data", () => {
  const {div, cleanup} = renderAt("/contact");
  window.gtag = jest.fn();
  const emailLink = div.querySelector("#contact-email-card");
  emailLink.addEventListener("click", event => event.preventDefault());

  click(emailLink);
  click(div.querySelector(".route-dock a[href='/projects']"));

  expect(window.gtag).toHaveBeenCalledWith("event", "contact_attempt", {
    method: "email",
    placement: "contact",
    language: "en"
  });
  expect(window.gtag).toHaveBeenCalledWith("event", "page_view", {
    page_path: "/projects",
    page_title: "Projects — Berkant Kubat"
  });
  expect(JSON.stringify(window.gtag.mock.calls)).not.toContain(
    "berkantkubat.dev@gmail.com"
  );

  cleanup();
});

it("enables analytics only for secure production hosts", () => {
  expect(
    shouldEnableAnalytics({
      nodeEnv: "production",
      hostname: "berkantkubat.is-a.dev",
      protocol: "https:"
    })
  ).toBe(true);
  expect(
    shouldEnableAnalytics({
      nodeEnv: "development",
      hostname: "furkanberkant.github.io",
      protocol: "https:"
    })
  ).toBe(false);
  expect(
    shouldEnableAnalytics({
      nodeEnv: "production",
      hostname: "127.0.0.1",
      protocol: "https:"
    })
  ).toBe(false);
  expect(
    shouldEnableAnalytics({
      nodeEnv: "production",
      hostname: "portfolio.local",
      protocol: "https:"
    })
  ).toBe(false);
  expect(
    shouldEnableAnalytics({
      nodeEnv: "production",
      hostname: "furkanberkant.github.io",
      protocol: "http:"
    })
  ).toBe(false);
  expect(trackEvent("language_change")).toBe(false);
});

it("plays ReelShelf only while appropriate and exposes a pause control", () => {
  const {div, cleanup} = renderAt("/projects");
  const video = div.querySelector(".project-stage video");
  const control = div.querySelector(".project-stage__playback");
  let paused = false;
  Object.defineProperty(video, "paused", {
    configurable: true,
    get: () => paused
  });
  video.play.mockImplementation(() => {
    paused = false;
    return Promise.resolve();
  });
  video.pause.mockImplementation(() => {
    paused = true;
  });
  const mediaObserver = intersectionObservers.find(observer =>
    observer.observedTargets.includes(video)
  );

  expect(mediaObserver).toBeDefined();
  expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalled();
  click(control);
  expect(paused).toBe(true);
  expect(control.getAttribute("aria-pressed")).toBe("true");
  click(control);
  expect(paused).toBe(false);
  act(() => {
    mediaObserver.callback([{target: video, isIntersecting: false}]);
  });
  expect(paused).toBe(true);

  cleanup();
  expect(mediaObserver.disconnect).toHaveBeenCalled();
});

it("honors reduced motion for the intro, technology scene and project media", () => {
  reduceMotion = true;
  let rendered = renderAt("/");
  expect(
    rendered.div.querySelector(".identity-sequence--settled")
  ).not.toBeNull();
  expect(rendered.div.querySelector(".site-topbar--intro")).toBeNull();
  expect(rendered.div.querySelector(".route-dock--intro")).toBeNull();
  expect(window.requestAnimationFrame).not.toHaveBeenCalled();
  expect(window.sessionStorage.getItem(HOME_INTRO_SESSION_KEY)).toBe("true");
  rendered.cleanup();

  rendered = renderAt("/technologies");
  const technologyStage = rendered.div.querySelector(".technology-stage");
  expect(technologyStage.dataset.reducedMotion).toBe("true");
  expect(
    rendered.div.querySelector(".technology-stage__canvas--spline")
  ).not.toBeNull();
  rendered.cleanup();

  rendered = renderAt("/projects");
  expect(window.HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
  expect(window.HTMLMediaElement.prototype.pause).toHaveBeenCalled();
  expect(
    rendered.div
      .querySelector(".project-stage__playback")
      .getAttribute("aria-pressed")
  ).toBe("true");
  expect(
    Array.from(rendered.div.querySelectorAll(".project-stage")).every(
      stage =>
        stage.dataset.projectMotion === "settled" &&
        stage.style.getPropertyValue("--project-tilt") === "0deg" &&
        stage.style.getPropertyValue("--project-scale") === "1" &&
        stage.style.getPropertyValue("--project-shift") === "0px" &&
        stage.style.getPropertyValue("--project-gallery-shift") === "0px" &&
        stage.style.getPropertyValue("--project-opacity") === "1"
    )
  ).toBe(true);
  expect(window.requestAnimationFrame).not.toHaveBeenCalled();
  rendered.cleanup();
});

it("scrolls and focuses the destination heading during client navigation", () => {
  const {div, cleanup} = renderAt("/about");
  window.scrollTo.mockClear();

  click(div.querySelector(".route-dock a[href='/projects']"));

  expect(window.location.pathname).toBe("/projects");
  expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  expect(document.activeElement).toBe(div.querySelector(".projects-page h1"));
  expect(div.querySelector(".about-page")).toBeNull();

  cleanup();
});

it("normalizes directory URLs and noindexes unknown routes", () => {
  let rendered = renderAt("/projects/");
  expect(window.location.pathname).toBe("/projects");
  expect(rendered.div.querySelector(".projects-page")).not.toBeNull();
  expect(document.querySelector('meta[name="robots"]').content).toContain(
    "index"
  );
  rendered.cleanup();

  rendered = renderAt("/projects/unknown");
  expect(rendered.div.querySelector(".not-found h1").textContent).toContain(
    "does not exist"
  );
  expect(document.title).toBe("Page not found — Berkant Kubat");
  expect(document.querySelector('meta[name="robots"]').content).toBe(
    "noindex, nofollow"
  );
  rendered.cleanup();
});

it("contains no freelancer, agency, or lead-generation copy", () => {
  const copy = JSON.stringify(uiCopy);
  const forbidden = [
    /let['’]?s talk/i,
    /let['’]?s work/i,
    /let['’]?s build/i,
    /open to .*opportunit/i,
    /available for work/i,
    /your (product|idea)/i,
    /konuşalım/i,
    /fırsatlara açığım/i,
    /üzerinde çalıştığın (ürün|bir ürün)/i,
    /aklındaki (fikir|bir fikir)/i
  ];

  forbidden.forEach(pattern => expect(copy).not.toMatch(pattern));
});
