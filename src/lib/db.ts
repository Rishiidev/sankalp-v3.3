import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type {
  UserData,
  JournalEntry,
  CourseCompletion,
  Session,
  CustomAudioRecord,
  MantraPreset,
  CustomSessionType,
  ChantChallenge,
  CustomMeditationRecord,
} from './types';

// ─── Schema ──────────────────────────────────────────────────────────

interface SadhanaDB extends DBSchema {
  user: {
    key: string;
    value: UserData;
  };
  journal: {
    key: string;
    value: JournalEntry;
    indexes: { 'by-date': string };
  };
  course: {
    key: number;
    value: CourseCompletion;
  };
  sessions: {
    key: string;
    value: Session;
    indexes: { 'by-date': string };
  };
  customAudio: {
    key: string;
    value: CustomAudioRecord;
  };
  mantraPresets: {
    key: string;
    value: MantraPreset;
  };
  customSessionTypes: {
    key: string;
    value: CustomSessionType;
  };
  chantChallenges: {
    key: string;
    value: ChantChallenge;
  };
  customMeditations: {
    key: string;
    value: CustomMeditationRecord;
  };
}

// ─── Singleton ───────────────────────────────────────────────────────

let dbPromise: Promise<IDBPDatabase<SadhanaDB>>;

export function initDB() {
  if (!dbPromise) {
    dbPromise = openDB<SadhanaDB>('sadhana-db', 6, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          db.createObjectStore('user', { keyPath: 'id' });
          const journalStore = db.createObjectStore('journal', { keyPath: 'id' });
          journalStore.createIndex('by-date', 'date');
          db.createObjectStore('course', { keyPath: 'day' });
        }
        if (oldVersion < 2) {
          const sessionStore = db.createObjectStore('sessions', { keyPath: 'id' });
          sessionStore.createIndex('by-date', 'date');
        }
        if (oldVersion < 3) {
          db.createObjectStore('customAudio', { keyPath: 'id' });
        }
        if (oldVersion < 4) {
          db.createObjectStore('mantraPresets', { keyPath: 'id' });
        }
        if (oldVersion < 5) {
          db.createObjectStore('customSessionTypes', { keyPath: 'id' });
          db.createObjectStore('chantChallenges', { keyPath: 'id' });
        }
        if (oldVersion < 6) {
          db.createObjectStore('customMeditations', { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

// ─── User ────────────────────────────────────────────────────────────

export async function getUser(): Promise<UserData | undefined> {
  const db = await initDB();
  return db.get('user', 'main');
}

export async function saveUser(user: UserData): Promise<void> {
  const db = await initDB();
  await db.put('user', { ...user, id: 'main' });
}

// ─── Journal ─────────────────────────────────────────────────────────

export async function getJournalEntries(): Promise<JournalEntry[]> {
  const db = await initDB();
  return db.getAllFromIndex('journal', 'by-date');
}

export async function saveJournalEntry(entry: JournalEntry): Promise<void> {
  const db = await initDB();
  await db.put('journal', entry);
}

// ─── Course ──────────────────────────────────────────────────────────

export async function getCourseProgress(): Promise<CourseCompletion[]> {
  const db = await initDB();
  return db.getAll('course');
}

export async function saveCourseProgress(day: number, completed: boolean): Promise<void> {
  const db = await initDB();
  await db.put('course', { day, completed, completedAt: new Date().toISOString() });
}

// ─── Sessions ────────────────────────────────────────────────────────

export async function getSessions(): Promise<Session[]> {
  const db = await initDB();
  return db.getAllFromIndex('sessions', 'by-date');
}

export async function saveSession(session: Session): Promise<void> {
  const db = await initDB();
  await db.put('sessions', session);
}

// ─── Custom Audio ────────────────────────────────────────────────────

export async function getCustomAudio(): Promise<CustomAudioRecord[]> {
  const db = await initDB();
  return db.getAll('customAudio');
}

export async function saveCustomAudio(audio: CustomAudioRecord): Promise<void> {
  const db = await initDB();
  await db.put('customAudio', audio);
}

export async function deleteCustomAudio(id: string): Promise<void> {
  const db = await initDB();
  await db.delete('customAudio', id);
}

// ─── Mantra Presets ──────────────────────────────────────────────────

export async function getMantraPresets(): Promise<MantraPreset[]> {
  const db = await initDB();
  return db.getAll('mantraPresets');
}

export async function saveMantraPreset(preset: MantraPreset): Promise<void> {
  const db = await initDB();
  await db.put('mantraPresets', preset);
}

export async function deleteMantraPreset(id: string): Promise<void> {
  const db = await initDB();
  await db.delete('mantraPresets', id);
}

// ─── Custom Session Types ────────────────────────────────────────────

export async function getCustomSessionTypes(): Promise<CustomSessionType[]> {
  const db = await initDB();
  return db.getAll('customSessionTypes');
}

export async function saveCustomSessionType(type: CustomSessionType): Promise<void> {
  const db = await initDB();
  await db.put('customSessionTypes', type);
}

export async function deleteCustomSessionType(id: string): Promise<void> {
  const db = await initDB();
  await db.delete('customSessionTypes', id);
}

// ─── Chant Challenges ────────────────────────────────────────────────

export async function getChantChallenges(): Promise<ChantChallenge[]> {
  const db = await initDB();
  return db.getAll('chantChallenges');
}

export async function saveChantChallenge(challenge: ChantChallenge): Promise<void> {
  const db = await initDB();
  await db.put('chantChallenges', challenge);
}

export async function deleteChantChallenge(id: string): Promise<void> {
  const db = await initDB();
  await db.delete('chantChallenges', id);
}

// ─── Custom Meditations ──────────────────────────────────────────────

export async function getCustomMeditations(): Promise<CustomMeditationRecord[]> {
  const db = await initDB();
  return db.getAll('customMeditations');
}

export async function saveCustomMeditation(meditation: CustomMeditationRecord): Promise<void> {
  const db = await initDB();
  await db.put('customMeditations', meditation);
}

export async function deleteCustomMeditation(id: string): Promise<void> {
  const db = await initDB();
  await db.delete('customMeditations', id);
}
