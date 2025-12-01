'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types/database';
import { useCart } from '@/stores';
import { getImageUrl } from '@/lib/utils';

interface FeaturedProductCardProps {
  product: Product;
}

export function FeaturedProductCard({ product }: FeaturedProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock > 0) {
      addItem(product, 1);
    }
  };

  const isOnSale = product.compare_at_price && product.compare_at_price > product.price;

  return (
    <Link href={`/products/${product.category}/${product.id}`}>
      <div className="bg-navy-800 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group border border-gold/20">
        {/* Product Image */}
        <div className="relative aspect-[4/3] bg-navy-700">
          <Image
            src={getImageUrl(product.images[0])}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          
          {/* On Sale Badge */}
          {isOnSale && (
            <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
              ON SALE
            </div>
          )}
        </div>

        {/* Product Title */}
        <div className="p-4 text-center">
          <h3 className="text-white font-medium text-lg">
            '{product.title}'
          </h3>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full bg-gold text-navy-900 font-semibold py-3 text-sm uppercase tracking-wide hover:bg-gold-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {product.stock === 0 ? 'Out of Stock' : 'ADD TO CART'}
        </button>
      </div>
    </Link>
  );
}
