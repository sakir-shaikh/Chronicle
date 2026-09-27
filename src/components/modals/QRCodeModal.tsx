import React from 'react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventTitle: string;
  url: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  eventTitle,
  url,
}) => {
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

        <div className="text-center pt-2">
          <div className="w-12 h-12 rounded-full bg-[#EEF7F1] text-[#315C49] flex items-center justify-center mx-auto mb-3 border border-[#DCEFE4]">
            <span className="material-symbols-outlined text-[26px]">qr_code_2</span>
          </div>
          <h3 className="text-xl font-semibold text-[#20302A]" style={{ fontFamily: 'Geist, sans-serif' }}>
            Attendee Portal QR Code
          </h3>
          <p className="text-xs text-[#68766F] mt-1 max-w-xs mx-auto">
            Display this on stage slides or badge lanyards for instant attendee post generation.
          </p>
        </div>

        {/* QR Code Graphic Frame */}
        <div className="bg-[#FAFBF8] border border-[#E3E9E4] rounded-xl p-6 my-6 flex flex-col items-center justify-center shadow-inner">
          <div className="p-3 bg-white rounded-lg shadow-xs border border-[#E3E9E4]">
            {/* SVG Rendered QR Code */}
            <svg
              className="w-48 h-48"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="100" height="100" fill="white" />
              {/* Corner 1 */}
              <rect x="10" y="10" width="24" height="24" rx="3" stroke="#20302A" strokeWidth="4" />
              <rect x="16" y="16" width="12" height="12" rx="2" fill="#315C49" />
              {/* Corner 2 */}
              <rect x="66" y="10" width="24" height="24" rx="3" stroke="#20302A" strokeWidth="4" />
              <rect x="72" y="16" width="12" height="12" rx="2" fill="#315C49" />
              {/* Corner 3 */}
              <rect x="10" y="66" width="24" height="24" rx="3" stroke="#20302A" strokeWidth="4" />
              <rect x="16" y="72" width="12" height="12" rx="2" fill="#315C49" />
              {/* Data matrix pattern dots */}
              <circle cx="42" cy="18" r="3" fill="#20302A" />
              <circle cx="54" cy="18" r="3" fill="#7BAE8A" />
              <circle cx="48" cy="28" r="3" fill="#20302A" />
              <circle cx="18" cy="48" r="3" fill="#7BAE8A" />
              <circle cx="28" cy="48" r="3" fill="#20302A" />
              <circle cx="42" cy="42" r="3" fill="#315C49" />
              <circle cx="54" cy="42" r="3" fill="#20302A" />
              <circle cx="48" cy="54" r="3" fill="#7BAE8A" />
              <circle cx="72" cy="48" r="3" fill="#20302A" />
              <circle cx="82" cy="48" r="3" fill="#315C49" />
              <circle cx="42" cy="72" r="3" fill="#20302A" />
              <circle cx="54" cy="72" r="3" fill="#7BAE8A" />
              <circle cx="48" cy="82" r="3" fill="#315C49" />
              <circle cx="72" cy="72" r="3" fill="#20302A" />
              <circle cx="82" cy="82" r="3" fill="#7BAE8A" />
              {/* Center Chronicle Emblem */}
              <rect x="40" y="40" width="20" height="20" rx="4" fill="#20302A" />
              <path d="M46 54V48C46 45.79 47.79 44 50 44C52.21 44 54 45.79 54 48V54" stroke="#EEF7F1" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="50" cy="50" r="1.5" fill="#7BAE8A" />
            </svg>
          </div>
          <span className="text-xs font-semibold text-[#20302A] mt-3">{eventTitle}</span>
          <span className="text-[11px] font-mono text-[#68766F] truncate max-w-[280px]">{url}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              navigator.clipboard?.writeText(url);
              alert('Attendee URL copied to clipboard: ' + url);
            }}
            className="flex-1 py-2.5 px-4 bg-[#F3F4F1] hover:bg-[#E3E9E4] text-[#20302A] rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors border border-[#E3E9E4]"
          >
            <span className="material-symbols-outlined text-[16px]">link</span>
            <span>Copy Link</span>
          </button>
          <button
            onClick={() => {
              alert('Downloading high-res print SVG vector for badge lanyards & banner stands...');
            }}
            className="flex-1 py-2.5 px-4 bg-[#7BAE8A] hover:bg-[#6da07c] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Download PNG / SVG</span>
          </button>
        </div>
      </div>
    </div>
  );
};
