"use client";

import React from 'react';
import { useGameState } from '../context'; // Corrected path
import { Progress } from './ui/progress'; // Updated path

export const ProgressBar: React.FC = () => { // Renamed component
  const { state } = useGameState();
  const { knownWords, unknownWords, totalWords, sessionStarted } = state;

  if (!sessionStarted || totalWords === 0) {
    return null;
  }

  const wordsProcessed = knownWords + unknownWords;
  const progressPercentage = (wordsProcessed / totalWords) * 100;

  return (
    <div className="w-full">
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
    </div>
  );
}; 