import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface GenerateButtonProps {
  isGenerating: boolean;
  generationStepText: string;
  onGenerate: () => void;
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({
  isGenerating,
  generationStepText,
  onGenerate
}) => {
  return (
    <div className="space-y-2">
      <motion.button
        whileHover={!isGenerating ? { scale: 1.01 } : {}}
        whileTap={!isGenerating ? { scale: 0.98 } : {}}
        onClick={onGenerate}
        disabled={isGenerating}
        type="button"
        className="w-full py-3.5 px-6 rounded-2xl bg-[#C28B46] hover:bg-[#A87739] text-white text-base font-semibold shadow-xs flex items-center justify-center gap-2.5 transition-colors disabled:opacity-90 cursor-pointer overflow-hidden relative"
      >
        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.div
              key="generating"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-3"
            >
              <span className="material-symbols-outlined text-[24px] text-[#E6D3A8] animate-spin">
                progress_activity
              </span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={generationStepText}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className="text-white font-medium tracking-wide"
                >
                  {generationStepText}
                </motion.span>
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2.5"
            >
              <span className="material-symbols-outlined text-[22px] text-[#E6D3A8]">auto_awesome</span>
              <span>Generate LinkedIn Post</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
      <p className="text-xs text-[#8D6E63] text-center">
        Chronicle AI will synthesize your highlights into a high-engagement post
      </p>
    </div>
  );
};
