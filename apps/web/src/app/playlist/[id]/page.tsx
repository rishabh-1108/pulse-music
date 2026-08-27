'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { api } from '@/services/api';
import { MainLayout } from '@/components/layout/MainLayout';
import { SongListRow } from '@/components/music';
import { Play, Pause, MoreHorizontal, ListMusic, Clock, Share2 } from 'lucide-react';
import { usePlayer } from '@/providers/PlayerProvider';
import { formatDuration } from '@/lib/utils';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PlaylistPage() {
  const params = useParams();
  const playlistId = params.id as string;
  const { isPlaying, currentTrack, pause, setQueue } = usePlayer();

  const { data: playlist, isLoading } = useQuery({
    queryKey: ['playlist', playlistId],
    queryFn: async () => { const res = await api.get(`/playlists/${playlistId}`); return res.data.data; },
    enabled: !!playlistId,
  });

  if (isLoading) return <MainLayout><div className="p-6"><div className="h-72 bg-dark-800 rounded-2xl animate-pulse" /></div></MainLayout>;
  if (!playlist) return <MainLayout><div className="p-6 text-center py-20 text-dark-400">Playlist not found</div></MainLayout>;

  const songs = playlist.songs?.map((s: any) => s.song) || [];
  const isPlaylistPlaying = songs.some((s: any) => currentTrack?.id === s.id && isPlaying);
  const totalDuration = songs.reduce((acc: number, s: any) => acc + (s.duration || 0), 0);

  const handlePlayAll = () => {
    if (isPlaylistPlaying) { pause(); return; }
    if (songs.length > 0) {
      const tracks = songs.map((s: any) => ({
        id: s.id, title: s.title, audioUrl: s.audioUrl || '',
        coverImage: s.coverImage, duration: s.duration,
        artist: s.artist, album: s.album,
      }));
      setQueue(tracks);
    }
  };

  const gridImages = songs.slice(0, 4).map((s: any) => s.coverImage).filter(Boolean);

  return (
    <MainLayout>
      <div className="relative">
        <div className="h-80 bg-gradient-to-b from-pulse-500/20 to-dark-950 relative overflow-hidden">
          {gridImages.length > 0 && <img src={gridImages[0]} alt="" className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-30" />}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/50 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-end gap-6">
            <div className="h-48 w-48 rounded-xl shadow-2xl overflow-hidden flex-shrink-0">
              {gridImages.length >= 4 ? (
                <div className="grid grid-cols-2 grid-rows-2 w-full h-full gap-0.5">
                  {gridImages.slice(0, 4).map((img: string, i: number) => (
                    <div key={i} className="bg-dark-700 overflow-hidden"><img src={img} alt="" className="w-full h-full object-cover" /></div>
                  ))}
                </div>
              ) : (
                <div className="w-full h-full bg-dark-800 flex items-center justify-center"><ListMusic size={48} className="text-dark-600" /></div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm text-dark-300 uppercase tracking-wider font-medium">Playlist</span>
              <h1 className="text-4xl font-bold text-white mb-3 truncate">{playlist.name}</h1>
              <p className="text-sm text-dark-400 mb-1">{playlist.description}</p>
              <div className="flex items-center gap-2 text-sm text-dark-400">
                <Link href={`/profile`} className="text-white font-medium hover:underline">{playlist.user.displayName}</Link>
                <span>&middot;</span>
                <span>{songs.length} songs, {formatDuration(totalDuration)}</span>
                {playlist.isPublic && <><span>&middot;</span><span>Public</span></>}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={handlePlayAll} className="h-14 w-14 rounded-full bg-pulse-500 flex items-center justify-center shadow-glow hover:scale-105 transition-transform">
            {isPlaylistPlaying ? <Pause size={22} className="text-white" fill="white" /> : <Play size={22} className="text-white ml-1" fill="white" />}
          </button>
          <button className="p-2 text-dark-400 hover:text-white transition-colors"><Share2 size={22} /></button>
          <button className="p-2 text-dark-400 hover:text-white transition-colors"><MoreHorizontal size={22} /></button>
        </div>

        {songs.length > 0 && (
          <div className="flex items-center gap-4 px-4 py-2 border-b border-dark-800 mb-2 text-dark-500 text-xs">
            <span className="w-6 text-center">#</span>
            <span className="flex-1">Title</span>
            <span className="hidden md:block w-40">Album</span>
            <Clock size={14} className="hidden sm:block" />
            <span className="w-16 text-right hidden lg:block">Likes</span>
            <span className="w-8" />
          </div>
        )}

        <div className="space-y-1">
          {songs.map((song: any, i: number) => <SongListRow key={song.id} song={song} index={i} allSongs={songs} />)}
        </div>

        {songs.length === 0 && (
          <div className="text-center py-20">
            <ListMusic size={48} className="mx-auto text-dark-600 mb-4" />
            <p className="text-dark-400">This playlist is empty</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
