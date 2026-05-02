import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useStore } from '../../lib/store';
import { formatTime, ICON_LIBRARY } from './constants';
import { Plus, X, Edit2, Trash2 } from 'lucide-react';
import { SuccessRipple } from './SuccessRipple';
import { Book } from 'lucide-react';

export function CustomSessionSelect({ onStart }: { onStart: (typeId: string, durationMinutes: number) => void }) {
  const { customSessionTypes, addCustomSessionType, editCustomSessionType, removeCustomSessionType } = useStore();
  
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

  const handleCreateCustomType = async () => {
    if (newCustomName.trim()) {
      await addCustomSessionType({ name: newCustomName, icon: newCustomIcon, color: newCustomColor });
      setIsCreatingCustom(false);
      setNewCustomName(''); setNewCustomIcon('Book'); setNewCustomColor('#f97316');
    }
  };

  const handleEditCustomType = async () => {
    if (editingCustomTypeId && editCustomName.trim()) {
      await editCustomSessionType(editingCustomTypeId, { name: editCustomName, icon: editCustomIcon, color: editCustomColor });
      setEditingCustomTypeId(null);
    }
  };

  return (
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
              type="text" placeholder="Session Name (e.g., Reading)" 
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
            <button onClick={() => setIsCreatingCustom(true)} className="text-xs text-orange-500 hover:text-orange-400 flex items-center">
              <Plus size={14} className="mr-1" /> New
            </button>
          </div>
          {customSessionTypes.length > 0 ? (
            <div className="space-y-2 mb-4">
              {customSessionTypes.map(type => {
                const IconComponent = ICON_LIBRARY.find(i => i.name === type.icon)?.component || Book;
                return (
                  <div key={type.id} className={`flex items-center justify-between bg-slate-800 rounded-xl p-3 border ${selectedCustomTypeId === type.id ? 'border-orange-500' : 'border-transparent'}`}>
                    <button onClick={() => setSelectedCustomTypeId(type.id)} className="flex-1 flex items-center text-left text-white">
                      <IconComponent size={20} className="mr-3" style={{ color: type.color || '#f97316' }} />
                      <span className="font-medium">{type.name}</span>
                    </button>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => { setEditingCustomTypeId(type.id); setEditCustomName(type.name); setEditCustomIcon(type.icon || 'Book'); setEditCustomColor(type.color || '#f97316'); }}
                        className="p-2 text-slate-400 hover:text-white transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => { removeCustomSessionType(type.id); if (selectedCustomTypeId === type.id) setSelectedCustomTypeId(''); }}
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
                  type="number" min="1"
                  value={customSessionDuration}
                  onChange={(e) => setCustomSessionDuration(parseInt(e.target.value) || 15)}
                  className="w-20 bg-slate-900 text-white rounded-lg px-3 py-1 border border-slate-700 focus:border-orange-500 focus:outline-none text-center"
                />
              </div>
              <button
                onClick={() => onStart(selectedCustomTypeId, customSessionDuration)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white rounded-xl py-4 font-bold text-lg transition-colors"
              >
                Start Custom Session
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function CustomSessionActiveView({
  focusTime,
  customSessionDuration,
  selectedCustomTypeId,
  isTimerRunning,
  setIsTimerRunning,
  onReturn,
}: {
  focusTime: number;
  customSessionDuration: number;
  selectedCustomTypeId: string;
  isTimerRunning: boolean;
  setIsTimerRunning: (v: boolean) => void;
  onReturn: () => void;
}) {
  const { customSessionTypes } = useStore();
  const customType = customSessionTypes.find(t => t.id === selectedCustomTypeId);

  return (
    <>
      <div className="mb-8 text-center px-4">
        <p className="text-sm text-orange-500 font-medium mb-1 uppercase tracking-wider">Custom Session</p>
        <h2 className="text-2xl font-bold text-white">{customType?.name || 'Session'}</h2>
      </div>
      
      <div className="relative w-64 h-64 flex items-center justify-center mb-12">
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle cx="128" cy="128" r="120" className="stroke-slate-800" strokeWidth="8" fill="none" />
          <motion.circle
            cx="128" cy="128" r="120"
            className="stroke-orange-500" strokeWidth="8" fill="none" strokeLinecap="round"
            initial={{ strokeDasharray: "0 1000" }}
            animate={{ strokeDasharray: `${((customSessionDuration * 60 - focusTime) / (customSessionDuration * 60)) * 754} 1000` }}
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
          <h3 className="text-2xl font-bold mb-2">Session Complete</h3>
          <p className="text-slate-400 mb-6">+{customSessionDuration * 10} XP earned</p>
          <button onClick={onReturn} className="bg-slate-800 hover:bg-slate-700 text-white rounded-xl px-8 py-3 font-medium transition-colors">Return</button>
        </motion.div>
      ) : (
        <div className="flex space-x-4">
          <button onClick={() => setIsTimerRunning(!isTimerRunning)} className="bg-orange-600 hover:bg-orange-500 text-white rounded-xl px-8 py-3 font-medium transition-colors">
            {isTimerRunning ? 'Pause' : 'Resume'}
          </button>
          <button onClick={() => { setIsTimerRunning(false); onReturn(); }} className="bg-slate-800 hover:bg-slate-700 text-white rounded-xl px-8 py-3 font-medium transition-colors">
            End
          </button>
        </div>
      )}
    </>
  );
}
