'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { MainLayout } from '@/components/layout/MainLayout';
import { Avatar, Badge } from '@/components/ui';
import { useAuth } from '@/providers/AuthProvider';
import { ListMusic } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ProfilePage() {
  const { user } = useAuth();

  const { data: stats } = useQuery({
    queryKey: ['user-stats'],
    queryFn: async () => { const res = await api.get('/users/me/stats'); return res.data.data; },
    enabled: !!user,
  });

  const { data: playlists } = useQuery({
    queryKey: ['user-playlists'],
    queryFn: async () => { const res = await api.get('/playlists'); return res.data.data; },
    enabled: !!user,
  });

  if (!user) return <MainLayout><div className="p-6 text-center py-20 text-dark-400">Sign in to view your profile</div></MainLayout>;

  return (
    <MainLayout>
      <div className="relative">
        <div className="h-60 bg-gradient-to-b from-pulse-500/20 to-dark-950 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950 to-transparent" />
        </div>

        <div className="px-6 -mt-20 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-end gap-6 mb-8">
            <Avatar src={user.avatar} fallback={user.displayName} size="xl" className="ring-4 ring-dark-950" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant={user.role === 'ADMIN' ? 'admin' : user.role === 'ARTIST' ? 'artist' : 'default'}>{user.role}</Badge>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">{user.displayName}</h1>
              <p className="text-dark-400">@{user.username}</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-3 gap-6 mb-10">
            <div className="glass-card rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-white">{stats?.totalLikes || 0}</p>
              <p className="text-xs text-dark-400 mt-1">Liked Songs</p>
            </div>
            <div className="glass-card rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-white">{stats?.totalPlaylists || 0}</p>
              <p className="text-xs text-dark-400 mt-1">Playlists</p>
            </div>
            <div className="glass-card rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-white">{stats?.totalMinutesListened || 0}</p>
              <p className="text-xs text-dark-400 mt-1">Minutes Listened</p>
            </div>
          </div>

          {user.bio && <p className="text-dark-300 mb-6">{user.bio}</p>}

          {playlists && playlists.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-white mb-4">Your Playlists</h2>
              <div className="space-y-2">
                {playlists.map((pl: any) => (
                  <Link key={pl.id} href={`/playlist/${pl.id}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-dark-800/50 transition-all">
                    <div className="h-12 w-12 rounded-lg bg-dark-700 flex items-center justify-center flex-shrink-0">
                      {pl.coverImage ? <img src={pl.coverImage} alt="" className="h-full w-full rounded-lg object-cover" /> : <ListMusic size={20} className="text-dark-500" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white truncate">{pl.name}</p>
                      <p className="text-xs text-dark-400">{pl._count?.songs || 0} songs</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
