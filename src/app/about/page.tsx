import Image from 'next/image';
import { MapPin, Clock, Shield, Truck } from 'lucide-react';

export const metadata = {
  title: 'About Us',
  description: 'Learn about DankDeals - Twin Cities premier cannabis delivery service.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-navy-900">
      <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
        <h1 className="font-display text-5xl text-gold mb-8">ABOUT DANKDEALS</h1>
        
        <div className="prose prose-invert prose-gold max-w-none">
          <p className="text-xl text-white/90 mb-8">
            DankDeals is the Twin Cities' premier cannabis delivery service, bringing top-tier flower, edibles, concentrates, and more directly to your door.
          </p>
          
          <div className="grid gap-6 md:grid-cols-2 mb-12">
            {[
              { icon: Truck, title: 'Same Day Delivery', desc: 'Order by 7 PM for same-day delivery throughout Minneapolis and St. Paul.' },
              { icon: Shield, title: 'Lab Tested', desc: 'All products are third-party lab tested for potency and purity.' },
              { icon: Clock, title: '1-Hour Windows', desc: 'Choose your delivery time with convenient 1-hour delivery windows.' },
              { icon: MapPin, title: 'Local Service', desc: 'Proudly serving Minneapolis, St. Paul, and surrounding suburbs.' },
            ].map((item) => (
              <div key={item.title} className="bg-navy-800 border border-gold/20 rounded-lg p-6">
                <item.icon className="h-8 w-8 text-gold mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gold/70">{item.desc}</p>
              </div>
            ))}
          </div>
          
          <h2 className="font-display text-3xl text-gold mb-4">OUR MISSION</h2>
          <p className="text-white/80 mb-8">
            We believe everyone deserves access to high-quality cannabis products. Our mission is to provide a convenient, discreet, and reliable delivery service that prioritizes product quality and customer satisfaction.
          </p>
          
          <h2 className="font-display text-3xl text-gold mb-4">COMPLIANCE</h2>
          <p className="text-white/80">
            DankDeals operates in full compliance with Minnesota state cannabis regulations. All customers must be 21 years of age or older and verify their identity upon delivery.
          </p>
        </div>
      </div>
    </div>
  );
}
