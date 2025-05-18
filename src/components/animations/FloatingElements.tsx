
import React from "react";

interface FloatingElement {
  id: number;
  size: number;
  x: string;
  y: string;
  delay: string;
  duration: string;
  shape: "circle" | "square" | "triangle" | "hexagon";
  opacity: string;
}

interface FloatingElementsProps {
  count?: number;
  children?: React.ReactNode;
  tech?: boolean;
  density?: "low" | "medium" | "high";
}

const FloatingElements: React.FC<FloatingElementsProps> = ({ 
  count = 15, 
  children, 
  tech = false,
  density = "medium" 
}) => {
  // Adjust element count based on density
  const elementCount = {
    low: Math.floor(count * 0.5),
    medium: count,
    high: Math.floor(count * 1.5)
  }[density];
  
  // Generate random floating elements
  const elements: FloatingElement[] = Array.from({ length: elementCount }, (_, i) => {
    const shapes = ["circle", "square", "triangle", "hexagon"];
    return {
      id: i,
      size: Math.floor(Math.random() * 30) + 10, // 10px to 40px
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 10 + 15}s`, // 15s to 25s
      shape: shapes[Math.floor(Math.random() * shapes.length)] as "circle" | "square" | "triangle" | "hexagon",
      opacity: `${Math.random() * 0.15 + 0.05}`, // 0.05 to 0.2
    };
  });

  const getShapeClasses = (shape: string) => {
    switch(shape) {
      case "square": return "rounded-md";
      case "triangle": return "clip-path-triangle";
      case "hexagon": return "clip-path-hexagon";
      default: return "rounded-full";
    }
  };

  return (
    <div className="relative w-full overflow-hidden">
      {elements.map((element) => {
        const isCircle = element.shape === "circle";
        const baseClasses = tech ? 
          "absolute backdrop-blur-sm border border-brand-300/30" :
          "absolute blur-md";
          
        const shapeClasses = getShapeClasses(element.shape);
        const bgClasses = tech ? 
          "bg-gradient-to-br from-brand-300/10 to-purple-300/10" : 
          "bg-brand-300/20";
          
        return (
          <div
            key={element.id}
            className={`${baseClasses} ${shapeClasses} ${bgClasses}`}
            style={{
              width: `${element.size}px`,
              height: `${element.size}px`,
              top: element.y,
              left: element.x,
              opacity: element.opacity,
              animation: `float ${element.duration} ease-in-out ${element.delay} infinite alternate, 
                         ${tech ? "spin-slow 30s linear infinite" : ""}`,
              zIndex: 0,
            }}
          />
        );
      })}
      <div className="relative z-10">{children}</div>

      {tech && (
        <>
          {/* Tech grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_39px,#8b5cf620_39px,#8b5cf620_41px,transparent_41px),linear-gradient(180deg,transparent_39px,#8b5cf620_39px,#8b5cf620_41px,transparent_41px)] bg-[length:40px_40px] pointer-events-none"></div>
        </>
      )}
    </div>
  );
};

export default FloatingElements;
