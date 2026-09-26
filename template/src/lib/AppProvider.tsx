'use client';
import { useState, useCallback, useRef } from 'react';
import { AppContext } from './store';
import { Poster, SEED_POSTERS } from './mockData';

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const [posters, setPosters] = useState<Poster[]>(SEED_POSTERS);
  const [toast, setToast] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string, ms = 3000) => {
    setToast(msg);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToast(null), ms);
  }, []);

  return (
    <AppContext.Provider value={{ posters, setPosters, toast, showToast }}>
      {children}
      {toast && <div className="toast">{toast}</div>}
    </AppContext.Provider>
  );
}
