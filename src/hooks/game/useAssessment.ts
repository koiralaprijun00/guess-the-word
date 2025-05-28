"use client";

import { useCallback } from 'react';
import { useGameState } from '@/components/game/GameStateProvider';
import { useSpacedRepetition } from '@/hooks/use-spaced-repetition';
import { useSessionPersistence } from '@/hooks/use-session-persistence';
import { useWordSelection } from './useWordSelection';

export const useEarlyAssessment = () => {
  const { state, actions } = useGameState();
  const { updateWordStats } = useSpacedRepetition({ difficulty: state.difficulty });
  const { updateSessionData, sessionData } = useSessionPersistence();
  const selectNextWord = useWordSelection();

  return useCallback((knewIt: boolean) => {
    if (!state.currentWord) return;
    
    actions.makeEarlyAssessment(knewIt);
    
    // If they knew it early, we can skip to next word after showing meaning briefly
    if (knewIt) {
      // For early assessment that auto-proceeds, we need to update the session data immediately
      setTimeout(() => {
        if (!state.currentWord) return;
        
        // Update learning algorithm
        updateWordStats(state.currentWord.id, true);
        
        // Update session stats - ensure word is in shownWordIds and update scores
        const currentShownIds = sessionData?.shownWordIds || [];
        const wordId = state.currentWord.id;
        
        // Add word to shown list if not already there
        const updatedShownIds = currentShownIds.includes(wordId) 
          ? currentShownIds 
          : [...currentShownIds, wordId];
        
        updateSessionData({
          shownWordIds: updatedShownIds,
          totalKnown: (sessionData?.totalKnown || 0) + 1,
          totalUnknown: (sessionData?.totalUnknown || 0)
        });
        
        // Debug logging
        console.log('Early Assessment - Session Data Update:', {
          wordId: state.currentWord.id,
          updatedShownIds,
          newTotalKnown: (sessionData?.totalKnown || 0) + 1,
          newTotalUnknown: (sessionData?.totalUnknown || 0),
          previousSessionData: sessionData
        });
        
        actions.finalizeAssessment(true);
        
        // Auto-proceed to next word
        setTimeout(() => {
          selectNextWord();
        }, 1000);
      }, 2000);
    }
  }, [state.currentWord, actions, updateWordStats, updateSessionData, sessionData, selectNextWord]);
};

export const useFinalAssessment = () => {
  const { state, actions } = useGameState();
  const { updateWordStats } = useSpacedRepetition({ difficulty: state.difficulty });
  const { updateSessionData, sessionData } = useSessionPersistence();
  const selectNextWord = useWordSelection();

  return useCallback((knewIt: boolean) => {
    if (!state.currentWord) return;

    // Update learning algorithm
    updateWordStats(state.currentWord.id, knewIt);
    
    // Update session stats - ensure word is in shownWordIds and update scores
    const currentShownIds = sessionData?.shownWordIds || [];
    const wordId = state.currentWord.id;
    
    // Add word to shown list if not already there
    const updatedShownIds = currentShownIds.includes(wordId) 
      ? currentShownIds 
      : [...currentShownIds, wordId];
    
    updateSessionData({
      shownWordIds: updatedShownIds,
      totalKnown: (sessionData?.totalKnown || 0) + (knewIt ? 1 : 0),
      totalUnknown: (sessionData?.totalUnknown || 0) + (knewIt ? 0 : 1)
    });
    
    // Debug logging
    console.log('Final Assessment - Session Data Update:', {
      wordId: state.currentWord.id,
      knewIt,
      updatedShownIds,
      newTotalKnown: (sessionData?.totalKnown || 0) + (knewIt ? 1 : 0),
      newTotalUnknown: (sessionData?.totalUnknown || 0) + (knewIt ? 0 : 1),
      previousSessionData: sessionData
    });
    
    // Mark assessment as done
    actions.finalizeAssessment(knewIt);
    
    // Auto-proceed to next word after a short delay
    setTimeout(() => {
      selectNextWord();
    }, 1000);
  }, [
    state.currentWord, 
    updateWordStats, 
    updateSessionData, 
    sessionData,
    actions, 
    selectNextWord
  ]);
}; 