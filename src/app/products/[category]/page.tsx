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
  const categoryUrl = `https://dankdealsmn.com/products/${category}`;

  const descriptions: Record<string, string> = {
    flower: 'Shop premium cannabis flower for same-day delivery in Minneapolis & St. Paul. Indica, sativa, and hybrid strains available.',
    edibles: 'Browse cannabis-infused edibles including gummies, chocolates, and baked goods. Delivered same-day to your door.',
    vapes: 'Premium cannabis vape cartridges and disposables. Fast, discreet delivery across the Twin Cities.',
    concentrates: 'High-quality cannabis concentrates, wax, shatter, and dabs. Professional-grade products delivered same-day.',
    prerolls: 'Ready-to-smoke pre-rolled joints. Premium flower in convenient packaging with same-day delivery.',
    accessories: 'Cannabis accessories, pipes, papers, and more. Complete your setup with same-day delivery.',
    topicals: 'Cannabis-infused topicals, lotions, and balms for localized relief. Delivered to your door.',
  };

  return {
    title: `${label} - Cannabis Delivery Minneapolis | DankDeals`,
    description: descriptions[category] || `Browse our selection of premium ${label.toLowerCase()} products for same-day cannabis delivery.`,
    alternates: {
      canonical: categoryUrl,
    },
    openGraph: {
      title: `${label} - DankDeals`,
      description: descriptions[category] || `Premium ${label.toLowerCase()} products delivered same-day.`,
      url: categoryUrl,
      type: 'website',
      images: [
        {
          url: `/images/products/${category}-hero.png`,
          width: 1200,
          height: 630,
          alt: `${label} Cannabis Products`,
        },
      ],
    },
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
