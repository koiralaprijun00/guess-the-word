import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WordMeaningProps {
  word: {
    roman: string;
    meaning_nepali: string;
    meaning_english: string;
  };
  onFinalAssessment?: (knewIt: boolean) => void;
  selectedFinalAnswer: boolean | null;
  showFinalAssessment: boolean;
}

export const WordMeaning: React.FC<WordMeaningProps> = ({
  word,
  onFinalAssessment,
  selectedFinalAnswer,
  showFinalAssessment
}) => {
  const handleFinalAssessment = (knewIt: boolean) => {
    onFinalAssessment?.(knewIt);
  };

  return (
    <div className="space-y-6 text-center">
      {/* Roman transliteration */}
      <div className="text-2xl md:text-3xl font-semibold text-muted-foreground font-english">
        {word.roman}
      </div>
      
      {/* Meanings */}
      <div className="space-y-4">
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
            नेपाली अर्थ
          </div>
          <div className="text-lg text-foreground font-devanagari leading-relaxed">
            {word.meaning_nepali}
          </div>
        </div>
        
        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">
            English Meaning
          </div>
          <div className="text-lg text-foreground font-english leading-relaxed">
            {word.meaning_english}
          </div>
        </div>
      </div>

      {/* Final Assessment Buttons */}
      {showFinalAssessment && (
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 pt-4">
          <Button
            variant="outline"
            size="lg"
            className={cn(
              "bg-gradient-to-r from-green-500/10 to-emerald-500/10 hover:from-green-500/20 hover:to-emerald-500/20 border-green-500 text-green-700 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg group",
              selectedFinalAnswer === true && "scale-110 shadow-xl bg-green-500 text-white border-green-600"
            )}
            onClick={() => handleFinalAssessment(true)}
            disabled={selectedFinalAnswer !== null}
          >
            <div className="flex items-center space-x-3">
              <div className={cn(
                "w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center transition-all group-hover:bg-green-500/30",
                selectedFinalAnswer === true && "bg-white/20"
              )}>
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="font-semibold">I Knew It!</span>
              <span className="text-xs opacity-70">(Y)</span>
            </div>
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className={cn(
              "bg-gradient-to-r from-red-500/10 to-rose-500/10 hover:from-red-500/20 hover:to-rose-500/20 border-red-500 text-red-700 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg group",
              selectedFinalAnswer === false && "scale-110 shadow-xl bg-red-500 text-white border-red-600"
            )}
            onClick={() => handleFinalAssessment(false)}
            disabled={selectedFinalAnswer !== null}
          >
            <div className="flex items-center space-x-3">
              <div className={cn(
                "w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center transition-all group-hover:bg-red-500/30",
                selectedFinalAnswer === false && "bg-white/20"
              )}>
                <XCircle className="w-5 h-5" />
              </div>
              <span className="font-semibold">I Didn't Know</span>
              <span className="text-xs opacity-70">(N)</span>
            </div>
          </Button>
        </div>
      )}
    </div>
  );
}; 