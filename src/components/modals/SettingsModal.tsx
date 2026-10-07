import React, { useState } from 'react';
import { Modal, Input, Button } from '../ui';

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Workspace Settings">
      <div className="p-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#3E2723] mb-1">
            Default Organizer Entity Name
          </label>
          <Input
            value={organizer}
            onChange={(e) => setOrganizer(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#3E2723] mb-1">
            Default Event Hashtags (comma separated)
          </label>
          <Input
            value={defaultHashtag}
            onChange={(e) => setDefaultHashtag(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#3E2723] mb-1">
            Default Corporate Brand Tone
          </label>
          <select
            value={brandTone}
            onChange={(e) => setBrandTone(e.target.value)}
            className="w-full h-11 px-3.5 rounded-xl bg-[#F4EFE6] text-[#3E2723] text-xs sm:text-sm border border-[#D4C4A8] shadow-xs focus:outline-none focus:border-[#C28B46] focus:ring-2 focus:ring-[#E6D3A8] transition-all"
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

      <div className="px-6 py-4 border-t border-[#D4C4A8] flex items-center justify-end gap-3 bg-[#FCFBF8]">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={() => {
            onSave({ defaultOrganizer: organizer, defaultHashtag, brandTone });
            onClose();
          }}
        >
          Save Changes
        </Button>
      </div>
    </Modal>
  );
};
