'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '@/stores';

const navigation = [
  { name: 'SHOP', href: '/products' },
  { name: 'MENU', href: '/menu' },
  { name: 'ABOUT', href: '/about' },
  { name: 'CONTACT', href: '/contact' },
];

export function Header() {
  const { itemCount, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-navy-900 border-b-2 border-gold">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 lg:px-8">
        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-gold p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-10 w-10 lg:h-12 lg:w-12">
            <Image
              src="/images/logo-header.png"
              alt="DankDeals"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="font-display text-2xl lg:text-3xl text-gold tracking-wide">
            DankDeals
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:gap-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="font-display text-xl text-gold tracking-wider hover:text-gold-400 transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Auth + Cart */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/login"
            className="btn-gold-outline py-2 px-4 text-sm"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="btn-gold py-2 px-4 text-sm"
          >
            Sign Up
          </Link>
          <button
            className="relative p-2 text-gold hover:text-gold-400 transition-colors"
            onClick={openCart}
            aria-label="Open cart"
          >
            <ShoppingCart className="h-6 w-6" />
            {itemCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white"
              >
                {itemCount > 99 ? '99+' : itemCount}
              </motion.span>
            )}
          </button>
        </div>

        {/* Mobile Cart */}
        <button
          className="lg:hidden relative p-2 text-gold hover:text-gold-400 transition-colors"
          onClick={openCart}
          aria-label="Open cart"
        >
          <ShoppingCart className="h-6 w-6" />
          {itemCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white"
            >
              {itemCount > 99 ? '99+' : itemCount}
            </motion.span>
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-navy-800 border-t border-gold/30"
          >
            <div className="px-4 py-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 font-display text-xl text-gold tracking-wider hover:text-gold-400 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-gold-outline text-center py-3"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-gold text-center py-3"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
