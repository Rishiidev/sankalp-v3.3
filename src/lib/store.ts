/**
 * Zustand store — replaces the old React Context StoreProvider.
 *
 * Key improvements over the previous Context-based store:
 *  1. Selector-based subscriptions → components only re-render when their
 *     selected slice changes (vs. Context which re-renders ALL consumers).
 *  2. Actions use `get()` → always reads the latest state, eliminating
 *     stale-closure bugs in timers and effects.
 *  3. No Provider wrapper needed — just import `useStore` and use it.
 *  4. Proper TypeScript types everywhere — no more `any[]`.
 *  5. Blob URL lifecycle is managed (revoked on replacement).
 *  6. IDs use crypto.randomUUID() instead of Date.now().
 */

import { create } from 'zustand';
import { differenceInDays, startOfDay } from 'date-fns';
import {
  getUser, saveUser,
  getJournalEntries, saveJournalEntry,
  getCourseProgress, saveCourseProgress,
  getSessions, saveSession,
  getCustomAudio, saveCustomAudio, deleteCustomAudio,
  getMantraPresets, saveMantraPreset, deleteMantraPreset,
  getCustomSessionTypes, saveCustomSessionType, deleteCustomSessionType,
  getChantChallenges, saveChantChallenge, deleteChantChallenge,
  getCustomMeditations, saveCustomMeditation, deleteCustomMeditation,
} from './db';
import { normalizeYoutubeUrl } from './validation';
import type {
  UserData, UserLevel, Deity, ThemeId,
  JournalEntry, CourseCompletion, Session, SessionData,
  CustomTrack, MantraPreset, CustomSessionType,
  ChantChallenge, CustomMeditation, FavoriteQuote,
} from './types';
import { getLevelInfo, generateId } from './types';

// Re-export types that screens import from './store'
export type { UserData, UserLevel, Deity, ThemeId, MantraPreset, ChantChallenge, CustomSessionType, CustomTrack, CustomMeditation, FavoriteQuote, SessionData };
export { getLevelInfo };

// ─── Store shape ─────────────────────────────────────────────────────

interface StoreState {
  // Data
  user: UserData | null;
  loading: boolean;
  journal: JournalEntry[];
  course: CourseCompletion[];
  sessions: Session[];
  customTracks: CustomTrack[];
  mantraPresets: MantraPreset[];
  customSessionTypes: CustomSessionType[];
  chantChallenges: ChantChallenge[];
  customMeditations: CustomMeditation[];

  // Derived (recomputed when XP changes)
  level: UserLevel;
  nextLevelXP: number;
  progressPercentage: number;

  // Actions
  init: () => Promise<void>;
  updateUser: (data: Partial<UserData>) => Promise<void>;
  updateMalaCount: (count: number) => Promise<void>;
  toggleHaptics: () => Promise<void>;
  toggleFavoriteQuote: (quote: FavoriteQuote) => Promise<void>;
  addXP: (amount: number) => Promise<void>;
  addJournalEntry: (text: string, mood?: string) => Promise<void>;
  completeCourseDay: (day: number) => Promise<void>;
  addSession: (type: string, data: SessionData) => Promise<void>;

  // Custom tracks
  addCustomTrack: (name: string, blob: Blob) => Promise<void>;
  removeCustomTrack: (id: string) => Promise<void>;
  addYoutubeTrack: (name: string, url: string) => Promise<{ id: string; name: string; url: string } | null>;
  removeYoutubeTrack: (id: string) => Promise<void>;

  // Mantra presets
  addMantraPreset: (preset: Omit<MantraPreset, 'id'>) => Promise<void>;
  editMantraPreset: (id: string, preset: Partial<MantraPreset>) => Promise<void>;
  removeMantraPreset: (id: string) => Promise<void>;

  // Custom session types
  addCustomSessionType: (type: Omit<CustomSessionType, 'id'>) => Promise<void>;
  editCustomSessionType: (id: string, type: Partial<CustomSessionType>) => Promise<void>;
  removeCustomSessionType: (id: string) => Promise<void>;

  // Chant challenges
  addChantChallenge: (challenge: Omit<ChantChallenge, 'id' | 'progress' | 'completed'>) => Promise<void>;
  updateChantChallengeProgress: (id: string, amount: number) => Promise<void>;
  editChantChallengeProgress: (id: string, newProgress: number) => Promise<void>;
  editChantChallengeDeadline: (id: string, newDeadline: string) => Promise<void>;
  editChantChallengeDetails: (id: string, name: string, target: number, deadline: string | undefined) => Promise<void>;
  removeChantChallenge: (id: string) => Promise<void>;

  // Custom meditations
  addCustomMeditation: (name: string, duration: number, blob: Blob) => Promise<void>;
  removeCustomMeditation: (id: string) => Promise<void>;
}

// ─── Helpers ─────────────────────────────────────────────────────────

function createDefaultUser(): UserData {
  return {
    id: 'main',
    name: '',
    sankalp: '',
    xp: 0,
    streak: 0,
    lastActiveDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    onboardingCompleted: false,
    theme: 'midnight',
    deity: 'hanuman',
    hapticsEnabled: true,
    dailyGoals: {
      malas: 1,
      focusMinutes: 10,
      breatheSessions: 1,
    },
  };
}

async function applyThemeClasses(user: UserData) {
  let themeClass = user.theme && user.theme !== 'midnight' ? `theme-${user.theme}` : '';
  
  if (user.theme === 'cosmic') {
    try {
      const { fetchTodayPanchang, determineCosmicTheme } = await import('./panchang');
      const panchang = await fetchTodayPanchang();
      const cosmicTheme = determineCosmicTheme(panchang) || 'midnight';
      themeClass = cosmicTheme !== 'midnight' ? `theme-${cosmicTheme}` : '';
    } catch (e) {
      console.error('Failed to load cosmic theme:', e);
    }
  }

  const deityClass = user.deity ? `deity-${user.deity}` : 'deity-hanuman';
  document.documentElement.className = [themeClass, deityClass].filter(Boolean).join(' ');
}

/** Recompute level info and merge into partial state update. */
function withLevel(xp: number) {
  const info = getLevelInfo(xp);
  return { level: info.level, nextLevelXP: info.nextXP, progressPercentage: info.progress };
}

// ─── Default mantra presets ──────────────────────────────────────────

const DEFAULT_PRESETS: MantraPreset[] = [
  { id: 'default_hanuman', name: 'Hanuman Chalisa / Ram Naam', mantra: 'Sri Ram Jai Ram Jai Jai Ram', target: 108 },
  { id: 'default_shiva', name: 'Shiva Panchakshara', mantra: 'Om Namah Shivaya', target: 108 },
  { id: 'default_krishna', name: 'Maha Mantra', mantra: 'Hare Krishna Hare Rama', target: 108 },
];

// ─── Store ───────────────────────────────────────────────────────────

export const useStore = create<StoreState>()((set, get) => ({
  // Initial state
  user: null,
  loading: true,
  journal: [],
  course: [],
  sessions: [],
  customTracks: [],
  mantraPresets: [],
  customSessionTypes: [],
  chantChallenges: [],
  customMeditations: [],
  level: 'Balak' as UserLevel,
  nextLevelXP: 100,
  progressPercentage: 0,

  // ─── Init (called once from App.tsx useEffect) ───────────────────

  init: async () => {
    try {
      let userData = await getUser();

      if (userData) {
        // Streak check
        const today = startOfDay(new Date());
        const lastActive = startOfDay(new Date(userData.lastActiveDate));
        const diff = differenceInDays(today, lastActive);

        let newStreak = userData.streak;
        if (diff > 1) newStreak = 0;

        const hadCreatedAt = Boolean(userData.createdAt);
        let updatedUser: UserData = { ...userData, streak: newStreak };
        if (!hadCreatedAt) {
          updatedUser = { ...updatedUser, createdAt: userData.lastActiveDate || new Date().toISOString() };
        }
        if (diff > 1 || !hadCreatedAt) {
          await saveUser(updatedUser);
        }

        await applyThemeClasses(updatedUser);
        userData = updatedUser;
      } else {
        const newUser = createDefaultUser();
        await saveUser(newUser);
        userData = newUser;
      }

      // Load all data in parallel
      const [journalData, courseData, sessionsData, customAudioData, presetsData, customTypesData, challengesData, meditationsData] =
        await Promise.all([
          getJournalEntries(),
          getCourseProgress(),
          getSessions(),
          getCustomAudio(),
          getMantraPresets(),
          getCustomSessionTypes(),
          getChantChallenges(),
          getCustomMeditations(),
        ]);

      // Ensure default presets exist
      const allPresets = [...presetsData];
      for (const def of DEFAULT_PRESETS) {
        if (!allPresets.some(p => p.id === def.id)) {
          allPresets.push(def);
          await saveMantraPreset(def);
        }
      }

      // Ensure at least one custom session type exists
      let finalCustomTypes = customTypesData;
      if (finalCustomTypes.length === 0) {
        const newType: CustomSessionType = {
          id: generateId('custom_type'),
          name: 'Guided Meditation',
          icon: 'Music',
          color: '#8b5cf6',
        };
        await saveCustomSessionType(newType);
        finalCustomTypes = [newType];
      }

      // Ensure at least one challenge exists
      let finalChallenges = challengesData;
      if (finalChallenges.length === 0) {
        const newChallenge: ChantChallenge = {
          id: generateId('challenge'),
          name: 'Daily Mantra Recitation',
          target: 108,
          progress: 0,
          completed: false,
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        };
        await saveChantChallenge(newChallenge);
        finalChallenges = [newChallenge];
      }

      // Create Blob URLs for custom audio/meditations
      const tracks: CustomTrack[] = customAudioData.map(a => ({
        id: a.id,
        name: a.name,
        url: URL.createObjectURL(a.blob),
      }));

      const meditations: CustomMeditation[] = meditationsData.map(m => ({
        id: m.id,
        name: m.name,
        duration: m.duration,
        url: URL.createObjectURL(m.blob),
      }));

      const info = getLevelInfo(userData.xp);

      set({
        user: userData,
        journal: journalData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        course: courseData,
        sessions: sessionsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        customTracks: tracks,
        mantraPresets: allPresets,
        customSessionTypes: finalCustomTypes,
        chantChallenges: finalChallenges,
        customMeditations: meditations,
        level: info.level,
        nextLevelXP: info.nextXP,
        progressPercentage: info.progress,
        loading: false,
      });
    } catch (error) {
      console.error('Failed to load local app data', error);
      const fallback = createDefaultUser();
      document.documentElement.className = 'deity-hanuman';
      set({ user: fallback, loading: false, ...withLevel(0) });
    }
  },

  // ─── User actions ────────────────────────────────────────────────

  updateUser: async (data) => {
    const user = get().user;
    if (!user) return;
    const updated = { ...user, ...data };
    await saveUser(updated);
    set({ user: updated, ...withLevel(updated.xp) });
    if (data.theme !== undefined || data.deity !== undefined) {
      await applyThemeClasses(updated);
    }
  },

  updateMalaCount: async (count) => {
    const user = get().user;
    if (!user) return;
    const updated = { ...user, currentMalaCount: count };
    await saveUser(updated);
    set({ user: updated });
  },

  toggleHaptics: async () => {
    const user = get().user;
    if (!user) return;
    await get().updateUser({ hapticsEnabled: !user.hapticsEnabled });
  },

  toggleFavoriteQuote: async (quote) => {
    const user = get().user;
    if (!user) return;
    const current = user.favoriteQuotes || [];
    const isFav = current.some(q => q.text === quote.text);
    const newFavorites = isFav
      ? current.filter(q => q.text !== quote.text)
      : [...current, quote];
    await get().updateUser({ favoriteQuotes: newFavorites });
  },

  addXP: async (amount) => {
    const user = get().user;
    if (!user) return;
    const today = startOfDay(new Date());
    const lastActive = startOfDay(new Date(user.lastActiveDate));
    const diff = differenceInDays(today, lastActive);

    let newStreak = user.streak;
    if (diff > 0) newStreak += 1;
    else if (newStreak === 0) newStreak = 1;

    const updated: UserData = {
      ...user,
      xp: user.xp + amount,
      streak: newStreak,
      lastActiveDate: new Date().toISOString(),
    };
    await saveUser(updated);
    set({ user: updated, ...withLevel(updated.xp) });
  },

  // ─── Journal ─────────────────────────────────────────────────────

  addJournalEntry: async (text, mood) => {
    const entry: JournalEntry = {
      id: generateId(),
      date: new Date().toISOString(),
      text,
      mood,
    };
    await saveJournalEntry(entry);
    set(state => ({ journal: [entry, ...state.journal] }));
  },

  // ─── Course ──────────────────────────────────────────────────────

  completeCourseDay: async (day) => {
    await saveCourseProgress(day, true);
    set(state => ({
      course: [...state.course.filter(c => c.day !== day), { day, completed: true, completedAt: new Date().toISOString() }],
    }));
    await get().addXP(100);
  },

  // ─── Sessions ────────────────────────────────────────────────────

  addSession: async (type, data) => {
    const session: Session = {
      id: generateId(),
      date: new Date().toISOString(),
      type,
      ...data,
    };
    await saveSession(session);
    set(state => ({ sessions: [session, ...state.sessions] }));
  },

  // ─── Custom Audio ────────────────────────────────────────────────

  addCustomTrack: async (name, blob) => {
    const id = generateId('custom');
    await saveCustomAudio({ id, name, blob });
    set(state => ({
      customTracks: [...state.customTracks, { id, name, url: URL.createObjectURL(blob) }],
    }));
  },

  removeCustomTrack: async (id) => {
    const existing = get().customTracks.find(t => t.id === id);
    if (existing?.url?.startsWith('blob:')) {
      URL.revokeObjectURL(existing.url);
    }
    await deleteCustomAudio(id);
    set(state => ({ customTracks: state.customTracks.filter(t => t.id !== id) }));
  },

  addYoutubeTrack: async (name, url) => {
    const user = get().user;
    if (!user) return null;
    const normalizedUrl = normalizeYoutubeUrl(url.trim());
    if (!normalizedUrl) return null;
    const id = generateId('yt');
    const newTrack = { id, name, url: normalizedUrl };
    const newYoutubeTracks = [...(user.youtubeTracks || []), newTrack];
    await get().updateUser({ youtubeTracks: newYoutubeTracks });
    return newTrack;
  },

  removeYoutubeTrack: async (id) => {
    const user = get().user;
    if (!user) return;
    const newYoutubeTracks = (user.youtubeTracks || []).filter(t => t.id !== id);
    await get().updateUser({ youtubeTracks: newYoutubeTracks });
  },

  // ─── Mantra Presets ──────────────────────────────────────────────

  addMantraPreset: async (preset) => {
    const newPreset = { ...preset, id: generateId('preset') };
    await saveMantraPreset(newPreset);
    set(state => ({ mantraPresets: [...state.mantraPresets, newPreset] }));
  },

  editMantraPreset: async (id, preset) => {
    const existing = get().mantraPresets.find(p => p.id === id);
    if (!existing) return;
    const updated = { ...existing, ...preset };
    await saveMantraPreset(updated);
    set(state => ({ mantraPresets: state.mantraPresets.map(p => p.id === id ? updated : p) }));
  },

  removeMantraPreset: async (id) => {
    await deleteMantraPreset(id);
    set(state => ({ mantraPresets: state.mantraPresets.filter(p => p.id !== id) }));
  },

  // ─── Custom Session Types ────────────────────────────────────────

  addCustomSessionType: async (type) => {
    const newType = { ...type, id: generateId('custom_type') };
    await saveCustomSessionType(newType);
    set(state => ({ customSessionTypes: [...state.customSessionTypes, newType] }));
  },

  editCustomSessionType: async (id, type) => {
    const existing = get().customSessionTypes.find(t => t.id === id);
    if (!existing) return;
    const updated = { ...existing, ...type };
    await saveCustomSessionType(updated);
    set(state => ({ customSessionTypes: state.customSessionTypes.map(t => t.id === id ? updated : t) }));
  },

  removeCustomSessionType: async (id) => {
    await deleteCustomSessionType(id);
    set(state => ({ customSessionTypes: state.customSessionTypes.filter(t => t.id !== id) }));
  },

  // ─── Chant Challenges ────────────────────────────────────────────

  addChantChallenge: async (challenge) => {
    const newChallenge: ChantChallenge = { ...challenge, id: generateId('challenge'), progress: 0, completed: false };
    await saveChantChallenge(newChallenge);
    set(state => ({ chantChallenges: [...state.chantChallenges, newChallenge] }));
  },

  updateChantChallengeProgress: async (id, amount) => {
    const challenge = get().chantChallenges.find(c => c.id === id);
    if (!challenge) return;

    const newProgress = Math.min(challenge.target, challenge.progress + amount);
    const completed = newProgress >= challenge.target;
    const updatedChallenge: ChantChallenge = {
      ...challenge,
      progress: newProgress,
      completed,
      completedAt: completed && !challenge.completed ? new Date().toISOString() : challenge.completedAt,
    };

    await saveChantChallenge(updatedChallenge);
    set(state => ({ chantChallenges: state.chantChallenges.map(c => c.id === id ? updatedChallenge : c) }));

    if (completed && !challenge.completed) {
      await get().addXP(500);
    }
  },

  editChantChallengeProgress: async (id, newProgress) => {
    const challenge = get().chantChallenges.find(c => c.id === id);
    if (!challenge) return;

    const validProgress = Math.max(0, Math.min(challenge.target, newProgress));
    const completed = validProgress >= challenge.target;
    const updatedChallenge: ChantChallenge = {
      ...challenge,
      progress: validProgress,
      completed,
      completedAt: completed && !challenge.completed ? new Date().toISOString() : challenge.completedAt,
    };

    await saveChantChallenge(updatedChallenge);
    set(state => ({ chantChallenges: state.chantChallenges.map(c => c.id === id ? updatedChallenge : c) }));

    if (completed && !challenge.completed) {
      await get().addXP(500);
    }
  },

  editChantChallengeDeadline: async (id, newDeadline) => {
    const challenge = get().chantChallenges.find(c => c.id === id);
    if (!challenge) return;
    const updatedChallenge: ChantChallenge = { ...challenge, deadline: newDeadline || undefined };
    await saveChantChallenge(updatedChallenge);
    set(state => ({ chantChallenges: state.chantChallenges.map(c => c.id === id ? updatedChallenge : c) }));
  },

  editChantChallengeDetails: async (id, name, target, deadline) => {
    const challenge = get().chantChallenges.find(c => c.id === id);
    if (!challenge) return;

    const validProgress = Math.min(challenge.progress, target);
    const completed = validProgress >= target;
    const updatedChallenge: ChantChallenge = {
      ...challenge,
      name,
      target,
      progress: validProgress,
      deadline: deadline || undefined,
      completed,
      completedAt: completed && !challenge.completed ? new Date().toISOString() : challenge.completedAt,
    };

    await saveChantChallenge(updatedChallenge);
    set(state => ({ chantChallenges: state.chantChallenges.map(c => c.id === id ? updatedChallenge : c) }));
  },

  removeChantChallenge: async (id) => {
    await deleteChantChallenge(id);
    set(state => ({ chantChallenges: state.chantChallenges.filter(c => c.id !== id) }));
  },

  // ─── Custom Meditations ──────────────────────────────────────────

  addCustomMeditation: async (name, duration, blob) => {
    const id = generateId('custom_meditation');
    await saveCustomMeditation({ id, name, duration, blob });
    set(state => ({
      customMeditations: [...state.customMeditations, { id, name, duration, url: URL.createObjectURL(blob) }],
    }));
  },

  removeCustomMeditation: async (id) => {
    const existing = get().customMeditations.find(m => m.id === id);
    if (existing?.url?.startsWith('blob:')) {
      URL.revokeObjectURL(existing.url);
    }
    await deleteCustomMeditation(id);
    set(state => ({ customMeditations: state.customMeditations.filter(m => m.id !== id) }));
  },
}));
