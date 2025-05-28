"use client";

import { useGameTimer } from '@/hooks/game/useGameTimer';

export const GameTimerEffect: React.FC = () => {
  // This component just initializes the timer hook
  // The actual timer logic is contained within the hook
  useGameTimer();
  
  return null; // This component only handles side effects
}; 