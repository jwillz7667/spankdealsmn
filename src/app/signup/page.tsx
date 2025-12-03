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
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);

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

  const handleOAuthSignup = async (provider: 'google') => {
    setIsOAuthLoading(true);
    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            redirect_to: '/',
          },
        },
      });

      if (error) {
        toast.error(error.message);
      }
    } catch (err) {
      toast.error('Failed to sign up with Google');
    } finally {
      setIsOAuthLoading(false);
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
          <h1 className="font-display text-3xl text-black text-center mb-2">Create Account</h1>
          <p className="text-center text-black/70 mb-8">Join DankDeals for premium cannabis delivery</p>

          {/* OAuth */}
          <button
            onClick={() => handleOAuthSignup('google')}
            disabled={isOAuthLoading}
            className="w-full btn-gold-outline py-3 mb-6 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {isOAuthLoading ? 'Signing up...' : 'Continue with Google'}
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gold/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-navy-800 px-2 text-gold/50">Or continue with</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-black text-sm mb-2">Full Name</label>
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
              <label className="block text-black text-sm mb-2">Email</label>
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
              <label className="block text-black text-sm mb-2">Phone</label>
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
              <label className="block text-black text-sm mb-2">Password</label>
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
              <label className="block text-black text-sm mb-2">Confirm Password</label>
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
              <label htmlFor="age_verified" className="text-sm text-black/70">
                I confirm that I am 21 years of age or older and agree to the{' '}
                <Link href="/terms" className="text-gold hover:text-gold-400 font-semibold">Terms</Link> and{' '}
                <Link href="/privacy" className="text-gold hover:text-gold-400 font-semibold">Privacy Policy</Link>
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

          <p className="text-center text-black/70 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-gold hover:text-gold-400 font-semibold">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
