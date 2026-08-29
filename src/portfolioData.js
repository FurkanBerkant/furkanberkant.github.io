export const profile = {
  name: "Berkant Kubat",
  handle: "@FurkanBerkant",
  location: "Samsun, Türkiye",
  email: "berkantkubat.dev@gmail.com",
  github: "https://github.com/FurkanBerkant",
  linkedin: "https://www.linkedin.com/in/berkantkubat/",
  resume: "/Berkant_KUBAT.pdf"
};

export const engineeringFocus = [
  {
    value: "API",
    label: "Backend engineering",
    detail: "Java, Spring Boot, microservices and concurrent systems"
  },
  {
    value: "DATA",
    label: "Event-driven systems",
    detail: "Kafka, gRPC, PostgreSQL, Cassandra and Redis"
  },
  {
    value: "OPS",
    label: "Cloud-native delivery",
    detail: "Docker, Kubernetes, Helm, ArgoCD and observability"
  }
];

export const technologies = {
  java: {
    name: "Java",
    icon: "/icons/tech/java.svg"
  },
  spring: {
    name: "Spring Boot",
    icon: "/icons/tech/spring.svg"
  },
  python: {
    name: "Python",
    icon: "/icons/tech/python.svg"
  },
  grpc: {
    name: "gRPC",
    icon: "/icons/tech/grpc.svg"
  },
  kafka: {
    name: "Apache Kafka",
    icon: "/icons/tech/kafka.svg"
  },
  postgresql: {
    name: "PostgreSQL",
    icon: "/icons/tech/postgresql.svg"
  },
  cassandra: {
    name: "Cassandra",
    icon: "/icons/tech/cassandra.svg"
  },
  redis: {
    name: "Redis",
    icon: "/icons/tech/redis.svg"
  },
  sqlserver: {
    name: "SQL Server",
    icon: "/icons/tech/sqlserver.svg"
  },
  liquibase: {
    name: "Liquibase",
    icon: "/icons/tech/liquibase.svg"
  },
  docker: {
    name: "Docker",
    icon: "/icons/tech/docker.svg"
  },
  kubernetes: {
    name: "Kubernetes",
    icon: "/icons/tech/kubernetes.svg"
  },
  helm: {
    name: "Helm",
    icon: "/icons/tech/helm.svg"
  },
  argocd: {
    name: "ArgoCD",
    icon: "/icons/tech/argocd.svg"
  },
  githubactions: {
    name: "GitHub Actions",
    icon: "/icons/tech/githubactions.svg"
  },
  prometheus: {
    name: "Prometheus",
    icon: "/icons/tech/prometheus.svg"
  },
  grafana: {
    name: "Grafana",
    icon: "/icons/tech/grafana.svg"
  }
};

export const experiences = [
  {
    company: "Comodif",
    role: "Software Engineer",
    period: "Oct 2023 — Feb 2026",
    type: "Production systems",
    workplace: "Remote · İstanbul office",
    summary:
      "Built and operated connected-mobility backend systems, with most product-facing support centered on ACEP — AracımCepte.",
    highlights: [
      "Reduced critical API p95 latency by 50%+ through asynchronous parallel loading, tiered Redis/Caffeine caching and targeted PostgreSQL query optimisation.",
      "Architected Kafka telemetry pipelines for 60K+ connected devices, including custom data handlers and Cassandra storage.",
      "Managed Cassandra telemetry and PostgreSQL transactional data together, with Liquibase schema versioning.",
      "Established Prometheus/Grafana observability and Slack alerts for Kafka lag and service health.",
      "Delivered microservices with Docker, Kubernetes, Helm, ArgoCD GitOps and GitHub Actions CI/CD.",
      "Built a Slack-integrated mobile support service to automate real-time issue escalation."
    ],
    products: [
      {
        id: "acep",
        name: "ACEP — AracımCepte",
        focus: "Primary focus · Backend support",
        description:
          "My main product focus at Comodif: backend development and production support for a connected-vehicle experience.",
        url: "https://play.google.com/store/apps/details?id=com.comodif.mobihubnative&hl=en_US",
        primary: true,
        owner: "Product by Comodif",
        source: "Official Google Play media",
        icon: "/images/work/acep-icon.webp",
        images: [
          {
            src: "/images/work/acep-hero.webp",
            alt: "ACEP mobile app vehicle overview"
          },
          {
            src: "/images/work/acep-live.webp",
            alt: "ACEP mobile app live vehicle tracking"
          }
        ]
      },
      {
        id: "fiat",
        name: "Fiat Yol Arkadaşım",
        focus: "Product contribution · Backend support",
        description:
          "Contributed backend support within the connected-mobility ecosystem behind Fiat's customer product.",
        url: "https://play.google.com/store/apps/details?id=com.luteg.fiatconnectivity&hl=en_US",
        owner: "Product by Tofaş · Comodif contribution",
        source: "Official Google Play media",
        icon: "/images/work/fiat-icon.webp",
        images: [
          {
            src: "/images/work/fiat-control.webp",
            alt: "Fiat Yol Arkadaşım remote vehicle lock control"
          },
          {
            src: "/images/work/fiat-live.webp",
            alt: "Fiat Yol Arkadaşım live vehicle notification"
          }
        ]
      }
    ]
  },
  {
    company: "Otoparcasan",
    role: "Python Developer",
    period: "Jan 2021 — May 2021",
    type: "Commerce automation",
    workplace: "On-site · Samsun",
    summary:
      "Automated product, inventory and order integrations for an e-commerce operation.",
    highlights: [
      "Built XML transformation and data-transfer workflows with Python.",
      "Produced operational reports with SQL, Python and Excel.",
      "Improved product and stock data handling across marketplace integrations."
    ]
  }
];

export const visualProjects = [
  {
    id: "newdrive",
    number: "01",
    title: "NewDrive",
    kicker: "Private file workspace",
    year: "2026",
    image: "/images/projects/newdrive-login.jpg",
    imageAlt:
      "NewDrive secure personal file workspace login screen in a clean teal interface",
    description:
      "A self-hosted personal file vault built around privacy, recoverability and predictable operations. It supports folders, collections, previews, quotas, local or R2 storage and a retryable deletion queue.",
    proof:
      "Architecture, deployment and failure modes are documented in the repo.",
    tags: [
      "TypeScript",
      "Express 5",
      "Prisma",
      "SQLite",
      "Cloudflare R2",
      "Argon2"
    ],
    links: [
      {
        label: "View repository",
        url: "https://github.com/FurkanBerkant/newdrive"
      }
    ]
  },
  {
    id: "reelshelf",
    number: "02",
    title: "ReelShelf",
    kicker: "Full-stack media archive",
    year: "2026",
    image: "/images/projects/reelshelf-landing.jpg",
    video: "/images/projects/reelshelf-motion.mp4",
    imageAlt:
      "ReelShelf cinematic landing page transitioning into animated poster collections",
    gallery: [
      {
        src: "/images/projects/reelshelf-cinema.jpg",
        alt: "ReelShelf private cinema collection interface"
      },
      {
        src: "/images/projects/reelshelf-library.jpg",
        alt: "ReelShelf grand library book collection interface"
      }
    ],
    description:
      "A cinematic personal archive for films and books. A secure Spring Boot API handles identity, ownership and external media data while a modular Vite frontend delivers the visual experience.",
    proof:
      "Separate frontend and API repositories, connected through an authenticated REST contract.",
    tags: [
      "Java 17",
      "Spring Boot",
      "PostgreSQL",
      "JWT",
      "Vite",
      "Three.js",
      "GSAP"
    ],
    links: [
      {
        label: "Frontend",
        url: "https://github.com/FurkanBerkant/reelshelf-frontend"
      },
      {
        label: "Backend API",
        url: "https://github.com/FurkanBerkant/reelShelf"
      }
    ]
  },
  {
    id: "tugrul",
    number: "03",
    title: "Tuğrul Hukuk",
    kicker: "Legal practice website",
    year: "2026",
    image: "/images/projects/tugrul-hukuk.jpg",
    imageAlt: "Tuğrul Hukuk and Consultancy website hero in navy and gold",
    description:
      "A compliance-conscious website for a legal practice, combining an editorial content structure, responsive navigation, 3D details and structured search metadata.",
    proof:
      "Live in production for a Samsun-based legal practice, with responsive service content, location-aware search metadata and a compliance-conscious presentation.",
    tags: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Three.js",
      "Framer Motion",
      "SEO"
    ],
    links: [
      {
        label: "Visit live site",
        url: "https://tugrulhukuk.av.tr/"
      },
      {
        label: "View repository",
        url: "https://github.com/FurkanBerkant/tugrul-hukuk"
      }
    ]
  }
];

export const systemProjects = [
  {
    id: "fund-search",
    number: "04",
    title: "Fund Search",
    type: "Search infrastructure",
    description:
      "A Turkish investment-fund service with Excel ingestion, PostgreSQL persistence and asynchronous Elasticsearch indexing for fuzzy discovery and comparison.",
    flow: ["Excel", "Ingestion", "PostgreSQL", "Elasticsearch"],
    tags: ["Java 21", "Spring Boot", "Elasticsearch", "Apache POI"],
    link: "https://github.com/FurkanBerkant/fund-search-service"
  },
  {
    id: "randevio",
    number: "05",
    title: "Randevio",
    type: "Modular SaaS",
    description:
      "A multi-tenant appointment and service platform exploring modular boundaries across CRM, storefront, providers, employees and offer workflows.",
    flow: ["Storefront", "Modules", "Events", "MongoDB"],
    tags: ["Spring Modulith", "MongoDB", "OAuth2", "Thymeleaf", "Tailwind"],
    link: "https://github.com/FurkanBerkant/Modular-SaaS-Enterprise"
  }
];

export const capabilities = [
  {
    id: "build",
    verb: "BUILD",
    title: "Service foundations",
    description:
      "Production APIs and service boundaries built for change, concurrency and predictable failure.",
    technologyIds: ["java", "spring", "python", "grpc"],
    practices: [
      "Spring Cloud",
      "REST APIs",
      "Microservices",
      "Async & concurrent programming"
    ]
  },
  {
    id: "move",
    verb: "MOVE",
    title: "Events & data planes",
    description:
      "The paths that ingest, move and persist operational data without losing the shape of the business.",
    technologyIds: [
      "kafka",
      "postgresql",
      "cassandra",
      "redis",
      "sqlserver",
      "liquibase"
    ],
    practices: [
      "Event-driven architecture",
      "High-volume telemetry",
      "Query optimisation"
    ]
  },
  {
    id: "ship",
    verb: "SHIP",
    title: "Cloud delivery",
    description:
      "Repeatable delivery from container build to cluster state, with GitOps keeping intent visible.",
    technologyIds: ["docker", "kubernetes", "helm", "argocd", "githubactions"],
    practices: ["GitOps", "CI/CD", "Container orchestration"]
  },
  {
    id: "see",
    verb: "SEE",
    title: "Production signals",
    description:
      "Metrics, logs and alerts that turn an invisible failure into an actionable engineering signal.",
    technologyIds: ["prometheus", "grafana"],
    practices: [
      "Loki",
      "Kafka lag alerts",
      "Service health",
      "Slack escalation"
    ]
  }
];

export const education = [
  {
    school: "Karadeniz Technical University",
    field: "B.Sc. Statistics and Computer Science",
    period: "Jul 2023"
  }
];
