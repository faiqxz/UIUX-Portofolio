import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { 
  ArrowUpRight, 
  Github, 
  Linkedin, 
  Mail, 
  Phone, 
  Download, 
  GraduationCap, 
  BookOpen, 
  Award, 
  Layers, 
  MessageSquare, 
  ChevronDown, 
  Clock, 
  Send,
  Sparkles,
  MapPin,
  Flame,
  FileText
} from "lucide-react";
import PhoneMockup from "./components/PhoneMockup.tsx";
import CaseStudyModal from "./components/CaseStudyModal.tsx";
import TrueFocus from "./components/TrueFocus.tsx";
import StarBorder from "./components/StarBorder.tsx";
import MagicBento, { MagicBentoCard } from "./components/MagicBento.tsx";
import DotGrid from "./components/DotGrid.tsx";

const BASE = import.meta.env.BASE_URL;

const PROJECTS = [
  {
    title: "Yappy",
    category: "Language Learning Application",
    description: "3rd Place winner at UIUX Competition. An AI-native language app integrating interactive conversational scenarios and Maze-validated voice interfaces.",
    tags: ["Award Winning", "Conversational AI", "Maze Testing"],
    image: `${BASE}images/Yappy Mockup.png`,
    link: "https://bit.ly/YappyPPT",
    accentColor: "from-amber-500/20 to-orange-500/20",
    textColor: "text-amber-600"
  },
  {
    title: "Neurofit",
    category: "Fitness Mobile Application",
    description: "A structured workout logs app designed from problem definition to Maze validation, supporting progressive overload tracking and muscle analytics.",
    tags: ["UX Research", "Design System", "Data Visualization"],
    image: `${BASE}images/Neurofit Mockup.png`,
    link: "https://bit.ly/NeurofitPPT",
    accentColor: "from-blue-500/20 to-indigo-500/20",
    textColor: "text-blue-600"
  },
  {
    title: "PrimaPlus",
    category: "Health Consultant Application",
    description: "A digital health platform streamlining medical directories and patient consulting records, mapping clinical user flows for high accessibility.",
    tags: ["Information Architecture", "HealthTech", "Figma Components"],
    image: `${BASE}images/PrimaPLus Mockup.png`,
    link: "https://bit.ly/PrimaPLus",
    accentColor: "from-emerald-500/20 to-teal-500/20",
    textColor: "text-emerald-600"
  },
  {
    title: "FitMart",
    category: "E-Commerce & Workout App",
    description: "An integrated e-commerce shop and workout mobile prototype mapping seamless navigation across supplementation shopping and fitness logging.",
    tags: ["UI/UX Design", "Cross-Domain Flows", "Maze Usability"],
    image: `${BASE}images/Fitmart Mockup.png`,
    link: "https://bit.ly/Prototype-FitMart",
    accentColor: "from-violet-500/20 to-fuchsia-500/20",
    textColor: "text-violet-600"
  },
  {
    title: "Travelin",
    category: "Integrated Travel & Booking App",
    description: "GDGoC Mobile application streamlining joint flight and lodging reservations with a simplified, transparent rescheduling and refund management system.",
    tags: ["GDGoC Challenge", "Travel Booking", "Reschedule & Refund Flow"],
    image: `${BASE}images/Travelin Mockup.png`,
    link: "https://bitly.cx/Travelin",
    accentColor: "from-teal-500/20 to-emerald-500/20",
    textColor: "text-teal-600"
  },
  {
    title: "UNSRI GO",
    category: "Academic Portal & Campus Assistant",
    description: "An academic mobile application for Universitas Sriwijaya students, organizing course registrations, real-time campus shuttle tracking, and exam schedules.",
    tags: ["EdTech", "Campus Services", "Mobile Portal"],
    image: `${BASE}images/Unsri GO Mockup.png`,
    link: "https://unsri.ac.id",
    accentColor: "from-amber-500/20 to-yellow-500/20",
    textColor: "text-amber-600"
  }
];

const EXPERIENCE = [
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
    description: "Led property design coordination for InspireHER 2025: BLOOM Event. Designed UI/UX prototypes for digital product case studies and applied Design Thinking methodology to solve user workflow friction.",
    bullets: [
      "Led property design coordination for InspireHER 2025: BLOOM Event.",
      "Designed UI/UX prototypes for digital product case studies.",
      "Built design systems and reusable UI components using Figma.",
      "Created wireframes, prototypes, and micro-interaction flows.",
      "Conducted usability testing and iterative design refinement."
    ],
    image: `${BASE}images/gdg_experience.png`
  },
  {
    organization: "Media Sistem Informasi Unsri",
    role: "Staff of Videography / Photography Division",
    period: "May 2024 - Jan 2025",
    tagline: "Capturing and editing visual stories for campus media",
    description: "Produced and edited video content for event documentation and promotional media. Served as video evaluation jury for the PKKMB Department program.",
    bullets: [
      "Served as video evaluation jury for the PKKMB Department program.",
      "Produced and edited video content for event documentation and promotional media.",
      "Created after-movie recap videos to summarize event activities and engagement."
    ],
    image: `${BASE}images/media_experience.png`
  },
  {
    organization: "Intel Fasilkom Unsri",
    role: "Staff of Media and Information Department",
    period: "Mar 2024 - Jan 2025",
    tagline: "Structuring visual communications and print layouts",
    description: "Led videography production for the International English Fest (IEF). Designed digital and printed media materials including proposals, live report templates, pamphlets, and banners.",
    bullets: [
      "Led videography production for the International English Fest (IEF).",
      "Designed digital and printed media materials (proposal layouts, plaques, live report templates, pamphlets, banners).",
      "Produced and edited after-movie recap videos."
    ],
    image: `${BASE}images/intel_experience.png`
  },
  {
    organization: "Comnets Research Group",
    role: "Member & Executive Committee Carnaval IMWORK 2024",
    period: "Jan 2024 - Jan 2025",
    tagline: "Collaborative networking research and event execution",
    description: "Contributed to knowledge exchange on routing, technology topics, and networking. Served as Executive Committee member for the 6th Carnaval IMWORK 2024.",
    bullets: [
      "Participated in research discussions and collaborative technical learning activities.",
      "Contributed to knowledge exchange on networking and technology topics.",
      "Served as Executive Committee member for the 6th Carnaval IMWORK 2024."
    ],
    image: `${BASE}images/comnets_experience.png`
  }
];

const SKILLS_CATEGORIES = [
  {
    title: "UX Research & Design",
    skills: ["User Interviews", "Maze Usability Testing", "Design Thinking", "Information Architecture", "User Personas", "Wireframing", "High-Fidelity Prototyping", "Design Systems"]
  },
  {
    title: "AI-Native Workflow",
    skills: ["Antigravity AI", "Claude API", "Gemini API", "Cursor", "Google Stitch", "v0 by Vercel"]
  },
  {
    title: "Development Stack",
    skills: ["TypeScript", "React JS", "Next.js", "Vite", "Tailwind CSS", "HTML/CSS/JS", "Firebase", "SQL"]
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

const SOCIAL_LINKS = [
  { icon: Linkedin, url: "http://www.linkedin.com/in/alikhsanfaiq/", label: "LinkedIn" },
  { icon: Github, url: "https://github.com/faiqxz", label: "GitHub" },
  { icon: Mail, url: "mailto:faiqsc@gmail.com", label: "Mail" },
  { icon: Phone, url: "https://wa.me/6287899677415", label: "WhatsApp" }
];

export default function App() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedExperience, setExpandedExperience] = useState<number | null>(null);
  const [emailInput, setEmailInput] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [isHireWidgetOpen, setIsHireWidgetOpen] = useState(false);
  
  const heroRef = useRef<HTMLElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const yPhone1 = useTransform(scrollYProgress, [0, 1], [80, -120]);
  const yPhone2 = useTransform(scrollYProgress, [0, 1], [40, -60]);
  const yPhone3 = useTransform(scrollYProgress, [0, 1], [0, 10]);
  const yPhone4 = useTransform(scrollYProgress, [0, 1], [40, -60]);
  const yPhone5 = useTransform(scrollYProgress, [0, 1], [80, -120]);
  
  // Custom contact form state
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [formSent, setFormSent] = useState(false);

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

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactForm.name && contactForm.email && contactForm.message) {
      setFormSent(true);
      setTimeout(() => {
        setFormSent(false);
        setContactForm({ name: "", email: "", message: "" });
        setIsHireWidgetOpen(false);
      }, 4000);
    }
  };

  return (
    <div className="relative min-h-screen selection:bg-[#1A1A1A] selection:text-[#FAF9F6]">
      {/* Noise Layer */}
      <div className="noise-overlay" />

      {/* Background Mesh Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{
            x: [0, 80, -40, 0],
            y: [0, -100, 50, 0],
            scale: [1, 1.15, 0.9, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#3B82F6]/5 to-[#8B5CF6]/5 blur-[120px]"
        />
        <motion.div 
          animate={{
            x: [0, -60, 80, 0],
            y: [0, 80, -60, 0],
            scale: [1, 0.9, 1.1, 1]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-2/3 right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#10B981]/5 to-[#3B82F6]/5 blur-[140px]"
        />
      </div>

      {/* Floating Fluid Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl h-16 bg-[#FAF9F6]/75 backdrop-blur-xl border border-black/5 rounded-full z-40 px-6 flex justify-between items-center shadow-lg transition-all duration-500 hover:border-black/10">
        <a href="#" className="font-display text-xl font-bold tracking-tight text-[#1A1A1A]">
          FAIQ<span className="text-[#3B82F6]">.</span>
        </a>
        
        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 text-xs font-bold uppercase tracking-widest text-[#1A1A1A]/60">
          <a href="#work" className="hover:text-[#1A1A1A] transition-colors">Work</a>
          <a href="#about" className="hover:text-[#1A1A1A] transition-colors">About</a>
          <a href="#experience" className="hover:text-[#1A1A1A] transition-colors">Experience</a>
          <a href="#contact" className="hover:text-[#1A1A1A] transition-colors">Contact</a>
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden w-10 h-10 rounded-full bg-[#1A1A1A]/5 flex items-center justify-center relative focus:outline-none"
        >
          <div className="w-5 h-4 flex flex-col justify-between items-center">
            <span className={`w-5 h-[2px] bg-[#1A1A1A] rounded-full transition-transform duration-300 ${isMenuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
            <span className={`w-5 h-[2px] bg-[#1A1A1A] rounded-full transition-opacity duration-300 ${isMenuOpen ? "opacity-0" : ""}`} />
            <span className={`w-5 h-[2px] bg-[#1A1A1A] rounded-full transition-transform duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
          </div>
        </button>
      </nav>

      {/* Fullscreen Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#FAF9F6]/95 backdrop-blur-2xl z-30 flex flex-col justify-center px-8"
          >
            <div className="space-y-8 flex flex-col text-left">
              {["Work", "About", "Experience", "Contact"].map((item, idx) => (
                <motion.a
                  key={idx}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setIsMenuOpen(false)}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx, duration: 0.5 }}
                  className="font-display text-4xl font-extrabold tracking-tight text-[#1A1A1A] hover:text-[#3B82F6] transition-colors"
                >
                  {item}
                </motion.a>
              ))}
            </div>
            
            {/* Social details at bottom of mobile nav */}
            <div className="absolute bottom-12 left-8 space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/40">Let's Connect</span>
              <div className="flex gap-6">
                {SOCIAL_LINKS.map((soc, i) => (
                  <a key={i} href={soc.url} target="_blank" rel="noopener noreferrer" className="text-[#1A1A1A]/60 hover:text-[#1A1A1A]">
                    <soc.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[145dvh] pt-32 pb-24 flex flex-col justify-start items-center px-4 lg:px-8 xl:px-12 w-full max-w-[1440px] mx-auto z-10 overflow-hidden">
        {/* Centered Hero Text */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8 mb-16">
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-black/5 bg-[#FFFFFF] shadow-sm text-[10px] font-bold font-mono uppercase tracking-[0.15em] text-[#1A1A1A]/60"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#3B82F6] fill-blue-100" /> Available for opportunities
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-7xl font-extrabold font-display leading-[1.1] tracking-tighter text-[#1A1A1A] max-w-4xl"
          >
            <TrueFocus 
              sentence="UI Designer | & | product designer"
              separator=" | "
              manualMode={false}
              blurAmount={3.5}
              borderColor="#3B82F6"
              glowColor="rgba(59, 130, 246, 0.25)"
              animationDuration={0.6}
              pauseBetweenAnimations={1.5}
            />
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            className="text-base md:text-lg lg:text-xl text-[#1A1A1A]/60 max-w-2xl leading-relaxed font-light"
          >
            Hi, call me <span className="font-semibold text-[#1A1A1A]">Faiq</span>. I'm an Information Systems graduate (GPA 3.96, Cum Laude) specializing in human-centered UI/UX and AI-native design engineering.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-lg pt-2"
          >
            <form onSubmit={handleSubscribe} className="relative w-full p-1.5 bg-[#FFFFFF] border border-black/5 rounded-full double-bezel flex items-center justify-between shadow-sm focus-within:border-black/20 focus-within:shadow-md transition-all duration-300">
              <input 
                type="email" 
                placeholder="your.email@domain.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
                className="w-full pl-5 pr-3 py-2 bg-transparent text-sm text-[#1A1A1A] placeholder-black/30 outline-none"
              />
              <StarBorder
                as="button"
                type="submit"
                color="#3B82F6"
                speed="4s"
                thickness={1.5}
                className="rounded-full shrink-0 shadow-md"
                innerClassName="px-6 py-3 bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-neutral-800 transition-colors flex items-center gap-2 group cursor-pointer"
              >
                {subscribed ? (
                  <>Connected <Sparkles className="w-3.5 h-3.5" /></>
                ) : (
                  <>Connect <Send className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></>
                )}
              </StarBorder>
            </form>

            <a 
              href="https://drive.google.com/drive/folders/19sAP-y6eZ6nVmynZCHuWvek-VLisyvfa" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1A1A1A]/70 hover:text-[#1A1A1A] transition-colors border-b border-black/20 pb-0.5 shrink-0"
            >
              <Download className="w-4 h-4" /> Download Resume
            </a>
          </motion.div>
        </div>

        {/* 5-Phone Mockup Parallax Showcase */}
        <div className="relative w-full flex justify-center pt-8">
          <div className="absolute w-[800px] h-[400px] rounded-full bg-[#3B82F6]/5 blur-[120px] pointer-events-none -top-10" />

          <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 px-6 pb-12 w-full max-w-full lg:overflow-visible lg:px-0 lg:pb-0 lg:justify-center lg:items-end lg:gap-4 xl:gap-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative z-20">
            
            {/* Phone 1: Yappy (EdTech Conversational Speech) */}
            <motion.div 
              style={{
                y: isDesktop ? yPhone1 : 0,
                rotate: isDesktop ? -6 : 0,
                scale: isDesktop ? 0.85 : 0.95
              }}
              transition={{ type: "spring", stiffness: 80, damping: 20 }}
              className="snap-center shrink-0 w-[250px] md:w-[270px] lg:w-[240px] origin-bottom"
            >
              <img 
                src={`${BASE}images/Yappy Mockup.png`}
                alt="Yappy Mockup" 
                className="w-full h-auto object-contain filter drop-shadow-[0_20px_25px_rgba(0,0,0,0.12)]" 
              />
            </motion.div>

            {/* Phone 2: Neurofit (Workout Logger & Muscular Stats) */}
            <motion.div 
              style={{
                y: isDesktop ? yPhone2 : 0,
                rotate: isDesktop ? -3 : 0,
                scale: isDesktop ? 0.92 : 0.95
              }}
              transition={{ type: "spring", stiffness: 80, damping: 20 }}
              className="snap-center shrink-0 w-[250px] md:w-[270px] lg:w-[240px] origin-bottom"
            >
              <img 
                src={`${BASE}images/Neurofit Mockup.png`}
                alt="Neurofit Mockup" 
                className="w-full h-auto object-contain filter drop-shadow-[0_20px_25px_rgba(0,0,0,0.12)]" 
              />
            </motion.div>

            {/* Phone 3: Travelin Mockup */}
            <motion.div 
              style={{
                y: isDesktop ? yPhone3 : 0,
                rotate: 0,
                scale: isDesktop ? 1.0 : 0.95
              }}
              transition={{ type: "spring", stiffness: 80, damping: 20 }}
              className="snap-center shrink-0 w-[250px] md:w-[270px] lg:w-[245px] origin-bottom z-30"
            >
              <img 
                src={`${BASE}images/Travelin Mockup.png`}
                alt="Travelin Mockup" 
                className="w-full h-auto object-contain filter drop-shadow-[0_20px_25px_rgba(0,0,0,0.12)]" 
              />
            </motion.div>

            {/* Phone 4: PrimaPlus (Health Directory Appointment Scheduler) */}
            <motion.div 
              style={{
                y: isDesktop ? yPhone4 : 0,
                rotate: isDesktop ? 3 : 0,
                scale: isDesktop ? 0.92 : 0.95
              }}
              transition={{ type: "spring", stiffness: 80, damping: 20 }}
              className="snap-center shrink-0 w-[250px] md:w-[270px] lg:w-[240px] origin-bottom"
            >
              <img 
                src={`${BASE}images/PrimaPLus Mockup.png`}
                alt="PrimaPlus Mockup" 
                className="w-full h-auto object-contain filter drop-shadow-[0_20px_25px_rgba(0,0,0,0.12)]" 
              />
            </motion.div>

            {/* Phone 5: FitMart (Supplement Checkout Interface) */}
            <motion.div 
              style={{
                y: isDesktop ? yPhone5 : 0,
                rotate: isDesktop ? 6 : 0,
                scale: isDesktop ? 0.85 : 0.95
              }}
              transition={{ type: "spring", stiffness: 80, damping: 20 }}
              className="snap-center shrink-0 w-[250px] md:w-[270px] lg:w-[240px] origin-bottom"
            >
              <img 
                src={`${BASE}images/Fitmart Mockup.png`}
                alt="FitMart Mockup" 
                className="w-full h-auto object-contain filter drop-shadow-[0_20px_25px_rgba(0,0,0,0.12)]" 
              />
            </motion.div>

          </div>
        </div>
      </section>

      {/* Selected Work (Case Studies) — full-bleed wrapper for edge-to-edge DotGrid */}
      <div id="work" className="relative w-full overflow-hidden">

        {/* DotGrid: sticky viewport-height canvas — only renders ~1800 dots vs ~24k for full section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.04 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="pointer-events-none"
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            zIndex: 0,
            marginBottom: '-100vh',
            /* fade at top and bottom so it dissolves cleanly at section boundaries */
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
          }}
        >
          <DotGrid
            dotSize={3}
            gap={30}
            baseColor="#D1D5DB"
            activeColor="#3B82F6"
            proximity={130}
            shockRadius={220}
            shockStrength={5}
            returnDuration={1.5}
          />
        </motion.div>

        {/* Actual content: constrained to max-w-7xl */}
        <section className="relative z-10 py-32 px-4 lg:px-24 max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-24 gap-6 text-left"
          >
            <div className="max-w-2xl space-y-4">
              <span className="text-[10px] font-bold font-mono uppercase tracking-[0.2em] text-[#1A1A1A]/40 block">Portfolio Showcase</span>
              <h2 className="text-4xl lg:text-6xl font-extrabold font-display tracking-tight text-[#1A1A1A] leading-[1.05]">
                Validated Digital Solutions.
              </h2>
            </div>
            <p className="text-[#1A1A1A]/60 max-w-xs text-sm leading-relaxed font-light">
              Each project undergoes thorough user testing and quantitative validation (Maze) to ensure absolute design usability.
            </p>
          </motion.div>

          {/* PROJECTS STACK - Alternating Layouts inspired by Behance */}
          <div className="space-y-40">
            {PROJECTS.map((project, index) => {
              const isEven = index % 2 === 0;
              return (
                <div 
                  key={index}
                  className="grid lg:grid-cols-12 gap-16 items-center text-left"
                >
                  {/* Project Details */}
                  <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`lg:col-span-6 space-y-6 ${!isEven ? "lg:order-2" : ""}`}
                  >
                    {/* Oversized Numbering */}
                    <div className="font-display text-6xl font-extrabold text-[#1A1A1A]/10 select-none">
                      0{index + 1}
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, i) => (
                        <span key={i} className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-black/5 text-black/60">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-3xl lg:text-4xl font-extrabold font-display tracking-tight">{project.title}</h3>
                    <p className="text-[#1A1A1A]/60 text-sm leading-relaxed font-light">
                      {project.description}
                    </p>

                    <div className="pt-2 flex flex-wrap gap-4">
                      <StarBorder
                        as="button"
                        onClick={() => setSelectedProject(project.title)}
                        color="#3B82F6"
                        speed="5s"
                        thickness={1.5}
                        className="rounded-full shadow-md"
                        innerClassName="px-6 py-3 bg-[#1A1A1A] text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-2 group cursor-pointer transition-colors"
                      >
                        Read Case Study 
                        <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                          <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                        </div>
                      </StarBorder>
                      <a 
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 border border-black/10 hover:bg-black/5 text-xs font-bold uppercase tracking-wider rounded-full transition-colors"
                      >
                        Slides Presentation ↗
                      </a>
                    </div>
                  </motion.div>

                  {/* Project Screen Showcase (Direct Phone Mockup) */}
                  <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className={`lg:col-span-6 flex justify-center ${!isEven ? "lg:order-1" : ""}`}
                  >
                    <motion.div 
                      whileHover={{ scale: 1.025, y: -8 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="w-full max-w-[310px] select-none pointer-events-auto"
                    >
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        className="w-full h-auto object-contain filter drop-shadow-[0_20px_25px_rgba(0,0,0,0.12)] hover:drop-shadow-[0_30px_35px_rgba(0,0,0,0.18)] transition-all duration-300"
                      />
                    </motion.div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Bento Grid (About Me) */}
      <section id="about" className="py-32 bg-black/[0.02] border-y border-black/5 px-4 lg:px-24 relative z-10">
        <div className="max-w-7xl mx-auto space-y-16">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-left space-y-4 max-w-2xl"
          >
            <span className="text-[10px] font-bold font-mono uppercase tracking-[0.2em] text-[#1A1A1A]/40 block">Background & Details</span>
            <h2 className="text-4xl lg:text-6xl font-extrabold font-display tracking-tight text-[#1A1A1A]">
              Academic & Professional Core.
            </h2>
            <p className="text-sm text-[#1A1A1A]/60 font-light max-w-xl">
              Fusing traditional Information Systems architecture with modern AI-native digital design methodologies.
            </p>
          </motion.div>

            {/* Asymmetrical Bento Grid with MagicBento Spotlight & Effects */}
            <MagicBento>
              
              {/* Bento Card 1: Academic Excellence (Size: col-span-7) */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="md:col-span-7"
              >
                <MagicBentoCard
                  enableStars={true}
                  particleCount={6}
                  enableTilt={true}
                  enableMagnetism={true}
                  className="p-8 rounded-[2rem] bg-white border border-black/5 double-bezel text-left flex flex-col justify-between h-[300px] transition-all duration-300"
                >
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/5 text-emerald-600 flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 stroke-[1.5]" />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-500/10">
                      GPA 3.96 / 4.00
                    </span>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-black/40 block">Education</span>
                    <h3 className="text-2xl font-bold font-display tracking-tight text-[#1A1A1A]">Universitas Sriwijaya</h3>
                    <p className="text-sm text-black/50 leading-relaxed font-light">
                      S1 Information Systems (Cum Laude). Graduated in 3.5 years. Deep studies in Human-Computer Interaction (HCI), Software Engineering, and Database Systems.
                    </p>
                  </div>
                </MagicBentoCard>
              </motion.div>

              {/* Bento Card 2: Publications (Size: col-span-5) */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="md:col-span-5"
              >
                <MagicBentoCard
                  enableStars={true}
                  particleCount={6}
                  enableTilt={true}
                  enableMagnetism={true}
                  className="p-8 rounded-[2rem] bg-white border border-black/5 double-bezel text-left flex flex-col justify-between h-[300px] transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/5 text-blue-600 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-black/40 block">Scientific Publications</span>
                    <div className="space-y-3">
                      {PUBLICATIONS.map((pub, idx) => (
                        <a 
                          key={idx}
                          href={pub.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block group"
                        >
                          <h4 className="text-xs font-bold leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                            {pub.title} ↗
                          </h4>
                          <span className="text-[9px] text-black/40 mt-1 block">{pub.journal} · {pub.date}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </MagicBentoCard>
              </motion.div>

              {/* Bento Card 3: Skills Architecture (Size: col-span-8) */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="md:col-span-8"
              >
                <MagicBentoCard
                  enableStars={true}
                  particleCount={8}
                  enableTilt={true}
                  enableMagnetism={true}
                  className="p-8 rounded-[2rem] bg-white border border-black/5 double-bezel text-left flex flex-col justify-between min-h-[350px] transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/5 text-indigo-600 flex items-center justify-center">
                    <Layers className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  
                  <div className="space-y-6 my-6">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-black/40 block">Technical Architecture</span>
                    <div className="grid md:grid-cols-3 gap-6">
                      {SKILLS_CATEGORIES.map((cat, idx) => (
                        <div key={idx} className="space-y-3">
                          <h4 className="text-[11px] font-bold uppercase tracking-wider text-black/60 border-b border-black/5 pb-1.5">{cat.title}</h4>
                          <div className="flex flex-wrap gap-1">
                            {cat.skills.map((sk, i) => (
                              <span key={i} className="text-[9px] px-2 py-0.5 rounded-md bg-black/[0.03] text-black/70 font-semibold hover:bg-blue-500/5 hover:text-blue-600 transition-colors duration-200">{sk}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-[10px] text-black/40 font-mono">
                    Leveraging v0, Antigravity AI, and Claude API for accelerated design-to-code pipelines.
                  </div>
                </MagicBentoCard>
              </motion.div>

              {/* Bento Card 4: Accomplishments (Size: col-span-4) */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="md:col-span-4"
              >
                <MagicBentoCard
                  enableStars={true}
                  particleCount={6}
                  enableTilt={true}
                  enableMagnetism={true}
                  className="p-8 rounded-[2rem] bg-white border border-black/5 double-bezel text-left flex flex-col justify-between min-h-[350px] transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/5 text-amber-600 flex items-center justify-center">
                    <Award className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <div className="space-y-6 my-6">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-black/40 block">Credentials & Awards</span>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <span className="text-amber-500 text-xs mt-0.5">🏆</span>
                        <div>
                          <h4 className="text-xs font-bold leading-tight">3rd Place National UI/UX Design</h4>
                          <span className="text-[9px] text-black/40 block">SI FEST Sriwijaya University 2024</span>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-indigo-500 text-xs mt-0.5">🌟</span>
                        <div>
                          <h4 className="text-xs font-bold leading-tight">Web Code Design Finalist</h4>
                          <span className="text-[9px] text-black/40 block">IFFEST Sriwijaya University 2024</span>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-emerald-500 text-xs mt-0.5">🌍</span>
                        <div>
                          <h4 className="text-xs font-bold leading-tight">EF SET C2 Proficient & IELTS 6.5</h4>
                          <span className="text-[9px] text-black/40 block">Demonstrated native English proficiency</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="text-[10px] text-black/40 font-mono">
                    MikroTik Certified Network Associate (MTCNA)
                  </div>
                </MagicBentoCard>
              </motion.div>

            </MagicBento>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-32 px-4 lg:px-24 max-w-5xl mx-auto z-10 relative">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-20 gap-6 text-left"
        >
          <div className="max-w-xl space-y-4">
            <span className="text-[10px] font-bold font-mono uppercase tracking-[0.2em] text-[#1A1A1A]/40 block">Career Milestones</span>
            <h2 className="text-4xl lg:text-5xl font-extrabold font-display tracking-tight text-[#1A1A1A]">
              Selected Experiences.
            </h2>
          </div>
          <p className="text-[#1A1A1A]/60 max-w-xs text-sm leading-relaxed font-light">
            Bringing professional rigor and interface optimization to corporate and public engineering roles.
          </p>
        </motion.div>

        {/* Accordion Timeline */}
        <div className="space-y-6">
          {EXPERIENCE.map((exp, idx) => {
            const isExpanded = expandedExperience === idx;
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="rounded-[1.75rem] bg-[#FFFFFF] border border-black/5 double-bezel overflow-hidden transition-all duration-500 hover:border-black/10"
              >
                <button
                  onClick={() => setExpandedExperience(isExpanded ? null : idx)}
                  className="w-full p-6 md:p-8 flex justify-between items-center text-left focus:outline-none"
                >
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-black/40">{exp.period}</span>
                    <h3 className="text-lg md:text-xl font-bold tracking-tight">{exp.role}</h3>
                    <p className="text-xs font-semibold text-black/60">
                      {exp.link ? (
                        <a href={exp.link} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 hover:underline transition-colors flex items-center gap-1 w-fit">
                          {exp.company} <ArrowUpRight className="w-3 h-3" />
                        </a>
                      ) : (
                        exp.company
                      )}
                    </p>
                  </div>
                  
                  <motion.div 
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center"
                  >
                    <ChevronDown className="w-4 h-4 text-[#1A1A1A]/60" />
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
                      <div className="p-8 pt-0 border-t border-black/5 bg-[#FAF9F6]/30 text-left space-y-4">
                        <p className="text-sm text-black/70 leading-relaxed font-light">
                          {exp.description}
                        </p>
                        
                        <div className="p-4 rounded-2xl bg-emerald-500/5 text-emerald-700 text-xs font-semibold border border-emerald-500/10 flex items-start gap-2">
                          <span className="text-base leading-none">⚡</span>
                          <div>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 block mb-0.5">Key Performance Indicator</span>
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
      </section>

      {/* Organizational Experience Section (Full-Bleed, Pop.site Style) */}
      <section id="organizations" className="py-32 w-full z-10 relative border-t border-black/5 bg-[#FAF9F6]">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto px-4 lg:px-24 flex flex-col lg:flex-row justify-between items-start lg:items-end mb-20 gap-6 text-left"
        >
          <div className="max-w-xl space-y-4">
            <span className="text-[10px] font-bold font-mono uppercase tracking-[0.2em] text-[#1A1A1A]/40 block">College Life & Leadership</span>
            <h2 className="text-4xl lg:text-5xl font-extrabold font-display tracking-tight text-[#1A1A1A]">
              Organizational Experience.
            </h2>
          </div>
          <p className="text-[#1A1A1A]/60 max-w-xs text-sm leading-relaxed font-light">
            Showcasing leadership, collaboration, and community initiatives executed throughout campus life.
          </p>
        </motion.div>

        {/* Full-Bleed alternating stack */}
        <div className="w-full">
          {ORGANIZATIONS.map((org, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div 
                key={idx}
                className={`w-full flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} border-b border-black/5 relative group overflow-hidden`}
              >
                {/* Image side (Full-bleed) */}
                <div className="w-full lg:w-1/2 min-h-[350px] lg:min-h-[550px] relative overflow-hidden bg-neutral-950">
                  <img 
                    src={org.image} 
                    alt={org.organization} 
                    className="absolute inset-0 w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 ease-out scale-100 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent lg:hidden" />
                </div>

                {/* Content side (Full-bleed Solid Block) */}
                <div className="w-full lg:w-1/2 bg-[#0A0A0B] text-white p-8 md:p-16 lg:p-24 flex flex-col justify-between text-left relative z-10">
                  <div>
                    {/* Badge pill */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/80 border border-white/5 text-[9px] font-bold tracking-widest uppercase mb-8">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      {org.organization}
                    </div>

                    {/* Tagline */}
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold font-display tracking-tight text-white mb-8 leading-tight font-display">
                      "{org.tagline}"
                    </h3>

                    {/* Bullet Achievements */}
                    <ul className="space-y-4">
                      {org.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-3 text-sm md:text-base text-white/70 font-light">
                          <span className="text-blue-400 mt-1.5 text-xs">●</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Member Role & Dates widget */}
                  <div className="pt-8 mt-12 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-bold text-white leading-tight">{org.role}</h4>
                      <p className="text-xs text-white/50 mt-1 font-mono">{org.period}</p>
                    </div>
                    <span className="text-[10px] text-blue-400 font-mono tracking-widest uppercase font-bold bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/20">
                      Active Member
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Floating Availability widget inspired by Behance */}
        <motion.div 
          className="fixed bottom-6 right-6 z-40 animate-none"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <StarBorder
            as="a"
            href="https://wa.me/6287899677415"
            target="_blank"
            rel="noopener noreferrer"
            color="#10B981"
            speed="3.5s"
            thickness={1.5}
            className="rounded-full shadow-2xl"
            innerClassName="px-5 py-3 bg-[#1A1A1A] hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-3.5 rounded-full cursor-pointer"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Available for Hire
          </StarBorder>
        </motion.div>

      {/* Available for Hire Popup Modal Dialog */}
      <AnimatePresence>
        {isHireWidgetOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsHireWidgetOpen(false)}
              className="absolute inset-0 bg-black/45 backdrop-blur-sm cursor-pointer"
            />
            
            {/* Quick Form Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative w-full max-w-md p-8 rounded-[2.5rem] bg-[#FAF9F6] text-[#1A1A1A] border border-black/5 double-bezel shadow-2xl z-10 text-left"
            >
              <button 
                onClick={() => setIsHireWidgetOpen(false)}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-black/5 flex items-center justify-center hover:bg-black/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold font-display tracking-tight flex items-center gap-2">
                    Start a Project <Sparkles className="w-5 h-5 text-amber-500 fill-amber-100" />
                  </h3>
                  <p className="text-xs text-black/50 leading-relaxed mt-1 font-light">
                    Direct inquiries for UI/UX contracts, corporate roles, or freelance project requirements.
                  </p>
                </div>

                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-black/40">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. John Doe"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-black/5 double-bezel text-sm focus:outline-none focus:border-black/20"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-black/40">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="e.g. john@domain.com"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-black/5 double-bezel text-sm focus:outline-none focus:border-black/20"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-black/40">Your Inquiry</label>
                    <textarea 
                      rows={3}
                      placeholder="Brief description of project goals or role description..."
                      required
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-black/5 double-bezel text-sm focus:outline-none focus:border-black/20 resize-none"
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-[#1A1A1A] hover:bg-neutral-800 text-white py-4 rounded-2xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md mt-2 flex items-center justify-center gap-2"
                  >
                    {formSent ? (
                      <>Message Sent Successfully! ✓</>
                    ) : (
                      <>Send Inquiry <Send className="w-3.5 h-3.5" /></>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer Contact */}
      <footer id="contact" className="bg-[#1A1A1A] text-[#FAF9F6] py-32 rounded-t-[3.5rem] relative z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 text-center space-y-20">
          <div className="space-y-6">
            <span className="text-[10px] font-bold font-mono uppercase tracking-[0.2.em] text-white/40 block">Connect & Collaborate</span>
            <h2 className="text-4xl lg:text-7xl font-extrabold font-display tracking-tighter leading-[1.05]">
              Let's create something functional.
            </h2>
            <p className="text-sm text-white/50 max-w-md mx-auto leading-relaxed font-light">
              Always open to discussing design systems, advanced prototypes, research audits, or digital product directions.
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-16 border-t border-white/10 gap-8 text-left w-full">
            <div className="space-y-3">
              <p className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-white/40">Quick Contact</p>
              <p className="text-base font-bold text-white hover:text-blue-400 transition-colors">
                <a href="mailto:faiqsc@gmail.com">faiqsc@gmail.com</a>
              </p>
              <p className="text-xs text-white/50">Palembang, South Sumatra, Indonesia</p>
            </div>
            
            <div className="space-y-3 text-right md:text-right">
              <p className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-white/40">Visual Networks</p>
              <div className="flex gap-4">
                {SOCIAL_LINKS.map((soc, idx) => (
                  <a 
                    key={idx} 
                    href={soc.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center transition-colors"
                  >
                    <soc.icon className="w-4.5 h-4.5 text-white" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-white/30 font-mono gap-4">
            <span>© {new Date().getFullYear()} Al Ikhsan Faiq. All rights reserved.</span>
            <span>Created with Antigravity AI + React & Tailwind v4</span>
          </div>
        </div>
      </footer>

      {/* Case Study Detail Modal Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <CaseStudyModal 
            projectTitle={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
