#!/usr/bin/env node
/**
 * Seed 10 sample cannabis products for DankDeals shop
 * Usage: node scripts/seed-products.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const products = [
  {
    title: 'Golden Gorilla Flower',
    description: 'Premium hybrid strain with balanced effects. Great for daytime or evening use.',
    category: 'flower',
    strain_type: 'hybrid',
    thc_potency: 22.5,
    cbd_potency: 0.8,
    price: 12.99,
    compare_at_price: 15.99,
    stock: 50,
    batch_lot: 'GG-2025-001',
    images: ['https://images.unsplash.com/photo-1599499810694-b5ac4dd64a83?w=400&h=400&fit=crop'],
    weight_grams: 3.5,
    is_active: true,
    is_featured: true,
    tags: ['hybrid', 'balanced', 'popular'],
  },
  {
    title: 'Blue Dream Flower',
    description: 'Classic sativa dominant strain. Uplifting and energetic effects.',
    category: 'flower',
    strain_type: 'sativa',
    thc_potency: 21.0,
    cbd_potency: 1.2,
    price: 14.99,
    compare_at_price: 17.99,
    stock: 45,
    batch_lot: 'BD-2025-001',
    images: ['https://images.unsplash.com/photo-1599499810694-b5ac4dd64a83?w=400&h=400&fit=crop'],
    weight_grams: 3.5,
    is_active: true,
    is_featured: true,
    tags: ['sativa', 'energetic', 'uplifting'],
  },
  {
    title: 'Purple Kush Flower',
    description: 'Deep relaxing indica strain. Perfect for evening use and sleep.',
    category: 'flower',
    strain_type: 'indica',
    thc_potency: 19.8,
    cbd_potency: 0.5,
    price: 13.99,
    compare_at_price: 16.99,
    stock: 40,
    batch_lot: 'PK-2025-001',
    images: ['https://images.unsplash.com/photo-1599499810694-b5ac4dd64a83?w=400&h=400&fit=crop'],
    weight_grams: 3.5,
    is_active: true,
    is_featured: false,
    tags: ['indica', 'relaxing', 'sleep'],
  },
  {
    title: 'Strawberry Bliss Edibles',
    description: '10mg THC strawberry gummies. Long-lasting effects, perfect for beginners.',
    category: 'edibles',
    strain_type: null,
    thc_potency: 10.0,
    cbd_potency: null,
    price: 8.99,
    compare_at_price: 9.99,
    stock: 80,
    batch_lot: 'SB-GUMMY-001',
    images: ['https://images.unsplash.com/photo-1599499810694-b5ac4dd64a83?w=400&h=400&fit=crop'],
    weight_grams: null,
    is_active: true,
    is_featured: true,
    tags: ['edibles', 'gummies', 'beginner-friendly'],
  },
  {
    title: 'Mango Indica Vape',
    description: 'Smooth mango flavored vape cart. 500mg THC distillate.',
    category: 'vapes',
    strain_type: 'indica',
    thc_potency: null,
    cbd_potency: null,
    price: 29.99,
    compare_at_price: 34.99,
    stock: 35,
    batch_lot: 'MG-VAPE-001',
    images: ['https://images.unsplash.com/photo-1599499810694-b5ac4dd64a83?w=400&h=400&fit=crop'],
    weight_grams: null,
    is_active: true,
    is_featured: false,
    tags: ['vape', 'mango', 'indica'],
  },
  {
    title: 'Lemon Haze Preroll',
    description: 'Pre-rolled joint. Energetic sativa with lemony citrus flavor.',
    category: 'prerolls',
    strain_type: 'sativa',
    thc_potency: 18.5,
    cbd_potency: null,
    price: 6.99,
    compare_at_price: 8.99,
    stock: 100,
    batch_lot: 'LH-PREROLL-001',
    images: ['https://images.unsplash.com/photo-1599499810694-b5ac4dd64a83?w=400&h=400&fit=crop'],
    weight_grams: 1.0,
    is_active: true,
    is_featured: false,
    tags: ['preroll', 'sativa', 'citrus'],
  },
  {
    title: 'Premium Rolling Papers',
    description: 'Ultra-thin organic rolling papers. Pack of 50 leaves.',
    category: 'accessories',
    strain_type: null,
    thc_potency: null,
    cbd_potency: null,
    price: 3.99,
    compare_at_price: 4.99,
    stock: 150,
    batch_lot: 'RP-ORGANIC-001',
    images: ['https://images.unsplash.com/photo-1599499810694-b5ac4dd64a83?w=400&h=400&fit=crop'],
    weight_grams: null,
    is_active: true,
    is_featured: false,
    tags: ['accessories', 'rolling-papers'],
  },
  {
    title: 'Lavender Relief Topical',
    description: 'Soothing 500mg CBD topical cream for muscle aches and tension.',
    category: 'topicals',
    strain_type: null,
    thc_potency: null,
    cbd_potency: 500.0,
    price: 19.99,
    compare_at_price: 24.99,
    stock: 25,
    batch_lot: 'LR-TOPICAL-001',
    images: ['https://images.unsplash.com/photo-1599499810694-b5ac4dd64a83?w=400&h=400&fit=crop'],
    weight_grams: null,
    is_active: true,
    is_featured: false,
    tags: ['topical', 'cbd', 'relief'],
  },
  {
    title: 'Sunset OG Concentrate',
    description: '1g THC Badder concentrate. Rich golden color and smooth texture.',
    category: 'concentrates',
    strain_type: 'hybrid',
    thc_potency: 85.0,
    cbd_potency: null,
    price: 34.99,
    compare_at_price: 39.99,
    stock: 20,
    batch_lot: 'SO-BADDER-001',
    images: ['https://images.unsplash.com/photo-1599499810694-b5ac4dd64a83?w=400&h=400&fit=crop'],
    weight_grams: 1.0,
    is_active: true,
    is_featured: false,
    tags: ['concentrate', 'badder', 'potent'],
  },
  {
    title: 'Mint Chocolate Edibles',
    description: '20mg THC chocolate bar. Decadent mint chocolate flavor.',
    category: 'edibles',
    strain_type: null,
    thc_potency: 20.0,
    cbd_potency: null,
    price: 11.99,
    compare_at_price: 13.99,
    stock: 60,
    batch_lot: 'MC-CHOC-001',
    images: ['https://images.unsplash.com/photo-1599499810694-b5ac4dd64a83?w=400&h=400&fit=crop'],
    weight_grams: null,
    is_active: true,
    is_featured: true,
    tags: ['edibles', 'chocolate', 'dessert'],
  },
];

async function seedProducts() {
  try {
    console.log('🌱 Seeding 10 sample products...\n');

    const { data, error } = await supabase.from('products').insert(products).select();

    if (error) {
      console.error('❌ Error seeding products:', error);
      process.exit(1);
    }

    console.log(`✅ Successfully created ${data.length} products:\n`);
    data.forEach((product, index) => {
      console.log(`${index + 1}. ${product.title} - $${product.price}`);
    });

    console.log('\n✨ Products are now available in the shop!');
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    process.exit(1);
  }
}

seedProducts();
