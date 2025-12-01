'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Mail, Lock, Eye, EyeOff, User, Phone } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { signupSchema, type SignupInput } from '@/lib/validators';

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { age_verified: false },
  });

  const onSubmit = async (data: SignupInput) => {
    setIsLoading(true);
    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        toast.error('Supabase environment is not configured.');
        return;
      }

      const supabase = createClient();

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { full_name: data.full_name, phone: data.phone },
        },
      });

      if (authError) {
        toast.error(authError.message);
        return;
      }

      if (authData.user) {
        await supabase.from('profiles').insert({
          id: authData.user.id,
          email: data.email,
          full_name: data.full_name,
          phone: data.phone,
          age_verified: true,
        });
      }

      toast.success('Account created! Please check your email to verify.');
      router.push('/login');
    } catch {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="relative h-16 w-16">
              <Image src="/images/logo-header.png" alt="DankDeals" fill className="object-contain" />
            </div>
            <span className="font-display text-4xl text-gold tracking-wide">DankDeals</span>
          </Link>
        </div>

        <div className="bg-white text-navy-900 rounded-lg border border-gold/30 p-8 shadow-lg">
          <h1 className="font-display text-3xl text-gold text-center mb-2">Create Account</h1>
          <p className="text-center text-gold/70 mb-8">Join DankDeals for premium cannabis delivery</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-gold text-sm mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gold/50" />
                <input
                  placeholder="John Doe"
                  className="w-full bg-white border border-gold/40 rounded py-3 pl-10 pr-4 text-navy-900 placeholder:text-gold/50 focus:outline-none focus:border-gold"
                  {...register('full_name')}
                />
              </div>
              {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>}
            </div>

            <div>
              <label className="block text-gold text-sm mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gold/50" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full bg-white border border-gold/40 rounded py-3 pl-10 pr-4 text-navy-900 placeholder:text-gold/50 focus:outline-none focus:border-gold"
                  {...register('email')}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-gold text-sm mb-2">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gold/50" />
                <input
                  type="tel"
                  placeholder="(612) 555-1234"
                  className="w-full bg-white border border-gold/40 rounded py-3 pl-10 pr-4 text-navy-900 placeholder:text-gold/50 focus:outline-none focus:border-gold"
                  {...register('phone')}
                />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-gold text-sm mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gold/50" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full bg-white border border-gold/40 rounded py-3 pl-10 pr-12 text-navy-900 placeholder:text-gold/50 focus:outline-none focus:border-gold"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gold/50 hover:text-gold"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-gold text-sm mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gold/50" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full bg-white border border-gold/40 rounded py-3 pl-10 pr-4 text-navy-900 placeholder:text-gold/50 focus:outline-none focus:border-gold"
                  {...register('confirmPassword')}
                />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="age_verified"
                className="mt-1 h-4 w-4 rounded border-gold/30 bg-navy-700 text-gold focus:ring-gold"
                {...register('age_verified')}
              />
              <label htmlFor="age_verified" className="text-sm text-gold/70">
                I confirm that I am 21 years of age or older and agree to the{' '}
                <Link href="/terms" className="text-gold hover:text-gold-400">Terms</Link> and{' '}
                <Link href="/privacy" className="text-gold hover:text-gold-400">Privacy Policy</Link>
              </label>
            </div>
            {errors.age_verified && <p className="text-red-500 text-xs">{errors.age_verified.message}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-gold py-3 text-lg disabled:opacity-50"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-gold/70 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-gold hover:text-gold-400">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
