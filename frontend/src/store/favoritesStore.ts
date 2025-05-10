// frontend/src/store/favoritesStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoriteItem {
  id: string;
  // Você pode adicionar outras propriedades do produto se necessário
}

interface FavoritesState {
  items: FavoriteItem[];
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (id) =>
        set((state) => {
          if (!state.items.find((item) => item.id === id)) {
            return { items: [...state.items, { id }] };
          }
          return state; // Se já estiver nos favoritos, não faz nada
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      isFavorite: (id) => !!get().items.find((item) => item.id === id),
    }),
    {
      name: "favorites", // Nome da chave no localStorage
    }
  )
);
