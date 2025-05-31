"use client";

import React from 'react';
import { useGameState } from './GameStateProvider';
import { Progress } from '@/components/ui/progress'; // Assuming this is the correct path

export const WordProgressBar: React.FC = () => {
  const { state } = useGameState();
  const { knownWords, unknownWords, totalWords, sessionStarted } = state;

  if (!sessionStarted || totalWords === 0) {
    return null; // Don't show progress bar if session hasn't started or no words
  }

  const wordsProcessed = knownWords + unknownWords;
  const progressPercentage = (wordsProcessed / totalWords) * 100;

  return (
    <div className="w-full p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-2 text-sm font-medium">
        <span className="text-blue-600">
          Progress: {wordsProcessed} / {totalWords}
        </span>
        <div className="space-x-2">
          <span className="text-green-600">Known: {knownWords}</span>
          <span className="text-red-600">Unknown: {unknownWords}</span>
        </div>
      </div>
      <Progress value={progressPercentage} className="w-full h-3" />
      {/* Optional: Display percentage text on progress bar if desired */}
      {/* <div className="text-xs text-center mt-1">{`${Math.round(progressPercentage)}%`}</div> */}
    </div>
  );
};
