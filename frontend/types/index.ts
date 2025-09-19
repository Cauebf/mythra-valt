export type CategoryCardType = {
  href: string;
  label: string;
  img: string;
};

export type Condition =
  | "EXCELENTE"
  | "BOM"
  | "REGULAR"
  | "RESTAURADA"
  | "DANIFICADA";

export type Authenticity =
  | "VERIFICADA"
  | "GARANTIDA"
  | "DESCONHECIDA"
  | "CONTESTADA";

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
  condition?: Condition;
  isFeatured?: boolean;
  categoryId?: string;
  ownerId?: string;
  weight?: number | null;
  dimensions?: string | null;
  era?: string | null;
  origin?: string | null;
  material?: string | null;
  authenticity?: Authenticity | null;
  provenance?: string | null;
  createdAt?: string;
  updatedAt?: string;
  category?: Category | null;
  avgRating?: number;
  _count?: {
    reviews?: number;
  };
  specifications?: { name: string; value: string }[];
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

export type Bid = {
  id: string;
  amount: number;
  createdAt: string;
  auctionId: string;
  userId: string;
  bidder?: { id: string; name?: string; email?: string } | null;
};

export type Auction = {
  id?: string;
  title: string;
  description: string;
  images: string[];
  era?: string | null;
  origin?: string | null;
  material?: string | null;
  authenticity?: Authenticity | null;
  condition?: Condition | null;
  provenance?: string | null;
  certificateUrl?: string | null;
  dimensions?: string | null;
  startingBid: number;
  startTime: string;
  endTime: string;
  ownerId?: string;
  categoryId: string;
  bids?: Bid[];
  comments?: any[];
  createdAt?: string;
  updatedAt?: string;
};

export type CreateAuctionDto = Partial<
  Pick<
    Auction,
    | "title"
    | "description"
    | "images"
    | "era"
    | "origin"
    | "material"
    | "authenticity"
    | "provenance"
    | "certificateUrl"
    | "dimensions"
    | "startingBid"
    | "startTime"
    | "endTime"
    | "categoryId"
  >
>;

export type AuctionStore = {
  auctions: Auction[];
  activeAuctions: Auction[];
  loading: boolean;

  setAuctions: (a: Auction[]) => void;
  setActiveAuctions: (a: Auction[]) => void;

  fetchAllAuctions: () => Promise<void>;
  fetchActiveAuctions: () => Promise<void>;
  fetchAuctionById: (id: string) => Promise<Auction | null>;
  fetchAuctionsByCategory: (category: string) => Promise<void>;

  createAuction: (payload: CreateAuctionDto) => Promise<Auction | null>;
  deleteAuction: (id: string) => Promise<boolean>;
  placeBid: (auctionId: string, amount: number) => Promise<Bid | null>;
};

export type Category = {
  id: string;
  name: string;
};

export type CategoryStore = {
  categories: Category[];
  loading: boolean;

  setCategories: (cats: Category[]) => void;

  fetchAllCategories: () => Promise<void>;
  createCategory: (name: string) => Promise<void>;
  updateCategory: (id: string, name: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  getCategoryById: (id: string) => Promise<Category | null>;
};
