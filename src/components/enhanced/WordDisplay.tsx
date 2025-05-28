import React from 'react';
import { cn } from '@/lib/utils';

interface WordDisplayProps {
  word: string;
  timeLeft: number;
}

export const WordDisplay: React.FC<WordDisplayProps> = ({
  word,
  timeLeft
}) => {
  const urgencyLevel = timeLeft <= 3 ? 'urgent' : timeLeft <= 7 ? 'warning' : 'normal';

  return (
    <div className="relative z-10 text-center space-y-6 flex-1 flex flex-col justify-center">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full animate-float"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-pink-400 to-red-500 rounded-full animate-float-delayed"></div>
      </div>
      
      {/* Main word display */}
      <div className={cn(
        "text-6xl md:text-7xl font-bold text-foreground transition-all duration-300 font-devanagari",
        "hover:scale-105 cursor-default select-none",
        urgencyLevel === 'urgent' && "text-red-600"
      )}>
        {word}
      </div>
    </div>
  );
}; 