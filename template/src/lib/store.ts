'use client';
import { createContext, useContext } from 'react';
import { Poster, SEED_POSTERS } from './mockData';

export interface AppState {
  posters: Poster[];
  setPosters: (p: Poster[]) => void;
  toast: string | null;
  showToast: (msg: string, ms?: number) => void;
}

export const AppContext = createContext<AppState>({
  posters: SEED_POSTERS,
  setPosters: () => {},
  toast: null,
  showToast: () => {},
});

export const useApp = () => useContext(AppContext);
