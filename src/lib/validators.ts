import { z } from 'zod';

export const addressSchema = z.object({
  street: z.string().min(5, 'Please enter a valid street address'),
  apt: z.string().optional(),
  city: z.string().min(2, 'Please enter a valid city'),
  state: z.string().length(2, 'Please use state abbreviation (e.g., MN)'),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code'),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().regex(/^\+?1?\s*\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/, 'Please enter a valid phone number'),
  address: addressSchema.optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const signupSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^\+?1?\s*\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/, 'Please enter a valid phone number'),
  age_verified: z.boolean().refine((val) => val === true, 'You must confirm you are 21 or older'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const checkoutAddressSchema = z.object({
  address: addressSchema,
  delivery_instructions: z.string().max(500).optional(),
});

export const checkoutSlotSchema = z.object({
  delivery_slot: z.string().datetime(),
});

export const checkoutPaymentSchema = z.object({
  tip: z.number().min(0).max(1000),
  promo_code: z.string().optional(),
});

export const productSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(200),
  description: z.string().max(2000).optional(),
  category: z.enum(['flower', 'edibles', 'vapes', 'concentrates', 'prerolls', 'accessories', 'topicals']),
  strain_type: z.enum(['indica', 'sativa', 'hybrid']).optional().nullable(),
  thc_potency: z.number().min(0).max(100).optional().nullable(),
  cbd_potency: z.number().min(0).max(100).optional().nullable(),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  compare_at_price: z.number().min(0).optional().nullable(),
  stock: z.number().int().min(0),
  batch_lot: z.string().max(100).optional(),
  weight_grams: z.number().min(0).optional().nullable(),
  is_active: z.boolean(),
  is_featured: z.boolean(),
  tags: z.array(z.string()).default([]),
});

export const promoCodeSchema = z.object({
  code: z.string().min(3).max(20).toUpperCase(),
  discount_type: z.enum(['percentage', 'fixed']),
  discount_value: z.number().min(0),
  min_order_amount: z.number().min(0).optional().nullable(),
  max_uses: z.number().int().min(1).optional().nullable(),
  expires_at: z.string().datetime().optional().nullable(),
  is_active: z.boolean(),
});

export const deliveryZoneSchema = z.object({
  name: z.string().min(2).max(100),
  suburbs: z.array(z.string()),
  delivery_fee: z.number().min(0),
  min_order: z.number().min(0),
  estimated_minutes: z.number().int().min(15).max(180),
  is_active: z.boolean(),
});

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  subject: z.string().min(5, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export type AddressInput = z.infer<typeof addressSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type CheckoutAddressInput = z.infer<typeof checkoutAddressSchema>;
export type CheckoutSlotInput = z.infer<typeof checkoutSlotSchema>;
export type CheckoutPaymentInput = z.infer<typeof checkoutPaymentSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type PromoCodeInput = z.infer<typeof promoCodeSchema>;
export type DeliveryZoneInput = z.infer<typeof deliveryZoneSchema>;
export type ContactFormInput = z.infer<typeof contactFormSchema>;
