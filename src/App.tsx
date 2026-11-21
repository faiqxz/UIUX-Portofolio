import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, MotionConfig } from "motion/react";
import CaseStudyModal from "./components/CaseStudyModal.tsx";
import AsciiCanvas from "./ascii/AsciiCanvas.tsx";
import AsciiText, { AsciiLine } from "./ascii/AsciiText.tsx";
import AsciiImage from "./ascii/AsciiImage.tsx";
import AsciiJourney from "./ascii/AsciiJourney.tsx";
import BootSequence, { bootWillPlay } from "./ascii/BootSequence.tsx";
import Frame from "./ascii/Frame.tsx";
import Typed from "./ascii/Typed.tsx";
import { auroraLaunch, field, liftoff } from "./ascii/scenes.ts";

const BASE = import.meta.env.BASE_URL;
const ROCKET_IMG = `${BASE}images/rocket-hero.webp`;

/** Accent colours (match --color-* in index.css). */
const A = {
  aurora: "#7CF0A0",
  teal: "#6FE3D2",
  violet: "#C08CF0",
  amber: "#FFC86B",
  rose: "#FF6FA8"
};

// Gradient stops for the halftone headlines (snapped to the renderer's palette).
const G_WHITE = ["#9aabcf", "#e9eefb"];
const G_AURORA = ["#74eb9b", "#79e3d3", "#b985e0"];
const G_WARM = ["#ffd27a", "#ffa743", "#ff5c9a"];
const G_VIOLET = ["#b985e0", "#ff5c9a"];
const G_TEAL = ["#79e3d3", "#74eb9b"];

const PROJECTS = [
  {
    title: "Clairo",
    slug: "clairo",
    category: "Teacher-in-the-Loop AI LMS Platform",
    description: "A functional AI-native learning management platform for Kurikulum Merdeka with architectural teacher approval gates, 14 Gemini AI functions, and Edpuzzle-style interactive video studio.",
    tags: ["Gemini AI Service Layer", "Teacher-in-the-Loop", "React 19 & Firebase"],
    image: `${BASE}images/clairo-mockup.webp`,
    imageSize: [1024, 617],
    link: "https://github.com/faiqxz",
    accent: A.violet
  },
  {
    title: "Yappy",
    slug: "yappy",
    category: "Language Learning Application",
    description: "3rd Place winner at UIUX Competition. An AI-native language app integrating interactive conversational scenarios and Maze-validated voice interfaces.",
    tags: ["Award Winning", "Conversational AI", "Maze Testing"],
    image: `${BASE}images/yappy-mockup.webp`,
    imageSize: [600, 1180],
    link: "https://bit.ly/YappyPPT",
    accent: A.amber
  },
  {
    title: "Neurofit",
    slug: "neurofit",
    category: "Fitness Mobile Application",
    description: "A structured workout logs app designed from problem definition to Maze validation, supporting progressive overload tracking and muscle analytics.",
    tags: ["UX Research", "Design System", "Data Visualization"],
    image: `${BASE}images/neurofit-mockup.webp`,
    imageSize: [600, 1180],
    link: "https://bit.ly/NeurofitPPT",
    accent: A.teal
  },
  {
    title: "PrimaPlus",
    slug: "primaplus",
    category: "Health Consultant Application",
    description: "A digital health platform streamlining medical directories and patient consulting records, mapping clinical user flows for high accessibility.",
    tags: ["Information Architecture", "HealthTech", "Figma Components"],
    image: `${BASE}images/primaplus-mockup.webp`,
    imageSize: [600, 1180],
    link: "https://bit.ly/PrimaPLus",
    accent: A.aurora
  },
  {
    title: "FitMart",
    slug: "fitmart",
    category: "E-Commerce & Workout App",
    description: "An integrated e-commerce shop and workout mobile prototype mapping seamless navigation across supplementation shopping and fitness logging.",
    tags: ["UI/UX Design", "Cross-Domain Flows", "Maze Usability"],
    image: `${BASE}images/fitmart-mockup.webp`,
    imageSize: [600, 1180],
    link: "https://bit.ly/Prototype-FitMart",
    accent: A.rose
  },
  {
    title: "Travelin",
    slug: "travelin",
    category: "Integrated Travel & Booking App",
    description: "GDGoC Mobile application streamlining joint flight and lodging reservations with a simplified, transparent rescheduling and refund management system.",
    tags: ["GDGoC Challenge", "Travel Booking", "Reschedule & Refund Flow"],
    image: `${BASE}images/travelin-mockup.webp`,
    imageSize: [600, 1180],
    link: "https://bitly.cx/Travelin",
    accent: A.amber
  },
  {
    title: "UNSRI GO",
    slug: "unsri-go",
    category: "Academic Portal & Campus Assistant",
    description: "An academic mobile application for Universitas Sriwijaya students, organizing course registrations, real-time campus shuttle tracking, and exam schedules.",
    tags: ["EdTech", "Campus Services", "Mobile Portal"],
    image: `${BASE}images/unsri-go-mockup.webp`,
    imageSize: [600, 1180],
    link: "https://unsri.ac.id",
    accent: A.teal
  }
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
const ORG_ACCENTS = [A.teal, A.amber, A.rose, A.aurora];

const SKILLS_CATEGORIES = [
  {
    title: "UX Research & Design",
    color: A.rose,
    skills: ["User Interviews", "Maze Usability Testing", "Design Thinking", "Information Architecture", "User Personas", "Wireframing", "High-Fidelity Prototyping", "Design Systems", "SUS Usability Analytics", "Print CSS (@media print)"]
  },
  {
    title: "AI-Native Workflow",
    color: A.teal,
    skills: ["Antigravity AI", "Google Gemini API", "Teacher-in-the-Loop AI", "Claude API", "OpenAI GPT", "v0 by Vercel", "Cursor", "Google Stitch"]
  },
  {
    title: "Development Stack",
    color: A.amber,
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

const AWARDS = [
  { t: "3rd Place National UI/UX Design", s: "SI FEST Sriwijaya University 2024" },
  { t: "Web Code Design Finalist", s: "IFFEST Sriwijaya University 2024" },
  { t: "EF SET C2 Proficient & IELTS 6.5", s: "Demonstrated native English proficiency" }
];

const STATS = [
  { key: "case-studies", value: "07", label: "Case studies, each Maze-validated", color: A.teal },
  { key: "awards", value: "3RD", label: "National UI/UX Design, SI FEST 2024", color: A.amber },
  { key: "gpa", value: "3.96", label: "GPA, Cum Laude — Universitas Sriwijaya", color: A.rose }
];

const SOCIAL_LINKS = [
  { label: "linkedin", handle: "in/alikhsanfaiq", url: "http://www.linkedin.com/in/alikhsanfaiq/" },
  { label: "github", handle: "faiqxz", url: "https://github.com/faiqxz" },
  { label: "email", handle: "faiqsc@gmail.com", url: "mailto:faiqsc@gmail.com" },
  { label: "whatsapp", handle: "chat on WhatsApp", url: "https://wa.me/6287899677415" }
];

const NAV_LINKS = ["Work", "About", "Experience", "Contact"];
// The ASCII traveler ends its trip by docking into the big rocket in the launch section.
const JOURNEY_SECTIONS = ["top", "work", "about", "experience", "organizations", "launch"];
const RESUME_URL = "https://drive.google.com/drive/folders/19sAP-y6eZ6nVmynZCHuWvek-VLisyvfa";

// A hand-set block-letter signature for the footer.
const SIGNATURE = [
  " _____  _    ___  ___  ",
  "|  ___|/ \\  |_ _|/ _ \\ ",
  "| |_  / _ \\  | || | | |",
  "|  _|/ ___ \\ | || |_| |",
  "|_| /_/   \\_\\___|\\__\\_\\"
].join("\n");

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const }
};

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const pad2 = (n: number) => String(n).padStart(2, "0");
/** Short git-style hash for decoration (stable per string). */
const shortHash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return (h >>> 0).toString(16).padStart(8, "0").slice(0, 7);
};
const sceneCell = (w: number) => (w < 640 ? 6 : w < 1280 ? 7 : 8);

/** `guest@faiq:~$ command` line that types itself when it scrolls into view. */
function Prompt({ cmd, path = "~", className = "", start = true, keepCursor = false }: { cmd: string; path?: string; className?: string; start?: boolean; keepCursor?: boolean }) {
  return (
    <p className={`font-mono text-xs text-dim md:text-sm ${className}`}>
      <span className="text-aurora">guest@faiq</span>
      <span>:</span>
      <span className="text-teal">{path}</span>
      <span>$ </span>
      <Typed text={cmd} className="text-bright" start={start} keepCursor={keepCursor} />
    </p>
  );
}

/** Section heading: a typed command, the real <h2> for search and screen readers, and halftone type. */
function SectionHead({ cmd, title, lines, note, size = "clamp(2.6rem, 8.6vw, 7rem)", className = "" }: { cmd: string; title: string; lines: AsciiLine[]; note?: React.ReactNode; size?: string; className?: string }) {
  return (
    <div className={className}>
      <Prompt cmd={cmd} />
      <h2 className="sr-only">{title}</h2>
      <AsciiText lines={lines} size={size} className="mt-5" />
      {note && <p className="mt-6 max-w-xl text-sm leading-relaxed text-dim md:text-[15px]">{note}</p>}
    </div>
  );
}

export default function App() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedExperience, setExpandedExperience] = useState<number | null>(0);
  const [emailInput, setEmailInput] = useState("");
  const [sent, setSent] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);
  // Boot intro: plays once per session (decided by the inline script in index.html before first paint).
  const [booting, setBooting] = useState(bootWillPlay);
  const [ready, setReady] = useState(() => !bootWillPlay());

  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const launchRef = useRef<HTMLElement>(null);

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

  // Close the mobile menu if the viewport grows past the menu breakpoint.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => mq.matches && setIsMenuOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Scroll progress for the two rocket scenes (read by the canvases at their own frame rate).
  const heroProgress = useCallback(() => {
    const el = heroRef.current;
    if (!el) return 0;
    return clamp01(window.scrollY / Math.max(1, el.offsetHeight * 0.85));
  }, []);
  const launchProgress = useCallback(() => {
    const el = launchRef.current;
    if (!el) return 0;
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    return clamp01((vh * 0.85 - r.top) / Math.max(1, r.height * 0.95));
  }, []);

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    const email = emailInput.trim();
    if (!email) return;
    // Opens the visitor's mail app with a short note, so the request actually reaches Faiq.
    const body = `Hi Faiq,\n\nI'd like to talk about a project. You can reach me at ${email}.\n`;
    window.location.href = `mailto:faiqsc@gmail.com?subject=${encodeURIComponent("Let's talk")}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const visibleProjects = showAllProjects ? PROJECTS : PROJECTS.slice(0, 3);

  return (
    <MotionConfig reducedMotion="user">
      {booting && <BootSequence onReveal={() => setReady(true)} onDone={() => setBooting(false)} />}

      <div ref={rootRef} className="relative min-h-screen overflow-x-clip bg-ground text-fg">
        <div className="scanlines" aria-hidden="true" />

        {/* ASCII traveler that flies through every section */}
        <AsciiJourney rootRef={rootRef} sectionIds={JOURNEY_SECTIONS} />

        {/* ───────────────── Nav ───────────────── */}
        <nav className="fixed inset-x-0 top-0 z-40 border-b border-line bg-ground/85 backdrop-blur-md">
          <div className="mx-auto flex h-12 max-w-7xl items-center justify-between gap-4 px-4 md:h-14 md:px-8">
            <a href="#top" aria-label="Al Ikhsan Faiq, back to top" className="whitespace-nowrap text-[13px] md:text-sm">
              <span className="text-aurora">faiq</span>
              <span className="text-dim">@</span>
              <span className="text-bright">portfolio</span>
              <span className="text-dim">:</span>
              <span className="text-teal">~</span>
              <span className="text-dim">$</span>
              <span className="cursor-block text-aurora" aria-hidden="true" />
            </a>

            <div className="hidden items-center gap-1 text-[13px] md:flex">
              {NAV_LINKS.slice(0, 3).map(item => (
                <a key={item} href={`#${item.toLowerCase()}`} className="px-2 py-1 text-dim transition-colors hover:text-aurora">
                  <span aria-hidden="true">[</span>
                  {item.toLowerCase()}
                  <span aria-hidden="true">]</span>
                </a>
              ))}
            </div>

            <a href="#contact" className="btn btn-primary btn-sm hidden md:inline-flex">
              let's talk
            </a>

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label={isMenuOpen ? "Close menu" : "Open menu"} aria-expanded={isMenuOpen} className="btn btn-sm md:hidden">
              {isMenuOpen ? "close" : "menu"}
            </button>
          </div>
        </nav>

        {/* Fullscreen mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-30 flex flex-col bg-ground px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-20 md:hidden"
            >
              <Prompt cmd="ls ~/" />
              <ul className="mt-8 space-y-1">
                {NAV_LINKS.map((item, idx) => (
                  <motion.li key={item} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * idx + 0.1, duration: 0.3 }}>
                    <a href={`#${item.toLowerCase()}`} onClick={() => setIsMenuOpen(false)} className="flex items-baseline gap-4 py-2 text-4xl font-extrabold text-bright">
                      <span className="text-xs font-normal text-dim">{pad2(idx + 1)}</span>
                      {item.toLowerCase()}
                      <span className="text-aurora">/</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-auto space-y-3 text-sm">
                <p className="text-xs text-dim"># let's connect</p>
                <div className="flex flex-wrap gap-x-5 gap-y-2">
                  {SOCIAL_LINKS.map(soc => (
                    <a key={soc.label} href={soc.url} target="_blank" rel="noopener noreferrer" className="tlink text-fg">
                      {soc.label}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ───────────────── Hero ───────────────── */}
        <section id="top" ref={heroRef} className="relative z-10 min-h-[100svh] overflow-hidden bg-ground">
          <AsciiCanvas scene={auroraLaunch} images={{ rocket: ROCKET_IMG }} getProgress={heroProgress} cell={sceneCell} className="absolute inset-0" />
          {/* Keep the copy readable over the aurora */}
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,15,0.8)_0%,rgba(5,8,15,0.62)_50%,rgba(5,8,15,0.15)_76%,rgba(5,8,15,0)_100%)] lg:bg-[linear-gradient(90deg,rgba(5,8,15,0.82)_0%,rgba(5,8,15,0.55)_40%,rgba(5,8,15,0)_66%)]"
            aria-hidden="true"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ground" aria-hidden="true" />

          <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-start px-5 pb-28 pt-20 md:px-10 lg:justify-center lg:pt-24">
            <Prompt cmd="whoami" path="~" start={ready} keepCursor={false} />

            {/* The page's h1 is the name + role (what people and search engines look for); the big line below is a tagline. */}
            <h1 className="mt-3 text-[11px] font-medium uppercase leading-relaxed tracking-[0.2em] text-bright md:text-[13px]">
              <span className="block sm:inline">Al Ikhsan Faiq</span>
              <span className="hidden text-dim sm:inline"> / </span>
              <span className="block sm:inline">Design Engineer</span>
              <span className="hidden text-dim sm:inline"> · </span>
              <span className="block sm:inline">
                UI/UX <span className="text-aurora">·</span> Frontend <span className="text-aurora">·</span> AI
              </span>
            </h1>

            <p className="sr-only">Design that takes off.</p>
            <div className="mt-6 w-full max-w-[60rem]">
              <AsciiText
                lines={[
                  { text: "Design that", colors: G_WHITE },
                  { text: "takes off.", colors: G_AURORA }
                ]}
                size="clamp(3.3rem, 11.2vw, 9.25rem)"
                cellRatio={20}
                play={ready}
              />
            </div>

            <div className="mt-6 max-w-xl">
              <p className="text-base font-bold leading-snug text-bright md:text-xl">
                Human-centered UI/UX, <span className="text-aurora">AI-native</span> design engineering.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-fg/85 md:text-[15px]">
                Hi, I'm <span className="text-bright">Al Ikhsan Faiq</span>, but call me Faiq. I design and build: user research and prototypes in Figma, production frontends in
                React and TypeScript, and AI features built in from day one. Information Systems graduate, GPA 3.96 Cum Laude.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href="#work" className="btn btn-primary">
                  see my work ↓
                </a>
                <a href={RESUME_URL} target="_blank" rel="noopener noreferrer" className="btn">
                  resume ↗
                </a>
              </div>
            </div>
          </div>

          {/* Editor-style status bar */}
          <div className="absolute inset-x-0 bottom-0 z-10 border-t border-line bg-ground/80 text-[10px] backdrop-blur-sm md:text-xs" aria-hidden="true">
            <div className="mx-auto flex h-7 max-w-7xl items-center gap-3 pr-4 md:pr-8">
              <span className="mode-chip">NORMAL</span>
              <span className="truncate text-dim">~/portfolio/index.tsx</span>
              <span className="ml-auto hidden text-dim sm:inline">utf-8 · palembang, id</span>
              <span className="text-aurora">scroll ↓ to launch</span>
            </div>
          </div>
        </section>

        {/* ───────────────── Selected Work ───────────────── */}
        {/* overflow-x-clip (not overflow-hidden) so the sticky field stays pinned while scrolling */}
        <div id="work" className="relative z-10 w-full overflow-x-clip bg-ground">
          <div
            className="pointer-events-none sticky top-0 z-0 -mb-[100vh] h-[100vh]"
            style={{
              maskImage: "linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)"
            }}
          >
            <AsciiCanvas scene={field} interactive cell={12} fps={12} className="h-full w-full opacity-70" />
          </div>

          <section className="relative z-10 mx-auto max-w-7xl px-5 pb-24 pt-20 md:px-10 md:pb-36 md:pt-28">
            <SectionHead
              cmd="ls -la ~/projects"
              title="Selected Work"
              lines={[{ text: "Selected work", colors: G_TEAL }]}
              note={
                <>
                  Each project undergoes thorough user testing and quantitative validation (Maze) to ensure <span className="text-bright">absolute design usability.</span>
                </>
              }
            />

            {/* Stats */}
            <motion.div {...reveal} className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3 md:mt-16 md:gap-6">
              {STATS.map(s => (
                <React.Fragment key={s.key}>
                <Frame title={s.key} titleColor={s.color} className="bg-ground/70 text-xs md:text-sm">
                  <div className="text-4xl font-extrabold leading-none md:text-5xl" style={{ color: s.color }}>
                    {s.value}
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-dim">{s.label}</p>
                </Frame>
                </React.Fragment>
              ))}
            </motion.div>

            {/* Projects */}
            <div className="mt-16 space-y-10 md:mt-24 md:space-y-14">
              {visibleProjects.map((project, index) => {
                const flip = index % 2 === 1;
                const isLaptop = project.title === "Clairo";
                return (
                  <motion.div key={project.title} {...reveal}>
                    <Frame
                      as="article"
                      title={`~/projects/${project.slug}`}
                      titleColor={project.accent}
                      meta={`${pad2(index + 1)}/${pad2(PROJECTS.length)}`}
                      className="ascii-hover bg-ground/80 text-xs md:text-sm"
                      bodyClassName="!py-8 md:!py-12"
                    >
                      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
                        <div className={`space-y-5 lg:col-span-6 ${flip ? "lg:order-2" : ""}`}>
                          <p className="text-[11px] uppercase tracking-[0.18em] md:text-xs" style={{ color: project.accent }}>
                            {pad2(index + 1)} · {project.category}
                          </p>
                          <h3 className="text-4xl font-extrabold uppercase leading-none tracking-tight text-bright md:text-6xl">{project.title}</h3>
                          <p className="text-sm leading-relaxed text-fg/80 md:text-[15px]">{project.description}</p>
                          <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-dim">
                            {project.tags.map(tag => (
                              <li key={tag}>
                                <span style={{ color: project.accent }}>#</span>
                                {tag}
                              </li>
                            ))}
                          </ul>
                          <div className="flex flex-wrap gap-3 pt-1">
                            <button onClick={() => setSelectedProject(project.title)} className="btn btn-primary">
                              read case study →
                            </button>
                            <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn">
                              slides ↗
                            </a>
                          </div>
                        </div>

                        <div className={`flex justify-center lg:col-span-6 ${flip ? "lg:order-1" : ""}`}>
                          <AsciiImage
                            src={project.image}
                            alt={`${project.title} mockup`}
                            width={project.imageSize[0]}
                            height={project.imageSize[1]}
                            cell={isLaptop ? 5 : 4}
                            className={isLaptop ? "w-full max-w-[580px]" : "w-full max-w-[220px] sm:max-w-[260px]"}
                          />
                        </div>
                      </div>
                    </Frame>
                  </motion.div>
                );
              })}
            </div>

            {PROJECTS.length > 3 && (
              <div className="flex justify-center pt-12 md:pt-16">
                <button onClick={() => setShowAllProjects(!showAllProjects)} className="btn" aria-expanded={showAllProjects}>
                  {showAllProjects ? "show fewer projects" : `ls --all  (+${PROJECTS.length - 3} more projects)`}
                </button>
              </div>
            )}
          </section>
        </div>

        {/* ───────────────── About ───────────────── */}
        <section id="about" className="relative z-10 bg-ground px-5 py-24 md:px-10 md:py-36">
          <div className="mx-auto max-w-7xl">
            <SectionHead
              cmd="cat about.md"
              title="Academic & Professional core"
              lines={[
                { text: "Academic &", colors: G_WHITE },
                { text: "Professional core.", colors: G_WARM }
              ]}
              note="Fusing traditional Information Systems architecture with modern AI-native digital design methodologies."
            />

            <div className="mt-12 grid grid-cols-1 gap-5 text-xs md:mt-16 md:gap-6 md:text-sm lg:grid-cols-12">
              <motion.div {...reveal} className="lg:col-span-4">
                <Frame title="faiq.jpg" titleColor={A.aurora} meta="800×800" className="ascii-hover h-full">
                  <AsciiImage src={`${BASE}images/al-ikhsan-faiq.jpg`} alt="Portrait of Al Ikhsan Faiq" width={800} height={800} fit="cover" cell={5} className="w-full" />
                  <p className="mt-4 text-xs text-dim">
                    <span className="text-bright">Al Ikhsan Faiq</span> · Palembang, South Sumatra, Indonesia
                  </p>
                </Frame>
              </motion.div>

              <motion.div {...reveal} className="lg:col-span-8">
                <Frame title="education" titleColor={A.aurora} meta="GPA 3.96 / 4.00" className="h-full" bodyClassName="flex h-full flex-col justify-between gap-8">
                  <div>
                    <h3 className="text-2xl font-extrabold uppercase leading-tight text-bright md:text-4xl">Universitas Sriwijaya</h3>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fg/80">
                      S1 Information Systems (Cum Laude). Graduated in 3.5 years. Deep studies in Human-Computer Interaction (HCI), Software Engineering, and Database Systems.
                    </p>
                  </div>
                  <div className="text-xs md:text-sm">
                    <p className="text-dim">gpa</p>
                    <p className="mt-1 whitespace-nowrap" aria-label="GPA 3.96 out of 4.00">
                      <span className="text-dim">[</span>
                      <span className="text-aurora">{"█".repeat(24)}</span>
                      <span className="text-line2">░</span>
                      <span className="text-dim">]</span> <span className="text-bright">3.96</span>
                      <span className="text-dim"> / 4.00</span>
                    </p>
                  </div>
                </Frame>
              </motion.div>

              <motion.div {...reveal} className="lg:col-span-6">
                <Frame title="publications" titleColor={A.teal} meta={`${PUBLICATIONS.length} papers`} className="h-full">
                  <ul className="space-y-5">
                    {PUBLICATIONS.map(pub => (
                      <li key={pub.title}>
                        <a href={pub.link} target="_blank" rel="noopener noreferrer" className="group block">
                          <h4 className="text-sm font-bold leading-snug text-bright transition-colors group-hover:text-teal">{pub.title} ↗</h4>
                          <span className="mt-1 block text-xs text-dim">
                            {pub.journal} · {pub.date}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </Frame>
              </motion.div>

              <motion.div {...reveal} className="lg:col-span-6">
                <Frame title="credentials & awards" titleColor={A.amber} className="h-full" bodyClassName="flex h-full flex-col justify-between gap-6">
                  <ul className="space-y-4">
                    {AWARDS.map(item => (
                      <li key={item.t} className="flex items-start gap-3">
                        <span className="text-amber" aria-hidden="true">
                          *
                        </span>
                        <div>
                          <h4 className="text-sm font-bold leading-tight text-bright">{item.t}</h4>
                          <span className="mt-0.5 block text-xs text-dim">{item.s}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-dim"># MikroTik Certified Network Associate (MTCNA)</p>
                </Frame>
              </motion.div>

              <motion.div {...reveal} className="lg:col-span-12">
                <Frame title="technical architecture" titleColor={A.violet} meta="skills" bodyClassName="space-y-8">
                  <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                    {SKILLS_CATEGORIES.map(cat => (
                      <div key={cat.title}>
                        <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: cat.color }}>
                          {cat.title}/
                        </h4>
                        <ul className="mt-3 space-y-1 text-xs text-fg/85 md:text-[13px]">
                          {cat.skills.map((sk, i) => (
                            <li key={sk} className="flex gap-2">
                              <span className="shrink-0 text-line2" aria-hidden="true">
                                {i === cat.skills.length - 1 ? "└──" : "├──"}
                              </span>
                              <span>{sk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-dim"># Leveraging v0, Antigravity AI, and Claude API for accelerated design-to-code pipelines.</p>
                </Frame>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ───────────────── Experience ───────────────── */}
        <section id="experience" className="relative z-10 bg-ground">
          <div className="mx-auto max-w-5xl px-5 py-24 md:px-10 md:py-36">
            <SectionHead
              cmd="git log --graph career"
              title="Selected experiences"
              lines={[
                { text: "Selected", colors: G_WHITE },
                { text: "experiences.", colors: G_VIOLET }
              ]}
              note="Bringing professional rigor and interface optimization to corporate and public engineering roles."
            />

            <ol className="mt-12 md:mt-16">
              {EXPERIENCE.map((exp, idx) => {
                const isExpanded = expandedExperience === idx;
                const last = idx === EXPERIENCE.length - 1;
                return (
                  <motion.li key={exp.role} {...reveal} className="relative pl-8 md:pl-10">
                    {/* the graph rail and the commit node */}
                    <span aria-hidden="true" className={`absolute left-[0.3rem] top-0 w-px bg-line2 ${last ? "h-7" : "bottom-0"}`} />
                    <span aria-hidden="true" className="absolute left-0 top-[1.05rem] bg-ground text-sm leading-none text-aurora">
                      *
                    </span>
                    <button
                      onClick={() => setExpandedExperience(isExpanded ? null : idx)}
                      aria-expanded={isExpanded}
                      className="group w-full py-4 text-left focus-visible:outline-offset-0"
                    >
                      <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-xs">
                        <span className="text-amber">{shortHash(exp.role + exp.company)}</span>
                        {idx === 0 && <span className="text-teal">(HEAD -&gt; present)</span>}
                        <span className="text-dim">{exp.period}</span>
                        <span className="ml-auto text-aurora" aria-hidden="true">
                          [{isExpanded ? "-" : "+"}]
                        </span>
                      </span>
                      <span className="mt-1.5 block text-base font-bold leading-snug text-bright transition-colors group-hover:text-aurora md:text-xl">{exp.role}</span>
                      <span className="mt-0.5 block text-xs text-dim md:text-sm">@ {exp.company}</span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-3 pb-7 text-sm">
                            <p className="leading-relaxed text-fg/85">{exp.description}</p>
                            <p className="border-l-2 border-aurora/60 bg-aurora/[0.06] px-3 py-2 leading-relaxed text-aurora">
                              <span aria-hidden="true">+ </span>
                              {exp.metrics}
                            </p>
                            {exp.link && (
                              <a href={exp.link} target="_blank" rel="noopener noreferrer" className="tlink inline-block text-xs text-teal">
                                {exp.link.replace(/^https?:\/\//, "").replace(/\/$/, "")} ↗
                              </a>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* ───────────────── Organizations ───────────────── */}
        <section id="organizations" className="relative z-10 bg-ground">
          <div className="mx-auto max-w-7xl px-5 pb-24 pt-8 md:px-10 md:pb-36">
            <SectionHead
              cmd="tree ~/organizations"
              title="Organizational experience"
              lines={[
                { text: "Organizational", colors: G_WHITE },
                { text: "experience.", colors: G_TEAL }
              ]}
              note="Showcasing leadership, collaboration, and community initiatives executed throughout campus life."
            />

            <div className="mt-12 grid grid-cols-1 gap-6 text-xs md:mt-16 md:text-sm lg:grid-cols-2">
              {ORGANIZATIONS.map((org, idx) => {
                const accent = ORG_ACCENTS[idx % ORG_ACCENTS.length];
                return (
                  <motion.div key={org.organization} {...reveal}>
                    <Frame as="article" title={org.organization} titleColor={accent} meta={pad2(idx + 1)} className="ascii-hover h-full">
                      <AsciiImage src={org.image} alt={org.organization} width={16} height={10} fit="cover" cell={5} className="w-full" />
                      <p className="mt-6 text-lg font-bold leading-snug text-bright md:text-xl">"{org.tagline}"</p>
                      <p className="mt-2 text-xs text-dim">
                        <span style={{ color: accent }}>{org.role}</span> · {org.period}
                      </p>
                      <ul className="mt-5 space-y-1.5 text-[13px] leading-relaxed text-fg/80">
                        {org.bullets.map((bullet, i) => (
                          <li key={bullet} className="flex gap-2">
                            <span className="shrink-0 text-line2" aria-hidden="true">
                              {i === org.bullets.length - 1 ? "└──" : "├──"}
                            </span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </Frame>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ───────────────── Launch: the rocket climbs out of the clouds as you scroll ───────────────── */}
        <section id="launch" ref={launchRef} className="relative z-10 h-[110svh] min-h-[620px] overflow-hidden bg-ground">
          <AsciiCanvas scene={liftoff} images={{ rocket: ROCKET_IMG }} getProgress={launchProgress} cell={sceneCell} className="absolute inset-0" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-ground to-transparent" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ground" aria-hidden="true" />

          <div className="relative z-10 mx-auto max-w-7xl px-5 pt-24 text-center md:px-10 md:pt-28">
            <Prompt cmd="./launch --your-product" />
            <h2 className="sr-only">Ready for liftoff?</h2>
            <div className="mt-6 lg:hidden">
              <AsciiText
                lines={[
                  { text: "Ready for", colors: G_WHITE },
                  { text: "liftoff?", colors: G_WARM }
                ]}
                size="clamp(3rem, 14vw, 6.5rem)"
                align="center"
              />
            </div>
            <div className="mt-6 hidden grid-cols-[1fr_15rem_1fr] items-start lg:grid">
              <AsciiText lines={[{ text: "Ready for", colors: G_WHITE }]} size="clamp(3.5rem, 6.6vw, 8rem)" align="right" />
              <span />
              <AsciiText lines={[{ text: "liftoff?", colors: G_WARM }]} size="clamp(3.5rem, 6.6vw, 8rem)" align="left" />
            </div>
            <p className="mx-auto mt-5 max-w-sm text-[13px] leading-relaxed text-bright/90 lg:mt-2">
              Got a product that needs to get off the ground? I'm open to full-time roles, freelance projects and collaborations.
            </p>
          </div>
        </section>

        {/* ───────────────── Contact / Footer ───────────────── */}
        <footer id="contact" className="relative z-10 bg-ground pb-28 pt-10 md:pb-16 md:pt-16">
          <div className="mx-auto max-w-6xl px-5 md:px-10">
            <Frame variant="double" color="var(--color-line2)" title="./contact.sh" titleColor={A.aurora} meta="tty1" className="text-xs md:text-sm" bodyClassName="md:!px-[5ch] md:!py-12">
              <Prompt cmd="./contact.sh --hello" />
              <h2 className="sr-only">Let's build something that flies.</h2>
              <AsciiText
                lines={[
                  { text: "Let's build", colors: G_WHITE },
                  { text: "something", colors: G_WHITE },
                  { text: "that flies.", colors: G_AURORA }
                ]}
                size="clamp(2.8rem, 10vw, 8.5rem)"
                className="mt-6"
              />
              <p className="mt-8 max-w-md text-sm leading-relaxed text-fg/85 md:text-base">Always open to talking UI/UX, design systems, frontend builds or AI-powered product ideas.</p>

              <ul className="mt-8 grid gap-x-10 gap-y-3 text-sm sm:grid-cols-2">
                {SOCIAL_LINKS.map(soc => (
                  <li key={soc.label} className="flex items-baseline gap-3">
                    <span className="w-[9ch] shrink-0 text-dim">{soc.label}</span>
                    <a href={soc.url} target={soc.url.startsWith("mailto:") ? undefined : "_blank"} rel="noopener noreferrer" className="tlink min-w-0 truncate text-bright">
                      {soc.handle}
                      {soc.url.startsWith("mailto:") ? "" : " ↗"}
                    </a>
                  </li>
                ))}
              </ul>

              <form onSubmit={handleConnect} className="mt-10 border-t border-dashed border-line2 pt-6">
                <label htmlFor="connect-email" className="text-xs text-dim">
                  <span className="text-aurora">$</span> ./connect --email
                </label>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                  <input
                    id="connect-email"
                    type="email"
                    placeholder="your.email@domain.com"
                    value={emailInput}
                    onChange={e => setEmailInput(e.target.value)}
                    required
                    className="min-w-0 flex-1 border border-line2 bg-panel px-3 py-2.5 text-base text-bright outline-none placeholder:text-dim/60 focus:border-aurora sm:text-sm"
                  />
                  <button type="submit" className="btn btn-primary">
                    connect
                  </button>
                </div>
                <p className="mt-3 text-xs text-dim" aria-live="polite">
                  {sent ? "> opening your mail app with a note to Faiq..." : "> leave your email to start a conversation about your next product."}
                </p>
              </form>
            </Frame>

            <div className="mt-14 flex flex-col items-center gap-8 text-center md:flex-row md:items-end md:justify-between md:text-left">
              <a href="#top" aria-label="Back to top" className="block">
                <pre className="text-[9px] leading-[1.15] text-aurora md:text-[11px]" aria-hidden="true">
                  {SIGNATURE}
                </pre>
              </a>
              <div className="space-y-1 text-xs text-dim md:text-right">
                <p>Palembang, South Sumatra, Indonesia</p>
                <p>© {new Date().getFullYear()} Al Ikhsan Faiq. All rights reserved.</p>
                <p>Created with Antigravity AI + React &amp; Tailwind v4, rendered in ASCII.</p>
              </div>
            </div>
          </div>
        </footer>

        {/* Floating availability pill */}
        <a
          href="https://wa.me/6287899677415"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 border border-aurora/50 bg-ground/90 px-3 py-2 text-[11px] text-aurora shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-sm transition-colors hover:border-aurora hover:bg-aurora hover:text-ground md:bottom-6 md:right-6 md:text-xs"
        >
          [<span className="blink" aria-hidden="true">●</span> available for hire]
        </a>

        {/* Case study panel */}
        <AnimatePresence>{selectedProject && <CaseStudyModal projectTitle={selectedProject} onClose={() => setSelectedProject(null)} />}</AnimatePresence>
      </div>
    </MotionConfig>
  );
}
