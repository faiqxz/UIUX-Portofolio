/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform } from "motion/react";
import { 
  ArrowUpRight, 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink,
  ChevronRight,
  Code2,
  Phone,
  Layout,
  Smartphone,
  Globe
} from "lucide-react";
import { useRef } from "react";

const PROJECTS = [
  {
    title: "Yappy",
    category: "Language Learning Application",
    description: "3rd Place winner at UIUX Competition. A language learning app integrating interactive materials and chatbot interaction.",
    tags: ["Award Winning", "EdTech", "User Journey"],
    image: "/images/yappy.jpg",
    link: "https://bit.ly/YappyPPT"
  },
  {
    title: "Neurofit",
    category: "Fitness Mobile Application",
    description: "Structured workout guidance app with end-to-end UI/UX, from problem definition to prototype validation.",
    tags: ["UX Research", "Prototyping", "Design System"],
    image: "/images/neurofit.jpg",
    link: "https://bit.ly/NeurofitPPT"
  },
  {
    title: "PrimaPlus",
    category: "Health Consultant Application",
    description: "Digital health consultation app connecting users with health guidance services, structuring information architecture for accessibility.",
    tags: ["Information Architecture", "HealthTech", "Figma"],
    image: "/images/primaplus.jpg",
    link: "https://bit.ly/PrimaPLus"
  },
  {
    title: "FitMart",
    category: "E-Commerce & Workout App",
    description: "An integrated e-commerce and workout mobile app prototype supporting product browsing and personalized fitness guidance.",
    tags: ["UI/UX Design", "Mobile App", "Figma"],
    image: "/images/fitmart.jpg",
    link: "https://bit.ly/Prototype-FitMart"
  }
];

const EXPERIENCE = [
  {
    role: "Community Service - Website Design Training",
    company: "Universitas Sriwijaya",
    period: "Aug 2025 - Oct 2025",
    description: "Led instructional sessions on website design concepts and AI-supported learning media development."
  },
  {
    role: "Lab Assistant",
    company: "Computer Networking Lab",
    period: "Aug 2024 - Mar 2025",
    description: "Delivered instruction on fundamental networking concepts and supervised hands-on LAN wiring."
  },
  {
    role: "UI/UX Intern",
    company: "PT Bukit Asam Tbk Persero",
    period: "Jun 2024 - Jul 2024",
    description: "Designed UI/UX interfaces for the CISEA sub-application and LB3 Waste Management System."
  }
];

const SKILLS = [
  "UI Design", "UX Design", "UX Research", "Wireframing", "Prototyping", 
  "Usability Testing", "Information Architecture", "Design Thinking", 
  "Mobile UX", "Design Systems", "Figma", "React JS", "Tailwind CSS"
];

const SOCIAL_LINKS = [
  { icon: Linkedin, url: "http://www.linkedin.com/in/alikhsanfaiq/", label: "LinkedIn" },
  { icon: Github, url: "https://github.com/faiqxz", label: "GitHub" },
  { icon: Mail, url: "mailto:faiqsc@gmail.com", label: "Mail" },
  { icon: Phone, url: "https://wa.me/6287899677415", label: "WhatsApp" }
];

export default function App() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#1A1A1A] text-[#F9F9F9] font-sans selection:bg-[#F9F9F9] selection:text-[#1A1A1A]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 mix-blend-difference px-6 py-8 flex justify-between items-center text-white">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xl font-bold tracking-tighter"
        >
          FAIQ.
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex gap-8 text-sm font-medium uppercase tracking-widest"
        >
          <a href="#work" className="hover:opacity-50 transition-opacity">Work</a>
          <a href="#about" className="hover:opacity-50 transition-opacity">About</a>
          <a href="#contact" className="hover:opacity-50 transition-opacity">Contact</a>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col justify-center px-6 lg:px-24 overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-block px-3 py-1 rounded-full border border-[#F9F9F9]/10 text-xs font-semibold uppercase tracking-wider mb-6">
              Available for new projects
            </span>
            <h1 className="text-6xl lg:text-8xl font-bold leading-[0.9] tracking-tighter mb-8">
              UI Designer <span className="text-[#F9F9F9]/40">&</span> Frontend Developer.
            </h1>
            <p className="text-xl lg:text-2xl text-[#F9F9F9]/60 max-w-xl leading-relaxed mb-10">
              I'm Al Ikhsan Faiq, a fresh graduate specializing in creating beautiful, functional, and user-centered digital experiences.
            </p>
            <div className="flex flex-wrap gap-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#F9F9F9] text-[#1A1A1A] px-8 py-4 rounded-full font-medium flex items-center gap-2 group"
              >
                Hire Me <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border border-[#F9F9F9]/20 px-8 py-4 rounded-full font-medium hover:bg-[#F9F9F9]/5 transition-colors"
              >
                Download CV
              </motion.button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative aspect-[4/5] bg-[#2A2A2A] rounded-3xl overflow-hidden group max-w-sm lg:max-w-md mx-auto lg:ml-auto shadow-2xl"
          >
            <img 
              src="/images/faiq.jpg" 
              alt="Al Ikhsan Faiq" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-8 left-8 flex gap-3">
              {SOCIAL_LINKS.slice(0, 3).map((social, i) => (
                <motion.a
                  key={i}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -5 }}
                  className="w-12 h-12 bg-[#1A1A1A] text-white rounded-full flex items-center justify-center shadow-lg"
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Marquee */}
      <div className="bg-[#F9F9F9] py-8 overflow-hidden">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap gap-12 text-[#1A1A1A]/40 text-sm font-bold uppercase tracking-[0.3em]"
        >
          {Array(10).fill(0).map((_, i) => (
            <div key={i} className="flex items-center gap-12">
              <span>Mobile Design</span>
              <span className="w-2 h-2 bg-[#1A1A1A]/20 rounded-full" />
              <span>Website Design</span>
              <span className="w-2 h-2 bg-[#1A1A1A]/20 rounded-full" />
              <span>SaaS Design</span>
              <span className="w-2 h-2 bg-[#1A1A1A]/20 rounded-full" />
              <span>Landing Page</span>
              <span className="w-2 h-2 bg-[#1A1A1A]/20 rounded-full" />
              <span>Motion Graphic</span>
              <span className="w-2 h-2 bg-[#1A1A1A]/20 rounded-full" />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Work Section */}
      <section id="work" className="py-32 px-6 lg:px-24">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-6">
          <div className="max-w-2xl">
            <span className="text-sm font-bold uppercase tracking-widest text-[#F9F9F9]/40 mb-4 block">Selected Work</span>
            <h2 className="text-5xl lg:text-7xl font-bold tracking-tighter">Crafting digital solutions with purpose.</h2>
          </div>
          <p className="text-[#F9F9F9]/60 max-w-xs text-sm leading-relaxed">
            A collection of projects where I've applied user-centered design principles to solve complex problems.
          </p>
        </div>

        <div className="grid gap-24">
          {PROJECTS.map((project, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="group grid lg:grid-cols-2 gap-12 items-center"
            >
              <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                <div className="flex gap-4 mb-6">
                  {project.tags.map((tag, i) => (
                    <span key={i} className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-[#F9F9F9]/5">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-4xl font-bold mb-4 tracking-tight">{project.title}</h3>
                <p className="text-[#F9F9F9]/60 text-lg mb-8 leading-relaxed">
                  {project.description}
                </p>
                <motion.a 
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ x: 10 }}
                  className="inline-flex items-center gap-2 font-bold uppercase text-xs tracking-widest group"
                >
                  View Case Study <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </motion.a>
              </div>
              <div className={`relative aspect-video rounded-3xl overflow-hidden bg-[#2A2A2A] ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 bg-[#0A0A0A] px-6 lg:px-24">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <motion.a 
                href={SOCIAL_LINKS[0].url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 0.95, rotate: -2 }}
                className="aspect-[3/4] rounded-2xl overflow-hidden bg-[#1A1A1A] block cursor-pointer"
              >
                <img src="https://media.licdn.com/dms/image/v2/D562DAQFscuoJ2r0pAg/profile-treasury-image-shrink_800_800/profile-treasury-image-shrink_800_800/0/1721807151145?e=1776261600&v=beta&t=unDuNlFxROfxWdIH-RK1GOzSATXFbUGz2uXJc_6UxYY" alt="About" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </motion.a>
              <motion.a 
                href={SOCIAL_LINKS[0].url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 0.95, rotate: 2 }}
                className="aspect-[3/4] rounded-2xl overflow-hidden bg-[#1A1A1A] mt-12 block cursor-pointer"
              >
                <img src="https://media.licdn.com/dms/image/v2/D5622AQHQfAMzDuCw5Q/feedshare-shrink_2048_1536/feedshare-shrink_2048_1536/0/1729440196592?e=1777507200&v=beta&t=6bQqlNHr6FxCHymk3Frxmtga39MemCqzbGwUda45la4" alt="About" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </motion.a>
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#F9F9F9] rounded-full flex items-center justify-center text-[#1A1A1A] text-[10px] font-bold uppercase tracking-widest text-center p-4 animate-spin-slow">
              UI/UX Designer • Frontend Dev • 
            </div>
          </div>
          <div>
            <span className="text-sm font-bold uppercase tracking-widest text-[#F9F9F9]/40 mb-4 block">About Me</span>
            <h2 className="text-5xl font-bold tracking-tighter mb-8">Let's get to know me.</h2>
            <p className="text-lg text-[#F9F9F9]/60 leading-relaxed mb-8">
              Call me Faiq. I'm a UI/UX Designer from Indonesia, precisely in Palembang. My main tools are Figma and React JS for bringing designs to life.
            </p>
            <p className="text-lg text-[#F9F9F9]/60 leading-relaxed mb-12">
              I have a background in Information Systems, which gives me a unique perspective on the intersection of technology and human-centered design. I believe in creating solutions that are not just pretty, but truly functional.
            </p>
            
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold uppercase text-[10px] tracking-widest text-[#F9F9F9]/40 mb-4">My Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {SKILLS.slice(0, 6).map((skill, i) => (
                    <span key={i} className="text-xs font-medium">{skill}</span>
                  ))}
                  <span className="text-xs font-medium text-[#F9F9F9]/40">and more...</span>
                </div>
              </div>
              <div>
                <h4 className="font-bold uppercase text-[10px] tracking-widest text-[#F9F9F9]/40 mb-4">Education</h4>
                <p className="text-xs font-bold">Universitas Sriwijaya</p>
                <p className="text-[10px] text-[#F9F9F9]/60">Information Systems (GPA 3.96)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-32 px-6 lg:px-24">
        <div className="grid lg:grid-cols-2 gap-24">
          <div>
            <span className="text-sm font-bold uppercase tracking-widest text-[#F9F9F9]/40 mb-4 block">Experience</span>
            <h2 className="text-5xl font-bold tracking-tighter mb-8 leading-tight">
              Experienced in presenting solutions in the form of Beautiful, Pretty and Functional Designs.
            </h2>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border border-[#F9F9F9]/20 px-8 py-4 rounded-full font-medium hover:bg-[#F9F9F9]/5 transition-colors"
            >
              Download My Resume
            </motion.button>
          </div>
          <div className="space-y-12">
            {EXPERIENCE.map((exp, i) => (
              <div key={i} className="group">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold group-hover:text-[#F9F9F9]/60 transition-colors">{exp.role}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#F9F9F9]/40">{exp.period}</span>
                </div>
                <p className="text-sm font-medium text-[#F9F9F9]/60 mb-4">{exp.company}</p>
                <p className="text-sm text-[#F9F9F9]/40 leading-relaxed max-w-md">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-[#F9F9F9] text-[#1A1A1A] py-32 px-6 lg:px-24 rounded-t-[3rem]">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-5xl lg:text-8xl font-bold tracking-tighter mb-12">
            Let me know if you have project questions or opportunities to collaborate 👋
          </h2>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#1A1A1A] text-white px-12 py-6 rounded-full text-xl font-bold mb-20"
          >
            Get in Touch
          </motion.button>
          
          <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-[#1A1A1A]/10 gap-8">
            <div className="text-left">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#1A1A1A]/40 mb-4">Follow Me</p>
              <div className="flex gap-6">
                {SOCIAL_LINKS.map((social, i) => (
                  <a key={i} href={social.url} target="_blank" rel="noopener noreferrer" className="hover:text-[#1A1A1A]/60 transition-colors">
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#1A1A1A]/40">
              © izinnnnn design by Al Ikhsan Faiq
            </p>
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}} />
    </div>
  );
}
