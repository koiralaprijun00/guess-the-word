"use client";

import React from 'react';
import { WordMasterErrorBoundary } from "@/components/app/WordMasterErrorBoundary";
import { GameStateProvider } from '@/components/game/GameStateProvider';
import { GameHeader } from '@/components/game/GameHeader';
import { GameSetupModal } from '@/components/game/GameSetupModal';
import { WordDisplaySection } from '@/components/game/WordDisplaySection';
import { SessionEndDialog } from '@/components/game/SessionEndDialog';
import { KeyboardNavigationHandler } from '@/components/game/KeyboardNavigationHandler';
import { GameTimerEffect } from '@/components/game/GameTimerEffect';

export default function NepaliWordMasterPage() {
  return (
    <WordMasterErrorBoundary>
      <GameStateProvider>
        <main className="flex flex-col items-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-900 p-4 selection:bg-primary/20 overflow-hidden">
          
          {/* Game Setup Modal */}
          <GameSetupModal />
          
          {/* Main Game Content */}
          <div className="w-full max-w-2xl flex flex-col justify-start space-y-8 sm:space-y-8">
            
            {/* Header with Game Info */}
            <GameHeader />
            
            {/* Word Display Section */}
            <WordDisplaySection />
            
          </div>
          
          {/* Session End Confirmation */}
          <SessionEndDialog />
          
          {/* Side Effect Handlers */}
          <KeyboardNavigationHandler />
          <GameTimerEffect />
          
        </main>
      </GameStateProvider>
    </WordMasterErrorBoundary>
  );
}
