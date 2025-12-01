import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Product, CartItemWithProduct, AddressJson } from '@/types/database';

interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

interface CheckoutData {
  address: AddressJson | null;
  deliverySlot: string | null;
  deliveryInstructions: string | null;
  deliveryFee: number;
  tip: number;
  promoCode: string | null;
  discount: number;
}

interface CartState {
  items: CartItem[];
  checkout: CheckoutData;
  isOpen: boolean;
  isLoading: boolean;
  
  // Cart actions
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Drawer
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  
  // Checkout actions
  setAddress: (address: AddressJson) => void;
  setDeliverySlot: (slot: string) => void;
  setDeliveryInstructions: (instructions: string) => void;
  setDeliveryFee: (fee: number) => void;
  setTip: (tip: number) => void;
  setPromoCode: (code: string | null, discount: number) => void;
  resetCheckout: () => void;
  
  // Computed
  getSubtotal: () => number;
  getItemCount: () => number;
  getTax: () => number;
  getTotal: () => number;
}

const initialCheckout: CheckoutData = {
  address: null,
  deliverySlot: null,
  deliveryInstructions: null,
  deliveryFee: 0,
  tip: 0,
  promoCode: null,
  discount: 0,
};

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],
        checkout: initialCheckout,
        isOpen: false,
        isLoading: false,

        addItem: (product, quantity = 1) => {
          set((state) => {
            const existingItem = state.items.find((item) => item.productId === product.id);
            
            if (existingItem) {
              return {
                items: state.items.map((item) =>
                  item.productId === product.id
                    ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
                    : item
                ),
              };
            }
            
            return {
              items: [...state.items, { productId: product.id, quantity, product }],
            };
          });
        },

        removeItem: (productId) => {
          set((state) => ({
            items: state.items.filter((item) => item.productId !== productId),
          }));
        },

        updateQuantity: (productId, quantity) => {
          if (quantity <= 0) {
            get().removeItem(productId);
            return;
          }

          set((state) => ({
            items: state.items.map((item) =>
              item.productId === productId
                ? { ...item, quantity: Math.min(quantity, item.product.stock) }
                : item
            ),
          }));
        },

        clearCart: () => {
          set({ items: [], checkout: initialCheckout });
        },

        openCart: () => set({ isOpen: true }),
        closeCart: () => set({ isOpen: false }),
        toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

        setAddress: (address) => {
          set((state) => ({
            checkout: { ...state.checkout, address },
          }));
        },

        setDeliverySlot: (slot) => {
          set((state) => ({
            checkout: { ...state.checkout, deliverySlot: slot },
          }));
        },

        setDeliveryInstructions: (instructions) => {
          set((state) => ({
            checkout: { ...state.checkout, deliveryInstructions: instructions },
          }));
        },

        setDeliveryFee: (fee) => {
          set((state) => ({
            checkout: { ...state.checkout, deliveryFee: fee },
          }));
        },

        setTip: (tip) => {
          set((state) => ({
            checkout: { ...state.checkout, tip },
          }));
        },

        setPromoCode: (code, discount) => {
          set((state) => ({
            checkout: { ...state.checkout, promoCode: code, discount },
          }));
        },

        resetCheckout: () => {
          set({ checkout: initialCheckout });
        },

        getSubtotal: () => {
          return get().items.reduce(
            (total, item) => total + item.product.price * item.quantity,
            0
          );
        },

        getItemCount: () => {
          return get().items.reduce((count, item) => count + item.quantity, 0);
        },

        getTax: () => {
          const subtotal = get().getSubtotal();
          const discount = get().checkout.discount;
          const taxableAmount = Math.max(0, subtotal - discount);
          const salesTax = parseFloat(process.env.NEXT_PUBLIC_MN_SALES_TAX || '0.06875');
          const exciseTax = parseFloat(process.env.NEXT_PUBLIC_CANNABIS_EXCISE_TAX || '0.10');
          return taxableAmount * (salesTax + exciseTax);
        },

        getTotal: () => {
          const subtotal = get().getSubtotal();
          const tax = get().getTax();
          const { deliveryFee, tip, discount } = get().checkout;
          return Math.max(0, subtotal - discount) + tax + deliveryFee + tip;
        },
      }),
      {
        name: 'dankdeals-cart',
        partialize: (state) => ({
          items: state.items,
          checkout: state.checkout,
        }),
      }
    ),
    { name: 'CartStore' }
  )
);

export const useCart = () => {
  const store = useCartStore();
  return {
    items: store.items,
    checkout: store.checkout,
    isOpen: store.isOpen,
    isLoading: store.isLoading,
    addItem: store.addItem,
    removeItem: store.removeItem,
    updateQuantity: store.updateQuantity,
    clearCart: store.clearCart,
    openCart: store.openCart,
    closeCart: store.closeCart,
    toggleCart: store.toggleCart,
    setAddress: store.setAddress,
    setDeliverySlot: store.setDeliverySlot,
    setDeliveryInstructions: store.setDeliveryInstructions,
    setDeliveryFee: store.setDeliveryFee,
    setTip: store.setTip,
    setPromoCode: store.setPromoCode,
    resetCheckout: store.resetCheckout,
    subtotal: store.getSubtotal(),
    itemCount: store.getItemCount(),
    tax: store.getTax(),
    total: store.getTotal(),
  };
};
