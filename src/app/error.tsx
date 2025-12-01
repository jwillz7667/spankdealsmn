'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="font-display text-6xl text-gold mb-4">Oops!</h1>
        <h2 className="text-xl text-white mb-4">Something went wrong</h2>
        <p className="text-gold/70 mb-8">We're sorry, an error occurred. Please try again.</p>
        <button onClick={reset} className="btn-gold py-3 px-6">Try Again</button>
      </div>
    </div>
  );
}
