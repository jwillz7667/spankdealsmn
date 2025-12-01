/** Client form for waitlist opt-ins */
'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export function WaitlistForm() {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        const message =
          typeof data?.error === 'string'
            ? data.error
            : 'Could not save your info. Please try again.';
        toast.error(message);
        return;
      }

      toast.success('You are on the list! We will text you when we open.');
      setPhone('');
      setEmail('');
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3 max-w-xl w-full">
      <div className="flex flex-col gap-2">
        <label className="text-sm text-gold/80">Phone (required)</label>
        <input
          required
          pattern="^[+0-9\\s().-]{7,32}$"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="(612) 555-1234"
          className="w-full rounded-lg border border-gold/30 bg-white/95 px-4 py-3 text-navy-900 placeholder:text-navy-400 focus:outline-none focus:border-gold"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm text-gold/60">Email (optional)</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-lg border border-gold/20 bg-white/80 px-4 py-3 text-navy-900 placeholder:text-navy-400 focus:outline-none focus:border-gold"
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-gold py-3 text-lg font-semibold disabled:opacity-60"
      >
        {isSubmitting ? 'Saving...' : 'Join the Waitlist'}
      </button>
      <p className="text-sm text-white/70">
        We’ll only contact you about launch updates and offers. You can opt out anytime.
      </p>
    </form>
  );
}
