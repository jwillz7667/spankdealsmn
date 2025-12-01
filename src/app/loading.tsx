export default function Loading() {
  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gold/30 border-t-gold" />
        <p className="text-gold">Loading...</p>
      </div>
    </div>
  );
}
