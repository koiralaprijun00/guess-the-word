"use client";

import React from 'react';
import { useGameState } from './GameStateProvider';
import { useSpacedRepetition } from '@/hooks/use-spaced-repetition';
import { useSessionPersistence } from '@/hooks/use-session-persistence';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const SessionEndDialog: React.FC = () => {
  const { state, actions } = useGameState();
  const { resetWordStats } = useSpacedRepetition({ difficulty: state.difficulty });
  const { resetSessionData } = useSessionPersistence();

  const handleEndSession = () => {
    actions.showEndSessionConfirm(false);
    
    // Reset all session data and progress
    resetSessionData({});
    resetWordStats(); // Reset spaced repetition progress
    
    // End the session
    actions.endSession();
  };

  return (
    <AlertDialog 
      open={state.showEndSessionConfirm} 
      onOpenChange={(open) => actions.showEndSessionConfirm(open)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>End Current Session?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to end your current learning session? This will reset all progress and statistics, giving you a completely fresh start for your next session.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Continue Learning</AlertDialogCancel>
          <AlertDialogAction onClick={handleEndSession}>
            End Session
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}; 