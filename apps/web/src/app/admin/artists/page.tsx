'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { MainLayout } from '@/components/layout/MainLayout';
import { useState } from 'react';
import { Trash2, Search, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

export default function AdminArtistsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-artists', page, search],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (search) params.set('search', search);
      const res = await api.get(`/admin/artists?${params}`);
      return res.data;
    },
  });

  const verifyArtist = useMutation({
    mutationFn: ({ id, verified }: { id: string; verified: boolean }) => api.patch(`/admin/artists/${id}`, { verified }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-artists'] }),
  });

  const deleteArtist = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/artists/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-artists'] }),
  });

  const artists = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;

  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-white mb-6">Manage Artists</h1>

        <div className="relative max-w-md mb-6">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
          <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search artists..." className="w-full h-10 bg-dark-800 border border-dark-700 rounded-xl pl-9 pr-4 text-sm text-white placeholder:text-dark-500 focus:outline-none focus:border-pulse-500 transition-all" />
        </div>

        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-dark-700">
                <th className="text-left text-xs font-medium text-dark-400 uppercase tracking-wider px-6 py-3">Artist</th>
                <th className="text-left text-xs font-medium text-dark-400 uppercase tracking-wider px-6 py-3">Followers</th>
                <th className="text-left text-xs font-medium text-dark-400 uppercase tracking-wider px-6 py-3">Songs</th>
                <th className="text-left text-xs font-medium text-dark-400 uppercase tracking-wider px-6 py-3">Verified</th>
                <th className="text-right text-xs font-medium text-dark-400 uppercase tracking-wider px-6 py-3">Actions</th>
              </tr></thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => <tr key={i} className="border-b border-dark-800"><td colSpan={5} className="px-6 py-4"><div className="h-5 bg-dark-700 rounded animate-pulse" /></td></tr>)
                ) : artists.map((artist: any) => (
                  <tr key={artist.id} className="border-b border-dark-800 hover:bg-dark-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-dark-700 overflow-hidden">
                          {artist.avatar ? <img src={artist.avatar} alt="" className="h-full w-full object-cover" /> : <div className="h-full w-full bg-dark-600" />}
                        </div>
                        <span className="text-sm text-white">{artist.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-dark-400">{formatNumber(artist._count?.followers || 0)}</td>
                    <td className="px-6 py-4 text-sm text-dark-400">{artist._count?.songs || 0}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => verifyArtist.mutate({ id: artist.id, verified: !artist.verified })} className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full transition-all ${artist.verified ? 'bg-green-500/15 text-green-400' : 'bg-dark-700 text-dark-400 hover:text-white'}`}>
                        <CheckCircle size={12} />{artist.verified ? 'Verified' : 'Unverified'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => { if (confirm('Delete this artist?')) deleteArtist.mutate(artist.id); }} className="p-1.5 text-dark-400 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
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
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-lg bg-dark-800 text-dark-400 hover:text-white disabled:opacity-30"><ChevronLeft size={16} /></button>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 rounded-lg bg-dark-800 text-dark-400 hover:text-white disabled:opacity-30"><ChevronRight size={16} /></button>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
