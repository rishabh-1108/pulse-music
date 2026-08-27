'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { MainLayout } from '@/components/layout/MainLayout';
import { Badge } from '@/components/ui';
import { useState } from 'react';
import { Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', page, search, roleFilter],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (search) params.set('search', search);
      if (roleFilter) params.set('role', roleFilter);
      const res = await api.get(`/admin/users?${params}`);
      return res.data;
    },
  });

  const deleteUser = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/users/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  const users = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;

  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-white mb-6">Manage Users</h1>

        <div className="flex gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
            <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search users..." className="w-full h-10 bg-dark-800 border border-dark-700 rounded-xl pl-9 pr-4 text-sm text-white placeholder:text-dark-500 focus:outline-none focus:border-pulse-500 transition-all" />
          </div>
          <select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }} className="h-10 bg-dark-800 border border-dark-700 rounded-xl px-3 text-sm text-white focus:outline-none focus:border-pulse-500">
            <option value="">All Roles</option>
            <option value="USER">User</option>
            <option value="ARTIST">Artist</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-dark-700">
                <th className="text-left text-xs font-medium text-dark-400 uppercase tracking-wider px-6 py-3">User</th>
                <th className="text-left text-xs font-medium text-dark-400 uppercase tracking-wider px-6 py-3">Role</th>
                <th className="text-left text-xs font-medium text-dark-400 uppercase tracking-wider px-6 py-3">Status</th>
                <th className="text-left text-xs font-medium text-dark-400 uppercase tracking-wider px-6 py-3">Joined</th>
                <th className="text-right text-xs font-medium text-dark-400 uppercase tracking-wider px-6 py-3">Actions</th>
              </tr></thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => <tr key={i} className="border-b border-dark-800"><td colSpan={5} className="px-6 py-4"><div className="h-5 bg-dark-700 rounded animate-pulse" /></td></tr>)
                ) : users.map((user: any) => (
                  <tr key={user.id} className="border-b border-dark-800 hover:bg-dark-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-dark-700 flex items-center justify-center text-xs text-dark-300">{user.displayName?.[0]}</div>
                        <div>
                          <p className="text-sm text-white">{user.displayName}</p>
                          <p className="text-xs text-dark-500">@{user.username} &middot; {user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><Badge variant={user.role === 'ADMIN' ? 'admin' : user.role === 'ARTIST' ? 'artist' : 'default'}>{user.role}</Badge></td>
                    <td className="px-6 py-4"><span className={`text-xs ${user.isEmailVerified ? 'text-green-400' : 'text-dark-500'}`}>{user.isEmailVerified ? 'Verified' : 'Unverified'}</span></td>
                    <td className="px-6 py-4 text-xs text-dark-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => { if (confirm('Delete this user?')) deleteUser.mutate(user.id); }} className="p-1.5 text-dark-400 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
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
