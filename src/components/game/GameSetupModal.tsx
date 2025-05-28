"use client";

import React from 'react';
import { useGameState } from './GameStateProvider';
import { useSessionPersistence } from '@/hooks/use-session-persistence';
import { useWordSelection } from '@/hooks/game/useWordSelection';
import TimerSelector from '@/components/enhanced/TimerSelector';
import { Dialog, DialogContentNoClose, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { WordDifficulty } from '@/types';

export const GameSetupModal: React.FC = () => {
  const { state, actions } = useGameState();
  const { resetSessionData } = useSessionPersistence();
  const selectNextWord = useWordSelection();

  const handleStartSession = (timerDuration: number, difficulty: WordDifficulty) => {
    actions.startSession(timerDuration, difficulty);
    
    // Reset session data with fresh initial values
    resetSessionData({});
    
    // Delay selectNextWord to ensure state takes effect first
    setTimeout(() => {
      selectNextWord(timerDuration);
    }, 0);
  };

  return (
    <Dialog 
      open={!state.sessionStarted} 
      onOpenChange={() => {}} // Empty handler prevents closing via X button
    >
      <DialogContentNoClose className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gradient-yellow via-gradient-orange to-gradient-magenta bg-clip-text text-transparent">
            Jhole Nepali Shabda
          </DialogTitle>
        </DialogHeader>
        <TimerSelector onStartGame={handleStartSession} />
      </DialogContentNoClose>
    </Dialog>
  );
}; 