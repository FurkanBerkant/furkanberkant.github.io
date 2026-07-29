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
  title: "Hi, I'm Berkant",
  subTitle: emoji(
    "A passionate Backend Software Developer 🚀 experienced in Java, Spring Boot and microservices architecture, with expertise in Kubernetes, Docker, ArgoCD and CI/CD processes."
  ),
  resumeLink: "/Berkant_KUBAT.pdf",
  displayGreeting: true
};

// Social Media Links

const socialMediaLinks = {
  github: "https://github.com/FurkanBerkant",
  linkedin: "https://www.linkedin.com/in/berkantkubat/",
  gmail: "berkantkubat.dev@gmail.com",
  // gitlab: "",
  // facebook: "",
  // medium: "",
  // stackoverflow: "",
  display: true
};

// Skills Section

const skillsSection = {
  title: "What I Do",
  subTitle:
    "BACKEND ENGINEER FOCUSED ON HIGH-PERFORMANCE MICROSERVICES AND EVENT-DRIVEN SYSTEMS",
  skills: [
    emoji(
      "⚡ Designing high-performance backend services with Java, Spring Boot and microservices architecture"
    ),
    emoji(
      "⚡ Building event-driven and real-time data pipelines with Apache Kafka for tens of thousands of devices"
    ),
    emoji(
      "⚡ Improving latency with asynchronous processing, Redis/Caffeine caching and database query optimization"
    ),
    emoji(
      "⚡ Modeling data with PostgreSQL for transactional workloads and Cassandra for high-volume telemetry"
    ),
    emoji(
      "⚡ Deploying and operating cloud-native services with Docker, Kubernetes, Helm, GitHub Actions and ArgoCD"
    ),
    emoji(
      "⚡ Implementing observability with Prometheus, Grafana and Slack-based alerting"
    ),
    emoji(
      "⚡ Developing production-ready APIs and backend services for IoT and data-intensive platforms"
    )
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
      schoolName: "Karadeniz Technical University",
      logo: require("./assets/images/ktu.png"),
      subHeader: "Statistics and Computer Science",
      duration: "2019 - 2023",
      desc: "Bachelor's Degree",
      descBullets: []
    },
    {
      schoolName: "Istiklal Vocational and Technical High School",
      logo: require("./assets/images/lise_logo.jpeg"),
      subHeader: "Database Management",
      duration: "2014 - 2018",
      desc: "High School Education",
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
      companylogo: require("./assets/images/comodif.jpg"),
      date: "10/2023 - 02/2026",
      desc: "Built high-performance backend microservices for IoT and data-intensive platforms using Java, Spring Boot and Kafka.",
      descBullets: [
        "Reduced critical API latency by 50%+ using asynchronous processing, Redis/Caffeine caching and query optimization",
        "Developed Kafka-based telemetry pipelines and Cassandra/PostgreSQL services for storing and querying device data",
        "Deployed and operated microservices with Docker, Kubernetes, Helm, GitHub Actions and ArgoCD (GitOps)",
        "Implemented observability with Prometheus, Grafana and Slack alerts for Kafka lag and service health across 60K+ devices",
        "Collaborated with a 10+ person cross-functional Agile team through code reviews and pair programming"
      ]
    },
    {
      role: "Python Developer",
      company: "Otoparcasan",
      companylogo: require("./assets/images/otoparcasan.png"),
      date: "01/2021 - 05/2021",
      desc: "Development of product and order integration systems for e-commerce site and data analysis work.",
      descBullets: [
        "Data analysis and reporting with Excel and Python",
        "XML-based data integrations and transformations",
        "Product and inventory data management through Excel",
        "Data analysis and reporting with SQL queries",
        "Automated data transfer systems for e-commerce platforms"
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
  title: emoji("Certificates 🏆"),
  subtitle: "Trainings and Certificates I Have Received",

  achievementsCards: [
    {
      title: "Beginner Level Java with Backend Web Development Path",
      subtitle: "Patika.dev",
      image: require("./assets/images/ibm_logo.jpeg"),
      imageAlt: "Java Logo",
      footerLink: [
        {
          name: "Certificate",
          url: "https://academy.patika.dev/certificates/bmkn4Pb"
        }
      ]
    },
    {
      title: "Working in a Digital World: Professional Skills",
      subtitle: "Coursera - University of Leeds",
      image: require("./assets/images/ibm_logo.jpeg"),
      imageAlt: "Professional Skills Logo",
      footerLink: [
        {
          name: "Certificate",
          url: "https://www.credly.com/badges/cf360c47-3c70-4656-accf-b0c6910b1c40/linked_in_profile"
        }
      ]
    },
    {
      title: "Explore Emerging Tech",
      subtitle: "IBM",
      image: require("./assets/images/ibm_logo.jpeg"),
      imageAlt: "IBM Logo",
      footerLink: [
        {
          name: "Certificate",
          url: "https://www.credly.com/badges/e5c28e80-9d6b-4906-984c-5270247e5583/linked_in?t=sddiuv"
        }
      ]
    },
    {
      title: "Cybersecurity Fundamentals",
      subtitle: "IBM",
      image: require("./assets/images/ibm_logo.jpeg"),
      imageAlt: "IBM Logo",
      footerLink: [
        {
          name: "Certificate",
          url: "https://www.credly.com/badges/8ab9e3e3-4e03-41d3-ad55-ede572d652d7/linked_in_profile"
        }
      ]
    },
    {
      title: "Remote Education Gateway Participation Certificate",
      subtitle: "TÜBİTAK BİLGEM - OOP (Object-Oriented Programming) and Java",
      image: require("./assets/images/tübitak.png"),
      imageAlt: "TÜBİTAK Logo",
      footerLink: [
        {
          name: "Certificate",
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
  link: "/Berkant_KUBAT.pdf",
  display: true
};

const contactInfo = {
  title: emoji("Contact ☎️"),
  subtitle: "Would you like to get in touch with me?",
  number: "",
  email_address: "berkantkubat.dev@gmail.com"
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
