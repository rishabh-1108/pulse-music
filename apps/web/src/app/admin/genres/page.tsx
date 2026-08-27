'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { MainLayout } from '@/components/layout/MainLayout';
import { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';

export default function AdminGenresPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '', color: '#8b5cf6' });

  const { data: genres, isLoading } = useQuery({
    queryKey: ['admin-genres'],
    queryFn: async () => { const res = await api.get('/genres'); return res.data.data; },
  });

  const createGenre = useMutation({
    mutationFn: (data: typeof form) => api.post('/admin/genres', data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-genres'] }); setShowForm(false); setForm({ name: '', slug: '', color: '#8b5cf6' }); },
  });

  const deleteGenre = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/genres/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-genres'] }),
  });

  return (
    <MainLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">Manage Genres</h1>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 h-10 px-4 bg-pulse-500 text-white text-sm font-medium rounded-xl hover:bg-pulse-600 transition-all">
            <Plus size={16} /> Add Genre
          </button>
        </div>

        {showForm && (
          <div className="glass-card rounded-2xl p-6 mb-6 animate-slide-up">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-dark-300 mb-1.5 block">Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} className="w-full h-10 bg-dark-800 border border-dark-700 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-pulse-500 transition-all" />
              </div>
              <div>
                <label className="text-sm font-medium text-dark-300 mb-1.5 block">Slug</label>
                <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full h-10 bg-dark-800 border border-dark-700 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-pulse-500 transition-all" />
              </div>
              <div>
                <label className="text-sm font-medium text-dark-300 mb-1.5 block">Color</label>
                <div className="flex gap-2">
                  <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="h-10 w-14 rounded-xl border-0 bg-transparent cursor-pointer" />
                  <input type="text" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="flex-1 h-10 bg-dark-800 border border-dark-700 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-pulse-500 transition-all" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => { if (form.name) createGenre.mutate(form); }} disabled={!form.name || createGenre.isPending} className="h-10 px-6 bg-pulse-500 text-white text-sm font-medium rounded-xl hover:bg-pulse-600 transition-all disabled:opacity-50">
                {createGenre.isPending ? 'Creating...' : 'Create Genre'}
              </button>
              <button onClick={() => setShowForm(false)} className="h-10 px-4 text-dark-400 text-sm font-medium hover:text-white transition-colors">Cancel</button>
            </div>
          </div>
        )}

        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-dark-700">
                <th className="text-left text-xs font-medium text-dark-400 uppercase tracking-wider px-6 py-3">Genre</th>
                <th className="text-left text-xs font-medium text-dark-400 uppercase tracking-wider px-6 py-3">Slug</th>
                <th className="text-left text-xs font-medium text-dark-400 uppercase tracking-wider px-6 py-3">Color</th>
                <th className="text-left text-xs font-medium text-dark-400 uppercase tracking-wider px-6 py-3">Songs</th>
                <th className="text-right text-xs font-medium text-dark-400 uppercase tracking-wider px-6 py-3">Actions</th>
              </tr></thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => <tr key={i} className="border-b border-dark-800"><td colSpan={5} className="px-6 py-4"><div className="h-5 bg-dark-700 rounded animate-pulse" /></td></tr>)
                ) : genres?.map((genre: any) => (
                  <tr key={genre.id} className="border-b border-dark-800 hover:bg-dark-800/50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-6 h-6 rounded-lg" style={{ backgroundColor: genre.color || '#8b5cf6' }} />
                      <span className="text-sm text-white font-medium">{genre.name}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-dark-400">{genre.slug}</td>
                    <td className="px-6 py-4 text-sm text-dark-400 font-mono">{genre.color || '#8b5cf6'}</td>
                    <td className="px-6 py-4 text-sm text-dark-400">{genre._count?.songs || 0}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => { if (confirm('Delete this genre?')) deleteGenre.mutate(genre.id); }} className="p-1.5 text-dark-400 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
