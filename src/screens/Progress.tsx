import React, { useState, useMemo } from 'react';
import { useStore } from '../lib/store';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Zap, Target, BookOpen, BarChart3, Calendar, Filter, Clock, Wind, PlayCircle, FileText, ChevronRight, X, ArrowLeft } from 'lucide-react';
import { format, subDays, isSameDay, isWithinInterval, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getCourseBlueprint, CourseDay, CourseLesson } from '../data/lessons';

const FlameMetaphor = ({ level, streak, progressPercentage, deity }: { level: string; streak: number, progressPercentage: number, deity?: string }) => {
  const levels = ['Balak', 'Sevak', 'Veer', 'Bhakt', 'Mahaveer'];
  const levelIdx = Math.max(0, levels.indexOf(level));
  
  // Scale based on level (0.7 to 1.2) and smooth it slightly with progressPercentage
  const scale = 0.7 + (levelIdx * 0.1) + ((progressPercentage / 100) * 0.1);
  
  // Choose core colors based on deity
  const isShiva = deity === 'shiva';
  const isKrishna = deity === 'krishna';
  
  const blurColor = isShiva ? 'bg-[#0ea5e9]' : isKrishna ? 'bg-[#6366f1]' : 'bg-orange-500';
  const dimBlurColor = isShiva ? 'bg-[#0ea5e9]/50' : isKrishna ? 'bg-[#6366f1]/50' : 'bg-orange-800/50';
  
  const outerText = isShiva ? 'text-[#0ea5e9]' : isKrishna ? 'text-[#6366f1]' : 'text-orange-600';
  const innerText = isShiva ? 'text-[#38bdf8]' : isKrishna ? 'text-[#818cf8]' : 'text-orange-400';
  const coreText = isShiva ? 'text-[#bae6fd]' : isKrishna ? 'text-[#c7d2fe]' : 'text-yellow-300';
  
  const levelGradient = isShiva ? 'from-[#38bdf8] to-[#0284c7]' : isKrishna ? 'from-[#818cf8] to-[#4f46e5]' : 'from-orange-400 to-yellow-500';

  return (
    <div className="flex flex-col items-center justify-center py-10 bg-gradient-to-b from-slate-900 to-slate-900 border border-slate-800 rounded-3xl mb-6 relative overflow-hidden shadow-lg shadow-black/20">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div 
          animate={{ opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className={`w-64 h-64 rounded-full blur-3xl ${levelIdx > 2 ? blurColor : dimBlurColor}`} 
        />
      </div>
      
      <div className="relative z-10 flex flex-col items-center w-full">
        <motion.div 
          animate={{ 
            scale: [scale, scale * 1.03, scale],
            rotate: [-1, 1, -1]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative w-32 h-32 flex items-center justify-center mb-6 origin-bottom"
        >
          {/* Base Glow / Aura */}
          <svg className={`absolute w-full h-full ${outerText} opacity-30 blur-md origin-bottom`} viewBox="0 0 100 100">
            <path fill="currentColor" d={isKrishna ? "M50 10 C30 30 10 70 50 90 C90 70 70 30 50 10 Z" : isShiva ? "M50 10 C20 40 10 80 50 90 C90 80 80 40 50 10 Z" : "M50 10 C30 50 10 70 30 90 C45 100 55 100 70 90 C90 70 70 50 50 10 Z"} />
          </svg>
          
          {/* Outer Layer */}
          <motion.svg 
            animate={{ 
              d: isKrishna ? [
                "M50 15 C35 30 20 70 50 85 C80 70 65 30 50 15 Z",
                "M50 12 C32 28 23 72 50 86 C77 72 68 28 50 12 Z",
                "M50 15 C35 30 20 70 50 85 C80 70 65 30 50 15 Z"
              ] : isShiva ? [
                "M50 20 C25 45 15 85 50 90 C85 85 75 45 50 20 Z",
                "M50 18 C22 42 12 88 50 92 C88 88 78 42 50 18 Z",
                "M50 20 C25 45 15 85 50 90 C85 85 75 45 50 20 Z"
              ] : [
                "M50 15 C35 50 20 70 35 85 C45 95 55 95 65 85 C80 70 65 50 50 15 Z",
                "M50 12 C32 48 23 72 38 86 C48 97 52 97 62 86 C77 72 68 48 50 12 Z",
                "M50 15 C35 50 20 70 35 85 C45 95 55 95 65 85 C80 70 65 50 50 15 Z"
              ] 
            } as any}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute w-full h-full ${outerText} drop-shadow-md origin-bottom`} 
            viewBox="0 0 100 100"
          >
            <path fill="currentColor" d="M50 15 C35 50 20 70 35 85 C45 95 55 95 65 85 C80 70 65 50 50 15 Z" />
          </motion.svg>
          
          {/* Inner Layer (Sevak and above) */}
          {(levelIdx >= 1) && (
            <motion.svg 
              animate={{ 
                d: isKrishna ? [
                  "M50 30 C40 45 30 70 50 82 C70 70 60 45 50 30 Z",
                  "M50 28 C38 42 32 72 50 84 C68 72 62 42 50 28 Z",
                  "M50 30 C40 45 30 70 50 82 C70 70 60 45 50 30 Z"
                ] : isShiva ? [
                  "M50 35 C30 55 25 80 50 82 C75 80 70 55 50 35 Z",
                  "M50 32 C28 52 22 82 50 84 C78 82 72 52 50 32 Z",
                  "M50 35 C30 55 25 80 50 82 C75 80 70 55 50 35 Z"
                ] : [
                  "M50 30 C40 55 30 70 40 82 C46 88 54 88 60 82 C70 70 60 55 50 30 Z",
                  "M50 28 C38 52 32 72 42 84 C48 90 52 90 58 84 C68 72 62 52 50 28 Z",
                  "M50 30 C40 55 30 70 40 82 C46 88 54 88 60 82 C70 70 60 55 50 30 Z"
                ]
              } as any}
              transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
              className={`absolute w-full h-full ${innerText} origin-bottom`} 
              viewBox="0 0 100 100"
            >
              <path fill="currentColor" d="M50 30 C40 55 30 70 40 82 C46 88 54 88 60 82 C70 70 60 55 50 30 Z" />
            </motion.svg>
          )}

          {/* Core Layer (Veer and above) */}
          {(levelIdx >= 2) && (
             <motion.svg 
              animate={{
                d: isKrishna ? [
                  "M50 45 C45 55 38 72 50 80 C62 72 55 55 50 45 Z",
                  "M50 43 C43 52 36 74 50 82 C64 74 57 52 50 43 Z",
                  "M50 45 C45 55 38 72 50 80 C62 72 55 55 50 45 Z"
                ] : isShiva ? [
                  "M50 50 C38 65 35 75 50 80 C65 75 62 65 50 50 Z",
                  "M50 48 C36 62 32 78 50 82 C68 78 64 62 50 48 Z",
                  "M50 50 C38 65 35 75 50 80 C65 75 62 65 50 50 Z"
                ] : [
                  "M50 45 C45 60 38 72 45 80 C48 83 52 83 55 80 C62 72 55 60 50 45 Z",
                  "M50 43 C43 62 36 74 46 82 C50 85 50 85 54 82 C64 74 57 62 50 43 Z",
                  "M50 45 C45 60 38 72 45 80 C48 83 52 83 55 80 C62 72 55 60 50 45 Z"
                ]
              } as any}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
              className={`absolute w-full h-full ${coreText} origin-bottom`} 
              viewBox="0 0 100 100"
             >
               <path fill="currentColor" d="M50 45 C45 60 38 72 45 80 C48 83 52 83 55 80 C62 72 55 60 50 45 Z" />
             </motion.svg>
          )}

          {/* Brightest Center (Mahaveer) */}
          {(levelIdx >= 4) && (
             <svg className="absolute w-full h-full text-white origin-bottom blur-[1px]" viewBox="0 0 100 100">
               <path fill="currentColor" d="M50 55 C48 65 44 72 48 76 C49 78 51 78 52 76 C56 72 52 65 50 55 Z" />
             </svg>
          )}
          
          {/* Sparkles / Ash (for Bhakt and Mahaveer) */}
          {(levelIdx >= 3) && (
            <>
              <motion.div className={`absolute w-1.5 h-1.5 ${isShiva ? 'bg-cyan-200' : isKrishna ? 'bg-indigo-300' : 'bg-yellow-200'} rounded-full`} animate={{ y: [-10, -60], x: [-5, 15], opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.1, ease: "easeOut" }} />
              <motion.div className={`absolute w-1 h-1 ${isShiva ? 'bg-cyan-400' : isKrishna ? 'bg-indigo-400' : 'bg-orange-200'} rounded-full`} animate={{ y: [-5, -50], x: [5, -20], opacity: [0, 1, 0] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.8, ease: "easeOut" }} />
              <motion.div className={`absolute w-2 h-2 ${isShiva ? 'bg-cyan-300/50' : isKrishna ? 'bg-indigo-300/50' : 'bg-yellow-400/50'} rounded-full blur-[1px]`} animate={{ y: [0, -40], x: [-10, -5], opacity: [0, 1, 0] }} transition={{ duration: 1.8, repeat: Infinity, delay: 1.5, ease: "easeOut" }} />
            </>
          )}
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex flex-col items-center">
            <span className={`text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${levelGradient} tracking-wide mb-1 drop-shadow-sm`}>{level}</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-sm text-slate-400 font-medium tracking-wide uppercase">Streak</span>
              <span className="text-3xl font-black text-white">{streak}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export function Progress() {
  const { user, level, nextLevelXP, progressPercentage, course, sessions, customSessionTypes } = useStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'insights' | 'history'>('overview');
  const [historyFilterType, setHistoryFilterType] = useState<string>('all');
  const [historyDateRange, setHistoryDateRange] = useState<'all' | 'today' | 'week' | 'month'>('all');

  const [selectedDayData, setSelectedDayData] = useState<CourseDay | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<CourseLesson | null>(null);

  const { last30Days, activityMap, focusData, malaData, todayStats } = useMemo(() => {
    const today = new Date();
    const days = Array.from({ length: 30 }).map((_, i) => format(subDays(today, 29 - i), 'yyyy-MM-dd'));
    
    const actMap: Record<string, number> = {};
    sessions.forEach(s => {
      const d = format(new Date(s.date), 'yyyy-MM-dd');
      actMap[d] = (actMap[d] || 0) + 1;
    });
    course.forEach(c => {
      if (c.completedAt) {
        const d = format(new Date(c.completedAt), 'yyyy-MM-dd');
        actMap[d] = (actMap[d] || 0) + 1;
      }
    });

    const fData = days.map(dateStr => {
      const mins = sessions
        .filter(s => s.type === 'focus' && format(new Date(s.date), 'yyyy-MM-dd') === dateStr)
        .reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
      return { date: format(new Date(dateStr), 'MMM dd'), minutes: mins };
    });

    const mData = days.map(dateStr => {
      const count = sessions
        .filter(s => s.type === 'mala' && format(new Date(s.date), 'yyyy-MM-dd') === dateStr)
        .reduce((acc, s) => acc + (s.count || 0), 0);
      return { date: format(new Date(dateStr), 'MMM dd'), count: count };
    });

    const todaySessions = sessions.filter(s => isSameDay(new Date(s.date), today));
    const tStats = {
      malas: todaySessions.filter(s => s.type === 'mala').reduce((acc, s) => acc + (s.count || 0), 0),
      focusMinutes: todaySessions.filter(s => s.type === 'focus').reduce((acc, s) => acc + (s.durationMinutes || 0), 0),
      breatheSessions: todaySessions.filter(s => s.type === 'breathe').length,
    };

    return { last30Days: days, activityMap: actMap, focusData: fData, malaData: mData, todayStats: tStats };
  }, [sessions, course]);

  const filteredHistory = useMemo(() => {
    let filtered = sessions;
    
    if (historyFilterType !== 'all') {
      filtered = filtered.filter(s => s.type === historyFilterType);
    }

    const today = new Date();
    if (historyDateRange === 'today') {
      filtered = filtered.filter(s => isSameDay(new Date(s.date), today));
    } else if (historyDateRange === 'week') {
      filtered = filtered.filter(s => isWithinInterval(new Date(s.date), { start: startOfWeek(today), end: endOfWeek(today) }));
    } else if (historyDateRange === 'month') {
      filtered = filtered.filter(s => isWithinInterval(new Date(s.date), { start: startOfMonth(today), end: endOfMonth(today) }));
    }

    return filtered;
  }, [sessions, historyFilterType, historyDateRange]);

  if (!user) return null;

  return (
    <div className="p-6 space-y-6 pb-32 h-full overflow-y-auto">
      <header className="pt-8">
        <h1 className="text-3xl font-bold tracking-tight">Progress</h1>
        <p className="text-slate-400 mt-2">Track your spiritual growth.</p>
      </header>

      <div className="flex bg-slate-900 rounded-xl p-1 border border-slate-800">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('insights')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'insights' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
        >
          Insights
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'history' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
        >
          History
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <FlameMetaphor level={level} streak={user.streak} progressPercentage={progressPercentage} deity={user.deity} />

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <p className="text-sm text-slate-400 uppercase tracking-wider font-medium mb-1">XP Progress</p>
                  <h2 className="text-xl font-bold text-slate-200">To {nextLevelXP} XP</h2>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-orange-500">{user.xp}</p>
                </div>
              </div>
              
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative overflow-hidden bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 shadow-xl shadow-black/20 rounded-3xl p-6 flex flex-col items-center justify-center text-center group hover:bg-slate-800/60 hover:border-orange-500/30 transition-all duration-500">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-yellow-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-yellow-500/30 transition-all duration-500" />
                <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-yellow-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-yellow-600/20 transition-all duration-500" />
                
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-600/5 border border-orange-500/20 flex items-center justify-center mb-4 text-orange-500 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 shadow-inner">
                  <Target size={28} strokeWidth={2.5} />
                </div>
                <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 tracking-tight mb-1">{sessions.filter(s => s.type === 'mala').reduce((acc, s) => acc + (s.count || 0), 0)}</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">Total Chants</span>
              </div>
              <div className="relative overflow-hidden bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 shadow-xl shadow-black/20 rounded-3xl p-6 flex flex-col items-center justify-center text-center group hover:bg-slate-800/60 hover:border-blue-500/30 transition-all duration-500">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/30 transition-all duration-500" />
                <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-600/20 transition-all duration-500" />
                
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/5 border border-blue-500/20 flex items-center justify-center mb-4 text-blue-500 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-inner">
                  <Award size={28} strokeWidth={2.5} />
                </div>
                <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 tracking-tight mb-1">{course.length}</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">Days Completed</span>
              </div>
            </div>

            {/* Daily Goals */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <h2 className="text-xl font-semibold mb-4">Today's Goals</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">Malas</span>
                    <span className="text-slate-400">{todayStats.malas} / {user.dailyGoals?.malas || 1}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-500 rounded-full"
                      style={{ width: `${Math.min(100, (todayStats.malas / (user.dailyGoals?.malas || 1)) * 100)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">Focus Time</span>
                    <span className="text-slate-400">{todayStats.focusMinutes} / {user.dailyGoals?.focusMinutes || 10} min</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${Math.min(100, (todayStats.focusMinutes / (user.dailyGoals?.focusMinutes || 10)) * 100)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">Breathe Sessions</span>
                    <span className="text-slate-400">{todayStats.breatheSessions} / {user.dailyGoals?.breatheSessions || 1}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-teal-500 rounded-full"
                      style={{ width: `${Math.min(100, (todayStats.breatheSessions / (user.dailyGoals?.breatheSessions || 1)) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <div className="flex items-center mb-6">
                <BookOpen className="text-orange-500 mr-3" size={24} />
                <h2 className="text-xl font-semibold">
                  {user.deity === 'shiva' ? 'Shiva' : user.deity === 'krishna' ? 'Krishna' : 'Hanuman'} Aarambh Sadhana
                </h2>
              </div>
              
              <div className="space-y-4">
                {getCourseBlueprint(user.deity).map((dayData) => {
                  const day = dayData.day;
                  const isCompleted = course.some(c => c.day === day);
                  const isNext = !isCompleted && (day === 1 || course.some(c => c.day === day - 1));
                  const isLocked = !isCompleted && !isNext;
                  
                  return (
                    <button 
                      key={day}
                      onClick={() => {
                        if (!isLocked) {
                          setSelectedDayData(dayData);
                        }
                      }}
                      className={`w-full flex items-center p-4 rounded-xl border text-left transition-colors ${
                        isCompleted 
                          ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800' 
                          : isNext 
                            ? 'bg-orange-900/20 border-orange-500/30 hover:bg-orange-900/30' 
                            : 'bg-slate-900 border-slate-800 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-4 shrink-0 ${
                        isCompleted ? 'bg-green-500/20 text-green-500' : isNext ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-500'
                      }`}>
                        {day}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-medium ${isCompleted ? 'text-slate-300' : isNext ? 'text-white' : 'text-slate-500'}`}>
                          Day {day}: {dayData.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                          {isCompleted ? 'Completed' : isNext ? 'Ready to start' : 'Locked'}
                        </p>
                      </div>
                      {!isLocked && <ChevronRight size={18} className="text-slate-600 shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
        
        {activeTab === 'insights' && (
          <motion.div
            key="insights"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Activity Heatmap */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <div className="flex items-center mb-4">
                <Calendar className="text-orange-500 mr-2" size={20} />
                <h2 className="text-lg font-semibold">Activity Heatmap</h2>
              </div>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {last30Days.map(date => {
                  const count = activityMap[date] || 0;
                  let bg = 'bg-slate-800';
                  if (count === 1) bg = 'bg-orange-900/50';
                  if (count === 2) bg = 'bg-orange-700/70';
                  if (count >= 3) bg = 'bg-orange-500';
                  
                  return (
                    <div 
                      key={date} 
                      className={`w-6 h-6 rounded-sm ${bg} transition-colors`}
                      title={`${date}: ${count} activities`}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between items-center mt-4 text-xs text-slate-500">
                <span>30 Days Ago</span>
                <div className="flex items-center space-x-1">
                  <span className="mr-1">Less</span>
                  <div className="w-3 h-3 rounded-sm bg-slate-800" />
                  <div className="w-3 h-3 rounded-sm bg-orange-900/50" />
                  <div className="w-3 h-3 rounded-sm bg-orange-700/70" />
                  <div className="w-3 h-3 rounded-sm bg-orange-500" />
                  <span className="ml-1">More</span>
                </div>
                <span>Today</span>
              </div>
            </div>

            {/* Focus Time Tracker */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <div className="flex items-center mb-6">
                <BarChart3 className="text-orange-500 mr-2" size={20} />
                <h2 className="text-lg font-semibold">Focus Time (Last 30 Days)</h2>
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={focusData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickMargin={10} minTickGap={20} />
                    <YAxis stroke="#64748b" fontSize={10} tickFormatter={(val) => `${val}m`} width={35} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                      itemStyle={{ color: '#f97316' }}
                      cursor={{ fill: '#1e293b' }}
                    />
                    <Bar dataKey="minutes" fill="#f97316" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Mala Count History */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <div className="flex items-center mb-6">
                <Target className="text-orange-500 mr-2" size={20} />
                <h2 className="text-lg font-semibold">Mala Chants (Last 30 Days)</h2>
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={malaData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickMargin={10} minTickGap={20} />
                    <YAxis stroke="#64748b" fontSize={10} width={35} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                      itemStyle={{ color: '#f97316' }}
                    />
                    <Line type="monotone" dataKey="count" stroke="#f97316" strokeWidth={3} dot={{ fill: '#0f172a', stroke: '#f97316', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: '#f97316' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 shrink-0">
                <Filter size={14} className="text-slate-400 mr-2" />
                <select 
                  value={historyFilterType}
                  onChange={(e) => setHistoryFilterType(e.target.value)}
                  className="bg-transparent text-sm text-white focus:outline-none"
                >
                  <option value="all">All Types</option>
                  <option value="mala">Mala</option>
                  <option value="focus">Focus</option>
                  <option value="breathe">Breathe</option>
                  <option value="meditation">Guided Meditation</option>
                  {customSessionTypes.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 shrink-0">
                <Calendar size={14} className="text-slate-400 mr-2" />
                <select 
                  value={historyDateRange}
                  onChange={(e) => setHistoryDateRange(e.target.value as any)}
                  className="bg-transparent text-sm text-white focus:outline-none"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {filteredHistory.length === 0 ? (
                <div className="text-center py-10 text-slate-500">
                  No sessions found for the selected filters.
                </div>
              ) : (
                filteredHistory.map(session => {
                  let icon = <Target size={16} className="text-orange-500" />;
                  let title = 'Mala Session';
                  let detail = `${session.count} chants`;
                  
                  if (session.type === 'focus') {
                    icon = <Clock size={16} className="text-blue-500" />;
                    title = 'Focus Session';
                    detail = `${session.durationMinutes} min`;
                  } else if (session.type === 'breathe') {
                    icon = <Wind size={16} className="text-teal-500" />;
                    title = 'Breathe Session';
                    detail = 'Completed';
                  } else if (session.type !== 'mala') {
                    const cType = customSessionTypes.find(t => t.id === session.type);
                    title = cType ? cType.name : session.customTypeName || 'Custom Session';
                    detail = session.durationMinutes ? `${session.durationMinutes} min` : 'Completed';
                  }

                  return (
                    <div key={session.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mr-4">
                          {icon}
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-200">{title}</h4>
                          <p className="text-xs text-slate-500">{format(new Date(session.date), 'MMM d, yyyy • h:mm a')}</p>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-slate-300">
                        {detail}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dedicated Day Screen Overlay */}
      <AnimatePresence>
        {selectedDayData && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-slate-950 overflow-y-auto flex flex-col"
          >
            <div className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-4 py-4 flex items-center">
              <button 
                onClick={() => {
                  setSelectedDayData(null);
                  setSelectedLesson(null);
                }}
                className="p-2 -ml-2 mr-2 rounded-full hover:bg-slate-800 transition-colors"
              >
                <ArrowLeft size={24} className="text-slate-300" />
              </button>
              <div>
                <span className="text-xs text-orange-500 font-bold uppercase tracking-wider">Day {selectedDayData.day}</span>
                <h2 className="text-xl font-bold">{selectedDayData.title}</h2>
              </div>
            </div>
            
            <div className="p-6 pb-24 flex-1 max-w-3xl mx-auto w-full">
              <div className="bg-orange-900/20 border border-orange-500/30 rounded-2xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-orange-400 mb-2">Theme of the Day</h3>
                <p className="text-slate-300 leading-relaxed">{selectedDayData.theme}</p>
              </div>

              <h3 className="text-xl font-bold mb-4">Lessons & Practices</h3>
              <div className="space-y-4 mb-8">
                {selectedDayData.lessons.map((lesson, idx) => {
                  const isExpanded = selectedLesson?.id === lesson.id;
                  
                  return (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + (idx * 0.1), duration: 0.5 }}
                      key={lesson.id} 
                      className={`bg-slate-900/80 backdrop-blur-sm border rounded-2xl overflow-hidden transition-all duration-500 ${isExpanded ? 'border-orange-500/50 shadow-[0_0_30px_rgba(249,115,22,0.15)]' : 'border-slate-800 hover:border-slate-700'}`}
                    >
                      <button
                        onClick={() => setSelectedLesson(isExpanded ? null : lesson)}
                        className={`w-full p-5 flex items-center justify-between text-left transition-colors ${isExpanded ? 'bg-orange-500/5' : 'hover:bg-slate-800/50'}`}
                      >
                        <div className="flex items-center flex-1">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 shrink-0 transition-all duration-300 ${isExpanded ? 'bg-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.2)]' : 'bg-slate-800'}`}>
                            {lesson.format === 'practice' ? (
                              <PlayCircle size={20} className={isExpanded ? 'text-orange-400' : 'text-slate-400'} />
                            ) : (
                              <FileText size={20} className={isExpanded ? 'text-orange-400' : 'text-slate-400'} />
                            )}
                          </div>
                          <div>
                            <h3 className={`font-semibold text-lg transition-colors ${isExpanded ? 'text-orange-400' : 'text-slate-200'}`}>
                              {lesson.title}
                            </h3>
                            <p className="text-sm text-slate-400 mt-1 flex items-center font-medium">
                              <span className={`inline-block w-2 h-2 rounded-full mr-2 ${lesson.format === 'practice' ? 'bg-orange-500' : 'bg-blue-500'}`} />
                              {lesson.format === 'practice' ? 'Guided Practice' : 'Reading'} <span className="mx-2 opacity-50">•</span> {lesson.duration}
                            </p>
                          </div>
                        </div>
                        <motion.div
                          animate={{ rotate: isExpanded ? 90 : 0 }}
                          transition={{ duration: 0.3, type: "spring" }}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isExpanded ? 'bg-orange-500/10' : 'bg-slate-800/50'}`}
                        >
                          <ChevronRight size={18} className={isExpanded ? 'text-orange-500' : 'text-slate-400'} />
                        </motion.div>
                      </button>
                      
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="border-t border-orange-500/20"
                          >
                            <div className="p-6 bg-gradient-to-b from-orange-500/5 to-transparent">
                              <div className="bg-slate-950/50 rounded-xl p-4 mb-6 border border-slate-800/50">
                                <p className="text-orange-200/80 text-sm italic leading-relaxed">
                                  {lesson.description}
                                </p>
                              </div>
                              <div className="prose prose-invert prose-orange max-w-none">
                                <p className="text-slate-300 leading-loose whitespace-pre-wrap text-base font-medium tracking-wide">
                                  {lesson.content}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
