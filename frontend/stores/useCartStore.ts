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
  pendingIds: string[]; // ids que estão em atualização (para spinner por-item)
  subtotal: number;
  _recalcSubtotal: () => void;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  clearCart: () => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCartLocal: () => void;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  loading: false,
  pendingIds: [],
  subtotal: 0,

  // calcula subtotal com base no estado atual
  _recalcSubtotal: () => {
    const items = get().items;
    const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
    set({ subtotal });
  },

  fetchCart: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/cart");
      const payload = res.data.items ?? res.data;
      const items: CartProduct[] = (payload || []).map((it: any) => ({
        id: it.product.id ?? it.productId ?? it.id,
        title: it.product.title ?? it.product.name ?? "Item",
        price: Number(it.product.price ?? it.price ?? 0),
        images: it.product?.images ?? [],
        quantity: it.quantity ?? it.qty ?? 1,
      }));
      set({ items, loading: false });
      get()._recalcSubtotal();
    } catch (err) {
      set({ loading: false, items: [] });
      toast.error("Falha ao carregar carrinho");
    }
  },

  addToCart: async (productId: string, quantity = 1) => {
    // Otimista: se o item existe incrementa localmente, senão cria localmente com dados mínimos.
    const prev = get().items;
    const existing = prev.find((i) => i.id === productId);
    if (existing) {
      set({
        items: prev.map((i) =>
          i.id === productId ? { ...i, quantity: i.quantity + quantity } : i
        ),
      });
    } else {
      // criar placeholder — idealmente você teria dados do produto no frontend
      const newItem: CartProduct = {
        id: productId,
        title: "Carregando título...",
        price: 0,
        images: [],
        quantity,
      };
      set({ items: [...prev, newItem] });
    }
    get()._recalcSubtotal();

    try {
      await axios.post("/cart", { productId, quantity });
      // refresh para garantir dados consistentes (nome, preço, imagens)
      await get().fetchCart();
      toast.success("Adicionado ao carrinho");
    } catch (err: any) {
      // rollback
      set({ items: prev });
      get()._recalcSubtotal();
      toast.error(
        err?.response?.data?.message || "Falha ao adicionar ao carrinho"
      );
    }
  },

  clearCart: async () => {
    try {
      await axios.delete("/cart");
      get().fetchCart();
      get().clearCartLocal();
      toast.success("Carrinho limpo com sucesso");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Falha ao limpar carrinho");
    }
  },

  removeFromCart: async (productId: string) => {
    const prev = get().items;
    // optimistic remove
    set({
      items: prev.filter((i) => i.id !== productId),
      pendingIds: [...get().pendingIds, productId],
    });
    get()._recalcSubtotal();

    try {
      await axios.delete(`/cart/${encodeURIComponent(productId)}`);
      // success -> remove pendingId
      set({ pendingIds: get().pendingIds.filter((id) => id !== productId) });
      toast.success("Removido do carrinho");
    } catch (err: any) {
      // rollback
      set({
        items: prev,
        pendingIds: get().pendingIds.filter((id) => id !== productId),
      });
      get()._recalcSubtotal();
      toast.error(
        err?.response?.data?.message || "Falha ao remover do carrinho"
      );
    }
  },

  updateQuantity: async (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      // delegate to remove
      return get().removeFromCart(productId);
    }

    const prev = get().items;
    const target = prev.find((i) => i.id === productId);
    if (!target) return;

    // optimistic update local
    set({
      items: prev.map((i) =>
        i.id === productId ? { ...i, quantity: newQuantity } : i
      ),
      pendingIds: [...get().pendingIds, productId],
    });
    get()._recalcSubtotal();

    try {
      await axios.put(`/cart/${encodeURIComponent(productId)}`, {
        quantity: newQuantity,
      });
      // success -> remove pending
      set({ pendingIds: get().pendingIds.filter((id) => id !== productId) });
    } catch (err: any) {
      // rollback
      set({
        items: prev,
        pendingIds: get().pendingIds.filter((id) => id !== productId),
      });
      get()._recalcSubtotal();
      toast.error(
        err?.response?.data?.message || "Falha ao atualizar quantidade"
      );
    }
  },

  clearCartLocal: () => {
    set({ items: [], subtotal: 0 });
  },
}));
