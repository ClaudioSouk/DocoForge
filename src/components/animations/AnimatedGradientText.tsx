
import React, { useEffect, useRef } from "react";

interface AnimatedGradientTextProps {
  text: string;
  className?: string;
}

const AnimatedGradientText: React.FC<AnimatedGradientTextProps> = ({ text, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = container.getBoundingClientRect();
      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;
      
      container.style.setProperty('--mouse-x', `${x}`);
      container.style.setProperty('--mouse-y', `${y}`);
    };

    container.addEventListener('mousemove', handleMouseMove);
    return () => container.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className={`relative ${className || ''}`}
      style={{ 
        '--mouse-x': '0.5', 
        '--mouse-y': '0.5',
      } as React.CSSProperties}
    >
      <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-brand-600 via-brand-400 to-purple-600 bg-clip-text text-transparent animate-gradient-x relative z-10">
        {text}
      </h1>
    </div>
  );
};

export default AnimatedGradientText;
