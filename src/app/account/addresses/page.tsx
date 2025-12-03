'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { MapPin, Plus, Edit, Trash2, Star, Save, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores';

const addressSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  street: z.string().min(5, 'Please enter a valid street address'),
  apt: z.string().optional(),
  city: z.string().min(2, 'Please enter a valid city'),
  state: z.string().length(2, 'Please use state abbreviation (e.g., MN)'),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code'),
  delivery_instructions: z.string().max(500).optional(),
  is_default: z.boolean(),
});

type AddressInput = z.infer<typeof addressSchema>;

interface SavedAddress extends AddressInput {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export default function SavedAddressesPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      state: 'MN',
      is_default: false,
    },
  });

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/account/addresses');
      return;
    }

    loadAddresses();
  }, [user, router]);

  const loadAddresses = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('saved_addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAddresses(data || []);
    } catch (error) {
      console.error('Error loading addresses:', error);
      toast.error('Failed to load addresses');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: AddressInput) => {
    if (!user) return;

    setIsSaving(true);
    try {
      const supabase = createClient();

      if (editingId) {
        // Update existing address
        const { error } = await supabase
          .from('saved_addresses')
          .update({
            ...data,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingId)
          .eq('user_id', user.id);

        if (error) throw error;
        toast.success('Address updated successfully!');
      } else {
        // Create new address
        const { error } = await supabase
          .from('saved_addresses')
          .insert({
            ...data,
            user_id: user.id,
          });

        if (error) throw error;
        toast.success('Address added successfully!');
      }

      reset();
      setShowAddForm(false);
      setEditingId(null);
      loadAddresses();
    } catch (error: any) {
      console.error('Error saving address:', error);
      toast.error(error.message || 'Failed to save address');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (address: SavedAddress) => {
    setValue('label', address.label);
    setValue('street', address.street);
    setValue('apt', address.apt || '');
    setValue('city', address.city);
    setValue('state', address.state);
    setValue('zip', address.zip);
    setValue('delivery_instructions', address.delivery_instructions || '');
    setValue('is_default', address.is_default);
    setEditingId(address.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('saved_addresses')
        .delete()
        .eq('id', id)
        .eq('user_id', user!.id);

      if (error) throw error;
      toast.success('Address deleted successfully!');
      loadAddresses();
    } catch (error: any) {
      console.error('Error deleting address:', error);
      toast.error(error.message || 'Failed to delete address');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('saved_addresses')
        .update({ is_default: true })
        .eq('id', id)
        .eq('user_id', user!.id);

      if (error) throw error;
      toast.success('Default address updated!');
      loadAddresses();
    } catch (error: any) {
      console.error('Error setting default:', error);
      toast.error(error.message || 'Failed to set default address');
    }
  };

  const handleCancel = () => {
    reset();
    setShowAddForm(false);
    setEditingId(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="text-gold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-900 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-navy-800 rounded-lg border border-gold/30 p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-display text-3xl text-gold">Saved Addresses</h1>
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="btn-gold py-2 px-4 flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Add Address
              </button>
            )}
          </div>

          {/* Add/Edit Form */}
          {showAddForm && (
            <div className="bg-navy-700 rounded-lg border border-gold/20 p-6 mb-6">
              <h2 className="text-xl text-gold mb-4">
                {editingId ? 'Edit Address' : 'Add New Address'}
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-gold text-sm mb-2">Label *</label>
                  <input
                    type="text"
                    placeholder="Home, Work, Mom's House, etc."
                    className="w-full bg-navy-900 border border-gold/40 rounded py-2 px-4 text-white placeholder:text-gold/50 focus:outline-none focus:border-gold"
                    {...register('label')}
                  />
                  {errors.label && (
                    <p className="text-red-500 text-xs mt-1">{errors.label.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-gold text-sm mb-2">Street Address *</label>
                    <input
                      type="text"
                      placeholder="123 Main St"
                      className="w-full bg-navy-900 border border-gold/40 rounded py-2 px-4 text-white placeholder:text-gold/50 focus:outline-none focus:border-gold"
                      {...register('street')}
                    />
                    {errors.street && (
                      <p className="text-red-500 text-xs mt-1">{errors.street.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gold text-sm mb-2">Apt/Unit</label>
                    <input
                      type="text"
                      placeholder="Apt 4B"
                      className="w-full bg-navy-900 border border-gold/40 rounded py-2 px-4 text-white placeholder:text-gold/50 focus:outline-none focus:border-gold"
                      {...register('apt')}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gold text-sm mb-2">City *</label>
                    <input
                      type="text"
                      placeholder="Minneapolis"
                      className="w-full bg-navy-900 border border-gold/40 rounded py-2 px-4 text-white placeholder:text-gold/50 focus:outline-none focus:border-gold"
                      {...register('city')}
                    />
                    {errors.city && (
                      <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gold text-sm mb-2">State *</label>
                    <input
                      type="text"
                      placeholder="MN"
                      maxLength={2}
                      className="w-full bg-navy-900 border border-gold/40 rounded py-2 px-4 text-white placeholder:text-gold/50 focus:outline-none focus:border-gold uppercase"
                      {...register('state')}
                    />
                    {errors.state && (
                      <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gold text-sm mb-2">ZIP Code *</label>
                    <input
                      type="text"
                      placeholder="55401"
                      className="w-full bg-navy-900 border border-gold/40 rounded py-2 px-4 text-white placeholder:text-gold/50 focus:outline-none focus:border-gold"
                      {...register('zip')}
                    />
                    {errors.zip && (
                      <p className="text-red-500 text-xs mt-1">{errors.zip.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-gold text-sm mb-2">Delivery Instructions</label>
                  <textarea
                    rows={3}
                    placeholder="Ring doorbell, leave at door, etc."
                    className="w-full bg-navy-900 border border-gold/40 rounded py-2 px-4 text-white placeholder:text-gold/50 focus:outline-none focus:border-gold resize-none"
                    {...register('delivery_instructions')}
                  />
                  {errors.delivery_instructions && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.delivery_instructions.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="h-5 w-5 rounded border-gold/30 bg-navy-900 text-gold focus:ring-gold"
                      {...register('is_default')}
                    />
                    <span className="text-white">Set as default address</span>
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 btn-gold py-2 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {isSaving ? 'Saving...' : 'Save Address'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 btn-gold-outline py-2 flex items-center justify-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Addresses List */}
          <div className="space-y-4">
            {addresses.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="h-16 w-16 text-gold/30 mx-auto mb-4" />
                <p className="text-gold/70 text-lg">No saved addresses yet</p>
                <p className="text-gold/50 text-sm mt-2">
                  Add your first address to make checkout faster
                </p>
              </div>
            ) : (
              addresses.map((address) => (
                <div
                  key={address.id}
                  className="bg-navy-700 rounded-lg border border-gold/20 p-4 hover:border-gold/40 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-white">
                          {address.label}
                        </h3>
                        {address.is_default && (
                          <span className="flex items-center gap-1 bg-gold/20 text-gold px-2 py-1 rounded text-xs">
                            <Star className="h-3 w-3 fill-gold" />
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-gold/90">
                        {address.street}
                        {address.apt && `, ${address.apt}`}
                      </p>
                      <p className="text-gold/90">
                        {address.city}, {address.state} {address.zip}
                      </p>
                      {address.delivery_instructions && (
                        <p className="text-gold/60 text-sm mt-2">
                          <strong>Instructions:</strong> {address.delivery_instructions}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      {!address.is_default && (
                        <button
                          onClick={() => handleSetDefault(address.id)}
                          className="p-2 text-gold/60 hover:text-gold hover:bg-gold/10 rounded transition-colors"
                          title="Set as default"
                        >
                          <Star className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(address)}
                        className="p-2 text-gold/60 hover:text-gold hover:bg-gold/10 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(address.id)}
                        className="p-2 text-red-400/60 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
