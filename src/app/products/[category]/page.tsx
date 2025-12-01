import React from 'react';
import { notFound } from 'next/navigation';
import { ProductGrid } from '@/components/products';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { categoryLabels } from '@/lib/utils';

const validCategories = ['flower', 'edibles', 'vapes', 'concentrates', 'prerolls', 'accessories', 'topicals'];

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return validCategories.map((category) => ({ category }));
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category } = await params;
  const label = categoryLabels[category] || category;
  return {
    title: `${label} | DankDeals`,
    description: `Browse our selection of premium ${label.toLowerCase()} products.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;

  if (!validCategories.includes(category)) {
    notFound();
  }

  const label = categoryLabels[category] || category;
  const supabase = await createServerSupabaseClient();

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .eq('category', category)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <div className="min-h-screen bg-navy-900">
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="mb-8">
          <h1 className="font-display text-4xl text-gold tracking-wide uppercase">{label}</h1>
          <p className="mt-2 text-gold/70">Browse our selection of premium {label.toLowerCase()} products</p>
        </div>
        <ProductGrid products={products || []} />
      </div>
    </div>
  );
}
