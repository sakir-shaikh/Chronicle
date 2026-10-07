import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'outline';
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = '', variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: 'bg-[#E6D3A8] text-[#8B4513]',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
      outline: 'border border-[#D4C4A8] text-[#5D4037] bg-transparent',
    };

    return (
      <span
        ref={ref}
        className={inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold  }
        {...props}
      >
        {children}
      </span>
    );
  }
);
Badge.displayName = 'Badge';
