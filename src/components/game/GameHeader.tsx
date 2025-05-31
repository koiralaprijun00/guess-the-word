// src/components/game/GameHeader.tsx

"use client";

import React, { useState } from 'react'; // Added useState
import { Clock, XCircle } from 'lucide-react'; // Added XCircle for the button icon
import { useGameState } from './GameStateProvider';
import { Button } from '@/components/ui/button'; // Ensure this path is correct
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"; // Added AlertDialog components

export const GameHeader: React.FC = () => {
  const { state, actions } = useGameState(); // Destructure actions
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false); // Added showConfirmDialog state

  const handleEndGame = () => {
    setShowConfirmDialog(true); // Modified to show dialog
  };

  const confirmEndGame = () => {
    actions.endSession();
    setShowConfirmDialog(false);
  };

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
        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleEndGame}
              className="flex items-center gap-1.5"
            >
              <XCircle className="w-4 h-4" />
              End Game
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>End Game?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to end the current game? Your progress will be saved.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowConfirmDialog(false)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmEndGame}>End Game</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};