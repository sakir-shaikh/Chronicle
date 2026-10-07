import React from 'react';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = '', label, ...props }, ref) => {
    return (
      <label className="flex items-center gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          ref={ref}
          className={w-4 h-4 text-[#C28B46] rounded border-[#D4C4A8] focus:ring-[#C28B46] bg-[#FCFBF8] }
          {...props}
        />
        {label && <span className="text-xs font-medium text-[#3E2723]">{label}</span>}
      </label>
    );
  }
);
Checkbox.displayName = 'Checkbox';
