import React from 'react';
import { PostTone } from '../../../types';

interface ToneStepProps {
  selectedTone: PostTone;
  setSelectedTone: (tone: PostTone) => void;
}

export const ToneStep: React.FC<ToneStepProps> = ({ selectedTone, setSelectedTone }) => {
  return (
    <div className="bg-[#FCFBF8] border border-[#D4C4A8] p-8 rounded-[32px] shadow-sm space-y-5 hover:shadow-md transition-shadow">
      <label
        className="text-base font-semibold text-[#3E2723] flex items-center gap-2"
        style={{ fontFamily: 'Playfair Display, serif' }}
      >
        <span className="material-symbols-outlined text-[20px] text-[#8B4513]">tune</span>
        <span>Tone &amp; Perspective</span>
      </label>

      <div className="grid grid-cols-1 gap-2.5">
        {[
          { id: 'professional', label: 'Professional', desc: 'Thoughtful, polished, and business-focused' },
          { id: 'grateful', label: 'Grateful Attendee', desc: 'Personal, appreciative, and people-focused' },
          { id: 'takeaways', label: 'Key Takeaways', desc: 'Insight-driven and focused on learnings' },
          { id: 'thought-leader', label: 'Thought Leader / Forward-Looking', desc: 'Ecosystem shifts, trends, and macro predictions' }
        ].map(tone => (
          <button
            key={tone.id}
            type="button"
            onClick={() => setSelectedTone(tone.id as PostTone)}
            className={\p-4 rounded-2xl border text-left flex items-start justify-between cursor-pointer transition-all \\}
          >
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-[#3E2723]">{tone.label}</span>
              <p className="text-xs text-[#5D4037]">{tone.desc}</p>
            </div>
            {selectedTone === tone.id ? (
              <span className="material-symbols-outlined text-[20px] text-[#8B4513]">check_circle</span>
            ) : (
              <span className="w-5 h-5 rounded-full border border-[#D4C4A8] bg-[#E9DCC9]"></span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
