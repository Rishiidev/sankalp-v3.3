import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookText,
  Calendar,
  CheckCircle2,
  ChevronDown,
  FileText,
  Heart,
  PenLine,
  Search,
  Shield,
  SmilePlus,
  Sparkles,
  Target,
  Wind,
} from 'lucide-react';
import { useStore } from '../lib/store';
import { format, isToday, isWithinInterval, startOfDay, subDays } from 'date-fns';

type JournalEntry = {
  id: string;
  date: string;
  text: string;
  mood?: string;
};

type ReflectionMode = 'quick' | 'deep' | 'gratitude';

const MOODS = [
  { emoji: '🙏', label: 'Grateful' },
  { emoji: '🧘', label: 'Peaceful' },
  { emoji: '✨', label: 'Inspired' },
  { emoji: '😌', label: 'Calm' },
  { emoji: '💪', label: 'Energized' },
  { emoji: '😔', label: 'Struggling' }
];

const PROMPTS = [
  {
    id: 'courage',
    label: 'Courage',
    icon: Shield,
    question: 'Where did I act with courage today, even in a small way?',
  },
  {
    id: 'distraction',
    label: 'Distraction',
    icon: Wind,
    question: 'What pulled my attention away, and what can I learn from it?',
  },
  {
    id: 'gratitude',
    label: 'Gratitude',
    icon: Heart,
    question: 'What blessing from today deserves to be remembered?',
  },
  {
    id: 'sankalp',
    label: 'Sankalp',
    icon: Target,
    question: 'What did my sankalp ask from me today?',
  },
  {
    id: 'release',
    label: 'Release',
    icon: Sparkles,
    question: 'What am I ready to offer, forgive, or release?',
  },
];

const MODE_COPY: Record<ReflectionMode, { label: string; helper: string; placeholder: string }> = {
  quick: {
    label: 'Quick',
    helper: 'One honest sentence is enough.',
    placeholder: 'Today I noticed...',
  },
  deep: {
    label: 'Deep',
    helper: 'Name the moment, the lesson, and one next step.',
    placeholder: 'Moment:\nLesson:\nTomorrow I will...',
  },
  gratitude: {
    label: 'Gratitude',
    helper: 'Record three blessings and one lesson.',
    placeholder: '1. I am grateful for...\n2. I am grateful for...\n3. I am grateful for...\nOne lesson from today is...',
  },
};

export function Journal() {
  const { journal, addJournalEntry } = useStore();
  const entries = journal as JournalEntry[];
  const [isWriting, setIsWriting] = useState(false);
  const [entryText, setEntryText] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedPromptId, setSelectedPromptId] = useState(PROMPTS[0].id);
  const [reflectionMode, setReflectionMode] = useState<ReflectionMode>('quick');
  const [freeWriteMode, setFreeWriteMode] = useState(false);
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedPrompt = PROMPTS.find(prompt => prompt.id === selectedPromptId) || PROMPTS[0];
  const todayEntry = useMemo(() => entries.find(entry => isToday(new Date(entry.date))), [entries]);
  const weekEntries = useMemo(() => {
    const today = new Date();
    return entries.filter(entry => isWithinInterval(new Date(entry.date), {
      start: startOfDay(subDays(today, 6)),
      end: today,
    }));
  }, [entries]);

  const mostCommonMood = useMemo(() => {
    const counts = new Map<string, number>();
    for (const entry of weekEntries) {
      if (entry.mood) counts.set(entry.mood, (counts.get(entry.mood) || 0) + 1);
    }

    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
  }, [weekEntries]);

  const filteredEntries = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) return entries;

    return entries.filter(entry => {
      return entry.text.toLowerCase().includes(normalizedQuery) || entry.mood?.toLowerCase().includes(normalizedQuery);
    });
  }, [entries, searchQuery]);

  const groupedEntries = useMemo(() => {
    const today: JournalEntry[] = [];
    const thisWeek: JournalEntry[] = [];
    const earlier: JournalEntry[] = [];
    const weekStart = startOfDay(subDays(new Date(), 6));

    for (const entry of filteredEntries) {
      const entryDate = new Date(entry.date);
      if (isToday(entryDate)) today.push(entry);
      else if (entryDate >= weekStart) thisWeek.push(entry);
      else earlier.push(entry);
    }

    return [
      { label: 'Today', entries: today },
      { label: 'This Week', entries: thisWeek },
      { label: 'Earlier', entries: earlier },
    ].filter(group => group.entries.length > 0);
  }, [filteredEntries]);

  const handleSave = async () => {
    if (!entryText.trim()) return;

    let textToSave: string;
    if (freeWriteMode) {
      textToSave = entryText.trim();
    } else {
      const promptPrefix = `${selectedPrompt.question}\n\n`;
      textToSave = entryText.trim().startsWith(selectedPrompt.question)
        ? entryText.trim()
        : `${promptPrefix}${entryText.trim()}`;
    }

    await addJournalEntry(textToSave, selectedMood || undefined);
    setEntryText('');
    setSelectedMood(null);
    setFreeWriteMode(false);
    setIsWriting(false);
  };

  const startWriting = (promptId?: string, mode?: ReflectionMode, opts?: { free?: boolean }) => {
    if (promptId) setSelectedPromptId(promptId);
    if (mode) setReflectionMode(mode);
    setFreeWriteMode(opts?.free ?? false);
    setIsWriting(true);
  };

  return (
    <div className="p-5 h-full flex flex-col pb-32 overflow-y-auto">
      <header className="pt-7 mb-5">
        <p className="text-orange-400 text-xs uppercase font-bold mb-2">Inner Audit</p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-100 flex items-center">
          <BookText className="mr-3 text-orange-500" size={32} />
          Journal
        </h1>
        <p className="text-slate-400 mt-2">Return to yourself for two minutes.</p>
      </header>

      <section className="grid grid-cols-3 gap-3 mb-5">
        <InsightStat label="This Week" value={`${weekEntries.length}`} />
        <InsightStat label="Entries" value={`${entries.length}`} />
        <InsightStat label="Mood" value={mostCommonMood} />
      </section>

      <section className="mb-6">
        <AnimatePresence mode="wait">
          {!isWriting ? (
            <motion.div
              key="today-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-gradient-to-br from-slate-900 via-slate-900 to-orange-950/30 border border-orange-500/20 rounded-3xl p-5 relative overflow-hidden"
            >
              <div className="absolute right-0 top-0 w-36 h-36 rounded-full bg-orange-500/10 blur-3xl translate-x-12 -translate-y-12" />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">Today's Reflection</p>
                    <h2 className="text-2xl font-bold text-white">
                      {todayEntry ? 'Reflection complete' : 'Complete your reflection'}
                    </h2>
                  </div>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                    todayEntry ? 'bg-green-500/10 border-green-500/25 text-green-300' : 'bg-orange-500/10 border-orange-500/25 text-orange-400'
                  }`}>
                    {todayEntry ? <CheckCircle2 size={24} /> : <PenLine size={24} />}
                  </div>
                </div>

                {todayEntry ? (
                  <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-4 mb-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-500 font-semibold uppercase">Latest today</span>
                      {todayEntry.mood && <span className="text-xl">{todayEntry.mood}</span>}
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">{todayEntry.text}</p>
                  </div>
                ) : (
                  <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-4 mb-5">
                    <p className="text-orange-300 text-sm font-semibold mb-2">Prompt</p>
                    <p className="text-slate-300 leading-relaxed">{selectedPrompt.question}</p>
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={() => startWriting()}
                    className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-2xl py-4 font-bold flex items-center justify-center shadow-[0_0_28px_rgba(249,115,22,0.24)]"
                  >
                    <PenLine size={20} className="mr-2" />
                    {todayEntry ? 'Add Another Note' : 'Write Reflection'}
                  </button>
                  <button
                    type="button"
                    onClick={() => startWriting(undefined, undefined, { free: true })}
                    className="w-full rounded-2xl py-3.5 font-semibold text-slate-200 border border-slate-600/80 bg-slate-950/40 hover:bg-slate-800/60 hover:border-slate-500 transition-colors text-sm flex items-center justify-center"
                  >
                    <FileText size={18} className="mr-2 text-slate-400 shrink-0" aria-hidden />
                    <span>Just write my thoughts</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="composer"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-5 overflow-hidden"
            >
              <div className="mb-4">
                <p className="text-xs text-slate-400 uppercase font-bold mb-2">Reflection Mode</p>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(MODE_COPY) as ReflectionMode[]).map(mode => (
                    <button
                      key={mode}
                      onClick={() => setReflectionMode(mode)}
                      className={`rounded-xl px-3 py-2 text-sm font-bold border transition-colors ${
                        reflectionMode === mode
                          ? 'bg-orange-500/20 border-orange-500/50 text-orange-200'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {MODE_COPY[mode].label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-2">{MODE_COPY[reflectionMode].helper}</p>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 mb-4">
                {freeWriteMode ? (
                  <>
                    <p className="text-xs text-slate-400 uppercase font-bold mb-2">Free writing</p>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Your entry is only what you write below—nothing else is added.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-xs text-orange-300 uppercase font-bold mb-2">Prompt</p>
                    <p className="text-slate-300 text-sm leading-relaxed">{selectedPrompt.question}</p>
                  </>
                )}
              </div>

              <textarea
                value={entryText}
                onChange={(e) => setEntryText(e.target.value)}
                placeholder={
                  freeWriteMode
                    ? "What's on your mind?"
                    : MODE_COPY[reflectionMode].placeholder
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-orange-500/50 resize-none h-44 mb-4 leading-relaxed"
                autoFocus
              />

              <div className="mb-4">
                <label className="text-xs font-semibold text-slate-400 uppercase mb-2 flex items-center">
                  <SmilePlus size={14} className="mr-1" /> How are you feeling?
                </label>
                <div className="flex overflow-x-auto gap-2 pb-1 hide-scrollbar">
                  {MOODS.map(mood => (
                    <button
                      key={mood.label}
                      onClick={() => setSelectedMood(mood.emoji === selectedMood ? null : mood.emoji)}
                      className={`px-3 py-2 rounded-xl text-sm transition-colors border flex-shrink-0 ${
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
                  type="button"
                  onClick={() => {
                    setFreeWriteMode(false);
                    setIsWriting(false);
                  }}
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
      </section>

      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-slate-100">Prompt Deck</h3>
          <span className="text-xs text-slate-500 uppercase font-bold">Choose a doorway</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {PROMPTS.map(prompt => {
            const Icon = prompt.icon;
            const isSelected = prompt.id === selectedPromptId;

            return (
              <button
                key={prompt.id}
                onClick={() => startWriting(prompt.id)}
                className={`text-left rounded-2xl border p-4 transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-orange-500/15 border-orange-500/40'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center mr-2 text-orange-400">
                    <Icon size={16} />
                  </div>
                  <span className="font-bold text-slate-100 text-sm">{prompt.label}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{prompt.question}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-100">Reflection Timeline</h3>
          <span className="text-xs text-slate-500 font-semibold">{filteredEntries.length} shown</span>
        </div>

        {entries.length > 0 && (
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search reflections..."
              className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl py-3 pl-11 pr-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-orange-500/50"
            />
          </div>
        )}

        {entries.length === 0 ? (
          <div className="text-center py-10 bg-slate-900/50 rounded-3xl border border-slate-800/50 border-dashed px-5">
            <FileText className="mx-auto text-slate-600 mb-3" size={34} />
            <p className="text-slate-300 font-bold">Start with one honest line</p>
            <p className="text-slate-500 text-sm mt-2 mb-5">Try: "{PROMPTS[0].question}"</p>
            <button
              onClick={() => startWriting(PROMPTS[0].id, 'quick')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-2xl px-5 py-3 text-sm font-bold"
            >
              Begin First Reflection
            </button>
          </div>
        ) : groupedEntries.length === 0 ? (
          <div className="text-center py-8 bg-slate-900/50 rounded-3xl border border-slate-800/50">
            <p className="text-slate-400 font-medium">No reflections match your search.</p>
          </div>
        ) : (
          groupedEntries.map(group => (
            <div key={group.label} className="space-y-3">
              <p className="text-xs text-slate-500 uppercase font-bold">{group.label}</p>
              {group.entries.map((entry, idx) => (
                <ReflectionCard
                  key={entry.id}
                  entry={entry}
                  index={idx}
                  expanded={expandedEntryId === entry.id}
                  onToggle={() => setExpandedEntryId(expandedEntryId === entry.id ? null : entry.id)}
                />
              ))}
            </div>
          ))
        )}
      </section>
    </div>
  );
}

function InsightStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-3 text-center min-h-20 flex flex-col justify-center">
      <div className="text-2xl font-bold text-white leading-none">{value}</div>
      <div className="text-[10px] text-slate-500 uppercase font-bold mt-2">{label}</div>
    </div>
  );
}

function ReflectionCard({
  entry,
  index,
  expanded,
  onToggle,
}: {
  entry: JournalEntry;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-5 text-left active:scale-[0.99] transition-transform"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center text-slate-400 text-sm">
          <Calendar size={14} className="mr-1.5" />
          {format(new Date(entry.date), 'MMMM d, yyyy - h:mm a')}
        </div>
        <div className="flex items-center space-x-2">
          {entry.mood && (
            <span className="text-xl bg-slate-800/50 w-8 h-8 rounded-full flex items-center justify-center">
              {entry.mood}
            </span>
          )}
          <ChevronDown size={16} className={`text-slate-500 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </div>
      </div>
      <p className={`text-slate-300 leading-relaxed whitespace-pre-wrap ${expanded ? '' : 'line-clamp-3'}`}>
        {entry.text}
      </p>
    </motion.button>
  );
}
