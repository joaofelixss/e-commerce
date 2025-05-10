// frontend/src/store/cartStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  id: string;
  nome: string;
  preco: number;
  quantidade: number;
  imagemUrl: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  totalItems: () => number;
  totalPrice: () => number;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantidade: i.quantidade + 1 } : i
              ),
            };
          } else {
            return { items: [...state.items, { ...item, quantidade: 1 }] };
          }
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantidade: quantity } : item
          ),
        })),
      totalItems: () =>
        get().items.reduce((total, item) => total + item.quantidade, 0),
      totalPrice: () =>
        get().items.reduce(
          (total, item) => total + item.preco * item.quantidade,
          0
        ),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "shopping-cart", // Nome da chave no localStorage onde os dados serão salvos
      // getStorage: () => localStorage, // Por padrão, usa localStorage
    }
  )
);
