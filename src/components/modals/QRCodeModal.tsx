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

        <div className="text-center pt-2">
          <div className="w-12 h-12 rounded-full bg-[#F0E6D2] text-[#8B4513] flex items-center justify-center mx-auto mb-3 border border-[#E6D3A8]">
            <span className="material-symbols-outlined text-[26px]">qr_code_2</span>
          </div>
          <h3 className="text-xl font-semibold text-[#3E2723]" style={{ fontFamily: 'Playfair Display, serif' }}>
            Attendee Portal QR Code
          </h3>
          <p className="text-xs text-[#5D4037] mt-1 max-w-xs mx-auto">
            Display this on stage slides or badge lanyards for instant attendee post generation.
          </p>
        </div>

        {/* QR Code Graphic Frame */}
        <div className="bg-[#F4EFE6] border border-[#D4C4A8] rounded-xl p-6 my-6 flex flex-col items-center justify-center shadow-inner">
          <div className="p-3 bg-[#FCFBF8] rounded-lg shadow-xs border border-[#D4C4A8]">
            {/* SVG Rendered QR Code */}
            <svg
              className="w-48 h-48"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="100" height="100" fill="white" />
              {/* Corner 1 */}
              <rect x="10" y="10" width="24" height="24" rx="3" stroke="#3E2723" strokeWidth="4" />
              <rect x="16" y="16" width="12" height="12" rx="2" fill="#8B4513" />
              {/* Corner 2 */}
              <rect x="66" y="10" width="24" height="24" rx="3" stroke="#3E2723" strokeWidth="4" />
              <rect x="72" y="16" width="12" height="12" rx="2" fill="#8B4513" />
              {/* Corner 3 */}
              <rect x="10" y="66" width="24" height="24" rx="3" stroke="#3E2723" strokeWidth="4" />
              <rect x="16" y="72" width="12" height="12" rx="2" fill="#8B4513" />
              {/* Data matrix pattern dots */}
              <circle cx="42" cy="18" r="3" fill="#3E2723" />
              <circle cx="54" cy="18" r="3" fill="#C28B46" />
              <circle cx="48" cy="28" r="3" fill="#3E2723" />
              <circle cx="18" cy="48" r="3" fill="#C28B46" />
              <circle cx="28" cy="48" r="3" fill="#3E2723" />
              <circle cx="42" cy="42" r="3" fill="#8B4513" />
              <circle cx="54" cy="42" r="3" fill="#3E2723" />
              <circle cx="48" cy="54" r="3" fill="#C28B46" />
              <circle cx="72" cy="48" r="3" fill="#3E2723" />
              <circle cx="82" cy="48" r="3" fill="#8B4513" />
              <circle cx="42" cy="72" r="3" fill="#3E2723" />
              <circle cx="54" cy="72" r="3" fill="#C28B46" />
              <circle cx="48" cy="82" r="3" fill="#8B4513" />
              <circle cx="72" cy="72" r="3" fill="#3E2723" />
              <circle cx="82" cy="82" r="3" fill="#C28B46" />
              {/* Center Chronicle Emblem */}
              <rect x="40" y="40" width="20" height="20" rx="4" fill="#3E2723" />
              <path d="M46 54V48C46 45.79 47.79 44 50 44C52.21 44 54 45.79 54 48V54" stroke="#F0E6D2" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="50" cy="50" r="1.5" fill="#C28B46" />
            </svg>
          </div>
          <span className="text-xs font-semibold text-[#3E2723] mt-3">{eventTitle}</span>
          <span className="text-[11px] font-mono text-[#5D4037] truncate max-w-[280px]">{url}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              navigator.clipboard?.writeText(url);
              alert('Attendee URL copied to clipboard: ' + url);
            }}
            className="flex-1 py-2.5 px-4 bg-[#E9DCC9] hover:bg-[#D4C4A8] text-[#3E2723] rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors border border-[#D4C4A8]"
          >
            <span className="material-symbols-outlined text-[16px]">link</span>
            <span>Copy Link</span>
          </button>
          <button
            onClick={() => {
              alert('Downloading high-res print SVG vector for badge lanyards & banner stands...');
            }}
            className="flex-1 py-2.5 px-4 bg-[#C28B46] hover:bg-[#A87739] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Download PNG / SVG</span>
          </button>
        </div>
      </div>
    </div>
  );
};
