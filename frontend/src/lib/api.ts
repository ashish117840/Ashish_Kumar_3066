import { env } from "./env";
import type {
  CartSummary,
  OrderSummary,
  PaginatedResponse,
  Product,
  ProductFiltersState,
} from "./types";

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
} as const;

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

type RequestOptions = Omit<RequestInit, "method"> & {
  method?: HttpMethod;
  skipAuth?: boolean;
};

export function getApiBaseUrl() {
  if (typeof window !== "undefined") {
    const value = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!value) {
      throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined in the frontend environment.");
    }
    return value;
  }

  return env.apiBaseUrl();
}

function buildUrl(path: string, query?: URLSearchParams | Record<string, string>) {
  const baseUrl = getApiBaseUrl().replace(/\/$/, "");
  const targetPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${baseUrl}${targetPath}`);

  if (query) {
    const searchParams =
      query instanceof URLSearchParams ? query : new URLSearchParams(query);
    searchParams.forEach((value, key) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, value.toString());
      }
    });
  }

  return url.toString();
}

async function request<T>(path: string, options: RequestOptions = {}) {
  const { method = "GET", skipAuth, headers, ...rest } = options;

  const fetchOptions: RequestInit = {
    ...rest,
    method,
    headers: {
      ...DEFAULT_HEADERS,
      ...(headers || {}),
    },
    credentials: skipAuth ? "omit" : "include",
  };

  const response = await fetch(path, fetchOptions);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request to ${path} failed with ${response.status}`);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}

export function buildProductsQuery(filters: ProductFiltersState) {
  const params = new URLSearchParams();

  if (filters.page && filters.page > 1) {
    params.set("page", filters.page.toString());
  }
  if (filters.search) {
    params.set("search", filters.search);
  }
  if (filters.category) {
    params.set("category", filters.category);
  }
  if (filters.sort) {
    params.set("sort", filters.sort);
  }

  return params;
}

export async function fetchProducts(filters: ProductFiltersState) {
  const url = buildUrl("/products", buildProductsQuery(filters));
  return request<PaginatedResponse<Product>>(url, {
    next: { tags: ["products"], revalidate: 60 },
  });
}

export async function fetchProductCategories() {
  const url = buildUrl("/products/categories");
  return request<string[]>(url, {
    next: { tags: ["products"] },
  });
}

export async function fetchCart() {
  const url = buildUrl("/cart");
  return request<CartSummary>(url, {
    next: { revalidate: 0 },
  });
}

export async function updateCartItem(
  productId: string,
  payload: { quantity: number }
) {
  const url = buildUrl(`/cart/${productId}`);
  return request<CartSummary>(url, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function removeCartItem(productId: string) {
  const url = buildUrl(`/cart/${productId}`);
  return request<CartSummary>(url, {
    method: "DELETE",
  });
}

export async function checkoutCart() {
  const url = buildUrl("/checkout");
  return request<OrderSummary>(url, {
    method: "POST",
  });
}

export async function fetchOrders() {
  const url = buildUrl("/orders");
  return request<OrderSummary[]>(url, {
    next: { revalidate: 0 },
  });
}

export async function fetchReports() {
  const url = buildUrl("/reports");
  return request<Record<string, unknown>>(url, {
    next: { revalidate: 300 },
  });
}
