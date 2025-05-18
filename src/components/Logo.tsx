import React from 'react';
import { FileText } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  withText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = "md", withText = true }) => {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10"
  };
  
  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  };
  
  return (
    <div className="flex items-center gap-2">
      <div className="bg-brand-600 text-white p-1 rounded-md">
        <FileText className={sizeClasses[size]} />
      </div>
      {withText && (
        <span className={`font-bold ${textSizeClasses[size]}`}>
          <span className="text-brand-600">Docu</span>
          <span>Forge</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
