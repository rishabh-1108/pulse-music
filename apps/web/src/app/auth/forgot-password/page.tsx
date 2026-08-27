'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Music } from 'lucide-react';
import { api } from '@/services/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
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
          <h1 className="text-3xl font-bold gradient-text mb-2">Forgot password?</h1>
          <p className="text-dark-400">We&apos;ll send you a reset link</p>
        </div>

        <div className="glass-card p-8">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 flex items-center justify-center mb-4"><Mail size={28} className="text-green-400" /></div>
              <h3 className="text-lg font-semibold text-white mb-2">Check your email</h3>
              <p className="text-dark-400 text-sm mb-6">We&apos;ve sent a password reset link to <span className="text-white">{email}</span></p>
              <Link href="/auth/login" className="text-pulse-400 hover:text-pulse-300 text-sm font-medium transition-colors">Back to Sign In</Link>
            </div>
          ) : (
            <>
              {error && <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-dark-300 mb-1.5 block">Email address</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="w-full h-12 bg-dark-800 border border-dark-700 rounded-xl pl-10 pr-4 text-sm text-white placeholder:text-dark-500 focus:outline-none focus:border-pulse-500 focus:ring-1 focus:ring-pulse-500 transition-all" />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="w-full h-12 bg-pulse-500 text-white font-medium rounded-xl hover:bg-pulse-600 transition-all disabled:opacity-50">
                  {loading ? <div className="flex items-center justify-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</div> : 'Send Reset Link'}
                </button>
              </form>
              <div className="mt-6 text-center">
                <Link href="/auth/login" className="text-dark-400 hover:text-white text-sm transition-colors">Back to Sign In</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
