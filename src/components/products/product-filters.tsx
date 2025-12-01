'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const categories = [
  { id: 'flower', label: 'Flower' },
  { id: 'edibles', label: 'Edibles' },
  { id: 'vapes', label: 'Cannabis' },
  { id: 'concentrates', label: 'Concentrates' },
];

const potencyRanges = [
  { id: '0-10', label: '<10%' },
  { id: '10-15', label: '10% - 15%' },
  { id: '15-20', label: '15% - 20%' },
  { id: '20-25', label: '20% - 25%' },
  { id: '25+', label: 'All Out+' },
];

export function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get(key) === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-lg p-4 space-y-6">
      {/* Category Filter */}
      <div>
        <h3 className="text-navy-900 font-semibold mb-3">CATEGORY</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={searchParams.get('category') === category.id}
                onChange={() => updateFilter('category', category.id)}
                className="w-4 h-4 border-2 border-gold rounded text-gold focus:ring-gold"
              />
              <span className="text-navy-900 text-sm">{category.label}</span>
            </label>
          ))}
          <button className="text-gold text-sm hover:text-gold-600 transition-colors">
            More...
          </button>
        </div>
      </div>

      {/* Potency Filter */}
      <div>
        <h3 className="text-navy-900 font-semibold mb-3">POTENCY</h3>
        <div className="space-y-2">
          {potencyRanges.map((range) => (
            <label key={range.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={searchParams.get('potency') === range.id}
                onChange={() => updateFilter('potency', range.id)}
                className="w-4 h-4 border-2 border-gold rounded text-gold focus:ring-gold"
              />
              <span className="text-navy-900 text-sm">{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Slider */}
      <div>
        <h3 className="text-navy-900 font-semibold mb-3">PRICE</h3>
        <div className="px-2">
          <input
            type="range"
            min="0"
            max="200"
            defaultValue="200"
            className="w-full h-2 bg-gold/30 rounded-lg appearance-none cursor-pointer accent-gold"
          />
          <div className="flex justify-between text-navy-900 text-sm mt-2">
            <span>$0</span>
            <span>$200</span>
          </div>
        </div>
      </div>
    </div>
  );
}
