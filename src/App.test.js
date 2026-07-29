import React from "react";
import ReactDOM from "react-dom";
import {act} from "react-dom/test-utils";
import App from "./App";
import {shouldEnableAnalytics, trackEvent} from "./analytics";
import {LANGUAGE_STORAGE_KEY, resolveInitialLanguage} from "./portfolioI18n";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
});

Object.defineProperty(window.HTMLMediaElement.prototype, "muted", {
  writable: true,
  value: false
});

let intersectionObservers = [];

window.IntersectionObserver = jest.fn();
window.HTMLMediaElement.prototype.play = jest.fn();
window.HTMLMediaElement.prototype.pause = jest.fn();

beforeEach(() => {
  delete window.gtag;
  delete window.dataLayer;
  window.localStorage.clear();
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, "en");
  document.documentElement.lang = "en";
  Object.defineProperty(window, "scrollY", {
    configurable: true,
    value: 0
  });
  intersectionObservers = [];
  window.IntersectionObserver.mockImplementation((callback, options) => {
    const observedTargets = [];
    const observer = {
      callback,
      options,
      observedTargets,
      observe: jest.fn(target => observedTargets.push(target)),
      disconnect: jest.fn()
    };

    intersectionObservers.push(observer);
    return observer;
  });
  window.HTMLMediaElement.prototype.play.mockImplementation(() =>
    Promise.resolve()
  );
});

it("renders the portfolio structure and safe external links", () => {
  const div = document.createElement("div");
  ReactDOM.render(<App />, div);

  expect(div.querySelector("h1").textContent).toContain(
    "I build systems that stay fast"
  );
  expect(div.querySelectorAll("#projects article")).toHaveLength(5);
  expect(div.textContent).not.toContain("all 31 public repositories");
  expect(div.textContent).not.toContain("05 / 31");
  expect(div.querySelector("#contact a[href^='mailto:']")).not.toBeNull();
  expect(div.querySelector(".brand-mark i")).toBeNull();
  expect(div.querySelector(".brand-mark__name strong").textContent).toBe(
    "Berkant Kubat"
  );
  const about = div.querySelector("#about");
  expect(about.querySelector(".about-profile")).not.toBeNull();
  expect(about.querySelectorAll(".about-profile__interests li")).toHaveLength(
    4
  );
  expect(about.querySelector(".about-build-card")).toBeNull();
  expect(about.querySelector("img")).toBeNull();
  expect(about.textContent).toContain("A little about me.");
  expect(about.textContent).toContain("AI-assisted building");
  expect(about.textContent).toContain("how AI is changing");
  expect(about.textContent).not.toContain("ReelShelf");
  expect(about.textContent).not.toContain("private file workspace");
  const contact = div.querySelector("#contact");
  expect(contact.querySelector(".contact-card")).not.toBeNull();
  expect(contact.textContent).toContain("Let's talk.");
  expect(contact.textContent).toContain("Work, products, or a good idea.");
  expect(contact.textContent).toContain("Software engineering roles");
  expect(contact.querySelectorAll(".contact-card__links a")).toHaveLength(3);
  expect(
    contact.querySelector(`a[href='mailto:berkantkubat.dev@gmail.com']`)
  ).not.toBeNull();
  expect(
    contact.querySelector("a[href='/Berkant_KUBAT.pdf'][target='_blank']")
  ).not.toBeNull();
  expect(
    Array.from(div.querySelectorAll(".impact-card strong")).map(
      item => item.textContent
    )
  ).toEqual(["API", "DATA", "OPS"]);
  expect(
    div.querySelector("source[src='/images/projects/reelshelf-motion.mp4']")
  ).not.toBeNull();
  expect(div.querySelector(".project-motion video").autoplay).toBe(false);
  expect(div.querySelector(".project-motion video").preload).toBe("none");
  expect(div.textContent).toContain("60K+");
  expect(div.textContent).not.toContain("Core Wallet");
  expect(div.textContent).not.toContain("former live deployment is offline");
  expect(
    div.querySelector("a[href='https://tugrulhukuk.av.tr/'][target='_blank']")
  ).not.toBeNull();
  expect(
    div.querySelector("a[href*='com.comodif.mobihubnative'][target='_blank']")
  ).not.toBeNull();
  expect(div.textContent).toContain("Primary focus · Backend support");
  expect(div.textContent).toContain("Remote · İstanbul office");
  expect(div.textContent).toContain("On-site · Samsun");
  expect(
    div.querySelector("img[src='/images/work/acep-hero.webp']")
  ).not.toBeNull();
  expect(
    div.querySelector("img[src='/icons/tech/kubernetes.svg']")
  ).not.toBeNull();
  expect(div.querySelectorAll(".technology-tile").length).toBeGreaterThan(12);
  expect(div.querySelector(".about-glass")).not.toBeNull();
  expect(div.querySelector("#project-reelshelf-link-1")).not.toBeNull();
  expect(div.querySelector("#work-acep-google-play")).not.toBeNull();
  expect(div.querySelector("#resume-contact")).not.toBeNull();

  const externalLinks = Array.from(div.querySelectorAll("a[target='_blank']"));
  expect(externalLinks.length).toBeGreaterThan(0);
  expect(
    externalLinks.every(
      link => link.rel.includes("noreferrer") && link.rel.includes("noopener")
    )
  ).toBe(true);

  ReactDOM.unmountComponentAtNode(div);
});

it("switches every portfolio section between English and Turkish", () => {
  const div = document.createElement("div");
  document.body.appendChild(div);

  act(() => {
    ReactDOM.render(<App />, div);
  });

  const englishButton = div.querySelector(".language-switch button[lang='en']");
  const turkishButton = div.querySelector(".language-switch button[lang='tr']");
  window.gtag = jest.fn();

  expect(document.title).toBe("Berkant Kubat — Software Engineer");
  expect(englishButton.getAttribute("aria-pressed")).toBe("true");
  expect(turkishButton.getAttribute("aria-pressed")).toBe("false");

  act(() => {
    turkishButton.dispatchEvent(new MouseEvent("click", {bubbles: true}));
  });

  expect(document.documentElement.lang).toBe("tr");
  expect(document.title).toBe("Berkant Kubat — Yazılım Mühendisi");
  expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe("tr");
  expect(turkishButton.getAttribute("aria-pressed")).toBe("true");
  expect(window.gtag).toHaveBeenCalledWith("event", "language_change", {
    previous_language: "en",
    selected_language: "tr"
  });
  expect(div.querySelector("h1").textContent).toContain(
    "Gerçek trafik altında da"
  );
  expect(div.querySelector(".site-nav a[href='#experience']").textContent).toBe(
    "Deneyim"
  );
  expect(div.querySelector("#experience").textContent).toContain(
    "Üretim sistemleri"
  );
  expect(div.querySelector("#experience").textContent).toContain(
    "Uzaktan · İstanbul ofisi"
  );
  expect(div.querySelector("#experience").textContent).toContain(
    "Ofiste · Samsun"
  );
  expect(div.querySelector("#projects").textContent).toContain(
    "Seçili projeler."
  );
  expect(div.querySelector("#projects").textContent).toContain(
    "Kişisel dosya çalışma alanı"
  );
  expect(div.querySelector("#capabilities").textContent).toContain(
    "Servis temelleri"
  );
  expect(div.querySelector("#about").textContent).toContain("Kısaca ben.");
  expect(div.querySelector("#contact").textContent).toContain("Konuşalım.");
  expect(div.textContent).not.toContain("all 31 public repositories");

  act(() => {
    englishButton.dispatchEvent(new MouseEvent("click", {bubbles: true}));
  });

  expect(document.documentElement.lang).toBe("en");
  expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe("en");
  expect(div.querySelector("h1").textContent).toContain(
    "I build systems that stay fast"
  );

  act(() => {
    ReactDOM.unmountComponentAtNode(div);
  });
  div.remove();
});

it("restores a saved Turkish language preference", () => {
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, "tr");
  const div = document.createElement("div");

  act(() => {
    ReactDOM.render(<App />, div);
  });

  expect(document.documentElement.lang).toBe("tr");
  expect(div.querySelector("h1").textContent).toContain(
    "Gerçek trafik altında da"
  );
  expect(
    div
      .querySelector(".language-switch button[lang='tr']")
      .getAttribute("aria-pressed")
  ).toBe("true");

  act(() => {
    ReactDOM.unmountComponentAtNode(div);
  });
});

it("resolves saved and device language preferences safely", () => {
  expect(resolveInitialLanguage(null, "tr-TR")).toBe("tr");
  expect(resolveInitialLanguage("en", "tr-TR")).toBe("en");
  expect(resolveInitialLanguage("tr", "en-US")).toBe("tr");
  expect(resolveInitialLanguage("de", "de-DE")).toBe("en");
});

it("tracks email contact attempts without sending the email address", () => {
  const div = document.createElement("div");
  document.body.appendChild(div);
  window.gtag = jest.fn();

  act(() => {
    ReactDOM.render(<App />, div);
  });

  const emailLink = div.querySelector("#contact-email-card");
  emailLink.addEventListener("click", event => event.preventDefault());

  act(() => {
    emailLink.dispatchEvent(
      new MouseEvent("click", {bubbles: true, cancelable: true})
    );
  });

  expect(window.gtag).toHaveBeenCalledWith("event", "contact_attempt", {
    method: "email",
    placement: "contact",
    language: "en"
  });
  expect(JSON.stringify(window.gtag.mock.calls)).not.toContain(
    "berkantkubat.dev@gmail.com"
  );

  act(() => {
    ReactDOM.unmountComponentAtNode(div);
  });
  div.remove();
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

it("turns the header into a translucent surface after scrolling", () => {
  const div = document.createElement("div");
  document.body.appendChild(div);

  act(() => {
    ReactDOM.render(<App />, div);
  });

  const header = div.querySelector(".site-header");
  expect(header.classList.contains("site-header--scrolled")).toBe(false);

  Object.defineProperty(window, "scrollY", {
    configurable: true,
    value: 80
  });
  act(() => {
    window.dispatchEvent(new Event("scroll"));
  });

  expect(header.classList.contains("site-header--scrolled")).toBe(true);

  Object.defineProperty(window, "scrollY", {
    configurable: true,
    value: 0
  });
  act(() => {
    window.dispatchEvent(new Event("scroll"));
  });

  expect(header.classList.contains("site-header--scrolled")).toBe(false);

  act(() => {
    ReactDOM.unmountComponentAtNode(div);
  });
  div.remove();
});

it("plays the ReelShelf preview only while it is visible", () => {
  const div = document.createElement("div");
  document.body.appendChild(div);

  act(() => {
    ReactDOM.render(<App />, div);
  });

  const video = div.querySelector(".project-motion video");
  const mediaObserver = intersectionObservers.find(observer =>
    observer.observedTargets.includes(video)
  );
  expect(mediaObserver).toBeDefined();
  expect(mediaObserver.observe).toHaveBeenCalledWith(video);
  expect(video.play).not.toHaveBeenCalled();

  act(() => {
    mediaObserver.callback([
      {target: video, isIntersecting: true, intersectionRatio: 0.6}
    ]);
  });

  expect(video.play).toHaveBeenCalledTimes(1);

  act(() => {
    mediaObserver.callback([
      {target: video, isIntersecting: false, intersectionRatio: 0}
    ]);
  });

  expect(video.pause).toHaveBeenCalledTimes(1);

  act(() => {
    ReactDOM.unmountComponentAtNode(div);
  });

  expect(mediaObserver.disconnect).toHaveBeenCalledTimes(1);
  div.remove();
});

it("marks the visible section as current in the navigation", () => {
  const div = document.createElement("div");
  document.body.appendChild(div);

  act(() => {
    ReactDOM.render(<App />, div);
  });

  const experience = div.querySelector("#experience");
  const sectionObserver = intersectionObservers.find(observer =>
    observer.observedTargets.includes(experience)
  );
  expect(sectionObserver).toBeDefined();
  expect(sectionObserver.observedTargets).toHaveLength(6);

  act(() => {
    sectionObserver.callback([
      {target: experience, isIntersecting: true, intersectionRatio: 0.1}
    ]);
  });

  const activeLink = div.querySelector(".site-nav a[href='#experience']");
  expect(activeLink.classList.contains("is-active")).toBe(true);
  expect(activeLink.getAttribute("aria-current")).toBe("location");
  expect(
    div
      .querySelector(".site-nav a[href='#projects']")
      .hasAttribute("aria-current")
  ).toBe(false);

  act(() => {
    ReactDOM.unmountComponentAtNode(div);
  });
  div.remove();
});

it("opens and closes the accessible mobile navigation", () => {
  const div = document.createElement("div");
  document.body.appendChild(div);

  act(() => {
    ReactDOM.render(<App />, div);
  });

  const toggle = div.querySelector(".mobile-menu-toggle");
  expect(toggle.getAttribute("aria-expanded")).toBe("false");
  expect(div.querySelector("#mobile-navigation")).toBeNull();

  act(() => {
    toggle.dispatchEvent(new MouseEvent("click", {bubbles: true}));
  });

  expect(toggle.getAttribute("aria-expanded")).toBe("true");
  expect(div.querySelectorAll("#mobile-navigation nav a")).toHaveLength(5);
  expect(document.activeElement.textContent).toContain("Experience");

  act(() => {
    document.dispatchEvent(
      new KeyboardEvent("keydown", {key: "Escape", bubbles: true})
    );
  });

  expect(toggle.getAttribute("aria-expanded")).toBe("false");
  expect(div.querySelector("#mobile-navigation")).toBeNull();
  expect(document.activeElement).toBe(toggle);

  act(() => {
    ReactDOM.unmountComponentAtNode(div);
  });
  div.remove();
});
