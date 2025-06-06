import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  nome: string;
  preco: number;
  quantidade: number;
  imagemUrl: string;
  cor?: string | null;
  tamanho?: string | null;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, cor: string | null, tamanho: string | null) => void;
  updateQuantity: (
    id: string,
    quantity: number,
    cor?: string | null,
    tamanho?: string | null
  ) => void;
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
          const existingItem = state.items.find(
            (i) =>
              i.id === item.id &&
              i.cor === item.cor &&
              i.tamanho === item.tamanho
          );
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id &&
                i.cor === item.cor &&
                i.tamanho === item.tamanho
                  ? { ...i, quantidade: i.quantidade + item.quantidade }
                  : i
              ),
            };
          } else {
            return { items: [...state.items, { ...item }] };
          }
        }),
      removeItem: (id: string, cor?: string | null, tamanho?: string | null) =>
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(item.id === id && item.cor === cor && item.tamanho === tamanho)
          ),
        })),
      updateQuantity: (id, quantity, cor, tamanho) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id && item.cor === cor && item.tamanho === tamanho
              ? { ...item, quantidade: quantity }
              : item
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
      name: "shopping-cart",
    }
  )
);
