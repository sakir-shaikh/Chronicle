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
      className="fixed inset-0 z-50 bg-[#20302A]/40 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E3E9E4] relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#9AA69F] hover:text-[#20302A] p-1 rounded-lg"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#E3E9E4]">
          <span className="material-symbols-outlined text-[#7BAE8A] text-[22px]">tune</span>
          <h3 className="text-lg font-semibold text-[#20302A]" style={{ fontFamily: 'Geist, sans-serif' }}>
            Workspace Settings
          </h3>
        </div>

        <div className="space-y-4 py-2">
          <div>
            <label className="block text-xs font-semibold text-[#20302A] mb-1">
              Default Organizer Entity Name
            </label>
            <input
              type="text"
              value={organizer}
              onChange={(e) => setOrganizer(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-[#E3E9E4] text-xs text-[#20302A] focus:outline-none focus:border-[#7BAE8A] bg-[#FAFBF8]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#20302A] mb-1">
              Default Event Hashtags (comma separated)
            </label>
            <input
              type="text"
              value={defaultHashtag}
              onChange={(e) => setDefaultHashtag(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-[#E3E9E4] text-xs text-[#20302A] focus:outline-none focus:border-[#7BAE8A] bg-[#FAFBF8]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#20302A] mb-1">
              Default Corporate Brand Tone
            </label>
            <select
              value={brandTone}
              onChange={(e) => setBrandTone(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-[#E3E9E4] text-xs text-[#20302A] focus:outline-none focus:border-[#7BAE8A] bg-[#FAFBF8]"
            >
              <option value="Executive & Visionary">Executive & Visionary (Leadership & Keynotes)</option>
              <option value="Builder & Technical">Builder & Technical (Hands-on Dev & Architecture)</option>
              <option value="Community & Networking">Community & Networking (Warm & Interactive)</option>
            </select>
          </div>

          <div className="p-3 bg-[#EEF7F1] rounded-xl border border-[#DCEFE4] flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#315C49] text-[20px]">verified_user</span>
            <span className="text-[11px] text-[#315C49] leading-snug">
              LinkedIn Social Velocity Engine connected. Post templates automatically optimize for algorithmic engagement.
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-[#E3E9E4] flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-[#68766F] hover:text-[#20302A]"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave({ defaultOrganizer: organizer, defaultHashtag, brandTone });
              onClose();
            }}
            className="px-4 py-2 bg-[#7BAE8A] hover:bg-[#6da07c] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
