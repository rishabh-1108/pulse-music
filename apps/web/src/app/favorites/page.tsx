'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { MainLayout } from '@/components/layout/MainLayout';
import { SongListRow, AlbumCard, ArtistCard } from '@/components/music';
import { EmptyState, Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';
import { Heart, Music, Mic2, Clock, ListMusic } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { motion } from 'framer-motion';

export default function FavoritesPage() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('songs');

  const { data: likedSongs } = useQuery({
    queryKey: ['liked-songs'],
    queryFn: async () => { const res = await api.get('/users/me/likes'); return res.data.data; },
    enabled: isAuthenticated && activeTab === 'songs',
  });

  const { data: likedAlbums } = useQuery({
    queryKey: ['liked-albums'],
    queryFn: async () => { const res = await api.get('/users/me/likes?type=albums'); return res.data.data; },
    enabled: isAuthenticated && activeTab === 'albums',
  });

  const { data: followingArtists } = useQuery({
    queryKey: ['following-artists'],
    queryFn: async () => { const res = await api.get('/users/me/following'); return res.data.data; },
    enabled: isAuthenticated && activeTab === 'artists',
  });

  const { data: history } = useQuery({
    queryKey: ['history'],
    queryFn: async () => { const res = await api.get('/users/me/history?limit=50'); return res.data.data; },
    enabled: isAuthenticated && activeTab === 'history',
  });

  if (!isAuthenticated) return <MainLayout><div className="p-6 text-center py-20"><EmptyState icon={<Heart size={32} />} title="Sign in to see your liked content" description="Create an account to save songs, albums, and artists" /></div></MainLayout>;

  return (
    <MainLayout>
      <div className="p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Your Library</h1>
          <p className="text-dark-400">Your liked songs, albums, artists, and listening history</p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="songs"><Music size={14} className="mr-2" />Liked Songs</TabsTrigger>
            <TabsTrigger value="albums"><ListMusic size={14} className="mr-2" />Albums</TabsTrigger>
            <TabsTrigger value="artists"><Mic2 size={14} className="mr-2" />Artists</TabsTrigger>
            <TabsTrigger value="history"><Clock size={14} className="mr-2" />History</TabsTrigger>
          </TabsList>

          <TabsContent value="songs">
            {likedSongs && likedSongs.length > 0 ? (
              <div className="space-y-1">{likedSongs.map((song: any, i: number) => <SongListRow key={song.id} song={song} index={i} allSongs={likedSongs} />)}</div>
            ) : (
              <EmptyState icon={<Heart size={32} />} title="No liked songs yet" description="Songs you like will appear here" />
            )}
          </TabsContent>

          <TabsContent value="albums">
            {likedAlbums && likedAlbums.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">{likedAlbums.map((album: any) => <AlbumCard key={album.id} album={album} />)}</div>
            ) : (
              <EmptyState icon={<ListMusic size={32} />} title="No liked albums yet" description="Albums you like will appear here" />
            )}
          </TabsContent>

          <TabsContent value="artists">
            {followingArtists && followingArtists.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">{followingArtists.map((artist: any) => <ArtistCard key={artist.id} artist={artist} />)}</div>
            ) : (
              <EmptyState icon={<Mic2 size={32} />} title="Not following any artists" description="Artists you follow will appear here" />
            )}
          </TabsContent>

          <TabsContent value="history">
            {history && history.length > 0 ? (
              <div className="space-y-1">{history.map((h: any, i: number) => <SongListRow key={h.song?.id + i} song={h.song} index={i} allSongs={history.map((h: any) => h.song).filter(Boolean)} showAlbum={false} />)}</div>
            ) : (
              <EmptyState icon={<Clock size={32} />} title="No listening history" description="Songs you listen to will appear here" />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
