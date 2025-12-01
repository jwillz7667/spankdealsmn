'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, MapPin, Clock, CreditCard, Check, ShoppingCart } from 'lucide-react';
import { useCart, useAuth } from '@/stores';
import { createClient } from '@/lib/supabase/client';
import { formatCurrency, getImageUrl, formatTimeSlot, getDeliverySlots, formatDateOnly } from '@/lib/utils';
import { checkoutAddressSchema, type CheckoutAddressInput } from '@/lib/validators';

type CheckoutStep = 'review' | 'delivery' | 'payment';

const steps: { id: CheckoutStep; label: string; icon: React.ElementType }[] = [
  { id: 'review', label: 'Review', icon: ShoppingCart },
  { id: 'delivery', label: 'Delivery', icon: MapPin },
  { id: 'payment', label: 'Payment', icon: CreditCard },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { profile } = useAuth();
  const { items, checkout, subtotal, tax, total, setAddress, setDeliverySlot, setDeliveryInstructions, setTip, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('review');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(checkout.deliverySlot);

  const deliverySlots = getDeliverySlots(3);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<CheckoutAddressInput>({
    resolver: zodResolver(checkoutAddressSchema),
    defaultValues: {
      address: checkout.address || profile?.address || { street: '', city: '', state: 'MN', zip: '' },
      delivery_instructions: checkout.deliveryInstructions || '',
    },
  });

  useEffect(() => {
    if (items.length === 0) router.push('/products');
  }, [items.length, router]);

  useEffect(() => {
    if (profile?.address && !checkout.address) setValue('address', profile.address);
  }, [profile, checkout.address, setValue]);

  const onAddressSubmit = (data: CheckoutAddressInput) => {
    setAddress(data.address);
    if (data.delivery_instructions) setDeliveryInstructions(data.delivery_instructions);
    setCurrentStep('delivery');
  };

  const handleSlotSelect = (slot: Date) => {
    const slotString = slot.toISOString();
    setSelectedSlot(slotString);
    setDeliverySlot(slotString);
  };

  const handlePayment = async () => {
    if (!selectedSlot) {
      toast.error('Please select a delivery time');
      return;
    }

    setIsLoading(true);
    const supabase = createClient();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to complete your order');
        router.push('/login?redirect=/checkout');
        return;
      }

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          status: 'pending',
          subtotal,
          tax,
          delivery_fee: checkout.deliveryFee,
          tip: checkout.tip,
          total,
          delivery_address: checkout.address!,
          delivery_slot: selectedSlot,
          delivery_instructions: checkout.deliveryInstructions,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity,
        price_at_purchase: item.product.price,
        product_title: item.product.title,
      }));

      await supabase.from('order_items').insert(orderItems);

      clearCart();
      toast.success('Order placed successfully!');
      router.push(`/orders/${order.id}`);
    } catch {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  if (items.length === 0) return null;

  return (
    <div className="min-h-screen bg-navy-900">
      <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gold mb-6 hover:text-gold-400">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        {/* Progress Steps */}
        <div className="mb-8 flex items-center justify-center">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex items-center">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                  index <= currentStepIndex ? 'border-gold bg-gold text-navy-900' : 'border-gold/30 text-gold/30'
                }`}>
                  {index < currentStepIndex ? <Check className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
                </div>
                <span className={`ml-2 hidden sm:block text-sm font-medium ${
                  index <= currentStepIndex ? 'text-gold' : 'text-gold/30'
                }`}>{step.label}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`mx-4 h-0.5 w-12 sm:w-24 ${index < currentStepIndex ? 'bg-gold' : 'bg-gold/30'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {currentStep === 'review' && (
                <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="bg-navy-800 rounded-lg border border-gold/20 p-6">
                    <h2 className="font-display text-2xl text-gold mb-4">Review Your Order</h2>
                    <ul className="space-y-4">
                      {items.map((item) => (
                        <li key={item.productId} className="flex gap-4">
                          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-white">
                            <Image src={getImageUrl(item.product.images[0])} alt={item.product.title} fill className="object-contain p-2" sizes="80px" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white font-medium">{item.product.title}</h3>
                            <p className="text-gold/70 text-sm">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-gold font-semibold">{formatCurrency(item.product.price * item.quantity)}</p>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 flex justify-end">
                      <button onClick={() => setCurrentStep('delivery')} className="btn-gold py-3 px-6 flex items-center gap-2">
                        Continue to Delivery <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 'delivery' && (
                <motion.div key="delivery" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="bg-navy-800 rounded-lg border border-gold/20 p-6">
                    <h2 className="font-display text-2xl text-gold mb-4">Delivery Address</h2>
                    <form onSubmit={handleSubmit(onAddressSubmit)} className="space-y-4">
                      <div>
                        <label className="block text-gold text-sm mb-2">Street Address</label>
                        <input placeholder="123 Main St" className="w-full bg-navy-700 border border-gold/30 rounded py-3 px-4 text-white placeholder:text-gold/30 focus:outline-none focus:border-gold" {...register('address.street')} />
                        {errors.address?.street && <p className="text-red-500 text-xs mt-1">{errors.address.street.message}</p>}
                      </div>
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                          <label className="block text-gold text-sm mb-2">City</label>
                          <input placeholder="Minneapolis" className="w-full bg-navy-700 border border-gold/30 rounded py-3 px-4 text-white placeholder:text-gold/30 focus:outline-none focus:border-gold" {...register('address.city')} />
                        </div>
                        <div>
                          <label className="block text-gold text-sm mb-2">State</label>
                          <input placeholder="MN" maxLength={2} className="w-full bg-navy-700 border border-gold/30 rounded py-3 px-4 text-white placeholder:text-gold/30 focus:outline-none focus:border-gold" {...register('address.state')} />
                        </div>
                        <div>
                          <label className="block text-gold text-sm mb-2">ZIP</label>
                          <input placeholder="55401" className="w-full bg-navy-700 border border-gold/30 rounded py-3 px-4 text-white placeholder:text-gold/30 focus:outline-none focus:border-gold" {...register('address.zip')} />
                        </div>
                      </div>
                      <div className="flex justify-between pt-4">
                        <button type="button" onClick={() => setCurrentStep('review')} className="text-gold hover:text-gold-400 flex items-center gap-2">
                          <ArrowLeft className="h-4 w-4" /> Back
                        </button>
                        <button type="submit" className="btn-gold py-3 px-6 flex items-center gap-2">
                          Continue <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </form>
                  </div>

                  {checkout.address && (
                    <div className="bg-navy-800 rounded-lg border border-gold/20 p-6">
                      <h2 className="font-display text-2xl text-gold mb-4">Select Delivery Time</h2>
                      <div className="space-y-4">
                        {deliverySlots.map(({ date, slots }) => (
                          <div key={date.toISOString()}>
                            <h3 className="text-white font-medium mb-2">{formatDateOnly(date)}</h3>
                            <div className="grid gap-2 sm:grid-cols-3">
                              {slots.map((slot) => {
                                const slotString = slot.toISOString();
                                const isSelected = selectedSlot === slotString;
                                return (
                                  <button
                                    key={slotString}
                                    type="button"
                                    onClick={() => handleSlotSelect(slot)}
                                    className={`flex items-center justify-center gap-2 rounded border px-4 py-3 text-sm transition-colors ${
                                      isSelected ? 'border-gold bg-gold/10 text-gold' : 'border-gold/30 text-gold/70 hover:border-gold/50'
                                    }`}
                                  >
                                    <Clock className="h-4 w-4" /> {formatTimeSlot(slot)}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-end pt-6">
                        <button onClick={() => setCurrentStep('payment')} disabled={!selectedSlot} className="btn-gold py-3 px-6 flex items-center gap-2 disabled:opacity-50">
                          Continue to Payment <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {currentStep === 'payment' && (
                <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="bg-navy-800 rounded-lg border border-gold/20 p-6">
                    <h2 className="font-display text-2xl text-gold mb-4">Payment</h2>
                    <div className="mb-6 rounded-lg bg-gold/10 border border-gold/30 p-4">
                      <p className="text-sm text-gold">
                        <strong>Cash on Delivery:</strong> Pay with cash when your order arrives. Please have exact change ready.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gold text-sm mb-2">Add a Tip</label>
                        <div className="flex gap-2">
                          {[0, 3, 5, 10].map((amount) => (
                            <button
                              key={amount}
                              type="button"
                              onClick={() => setTip(amount)}
                              className={`py-2 px-4 rounded border transition-colors ${
                                checkout.tip === amount ? 'bg-gold text-navy-900 border-gold' : 'border-gold/30 text-gold hover:border-gold'
                              }`}
                            >
                              {amount === 0 ? 'No Tip' : `$${amount}`}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between pt-6">
                      <button onClick={() => setCurrentStep('delivery')} className="text-gold hover:text-gold-400 flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" /> Back
                      </button>
                      <button onClick={handlePayment} disabled={isLoading} className="btn-gold py-3 px-8 disabled:opacity-50">
                        {isLoading ? 'Processing...' : `Place Order • ${formatCurrency(total)}`}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-navy-800 rounded-lg border border-gold/20 p-6">
              <h2 className="font-display text-xl text-gold mb-4">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gold/70">Subtotal ({items.length} items)</span>
                  <span className="text-white">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gold/70">Tax</span>
                  <span className="text-white">{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gold/70">Delivery</span>
                  <span className="text-white">{checkout.deliveryFee === 0 ? 'Free' : formatCurrency(checkout.deliveryFee)}</span>
                </div>
                {checkout.tip > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gold/70">Tip</span>
                    <span className="text-white">{formatCurrency(checkout.tip)}</span>
                  </div>
                )}
                <div className="border-t border-gold/20 pt-3 flex justify-between text-base font-semibold">
                  <span className="text-gold">Total</span>
                  <span className="text-gold">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
