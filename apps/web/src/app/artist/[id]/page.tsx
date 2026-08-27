'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { api } from '@/services/api';
import { MainLayout } from '@/components/layout/MainLayout';
import { SongListRow, AlbumCard } from '@/components/music';
import { Avatar } from '@/components/ui';
import { Play, Pause, UserPlus, UserCheck, MoreHorizontal, CheckCircle } from 'lucide-react';
import { usePlayer } from '@/providers/PlayerProvider';
import { useAuth } from '@/providers/AuthProvider';
import { formatNumber } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function ArtistPage() {
  const params = useParams();
  const slug = params.id as string;
  const { play, isPlaying, currentTrack, pause } = usePlayer();
  const { isAuthenticated } = useAuth();

  const { data: artist, isLoading } = useQuery({
    queryKey: ['artist', slug],
    queryFn: async () => { const res = await api.get(`/artists/${slug}`); return res.data.data; },
    enabled: !!slug,
  });

  const { data: isFollowing, refetch: refetchFollow } = useQuery({
    queryKey: ['follow-status', artist?.id],
    queryFn: async () => { const res = await api.get(`/artists/${artist.id}/follow/check`); return res.data.data.isFollowing; },
    enabled: !!artist?.id && isAuthenticated,
  });

  if (isLoading) return <MainLayout><div className="p-6 space-y-6"><div className="h-72 bg-dark-800 rounded-2xl animate-pulse" /><div className="h-8 bg-dark-800 rounded w-64 animate-pulse" /></div></MainLayout>;
  if (!artist) return <MainLayout><div className="p-6 text-center py-20 text-dark-400">Artist not found</div></MainLayout>;

  const topSongs = artist.songs || [];
  const isArtistPlaying = topSongs.some((s: any) => currentTrack?.id === s.id && isPlaying);

  const handlePlayAll = () => {
    if (isArtistPlaying) { pause(); return; }
    const firstSong = topSongs[0];
    if (firstSong) {
      const tracks = topSongs.map((s: any) => ({
        id: s.id, title: s.title, audioUrl: s.audioUrl || '', coverImage: s.coverImage || artist.avatar || artist.user?.avatar,
        duration: s.duration, artist: { id: artist.id, name: artist.name, slug: artist.slug, avatar: artist.avatar, verified: artist.verified },
        album: s.album ? { id: s.album.id, title: s.album.title, coverImage: s.album.coverImage } : undefined,
      }));
      play(tracks[0]);
    }
  };

  const handleFollow = async () => {
    if (!isAuthenticated) return;
    await api.post(`/artists/${artist.id}/follow`);
    refetchFollow();
  };

  return (
    <MainLayout>
      <div className="relative">
        <div className="h-80 bg-gradient-to-b from-pulse-500/20 to-dark-950 relative overflow-hidden">
          <img src={artist.avatar || artist.user?.avatar || '/placeholder-artist.svg'} alt="" className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/50 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-end gap-6">
            <Avatar src={artist.avatar || artist.user?.avatar} fallback={artist.name} size="xl" className="ring-4 ring-dark-950" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {artist.verified && <CheckCircle size={18} className="text-blue-400 fill-blue-400" />}
                <span className="text-sm text-dark-300 uppercase tracking-wider font-medium">Artist</span>
              </div>
              <h1 className="text-5xl font-bold text-white mb-3 truncate">{artist.name}</h1>
              <p className="text-dark-400">{formatNumber(artist._count?.followers || 0)} followers</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={handlePlayAll} className="h-14 w-14 rounded-full bg-pulse-500 flex items-center justify-center shadow-glow hover:scale-105 transition-transform">
            {isArtistPlaying ? <Pause size={22} className="text-white" fill="white" /> : <Play size={22} className="text-white ml-1" fill="white" />}
          </button>
          {isAuthenticated && (
            <button onClick={handleFollow} className={`px-6 py-2.5 rounded-full text-sm font-medium border transition-all ${isFollowing ? 'border-dark-600 text-white hover:bg-dark-800' : 'border-pulse-500 text-pulse-400 hover:bg-pulse-500/10'}`}>
              {isFollowing ? <><UserCheck size={16} className="inline mr-2" />Following</> : <><UserPlus size={16} className="inline mr-2" />Follow</>}
            </button>
          )}
          <button className="p-2 text-dark-400 hover:text-white transition-colors"><MoreHorizontal size={20} /></button>
        </div>

        {topSongs.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-white mb-4">Popular</h2>
            <div className="space-y-1">
              {topSongs.slice(0, 5).map((song: any, i: number) => <SongListRow key={song.id} song={song} index={i} allSongs={topSongs.slice(0, 5)} showAlbum={false} />)}
            </div>
          </section>
        )}

        {artist.albums && artist.albums.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-white mb-4">Albums</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {artist.albums.map((album: any) => <AlbumCard key={album.id} album={{ ...album, artist }} />)}
            </div>
          </section>
        )}
      </div>
    </MainLayout>
  );
}
