import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimerSelectorProps {
  selectedDuration: number;
  onDurationChange: (duration: number) => void;
  disabled?: boolean;
}

export const EnhancedTimerSelector: React.FC<TimerSelectorProps> = ({
  selectedDuration,
  onDurationChange,
  disabled = false
}) => {
  const options = [5, 8, 10, 15];
  
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex items-center space-x-2">
        <Clock className="w-5 h-5 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground/80">Timer Duration</span>
      </div>
      
      <div className="flex space-x-2">
        {options.map((option) => (
          <Button
            key={option}
            variant={selectedDuration === option ? "default" : "outline"}
            size="sm"
            className={cn(
              "min-w-[3rem] transition-all duration-200",
              selectedDuration === option ? 
                "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg scale-105" :
                "hover:scale-105 hover:shadow-md",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => onDurationChange(option)}
            disabled={disabled}
          >
            {option}s
          </Button>
        ))}
      </div>
    </div>
  );
}; 