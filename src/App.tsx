import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, MotionConfig, useScroll, useTransform } from "motion/react";
import {
  ArrowUpRight,
  ArrowDown,
  Github,
  Linkedin,
  Mail,
  Phone,
  Download,
  GraduationCap,
  BookOpen,
  Award,
  Layers,
  ChevronDown,
  Send,
  Sparkles,
  Rocket
} from "lucide-react";
import CaseStudyModal from "./components/CaseStudyModal.tsx";
import MagicBento, { MagicBentoCard } from "./components/MagicBento.tsx";
import DotGrid from "./components/DotGrid.tsx";
import RocketJourney from "./components/RocketJourney.tsx";
import OutlineStack from "./components/OutlineStack.tsx";
import { Squiggle, Zigzag, Ring, Square, Arc, Plus, Dot, Capsule, Burst, Floaty, SpinBadge, CloudBank } from "./components/Doodles.tsx";

const BASE = import.meta.env.BASE_URL;

const C = {
  ink: "#0A0915",
  night: "#15114A",
  deep: "#100E28",
  electric: "#6C5CFF",
  hot: "#FF3D81",
  cyan: "#3DE3F2",
  sun: "#FFC93C",
  mint: "#3DF2A6",
  orange: "#FF8A3D",
  cream: "#F6F1E7"
};

const PROJECTS = [
  {
    title: "Clairo",
    category: "Teacher-in-the-Loop AI LMS Platform",
    description: "A functional AI-native learning management platform for Kurikulum Merdeka with architectural teacher approval gates, 14 Gemini AI functions, and Edpuzzle-style interactive video studio.",
    tags: ["Gemini AI Service Layer", "Teacher-in-the-Loop", "React 19 & Firebase"],
    image: `${BASE}images/clairo-mockup.webp`,
    imageSize: [1024, 617],
    link: "https://github.com/faiqxz",
    accent: C.electric
  },
  {
    title: "Yappy",
    category: "Language Learning Application",
    description: "3rd Place winner at UIUX Competition. An AI-native language app integrating interactive conversational scenarios and Maze-validated voice interfaces.",
    tags: ["Award Winning", "Conversational AI", "Maze Testing"],
    image: `${BASE}images/yappy-mockup.webp`,
    imageSize: [600, 1180],
    link: "https://bit.ly/YappyPPT",
    accent: C.sun
  },
  {
    title: "Neurofit",
    category: "Fitness Mobile Application",
    description: "A structured workout logs app designed from problem definition to Maze validation, supporting progressive overload tracking and muscle analytics.",
    tags: ["UX Research", "Design System", "Data Visualization"],
    image: `${BASE}images/neurofit-mockup.webp`,
    imageSize: [600, 1180],
    link: "https://bit.ly/NeurofitPPT",
    accent: C.cyan
  },
  {
    title: "PrimaPlus",
    category: "Health Consultant Application",
    description: "A digital health platform streamlining medical directories and patient consulting records, mapping clinical user flows for high accessibility.",
    tags: ["Information Architecture", "HealthTech", "Figma Components"],
    image: `${BASE}images/primaplus-mockup.webp`,
    imageSize: [600, 1180],
    link: "https://bit.ly/PrimaPLus",
    accent: C.mint
  },
  {
    title: "FitMart",
    category: "E-Commerce & Workout App",
    description: "An integrated e-commerce shop and workout mobile prototype mapping seamless navigation across supplementation shopping and fitness logging.",
    tags: ["UI/UX Design", "Cross-Domain Flows", "Maze Usability"],
    image: `${BASE}images/fitmart-mockup.webp`,
    imageSize: [600, 1180],
    link: "https://bit.ly/Prototype-FitMart",
    accent: C.hot
  },
  {
    title: "Travelin",
    category: "Integrated Travel & Booking App",
    description: "GDGoC Mobile application streamlining joint flight and lodging reservations with a simplified, transparent rescheduling and refund management system.",
    tags: ["GDGoC Challenge", "Travel Booking", "Reschedule & Refund Flow"],
    image: `${BASE}images/travelin-mockup.webp`,
    imageSize: [600, 1180],
    link: "https://bitly.cx/Travelin",
    accent: C.orange
  },
  {
    title: "UNSRI GO",
    category: "Academic Portal & Campus Assistant",
    description: "An academic mobile application for Universitas Sriwijaya students, organizing course registrations, real-time campus shuttle tracking, and exam schedules.",
    tags: ["EdTech", "Campus Services", "Mobile Portal"],
    image: `${BASE}images/unsri-go-mockup.webp`,
    imageSize: [600, 1180],
    link: "https://unsri.ac.id",
    accent: C.sun
  }
];

// Hero fan of phones. `tilt`/`scale` only apply on desktop where the parallax runs.
const HERO_PHONES = [
  { src: `${BASE}images/yappy-mockup.webp`, alt: "Yappy app mockup", tilt: -6, scale: 0.85 },
  { src: `${BASE}images/neurofit-mockup.webp`, alt: "Neurofit app mockup", tilt: -3, scale: 0.92 },
  { src: `${BASE}images/travelin-mockup.webp`, alt: "Travelin app mockup", tilt: 0, scale: 1, center: true },
  { src: `${BASE}images/primaplus-mockup.webp`, alt: "PrimaPlus app mockup", tilt: 3, scale: 0.92 },
  { src: `${BASE}images/fitmart-mockup.webp`, alt: "FitMart app mockup", tilt: 6, scale: 0.85 }
];

const EXPERIENCE = [
  {
    role: "Frontend Developer",
    company: "RS UMMI (Electronic Medical Record System)",
    period: "Aug 2026 - Present",
    description: "Designed and developed enterprise EMR clinical forms (Discharge Planning RM 16.F, Inpatient Obstetric Initial Assessment) in CodeIgniter 3 and Bootstrap. Engineered a custom @media print layout engine with side-by-side signature alignment and page-break control.",
    metrics: "Digitized 3 core clinical forms; reduced print layout rendering bugs to 0%."
  },
  {
    role: "Property Manager & Designer",
    company: "Kos Nyaman",
    period: "Sep 2024 - Present",
    description: "Built and deployed a responsive property rental platform using AI-native design systems in a React stack (published). Developing an occupancy dashboard integrating Firebase and LLM chatbot assistants for customer support(under development).",
    metrics: "Launched web platform; reduced tenant onboarding inquiries by 35% through dynamic FAQs.",
    link: "https://kos-nyaman.vercel.app/"
  },
  {
    role: "Community Service Lead — Website Design Training",
    company: "LPPM, Universitas Sriwijaya",
    period: "Aug 2025 - Oct 2025",
    description: "Initiated and taught a structured training program enabling non-technical participants to construct modern educational web interfaces utilizing AI-assisted UI tools.",
    metrics: "Mentored 20+ Teachers; achieved 92% training completion rating."
  },
  {
    role: "Lab Assistant",
    company: "Computer Networking Lab",
    period: "Aug 2024 - Mar 2025",
    description: "Delivered networking instruction (OSI model, TCP/IP, subnetting) and supervised Cisco Packet Tracer simulations and physical LAN router setups for undergraduate students.",
    metrics: "Instructed 60+ undergraduate students across 2 lab sections."
  },
  {
    role: "UI/UX Designer Intern",
    company: "PT Bukit Asam Tbk (Persero)",
    period: "Jun 2024 - Jul 2024",
    description: "Designed end-to-end Figma UI/UX interfaces for CISEA sub-application and APLB LB3 Waste Management system, translating engineering requirements into stakeholder-validated interaction flows.",
    metrics: "Delivered 2 complete design systems and interactive prototypes for production handoff."
  }
];

const ORGANIZATIONS = [
  {
    organization: "GDG on Campus: Universitas Sriwijaya",
    role: "UI/UX Member",
    period: "Jan 2025 - Nov 2025",
    tagline: "Inspiring female tech leaders and building design systems",
    bullets: [
      "Led property design coordination for InspireHER 2025: BLOOM Event.",
      "Designed UI/UX prototypes for digital product case studies.",
      "Built design systems and reusable UI components using Figma.",
      "Created wireframes, prototypes, and micro-interaction flows.",
      "Conducted usability testing and iterative design refinement."
    ],
    image: `${BASE}images/gdg-experience.webp`
  },
  {
    organization: "Media Sistem Informasi Unsri",
    role: "Staff of Videography / Photography Division",
    period: "May 2024 - Jan 2025",
    tagline: "Capturing and editing visual stories for campus media",
    bullets: [
      "Served as video evaluation jury for the PKKMB Department program.",
      "Produced and edited video content for event documentation and promotional media.",
      "Created after-movie recap videos to summarize event activities and engagement."
    ],
    image: `${BASE}images/media-experience.webp`
  },
  {
    organization: "Intel Fasilkom Unsri",
    role: "Staff of Media and Information Department",
    period: "Mar 2024 - Jan 2025",
    tagline: "Structuring visual communications and print layouts",
    bullets: [
      "Led videography production for the International English Fest (IEF).",
      "Designed digital and printed media materials (proposal layouts, plaques, live report templates, pamphlets, banners).",
      "Produced and edited after-movie recap videos."
    ],
    image: `${BASE}images/intel-experience.webp`
  },
  {
    organization: "Comnets Research Group",
    role: "Member & Executive Committee Carnaval IMWORK 2024",
    period: "Jan 2024 - Jan 2025",
    tagline: "Collaborative networking research and event execution",
    bullets: [
      "Participated in research discussions and collaborative technical learning activities.",
      "Contributed to knowledge exchange on networking and technology topics.",
      "Served as Executive Committee member for the 6th Carnaval IMWORK 2024."
    ],
    image: `${BASE}images/comnets-experience.webp`
  }
];
const ORG_ACCENTS = [C.cyan, C.sun, C.hot, C.mint];

const SKILLS_CATEGORIES = [
  {
    title: "UX Research & Design",
    skills: ["User Interviews", "Maze Usability Testing", "Design Thinking", "Information Architecture", "User Personas", "Wireframing", "High-Fidelity Prototyping", "Design Systems", "SUS Usability Analytics", "Print CSS (@media print)"]
  },
  {
    title: "AI-Native Workflow",
    skills: ["Antigravity AI", "Google Gemini API", "Teacher-in-the-Loop AI", "Claude API", "OpenAI GPT", "v0 by Vercel", "Cursor", "Google Stitch"]
  },
  {
    title: "Development Stack",
    skills: ["TypeScript", "React 19", "Next.js", "Vite", "Tailwind CSS v4", "CodeIgniter 3", "PHP", "Express.js", "Firebase Firestore", "SQL"]
  }
];

const PUBLICATIONS = [
  {
    title: "Hybrid Fine-Tuning of IndoBERT and Ensemble TF-IDF Logistic Regression for Sentiment Analysis of Zalora App Reviews",
    journal: "Rabit: Jurnal Teknologi dan Sistem Informasi Univrab",
    date: "Jan 2026",
    link: "https://ejournal.univrab.ac.id/index.php/rabit"
  },
  {
    title: "Detecting User Sentiment of Application X Towards the Free Lunch Work Program Using LSTM",
    journal: "JATI (Jurnal Teknologi dan Informasi)",
    date: "May 2025",
    link: "https://ejournal.unikom.ac.id/index.php/jati"
  }
];

const STATS = [
  { value: "07", label: "Case studies, each Maze-validated", color: C.cyan, icon: Layers },
  { value: "3RD", label: "National UI/UX Design, SI FEST 2024", color: C.sun, icon: Award },
  { value: "3.96", label: "GPA, Cum Laude — Universitas Sriwijaya", color: C.hot, icon: GraduationCap }
];

const SOCIAL_LINKS = [
  { icon: Linkedin, url: "http://www.linkedin.com/in/alikhsanfaiq/", label: "LinkedIn" },
  { icon: Github, url: "https://github.com/faiqxz", label: "GitHub" },
  { icon: Mail, url: "mailto:faiqsc@gmail.com", label: "Mail" },
  { icon: Phone, url: "https://wa.me/6287899677415", label: "WhatsApp" }
];

const NAV_LINKS = ["Work", "About", "Experience", "Contact"];
// The small morphing traveler ends its trip by docking into the big rocket on the launch pad.
const JOURNEY_SECTIONS = ["top", "work", "about", "experience", "organizations", "launch"];

// Hero exhaust puffs: [x %, y %, size % of the smoke box width, animation offset s]
const SMOKE: [number, number, number, number][] = [
  [50, 4, 20, 0], [44, 13, 26, 0.4], [57, 15, 25, 0.9],
  [50, 25, 31, 0.6], [37, 31, 33, 0.2], [63, 33, 35, 1.1],
  [50, 46, 42, 1.3], [29, 53, 39, 0.8], [71, 55, 41, 0.3],
  [40, 72, 48, 0.1], [62, 75, 50, 0.7], [17, 80, 42, 0.5], [84, 82, 44, 1.0]
];
const RESUME_URL = "https://drive.google.com/drive/folders/19sAP-y6eZ6nVmynZCHuWvek-VLisyvfa";

const reveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }
};

/** Mono eyebrow label used above every section heading. */
const Eyebrow = ({ children, color = C.cyan }: { children: React.ReactNode; color?: string }) => (
  <span className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color }}>
    <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
    {children}
  </span>
);

export default function App() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedExperience, setExpandedExperience] = useState<number | null>(null);
  const [emailInput, setEmailInput] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const launchRef = useRef<HTMLElement>(null);
  // Read the breakpoint synchronously so desktop doesn't render the mobile layout first and then jump.
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia("(min-width: 1024px)").matches);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => setIsDesktop(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Lock page scroll behind the mobile menu / case study panel, and let Escape close them.
  const overlayOpen = isMenuOpen || selectedProject !== null;
  useEffect(() => {
    if (!overlayOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
        setSelectedProject(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [overlayOpen]);

  // Close the mobile menu if the viewport grows past the hamburger breakpoint.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => mq.matches && setIsMenuOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Hero: phone fan parallax + headline drift.
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const yPhone1 = useTransform(scrollYProgress, [0, 1], [80, -120]);
  const yPhone2 = useTransform(scrollYProgress, [0, 1], [40, -60]);
  const yPhone3 = useTransform(scrollYProgress, [0, 1], [0, 10]);
  const yPhone4 = useTransform(scrollYProgress, [0, 1], [40, -60]);
  const yPhone5 = useTransform(scrollYProgress, [0, 1], [80, -120]);
  const phoneY = [yPhone1, yPhone2, yPhone3, yPhone4, yPhone5];
  const headlineY = useTransform(scrollYProgress, [0, 1], [0, 140]);

  // Launch pad: the rocket keeps climbing and the two words part as you scroll on into contact.
  const { scrollYProgress: launchProgress } = useScroll({
    target: launchRef,
    offset: ["start end", "end start"]
  });
  const rocketY = useTransform(launchProgress, [0.35, 1], [0, -360]);
  const wordLeftX = useTransform(launchProgress, [0.35, 1], [0, -180]);
  const wordRightX = useTransform(launchProgress, [0.35, 1], [0, 180]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmailInput("");
      }, 4000);
    }
  };

  const visibleProjects = showAllProjects ? PROJECTS : PROJECTS.slice(0, 3);

  return (
    <MotionConfig reducedMotion="user">
      <div ref={rootRef} className="relative min-h-screen overflow-x-clip bg-ink text-cream">
        <div className="noise-overlay" />

        {/* Morphing rocket that flies through every section */}
        <RocketJourney rootRef={rootRef} sectionIds={JOURNEY_SECTIONS} />

        {/* ───────────────── Nav ───────────────── */}
        <nav className="fixed left-1/2 top-4 z-40 flex h-14 w-[calc(100%-2rem)] max-w-5xl -translate-x-1/2 items-center justify-between rounded-full border border-white/10 bg-ink/75 pl-5 pr-2 shadow-[0_10px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl md:top-6 md:h-16 md:w-[90%] md:pl-7">
          <a href="#top" className="font-display text-2xl tracking-wide md:text-[1.7rem]">
            FAIQ<span className="text-hot">.</span>
          </a>

          <div className="hidden items-center gap-8 text-xs font-bold uppercase tracking-[0.18em] text-cream/60 md:flex">
            {NAV_LINKS.slice(0, 3).map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="transition-colors hover:text-cream">
                {item}
              </a>
            ))}
          </div>

          <a href="#contact" className="btn btn-hot hidden !py-3 md:inline-flex">
            Let's talk <ArrowUpRight className="h-3.5 w-3.5" />
          </a>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan md:hidden"
          >
            <div className="flex h-4 w-5 flex-col items-center justify-between">
              <span className={`h-[2px] w-5 rounded-full bg-cream transition-transform duration-300 ${isMenuOpen ? "translate-y-[7px] rotate-45" : ""}`} />
              <span className={`h-[2px] w-5 rounded-full bg-cream transition-opacity duration-300 ${isMenuOpen ? "opacity-0" : ""}`} />
              <span className={`h-[2px] w-5 rounded-full bg-cream transition-transform duration-300 ${isMenuOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
            </div>
          </button>
        </nav>

        {/* Fullscreen mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 flex flex-col justify-center overflow-hidden bg-ink/[0.98] px-8 md:hidden"
            >
              <div className="starfield absolute inset-0 opacity-50" aria-hidden="true" />
              <Floaty className="right-10 top-28"><Ring color={C.hot} size={40} /></Floaty>
              <Floaty className="bottom-40 right-16" duration={9}><Zigzag color={C.sun} size={56} /></Floaty>
              <div className="relative flex flex-col gap-3 text-left">
                {NAV_LINKS.map((item, idx) => (
                  <motion.a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    onClick={() => setIsMenuOpen(false)}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 * idx, duration: 0.45 }}
                    className={`font-display text-7xl uppercase leading-none ${idx % 2 ? "text-outline" : ""}`}
                  >
                    {item}
                  </motion.a>
                ))}
              </div>
              <div className="absolute bottom-[max(3rem,env(safe-area-inset-bottom))] left-8 space-y-4">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-cream/40">Let's Connect</span>
                <div className="flex gap-6">
                  {SOCIAL_LINKS.map(soc => (
                    <a key={soc.label} href={soc.url} target="_blank" rel="noopener noreferrer" aria-label={soc.label} className="-m-2 p-2 text-cream/60 hover:text-cream">
                      <soc.icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ───────────────── Hero ───────────────── */}
        <section
          id="top"
          ref={heroRef}
          className="relative z-10 overflow-hidden bg-[radial-gradient(120%_75%_at_50%_0%,#3123B5_0%,#1A1360_40%,#120D45_72%,#0F0B3A_100%)] pt-28 md:pt-36"
        >
          <div className="starfield pointer-events-none absolute inset-0 opacity-80" aria-hidden="true" />

          {/* Doodles */}
          <Floaty className="left-[5%] top-[18%]" duration={7}><Squiggle color={C.cyan} size={76} /></Floaty>
          <Floaty className="right-[7%] top-[14%]" duration={8} delay={1}><Ring color={C.hot} size={52} /></Floaty>
          <Floaty className="left-[12%] top-[46%] hidden sm:block" duration={9} delay={0.5} rotate={-12}><Zigzag color={C.sun} size={66} /></Floaty>
          <Floaty className="right-[14%] top-[40%] hidden sm:block" duration={6.5} delay={1.6} rotate={18}><Square color={C.electric} size={42} /></Floaty>
          <Floaty className="left-[3%] top-[62%] hidden lg:block" duration={8.5} delay={2}><Plus color={C.hot} size={30} /></Floaty>
          <Floaty className="right-[4%] top-[60%] hidden lg:block" duration={7.5} delay={0.8}><Arc color={C.cyan} size={54} /></Floaty>
          <Floaty className="left-[30%] top-[10%] hidden md:block" duration={6} delay={1.2}><Dot color={C.sun} size={12} /></Floaty>
          <Floaty className="right-[30%] top-[30%] hidden md:block" duration={7} delay={0.3}><Dot color={C.cyan} size={9} /></Floaty>

          <div className="relative z-10 mx-auto max-w-[1440px] px-4 text-center">
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-cream/70"
            >
              Al Ikhsan Faiq <span className="text-hot">/</span> UI/UX &amp; Product Designer
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              style={{ y: isDesktop ? headlineY : 0 }}
              className="mt-5 font-display text-[clamp(3.6rem,15vw,13rem)] uppercase leading-[0.86]"
            >
              <span className="block">UI/UX that</span>
              <span className="block">
                <span className="text-hot">takes</span> <span className="text-outline">off.</span>
              </span>
            </motion.h1>
            <h2 className="sr-only">Al Ikhsan Faiq — UI Designer &amp; Product Designer</h2>
          </div>

          {/* 5-phone fan, overlapping the headline like a sticker punched through the type */}
          <div className="relative z-20 -mt-[8vw] flex w-full justify-center md:-mt-[6vw]">
            <div className="pointer-events-none absolute -top-10 h-[420px] w-[900px] max-w-[160%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(108,92,255,0.45)_0%,transparent_68%)]" aria-hidden="true" />
            <div className="relative z-20 flex w-full max-w-full snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-[calc(50%-110px)] pb-6 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-6 sm:px-[calc(50%-125px)] md:px-[calc(50%-135px)] lg:items-end lg:justify-center lg:gap-4 lg:overflow-visible lg:px-0 lg:pb-0 xl:gap-8 [&::-webkit-scrollbar]:hidden">
              {HERO_PHONES.map((phone, i) => (
                <motion.div
                  key={phone.src}
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.35 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className="shrink-0 snap-center"
                >
                  <motion.div
                    style={isDesktop ? { y: phoneY[i], rotate: phone.tilt, scale: phone.scale } : { y: 0, rotate: 0, scale: 1 }}
                    className={`w-[220px] origin-bottom sm:w-[250px] md:w-[270px] lg:will-change-transform ${
                      phone.center ? "z-30 lg:w-[clamp(160px,16.5vw,245px)]" : "lg:w-[clamp(155px,16vw,240px)]"
                    }`}
                  >
                    <img
                      src={phone.src}
                      alt={phone.alt}
                      width={600}
                      height={1180}
                      decoding="async"
                      fetchPriority={phone.center ? "high" : "auto"}
                      className="h-auto w-full object-contain"
                    />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Intro + connect */}
          <div className="relative z-30 mx-auto grid max-w-6xl items-end gap-10 px-5 pb-[calc(max(170px,16vw)+2.5rem)] pt-12 md:grid-cols-[1.25fr_1fr] md:gap-16 md:px-10 md:pt-16">
            <motion.div {...reveal} className="text-left">
              <p className="text-3xl font-semibold leading-[1.15] tracking-tight md:text-4xl">
                Human-centered UI/UX,
                <br />
                <span className="text-cyan">AI-native</span> engineering.
              </p>
              <p className="mt-5 max-w-lg text-base font-light leading-relaxed text-cream/65 md:text-lg">
                Hi, call me <span className="font-semibold text-cream">Faiq</span>. I'm an Information Systems graduate (GPA 3.96, Cum Laude) specializing in human-centered UI/UX and AI-native design engineering.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#work" className="btn btn-hot">
                  See my work <ArrowDown className="h-3.5 w-3.5" />
                </a>
                <a href={RESUME_URL} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                  <Download className="h-3.5 w-3.5" /> Resume
                </a>
              </div>
            </motion.div>

            <motion.form
              {...reveal}
              onSubmit={handleSubscribe}
              className="relative rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-5 text-left md:p-6"
            >
              <Burst color={C.sun} size={74} className="absolute -right-4 -top-8 rotate-12">
                <Rocket className="h-6 w-6 text-ink" />
              </Burst>
              <Eyebrow color={C.sun}>Let's connect</Eyebrow>
              <p className="mt-3 text-sm leading-relaxed text-cream/60">Leave your email to start a conversation about your next product.</p>
              <div className="mt-5 flex items-center gap-2 rounded-full border border-white/10 bg-ink/60 p-1.5 focus-within:border-cyan/60">
                <input
                  type="email"
                  placeholder="your.email@domain.com"
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                  required
                  aria-label="Your email address"
                  className="w-full min-w-0 bg-transparent py-2 pl-4 text-base text-cream placeholder-cream/30 outline-none sm:text-sm"
                />
                <button type="submit" className="btn btn-hot shrink-0 !px-5 !py-3">
                  {subscribed ? (
                    <>
                      Connected <Sparkles className="h-3.5 w-3.5" />
                    </>
                  ) : (
                    <>
                      Connect <Send className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          </div>

          {/* Soft dark cloud bank: indigo bubbles that melt into the dark work section */}
          <CloudBank
            front={C.ink}
            tones={[["#B3A9FF", 0.12], ["#4A3DC4", 0.32], ["#21177A", 0.7]]}
            className="pointer-events-none absolute bottom-[-2px] left-0 z-20 h-[max(170px,16vw)] w-full"
          />
        </section>

        {/* ───────────────── Selected Work ───────────────── */}
        {/* overflow-x-clip (not overflow-hidden) so the sticky DotGrid actually stays pinned while scrolling */}
        <div id="work" className="relative z-10 w-full overflow-x-clip bg-ink">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, amount: 0.04 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="pointer-events-none"
            style={{
              position: "sticky",
              top: 0,
              height: "100vh",
              zIndex: 0,
              marginBottom: "-100vh",
              maskImage: "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)"
            }}
          >
            <DotGrid dotSize={3} gap={30} baseColor="#24214A" activeColor="#FF3D81" proximity={130} shockRadius={220} shockStrength={5} returnDuration={1.5} />
          </motion.div>

          <section className="relative z-10 pb-24 pt-10 md:pb-36 md:pt-16">
            <h2 className="sr-only">Selected Work</h2>
            <div className="relative">
              <OutlineStack
                rows={[
                  [{ t: "Selected" }, { t: "Work" }, { t: "Selected", fill: C.cyan }],
                  [{ t: "Work" }, { t: "Selected", fill: C.cream }, { t: "Work" }],
                  [{ t: "Selected", fill: C.hot }, { t: "Work" }, { t: "Selected" }]
                ]}
              />
              <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <SpinBadge text="MAZE-VALIDATED • USER-TESTED • " size={isDesktop ? 150 : 104} bg={C.sun}>
                  <Sparkles className="h-7 w-7 md:h-9 md:w-9" />
                </SpinBadge>
              </div>
            </div>

            <div className="mx-auto max-w-6xl px-5 md:px-10 lg:px-16">
              <motion.p {...reveal} className="mx-auto mt-12 max-w-3xl text-center text-xl font-light leading-snug text-cream/80 md:mt-16 md:text-3xl">
                Each project undergoes thorough user testing and quantitative validation (Maze) to ensure{" "}
                <span className="font-semibold text-cream">absolute design usability.</span>
              </motion.p>

              {/* Stats row */}
              <motion.div {...reveal} className="mt-12 grid gap-6 sm:grid-cols-3 md:mt-16">
                {STATS.map(s => (
                  <div key={s.value} className="flex items-start gap-4 border-t border-white/15 pt-5">
                    <s.icon className="mt-1 h-6 w-6 shrink-0" style={{ color: s.color }} strokeWidth={1.75} />
                    <div>
                      <div className="font-display text-4xl leading-none md:text-5xl" style={{ color: s.color }}>
                        {s.value}
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-cream/55">{s.label}</p>
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* Projects */}
              <div className="mt-24 space-y-24 md:mt-32 md:space-y-32 lg:space-y-40">
                {visibleProjects.map((project, index) => {
                  const isEven = index % 2 === 0;
                  const isLaptop = project.title === "Clairo";
                  return (
                    <div key={project.title} className="grid items-center gap-10 text-left lg:grid-cols-12 lg:gap-16">
                      <motion.div {...reveal} className={`space-y-5 lg:col-span-6 ${!isEven ? "lg:order-2" : ""}`}>
                        <div className="flex items-end gap-4">
                          <span className="text-outline font-display text-7xl leading-[0.8] md:text-8xl" style={{ ["--stroke-color" as string]: project.accent }}>
                            0{index + 1}
                          </span>
                          <span className="pb-1 font-mono text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: project.accent }}>
                            {project.category}
                          </span>
                        </div>

                        <h3 className="font-display text-6xl uppercase leading-[0.9] md:text-7xl">{project.title}</h3>
                        <p className="text-sm font-light leading-relaxed text-cream/65 md:text-base">{project.description}</p>

                        <div className="flex flex-wrap gap-2">
                          {project.tags.map(tag => (
                            <span key={tag} className="rounded-full border border-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-cream/70">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex flex-wrap gap-3 pt-2">
                          <button onClick={() => setSelectedProject(project.title)} className="btn btn-hot group">
                            Read case study
                            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                          </button>
                          <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                            Slides ↗
                          </a>
                        </div>
                      </motion.div>

                      <motion.div {...reveal} className={`relative flex justify-center lg:col-span-6 ${!isEven ? "lg:order-1" : ""}`}>
                        <div
                          className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[115%] max-w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full"
                          style={{ background: `radial-gradient(closest-side, ${project.accent}55, ${project.accent}14 60%, transparent)` }}
                          aria-hidden="true"
                        />
                        <Floaty className={`hidden md:block ${isEven ? "right-[8%] top-[6%]" : "left-[8%] top-[10%]"}`} duration={7 + index}>
                          {index % 3 === 0 ? <Ring color={project.accent} size={40} /> : index % 3 === 1 ? <Zigzag color={project.accent} size={54} /> : <Plus color={project.accent} size={30} />}
                        </Floaty>
                        <motion.div
                          whileHover={{ scale: 1.03, y: -8, rotate: isEven ? 1.5 : -1.5 }}
                          transition={{ type: "spring", stiffness: 300, damping: 22 }}
                          className={`relative w-full ${isLaptop ? "max-w-[580px]" : "max-w-[250px] sm:max-w-[300px]"} select-none`}
                        >
                          <img
                            src={project.image}
                            alt={`${project.title} mockup`}
                            width={project.imageSize[0]}
                            height={project.imageSize[1]}
                            loading="lazy"
                            decoding="async"
                            className="h-auto w-full object-contain"
                          />
                        </motion.div>
                      </motion.div>
                    </div>
                  );
                })}
              </div>

              {PROJECTS.length > 3 && (
                <motion.div {...reveal} className="flex justify-center pt-16 md:pt-24">
                  <button onClick={() => setShowAllProjects(!showAllProjects)} className="btn btn-ghost !px-7 !py-4">
                    <span>{showAllProjects ? "Show fewer projects" : `View ${PROJECTS.length - 3} more projects`}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${showAllProjects ? "rotate-180" : ""}`} />
                  </button>
                </motion.div>
              )}
            </div>
          </section>
        </div>

        {/* ───────────────── About (bento) ───────────────── */}
        <section
          id="about"
          className="relative z-10 px-5 py-28 md:px-10 md:py-40 lg:px-16 xl:px-24"
          style={{ background: `linear-gradient(to bottom, ${C.ink} 0px, ${C.night} 260px, ${C.night} calc(100% - 260px), ${C.ink} 100%)` }}
        >
          <div className="starfield pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
          <Floaty className="right-[6%] top-16 hidden md:block" duration={8}><Squiggle color={C.sun} size={70} /></Floaty>

          <div className="relative mx-auto max-w-7xl space-y-12 md:space-y-16">
            <motion.div {...reveal} className="max-w-3xl space-y-5 text-left">
              <Eyebrow color={C.sun}>Background &amp; Details</Eyebrow>
              <h2 className="font-display text-[clamp(3rem,9vw,7rem)] uppercase leading-[0.88]">
                <span className="text-outline">Academic &amp;</span>
                <br />
                Professional <span className="text-sun">core.</span>
              </h2>
              <p className="max-w-xl text-sm font-light text-cream/60 md:text-base">
                Fusing traditional Information Systems architecture with modern AI-native digital design methodologies.
              </p>
            </motion.div>

            <MagicBento glowColor="61, 227, 242">
              <motion.div {...reveal} className="md:col-span-6 lg:col-span-7">
                <MagicBentoCard glowColor="61, 227, 242" particleCount={6} className="flex h-full min-h-[260px] flex-col justify-between gap-8 rounded-[2rem] border border-white/10 bg-[#1D1860] p-6 text-left md:min-h-[300px] md:p-8">
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mint/15 text-mint">
                      <GraduationCap className="h-6 w-6" strokeWidth={1.75} />
                    </div>
                    <span className="rounded-full border border-mint/25 bg-mint/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-mint">
                      GPA 3.96 / 4.00
                    </span>
                  </div>
                  <div className="space-y-2">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-cream/45">Education</span>
                    <h3 className="font-display text-4xl uppercase leading-none">Universitas Sriwijaya</h3>
                    <p className="text-sm font-light leading-relaxed text-cream/60">
                      S1 Information Systems (Cum Laude). Graduated in 3.5 years. Deep studies in Human-Computer Interaction (HCI), Software Engineering, and Database Systems.
                    </p>
                  </div>
                </MagicBentoCard>
              </motion.div>

              <motion.div {...reveal} className="md:col-span-6 lg:col-span-5">
                <MagicBentoCard glowColor="61, 227, 242" particleCount={6} className="flex h-full min-h-[260px] flex-col justify-between gap-8 rounded-[2rem] border border-white/10 bg-[#1D1860] p-6 text-left md:min-h-[300px] md:p-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan/15 text-cyan">
                    <BookOpen className="h-6 w-6" strokeWidth={1.75} />
                  </div>
                  <div className="space-y-4">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-cream/45">Scientific Publications</span>
                    <div className="space-y-4">
                      {PUBLICATIONS.map(pub => (
                        <a key={pub.title} href={pub.link} target="_blank" rel="noopener noreferrer" className="group block">
                          <h4 className="line-clamp-2 text-sm font-bold leading-snug transition-colors group-hover:text-cyan">{pub.title} ↗</h4>
                          <span className="mt-1 block text-[10px] text-cream/45">
                            {pub.journal} · {pub.date}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                </MagicBentoCard>
              </motion.div>

              <motion.div {...reveal} className="md:col-span-12 lg:col-span-8">
                <MagicBentoCard glowColor="61, 227, 242" particleCount={8} className="flex h-full min-h-[300px] flex-col justify-between rounded-[2rem] border border-white/10 bg-[#1D1860] p-6 text-left md:min-h-[350px] md:p-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-electric/20 text-[#A99FFF]">
                    <Layers className="h-6 w-6" strokeWidth={1.75} />
                  </div>
                  <div className="my-6 space-y-6">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-cream/45">Technical Architecture</span>
                    <div className="grid gap-6 sm:grid-cols-3">
                      {SKILLS_CATEGORIES.map((cat, idx) => (
                        <div key={cat.title} className="space-y-3">
                          <h4 className="border-b border-white/10 pb-1.5 text-[11px] font-bold uppercase tracking-wider" style={{ color: [C.hot, C.cyan, C.sun][idx] }}>
                            {cat.title}
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {cat.skills.map(sk => (
                              <span key={sk} className="rounded-md bg-white/[0.06] px-2 py-0.5 text-[10px] font-semibold text-cream/75 transition-colors duration-200 hover:bg-cyan/15 hover:text-cyan">
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="font-mono text-[10px] text-cream/40">Leveraging v0, Antigravity AI, and Claude API for accelerated design-to-code pipelines.</div>
                </MagicBentoCard>
              </motion.div>

              <motion.div {...reveal} className="md:col-span-12 lg:col-span-4">
                <MagicBentoCard glowColor="61, 227, 242" particleCount={6} className="flex h-full min-h-[300px] flex-col justify-between rounded-[2rem] border border-white/10 bg-[#1D1860] p-6 text-left md:min-h-[350px] md:p-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sun/15 text-sun">
                    <Award className="h-6 w-6" strokeWidth={1.75} />
                  </div>
                  <div className="my-6 space-y-6">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-cream/45">Credentials &amp; Awards</span>
                    <ul className="space-y-4">
                      {[
                        { e: "🏆", t: "3rd Place National UI/UX Design", s: "SI FEST Sriwijaya University 2024" },
                        { e: "🌟", t: "Web Code Design Finalist", s: "IFFEST Sriwijaya University 2024" },
                        { e: "🌍", t: "EF SET C2 Proficient & IELTS 6.5", s: "Demonstrated native English proficiency" }
                      ].map(item => (
                        <li key={item.t} className="flex items-start gap-3">
                          <span className="mt-0.5 text-sm">{item.e}</span>
                          <div>
                            <h4 className="text-sm font-bold leading-tight">{item.t}</h4>
                            <span className="block text-[10px] text-cream/45">{item.s}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="font-mono text-[10px] text-cream/40">MikroTik Certified Network Associate (MTCNA)</div>
                </MagicBentoCard>
              </motion.div>
            </MagicBento>
          </div>
        </section>

        {/* ───────────────── Experience ───────────────── */}
        <section id="experience" className="relative z-10 bg-ink">
          <div className="relative mx-auto max-w-5xl px-5 py-24 md:px-10 md:py-36 lg:px-16">
            <Floaty className="-right-2 top-24 hidden lg:block" duration={7.5}><Burst color={C.hot} size={88}><span className="font-display text-sm leading-none text-ink">BOOM!</span></Burst></Floaty>
            <motion.div {...reveal} className="mb-12 flex flex-col items-start justify-between gap-6 text-left md:mb-20 lg:flex-row lg:items-end">
              <div className="space-y-5">
                <Eyebrow color={C.hot}>Career Milestones</Eyebrow>
                <h2 className="font-display text-[clamp(3rem,9vw,7rem)] uppercase leading-[0.88]">
                  <span className="text-outline">Selected</span>
                  <br />
                  <span className="text-hot">experiences.</span>
                </h2>
              </div>
              <p className="max-w-xs text-sm font-light leading-relaxed text-cream/60">
                Bringing professional rigor and interface optimization to corporate and public engineering roles.
              </p>
            </motion.div>

            <div className="space-y-4 md:space-y-5">
              {EXPERIENCE.map((exp, idx) => {
                const isExpanded = expandedExperience === idx;
                return (
                  <motion.div
                    key={exp.role}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5, delay: idx * 0.07 }}
                    className={`overflow-hidden rounded-[1.5rem] border bg-[#12102E] transition-colors duration-500 md:rounded-[1.75rem] ${
                      isExpanded ? "border-cyan/40" : "border-white/10 hover:border-white/25"
                    }`}
                  >
                    <button
                      onClick={() => setExpandedExperience(isExpanded ? null : idx)}
                      aria-expanded={isExpanded}
                      className="flex w-full items-center justify-between gap-4 rounded-[inherit] p-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan md:p-8"
                    >
                      <div className="flex items-start gap-4 md:gap-6">
                        <span className="text-outline hidden font-display text-5xl leading-none sm:block" style={{ ["--stroke-color" as string]: "rgba(246,241,231,0.35)" }}>
                          0{idx + 1}
                        </span>
                        <div className="space-y-1">
                          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-cyan">{exp.period}</span>
                          <h3 className="text-lg font-bold tracking-tight md:text-xl">{exp.role}</h3>
                          <p className="text-xs font-semibold text-cream/55">
                            {exp.link ? (
                              <a
                                href={exp.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={e => e.stopPropagation()}
                                className="flex w-fit items-center gap-1 transition-colors hover:text-cyan hover:underline"
                              >
                                {exp.company} <ArrowUpRight className="h-3 w-3" />
                              </a>
                            ) : (
                              exp.company
                            )}
                          </p>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${isExpanded ? "bg-cyan text-ink" : "bg-white/10 text-cream/70"}`}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </motion.div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-4 border-t border-white/10 bg-black/20 px-5 pb-5 pt-5 text-left md:px-8 md:pb-8">
                            <p className="text-sm font-light leading-relaxed text-cream/75">{exp.description}</p>
                            <div className="flex items-start gap-2 rounded-2xl border border-cyan/20 bg-cyan/10 p-4 text-xs font-semibold text-cyan">
                              <span className="text-base leading-none">⚡</span>
                              <div>
                                <span className="mb-0.5 block text-[10px] font-bold uppercase tracking-wider text-cyan/80">Key Performance Indicator</span>
                                {exp.metrics}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ───────────────── Organizations ───────────────── */}
        <section id="organizations" className="relative z-10 w-full bg-ink pt-24 md:pt-36">
          <motion.div {...reveal} className="mx-auto mb-12 flex max-w-5xl flex-col items-start justify-between gap-6 px-5 text-left md:mb-20 md:px-10 lg:flex-row lg:items-end lg:px-16">
            <div className="space-y-5">
              <Eyebrow color={C.mint}>College Life &amp; Leadership</Eyebrow>
              <h2 className="font-display text-[clamp(3rem,9vw,7rem)] uppercase leading-[0.88]">
                <span className="text-outline">Organizational</span>
                <br />
                <span className="text-mint">experience.</span>
              </h2>
            </div>
            <p className="max-w-xs text-sm font-light leading-relaxed text-cream/60">
              Showcasing leadership, collaboration, and community initiatives executed throughout campus life.
            </p>
          </motion.div>

          <div className="w-full">
            {ORGANIZATIONS.map((org, idx) => {
              const isEven = idx % 2 === 0;
              const accent = ORG_ACCENTS[idx % ORG_ACCENTS.length];
              return (
                <div key={org.organization} className={`group relative flex w-full flex-col overflow-hidden border-t border-white/10 ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"}`}>
                  <div className="relative min-h-[260px] w-full overflow-hidden bg-black sm:min-h-[350px] lg:min-h-[550px] lg:w-1/2">
                    <img
                      src={org.image}
                      alt={org.organization}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full scale-100 object-cover grayscale transition-[filter,transform] duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent lg:hidden" />
                    <span className="absolute left-5 top-5 font-display text-6xl leading-none md:text-7xl" style={{ color: accent }}>
                      0{idx + 1}
                    </span>
                  </div>

                  <div className="relative z-10 flex w-full flex-col justify-between bg-deep px-6 py-10 text-left sm:p-12 md:p-16 lg:w-1/2 lg:p-14 xl:p-24">
                    <div>
                      <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest md:mb-8" style={{ color: accent, borderColor: `${accent}55`, background: `${accent}14` }}>
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
                        {org.organization}
                      </div>
                      <h3 className="mb-6 text-2xl font-extrabold leading-tight tracking-tight md:mb-8 md:text-3xl xl:text-4xl">"{org.tagline}"</h3>
                      <ul className="space-y-4">
                        {org.bullets.map(bullet => (
                          <li key={bullet} className="flex items-start gap-3 text-sm font-light text-cream/70 md:text-base">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: accent }} />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center md:mt-12 md:pt-8">
                      <div>
                        <h4 className="text-base font-bold leading-tight">{org.role}</h4>
                        <p className="mt-1 font-mono text-xs text-cream/50">{org.period}</p>
                      </div>
                      <span className="shrink-0 rounded-full px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-ink" style={{ background: accent }}>
                        Active Member
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ───────────────── Launch pad: the rocket lifts off into the contact section ───────────────── */}
        {/* --rh is the rocket's rendered height; the headline and smoke size themselves from it. */}
        <section
          id="launch"
          ref={launchRef}
          className="relative z-10 overflow-hidden bg-[radial-gradient(120%_85%_at_50%_25%,#4436EA_0%,#3127CC_45%,#2419A6_100%)] pb-[calc(max(190px,17vw)*0.8)] pt-28 [--rh:clamp(280px,42vh,370px)] md:pt-32 lg:pt-36 lg:[--rh:clamp(400px,60vh,600px)]"
        >
          {/* Fade in from the dark section above so the colour change isn't a hard edge */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-ink to-transparent" aria-hidden="true" />
          <div className="starfield pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />

          {/* Chunky doodles floating around the launch (they sink behind the clouds) */}
          <Floaty className="left-[4%] top-[62%] md:left-[7%] md:top-[56%]" duration={7}><Square color={C.hot} size={isDesktop ? 96 : 52} stroke={7} /></Floaty>
          <Floaty className="left-[22%] top-[40%] hidden md:block" duration={8} delay={0.6} rotate={-10}><Zigzag color={C.cyan} size={88} stroke={8} /></Floaty>
          <Floaty className="left-[15%] top-[71%] hidden sm:block" duration={9} delay={1.2}><Squiggle color={C.sun} size={isDesktop ? 104 : 70} stroke={8} /></Floaty>
          <Floaty className="left-[4%] top-[38%] hidden md:block" duration={6.5} delay={0.3}><Dot color={C.cyan} size={24} /></Floaty>
          <Floaty className="left-[31%] top-[24%] hidden lg:block" duration={7.5} delay={1.6}><Dot color={C.sun} size={12} /></Floaty>
          <Floaty className="right-[21%] top-[50%] hidden md:block" duration={8.5} delay={0.9} rotate={60}><Arc color={C.hot} size={92} stroke={8} /></Floaty>
          <Floaty className="right-[5%] top-[60%] md:right-[9%] md:top-[63%]" duration={7} delay={0.4}><Ring color={C.sun} size={isDesktop ? 92 : 50} stroke={8} /></Floaty>
          <Floaty className="right-[11%] top-[42%] hidden lg:block" duration={6} delay={1.1}><Capsule color={C.cyan} size={84} /></Floaty>
          <Floaty className="right-[29%] top-[68%] hidden lg:block" duration={9.5} delay={0.2} rotate={14}><Zigzag color={C.cream} size={70} stroke={8} /></Floaty>
          <Floaty className="right-[34%] top-[20%] hidden lg:block" duration={8} delay={2}><Plus color={C.cream} size={28} /></Floaty>

          <h2 className="sr-only">Ready for liftoff?</h2>

          {/* Short note, top-right on desktop (sits above the right-hand word) */}
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="absolute right-[6%] top-36 z-10 hidden max-w-[17.5rem] text-[13px] leading-relaxed text-cream/80 lg:block xl:right-[9%]"
          >
            Got a product that needs to get off the ground? I'm open to full-time roles, freelance projects and collaborations.
          </motion.p>

          <div className="relative z-10 mx-auto flex max-w-[1440px] flex-col items-center px-4 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-start lg:gap-10 lg:px-8">
            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              style={{ x: isDesktop ? wordLeftX : 0 }}
              className="order-1 text-center font-display text-[clamp(3.3rem,15vw,7rem)] uppercase leading-[0.88] lg:whitespace-nowrap lg:pt-[calc(var(--rh)*0.2)] lg:text-right lg:text-[clamp(3.5rem,6.3vw,8.25rem)]"
            >
              Ready for
            </motion.div>

            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              style={{ x: isDesktop ? wordRightX : 0 }}
              className="order-2 text-center font-display text-[clamp(3.3rem,15vw,7rem)] uppercase leading-[0.88] text-sun lg:order-3 lg:whitespace-nowrap lg:pt-[calc(var(--rh)*0.2)] lg:text-left lg:text-[clamp(3.5rem,6.3vw,8.25rem)]"
            >
              liftoff?
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="order-3 mt-5 max-w-[20rem] text-center text-[13px] leading-relaxed text-cream/80 lg:hidden"
            >
              Got a product that needs to get off the ground? I'm open to full-time roles, freelance projects and collaborations.
            </motion.p>

            {/* The rocket: rises in when the section arrives, then keeps climbing as you scroll */}
            <motion.div style={{ y: isDesktop ? rocketY : 0 }} className="relative order-4 mt-8 lg:order-2 lg:mt-0">
              <motion.div
                initial={{ y: 260, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="hover-y relative">
                  <img
                    src={`${BASE}images/rocket-hero.webp`}
                    alt=""
                    width={434}
                    height={1100}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className="relative z-[2] h-[var(--rh)] w-auto select-none"
                  />
                  <svg viewBox="0 0 60 100" className="rj-flame absolute left-1/2 top-[87%] z-[1] h-[24%] w-[30%] -translate-x-1/2" aria-hidden="true">
                    <defs>
                      <linearGradient id="launchFlame" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="#FFF6C8" />
                        <stop offset="0.35" stopColor="#FFC93C" />
                        <stop offset="0.7" stopColor="#FF8A3D" />
                        <stop offset="1" stopColor="#FF3D81" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M30 0C47 14 56 36 48 60 42 78 35 90 30 100 25 90 18 78 12 60 4 36 13 14 30 0Z" fill="url(#launchFlame)" />
                    <path d="M30 4C39 14 42 30 38 46 35 56 32 64 30 70 28 64 25 56 22 46 18 30 21 14 30 4Z" fill="#FFFBEA" opacity="0.9" />
                  </svg>
                </div>
              </motion.div>

              {/* Exhaust smoke rolling out under the nozzle and into the clouds */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-[103%] z-[3] h-[calc(var(--rh)*0.7)] w-[calc(var(--rh)*1.15)] -translate-x-1/2"
              >
                {SMOKE.map(([x, y, s, d], i) => (
                  <span
                    key={i}
                    className="puff absolute aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      width: `${s}%`,
                      animationDelay: `${-d}s`,
                      background: "radial-gradient(circle at 34% 30%, #FFFFFF 0%, #F3F1FF 42%, #CFCAF7 100%)"
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Soft cloud bank: lavender bubbles, then solid cream that melts into the contact section */}
          <CloudBank className="pointer-events-none absolute bottom-[-2px] left-0 z-20 h-[max(190px,17vw)] w-full" />
        </section>

        {/* ───────────────── Contact / Footer ───────────────── */}
        <footer id="contact" className="relative z-10 bg-cream pt-14 text-ink md:pt-20">
          <Floaty className="left-[6%] top-12" duration={7}><Zigzag color={C.hot} size={60} stroke={6} /></Floaty>
          <Floaty className="right-[8%] top-20 hidden sm:block" duration={8.5} delay={1}><Ring color={C.electric} size={48} stroke={6} /></Floaty>
          <Floaty className="bottom-[45%] left-[10%] hidden md:block" duration={9} delay={0.6}><Square color={C.orange} size={40} stroke={6} /></Floaty>
          <Floaty className="bottom-[48%] right-[12%] hidden md:block" duration={6.5} delay={1.4}><Squiggle color={C.electric} size={70} stroke={6} /></Floaty>

          <div className="relative mx-auto max-w-6xl px-5 text-center md:px-10">
            <Eyebrow color={C.hot}>Connect &amp; Collaborate</Eyebrow>
            <motion.h2 {...reveal} className="mt-6 font-display text-[clamp(3.4rem,13vw,11rem)] uppercase leading-[0.86]">
              Let's build
              <br />
              <span className="text-outline" style={{ ["--stroke-color" as string]: C.ink }}>
                something
              </span>
              <br />
              <span className="text-hot">that flies.</span>
            </motion.h2>
            <p className="mx-auto mt-8 max-w-md text-sm font-medium leading-relaxed text-ink/75 md:text-base">
              Always open to discussing design systems, advanced prototypes, research audits, or digital product directions.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <a href="mailto:faiqsc@gmail.com" className="btn btn-ink">
                <Mail className="h-4 w-4" /> faiqsc@gmail.com
              </a>
              <a href="https://wa.me/6287899677415" target="_blank" rel="noopener noreferrer" className="btn btn-ink-ghost">
                <Phone className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </div>

          <div className="relative mt-20 rounded-t-[2.5rem] bg-ink pb-24 pt-14 text-cream md:mt-28 md:rounded-t-[3.5rem] md:pb-16 md:pt-16">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-10 px-5 text-center md:flex-row md:items-end md:px-10 md:text-left">
              <div className="space-y-3">
                <a href="#top" className="font-display text-4xl">
                  FAIQ<span className="text-hot">.</span>
                </a>
                <p className="text-xs text-cream/50">Palembang, South Sumatra, Indonesia</p>
              </div>
              <div className="space-y-3 md:text-right">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-cream/40">Visual Networks</p>
                <div className="flex justify-center gap-3 md:justify-end">
                  {SOCIAL_LINKS.map(soc => (
                    <a
                      key={soc.label}
                      href={soc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={soc.label}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-colors hover:border-hot hover:bg-hot hover:text-ink"
                    >
                      <soc.icon className="h-[18px] w-[18px]" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-white/10 px-5 pt-8 text-center font-mono text-[11px] text-cream/35 md:flex-row md:px-10 md:text-xs">
              <span>© {new Date().getFullYear()} Al Ikhsan Faiq. All rights reserved.</span>
              <span>Created with Antigravity AI + React &amp; Tailwind v4</span>
            </div>
          </div>
        </footer>

        {/* Floating availability pill */}
        <motion.a
          href="https://wa.me/6287899677415"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 flex items-center gap-2.5 rounded-full border border-white/15 bg-ink/90 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-cream shadow-[0_10px_30px_rgba(0,0,0,0.45)] md:bottom-6 md:right-6 md:gap-3 md:px-5 md:py-3 md:text-xs"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-mint opacity-75 motion-safe:animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
          </span>
          Available for hire
        </motion.a>

        {/* Case study panel */}
        <AnimatePresence>
          {selectedProject && <CaseStudyModal projectTitle={selectedProject} onClose={() => setSelectedProject(null)} />}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
