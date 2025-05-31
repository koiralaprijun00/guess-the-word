"use client";

import { useCallback, useRef } from 'react';
import { useGameState } from '@/components/game/GameStateProvider';
import { useWordSelection } from './useWordSelection';

// export const useEarlyAssessment = () => { ... }; // Removed entire hook

export const useFinalAssessment = () => {
  const { state, actions, sessionData, updateSessionData, srSystem } = useGameState();
  const selectNextWord = useWordSelection();
  const busyRef = useRef(false);

  return useCallback((knewIt: boolean) => {
    if (!state.currentWord || busyRef.current) return;

    busyRef.current = true;
    
    // Perform updates immediately, then schedule next word
    srSystem.updateWordStats(state.currentWord.id, knewIt);
    
    const currentShownIds = sessionData?.shownWordIds || [];
    const wordId = state.currentWord.id;
    const updatedShownIds = currentShownIds.includes(wordId) 
      ? currentShownIds 
      : [...currentShownIds, wordId];
    
    updateSessionData({
      shownWordIds: updatedShownIds,
      totalKnown: (sessionData?.totalKnown || 0) + (knewIt ? 1 : 0),
      totalUnknown: (sessionData?.totalUnknown || 0) + (knewIt ? 0 : 1)
    });
        
    actions.finalizeAssessment(knewIt);
    
    // Auto-proceed to next word after a short delay
    setTimeout(() => {
      selectNextWord();
      busyRef.current = false;
    }, 200); // Reduced delay from 1000ms to 200ms

  }, [
    state.currentWord, 
    srSystem,
    updateSessionData, 
    sessionData,
    actions, 
    selectNextWord
  ]);
}; 