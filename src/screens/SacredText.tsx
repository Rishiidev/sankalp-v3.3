import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Info, Eye, EyeOff, PlayCircle, X } from 'lucide-react';
import { useStore } from '../lib/store';
import { getSacredText } from '../data/sacredTexts';

interface Props {
  onBack: () => void;
}

export function SacredText({ onBack }: Props) {
  const [activeVerse, setActiveVerse] = useState<number | null>(null);
  const [showMeaningMap, setShowMeaningMap] = useState<Record<number, boolean>>({});
  const [showAudio, setShowAudio] = useState(false);
  const { user } = useStore();
  const content = getSacredText(user?.deity);

  // Determine dynamic colors based on themeColor from content
  let titleColorClass = "text-orange-500";
  let activeBgClass = "bg-orange-500/10 border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.15)]";
  let textColorClass = "text-orange-100";
  let labelColorClass = "text-orange-500";
  let tagBgClass = "bg-orange-500/20";
  let tagTextClass = "text-orange-400";
  let buttonBgClass = "bg-orange-600 hover:bg-orange-500";

  if (content.themeColor === 'sky') {
    titleColorClass = "text-sky-500";
    activeBgClass = "bg-sky-500/10 border-sky-500/50 shadow-[0_0_20px_rgba(14,165,233,0.15)]";
    textColorClass = "text-sky-100";
    labelColorClass = "text-sky-500";
    tagBgClass = "bg-sky-500/20";
    tagTextClass = "text-sky-400";
    buttonBgClass = "bg-sky-600 hover:bg-sky-500";
  } else if (content.themeColor === 'purple') {
    titleColorClass = "text-purple-500";
    activeBgClass = "bg-purple-500/10 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.15)]";
    textColorClass = "text-purple-100";
    labelColorClass = "text-purple-500";
    tagBgClass = "bg-purple-500/20";
    tagTextClass = "text-purple-400";
    buttonBgClass = "bg-purple-600 hover:bg-purple-500";
  }

  const toggleMeaning = (e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    setShowMeaningMap(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const isShivaTandava = content.title === "Shiva Tandava Stotram";

  return (
    <div className="p-6 h-full flex flex-col pb-32 overflow-y-auto bg-slate-950">
      <header className="pt-8 mb-6 flex items-start justify-between">
        <div className="flex items-center">
          <button 
            onClick={onBack}
            className="p-2 mr-4 bg-slate-900 rounded-full text-slate-400 hover:text-white transition-colors mt-1"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className={`text-3xl font-bold tracking-tight ${titleColorClass}`}>{content.title}</h1>
            <p className="text-slate-400 mt-1 text-sm">{content.subtitle}</p>
          </div>
        </div>
        
        {content.youtubeId && !showAudio && (
          <button
            onClick={() => setShowAudio(true)}
            className={`flex items-center px-4 py-2 mt-1 rounded-xl text-white font-medium text-sm transition-colors ${buttonBgClass}`}
          >
            <PlayCircle size={18} className="mr-2" />
            Listen
          </button>
        )}
      </header>

      <AnimatePresence>
        {showAudio && content.youtubeId && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="overflow-hidden bg-slate-900 border border-slate-800 rounded-2xl relative"
          >
            <button 
              onClick={() => setShowAudio(false)}
              className="absolute -top-1 -right-1 z-10 p-2 bg-slate-800 text-slate-400 hover:text-white rounded-bl-xl rounded-tr-xl border-l border-b border-slate-700 transition-colors"
            >
              <X size={16} />
            </button>
            <div className="aspect-video w-full">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${content.youtubeId}?autoplay=1`}
                title="Chant Audio Player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6 max-w-2xl mx-auto w-full">
        {content.verses.map((verse, idx) => {
          const isExpanded = activeVerse === idx;
          const showMeaning = showMeaningMap[idx] !== false;
          
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setActiveVerse(isExpanded ? null : idx)}
              className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 border ${
                isExpanded 
                  ? activeBgClass 
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col space-y-4">
                 <div className="flex items-start justify-between">
                   <div className="flex items-start flex-1">
                     {verse.type === 'doha' ? (
                       <span className={`text-xs font-bold mr-4 mt-1.5 opacity-50 ${isExpanded ? labelColorClass : 'text-slate-500'}`}>
                         DH
                       </span>
                     ) : (
                       <span className={`text-xs font-bold mr-4 mt-1.5 opacity-50 ${isExpanded ? labelColorClass : 'text-slate-500'}`}>
                         {verse.num?.toString().padStart(2, '0')}
                       </span>
                     )}
                     <div className="flex-1">
                       <p className={`text-base leading-relaxed whitespace-pre-wrap font-medium transition-colors ${isExpanded ? textColorClass : 'text-slate-300'}`}>
                         {verse.text}
                       </p>
                     </div>
                   </div>
                   {isExpanded && verse.meaning && (
                     <button
                       onClick={(e) => toggleMeaning(e, idx)}
                       className={`ml-4 p-2 rounded-full transition-colors ${showMeaning ? tagBgClass + ' ' + tagTextClass : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                       title={showMeaning ? "Hide Meaning" : "Show Meaning"}
                     >
                       {showMeaning ? <EyeOff size={16} /> : <Eye size={16} />}
                     </button>
                   )}
                 </div>
                 
                 {isExpanded && (verse.sanskrit || (verse.meaning && showMeaning)) && (
                   <motion.div 
                     initial={{ opacity: 0, height: 0 }}
                     animate={{ opacity: 1, height: 'auto' }}
                     className="pt-4 flex flex-col space-y-4 border-t border-slate-800/50"
                   >
                     {verse.sanskrit && (
                       <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800/80">
                         <h4 className={`text-xs font-bold tracking-widest uppercase mb-2 ${labelColorClass}`}>Sanskrit</h4>
                         <p className={`text-base leading-relaxed whitespace-pre-wrap ${textColorClass}`}>
                           {verse.sanskrit}
                         </p>
                       </div>
                     )}
                     {verse.meaning && showMeaning && (
                       <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800/80">
                         <h4 className={`text-xs font-bold tracking-widest uppercase mb-2 ${labelColorClass}`}>Meaning</h4>
                         <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                           {verse.meaning}
                         </p>
                       </div>
                     )}
                   </motion.div>
                 )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
