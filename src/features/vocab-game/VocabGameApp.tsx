"use client";

import React from 'react';
import { GameStateProvider } from './context'; // Changed path
import { GameHeader } from './components/GameHeader'; // Path to be updated
import { GameSetupDialog } from './components/GameSetupDialog'; // Updated import
import { WordCard } from './components/WordCard'; // Updated import
import { EndSessionDialog } from './components/EndSessionDialog'; // Updated import
import { KeyboardNavigationHandler } from './components/KeyboardNavigationHandler'; // Path to be updated
import { GameTimerEffect } from './components/GameTimerEffect'; // Path to be updated
import { Toaster } from './components/ui/toaster'; // Import Toaster
import { useGameState } from './context'; // For actions.showEndSessionConfirm // THIS IMPORT REMAINS

export function VocabGameApp() {
  // const { state, actions } = useGameState(); // THIS LINE IS REMOVED

  return (
    <GameStateProvider>
      <AppContent />
    </GameStateProvider>
  );
}

// New inner component to access context
const AppContent: React.FC = () => {
  const { state, actions } = useGameState(); // This line should remain

  return (
    <main className="flex flex-col items-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-900 p-4 selection:bg-primary/20 overflow-hidden">
      <GameSetupDialog />
      
      {state.sessionStarted && (
        <div className="w-full max-w-2xl flex flex-col justify-start space-y-8 sm:space-y-8 mt-8">
          <GameHeader />
          <WordCard />
        </div>
      )}
      
      <EndSessionDialog />
      <KeyboardNavigationHandler />
      <GameTimerEffect />
      <Toaster />
    </main>
  );
} 