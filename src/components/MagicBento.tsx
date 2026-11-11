import React, { useRef, useEffect, useCallback, useState } from 'react';
import { gsap } from 'gsap';
import './MagicBento.css';

const DEFAULT_PARTICLE_COUNT = 8;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = '59, 130, 246'; // Custom color: blue (3B82F6 is RGB 59, 130, 246)

const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

/** Hover effects only make sense with a real mouse/trackpad; touch taps would leave them stuck "on". */
const useFinePointer = () => {
  const [fine, setFine] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(FINE_POINTER_QUERY).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(FINE_POINTER_QUERY);
    const onChange = () => setFine(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return fine;
};

const createParticleElement = (x: number, y: number, color = DEFAULT_GLOW_COLOR): HTMLDivElement => {
  const el = document.createElement('div');
  el.className = 'particle';
  el.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
};

const calculateSpotlightValues = (radius: number) => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75
});

const updateCardGlowProperties = (
  card: HTMLElement,
  mouseX: number,
  mouseY: number,
  glow: number,
  radius: number,
  rect: DOMRect = card.getBoundingClientRect()
) => {
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;

  card.style.setProperty('--glow-x', `${relativeX}%`);
  card.style.setProperty('--glow-y', `${relativeY}%`);
  card.style.setProperty('--glow-intensity', glow.toString());
  card.style.setProperty('--glow-radius', `${radius}px`);
};

interface MagicBentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  disableAnimations?: boolean;
  particleCount?: number;
  glowColor?: string;
  enableTilt?: boolean;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
  enableStars?: boolean;
  enableBorderGlow?: boolean;
}

export const MagicBentoCard: React.FC<MagicBentoCardProps> = ({
  children,
  className = '',
  disableAnimations = false,
  style = {},
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW_COLOR,
  enableTilt = true,
  clickEffect = true,
  enableMagnetism = true,
  enableStars = true,
  enableBorderGlow = true,
  ...rest
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const timeoutsRef = useRef<number[]>([]);
  const isHoveredRef = useRef(false);
  const memoizedParticles = useRef<HTMLDivElement[]>([]);
  const particlesInitialized = useRef(false);
  const finePointer = useFinePointer();
  const animationsOff = disableAnimations || !finePointer;

  const initializeParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return;

    const { width, height } = cardRef.current.getBoundingClientRect();
    memoizedParticles.current = Array.from({ length: particleCount }, () =>
      createParticleElement(Math.random() * width, Math.random() * height, glowColor)
    );
    particlesInitialized.current = true;
  }, [particleCount, glowColor]);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    particlesRef.current.forEach(particle => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'back.in(1.7)',
        onComplete: () => {
          particle.parentNode?.removeChild(particle);
        }
      });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;

    if (!particlesInitialized.current) {
      initializeParticles();
    }

    memoizedParticles.current.forEach((particle, index) => {
      const timeoutId = window.setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;

        const clone = particle.cloneNode(true) as HTMLDivElement;
        cardRef.current.appendChild(clone);
        particlesRef.current.push(clone);

        gsap.fromTo(clone, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' });

        gsap.to(clone, {
          x: (Math.random() - 0.5) * 80,
          y: (Math.random() - 0.5) * 80,
          rotation: Math.random() * 360,
          duration: 2 + Math.random() * 2,
          ease: 'none',
          repeat: -1,
          yoyo: true
        });

        gsap.to(clone, {
          opacity: 0.3,
          duration: 1.5,
          ease: 'power2.inOut',
          repeat: -1,
          yoyo: true
        });
      }, index * 120);

      timeoutsRef.current.push(timeoutId);
    });
  }, [initializeParticles]);

  useEffect(() => {
    if (animationsOff || !cardRef.current) return;

    const element = cardRef.current;

    // quickTo reuses one tween per property instead of creating new tweens on every mousemove.
    gsap.set(element, { transformPerspective: 800 });
    const toRotX = gsap.quickTo(element, 'rotateX', { duration: 0.15, ease: 'power2.out' });
    const toRotY = gsap.quickTo(element, 'rotateY', { duration: 0.15, ease: 'power2.out' });
    const toX = gsap.quickTo(element, 'x', { duration: 0.4, ease: 'power2.out' });
    const toY = gsap.quickTo(element, 'y', { duration: 0.4, ease: 'power2.out' });

    // Cache the card rect while hovered (reading it every mousemove forces style recalcs); drop it on scroll.
    let rect: DOMRect | null = null;
    const invalidateRect = () => {
      rect = null;
    };

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      if (enableStars) {
        animateParticles();
      }

      rect = element.getBoundingClientRect();
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      rect = null;
      clearAllParticles();
      toRotX(0);
      toRotY(0);
      toX(0);
      toY(0);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!enableTilt && !enableMagnetism) return;

      rect = rect ?? element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      if (enableTilt) {
        toRotX(((y - centerY) / centerY) * -6);
        toRotY(((x - centerX) / centerX) * 6);
      }

      if (enableMagnetism) {
        toX((x - centerX) * 0.03); // Gentle magnetism pull
        toY((y - centerY) * 0.03);
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (!clickEffect) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height)
      );

      const ripple = document.createElement('div');
      ripple.className = 'bento-ripple';
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${glowColor}, 0.25) 0%, rgba(${glowColor}, 0.08) 30%, transparent 70%);
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 1000;
      `;

      element.appendChild(ripple);

      gsap.fromTo(
        ripple,
        {
          scale: 0,
          opacity: 1
        },
        {
          scale: 1,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
          onComplete: () => ripple.remove()
        }
      );
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('click', handleClick);
    window.addEventListener('scroll', invalidateRect, { passive: true });

    return () => {
      isHoveredRef.current = false;
      window.removeEventListener('scroll', invalidateRect);
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('click', handleClick);
      clearAllParticles();
      gsap.killTweensOf(element);
    };
  }, [animateParticles, clearAllParticles, animationsOff, enableTilt, enableMagnetism, clickEffect, glowColor, enableStars]);

  const baseClassName = `magic-bento-card ${enableBorderGlow ? 'magic-bento-card--border-glow' : ''} ${className}`;

  return (
    <div
      ref={cardRef}
      className={baseClassName}
      style={{
        ...style,
        '--glow-color': glowColor
      } as React.CSSProperties}
      {...rest}
    >
      {children}
    </div>
  );
};

interface GlobalSpotlightProps {
  gridRef: React.RefObject<HTMLDivElement | null>;
  disableAnimations?: boolean;
  enabled?: boolean;
  spotlightRadius?: number;
  glowColor?: string;
}

export const GlobalSpotlight: React.FC<GlobalSpotlightProps> = ({
  gridRef,
  disableAnimations = false,
  enabled = true,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor = DEFAULT_GLOW_COLOR
}) => {
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const isInsideSection = useRef(false);

  useEffect(() => {
    if (disableAnimations || !gridRef?.current || !enabled) return;
    const grid: HTMLDivElement = gridRef.current;

    const spotlight = document.createElement('div');
    spotlight.className = 'global-spotlight';
    spotlight.style.cssText = `
      position: fixed;
      left: 0;
      top: 0;
      width: 800px;
      height: 800px;
      margin: -400px 0 0 -400px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${glowColor}, 0.12) 0%,
        rgba(${glowColor}, 0.06) 15%,
        rgba(${glowColor}, 0.03) 25%,
        rgba(${glowColor}, 0.015) 40%,
        rgba(${glowColor}, 0.008) 65%,
        transparent 70%
      );
      z-index: 200;
      opacity: 0;
      mix-blend-mode: screen;
    `;
    document.body.appendChild(spotlight);
    spotlightRef.current = spotlight;

    // Move via transform (compositor-only) and reuse tweens instead of spawning new ones per event.
    const moveX = gsap.quickTo(spotlight, 'x', { duration: 0.1, ease: 'power2.out' });
    const moveY = gsap.quickTo(spotlight, 'y', { duration: 0.1, ease: 'power2.out' });
    const fade = gsap.quickTo(spotlight, 'opacity', { duration: 0.25, ease: 'power2.out' });

    const cards = Array.from(grid.querySelectorAll('.magic-bento-card')) as HTMLElement[];
    const { proximity, fadeDistance } = calculateSpotlightValues(spotlightRadius);
    let sectionVisible = false;
    let lit = false;
    let raf = 0;
    let lastEvent: MouseEvent | null = null;

    const dim = () => {
      if (!lit) return;
      lit = false;
      isInsideSection.current = false;
      fade(0);
      cards.forEach(card => card.style.setProperty('--glow-intensity', '0'));
    };

    const update = () => {
      raf = 0;
      const e = lastEvent;
      if (!e) return;

      const rect = grid.getBoundingClientRect();
      const mouseInside =
        e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      if (!mouseInside) {
        dim();
        return;
      }
      isInsideSection.current = true;
      lit = true;

      let minDistance = Infinity;
      for (const card of cards) {
        const cardRect = card.getBoundingClientRect();
        const centerX = cardRect.left + cardRect.width / 2;
        const centerY = cardRect.top + cardRect.height / 2;
        const isHovered =
          e.clientX >= cardRect.left &&
          e.clientX <= cardRect.right &&
          e.clientY >= cardRect.top &&
          e.clientY <= cardRect.bottom;

        const distance = isHovered
          ? 0
          : Math.hypot(e.clientX - centerX, e.clientY - centerY) - Math.max(cardRect.width, cardRect.height) / 2;
        const effectiveDistance = Math.max(0, distance);
        minDistance = Math.min(minDistance, effectiveDistance);

        let glowIntensity = 0;
        if (effectiveDistance <= proximity) {
          glowIntensity = 1;
        } else if (effectiveDistance <= fadeDistance) {
          glowIntensity = (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
        }
        updateCardGlowProperties(card, e.clientX, e.clientY, glowIntensity, spotlightRadius, cardRect);
      }

      moveX(e.clientX);
      moveY(e.clientY);
      fade(
        minDistance <= proximity
          ? 0.8
          : minDistance <= fadeDistance
            ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8
            : 0
      );
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionVisible) return;
      lastEvent = e;
      if (!raf) raf = requestAnimationFrame(update);
    };

    const handleMouseLeave = () => dim();

    // Only listen while the bento section is actually on screen.
    const io = new IntersectionObserver(([entry]) => {
      sectionVisible = entry.isIntersecting;
      if (!sectionVisible) dim();
    });
    io.observe(grid);

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      gsap.killTweensOf(spotlight);
      spotlight.remove();
      spotlightRef.current = null;
    };
  }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor]);

  return null;
};

interface MagicBentoProps {
  children: React.ReactNode;
  enableSpotlight?: boolean;
  disableAnimations?: boolean;
  spotlightRadius?: number;
  glowColor?: string;
}

const MagicBento: React.FC<MagicBentoProps> = ({
  children,
  enableSpotlight = true,
  disableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor = DEFAULT_GLOW_COLOR
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const finePointer = useFinePointer();
  const shouldDisableAnimations = disableAnimations || !finePointer;

  return (
    <div className="bento-section" ref={gridRef}>
      {enableSpotlight && (
        <GlobalSpotlight
          gridRef={gridRef}
          disableAnimations={shouldDisableAnimations}
          enabled={enableSpotlight}
          spotlightRadius={spotlightRadius}
          glowColor={glowColor}
        />
      )}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
        {children}
      </div>
    </div>
  );
};

export default MagicBento;
