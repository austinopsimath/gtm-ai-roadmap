import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Initiative } from '../types';
import type { PicklistKind } from '../constants/picklists';

interface RoadmapState {
  initiatives: Initiative[];
  lastBackedUpAt: string | null;
  customAudiences: string[];
  customTechnologies: string[];
  customSystems: string[];
  customLevel3Metrics: string[];
  addInitiative: (initiative: Initiative) => void;
  updateInitiative: (id: string, patch: Partial<Initiative>) => void;
  deleteInitiative: (id: string) => void;
  replaceAll: (initiatives: Initiative[]) => void;
  markBackedUpNow: () => void;
  addCustomOption: (kind: PicklistKind, value: string) => void;
}

type LegacyInitiativeV1 = Omit<
  Initiative,
  | 'audiencesServed'
  | 'technologies'
  | 'systemsTouched'
  | 'caretNotes'
  | 'scoredAt'
  | 'scoredBy'
  | 'panelists'
> & {
  audiencesServed?: string | string[];
  technologies?: string | string[];
  systemsTouched?: string | string[];
  caretNotes?: Initiative['caretNotes'];
  scoredAt?: string | null;
  scoredBy?: string;
  panelists?: Initiative['panelists'];
};

const splitLegacyString = (raw: string | string[] | undefined): string[] => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  return raw
    .split(/[,\n;]+/)
    .map((s) => s.trim())
    .filter(Boolean);
};

const migrateLegacyInitiative = (raw: LegacyInitiativeV1): Initiative => {
  const caret = raw.caret ?? { c: 0, a: 0, r: 0, e: 0, t: 0 };
  const hasExistingScores = Object.values(caret).some((v) => v > 0);
  // If there are existing consensus scores but no panelists yet, seed a single
  // synthetic "Consensus" panelist so the new panel data model has something
  // to derive from.
  const seededPanelists =
    raw.panelists && raw.panelists.length > 0
      ? raw.panelists
      : hasExistingScores
        ? [
            {
              id: crypto.randomUUID(),
              name: 'Consensus',
              role: 'Imported from prior scoring',
              scores: caret,
            },
          ]
        : [];
  return {
    ...(raw as unknown as Initiative),
    audiencesServed: splitLegacyString(raw.audiencesServed),
    technologies: splitLegacyString(raw.technologies),
    systemsTouched: splitLegacyString(raw.systemsTouched),
    caret,
    caretNotes: raw.caretNotes ?? { c: '', a: '', r: '', e: '', t: '' },
    panelists: seededPanelists,
    scoredAt: raw.scoredAt ?? null,
    scoredBy: raw.scoredBy ?? '',
  };
};

const STORE_VERSION = 4;

export const useRoadmapStore = create<RoadmapState>()(
  persist(
    (set) => ({
      initiatives: [],
      lastBackedUpAt: null,
      customAudiences: [],
      customTechnologies: [],
      customSystems: [],
      customLevel3Metrics: [],
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
      replaceAll: (initiatives) =>
        set({
          initiatives: initiatives.map((i) =>
            migrateLegacyInitiative(i as unknown as LegacyInitiativeV1),
          ),
        }),
      markBackedUpNow: () => set({ lastBackedUpAt: new Date().toISOString() }),
      addCustomOption: (kind, value) =>
        set((state) => {
          const trimmed = value.trim();
          if (!trimmed) return state;
          const map = {
            audiences: 'customAudiences',
            technologies: 'customTechnologies',
            systems: 'customSystems',
            level3Metrics: 'customLevel3Metrics',
          } as const;
          const key = map[kind];
          const list = state[key];
          if (list.includes(trimmed)) return state;
          return { ...state, [key]: [...list, trimmed] };
        }),
    }),
    {
      name: 'gtm-ai-roadmap-storage',
      version: STORE_VERSION,
      migrate: (persistedState, version) => {
        const raw = persistedState as Record<string, unknown>;
        const legacyInitiatives =
          (raw.initiatives as LegacyInitiativeV1[] | undefined) ?? [];
        if (version < STORE_VERSION) {
          return {
            ...raw,
            initiatives: legacyInitiatives.map(migrateLegacyInitiative),
            customAudiences: (raw.customAudiences as string[] | undefined) ?? [],
            customTechnologies:
              (raw.customTechnologies as string[] | undefined) ?? [],
            customSystems: (raw.customSystems as string[] | undefined) ?? [],
            customLevel3Metrics:
              (raw.customLevel3Metrics as string[] | undefined) ?? [],
          } as RoadmapState;
        }
        return raw as unknown as RoadmapState;
      },
    },
  ),
);
