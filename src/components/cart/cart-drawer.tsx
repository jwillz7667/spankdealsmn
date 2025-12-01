'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingCart, Trash2 } from 'lucide-react';
import { useCart } from '@/stores';
import { formatCurrency, getImageUrl } from '@/lib/utils';

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, itemCount } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-navy-800 shadow-2xl border-l border-gold/30"
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gold/30 px-6 py-4">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-gold" />
                  <h2 className="text-lg font-semibold text-white">Your Cart</h2>
                  {itemCount > 0 && (
                    <span className="rounded-full bg-gold px-2 py-0.5 text-xs font-bold text-navy-900">
                      {itemCount}
                    </span>
                  )}
                </div>
                <button
                  onClick={closeCart}
                  className="p-2 text-gold hover:text-gold-400 transition-colors"
                  aria-label="Close cart"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <ShoppingCart className="mb-4 h-16 w-16 text-gold/30" />
                    <h3 className="text-lg font-medium text-white">Your cart is empty</h3>
                    <p className="mt-1 text-sm text-gold/70">
                      Add some products to get started
                    </p>
                    <button
                      onClick={closeCart}
                      className="mt-6 btn-gold py-2 px-6"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {items.map((item) => (
                      <motion.li
                        key={item.productId}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex gap-4 rounded-lg bg-navy-700/50 p-3 border border-gold/10"
                      >
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-white">
                          <Image
                            src={getImageUrl(item.product.images[0])}
                            alt={item.product.title}
                            fill
                            className="object-contain p-2"
                            sizes="80px"
                          />
                        </div>

                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-white line-clamp-2">
                              {item.product.title}
                            </h4>
                            <p className="text-sm text-gold font-semibold mt-0.5">
                              {formatCurrency(item.product.price)}
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                className="h-7 w-7 flex items-center justify-center rounded border border-gold/30 text-gold hover:bg-gold/10 transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-8 text-center text-sm text-white">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                disabled={item.quantity >= item.product.stock}
                                className="h-7 w-7 flex items-center justify-center rounded border border-gold/30 text-gold hover:bg-gold/10 transition-colors disabled:opacity-50"
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>

                            <button
                              onClick={() => removeItem(item.productId)}
                              className="h-7 w-7 flex items-center justify-center text-gold/50 hover:text-red-500 transition-colors"
                              aria-label="Remove item"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t border-gold/30 p-6">
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gold/70">Subtotal</span>
                      <span className="font-medium text-white">{formatCurrency(subtotal)}</span>
                    </div>
                    <p className="text-xs text-gold/50">
                      Taxes and delivery calculated at checkout
                    </p>
                  </div>

                  <Link href="/checkout" onClick={closeCart}>
                    <button className="w-full btn-gold py-3 text-lg">
                      Checkout • {formatCurrency(subtotal)}
                    </button>
                  </Link>

                  <button
                    className="w-full mt-2 btn-gold-outline py-2"
                    onClick={closeCart}
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
