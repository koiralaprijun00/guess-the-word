"use client";

import React from 'react';
import { Clock } from 'lucide-react';
import { useGameState } from '../context';
import { ProgressBar } from './ProgressBar';
import { Button } from './ui/button';

export const GameHeader: React.FC = () => {
  const { state, actions } = useGameState();

  if (!state.sessionStarted) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl p-4 bg-slate-50 rounded-lg shadow-md flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-x-4 gap-y-3">
        <h1 className="text-xl font-bold font-english bg-gradient-to-r from-gradient-yellow via-gradient-orange to-gradient-magenta bg-clip-text text-transparent text-center sm:text-left">
          Jhole Nepali Shabda
        </h1>
        <div className="flex flex-col items-center gap-x-4 gap-y-2 sm:flex-row sm:gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="font-medium uppercase tracking-wide">Time:</span>
            <span className="font-semibold">{state.timerDuration}s</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium uppercase tracking-wide">Mode:</span>
            <span className="font-semibold capitalize">{state.difficulty}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-grow">
          <ProgressBar />
        </div>
        <div className="flex-shrink-0">
          <Button variant="outline" onClick={() => actions.showEndSessionConfirm(true)}>
            Restart Game
          </Button>
        </div>
      </div>
    </div>
  );
}; 