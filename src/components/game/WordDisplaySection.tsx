"use client";

import React from 'react';
import { useGameState } from './GameStateProvider';
import { /* useEarlyAssessment, */ useFinalAssessment } from '@/hooks/game/useAssessment';
import { EnhancedWordDisplayCard } from '@/components/enhanced';
import { WordProgressBar } from '@/components/game';

export const WordDisplaySection: React.FC = () => {
  const { state } = useGameState();
  // const earlyAssessment = useEarlyAssessment();
  const finalAssessment = useFinalAssessment();
  
  if (!state.sessionStarted || !state.currentWord) return null;
  
  return (
    <div className="w-full max-w-2xl space-y-4"> {/* Added space-y-4 for spacing */}
      <WordProgressBar />
      <EnhancedWordDisplayCard
        word={state.currentWord}
        timeLeft={state.timeLeft}
        timerDuration={state.timerDuration}
        meaningsVisible={state.meaningsVisible}
        isLoadingWord={state.isLoadingWord}
        // onEarlyAssessment={earlyAssessment}
        onFinalAssessment={finalAssessment}
        showFinalAssessment={state.meaningsVisible && !state.assessmentDone}
      />
    </div>
  );
}; 