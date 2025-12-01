import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="font-display text-8xl text-gold mb-4">404</h1>
        <h2 className="text-2xl text-white mb-4">Page Not Found</h2>
        <p className="text-gold/70 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link href="/" className="btn-gold py-3 px-6">Go Home</Link>
      </div>
    </div>
  );
}
