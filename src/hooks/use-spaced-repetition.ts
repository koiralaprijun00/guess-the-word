import { useState, useEffect, useCallback } from 'react';
import type { Word } from '@/types';
import { initialWordList } from '@/data/words';
import type { WordDifficulty } from '@/types';

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

export interface UseSpacedRepetitionProps {
  difficulty?: WordDifficulty;
}

export function useSpacedRepetition({ difficulty }: UseSpacedRepetitionProps = {}) {
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

  const calculateNextReview = (stats: WordStats, difficultyScore: number): WordStats => {
    // SM-2 algorithm implementation
    const newEaseFactor = Math.max(
      MIN_EASE_FACTOR,
      stats.easeFactor + (0.1 - (5 - difficultyScore) * (0.08 + (5 - difficultyScore) * 0.02))
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

      const difficultyScore = knewIt ? 5 : 1; // 5 for knew it, 1 for didn't know
      const newStats = calculateNextReview(currentStats, difficultyScore);
      
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

  const resetWordStats = () => {
    setState({
      wordStats: new Map(),
      nextReviewDate: new Map()
    });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('nepali-word-stats');
    }
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Filter words by difficulty
  const getFilteredWords = useCallback(() => {
    console.log('[SR] getFilteredWords called. Difficulty:', difficulty);
    if (!difficulty) {
      console.log('[SR] No difficulty set, returning all words. Count:', initialWordList.length);
      return initialWordList;
    }
    const words = initialWordList.filter(word => word.difficulty === difficulty);
    console.log('[SR] Filtered words by difficulty ', difficulty, '. Count:', words.length, 'IDs:', words.map(w => w.id));
    return words;
  }, [difficulty]);

  const getNextWord = useCallback(() => {
    console.log('[SR] getNextWord called. Current SR state:', state);
    const filteredWords = getFilteredWords();
    if (filteredWords.length === 0) {
      console.log('[SR] No filtered words available. Returning null.');
      return null;
    }

    const now = new Date();
    
    // Get words that are due for review
    const dueWords = filteredWords.filter(word => {
      const nextReview = state.nextReviewDate.get(word.id);
      const isDue = !nextReview || nextReview <= now;
      console.log(`[SR] Due Check - Word ID: ${word.id}, Next Review: ${nextReview ? nextReview.toISOString() : 'N/A'}, Now: ${now.toISOString()}, Is Due: ${isDue}`);
      return isDue;
    });
    console.log('[SR] Due words for review. Count:', dueWords.length, 'IDs:', dueWords.map(w => w.id));


    if (dueWords.length === 0) {
      console.log('[SR] No words are due for review. Returning null (potential end of session).');
      return null;
    }

    // Separate words into categories for better selection
    const newWords = dueWords.filter(word => !state.wordStats.has(word.id));
    const reviewWords = dueWords.filter(word => state.wordStats.has(word.id));
    console.log('[SR] New words count:', newWords.length, 'Review words count:', reviewWords.length);

    // Prioritize review words, but include new words
    let candidateWords: Word[];
    
    if (reviewWords.length > 0 && newWords.length > 0) {
      // Mix of both: 70% review words, 30% new words
      const reviewCount = Math.max(1, Math.floor(reviewWords.length * 0.7));
      const newCount = Math.max(1, Math.floor(newWords.length * 0.3));
      
      candidateWords = [
        ...shuffleArray(reviewWords).slice(0, reviewCount),
        ...shuffleArray(newWords).slice(0, newCount)
      ];
      console.log('[SR] Mixed candidates. Review count:', reviewCount, 'New count:', newCount, 'Total candidates:', candidateWords.length);
    } else {
      // Use all available words if only one category exists
      candidateWords = dueWords;
      console.log('[SR] Using all due words as candidates. Count:', candidateWords.length);
    }

    // Final shuffle and random selection
    const shuffledCandidates = shuffleArray(candidateWords);
    const nextWord = shuffledCandidates[Math.floor(Math.random() * shuffledCandidates.length)];
    console.log('[SR] Selected next word:', nextWord ? nextWord.id : 'null');
    return nextWord;
  }, [state, getFilteredWords, shuffleArray]);

  return {
    updateWordStats,
    resetWordStats,
    getNextWord,
    wordStats: state.wordStats
  };
}