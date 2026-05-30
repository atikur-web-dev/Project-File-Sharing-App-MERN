// src/components/common/PageTransition.tsx
import React from 'react';
import { motion, AnimatePresence, circOut, circIn } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  location?: string;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: circOut,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.2,
      ease: circIn,
    },
  },
};

export const PageTransition: React.FC<PageTransitionProps> = ({ children, location }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};