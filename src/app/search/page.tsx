'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { ProductGrid } from '@/components/products';
import type { Product } from '@/types/database';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(query);

  useEffect(() => {
    if (!query) return;
    
    const searchProducts = async () => {
      setIsLoading(true);
      const supabase = createClient();
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .ilike('title', `%${query}%`)
        .limit(24);
      setProducts(data || []);
      setIsLoading(false);
    };

    searchProducts();
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchTerm.trim())}`;
    }
  };

  return (
    <div className="min-h-screen bg-navy-900">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <h1 className="font-display text-4xl text-gold mb-8">SEARCH</h1>
        
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gold/50" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-navy-800 border border-gold/30 rounded-lg py-4 pl-12 pr-4 text-white placeholder:text-gold/30 focus:outline-none focus:border-gold"
            />
          </div>
        </form>

        {query && (
          <p className="text-gold/70 mb-6">
            {isLoading ? 'Searching...' : `${products.length} results for "${query}"`}
          </p>
        )}

        <ProductGrid products={products} isLoading={isLoading} />
      </div>
    </div>
  );
}
