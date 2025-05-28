import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EarlyAssessmentButtonsProps {
  onAssessment: (knewIt: boolean) => void;
  selectedAnswer: boolean | null;
  disabled: boolean;
  show: boolean;
}

export const EarlyAssessmentButtons: React.FC<EarlyAssessmentButtonsProps> = ({
  onAssessment,
  selectedAnswer,
  disabled,
  show
}) => {
  if (!show) return null;

  return (
    <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-4">
      <Button
        variant="outline"
        size="lg"
        className={cn(
          "bg-gradient-to-r from-green-500/10 to-emerald-500/10 hover:from-green-500/20 hover:to-emerald-500/20 border-green-500 text-green-700 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg group",
          selectedAnswer === true && "scale-110 shadow-xl bg-green-500 text-white border-green-600"
        )}
        onClick={() => onAssessment(true)}
        disabled={disabled}
      >
        <div className="flex items-center space-x-3">
          <div className={cn(
            "w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center transition-all group-hover:bg-green-500/30",
            selectedAnswer === true && "bg-white/20"
          )}>
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span className="font-semibold">I Know This!</span>
          <span className="text-xs opacity-70">(Y)</span>
        </div>
      </Button>
      
      <Button
        variant="outline" 
        size="lg"
        className={cn(
          "bg-gradient-to-r from-red-500/10 to-rose-500/10 hover:from-red-500/20 hover:to-rose-500/20 border-red-500 text-red-700 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg group",
          selectedAnswer === false && "scale-110 shadow-xl bg-red-500 text-white border-red-600"
        )}
        onClick={() => onAssessment(false)}
        disabled={disabled}
      >
        <div className="flex items-center space-x-3">
          <div className={cn(
            "w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center transition-all group-hover:bg-red-500/30",
            selectedAnswer === false && "bg-white/20"
          )}>
            <XCircle className="w-5 h-5" />
          </div>
          <span className="font-semibold">Need to Learn</span>
          <span className="text-xs opacity-70">(N)</span>
        </div>
      </Button>
    </div>
  );
}; 