import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";

type Review = {
  id: string;
  rating: number;
  content: string;
  author: string;
  authorAvatar?: string;
  createdAt: string;
};

type ReviewStore = {
  reviews: Review[];
  loading: boolean;
  fetchReviewsByProduct: (productId: string) => Promise<void>;
  createReview: (
    productId: string,
    rating: number,
    content: string
  ) => Promise<Review | null>;
};

export const useReviewStore = create<ReviewStore>((set) => ({
  reviews: [],
  loading: false,

  fetchReviewsByProduct: async (productId: string) => {
    set({ loading: true });
    try {
      const res = await axios.get(`/reviews/product/${productId}`);
      const payload = res.data.reviews ?? [];
      const mapped = payload.map((r: any) => ({
        id: r.id,
        rating: r.rating,
        content: r.content,
        author: r.author?.name ?? "Usuário",
        authorAvatar: r.author?.avatar,
        createdAt: r.createdAt,
      }));
      set({ reviews: mapped, loading: false });
    } catch (error) {
      set({ loading: false });
      const err = error as AxiosError<{ message?: string }>;
      toast.error(
        err.response?.data?.message || "Falha ao carregar avaliações"
      );
    }
  },

  createReview: async (productId: string, rating: number, content: string) => {
    set({ loading: true });
    try {
      const res = await axios.post(`/reviews/product/${productId}`, {
        rating,
        content,
      });
      const r = res.data.review ?? res.data;
      const mapped = {
        id: r.id,
        rating: r.rating,
        content: r.content,
        author: r.author?.name ?? "Você",
        authorAvatar: r.author?.avatar,
        createdAt: r.createdAt,
      };
      set((s) => ({ reviews: [mapped, ...s.reviews], loading: false }));
      return mapped;
    } catch (error) {
      set({ loading: false });
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Falha ao enviar avaliação");
      return null;
    }
  },
}));
