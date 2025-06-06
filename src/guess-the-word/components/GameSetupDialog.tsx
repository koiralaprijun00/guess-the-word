"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useGameState } from '../context'; // Corrected path
import { useWordSelection } from '../hooks'; // Corrected path
import TimerSelector from './TimerSelector'; // Updated path
import { Dialog, DialogContentNoClose, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'; // Updated path
import type { WordDifficulty } from '../types'; // Corrected path

export const GameSetupDialog: React.FC = () => { // Renamed component
  const { state, actions, resetSessionData, srSystem } = useGameState();
  const selectNextWord = useWordSelection();

  // State for TimerSelector
  const [selectedTimer, setSelectedTimer] = useState<number>(10); // Default value
  const [selectedDifficulty, setSelectedDifficulty] = useState<WordDifficulty>('medium'); // Default value

  const gameSettingsRef = useRef<{ timerDuration: number, difficulty: WordDifficulty } | null>(null);

  const handleConfirmSettingsAndStart = useCallback(() => {
    gameSettingsRef.current = { timerDuration: selectedTimer, difficulty: selectedDifficulty };
    actions.startSession(selectedTimer, selectedDifficulty);
    resetSessionData({});
  }, [selectedTimer, selectedDifficulty, actions, resetSessionData, srSystem]);

  useEffect(() => {
    if (state.sessionStarted && gameSettingsRef.current) {
      // const { timerDuration } = gameSettingsRef.current; // Not needed for selectNextWord
      setTimeout(() => {
        selectNextWord();
      }, 0);
      gameSettingsRef.current = null;
    }
  }, [state.sessionStarted, selectNextWord, actions]);

  // Effect for Enter key listener
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && !state.sessionStarted) {
        event.preventDefault();
        handleConfirmSettingsAndStart();
      }
    };
    if (!state.sessionStarted) { // Only add listener if dialog is open
      window.addEventListener('keydown', handleKeyPress);
      return () => {
        window.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, [state.sessionStarted, handleConfirmSettingsAndStart]); // Ensure handleConfirmSettingsAndStart is stable or in deps

  return (
    <Dialog 
      open={!state.sessionStarted} 
      onOpenChange={() => {}} // Prevents closing via X or overlay click
    >
      <DialogContentNoClose 
        className="sm:max-w-md bg-gradient-to-br from-blue-500 via-purple-500 to-pink-400 rounded-2xl shadow-2xl p-2 border-0"
        aria-describedby="game-setup-description"
      >
        <div className="bg-white rounded-md p-8 border border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
              Jhole Nepali Shabda
            </DialogTitle>
          </DialogHeader>
          <div className="mb-6 text-left text-base text-gray-700 leading-relaxed">
            <p>
              यो खेलमा रमाइलो गर्दै नेपाली शब्दहरू सिकौं।<br />
              हरेक शब्दको अर्थ बुझ्न प्रयास गरौं, साथीहरूलाई जितौं।<br />
            </p>
            <p className="mt-3 text-sm text-gray-500">
              Let's have fun and learn Nepali words together!<br />
              Try to guess the meaning of each word and beat your friends.<br />
            </p>
          </div>
          <DialogDescription id="game-setup-description" className="sr-only">
            Game setup modal to select difficulty and timer duration before starting a learning session.
          </DialogDescription>
          <TimerSelector 
            selectedTimer={selectedTimer}
            onTimerChange={setSelectedTimer}
            selectedDifficulty={selectedDifficulty}
            onDifficultyChange={setSelectedDifficulty}
            onStartGame={handleConfirmSettingsAndStart} 
          />
        </div>
      </DialogContentNoClose>
    </Dialog>
  );
}; 