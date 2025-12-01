import React, { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ProductCard } from '@/components/products/product-card';
import { FeaturedProductCard } from '@/components/products/featured-product-card';
import { ProductFilters } from '@/components/products/product-filters';

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    strain?: string;
    featured?: string;
  }>;
}

export const metadata = {
  title: 'Shop All Products',
  description: 'Browse our full selection of premium cannabis products.',
};

async function ProductsContent({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const supabase = await createServerSupabaseClient();

  // Featured products
  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(2);

  // All products query
  let query = supabase
    .from('products')
    .select('*')
    .eq('is_active', true);

  if (params.category) {
    query = query.eq('category', params.category);
  }

  if (params.strain) {
    query = query.eq('strain_type', params.strain);
  }

  switch (params.sort) {
    case 'price_asc':
      query = query.order('price', { ascending: true });
      break;
    case 'price_desc':
      query = query.order('price', { ascending: false });
      break;
    default:
      query = query.order('created_at', { ascending: false });
  }

  const { data: products } = await query.limit(50);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-3">
        {/* Featured Products */}
        {featuredProducts && featuredProducts.length > 0 && (
          <section className="mb-12">
            <h2 className="section-header mb-6">FEATURED PRODUCTS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredProducts.map((product) => (
                <FeaturedProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* All Products */}
        <section>
          <h2 className="section-header mb-6">SHOP ALL TOP-TIER PRODUCTS</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-1 order-first lg:order-last">
        {/* Top Products Mini Grid */}
        <div className="bg-white rounded-lg p-4 mb-6">
          <h3 className="text-navy-900 font-semibold mb-4">SHOP ALL TOP-TIER PRODUCTS</h3>
          <div className="grid grid-cols-3 gap-2">
            {products?.slice(0, 3).map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.category}/${product.id}`}
                className="bg-gray-50 rounded p-2 text-center hover:shadow transition-shadow"
              >
                <div className="relative aspect-square mb-1">
                  <Image
                    src={product.images[0] || '/images/placeholder.jpg'}
                    alt={product.title}
                    fill
                    className="object-contain"
                    sizes="80px"
                  />
                </div>
                <p className="text-navy-900 text-[10px] line-clamp-1">{product.title}</p>
                <p className="text-navy-900 text-xs font-bold">${product.price}</p>
                <button className="w-full bg-gold text-navy-900 text-[8px] py-1 mt-1 rounded font-semibold">
                  ADD TO CART
                </button>
              </Link>
            ))}
          </div>
        </div>

        {/* Filters */}
        <ProductFilters />

        {/* Promotions */}
        <div className="relative rounded-lg overflow-hidden mt-6">
          <Image
            src="/images/promo-bg.jpg"
            alt="Promotions"
            width={400}
            height={200}
            className="object-cover w-full h-48"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4">
            <h3 className="section-header text-xl mb-2">PROMOTIONS</h3>
            <p className="text-white/80 text-sm mb-2">
              Special offer to I camabls with both to reduct a neod with
              enemeh-infres rain deal at attenndent!
            </p>
            <Link
              href="/products?promo=true"
              className="text-gold hover:text-gold-400 inline-flex items-center gap-1 text-sm transition-colors"
            >
              Shop Winners <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  return (
    <div className="bg-navy-900 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <Suspense fallback={<div className="animate-pulse h-96 bg-navy-800 rounded-lg" />}>
          <ProductsContent searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
