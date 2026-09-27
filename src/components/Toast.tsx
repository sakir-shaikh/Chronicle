import React from 'react';

export interface ToastProps {
  show: boolean;
  title: string;
  message?: string;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ show, title, message, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 transition-all duration-300 transform translate-y-0 opacity-100 max-w-sm w-full">
      <div className="bg-[#20302A] text-white px-4 py-3.5 rounded-xl shadow-xl flex items-center justify-between gap-3 border border-[#315C49]/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#315C49]/80 flex items-center justify-center text-[#7BAE8A] shrink-0 border border-[#7BAE8A]/30">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-white">{title}</span>
            {message && (
              <span className="text-xs text-[#DCEFE4]/90 font-mono truncate max-w-[220px]">
                {message}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-[#9AA69F] hover:text-white p-1 rounded-md transition-colors"
          type="button"
          aria-label="Close notification"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>
    </div>
  );
};
