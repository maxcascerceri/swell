import React, { useState, useRef, useEffect, useCallback } from 'react';

interface ComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
  variant?: 'default' | 'hero';
}

export const ComparisonSlider: React.FC<ComparisonSliderProps> = ({ 
  beforeImage, 
  afterImage,
  variant = 'default'
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percentage = Math.max(0, Math.min((x / rect.width) * 100, 100));
      setSliderPosition(percentage);
    }
  }, []);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  }, [isDragging, handleMove]);

  const onTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  }, [isDragging, handleMove]);

  const onMouseUp = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('touchend', onMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onMouseUp);
    };
  }, [isDragging, onMouseMove, onMouseUp, onTouchMove]);

  const isHero = variant === 'hero';

  // HERO VARIANT: Fixed size container, object-cover images (Landing Page)
  if (isHero) {
      return (
        <div 
          className="relative w-full h-full cursor-ew-resize select-none bg-[#F9F8F6] overflow-hidden"
          ref={containerRef}
          onMouseDown={(e) => { setIsDragging(true); handleMove(e.clientX); }}
          onTouchStart={(e) => { setIsDragging(true); handleMove(e.touches[0].clientX); }}
        >
          {/* After Image (Background) */}
          <img src={afterImage} alt="After" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />

          {/* Before Image (Foreground - Clipped) */}
          <div 
            className="absolute top-0 left-0 h-full overflow-hidden border-r-2 border-white"
            style={{ width: `${sliderPosition}%` }}
          >
            <img src={beforeImage} alt="Before" className="w-full h-full object-cover pointer-events-none max-w-none" 
                 style={{ width: containerRef.current?.offsetWidth || '100%' }} />
          </div>

          {/* Slider Handle */}
          <div className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_20px_rgba(0,0,0,0.2)] z-10" style={{ left: `${sliderPosition}%` }}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-[#F9F8F6]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C26D53" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6"/> <path d="M9 18l6-6-6-6"/>
              </svg>
            </div>
          </div>
          
           {/* Labels */}
          <div className="absolute top-6 left-6 bg-black/40 backdrop-blur-md text-white border border-white/20 px-5 py-2 rounded-xl text-sm font-bold tracking-wide pointer-events-none z-20">Before</div>
          <div className="absolute top-6 right-6 bg-[#154845]/90 backdrop-blur-md text-white border border-white/20 px-5 py-2 rounded-xl text-sm font-bold tracking-wide pointer-events-none z-20">Dream Design</div>
        </div>
      );
  }

  // DEFAULT VARIANT: Image-driven size
  return (
    <div 
      className="relative inline-block select-none cursor-ew-resize rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(21,72,69,0.15)] bg-white"
      ref={containerRef}
      onMouseDown={(e) => { setIsDragging(true); handleMove(e.clientX); }}
      onTouchStart={(e) => { setIsDragging(true); handleMove(e.touches[0].clientX); }}
    >
      {/* Base Image (Before) - Defines the Size */}
      <img 
        src={beforeImage} 
        alt="Before" 
        className="block max-w-full h-auto max-h-[70vh] w-auto object-contain pointer-events-none" 
      />

      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ 
            clipPath: `inset(0 0 0 ${sliderPosition}%)` 
        }}
      >
        <img 
            src={afterImage} 
            alt="After" 
            className="w-full h-full object-fill pointer-events-none" 
        />
      </div>

      {/* Slider Line */}
      <div 
        className="absolute inset-y-0 w-1 bg-white shadow-[0_0_15px_rgba(0,0,0,0.3)] z-10"
        style={{ left: `${sliderPosition}%` }}
      >
         {/* Handle Icon */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-[#C26D53] cursor-ew-resize hover:scale-110 transition-transform">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C26D53" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6"/> <path d="M9 18l6-6-6-6"/>
            </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-5 left-5 bg-black/40 backdrop-blur-md text-white border border-white/10 px-4 py-1.5 rounded-lg text-xs font-bold pointer-events-none z-20">Original</div>
      <div className="absolute top-5 right-5 bg-[#154845]/90 backdrop-blur-md text-white border border-white/10 px-4 py-1.5 rounded-lg text-xs font-bold pointer-events-none z-20">New Design</div>
    </div>
  );
};