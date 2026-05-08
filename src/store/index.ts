import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Initiative } from '../types';

interface RoadmapState {
  initiatives: Initiative[];
  lastBackedUpAt: string | null;
  addInitiative: (initiative: Initiative) => void;
  updateInitiative: (id: string, patch: Partial<Initiative>) => void;
  deleteInitiative: (id: string) => void;
  replaceAll: (initiatives: Initiative[]) => void;
  markBackedUpNow: () => void;
}

export const useRoadmapStore = create<RoadmapState>()(
  persist(
    (set) => ({
      initiatives: [],
      lastBackedUpAt: null,
      addInitiative: (initiative) =>
        set((state) => ({ initiatives: [...state.initiatives, initiative] })),
      updateInitiative: (id, patch) =>
        set((state) => ({
          initiatives: state.initiatives.map((init) =>
            init.id === id
              ? { ...init, ...patch, updatedAt: new Date().toISOString() }
              : init,
          ),
        })),
      deleteInitiative: (id) =>
        set((state) => ({
          initiatives: state.initiatives.filter((init) => init.id !== id),
        })),
      replaceAll: (initiatives) => set({ initiatives }),
      markBackedUpNow: () => set({ lastBackedUpAt: new Date().toISOString() }),
    }),
    {
      name: 'gtm-ai-roadmap-storage',
      version: 1,
    },
  ),
);
