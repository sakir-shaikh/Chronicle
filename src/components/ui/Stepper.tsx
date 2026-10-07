import React from 'react';

export interface StepperProps {
  steps: number;
  currentStep: number;
  onStepChange?: (step: number) => void;
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep, onStepChange, className = '' }) => {
  return (
    <div className={w-full flex justify-center }>
      <div className="flex items-center gap-2 sm:gap-4">
        {Array.from({ length: steps }).map((_, i) => {
          const s = i + 1;
          const isCompleted = currentStep > s;
          const isActive = currentStep === s;
          
          return (
            <React.Fragment key={s}>
              <div
                onClick={() => onStepChange?.(s)}
                className={cursor-pointer flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors }
              >
                {isCompleted ? <span className="material-symbols-outlined text-[16px]">check</span> : s}
              </div>
              {s < steps && (
                <div
                  className={w-8 sm:w-16 h-px transition-colors }
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
