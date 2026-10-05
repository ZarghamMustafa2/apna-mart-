import React from 'react';

export interface ApnaMartLogoProps {
  variant?: 'full' | 'icon-only' | 'wordmark';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  taglineText?: string;
  customLogoUrl?: string;
  className?: string;
  inverted?: boolean; // For dark backgrounds or footer
}

export const ApnaMartLogo: React.FC<ApnaMartLogoProps> = ({
  variant = 'full',
  size = 'md',
  showTagline = true,
  taglineText = 'Online Shopping Pakistan',
  customLogoUrl,
  className = '',
  inverted = false,
}) => {
  // If Admin has uploaded a custom logo image, render it directly
  if (customLogoUrl) {
    const customImgSizes = {
      xs: 'h-6',
      sm: 'h-8',
      md: 'h-9 sm:h-10',
      lg: 'h-12',
      xl: 'h-16',
    };
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <img
          src={customLogoUrl}
          alt="ApnaMart Logo"
          className={`${customImgSizes[size]} w-auto object-contain`}
        />
        {variant === 'full' && showTagline && (
          <span className="text-[10px] font-semibold text-gray-400 dark:text-slate-400 tracking-wider uppercase hidden sm:block">
            {taglineText}
          </span>
        )}
      </div>
    );
  }

  // Size dimensions for Icon
  const iconSizes = {
    xs: { box: 'w-6 h-6', text: 'text-xs' },
    sm: { box: 'w-7 h-7 sm:w-8 sm:h-8', text: 'text-sm' },
    md: { box: 'w-8 h-8 sm:w-10 sm:h-10', text: 'text-base sm:text-lg' },
    lg: { box: 'w-11 h-11 sm:w-12 sm:h-12', text: 'text-xl' },
    xl: { box: 'w-14 h-14 sm:w-16 sm:h-16', text: 'text-2xl' },
  };

  // Typography dimensions for Text
  const textSizes = {
    xs: 'text-sm',
    sm: 'text-base',
    md: 'text-lg sm:text-xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-4xl',
  };

  const taglineSizes = {
    xs: 'text-[8px]',
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-xs',
    xl: 'text-xs sm:text-sm',
  };

  // Modern SVG Icon Mark: Shopping Bag with dynamic 'A' and sparkle accent
  const BrandIconMark = (
    <div
      className={`${iconSizes[size].box} rounded-xl sm:rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-cyan-400 p-1.5 flex items-center justify-center text-white shadow-md shadow-brand-500/20 flex-shrink-0 group-hover:scale-105 transition-transform`}
    >
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Modern Shopping Bag contour */}
        <path
          d="M13 14C13 10.134 16.134 7 20 7C23.866 7 27 10.134 27 14"
          stroke="white"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <rect
          x="7"
          y="13"
          width="26"
          height="22"
          rx="5"
          fill="white"
          fillOpacity="0.15"
          stroke="white"
          strokeWidth="2.5"
        />

        {/* Dynamic Stylized 'A' */}
        <path
          d="M20 16L13.5 30H18L20 25.5L22 30H26.5L20 16Z"
          fill="white"
        />
        <path
          d="M17 23.5H23"
          stroke="#0284C7"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Vibrant Sparkle / Speed Accent */}
        <circle cx="28.5" cy="11.5" r="2.5" fill="#FACC15" />
      </svg>
    </div>
  );

  if (variant === 'icon-only') {
    return (
      <div className={`inline-flex items-center ${className}`}>
        {BrandIconMark}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 sm:gap-2.5 flex-shrink-0 group ${className}`}>
      {variant !== 'wordmark' && BrandIconMark}

      <div className="flex flex-col">
        <span
          className={`${textSizes[size]} font-extrabold tracking-tight leading-none ${
            inverted
              ? 'text-white'
              : 'text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-cyan-400 transition-colors'
          }`}
        >
          Apna
          <span className="text-brand-600 dark:text-cyan-400">Mart</span>
          <span className="text-amber-400">.</span>
        </span>

        {showTagline && (
          <span
            className={`${taglineSizes[size]} font-semibold tracking-wider uppercase -mt-0.5 ${
              inverted ? 'text-slate-400' : 'text-gray-400 dark:text-slate-400'
            } hidden sm:block`}
          >
            {taglineText}
          </span>
        )}
      </div>
    </div>
  );
};
