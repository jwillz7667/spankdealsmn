import { WaitlistForm } from '@/components/waitlist/waitlist-form';

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-navy-900 via-navy-950 to-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(201,165,77,0.15),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(201,165,77,0.08),_transparent_45%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-4 py-16 text-center">
        <p className="text-gold/80 font-semibold tracking-[0.2em] uppercase">Grand Opening</p>
        <h1 className="mt-4 font-display text-4xl leading-tight text-white md:text-6xl">
          Coming Soon to the Twin Cities
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-white/80 md:text-xl">
          DankDeals is almost here. Be the first to get launch updates, exclusive opening-day offers,
          and same-day delivery windows when we go live.
        </p>
        <WaitlistForm />
        <div className="mt-10 grid gap-4 text-left sm:grid-cols-2">
          <div className="rounded-lg border border-gold/30 bg-white/5 p-4 backdrop-blur">
            <p className="text-gold font-semibold">Early access perks</p>
            <p className="text-white/75 text-sm">Opening-week promos and priority delivery slots.</p>
          </div>
          <div className="rounded-lg border border-gold/30 bg-white/5 p-4 backdrop-blur">
            <p className="text-gold font-semibold">Local delivery focus</p>
            <p className="text-white/75 text-sm">Same-day drop-offs across Minneapolis & St. Paul.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
