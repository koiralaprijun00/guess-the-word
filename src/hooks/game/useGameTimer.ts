"use client";

import { useEffect } from 'react';
import { useGameState } from '@/components/game/GameStateProvider';

export const useGameTimer = () => {
  const { state, actions } = useGameState();

  useEffect(() => {
    if (!state.isTimerRunning || state.timeLeft <= 0) return;

    const timerId = setTimeout(() => {
      actions.tick();
    }, 1000);

    return () => clearTimeout(timerId);
  }, [state.isTimerRunning, state.timeLeft, actions]);

  return {
    timeLeft: state.timeLeft,
    isRunning: state.isTimerRunning,
    start: actions.startTimer,
    stop: () => actions.showMeanings(),
  };
}; 