import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl';
    
    const variants = {
      primary: 'bg-[#C28B46] text-white hover:bg-[#A87739] shadow-xs focus:ring-[#C28B46]',
      secondary: 'bg-[#F4EFE6] text-[#3E2723] hover:bg-[#E9DCC9] border border-[#D4C4A8] focus:ring-[#C28B46]',
      outline: 'border border-[#D4C4A8] text-[#3E2723] hover:bg-[#F4EFE6] focus:ring-[#D4C4A8]',
      ghost: 'text-[#3E2723] hover:bg-[#F4EFE6] focus:ring-[#D4C4A8]',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600',
    };
    
    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return (
      <button
        ref={ref}
        className={${baseStyles}   }
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <span className="mr-2 animate-spin material-symbols-outlined text-[16px]">progress_activity</span>}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);
Button.displayName = 'Button';
