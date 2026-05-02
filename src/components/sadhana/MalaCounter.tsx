import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../../lib/store';
import type { MantraPreset } from '../../lib/store';
import { Plus, X, Edit2, Trash2 } from 'lucide-react';
import { playTapSound, notifyCompletion, triggerHeavyHaptic, triggerSuccessHaptic, triggerLightHaptic } from './constants';
import { SuccessRipple } from './SuccessRipple';
import { isToday } from 'date-fns';
import { VolumeButtons } from '@capgo/capacitor-volume-buttons';
import { KeepAwake } from '@capacitor-community/keep-awake';

interface MalaCounterProps {
  onReturn: () => void;
  getAudioContext: () => AudioContext;
}

export function MalaCounter({ onReturn, getAudioContext }: MalaCounterProps) {
  const {
    user, addXP, addSession, updateMalaCount,
    mantraPresets, addMantraPreset, editMantraPreset, removeMantraPreset,
    chantChallenges, updateChantChallengeProgress, sessions,
  } = useStore();

  const hapticEnabled = user?.hapticsEnabled ?? true;
  const defaultPresetId = user?.deity === 'shiva' ? 'default_shiva' : user?.deity === 'krishna' ? 'default_krishna' : 'default_hanuman';

  const [count, setCount] = useState(user?.currentMalaCount || 0);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(defaultPresetId);
  const [targetCount, setTargetCount] = useState(108);

  // Preset form state
  const [isCreatingPreset, setIsCreatingPreset] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetMantra, setNewPresetMantra] = useState('');
  const [newPresetTarget, setNewPresetTarget] = useState(108);
  const [editingPresetId, setEditingPresetId] = useState<string | null>(null);
  const [editPresetName, setEditPresetName] = useState('');
  const [editPresetMantra, setEditPresetMantra] = useState('');
  const [editPresetTarget, setEditPresetTarget] = useState(108);

  const activePreset = mantraPresets.find(p => p.id === selectedPresetId) || mantraPresets[0];
  const todaySessions = sessions.filter(s => isToday(new Date(s.date)));
  const todayMalas = todaySessions.filter(s => s.type === 'mala').length;
  const malaGoal = user?.dailyGoals?.malas || 1;

  useEffect(() => { setSelectedPresetId(defaultPresetId); }, [user?.deity, defaultPresetId]);
  useEffect(() => { if (activePreset) setTargetCount(activePreset.target); }, [activePreset]);

  const handleTap = () => {
    if (count < targetCount) {
      const newCount = count + 1;
      setCount(newCount);
      updateMalaCount(newCount);
      playTapSound(getAudioContext);
      if (hapticEnabled) triggerHeavyHaptic();

      if (newCount === targetCount) {
        notifyCompletion('Mala Complete', 'You have finished chanting your daily mala.', getAudioContext);
        addXP(targetCount * 2);
        addSession('mala', { count: targetCount });
        updateMalaCount(0);
        chantChallenges.filter(c => !c.completed).forEach(c => {
          updateChantChallengeProgress(c.id, targetCount);
        });
        if (hapticEnabled) triggerSuccessHaptic();
      }
    }
  };

  const resetMala = () => { setCount(0); updateMalaCount(0); };

  const handleCreatePreset = async () => {
    if (newPresetName.trim() && newPresetMantra.trim() && newPresetTarget > 0) {
      await addMantraPreset({ name: newPresetName, mantra: newPresetMantra, target: newPresetTarget });
      setIsCreatingPreset(false);
      setNewPresetName(''); setNewPresetMantra(''); setNewPresetTarget(108);
    }
  };

  const handleEditPreset = async () => {
    if (editingPresetId && editPresetName.trim() && editPresetMantra.trim() && editPresetTarget > 0) {
      await editMantraPreset(editingPresetId, { name: editPresetName, mantra: editPresetMantra, target: editPresetTarget });
      setEditingPresetId(null);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
      <h2 className="text-xl font-semibold mb-4 text-center">Digital Mala</h2>

      {isCreatingPreset || editingPresetId ? (
        <div className="bg-slate-800 rounded-2xl p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">{editingPresetId ? 'Edit Mantra Preset' : 'New Mantra Preset'}</h3>
            <button onClick={() => { setIsCreatingPreset(false); setEditingPresetId(null); }} className="text-slate-400 hover:text-white">
              <X size={20} />
            </button>
          </div>
          <div className="space-y-3">
            <input
              type="text" placeholder="Preset Name (e.g., Shiva Mantra)"
              value={editingPresetId ? editPresetName : newPresetName}
              onChange={(e) => editingPresetId ? setEditPresetName(e.target.value) : setNewPresetName(e.target.value)}
              className="w-full bg-slate-900 text-white rounded-lg px-3 py-2 border border-slate-700 focus:border-orange-500 focus:outline-none"
            />
            <input
              type="text" placeholder="Mantra Text (e.g., Om Namah Shivaya)"
              value={editingPresetId ? editPresetMantra : newPresetMantra}
              onChange={(e) => editingPresetId ? setEditPresetMantra(e.target.value) : setNewPresetMantra(e.target.value)}
              className="w-full bg-slate-900 text-white rounded-lg px-3 py-2 border border-slate-700 focus:border-orange-500 focus:outline-none"
            />
            <div className="flex items-center space-x-3">
              <span className="text-sm text-slate-400">Target:</span>
              <input
                type="number" min="1"
                value={editingPresetId ? editPresetTarget : newPresetTarget}
                onChange={(e) => editingPresetId ? setEditPresetTarget(parseInt(e.target.value) || 108) : setNewPresetTarget(parseInt(e.target.value) || 108)}
                className="w-24 bg-slate-900 text-white rounded-lg px-3 py-2 border border-slate-700 focus:border-orange-500 focus:outline-none"
              />
            </div>
            <button
              onClick={editingPresetId ? handleEditPreset : handleCreatePreset}
              className="w-full bg-orange-600 hover:bg-orange-500 text-white rounded-lg py-2 font-medium transition-colors mt-2"
            >
              {editingPresetId ? 'Save Changes' : 'Save Preset'}
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm text-slate-400">Select Mantra</label>
            <button onClick={() => setIsCreatingPreset(true)} className="text-xs text-orange-500 hover:text-orange-400 flex items-center">
              <Plus size={14} className="mr-1" /> New
            </button>
          </div>
          <div className="space-y-2">
            {mantraPresets.map(preset => (
              <div key={preset.id} className={`flex items-center justify-between bg-slate-800 rounded-xl p-3 border ${selectedPresetId === preset.id ? 'border-orange-500' : 'border-transparent'}`}>
                <button onClick={() => setSelectedPresetId(preset.id)} className="flex-1 flex items-center text-left text-white">
                  <span className="font-medium">{preset.name}</span>
                  <span className="ml-2 text-sm text-slate-400">({preset.target})</span>
                </button>
                {preset.id !== 'default_hanuman' && preset.id !== 'default_shiva' && preset.id !== 'default_krishna' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => { setEditingPresetId(preset.id); setEditPresetName(preset.name); setEditPresetMantra(preset.mantra); setEditPresetTarget(preset.target); }}
                      className="p-2 text-slate-400 hover:text-white transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => { removeMantraPreset(preset.id); if (selectedPresetId === preset.id) setSelectedPresetId(defaultPresetId); }}
                      className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => resetMala()}
        className="w-full bg-orange-600 hover:bg-orange-500 text-white rounded-xl py-4 font-bold text-lg transition-colors mb-6"
      >
        Start Chanting
      </button>

      <div className="bg-slate-800 rounded-2xl p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-sm text-slate-300">Daily Goal Progress</h3>
          <span className="text-xs text-orange-500 font-medium">{todayMalas} / {malaGoal} Malas</span>
        </div>
        <div className="h-2 bg-slate-900 rounded-full overflow-hidden mb-4">
          <div className="h-full bg-orange-500 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (todayMalas / malaGoal) * 100)}%` }} />
        </div>
        <button
          onClick={() => {
            const cnt = activePreset?.target || 108;
            addSession('mala', { count: cnt });
            addXP(cnt * 2);
            chantChallenges.filter(c => !c.completed).forEach(c => { updateChantChallengeProgress(c.id, cnt); });
            if (hapticEnabled) triggerSuccessHaptic();
          }}
          className="w-full bg-slate-700 hover:bg-slate-600 text-white rounded-lg py-2 text-sm font-medium transition-colors flex items-center justify-center"
        >
          <Plus size={16} className="mr-2" /> Quick Log (1 Mala)
        </button>
      </div>
    </div>
  );
}

/** Active mala counting screen — shown when mode === 'mala'. */
export function MalaActiveSession({
  onReturn,
  getAudioContext,
}: MalaCounterProps) {
  const {
    user, addXP, addSession, updateMalaCount,
    mantraPresets, chantChallenges, updateChantChallengeProgress,
  } = useStore();

  const hapticEnabled = user?.hapticsEnabled ?? true;
  const defaultPresetId = user?.deity === 'shiva' ? 'default_shiva' : user?.deity === 'krishna' ? 'default_krishna' : 'default_hanuman';
  const [selectedPresetId] = useState<string>(defaultPresetId);
  const [count, setCount] = useState(0);
  const [eyesClosedMode, setEyesClosedMode] = useState(false);
  const [useFullScreen, setUseFullScreen] = useState(true);
  const [useEarbuds, setUseEarbuds] = useState(true);
  const [useVolume, setUseVolume] = useState(true);
  const activePreset = mantraPresets.find(p => p.id === selectedPresetId) || mantraPresets[0];
  const targetCount = activePreset?.target || 108;

  // Use a ref so the Capacitor event listener always sees the latest count
  const countRef = useRef(count);
  useEffect(() => {
    countRef.current = count;
  }, [count]);

  const handleTap = () => {
    const currentCount = countRef.current;
    if (currentCount < targetCount) {
      const newCount = currentCount + 1;
      setCount(newCount);
      updateMalaCount(newCount);
      playTapSound(getAudioContext);
      if (hapticEnabled) triggerHeavyHaptic();

      if (newCount === targetCount) {
        notifyCompletion('Mala Complete', 'You have finished chanting your daily mala.', getAudioContext);
        addXP(targetCount * 2);
        addSession('mala', { count: targetCount });
        updateMalaCount(0);
        chantChallenges.filter(c => !c.completed).forEach(c => { updateChantChallengeProgress(c.id, targetCount); });
        if (hapticEnabled) triggerSuccessHaptic();
      }
    }
  };

  const handleDecrease = () => {
    const currentCount = countRef.current;
    if (currentCount > 0 && currentCount < targetCount) {
      const newCount = currentCount - 1;
      setCount(newCount);
      updateMalaCount(newCount);
      if (hapticEnabled) triggerLightHaptic();
    }
  };

  useEffect(() => {
    let volumeListener: any = null;

    const setupListeners = async () => {
      try {
        volumeListener = await VolumeButtons.addListener('volumeButtonPressed', (event) => {
          if (event.direction === 'up') {
            handleTap();
          } else if (event.direction === 'down') {
            handleDecrease();
          }
        });
      } catch (e) {
        console.warn('VolumeButtons plugin not available', e);
      }
    };

    if (eyesClosedMode) {
      if (useVolume) setupListeners();
      
      // Setup Web MediaSession API (Earbuds Hack)
      if (useEarbuds && 'mediaSession' in navigator) {
        try {
          navigator.mediaSession.setActionHandler('nexttrack', () => { handleTap(); });
          navigator.mediaSession.setActionHandler('previoustrack', () => { handleDecrease(); });
        } catch (e) {
          console.warn('MediaSession API not supported', e);
        }
      }
    }

    return () => {
      if (volumeListener) volumeListener.remove();
      if ('mediaSession' in navigator) {
        try {
          navigator.mediaSession.setActionHandler('nexttrack', null);
          navigator.mediaSession.setActionHandler('previoustrack', null);
        } catch (e) {}
      }
    };
  }, [eyesClosedMode, useVolume, useEarbuds]);

  // Keep screen awake during entire active mala session
  useEffect(() => {
    const manageKeepAwake = async () => {
      try {
        if (count < targetCount) {
          await KeepAwake.keepAwake();
        } else {
          await KeepAwake.allowSleep();
        }
      } catch (e) {}
    };
    manageKeepAwake();
    return () => {
      KeepAwake.allowSleep().catch(() => {});
    };
  }, [count, targetCount]);

  return (
    <div 
      className={`relative w-full h-full flex flex-col items-center pt-8 transition-all duration-500 ${eyesClosedMode && useFullScreen ? 'rounded-3xl shadow-[0_0_40px_rgba(249,115,22,0.15)] ring-1 ring-orange-500/30' : ''}`}
      onClick={(e) => {
        // If eyes closed mode is on, tapping ANYWHERE on the wrapper triggers the tap
        // unless they are clicking the toggle button itself
        if (eyesClosedMode && useFullScreen && count < targetCount && !(e.target as HTMLElement).closest('button') && !(e.target as HTMLElement).closest('input')) {
          handleTap();
        }
      }}
    >
      <div className="mb-8 text-center px-4">
        <p className="text-sm text-orange-500 font-medium mb-1 uppercase tracking-wider">{activePreset?.name}</p>
        <p className="text-xl md:text-2xl font-serif text-slate-200 italic">"{activePreset?.mantra}"</p>
      </div>

      <motion.div
        className="w-72 h-72 relative mb-8 flex items-center justify-center cursor-pointer select-none"
        onClick={handleTap}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
          <circle cx="100" cy="180" r="6" fill="#f97316" />
          <line x1="100" y1="180" x2="100" y2="195" stroke="#f97316" strokeWidth="3" />
          <line x1="95" y1="195" x2="105" y2="195" stroke="#f97316" strokeWidth="2" />
          {Array.from({ length: 108 }).map((_, i) => {
            const angle = (Math.PI / 2) + ((i + 1) * (Math.PI * 2) / 108);
            const radius = 75;
            const cx = 100 + Math.cos(angle) * radius;
            const cy = 100 + Math.sin(angle) * radius;
            const targetNormalized = Math.min(count, targetCount);
            const completedBeads = Math.floor((targetNormalized / targetCount) * 108);
            const isCompleted = i < completedBeads;
            const isCurrent = i === completedBeads;
            return (
              <circle key={i} cx={cx} cy={cy} r={isCurrent && targetNormalized < targetCount ? 4 : 3} fill={isCompleted ? '#f97316' : '#334155'} className="transition-all duration-300" />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-6xl font-bold text-white tracking-tighter" style={{ textShadow: '0 4px 24px rgba(0,0,0,0.5)' }}>{count}</span>
          <span className="text-slate-400 mt-1 font-medium tracking-widest text-sm">/ {targetCount}</span>
        </div>
        <AnimatePresence>
          {count > 0 && count < targetCount && (
            <motion.div key={count} initial={{ scale: 0.8, opacity: 0.5 }} animate={{ scale: 1.1, opacity: 0 }} transition={{ duration: 0.4, ease: 'easeOut' }} className="absolute inset-4 rounded-full bg-orange-500/10 pointer-events-none" />
          )}
        </AnimatePresence>
      </motion.div>

      {count < targetCount && (
        <div className="flex flex-col items-center mb-6 relative z-10 w-full max-w-[240px]">
          <div className="flex items-center justify-between w-full mb-2">
            <span className={`text-sm font-medium transition-colors ${eyesClosedMode ? 'text-orange-400' : 'text-slate-300'}`}>Eyes-Closed Mode</span>
            <button 
              onClick={() => setEyesClosedMode(!eyesClosedMode)}
              className={`w-12 h-6 rounded-full transition-colors flex items-center p-1 ${eyesClosedMode ? 'bg-orange-500' : 'bg-slate-700'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${eyesClosedMode ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
          
          <AnimatePresence>
            {eyesClosedMode && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="w-full bg-slate-800/80 backdrop-blur-sm rounded-xl overflow-hidden mt-2"
              >
                <div className="p-3 space-y-3">
                  <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer hover:text-white transition-colors">
                    <span>Full-Screen Tap</span>
                    <input type="checkbox" checked={useFullScreen} onChange={(e) => setUseFullScreen(e.target.checked)} className="accent-orange-500 w-4 h-4" />
                  </label>
                  <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer hover:text-white transition-colors">
                    <span>Earbud Controls</span>
                    <input type="checkbox" checked={useEarbuds} onChange={(e) => setUseEarbuds(e.target.checked)} className="accent-orange-500 w-4 h-4" />
                  </label>
                  <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer hover:text-white transition-colors">
                    <span>Volume Buttons (Native)</span>
                    <input type="checkbox" checked={useVolume} onChange={(e) => setUseVolume(e.target.checked)} className="accent-orange-500 w-4 h-4" />
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {count >= targetCount ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <SuccessRipple />
          <h3 className="text-2xl font-bold mb-2">Sadhana Complete</h3>
          <p className="text-slate-400 mb-6">+{targetCount * 2} XP earned</p>
          <button onClick={onReturn} className="bg-slate-800 hover:bg-slate-700 text-white rounded-xl px-8 py-3 font-medium transition-colors">Return</button>
        </motion.div>
      ) : (
        <p className="text-slate-500 animate-pulse text-sm">
          {eyesClosedMode ? 'Tap anywhere or use volume keys' : 'Tap the circle to count'}
        </p>
      )}
    </div>
  );
}
