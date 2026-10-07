import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { fadeReveal } from '../../utils/motion';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, className = '' }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            <motion.div
              variants={fadeReveal}
              initial="initial"
              animate="animate"
              exit="exit"
              className={g-[#FCFBF8] rounded-2xl sm:rounded-3xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col border border-[#D4C4A8] pointer-events-auto }
            >
              {(title || onClose) && (
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E9DCC9]">
                  {title && (
                    <h2 className="text-xl font-semibold text-[#3E2723]" style={{ fontFamily: 'Playfair Display, serif' }}>
                      {title}
                    </h2>
                  )}
                  {onClose && (
                    <button
                      onClick={onClose}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F4EFE6] text-[#8D6E63] transition-colors ml-auto"
                    >
                      <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                  )}
                </div>
              )}
              <div className="overflow-y-auto">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
