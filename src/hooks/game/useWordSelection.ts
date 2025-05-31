"use client";

import { useCallback } from 'react';
import { useGameState } from '@/components/game/GameStateProvider';
import { useToast } from '@/hooks/use-toast';

export const useWordSelection = () => {
  const { state, actions, srSystem } = useGameState();
  const { toast } = useToast();

  const selectNextWord = useCallback(async (overrideTimerDuration?: number) => {
    console.log('[WS] selectNextWord called. Current game state:', state);
    actions.selectNextWord(); // Sets loading state

    const nextWord = srSystem.getNextWord();
    console.log('[WS] Word received from getNextWord:', nextWord ? nextWord.id : 'null');

    if (!nextWord) {
      toast({ 
        title: "Session Complete!", 
        description: "You've reviewed all available words for this game mode." 
      });
      console.log('[WS] No next word. Ending session.');
      actions.endSession();
      return;
    }

    console.log('[WS] Setting current word:', nextWord.id);
    actions.setCurrentWord(nextWord);
  }, [srSystem, actions, toast, state]);

  return selectNextWord;
}; 