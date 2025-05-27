"use client";

import type { Word } from "@/types"; 
import { initialWordList } from "@/data/words";
import { 
  EnhancedWordDisplayCard,
  EnhancedAssessmentControls,
  EnhancedStatsCard,
  EnhancedTimerSelector
} from "@/components/enhanced";
import { WordMasterErrorBoundary } from "@/components/app/WordMasterErrorBoundary";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSessionPersistence } from "@/hooks/use-session-persistence";
import { useSpacedRepetition } from "@/hooks/use-spaced-repetition";
import { Loader2, Play } from "lucide-react";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const TIMER_OPTIONS = [5, 8, 10, 15];

interface SessionData {
  totalKnown: number;
  totalUnknown: number;
  shownWordIds: number[];
}

export default function NepaliWordMasterPage() {
  const [allWords, setAllWords] = useState<Word[]>(() => initialWordList.map(w => ({...w}))); 
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [selectedTimerDuration, setSelectedTimerDuration] = useState<number>(TIMER_OPTIONS[1]); 
  const [timeLeft, setTimeLeft] = useState<number>(selectedTimerDuration);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [meaningsVisible, setMeaningsVisible] = useState<boolean>(false);
  const [assessmentDone, setAssessmentDone] = useState<boolean>(true); 
  const [isLoadingWord, setIsLoadingWord] = useState<boolean>(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [earlyAssessmentMade, setEarlyAssessmentMade] = useState<boolean>(false);

  const { toast } = useToast();
  const { sessionData, updateSessionData, clearSessionData } = useSessionPersistence();
  const { updateWordStats, getNextWord, wordStats } = useSpacedRepetition(allWords);

  const selectNextWord = useCallback(async () => {
    setIsLoadingWord(true);
    setMeaningsVisible(false);
    setAssessmentDone(false);
    setEarlyAssessmentMade(false);
  
    const nextWord = getNextWord();
  
    if (!nextWord) {
      toast({ title: "Session Complete!", description: "You've reviewed all available words." });
      setIsTimerRunning(false);
      setSessionStarted(false);
      setIsLoadingWord(false);
      return;
    }
  
    setCurrentWord(nextWord);
    updateSessionData({
      shownWordIds: [...(sessionData?.shownWordIds || []), nextWord.id]
    });
    setTimeLeft(selectedTimerDuration);
    setIsTimerRunning(true);
    setIsLoadingWord(false);
  }, [
    getNextWord,
    selectedTimerDuration,
    toast,
    sessionData,
    updateSessionData
  ]);

  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      timerId = setTimeout(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (isTimerRunning && timeLeft === 0) {
      setIsTimerRunning(false);
      setMeaningsVisible(true);
    }
    return () => clearTimeout(timerId);
  }, [isTimerRunning, timeLeft]);

  const handleStartSession = () => {
    setSessionStarted(true);
    clearSessionData();
    setCurrentWord(null); 
    selectNextWord();
  };

  const handleEarlyAssessment = (knewIt: boolean) => {
    if (!currentWord) return;
    
    setEarlyAssessmentMade(true);
    setIsTimerRunning(false);
    setMeaningsVisible(true);
    
    // If they knew it early, we can skip to next word after showing meaning briefly
    if (knewIt) {
      setTimeout(() => {
        handleFinalAssessment(true);
      }, 2000); // Show meaning for 2 seconds then proceed
    }
  };

  const handleFinalAssessment = (knewIt: boolean) => {
    if (!currentWord) return;

    setAssessmentDone(true);
    updateWordStats(currentWord.id, knewIt);
    updateSessionData({
      totalKnown: (sessionData?.totalKnown || 0) + (knewIt ? 1 : 0),
      totalUnknown: (sessionData?.totalUnknown || 0) + (knewIt ? 0 : 1)
    });
    
    // Auto-proceed to next word after a short delay
    setTimeout(() => {
      selectNextWord();
    }, 1000);
  };

  const handleTimerDurationChange = (duration: number) => {
    setSelectedTimerDuration(duration);
    if (!isTimerRunning && !meaningsVisible) { 
      setTimeLeft(duration);
    }
  };

  const progressPercentage = useMemo(() => {
    if (allWords.length === 0) return 0;
    return ((sessionData?.shownWordIds?.length || 0) / allWords.length) * 100;
  }, [sessionData?.shownWordIds?.length, allWords.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'y' || e.key === 'Y') {
        if (!meaningsVisible && !earlyAssessmentMade) {
          handleEarlyAssessment(true);
        } else if (meaningsVisible && !assessmentDone) {
          handleFinalAssessment(true);
        }
      }
      if (e.key === 'n' || e.key === 'N') {
        if (!meaningsVisible && !earlyAssessmentMade) {
          handleEarlyAssessment(false);
        } else if (meaningsVisible && !assessmentDone) {
          handleFinalAssessment(false);
        }
      }
      if (e.key === ' ' && !isTimerRunning && !meaningsVisible && assessmentDone) {
        e.preventDefault();
        selectNextWord();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [meaningsVisible, assessmentDone, isTimerRunning, earlyAssessmentMade, selectNextWord]);

  return (
    <WordMasterErrorBoundary>
      <main className="flex flex-col items-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-900 p-4 selection:bg-primary/20 overflow-hidden">
        {/* Timer Selection Modal */}
        <Dialog open={!sessionStarted} onOpenChange={() => {}}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-gradient-yellow via-gradient-orange to-gradient-magenta bg-clip-text text-transparent">
                Nepali Word Master
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center space-y-6 py-4">
              <EnhancedTimerSelector
                selectedDuration={selectedTimerDuration}
                onDurationChange={handleTimerDurationChange}
              />
              <Button 
                size="lg" 
                onClick={handleStartSession} 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Play className="mr-2 h-5 w-5" /> Start Learning
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="w-full max-w-2xl flex flex-col justify-start space-y-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold font-english bg-gradient-to-r from-gradient-yellow via-gradient-orange to-gradient-magenta bg-clip-text text-transparent">
              Nepali Word Master
            </h1>
            <EnhancedTimerSelector
              selectedDuration={selectedTimerDuration}
              onDurationChange={handleTimerDurationChange}
              disabled={isTimerRunning || meaningsVisible || isLoadingWord} 
            />
          </div>

          {currentWord && (
            <EnhancedWordDisplayCard
              word={currentWord}
              timeLeft={timeLeft}
              timerDuration={selectedTimerDuration}
              meaningsVisible={meaningsVisible}
              isLoadingWord={isLoadingWord}
              onEarlyAssessment={handleEarlyAssessment}
              onFinalAssessment={handleFinalAssessment}
              showEarlyAssessment={!earlyAssessmentMade}
              showFinalAssessment={meaningsVisible && !assessmentDone}
            />
          )}

          <div className="flex space-x-4 mt-2 items-center">
            <div className="flex-1">
              <EnhancedStatsCard
                sessionData={sessionData || { totalKnown: 0, totalUnknown: 0, shownWordIds: [] }}
                progressPercentage={progressPercentage}
                allWordsLength={allWords.length}
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => setSessionStarted(false)} 
              className="h-full hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-300"
            >
              End Session
            </Button>
          </div>
        </div>
      </main>
    </WordMasterErrorBoundary>
  );
}
