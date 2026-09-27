import React from 'react';

interface ChronicleLogoProps {
  variant?: 'full' | 'icon' | 'compact' | 'light';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ChronicleLogo: React.FC<ChronicleLogoProps> = ({
  variant = 'full',
  className = '',
  size = 'md',
}) => {
  // SVG emblem sizes
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const isLight = variant === 'light';

  const iconElement = (
    <div
      className={`relative ${iconSizes[size]} rounded-lg flex items-center justify-center flex-shrink-0 transition-transform hover:scale-105 ${
        isLight
          ? 'bg-white/15 text-white border border-white/20'
          : 'bg-[#20302A] text-[#7BAE8A] border border-[#315C49]/40 shadow-xs'
      }`}
    >
      {/* Editorial Chronicle Mark: Timeline Portal Arch with Milestone Point */}
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[72%] h-[72%]"
      >
        {/* Subtle inner dashed contour */}
        <rect
          x="1"
          y="1"
          width="30"
          height="30"
          rx="5"
          stroke={isLight ? 'rgba(255,255,255,0.25)' : '#315C49'}
          strokeWidth="1"
          strokeDasharray="2 2"
        />
        {/* Top vertical anchor */}
        <line
          x1="16"
          y1="5"
          x2="16"
          y2="9"
          stroke={isLight ? '#FFFFFF' : '#7BAE8A'}
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Arch / Chronicle dome */}
        <path
          d="M8 24V16C8 11.5817 11.5817 8 16 8C20.4183 8 24 11.5817 24 16V24"
          stroke={isLight ? '#FFFFFF' : '#EEF7F1'}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        {/* Horizontal timeline chord */}
        <line
          x1="6"
          y1="19"
          x2="26"
          y2="19"
          stroke={isLight ? '#DCEFE4' : '#7BAE8A'}
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Central chronological milestone node */}
        <circle
          cx="16"
          cy="19"
          r="2.5"
          fill={isLight ? '#FFFFFF' : '#DCEFE4'}
          stroke={isLight ? '#315C49' : '#20302A'}
          strokeWidth="1"
        />
      </svg>
    </div>
  );

  if (variant === 'icon') {
    return <div className={`inline-flex items-center ${className}`}>{iconElement}</div>;
  }

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {iconElement}
      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-semibold tracking-tight ${
              isLight ? 'text-white' : 'text-[#20302A]'
            } ${
              size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-lg' : 'text-xl'
            }`}
            style={{ fontFamily: 'Geist, sans-serif' }}
          >
            Chronicle
          </span>
          {size === 'lg' && (
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#EEF7F1] text-[#315C49] font-medium">
              Stories
            </span>
          )}
        </div>
        {variant !== 'compact' && (
          <span
            className={`text-[10.5px] tracking-wide mt-0.5 font-medium ${
              isLight ? 'text-white/70' : 'text-[#68766F]'
            }`}
          >
            Turn moments into stories
          </span>
        )}
      </div>
    </div>
  );
};
