import Image from 'next/image';
import { WaitlistForm } from '@/components/waitlist/waitlist-form';

export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'DankDeals',
    description: 'Premium cannabis delivery service in Minneapolis and St. Paul, Minnesota',
    image: 'https://dankdealsmn.com/og-image.jpg',
    '@id': 'https://dankdealsmn.com',
    url: 'https://dankdealsmn.com',
    telephone: '',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Minneapolis',
      addressRegion: 'MN',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 44.9778,
      longitude: -93.2650,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '09:00',
      closes: '21:00',
    },
    servesCuisine: 'Cannabis Products',
    areaServed: [
      {
        '@type': 'City',
        name: 'Minneapolis',
      },
      {
        '@type': 'City',
        name: 'St. Paul',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="relative min-h-screen overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-bg.jpg"
            alt="DankDeals Background"
            fill
            className="object-cover"
            priority
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-4 py-16 text-center">
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
    </>
  );
}
