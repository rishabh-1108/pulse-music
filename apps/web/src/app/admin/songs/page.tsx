'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { MainLayout } from '@/components/layout/MainLayout';
import { useState } from 'react';
import { Trash2, Search, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

export default function AdminSongsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-songs', page, search],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (search) params.set('search', search);
      const res = await api.get(`/admin/songs?${params}`);
      return res.data;
    },
  });

  const deleteSong = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/songs/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-songs'] }),
  });

  const songs = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;

  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-white mb-6">Manage Songs</h1>

        <div className="flex gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
            <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search songs..." className="w-full h-10 bg-dark-800 border border-dark-700 rounded-xl pl-9 pr-4 text-sm text-white placeholder:text-dark-500 focus:outline-none focus:border-pulse-500 transition-all" />
          </div>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-dark-700">
                <th className="text-left text-xs font-medium text-dark-400 uppercase tracking-wider px-6 py-3">Song</th>
                <th className="text-left text-xs font-medium text-dark-400 uppercase tracking-wider px-6 py-3">Artist</th>
                <th className="text-left text-xs font-medium text-dark-400 uppercase tracking-wider px-6 py-3">Plays</th>
                <th className="text-left text-xs font-medium text-dark-400 uppercase tracking-wider px-6 py-3">Likes</th>
                <th className="text-right text-xs font-medium text-dark-400 uppercase tracking-wider px-6 py-3">Actions</th>
              </tr></thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => <tr key={i} className="border-b border-dark-800"><td colSpan={5} className="px-6 py-4"><div className="h-5 bg-dark-700 rounded animate-pulse" /></td></tr>)
                ) : songs.map((song: any) => (
                  <tr key={song.id} className="border-b border-dark-800 hover:bg-dark-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-dark-700 overflow-hidden flex-shrink-0">
                          {song.coverImage ? <img src={song.coverImage} alt="" className="h-full w-full object-cover" /> : <div className="h-full w-full bg-dark-600" />}
                        </div>
                        <div>
                          <p className="text-sm text-white">{song.title}</p>
                          <p className="text-xs text-dark-500">{song.album?.title || 'No album'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-dark-300">{song.artist?.name}</td>
                    <td className="px-6 py-4 text-sm text-dark-400">{formatNumber(song.playCount || 0)}</td>
                    <td className="px-6 py-4 text-sm text-dark-400">{formatNumber(song._count?.likes || 0)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <a href={`/artist/${song.artist?.slug || song.artist?.id}`} target="_blank" rel="noopener noreferrer" className="p-1.5 text-dark-400 hover:text-white transition-colors"><Eye size={14} /></a>
                        <button onClick={() => { if (confirm('Delete this song?')) deleteSong.mutate(song.id); }} className="p-1.5 text-dark-400 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-dark-700">
              <span className="text-xs text-dark-500">Page {page} of {totalPages}</span>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-lg bg-dark-800 text-dark-400 hover:text-white disabled:opacity-30 transition-all"><ChevronLeft size={16} /></button>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 rounded-lg bg-dark-800 text-dark-400 hover:text-white disabled:opacity-30 transition-all"><ChevronRight size={16} /></button>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
