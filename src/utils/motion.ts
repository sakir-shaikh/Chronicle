import { Transition, Variants } from 'motion/react';

// EASING CURVES
export const easings = {
  // Classic Apple-like snappy feel
  snappy: [0.4, 0, 0.2, 1] as [number, number, number, number],
  // Smooth, premium editorial feel
  smooth: [0.22, 1, 0.36, 1] as [number, number, number, number],
  // Dramatically slow (for signature AI moments)
  dramatic: [0.16, 1, 0.3, 1] as [number, number, number, number],
  // Swift out, easy in
  outExpo: [0.16, 1, 0.3, 1] as [number, number, number, number],
};

// SPRING CONFIGURATIONS
export const springs = {
  // Tactile, physical feel for buttons/cards
  tactile: { type: 'spring', stiffness: 400, damping: 25, mass: 0.8 } as Transition,
  // Smooth, elegant floating
  fluid: { type: 'spring', stiffness: 250, damping: 30, mass: 1 } as Transition,
  // Heavy, deliberate movement for large modals
  deliberate: { type: 'spring', stiffness: 150, damping: 22, mass: 1.2 } as Transition,
  // Very subtle spring for micro-interactions
  micro: { type: 'spring', stiffness: 500, damping: 30, mass: 0.5 } as Transition,
};

// DURATIONS (for non-spring transitions)
export const durations = {
  micro: 0.15,
  fast: 0.25,
  medium: 0.4,
  slow: 0.6,
  cinematic: 1.2,
};

// COMMON VARIANTS

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 12, filter: 'blur(4px)' },
  animate: { 
    opacity: 1, 
    y: 0, 
    filter: 'blur(0px)',
    transition: { duration: durations.medium, ease: easings.smooth }
  },
  exit: { 
    opacity: 0, 
    y: -8, 
    filter: 'blur(2px)',
    transition: { duration: durations.fast, ease: easings.outExpo }
  },
};

export const staggerContainer: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 15, filter: 'blur(3px)' },
  animate: { 
    opacity: 1, 
    y: 0, 
    filter: 'blur(0px)',
    transition: springs.fluid 
  },
  exit: { opacity: 0, scale: 0.95, filter: 'blur(2px)', transition: { duration: 0.2 } },
};

export const scaleUp: Variants = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: springs.tactile
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: { duration: 0.15, ease: 'easeOut' }
  }
};

export const fadeReveal: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: durations.medium, ease: easings.smooth } },
  exit: { opacity: 0, transition: { duration: durations.fast } }
};
