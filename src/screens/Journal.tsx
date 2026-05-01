import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookText, Plus, Calendar, SmilePlus, PenLine } from 'lucide-react';
import { useStore } from '../lib/store';
import { format } from 'date-fns';

const MOODS = [
  { emoji: '🙏', label: 'Grateful' },
  { emoji: '🧘', label: 'Peaceful' },
  { emoji: '✨', label: 'Inspired' },
  { emoji: '😌', label: 'Calm' },
  { emoji: '💪', label: 'Energized' },
  { emoji: '😔', label: 'Struggling' }
];

export function Journal() {
  const { journal, addJournalEntry } = useStore();
  const [isWriting, setIsWriting] = useState(false);
  const [entryText, setEntryText] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const handleSave = async () => {
    if (!entryText.trim()) return;
    await addJournalEntry(entryText, selectedMood || undefined);
    setEntryText('');
    setSelectedMood(null);
    setIsWriting(false);
  };

  return (
    <div className="p-6 h-full flex flex-col pb-32 overflow-y-auto">
      <header className="pt-8 mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-100 flex items-center">
          <BookText className="mr-3 text-orange-500" size={32} />
          Journal
        </h1>
        <p className="text-slate-400 mt-2">Reflect on your sadhana and inner journey.</p>
      </header>

      <div className="mb-8">
        <AnimatePresence mode="wait">
          {!isWriting ? (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onClick={() => setIsWriting(true)}
              className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-2xl p-4 flex items-center justify-center transition-all group"
            >
              <div className="bg-slate-800 p-2 rounded-full mr-3 group-hover:bg-slate-700 transition-colors">
                <PenLine size={18} className="text-orange-500" />
              </div>
              <span className="font-medium">Write today's reflection...</span>
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 overflow-hidden"
            >
              <textarea
                value={entryText}
                onChange={(e) => setEntryText(e.target.value)}
                placeholder="What's on your mind? How was your sadhana today?"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-orange-500/50 resize-none h-32 mb-4"
              />
              
              <div className="mb-4">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block flex items-center">
                  <SmilePlus size={14} className="mr-1" /> How are you feeling?
                </label>
                <div className="flex flex-wrap gap-2">
                  {MOODS.map(mood => (
                    <button
                      key={mood.label}
                      onClick={() => setSelectedMood(mood.emoji === selectedMood ? null : mood.emoji)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-colors border ${
                        selectedMood === mood.emoji 
                          ? 'bg-orange-500/20 border-orange-500/50 text-orange-200' 
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <span className="mr-1.5">{mood.emoji}</span>
                      {mood.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsWriting(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-800 transition-colors font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!entryText.trim()}
                  className="bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:hover:bg-orange-600 text-white px-6 py-2 rounded-xl font-medium text-sm transition-colors"
                >
                  Save Entry
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-200 mb-4">Past Reflections</h3>
        
        {journal.length === 0 ? (
          <div className="text-center py-10 bg-slate-900/50 rounded-2xl border border-slate-800/50 border-dashed">
            <BookText className="mx-auto text-slate-600 mb-3" size={32} />
            <p className="text-slate-400 font-medium">No entries yet</p>
            <p className="text-slate-500 text-sm mt-1">Your reflections will appear here</p>
          </div>
        ) : (
          journal.map((entry, idx) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center text-slate-400 text-sm">
                  <Calendar size={14} className="mr-1.5" />
                  {format(new Date(entry.date), 'MMMM d, yyyy \u2022 h:mm a')}
                </div>
                {entry.mood && (
                  <span className="text-xl bg-slate-800/50 w-8 h-8 rounded-full flex items-center justify-center">
                    {entry.mood}
                  </span>
                )}
              </div>
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                {entry.text}
              </p>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
