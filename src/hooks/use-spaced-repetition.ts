import { useState, useEffect } from 'react';
import type { Word } from '@/types';

interface WordStats {
  id: number;
  correctCount: number;
  incorrectCount: number;
  lastSeen: Date;
  easeFactor: number;
  interval: number;
}

interface SpacedRepetitionState {
  wordStats: Map<number, WordStats>;
  nextReviewDate: Map<number, Date>;
}

const INITIAL_EASE_FACTOR = 2.5;
const MIN_EASE_FACTOR = 1.3;

export function useSpacedRepetition(words: Word[]) {
  const [state, setState] = useState<SpacedRepetitionState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nepali-word-stats');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          wordStats: new Map(Object.entries(parsed.wordStats).map(([id, stats]: [string, any]) => [
            Number(id),
            { ...stats, lastSeen: new Date(stats.lastSeen) }
          ])),
          nextReviewDate: new Map(Object.entries(parsed.nextReviewDate).map(([id, date]) => [
            Number(id),
            new Date(date as string)
          ]))
        };
      }
    }
    return {
      wordStats: new Map(),
      nextReviewDate: new Map()
    };
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const serialized = {
        wordStats: Object.fromEntries(state.wordStats),
        nextReviewDate: Object.fromEntries(
          Array.from(state.nextReviewDate.entries()).map(([id, date]) => [id, date.toISOString()])
        )
      };
      localStorage.setItem('nepali-word-stats', JSON.stringify(serialized));
    }
  }, [state]);

  const calculateNextReview = (stats: WordStats, difficulty: number): WordStats => {
    // SM-2 algorithm implementation
    const newEaseFactor = Math.max(
      MIN_EASE_FACTOR,
      stats.easeFactor + (0.1 - (5 - difficulty) * (0.08 + (5 - difficulty) * 0.02))
    );
    
    let newInterval;
    if (stats.correctCount === 0) {
      newInterval = 1;
    } else if (stats.correctCount === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.ceil(stats.interval * newEaseFactor);
    }

    return {
      ...stats,
      easeFactor: newEaseFactor,
      interval: newInterval,
      lastSeen: new Date()
    };
  };

  const updateWordStats = (wordId: number, knewIt: boolean) => {
    setState(prev => {
      const currentStats = prev.wordStats.get(wordId) || {
        id: wordId,
        correctCount: 0,
        incorrectCount: 0,
        lastSeen: new Date(),
        easeFactor: INITIAL_EASE_FACTOR,
        interval: 1
      };

      const difficulty = knewIt ? 5 : 1; // 5 for knew it, 1 for didn't know
      const newStats = calculateNextReview(currentStats, difficulty);
      
      if (knewIt) {
        newStats.correctCount++;
      } else {
        newStats.incorrectCount++;
      }

      const nextReview = new Date();
      nextReview.setDate(nextReview.getDate() + newStats.interval);

      return {
        wordStats: new Map(prev.wordStats).set(wordId, newStats),
        nextReviewDate: new Map(prev.nextReviewDate).set(wordId, nextReview)
      };
    });
  };

  const getNextWord = (): Word | null => {
    const now = new Date();
    const availableWords = words.filter(word => {
      const nextReview = state.nextReviewDate.get(word.id);
      return !nextReview || nextReview <= now;
    });

    if (availableWords.length === 0) {
      return null;
    }

    // Sort by next review date and then randomly select from the earliest ones
    const sortedWords = availableWords.sort((a, b) => {
      const dateA = state.nextReviewDate.get(a.id) || new Date(0);
      const dateB = state.nextReviewDate.get(b.id) || new Date(0);
      return dateA.getTime() - dateB.getTime();
    });

    const earliestDate = state.nextReviewDate.get(sortedWords[0].id) || new Date(0);
    const earliestWords = sortedWords.filter(word => {
      const date = state.nextReviewDate.get(word.id) || new Date(0);
      return date.getTime() === earliestDate.getTime();
    });

    return earliestWords[Math.floor(Math.random() * earliestWords.length)];
  };

  return {
    updateWordStats,
    getNextWord,
    wordStats: state.wordStats
  };
} 