/**
 * Shared type definitions for the Sankalp app.
 * Single source of truth — used by both the Zustand store and IndexedDB layer.
 */

// ─── User ────────────────────────────────────────────────────────────

export type UserLevel = 'Balak' | 'Sevak' | 'Veer' | 'Bhakt' | 'Mahaveer';
export type Deity = 'hanuman' | 'shiva' | 'krishna';
export type ThemeId = 'midnight' | 'dawn' | 'temple' | 'cosmic';

export interface DailyGoals {
  malas?: number;
  focusMinutes?: number;
  breatheSessions?: number;
}

export interface FavoriteQuote {
  text: string;
  source: string;
}

export interface YoutubeTrack {
  id: string;
  name: string;
  url: string;
}

export interface UserData {
  id: string;
  name: string;
  sankalp: string;
  xp: number;
  streak: number;
  lastActiveDate: string;
  /** ISO timestamp — set on first install; used for "Joined" display */
  createdAt?: string;
  onboardingCompleted: boolean;
  theme?: ThemeId;
  deity?: Deity;
  hapticsEnabled?: boolean;
  dailyGoals?: DailyGoals;
  favoriteQuotes?: FavoriteQuote[];
  currentMalaCount?: number;
  youtubeTracks?: YoutubeTrack[];
}

// ─── Journal ─────────────────────────────────────────────────────────

export interface JournalEntry {
  id: string;
  date: string;
  text: string;
  mood?: string;
}

// ─── Course ──────────────────────────────────────────────────────────

export interface CourseCompletion {
  day: number;
  completed: boolean;
  completedAt?: string;
}

// ─── Sessions ────────────────────────────────────────────────────────

export interface Session {
  id: string;
  date: string;
  type: string;
  count?: number;
  durationMinutes?: number;
  customTypeName?: string;
}

export interface SessionData {
  count?: number;
  durationMinutes?: number;
  customTypeName?: string;
}

// ─── Custom Audio ────────────────────────────────────────────────────

export interface CustomTrack {
  id: string;
  name: string;
  url: string;
}

export interface CustomAudioRecord {
  id: string;
  name: string;
  blob: Blob;
}

// ─── Mantra Presets ──────────────────────────────────────────────────

export interface MantraPreset {
  id: string;
  name: string;
  mantra: string;
  target: number;
}

// ─── Custom Session Types ────────────────────────────────────────────

export interface CustomSessionType {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}

// ─── Chant Challenges ────────────────────────────────────────────────

export interface ChantChallenge {
  id: string;
  name: string;
  target: number;
  progress: number;
  deadline?: string;
  completed: boolean;
  completedAt?: string;
  startDate?: string;
}

// ─── Custom Meditations ──────────────────────────────────────────────

export interface CustomMeditation {
  id: string;
  name: string;
  duration: number;
  url: string;
}

export interface CustomMeditationRecord {
  id: string;
  name: string;
  duration: number;
  blob: Blob;
}

// ─── Level helpers ───────────────────────────────────────────────────

export interface LevelInfo {
  level: UserLevel;
  nextXP: number;
  progress: number;
}

export function getLevelInfo(xp: number): LevelInfo {
  if (xp < 100) return { level: 'Balak', nextXP: 100, progress: (xp / 100) * 100 };
  if (xp < 300) return { level: 'Sevak', nextXP: 300, progress: ((xp - 100) / 200) * 100 };
  if (xp < 600) return { level: 'Veer', nextXP: 600, progress: ((xp - 300) / 300) * 100 };
  if (xp < 1000) return { level: 'Bhakt', nextXP: 1000, progress: ((xp - 600) / 400) * 100 };
  return { level: 'Mahaveer', nextXP: 1000, progress: 100 };
}

// ─── ID Generation ───────────────────────────────────────────────────

/** Generate a unique ID. Uses crypto.randomUUID where available, falls back to timestamp + random. */
export function generateId(prefix: string = ''): string {
  const uuid = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  return prefix ? `${prefix}_${uuid}` : uuid;
}
