import { create } from "zustand";
import axios from "@/lib/axios";
import toast from "react-hot-toast";

export type CartProduct = {
  id: string;
  title: string;
  price: number;
  images?: string[];
  quantity: number;
};

type CartState = {
  items: CartProduct[];
  loading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCartLocal: () => void;
  subtotal: number;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  loading: false,
  subtotal: 0,

  fetchCart: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/cart");
      // Expect res.data = { items: [ { product: { ... }, quantity } ] } OR array
      const payload = res.data.items ?? res.data;
      const items = payload.map((it: any) => ({
        id: it.product.id ?? it.productId ?? it.id,
        title: it.product.title ?? it.product.name ?? "Item",
        price: Number(it.product.price ?? it.price ?? 0),
        images: it.product.images ?? it.product.image ? [it.product.image] : [],
        quantity: it.quantity ?? it.qty ?? 1,
      }));
      set({ items, loading: false });
      // update subtotal
      const subtotal = items.reduce(
        (s: number, it: any) => s + it.price * it.quantity,
        0
      );
      set({ subtotal });
    } catch (err) {
      set({ loading: false, items: [] });
      toast.error("Falha ao carregar carrinho");
    }
  },

  addToCart: async (productId: string, quantity = 1) => {
    set({ loading: true });
    try {
      await axios.post("/cart", { productId, quantity });
      // refresh
      await get().fetchCart();
      toast.success("Adicionado ao carrinho");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Falha ao adicionar ao carrinho"
      );
    } finally {
      set({ loading: false });
    }
  },

  removeFromCart: async (productId: string) => {
    set({ loading: true });
    try {
      await axios.delete(`/cart/${encodeURIComponent(productId)}`);
      await get().fetchCart();
      toast.success("Removido do carrinho");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Falha ao remover do carrinho"
      );
    } finally {
      set({ loading: false });
    }
  },

  updateQuantity: async (productId: string, quantity: number) => {
    set({ loading: true });
    try {
      await axios.put(`/cart/${encodeURIComponent(productId)}`, { quantity });
      await get().fetchCart();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Falha ao atualizar quantidade"
      );
    } finally {
      set({ loading: false });
    }
  },

  clearCartLocal: () => {
    set({ items: [], subtotal: 0 });
  },
}));
