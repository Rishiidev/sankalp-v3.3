import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore, MantraPreset, ChantChallenge } from '../lib/store';
import { Play, Pause, RotateCcw, CheckCircle2, Volume2, VolumeX, Repeat, Vibrate, VibrateOff, Upload, Wind, Plus, X, Trash2, Edit2, Book, Heart, Music, Star, Sun, Moon, Search } from 'lucide-react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { isToday } from 'date-fns';
import ReactPlayer from 'react-player';

const Player: any = ReactPlayer;

const SuccessRipple = () => (
  <div className="relative flex justify-center items-center w-24 h-24 mx-auto mb-4">
    <motion.div
      initial={{ scale: 0.8, opacity: 0.5 }}
      animate={{ scale: 1.5, opacity: 0 }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
      className="absolute w-12 h-12 bg-green-500 rounded-full"
    />
    <div className="bg-slate-900 rounded-full relative z-10 p-1">
      <CheckCircle2 size={48} className="text-green-500" />
    </div>
  </div>
);

const ICON_LIBRARY = [
  { name: 'Book', component: Book },
  { name: 'Heart', component: Heart },
  { name: 'Music', component: Music },
  { name: 'Star', component: Star },
  { name: 'Sun', component: Sun },
  { name: 'Moon', component: Moon },
];

type BreathPhaseType = 'inhale' | 'hold1' | 'exhale' | 'hold2';

interface BreathingPattern {
  id: string;
  name: string;
  description: string;
  phases: { phase: BreathPhaseType; duration: number; instruction: string }[];
}

const BREATHING_PATTERNS: BreathingPattern[] = [
  {
    id: 'box',
    name: 'Box Breathing (4-4-4-4)',
    description: 'Balances energy, calms the nervous system.',
    phases: [
      { phase: 'inhale', duration: 4, instruction: 'Inhale' },
      { phase: 'hold1', duration: 4, instruction: 'Hold' },
      { phase: 'exhale', duration: 4, instruction: 'Exhale' },
      { phase: 'hold2', duration: 4, instruction: 'Hold' }
    ]
  },
  {
    id: 'relax',
    name: 'Relaxing (4-7-8)',
    description: 'Promotes deep relaxation and sleep.',
    phases: [
      { phase: 'inhale', duration: 4, instruction: 'Inhale' },
      { phase: 'hold1', duration: 7, instruction: 'Hold' },
      { phase: 'exhale', duration: 8, instruction: 'Exhale' }
    ]
  },
  {
    id: 'equal',
    name: 'Equal Breathing (5-5)',
    description: 'Improves focus and reduces stress.',
    phases: [
      { phase: 'inhale', duration: 5, instruction: 'Inhale' },
      { phase: 'exhale', duration: 5, instruction: 'Exhale' }
    ]
  }
];

const DEFAULT_AUDIO_TRACKS = [
  { id: '1', name: 'Distant Chants', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: '2', name: 'Gentle Rain', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: '3', name: 'Forest Ambiance', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

interface Props {
  onOpenChalisa?: () => void;
}

export function Sadhana({ onOpenChalisa }: Props) {
  const { addXP, addSession, customTracks, addCustomTrack, addYoutubeTrack, removeYoutubeTrack, mantraPresets, addMantraPreset, editMantraPreset, removeMantraPreset, user, updateUser, updateMalaCount, customSessionTypes, addCustomSessionType, editCustomSessionType, removeCustomSessionType, chantChallenges, addChantChallenge, updateChantChallengeProgress, editChantChallengeProgress, editChantChallengeDeadline, removeChantChallenge, customMeditations, addCustomMeditation, removeCustomMeditation, sessions } = useStore();
  const [activeTab, setActiveTab] = useState<'practices' | 'meditations' | 'challenges'>('practices');
  const [mode, setMode] = useState<'select' | 'mala' | 'focus' | 'breathe' | 'custom' | 'meditation'>('select');
  const [targetCount, setTargetCount] = useState(108);
  const [count, setCount] = useState(user?.currentMalaCount || 0);
  const hapticEnabled = user?.hapticsEnabled ?? true;
  
  const [showAudioLibrary, setShowAudioLibrary] = useState(false);
  const [showAudioControls, setShowAudioControls] = useState(false);

  // Mantra State
  const defaultPresetId = user?.deity === 'shiva' ? 'default_shiva' : user?.deity === 'krishna' ? 'default_krishna' : 'default_hanuman';
  const [selectedPresetId, setSelectedPresetId] = useState<string>(defaultPresetId);
  
  useEffect(() => {
    setSelectedPresetId(defaultPresetId);
  }, [user?.deity, defaultPresetId]);

  const [isCreatingPreset, setIsCreatingPreset] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetMantra, setNewPresetMantra] = useState('');
  const [newPresetTarget, setNewPresetTarget] = useState(108);
  const [editingPresetId, setEditingPresetId] = useState<string | null>(null);
  const [editPresetName, setEditPresetName] = useState('');
  const [editPresetMantra, setEditPresetMantra] = useState('');
  const [editPresetTarget, setEditPresetTarget] = useState(108);

  const activePreset = mantraPresets.find(p => p.id === selectedPresetId) || mantraPresets[0];

  useEffect(() => {
    if (activePreset) {
      setTargetCount(activePreset.target);
    }
  }, [activePreset]);
  
  // Audio State
  const allTracks = [...DEFAULT_AUDIO_TRACKS, ...customTracks, ...(user?.youtubeTracks || [])];
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isLooping, setIsLooping] = useState(true);
  const [selectedTrack, setSelectedTrack] = useState(allTracks[0]);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const playerRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isAddingYoutube, setIsAddingYoutube] = useState(false);
  const [newYoutubeName, setNewYoutubeName] = useState('');
  const [newYoutubeUrl, setNewYoutubeUrl] = useState('');

  const todaySessions = sessions.filter(s => isToday(new Date(s.date)));
  const todayMalas = todaySessions.filter(s => s.type === 'mala').length;
  const malaGoal = user?.dailyGoals?.malas || 1;

  // Focus Timer
  const [focusDurationMinutes, setFocusDurationMinutes] = useState(5);
  const [customFocusDuration, setCustomFocusDuration] = useState<string>('');
  const [focusTime, setFocusTime] = useState(5 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Breathing State
  const [selectedPatternId, setSelectedPatternId] = useState('box');
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [breathPhaseTime, setBreathPhaseTime] = useState(4);
  const [breatheCycles, setBreatheCycles] = useState(0);
  const [targetCycles, setTargetCycles] = useState(10);

  // Custom Session State
  const [isCreatingCustom, setIsCreatingCustom] = useState(false);
  const [newCustomName, setNewCustomName] = useState('');
  const [newCustomIcon, setNewCustomIcon] = useState('Book');
  const [newCustomColor, setNewCustomColor] = useState('#f97316');
  const [selectedCustomTypeId, setSelectedCustomTypeId] = useState<string>('');
  const [customSessionDuration, setCustomSessionDuration] = useState(15);
  const [editingCustomTypeId, setEditingCustomTypeId] = useState<string | null>(null);
  const [editCustomName, setEditCustomName] = useState('');
  const [editCustomIcon, setEditCustomIcon] = useState('Book');
  const [editCustomColor, setEditCustomColor] = useState('#f97316');

  // Chant Challenge State
  const [isCreatingChallenge, setIsCreatingChallenge] = useState(false);
  const [newChallengeName, setNewChallengeName] = useState('');
  const [newChallengeTarget, setNewChallengeTarget] = useState(1000);
  const [newChallengeDeadline, setNewChallengeDeadline] = useState('');
  const [editingChallengeId, setEditingChallengeId] = useState<string | null>(null);
  const [editChallengeProgress, setEditChallengeProgress] = useState(0);
  const [editingChallengeDeadlineId, setEditingChallengeDeadlineId] = useState<string | null>(null);
  const [editChallengeDeadline, setEditChallengeDeadline] = useState('');
  
  const [challengeSearchQuery, setChallengeSearchQuery] = useState('');
  const [editingChallengeDetailsId, setEditingChallengeDetailsId] = useState<string | null>(null);
  const [editChallengeName, setEditChallengeName] = useState('');
  const [editChallengeTarget, setEditChallengeTarget] = useState(1000);

  const notifyCompletion = (title: string, body: string) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      oscillator.frequency.exponentialRampToValueAtTime(1046.50, audioCtx.currentTime + 0.5);

      gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.5);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 1.5);
    } catch (e) {
      console.error("Audio Context failed", e);
    }

    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification(title, { body });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            new Notification(title, { body });
          }
        });
      }
    }
  };

  // Guided Meditation State
  const GUIDED_MEDITATIONS = [
    { id: 'gm1', name: 'Strength and Courage', duration: 5, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    { id: 'gm2', name: 'Devotion and Surrender', duration: 10, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
    { id: 'gm3', name: 'Inner Peace', duration: 8, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  ];
  const allMeditations = [...GUIDED_MEDITATIONS, ...customMeditations];
  const [selectedMeditation, setSelectedMeditation] = useState(allMeditations[0] || GUIDED_MEDITATIONS[0]);
  const [isUploadingMeditation, setIsUploadingMeditation] = useState(false);
  const [newMeditationName, setNewMeditationName] = useState('');
  const [newMeditationDuration, setNewMeditationDuration] = useState(5);
  const meditationFileInputRef = useRef<HTMLInputElement>(null);

  const activePattern = BREATHING_PATTERNS.find(p => p.id === selectedPatternId) || BREATHING_PATTERNS[0];
  const activePhase = activePattern.phases[currentPhaseIndex] || activePattern.phases[0];

  useEffect(() => {
    // If selected track is no longer in the list (e.g. deleted), revert to default
    if (!allTracks.find(t => t.id === selectedTrack.id)) {
      setSelectedTrack(allTracks[0]);
    }
  }, [customTracks]);

  const [showVideo, setShowVideo] = useState(false);
  const isYoutubeTrack = selectedTrack.url.includes('youtube.com') || selectedTrack.url.includes('youtu.be');

  // Focus Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if ((mode === 'focus' || mode === 'custom' || mode === 'meditation') && isTimerRunning && focusTime > 0) {
      interval = setInterval(() => {
        setFocusTime(prev => prev - 1);
      }, 1000);
    } else if (mode === 'focus' && focusTime === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      notifyCompletion("Focus Session Complete", `You have focused for ${focusDurationMinutes} minutes.`);
      addXP(focusDurationMinutes * 10); // 10 XP per minute of focus
      addSession('focus', { durationMinutes: focusDurationMinutes });
      if (hapticEnabled && navigator.vibrate) navigator.vibrate([100, 50, 100]);
    } else if (mode === 'custom' && focusTime === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      const customType = customSessionTypes.find(t => t.id === selectedCustomTypeId);
      notifyCompletion("Session Complete", `You have completed ${customSessionDuration} minutes of ${customType?.name || 'custom session'}.`);
      addXP(customSessionDuration * 10);
      addSession(selectedCustomTypeId, { durationMinutes: customSessionDuration, customTypeName: customType?.name });
      if (hapticEnabled && navigator.vibrate) navigator.vibrate([100, 50, 100]);
    } else if (mode === 'meditation' && focusTime === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      notifyCompletion("Meditation Complete", `You have completed your guided meditation.`);
      // Handled by audio onEnded, but fallback here just in case
      if (hapticEnabled && navigator.vibrate) navigator.vibrate([100, 50, 100]);
    }
    return () => clearInterval(interval);
  }, [mode, isTimerRunning, focusTime, addXP, focusDurationMinutes, hapticEnabled, addSession, customSessionDuration, customSessionTypes, selectedCustomTypeId]);

  // Breathing logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (mode === 'breathe' && isTimerRunning && breatheCycles < targetCycles) {
      interval = setInterval(() => {
        setBreathPhaseTime(prev => {
          if (prev <= 1) {
            // Transition to next phase
            if (hapticEnabled && navigator.vibrate) navigator.vibrate(30);
            
            const nextIdx = (currentPhaseIndex + 1) % activePattern.phases.length;
            setCurrentPhaseIndex(nextIdx);
            if (nextIdx === 0) {
              setBreatheCycles(c => c + 1);
            }
            return activePattern.phases[nextIdx].duration;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (mode === 'breathe' && breatheCycles >= targetCycles && isTimerRunning) {
      setIsTimerRunning(false);
      notifyCompletion("Breathing Complete", "You have finished your guided breathing session.");
      addXP(20); // 20 XP for breathing exercise
      addSession('breathe', { count: targetCycles });
      if (hapticEnabled && navigator.vibrate) navigator.vibrate([100, 50, 100]);
    }
    return () => clearInterval(interval);
  }, [mode, isTimerRunning, breatheCycles, targetCycles, currentPhaseIndex, activePattern, addXP, hapticEnabled, addSession]);

  const toggleAudio = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (playerRef.current) {
      if (typeof playerRef.current.seekTo === 'function') {
        playerRef.current.seekTo(time, 'seconds');
      }
      setAudioProgress(time);
    }
  };

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await addCustomTrack(file.name, file);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCreatePreset = async () => {
    if (newPresetName.trim() && newPresetMantra.trim() && newPresetTarget > 0) {
      await addMantraPreset({
        name: newPresetName,
        mantra: newPresetMantra,
        target: newPresetTarget
      });
      setIsCreatingPreset(false);
      setNewPresetName('');
      setNewPresetMantra('');
      setNewPresetTarget(108);
    }
  };

  const handleEditPreset = async () => {
    if (editingPresetId && editPresetName.trim() && editPresetMantra.trim() && editPresetTarget > 0) {
      await editMantraPreset(editingPresetId, {
        name: editPresetName,
        mantra: editPresetMantra,
        target: editPresetTarget
      });
      setEditingPresetId(null);
    }
  };

  const handleCreateCustomType = async () => {
    if (newCustomName.trim()) {
      await addCustomSessionType({
        name: newCustomName,
        icon: newCustomIcon,
        color: newCustomColor
      });
      setIsCreatingCustom(false);
      setNewCustomName('');
      setNewCustomIcon('Book');
      setNewCustomColor('#f97316');
    }
  };

  const handleEditCustomType = async () => {
    if (editingCustomTypeId && editCustomName.trim()) {
      await editCustomSessionType(editingCustomTypeId, {
        name: editCustomName,
        icon: editCustomIcon,
        color: editCustomColor
      });
      setEditingCustomTypeId(null);
    }
  };

  const handleCreateChallenge = async () => {
    if (newChallengeName.trim() && newChallengeTarget > 0) {
      await addChantChallenge({
        name: newChallengeName,
        target: newChallengeTarget,
        deadline: newChallengeDeadline || undefined
      });
      setIsCreatingChallenge(false);
      setNewChallengeName('');
      setNewChallengeTarget(1000);
      setNewChallengeDeadline('');
    }
  };

  const handleEditChallengeProgress = async (id: string) => {
    if (editChallengeProgress >= 0) {
      await editChantChallengeProgress(id, editChallengeProgress);
      setEditingChallengeId(null);
    }
  };

  const handleEditChallengeDeadline = async (id: string) => {
    await editChantChallengeDeadline(id, editChallengeDeadline);
    setEditingChallengeDeadlineId(null);
  };

  const handleShareChallenge = async (challenge: ChantChallenge) => {
    const shareText = `I've chanted ${challenge.progress} / ${challenge.target} mantras for my "${challenge.name}" challenge on Hanuman Sadhana! 🙏`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Chant Challenge',
          text: shareText,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Progress copied to clipboard!');
    }
  };

  const handleMeditationUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && newMeditationName.trim() && newMeditationDuration > 0) {
      await addCustomMeditation(newMeditationName, newMeditationDuration, file);
      if (meditationFileInputRef.current) meditationFileInputRef.current.value = '';
      setIsUploadingMeditation(false);
      setNewMeditationName('');
      setNewMeditationDuration(5);
    }
  };

  const { editChantChallengeDetails } = useStore();
  const handleEditChallengeDetails = async (id: string) => {
    if (editChallengeName.trim() && editChallengeTarget > 0) {
      await editChantChallengeDetails(id, editChallengeName, editChallengeTarget, editChallengeDeadline);
      setEditingChallengeDetailsId(null);
    }
  };

  const handleTap = () => {
    if (count < targetCount) {
      const newCount = count + 1;
      setCount(newCount);
      updateMalaCount(newCount);
      
      // Attempt audio feedback
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
        
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        // Create a soft "wood or crystal" tap sound
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
      } catch (e) {
        // Audio context might fail on some strict mobile browsers without exact user interaction
      }

      if (hapticEnabled && navigator.vibrate) navigator.vibrate(50);
      
      if (newCount === targetCount) {
        notifyCompletion("Mala Complete", "You have finished chanting your daily mala.");
        addXP(targetCount * 2); // 2 XP per chant
        addSession('mala', { count: targetCount });
        updateMalaCount(0); // Reset after completion securely
        
        // Update challenges
        chantChallenges.filter(c => !c.completed).forEach(c => {
          updateChantChallengeProgress(c.id, targetCount);
        });

        if (hapticEnabled && navigator.vibrate) navigator.vibrate([100, 50, 100]);
      }
    }
  };

  const resetMala = () => {
    setCount(0);
    updateMalaCount(0);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

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
          <button
            onClick={() => setActiveTab('practices')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'practices' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
          >
            Practices
          </button>
          <button
            onClick={() => setActiveTab('meditations')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'meditations' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
          >
            Meditations
          </button>
          <button
            onClick={() => setActiveTab('challenges')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'challenges' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
          >
            Challenges
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {mode === 'select' && activeTab === 'practices' && (
          <motion.div 
            key="select-practices"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex-1 flex flex-col space-y-6"
          >
            {/* Sacred Text Quick Link */}
            <div className="bg-gradient-to-r from-orange-600 to-orange-500 rounded-3xl p-6 text-white relative overflow-hidden shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
              <h2 className="text-xl font-bold mb-2 relative z-10">
                {user?.deity === 'shiva' ? 'Shiva Tandava Stotram' : user?.deity === 'krishna' ? 'Achyutashtakam' : 'Shri Hanuman Chalisa'}
              </h2>
              <p className="text-orange-100 text-sm mb-4 relative z-10">
                {user?.deity === 'shiva' ? 'Read the powerful stotram.' : user?.deity === 'krishna' ? 'Read the sweet hymn.' : 'Read the full 40 verses and dohas.'}
              </p>
              <button 
                onClick={onOpenChalisa}
                className="bg-white text-orange-600 px-6 py-2 rounded-xl font-bold text-sm hover:bg-orange-50 transition-colors relative z-10"
              >
                Read Now
              </button>
            </div>

            {/* Audio Upload Section */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <button 
                onClick={() => setShowAudioLibrary(!showAudioLibrary)}
                className="w-full flex items-center justify-between text-lg font-semibold"
              >
                <span className="flex items-center">
                  <Volume2 className="mr-2 text-orange-500" size={20} />
                  Audio Library
                </span>
                <span className="text-slate-400 text-sm font-normal">
                  {showAudioLibrary ? 'Hide' : 'Manage'}
                </span>
              </button>
              
              <AnimatePresence>
                {showAudioLibrary && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                    animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col space-y-4 pt-4 border-t border-slate-800">
                      <p className="text-sm text-slate-400">Add your own chants, ambient sounds, or YouTube links.</p>
                      
                      {isAddingYoutube ? (
                        <div className="space-y-3 bg-slate-800 p-3 rounded-xl border border-slate-700">
                          <input
                            type="text"
                            placeholder="Track Name"
                            value={newYoutubeName}
                            onChange={(e) => setNewYoutubeName(e.target.value)}
                            className="w-full bg-slate-900 text-white rounded-lg px-3 py-2 border border-slate-700 focus:border-orange-500 focus:outline-none text-sm"
                          />
                          <input
                            type="text"
                            placeholder="YouTube URL"
                            value={newYoutubeUrl}
                            onChange={(e) => setNewYoutubeUrl(e.target.value)}
                            className="w-full bg-slate-900 text-white rounded-lg px-3 py-2 border border-slate-700 focus:border-orange-500 focus:outline-none text-sm"
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={async () => {
                                if (newYoutubeName.trim() && newYoutubeUrl.trim()) {
                                  const newlyAdded = await addYoutubeTrack(newYoutubeName.trim(), newYoutubeUrl.trim());
                                  if (newlyAdded) {
                                    setSelectedTrack(newlyAdded);
                                    setShowVideo(true);
                                  }
                                  setIsAddingYoutube(false);
                                  setNewYoutubeName('');
                                  setNewYoutubeUrl('');
                                }
                              }}
                              className="flex-1 bg-orange-600 hover:bg-orange-500 text-white rounded-lg py-2 text-sm font-medium transition-colors"
                            >
                              Add URL
                            </button>
                            <button
                              onClick={() => {
                                setIsAddingYoutube(false);
                                setNewYoutubeName('');
                                setNewYoutubeUrl('');
                              }}
                              className="px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg py-2 text-sm font-medium transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors flex items-center justify-center"
                          >
                            <Upload size={16} className="mr-2" />
                            Upload MP3
                          </button>
                          <button 
                            onClick={() => setIsAddingYoutube(true)}
                            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors flex items-center justify-center"
                          >
                            <Music size={16} className="mr-2" />
                            YouTube Link
                          </button>
                          <input 
                            type="file" 
                            accept="audio/*" 
                            ref={fileInputRef} 
                            onChange={handleAudioUpload} 
                            className="hidden" 
                          />
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

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
                      type="text" 
                      placeholder="Preset Name (e.g., Shiva Mantra)" 
                      value={editingPresetId ? editPresetName : newPresetName}
                      onChange={(e) => editingPresetId ? setEditPresetName(e.target.value) : setNewPresetName(e.target.value)}
                      className="w-full bg-slate-900 text-white rounded-lg px-3 py-2 border border-slate-700 focus:border-orange-500 focus:outline-none"
                    />
                    <input 
                      type="text" 
                      placeholder="Mantra Text (e.g., Om Namah Shivaya)" 
                      value={editingPresetId ? editPresetMantra : newPresetMantra}
                      onChange={(e) => editingPresetId ? setEditPresetMantra(e.target.value) : setNewPresetMantra(e.target.value)}
                      className="w-full bg-slate-900 text-white rounded-lg px-3 py-2 border border-slate-700 focus:border-orange-500 focus:outline-none"
                    />
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-slate-400">Target:</span>
                      <input 
                        type="number" 
                        min="1"
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
                    <button 
                      onClick={() => setIsCreatingPreset(true)}
                      className="text-xs text-orange-500 hover:text-orange-400 flex items-center"
                    >
                      <Plus size={14} className="mr-1" /> New
                    </button>
                  </div>
                  <div className="space-y-2">
                    {mantraPresets.map(preset => (
                      <div key={preset.id} className={`flex items-center justify-between bg-slate-800 rounded-xl p-3 border ${selectedPresetId === preset.id ? 'border-orange-500' : 'border-transparent'}`}>
                        <button 
                          onClick={() => setSelectedPresetId(preset.id)}
                          className="flex-1 flex items-center text-left text-white"
                        >
                          <span className="font-medium">{preset.name}</span>
                          <span className="ml-2 text-sm text-slate-400">({preset.target})</span>
                        </button>
                        {preset.id !== 'default_hanuman' && preset.id !== 'default_shiva' && preset.id !== 'default_krishna' && (
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => {
                                setEditingPresetId(preset.id);
                                setEditPresetName(preset.name);
                                setEditPresetMantra(preset.mantra);
                                setEditPresetTarget(preset.target);
                              }}
                              className="p-2 text-slate-400 hover:text-white transition-colors"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => {
                                removeMantraPreset(preset.id);
                                if (selectedPresetId === preset.id) setSelectedPresetId(defaultPresetId);
                              }}
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
                onClick={() => { setMode('mala'); resetMala(); }}
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
                  <div 
                    className="h-full bg-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (todayMalas / malaGoal) * 100)}%` }}
                  />
                </div>
                <button
                  onClick={() => {
                    const count = activePreset?.target || 108;
                    addSession('mala', { count });
                    addXP(count * 2);
                    chantChallenges.filter(c => !c.completed).forEach(c => {
                      updateChantChallengeProgress(c.id, count);
                    });
                    if (hapticEnabled && navigator.vibrate) navigator.vibrate([100, 50, 100]);
                  }}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white rounded-lg py-2 text-sm font-medium transition-colors flex items-center justify-center"
                >
                  <Plus size={16} className="mr-2" /> Quick Log (1 Mala)
                </button>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <h2 className="text-xl font-semibold mb-4 text-center">Focus Mode</h2>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {[5, 10, 15, 20].map(mins => (
                  <button
                    key={mins}
                    onClick={() => {
                      setFocusDurationMinutes(mins);
                      setCustomFocusDuration('');
                    }}
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
                  type="number" 
                  min="1" 
                  max="120" 
                  value={customFocusDuration}
                  onChange={(e) => {
                    setCustomFocusDuration(e.target.value);
                    const val = parseInt(e.target.value);
                    if (!isNaN(val) && val > 0 && val <= 120) {
                      setFocusDurationMinutes(val);
                    }
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
                    if (!isNaN(val) && val > 0 && val <= 120) {
                      finalMins = val;
                    } else {
                      finalMins = 5; // fallback
                    }
                  }
                  setFocusDurationMinutes(finalMins);
                  setMode('focus'); 
                  setFocusTime(finalMins * 60); 
                  setIsTimerRunning(true); 
                }}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white rounded-xl py-4 font-bold text-lg transition-colors"
              >
                Start Timer
              </button>
            </div>

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
                onClick={() => { 
                  setMode('breathe'); 
                  setBreatheCycles(0);
                  setCurrentPhaseIndex(0);
                  setBreathPhaseTime(activePattern.phases[0].duration);
                  setIsTimerRunning(true); 
                }}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white rounded-xl py-4 font-bold text-lg transition-colors"
              >
                Start Breathing
              </button>
            </div>

            {/* Custom Sessions */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <h2 className="text-xl font-semibold mb-4 text-center">Custom Sessions</h2>
              
              {isCreatingCustom || editingCustomTypeId ? (
                <div className="bg-slate-800 rounded-2xl p-4 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">{editingCustomTypeId ? 'Edit Custom Type' : 'New Custom Type'}</h3>
                    <button onClick={() => { setIsCreatingCustom(false); setEditingCustomTypeId(null); }} className="text-slate-400 hover:text-white">
                      <X size={20} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <input 
                      type="text" 
                      placeholder="Session Name (e.g., Reading)" 
                      value={editingCustomTypeId ? editCustomName : newCustomName}
                      onChange={(e) => editingCustomTypeId ? setEditCustomName(e.target.value) : setNewCustomName(e.target.value)}
                      className="w-full bg-slate-900 text-white rounded-lg px-3 py-2 border border-slate-700 focus:border-orange-500 focus:outline-none"
                    />
                    
                    <div>
                      <span className="text-sm text-slate-400 mb-2 block">Icon:</span>
                      <div className="flex flex-wrap gap-2">
                        {ICON_LIBRARY.map(icon => {
                          const IconComp = icon.component;
                          const isSelected = editingCustomTypeId ? editCustomIcon === icon.name : newCustomIcon === icon.name;
                          return (
                            <button
                              key={icon.name}
                              onClick={() => editingCustomTypeId ? setEditCustomIcon(icon.name) : setNewCustomIcon(icon.name)}
                              className={`p-2 rounded-lg border ${isSelected ? 'border-orange-500 bg-orange-500/20' : 'border-slate-700 bg-slate-900 hover:border-slate-500'}`}
                            >
                              <IconComp size={20} className={isSelected ? 'text-orange-500' : 'text-slate-400'} />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-slate-400">Color:</span>
                      <input 
                        type="color" 
                        value={editingCustomTypeId ? editCustomColor : newCustomColor}
                        onChange={(e) => editingCustomTypeId ? setEditCustomColor(e.target.value) : setNewCustomColor(e.target.value)}
                        className="w-10 h-10 rounded border-none bg-transparent cursor-pointer"
                      />
                    </div>
                    <button 
                      onClick={editingCustomTypeId ? handleEditCustomType : handleCreateCustomType}
                      className="w-full bg-orange-600 hover:bg-orange-500 text-white rounded-lg py-2 font-medium transition-colors mt-2"
                    >
                      {editingCustomTypeId ? 'Save Changes' : 'Save Type'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm text-slate-400">Select Type</label>
                    <button 
                      onClick={() => setIsCreatingCustom(true)}
                      className="text-xs text-orange-500 hover:text-orange-400 flex items-center"
                    >
                      <Plus size={14} className="mr-1" /> New
                    </button>
                  </div>
                  {customSessionTypes.length > 0 ? (
                    <div className="space-y-2 mb-4">
                      {customSessionTypes.map(type => {
                        const IconComponent = ICON_LIBRARY.find(i => i.name === type.icon)?.component || Book;
                        return (
                          <div key={type.id} className={`flex items-center justify-between bg-slate-800 rounded-xl p-3 border ${selectedCustomTypeId === type.id ? 'border-orange-500' : 'border-transparent'}`}>
                            <button 
                              onClick={() => setSelectedCustomTypeId(type.id)}
                              className="flex-1 flex items-center text-left text-white"
                            >
                              <IconComponent size={20} className="mr-3" style={{ color: type.color || '#f97316' }} />
                              <span className="font-medium">{type.name}</span>
                            </button>
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => {
                                  setEditingCustomTypeId(type.id);
                                  setEditCustomName(type.name);
                                  setEditCustomIcon(type.icon || 'Book');
                                  setEditCustomColor(type.color || '#f97316');
                                }}
                                className="p-2 text-slate-400 hover:text-white transition-colors"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button 
                                onClick={() => {
                                  removeCustomSessionType(type.id);
                                  if (selectedCustomTypeId === type.id) setSelectedCustomTypeId('');
                                }}
                                className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 mb-4 italic">No custom types created yet.</p>
                  )}

                  {selectedCustomTypeId && (
                    <>
                      <div className="flex items-center justify-between bg-slate-800 rounded-xl p-3 mb-4">
                        <span className="text-sm text-slate-300 ml-2">Duration (min)</span>
                        <input 
                          type="number" 
                          min="1"
                          value={customSessionDuration}
                          onChange={(e) => setCustomSessionDuration(parseInt(e.target.value) || 15)}
                          className="w-20 bg-slate-900 text-white rounded-lg px-3 py-1 border border-slate-700 focus:border-orange-500 focus:outline-none text-center"
                        />
                      </div>
                      <button
                        onClick={() => { 
                          setMode('custom'); 
                          setFocusTime(customSessionDuration * 60); 
                          setIsTimerRunning(true); 
                        }}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-white rounded-xl py-4 font-bold text-lg transition-colors"
                      >
                        Start Custom Session
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {mode === 'select' && activeTab === 'meditations' && (
          <motion.div 
            key="select-meditations"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex-1 flex flex-col space-y-6"
          >
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Guided Meditations</h2>
                <button 
                  onClick={() => setIsUploadingMeditation(!isUploadingMeditation)}
                  className="text-sm text-orange-500 hover:text-orange-400 flex items-center"
                >
                  <Upload size={16} className="mr-1" /> Upload
                </button>
              </div>

              <AnimatePresence>
                {isUploadingMeditation && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                    animate={{ height: 'auto', opacity: 1, marginBottom: 24 }}
                    exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-slate-800 rounded-2xl p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold">Upload Meditation</h3>
                        <button onClick={() => setIsUploadingMeditation(false)} className="text-slate-400 hover:text-white">
                          <X size={20} />
                        </button>
                      </div>
                      <div className="space-y-3">
                        <input 
                          type="text" 
                          placeholder="Meditation Name" 
                          value={newMeditationName}
                          onChange={(e) => setNewMeditationName(e.target.value)}
                          className="w-full bg-slate-900 text-white rounded-lg px-3 py-2 border border-slate-700 focus:border-orange-500 focus:outline-none"
                        />
                        <div className="flex items-center justify-between bg-slate-900 rounded-lg px-3 py-2 border border-slate-700">
                          <span className="text-sm text-slate-400">Duration (min):</span>
                          <input 
                            type="number" 
                            min="1"
                            value={newMeditationDuration}
                            onChange={(e) => setNewMeditationDuration(parseInt(e.target.value) || 5)}
                            className="w-24 bg-transparent text-white text-right focus:outline-none"
                          />
                        </div>
                        <input 
                          type="file" 
                          accept="audio/mp3,audio/wav" 
                          ref={meditationFileInputRef}
                          className="hidden"
                          onChange={handleMeditationUpload}
                        />
                        <button 
                          onClick={() => meditationFileInputRef.current?.click()}
                          className="w-full bg-slate-700 hover:bg-slate-600 text-white rounded-lg py-2 font-medium transition-colors mt-2 flex items-center justify-center"
                        >
                          <Upload size={16} className="mr-2" /> Select Audio File
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-4">
                {allMeditations.map(meditation => (
                  <div key={meditation.id} className="bg-slate-800 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-white">{meditation.name}</h3>
                      <p className="text-sm text-slate-400">{meditation.duration} min</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {meditation.id.startsWith('custom_') && (
                        <button 
                          onClick={() => removeCustomMeditation(meditation.id)}
                          className="w-10 h-10 text-slate-500 hover:text-red-400 flex items-center justify-center transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setSelectedMeditation(meditation);
                          setMode('meditation');
                          setFocusTime(meditation.duration * 60);
                          setIsTimerRunning(true);
                        }}
                        className="w-12 h-12 bg-orange-500/20 text-orange-500 rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors"
                      >
                        <Play size={24} className="ml-1" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {mode === 'select' && activeTab === 'challenges' && (
          <motion.div 
            key="select-challenges"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex-1 flex flex-col space-y-6"
          >
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Chant Challenges</h2>
                <button 
                  onClick={() => setIsCreatingChallenge(true)}
                  className="text-sm text-orange-500 hover:text-orange-400 flex items-center"
                >
                  <Plus size={16} className="mr-1" /> New
                </button>
              </div>

              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="text"
                  placeholder="Search challenges..."
                  value={challengeSearchQuery}
                  onChange={(e) => setChallengeSearchQuery(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-white focus:outline-none focus:border-orange-500 text-sm"
                />
              </div>

              {isCreatingChallenge && (
                <div className="bg-slate-800 rounded-2xl p-4 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">New Challenge</h3>
                    <button onClick={() => setIsCreatingChallenge(false)} className="text-slate-400 hover:text-white">
                      <X size={20} />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <input 
                      type="text" 
                      placeholder="Challenge Name (e.g., 10k Mantras)" 
                      value={newChallengeName}
                      onChange={(e) => setNewChallengeName(e.target.value)}
                      className="w-full bg-slate-900 text-white rounded-lg px-3 py-2 border border-slate-700 focus:border-orange-500 focus:outline-none"
                    />
                    <div className="flex items-center justify-between bg-slate-900 rounded-lg px-3 py-2 border border-slate-700">
                      <span className="text-sm text-slate-400">Target Chants:</span>
                      <input 
                        type="number" 
                        min="1"
                        value={newChallengeTarget}
                        onChange={(e) => setNewChallengeTarget(parseInt(e.target.value) || 1000)}
                        className="w-24 bg-transparent text-white text-right focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center justify-between bg-slate-900 rounded-lg px-3 py-2 border border-slate-700">
                      <span className="text-sm text-slate-400">Deadline (Optional):</span>
                      <input 
                        type="date" 
                        value={newChallengeDeadline}
                        onChange={(e) => setNewChallengeDeadline(e.target.value)}
                        className="bg-transparent text-white text-right focus:outline-none"
                      />
                    </div>
                    <button 
                      onClick={handleCreateChallenge}
                      className="w-full bg-orange-600 hover:bg-orange-500 text-white rounded-lg py-2 font-medium transition-colors mt-2"
                    >
                      Start Challenge
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {chantChallenges.filter(c => c.name.toLowerCase().includes(challengeSearchQuery.toLowerCase())).length > 0 ? (
                  chantChallenges.filter(c => c.name.toLowerCase().includes(challengeSearchQuery.toLowerCase())).map(challenge => (
                    <div key={challenge.id} className="bg-slate-800 rounded-2xl p-4 relative overflow-hidden">
                      {challenge.completed && (
                        <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg z-10">
                          COMPLETED
                        </div>
                      )}
                      
                      {editingChallengeDetailsId === challenge.id ? (
                        <div className="space-y-3 relative z-10 bg-slate-900 p-3 rounded-xl mb-3">
                          <input 
                            type="text" 
                            placeholder="Challenge Name (e.g., 10k Mantras)" 
                            value={editChallengeName}
                            onChange={(e) => setEditChallengeName(e.target.value)}
                            className="w-full bg-slate-800 text-white rounded px-3 py-2 border border-slate-700 focus:outline-none text-sm"
                          />
                          <div className="flex items-center justify-between bg-slate-800 rounded px-3 py-2 border border-slate-700">
                            <span className="text-xs text-slate-400">Target:</span>
                            <input 
                              type="number" 
                              min="1"
                              value={editChallengeTarget}
                              onChange={(e) => setEditChallengeTarget(parseInt(e.target.value) || 1000)}
                              className="w-20 bg-transparent text-white text-right focus:outline-none text-sm"
                            />
                          </div>
                          <div className="flex items-center justify-between bg-slate-800 rounded px-3 py-2 border border-slate-700">
                            <span className="text-xs text-slate-400">Deadline:</span>
                            <input 
                              type="date" 
                              value={editChallengeDeadline}
                              onChange={(e) => setEditChallengeDeadline(e.target.value)}
                              className="bg-transparent text-white text-right focus:outline-none text-sm"
                            />
                          </div>
                          <div className="flex justify-end space-x-2 pt-2">
                            <button 
                              onClick={() => setEditingChallengeDetailsId(null)}
                              className="text-slate-400 hover:text-white px-3 py-1 text-sm bg-slate-800 rounded"
                            >
                              Cancel
                            </button>
                            <button 
                              onClick={() => handleEditChallengeDetails(challenge.id)}
                              className="bg-orange-600 hover:bg-orange-500 text-white px-3 py-1 rounded text-sm"
                            >
                              Save Details
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-start mb-2 relative z-10">
                          <div>
                            <h3 className="font-semibold text-white flex items-center">
                              {challenge.name}
                              {challenge.completed && <CheckCircle2 size={16} className="text-green-500 ml-2" />}
                            </h3>
                            <p className="text-xs text-slate-400">
                              Started {new Date(challenge.startDate || Date.now()).toLocaleDateString()}
                              {challenge.deadline && ` • Ends ${new Date(challenge.deadline).toLocaleDateString()}`}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => {
                                setEditingChallengeDetailsId(challenge.id);
                                setEditChallengeName(challenge.name);
                                setEditChallengeTarget(challenge.target);
                                setEditChallengeDeadline(challenge.deadline || '');
                              }}
                              className="text-slate-500 hover:text-white"
                              title="Edit Challenge"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => handleShareChallenge(challenge)}
                              className="text-slate-500 hover:text-blue-400"
                              title="Share Progress"
                            >
                              <Upload size={16} />
                            </button>
                            <button 
                              onClick={() => removeChantChallenge(challenge.id)}
                              className="text-slate-500 hover:text-red-400"
                              title="Delete Challenge"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="mt-4 relative z-10">
                        {editingChallengeId === challenge.id ? (
                          <div className="flex items-center space-x-2 mb-2">
                            <input 
                              type="number" 
                              value={editChallengeProgress}
                              onChange={(e) => setEditChallengeProgress(parseInt(e.target.value) || 0)}
                              className="w-24 bg-slate-900 text-white rounded px-2 py-1 border border-slate-700 focus:outline-none"
                            />
                            <span className="text-slate-400">/ {challenge.target}</span>
                            <button 
                              onClick={() => handleEditChallengeProgress(challenge.id)}
                              className="bg-orange-600 hover:bg-orange-500 text-white px-3 py-1 rounded text-sm"
                            >
                              Save
                            </button>
                            <button 
                              onClick={() => setEditingChallengeId(null)}
                              className="text-slate-400 hover:text-white px-2"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-between text-sm mb-1 cursor-pointer" onClick={() => { setEditingChallengeId(challenge.id); setEditChallengeProgress(challenge.progress); }}>
                            <span className="text-orange-400 font-medium hover:underline" title="Click to edit progress">{challenge.progress}</span>
                            <span className="text-slate-400">/ {challenge.target}</span>
                          </div>
                        )}
                        <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${challenge.completed ? 'bg-green-500' : 'bg-orange-500'}`}
                            style={{ width: `${Math.min(100, (challenge.progress / challenge.target) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 text-center italic py-4">No active challenges found.</p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {mode !== 'select' && (
          <motion.div 
            key="active-session"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 flex flex-col items-center justify-between relative py-4"
          >
            {/* Main Interaction Area */}
            <div className="flex-1 flex flex-col items-center justify-center w-full min-h-[300px]">

        {mode === 'mala' && (
                <>
                  <div className="mb-8 text-center px-4">
                    <p className="text-sm text-orange-500 font-medium mb-1 uppercase tracking-wider">{activePreset?.name}</p>
                    <p className="text-xl md:text-2xl font-serif text-slate-200 italic">"{activePreset?.mantra}"</p>
                  </div>
                  
                  <motion.div 
                    className="w-72 h-72 relative mb-8 flex items-center justify-center cursor-pointer select-none" 
                    onClick={handleTap}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
                      {/* Guru Bead */}
                      <circle cx="100" cy="180" r="6" fill="#f97316" />
                      <line x1="100" y1="180" x2="100" y2="195" stroke="#f97316" strokeWidth="3" />
                      <line x1="95" y1="195" x2="105" y2="195" stroke="#f97316" strokeWidth="2" />
                      
                      {/* 108 Beads Circle */}
                      {Array.from({ length: 108 }).map((_, i) => {
                        // Start from bottom (guru bead) and go clockwise
                        const angle = (Math.PI / 2) + ((i + 1) * (Math.PI * 2) / 108);
                        const radius = 75;
                        const cx = 100 + Math.cos(angle) * radius;
                        const cy = 100 + Math.sin(angle) * radius;
                        
                        // Map count to beads visually
                        const targetNormalized = Math.min(count, targetCount);
                        const completedBeads = Math.floor((targetNormalized / targetCount) * 108);
                        const isCompleted = i < completedBeads;
                        const isCurrent = i === completedBeads;
                        
                        return (
                          <circle 
                            key={i}
                            cx={cx} 
                            cy={cy} 
                            r={isCurrent && targetNormalized < targetCount ? 4 : 3} 
                            fill={isCompleted ? "#f97316" : "#334155"} 
                            className="transition-all duration-300"
                          />
                        );
                      })}
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-6xl font-bold text-white tracking-tighter" style={{ textShadow: "0 4px 24px rgba(0,0,0,0.5)" }}>{count}</span>
                      <span className="text-slate-400 mt-1 font-medium tracking-widest text-sm">/ {targetCount}</span>
                    </div>
                    
                    {/* Tap Ripple Animation */}
                    <AnimatePresence>
                      {count > 0 && count < targetCount && (
                        <motion.div
                          key={count}
                          initial={{ scale: 0.8, opacity: 0.5 }}
                          animate={{ scale: 1.1, opacity: 0 }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                          className="absolute inset-4 rounded-full bg-orange-500/10 pointer-events-none"
                        />
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {count >= targetCount ? (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                      <SuccessRipple />
                      <h3 className="text-2xl font-bold mb-2">Sadhana Complete</h3>
                      <p className="text-slate-400 mb-6">+{targetCount * 2} XP earned</p>
                      <button onClick={() => { resetMala(); setMode('select'); }} className="bg-slate-800 hover:bg-slate-700 text-white rounded-xl px-8 py-3 font-medium transition-colors">
                        Return
                      </button>
                    </motion.div>
                  ) : (
                    <p className="text-slate-500 animate-pulse">Tap the circle to count</p>
                  )}
                </>
              )}

              {mode === 'focus' && (
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
                      <button onClick={() => setMode('select')} className="bg-slate-800 hover:bg-slate-700 text-white rounded-xl px-8 py-3 font-medium transition-colors">
                        Return
                      </button>
                    </motion.div>
                  ) : (
                    <div className="flex space-x-4">
                      <button onClick={() => setIsTimerRunning(!isTimerRunning)} className="bg-orange-600 hover:bg-orange-500 text-white rounded-xl px-8 py-3 font-medium transition-colors">
                        {isTimerRunning ? 'Pause' : 'Resume'}
                      </button>
                      <button onClick={() => { setIsTimerRunning(false); setMode('select'); }} className="bg-slate-800 hover:bg-slate-700 text-white rounded-xl px-8 py-3 font-medium transition-colors">
                        End
                      </button>
                    </div>
                  )}
                </>
              )}

              {mode === 'custom' && (
                <>
                  <div className="mb-8 text-center px-4">
                    <p className="text-sm text-orange-500 font-medium mb-1 uppercase tracking-wider">Custom Session</p>
                    <h2 className="text-2xl font-bold text-white">
                      {customSessionTypes.find(t => t.id === selectedCustomTypeId)?.name || 'Session'}
                    </h2>
                  </div>
                  
                  <div className="relative w-64 h-64 flex items-center justify-center mb-12">
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle
                        cx="128"
                        cy="128"
                        r="120"
                        className="stroke-slate-800"
                        strokeWidth="8"
                        fill="none"
                      />
                      <motion.circle
                        cx="128"
                        cy="128"
                        r="120"
                        className="stroke-orange-500"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        initial={{ strokeDasharray: "0 1000" }}
                        animate={{ 
                          strokeDasharray: `${((customSessionDuration * 60 - focusTime) / (customSessionDuration * 60)) * 754} 1000` 
                        }}
                        transition={{ duration: 1, ease: "linear" }}
                      />
                    </svg>
                    <div className="text-center z-10">
                      <div className="text-5xl font-bold text-white mb-2">
                        {formatTime(focusTime)}
                      </div>
                      <p className="text-slate-400">Remaining</p>
                    </div>
                  </div>

                  {focusTime === 0 ? (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                      <SuccessRipple />
                      <h3 className="text-2xl font-bold mb-2">Session Complete</h3>
                      <p className="text-slate-400 mb-6">+{customSessionDuration * 10} XP earned</p>
                      <button onClick={() => setMode('select')} className="bg-slate-800 hover:bg-slate-700 text-white rounded-xl px-8 py-3 font-medium transition-colors">
                        Return
                      </button>
                    </motion.div>
                  ) : (
                    <div className="flex space-x-4">
                      <button onClick={() => setIsTimerRunning(!isTimerRunning)} className="bg-orange-600 hover:bg-orange-500 text-white rounded-xl px-8 py-3 font-medium transition-colors">
                        {isTimerRunning ? 'Pause' : 'Resume'}
                      </button>
                      <button onClick={() => { setIsTimerRunning(false); setMode('select'); }} className="bg-slate-800 hover:bg-slate-700 text-white rounded-xl px-8 py-3 font-medium transition-colors">
                        End
                      </button>
                    </div>
                  )}
                </>
              )}

              {mode === 'meditation' && (
                <>
                  <div className="mb-8 text-center px-4">
                    <p className="text-sm text-orange-500 font-medium mb-1 uppercase tracking-wider">Guided Meditation</p>
                    <h2 className="text-2xl font-bold text-white">{selectedMeditation.name}</h2>
                  </div>
                  
                  <div className="relative w-64 h-64 flex items-center justify-center mb-8">
                    <motion.div
                      animate={{
                        scale: isTimerRunning ? [1, 1.05, 1] : 1,
                        opacity: isTimerRunning ? [0.5, 0.8, 0.5] : 0.5,
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl"
                    />
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle
                        cx="128"
                        cy="128"
                        r="120"
                        className="stroke-slate-800"
                        strokeWidth="8"
                        fill="none"
                      />
                      <motion.circle
                        cx="128"
                        cy="128"
                        r="120"
                        className="stroke-orange-500"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        initial={{ strokeDasharray: "0 1000" }}
                        animate={{ 
                          strokeDasharray: `${((selectedMeditation.duration * 60 - focusTime) / (selectedMeditation.duration * 60)) * 754} 1000` 
                        }}
                        transition={{ duration: 1, ease: "linear" }}
                      />
                    </svg>
                    <div className="text-center z-10">
                      <div className="text-5xl font-bold text-white mb-2">
                        {formatTime(focusTime)}
                      </div>
                      <p className="text-slate-400">Remaining</p>
                    </div>
                  </div>

                  {focusTime === 0 ? (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                      <SuccessRipple />
                      <h3 className="text-2xl font-bold mb-2">Meditation Complete</h3>
                      <p className="text-slate-400 mb-6">+{selectedMeditation.duration * 5} XP earned</p>
                      <button onClick={() => setMode('select')} className="bg-slate-800 hover:bg-slate-700 text-white rounded-xl px-8 py-3 font-medium transition-colors">
                        Return
                      </button>
                    </motion.div>
                  ) : (
                    <>
                      <audio 
                        src={selectedMeditation.url} 
                        autoPlay={isTimerRunning}
                        onEnded={() => {
                          setFocusTime(0);
                          setIsTimerRunning(false);
                          addXP(selectedMeditation.duration * 5);
                          addSession('meditation', { durationMinutes: selectedMeditation.duration, customTypeName: 'Guided Meditation' });
                        }}
                        controls
                        className="w-full max-w-xs mb-8"
                      />

                      <div className="flex space-x-4">
                        <button onClick={() => { 
                          setIsTimerRunning(false); 
                          addSession('meditation', { durationMinutes: Math.ceil((selectedMeditation.duration * 60 - focusTime) / 60), customTypeName: 'Guided Meditation' });
                          setMode('select'); 
                        }} className="bg-slate-800 hover:bg-slate-700 text-white rounded-xl px-8 py-3 font-medium transition-colors">
                          End Early
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}

              {mode === 'breathe' && (
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
                      <button onClick={() => setMode('select')} className="bg-slate-800 hover:bg-slate-700 text-white rounded-xl px-8 py-3 font-medium transition-colors">
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
                        <button onClick={() => { setIsTimerRunning(false); setMode('select'); }} className="bg-slate-800 hover:bg-slate-700 text-white rounded-xl px-8 py-3 font-medium transition-colors">
                          End
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Bottom Audio Controls */}
            <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => setShowAudioControls(!showAudioControls)}
                  className="flex items-center text-slate-300 hover:text-white transition-colors"
                >
                  <Volume2 className="mr-2 text-orange-500" size={18} />
                  <span className="text-sm font-medium">Audio Controls</span>
                </button>
                <div className="flex space-x-2">
                  <button onClick={() => setIsLooping(!isLooping)} className={`p-2 rounded-full ${isLooping ? 'bg-orange-500/20 text-orange-500' : 'bg-slate-800 text-slate-400'}`}>
                    <Repeat size={18} />
                  </button>
                  <button onClick={toggleAudio} className="p-2 bg-orange-600 rounded-full text-white">
                    {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {showAudioControls && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden flex flex-col space-y-4 pt-2 border-t border-slate-800"
                  >
                    <select 
                      value={selectedTrack.id}
                      onChange={(e) => {
                        const track = allTracks.find(t => t.id === e.target.value);
                        if (track) setSelectedTrack(track);
                      }}
                      className="bg-slate-800 text-sm text-slate-200 rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-orange-500 w-full"
                    >
                      <optgroup label="Default">
                        {DEFAULT_AUDIO_TRACKS.map(track => (
                          <option key={track.id} value={track.id}>{track.name}</option>
                        ))}
                      </optgroup>
                      {customTracks.length > 0 && (
                        <optgroup label="My Uploads">
                          {customTracks.map(track => (
                            <option key={track.id} value={track.id}>{track.name}</option>
                          ))}
                        </optgroup>
                      )}
                      {(user?.youtubeTracks?.length ?? 0) > 0 && (
                        <optgroup label="YouTube Links">
                          {user!.youtubeTracks!.map(track => (
                            <option key={track.id} value={track.id}>{track.name}</option>
                          ))}
                        </optgroup>
                      )}
                    </select>

                    {/* Audio Progress Bar */}
                    <div className="flex items-center space-x-3 text-xs text-slate-400">
                      <span className="w-8 text-right">{formatTime(audioProgress)}</span>
                      <input 
                        type="range" 
                        min="0" 
                        max={audioDuration || 100} 
                        step="0.1"
                        value={audioProgress}
                        onChange={handleSeek}
                        className="flex-1 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                      />
                      <span className="w-8">{formatTime(audioDuration || 0)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <button onClick={() => setVolume(v => Math.max(0, v - 0.1))} className="text-slate-400">
                        <VolumeX size={16} />
                      </button>
                      <input 
                        type="range" 
                        min="0" max="1" step="0.05" 
                        value={volume} 
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="flex-1 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                      />
                      <button onClick={() => setVolume(v => Math.min(1, v + 0.1))} className="text-slate-400">
                        <Volume2 size={16} />
                      </button>
                      {isYoutubeTrack && (
                        <button 
                          onClick={() => setShowVideo(!showVideo)} 
                          className={`ml-2 px-3 py-1 text-xs font-medium rounded-lg transition-colors ${showVideo ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                        >
                          {showVideo ? 'Hide Video' : 'Watch'}
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className={showVideo && isYoutubeTrack ? "w-full mt-4 rounded-2xl overflow-hidden aspect-video border border-slate-800 flex-shrink-0" : "hidden"}>
        <Player
          ref={playerRef}
          url={selectedTrack.url}
          playing={isPlaying}
          volume={volume}
          loop={isLooping}
          onProgress={(p: any) => setAudioProgress(p.playedSeconds ?? p.currentTime ?? 0)}
          onDurationChange={(d: number) => setAudioDuration(d)}
          width="100%"
          height="100%"
        />
      </div>
    </div>
  );
}
