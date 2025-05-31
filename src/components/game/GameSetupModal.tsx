"use client";

import React, { useEffect, useRef } from 'react';
import { useGameState } from './GameStateProvider';
import { useWordSelection } from '@/hooks/game/useWordSelection';
import TimerSelector from '@/components/enhanced/TimerSelector';
import { Dialog, DialogContentNoClose, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import type { WordDifficulty } from '@/types';

export const GameSetupModal: React.FC = () => {
  const { state, actions, resetSessionData, srSystem } = useGameState();
  const selectNextWord = useWordSelection();

  const gameSettingsRef = useRef<{ timerDuration: number, difficulty: WordDifficulty } | null>(null);

  const handleStartSession = (timerDuration: number, difficulty: WordDifficulty) => {
    gameSettingsRef.current = { timerDuration, difficulty };
    actions.startSession(timerDuration, difficulty);
    resetSessionData({});
    srSystem.resetWordStats();
  };

  useEffect(() => {
    if (state.sessionStarted && gameSettingsRef.current) {
      const { timerDuration } = gameSettingsRef.current;
      setTimeout(() => {
        selectNextWord(timerDuration);
      }, 0);
      gameSettingsRef.current = null;
    }
  }, [state.sessionStarted, selectNextWord, actions]);

  return (
    <Dialog 
      open={!state.sessionStarted} 
      onOpenChange={() => {}} // Empty handler prevents closing via X button
    >
      <DialogContentNoClose className="sm:max-w-md" aria-describedby="game-setup-description">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gradient-yellow via-gradient-orange to-gradient-magenta bg-clip-text text-transparent">
            Jhole Nepali Shabda
          </DialogTitle>
        </DialogHeader>
        <DialogDescription id="game-setup-description" className="sr-only">
          Game setup modal to select difficulty and timer duration before starting a learning session.
        </DialogDescription>
        <TimerSelector onStartGame={handleStartSession} />
      </DialogContentNoClose>
    </Dialog>
  );
}; 