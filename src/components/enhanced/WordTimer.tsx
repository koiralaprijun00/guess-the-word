import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WordTimerProps {
  timeLeft: number;
  timerDuration: number;
  meaningsVisible: boolean;
}

export const WordTimer: React.FC<WordTimerProps> = ({
  timeLeft,
  timerDuration,
  meaningsVisible
}) => {
  const timerProgress = timerDuration > 0 ? ((timerDuration - timeLeft) / timerDuration) * 100 : 0;
  const urgencyLevel = timeLeft <= 3 ? 'urgent' : timeLeft <= 7 ? 'warning' : 'normal';

  if (meaningsVisible) return null;

  return (
    <div className="space-y-4 -mx-4 px-4">
      <div className="relative">
        <Progress 
          value={timerProgress} 
          className={cn(
            "w-full h-3 transition-all duration-300"
          )}
        />
        <div className={cn(
          "absolute inset-0 rounded-full",
          urgencyLevel === 'urgent' && "bg-red-500/20"
        )}></div>
      </div>
      
      <div className="flex items-center justify-center space-x-2">
        <Clock className={cn(
          "w-4 h-4 transition-colors",
          urgencyLevel === 'urgent' ? "text-red-500" : 
          urgencyLevel === 'warning' ? "text-orange-500" : "text-muted-foreground"
        )} />
        <span className={cn(
          "text-lg font-mono font-semibold transition-colors",
          urgencyLevel === 'urgent' ? "text-red-500" : 
          urgencyLevel === 'warning' ? "text-orange-500" : "text-muted-foreground"
        )}>
          {timeLeft}s
        </span>
      </div>
    </div>
  );
}; 