import React, { useState } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: { defaultOrganizer: string; defaultHashtag: string; brandTone: string }) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [organizer, setOrganizer] = useState('Acme AI Global');
  const [defaultHashtag, setDefaultHashtag] = useState('#FutureOfAI, #Chronicle');
  const [brandTone, setBrandTone] = useState('Executive & Visionary');

  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#3E2723]/40 backdrop-blur-md flex items-center justify-center p-4 transition-all"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[#FCFBF8] rounded-3xl max-w-md w-full p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] ring-1 ring-black/5 relative animate-in fade-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8D6E63] hover:text-[#3E2723] p-1 rounded-lg"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#D4C4A8]">
          <span className="material-symbols-outlined text-[#C28B46] text-[22px]">tune</span>
          <h3 className="text-lg font-semibold text-[#3E2723]" style={{ fontFamily: 'Playfair Display, serif' }}>
            Workspace Settings
          </h3>
        </div>

        <div className="space-y-4 py-2">
          <div>
            <label className="block text-xs font-semibold text-[#3E2723] mb-1">
              Default Organizer Entity Name
            </label>
            <input
              type="text"
              value={organizer}
              onChange={(e) => setOrganizer(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-[#D4C4A8] text-xs text-[#3E2723] focus:outline-none focus:border-[#C28B46] bg-[#F4EFE6]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#3E2723] mb-1">
              Default Event Hashtags (comma separated)
            </label>
            <input
              type="text"
              value={defaultHashtag}
              onChange={(e) => setDefaultHashtag(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-[#D4C4A8] text-xs text-[#3E2723] focus:outline-none focus:border-[#C28B46] bg-[#F4EFE6]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#3E2723] mb-1">
              Default Corporate Brand Tone
            </label>
            <select
              value={brandTone}
              onChange={(e) => setBrandTone(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-[#D4C4A8] text-xs text-[#3E2723] focus:outline-none focus:border-[#C28B46] bg-[#F4EFE6]"
            >
              <option value="Executive & Visionary">Executive & Visionary (Leadership & Keynotes)</option>
              <option value="Builder & Technical">Builder & Technical (Hands-on Dev & Architecture)</option>
              <option value="Community & Networking">Community & Networking (Warm & Interactive)</option>
            </select>
          </div>

          <div className="p-3 bg-[#F0E6D2] rounded-xl border border-[#E6D3A8] flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#8B4513] text-[20px]">verified_user</span>
            <span className="text-[11px] text-[#8B4513] leading-snug">
              LinkedIn Social Velocity Engine connected. Post templates automatically optimize for algorithmic engagement.
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-[#D4C4A8] flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-[#5D4037] hover:text-[#3E2723]"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave({ defaultOrganizer: organizer, defaultHashtag, brandTone });
              onClose();
            }}
            className="px-4 py-2 bg-[#C28B46] hover:bg-[#A87739] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
