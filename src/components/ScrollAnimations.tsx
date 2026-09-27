import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════
   3D SCROLL & INTERACTIVE MOTION SYSTEM
   Professional, high-performance 3D perspective animations
   with spring physics, mouse-reactive tilt, and parallax depth.
   ═══════════════════════════════════════════════════════════ */

export type Effect3D =
  | 'tiltUp'
  | 'tiltLeft'
  | 'tiltRight'
  | 'flipUp'
  | 'zoomRotate'
  | 'slideDepth'
  | 'floatUp'
  | 'perspectiveIn';

interface ScrollReveal3DProps {
  children: React.ReactNode;
  className?: string;
  effect?: Effect3D | string;
  delay?: number;
  perspective?: boolean;
}

const effectVariants: Record<
  string,
  {
    hidden: {
      opacity: number;
      y?: number;
      x?: number;
      rotateX?: number;
      rotateY?: number;
      rotateZ?: number;
      scale?: number;
    };
    visible: {
      opacity: number;
      y: number;
      x: number;
      rotateX: number;
      rotateY: number;
      rotateZ: number;
      scale: number;
    };
  }
> = {
  tiltUp: {
    hidden: { opacity: 0, y: 55, rotateX: 16, scale: 0.95 },
    visible: { opacity: 1, y: 0, x: 0, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1 },
  },
  tiltLeft: {
    hidden: { opacity: 0, x: -45, rotateY: 16, scale: 0.95 },
    visible: { opacity: 1, y: 0, x: 0, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1 },
  },
  tiltRight: {
    hidden: { opacity: 0, x: 45, rotateY: -16, scale: 0.95 },
    visible: { opacity: 1, y: 0, x: 0, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1 },
  },
  flipUp: {
    hidden: { opacity: 0, y: 65, rotateX: 24, scale: 0.93 },
    visible: { opacity: 1, y: 0, x: 0, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1 },
  },
  zoomRotate: {
    hidden: { opacity: 0, scale: 0.88, rotateZ: -3, y: 40 },
    visible: { opacity: 1, y: 0, x: 0, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1 },
  },
  slideDepth: {
    hidden: { opacity: 0, scale: 0.88, y: 50 },
    visible: { opacity: 1, y: 0, x: 0, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1 },
  },
  perspectiveIn: {
    hidden: { opacity: 0, rotateX: 14, rotateY: -10, y: 50, scale: 0.94 },
    visible: { opacity: 1, y: 0, x: 0, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1 },
  },
  floatUp: {
    hidden: { opacity: 0, y: 55, rotateX: 10, scale: 0.96 },
    visible: { opacity: 1, y: 0, x: 0, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1 },
  },
};

/**
 * ScrollReveal3D — Wraps elements with true 3D perspective scroll reveals.
 */
export const ScrollReveal3D: React.FC<ScrollReveal3DProps> = ({
  children,
  className = '',
  effect = 'tiltUp',
  delay = 0,
  perspective = true,
}) => {
  const chosenVariant = effectVariants[effect] || effectVariants.tiltUp;

  return (
    <div
      className={className}
      style={{
        perspective: perspective ? '1200px' : undefined,
        perspectiveOrigin: '50% 50%',
      }}
    >
      <motion.div
        variants={chosenVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        transition={{
          type: 'spring',
          stiffness: 70,
          damping: 17,
          mass: 0.75,
          delay,
        }}
        style={{
          transformStyle: 'preserve-3d',
          willChange: 'transform, opacity',
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   Tilt3DCard — Interactive 3D mouse tracking on hover
   ═══════════════════════════════════════════════════════════ */

interface Tilt3DCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glare?: boolean;
}

export const Tilt3DCard: React.FC<Tilt3DCardProps> = ({
  children,
  className = '',
  maxTilt = 12,
  glare = true,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Calculate 3D tilt angles
    const rX = (y - 0.5) * -maxTilt * 2;
    const rY = (x - 0.5) * maxTilt * 2;

    setRotateX(rX);
    setRotateY(rY);
    setGlarePos({ x: x * 100, y: y * 100 });
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      ref={cardRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
    >
      <motion.div
        animate={{
          rotateX,
          rotateY,
          scale: isHovered ? 1.025 : 1,
          translateZ: isHovered ? 18 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
          mass: 0.6,
        }}
        style={{
          transformStyle: 'preserve-3d',
          height: '100%',
          width: '100%',
        }}
        className="relative"
      >
        {children}
        {glare && (
          <div
            className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 z-30"
            style={{
              opacity: isHovered ? 0.3 : 0,
              background: `radial-gradient(circle 320px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.4), transparent 75%)`,
            }}
          />
        )}
      </motion.div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   ParallaxLayer — Scroll-driven depth parallax
   ═══════════════════════════════════════════════════════════ */

interface ParallaxLayerProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  direction?: 'vertical' | 'horizontal';
}

export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({
  children,
  className = '',
  speed = 0.25,
  direction = 'vertical',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const distance = 120 * speed;
  const y = useTransform(smoothProgress, [0, 1], [-distance, distance]);
  const x = useTransform(smoothProgress, [0, 1], [-distance, distance]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={direction === 'vertical' ? { y } : { x }}>
        {children}
      </motion.div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   Floating3D — Continuous gentle 3D levitation animation
   ═══════════════════════════════════════════════════════════ */

interface Floating3DProps {
  children: React.ReactNode;
  className?: string;
  depth?: number;
  duration?: number;
  delay?: number;
}

export const Floating3D: React.FC<Floating3DProps> = ({
  children,
  className = '',
  depth = 8,
  duration = 4.5,
  delay = 0,
}) => {
  return (
    <motion.div
      className={className}
      animate={{
        y: [-depth, depth, -depth],
        rotateX: [-2.5, 2.5, -2.5],
        rotateY: [-3, 3, -3],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal3D;
