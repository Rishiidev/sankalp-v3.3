import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { KeepAwake } from '@capacitor-community/keep-awake';
import { formatTime } from './constants';
import { SuccessRipple } from './SuccessRipple';

export function FocusTimerSelect({ onStart }: { onStart: (minutes: number) => void }) {
  const [focusDurationMinutes, setFocusDurationMinutes] = useState(5);
  const [customFocusDuration, setCustomFocusDuration] = useState<string>('');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
      <h2 className="text-xl font-semibold mb-4 text-center">Focus Mode</h2>
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[5, 10, 15, 20].map(mins => (
          <button
            key={mins}
            onClick={() => { setFocusDurationMinutes(mins); setCustomFocusDuration(''); }}
            className={`py-2 rounded-xl font-medium text-sm transition-colors ${
              focusDurationMinutes === mins && customFocusDuration === ''
                ? 'bg-orange-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {mins}m
          </button>
        ))}
      </div>
      <div className="mb-6">
        <input
          type="number" min="1" max="120"
          value={customFocusDuration}
          onChange={(e) => {
            setCustomFocusDuration(e.target.value);
            const val = parseInt(e.target.value);
            if (!isNaN(val) && val > 0 && val <= 120) setFocusDurationMinutes(val);
          }}
          placeholder="Custom duration (1-120 mins)"
          className="bg-slate-800 text-slate-200 rounded-xl px-4 py-3 w-full border border-slate-700 focus:outline-none focus:border-orange-500 text-center"
        />
      </div>
      <button
        onClick={() => {
          let finalMins = focusDurationMinutes;
          if (customFocusDuration) {
            const val = parseInt(customFocusDuration);
            finalMins = (!isNaN(val) && val > 0 && val <= 120) ? val : 5;
          }
          onStart(finalMins);
        }}
        className="w-full bg-slate-800 hover:bg-slate-700 text-white rounded-xl py-4 font-bold text-lg transition-colors"
      >
        Start Timer
      </button>
    </div>
  );
}

export function FocusActiveView({
  focusTime,
  focusDurationMinutes,
  isTimerRunning,
  setIsTimerRunning,
  onReturn,
}: {
  focusTime: number;
  focusDurationMinutes: number;
  isTimerRunning: boolean;
  setIsTimerRunning: (v: boolean) => void;
  onReturn: () => void;
}) {
  useEffect(() => {
    const manageKeepAwake = async () => {
      try {
        if (isTimerRunning && focusTime > 0) {
          await KeepAwake.keepAwake();
        } else {
          await KeepAwake.allowSleep();
        }
      } catch (e) {
        // May not be supported in some web environments
      }
    };
    manageKeepAwake();
    return () => {
      KeepAwake.allowSleep().catch(() => {});
    };
  }, [isTimerRunning, focusTime]);

  return (
    <>
      <div className="w-48 h-48 rounded-full border-4 border-orange-500/30 flex items-center justify-center relative overflow-hidden mb-12">
        <div className={`absolute inset-0 bg-orange-500/10 ${isTimerRunning ? 'animate-pulse' : ''}`} />
        <div className="relative z-10 text-4xl font-bold font-mono text-orange-500">
          {formatTime(focusTime)}
        </div>
      </div>

      {focusTime === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <SuccessRipple />
          <h3 className="text-2xl font-bold mb-2">Session Complete</h3>
          <p className="text-slate-400 mb-6">+{focusDurationMinutes * 10} XP earned</p>
          <button onClick={onReturn} className="bg-slate-800 hover:bg-slate-700 text-white rounded-xl px-8 py-3 font-medium transition-colors">Return</button>
        </motion.div>
      ) : (
        <div className="flex space-x-4">
          <button onClick={() => setIsTimerRunning(!isTimerRunning)} className="bg-orange-600 hover:bg-orange-500 text-white rounded-xl px-8 py-3 font-medium transition-colors">
            {isTimerRunning ? 'Pause' : 'Resume'}
          </button>
          <button onClick={() => { setIsTimerRunning(false); onReturn(); }} className="bg-slate-800 hover:bg-slate-700 text-white rounded-xl px-8 py-3 font-medium transition-colors">
            End
          </button>
        </div>
      )}
    </>
  );
}
