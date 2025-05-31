// src/components/game/ProgressAndControlsSection.tsx
"use client";

import React from 'react';
import { WordProgressBar } from './ProgressBar'; // Assuming ProgressBar.tsx exists and exports WordProgressBar
import { EndGameButton } from './EndGameButton';
import { useGameState } from './GameStateProvider';

export const ProgressAndControlsSection: React.FC = () => {
  const { actions, state } = useGameState();

  // Only render if the session has started
  if (!state.sessionStarted) {
    return null;
  }

  return (
    <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-lg shadow-md">
      <div className="flex-grow"> {/* This div will ensure progress bar takes available space */}
        <WordProgressBar />
      </div>
      <div className="flex-shrink-0"> {/* This div will prevent button from shrinking/wrapping unnecessarily */}
        <EndGameButton endSession={actions.endSession} />
      </div>
    </div>
  );
};
