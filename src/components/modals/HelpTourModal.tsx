import React, { useState } from 'react';

interface HelpTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartFlow: (view: 'organizer' | 'attendee') => void;
}

export const HelpTourModal: React.FC<HelpTourModalProps> = ({
  isOpen,
  onClose,
  onStartFlow,
}) => {
  const [slide, setSlide] = useState(0);

  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const slides = [
    {
      title: 'Welcome to Chronicle',
      tagline: 'Turn Moments into Stories',
      icon: 'auto_awesome',
      desc: 'Chronicle solves the event post problem: Attendees love taking photos and jotting notes, but writing a polished LinkedIn post while walking between halls is friction-heavy. Chronicle makes it instant.',
      bullets: [
        'Organizers setup verified branding, official hashtags, and speaker prompt templates.',
        'Attendees snap conference photos, write raw takeaways in 30 seconds.',
        'Chronicle AI turns reflections into high-reach, verified LinkedIn narratives.',
      ],
    },
    {
      title: 'For Organizers: Real-Time Social Velocity',
      tagline: 'Amplify Your Event Beyond the Hall',
      icon: 'insights',
      desc: 'Track live content synthesis as it happens on stage. Monitor keynote resonance, attendee post generation rates, and real-time sentiment without waiting for post-event surveys.',
      bullets: [
        'Live pulse KPIs: Track attendee checks-ins and LinkedIn conversion rates.',
        'Real-time NLP theme extraction: Discover what attendees are actually talking about.',
        'Exportable sponsor ROI reports: Prove organic attendee social reach with data.',
      ],
    },
    {
      title: 'For Attendees: The 60-Second Storyteller',
      tagline: 'No Writer’s Block. Just Pure Signal.',
      icon: 'edit_note',
      desc: 'Choose your tone—Professional, Grateful, or Takeaways—and watch your personal notes transform into a compelling post ready to paste into LinkedIn.',
      bullets: [
        'Drag & drop up to 6 conference photos with auto-collage preview.',
        'Quick prompt suggestions inspired by the day’s keynote speakers.',
        'One-click clipboard copy with pre-formatted hashtags and verified organizer tags.',
      ],
    },
  ];

  const current = slides[slide];

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#3E2723]/40 backdrop-blur-md flex items-center justify-center p-4 transition-all"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[#FCFBF8] rounded-3xl max-w-lg w-full p-8 sm:p-10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] ring-1 ring-black/5 relative animate-in fade-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#8D6E63] hover:text-[#3E2723] p-1 rounded-lg"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Step Indicator */}
        <div className="flex items-center gap-1.5 mb-5">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === slide ? 'w-8 bg-[#C28B46]' : 'w-2 bg-[#D4C4A8]'
              }`}
            />
          ))}
        </div>

        <div className="w-12 h-12 rounded-xl bg-[#F0E6D2] text-[#8B4513] flex items-center justify-center mb-4 border border-[#E6D3A8]">
          <span className="material-symbols-outlined text-[24px] text-[#C28B46]">{current.icon}</span>
        </div>

        <span className="text-[11px] uppercase tracking-wider text-[#8B4513] font-semibold bg-[#E6D3A8] px-2.5 py-0.5 rounded-full">
          {current.tagline}
        </span>

        <h3 className="text-xl sm:text-2xl font-semibold text-[#3E2723] mt-2 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
          {current.title}
        </h3>

        <p className="text-sm text-[#5D4037] leading-relaxed mb-4">
          {current.desc}
        </p>

        <div className="space-y-2 bg-[#F4EFE6] p-4 rounded-xl border border-[#D4C4A8] mb-6">
          {current.bullets.map((b, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-[#3E2723]">
              <span className="material-symbols-outlined text-[16px] text-[#C28B46] shrink-0 mt-0.5">
                check_circle
              </span>
              <span className="leading-snug">{b}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#D4C4A8]">
          {slide > 0 ? (
            <button
              onClick={() => setSlide(slide - 1)}
              className="px-4 py-2 text-xs font-medium text-[#5D4037] hover:text-[#3E2723]"
            >
              Back
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#8D6E63] hover:text-[#3E2723]"
            >
              Skip Tour
            </button>
          )}

          <div className="flex items-center gap-2">
            {slide < slides.length - 1 ? (
              <button
                onClick={() => setSlide(slide + 1)}
                className="px-5 py-2.5 bg-[#C28B46] hover:bg-[#A87739] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
              >
                Next
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onClose();
                    onStartFlow('attendee');
                  }}
                  className="px-4 py-2.5 bg-[#F0E6D2] text-[#8B4513] hover:bg-[#E6D3A8] text-xs font-semibold rounded-xl transition-colors"
                >
                  Try Attendee Portal
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onStartFlow('organizer');
                  }}
                  className="px-4 py-2.5 bg-[#C28B46] hover:bg-[#A87739] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                >
                  Open Organizer
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
