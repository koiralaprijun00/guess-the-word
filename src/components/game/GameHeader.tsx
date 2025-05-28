"use client";

import React from 'react';
import { Clock } from 'lucide-react';
import { useGameState } from './GameStateProvider';

export const GameHeader: React.FC = () => {
  const { state } = useGameState();
  
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2 sm:gap-0 w-full max-w-2xl">
      <h1 className="text-2xl font-bold font-english bg-gradient-to-r from-gradient-yellow via-gradient-orange to-gradient-magenta bg-clip-text text-transparent text-center sm:text-left">
        Jhole Nepali Shabda
      </h1>
      <div className="flex items-center gap-4 text-muted-foreground justify-center sm:justify-end">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span className="text-xs font-medium uppercase tracking-wide">Time Duration</span>
          <span className="font-medium">{state.timerDuration}s</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wide">Game Mode</span>
          <span className="font-medium capitalize">{state.difficulty}</span>
        </div>
      </div>
    </div>
  );
}; 