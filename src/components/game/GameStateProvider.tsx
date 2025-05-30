"use client";

import React, { createContext, useContext, useReducer, useMemo, useEffect } from 'react';
import type { GameState, GameActions } from '@/types/game';
import { gameReducer, initialGameState } from '@/reducers/gameReducer';
import { useSessionPersistence } from '@/hooks/use-session-persistence';

interface SessionData {
  shownWordIds: number[];
  totalKnown: number;
  totalUnknown: number;
  lastSessionDate: string;
}

interface GameStateContextValue {
  state: GameState;
  actions: GameActions;
  sessionData: SessionData | null;
  updateSessionData: (newData: Partial<SessionData>) => void;
  resetSessionData: (initialData?: Partial<SessionData>) => void;
}

const GameStateContext = createContext<GameStateContextValue | undefined>(undefined);

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
};

interface GameStateProviderProps {
  children: React.ReactNode;
}

export const GameStateProvider: React.FC<GameStateProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  
  // Centralize session persistence - single source of truth
  const { sessionData, updateSessionData, resetSessionData } = useSessionPersistence();

  const actions = useMemo<GameActions>(() => ({
    startSession: (duration: number, difficulty) => {
      dispatch({ type: 'START_SESSION', payload: { duration, difficulty } });
    },
    selectNextWord: () => {
      dispatch({ type: 'SELECT_NEXT_WORD' });
    },
    setCurrentWord: (word) => {
      dispatch({ type: 'SET_CURRENT_WORD', payload: { word } });
    },
    startTimer: () => {
      dispatch({ type: 'START_TIMER' });
    },
    tick: () => {
      dispatch({ type: 'TIMER_TICK' });
    },
    showMeanings: () => {
      dispatch({ type: 'SHOW_MEANINGS' });
    },
    makeEarlyAssessment: (knewIt: boolean) => {
      dispatch({ type: 'MAKE_EARLY_ASSESSMENT', payload: { knewIt } });
    },
    finalizeAssessment: (knewIt: boolean) => {
      dispatch({ type: 'FINALIZE_ASSESSMENT', payload: { knewIt } });
    },
    setClientMounted: (mounted: boolean) => {
      dispatch({ type: 'SET_CLIENT_MOUNTED', payload: { mounted } });
    },
    setLoading: (loading: boolean) => {
      dispatch({ type: 'SET_LOADING', payload: { loading } });
    },
    showEndSessionConfirm: (show: boolean) => {
      dispatch({ type: 'SHOW_END_SESSION_CONFIRM', payload: { show } });
    },
    endSession: () => {
      dispatch({ type: 'END_SESSION' });
    },
    resetWordState: () => {
      dispatch({ type: 'RESET_WORD_STATE' });
    },
  }), []);

  // Set client mounted on initial render
  useEffect(() => {
    actions.setClientMounted(true);
  }, [actions]);

  const contextValue = useMemo(() => ({
    state,
    actions,
    sessionData,
    updateSessionData,
    resetSessionData,
  }), [state, actions, sessionData, updateSessionData, resetSessionData]);

  return (
    <GameStateContext.Provider value={contextValue}>
      {children}
    </GameStateContext.Provider>
  );
}; 