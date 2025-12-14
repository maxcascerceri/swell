import React from 'react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-white/50 backdrop-blur-md rounded-3xl border border-white/50">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 border-4 border-[#E2E8F0] rounded-full"></div>
        <div className="absolute inset-0 border-4 border-[#C26D53] rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center animate-bounce text-3xl">
            ✨
        </div>
      </div>
      <h3 className="text-3xl font-bold text-[#154845] mb-3 text-center">
        Designing your space...
      </h3>
      <p className="text-[#64748B] max-w-xs text-center text-base font-medium">
        Analyzing layout, applying styles, and rendering your new room!
      </p>
    </div>
  );
};