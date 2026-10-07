import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { springs } from '../../../utils/motion';
import { PostLength, EmojiStyle } from '../../../types';

interface PersonalizationStepProps {
  showAdvanced: boolean;
  setShowAdvanced: (val: boolean) => void;
  mentions: string;
  setMentions: (val: string) => void;
  personalNote: string;
  setPersonalNote: (val: string) => void;
  postLength: PostLength;
  setPostLength: (val: PostLength) => void;
  emojiStyle: EmojiStyle;
  setEmojiStyle: (val: EmojiStyle) => void;
}

export const PersonalizationStep: React.FC<PersonalizationStepProps> = ({
  showAdvanced,
  setShowAdvanced,
  mentions,
  setMentions,
  personalNote,
  setPersonalNote,
  postLength,
  setPostLength,
  emojiStyle,
  setEmojiStyle
}) => {
  return (
    <div className="bg-[#FCFBF8] border border-[#D4C4A8] rounded-[32px] shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="w-full p-4 flex items-center justify-between text-left text-xs font-semibold text-[#3E2723] hover:bg-[#F4EFE6] transition-colors"
      >
        <span className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-[#8B4513]">settings_suggest</span>
          <span>Advanced Personalization</span>
        </span>
        <motion.span
          animate={{ rotate: showAdvanced ? 180 : 0 }}
          transition={springs.micro}
          className="material-symbols-outlined text-[18px] text-[#8D6E63]"
        >
          expand_more
        </motion.span>
      </button>

      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={springs.fluid}
            className="overflow-hidden"
          >
            <div className="p-6 pt-0 space-y-4 border-t border-[#D4C4A8]">
              <div className="space-y-1.5 pt-3">
                <label className="text-xs font-medium text-[#5D4037]">Mention People &amp; Brands</label>
                <input
                  type="text"
                  value={mentions}
                  onChange={(e) => setMentions(e.target.value)}
                  className="w-full h-10 px-3 bg-[#F4EFE6] border border-[#D4C4A8] rounded-xl text-xs text-[#3E2723] focus:outline-none focus:ring-2 focus:ring-[#C28B46]"
                  placeholder="@SpeakerName, @Company"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#5D4037]">Personal Reflection / Shoutout</label>
                <input
                  type="text"
                  value={personalNote}
                  onChange={(e) => setPersonalNote(e.target.value)}
                  className="w-full h-10 px-3 bg-[#F4EFE6] border border-[#D4C4A8] rounded-xl text-xs text-[#3E2723] focus:outline-none focus:ring-2 focus:ring-[#C28B46]"
                  placeholder="e.g. Loved reconnecting with the Mumbai developer community!"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#5D4037]">Post Length</label>
                  <div className="flex bg-[#E9DCC9] p-1 rounded-xl border border-[#D4C4A8]">
                    {(['concise', 'standard', 'detailed'] as PostLength[]).map((len) => (
                      <button
                        key={len}
                        type="button"
                        onClick={() => setPostLength(len)}
                        className={\lex-1 py-1 rounded-lg text-center text-xs capitalize \\}
                      >
                        {len}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#5D4037]">Emoji Style</label>
                  <div className="flex bg-[#E9DCC9] p-1 rounded-xl border border-[#D4C4A8]">
                    {(['none', 'minimal', 'natural'] as EmojiStyle[]).map((em) => (
                      <button
                        key={em}
                        type="button"
                        onClick={() => setEmojiStyle(em)}
                        className={\lex-1 py-1 rounded-lg text-center text-xs capitalize \\}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
