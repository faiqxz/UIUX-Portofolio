import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

interface PhoneMockupProps {
  children: React.ReactNode;
  className?: string;
  screenClassName?: string;
  isDarkTheme?: boolean;
  animateHover?: boolean;
}

export default function PhoneMockup({
  children,
  className = "",
  screenClassName = "",
  isDarkTheme = false,
  animateHover = true
}: PhoneMockupProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Mouse position motion values for interactive tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for tilt physics
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), {
    damping: 25,
    stiffness: 200
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), {
    damping: 25,
    stiffness: 200
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!animateHover || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: animateHover ? rotateX : 0,
        rotateY: animateHover ? rotateY : 0,
        transformStyle: "preserve-3d",
        perspective: 1000
      }}
      whileHover={animateHover ? { scale: 1.025, y: -8 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`relative aspect-[9/19.5] w-full max-w-[320px] rounded-[3.25rem] p-3 select-none ${
        isDarkTheme 
          ? "bg-[#1E1E1E] text-white double-bezel-dark" 
          : "bg-[#FFFFFF] text-[#1A1A1A] double-bezel"
      } ${className}`}
    >
      {/* Outer Rim Highlight (Machined Aluminum effect) */}
      <div 
        className={`absolute inset-0.5 rounded-[3.15rem] border ${
          isDarkTheme ? "border-white/10" : "border-black/5"
        } pointer-events-none`} 
      />

      {/* Side Buttons */}
      {/* Volume Up */}
      <div className={`absolute top-28 -left-1 w-[3px] h-12 rounded-r-md ${isDarkTheme ? "bg-white/20" : "bg-black/10"}`} />
      {/* Volume Down */}
      <div className={`absolute top-44 -left-1 w-[3px] h-12 rounded-r-md ${isDarkTheme ? "bg-white/20" : "bg-black/10"}`} />
      {/* Power Button */}
      <div className={`absolute top-36 -right-1 w-[3px] h-16 rounded-l-md ${isDarkTheme ? "bg-white/20" : "bg-black/10"}`} />

      {/* Screen Enclosure */}
      <div 
        className={`relative w-full h-full rounded-[2.6rem] overflow-hidden flex flex-col ${
          isDarkTheme ? "bg-[#121212]" : "bg-[#F8F9FA]"
        } ${screenClassName}`}
        style={{ transform: "translateZ(20px)" }}
      >
        {/* Dynamic Island / Camera & Speaker cutout */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-40 flex items-center justify-between px-3.5">
          {/* Camera lens indicator */}
          <div className="w-2.5 h-2.5 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-[#0d2a4a]" />
          </div>
          {/* Proximity sensor / secondary cutout */}
          <div className="w-3.5 h-1.5 rounded-full bg-[#121212] ml-auto" />
        </div>

        {/* Status Bar */}
        <div className="h-12 w-full flex justify-between items-end px-6 pb-1 text-[10px] font-bold font-sans tracking-tight z-30 select-none opacity-60">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            {/* Signal */}
            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
              <rect x="2" y="16" width="3" height="5" rx="0.5" />
              <rect x="7" y="12" width="3" height="9" rx="0.5" />
              <rect x="12" y="8" width="3" height="13" rx="0.5" />
              <rect x="17" y="3" width="3" height="18" rx="0.5" />
            </svg>
            {/* Battery */}
            <div className="w-5 h-2.5 rounded-[3px] border border-current p-[1px] flex items-center">
              <div className="w-full h-full bg-current rounded-[1px]" />
            </div>
          </div>
        </div>

        {/* Screen Content Wrapper */}
        <div className="flex-1 w-full overflow-y-auto no-scrollbar relative flex flex-col">
          {children}
        </div>

        {/* Home Indicator Bar */}
        <div className="h-6 w-full flex items-center justify-center z-30 select-none pointer-events-none">
          <div className={`w-32 h-1 rounded-full ${isDarkTheme ? "bg-white/30" : "bg-black/20"}`} />
        </div>
      </div>

      {/* Screen Glare reflection overlay */}
      <div 
        className="absolute inset-3 rounded-[2.6rem] bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none z-30" 
        style={{ transform: "translateZ(21px)" }}
      />
    </motion.div>
  );
}
