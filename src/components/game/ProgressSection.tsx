"use client";

import React, { useMemo } from 'react';
import { useGameState } from './GameStateProvider';
import { useSpacedRepetition } from '@/hooks/use-spaced-repetition';
import { EnhancedStatsCard } from '@/components/enhanced';
import { Button } from '@/components/ui/button';
import { initialWordList } from '@/data/words';

export const ProgressSection: React.FC = () => {
  const { state, actions, sessionData } = useGameState(); // Get sessionData from centralized context
  const { resetWordStats } = useSpacedRepetition({ difficulty: state.difficulty });

  // Get filtered words by difficulty
  const filteredWords = useMemo(() => {
    return initialWordList.filter(word => word.difficulty === state.difficulty);
  }, [state.difficulty]);

  const progressPercentage = useMemo(() => {
    if (!state.isClientMounted || filteredWords.length === 0) return 0;
    
    const shownCount = sessionData?.shownWordIds?.length || 0;
    const totalCount = filteredWords.length;
    const percentage = (shownCount / totalCount) * 100;
    
    // Enhanced debug logging to identify 16/20 issue
    console.log('Progress Debug:', {
      isClientMounted: state.isClientMounted,
      difficulty: state.difficulty,
      shownWordsCount: shownCount,
      totalFilteredWords: totalCount,
      fullWordListSize: initialWordList.length,
      percentage,
      shownWordIds: sessionData?.shownWordIds || [],
      sessionData: sessionData,
      filteredWordsIds: filteredWords.map(w => w.id)
    });
    
    return percentage;
  }, [state.isClientMounted, sessionData?.shownWordIds?.length, filteredWords.length, sessionData, state.difficulty, filteredWords]);

  const handleEndSession = () => {
    // Reset all session data and progress
    actions.endSession();
    resetWordStats(); // Reset spaced repetition progress
  };

  if (!state.sessionStarted) return null;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:space-x-4 mt-2 items-stretch w-full max-w-2xl">
      <div className="flex-1">
        <EnhancedStatsCard
          sessionData={state.isClientMounted ? (sessionData || { totalKnown: 0, totalUnknown: 0, shownWordIds: [] }) : { totalKnown: 0, totalUnknown: 0, shownWordIds: [] }}
          progressPercentage={state.isClientMounted ? progressPercentage : 0}
          allWordsLength={filteredWords.length}
        />
      </div>
      <div className="flex flex-col gap-2 w-full sm:w-auto">
        <Button 
          variant="outline" 
          onClick={() => actions.showEndSessionConfirm(true)} 
          className="w-full h-full hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-300"
        >
          End Session
        </Button>
      </div>
    </div>
  );
}; 