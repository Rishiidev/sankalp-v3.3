import React, { useState } from 'react';
import { useStore } from '../lib/store';
import { motion } from 'motion/react';
import { User, Edit2, Book, Plus, Search, Download, Smile, Palette, Target, Heart, Quote, Star, Moon, Sun, Settings, Smartphone, Award } from 'lucide-react';
import { format, isToday } from 'date-fns';

const MOODS = [
  { id: 'calm', emoji: '😌', label: 'Calm' },
  { id: 'energetic', emoji: '⚡️', label: 'Energetic' },
  { id: 'neutral', emoji: '😐', label: 'Neutral' },
  { id: 'low', emoji: '😔', label: 'Low' },
  { id: 'frustrated', emoji: '😠', label: 'Frustrated' },
];

export function Profile() {
  const { user, updateUser, journal, addJournalEntry, toggleFavoriteQuote, toggleHaptics, sessions, chantChallenges } = useStore();
  
  const todaySessions = sessions.filter(s => isToday(new Date(s.date)));
  const todayMalas = todaySessions.filter(s => s.type === 'mala').length;
  const todayFocus = todaySessions.filter(s => s.type === 'focus' || s.type === 'meditation').reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
  const todayBreathe = todaySessions.filter(s => s.type === 'breathe').length;

  const totalJapas = sessions.filter(s => s.type === 'mala').reduce((acc, s) => acc + (s.count || 108), 0);
  const hasEarlyBird = sessions.some(s => {
    const hour = new Date(s.date).getHours();
    return hour >= 3 && hour < 6;
  });
  const hasCompletedVrata = chantChallenges?.some(c => c.completed) || false;

  const BADGES = [
    {
      id: '1k_japas',
      name: '1,000 Japas',
      description: 'Chant 1,000 names',
      icon: '📿',
      earned: totalJapas >= 1000,
    },
    {
      id: 'streak_7',
      name: '7-Day Streak',
      description: 'Practice 7 days in a row',
      icon: '🔥',
      earned: (user?.streak || 0) >= 7,
    },
    {
      id: 'early_bird',
      name: 'Early Bird',
      description: 'Practice before 6 AM',
      icon: '🌅',
      earned: hasEarlyBird,
    },
    {
      id: 'first_vrata',
      name: 'First Vrata',
      description: 'Complete a resolution',
      icon: '🎯',
      earned: hasCompletedVrata,
    }
  ];

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editSankalp, setEditSankalp] = useState(user?.sankalp || '');
  const [editGoals, setEditGoals] = useState({
    malas: user?.dailyGoals?.malas || 1,
    focusMinutes: user?.dailyGoals?.focusMinutes || 10,
    breatheSessions: user?.dailyGoals?.breatheSessions || 1,
  });
  const [newEntry, setNewEntry] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  if (!user) return null;

  const handleSaveProfile = () => {
    updateUser({ name: editName, sankalp: editSankalp, dailyGoals: editGoals });
    setIsEditing(false);
  };

  const handleSaveEntry = async () => {
    if (newEntry.trim()) {
      await addJournalEntry(newEntry, selectedMood);
      setNewEntry('');
      setSelectedMood('');
      setIsAddingEntry(false);
    }
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify({ user, journal }, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sadhana_export_${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredJournal = journal.filter(entry => 
    entry.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (entry.mood && entry.mood.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-8 pb-32">
      <header className="pt-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="p-2 bg-slate-900 rounded-full text-slate-400 hover:text-white transition-colors"
        >
          <Edit2 size={18} />
        </button>
      </header>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <h3 className="text-sm text-slate-400 uppercase tracking-wider font-medium mb-4 flex items-center">
            <Star size={16} className="mr-2" /> Chosen Deity
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => updateUser({ deity: 'hanuman' })}
              className={`flex flex-col items-center justify-center py-4 px-2 rounded-xl transition-all ${
                (!user.deity || user.deity === 'hanuman') 
                  ? 'bg-orange-500/20 border-2 border-orange-500 text-orange-500' 
                  : 'bg-slate-800 border-2 border-transparent text-slate-400 hover:bg-slate-700'
              }`}
            >
              <span className="text-2xl mb-1">🐒</span>
              <span className="text-xs font-bold">Hanuman</span>
            </button>
            <button
              onClick={() => updateUser({ deity: 'shiva' })}
              className={`flex flex-col items-center justify-center py-4 px-2 rounded-xl transition-all ${
                user.deity === 'shiva' 
                  ? 'bg-[#0ea5e9]/20 border-2 border-[#0ea5e9] text-[#0ea5e9]' 
                  : 'bg-slate-800 border-2 border-transparent text-slate-400 hover:bg-slate-700'
              }`}
            >
              <span className="text-2xl mb-1">🌙</span>
              <span className="text-xs font-bold">Shiva</span>
            </button>
            <button
              onClick={() => updateUser({ deity: 'krishna' })}
              className={`flex flex-col items-center justify-center py-4 px-2 rounded-xl transition-all ${
                user.deity === 'krishna' 
                  ? 'bg-[#6366f1]/20 border-2 border-[#6366f1] text-[#6366f1]' 
                  : 'bg-slate-800 border-2 border-transparent text-slate-400 hover:bg-slate-700'
              }`}
            >
              <span className="text-2xl mb-1">🦚</span>
              <span className="text-xs font-bold">Krishna</span>
            </button>
          </div>
        </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mr-4">
            <User size={32} className="text-orange-500" />
          </div>
          <div>
            {isEditing ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white w-full mb-2"
              />
            ) : (
              <h2 className="text-2xl font-bold">{user.name}</h2>
            )}
            <p className="text-sm text-slate-400">Joined {format(new Date(), 'MMM yyyy')}</p>
          </div>
        </div>

        <div>
          <h3 className="text-sm text-slate-400 uppercase tracking-wider font-medium mb-2">Your Sankalp</h3>
          {isEditing ? (
            <div className="space-y-3">
              <textarea
                value={editSankalp}
                onChange={(e) => setEditSankalp(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded p-3 text-white w-full min-h-[80px] resize-none"
              />
              <button 
                onClick={handleSaveProfile}
                className="w-full bg-orange-600 text-white rounded-lg py-2 font-medium"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <p className="text-slate-200 italic border-l-2 border-orange-500 pl-4 py-1">
              "{user.sankalp}"
            </p>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-slate-800">
          <h3 className="text-sm text-slate-400 uppercase tracking-wider font-medium mb-3 flex items-center">
            <Palette size={16} className="mr-2" /> Settings
          </h3>
          <div className="flex items-center justify-between bg-slate-800 p-4 rounded-xl">
            <span className="text-slate-300">Haptic Feedback</span>
            <button
              onClick={toggleHaptics}
              className={`w-12 h-6 rounded-full transition-colors ${user.hapticsEnabled ? 'bg-orange-600' : 'bg-slate-700'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${user.hapticsEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-800">
          <h3 className="text-sm text-slate-400 uppercase tracking-wider font-medium mb-3 flex items-center">
            <Palette size={16} className="mr-2" /> Theme
          </h3>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => updateUser({ theme: 'midnight' })}
              className={`py-2 px-3 rounded-xl text-sm font-medium transition-colors ${
                (!user.theme || user.theme === 'midnight') ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              Midnight
            </button>
            <button
              onClick={() => updateUser({ theme: 'dawn' })}
              className={`py-2 px-3 rounded-xl text-sm font-medium transition-colors ${
                user.theme === 'dawn' ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              Dawn
            </button>
            <button
              onClick={() => updateUser({ theme: 'temple' })}
              className={`py-2 px-3 rounded-xl text-sm font-medium transition-colors ${
                user.theme === 'temple' ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              Temple
            </button>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-800">
          <h3 className="text-sm text-slate-400 uppercase tracking-wider font-medium mb-3 flex items-center">
            <Target size={16} className="mr-2" /> Daily Goals
          </h3>
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Malas per day</label>
                <input
                  type="number"
                  min="1"
                  value={editGoals.malas}
                  onChange={(e) => setEditGoals({ ...editGoals, malas: parseInt(e.target.value) || 1 })}
                  className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Focus Minutes per day</label>
                <input
                  type="number"
                  min="1"
                  value={editGoals.focusMinutes}
                  onChange={(e) => setEditGoals({ ...editGoals, focusMinutes: parseInt(e.target.value) || 1 })}
                  className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Breathe Sessions per day</label>
                <input
                  type="number"
                  min="1"
                  value={editGoals.breatheSessions}
                  onChange={(e) => setEditGoals({ ...editGoals, breatheSessions: parseInt(e.target.value) || 1 })}
                  className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white w-full"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-slate-800/50 rounded-xl p-3">
                <div className="text-2xl font-bold text-orange-500">
                  {todayMalas} <span className="text-sm text-slate-500">/ {user.dailyGoals?.malas || 1}</span>
                </div>
                <div className="text-xs text-slate-400 mt-1">Malas Today</div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-3">
                <div className="text-2xl font-bold text-orange-500">
                  {todayFocus} <span className="text-sm text-slate-500">/ {user.dailyGoals?.focusMinutes || 10}</span>
                </div>
                <div className="text-xs text-slate-400 mt-1">Focus Min</div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-3">
                <div className="text-2xl font-bold text-orange-500">
                  {todayBreathe} <span className="text-sm text-slate-500">/ {user.dailyGoals?.breatheSessions || 1}</span>
                </div>
                <div className="text-xs text-slate-400 mt-1">Breathe</div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-slate-800">
          <h3 className="text-sm text-slate-400 uppercase tracking-wider font-medium mb-4 flex items-center">
            <Award size={16} className="mr-2 text-orange-500" /> Spiritual Milestones
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {BADGES.map((badge) => (
              <div
                key={badge.id}
                className={`flex flex-col items-center p-4 rounded-2xl border transition-all ${
                  badge.earned
                    ? 'bg-orange-500/10 border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.1)]'
                    : 'bg-slate-900 border-slate-800 opacity-50 grayscale'
                }`}
              >
                <div className="text-3xl mb-2">{badge.icon}</div>
                <h4 className={`text-sm font-bold text-center ${badge.earned ? 'text-orange-400' : 'text-slate-400'}`}>
                  {badge.name}
                </h4>
                <p className="text-xs text-slate-500 text-center mt-1 leading-snug">
                  {badge.description}
                </p>
                {badge.earned && (
                  <div className="mt-2 text-[10px] font-bold text-orange-500 uppercase tracking-wider bg-orange-500/20 px-2 py-0.5 rounded-full">
                    Earned
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Favorite Quotes Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center">
          <Heart className="mr-2 text-orange-500" size={20} />
          Favorite Quotes
        </h2>
        {(!user.favoriteQuotes || user.favoriteQuotes.length === 0) ? (
          <p className="text-slate-500 text-center py-8 bg-slate-900 border border-slate-800 rounded-2xl">
            No favorite quotes yet. Heart a quote on the Home screen to save it here.
          </p>
        ) : (
          <div className="space-y-3">
            {user.favoriteQuotes.map((quote, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
                <Quote className="absolute top-4 right-4 text-slate-800/50 rotate-180" size={32} />
                <p className="text-slate-300 text-sm leading-relaxed italic relative z-10 mb-3">
                  "{quote.text}"
                </p>
                <div className="flex items-center justify-between relative z-10">
                  <p className="text-xs text-orange-500/80 font-semibold tracking-wider uppercase">
                    — {quote.source}
                  </p>
                  <button 
                    onClick={() => toggleFavoriteQuote(quote)}
                    className="p-2 bg-slate-800/50 rounded-full text-orange-500 hover:bg-slate-800 transition-colors"
                  >
                    <Heart size={14} className="fill-orange-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-800">
        <h2 className="text-lg font-semibold flex items-center">
          <Settings className="mr-2 text-slate-400" size={20} />
          Settings
        </h2>
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-800 rounded-lg">
                <Smartphone className="text-orange-500" size={18} />
              </div>
              <div>
                <p className="font-medium text-slate-200">Haptic Feedback</p>
                <p className="text-xs text-slate-400">Vibrate on interactions</p>
              </div>
            </div>
            <button 
              onClick={() => toggleHaptics()}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${user?.hapticsEnabled ? 'bg-orange-500' : 'bg-slate-700'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${user?.hapticsEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-800 rounded-lg">
                <Download className="text-orange-500" size={18} />
              </div>
              <div>
                <p className="font-medium text-slate-200">Export User Data</p>
                <p className="text-xs text-slate-400">Download your data to JSON</p>
              </div>
            </div>
            <button 
              onClick={handleExportData}
              className="text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl transition-colors"
            >
              Export
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
