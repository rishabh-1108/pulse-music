'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Music, Loader2 } from 'lucide-react';

export default function RootPage() {
  const router = useRouter();
  useEffect(() => { router.replace('/home'); }, [router]);

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl animated-gradient-bg flex items-center justify-center mb-4 shadow-glow"><Music size={28} className="text-white" /></div>
        <Loader2 size={24} className="mx-auto text-pulse-400 animate-spin mt-4" />
      </div>
    </div>
  );
}
