import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

/**
 * Clean Motion Primitives inspired by modern minimalist design (Linear, Manus, Stripe)
 * Provides subtle, purposeful micro-animations with zero 3D distortion.
 */

// Smooth standard spring and ease curves
export const MOTION_TRANSITION = {
  duration: 0.5,
  ease: [0.16, 1, 0.3, 1], // standard cubic-bezier
};

export const MOTION_SPRING = {
  type: 'spring' as const,
  stiffness: 120,
  damping: 20,
};

interface MotionFadeInProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  viewportOnce?: boolean;
}

export const MotionFadeIn: React.FC<MotionFadeInProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.5,
  distance = 20,
  className = '',
  viewportOnce = true,
  ...props
}) => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { opacity: 0, y: distance };
      case 'down':
        return { opacity: 0, y: -distance };
      case 'left':
        return { opacity: 0, x: distance };
      case 'right':
        return { opacity: 0, x: -distance };
      case 'none':
      default:
        return { opacity: 0 };
    }
  };

  return (
    <motion.div
      initial={getInitialPosition()}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: viewportOnce, margin: '-40px' }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

interface MotionCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  hoverElevation?: boolean;
}

export const MotionCard: React.FC<MotionCardProps> = ({
  children,
  className = '',
  hoverElevation = true,
  ...props
}) => {
  return (
    <motion.div
      whileHover={hoverElevation ? { y: -3, transition: { duration: 0.2, ease: 'easeOut' } } : undefined}
      whileTap={hoverElevation ? { y: 0, scale: 0.99 } : undefined}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

interface MotionStaggerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export const MotionStagger: React.FC<MotionStaggerProps> = ({
  children,
  className = '',
  staggerDelay = 0.08,
}) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-40px' }}
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const MotionStaggerItem: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16 },
        show: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.45,
            ease: [0.16, 1, 0.3, 1],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
