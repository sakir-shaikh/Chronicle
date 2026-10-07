import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'flat';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: 'bg-[#FCFBF8] border border-[#D4C4A8] shadow-xs',
      outlined: 'bg-transparent border border-[#D4C4A8]',
      flat: 'bg-[#F4EFE6] border-none',
    };

    return (
      <div
        ref={ref}
        className={ounded-2xl  }
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';
