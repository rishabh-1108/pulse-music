'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/providers/AuthProvider';
import { api } from '@/services/api';
import { Save, User, Bell, Shield, Palette } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');
  const [form, setForm] = useState({
    displayName: user?.displayName || '',
    bio: user?.bio || '',
    email: user?.email || '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch('/users/me', { displayName: form.displayName, bio: form.bio });
      await refreshUser();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {} finally {
      setSaving(false);
    }
  };

  const sections = [
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'security', label: 'Security', icon: Shield },
    { key: 'appearance', label: 'Appearance', icon: Palette },
  ];

  return (
    <MainLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

          <div className="flex gap-6">
            <nav className="w-48 flex-shrink-0 space-y-1">
              {sections.map((s) => (
                <button key={s.key} onClick={() => setActiveSection(s.key)} className={`flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm font-medium transition-all ${activeSection === s.key ? 'bg-pulse-500/15 text-pulse-400' : 'text-dark-400 hover:text-white hover:bg-dark-800'}`}>
                  <s.icon size={16} />{s.label}
                </button>
              ))}
            </nav>

            <div className="flex-1 glass-card rounded-2xl p-6">
              {activeSection === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Profile Settings</h2>
                  <div>
                    <label className="text-sm font-medium text-dark-300 mb-1.5 block">Display Name</label>
                    <input type="text" value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} className="w-full h-11 bg-dark-800 border border-dark-700 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-pulse-500 transition-all" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-dark-300 mb-1.5 block">Bio</label>
                    <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-pulse-500 transition-all resize-none" placeholder="Tell us about yourself..." />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-dark-300 mb-1.5 block">Email</label>
                    <input type="email" value={form.email} disabled className="w-full h-11 bg-dark-800/50 border border-dark-700 rounded-xl px-4 text-sm text-dark-500 cursor-not-allowed" />
                  </div>
                  <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 h-11 px-6 bg-pulse-500 text-white font-medium rounded-xl hover:bg-pulse-600 transition-all disabled:opacity-50">
                    <Save size={16} />{saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
                  </button>
                </div>
              )}

              {activeSection === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Notification Settings</h2>
                  {['New releases from followed artists', 'Playlist updates', 'Friend activity', 'Promotional emails'].map((item) => (
                    <div key={item} className="flex items-center justify-between py-3 border-b border-dark-700 last:border-0">
                      <span className="text-sm text-dark-300">{item}</span>
                      <div className="w-11 h-6 bg-dark-700 rounded-full relative cursor-pointer hover:bg-dark-600 transition-colors">
                        <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeSection === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Security Settings</h2>
                  <div>
                    <label className="text-sm font-medium text-dark-300 mb-1.5 block">Current Password</label>
                    <input type="password" className="w-full h-11 bg-dark-800 border border-dark-700 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-pulse-500 transition-all" placeholder="Enter current password" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-dark-300 mb-1.5 block">New Password</label>
                    <input type="password" className="w-full h-11 bg-dark-800 border border-dark-700 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-pulse-500 transition-all" placeholder="Enter new password" />
                  </div>
                  <button className="flex items-center gap-2 h-11 px-6 bg-pulse-500 text-white font-medium rounded-xl hover:bg-pulse-600 transition-all">Update Password</button>
                </div>
              )}

              {activeSection === 'appearance' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Appearance</h2>
                  <p className="text-sm text-dark-400">Theme settings coming soon. The app currently uses a dark glassmorphism design.</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}
