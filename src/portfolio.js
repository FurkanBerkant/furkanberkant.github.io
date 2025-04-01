/* Change this file to get your personal Portfolio */

// To change portfolio colors globally go to the  _globalColor.scss file

import emoji from "react-easy-emoji";
import splashAnimation from "./assets/lottie/splashAnimation"; // Rename to your file name for custom animation

// Splash Screen

const splashScreen = {
  enabled: true, // set false to disable splash screen
  animation: splashAnimation,
  duration: 2000 // Set animation duration as per your animation
};

// Summary And Greeting Section

const illustration = {
  animated: true // Set to false to use static SVG
};

const greeting = {
  username: "Berkant Kubat",
  title: "Merhaba, Ben Berkant",
  subTitle: emoji(
    "Tutkulu bir Backend Software Developer 🚀 Java, Spring Boot ve mikroservis mimarileri konusunda deneyimli, Kubernetes, Docker, ArgoCD ve CI/CD süreçlerinde tecrübeli."
  ),
  resumeLink: "https://drive.google.com/file/d/1zDHYpIAFdFzZSr_Ltv_T9mvYHOE1I0qf/view?usp=drive_link",
  displayGreeting: true
};

// Social Media Links

const socialMediaLinks = {
  github: "https://github.com/FurkanBerkant",
  linkedin: "https://www.linkedin.com/in/berkantkubat/",
  gmail: "kubatb35@gmail.com",
  // gitlab: "",
  // facebook: "",
  // medium: "",
  // stackoverflow: "",
  display: true
};

// Skills Section

const skillsSection = {
  title: "Neler Yapıyorum",
  subTitle: "BACKEND GELİŞTİRME VE DEVOPS TEKNOLOJİLERİNDE UZMANLAŞMIŞ YAZILIM MÜHENDİSİ",
  skills: [
    emoji("⚡ Mikroservis mimarileri ile ölçeklenebilir backend sistemleri geliştirme"),
    emoji("⚡ Kubernetes ve Docker ile konteynerize uygulamalar ve orkestrasyon"),
    emoji("⚡ CI/CD süreçleri ve DevOps pratikleri ile sürekli entegrasyon ve dağıtım"),
    emoji("⚡ Redis ve Caffeine Cache ile yüksek performanslı sistemler"),
    emoji("⚡ PostgreSQL, MySQL, MongoDB, Microsoft SQL Server ve Cassandra veritabanı yönetimi"),
    emoji("⚡ RESTful API geliştirme ve entegrasyon"),
    emoji("⚡ Agile/Scrum metodolojileri ile çevik proje yönetimi"),
    emoji("⚡ Prometheus, Grafana ve Logback ile sistem izleme ve loglama"),
    emoji("⚡ Event-driven sistemler ve Kafka ile mesajlaşma mimarileri"),
    emoji("⚡ Python ve C# ile uygulama geliştirme deneyimi")
  ],

  /* Make Sure to include correct Font Awesome Classname to view your icon
https://fontawesome.com/icons?d=gallery */

  softwareSkills: [
    {
      skillName: "java",
      fontAwesomeClassname: "fab fa-java"
    },
    {
      skillName: "python",
      fontAwesomeClassname: "fab fa-python"
    },
    {
      skillName: "Spring",
      fontAwesomeClassname: "fas fa-leaf"
    },
    {
      skillName: "docker",
      fontAwesomeClassname: "fab fa-docker"
    },
    {
      skillName: "kubernetes",
      fontAwesomeClassname: "fas fa-dharmachakra"
    },
    {
      skillName: "database",
      fontAwesomeClassname: "fas fa-database"
    },
    {
      skillName: "git",
      fontAwesomeClassname: "fab fa-git-alt"
    },
    {
      skillName: "kafka",
      fontAwesomeClassname: "devicon-apachekafka-original"
    },
    {
      skillName: "redis",
      fontAwesomeClassname: "devicon-redis-plain"
    },
    {
      skillName: "C#",
      fontAwesomeClassname: "devicon-csharp-plain"
    }
  ],
  display: true
};

// Education Section

const educationInfo = {
  display: true,
  schools: [
    {
      schoolName: "Karadeniz Teknik Üniversitesi",
      logo: require("/Users/berkantkubat/Desktop/developerFolio/src/assets/images/ktu.png"),
      subHeader: "İstatistik Ve Bilgisayar Bilimleri",
      duration: "2019 - 2023",
      desc: "Lisans Derecesi",
      descBullets: []
    },
    {
      schoolName: "İstiklal Mesleki Ve Teknik Anadolu Lisesi",
      logo: require("/Users/berkantkubat/Desktop/developerFolio/src/assets/images/lise_logo.jpeg"),
      subHeader: "Veri Tabanı Alanı",
      duration: "2014 - 2018",
      desc: "Lise Eğitimi",
      descBullets: []
    }
  ]
};

// Your top 3 proficient stacks/tech experience

const techStack = {
  viewSkillBars: true,
  experience: [
    {
      Stack: "Backend Development",
      progressPercentage: "90%"
    },
    {
      Stack: "DevOps & Cloud",
      progressPercentage: "80%"
    },
    {
      Stack: "Database Management",
      progressPercentage: "85%"
    }
  ],
  displayCodersrank: false
};

// Work experience section

const workExperiences = {
  display: true,
  experience: [
    {
      role: "Software Engineer",
      company: "Comodif",
      companylogo: require("/Users/berkantkubat/Desktop/developerFolio/src/assets/images/comodif.jpg"),
      date: "10/2023 - Present",
      desc: "Java ve Spring Boot ile mikroservis mimarileri geliştirme, Kubernetes ve Docker ile konteynerizasyon, CI/CD süreçleri yönetimi.",
      descBullets: [
        "Mikroservis mimarilerinin geliştirilmesi ve bakımı",
        "CI/CD pipeline'larının yönetimi ve Helm-based güncellemeler",
        "Lens ile Kubernetes izleme ve log analizi",
        "Docker ile test ortamlarının kurulumu"
      ]
    },
    {
      role: "Python Developer",
      company: "Otoparçasan",
      companylogo: require("/Users/berkantkubat/Desktop/developerFolio/src/assets/images/otoparcasan.png"),
      date: "01/2021 - 05/2021",
      desc: "E-ticaret sitesi için ürün ve sipariş entegrasyon sistemlerinin geliştirilmesi ve veri analizi çalışmaları.",
      descBullets: [
        "Excel ve Python ile veri analizi ve raporlama",
        "XML tabanlı veri entegrasyonları ve dönüşümleri",
        "Ürün ve stok verilerinin Excel üzerinden yönetimi",
        "SQL sorguları ile veri analizi ve raporlama",
        "E-ticaret platformları için otomatik veri aktarım sistemleri"
      ]
    }
  ]
};

/* Your Open Source Section to View Your Github Pinned Projects
To know how to get github key look at readme.md */

const openSource = {
  display: false
};

// Some big projects you have worked on

const bigProjects = {
  display: false
};

// Achievement Section
// Include certificates, talks etc

const achievementSection = {
  title: emoji("Sertifikalar 🏆"),
  subtitle: "Aldığım Eğitimler ve Sertifikalar",

  achievementsCards: [
    {
      title: "Başlangıç Seviye Java ile Backend Web Development Patikası",
      subtitle: "Patika.dev",
      image: require("/Users/berkantkubat/Desktop/developerFolio/src/assets/images/ibm_logo.jpeg"),
      imageAlt: "Java Logo",
      footerLink: [
        {
          name: "Sertifika",
          url: "https://academy.patika.dev/certificates/bmkn4Pb"
        }
      ]
    },
    {
      title: "Working in a Digital World: Professional Skills",
      subtitle: "Coursera - University of Leeds",
      image: require("/Users/berkantkubat/Desktop/developerFolio/src/assets/images/ibm_logo.jpeg"),
      imageAlt: "Professional Skills Logo",
      footerLink: [
        {
          name: "Sertifika",
          url: "https://www.credly.com/badges/cf360c47-3c70-4656-accf-b0c6910b1c40/linked_in_profile"
        }
      ]
    },
    {
      title: "Explore Emerging Tech",
      subtitle: "IBM",
      image: require("/Users/berkantkubat/Desktop/developerFolio/src/assets/images/ibm_logo.jpeg"),
      imageAlt: "IBM Logo",
      footerLink: [
        {
          name: "Sertifika",
          url: "https://www.credly.com/badges/e5c28e80-9d6b-4906-984c-5270247e5583/linked_in?t=sddiuv"
        }
      ]
    },
    {
      title: "Cybersecurity Fundamentals",
      subtitle: "IBM",
      image: require("/Users/berkantkubat/Desktop/developerFolio/src/assets/images/ibm_logo.jpeg"),
      imageAlt: "IBM Logo",
      footerLink: [
        {
          name: "Sertifika",
          url: "https://www.credly.com/badges/8ab9e3e3-4e03-41d3-ad55-ede572d652d7/linked_in_profile"
        }
      ]
    },
    {
      title: "Uzaktan eğitim kapısı katılım sertifikası",
      subtitle: "TÜBİTAK BİLGEM - OOP (Nesne Yönelimli Programlama) ve Java",
      image: require("/Users/berkantkubat/Desktop/developerFolio/src/assets/images/tübitak.png"),
      imageAlt: "TÜBİTAK Logo",
      footerLink: [
        {
          name: "Sertifika",
          url: "https://www.linkedin.com/in/berkantkubat/details/certifications/1635544377463/single-media-viewer/?type=DOCUMENT&profileId=ACoAAC-_98MB8o1zPmksjqm1QEQ_mNRch5IRWzA"
        }
      ]
    }
  ],
  display: true
};

// Blogs Section

const blogSection = {
  display: false
};

// Talks Sections

const talkSection = {
  display: false
};

// Podcast Section

const podcastSection = {
  display: false
};

// Resume Section
const resumeSection = {
  title: "CV",
  subtitle: "Özgeçmişimi indirmek için tıklayın",
  link: "https://drive.google.com/file/d/1zDHYpIAFdFzZSr_Ltv_T9mvYHOE1I0qf/view?usp=drive_link",
  display: true
};

const contactInfo = {
  title: emoji("İletişim ☎️"),
  subtitle: "Benimle iletişime geçmek ister misiniz?",
  number: "",
  email_address: "kubatb35@gmail.com"
};

// Twitter Section

const twitterDetails = {
  display: false
};

const isHireable = true;

export {
  illustration,
  greeting,
  socialMediaLinks,
  splashScreen,
  skillsSection,
  educationInfo,
  techStack,
  workExperiences,
  openSource,
  bigProjects,
  achievementSection,
  blogSection,
  talkSection,
  podcastSection,
  contactInfo,
  twitterDetails,
  isHireable,
  resumeSection
};
