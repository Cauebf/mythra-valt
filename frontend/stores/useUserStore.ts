"use client";

import axios from "@lib/axios";
import { AxiosError } from "@node_modules/axios";
import { create } from "zustand";
import { toast } from "react-hot-toast";
import { UserStore } from "@types";

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  signup: async ({
    name,
    email,
    password,
    confirmPassword,
    street,
    city,
    state,
    country,
  }) => {
    set({ loading: true });

    if (password !== confirmPassword) {
      set({ loading: false });
      toast.error("Senhas não coincidem");
      return { message: "error" };
    }

    try {
      const res = await axios.post("/auth/signup", {
        name,
        email,
        password,
        address: {
          street,
          city,
          state,
          country,
        },
      });

      set({ user: res.data.user, loading: false });
      return { message: "success" };
    } catch (error) {
      set({ loading: false });

      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Falha ao criar conta");
      return { message: "error" };
    }
  },

  login: async (email, password) => {
    set({ loading: true });

    try {
      const res = await axios.post("/auth/login", {
        email,
        password,
      });

      set({ user: res.data.user, loading: false });
      return { message: "success" };
    } catch (error) {
      set({ loading: false });

      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Falha ao logar");
      return { message: "error" };
    }
  },

  logout: async () => {
    try {
      await axios.post("/auth/logout");
      set({ user: null });
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Falha ao deslogar");
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true });

    try {
      const res = await axios.get("/auth/profile");

      set({ user: res.data, checkingAuth: false });
    } catch (error) {
      set({ checkingAuth: false, user: null });
    }
  },

  refreshToken: async () => {
    if (get().checkingAuth) return;

    set({ checkingAuth: true });

    try {
      const res = await axios.post("/auth/refresh-token");

      set({ user: res.data.user, checkingAuth: false });
    } catch (error) {
      set({ user: null, checkingAuth: false });
      throw error;
    }
  },
}));

// axios interceptor para manter o token atualizado
let refreshPromise: Promise<void> | null = null;

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (refreshPromise) {
          await refreshPromise;
          return axios(originalRequest);
        }

        refreshPromise = useUserStore.getState().refreshToken();
        await refreshPromise;
        refreshPromise = null;

        return axios(originalRequest);
      } catch (refreshError) {
        useUserStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
