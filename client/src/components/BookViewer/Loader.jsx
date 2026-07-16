import React from "react";
import { Loader2 } from "lucide-react";

export function Loader({ progress, total }) {
  const percentage = total > 0 ? Math.round((progress / total) * 100) : 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] w-full bg-gradient-to-b from-[#121212] to-[#080808] rounded-2xl border border-white/5 p-8 text-center shadow-2xl">
      <div className="relative mb-6">
        {/* Outer glowing effect */}
        <div className="absolute inset-0 bg-[#F5B400]/10 rounded-full blur-2xl animate-pulse" />
        <Loader2 className="h-16 w-16 text-[#F5B400] animate-spin relative z-10" />
      </div>
      
      <h3 className="font-heading text-xl font-semibold text-white tracking-wide mb-2">
        Preparing Premium Catalogue
      </h3>
      <p className="text-white/40 text-sm font-body max-w-xs mb-6">
        Rendering pages for high-definition 3D experience.
      </p>

      {/* Progress Bar */}
      {total > 0 && (
        <div className="w-64">
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#F5B400] to-[#FFD056] transition-all duration-300 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-2 text-[11px] font-mono tracking-wider text-white/50">
            <span>{percentage}% LOADED</span>
            <span>{progress} / {total} PAGES</span>
          </div>
        </div>
      )}
    </div>
  );
}
