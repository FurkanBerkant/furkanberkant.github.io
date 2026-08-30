export const LANGUAGE_STORAGE_KEY = "berkant-portfolio-language";

export const uiCopy = {
  en: {
    meta: {
      routes: {
        "/": {
          title: "Berkant Kubat — Software Engineer",
          description:
            "Berkant Kubat is a software engineer focused on backend systems, data flows and reliable software."
        },
        "/technologies": {
          title: "Technologies — Berkant Kubat",
          description:
            "An interactive index of the technologies Berkant Kubat uses."
        },
        "/projects": {
          title: "Projects — Berkant Kubat",
          description:
            "Selected software projects by Berkant Kubat, presented with their real media, architecture and source links."
        },
        "/experience": {
          title: "Experience — Berkant Kubat",
          description:
            "Berkant Kubat's professional software engineering experience and factual contributions to production systems."
        },
        "/about": {
          title: "About — Berkant Kubat",
          description:
            "Background and education of software engineer Berkant Kubat."
        },
        "/contact": {
          title: "Contact — Berkant Kubat",
          description:
            "Email, GitHub, LinkedIn and résumé links for Berkant Kubat."
        }
      },
      notFound: {
        title: "Page not found — Berkant Kubat",
        description: "The requested page could not be found."
      }
    },
    language: {
      label: "Language",
      english: "Switch to English",
      turkish: "Türkçeye geç"
    },
    theme: {
      label: "Theme",
      warmDark: "Warm dark",
      warmDarkAria: "Use warm dark theme",
      paperLight: "Paper light",
      paperLightAria: "Use paper light theme",
      cyber: "Cyber",
      cyberAria: "Use cyber theme"
    },
    skipLink: "Skip to content",
    primaryNavigationLabel: "Primary navigation",
    routeLabel: "Current route",
    navigation: {
      home: "Home",
      technologies: "Technologies",
      projects: "Projects",
      experience: "Experience",
      about: "About",
      contact: "Contact"
    },
    resume: "Résumé",
    home: {
      command: "$ whoami",
      handle: "/berkant.dev_",
      profileLinksLabel: "Public profiles"
    },
    technologies: {
      route: "/technologies",
      kicker: "Technology index / 17",
      title: "Technologies",
      intro:
        "The tools behind my production systems, independent projects and delivery workflows.",
      explorerLabel: "Interactive technology explorer",
      explorerTitle: "My engineering stack",
      explorerHint: "Choose a layer, then inspect the work behind each tool",
      chooseGroup: "Technology groups",
      groupsLabel: "groups",
      toolsLabel: "technologies",
      selectedTechnology: "Selected technology",
      groupTechnologies: "Technologies in the selected group",
      sceneHint: "Drag to rotate the stack",
      hologramGroupsTitle: "Stack / system layers",
      hologramGroupsHint: "Start with the kind of work you want to inspect",
      hologramTechnologiesHint:
        "Choose a tool. The robot presents it while the evidence panel shows where I used it.",
      sceneFallback:
        "The 3D guide could not load. The stack explorer and usage evidence are still available.",
      projectionFallback:
        "Palm projection is unavailable, but the selected tool remains visible in the evidence panel.",
      guideLabel: "Portfolio evidence",
      guideStatus: {
        loading: "Synchronizing",
        ready: "Online",
        unavailable: "Interface only"
      },
      guideGroupsStep: "Step 01 / choose a work layer",
      guideTechnologyStep: "Selected tool / real use",
      guideGroupsTitle: "Trace the stack I shipped",
      guideGroupsBody:
        "Choose a work layer to trace the tools I used across production systems, shipped projects and delivery workflows. The robot keeps following your cursor, then presents your selection in its palm.",
      guideContextLabel: "Work signals",
      guideStart: "Open my stack",
      backToGroups: "All system layers",
      previousTechnology: "Show previous technology",
      nextTechnology: "Show next technology",
      cursorFollowLabel: "Cursor tracking",
      cursorFollowActive: "Active",
      palmProjectionLabel: "Palm projection",
      palmProjectionActive: "Holding selection",
      palmProjectionStandby: "Waiting for selection",
      groups: {
        build: "Backend",
        move: "Messaging / Data",
        ship: "Infrastructure / Delivery",
        see: "Observability"
      }
    },
    projects: {
      route: "/projects",
      kicker: "Project index / 03",
      title: "Selected Projects",
      intro:
        "Personal and independent software projects shown through their real interfaces, architecture and source.",
      archiveLabel: "Project index",
      mediaLabel: "Project media",
      detailsLabel: "Project notes",
      technologyLabel: "Technologies used",
      sourceLabel: "Sources",
      proofLabel: "Implementation note",
      architectureLabel: "Architecture flow",
      pauseMotion: "Pause ReelShelf motion preview",
      playMotion: "Play ReelShelf motion preview",
      pauseLabel: "Pause",
      playLabel: "Play",
      allProjects: "All public repositories"
    },
    experience: {
      route: "/experience",
      kicker: "Work log / 2021—2026",
      title: "Experience",
      intro: "Professional roles, systems and contributions.",
      timelineLabel: "Professional timeline",
      contributionLabel: "Contributions",
      technologyLabel: "Technologies in the work",
      productsLabel: "Product context",
      externalProduct: "Official product page"
    },
    about: {
      route: "/about",
      kicker: "Personal notes",
      title: "About",
      intro: "Software engineer focused on backend systems, based in Samsun.",
      storyLabel: "Background",
      signatureLabel: "Handwritten Berkant signature",
      locationLabel: "Location",
      educationLabel: "Education",
      story: [
        "I'm Berkant. I studied Statistics and Computer Science, and today most of my professional work is on production backend systems—mainly Java, Spring and Kafka, together with the data, deployment and observability work behind them.",
        "Lately, I've also been exploring how AI is changing the way software gets made. I enjoy trying new tools, thinking about product design, interfaces and motion, and learning by turning ideas into working things."
      ]
    },
    contact: {
      route: "/contact",
      kicker: "Personal directory",
      title: "Contact",
      intro: "Email, public profiles, résumé and location.",
      directoryLabel: "Contact directory",
      emailLabel: "Email",
      githubLabel: "GitHub",
      linkedinLabel: "LinkedIn",
      resumeLabel: "Résumé",
      locationLabel: "Location",
      preferred: "Preferred contact: email"
    },
    notFound: {
      code: "404 / route.not_found",
      title: "This route does not exist.",
      copy: "The address may have changed, or the page may no longer be available.",
      action: "Return to index"
    },
    footer: {
      note: "Personal developer notebook",
      backToTop: "Back to top ↑"
    },
    aria: {
      home: "Berkant Kubat home",
      googlePlaySuffix: " on Google Play",
      technologyIcon: " technology icon",
      projectArchitecture: " architecture flow",
      dockSymbol: "Route symbol"
    }
  },
  tr: {
    meta: {
      routes: {
        "/": {
          title: "Berkant Kubat — Yazılım Mühendisi",
          description:
            "Berkant Kubat; backend sistemleri, veri akışları ve güvenilir yazılımlar üzerinde çalışan bir yazılım mühendisidir."
        },
        "/technologies": {
          title: "Teknolojiler — Berkant Kubat",
          description:
            "Berkant Kubat'ın kullandığı teknolojilerin etkileşimli dizini."
        },
        "/projects": {
          title: "Projeler — Berkant Kubat",
          description:
            "Berkant Kubat'ın gerçek medya, mimari ve kaynak bağlantılarıyla sunulan seçili yazılım projeleri."
        },
        "/experience": {
          title: "Deneyim — Berkant Kubat",
          description:
            "Berkant Kubat'ın profesyonel yazılım mühendisliği deneyimi ve üretim sistemlerine somut katkıları."
        },
        "/about": {
          title: "Hakkımda — Berkant Kubat",
          description: "Yazılım mühendisi Berkant Kubat'ın geçmişi ve eğitimi."
        },
        "/contact": {
          title: "İletişim — Berkant Kubat",
          description:
            "Berkant Kubat'ın e-posta, GitHub, LinkedIn ve CV bağlantıları."
        }
      },
      notFound: {
        title: "Sayfa bulunamadı — Berkant Kubat",
        description: "İstenen sayfa bulunamadı."
      }
    },
    language: {
      label: "Dil",
      english: "İngilizceye geç",
      turkish: "Türkçeye geç"
    },
    theme: {
      label: "Tema",
      warmDark: "Sıcak koyu",
      warmDarkAria: "Sıcak koyu temayı kullan",
      paperLight: "Kâğıt açık",
      paperLightAria: "Kâğıt açık temayı kullan",
      cyber: "Siber",
      cyberAria: "Siber temayı kullan"
    },
    skipLink: "İçeriğe geç",
    primaryNavigationLabel: "Ana navigasyon",
    routeLabel: "Geçerli rota",
    navigation: {
      home: "Ana sayfa",
      technologies: "Teknolojiler",
      projects: "Projeler",
      experience: "Deneyim",
      about: "Hakkımda",
      contact: "İletişim"
    },
    resume: "CV",
    home: {
      command: "$ whoami",
      handle: "/berkant.dev_",
      profileLinksLabel: "Herkese açık profiller"
    },
    technologies: {
      route: "/technologies",
      kicker: "Teknoloji dizini / 17",
      title: "Teknolojiler",
      intro:
        "Üretim sistemlerimin, bağımsız projelerimin ve dağıtım akışlarımın arkasındaki araçlar.",
      explorerLabel: "Etkileşimli teknoloji gezgini",
      explorerTitle: "Mühendislik stack'im",
      explorerHint:
        "Bir katman seç, ardından her aracın arkasındaki işi incele",
      chooseGroup: "Teknoloji grupları",
      groupsLabel: "grup",
      toolsLabel: "teknoloji",
      selectedTechnology: "Seçili teknoloji",
      groupTechnologies: "Seçili gruptaki teknolojiler",
      sceneHint: "Yığını döndürmek için sürükle",
      hologramGroupsTitle: "Stack / sistem katmanları",
      hologramGroupsHint: "İncelemek istediğin çalışma türüyle başla",
      hologramTechnologiesHint:
        "Bir araç seç. Robot onu sunarken kanıt paneli nerede kullandığımı göstersin.",
      sceneFallback:
        "3B rehber yüklenemedi. Stack gezgini ve kullanım kanıtları çalışmaya devam ediyor.",
      projectionFallback:
        "Avuç projeksiyonu kullanılamıyor; seçili araç kanıt panelinde görünmeye devam ediyor.",
      guideLabel: "Portföy kanıtı",
      guideStatus: {
        loading: "Eşitleniyor",
        ready: "Çevrimiçi",
        unavailable: "Yalnız arayüz"
      },
      guideGroupsStep: "Adım 01 / çalışma katmanı seç",
      guideTechnologyStep: "Seçili araç / gerçek kullanım",
      guideGroupsTitle: "Yayına aldığım stack'i izle",
      guideGroupsBody:
        "Üretim sistemlerimde, yayınladığım projelerde ve dağıtım akışlarında kullandığım araçları izlemek için bir çalışma katmanı seç. Robot imlecini takip etmeyi sürdürür, ardından seçimini avucunda sunar.",
      guideContextLabel: "Çalışma izleri",
      guideStart: "Stack'imi aç",
      backToGroups: "Tüm sistem katmanları",
      previousTechnology: "Önceki teknolojiyi göster",
      nextTechnology: "Sonraki teknolojiyi göster",
      cursorFollowLabel: "İmleç takibi",
      cursorFollowActive: "Aktif",
      palmProjectionLabel: "Avuç projeksiyonu",
      palmProjectionActive: "Seçimi sunuyor",
      palmProjectionStandby: "Seçim bekliyor",
      groups: {
        build: "Backend",
        move: "Mesajlaşma / Veri",
        ship: "Altyapı / Dağıtım",
        see: "Gözlemlenebilirlik"
      }
    },
    projects: {
      route: "/projects",
      kicker: "Proje dizini / 03",
      title: "Seçili projeler",
      intro:
        "Gerçek arayüzleri, mimarileri ve kaynakları üzerinden gösterilen kişisel ve bağımsız yazılım projeleri.",
      archiveLabel: "Proje dizini",
      mediaLabel: "Proje medyası",
      detailsLabel: "Proje notları",
      technologyLabel: "Kullanılan teknolojiler",
      sourceLabel: "Kaynaklar",
      proofLabel: "Uygulama notu",
      architectureLabel: "Mimari akış",
      pauseMotion: "ReelShelf hareketli önizlemesini durdur",
      playMotion: "ReelShelf hareketli önizlemesini oynat",
      pauseLabel: "Durdur",
      playLabel: "Oynat",
      allProjects: "Tüm açık repolar"
    },
    experience: {
      route: "/experience",
      kicker: "Çalışma günlüğü / 2021—2026",
      title: "Deneyim",
      intro: "Profesyonel roller, sistemler ve katkılar.",
      timelineLabel: "Profesyonel zaman çizelgesi",
      contributionLabel: "Katkılar",
      technologyLabel: "İşte kullanılan teknolojiler",
      productsLabel: "Ürün bağlamı",
      externalProduct: "Resmî ürün sayfası"
    },
    about: {
      route: "/about",
      kicker: "Kişisel notlar",
      title: "Hakkımda",
      intro:
        "Samsun'da yaşayan, backend sistemlerine odaklanan yazılım mühendisi.",
      storyLabel: "Geçmiş",
      signatureLabel: "El yazısıyla Berkant imzası",
      locationLabel: "Konum",
      educationLabel: "Eğitim",
      story: [
        "Ben Berkant. İstatistik ve Bilgisayar Bilimleri okudum. Son birkaç yıldır ağırlıklı olarak üretim ortamındaki backend sistemleri üzerinde çalışıyorum; Java, Spring ve Kafka'nın yanı sıra veri, dağıtım ve gözlemlenebilirlik tarafıyla da ilgileniyorum.",
        "Son zamanlarda yapay zekânın yazılım üretme biçimini nasıl değiştirdiğini araştırıyorum. Yeni araçları denemekten; ürün tasarımı, arayüzler ve hareket üzerine düşünmekten; fikirleri çalışır hâle getirerek öğrenmekten keyif alıyorum."
      ]
    },
    contact: {
      route: "/contact",
      kicker: "Kişisel dizin",
      title: "İletişim",
      intro: "E-posta, herkese açık profiller, CV ve konum.",
      directoryLabel: "İletişim dizini",
      emailLabel: "E-posta",
      githubLabel: "GitHub",
      linkedinLabel: "LinkedIn",
      resumeLabel: "CV",
      locationLabel: "Konum",
      preferred: "Öncelikli iletişim: e-posta"
    },
    notFound: {
      code: "404 / rota.bulunamadi",
      title: "Bu rota mevcut değil.",
      copy: "Adres değişmiş veya sayfa artık kullanılamıyor olabilir.",
      action: "Dizine dön"
    },
    footer: {
      note: "Kişisel geliştirici defteri",
      backToTop: "Yukarı dön ↑"
    },
    aria: {
      home: "Berkant Kubat ana sayfa",
      googlePlaySuffix: " Google Play sayfası",
      technologyIcon: " teknoloji ikonu",
      projectArchitecture: " mimari akışı",
      dockSymbol: "Rota sembolü"
    }
  }
};

export const resolveInitialLanguage = (savedLanguage, deviceLanguage) => {
  if (savedLanguage === "en" || savedLanguage === "tr") {
    return savedLanguage;
  }

  return deviceLanguage?.toLowerCase().startsWith("tr") ? "tr" : "en";
};

export const getInitialLanguage = () => {
  if (typeof window === "undefined") {
    return "en";
  }

  let savedLanguage;

  try {
    savedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  } catch {
    // Storage may be unavailable in privacy-focused browser contexts.
  }

  const deviceLanguage =
    window.navigator?.languages?.[0] || window.navigator?.language;

  return resolveInitialLanguage(savedLanguage, deviceLanguage);
};
