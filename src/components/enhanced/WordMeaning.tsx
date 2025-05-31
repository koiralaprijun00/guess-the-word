import React from 'react';
// import { Button } from '@/components/ui/button'; // Removed
// import { CheckCircle2, XCircle } from 'lucide-react'; // Removed
// import { cn } from '@/lib/utils'; // Removed, if not used elsewhere

interface WordMeaningProps {
  word: {
    roman: string;
    meaning_nepali: string;
    meaning_english: string;
  };
  // onFinalAssessment?: (knewIt: boolean) => void; // Removed
  // selectedFinalAnswer: boolean | null; // Removed
  // showFinalAssessment: boolean; // Removed
}

export const WordMeaning: React.FC<WordMeaningProps> = ({
  word,
  // onFinalAssessment, // Removed
  // selectedFinalAnswer, // Removed
  // showFinalAssessment // Removed
}) => {
  // const handleFinalAssessment = (knewIt: boolean) => { // Removed
  // onFinalAssessment?.(knewIt); // Removed
  // }; // Removed

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

      {/* Final Assessment Buttons - REMOVED */}
      {/* {showFinalAssessment && ( ... )} */}
    </div>
  );
}; 