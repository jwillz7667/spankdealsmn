import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ProductDetailClient } from './product-detail-client';

interface ProductPageProps {
  params: Promise<{ category: string; id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  
  const { data: product } = await supabase
    .from('products')
    .select('title, description')
    .eq('id', id)
    .single();

  if (!product) {
    return { title: 'Product Not Found' };
  }

  return {
    title: product.title,
    description: product.description || `Shop ${product.title} at DankDeals`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id, category } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (error || !product) {
    notFound();
  }

  // Fetch related products
  const { data: relatedProducts } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .eq('category', category)
    .neq('id', id)
    .limit(4);

  return <ProductDetailClient product={product} relatedProducts={relatedProducts || []} />;
}
