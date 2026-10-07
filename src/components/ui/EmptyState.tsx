import React from 'react';

export interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action, className = '' }) => {
  return (
    <div className={lex flex-col items-center justify-center text-center p-8 sm:p-12 }>
      <div className="w-16 h-16 rounded-full bg-[#F4EFE6] text-[#C28B46] flex items-center justify-center mb-4 border border-[#E9DCC9]">
        <span className="material-symbols-outlined text-[32px]">{icon}</span>
      </div>
      <h3 className="text-lg font-semibold text-[#3E2723] mb-2">{title}</h3>
      <p className="text-sm text-[#5D4037] max-w-sm mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};
