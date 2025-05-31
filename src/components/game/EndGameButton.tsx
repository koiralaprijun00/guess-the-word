// src/components/game/EndGameButton.tsx
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';
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
} from "@/components/ui/alert-dialog";

interface EndGameButtonProps {
  endSession: () => void;
}

export const EndGameButton: React.FC<EndGameButtonProps> = ({ endSession }) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);

  const handleOpenDialog = () => {
    setShowConfirmDialog(true);
  };

  const confirmEndGame = () => {
    endSession();
    setShowConfirmDialog(false);
  };

  return (
    <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleOpenDialog} // Changed from handleEndGame to handleOpenDialog for clarity
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
  );
};
