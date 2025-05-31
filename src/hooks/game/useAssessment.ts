"use client";

import { useCallback, useRef } from 'react';
import { useGameState } from '@/components/game/GameStateProvider';
import { useWordSelection } from './useWordSelection';

export const useEarlyAssessment = () => {
  const { state, actions, sessionData, updateSessionData, srSystem } = useGameState();
  const selectNextWord = useWordSelection();
  const busyRef = useRef(false); // Prevent rapid clicking

  return useCallback((knewIt: boolean) => {
    if (!state.currentWord || busyRef.current) return;
    
    busyRef.current = true;
    actions.makeEarlyAssessment(knewIt);
    
    if (knewIt) {
      // Defer non-critical updates to keep UI responsive
      setTimeout(() => {
        if (!state.currentWord) {
          busyRef.current = false;
          return;
        }
        
        srSystem.updateWordStats(state.currentWord.id, true);
        
        const currentShownIds = sessionData?.shownWordIds || [];
        const wordId = state.currentWord.id;
        const updatedShownIds = currentShownIds.includes(wordId) 
          ? currentShownIds 
          : [...currentShownIds, wordId];
        
        updateSessionData({
          shownWordIds: updatedShownIds,
          totalKnown: (sessionData?.totalKnown || 0) + 1,
        });
                
        actions.finalizeAssessment(true);
        
        setTimeout(() => {
          selectNextWord();
          busyRef.current = false;
        }, 1000); // Delay for user to see the card back
      }, 50); // Small delay to allow UI to update before heavier logic
    } else {
      // If user clicks "Need to learn" (or similar, if that was an option for early), 
      // meaning is shown, but no immediate word change or stat update here.
      // Final assessment will handle it.
      // We must reset busyRef if we are not proceeding via the knewIt path.
      busyRef.current = false;
    }
  }, [state.currentWord, actions, srSystem, updateSessionData, sessionData, selectNextWord]);
};

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