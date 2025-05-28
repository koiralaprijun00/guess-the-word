"use client";

import { useEffect } from 'react';
import { useGameState } from './GameStateProvider';
import { useEarlyAssessment, useFinalAssessment } from '@/hooks/game/useAssessment';
import { useWordSelection } from '@/hooks/game/useWordSelection';

export const KeyboardNavigationHandler: React.FC = () => {
  const { state } = useGameState();
  const earlyAssessment = useEarlyAssessment();
  const finalAssessment = useFinalAssessment();
  const selectNextWord = useWordSelection();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Early assessment (during timer)
      if (!state.meaningsVisible && !state.earlyAssessmentMade) {
        if (e.key === 'y' || e.key === 'Y') {
          earlyAssessment(true);
        } else if (e.key === 'n' || e.key === 'N') {
          earlyAssessment(false);
        }
      }
      
      // Final assessment (after meanings shown)
      else if (state.meaningsVisible && !state.assessmentDone) {
        if (e.key === 'y' || e.key === 'Y') {
          finalAssessment(true);
        } else if (e.key === 'n' || e.key === 'N') {
          finalAssessment(false);
        }
      }
      
      // Next word (when assessment done)
      else if (e.key === ' ' && !state.isTimerRunning && !state.meaningsVisible && state.assessmentDone) {
        e.preventDefault();
        selectNextWord();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [
    state.meaningsVisible, 
    state.assessmentDone, 
    state.earlyAssessmentMade,
    state.isTimerRunning,
    earlyAssessment, 
    finalAssessment, 
    selectNextWord
  ]);

  return null; // This component only handles side effects
}; 