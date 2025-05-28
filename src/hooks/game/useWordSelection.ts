"use client";

import { useCallback } from 'react';
import { useGameState } from '@/components/game/GameStateProvider';
import { useSpacedRepetition } from '@/hooks/use-spaced-repetition';
import { useToast } from '@/hooks/use-toast';

export const useWordSelection = () => {
  const { state, actions } = useGameState();
  const { getNextWord } = useSpacedRepetition({ difficulty: state.difficulty });
  const { toast } = useToast();

  const selectNextWord = useCallback(async (overrideTimerDuration?: number) => {
    actions.selectNextWord(); // Sets loading state

    const nextWord = getNextWord();

    if (!nextWord) {
      toast({ 
        title: "Session Complete!", 
        description: "You've reviewed all available words for this game mode." 
      });
      actions.endSession();
      return;
    }

    actions.setCurrentWord(nextWord);
  }, [getNextWord, actions, toast]);

  return selectNextWord;
}; 