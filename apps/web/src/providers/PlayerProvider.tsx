'use client';

import { createContext, useContext, useRef, useState, useEffect, ReactNode, useCallback } from 'react';

export interface Track {
  id: string;
  title: string;
  audioUrl: string;
  coverImage: string;
  duration: number;
  artist: { id: string; name: string; slug: string; verified: boolean };
  album?: { id: string; title: string; coverImage: string };
  _count?: { likes: number };
}

interface PlayerContextType {
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  progress: number;
  duration: number;
  currentTime: number;
  repeatMode: 'off' | 'one' | 'all';
  repeat: 'off' | 'one' | 'all';
  shuffle: boolean;
  isFullscreen: boolean;
  isMiniPlayer: boolean;
  isLiked: boolean;
  play: (track?: Track) => void;
  pause: () => void;
  stop: () => void;
  next: () => void;
  playNext: () => void;
  previous: () => void;
  playPrevious: () => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  toggleLike: () => void;
  setQueue: (tracks: Track[], startIndex?: number) => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  toggleFullscreen: () => void;
  enterFullscreen: () => void;
  exitFullscreen: () => void;
  toggleMiniPlayer: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [queue, setQueueState] = useState<Track[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [repeatMode, setRepeatMode] = useState<'off' | 'one' | 'all'>('off');
  const [shuffle, setShuffle] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMiniPlayer, setIsMiniPlayer] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const queueIndexRef = useRef(0);
  const repeatRef = useRef(repeatMode);
  const shuffleRef = useRef(shuffle);
  const queueRef = useRef(queue);
  const currentTrackRef = useRef(currentTrack);

  useEffect(() => { repeatRef.current = repeatMode; }, [repeatMode]);
  useEffect(() => { shuffleRef.current = shuffle; }, [shuffle]);
  useEffect(() => { queueRef.current = queue; }, [queue]);
  useEffect(() => { currentTrackRef.current = currentTrack; }, [currentTrack]);

  const playAt = useCallback((track: Track) => {
    setCurrentTrack(track);
    if (audioRef.current) {
      audioRef.current.src = track.audioUrl;
      audioRef.current.load();
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, []);

  const next = useCallback(() => {
    const q = queueRef.current;
    if (q.length === 0) return;
    let nextIndex: number;
    if (shuffleRef.current) {
      nextIndex = Math.floor(Math.random() * q.length);
    } else if (repeatRef.current === 'all') {
      nextIndex = (queueIndexRef.current + 1) % q.length;
    } else if (queueIndexRef.current + 1 < q.length) {
      nextIndex = queueIndexRef.current + 1;
    } else {
      if (repeatRef.current === 'one' && audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
        return;
      }
      return;
    }
    queueIndexRef.current = nextIndex;
    playAt(q[nextIndex]);
  }, [playAt]);

  const playPrev = useCallback(() => {
    const q = queueRef.current;
    if (q.length === 0) return;
    if (audioRef.current && audioRef.current.currentTime > 3) { audioRef.current.currentTime = 0; return; }
    const prevIndex = queueIndexRef.current > 0 ? queueIndexRef.current - 1 : q.length - 1;
    queueIndexRef.current = prevIndex;
    playAt(q[prevIndex]);
  }, [playAt]);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const onTimeUpdate = () => {
      if (!audio.duration) return;
      setProgress((audio.currentTime / audio.duration) * 100);
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };
    const onEnded = () => {
      if (repeatRef.current === 'one') {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        next();
      }
    };
    const onLoadedMetadata = () => { setDuration(audio.duration || 0); };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.pause();
      audio.src = '';
    };
  }, [next]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = isMuted ? 0 : volume / 100;
  }, [volume, isMuted]);

  const play = useCallback((track?: Track) => {
    if (track) {
      playAt(track);
    } else if (audioRef.current && currentTrackRef.current) {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [playAt]);

  const pause = useCallback(() => { if (audioRef.current) { audioRef.current.pause(); setIsPlaying(false); } }, []);
  const stop = useCallback(() => { if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; setIsPlaying(false); setProgress(0); } }, []);
  const seek = useCallback((percent: number) => { if (audioRef.current && audioRef.current.duration) { const time = (percent / 100) * audioRef.current.duration; audioRef.current.currentTime = time; setProgress(percent); setCurrentTime(time); } }, []);
  const setVolume = useCallback((vol: number) => { setVolumeState(vol); setIsMuted(vol === 0); }, []);
  const toggleMute = useCallback(() => setIsMuted((p) => !p), []);
  const toggleRepeat = useCallback(() => setRepeatMode((p) => p === 'off' ? 'one' : p === 'one' ? 'all' : 'off'), []);
  const toggleShuffle = useCallback(() => setShuffle((p) => !p), []);
  const toggleFullscreen = useCallback(() => setIsFullscreen((p) => !p), []);
  const toggleMiniPlayer = useCallback(() => setIsMiniPlayer((p) => !p), []);

  const setQueue = useCallback((tracks: Track[], startIndex = 0) => {
    setQueueState(tracks);
    queueIndexRef.current = startIndex;
    if (tracks[startIndex]) {
      playAt(tracks[startIndex]);
    }
  }, [playAt]);

  const addToQueue = useCallback((track: Track) => setQueueState((p) => [...p, track]), []);
  const removeFromQueue = useCallback((index: number) => setQueueState((p) => p.filter((_, i) => i !== index)), []);
  const clearQueue = useCallback(() => { setQueueState([]); queueIndexRef.current = 0; }, []);

  const toggleLike = useCallback(() => { setIsLiked((p) => !p); }, []);
  const enterFullscreen = useCallback(() => setIsFullscreen(true), []);
  const exitFullscreen = useCallback(() => setIsFullscreen(false), []);

  return (
    <PlayerContext.Provider value={{
      currentTrack, queue, isPlaying, volume, isMuted, progress, duration, currentTime,
      repeatMode, repeat: repeatMode, shuffle, isFullscreen, isMiniPlayer, isLiked,
      play, pause, stop, next, playNext: next, previous: playPrev, playPrevious: playPrev,
      seek, setVolume, toggleMute, toggleRepeat, toggleShuffle,
      toggleLike,
      setQueue, addToQueue, removeFromQueue, clearQueue,
      toggleFullscreen, enterFullscreen,
      exitFullscreen,
      toggleMiniPlayer,
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => {
  const c = useContext(PlayerContext);
  if (!c) throw new Error('usePlayer must be used within PlayerProvider');
  return c;
};
