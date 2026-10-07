import React from 'react';

interface TakeawayStepProps {
  takeaways: string;
  setTakeaways: (val: string | ((prev: string) => string)) => void;
}

export const TakeawayStep: React.FC<TakeawayStepProps> = ({ takeaways, setTakeaways }) => {
  return (
    <div className="bg-[#FCFBF8] border border-[#D4C4A8] p-8 rounded-[32px] shadow-sm space-y-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <label
          htmlFor="takeaways"
          className="text-base font-semibold text-[#3E2723] flex items-center gap-2"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          <span className="material-symbols-outlined text-[20px] text-[#8B4513]">edit_note</span>
          <span>What stood out to you today?</span>
        </label>
        <span className="text-[11px] text-[#8D6E63] flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C28B46]"></span>
          Auto-saved
        </span>
      </div>

      <div className="relative">
        <textarea
          id="takeaways"
          rows={5}
          value={takeaways}
          onChange={(e) => setTakeaways(e.target.value)}
          maxLength={500}
          placeholder="Share an idea, insight, quote, lesson, or moment that stayed with you..."
          className="w-full p-5 bg-[#F4EFE6] border-none shadow-[0_2px_12px_rgba(0,0,0,0.04)] rounded-2xl text-[#3E2723] text-sm focus:bg-[#FCFBF8] focus:outline-none focus:ring-1 focus:ring-[#C28B46]/50 transition-all resize-none leading-relaxed placeholder:text-[#8D6E63]"
        />
        <div className="text-right text-[10px] text-[#8D6E63] mt-0.5 font-mono">
          {takeaways.length} / 500 chars
        </div>
      </div>

      <div className="space-y-1.5 pt-1">
        <span className="text-[11px] text-[#8D6E63] uppercase font-semibold tracking-wider">
          Quick prompt inspirations:
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              setTakeaways((prev) => {
                const newText = prev + (prev.length > 0 ? '\n' : '') + "The biggest thing I learned was how model optimization is pivoting from parameter count to orchestration latency.";
                return newText.substring(0, 500);
              })
            }
            className="px-2.5 py-1 rounded-lg bg-[#F4EFE6] border border-[#D4C4A8] hover:bg-[#F0E6D2] hover:border-[#C28B46] hover:text-[#8B4513] transition-colors text-xs text-[#3E2723]"
          >
            "The biggest thing I learned..."
          </button>
          <button
            type="button"
            onClick={() =>
              setTakeaways((prev) => {
                const newText = prev + (prev.length > 0 ? '\n' : '') + "One idea I'm taking back is implementing deterministic guardrails across our customer-facing agents.";
                return newText.substring(0, 500);
              })
            }
            className="px-2.5 py-1 rounded-lg bg-[#F4EFE6] border border-[#D4C4A8] hover:bg-[#F0E6D2] hover:border-[#C28B46] hover:text-[#8B4513] transition-colors text-xs text-[#3E2723]"
          >
            "One idea I'm taking back..."
          </button>
          <button
            type="button"
            onClick={() =>
              setTakeaways((prev) => {
                const newText = prev + (prev.length > 0 ? '\n' : '') + "A speaker insight that stayed with me: Solving unglamorous backend bottlenecks yields 10x the adoption of flashy UI tricks.";
                return newText.substring(0, 500);
              })
            }
            className="px-2.5 py-1 rounded-lg bg-[#F4EFE6] border border-[#D4C4A8] hover:bg-[#F0E6D2] hover:border-[#C28B46] hover:text-[#8B4513] transition-colors text-xs text-[#3E2723]"
          >
            "A speaker insight that stayed with me..."
          </button>
        </div>
      </div>
    </div>
  );
};
