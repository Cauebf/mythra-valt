import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";

export type CommentItem = {
  id: string;
  content: string;
  userId: string;
  author?: string | null;
  authorAvatar?: string | null;
  createdAt: string;
};

type CommentStore = {
  comments: CommentItem[];
  loading: boolean;
  fetchCommentsByAuction: (auctionId: string) => Promise<CommentItem[]>;
  createCommentForAuction: (
    auctionId: string,
    content: string
  ) => Promise<CommentItem | null>;
  setComments: (c: CommentItem[]) => void;
};

export const useCommentStore = create<CommentStore>((set, get) => ({
  comments: [],
  loading: false,

  setComments: (c) => set({ comments: c }),

  fetchCommentsByAuction: async (auctionId: string) => {
    set({ loading: true });
    try {
      const res = await axios.get(`/auctions/${auctionId}/comments`);
      // Expecting: { comments: [...] } or array
      const payload = res.data.comments ?? res.data;
      const comments: CommentItem[] = (payload || []).map((r: any) => ({
        id: r.id,
        content: r.content,
        userId: r.userId,
        author: r.user?.name ?? r.author ?? r.authorName ?? null,
        authorAvatar: r.user?.avatar ?? r.authorAvatar ?? null,
        createdAt: r.createdAt ?? r.created_at ?? new Date().toISOString(),
      }));
      set({ comments, loading: false });
      return comments;
    } catch (error) {
      set({ loading: false });
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Falha ao buscar comentários");
      return [];
    }
  },

  createCommentForAuction: async (auctionId: string, content: string) => {
    set({ loading: true });
    try {
      const res = await axios.post(`/auctions/${auctionId}/comments`, {
        content,
      });
      const raw = res.data.comment ?? res.data;
      const comment: CommentItem = {
        id: raw.id,
        content: raw.content,
        userId: raw.userId,
        author: raw.user?.name ?? raw.author ?? null,
        authorAvatar: raw.user?.avatar ?? raw.authorAvatar ?? null,
        createdAt: raw.createdAt ?? new Date().toISOString(),
      };
      // optimistic append
      set((state) => ({
        comments: [...state.comments, comment],
        loading: false,
      }));
      return comment;
    } catch (error) {
      set({ loading: false });
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Falha ao enviar comentário");
      return null;
    }
  },
}));
