import React from "react";
import { motion } from "motion/react";
import { X, ArrowUpRight, Award, Clock, Activity, CheckCircle, Smartphone } from "lucide-react";

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

export default function CaseStudyModal({ projectTitle, onClose }: CaseStudyModalProps) {
  const project = CASE_STUDIES[projectTitle];
  if (!project) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-end overflow-hidden"
    >
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#050505]/45 backdrop-blur-md cursor-zoom-out"
      />

      {/* Modal Panel sliding from right */}
      <motion.div
        initial={{ x: "100%", opacity: 0.95 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0.95 }}
        transition={{ type: "spring", damping: 32, stiffness: 240 }}
        className="relative w-full max-w-4xl h-full bg-[#FAF9F6] text-[#1A1A1A] shadow-2xl flex flex-col z-10 overflow-y-auto no-scrollbar border-l border-black/5"
      >
        {/* Top Sticky Header */}
        <div className="sticky top-0 bg-[#FAF9F6]/85 backdrop-blur-md z-30 px-8 py-6 border-b border-black/5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold font-mono uppercase tracking-[0.2em] px-2.5 py-1 bg-[#1A1A1A]/5 rounded-full text-[#1A1A1A]/60">
              {project.category}
            </span>
            {projectTitle === "Yappy" && (
              <span className="text-[10px] font-bold font-mono uppercase tracking-[0.2em] px-2.5 py-1 bg-amber-500/10 text-amber-700 rounded-full flex items-center gap-1 border border-amber-500/20">
                <Award className="w-3.5 h-3.5" /> Award Winner
              </span>
            )}
          </div>
          <motion.button
            whileHover={{ rotate: 90, scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Core Content */}
        <div className="px-8 lg:px-16 py-12 space-y-16 flex-1">
          {/* Header Title */}
          <div>
            <h1 className="text-5xl lg:text-7xl font-bold font-display tracking-tight text-[#1A1A1A] leading-[1.05]">
              {project.title}
            </h1>
            <p className="text-xl lg:text-2xl text-[#1A1A1A]/60 mt-4 leading-relaxed font-sans max-w-2xl font-light">
              {project.subtitle}
            </p>
          </div>

          {/* Quick Meta Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 p-6 bg-black/[0.02] rounded-[1.5rem] border border-black/5">
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-black/40">Role</span>
              <span className="text-sm font-semibold mt-1 block">{project.role}</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-black/40">Timeline</span>
              <span className="text-sm font-semibold mt-1 block">{project.duration}</span>
            </div>
            <div className="col-span-2 md:col-span-1">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-black/40">Deliverables</span>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {project.tags.slice(0, 3).map((tag, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-black/5 font-medium">{tag}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Problem & Solution Split */}
          <div className="grid md:grid-cols-2 gap-12 pt-4">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/5 text-red-600 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold tracking-tight">The Challenge</h3>
              <p className="text-sm text-black/60 leading-relaxed font-normal">
                {project.problem}
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/5 text-emerald-600 flex items-center justify-center">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold tracking-tight">The Solution</h3>
              <p className="text-sm text-black/60 leading-relaxed font-normal">
                {project.solution}
              </p>
            </div>
          </div>

          {/* Design Process */}
          <div className="space-y-6 pt-4">
            <h3 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Smartphone className="w-6 h-6 stroke-[1.5]" /> Architectural UX Process
            </h3>
            <div className="relative border-l border-black/10 pl-6 ml-3 space-y-8">
              {project.process.map((step, i) => (
                <div key={i} className="relative">
                  {/* Circle Node */}
                  <div className="absolute -left-[31px] top-1.5 w-4.5 h-4.5 rounded-full bg-[#FAF9F6] border-2 border-black flex items-center justify-center">
                    <span className="text-[8px] font-bold">{i + 1}</span>
                  </div>
                  <p className="text-sm text-black/70 leading-relaxed">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Verification & Metrics Charts */}
          <div className="space-y-8 pt-4">
            <div>
              <h3 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                <Clock className="w-6 h-6 stroke-[1.5]" /> Maze Usability Testing Metrics
              </h3>
              <p className="text-sm text-black/40 mt-1">
                Quantitative improvements validated via task-based analytics between testing phases.
              </p>
            </div>

            {/* Bar charts visualization */}
            <div className="grid md:grid-cols-3 gap-8">
              {project.metrics.map((metric, idx) => {
                const percentDiff = metric.isLowerBetter 
                  ? ((metric.before - metric.after) / metric.before) * 100
                  : ((metric.after - metric.before) / metric.before) * 100;
                
                return (
                  <div key={idx} className="p-6 rounded-[2rem] bg-white border border-black/5 double-bezel flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-black/40 block mb-1">{metric.label}</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold font-display">{metric.after}{metric.unit}</span>
                        <span className="text-xs text-black/30 line-through">from {metric.before}</span>
                      </div>
                    </div>

                    {/* Animated SVG Chart */}
                    <div className="my-6 h-16 w-full flex items-end gap-4 px-2">
                      {/* Before Bar */}
                      <div className="flex-1 flex flex-col items-center gap-1.5">
                        <div className="w-full bg-black/10 rounded-t-sm h-12" />
                        <span className="text-[8px] font-bold text-black/30">Phase 1</span>
                      </div>
                      
                      {/* After Bar */}
                      <div className="flex-1 flex flex-col items-center gap-1.5">
                        <motion.div 
                          initial={{ height: 0 }}
                          whileInView={{ height: `${(metric.after / Math.max(metric.before, metric.after)) * 48}px` }}
                          viewport={{ once: true }}
                          transition={{ type: "spring", stiffness: 100, delay: 0.15 * idx }}
                          className={`w-full rounded-t-sm ${metric.isLowerBetter ? "bg-amber-500" : "bg-emerald-500"}`}
                        />
                        <span className="text-[8px] font-bold text-black/50">Phase 2</span>
                      </div>
                    </div>

                    <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full w-fit self-start flex items-center gap-1 border border-emerald-500/10">
                      {metric.isLowerBetter ? "Reduced" : "Improved"} by {percentDiff.toFixed(0)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Immersive CTA to slides */}
          <div className="pt-8">
            <motion.a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white p-6 rounded-[2rem] flex items-center justify-between group transition-colors shadow-lg"
            >
              <div className="text-left">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/50 block">Full Presentation</span>
                <span className="text-lg font-bold mt-1 block">View Figma Presentation Deck</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
            </motion.a>
          </div>

        </div>
      </motion.div>
    </motion.div>
  );
}
