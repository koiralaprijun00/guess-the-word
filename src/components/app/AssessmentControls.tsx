"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";

interface AssessmentControlsProps {
  onAssess: (knewIt: boolean) => void;
  disabled?: boolean;
}

export function AssessmentControls({ onAssess, disabled = false }: AssessmentControlsProps) {
  return (
    <div className="flex justify-center space-x-4 mt-6">
      <Button
        variant="outline"
        size="lg"
        className="bg-green-500/10 hover:bg-green-500/20 border-green-500 text-green-700 hover:text-green-800 dark:bg-green-700/20 dark:hover:bg-green-700/30 dark:border-green-600 dark:text-green-400 dark:hover:text-green-300"
        onClick={() => onAssess(true)}
        disabled={disabled}
        aria-label="I knew it"
      >
        <CheckCircle2 className="mr-2 h-5 w-5" /> I Knew It!
      </Button>
      <Button
        variant="outline"
        size="lg"
        className="bg-red-500/10 hover:bg-red-500/20 border-red-500 text-red-700 hover:text-red-800 dark:bg-red-700/20 dark:hover:bg-red-700/30 dark:border-red-600 dark:text-red-400 dark:hover:text-red-300"
        onClick={() => onAssess(false)}
        disabled={disabled}
        aria-label="I didn't know"
      >
        <XCircle className="mr-2 h-5 w-5" /> I Didn't Know
      </Button>
    </div>
  );
}
