// src/components/game/GameHeader.tsx

"use client";

import React from 'react';
import { Clock } from 'lucide-react';
import { useGameState } from './GameStateProvider';

export const GameHeader: React.FC = () => {
  const { state } = useGameState(); // Destructure actions, actions removed

  // Only show header content if session has started
  if (!state.sessionStarted) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3 w-full max-w-2xl p-3 bg-slate-50 rounded-lg shadow">
      <h1 className="text-xl font-bold font-english bg-gradient-to-r from-gradient-yellow via-gradient-orange to-gradient-magenta bg-clip-text text-transparent text-center sm:text-left">
        Jhole Nepali Shabda
      </h1>
      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span className="font-medium uppercase tracking-wide">Time:</span>
          <span className="font-semibold">{state.timerDuration}s</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium uppercase tracking-wide">Mode:</span>
          <span className="font-semibold capitalize">{state.difficulty}</span>
        </div>
        {/* End Game Button and AlertDialog logic has been moved to EndGameButton.tsx */}
      </div>
    </div>
  );
};