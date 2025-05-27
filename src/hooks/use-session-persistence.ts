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

  useEffect(() => {
    if (sessionData) {
      localStorage.setItem('nepali-word-session', JSON.stringify(sessionData));
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
    localStorage.removeItem('nepali-word-session');
  };

  return {
    sessionData,
    updateSessionData,
    clearSessionData
  };
} 