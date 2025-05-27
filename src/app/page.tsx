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

  const { toast } = useToast();
  const { sessionData, updateSessionData, clearSessionData } = useSessionPersistence();
  const { updateWordStats, getNextWord, wordStats } = useSpacedRepetition(allWords);

  const selectNextWord = useCallback(async () => {
    setIsLoadingWord(true);
    setMeaningsVisible(false);
    setAssessmentDone(false);
  
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

  const handleAssessment = (knewIt: boolean) => {
    if (!currentWord) return;

    setAssessmentDone(true);
    updateWordStats(currentWord.id, knewIt);
    updateSessionData({
      totalKnown: (sessionData?.totalKnown || 0) + (knewIt ? 1 : 0),
      totalUnknown: (sessionData?.totalUnknown || 0) + (knewIt ? 0 : 1)
    });
    
    selectNextWord();
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
      if (meaningsVisible && !assessmentDone) {
        if (e.key === 'y' || e.key === 'Y') handleAssessment(true);
        if (e.key === 'n' || e.key === 'N') handleAssessment(false);
      }
      if (e.key === ' ' && !isTimerRunning && !meaningsVisible) {
        selectNextWord();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [meaningsVisible, assessmentDone, isTimerRunning, selectNextWord]);

  if (!sessionStarted) {
    return (
      <WordMasterErrorBoundary>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-900 p-4">
          <Card className="w-full max-w-md p-8 shadow-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
            <CardContent className="flex flex-col items-center space-y-8">
              <h1 className="text-4xl font-bold font-english text-center bg-gradient-to-r from-gradient-yellow via-gradient-orange to-gradient-magenta bg-clip-text text-transparent">
                Nepali Word Master
              </h1>
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
            </CardContent>
          </Card>
        </div>
      </WordMasterErrorBoundary>
    );
  }

  return (
    <WordMasterErrorBoundary>
      <main className="flex flex-col items-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-900 p-4 sm:p-6 md:p-8 selection:bg-primary/20">
        <div className="w-full max-w-2xl space-y-8">
          <h1 className="text-3xl sm:text-4xl font-bold font-english text-center bg-gradient-to-r from-gradient-yellow via-gradient-orange to-gradient-magenta bg-clip-text text-transparent py-2">
            Nepali Word Master
          </h1>

          <EnhancedTimerSelector
            selectedDuration={selectedTimerDuration}
            onDurationChange={handleTimerDurationChange}
            disabled={isTimerRunning || meaningsVisible || isLoadingWord} 
          />

          {currentWord && (
            <EnhancedWordDisplayCard
              word={currentWord}
              timeLeft={timeLeft}
              timerDuration={selectedTimerDuration}
              meaningsVisible={meaningsVisible}
              isLoadingWord={isLoadingWord}
            />
          )}

          {meaningsVisible && !assessmentDone && (
            <EnhancedAssessmentControls onAssess={handleAssessment} disabled={isLoadingWord} />
          )}
          
          {assessmentDone && !isLoadingWord && currentWord && !isTimerRunning && !meaningsVisible && (
            <Button 
              onClick={selectNextWord} 
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" 
              size="lg" 
              disabled={isLoadingWord}
            >
              {isLoadingWord ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
              Next Word
            </Button>
          )}
          {assessmentDone && isLoadingWord && currentWord && !isTimerRunning && !meaningsVisible && (
            <Button 
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg" 
              size="lg" 
              disabled={true}
            >
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading Next Word...
            </Button>
          )}

          <EnhancedStatsCard
            sessionData={sessionData || { totalKnown: 0, totalUnknown: 0, shownWordIds: [] }}
            progressPercentage={progressPercentage}
            allWordsLength={allWords.length}
          />

          <Button 
            variant="outline" 
            onClick={() => setSessionStarted(false)} 
            className="w-full mt-4 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-300"
          >
            End Session
          </Button>
        </div>
      </main>
    </WordMasterErrorBoundary>
  );
}
