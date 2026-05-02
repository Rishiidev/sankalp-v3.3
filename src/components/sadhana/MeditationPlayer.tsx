import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../../lib/store';
import { formatTime, GUIDED_MEDITATIONS } from './constants';
import { Upload, X, Play, Trash2 } from 'lucide-react';
import { validateAudioFile } from '../../lib/validation';
import { SuccessRipple } from './SuccessRipple';

export function MeditationSelect({ onStart }: { onStart: (meditation: any) => void }) {
  const { customMeditations, addCustomMeditation, removeCustomMeditation } = useStore();
  const allMeditations = [...GUIDED_MEDITATIONS, ...customMeditations];
  
  const [isUploadingMeditation, setIsUploadingMeditation] = useState(false);
  const [newMeditationName, setNewMeditationName] = useState('');
  const [newMeditationDuration, setNewMeditationDuration] = useState(5);
  const [meditationUploadError, setMeditationUploadError] = useState('');
  const meditationFileInputRef = useRef<HTMLInputElement>(null);

  const handleMeditationUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && newMeditationName.trim() && newMeditationDuration > 0) {
      const validation = validateAudioFile(file);
      if (validation.valid === false) {
        setMeditationUploadError(validation.error);
        if (meditationFileInputRef.current) meditationFileInputRef.current.value = '';
        return;
      }
      setMeditationUploadError('');
      await addCustomMeditation(newMeditationName, newMeditationDuration, file);
      if (meditationFileInputRef.current) meditationFileInputRef.current.value = '';
      setIsUploadingMeditation(false);
      setNewMeditationName('');
      setNewMeditationDuration(5);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Guided Meditations</h2>
        <button onClick={() => setIsUploadingMeditation(!isUploadingMeditation)} className="text-sm text-orange-500 hover:text-orange-400 flex items-center">
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
                <button onClick={() => setIsUploadingMeditation(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
              </div>
              <div className="space-y-3">
                <input 
                  type="text" placeholder="Meditation Name" value={newMeditationName} onChange={(e) => setNewMeditationName(e.target.value)}
                  className="w-full bg-slate-900 text-white rounded-lg px-3 py-2 border border-slate-700 focus:border-orange-500 focus:outline-none"
                />
                <div className="flex items-center justify-between bg-slate-900 rounded-lg px-3 py-2 border border-slate-700">
                  <span className="text-sm text-slate-400">Duration (min):</span>
                  <input 
                    type="number" min="1" value={newMeditationDuration} onChange={(e) => setNewMeditationDuration(parseInt(e.target.value) || 5)}
                    className="w-24 bg-transparent text-white text-right focus:outline-none"
                  />
                </div>
                <input type="file" accept="audio/mp3,audio/wav" ref={meditationFileInputRef} className="hidden" onChange={handleMeditationUpload} />
                <button onClick={() => meditationFileInputRef.current?.click()} className="w-full bg-slate-700 hover:bg-slate-600 text-white rounded-lg py-2 font-medium transition-colors mt-2 flex items-center justify-center">
                  <Upload size={16} className="mr-2" /> Select Audio File
                </button>
                {meditationUploadError && <p className="text-xs text-red-300">{meditationUploadError}</p>}
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
                <button onClick={() => removeCustomMeditation(meditation.id)} className="w-10 h-10 text-slate-500 hover:text-red-400 flex items-center justify-center transition-colors">
                  <Trash2 size={18} />
                </button>
              )}
              <button
                onClick={() => onStart(meditation)}
                className="w-12 h-12 bg-orange-500/20 text-orange-500 rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors"
              >
                <Play size={24} className="ml-1" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MeditationActiveView({
  selectedMeditation,
  focusTime,
  isTimerRunning,
  setIsTimerRunning,
  onEndEarly,
  onComplete,
}: {
  selectedMeditation: any;
  focusTime: number;
  isTimerRunning: boolean;
  setIsTimerRunning: (v: boolean) => void;
  onEndEarly: () => void;
  onComplete: () => void;
}) {
  return (
    <>
      <div className="mb-8 text-center px-4">
        <p className="text-sm text-orange-500 font-medium mb-1 uppercase tracking-wider">Guided Meditation</p>
        <h2 className="text-2xl font-bold text-white">{selectedMeditation.name}</h2>
      </div>
      
      <div className="relative w-64 h-64 flex items-center justify-center mb-8">
        <motion.div
          animate={{ scale: isTimerRunning ? [1, 1.05, 1] : 1, opacity: isTimerRunning ? [0.5, 0.8, 0.5] : 0.5 }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl"
        />
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle cx="128" cy="128" r="120" className="stroke-slate-800" strokeWidth="8" fill="none" />
          <motion.circle
            cx="128" cy="128" r="120"
            className="stroke-orange-500" strokeWidth="8" fill="none" strokeLinecap="round"
            initial={{ strokeDasharray: "0 1000" }}
            animate={{ strokeDasharray: `${((selectedMeditation.duration * 60 - focusTime) / (selectedMeditation.duration * 60)) * 754} 1000` }}
            transition={{ duration: 1, ease: "linear" }}
          />
        </svg>
        <div className="text-center z-10">
          <div className="text-5xl font-bold text-white mb-2">{formatTime(focusTime)}</div>
          <p className="text-slate-400">Remaining</p>
        </div>
      </div>

      {focusTime === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <SuccessRipple />
          <h3 className="text-2xl font-bold mb-2">Meditation Complete</h3>
          <p className="text-slate-400 mb-6">+{selectedMeditation.duration * 5} XP earned</p>
          <button onClick={onEndEarly} className="bg-slate-800 hover:bg-slate-700 text-white rounded-xl px-8 py-3 font-medium transition-colors">Return</button>
        </motion.div>
      ) : (
        <>
          <audio 
            src={selectedMeditation.url} autoPlay={isTimerRunning} controls className="w-full max-w-xs mb-8"
            onEnded={onComplete}
          />
          <div className="flex space-x-4">
            <button onClick={onEndEarly} className="bg-slate-800 hover:bg-slate-700 text-white rounded-xl px-8 py-3 font-medium transition-colors">
              End Early
            </button>
          </div>
        </>
      )}
    </>
  );
}
