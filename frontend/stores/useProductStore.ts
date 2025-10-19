import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import { Product, ProductStore } from "@types";

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  featuredProducts: [],
  loading: false,

  setProducts: (products: Product[]) => set({ products }),

  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/products");
      // expect { products: Product[] }
      set({ products: res.data.products || [], loading: false });
    } catch (error) {
      set({ loading: false });
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Failed to fetch products");
    }
  },

  fetchProductsByCategory: async (category: string) => {
    set({ loading: true });
    try {
      const res = await axios.get(
        `/products/category/${encodeURIComponent(category)}`
      );
      set({ products: res.data.products || [], loading: false });
    } catch (error) {
      set({ loading: false });
      const err = error as AxiosError<{ message?: string }>;
      toast.error(
        err.response?.data?.message || "Failed to fetch products by category"
      );
    }
  },

  fetchFeaturedProducts: async (limit = 8) => {
    set({ loading: true });
    try {
      const res = await axios.get(`/products/featured?limit=${limit}`);
      const payload = res.data.products ?? res.data;
      set({ featuredProducts: payload, loading: false });
    } catch (error) {
      set({ loading: false });
      const err = error as AxiosError<{ message?: string }>;
      toast.error(
        err.response?.data?.message || "Falha ao buscar produtos em destaque"
      );
    }
  },

  createProduct: async (productData: Product) => {
    set({ loading: true });
    try {
      const res = await axios.post("/products", productData);
      const created: Product = res.data.product;
      // optimistic update: append to current list
      set((state) => ({
        products: [...state.products, created],
        loading: false,
      }));
      toast.success("Product created successfully");
      return created;
    } catch (error) {
      set({ loading: false });
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Failed to create product");
      return null;
    }
  },

  deleteProduct: async (productId: string) => {
    set({ loading: true });
    try {
      await axios.delete(`/products/${productId}`);
      // update store: remove by id
      set((state) => ({
        products: state.products.filter((p) => p.id !== productId),
        loading: false,
      }));
      toast.success("Product deleted successfully");
    } catch (error) {
      set({ loading: false });
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Failed to delete product");
    }
  },

  getProductById: async (id: string) => {
    set({ loading: true });
    try {
      const res = await axios.get(`/products/${id}`);
      // controller might return { product }
      const product = res.data.product ?? res.data;
      set({ loading: false });
      return product as Product;
    } catch (error) {
      set({ loading: false });
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Failed to fetch product");
      return null;
    }
  },
}));
