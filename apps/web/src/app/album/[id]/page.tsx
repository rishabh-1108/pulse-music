'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { api } from '@/services/api';
import { MainLayout } from '@/components/layout/MainLayout';
import { SongListRow } from '@/components/music';
import { Play, Pause, Heart, MoreHorizontal, Clock } from 'lucide-react';
import { usePlayer } from '@/providers/PlayerProvider';
import { formatDuration, formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AlbumPage() {
  const params = useParams();
  const albumId = params.id as string;
  const { isPlaying, currentTrack, pause, setQueue } = usePlayer();

  const { data: album, isLoading } = useQuery({
    queryKey: ['album', albumId],
    queryFn: async () => { const res = await api.get(`/albums/${albumId}`); return res.data.data; },
    enabled: !!albumId,
  });

  if (isLoading) return <MainLayout><div className="p-6"><div className="h-72 bg-dark-800 rounded-2xl animate-pulse" /></div></MainLayout>;
  if (!album) return <MainLayout><div className="p-6 text-center py-20 text-dark-400">Album not found</div></MainLayout>;

  const songs = album.songs || [];
  const isAlbumPlaying = songs.some((s: any) => currentTrack?.id === s.id && isPlaying);
  const totalDuration = songs.reduce((acc: number, s: any) => acc + (s.duration || 0), 0);

  const handlePlayAll = () => {
    if (isAlbumPlaying) { pause(); return; }
    if (songs.length > 0) {
      const tracks = songs.map((s: any) => ({
        id: s.id, title: s.title, audioUrl: s.audioUrl || '',
        coverImage: s.coverImage || album.coverImage, duration: s.duration,
        artist: s.artist || album.artist,
        album: { id: album.id, title: album.title, coverImage: album.coverImage },
      }));
      setQueue(tracks);
    }
  };

  return (
    <MainLayout>
      <div className="relative">
        <div className="h-80 bg-gradient-to-b from-pulse-500/20 to-dark-950 relative overflow-hidden">
          <img src={album.coverImage || '/placeholder-album.svg'} alt="" className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/50 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-end gap-6">
            <img src={album.coverImage || '/placeholder-album.svg'} alt="" className="h-48 w-48 rounded-xl shadow-2xl object-cover" />
            <div className="flex-1 min-w-0">
              <span className="text-sm text-dark-300 uppercase tracking-wider font-medium">Album</span>
              <h1 className="text-5xl font-bold text-white mb-3 truncate">{album.title}</h1>
              <div className="flex items-center gap-2 text-sm text-dark-400">
                <Link href={`/artist/${album.artist.slug || album.artist.id}`} className="text-white font-medium hover:underline">{album.artist.name}</Link>
                <span>&middot;</span>
                <span>{album.releaseDate ? formatDate(album.releaseDate) : 'Unknown year'}</span>
                <span>&middot;</span>
                <span>{songs.length} songs, {formatDuration(totalDuration)}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={handlePlayAll} className="h-14 w-14 rounded-full bg-pulse-500 flex items-center justify-center shadow-glow hover:scale-105 transition-transform">
            {isAlbumPlaying ? <Pause size={22} className="text-white" fill="white" /> : <Play size={22} className="text-white ml-1" fill="white" />}
          </button>
          <button className="p-2 text-dark-400 hover:text-white transition-colors"><Heart size={22} /></button>
          <button className="p-2 text-dark-400 hover:text-white transition-colors"><MoreHorizontal size={22} /></button>
        </div>

        <div className="flex items-center gap-4 px-4 py-2 border-b border-dark-800 mb-2 text-dark-500 text-xs">
          <span className="w-6 text-center">#</span>
          <span className="flex-1">Title</span>
          <Clock size={14} className="hidden sm:block" />
        </div>

        <div className="space-y-1">
          {songs.map((song: any, i: number) => <SongListRow key={song.id} song={song} index={i} allSongs={songs} showAlbum={false} />)}
        </div>

        {album.copyright && <p className="text-xs text-dark-500 mt-6">&copy; {album.copyright}</p>}
      </div>
    </MainLayout>
  );
}
