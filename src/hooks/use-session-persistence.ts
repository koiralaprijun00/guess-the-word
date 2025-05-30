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

  // Move persistence out of click handlers to prevent hanging
  useEffect(() => {
    if (sessionData && typeof window !== 'undefined') {
      const persistData = () => {
        localStorage.setItem('nepali-word-session', JSON.stringify(sessionData));
      };

      // Use requestIdleCallback if available, otherwise setTimeout
      if ('requestIdleCallback' in window) {
        const handle = window.requestIdleCallback(persistData);
        return () => window.cancelIdleCallback(handle);
      } else {
        const handle = setTimeout(persistData, 16); // ~1 frame delay
        return () => clearTimeout(handle);
      }
    }
  }, [sessionData]);

  const updateSessionData = (newData: Partial<SessionData>) => {
    // Fast state update - no blocking localStorage write
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
    if (typeof window !== 'undefined') {
      localStorage.removeItem('nepali-word-session');
    }
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
    // Immediate persistence for reset operations
    if (typeof window !== 'undefined') {
      localStorage.setItem('nepali-word-session', JSON.stringify(newSessionData));
    }
  };

  return {
    sessionData,
    updateSessionData,
    clearSessionData,
    resetSessionData
  };
} 