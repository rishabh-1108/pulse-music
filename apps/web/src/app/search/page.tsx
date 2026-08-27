'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Search as SearchIcon, X } from 'lucide-react';
import { api } from '@/services/api';
import { MainLayout } from '@/components/layout/MainLayout';
import { SongListRow, AlbumCard, ArtistCard, PlaylistCard } from '@/components/music';
import { CardSkeleton } from '@/components/ui';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from '@/hooks';

type Tab = 'all' | 'songs' | 'artists' | 'albums' | 'playlists';

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchPageContent />
    </Suspense>
  );
}

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) { router.replace(`/search?q=${encodeURIComponent(debouncedQuery)}`); } else { router.replace('/search'); }
  }, [debouncedQuery, router]);

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: async () => { const res = await api.get(`/search?q=${encodeURIComponent(debouncedQuery)}`); return res.data.data; },
    enabled: !!debouncedQuery,
  });

  const tabs: { key: Tab; label: string }[] = [
    { key: 'all', label: 'All' }, { key: 'songs', label: 'Songs' }, { key: 'artists', label: 'Artists' }, { key: 'albums', label: 'Albums' }, { key: 'playlists', label: 'Playlists' },
  ];

  return (
    <MainLayout>
      <div className="p-6">
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500" />
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search songs, artists, albums, playlists..." autoFocus className="w-full h-14 bg-dark-800 border border-dark-700 rounded-2xl pl-12 pr-10 text-white placeholder:text-dark-500 focus:outline-none focus:border-pulse-500 focus:ring-1 focus:ring-pulse-500 transition-all text-base" />
            {query && <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-500 hover:text-white"><X size={18} /></button>}
          </div>
        </div>

        {query && (
          <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.key ? 'bg-white text-black' : 'bg-dark-800 text-dark-300 hover:text-white'}`}>
                {tab.label}
              </button>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div key={activeTab + debouncedQuery} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            {!query ? (
              <div className="text-center py-20">
                <SearchIcon size={48} className="mx-auto text-dark-600 mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">Search Pulse Music</h2>
                <p className="text-dark-400">Find your favorite songs, artists, albums, and playlists</p>
              </div>
            ) : isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {Array.from({ length: 10 }).map((_, i) => <CardSkeleton key={i} />)}
              </div>
            ) : searchResults && (
              <div className="space-y-8">
                {(activeTab === 'all' || activeTab === 'songs') && searchResults.songs?.length > 0 && (
                  <section>
                    <h3 className="text-lg font-bold text-white mb-3">Songs</h3>
                    <div className="space-y-1">
                      {searchResults.songs.slice(0, activeTab === 'all' ? 5 : 50).map((song: any, i: number) => <SongListRow key={song.id} song={song} index={i} allSongs={searchResults.songs} />)}
                    </div>
                  </section>
                )}

                {(activeTab === 'all' || activeTab === 'artists') && searchResults.artists?.length > 0 && (
                  <section>
                    <h3 className="text-lg font-bold text-white mb-3">Artists</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {searchResults.artists.slice(0, activeTab === 'all' ? 6 : 50).map((artist: any) => <ArtistCard key={artist.id} artist={artist} />)}
                    </div>
                  </section>
                )}

                {(activeTab === 'all' || activeTab === 'albums') && searchResults.albums?.length > 0 && (
                  <section>
                    <h3 className="text-lg font-bold text-white mb-3">Albums</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {searchResults.albums.slice(0, activeTab === 'all' ? 5 : 50).map((album: any) => <AlbumCard key={album.id} album={album} />)}
                    </div>
                  </section>
                )}

                {(activeTab === 'all' || activeTab === 'playlists') && searchResults.playlists?.length > 0 && (
                  <section>
                    <h3 className="text-lg font-bold text-white mb-3">Playlists</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {searchResults.playlists.slice(0, activeTab === 'all' ? 5 : 50).map((pl: any) => <PlaylistCard key={pl.id} playlist={pl} />)}
                    </div>
                  </section>
                )}

                {!searchResults.songs?.length && !searchResults.artists?.length && !searchResults.albums?.length && !searchResults.playlists?.length && (
                  <div className="text-center py-20">
                    <p className="text-dark-400">No results found for &quot;{query}&quot;</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </MainLayout>
  );
}
