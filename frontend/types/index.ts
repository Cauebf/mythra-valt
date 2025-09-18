export type Category = {
  href: string;
  label: string;
  img: string;
};

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
  address?: Address;
}

export interface UserStore {
  user: User | null;
  loading: boolean;
  checkingAuth?: boolean;

  signup: (data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    street: string;
    city: string;
    state: string;
    country: string;
  }) => Promise<void | { message: string }>;
  login: (
    email: string,
    password: string
  ) => Promise<void | { message: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  refreshToken: () => Promise<void>;
}
