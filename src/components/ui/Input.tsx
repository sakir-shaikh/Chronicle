import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', leftIcon, rightIcon, error, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8D6E63] flex items-center justify-center">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          className={w-full h-11 rounded-xl bg-[#F4EFE6] text-[#3E2723] text-xs sm:text-sm border shadow-xs focus:outline-none focus:ring-2 focus:ring-[#E6D3A8] transition-all disabled:opacity-50 disabled:cursor-not-allowed
            
            
            
            }
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8D6E63] flex items-center justify-center">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
