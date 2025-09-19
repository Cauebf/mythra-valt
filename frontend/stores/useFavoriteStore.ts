import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";

type FavoriteItem = { id: string; productId: string; product?: any };

type FavoriteStore = {
  favorites: FavoriteItem[];
  loading: boolean;
  fetchUserFavorites: () => Promise<void>;
  toggleFavorite: (productId: string) => Promise<void>;
  isFavoriteForProduct: (productId: string) => boolean;
};

export const useFavoriteStore = create<FavoriteStore>((set, get) => ({
  favorites: [],
  loading: false,

  fetchUserFavorites: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/favorites");
      set({ favorites: res.data.favorites || [], loading: false });
    } catch (error) {
      set({ loading: false });
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Falha ao carregar favoritos");
    }
  },

  toggleFavorite: async (productId: string) => {
    set({ loading: true });
    try {
      const res = await axios.post(`/favorites/toggle/${productId}`);
      // backend returns { removed: true } ou { favorite }
      if (res.data.removed) {
        set((s) => ({
          favorites: s.favorites.filter((f) => f.productId !== productId),
          loading: false,
        }));
      } else if (res.data.favorite) {
        set((s) => ({
          favorites: [res.data.favorite, ...s.favorites],
          loading: false,
        }));
      } else {
        // refresh
        await get().fetchUserFavorites();
        set({ loading: false });
      }
    } catch (error) {
      set({ loading: false });
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Falha ao atualizar favorito");
    }
  },

  isFavoriteForProduct: (productId: string) => {
    return get().favorites.some((f) => f.productId === productId);
  },
}));
