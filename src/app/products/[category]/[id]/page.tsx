import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ProductDetailClient } from './product-detail-client';

interface ProductPageProps {
  params: Promise<{ category: string; id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { id, category } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: product } = await supabase
    .from('products')
    .select('title, description, price, images')
    .eq('id', id)
    .single();

  if (!product) {
    return { title: 'Product Not Found' };
  }

  const imageUrl = product.images?.[0] || '/placeholder-product.jpg';
  const productUrl = `https://dankdealsmn.com/products/${category}/${id}`;

  return {
    title: `${product.title} - Cannabis Delivery`,
    description: product.description || `Buy ${product.title} for same-day delivery in Minneapolis & St. Paul. Premium cannabis products from DankDeals.`,
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title: product.title,
      description: product.description || `Shop ${product.title} at DankDeals`,
      url: productUrl,
      type: 'product',
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: product.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: product.description || `Shop ${product.title} at DankDeals`,
      images: [imageUrl],
    },
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

  // Structured data for the product
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.images?.[0] || '/placeholder-product.jpg',
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'DankDeals',
    },
    offers: {
      '@type': 'Offer',
      url: `https://dankdealsmn.com/products/${category}/${id}`,
      priceCurrency: 'USD',
      price: product.price,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'DankDeals',
      },
    },
    category: product.category,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient product={product} relatedProducts={relatedProducts || []} />
    </>
  );
}
