/**
 * Seed script to create 10 placeholder products in the database.
 * Run with: npx tsx src/scripts/seed-products.ts
 *
 * Products will have empty image arrays - add images via Supabase dashboard.
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

// Load environment variables from .env file
config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  console.error('Make sure you have a .env file with these variables set.');
  process.exit(1);
}

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

type ProductInsert = Database['public']['Tables']['products']['Insert'];

const products: ProductInsert[] = [
  // Flower (3 products)
  {
    title: 'Blue Dream',
    description:
      'A legendary sativa-dominant hybrid known for its balanced full-body relaxation and gentle cerebral invigoration. Sweet berry aroma with hints of earthy undertones. Perfect for daytime use when you want to stay productive while enjoying a mellow, uplifting buzz.',
    category: 'flower',
    strain_type: 'hybrid',
    thc_potency: 24.5,
    cbd_potency: 0.1,
    price: 45.0,
    compare_at_price: 55.0,
    stock: 150,
    batch_lot: 'BD-2024-1201',
    images: [],
    weight_grams: 3.5,
    is_active: true,
    is_featured: true,
    tags: ['bestseller', 'daytime', 'creative', 'relaxing'],
  },
  {
    title: 'OG Kush',
    description:
      'The legendary OG Kush is a potent indica-dominant strain with a complex aroma featuring notes of fuel, skunk, and spice. Known for delivering heavy-handed euphoria and deep relaxation. A true classic that has shaped the West Coast cannabis scene for decades.',
    category: 'flower',
    strain_type: 'indica',
    thc_potency: 27.0,
    cbd_potency: 0.3,
    price: 55.0,
    compare_at_price: 65.0,
    stock: 100,
    batch_lot: 'OGK-2024-1201',
    images: [],
    weight_grams: 3.5,
    is_active: true,
    is_featured: true,
    tags: ['premium', 'evening', 'relaxing', 'classic'],
  },
  {
    title: 'Girl Scout Cookies',
    description:
      'An award-winning hybrid with a sweet and earthy aroma. GSC delivers a potent dose of full-body relaxation paired with a time-bending cerebral high. Features beautiful purple and green buds covered in frosty trichomes. A patient favorite for stress relief.',
    category: 'flower',
    strain_type: 'hybrid',
    thc_potency: 25.0,
    cbd_potency: 0.2,
    price: 50.0,
    compare_at_price: null,
    stock: 120,
    batch_lot: 'GSC-2024-1201',
    images: [],
    weight_grams: 3.5,
    is_active: true,
    is_featured: false,
    tags: ['award-winning', 'stress-relief', 'euphoric'],
  },

  // Edibles (2 products)
  {
    title: 'Tropical THC Gummies',
    description:
      'Delicious fruit-flavored gummies infused with premium THC distillate. Each gummy contains a precisely dosed 10mg of THC for consistent, reliable effects. Flavors include mango, pineapple, and passion fruit. Made with natural fruit pectin - vegan friendly.',
    category: 'edibles',
    strain_type: null,
    thc_potency: 100.0, // 10mg x 10 gummies
    cbd_potency: 0,
    price: 25.0,
    compare_at_price: 30.0,
    stock: 200,
    batch_lot: 'TG-2024-1201',
    images: [],
    weight_grams: 50,
    is_active: true,
    is_featured: true,
    tags: ['vegan', 'fruit', 'beginner-friendly', 'precise-dose'],
  },
  {
    title: 'Dark Chocolate THC Bar',
    description:
      'Premium Belgian dark chocolate infused with full-spectrum cannabis extract. Each square contains 5mg THC for micro-dosing flexibility. Rich 70% cacao with subtle cannabis undertones. Perfect for a relaxing evening treat. 20 squares per bar.',
    category: 'edibles',
    strain_type: null,
    thc_potency: 100.0, // 5mg x 20 squares
    cbd_potency: 10.0,
    price: 35.0,
    compare_at_price: null,
    stock: 80,
    batch_lot: 'DCB-2024-1201',
    images: [],
    weight_grams: 100,
    is_active: true,
    is_featured: false,
    tags: ['chocolate', 'micro-dose', 'full-spectrum', 'gourmet'],
  },

  // Vapes (2 products)
  {
    title: 'Sativa Sunrise Cartridge',
    description:
      'Wake and bake with this energizing sativa blend. Our premium 1g cartridge features strain-specific live resin extracted from fresh-frozen flower. Notes of citrus and pine with an uplifting, focused high. Compatible with all 510-thread batteries.',
    category: 'vapes',
    strain_type: 'sativa',
    thc_potency: 85.0,
    cbd_potency: 0,
    price: 45.0,
    compare_at_price: 55.0,
    stock: 150,
    batch_lot: 'SSC-2024-1201',
    images: [],
    weight_grams: 1,
    is_active: true,
    is_featured: true,
    tags: ['live-resin', 'energizing', 'focus', '510-thread'],
  },
  {
    title: 'Indica Dreams Disposable',
    description:
      'Ready-to-use disposable vape pen pre-filled with 0.5g of premium indica distillate. Perfect for bedtime relaxation and stress relief. Features a sleek, discreet design with a built-in battery. No charging needed - simply inhale to activate.',
    category: 'vapes',
    strain_type: 'indica',
    thc_potency: 90.0,
    cbd_potency: 0,
    price: 30.0,
    compare_at_price: null,
    stock: 100,
    batch_lot: 'IDD-2024-1201',
    images: [],
    weight_grams: 0.5,
    is_active: true,
    is_featured: false,
    tags: ['disposable', 'discreet', 'sleep', 'relaxing'],
  },

  // Concentrates (1 product)
  {
    title: 'Premium Live Rosin',
    description:
      'Solventless, craft-quality live rosin pressed from fresh-frozen, single-source flower. This golden, terpy concentrate delivers the full flavor profile and entourage effect of the plant. Clean, pure, and incredibly potent. For the true cannabis connoisseur.',
    category: 'concentrates',
    strain_type: 'hybrid',
    thc_potency: 78.0,
    cbd_potency: 0.5,
    price: 80.0,
    compare_at_price: 95.0,
    stock: 50,
    batch_lot: 'PLR-2024-1201',
    images: [],
    weight_grams: 1,
    is_active: true,
    is_featured: true,
    tags: ['solventless', 'craft', 'premium', 'terpy'],
  },

  // Pre-rolls (1 product)
  {
    title: 'Mixed Strain Pre-Roll 5-Pack',
    description:
      'Variety pack featuring five 0.5g pre-rolls, each a different strain. Includes 2 sativas, 2 indicas, and 1 hybrid. Premium flower ground fresh and rolled in natural hemp paper. Perfect for sampling different strains or sharing with friends.',
    category: 'prerolls',
    strain_type: 'hybrid',
    thc_potency: 22.0,
    cbd_potency: 0.5,
    price: 35.0,
    compare_at_price: 45.0,
    stock: 75,
    batch_lot: 'MSP-2024-1201',
    images: [],
    weight_grams: 2.5,
    is_active: true,
    is_featured: false,
    tags: ['variety', 'shareable', 'hemp-paper', 'convenient'],
  },

  // Topicals (1 product)
  {
    title: 'CBD Relief Cream',
    description:
      'Fast-acting topical cream infused with 500mg of full-spectrum CBD and natural menthol. Provides targeted relief for sore muscles, joint pain, and inflammation. Non-greasy formula absorbs quickly. THC-free with no psychoactive effects.',
    category: 'topicals',
    strain_type: null,
    thc_potency: 0,
    cbd_potency: 500.0,
    price: 45.0,
    compare_at_price: null,
    stock: 60,
    batch_lot: 'CRC-2024-1201',
    images: [],
    weight_grams: 60,
    is_active: true,
    is_featured: false,
    tags: ['pain-relief', 'thc-free', 'menthol', 'fast-acting'],
  },
];

async function seedProducts() {
  console.log('Starting product seed...\n');

  // Check for existing products
  const { count } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  if (count && count > 0) {
    console.log(`Found ${count} existing products.`);
    console.log('Skipping seed to avoid duplicates.');
    console.log('To re-seed, delete existing products first.\n');
    return;
  }

  // Insert products
  const { data, error } = await supabase.from('products').insert(products).select();

  if (error) {
    console.error('Error seeding products:', error.message);
    process.exit(1);
  }

  console.log(`Successfully seeded ${data.length} products:\n`);
  data.forEach((product, index) => {
    console.log(`${index + 1}. ${product.title} (${product.category}) - $${product.price}`);
  });

  console.log('\nProduct seed complete!');
  console.log('Remember to add product images via Supabase dashboard.');
}

seedProducts();
