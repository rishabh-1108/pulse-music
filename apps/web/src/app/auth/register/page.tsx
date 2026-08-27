'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, User, Music } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ displayName: '', username: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    setLoading(true); setError('');
    try {
      await register({ displayName: form.displayName, username: form.username, email: form.email, password: form.password });
      router.push('/home');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-pulse-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl animated-gradient-bg flex items-center justify-center mb-4 shadow-glow"><Music size={28} className="text-white" /></div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Create an account</h1>
          <p className="text-dark-400">Join Pulse Music today</p>
        </div>

        <div className="glass-card p-8">
          {error && <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-dark-300 mb-1.5 block">Display Name</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
                <input type="text" required value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} placeholder="John Doe" className="w-full h-12 bg-dark-800 border border-dark-700 rounded-xl pl-10 pr-4 text-sm text-white placeholder:text-dark-500 focus:outline-none focus:border-pulse-500 focus:ring-1 focus:ring-pulse-500 transition-all" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-dark-300 mb-1.5 block">Username</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500 text-sm">@</span>
                <input type="text" required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value.replace(/\s/g, '').toLowerCase() })} placeholder="johndoe" className="w-full h-12 bg-dark-800 border border-dark-700 rounded-xl pl-8 pr-4 text-sm text-white placeholder:text-dark-500 focus:outline-none focus:border-pulse-500 focus:ring-1 focus:ring-pulse-500 transition-all" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-dark-300 mb-1.5 block">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@example.com" className="w-full h-12 bg-dark-800 border border-dark-700 rounded-xl pl-10 pr-4 text-sm text-white placeholder:text-dark-500 focus:outline-none focus:border-pulse-500 focus:ring-1 focus:ring-pulse-500 transition-all" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-dark-300 mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
                <input type={showPassword ? 'text' : 'password'} required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="At least 8 characters" className="w-full h-12 bg-dark-800 border border-dark-700 rounded-xl pl-10 pr-10 text-sm text-white placeholder:text-dark-500 focus:outline-none focus:border-pulse-500 focus:ring-1 focus:ring-pulse-500 transition-all" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-white transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-dark-300 mb-1.5 block">Confirm Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
                <input type="password" required value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} placeholder="Repeat your password" className="w-full h-12 bg-dark-800 border border-dark-700 rounded-xl pl-10 pr-4 text-sm text-white placeholder:text-dark-500 focus:outline-none focus:border-pulse-500 focus:ring-1 focus:ring-pulse-500 transition-all" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full h-12 bg-pulse-500 text-white font-medium rounded-xl hover:bg-pulse-600 transition-all disabled:opacity-50">
              {loading ? <div className="flex items-center justify-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account...</div> : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-dark-400 text-sm">Already have an account? <Link href="/auth/login" className="text-pulse-400 hover:text-pulse-300 font-medium transition-colors">Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
