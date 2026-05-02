import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../lib/store';
import { Vibrate, VibrateOff } from 'lucide-react';
import { isToday } from 'date-fns';

// Extracted Sub-Components
import { BREATHING_PATTERNS, formatTime, GUIDED_MEDITATIONS, notifyCompletion, triggerLightHaptic, triggerSuccessHaptic, DEFAULT_AUDIO_TRACKS } from '../components/sadhana/constants';
import { MalaCounter, MalaActiveSession } from '../components/sadhana/MalaCounter';
import { FocusTimerSelect, FocusActiveView } from '../components/sadhana/FocusTimer';
import { BreathingSelect, BreathingActiveView } from '../components/sadhana/BreathingExercise';
import { CustomSessionSelect, CustomSessionActiveView } from '../components/sadhana/CustomSession';
import { ChantChallenges } from '../components/sadhana/ChantChallenges';
import { AudioLibrary, AudioPlayer } from '../components/sadhana/AudioControls';
import { MeditationSelect, MeditationActiveView } from '../components/sadhana/MeditationPlayer';

interface Props {
  onOpenChalisa?: () => void;
}

export function Sadhana({ onOpenChalisa }: Props) {
  const { user, updateUser, addXP, addSession, customTracks } = useStore();
  const [activeTab, setActiveTab] = useState<'practices' | 'meditations' | 'challenges'>('practices');
  const [mode, setMode] = useState<'select' | 'mala' | 'focus' | 'breathe' | 'custom' | 'meditation'>('select');
  const hapticEnabled = user?.hapticsEnabled ?? true;

  // Shared AudioContext
  const audioCtxRef = useRef<AudioContext | null>(null);
  const getAudioContext = () => {
    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
    return audioCtxRef.current;
  };
  useEffect(() => {
    return () => { if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') audioCtxRef.current.close(); };
  }, []);

  // Shared Audio State (since it runs globally while user does sadhana)
  const allTracks = [...DEFAULT_AUDIO_TRACKS, ...customTracks, ...(user?.youtubeTracks || [])];
  const [showAudioLibrary, setShowAudioLibrary] = useState(false);
  const [showAudioControls, setShowAudioControls] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(allTracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [showVideo, setShowVideo] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const playerRef = useRef<any>(null);

  // Timer Orchestration State
  const [focusDurationMinutes, setFocusDurationMinutes] = useState(5);
  const [focusTime, setFocusTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [selectedCustomTypeId, setSelectedCustomTypeId] = useState<string>('');
  const [customSessionDuration, setCustomSessionDuration] = useState(15);
  
  // Breathing Orchestration State
  const [selectedPatternId, setSelectedPatternId] = useState('box');
  const [targetCycles, setTargetCycles] = useState(10);
  const [breatheCycles, setBreatheCycles] = useState(0);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [breathPhaseTime, setBreathPhaseTime] = useState(4);

  // Meditation Orchestration State
  const [selectedMeditation, setSelectedMeditation] = useState<any>(null);

  // Global Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if ((mode === 'focus' || mode === 'custom' || mode === 'meditation') && isTimerRunning && focusTime > 0) {
      interval = setInterval(() => setFocusTime(prev => prev - 1), 1000);
    } else if (mode === 'focus' && focusTime === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      notifyCompletion("Focus Session Complete", `You have focused for ${focusDurationMinutes} minutes.`, getAudioContext);
      addXP(focusDurationMinutes * 10);
      addSession('focus', { durationMinutes: focusDurationMinutes });
      if (hapticEnabled) triggerSuccessHaptic();
    } else if (mode === 'custom' && focusTime === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      notifyCompletion("Session Complete", `Custom session finished.`, getAudioContext);
      addXP(customSessionDuration * 10);
      addSession(selectedCustomTypeId, { durationMinutes: customSessionDuration, customTypeName: 'Custom' });
      if (hapticEnabled) triggerSuccessHaptic();
    } else if (mode === 'meditation' && focusTime === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      notifyCompletion("Meditation Complete", `Guided meditation finished.`, getAudioContext);
      if (hapticEnabled) triggerSuccessHaptic();
    }
    return () => clearInterval(interval);
  }, [mode, isTimerRunning, focusTime, addXP, focusDurationMinutes, customSessionDuration, selectedCustomTypeId, hapticEnabled, addSession]);

  // Global Breathing Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (mode === 'breathe' && isTimerRunning && breatheCycles < targetCycles) {
      const activePattern = BREATHING_PATTERNS.find(p => p.id === selectedPatternId) || BREATHING_PATTERNS[0];
      interval = setInterval(() => {
        setBreathPhaseTime(prev => {
          if (prev <= 1) {
            if (hapticEnabled) triggerLightHaptic();
            const nextIdx = (currentPhaseIndex + 1) % activePattern.phases.length;
            setCurrentPhaseIndex(nextIdx);
            if (nextIdx === 0) setBreatheCycles(c => c + 1);
            return activePattern.phases[nextIdx].duration;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (mode === 'breathe' && breatheCycles >= targetCycles && isTimerRunning) {
      setIsTimerRunning(false);
      notifyCompletion("Breathing Complete", "Pranayama session finished.", getAudioContext);
      addXP(20);
      addSession('breathe', { count: targetCycles });
      if (hapticEnabled) triggerSuccessHaptic();
    }
    return () => clearInterval(interval);
  }, [mode, isTimerRunning, breatheCycles, targetCycles, currentPhaseIndex, selectedPatternId, addXP, hapticEnabled, addSession]);

  return (
    <div className="p-6 h-full flex flex-col pb-32 overflow-y-auto">
      <header className="pt-8 mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sadhana</h1>
          <p className="text-slate-400 mt-2">Focus your mind, chant with devotion.</p>
        </div>
        <button 
          onClick={() => updateUser({ hapticsEnabled: !hapticEnabled })}
          className={`p-2 rounded-full transition-colors ${hapticEnabled ? 'bg-orange-500/20 text-orange-500' : 'bg-slate-800 text-slate-500'}`}
          title={hapticEnabled ? "Haptics On" : "Haptics Off"}
        >
          {hapticEnabled ? <Vibrate size={20} /> : <VibrateOff size={20} />}
        </button>
      </header>

      {mode === 'select' && (
        <div className="flex bg-slate-900 rounded-xl p-1 border border-slate-800 mb-6 shrink-0">
          <button onClick={() => setActiveTab('practices')} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'practices' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}>Practices</button>
          <button onClick={() => setActiveTab('meditations')} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'meditations' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}>Meditations</button>
          <button onClick={() => setActiveTab('challenges')} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'challenges' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}>Challenges</button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {mode === 'select' && activeTab === 'practices' && (
          <motion.div key="practices" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex-1 flex flex-col space-y-6">
            <div className="bg-gradient-to-r from-orange-600 to-orange-500 rounded-3xl p-6 text-white relative overflow-hidden shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
              <h2 className="text-xl font-bold mb-2 relative z-10">{user?.deity === 'shiva' ? 'Shiva Tandava Stotram' : user?.deity === 'krishna' ? 'Achyutashtakam' : 'Shri Hanuman Chalisa'}</h2>
              <p className="text-orange-100 text-sm mb-4 relative z-10">{user?.deity === 'shiva' ? 'Read the powerful stotram.' : user?.deity === 'krishna' ? 'Read the sweet hymn.' : 'Read the full 40 verses and dohas.'}</p>
              <button onClick={onOpenChalisa} className="bg-white text-orange-600 px-6 py-2 rounded-xl font-bold text-sm hover:bg-orange-50 transition-colors relative z-10">Read Now</button>
            </div>

            <AudioLibrary showAudioLibrary={showAudioLibrary} setShowAudioLibrary={setShowAudioLibrary} selectedTrack={selectedTrack} setSelectedTrack={setSelectedTrack} setShowVideo={setShowVideo} />
            
            <MalaCounter onReturn={() => setMode('select')} getAudioContext={getAudioContext} />
            
            <FocusTimerSelect onStart={(mins) => { setFocusDurationMinutes(mins); setFocusTime(mins * 60); setMode('focus'); setIsTimerRunning(true); }} />
            
            <BreathingSelect onStart={(patternId, cycles) => { setSelectedPatternId(patternId); setTargetCycles(cycles); setBreatheCycles(0); setCurrentPhaseIndex(0); setBreathPhaseTime(BREATHING_PATTERNS.find(p => p.id === patternId)!.phases[0].duration); setMode('breathe'); setIsTimerRunning(true); }} />
            
            <CustomSessionSelect onStart={(typeId, mins) => { setSelectedCustomTypeId(typeId); setCustomSessionDuration(mins); setFocusTime(mins * 60); setMode('custom'); setIsTimerRunning(true); }} />
          </motion.div>
        )}

        {mode === 'select' && activeTab === 'meditations' && (
          <motion.div key="meditations" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            <MeditationSelect onStart={(med) => { setSelectedMeditation(med); setFocusTime(med.duration * 60); setMode('meditation'); setIsTimerRunning(true); }} />
          </motion.div>
        )}

        {mode === 'select' && activeTab === 'challenges' && (
          <motion.div key="challenges" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            <ChantChallenges />
          </motion.div>
        )}

        {mode !== 'select' && (
          <motion.div key="active-session" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex-1 flex flex-col items-center justify-between relative py-4">
            <div className="flex-1 flex flex-col items-center justify-center w-full min-h-[300px]">
              {mode === 'mala' && <MalaActiveSession onReturn={() => setMode('select')} getAudioContext={getAudioContext} />}
              {mode === 'focus' && <FocusActiveView focusTime={focusTime} focusDurationMinutes={focusDurationMinutes} isTimerRunning={isTimerRunning} setIsTimerRunning={setIsTimerRunning} onReturn={() => setMode('select')} />}
              {mode === 'custom' && <CustomSessionActiveView focusTime={focusTime} customSessionDuration={customSessionDuration} selectedCustomTypeId={selectedCustomTypeId} isTimerRunning={isTimerRunning} setIsTimerRunning={setIsTimerRunning} onReturn={() => setMode('select')} />}
              {mode === 'breathe' && <BreathingActiveView activePatternId={selectedPatternId} currentPhaseIndex={currentPhaseIndex} breathPhaseTime={breathPhaseTime} breatheCycles={breatheCycles} targetCycles={targetCycles} isTimerRunning={isTimerRunning} setIsTimerRunning={setIsTimerRunning} onReturn={() => setMode('select')} />}
              {mode === 'meditation' && <MeditationActiveView selectedMeditation={selectedMeditation} focusTime={focusTime} isTimerRunning={isTimerRunning} setIsTimerRunning={setIsTimerRunning} onEndEarly={() => { setIsTimerRunning(false); addSession('meditation', { durationMinutes: Math.ceil((selectedMeditation.duration * 60 - focusTime) / 60), customTypeName: 'Guided Meditation' }); setMode('select'); }} onComplete={() => { setFocusTime(0); setIsTimerRunning(false); addXP(selectedMeditation.duration * 5); addSession('meditation', { durationMinutes: selectedMeditation.duration, customTypeName: 'Guided Meditation' }); }} />}
            </div>

            <AudioPlayer selectedTrack={selectedTrack} setSelectedTrack={setSelectedTrack} showVideo={showVideo} setShowVideo={setShowVideo} isPlaying={isPlaying} setIsPlaying={setIsPlaying} isLooping={isLooping} setIsLooping={setIsLooping} volume={volume} setVolume={setVolume} audioProgress={audioProgress} setAudioProgress={setAudioProgress} audioDuration={audioDuration} setAudioDuration={setAudioDuration} showAudioControls={showAudioControls} setShowAudioControls={setShowAudioControls} playerRef={playerRef} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
