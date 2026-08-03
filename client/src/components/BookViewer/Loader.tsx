'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoaderProps {
  progress: number;
  total: number;
}

export function Loader({ progress, total }: LoaderProps) {
  const percentage = total > 0 ? Math.min(Math.round((progress / total) * 100), 100) : 0;

  const formatProgressText = () => {
    if (total > 10000) {
      const loadedMb = (progress / (1024 * 1024)).toFixed(1);
      const totalMb = (total / (1024 * 1024)).toFixed(1);
      return `${loadedMb} MB / ${totalMb} MB`;
    }
    return `${progress} / ${total} PAGES`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[350px] sm:min-h-[500px] w-full bg-gradient-to-b from-[#121212] to-[#080808] rounded-2xl border border-white/5 p-6 sm:p-8 text-center shadow-2xl">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-[#F5B400]/10 rounded-full blur-2xl animate-pulse" />
        <Loader2 className="h-14 w-14 sm:h-16 sm:w-16 text-[#F5B400] animate-spin relative z-10" />
      </div>
      
      <h3 className="font-heading text-lg sm:text-xl font-semibold text-white tracking-wide mb-2">
        Preparing Premium Catalogue
      </h3>
      <p className="text-white/40 text-xs sm:text-sm font-body max-w-xs mb-6">
        Rendering pages for high-definition 3D experience.
      </p>

      {total > 0 && (
        <div className="w-full max-w-xs px-2">
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#F5B400] to-[#FFD056] transition-all duration-300 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-2.5 text-[11px] font-mono tracking-wider text-white/60">
            <span className="text-[#F5B400] font-semibold">{percentage}% LOADED</span>
            <span>{formatProgressText()}</span>
          </div>
        </div>
      )}
    </div>
  );
}