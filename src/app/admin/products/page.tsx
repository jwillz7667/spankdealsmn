import Link from 'next/link';
import Image from 'next/image';
import { Plus, Edit } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { formatCurrency, getImageUrl, categoryLabels } from '@/lib/utils';

export const metadata = { title: 'Products - Admin' };

export default async function AdminProductsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: products } = await supabase.from('products').select('*').order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl text-gold">Products</h1>
        <Link href="/admin/products/new" className="btn-gold py-2 px-4 flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Product
        </Link>
      </div>
      <div className="bg-navy-800 border border-gold/20 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-gold/20 bg-navy-700">
            <tr>
              <th className="px-4 py-3 text-left text-gold">Product</th>
              <th className="px-4 py-3 text-left text-gold">Category</th>
              <th className="px-4 py-3 text-left text-gold">Price</th>
              <th className="px-4 py-3 text-left text-gold">Stock</th>
              <th className="px-4 py-3 text-right text-gold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/10">
            {products?.map((product) => (
              <tr key={product.id} className="hover:bg-navy-700/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded bg-white">
                      <Image src={getImageUrl(product.images[0])} alt={product.title} fill className="object-contain p-1" sizes="40px" />
                    </div>
                    <span className="text-white line-clamp-1">{product.title}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gold/70">{categoryLabels[product.category]}</td>
                <td className="px-4 py-3 text-white">{formatCurrency(product.price)}</td>
                <td className="px-4 py-3"><span className={product.stock <= 5 ? 'text-red-400' : 'text-white'}>{product.stock}</span></td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/products/${product.id}`} className="text-gold hover:text-gold-400"><Edit className="h-4 w-4" /></Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
