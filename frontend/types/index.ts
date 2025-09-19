export type Category = {
  href: string;
  label: string;
  img: string;
};

export type Address = {
  street: string;
  city: string;
  state: string;
  country: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
  address?: Address;
};

export type UserStore = {
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
};

export type Product = {
  id?: string;
  title: string;
  description: string;
  price: number;
  quantity: number;
  images: string[];
  condition?: "EXCELLENT" | "GOOD" | "FAIR" | "POOR" | "RESTORED" | "DAMAGED";
  isFeatured?: boolean;
  categoryId?: string;
  ownerId?: string;
  weight?: number | null;
  dimensions?: string | null;
  era?: string | null;
  origin?: string | null;
  material?: string | null;
  authenticity?: "VERIFIED" | "GUARANTEED" | "UNKNOWN" | "DISPUTED";
  provenance?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type ProductStore = {
  products: Product[];
  loading: boolean;

  // setters
  setProducts: (products: Product[]) => void;

  // actions
  fetchAllProducts: () => Promise<void>;
  fetchProductsByCategory: (category: string) => Promise<void>;
  fetchFeaturedProducts: () => Promise<void>;
  createProduct: (data: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  toggleFeaturedProduct: (productId: string) => Promise<void>;
  getProductById: (id: string) => Promise<Product | null>;
};
