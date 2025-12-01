import React from 'react';
import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ProductCard } from '@/components/products/product-card';
import { categoryLabels } from '@/lib/utils';

export const metadata = {
  title: 'Menu',
  description: 'Browse our full cannabis menu - flower, edibles, concentrates, and more.',
};

export default async function MenuPage() {
  const supabase = await createServerSupabaseClient();
  
  const categories = ['flower', 'edibles', 'vapes', 'concentrates', 'prerolls', 'topicals'];
  
  const productsByCategory: Record<string, any[]> = {};
  
  for (const category of categories) {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .eq('category', category)
      .order('is_featured', { ascending: false })
      .limit(4);
    productsByCategory[category] = data || [];
  }

  return (
    <div className="min-h-screen bg-navy-900">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <h1 className="font-display text-5xl text-gold mb-4">OUR MENU</h1>
        <p className="text-gold/70 mb-12 max-w-2xl">
          Browse our curated selection of premium cannabis products. All items are lab-tested and sourced from top-tier growers.
        </p>
        
        {categories.map((category) => {
          const products = productsByCategory[category];
          if (products.length === 0) return null;
          
          return (
            <section key={category} className="mb-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="section-header">{categoryLabels[category] || category}</h2>
                <Link 
                  href={`/products/${category}`} 
                  className="text-gold hover:text-gold-400 text-sm transition-colors"
                >
                  View All →
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
