'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { MainLayout } from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import { Users, Music, Disc, TrendingUp, BarChart3 } from 'lucide-react';
import Link from 'next/link';

function StatCard({ label, value, icon: Icon, color, href }: { label: string; value: number | string; icon: any; color: string; href?: string }) {
  const content = (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}><Icon size={20} className="text-white" /></div>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-dark-400 mt-1">{label}</p>
    </div>
  );
  return href ? <Link href={href} className="hover-lift">{content}</Link> : <div className="hover-lift">{content}</div>;
}

export default function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => { const res = await api.get('/admin/stats'); return res.data.data; },
  });

  const { data: recentUsers } = useQuery({
    queryKey: ['admin-recent-users'],
    queryFn: async () => { const res = await api.get('/admin/users?limit=5&sort=recent'); return res.data.data; },
  });

  const { data: recentSongs } = useQuery({
    queryKey: ['admin-recent-songs'],
    queryFn: async () => { const res = await api.get('/admin/songs?limit=5&sort=recent'); return res.data.data; },
  });

  return (
    <MainLayout>
      <div className="p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-dark-400 mb-8">Overview of your platform</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Users" value={stats?.totalUsers || 0} icon={Users} color="bg-blue-500/20" href="/admin/users" />
          <StatCard label="Total Songs" value={stats?.totalSongs || 0} icon={Music} color="bg-green-500/20" href="/admin/songs" />
          <StatCard label="Total Albums" value={stats?.totalAlbums || 0} icon={Disc} color="bg-purple-500/20" href="/admin/albums" />
          <StatCard label="Total Artists" value={stats?.totalArtists || 0} icon={TrendingUp} color="bg-pink-500/20" href="/admin/artists" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Recent Users</h2>
            <div className="space-y-3">
              {recentUsers?.map((u: any) => (
                <div key={u.id} className="flex items-center gap-3 p-2 rounded-lg">
                  <div className="h-8 w-8 rounded-full bg-dark-700 flex items-center justify-center text-sm text-dark-300">{u.displayName?.[0]}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{u.displayName}</p>
                    <p className="text-xs text-dark-500">@{u.username}</p>
                  </div>
                  <span className="text-xs text-dark-500">{u.role}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Recent Songs</h2>
            <div className="space-y-3">
              {recentSongs?.map((s: any) => (
                <div key={s.id} className="flex items-center gap-3 p-2 rounded-lg">
                  <div className="h-8 w-8 rounded-lg bg-dark-700 overflow-hidden flex-shrink-0">
                    {s.coverImage ? <img src={s.coverImage} alt="" className="h-full w-full object-cover" /> : <Music size={14} className="text-dark-500 m-auto mt-1.5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{s.title}</p>
                    <p className="text-xs text-dark-500">{s.artist?.name || 'Unknown'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/admin/users" className="glass-card rounded-xl p-4 hover-lift text-center">
            <Users size={24} className="mx-auto text-blue-400 mb-2" />
            <p className="text-sm font-medium text-white">Manage Users</p>
          </Link>
          <Link href="/admin/songs" className="glass-card rounded-xl p-4 hover-lift text-center">
            <Music size={24} className="mx-auto text-green-400 mb-2" />
            <p className="text-sm font-medium text-white">Manage Songs</p>
          </Link>
          <Link href="/admin/albums" className="glass-card rounded-xl p-4 hover-lift text-center">
            <Disc size={24} className="mx-auto text-purple-400 mb-2" />
            <p className="text-sm font-medium text-white">Manage Albums</p>
          </Link>
          <Link href="/admin/genres" className="glass-card rounded-xl p-4 hover-lift text-center">
            <BarChart3 size={24} className="mx-auto text-pink-400 mb-2" />
            <p className="text-sm font-medium text-white">Manage Genres</p>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
