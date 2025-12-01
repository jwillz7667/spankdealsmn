'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Leaf, Droplets, Sparkles, Brain } from 'lucide-react';
import type { Product } from '@/types/database';
import { useCart } from '@/stores';
import { formatCurrency, getImageUrl, strainTypeLabels } from '@/lib/utils';

interface ProductDetailClientProps {
  product: Product;
  relatedProducts?: Product[];
}

export function ProductDetailClient({ product, relatedProducts = [] }: ProductDetailClientProps) {
  const { items, addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const cartItem = items.find((item) => item.productId === product.id);
  const cartQuantity = cartItem?.quantity || 0;
  const maxQuantity = product.stock - cartQuantity;

  const handleAddToCart = () => {
    if (maxQuantity > 0) {
      addItem(product, quantity);
      setQuantity(1);
    }
  };

  return (
    <div className="min-h-screen bg-navy-900">
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Product Image */}
          <div className="relative aspect-square rounded-lg overflow-hidden bg-navy-800 border border-gold/20">
            <Image
              src={getImageUrl(product.images[0])}
              alt={product.title}
              fill
              className="object-cover"
              priority
            />
            {/* Watermark Logo */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
              <div className="relative w-64 h-64">
                <Image
                  src="/images/logo-watermark.png"
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <h1 className="font-display text-4xl md:text-5xl text-gold tracking-wide">
              {product.title}
            </h1>
            
            <p className="text-2xl text-white mt-2">
              {formatCurrency(product.price)}
            </p>

            {product.description && (
              <p className="text-white/80 mt-4 leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Product Specs */}
            <div className="mt-6 space-y-3">
              {product.thc_potency && (
                <div className="flex items-center gap-3 text-white">
                  <Leaf className="h-5 w-5 text-gold" />
                  <span className="text-gold">THC:</span>
                  <span>{product.thc_potency}%</span>
                </div>
              )}
              {product.cbd_potency && (
                <div className="flex items-center gap-3 text-white">
                  <Droplets className="h-5 w-5 text-gold" />
                  <span className="text-gold">CBD:</span>
                  <span>&lt;{product.cbd_potency}%</span>
                </div>
              )}
              {product.strain_type && (
                <>
                  <div className="flex items-center gap-3 text-white">
                    <Sparkles className="h-5 w-5 text-gold" />
                    <span className="text-gold">Terpenes:</span>
                    <span>Myrcene, Pinene</span>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <Brain className="h-5 w-5 text-gold" />
                    <span className="text-gold">Effects:</span>
                    <span>Euphoric, Creative, Relaxed</span>
                  </div>
                </>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              {/* Quantity Selector */}
              <div className="flex items-center border border-gold rounded overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="px-4 py-3 text-gold hover:bg-gold/10 transition-colors disabled:opacity-50"
                >
                  <Minus className="h-5 w-5" />
                </button>
                <span className="px-6 py-3 text-white text-xl font-medium min-w-[60px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                  disabled={quantity >= maxQuantity}
                  className="px-4 py-3 text-gold hover:bg-gold/10 transition-colors disabled:opacity-50"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={maxQuantity <= 0}
                className="flex-1 bg-gold text-navy-900 font-semibold py-3 px-8 rounded text-lg uppercase tracking-wide hover:bg-gold-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {maxQuantity <= 0 ? 'Out of Stock' : 'ADD TO CART'}
              </button>
            </div>

            {cartQuantity > 0 && (
              <p className="mt-3 text-gold/70 text-sm">
                You have {cartQuantity} of this item in your cart
              </p>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-2xl text-gold uppercase tracking-wide mb-6">
              RELATED PRODUCTS
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.slice(0, 4).map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/products/${relatedProduct.category}/${relatedProduct.id}`}
                  className="bg-white rounded-lg overflow-hidden hover:shadow-xl transition-all"
                >
                  <div className="relative aspect-square bg-white p-4">
                    <Image
                      src={getImageUrl(relatedProduct.images[0])}
                      alt={relatedProduct.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="p-3 text-center">
                    <h3 className="text-navy-900 font-medium text-sm line-clamp-1">
                      {relatedProduct.title}
                    </h3>
                    <p className="text-navy-900/70 text-sm">
                      {formatCurrency(relatedProduct.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
