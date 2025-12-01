'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success('Message sent! We\'ll get back to you soon.');
    (e.target as HTMLFormElement).reset();
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-navy-900">
      <div className="mx-auto max-w-6xl px-4 py-12 lg:px-8">
        <h1 className="font-display text-5xl text-gold mb-8">CONTACT US</h1>
        
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <p className="text-white/80 mb-8">
              Have questions? We're here to help. Reach out to our team and we'll get back to you as soon as possible.
            </p>
            
            <div className="space-y-4">
              {[
                { icon: Phone, label: 'Phone', value: '(612) 555-DANK' },
                { icon: Mail, label: 'Email', value: 'support@dankdealsmn.com' },
                { icon: MapPin, label: 'Service Area', value: 'Minneapolis, St. Paul & Suburbs' },
                { icon: Clock, label: 'Hours', value: 'Daily 10AM - 9PM' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gold/20 flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-gold/70 text-sm">{item.label}</p>
                    <p className="text-white">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-navy-800 border border-gold/20 rounded-lg p-6">
            <h2 className="font-display text-2xl text-gold mb-4">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gold text-sm mb-2">Name</label>
                <input required className="w-full bg-navy-700 border border-gold/30 rounded py-3 px-4 text-white placeholder:text-gold/30 focus:outline-none focus:border-gold" />
              </div>
              <div>
                <label className="block text-gold text-sm mb-2">Email</label>
                <input type="email" required className="w-full bg-navy-700 border border-gold/30 rounded py-3 px-4 text-white placeholder:text-gold/30 focus:outline-none focus:border-gold" />
              </div>
              <div>
                <label className="block text-gold text-sm mb-2">Message</label>
                <textarea rows={4} required className="w-full bg-navy-700 border border-gold/30 rounded py-3 px-4 text-white placeholder:text-gold/30 focus:outline-none focus:border-gold resize-none" />
              </div>
              <button type="submit" disabled={isLoading} className="w-full btn-gold py-3 disabled:opacity-50">
                {isLoading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
