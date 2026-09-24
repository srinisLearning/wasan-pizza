import { create } from "zustand";

export interface ICartItem {
  pizzaId: string;
  name: string;
  image: string;
  variantId: string;
  variantType: string;
  price: number;
  quantity: number;
}

interface CartStoreType {
  cartItems: ICartItem[];
  addToCart: (item: ICartItem) => void;
  removeFromCart: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStoreType>((set) => ({
  cartItems: [],
  addToCart: (item: ICartItem) =>
    set((state) => {
      // Check if item already exists in cart based on pizza and variant
      const existingItemIndex = state.cartItems.findIndex(
        (i) => i.pizzaId === item.pizzaId && i.variantId === item.variantId
      );

      if (existingItemIndex !== -1) {
        // Update quantity
        const updatedCart = [...state.cartItems];
        updatedCart[existingItemIndex].quantity += item.quantity;
        return { cartItems: updatedCart };
      }

      // Add new item
      return { cartItems: [...state.cartItems, item] };
    }),
  removeFromCart: (variantId: string) =>
    set((state) => ({
      cartItems: state.cartItems.filter((i) => i.variantId !== variantId),
    })),
  updateQuantity: (variantId: string, quantity: number) =>
    set((state) => {
      const updatedCart = state.cartItems.map((item) => {
        if (item.variantId === variantId) {
          return { ...item, quantity };
        }
        return item;
      });
      return { cartItems: updatedCart };
    }),
  clearCart: () => set({ cartItems: [] }),
}));
