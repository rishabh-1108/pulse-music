'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Music, Loader2 } from 'lucide-react';
import { api } from '@/services/api';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (!token) { setStatus('error'); return; }
    api.post('/auth/verify-email', { token })
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [token]);

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl animated-gradient-bg flex items-center justify-center mb-6 shadow-glow"><Music size={28} className="text-white" /></div>

        {status === 'loading' && <Loader2 size={48} className="mx-auto text-pulse-400 animate-spin mb-4" />}
        {status === 'success' && <CheckCircle size={48} className="mx-auto text-green-400 mb-4" />}
        {status === 'error' && <XCircle size={48} className="mx-auto text-red-400 mb-4" />}

        <h1 className="text-2xl font-bold text-white mb-2">{status === 'loading' ? 'Verifying...' : status === 'success' ? 'Email Verified' : 'Verification Failed'}</h1>
        <p className="text-dark-400 mb-6">{status === 'success' ? 'Your email has been verified. You can now sign in.' : status === 'error' ? 'Invalid or expired verification link.' : 'Please wait while we verify your email.'}</p>

        {status !== 'loading' && (
          <Link href="/auth/login" className="inline-flex h-12 items-center justify-center rounded-xl bg-pulse-500 text-white font-medium px-8 hover:bg-pulse-600 transition-colors">
            Go to Sign In
          </Link>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4">
        <Loader2 size={48} className="text-pulse-400 animate-spin" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
