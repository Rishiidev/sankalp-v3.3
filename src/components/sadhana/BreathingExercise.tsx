import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Wind } from 'lucide-react';
import { KeepAwake } from '@capacitor-community/keep-awake';
import { BREATHING_PATTERNS } from './constants';
import { SuccessRipple } from './SuccessRipple';

export function BreathingSelect({ onStart }: { onStart: (patternId: string, cycles: number) => void }) {
  const [selectedPatternId, setSelectedPatternId] = useState('box');
  const [targetCycles, setTargetCycles] = useState(10);
  
  const activePattern = BREATHING_PATTERNS.find(p => p.id === selectedPatternId) || BREATHING_PATTERNS[0];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
      <h2 className="text-xl font-semibold mb-4 text-center flex items-center justify-center">
        <Wind className="mr-2 text-orange-500" /> Pranayama
      </h2>
      <p className="text-center text-slate-400 text-sm mb-4">Select a breathing pattern to calm the mind.</p>
      
      <div className="space-y-4 mb-6">
        <select 
          value={selectedPatternId}
          onChange={(e) => setSelectedPatternId(e.target.value)}
          className="w-full bg-slate-800 text-white rounded-xl px-4 py-3 border border-slate-700 focus:outline-none focus:border-orange-500"
        >
          {BREATHING_PATTERNS.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        
        <div className="text-center text-sm text-slate-400">
          {activePattern.description}
        </div>

        <div className="flex items-center justify-between bg-slate-800 rounded-xl p-3">
          <span className="text-sm text-slate-300 ml-2">Cycles</span>
          <div className="flex space-x-2">
            {[5, 10, 20].map(c => (
              <button
                key={c}
                onClick={() => setTargetCycles(c)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  targetCycles === c ? 'bg-orange-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => onStart(selectedPatternId, targetCycles)}
        className="w-full bg-slate-800 hover:bg-slate-700 text-white rounded-xl py-4 font-bold text-lg transition-colors"
      >
        Start Breathing
      </button>
    </div>
  );
}

export function BreathingActiveView({
  activePatternId,
  currentPhaseIndex,
  breathPhaseTime,
  breatheCycles,
  targetCycles,
  isTimerRunning,
  setIsTimerRunning,
  onReturn,
}: {
  activePatternId: string;
  currentPhaseIndex: number;
  breathPhaseTime: number;
  breatheCycles: number;
  targetCycles: number;
  isTimerRunning: boolean;
  setIsTimerRunning: (v: boolean) => void;
  onReturn: () => void;
}) {
  const activePattern = BREATHING_PATTERNS.find(p => p.id === activePatternId) || BREATHING_PATTERNS[0];
  const activePhase = activePattern.phases[currentPhaseIndex] || activePattern.phases[0];

  useEffect(() => {
    const manageKeepAwake = async () => {
      try {
        if (isTimerRunning && breatheCycles < targetCycles) {
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
  }, [isTimerRunning, breatheCycles, targetCycles]);

  return (
    <>
      <div className="relative w-64 h-64 flex items-center justify-center mb-12">
        <motion.div 
          className="absolute inset-0 rounded-full bg-orange-500/20 border-2 border-orange-500/50"
          animate={{ 
            scale: activePhase.phase === 'inhale' || activePhase.phase === 'hold1' ? 1.5 : 1 
          }}
          transition={{ 
            duration: activePhase.duration, 
            ease: "easeInOut" 
          }}
        />
        <div className="relative z-10 flex flex-col items-center">
          <h3 className="text-3xl font-bold text-orange-500 mb-2">{activePhase.instruction}</h3>
          <span className="text-4xl font-mono text-white">{breathPhaseTime}</span>
        </div>
      </div>

      {breatheCycles >= targetCycles ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <SuccessRipple />
          <h3 className="text-2xl font-bold mb-2">Session Complete</h3>
          <p className="text-slate-400 mb-6">+20 XP earned</p>
          <button onClick={onReturn} className="bg-slate-800 hover:bg-slate-700 text-white rounded-xl px-8 py-3 font-medium transition-colors">
            Return
          </button>
        </motion.div>
      ) : (
        <div className="flex flex-col items-center space-y-6">
          <p className="text-slate-400">Cycle {breatheCycles + 1} of {targetCycles}</p>
          <div className="flex space-x-4">
            <button onClick={() => setIsTimerRunning(!isTimerRunning)} className="bg-orange-600 hover:bg-orange-500 text-white rounded-xl px-8 py-3 font-medium transition-colors">
              {isTimerRunning ? 'Pause' : 'Resume'}
            </button>
            <button onClick={() => { setIsTimerRunning(false); onReturn(); }} className="bg-slate-800 hover:bg-slate-700 text-white rounded-xl px-8 py-3 font-medium transition-colors">
              End
            </button>
          </div>
        </div>
      )}
    </>
  );
}
