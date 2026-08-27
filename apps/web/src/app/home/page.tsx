'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { MainLayout } from '@/components/layout/MainLayout';
import { SongCard, ArtistCard, PlaylistCard, GenreCard } from '@/components/music';
import { CardSkeleton } from '@/components/ui';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

function Section({ title, href, children }: { title: string; href?: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        {href && <Link href={href} className="flex items-center gap-1 text-sm text-dark-400 hover:text-white transition-colors">View all <ChevronRight size={16} /></Link>}
      </div>
      {children}
    </section>
  );
}

function HomePageContent() {
  const { data: trending, isLoading: trendingLoading } = useQuery({
    queryKey: ['trending'],
    queryFn: async () => { const res = await api.get('/songs/trending?limit=20'); return res.data.data; },
  });
  const { data: newReleases, isLoading: newLoading } = useQuery({
    queryKey: ['new-releases'],
    queryFn: async () => { const res = await api.get('/songs/new-releases?limit=20'); return res.data.data; },
  });
  const { data: featuredArtists, isLoading: artistsLoading } = useQuery({
    queryKey: ['featured-artists'],
    queryFn: async () => { const res = await api.get('/artists?limit=12&sort=followers'); return res.data.data; },
  });
  const { data: allSongs, isLoading: allSongsLoading } = useQuery({
    queryKey: ['all-songs'],
    queryFn: async () => { const res = await api.get('/songs?limit=200&sortBy=createdAt&sortOrder=desc'); return res.data.data; },
  });
  const { data: genres } = useQuery({
    queryKey: ['genres'],
    queryFn: async () => { const res = await api.get('/genres'); return res.data.data; },
  });
  const { data: playlists, isLoading: playlistsLoading } = useQuery({
    queryKey: ['featured-playlists'],
    queryFn: async () => { const res = await api.get('/playlists/public?limit=6'); return res.data.data; },
  });

  return (
    <div className="p-6 space-y-2">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Good evening</h1>
        <p className="text-dark-400">Discover what&apos;s trending right now</p>
      </motion.div>

      {genres && genres.length > 0 && (
        <Section title="Browse Genres" href="/search">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {genres.slice(0, 10).map((genre: any, i: number) => (
              <motion.div key={genre.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                <GenreCard genre={genre} />
              </motion.div>
            ))}
          </div>
        </Section>
      )}

      <Section title="Trending Now" href="/search?trending=true">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {trendingLoading ? Array.from({ length: 10 }).map((_, i) => <CardSkeleton key={i} />) : trending?.slice(0, 10).map((song: any, i: number) => (
            <motion.div key={song.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <SongCard song={song} index={i} allSongs={trending || []} />
            </motion.div>
          ))}
        </div>
      </Section>

      {newReleases && newReleases.length > 0 && (
        <Section title="New Releases" href="/search?type=songs">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {newLoading ? Array.from({ length: 10 }).map((_, i) => <CardSkeleton key={i} />) : newReleases.slice(0, 10).map((song: any, i: number) => (
              <motion.div key={song.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <SongCard song={song} index={i} allSongs={newReleases || []} />
              </motion.div>
            ))}
          </div>
        </Section>
      )}

      {featuredArtists && featuredArtists.length > 0 && (
        <Section title="Featured Artists" href="/search?type=artists">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {artistsLoading ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />) : featuredArtists.map((artist: any, i: number) => (
              <motion.div key={artist.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <ArtistCard artist={artist} />
              </motion.div>
            ))}
          </div>
        </Section>
      )}

      {allSongs && allSongs.length > 0 && (
        <Section title="All Songs" href="/search?type=songs">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {allSongsLoading ? Array.from({ length: 10 }).map((_, i) => <CardSkeleton key={i} />) : allSongs.map((song: any, i: number) => (
              <motion.div key={song.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: (i % 20) * 0.03 }}>
                <SongCard song={song} index={i} allSongs={allSongs} />
              </motion.div>
            ))}
          </div>
        </Section>
      )}

      {playlists && playlists.length > 0 && (
        <Section title="Featured Playlists" href="/search?type=playlists">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {playlistsLoading ? Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} />) : playlists.map((pl: any, i: number) => (
              <motion.div key={pl.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <PlaylistCard playlist={pl} />
              </motion.div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

export default function HomePage() {
  return <MainLayout><HomePageContent /></MainLayout>;
}
