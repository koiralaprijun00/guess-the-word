
"use client";

import type { Word } from "@/types"; 
import { initialWordList } from "@/data/words";
import { WordDisplayCard } from "@/components/app/WordDisplayCard";
import { TimerSelector } from "@/components/app/TimerSelector";
import { AssessmentControls } from "@/components/app/AssessmentControls";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Play } from "lucide-react";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const TIMER_OPTIONS = [5, 8, 10, 15];

export default function NepaliWordMasterPage() {
  const [allWords, setAllWords] = useState<Word[]>(() => initialWordList.map(w => ({...w}))); 
  
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [selectedTimerDuration, setSelectedTimerDuration] = useState<number>(TIMER_OPTIONS[1]); 
  const [timeLeft, setTimeLeft] = useState<number>(selectedTimerDuration);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [meaningsVisible, setMeaningsVisible] = useState<boolean>(false);
  const [assessmentDone, setAssessmentDone] = useState<boolean>(true); 
  const [isLoadingWord, setIsLoadingWord] = useState<boolean>(false);

  const [shownWordIds, setShownWordIds] = useState<Set<number>>(new Set());

  const [totalKnown, setTotalKnown] = useState(0);
  const [totalUnknown, setTotalUnknown] = useState(0);
  const [sessionStarted, setSessionStarted] = useState(false);

  const { toast } = useToast();

  const selectNextWord = useCallback(async () => {
    setIsLoadingWord(true);
    setMeaningsVisible(false);
    setAssessmentDone(false);
  
    const availableWords = allWords.filter(w => !shownWordIds.has(w.id));
  
    if (availableWords.length === 0) {
      toast({ title: "Session Complete!", description: "You've seen all available words." });
      setIsTimerRunning(false);
      setSessionStarted(false);
      setIsLoadingWord(false);
      return;
    }
  
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    const nextWord = availableWords[randomIndex];
      
    if (nextWord) {
      setCurrentWord(nextWord);
      setShownWordIds(prev => new Set(prev).add(nextWord!.id));
      setTimeLeft(selectedTimerDuration);
      setIsTimerRunning(true);
    } else {
      toast({ title: "No Words Left", description: "Could not find a new word." });
      setSessionStarted(false);
    }
    setIsLoadingWord(false);
  }, [
    allWords, 
    shownWordIds, 
    selectedTimerDuration, 
    toast,
    setSessionStarted, 
    setIsLoadingWord, 
    setMeaningsVisible, 
    setAssessmentDone, 
    setCurrentWord, 
    setShownWordIds, 
    setTimeLeft, 
    setIsTimerRunning
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
    setShownWordIds(new Set());
    setTotalKnown(0);
    setTotalUnknown(0);
    setCurrentWord(null); 
    selectNextWord();
  };

  const handleAssessment = (knewIt: boolean) => {
    if (!currentWord) return;

    setAssessmentDone(true);
    if (knewIt) {
      setTotalKnown(prev => prev + 1);
    } else {
      setTotalUnknown(prev => prev + 1);
    }
    
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
    return (shownWordIds.size / allWords.length) * 100;
  }, [shownWordIds.size, allWords.length]);

  if (!sessionStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
        <Card className="w-full max-w-md p-8 shadow-2xl">
          <CardContent className="flex flex-col items-center space-y-8">
            <h1 className="text-4xl font-bold font-english text-center bg-gradient-to-r from-gradient-yellow via-gradient-orange to-gradient-magenta bg-clip-text text-transparent">
              Nepali Word Master
            </h1>
            <TimerSelector
              selectedDuration={selectedTimerDuration}
              onDurationChange={handleTimerDurationChange}
            />
            <Button size="lg" onClick={handleStartSession} className="w-full">
              <Play className="mr-2 h-5 w-5" /> Start Learning
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8 selection:bg-primary/20">
      <div className="w-full max-w-2xl space-y-8">
        <h1 className="text-3xl sm:text-4xl font-bold font-english text-center bg-gradient-to-r from-gradient-yellow via-gradient-orange to-gradient-magenta bg-clip-text text-transparent py-2">
          Nepali Word Master
        </h1>

        <TimerSelector
          selectedDuration={selectedTimerDuration}
          onDurationChange={handleTimerDurationChange}
          disabled={isTimerRunning || meaningsVisible || isLoadingWord} 
        />

        <WordDisplayCard
          word={currentWord}
          timeLeft={timeLeft}
          timerDuration={selectedTimerDuration}
          meaningsVisible={meaningsVisible}
          isLoadingWord={isLoadingWord}
        />

        {meaningsVisible && !assessmentDone && (
          <AssessmentControls onAssess={handleAssessment} disabled={isLoadingWord} />
        )}
        
        {assessmentDone && !isLoadingWord && currentWord && !isTimerRunning && !meaningsVisible && (
             <Button onClick={selectNextWord} className="w-full" size="lg" disabled={isLoadingWord}>
             {isLoadingWord ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
             Next Word
           </Button>
        )}
        {assessmentDone && isLoadingWord && currentWord && !isTimerRunning && !meaningsVisible && (
            <Button className="w-full" size="lg" disabled={true}>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Loading Next Word...
            </Button>
        )}


        <Card className="mt-8">
          <CardContent className="p-4 space-y-2 text-sm font-english">
            <div className="flex justify-between">
              <span>Total Known:</span>
              <span className="font-semibold text-green-600">{totalKnown}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Didn't Know:</span>
              <span className="font-semibold text-red-600">{totalUnknown}</span>
            </div>
            <div className="pt-2">
              <div className="flex justify-between mb-1">
                <span>Session Progress:</span>
                <span>{shownWordIds.size} / {allWords.length} words</span>
              </div>
              <Progress value={progressPercentage} className="h-2 [&>div]:bg-primary" />
            </div>
          </CardContent>
        </Card>
        <Button variant="outline" onClick={() => setSessionStarted(false)} className="w-full mt-4">End Session</Button>
      </div>
    </main>
  );
}
