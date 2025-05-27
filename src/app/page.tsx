
"use client";

import type { Word, WordDifficulty } from "@/types";
import { classifyWordDifficulty } from "@/ai/flows/classify-word-difficulty";
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
const WORDS_PER_DIFFICULTY_TIER = 3; // Number of words to master before moving to next difficulty
const DIFFICULTY_ORDER: WordDifficulty[] = ['easy', 'intermediate', 'difficult'];

export default function NepaliWordMasterPage() {
  const [allWords, setAllWords] = useState<Word[]>(() => initialWordList.map(w => ({...w}))); // Deep copy
  const [classifiedCache, setClassifiedCache] = useState<Map<number, WordDifficulty>>(new Map());
  
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [selectedTimerDuration, setSelectedTimerDuration] = useState<number>(TIMER_OPTIONS[1]); // Default 8s
  const [timeLeft, setTimeLeft] = useState<number>(selectedTimerDuration);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [meaningsVisible, setMeaningsVisible] = useState<boolean>(false);
  const [assessmentDone, setAssessmentDone] = useState<boolean>(true); // True initially to allow starting
  const [isLoadingWord, setIsLoadingWord] = useState<boolean>(false);

  const [currentDifficultyIndex, setCurrentDifficultyIndex] = useState<number>(0);
  const [wordsKnownInTier, setWordsKnownInTier] = useState<number>(0);
  const [shownWordIds, setShownWordIds] = useState<Set<number>>(new Set());

  const [totalKnown, setTotalKnown] = useState(0);
  const [totalUnknown, setTotalUnknown] = useState(0);
  const [sessionStarted, setSessionStarted] = useState(false);

  const { toast } = useToast();

  const currentTier = DIFFICULTY_ORDER[currentDifficultyIndex];

  const getAndClassifyWord = useCallback(async (word: Word): Promise<Word> => {
    if (classifiedCache.has(word.id)) {
      return { ...word, difficulty: classifiedCache.get(word.id) };
    }
    if (word.difficulty) { 
        setClassifiedCache(prev => new Map(prev).set(word.id, word.difficulty!));
        return word;
    }
    try {
      setIsLoadingWord(true); // Indicate AI activity
      const result = await classifyWordDifficulty({ nepaliWord: word.nepali });
      setClassifiedCache(prev => new Map(prev).set(word.id, result.difficulty));
      setAllWords(prevWords => prevWords.map(w => w.id === word.id ? {...w, difficulty: result.difficulty} : w));
      setIsLoadingWord(false);
      return { ...word, difficulty: result.difficulty };
    } catch (error) {
      console.error("Error classifying word:", error);
      toast({ title: "AI Error", description: "Could not classify word difficulty. Please try again later.", variant: "destructive" });
      setIsLoadingWord(false);
      return word; // Return word without difficulty
    }
  }, [classifiedCache, toast]); // setIsLoadingWord removed as it's managed within this function now

  const selectNextWord = useCallback(async () => {
    setIsLoadingWord(true); // General loading state for word selection process
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
  
    let nextWord: Word | null = null;
  
    // Strategy 1: Find preferred word (current tier, already classified)
    nextWord = availableWords.find(w => w.difficulty === currentTier && classifiedCache.has(w.id)) || null;
  
    // Strategy 2: Find any usable classified word (any tier, already classified)
    if (!nextWord) {
      nextWord = availableWords.find(w => !!w.difficulty && classifiedCache.has(w.id)) || null;
    }
  
    // Strategy 3: Classify a new word if no suitable classified word was found
    if (!nextWord) {
      const wordToClassify = availableWords.find(w => !w.difficulty || !classifiedCache.has(w.id)); // Find word not yet classified or not in cache
      if (wordToClassify) {
        nextWord = await getAndClassifyWord(wordToClassify); // This makes at most one API call
      }
    }
    
    // Strategy 4: Fallback if all strategies above fail to yield a word (e.g., all words are classified but none matched tier)
    // Or if classification in S3 failed and nextWord is the original word without difficulty
    if (!nextWord && availableWords.length > 0) {
      // At this point, if nextWord is still null, it means:
      // 1. No classified word matched the current tier (S1 failed).
      // 2. No other classified word was found (S2 failed).
      // 3. No unclassified word was available or classification failed (S3 resulted in no usable nextWord).
      // So, pick any random available word. If it's unclassified, it will be classified on its next turn if needed.
      const randomIndex = Math.floor(Math.random() * availableWords.length);
      nextWord = availableWords[randomIndex];
      // If this randomly picked word is still unclassified (e.g. S3 failed to classify it previously or it's new)
      // ensure it gets classified now if it wasn't the one just attempted by S3.
      if (!nextWord.difficulty && (!classifiedCache.has(nextWord.id))) {
         nextWord = await getAndClassifyWord(nextWord);
      }
    }
  
    if (nextWord) {
      setCurrentWord(nextWord);
      setShownWordIds(prev => new Set(prev).add(nextWord!.id));
      setTimeLeft(selectedTimerDuration);
      setIsTimerRunning(true);
    } else {
      toast({ title: "No Words Left", description: "You've seen all words or an error occurred finding a new one." });
      setSessionStarted(false);
    }
    setIsLoadingWord(false); // Ensure loading is false at the end
  }, [
    allWords, 
    shownWordIds, 
    getAndClassifyWord, 
    currentTier, 
    selectedTimerDuration, 
    toast, 
    classifiedCache, // Added classifiedCache
    // State setters are generally stable but included for completeness if strict linting
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
    setCurrentDifficultyIndex(0); // Reset to easy
    setWordsKnownInTier(0);
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
      // Use the difficulty from the currentWord, which might have been just classified
      const wordDifficulty = currentWord.difficulty || classifiedCache.get(currentWord.id);
      if (wordDifficulty === currentTier) {
        setWordsKnownInTier(prev => prev + 1);
      }
    } else {
      setTotalUnknown(prev => prev + 1);
    }

    // Check for tier progression after current word assessment
    // Note: wordsKnownInTier would have been incremented *before* this check if the word was known and matched tier
    if (wordsKnownInTier >= WORDS_PER_DIFFICULTY_TIER && currentDifficultyIndex < DIFFICULTY_ORDER.length - 1) {
      setCurrentDifficultyIndex(prev => {
        const nextIndex = prev + 1;
        toast({ title: "Great job!", description: `Moving to ${DIFFICULTY_ORDER[nextIndex]} words.` });
        return nextIndex;
      });
      setWordsKnownInTier(0); // Reset for the new tier
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
              <span>Difficulty Tier:</span>
              <span className="font-semibold">{currentTier.charAt(0).toUpperCase() + currentTier.slice(1)}</span>
            </div>
            <div className="flex justify-between">
              <span>Words Mastered in Tier:</span>
              <span className="font-semibold">{wordsKnownInTier} / {WORDS_PER_DIFFICULTY_TIER}</span>
            </div>
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

  