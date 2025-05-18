// frontend/src/store/favoritesStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoriteItem {
  id: string;
  imagemUrl: string; // Adicione a propriedade imagemUrl
  slug: string; // Adicione a propriedade slug
  nome: string; // Adicione a propriedade nome (opcional, mas útil)
  // Adicione outras propriedades relevantes do produto que você precisa exibir
}

export interface FavoritesState {
  items: FavoriteItem[];
  addItem: (product: {
    id: string;
    imagemUrl: string;
    slug: string;
    nome: string;
  }) => void; // Aceita o objeto do produto
  removeItem: (id: string) => void;
  isFavorite: (id: string) => boolean;
  clearFavorites: () => void; // Adicione a função para limpar os favoritos
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) =>
        set((state) => {
          if (!state.items.find((item) => item.id === product.id)) {
            return {
              items: [
                ...state.items,
                {
                  id: product.id,
                  imagemUrl: product.imagemUrl,
                  slug: product.slug,
                  nome: product.nome,
                },
              ],
            };
          }
          return state;
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      isFavorite: (id) => !!get().items.find((item) => item.id === id),
      clearFavorites: () => set({ items: [] }), // Implementa a função clearFavorites
    }),
    {
      name: "favorites",
    }
  )
);
