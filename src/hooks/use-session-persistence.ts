import { useState, useEffect } from 'react';

interface SessionData {
  shownWordIds: number[];
  totalKnown: number;
  totalUnknown: number;
  lastSessionDate: string;
}

export function useSessionPersistence() {
  const [sessionData, setSessionData] = useState<SessionData | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nepali-word-session');
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });

  // Simplified: Direct persistence on change
  useEffect(() => {
    if (sessionData && typeof window !== 'undefined') {
      localStorage.setItem('nepali-word-session', JSON.stringify(sessionData));
    } else if (!sessionData && typeof window !== 'undefined') {
      // Clear localStorage if sessionData is null (e.g., after clearSessionData)
      localStorage.removeItem('nepali-word-session');
    }
  }, [sessionData]);

  const updateSessionData = (newData: Partial<SessionData>) => {
    setSessionData(prev => {
      if (!prev) {
        return {
          shownWordIds: [],
          totalKnown: 0,
          totalUnknown: 0,
          lastSessionDate: new Date().toISOString(),
          ...newData
        };
      }
      return {
        ...prev,
        ...newData,
        lastSessionDate: new Date().toISOString()
      };
    });
  };

  const clearSessionData = () => {
    setSessionData(null);
    // localStorage will be cleared by the useEffect
  };

  const resetSessionData = (initialData?: Partial<SessionData>) => {
    const newSessionData = {
      shownWordIds: [],
      totalKnown: 0,
      totalUnknown: 0,
      lastSessionDate: new Date().toISOString(),
      ...initialData
    };
    setSessionData(newSessionData);
    // localStorage will be updated by the useEffect
  };

  return {
    sessionData,
    updateSessionData,
    clearSessionData,
    resetSessionData
  };
} 