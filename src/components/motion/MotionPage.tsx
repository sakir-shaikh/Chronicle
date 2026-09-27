import React from 'react';
import { motion } from 'motion/react';
import { pageVariants } from '../../utils/motion';

interface MotionPageProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const MotionPage: React.FC<MotionPageProps> = ({ children, className = '', id }) => {
  return (
    <motion.div
      key={id}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`w-full ${className}`}
    >
      {children}
    </motion.div>
  );
};
