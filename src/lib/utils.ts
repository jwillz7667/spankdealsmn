import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date));
}

export function formatDateOnly(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
  }).format(new Date(date));
}

export function formatTimeSlot(date: string | Date): string {
  const d = new Date(date);
  const start = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const end = new Date(d.getTime() + 60 * 60 * 1000).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
  return `${start} - ${end}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
}

export function calculateTax(subtotal: number): number {
  const salesTax = parseFloat(process.env.NEXT_PUBLIC_MN_SALES_TAX || '0.06875');
  const exciseTax = parseFloat(process.env.NEXT_PUBLIC_CANNABIS_EXCISE_TAX || '0.10');
  return subtotal * (salesTax + exciseTax);
}

export function calculateOrderTotal(
  subtotal: number,
  deliveryFee: number = 0,
  tip: number = 0,
  discount: number = 0
): { subtotal: number; tax: number; deliveryFee: number; tip: number; discount: number; total: number } {
  const taxableSubtotal = subtotal - discount;
  const tax = calculateTax(Math.max(0, taxableSubtotal));
  const total = Math.max(0, taxableSubtotal) + tax + deliveryFee + tip;

  return {
    subtotal,
    tax,
    deliveryFee,
    tip,
    discount,
    total,
  };
}

export function getDeliverySlots(daysAhead: number = 3): { date: Date; slots: Date[] }[] {
  const slots: { date: Date; slots: Date[] }[] = [];
  const now = new Date();

  for (let day = 0; day < daysAhead; day++) {
    const date = new Date(now);
    date.setDate(date.getDate() + day);
    date.setHours(0, 0, 0, 0);

    const daySlots: Date[] = [];
    const startHour = day === 0 ? Math.max(10, now.getHours() + 2) : 10;
    const endHour = 21;

    for (let hour = startHour; hour < endHour; hour++) {
      const slotTime = new Date(date);
      slotTime.setHours(hour, 0, 0, 0);
      daySlots.push(slotTime);
    }

    if (daySlots.length > 0) {
      slots.push({ date, slots: daySlots });
    }
  }

  return slots;
}

export function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `DD-${timestamp}-${random}`;
}

export function isValidZipCode(zip: string): boolean {
  return /^\d{5}(-\d{4})?$/.test(zip);
}

export function isValidPhone(phone: string): boolean {
  return /^\+?1?\s*\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/.test(phone);
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^1?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
}

export function getImageUrl(path: string | null | undefined): string {
  if (!path) return '/images/placeholder-product.jpg';
  if (path.startsWith('http')) return path;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products/${path}`;
}

export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export const categoryLabels: Record<string, string> = {
  flower: 'Flower',
  edibles: 'Edibles',
  vapes: 'Vapes',
  concentrates: 'Concentrates',
  prerolls: 'Pre-Rolls',
  accessories: 'Accessories',
  topicals: 'Topicals',
};

export const strainTypeLabels: Record<string, string> = {
  indica: 'Indica',
  sativa: 'Sativa',
  hybrid: 'Hybrid',
};

export const orderStatusLabels: Record<string, string> = {
  pending: 'Order Placed',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export const orderStatusColors: Record<string, string> = {
  pending: 'text-yellow-500',
  confirmed: 'text-blue-500',
  preparing: 'text-orange-500',
  out_for_delivery: 'text-purple-500',
  delivered: 'text-green-500',
  cancelled: 'text-red-500',
};
