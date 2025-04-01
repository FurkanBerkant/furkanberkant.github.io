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
    "A passionate Backend Software Developer 🚀 experienced in Java, Spring Boot, and microservices architectures, with expertise in Kubernetes, Docker, ArgoCD, and CI/CD processes."
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
  title: "What I do",
  subTitle: "SOFTWARE ENGINEER SPECIALIZED IN BACKEND DEVELOPMENT AND DEVOPS TECHNOLOGIES",
  skills: [
    emoji("⚡ Building scalable backend systems with microservices architecture"),
    emoji("⚡ Containerization and orchestration with Kubernetes and Docker"),
    emoji("⚡ Continuous integration and deployment with CI/CD practices"),
    emoji("⚡ High-performance systems with Redis and Caffeine Cache"),
    emoji("⚡ Database management with PostgreSQL, MySQL, MongoDB, Microsoft SQL Server, and Cassandra"),
    emoji("⚡ RESTful API development and integration"),
    emoji("⚡ Agile project management with Scrum methodology"),
    emoji("⚡ System monitoring and logging with Prometheus, Grafana, and Logback"),
    emoji("⚡ Event-driven systems and messaging with Kafka"),
    emoji("⚡ Application development with Python and C#")
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
      fontAwesomeClassname: "fas fa-stream"
    },
    {
      skillName: "redis",
      fontAwesomeClassname: "fas fa-server"
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
      logo: require("/Users/berkantkubat/Desktop/developerFolio/src/assets/images/ktu.png"),
      subHeader: "Statistics and Computer Science",
      duration: "2019 - 2023",
      desc: "Bachelor's Degree",
      descBullets: []
    },
    {
      schoolName: "Istiklal Technical High School",
      logo: require("/Users/berkantkubat/Desktop/developerFolio/src/assets/images/lise_logo.jpeg"),
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
      companylogo: require("/Users/berkantkubat/Desktop/developerFolio/src/assets/images/comodif.jpg"),
      date: "10/2023 - Present",
      desc: "Developing microservices architectures with Java and Spring Boot, containerization with Kubernetes and Docker, managing CI/CD processes.",
      descBullets: [
        "Development and maintenance of microservices architectures",
        "Management of CI/CD pipelines and Helm-based updates",
        "Kubernetes monitoring with Lens and log analysis",
        "Setting up test environments with Docker"
      ]
    },
    {
      role: "Python Developer",
      company: "Otoparcasan",
      companylogo: require("/Users/berkantkubat/Desktop/developerFolio/src/assets/images/otoparcasan.png"),
      date: "01/2021 - 05/2021",
      desc: "Data analysis and system development for e-commerce product and order management.",
      descBullets: [
        "Data analysis and reporting with Excel and Python",
        "XML-based data integrations and transformations",
        "Product and inventory management through Excel",
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
  title: emoji("Achievements & Certifications 🏆"),
  subtitle: "Certifications and Training Programs I've Completed",

  achievementsCards: [
    {
      title: "Backend Web Development with Java",
      subtitle: "Patika.dev",
      image: require("/Users/berkantkubat/Desktop/developerFolio/src/assets/images/ibm_logo.jpeg"),
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
      image: require("/Users/berkantkubat/Desktop/developerFolio/src/assets/images/ibm_logo.jpeg"),
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
      image: require("/Users/berkantkubat/Desktop/developerFolio/src/assets/images/ibm_logo.jpeg"),
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
      image: require("/Users/berkantkubat/Desktop/developerFolio/src/assets/images/ibm_logo.jpeg"),
      imageAlt: "IBM Logo",
      footerLink: [
        {
          name: "Certificate",
          url: "https://www.credly.com/badges/8ab9e3e3-4e03-41d3-ad55-ede572d652d7/linked_in_profile"
        }
      ]
    },
    {
      title: "Remote Education Participation Certificate",
      subtitle: "TUBITAK BILGEM - OOP (Object-Oriented Programming) and Java",
      image: require("/Users/berkantkubat/Desktop/developerFolio/src/assets/images/tübitak.png"),
      imageAlt: "TUBITAK Logo",
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
  title: "Resume",
  subtitle: "Click to download my resume",
  link: "https://drive.google.com/file/d/1zDHYpIAFdFzZSr_Ltv_T9mvYHOE1I0qf/view?usp=drive_link",
  display: true
};

const contactInfo = {
  title: emoji("Contact Me ☎️"),
  subtitle: "Would you like to get in touch with me?",
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
