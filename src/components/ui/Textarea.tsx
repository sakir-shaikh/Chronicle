import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={w-full p-3.5 rounded-xl bg-[#F4EFE6] text-[#3E2723] text-xs sm:text-sm border shadow-xs focus:outline-none focus:ring-2 focus:ring-[#E6D3A8] transition-all disabled:opacity-50 disabled:cursor-not-allowed resize-y
          
          }
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';
