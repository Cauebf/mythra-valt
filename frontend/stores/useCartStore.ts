import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";

type CartItem = {
  id: string;
  productId: string;
  quantity: number;
  product?: any;
};

type Cart = {
  id: string;
  items: CartItem[];
};

type CartStore = {
  cart: Cart | null;
  loading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
};

export const useCartStore = create<CartStore>((set) => ({
  cart: null,
  loading: false,

  fetchCart: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/cart");
      set({ cart: res.data.cart ?? null, loading: false });
    } catch (error) {
      set({ loading: false });
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Falha ao carregar carrinho");
    }
  },

  addToCart: async (productId: string, quantity: number) => {
    set({ loading: true });
    try {
      await axios.post("/cart/add", { productId, quantity });
      // refresh
      const res = await axios.get("/cart");
      set({ cart: res.data.cart ?? null, loading: false });
    } catch (error) {
      set({ loading: false });
      const err = error as AxiosError<{ message?: string }>;
      toast.error(
        err.response?.data?.message || "Falha ao adicionar ao carrinho"
      );
      throw error;
    }
  },

  removeFromCart: async (productId: string) => {
    set({ loading: true });
    try {
      await axios.delete(`/cart/item/${encodeURIComponent(productId)}`);
      const res = await axios.get("/cart");
      set({ cart: res.data.cart ?? null, loading: false });
    } catch (error) {
      set({ loading: false });
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Falha ao remover item");
    }
  },
}));
