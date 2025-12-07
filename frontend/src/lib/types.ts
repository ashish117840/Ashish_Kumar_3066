export type UserRole = "admin" | "customer";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  imageUrl?: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface ProductFiltersState {
  search?: string;
  category?: string;
  sort?: "price_desc" | "price_asc";
  page?: number;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  sku: string;
}

export interface CartSummary {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
}

export interface OrderSummary {
  id: string;
  total: number;
  createdAt: string;
  items: Array<{
    id: string;
    productId: string;
    name: string;
    priceAtPurchase: number;
    quantity: number;
  }>;
}

export interface ReportBlock<T> {
  heading: string;
  description?: string;
  data: T;
}
