import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import { Auction, AuctionStore, Bid, CreateAuctionDto } from "@types";

export const useAuctionStore = create<AuctionStore>((set, get) => ({
  auctions: [],
  activeAuctions: [],
  loading: false,

  setAuctions: (a: Auction[]) => set({ auctions: a }),
  setActiveAuctions: (a: Auction[]) => set({ activeAuctions: a }),

  fetchAllAuctions: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/auctions");
      // controller returns { auctions: Auction[] }
      const payload = res.data.auctions ?? res.data;

      const auctions: Auction[] = (payload || []).map((raw: any) => ({
        ...raw,
        startingBid:
          typeof raw.startingBid === "string"
            ? parseFloat(raw.startingBid)
            : raw.startingBid,
      }));
      set({ auctions, loading: false });
    } catch (error) {
      set({ loading: false });
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Falha ao buscar leilões");
    }
  },

  fetchActiveAuctions: async (limit) => {
    set({ loading: true });
    try {
      const res = limit
        ? await axios.get(`/auctions/active?limit=${limit}`)
        : await axios.get("/auctions/active");
      const payload = res.data.auctions ?? [];
      const active: Auction[] = (payload || []).map((raw: any) => ({
        ...raw,
        startingBid:
          typeof raw.startingBid === "string"
            ? parseFloat(raw.startingBid)
            : raw.startingBid,
      }));
      set({ activeAuctions: active, loading: false });
    } catch (error) {
      set({ loading: false });
      const err = error as AxiosError<{ message?: string }>;
      toast.error(
        err.response?.data?.message || "Falha ao buscar leilões ativos"
      );
    }
  },

  fetchAuctionById: async (id: string) => {
    set({ loading: true });
    try {
      const res = await axios.get(`/auctions/${id}`);
      const raw = res.data.auction ?? res.data;
      const auction: Auction = {
        ...raw,
        startingBid:
          typeof raw.startingBid === "string"
            ? parseFloat(raw.startingBid)
            : raw.startingBid,
      };
      set({ loading: false });
      return auction;
    } catch (error) {
      set({ loading: false });
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Falha ao buscar leilão");
      return null;
    }
  },

  fetchAuctionsByCategory: async (category: string) => {
    set({ loading: true });
    try {
      const res = await axios.get(
        `/auctions/category/${encodeURIComponent(category)}`
      );
      const payload = res.data.auctions ?? res.data;
      const auctions: Auction[] = (payload || []).map((raw: any) => ({
        ...raw,
        startingBid:
          typeof raw.startingBid === "string"
            ? parseFloat(raw.startingBid)
            : raw.startingBid,
      }));
      set({ auctions, loading: false });
    } catch (error) {
      set({ loading: false });
      const err = error as AxiosError<{ message?: string }>;
      toast.error(
        err.response?.data?.message || "Falha ao buscar leilões por categoria"
      );
    }
  },

  createAuction: async (payload: CreateAuctionDto) => {
    set({ loading: true });
    try {
      const res = await axios.post("/auctions", payload);
      const raw = res.data.auction ?? res.data;
      const auction: Auction = {
        ...raw,
        startingBid:
          typeof raw.startingBid === "string"
            ? parseFloat(raw.startingBid)
            : raw.startingBid,
      };

      // optimistic update: append to auctions list
      set((state) => ({
        auctions: [...state.auctions, auction],
        loading: false,
      }));
      toast.success("Leilão criado com sucesso");
      return auction;
    } catch (error) {
      set({ loading: false });
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Falha ao criar leilão");
      return null;
    }
  },

  deleteAuction: async (id: string) => {
    set({ loading: true });
    try {
      await axios.delete(`/auctions/${id}`);

      // update local lists
      set((state) => ({
        auctions: state.auctions.filter((a) => a.id !== id),
        activeAuctions: state.activeAuctions.filter((a) => a.id !== id),
        loading: false,
      }));

      toast.success("Leilão removido");
      return true;
    } catch (error) {
      set({ loading: false });
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Falha ao deletar leilão");
      return false;
    }
  },

  placeBid: async (auctionId: string, amount: number) => {
    set({ loading: true });
    try {
      const res = await axios.post(`/auctions/${auctionId}/bid`, { amount });
      const raw = res.data.bid ?? res.data;
      const bid: Bid = {
        ...raw,
        amount:
          typeof raw.amount === "string" ? parseFloat(raw.amount) : raw.amount,
      };

      // update local auction's bids (optimistic)
      set((state) => {
        const auctions = state.auctions.map((a) => {
          if (a.id === auctionId) {
            const bids = a.bids ? [bid, ...a.bids] : [bid];
            return { ...a, bids };
          }
          return a;
        });

        const activeAuctions = state.activeAuctions.map((a) => {
          if (a.id === auctionId) {
            const bids = a.bids ? [bid, ...a.bids] : [bid];
            return { ...a, bids };
          }
          return a;
        });

        return { auctions, activeAuctions, loading: false };
      });

      toast.success("Lance enviado");
      return bid;
    } catch (error) {
      set({ loading: false });
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Falha ao registrar lance");
      return null;
    }
  },
}));
