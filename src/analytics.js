export const GA_MEASUREMENT_ID = "G-YVSBQF8B6K";

const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "::1"]);

export const shouldEnableAnalytics = ({nodeEnv, hostname, protocol}) =>
  nodeEnv === "production" &&
  protocol === "https:" &&
  !LOCAL_HOSTNAMES.has(hostname) &&
  !hostname.endsWith(".local");

export const initAnalytics = () => {
  if (
    typeof window === "undefined" ||
    typeof document === "undefined" ||
    !shouldEnableAnalytics({
      nodeEnv: process.env.NODE_ENV,
      hostname: window.location.hostname,
      protocol: window.location.protocol
    })
  ) {
    return false;
  }

  if (window.gtag) {
    return true;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, {
    send_page_view: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.dataset.portfolioAnalytics = "true";
  document.head.appendChild(script);

  return true;
};

export const trackEvent = (eventName, parameters = {}) => {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return false;
  }

  window.gtag("event", eventName, parameters);
  return true;
};
