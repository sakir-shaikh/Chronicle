import React, { useEffect, useState } from 'react';

export interface ToastProps {
  show: boolean;
  title: string;
  message?: string;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ show, title, message, onClose }) => {
  const [render, setRender] = useState(show);

  useEffect(() => {
    if (show) setRender(true);
  }, [show]);

  const handleAnimationEnd = () => {
    if (!show) setRender(false);
  };

  if (!render) return null;

  return (
    <div 
      className={`fixed bottom-6 right-6 z-50 max-w-sm w-full ${show ? 'animate-toast-enter' : 'animate-toast-exit'}`}
      role="alert"
      aria-live="assertive"
      onAnimationEnd={handleAnimationEnd}
    >
      <div className="bg-[#FCFBF8]/90 text-text-primary px-4 py-3.5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex items-center justify-between gap-3 border border-border-subtle/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-light-mint flex items-center justify-center text-brand-dark shrink-0">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm font-display tracking-tight text-text-primary">{title}</span>
            {message && (
              <span className="text-[13px] text-text-secondary truncate max-w-[220px]">
                {message}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-text-muted hover:text-text-primary p-1.5 rounded-lg hover:bg-black/[0.04] transition-colors"
          type="button"
          aria-label="Close notification"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>
    </div>
  );
};
