import React, { useEffect, useMemo, useState } from 'react';
import { useStore } from '../lib/store';
import {
  Award,
  Bell,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  FileText,
  Flame,
  Heart,
  HelpCircle,
  Lock,
  MessageCircle,
  PartyPopper,
  PlayCircle,
  Quote,
  Share2,
  Sparkles,
  Target,
  Wind,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { isToday } from 'date-fns';
import { getCourseBlueprint, CourseLesson } from '../data/lessons';
import { DAILY_QUOTES } from '../data/quotes';

type RhythmItem = {
  id: string;
  label: string;
  detail: string;
  complete: boolean;
  icon: React.ElementType;
  action: 'course' | 'sadhana' | 'journal';
};

interface HomeProps {
  onNavigate: (tab: string) => void;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

const LEVEL_HINTS: Record<string, string> = {
  Balak: 'Beginner',
  Sevak: 'Disciple',
  Veer: 'Steady',
  Bhakt: 'Devoted',
  Mahaveer: 'Fearless',
};

export function Home({ onNavigate }: HomeProps) {
  const {
    user,
    level,
    progressPercentage,
    course,
    sessions,
    journal,
    completeCourseDay,
    toggleFavoriteQuote,
    nextLevelXP,
  } = useStore();
  const reduceMotion = usePrefersReducedMotion();
  const [selectedLesson, setSelectedLesson] = useState<CourseLesson | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showGamificationHelp, setShowGamificationHelp] = useState(false);

  const currentBlueprint = getCourseBlueprint(user?.deity);
  const currentDayNum = Math.min(course.length + 1, currentBlueprint.length);
  const [selectedDayNum, setSelectedDayNum] = useState<number>(currentDayNum);

  useEffect(() => {
    setSelectedDayNum(currentDayNum);
  }, [currentDayNum]);

  const { greeting, dailyQuote } = useMemo(() => {
    const hour = new Date().getHours();
    let greet = 'Good evening';
    if (hour < 12) greet = 'Good morning';
    else if (hour < 18) greet = 'Good afternoon';

    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    const currentDeity = user?.deity || 'hanuman';
    let relevantQuotes = DAILY_QUOTES.filter(q => q.deity === currentDeity || q.deity === 'all');
    if (relevantQuotes.length === 0) relevantQuotes = DAILY_QUOTES;

    return { greeting: greet, dailyQuote: relevantQuotes[dayOfYear % relevantQuotes.length] };
  }, [user?.deity]);

  const todaySessions = useMemo(() => sessions.filter(s => isToday(new Date(s.date))), [sessions]);
  const todayJournaled = useMemo(() => journal.some(entry => isToday(new Date(entry.date))), [journal]);

  if (!user) return null;

  const displayDayData = currentBlueprint.find(d => d.day === selectedDayNum) || currentBlueprint[currentBlueprint.length - 1];
  const currentDayData = currentBlueprint.find(d => d.day === currentDayNum) || currentBlueprint[currentBlueprint.length - 1];
  const isDisplayDayCompleted = course.some(c => c.day === selectedDayNum);
  const isDisplayDayLocked = selectedDayNum > currentDayNum;
  const isCourseFullyCompleted = course.length >= currentBlueprint.length;
  const isTodayCompleted = course.some(c => c.day === currentDayNum && isToday(new Date(c.completedAt)));
  const courseProgressPercent = (course.length / currentBlueprint.length) * 100;
  const isFavorite = user.favoriteQuotes?.some(q => q.text === dailyQuote.text) || false;

  const malaGoal = user.dailyGoals?.malas || 1;
  const focusGoal = user.dailyGoals?.focusMinutes || 10;
  const breatheGoal = user.dailyGoals?.breatheSessions || 1;
  const todayMalas = todaySessions.filter(s => s.type === 'mala').length;
  const todayFocusMinutes = todaySessions
    .filter(s => s.type === 'focus' || s.type === 'meditation')
    .reduce((total, session) => total + (session.durationMinutes || 0), 0);
  const todayBreathSessions = todaySessions.filter(s => s.type === 'breathe').length;

  const rhythmItems: RhythmItem[] = [
    {
      id: 'course',
      label: isCourseFullyCompleted ? 'Practice' : 'Lesson',
      detail: isCourseFullyCompleted ? 'Foundation complete' : `Day ${currentDayNum}`,
      complete: isCourseFullyCompleted || isTodayCompleted,
      icon: BookOpen,
      action: 'course',
    },
    {
      id: 'japa',
      label: 'Japa',
      detail: `${Math.min(todayMalas, malaGoal)} / ${malaGoal} mala`,
      complete: todayMalas >= malaGoal,
      icon: PlayCircle,
      action: 'sadhana',
    },
    {
      id: 'focus',
      label: 'Focus',
      detail: `${Math.min(todayFocusMinutes, focusGoal)} / ${focusGoal} min`,
      complete: todayFocusMinutes >= focusGoal,
      icon: Target,
      action: 'sadhana',
    },
    {
      id: 'breath',
      label: 'Breath',
      detail: `${Math.min(todayBreathSessions, breatheGoal)} / ${breatheGoal}`,
      complete: todayBreathSessions >= breatheGoal,
      icon: Wind,
      action: 'sadhana',
    },
    {
      id: 'journal',
      label: 'Journal',
      detail: todayJournaled ? 'Reflection done' : 'Reflect once',
      complete: todayJournaled,
      icon: FileText,
      action: 'journal',
    },
  ];

  const completedRhythmCount = rhythmItems.filter(item => item.complete).length;
  const todayCompletionPercent = (completedRhythmCount / rhythmItems.length) * 100;
  const deityInvocation = getDeityInvocation(user.deity);
  const primaryActionLabel = getPrimaryActionLabel(isCourseFullyCompleted, isTodayCompleted, currentDayNum);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const scheduleReminder = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Hanuman Sadhana', {
        body: 'Time for your daily sadhana. Keep your streak alive!',
        icon: '/icon-192.png'
      });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('Hanuman Sadhana', {
            body: 'Reminders enabled. Time for your daily sadhana!',
            icon: '/icon-192.png'
          });
        }
      });
    }
  };

  const buildQuoteShareText = () =>
    `"${dailyQuote.text}"\n— ${dailyQuote.source}\n\nHanuman Sadhana`;

  const handleShareQuote = async () => {
    const shareText = buildQuoteShareText();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Daily Inspiration',
          text: shareText,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      showToast('Quote copied to clipboard.');
    }
  };

  const handleWhatsAppQuote = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(buildQuoteShareText())}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handlePrimaryAction = async () => {
    if (isCourseFullyCompleted) {
      onNavigate('sadhana');
      return;
    }

    openCourseSection();
  };

  const openCourseSection = () => {
    setSelectedDayNum(currentDayNum);
    setSelectedLesson(currentDayData.lessons[0] || null);
    window.setTimeout(() => {
      document.getElementById('today-course')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  const handleRhythmAction = (item: RhythmItem) => {
    if (item.action === 'course') {
      openCourseSection();
      return;
    }

    onNavigate(item.action);
  };

  return (
    <div className="p-5 space-y-6 pb-32 h-full overflow-y-auto relative">
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : -20 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-5 py-3 rounded-full shadow-lg font-medium flex items-center text-sm"
          >
            <CheckCircle2 size={18} className="mr-2" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <section className="pt-7">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-orange-400 font-semibold text-xs uppercase mb-1">{deityInvocation}</p>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              {greeting}, <span className="text-slate-300">{user.name || 'Seeker'}</span>
            </h1>
          </div>
          <button
            onClick={scheduleReminder}
            aria-label="Enable practice reminder"
            className="p-3 bg-slate-900/80 border border-slate-800 rounded-full text-slate-400 hover:text-orange-500 hover:bg-slate-800 transition-all"
          >
            <Bell size={20} />
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-900 via-slate-900 to-orange-950/40 border border-orange-500/20 rounded-[2rem] p-5 relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 w-40 h-40 bg-orange-500/10 blur-3xl rounded-full translate-x-12 -translate-y-12" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold mb-1">Today's Sadhana</p>
                <h2 className="text-2xl font-bold text-white leading-tight">
                  {isCourseFullyCompleted ? 'Daily Practice' : `Day ${currentDayNum}: ${currentDayData.title}`}
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  {isCourseFullyCompleted ? 'Keep your rhythm alive.' : currentDayData.theme}
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-orange-500/15 border border-orange-500/20 flex items-center justify-center text-orange-400">
                <Sparkles size={26} />
              </div>
            </div>

            <div className="mb-5">
              <div className="flex items-center justify-between text-xs mb-2 gap-2">
                <span className="text-slate-400 font-semibold uppercase">Daily rhythm</span>
                <span className="text-orange-300 font-bold shrink-0">
                  Today · {completedRhythmCount} / {rhythmItems.length} done
                </span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden" role="progressbar" aria-valuenow={completedRhythmCount} aria-valuemin={0} aria-valuemax={rhythmItems.length}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${todayCompletionPercent}%` }}
                  transition={{ duration: reduceMotion ? 0 : 0.7, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-orange-600 to-amber-300 rounded-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2 mb-2">
              {rhythmItems.map((item) => {
                const Icon = item.icon;
                const hint =
                  item.id === 'japa'
                    ? 'Japa: mantra repetition. 1 mala ≈ 108 counts (traditional round).'
                    : `${item.label}: tap to open Sadhana or course.`;

                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => handleRhythmAction(item)}
                    aria-label={`${item.label}. ${item.detail}. ${item.complete ? 'Done.' : 'Not done.'}`}
                    title={hint}
                    className={`min-h-20 rounded-2xl border px-2 py-3 flex flex-col items-center justify-center text-center ${
                      item.complete
                        ? 'bg-green-500/10 border-green-500/25 text-green-300'
                        : 'bg-slate-950/50 border-slate-800 text-slate-400'
                    } active:scale-95 transition-transform`}
                  >
                    <Icon size={17} className="mb-2" aria-hidden />
                    <span className="text-[10px] leading-tight font-bold text-slate-100">{item.label}</span>
                    <span className="text-[9px] leading-tight mt-1">{item.detail}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-slate-500 text-center leading-snug mb-2 px-1">
              <span className="text-slate-400">Tip:</span> 1 mala is traditionally 108 japas on a bead mala—your daily goal counts completed rounds.
            </p>

            <button
              type="button"
              onClick={handlePrimaryAction}
              className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-2xl py-4 font-bold flex items-center justify-center shadow-[0_0_28px_rgba(249,115,22,0.28)] border border-orange-300/20"
              aria-label={primaryActionLabel}
            >
              <PlayCircle size={22} className="mr-2" aria-hidden />
              {primaryActionLabel}
            </button>
          </div>
        </motion.div>
      </section>

      <section aria-labelledby="home-stats-heading" className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h2 id="home-stats-heading" className="sr-only">
            Practice stats
          </h2>
          <button
            type="button"
            onClick={() => setShowGamificationHelp(true)}
            className="ml-auto flex items-center gap-1.5 text-xs text-slate-400 hover:text-orange-400 transition-colors px-2 py-1 rounded-lg border border-transparent hover:border-slate-700"
            aria-expanded={showGamificationHelp}
          >
            <HelpCircle size={14} aria-hidden />
            How scoring works
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <MomentumStat
            icon={Flame}
            label="Streak"
            value={`${user.streak}`}
            tone="orange"
            sub="days with XP"
            onClick={() => onNavigate('progress')}
          />
          <MomentumStat
            icon={Award}
            label="Level"
            value={level}
            sub={LEVEL_HINTS[level] ?? ''}
            tone="blue"
            onClick={() => onNavigate('progress')}
          />
          <MomentumStat
            icon={Target}
            label="XP"
            value={`${Math.round(progressPercentage)}%`}
            sub={level === 'Mahaveer' ? `${user.xp} XP` : `${user.xp}→${nextLevelXP}`}
            tone="green"
            onClick={() => onNavigate('progress')}
          />
        </div>
        <p className="text-[10px] text-slate-600 text-center px-2">
          Journal & practice stay on this device only—nothing is uploaded.
        </p>
      </section>

      <motion.section
        className="bg-orange-900/20 border border-orange-500/25 rounded-3xl p-5 relative overflow-hidden"
        initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reduceMotion ? 0 : 0.1 }}
      >
        <div className="absolute top-0 right-0 w-28 h-28 bg-orange-500/15 rounded-full blur-3xl -mr-10 -mt-10" />
        <p className="text-xs text-orange-400 uppercase font-bold mb-2 relative z-10">Your Sankalp</p>
        {user.sankalp?.trim() ? (
          <p className="text-base font-medium text-slate-100 italic relative z-10 leading-relaxed">&ldquo;{user.sankalp.trim()}&rdquo;</p>
        ) : (
          <p className="text-sm text-slate-500 relative z-10 leading-relaxed border border-dashed border-orange-500/20 rounded-xl px-4 py-3">
            Add your sankalp from Profile—a short intention you hold for this path.
          </p>
        )}
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 relative overflow-hidden"
      >
        <Quote className="absolute top-4 right-4 text-slate-800/60 rotate-180" size={44} />
        <p className="text-slate-300 text-sm leading-relaxed italic relative z-10 mb-4">
          "{dailyQuote.text}"
        </p>
        <div className="flex items-center justify-between relative z-10">
          <p className="text-xs text-orange-500/80 font-semibold uppercase">
            {dailyQuote.source}
          </p>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => toggleFavoriteQuote(dailyQuote)}
              aria-label={isFavorite ? 'Remove quote from favorites' : 'Save quote to favorites'}
              className={`p-2 rounded-full transition-colors ${isFavorite ? 'bg-orange-500/20 text-orange-500' : 'bg-slate-800/70 text-slate-400 hover:text-white'}`}
            >
              <Heart size={16} className={isFavorite ? 'fill-orange-500' : ''} aria-hidden />
            </button>
            <button
              type="button"
              onClick={handleShareQuote}
              aria-label="Share quote using device share or copy"
              className="p-2 bg-slate-800/70 rounded-full text-slate-400 hover:text-white transition-colors"
            >
              <Share2 size={16} aria-hidden />
            </button>
            <button
              type="button"
              onClick={handleWhatsAppQuote}
              aria-label="Share quote on WhatsApp"
              className="p-2 rounded-full bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 transition-colors border border-emerald-500/20"
              title="WhatsApp"
            >
              <MessageCircle size={16} aria-hidden />
            </button>
          </div>
        </div>
      </motion.section>

      <section id="today-course">
        {isCourseFullyCompleted ? (
          <CompletionCard userDeity={user.deity} />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-5 relative overflow-hidden"
          >
            <div className="mb-5 relative z-10">
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs text-slate-400 uppercase font-bold">Course Progress</span>
                <span className="text-xs text-orange-500 font-bold">{course.length} / {currentBlueprint.length} days</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${courseProgressPercent}%` }}
                  transition={{ duration: reduceMotion ? 0 : 1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full"
                />
              </div>
            </div>

            <div className="flex space-x-2 overflow-x-auto pb-4 mb-4 hide-scrollbar relative z-10 snap-x snap-mandatory">
              {currentBlueprint.map((day) => {
                const isCompleted = course.some((c) => c.day === day.day);
                const isCurrent = day.day === currentDayNum;
                const isLocked = day.day > currentDayNum;
                const isSelected = day.day === selectedDayNum;

                return (
                  <button
                    key={day.day}
                    type="button"
                    onClick={() => {
                      if (isLocked) {
                        showToast(`Finish Day ${currentDayNum} before unlocking Day ${day.day}.`);
                        return;
                      }
                      setSelectedDayNum(day.day);
                    }}
                    aria-label={
                      isLocked
                        ? `Day ${day.day} locked`
                        : `Day ${day.day}${isCompleted ? ', completed' : isCurrent ? ', current' : ''}`
                    }
                    aria-current={isSelected ? 'true' : undefined}
                    className={`snap-start flex-shrink-0 flex flex-col items-center justify-center w-16 min-h-[5.25rem] rounded-2xl border transition-all ${
                      isSelected
                        ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                        : isLocked
                          ? 'bg-slate-900/50 border-slate-800 text-slate-600 opacity-80 cursor-not-allowed'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span className="text-xs font-bold uppercase mb-1">Day</span>
                    <span className="text-xl font-bold">{day.day}</span>
                    {isLocked ? (
                      <Lock size={12} className="text-slate-600 mt-1" aria-hidden />
                    ) : isCompleted ? (
                      <CheckCircle2 size={12} className="text-green-500 mt-1" aria-hidden />
                    ) : isCurrent ? (
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1" aria-hidden />
                    ) : null}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center mb-2 relative z-10">
              <div className="bg-orange-500/20 text-orange-500 px-3 py-1 rounded-full text-xs font-bold uppercase mr-3">
                Day {displayDayData.day}
              </div>
              <h2 className="text-xl font-bold">{displayDayData.title}</h2>
            </div>
            <p className="text-slate-400 text-sm mb-5 relative z-10">{displayDayData.theme}</p>

            <div className="space-y-3 mb-6 relative z-10">
              {displayDayData.lessons.map((lesson, idx) => {
                const isExpanded = selectedLesson?.id === lesson.id;

                return (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + (idx * 0.08), duration: 0.4 }}
                    key={lesson.id}
                    className={`bg-slate-900/80 border rounded-2xl overflow-hidden transition-all ${isExpanded ? 'border-orange-500/50 shadow-[0_0_24px_rgba(249,115,22,0.12)]' : 'border-slate-800 hover:border-slate-700'}`}
                  >
                    <button
                      onClick={() => setSelectedLesson(isExpanded ? null : lesson)}
                      className={`w-full p-4 flex items-center justify-between text-left ${isExpanded ? 'bg-orange-500/5' : 'hover:bg-slate-800/50'}`}
                    >
                      <div className="flex items-center flex-1 min-w-0">
                        <div className={`w-11 h-11 rounded-full flex items-center justify-center mr-3 shrink-0 ${isExpanded ? 'bg-orange-500/20' : 'bg-slate-800'}`}>
                          {lesson.format === 'practice' ? (
                            <PlayCircle size={20} className={isExpanded ? 'text-orange-400' : 'text-slate-400'} />
                          ) : (
                            <FileText size={20} className={isExpanded ? 'text-orange-400' : 'text-slate-400'} />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h3 className={`font-semibold text-base transition-colors ${isExpanded ? 'text-orange-400' : 'text-slate-200'}`}>
                            {lesson.title}
                          </h3>
                          <p className="text-xs text-slate-400 mt-1">
                            {lesson.format === 'practice' ? 'Guided Practice' : 'Reading'} - {lesson.duration}
                          </p>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: isExpanded ? 90 : 0 }}
                        transition={{ duration: 0.25 }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${isExpanded ? 'bg-orange-500/10' : 'bg-slate-800/50'}`}
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
                          transition={{ duration: 0.35, ease: 'easeInOut' }}
                          className="border-t border-orange-500/20"
                        >
                          <div className="p-5 bg-gradient-to-b from-orange-500/5 to-transparent">
                            <div className="bg-slate-950/50 rounded-xl p-4 mb-5 border border-slate-800/50">
                              <p className="text-orange-200/80 text-sm italic leading-relaxed">
                                {lesson.description}
                              </p>
                            </div>
                            <p className="text-slate-300 leading-loose whitespace-pre-wrap text-sm font-medium">
                              {lesson.content}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            {!isDisplayDayCompleted && !isDisplayDayLocked ? (
              <button
                onClick={() => completeCourseDay(displayDayData.day)}
                className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-2xl py-4 font-bold flex items-center justify-center relative z-10 shadow-[0_0_28px_rgba(249,115,22,0.24)]"
              >
                <CheckCircle2 className="mr-2" size={22} />
                Complete Day {displayDayData.day}
              </button>
            ) : isDisplayDayCompleted ? (
              <div className="w-full bg-green-500/10 border border-green-500/30 text-green-400 rounded-2xl py-4 font-bold flex items-center justify-center relative z-10">
                <CheckCircle2 className="mr-2" size={22} />
                Day {displayDayData.day} Completed
              </div>
            ) : (
              <div className="w-full bg-slate-800/50 border border-slate-700/50 text-slate-500 rounded-2xl py-4 font-bold flex items-center justify-center relative z-10">
                Complete previous days to unlock
              </div>
            )}
          </motion.div>
        )}
      </section>

      <AnimatePresence>
        {showGamificationHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="gamification-help-title"
            onClick={() => setShowGamificationHelp(false)}
          >
            <motion.div
              initial={{ y: reduceMotion ? 0 : 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: reduceMotion ? 0 : 16, opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-4 gap-3">
                <h3 id="gamification-help-title" className="text-lg font-bold text-white pr-2">
                  How scoring works
                </h3>
                <button
                  type="button"
                  onClick={() => setShowGamificationHelp(false)}
                  className="p-2 rounded-full text-slate-400 hover:bg-slate-800 hover:text-white shrink-0"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>
              <ul className="space-y-4 text-sm text-slate-300 leading-relaxed">
                <li>
                  <span className="text-orange-400 font-semibold">Streak</span> — grows on days you earn XP (lessons,
                  japa, journal, etc.). Miss a day and it can reset—check Progress for detail.
                </li>
                <li>
                  <span className="text-blue-400 font-semibold">Level</span> — Balak → Sevak → Veer → Bhakt → Mahaveer
                  as your total XP rises. The ring on Home shows progress within your current stage.
                </li>
                <li>
                  <span className="text-green-400 font-semibold">XP</span> — you earn it from practice (e.g. finishing
                  course days, challenges). The percentage is progress toward the next level threshold ({user.xp} total XP
                  now).
                </li>
              </ul>
              <button
                type="button"
                onClick={() => {
                  setShowGamificationHelp(false);
                  onNavigate('progress');
                }}
                className="mt-6 w-full py-3 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-sm"
              >
                Open Progress
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MomentumStat({
  icon: Icon,
  label,
  value,
  sub,
  tone,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  tone: 'orange' | 'blue' | 'green';
  onClick: () => void;
}) {
  const toneClass = {
    orange: 'text-orange-400 bg-orange-500/10',
    blue: 'text-blue-400 bg-blue-500/10',
    green: 'text-green-400 bg-green-500/10',
  }[tone];

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${label}: ${value}${sub ? `. ${sub}` : ''}. Opens Progress.`}
      className="bg-slate-900/70 border border-slate-800 rounded-2xl p-3 text-center active:scale-95 transition-transform"
    >
      <div className={`w-9 h-9 mx-auto rounded-full flex items-center justify-center mb-1.5 ${toneClass}`}>
        <Icon size={18} aria-hidden />
      </div>
      <div className="text-lg font-bold text-white truncate">{value}</div>
      <div className="text-[10px] text-slate-500 uppercase font-bold mt-0.5">{label}</div>
      {sub ? <div className="text-[9px] text-slate-600 mt-1 leading-tight px-0.5">{sub}</div> : null}
    </button>
  );
}

function CompletionCard({ userDeity }: { userDeity?: 'hanuman' | 'shiva' | 'krishna' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-orange-900/40 to-slate-950 border border-orange-500/30 rounded-3xl p-6 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-44 h-44 bg-orange-500/15 rounded-full blur-3xl -mr-10 -mt-10" />
      <div className="flex items-center justify-center mb-5 relative z-10">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.45)]">
          <PartyPopper size={32} className="text-white" />
        </div>
      </div>
      <div className="text-center relative z-10 mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Aarambh Sadhana Complete</h2>
        <p className="text-slate-300 text-sm leading-relaxed">
          Your foundation is complete. Keep a lighter daily rhythm so the practice becomes part of your life.
        </p>
      </div>
      <div className="space-y-3 relative z-10">
        <MaintenancePractice
          icon={PlayCircle}
          title={userDeity === 'shiva' ? '108 Shiva Japa' : userDeity === 'krishna' ? '108 Krishna Japa' : '108 Ram Naam Japa'}
          detail="Daily chanting practice"
          tone="orange"
        />
        <MaintenancePractice icon={Wind} title="5-Min Silent Focus" detail="Center your mind" tone="blue" />
        <MaintenancePractice
          icon={BookOpen}
          title={userDeity === 'shiva' ? 'Shiva Tandava Stotram' : userDeity === 'krishna' ? 'Achyutashtakam' : 'Read 1 Chapter'}
          detail={userDeity === 'shiva' ? 'Chant the stotram' : userDeity === 'krishna' ? 'Bhagavad Gita' : 'Ramayana or Gita'}
          tone="purple"
        />
      </div>
    </motion.div>
  );
}

function MaintenancePractice({
  icon: Icon,
  title,
  detail,
  tone,
}: {
  icon: React.ElementType;
  title: string;
  detail: string;
  tone: 'orange' | 'blue' | 'purple';
}) {
  const toneClass = {
    orange: 'bg-orange-500/10 text-orange-500',
    blue: 'bg-blue-500/10 text-blue-500',
    purple: 'bg-purple-500/10 text-purple-500',
  }[tone];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${toneClass}`}>
        <Icon size={20} />
      </div>
      <div>
        <h4 className="font-semibold text-slate-200">{title}</h4>
        <p className="text-xs text-slate-400">{detail}</p>
      </div>
    </div>
  );
}

function getDeityInvocation(deity?: 'hanuman' | 'shiva' | 'krishna') {
  if (deity === 'shiva') return 'Om Namah Shivaya';
  if (deity === 'krishna') return 'Hare Krishna';
  return 'Jai Shri Ram';
}

function getPrimaryActionLabel(isCourseFullyCompleted: boolean, isTodayCompleted: boolean, currentDayNum: number) {
  if (isCourseFullyCompleted) return 'Open Japa Practice';
  if (isTodayCompleted) return "Review Today's Lesson";
  return `Begin Day ${currentDayNum}`;
}
