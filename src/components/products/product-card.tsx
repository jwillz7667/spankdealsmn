'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import type { Product } from '@/types/database';
import { useCart } from '@/stores';
import { formatCurrency, getImageUrl } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

function StarRating({ rating = 4.5 }: { rating?: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${
            i < fullStars
              ? 'fill-gold text-gold'
              : i === fullStars && hasHalfStar
              ? 'fill-gold/50 text-gold'
              : 'fill-transparent text-gold/30'
          }`}
        />
      ))}
    </div>
  );
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock > 0) {
      addItem(product, 1);
    }
  };

  return (
    <Link href={`/products/${product.category}/${product.id}`}>
      <div className="bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
        {/* Product Image */}
        <div className="relative aspect-square bg-white p-4">
          <Image
            src={getImageUrl(product.images[0])}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain"
          />
        </div>

        {/* Product Info */}
        <div className="p-3 bg-white border-t border-gray-100">
          <h3 className="text-navy-900 font-medium text-sm line-clamp-1 mb-1">
            {product.title}
          </h3>
          
          <StarRating rating={4.5} />
          
          <p className="text-navy-900 font-bold mt-1">
            {formatCurrency(product.price)}
          </p>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full bg-gold text-navy-900 font-semibold py-2.5 text-sm uppercase tracking-wide hover:bg-gold-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {product.stock === 0 ? 'Out of Stock' : 'ADD TO CART'}
        </button>
      </div>
    </Link>
  );
}
