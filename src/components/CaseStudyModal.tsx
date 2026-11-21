import React, { useEffect, useRef } from "react";
import { motion } from "motion/react";

interface Metric {
  label: string;
  before: number;
  after: number;
  unit: string;
  isLowerBetter?: boolean;
}

interface CaseStudy {
  title: string;
  subtitle: string;
  category: string;
  role: string;
  duration: string;
  problem: string;
  solution: string;
  process: string[];
  metrics: Metric[];
  tags: string[];
  link: string;
}

const CASE_STUDIES: Record<string, CaseStudy> = {
  "RS UMMI": {
    title: "RS UMMI EMR Platform",
    subtitle: "Enterprise Electronic Medical Record System & Specialized Print Engine",
    category: "Healthcare EMR Platform",
    role: "UI/UX & Frontend Developer (Contract)",
    duration: "Aug 2025 - Present",
    problem: "Hospital medical staff required digitizing paper patient discharge forms (RM 16.F, Obstetric Assessment) with strict requirements for clean physical document printing and signature alignment.",
    solution: "Designed and implemented clinical EMR forms in CodeIgniter 3 and Bootstrap, engineering a specialized @media print CSS layout engine with side-by-side signature positioning, page-break control, and digital signature canvas rendering.",
    process: [
      "Analyzed clinical workflows and physical RM forms across hospital departments.",
      "Sliced responsive CodeIgniter 3 / Bootstrap 4 views matching hospital design language.",
      "Engineered clean print stylesheets (@media print) enforcing high-contrast borders, side-by-side signature columns, and page-break avoidance.",
      "Authored standardized AGENTS.md frontend design rules for hospital EMR modules."
    ],
    metrics: [
      { label: "Print Layout Errors", before: 42, after: 0, unit: "%", isLowerBetter: true },
      { label: "Forms Digitized", before: 0, after: 3, unit: " forms" },
      { label: "Signature Canvas Integrity", before: 50, after: 100, unit: "%" }
    ],
    tags: ["CodeIgniter 3", "Healthcare EMR", "@media print CSS", "Bootstrap & jQuery"],
    link: "https://github.com/faiqxz"
  },
  Clairo: {
    title: "Clairo",
    subtitle: "Teacher-in-the-Loop AI Learning Management System",
    category: "AI-Native EdTech Platform",
    role: "Lead Product Designer & Full-Stack AI Engineer",
    duration: "May 2026 - Present",
    problem: "Existing AI educational tools bypass teacher oversight, generating generic content without curriculum alignment or pedagogical safety for Indonesian secondary schools (SMP/SMA).",
    solution: "Built a Teacher-in-the-Loop AI-LMS with architecturally enforced Firestore approval gates, 14 Gemini AI service functions (3-tier differentiation, automated rubric grading, RPP generator), and an Edpuzzle-style interactive video studio.",
    process: [
      "Framed Teacher-in-the-Loop human-centered AI thesis aligning with Indonesian Kurikulum Merdeka standards.",
      "Engineered 14 Gemini AI service functions for content differentiation (Easy/Standard/Advanced), RPP generator, and parent WhatsApp communication.",
      "Built Firestore security rules ensuring no AI output reaches students prior to explicit teacher approval.",
      "Integrated System Usability Scale (SUS) survey engine for HCI quantitative usability testing."
    ],
    metrics: [
      { label: "SUS Usability Score", before: 68, after: 86, unit: " pts" },
      { label: "Content Prep Time", before: 180, after: 35, unit: " min", isLowerBetter: true },
      { label: "AI Output Approval Rate", before: 0, after: 94, unit: "%" }
    ],
    tags: ["Google Gemini API", "Teacher-in-the-Loop", "Firebase Firestore", "SUS Usability Engine"],
    link: "https://github.com/faiqxz"
  },
  Yappy: {
    title: "Yappy",
    subtitle: "Language Learning Application with Interactive Conversational UI",
    category: "EdTech Mobile Application",
    role: "UX Researcher & UI Designer (Award Winning)",
    duration: "Oct - Nov 2024 (6 weeks)",
    problem: "Traditional language learning apps rely on static, textual flashcards. Users struggle to build conversational confidence due to a lack of interactive speech practice and real-time feedback.",
    solution: "Designed an interactive language learning app integrating bite-sized speech lessons with a real-time conversational AI chatbot. This allows users to practice spoken scenarios in a safe environment.",
    process: [
      "User research through interviews with 15 language learners to map out immersion pain points.",
      "Information Architecture mapping to structure courses, chatbot interface, and tutor booking flow.",
      "High-fidelity UI design in Figma with a custom, accessible design system.",
      "Two rounds of Maze Usability Testing with 20 participants to validate the speech interface."
    ],
    metrics: [
      { label: "SUS Usability Score", before: 70, after: 82, unit: " pts" },
      { label: "Avg. Task Completion Time", before: 122, after: 78, unit: "s", isLowerBetter: true },
      { label: "Maze Misclick Rate", before: 28, after: 9, unit: "%", isLowerBetter: true }
    ],
    tags: ["Award Winning", "Figma Design System", "2-Round Maze Testing", "Chatbot UI"],
    link: "https://bit.ly/YappyPPT"
  },
  Neurofit: {
    title: "Neurofit",
    subtitle: "End-to-End Structured Gym Workout Guidance App",
    category: "Fitness Mobile Application",
    role: "Lead UI/UX Designer & Researcher",
    duration: "Sep - Nov 2025 (8 weeks)",
    problem: "Beginner gym-goers experience friction tracking progressive overload and structuring weight routines, leading to early workout abandonment and inconsistent logs.",
    solution: "Developed a frictionless fitness tracking experience that models structured workout routines, custom exercises, and progressive overload metrics in a highly intuitive mobile interface.",
    process: [
      "Conducted 12 field interviews and competitor analysis of top-tier workout apps.",
      "Created target user personas and mapped out exercise logging flows to minimize tapping.",
      "Built a component-based Figma design system focused on high-contrast readability in bright gym lighting.",
      "Validated prototype flows with Maze usability testing to optimize active workout logging."
    ],
    metrics: [
      { label: "Routine Setup Speed", before: 180, after: 65, unit: "s", isLowerBetter: true },
      { label: "User Task Completion", before: 62, after: 95, unit: "%" },
      { label: "Design Consistency Rating", before: 72, after: 96, unit: "%" }
    ],
    tags: ["UX Research", "Figma Components", "Usability Testing", "Fitness Tech"],
    link: "https://bit.ly/NeurofitPPT"
  },
  PrimaPlus: {
    title: "PrimaPlus",
    subtitle: "Digital Health Consultation and Appointment Booking Platform",
    category: "HealthTech Mobile Application",
    role: "Information Architect & UI Designer",
    duration: "Jul - Aug 2025 (4 weeks)",
    problem: "Patients experience long wait times and visual confusion when trying to consult doctor directories, manage appointments, and access medical records.",
    solution: "Designed a clean, highly structured telehealth application that streamlines physician directories, simplifies appointments into a 4-step booking flow, and organizes medical summaries.",
    process: [
      "Card sorting exercises with users to group health categories logically.",
      "Sketched low-fidelity layouts and compared task steps between current booking flows.",
      "Designed a soft, reassuring visual system using custom icons and high-contrast clinical fonts.",
      "Conducted post-design prototype testing to ensure zero ambiguity in medical emergency alerts."
    ],
    metrics: [
      { label: "Doctor Booking Steps", before: 9, after: 4, unit: " steps", isLowerBetter: true },
      { label: "Booking Success Rate", before: 65, after: 94, unit: "%" },
      { label: "Navigation Clarity", before: 55, after: 88, unit: "%" }
    ],
    tags: ["Information Architecture", "HealthTech", "Task Flow Design", "User Personas"],
    link: "https://bit.ly/PrimaPLus"
  },
  FitMart: {
    title: "FitMart",
    subtitle: "Seamless Fitness Workout and E-Commerce Integration App",
    category: "Fitness & E-Commerce Mobile App",
    role: "End-to-End Product Designer",
    duration: "Oct - Nov 2025 (6 weeks)",
    problem: "Fitness enthusiasts are forced to toggle between shopping apps for workout nutrition and tracking apps for physical workouts, disrupting their athletic workflow.",
    solution: "Created an integrated ecosystem that houses a premium workout tracking tool and a curated supplement storefront under a unified navigation and design system.",
    process: [
      "Created joint user journey maps showing cross-domain flows (workout to post-workout checkout).",
      "Drafted interaction wireframes focusing on smooth tabs transitions.",
      "Engineered an extensive e-commerce grid and cart interface adhering to modern product display standards.",
      "Validated checkout flow speeds and shopping carts using Maze usability benchmarks."
    ],
    metrics: [
      { label: "Supplement Checkout Speed", before: 145, after: 62, unit: "s", isLowerBetter: true },
      { label: "Cross-Domain Task Success", before: 58, after: 89, unit: "%" },
      { label: "User Satisfaction Index", before: 60, after: 92, unit: "%" }
    ],
    tags: ["Cross-Domain UX", "E-Commerce Checkout", "Figma Prototyping", "User Journey Mapping"],
    link: "https://bit.ly/Prototype-FitMart"
  },
  Travelin: {
    title: "Travelin",
    subtitle: "Integrated Flight & Lodging Booking App with Transparent Rescheduling",
    category: "GDGoC Mobile Application",
    role: "Lead UI/UX Designer",
    duration: "Dec 2024 (4 weeks)",
    problem: "Users face high anxiety and confusion when modifying or canceling travel reservations. Non-transparent fees and convoluted rescheduling forms lead to user frustration and support tickets.",
    solution: "Designed a simple, 3-step reschedule and refund flow highlighting cost transparency, and consolidated flight and hotel itineraries in a single unified dashboard.",
    process: [
      "Analyzed GDGoC company requirements to define target user flows for booking adjustments.",
      "Created detailed user persona mapping travelers who experience scheduling shifts.",
      "Designed low-fidelity paper wireframes exploring simplified rescheduling screens.",
      "Crafted a high-fidelity prototype in Figma focusing on step-by-step cancelation tracking and notification clarity."
    ],
    metrics: [
      { label: "Refund Transparency Score", before: 42, after: 90, unit: " %" },
      { label: "Time to Submit Reschedule", before: 240, after: 95, unit: "s", isLowerBetter: true },
      { label: "Customer Support Inquiries", before: 38, after: 12, unit: "%", isLowerBetter: true }
    ],
    tags: ["GDGoC Challenge", "Travel Booking", "Reschedule & Refund Flow"],
    link: "https://bitly.cx/Travelin"
  },
  "UNSRI GO": {
    title: "UNSRI GO",
    subtitle: "Academic Portal and Student Campus Life Assistant",
    category: "Academic Mobile Application",
    role: "Lead UI/UX Designer",
    duration: "Nov - Dec 2024 (5 weeks)",
    problem: "Students experience difficulty navigating campus academic systems, viewing grade transcripts (KHS) on mobile, and tracking real-time university shuttle buses.",
    solution: "Created a unified campus portal combining course schedules, direct academic transcript viewing, and an integrated shuttle bus tracker.",
    process: [
      "Surveyed 50+ UNSRI students to identify pain points in the legacy desktop academic portal.",
      "Developed student personas and user journeys representing freshman vs. senior academic tasks.",
      "Designed a mobile-first UI using UNSRI's brand colors (yellow/gold) with high-contrast accessibility.",
      "Conducted cognitive walkthroughs to validate grades view and route tracking task success."
    ],
    metrics: [
      { label: "Academic Task Speed", before: 190, after: 45, unit: "s", isLowerBetter: true },
      { label: "Portal Mobile Usability", before: 45, after: 88, unit: "%" },
      { label: "Student Satisfaction", before: 35, after: 92, unit: "%" }
    ],
    tags: ["EdTech", "Campus Services", "Mobile Portal"],
    link: "https://unsri.ac.id"
  }
};

interface CaseStudyModalProps {
  projectTitle: string;
  onClose: () => void;
}

const BAR = 22;

/** before → after as two ASCII bars on the same scale. */
function MetricBars({ metric, delay }: { metric: Metric; delay: number }) {
  const max = Math.max(metric.before, metric.after, 1);
  const cells = (v: number) => Math.max(v > 0 ? 1 : 0, Math.round((v / max) * BAR));
  const change = metric.before === 0 ? null : metric.isLowerBetter ? ((metric.before - metric.after) / metric.before) * 100 : ((metric.after - metric.before) / metric.before) * 100;
  const row = (label: string, v: number, on: string, glyph: string) => (
    <div className="flex items-center gap-2 whitespace-nowrap">
      <span className="w-[7ch] shrink-0 text-dim">{label}</span>
      <span aria-hidden="true">
        <span className="text-dim">[</span>
        <span className={on}>{glyph.repeat(cells(v))}</span>
        <span className="text-line2">{"░".repeat(BAR - cells(v))}</span>
        <span className="text-dim">]</span>
      </span>
      <span className="text-bright">
        {v}
        {metric.unit}
      </span>
    </div>
  );
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="no-scrollbar space-y-1.5 overflow-x-auto border-l-2 border-line2 pl-4 text-[11px] sm:text-xs"
    >
      <p className="text-[13px] font-bold text-bright sm:text-sm">{metric.label}</p>
      {row("phase 1", metric.before, "text-dim", "▒")}
      {row("phase 2", metric.after, metric.isLowerBetter ? "text-amber" : "text-teal", "█")}
      {change !== null && (
        <p className="text-aurora">
          {metric.isLowerBetter ? "▼ reduced" : "▲ improved"} by {change.toFixed(0)}%
        </p>
      )}
    </motion.div>
  );
}

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-base font-bold text-bright sm:text-lg">
    <span className="text-aurora">## </span>
    {children}
  </h3>
);

export default function CaseStudyModal({ projectTitle, onClose }: CaseStudyModalProps) {
  const project = CASE_STUDIES[projectTitle];
  const closeRef = useRef<HTMLButtonElement>(null);
  const slug = projectTitle.toLowerCase().replace(/\s+/g, "-");

  // Move focus into the panel, and give it back when the panel closes.
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus({ preventScroll: true });
    return () => prev?.focus?.({ preventScroll: true });
  }, []);

  if (!project) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-end overflow-hidden">
      <div onClick={onClose} className="absolute inset-0 cursor-zoom-out bg-ground/75 lg:backdrop-blur-sm" />

      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 34, stiffness: 260 }}
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        className="no-scrollbar relative z-10 flex h-full w-full max-w-4xl flex-col overflow-y-auto overscroll-contain border-l border-line2 bg-panel font-mono text-fg"
      >
        {/* Window title bar */}
        <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-line2 bg-panel/95 px-4 py-3 backdrop-blur-sm sm:px-6">
          <span className="flex shrink-0 gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-rose/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-aurora/80" />
          </span>
          <span className="min-w-0 truncate text-xs text-dim">~/case-studies/{slug}.md</span>
          <button ref={closeRef} onClick={onClose} aria-label="Close case study" className="btn btn-sm ml-auto shrink-0">
            esc ✕
          </button>
        </div>

        <div className="flex-1 space-y-12 px-5 py-10 sm:space-y-14 sm:px-8 sm:py-12 lg:px-14">
          <header>
            <p className="text-xs text-dim">
              <span className="text-aurora">guest@faiq</span>:<span className="text-teal">~</span>$ cat {slug}.md
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.16em]">
              <span className="border border-line2 px-2 py-1 text-dim">{project.category}</span>
              {projectTitle === "Yappy" && <span className="border border-amber/40 px-2 py-1 text-amber">* award winner</span>}
            </div>
            <h2 className="mt-5 text-4xl font-extrabold uppercase leading-none tracking-tight text-bright sm:text-6xl">
              <span className="text-aurora"># </span>
              {project.title}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-fg/75 sm:text-base">{project.subtitle}</p>
          </header>

          {/* Meta as a little key/value table */}
          <dl className="grid gap-x-6 gap-y-2 border-y border-dashed border-line2 py-5 text-xs sm:grid-cols-[9ch_1fr] sm:text-sm">
            <dt className="text-dim">role</dt>
            <dd className="text-bright">{project.role}</dd>
            <dt className="text-dim">timeline</dt>
            <dd className="text-bright">{project.duration}</dd>
            <dt className="text-dim">stack</dt>
            <dd className="flex flex-wrap gap-x-3 gap-y-1">
              {project.tags.map(tag => (
                <span key={tag} className="text-fg/85">
                  <span className="text-aurora">#</span>
                  {tag}
                </span>
              ))}
            </dd>
          </dl>

          <div className="grid gap-10 md:grid-cols-2 md:gap-12">
            <section className="space-y-3">
              <H2>the challenge</H2>
              <p className="text-sm leading-relaxed text-fg/80">{project.problem}</p>
            </section>
            <section className="space-y-3">
              <H2>the solution</H2>
              <p className="text-sm leading-relaxed text-fg/80">{project.solution}</p>
            </section>
          </div>

          <section className="space-y-5">
            <H2>ux process</H2>
            <ol className="space-y-4 text-sm">
              {project.process.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="shrink-0 text-teal">{String(i + 1).padStart(2, "0")}</span>
                  <span className="leading-relaxed text-fg/80">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="space-y-6">
            <div>
              <H2>maze testing metrics</H2>
              <p className="mt-2 text-xs text-dim sm:text-sm">Quantitative improvements validated via task-based analytics between testing phases.</p>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              {project.metrics.map((metric, idx) => (
                <React.Fragment key={idx}>
                  <MetricBars metric={metric} delay={0.08 * idx} />
                </React.Fragment>
              ))}
            </div>
          </section>

          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-4 border border-aurora bg-aurora px-5 py-5 text-ground transition-colors hover:border-bright hover:bg-bright sm:px-6"
          >
            <span>
              <span className="block text-[11px] uppercase tracking-[0.18em] opacity-70">full presentation</span>
              <span className="mt-1 block text-xl font-extrabold uppercase sm:text-2xl">view figma deck</span>
            </span>
            <span className="text-2xl transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true">
              ↗
            </span>
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}
