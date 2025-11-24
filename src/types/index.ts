// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  image?: string;
  role: 'admin' | 'user';
  provider?: 'google' | 'credentials';
  emailVerified?: Date;
  isVerified?: boolean;
  isAdmin?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  lastLogin?: Date;
}

export interface AuthResponse {
  user: User;
  token?: string;
  message?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface SocialLoginRequest {
  provider: 'google' | 'facebook';
  token: string;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  priority?: number;
  isFeatured?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Brand Types
export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  isFeatured?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Product Configuration Types
export interface StorageConfig {
  id?: string;
  name: string;
  basicPrice: number;
  shortDetails?: string;
  colorStocks?: Record<string, number>;
  prices?: Record<string, number>;
  inStock: boolean;
}

export interface ImageConfig {
  id?: string;
  colorName: string;
  colorHex: string;
  image: string;
  inStock: boolean;
}

export interface ColorImageConfigItem {
  id?: string;
  color: string;
  image: string;
  price: number;
  inStock: boolean;
}

export interface SimConfig {
  id?: string;
  name: string;
  details: string;
}

export interface ConfigItem {
  id?: string;
  label: string;
  price: number;
  inStock: boolean;
}

export interface DetailConfig {
  id?: string;
  label: string;
  value: string;
}

export interface SecondConfig {
  id?: string;
  seconddetails: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  color: string;
  storage: string;
  ram?: string;
  sim?: string;
  price: number;
  inStock: boolean;
  sku: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  images?: string[];
}

export interface Variant {
  id?: string;
  storage: string;
  color: string;
  colorHex: string;
  price: number;
  stock: number;
  images: string[];
}

// Product Types
export type ProductType = 'GENERAL' | 'MACBOOK' | 'LENDING' | 'OTHER';

export interface ProductSpec {
  id?: string;
  title: string;
  value: string;
}

export interface ProductHighlight {
  id?: string;
  text: string;
}

export interface Specification {
  id?: string;
  key: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  productlinkname: string;
  brandId: string;
  brand?: Brand;
  categoryId: string;
  category?: Category;
  model?: string;
  basePrice: number;
  shortDescription?: string;
  fullDescription?: string;
  image?: string;
  images?: string[];
  isFeatured?: boolean;
  isNew?: boolean;
  isHot?: boolean;
  productType?: ProductType;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  storageConfigs?: StorageConfig[];
  imageConfigs?: ImageConfig[];
  colorImageConfigs?: ColorImageConfigItem[];
  simConfigs?: SimConfig[];
  variants?: ProductVariant[];
  specs?: ProductSpec[];
  highlights?: ProductHighlight[];
  specifications?: Specification[];
  details?: DetailConfig[];
  secondDetails?: SecondConfig[];
  faqs?: FAQ[];
  reviews?: Review[];
  priceHistory?: PriceHistory[];
  preOrderConfig?: PreOrderConfig;
  stock?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PreOrderConfig {
  id?: string;
  enabled: boolean;
  expectedDate?: Date;
  note?: string;
}

export interface PriceHistory {
  id?: string;
  oldPrice: number;
  newPrice: number;
  createdAt?: Date;
}

// Review Types
export interface Review {
  id: string;
  userId: string;
  user?: User;
  productId: string;
  rating: number;
  comment?: string;
  helpful?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateReviewRequest {
  productId: string;
  rating: number;
  comment?: string;
}

// Order Types
export interface OrderItem {
  id?: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  color?: string;
  storage?: string;
  ram?: string;
  sim?: string;
  display?: string;
  region?: string;
  image?: string;
  dynamicInputs?: Record<string, any>;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  user?: User;
  items: OrderItem[];
  customer: {
    name: string;
    phone: string;
    email?: string;
    address?: string;
  };
  total: number;
  basePrice?: number;
  quantity?: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: string;
  shippingAddress?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  customer: {
    name: string;
    phone: string;
    email?: string;
    address?: string;
  };
  paymentMethod?: string;
  shippingAddress?: string;
  notes?: string;
}

export interface EMICalculation {
  amount: number;
  months: number;
  monthlyAmount: number;
  totalInterest: number;
  totalAmount: number;
}

// Warranty Types
export interface WarrantyRecord {
  id: string;
  productId: string;
  product?: Product;
  imei: string;
  serial: string;
  phone: string;
  purchaseDate: Date;
  expiryDate: Date;
  status: 'active' | 'inactive' | 'expired' | 'claimed';
  activatedBy?: string;
  orderId?: string;
  order?: Order;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WarrantyLog {
  id?: string;
  warrantyId: string;
  action: string;
  changes?: Record<string, any>;
  admin?: string;
  createdAt?: Date;
}

export interface ActivateWarrantyRequest {
  imei: string;
  serial: string;
  phone: string;
  productId: string;
  orderId?: string;
}

export interface WarrantyLookupRequest {
  imei: string;
}

// Giveaway Types
export interface GiveawayEntry {
  id: string;
  name: string;
  phone: string;
  email: string;
  facebook?: string;
  instagram?: string;
  createdAt?: Date;
}

export interface CreateGiveawayEntryRequest {
  name: string;
  phone: string;
  email: string;
  facebook?: string;
  instagram?: string;
}

// Policy Types
export interface PolicyPage {
  id: string;
  slug: string;
  title: string;
  contentEn?: string;
  contentBn?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// FAQ Types
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  productId?: string;
  product?: Product;
  category?: string;
  priority?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateFAQRequest {
  question: string;
  answer: string;
  productId?: string;
  category?: string;
}

// Wishlist & Compare Types
export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  product?: Product;
  createdAt?: Date;
}

export interface CompareItem {
  id: string;
  userId: string;
  productId: string;
  product?: Product;
  createdAt?: Date;
}

// Loyalty Types
export interface LoyaltyPoints {
  userId: string;
  points: number;
  totalPoints: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RedeemLoyaltyRequest {
  points: number;
  reason?: string;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'ORDER_UPDATE' | 'PRODUCT_ALERT' | 'PROMOTION' | 'SYSTEM';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt?: Date;
}

// SEO Types
export interface SEOMetadata {
  id?: string;
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
}

export interface SitemapItem {
  url: string;
  lastmod?: Date;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

// Query/Filter Types
export interface ProductFilter {
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: 'newest' | 'price-low' | 'price-high' | 'popular' | 'rating';
  page?: number;
  limit?: number;
  productType?: ProductType;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  error?: string;
}
