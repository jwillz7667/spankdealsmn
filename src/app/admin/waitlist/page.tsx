'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Send, Users, Calendar } from 'lucide-react';
import { formatPhoneNumber } from '@/lib/phone-utils';
import { formatDateOnly } from '@/lib/utils';

interface WaitlistEntry {
  id: string;
  phone: string;
  email: string | null;
  source: string | null;
  created_at: string;
}

interface WaitlistStats {
  total: number;
  entries: WaitlistEntry[];
}

export default function AdminWaitlistPage() {
  const [stats, setStats] = useState<WaitlistStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState<'all' | string[]>('all');

  useEffect(() => {
    fetchWaitlist();
  }, []);

  const fetchWaitlist = async () => {
    try {
      const response = await fetch('/api/admin/sms');
      if (!response.ok) throw new Error('Failed to fetch waitlist');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch waitlist:', error);
      toast.error('Failed to load waitlist');
    } finally {
      setLoading(false);
    }
  };

  const handleSendSMS = async () => {
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    if (message.length > 1600) {
      toast.error('Message is too long (max 1600 characters)');
      return;
    }

    if (selectedRecipients !== 'all' && selectedRecipients.length === 0) {
      toast.error('Please select at least one recipient');
      return;
    }

    setSending(true);

    try {
      const response = await fetch('/api/admin/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          recipients: selectedRecipients,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send SMS');
      }

      toast.success(data.message || 'SMS sent successfully');
      setMessage('');
      setSelectedRecipients('all');
    } catch (error) {
      console.error('Failed to send SMS:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send SMS');
    } finally {
      setSending(false);
    }
  };

  const handleSelectAll = () => {
    setSelectedRecipients('all');
  };

  const handleToggleRecipient = (phone: string) => {
    setSelectedRecipients((prev) => {
      if (prev === 'all') {
        // Switch to individual selection, deselecting this one
        return stats?.entries.map((e) => e.phone).filter((p) => p !== phone) || [];
      }

      if (prev.includes(phone)) {
        return prev.filter((p) => p !== phone);
      } else {
        return [...prev, phone];
      }
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gold">Loading...</div>
      </div>
    );
  }

  const recipientCount =
    selectedRecipients === 'all'
      ? stats?.total || 0
      : selectedRecipients.length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl text-gold">Waitlist Management</h1>
        <p className="mt-2 text-gold/70">Send SMS updates to waitlist subscribers</p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-gold/30 bg-navy-800 p-6">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-gold" />
            <div>
              <p className="text-2xl font-bold text-white">{stats?.total || 0}</p>
              <p className="text-sm text-gold/70">Total Subscribers</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gold/30 bg-navy-800 p-6">
          <div className="flex items-center gap-3">
            <Send className="h-8 w-8 text-gold" />
            <div>
              <p className="text-2xl font-bold text-white">{recipientCount}</p>
              <p className="text-sm text-gold/70">Selected Recipients</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gold/30 bg-navy-800 p-6">
          <div className="flex items-center gap-3">
            <Calendar className="h-8 w-8 text-gold" />
            <div>
              <p className="text-2xl font-bold text-white">
                {stats?.entries?.[0]
                  ? formatDateOnly(stats.entries[0].created_at)
                  : 'N/A'}
              </p>
              <p className="text-sm text-gold/70">Latest Signup</p>
            </div>
          </div>
        </div>
      </div>

      {/* SMS Composer */}
      <div className="mb-8 rounded-lg border border-gold/30 bg-navy-800 p-6">
        <h2 className="mb-4 text-xl font-semibold text-gold">Compose SMS</h2>

        <div className="mb-4">
          <label htmlFor="message" className="mb-2 block text-sm text-gold/70">
            Message ({message.length}/1600 characters)
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message... (e.g., 'DankDeals is now live! Use code WELCOME10 for 10% off your first order.')"
            className="w-full rounded-lg border border-gold/30 bg-navy-900 p-3 text-white placeholder:text-white/40 focus:border-gold focus:outline-none"
            rows={6}
            maxLength={1600}
          />
        </div>

        <div className="mb-4 flex items-center gap-4">
          <button
            type="button"
            onClick={handleSelectAll}
            className={`rounded px-4 py-2 text-sm ${
              selectedRecipients === 'all'
                ? 'bg-gold text-navy-900'
                : 'border border-gold/30 text-gold hover:bg-gold/10'
            }`}
          >
            Select All ({stats?.total || 0})
          </button>

          <span className="text-sm text-gold/70">
            or select individual recipients below
          </span>
        </div>

        <button
          onClick={handleSendSMS}
          disabled={sending || !message.trim()}
          className="flex items-center gap-2 rounded-lg bg-gold px-6 py-3 font-semibold text-navy-900 hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send className="h-5 w-5" />
          {sending ? 'Sending...' : `Send to ${recipientCount} recipient(s)`}
        </button>
      </div>

      {/* Waitlist Entries */}
      <div className="rounded-lg border border-gold/30 bg-navy-800 p-6">
        <h2 className="mb-4 text-xl font-semibold text-gold">
          Subscribers ({stats?.total || 0})
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gold/20 text-left text-sm text-gold/70">
                <th className="pb-3 pr-4">
                  <input
                    type="checkbox"
                    checked={selectedRecipients === 'all'}
                    onChange={handleSelectAll}
                    className="h-4 w-4 accent-gold"
                  />
                </th>
                <th className="pb-3 pr-4">Phone</th>
                <th className="pb-3 pr-4">Email</th>
                <th className="pb-3 pr-4">Source</th>
                <th className="pb-3">Signed Up</th>
              </tr>
            </thead>
            <tbody>
              {stats?.entries.map((entry) => {
                const isSelected =
                  selectedRecipients === 'all' ||
                  selectedRecipients.includes(entry.phone);

                return (
                  <tr
                    key={entry.id}
                    className="border-b border-gold/10 text-sm text-white/90"
                  >
                    <td className="py-3 pr-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleRecipient(entry.phone)}
                        className="h-4 w-4 accent-gold"
                      />
                    </td>
                    <td className="py-3 pr-4 font-mono">
                      {formatPhoneNumber(entry.phone)}
                    </td>
                    <td className="py-3 pr-4">{entry.email || '-'}</td>
                    <td className="py-3 pr-4 capitalize">{entry.source || 'website'}</td>
                    <td className="py-3">{formatDateOnly(entry.created_at)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {(!stats?.entries || stats.entries.length === 0) && (
            <div className="py-8 text-center text-gold/50">
              No waitlist entries yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
