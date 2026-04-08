import React from 'react';

export const Logo = ({ className = "w-12 h-12" }: { className?: string }) => {
  const blades = Array.from({ length: 16 });
  
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="logoClip">
          <circle cx="50" cy="50" r="46" />
        </clipPath>
      </defs>
      <g fill="#000066">
        <circle cx="50" cy="50" r="4" />
        <g clipPath="url(#logoClip)">
          {blades.map((_, i) => (
            <path
              key={i}
              d="M 48.5 46.5 Q 25 25 0 -10 L -15 5 Q 15 35 46.5 48.5 Z"
              transform={`rotate(${i * 22.5} 50 50)`}
            />
          ))}
        </g>
      </g>
    </svg>
  );
};
