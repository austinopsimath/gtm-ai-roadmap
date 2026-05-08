import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Initiative } from '../types';

interface RoadmapState {
  initiatives: Initiative[];
  lastBackedUpAt: string | null;
  setLastBackedUpAt: (timestamp: string) => void;
}

export const useRoadmapStore = create<RoadmapState>()(
  persist(
    (set) => ({
      initiatives: [],
      lastBackedUpAt: null,
      setLastBackedUpAt: (timestamp) => set({ lastBackedUpAt: timestamp }),
    }),
    {
      name: 'gtm-ai-roadmap-storage',
      version: 1,
    },
  ),
);
