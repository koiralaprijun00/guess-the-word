"use client";

import type { Word } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DevanagariText } from "./DevanagariText";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface WordDisplayCardProps {
  word: Word | null;
  timeLeft: number;
  timerDuration: number;
  meaningsVisible: boolean;
  isLoadingWord: boolean;
}

export function WordDisplayCard({
  word,
  timeLeft,
  timerDuration,
  meaningsVisible,
  isLoadingWord,
}: WordDisplayCardProps) {
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    // Only show skeleton if isLoadingWord is true and word is null
    setShowSkeleton(isLoadingWord && !word);
  }, [isLoadingWord, word]);
  
  const timerProgress = timerDuration > 0 ? ((timerDuration - timeLeft) / timerDuration) * 100 : 0;

  if (showSkeleton) {
    return (
      <Card className="w-full shadow-xl text-center bg-gradient-to-br from-gradient-yellow via-gradient-orange to-gradient-magenta p-1">
        <CardContent className="bg-card p-6 md:p-10 rounded-md">
          <Skeleton className="h-16 w-3/4 mx-auto mb-6" />
          <Skeleton className="h-4 w-full mb-2" />
          <div className="mt-8 space-y-4">
            <Skeleton className="h-8 w-1/2 mx-auto" />
            <Skeleton className="h-6 w-3/4 mx-auto" />
            <Skeleton className="h-6 w-2/3 mx-auto" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!word) {
    return (
      <Card className="w-full shadow-xl text-center bg-gradient-to-br from-gradient-yellow via-gradient-orange to-gradient-magenta p-1">
         <CardContent className="bg-card p-6 md:p-10 rounded-md min-h-[300px] flex flex-col justify-center items-center">
          <p className="text-xl font-english text-foreground/80">Select timer and start learning!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-xl text-center bg-gradient-to-br from-gradient-yellow via-gradient-orange to-gradient-magenta p-1 overflow-hidden">
      <CardContent className="bg-card p-6 md:p-10 rounded-md">
        <DevanagariText className="text-5xl md:text-6xl font-bold text-foreground">
          {word.nepali}
        </DevanagariText>

        {!meaningsVisible && (
          <div className="mt-6 mb-4">
            <Progress value={timerProgress} className="w-full h-2 [&>div]:bg-primary" />
            <p className="text-sm text-foreground/70 mt-2 font-mono">{timeLeft}s remaining</p>
          </div>
        )}
        
        <div
          className={cn(
            "mt-8 space-y-4 transition-opacity duration-700 ease-in-out",
            meaningsVisible ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
          )}
        >
          <div>
            <h3 className="text-sm font-english font-semibold uppercase text-foreground/60 tracking-wider">Romanization</h3>
            <p className="text-xl font-english text-foreground/90">{word.roman}</p>
          </div>
          <div>
            <h3 className="text-sm font-english font-semibold uppercase text-foreground/60 tracking-wider">Nepali Meaning</h3>
            <DevanagariText className="text-xl text-foreground/90">{word.meaning_nepali}</DevanagariText>
          </div>
          <div>
            <h3 className="text-sm font-english font-semibold uppercase text-foreground/60 tracking-wider">English Meaning</h3>
            <p className="text-xl font-english text-foreground/90">{word.meaning_english}</p>
          </div>
           {word.difficulty && (
             <div className="pt-2">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/30 font-english">
                    Difficulty: {word.difficulty.charAt(0).toUpperCase() + word.difficulty.slice(1)}
                </span>
            </div>
           )}
        </div>
      </CardContent>
    </Card>
  );
}
