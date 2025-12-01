'use client';

import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import { createClient } from '@/lib/supabase/client';
import type { Product, ProductCategory } from '@/types/database';

const fetcher = async (key: string) => {
  const supabase = createClient();
  const url = new URL(key, 'http://localhost');
  
  const category = url.searchParams.get('category');
  const featured = url.searchParams.get('featured');
  const limit = parseInt(url.searchParams.get('limit') || '20');
  
  let query = supabase
    .from('products')
    .select('*')
    .eq('is_active', true);
  
  if (category) query = query.eq('category', category);
  if (featured === 'true') query = query.eq('is_featured', true);
  
  const { data, error } = await query
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data;
};

export function useProducts(options?: {
  category?: ProductCategory;
  featured?: boolean;
  limit?: number;
}) {
  const params = new URLSearchParams();
  if (options?.category) params.set('category', options.category);
  if (options?.featured) params.set('featured', 'true');
  if (options?.limit) params.set('limit', options.limit.toString());
  
  const key = `/api/products?${params.toString()}`;
  
  return useSWR<Product[]>(key, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });
}

export function useProduct(id: string | null) {
  return useSWR<Product>(
    id ? `/api/products/${id}` : null,
    async () => {
      if (!id) return null;
      const supabase = createClient();
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    {
      revalidateOnFocus: false,
    }
  );
}

export function useProductSearch(query: string) {
  return useSWR<Product[]>(
    query ? `/api/products/search?q=${encodeURIComponent(query)}` : null,
    async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .ilike('title', `%${query}%`)
        .limit(20);
      if (error) throw error;
      return data;
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 300,
    }
  );
}
