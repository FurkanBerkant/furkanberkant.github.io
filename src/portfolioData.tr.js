export const profileTr = {
  location: "Samsun, Türkiye"
};

export const engineeringFocusTr = [
  {
    value: "API",
    label: "Backend mühendisliği",
    detail: "Java, Spring Boot, mikroservisler ve eşzamanlı çalışan sistemler"
  },
  {
    value: "VERİ",
    label: "Olay güdümlü sistemler",
    detail: "Kafka, gRPC, PostgreSQL, Cassandra ve Redis"
  },
  {
    value: "OPS",
    label: "Bulut tabanlı dağıtım",
    detail: "Docker, Kubernetes, Helm, ArgoCD ve gözlemlenebilirlik"
  }
];

export const experiencesTr = [
  {
    company: "Comodif",
    role: "Yazılım Mühendisi",
    period: "Eki 2023 — Şub 2026",
    type: "Üretim sistemleri",
    workplace: "Uzaktan · İstanbul ofisi",
    summary:
      "Bağlantılı mobilite ürünlerinin backend sistemlerini geliştirdim ve üretim ortamında işlettim; ürün tarafındaki desteğimin odağında ACEP — AracımCepte yer aldı.",
    highlights: [
      "Asenkron paralel yükleme, katmanlı Redis/Caffeine önbellekleme ve hedefli PostgreSQL sorgu optimizasyonlarıyla kritik API'lerin p95 gecikmesini %50'den fazla azalttım.",
      "Özel veri işleyicileri ve Cassandra depolaması dahil olmak üzere 60 binin üzerinde bağlantılı cihaz için Kafka telemetri akışları tasarladım.",
      "Cassandra'daki telemetri verilerini ve PostgreSQL'deki işlemsel verileri, Liquibase şema sürümleme ile birlikte yönettim.",
      "Kafka gecikmesi ve servis sağlığı için Prometheus/Grafana gözlemlenebilirliği ile Slack uyarıları kurdum.",
      "Mikroservisleri Docker, Kubernetes, Helm, ArgoCD GitOps ve GitHub Actions CI/CD ile yayına aldım.",
      "Gerçek zamanlı sorun aktarımını otomatikleştiren Slack entegreli bir mobil destek servisi geliştirdim."
    ],
    products: [
      {
        id: "acep",
        name: "ACEP — AracımCepte",
        focus: "Ana odak · Backend desteği",
        description:
          "AracımCepte'nin bağlantılı araç deneyimi için backend geliştirme ve üretim desteğinin büyük bölümünü üstlendiğim ana ürün.",
        url: "https://play.google.com/store/apps/details?id=com.comodif.mobihubnative&hl=en_US",
        primary: true,
        owner: "Comodif ürünü",
        source: "Resmî Google Play görselleri",
        icon: "/images/work/acep-icon.webp",
        images: [
          {
            src: "/images/work/acep-hero.webp",
            alt: "ACEP mobil uygulamasındaki araç genel görünümü"
          },
          {
            src: "/images/work/acep-live.webp",
            alt: "ACEP mobil uygulamasında canlı araç takibi"
          }
        ]
      },
      {
        id: "fiat",
        name: "Fiat Yol Arkadaşım",
        focus: "Ürün katkısı · Backend desteği",
        description:
          "Fiat'ın müşteri ürününün arkasındaki bağlantılı mobilite ekosistemine backend desteği sağladım.",
        url: "https://play.google.com/store/apps/details?id=com.luteg.fiatconnectivity&hl=en_US",
        owner: "Tofaş ürünü · Comodif katkısı",
        source: "Resmî Google Play görselleri",
        icon: "/images/work/fiat-icon.webp",
        images: [
          {
            src: "/images/work/fiat-control.webp",
            alt: "Fiat Yol Arkadaşım uygulamasında uzaktan araç kilitleme kontrolü"
          },
          {
            src: "/images/work/fiat-live.webp",
            alt: "Fiat Yol Arkadaşım uygulamasında canlı araç bildirimi"
          }
        ]
      }
    ]
  },
  {
    company: "Otoparcasan",
    role: "Python Geliştiricisi",
    period: "Oca 2021 — May 2021",
    type: "E-ticaret otomasyonu",
    workplace: "Ofiste · Samsun",
    summary:
      "Bir e-ticaret operasyonu için ürün, stok ve sipariş entegrasyonlarını otomatikleştirdim.",
    highlights: [
      "Python ile XML dönüştürme ve veri aktarım süreçleri geliştirdim.",
      "SQL, Python ve Excel kullanarak operasyonel raporlar hazırladım.",
      "Pazaryeri entegrasyonlarında ürün ve stok verilerinin işlenmesini iyileştirdim."
    ]
  }
];

export const visualProjectsTr = [
  {
    id: "newdrive",
    number: "01",
    title: "NewDrive",
    kicker: "Kişisel dosya çalışma alanı",
    year: "2026",
    image: "/images/projects/newdrive-login.jpg",
    imageAlt:
      "NewDrive güvenli kişisel dosya çalışma alanının sade turkuaz arayüzlü giriş ekranı",
    description:
      "Gizlilik, kurtarılabilirlik ve öngörülebilir işletim odağında geliştirilmiş, kendi sunucunda barındırılabilen kişisel bir dosya kasası. Klasörler, koleksiyonlar, önizlemeler, kotalar, yerel veya R2 depolama ve yeniden denenebilir silme kuyruğunu destekliyor.",
    proof: "Mimari, dağıtım süreci ve hata senaryoları repoda belgelenmiştir.",
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
        label: "Repoyu görüntüle",
        url: "https://github.com/FurkanBerkant/newdrive"
      }
    ]
  },
  {
    id: "reelshelf",
    number: "02",
    title: "ReelShelf",
    kicker: "Uçtan uca medya arşivi",
    year: "2026",
    image: "/images/projects/reelshelf-landing.jpg",
    video: "/images/projects/reelshelf-motion.mp4",
    imageAlt:
      "ReelShelf'in hareketli poster koleksiyonlarına geçiş yapan sinematik açılış sayfası",
    gallery: [
      {
        src: "/images/projects/reelshelf-cinema.jpg",
        alt: "ReelShelf özel sinema koleksiyonu arayüzü"
      },
      {
        src: "/images/projects/reelshelf-library.jpg",
        alt: "ReelShelf geniş kitap koleksiyonu arayüzü"
      }
    ],
    description:
      "Filmler ve kitaplar için sinematik bir kişisel arşiv. Güvenli Spring Boot API; kimlik, sahiplik ve haricî medya verilerini yönetirken modüler Vite frontend görsel deneyimi sunuyor.",
    proof:
      "Frontend ve API ayrı repolarda; kimlik doğrulamalı bir REST sözleşmesiyle birbirine bağlı.",
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
        label: "Frontend reposu",
        url: "https://github.com/FurkanBerkant/reelshelf-frontend"
      },
      {
        label: "Backend API reposu",
        url: "https://github.com/FurkanBerkant/reelShelf"
      }
    ]
  },
  {
    id: "tugrul",
    number: "03",
    title: "Tuğrul Hukuk",
    kicker: "Müşteri web deneyimi",
    year: "2026",
    image: "/images/projects/tugrul-hukuk.jpg",
    imageAlt:
      "Tuğrul Hukuk ve Danışmanlık sitesinin lacivert ve altın tonlarındaki açılış bölümü",
    description:
      "Bir hukuk bürosu için ölçülü ve mevzuat hassasiyetini gözeten bir web sitesi. Güçlü bir editoryal yapı; responsive navigasyon, 3D ayrıntılar ve yapılandırılmış arama metadatasıyla bir araya geliyor.",
    proof:
      "Samsun merkezli bir hukuk bürosu için canlıda çalışıyor; responsive hizmet içerikleri, konum odaklı arama metadatası ve mevzuata duyarlı bir sunum içeriyor.",
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
        label: "Canlı siteyi ziyaret et",
        url: "https://tugrulhukuk.av.tr/"
      },
      {
        label: "Repoyu görüntüle",
        url: "https://github.com/FurkanBerkant/tugrul-hukuk"
      }
    ]
  }
];

export const systemProjectsTr = [
  {
    id: "fund-search",
    number: "04",
    title: "Fund Search",
    type: "Arama altyapısı",
    description:
      "Türk yatırım fonları için Excel'den veri alımı, PostgreSQL kalıcılığı ve toleranslı arama ile karşılaştırma sağlayan asenkron Elasticsearch indekslemesi içeren bir servis.",
    flow: ["Excel", "Veri alımı", "PostgreSQL", "Elasticsearch"],
    tags: ["Java 21", "Spring Boot", "Elasticsearch", "Apache POI"],
    link: "https://github.com/FurkanBerkant/fund-search-service"
  },
  {
    id: "randevio",
    number: "05",
    title: "Randevio",
    type: "Modüler SaaS",
    description:
      "CRM, mağaza, hizmet sağlayıcılar, çalışanlar ve teklif süreçleri arasındaki modüler sınırları araştıran çok kiracılı bir randevu ve hizmet platformu.",
    flow: ["Mağaza", "Modüller", "Olaylar", "MongoDB"],
    tags: ["Spring Modulith", "MongoDB", "OAuth2", "Thymeleaf", "Tailwind"],
    link: "https://github.com/FurkanBerkant/Modular-SaaS-Enterprise"
  }
];

export const capabilitiesTr = [
  {
    id: "build",
    verb: "KUR",
    title: "Servis temelleri",
    description:
      "Değişime, eşzamanlı çalışmaya ve öngörülebilir hata davranışına uygun üretim API'leri ve servis sınırları.",
    technologyIds: ["java", "spring", "python", "grpc"],
    practices: [
      "Spring Cloud",
      "REST API'leri",
      "Mikroservisler",
      "Asenkron ve eşzamanlı programlama"
    ]
  },
  {
    id: "move",
    verb: "AKTAR",
    title: "Olay ve veri akışları",
    description:
      "Operasyonel veriyi işin bağlamını kaybetmeden alan, taşıyan ve kalıcı hâle getiren akışlar.",
    technologyIds: [
      "kafka",
      "postgresql",
      "cassandra",
      "redis",
      "sqlserver",
      "liquibase"
    ],
    practices: [
      "Olay güdümlü mimari",
      "Yüksek hacimli telemetri",
      "Sorgu optimizasyonu"
    ]
  },
  {
    id: "ship",
    verb: "YAYINLA",
    title: "Bulut dağıtımı",
    description:
      "Konteyner derlemesinden küme durumuna uzanan tekrarlanabilir dağıtım; GitOps ile görünür kalan sistem niyeti.",
    technologyIds: ["docker", "kubernetes", "helm", "argocd", "githubactions"],
    practices: ["GitOps", "CI/CD", "Konteyner orkestrasyonu"]
  },
  {
    id: "see",
    verb: "GÖZLE",
    title: "Üretim sinyalleri",
    description:
      "Görünmeyen bir hatayı müdahale edilebilir bir mühendislik sinyaline dönüştüren metrikler, loglar ve uyarılar.",
    technologyIds: ["prometheus", "grafana"],
    practices: [
      "Loki",
      "Kafka gecikme uyarıları",
      "Servis sağlığı",
      "Slack üzerinden sorun aktarımı"
    ]
  }
];

export const educationTr = [
  {
    school: "Karadeniz Teknik Üniversitesi",
    field: "İstatistik ve Bilgisayar Bilimleri, Lisans",
    period: "Tem 2023"
  }
];
