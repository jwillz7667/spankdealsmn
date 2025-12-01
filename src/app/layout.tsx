import type { Metadata, Viewport } from 'next';
import { Inter, Bebas_Neue } from 'next/font/google';
import { Toaster } from 'sonner';
import { Analytics } from '@vercel/analytics/react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CartDrawer } from '@/components/cart';
import { AuthProvider } from '@/components/providers';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'DankDeals | Twin Cities Premium Cannabis Delivery',
    template: '%s | DankDeals',
  },
  description:
    'Same-day cannabis delivery serving Minneapolis, St. Paul, and surrounding suburbs. Premium flower, edibles, vapes, and more. Must be 21+.',
  keywords: [
    'cannabis delivery',
    'minneapolis cannabis',
    'st paul weed',
    'twin cities dispensary',
    'same day weed delivery',
    'minnesota cannabis',
  ],
  authors: [{ name: 'DankDeals' }],
  creator: 'DankDeals',
  publisher: 'DankDeals',
  metadataBase: new URL('https://dankdealsmn.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://dankdealsmn.com',
    siteName: 'DankDeals',
    title: 'DankDeals | Twin Cities Premium Cannabis Delivery',
    description: 'Same-day cannabis delivery in the Twin Cities. Must be 21+.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'DankDeals - Premium Cannabis Delivery',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DankDeals | Twin Cities Premium Cannabis Delivery',
    description: 'Same-day cannabis delivery in the Twin Cities. Must be 21+.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#0a0f1a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${bebasNeue.variable}`}>
      <body className="min-h-screen bg-navy-900 font-sans text-white">
        <AuthProvider>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <CartDrawer />
          <Toaster
            position="bottom-right"
            toastOptions={{
              classNames: {
                toast: 'bg-navy-800 border-gold/30 text-white',
                title: 'text-white',
                description: 'text-gold-200',
              },
            }}
          />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
