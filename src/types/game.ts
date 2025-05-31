import type { Word, WordDifficulty } from './index';

export interface GameState {
  // Game configuration
  difficulty: WordDifficulty;
  timerDuration: number;
  sessionStarted: boolean;
  
  // Current game state
  currentWord: Word | null;
  timeLeft: number;
  isTimerRunning: boolean;
  meaningsVisible: boolean;
  assessmentDone: boolean;
  
  // UI state
  isLoadingWord: boolean;
  isClientMounted: boolean;
  showEndSessionConfirm: boolean;
}

export type GameAction = 
  | { type: 'START_SESSION'; payload: { duration: number; difficulty: WordDifficulty } }
  | { type: 'SELECT_NEXT_WORD' }
  | { type: 'SET_CURRENT_WORD'; payload: { word: Word } }
  | { type: 'START_TIMER' }
  | { type: 'TIMER_TICK' }
  | { type: 'SHOW_MEANINGS' }
  | { type: 'MAKE_EARLY_ASSESSMENT'; payload: { knewIt: boolean } }
  | { type: 'FINALIZE_ASSESSMENT'; payload: { knewIt: boolean } }
  | { type: 'SET_CLIENT_MOUNTED'; payload: { mounted: boolean } }
  | { type: 'SET_LOADING'; payload: { loading: boolean } }
  | { type: 'SHOW_END_SESSION_CONFIRM'; payload: { show: boolean } }
  | { type: 'END_SESSION' }
  | { type: 'RESET_WORD_STATE' };

export interface GameActions {
  startSession: (duration: number, difficulty: WordDifficulty) => void;
  selectNextWord: () => void;
  setCurrentWord: (word: Word) => void;
  startTimer: () => void;
  tick: () => void;
  showMeanings: () => void;
  makeEarlyAssessment: (knewIt: boolean) => void;
  finalizeAssessment: (knewIt: boolean) => void;
  setClientMounted: (mounted: boolean) => void;
  setLoading: (loading: boolean) => void;
  showEndSessionConfirm: (show: boolean) => void;
  endSession: () => void;
  resetWordState: () => void;
} 