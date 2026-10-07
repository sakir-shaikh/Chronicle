import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { springs } from '../../../utils/motion';
import { SAMPLE_ATTENDEE_PHOTOS } from '../../../data/mockData';

interface PhotoStepProps {
  uploadedPhotos: string[];
  onRemovePhoto: (idx: number) => void;
  onAddSamplePhoto: (url: string) => void;
  showPhotoPicker: boolean;
  setShowPhotoPicker: (show: boolean) => void;
}

export const PhotoStep: React.FC<PhotoStepProps> = ({
  uploadedPhotos,
  onRemovePhoto,
  onAddSamplePhoto,
  showPhotoPicker,
  setShowPhotoPicker
}) => {
  return (
    <div className="bg-[#FCFBF8] border border-[#D4C4A8] p-8 rounded-[32px] shadow-sm space-y-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-[#8B4513]">photo_library</span>
          <span
            className="text-base font-semibold text-[#3E2723]"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Uploaded Photos
          </span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-[#E9DCC9] border border-[#D4C4A8] text-[11px] text-[#5D4037] font-mono">
          {uploadedPhotos.length} / 6 attached
        </span>
      </div>

      <motion.div layout className="grid grid-cols-3 gap-2.5">
        <AnimatePresence>
          {uploadedPhotos.map((photoUrl, idx) => (
            <motion.div
              key={photoUrl}
              layout
              initial={{ opacity: 0, scale: 0.8, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.5, filter: 'blur(4px)' }}
              transition={springs.tactile}
              className="relative group rounded-xl overflow-hidden h-24 bg-[#E9DCC9] border border-[#D4C4A8] shadow-xs aspect-square"
            >
              <img src={photoUrl} alt="Attendee event moment" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between p-1.5">
                <span className="material-symbols-outlined text-white text-[16px]">image</span>
                <button
                  onClick={() => onRemovePhoto(idx)}
                  className="w-6 h-6 rounded-full bg-[#FCFBF8]/95 hover:bg-[#FCFBF8] text-[#3E2723] flex items-center justify-center transition-colors shadow-xs"
                  type="button"
                  title="Remove Photo"
                >
                  <span className="material-symbols-outlined text-[13px]">close</span>
                </button>
              </div>
            </motion.div>
          ))}

          {uploadedPhotos.length < 6 && (
            <motion.button
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPhotoPicker(true)}
              className="h-24 rounded-2xl bg-[#FCFBF8] shadow-sm border-2 border-dashed border-[#D4C4A8] hover:bg-[#F0E6D2] hover:border-[#C28B46] flex flex-col items-center justify-center gap-1 text-[#5D4037] hover:text-[#8B4513] transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[22px] text-[#C28B46]">add_a_photo</span>
              <span className="text-[11px] font-semibold">+ Add Photo</span>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {showPhotoPicker && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={springs.fluid}
            className="p-3 bg-[#F4EFE6] border border-[#D4C4A8] rounded-xl space-y-2 overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#3E2723]">Select from Event Moments Gallery:</span>
              <button
                onClick={() => setShowPhotoPicker(false)}
                className="text-xs text-[#8D6E63] hover:text-[#3E2723]"
              >
                Cancel
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {SAMPLE_ATTENDEE_PHOTOS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onAddSamplePhoto(p.url)}
                  className="h-16 rounded-lg overflow-hidden border border-[#D4C4A8] hover:ring-2 hover:ring-[#C28B46] transition-all relative group"
                >
                  <img src={p.url} alt={p.caption} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
