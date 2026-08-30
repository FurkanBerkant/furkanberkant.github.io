import {mkdir, readFile, writeFile} from "node:fs/promises";
import {resolve} from "node:path";

const buildDirectory = resolve(process.cwd(), "build");
const indexPath = resolve(buildDirectory, "index.html");
const baseUrl = "https://furkanberkant.github.io";
const routes = {
  technologies: {
    title: "Technologies — Berkant Kubat",
    description:
      "Technologies and engineering practices Berkant Kubat uses across backend systems, data flows and cloud delivery."
  },
  projects: {
    title: "Projects — Berkant Kubat",
    description:
      "Selected software projects by Berkant Kubat, including backend systems, personal tools and web applications."
  },
  experience: {
    title: "Experience — Berkant Kubat",
    description:
      "Berkant Kubat's professional software engineering experience and contributions to production systems."
  },
  about: {
    title: "About — Berkant Kubat",
    description: "Background and education of software engineer Berkant Kubat."
  },
  contact: {
    title: "Contact — Berkant Kubat",
    description: "Email, GitHub, LinkedIn and résumé links for Berkant Kubat."
  }
};

const escapeAttribute = value =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const replaceRequired = (source, pattern, replacement, label) => {
  if (!pattern.test(source)) {
    throw new Error(`Unable to update ${label} in the generated HTML shell.`);
  }

  return source.replace(pattern, replacement);
};

const withMetadata = (source, {title, description, url, noindex = false}) => {
  const safeTitle = escapeAttribute(title);
  const safeDescription = escapeAttribute(description);
  const safeUrl = escapeAttribute(url);
  let output = source;

  output = replaceRequired(
    output,
    /<title>[^<]*<\/title>/,
    `<title>${safeTitle}</title>`,
    "document title"
  );
  output = replaceRequired(
    output,
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?\s*>/,
    `<meta name="description" content="${safeDescription}" />`,
    "description"
  );
  output = replaceRequired(
    output,
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?\s*>/,
    `<link rel="canonical" href="${safeUrl}" />`,
    "canonical URL"
  );

  const metadata = [
    ["property", "og:title", safeTitle],
    ["property", "og:description", safeDescription],
    ["property", "og:url", safeUrl],
    ["name", "twitter:title", safeTitle],
    ["name", "twitter:description", safeDescription],
    ["name", "twitter:url", safeUrl]
  ];

  metadata.forEach(([attribute, key, value]) => {
    output = replaceRequired(
      output,
      new RegExp(
        `<meta\\s+${attribute}="${key}"\\s+content="[^"]*"\\s*\\/?\\s*>`
      ),
      `<meta ${attribute}="${key}" content="${value}" />`,
      key
    );
  });

  if (noindex) {
    output = replaceRequired(
      output,
      /<meta\s+name="robots"\s+content="[^"]*"\s*\/?\s*>/,
      '<meta name="robots" content="noindex, follow" />',
      "robots policy"
    );
  }

  return output;
};

const sourceHtml = await readFile(indexPath, "utf8");

for (const [route, metadata] of Object.entries(routes)) {
  const routeDirectory = resolve(buildDirectory, route);
  const routeUrl = `${baseUrl}/${route}`;
  const routeHtml = withMetadata(sourceHtml, {...metadata, url: routeUrl});

  await mkdir(routeDirectory, {recursive: true});
  await writeFile(resolve(routeDirectory, "index.html"), routeHtml, "utf8");
}

const notFoundHtml = withMetadata(sourceHtml, {
  title: "Page not found — Berkant Kubat",
  description: "The requested page could not be found.",
  url: `${baseUrl}/404`,
  noindex: true
});

await writeFile(resolve(buildDirectory, "404.html"), notFoundHtml, "utf8");
