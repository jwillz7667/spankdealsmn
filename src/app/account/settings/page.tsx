'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { User, Mail, Phone, Bell, Save } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores';
import type { Profile } from '@/types/database';

const settingsSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email').nullable().optional(),
  phone: z.string().regex(/^\+?1?\s*\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/, 'Please enter a valid phone number').nullable().optional(),
  notification_email: z.boolean(),
  notification_sms: z.boolean(),
  marketing_emails: z.boolean(),
});

type SettingsInput = z.infer<typeof settingsSchema>;

export default function AccountSettingsPage() {
  const router = useRouter();
  const { user, profile } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SettingsInput>({
    resolver: zodResolver(settingsSchema),
  });

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/account/settings');
      return;
    }

    const loadProfile = async () => {
      setIsLoading(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          const profile = data as Profile;
          setValue('full_name', profile.full_name || '');
          setValue('email', profile.email || '');
          setValue('phone', profile.phone || '');
          setValue('notification_email', profile.notification_email ?? true);
          setValue('notification_sms', profile.notification_sms ?? true);
          setValue('marketing_emails', profile.marketing_emails ?? false);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user, router, setValue]);

  const onSubmit = async (data: SettingsInput) => {
    if (!user) return;

    setIsSaving(true);
    try {
      const supabase = createClient();

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: data.full_name,
          email: data.email || null,
          phone: data.phone || null,
          notification_email: data.notification_email,
          notification_sms: data.notification_sms,
          marketing_emails: data.marketing_emails,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      toast.success('Settings saved successfully!');

      // Refresh profile in store
      const { data: updatedProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (updatedProfile) {
        useAuthStore.getState().setProfile(updatedProfile as Profile);
      }
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast.error(error.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="text-gold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-900 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-navy-800 rounded-lg border border-gold/30 p-8">
          <h1 className="font-display text-3xl text-gold mb-6">Account Settings</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h2 className="text-xl text-gold/90 font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </h2>

              <div>
                <label className="block text-gold text-sm mb-2">Full Name *</label>
                <input
                  type="text"
                  className="w-full bg-navy-700 border border-gold/40 rounded py-3 px-4 text-white placeholder:text-gold/50 focus:outline-none focus:border-gold"
                  placeholder="John Doe"
                  {...register('full_name')}
                />
                {errors.full_name && (
                  <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-gold text-sm mb-2">
                  <Mail className="inline h-4 w-4 mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  className="w-full bg-navy-700 border border-gold/40 rounded py-3 px-4 text-white placeholder:text-gold/50 focus:outline-none focus:border-gold"
                  placeholder="you@example.com"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
                <p className="text-gold/60 text-xs mt-1">
                  Leave blank if signed up with phone only
                </p>
              </div>

              <div>
                <label className="block text-gold text-sm mb-2">
                  <Phone className="inline h-4 w-4 mr-1" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="w-full bg-navy-700 border border-gold/40 rounded py-3 px-4 text-white placeholder:text-gold/50 focus:outline-none focus:border-gold"
                  placeholder="(612) 555-1234"
                  {...register('phone')}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                )}
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="space-y-4 pt-6 border-t border-gold/20">
              <h2 className="text-xl text-gold/90 font-semibold flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </h2>

              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 h-5 w-5 rounded border-gold/30 bg-navy-700 text-gold focus:ring-gold"
                    {...register('notification_email')}
                  />
                  <div className="flex-1">
                    <div className="text-white font-medium">Email Notifications</div>
                    <div className="text-gold/60 text-sm">
                      Receive order updates and delivery notifications via email
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 h-5 w-5 rounded border-gold/30 bg-navy-700 text-gold focus:ring-gold"
                    {...register('notification_sms')}
                  />
                  <div className="flex-1">
                    <div className="text-white font-medium">SMS Notifications</div>
                    <div className="text-gold/60 text-sm">
                      Receive order updates and delivery notifications via text message
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 h-5 w-5 rounded border-gold/30 bg-navy-700 text-gold focus:ring-gold"
                    {...register('marketing_emails')}
                  />
                  <div className="flex-1">
                    <div className="text-white font-medium">Marketing Emails</div>
                    <div className="text-gold/60 text-sm">
                      Receive promotional offers, new product announcements, and special deals
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full btn-gold py-3 text-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save className="h-5 w-5" />
                {isSaving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
