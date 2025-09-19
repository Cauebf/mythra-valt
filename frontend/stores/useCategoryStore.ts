import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import type { Category, CategoryStore } from "@types";

export const useCategoryStore = create<CategoryStore>((set) => ({
  categories: [],
  loading: false,

  setCategories: (cats: Category[]) => set({ categories: cats }),

  fetchAllCategories: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/categories");
      // backend returns array
      const payload = res.data;
      const categories: Category[] = Array.isArray(payload)
        ? payload
        : payload.categories ?? payload;
      set({ categories, loading: false });
    } catch (error) {
      set({ loading: false });
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Failed to fetch categories");
    }
  },

  createCategory: async (name: string) => {
    set({ loading: true });
    try {
      const res = await axios.post("/categories", { name });
      const created: Category = res.data.category ?? res.data;
      set((state) => ({
        categories: [...state.categories, created],
        loading: false,
      }));
      toast.success("Category created");
    } catch (error) {
      set({ loading: false });
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Failed to create category");
    }
  },

  updateCategory: async (id: string, name: string) => {
    set({ loading: true });
    try {
      const res = await axios.patch(`/categories/${id}`, { name });
      const updated: Category = res.data.category ?? res.data;
      set((state) => ({
        categories: state.categories.map((c) => (c.id === id ? updated : c)),
        loading: false,
      }));
      toast.success("Category updated");
    } catch (error) {
      set({ loading: false });
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Failed to update category");
    }
  },

  deleteCategory: async (id: string) => {
    set({ loading: true });
    try {
      await axios.delete(`/categories/${id}`);
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
        loading: false,
      }));
      toast.success("Category deleted");
    } catch (error) {
      set({ loading: false });
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Failed to delete category");
    }
  },

  getCategoryById: async (id: string) => {
    set({ loading: true });
    try {
      const res = await axios.get(`/categories/${id}`);
      const category: Category = res.data.category ?? res.data;
      set({ loading: false });
      return category;
    } catch (error) {
      set({ loading: false });
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Failed to fetch category");
      return null;
    }
  },
}));
