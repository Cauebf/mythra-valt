import { create } from "zustand";
import axios from "@/lib/axios";
import toast from "react-hot-toast";

export type CartProduct = {
  id: string;
  title: string;
  price: number;
  images?: string[];
  quantity: number;
  stock?: number; // estoque conhecido do produto
};

type CartState = {
  items: CartProduct[];
  loading: boolean;
  pendingIds: string[]; // ids que estão em atualização (para indicador por-item)
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
        id: it.product?.id ?? it.productId ?? it.id,
        title: it.product?.title ?? it.product?.name ?? "Item",
        price: Number(it.product?.price ?? it.price ?? 0),
        images: it.product?.images ?? [],
        quantity: it.quantity ?? it.qty ?? 1,
        stock: it.product?.quantity ?? it.product?.stock ?? undefined,
      }));
      set({ items, loading: false });
      get()._recalcSubtotal();
    } catch (err) {
      set({ loading: false, items: [] });
      toast.error("Falha ao carregar carrinho");
    }
  },

  addToCart: async (productId: string, quantity = 1) => {
    const prev = get().items;
    const existing = prev.find((i) => i.id === productId);

    // Se já existe e sabemos o stock localmente, bloqueia quando extrapolar
    if (existing && typeof existing.stock === "number") {
      if (existing.quantity + quantity > (existing.stock ?? Infinity)) {
        toast.error("Quantidade solicitada excede o estoque disponível");
        return;
      }
    }

    // optimistic update local
    if (existing) {
      set({
        items: prev.map((i) =>
          i.id === productId ? { ...i, quantity: i.quantity + quantity } : i
        ),
      });
    } else {
      const newItem: CartProduct = {
        id: productId,
        title: "Carregando título...",
        price: 0,
        images: [],
        quantity,
        stock: undefined,
      };
      set({ items: [...prev, newItem] });
    }
    get()._recalcSubtotal();

    try {
      await axios.post("/cart", { productId, quantity });
      // refresh para garantir dados corretos (nome, preço, imagens, stock)
      await get().fetchCart();
      toast.success("Adicionado ao carrinho");
    } catch (err: any) {
      // rollback
      set({ items: prev });
      get()._recalcSubtotal();
      toast.error(
        err?.response?.data?.message || "Falha ao adicionar ao carrinho"
      );
      throw err;
    }
  },

  clearCart: async () => {
    try {
      await axios.delete("/cart");
      await get().fetchCart();
      get().clearCartLocal();
      toast.success("Carrinho limpo com sucesso");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Falha ao limpar carrinho");
    }
  },

  removeFromCart: async (productId: string) => {
    const prev = get().items;
    set({
      items: prev.filter((i) => i.id !== productId),
      pendingIds: [...get().pendingIds, productId],
    });
    get()._recalcSubtotal();

    try {
      await axios.delete(`/cart/${encodeURIComponent(productId)}`);
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
      return get().removeFromCart(productId);
    }

    const prev = get().items;
    const target = prev.find((i) => i.id === productId);
    if (!target) return;

    // evita múltiplas requisições concorrentes para o mesmo item
    if (get().pendingIds.includes(productId)) {
      return;
    }

    let knownStock = target.stock;

    // se stock desconhecido, tenta buscar do backend antes de validar
    if (typeof knownStock !== "number") {
      try {
        const res = await axios.get(
          `/products/${encodeURIComponent(productId)}`
        );
        const prod = res.data.product ?? res.data;

        knownStock = prod?.quantity;

        // grava o stock localmente no item (se encontrado)
        if (knownStock !== undefined) {
          set({
            items: prev.map((i) =>
              i.id === productId ? { ...i, stock: knownStock } : i
            ),
          });
        }
      } catch (err) {
        // se falhar ao buscar stock não bloqueamos, mas avisamos
        console.warn(
          "Não foi possível obter estoque do produto antes do update",
          err
        );
      }
    }

    // se sabemos o stock, limitamos newQuantity imediatamente
    if (typeof knownStock === "number" && newQuantity > knownStock) {
      toast.error("Não é possível ultrapassar a quantidade em estoque.");
      // atualizar localmente para mostrar o máximo disponível
      const clamped = knownStock;
      set({
        items: prev.map((i) =>
          i.id === productId ? { ...i, quantity: clamped, stock: clamped } : i
        ),
      });
      get()._recalcSubtotal();
      return;
    }

    // optimistic update local e marca como pending
    set({
      items: prev.map((i) =>
        i.id === productId ? { ...i, quantity: newQuantity, stock: knownStock } : i
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
      // rollback em caso de erro
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
