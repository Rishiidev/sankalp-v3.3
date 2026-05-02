/**
 * Shared constants, types, and helpers for the Sadhana sub-components.
 */
import { Book, Heart, Music, Star, Sun, Moon } from 'lucide-react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export const triggerHeavyHaptic = async () => {
  try {
    await Haptics.impact({ style: ImpactStyle.Heavy });
  } catch (e) {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
  }
};

export const triggerSuccessHaptic = async () => {
  try {
    await Haptics.vibrate();
    setTimeout(async () => await Haptics.vibrate(), 150);
  } catch (e) {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([100, 50, 100]);
  }
};

export const triggerLightHaptic = async () => {
  try {
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch (e) {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(20);
  }
};

export type BreathPhaseType = 'inhale' | 'hold1' | 'exhale' | 'hold2';

export interface BreathingPattern {
  id: string;
  name: string;
  description: string;
  phases: { phase: BreathPhaseType; duration: number; instruction: string }[];
}

export const BREATHING_PATTERNS: BreathingPattern[] = [
  {
    id: 'box',
    name: 'Box Breathing (4-4-4-4)',
    description: 'Balances energy, calms the nervous system.',
    phases: [
      { phase: 'inhale', duration: 4, instruction: 'Inhale' },
      { phase: 'hold1', duration: 4, instruction: 'Hold' },
      { phase: 'exhale', duration: 4, instruction: 'Exhale' },
      { phase: 'hold2', duration: 4, instruction: 'Hold' },
    ],
  },
  {
    id: 'relax',
    name: 'Relaxing (4-7-8)',
    description: 'Promotes deep relaxation and sleep.',
    phases: [
      { phase: 'inhale', duration: 4, instruction: 'Inhale' },
      { phase: 'hold1', duration: 7, instruction: 'Hold' },
      { phase: 'exhale', duration: 8, instruction: 'Exhale' },
    ],
  },
  {
    id: 'equal',
    name: 'Equal Breathing (5-5)',
    description: 'Improves focus and reduces stress.',
    phases: [
      { phase: 'inhale', duration: 5, instruction: 'Inhale' },
      { phase: 'exhale', duration: 5, instruction: 'Exhale' },
    ],
  },
];

export const DEFAULT_AUDIO_TRACKS = [
  { id: '1', name: 'Distant Chants', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: '2', name: 'Gentle Rain', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: '3', name: 'Forest Ambiance', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export const GUIDED_MEDITATIONS = [
  { id: 'gm1', name: 'Strength and Courage', duration: 5, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 'gm2', name: 'Devotion and Surrender', duration: 10, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 'gm3', name: 'Inner Peace', duration: 8, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export const ICON_LIBRARY = [
  { name: 'Book', component: Book },
  { name: 'Heart', component: Heart },
  { name: 'Music', component: Music },
  { name: 'Star', component: Star },
  { name: 'Sun', component: Sun },
  { name: 'Moon', component: Moon },
];

export function formatTime(seconds: number): string {
  if (isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/**
 * Send a browser notification and play a completion chime.
 * Accepts a pre-existing AudioContext to avoid creating new ones.
 */
export function notifyCompletion(
  title: string,
  body: string,
  getAudioContext: () => AudioContext,
) {
  try {
    const audioCtx = getAudioContext();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1046.5, audioCtx.currentTime + 0.5);

    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.5);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 1.5);
  } catch {
    // non-critical
  }

  if ('Notification' in window) {
    if (Notification.permission === 'granted') {
      new Notification(title, { body });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(p => {
        if (p === 'granted') new Notification(title, { body });
      });
    }
  }
}

/** Play a short tap sound through the shared AudioContext. */
export function playTapSound(getAudioContext: () => AudioContext) {
  try {
    const audioCtx = getAudioContext();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.15);
  } catch {
    // non-critical
  }
}
