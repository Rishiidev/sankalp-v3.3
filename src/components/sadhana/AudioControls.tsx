import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../../lib/store';
import { formatTime, DEFAULT_AUDIO_TRACKS } from './constants';
import { Upload, Music, Volume2, VolumeX, Repeat, Play, Pause, X } from 'lucide-react';
import { validateAudioFile, normalizeYoutubeUrl } from '../../lib/validation';
import ReactPlayer from 'react-player';

const Player: any = ReactPlayer;

export function AudioLibrary({
  showAudioLibrary,
  setShowAudioLibrary,
  selectedTrack,
  setSelectedTrack,
  setShowVideo,
}: {
  showAudioLibrary: boolean;
  setShowAudioLibrary: (show: boolean) => void;
  selectedTrack: any;
  setSelectedTrack: (track: any) => void;
  setShowVideo: (show: boolean) => void;
}) {
  const { customTracks, addCustomTrack, user, addYoutubeTrack } = useStore();
  
  const [isAddingYoutube, setIsAddingYoutube] = useState(false);
  const [newYoutubeName, setNewYoutubeName] = useState('');
  const [newYoutubeUrl, setNewYoutubeUrl] = useState('');
  const [youtubeUrlError, setYoutubeUrlError] = useState('');
  const [audioUploadError, setAudioUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validation = validateAudioFile(file);
      if (validation.valid === false) {
        setAudioUploadError(validation.error);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      setAudioUploadError('');
      await addCustomTrack(file.name, file);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
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
                    type="text" placeholder="Track Name" value={newYoutubeName} onChange={(e) => setNewYoutubeName(e.target.value)}
                    className="w-full bg-slate-900 text-white rounded-lg px-3 py-2 border border-slate-700 focus:border-orange-500 focus:outline-none text-sm"
                  />
                  <input
                    type="url" placeholder="YouTube URL" value={newYoutubeUrl} onChange={(e) => { setNewYoutubeUrl(e.target.value); setYoutubeUrlError(''); }}
                    className="w-full bg-slate-900 text-white rounded-lg px-3 py-2 border border-slate-700 focus:border-orange-500 focus:outline-none text-sm"
                  />
                  {youtubeUrlError && <p className="text-xs text-red-300">{youtubeUrlError}</p>}
                  <div className="flex space-x-2">
                    <button
                      onClick={async () => {
                        const normalizedUrl = normalizeYoutubeUrl(newYoutubeUrl);
                        if (!normalizedUrl) { setYoutubeUrlError('Enter a valid YouTube video, Shorts, Live, or youtu.be URL.'); return; }
                        if (newYoutubeName.trim()) {
                          const newlyAdded = await addYoutubeTrack(newYoutubeName.trim(), normalizedUrl);
                          if (newlyAdded) { setSelectedTrack(newlyAdded); setShowVideo(true); }
                          setIsAddingYoutube(false); setNewYoutubeName(''); setNewYoutubeUrl(''); setYoutubeUrlError('');
                        }
                      }}
                      className="flex-1 bg-orange-600 hover:bg-orange-500 text-white rounded-lg py-2 text-sm font-medium transition-colors"
                    >
                      Add URL
                    </button>
                    <button
                      onClick={() => { setIsAddingYoutube(false); setNewYoutubeName(''); setNewYoutubeUrl(''); setYoutubeUrlError(''); }}
                      className="px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg py-2 text-sm font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => fileInputRef.current?.click()} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors flex items-center justify-center">
                      <Upload size={16} className="mr-2" /> Upload Audio
                    </button>
                    <button onClick={() => setIsAddingYoutube(true)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors flex items-center justify-center">
                      <Music size={16} className="mr-2" /> YouTube Link
                    </button>
                    <input type="file" accept="audio/*" ref={fileInputRef} onChange={handleAudioUpload} className="hidden" />
                  </div>
                  {audioUploadError && <p className="text-xs text-red-300">{audioUploadError}</p>}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function AudioPlayer({
  selectedTrack,
  setSelectedTrack,
  showVideo,
  setShowVideo,
  isPlaying,
  setIsPlaying,
  isLooping,
  setIsLooping,
  volume,
  setVolume,
  audioProgress,
  setAudioProgress,
  audioDuration,
  setAudioDuration,
  showAudioControls,
  setShowAudioControls,
  playerRef,
}: {
  selectedTrack: any;
  setSelectedTrack: (track: any) => void;
  showVideo: boolean;
  setShowVideo: (show: boolean) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  isLooping: boolean;
  setIsLooping: (looping: boolean) => void;
  volume: number;
  setVolume: (v: number) => void;
  audioProgress: number;
  setAudioProgress: (p: number) => void;
  audioDuration: number;
  setAudioDuration: (d: number) => void;
  showAudioControls: boolean;
  setShowAudioControls: (show: boolean) => void;
  playerRef: any;
}) {
  const { customTracks, user } = useStore();
  const allTracks = [...DEFAULT_AUDIO_TRACKS, ...customTracks, ...(user?.youtubeTracks || [])];
  const isYoutubeTrack = selectedTrack?.url?.includes('youtube.com') || selectedTrack?.url?.includes('youtu.be');

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      playerRef.current.seekTo(time, 'seconds');
    }
    setAudioProgress(time);
  };

  return (
    <>
      <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col space-y-4 mt-4">
        <div className="flex items-center justify-between">
          <button onClick={() => setShowAudioControls(!showAudioControls)} className="flex items-center text-slate-300 hover:text-white transition-colors">
            <Volume2 className="mr-2 text-orange-500" size={18} />
            <span className="text-sm font-medium">Audio Controls</span>
          </button>
          <div className="flex space-x-2">
            <button onClick={() => setIsLooping(!isLooping)} className={`p-2 rounded-full ${isLooping ? 'bg-orange-500/20 text-orange-500' : 'bg-slate-800 text-slate-400'}`}>
              <Repeat size={18} />
            </button>
            <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 bg-orange-600 rounded-full text-white">
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showAudioControls && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden flex flex-col space-y-4 pt-2 border-t border-slate-800"
            >
              <select 
                value={selectedTrack.id}
                onChange={(e) => { const track = allTracks.find(t => t.id === e.target.value); if (track) setSelectedTrack(track); }}
                className="bg-slate-800 text-sm text-slate-200 rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-orange-500 w-full"
              >
                <optgroup label="Default">
                  {DEFAULT_AUDIO_TRACKS.map(track => (<option key={track.id} value={track.id}>{track.name}</option>))}
                </optgroup>
                {customTracks.length > 0 && (
                  <optgroup label="My Uploads">
                    {customTracks.map(track => (<option key={track.id} value={track.id}>{track.name}</option>))}
                  </optgroup>
                )}
                {(user?.youtubeTracks?.length ?? 0) > 0 && (
                  <optgroup label="YouTube Links">
                    {user!.youtubeTracks!.map(track => (<option key={track.id} value={track.id}>{track.name}</option>))}
                  </optgroup>
                )}
              </select>

              <div className="flex items-center space-x-3 text-xs text-slate-400">
                <span className="w-8 text-right">{formatTime(audioProgress)}</span>
                <input 
                  type="range" min="0" max={audioDuration || 100} step="0.1"
                  value={audioProgress} onChange={handleSeek}
                  className="flex-1 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <span className="w-8">{formatTime(audioDuration || 0)}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <button onClick={() => setVolume(Math.max(0, volume - 0.1))} className="text-slate-400"><VolumeX size={16} /></button>
                <input 
                  type="range" min="0" max="1" step="0.05" 
                  value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="flex-1 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <button onClick={() => setVolume(Math.min(1, volume + 0.1))} className="text-slate-400"><Volume2 size={16} /></button>
                {isYoutubeTrack && (
                  <button onClick={() => setShowVideo(!showVideo)} className={`ml-2 px-3 py-1 text-xs font-medium rounded-lg transition-colors ${showVideo ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
                    {showVideo ? 'Hide Video' : 'Watch'}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

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
    </>
  );
}
