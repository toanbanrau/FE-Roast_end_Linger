import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllProductsClient } from "../services/productService";
import { getAllCategories } from "../services/categoryService";
import { getAllBrandsClient } from "../services/brandService";
import { getAllOriginsClient } from "../services/originService";

export interface ProductFilterParams {
  page: number;
  perPage: number;
  categoryId: string;
  brandId: string;
  originId: string;
  coffeeType: string;
  roastLevel: string;
  minPrice: string;
  maxPrice: string;
  isFeatured: string;
  sort: string;
  order: string;
  search: string;
}

export interface ProductFilterState {
  // Filter parameters
  filters: ProductFilterParams;
  
  // Search input state (for debouncing)
  searchInput: string;
  setSearchInput: (value: string) => void;
  
  // Update functions
  updateSearchParams: (updates: Record<string, string | number>) => void;
  clearAllFilters: () => void;
  
  // Computed values
  hasActiveFilters: boolean;
  activeFiltersCount: number;
  queryParams: URLSearchParams;
  
  // Products data
  products: any[];
  meta: any;
  totalPages: number;
  totalItems: number;
  currentPage: number;
  from: number;
  to: number;
  
  // Loading states
  isLoading: boolean;
  isError: boolean;
  error: any;
  
  // Categories data
  categories: any[];
  isLoadingCategories: boolean;
  isErrorCategories: boolean;
  categoriesError: any;
  
  // Brands data
  brands: any[];
  isLoadingBrands: boolean;
  isErrorBrands: boolean;
  brandsError: any;
  
  // Origins data
  origins: any[];
  isLoadingOrigins: boolean;
  isErrorOrigins: boolean;
  originsError: any;
}

export const useProductFilter = (): ProductFilterState => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State cho search input với debounce
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || ""
  );

  // Lấy các query params theo format API (theo docs/product.md)
  const filters: ProductFilterParams = useMemo(() => ({
    page: parseInt(searchParams.get("page") || "1"),
    perPage: parseInt(searchParams.get("per_page") || "12"),
    categoryId: searchParams.get("category_id") || "",
    brandId: searchParams.get("brand_id") || "",
    originId: searchParams.get("origin_id") || "",
    coffeeType: searchParams.get("coffee_type") || "",
    roastLevel: searchParams.get("roast_level") || "",
    minPrice: searchParams.get("min_price") || "",
    maxPrice: searchParams.get("max_price") || "",
    isFeatured: searchParams.get("is_featured") || "",
    sort: searchParams.get("sort") || "created_at",
    order: searchParams.get("order") || "desc",
    search: searchParams.get("search") || "",
  }), [searchParams]);

  // Sync searchInput với URL params khi URL thay đổi
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    if (urlSearch !== searchInput) {
      setSearchInput(urlSearch);
    }
  }, [searchParams, searchInput]);

  // Cập nhật query params
  const updateSearchParams = useCallback(
    (updates: Record<string, string | number>) => {
      const newParams = new URLSearchParams(searchParams);
      Object.entries(updates).forEach(([key, value]) => {
        if (value === "" || (value === 0 && key !== "page")) {
          newParams.delete(key);
        } else {
          newParams.set(key, String(value));
        }
      });
      // Reset về trang 1 khi filter thay đổi (trừ khi đang thay đổi page)
      if (!updates.hasOwnProperty('page')) {
        newParams.set("page", "1");
      }
      setSearchParams(newParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
    setSearchInput("");
  }, [setSearchParams]);

  // Debounce search input
  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    if (searchInput !== currentSearch) {
      const timeoutId = setTimeout(() => {
        updateSearchParams({ search: searchInput });
      }, 500); // 500ms debounce

      return () => clearTimeout(timeoutId);
    }
  }, [searchInput, searchParams, updateSearchParams]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return !!(filters.categoryId || filters.brandId || filters.originId || 
              filters.coffeeType || filters.roastLevel || filters.minPrice || 
              filters.maxPrice || filters.isFeatured || filters.search);
  }, [filters]);

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.categoryId) count++;
    if (filters.brandId) count++;
    if (filters.originId) count++;
    if (filters.coffeeType) count++;
    if (filters.roastLevel) count++;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.isFeatured) count++;
    if (filters.search) count++;
    return count;
  }, [filters]);

  // Tạo query params cho API (theo docs/product.md)
  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", filters.page.toString()); // Luôn gửi page
    if (filters.perPage !== 12) params.set("per_page", filters.perPage.toString());
    if (filters.categoryId) params.set("category_id", filters.categoryId);
    if (filters.brandId) params.set("brand_id", filters.brandId);
    if (filters.originId) params.set("origin_id", filters.originId);
    if (filters.coffeeType) params.set("coffee_type", filters.coffeeType);
    if (filters.roastLevel) params.set("roast_level", filters.roastLevel);
    if (filters.minPrice) params.set("min_price", filters.minPrice);
    if (filters.maxPrice) params.set("max_price", filters.maxPrice);
    if (filters.isFeatured) params.set("is_featured", filters.isFeatured);
    if (filters.sort !== "created_at") params.set("sort", filters.sort);
    if (filters.order !== "desc") params.set("order", filters.order);
    if (filters.search) params.set("search", filters.search);
    return params;
  }, [filters]);

  // Fetch products
  const {
    data: productsResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products", queryParams.toString()],
    queryFn: () => getAllProductsClient(queryParams),
  });

  // Fetch categories
  const {
    data: categories,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getAllCategories(),
    initialData: [],
  });

  // Fetch brands
  const {
    data: brands,
    isLoading: isLoadingBrands,
    isError: isErrorBrands,
    error: brandsError,
  } = useQuery({
    queryKey: ["brands-client"],
    queryFn: () => getAllBrandsClient(),
    initialData: [],
  });

  // Fetch origins
  const {
    data: origins,
    isLoading: isLoadingOrigins,
    isError: isErrorOrigins,
    error: originsError,
  } = useQuery({
    queryKey: ["origins-client"],
    queryFn: () => getAllOriginsClient(),
    initialData: [],
  });

  // Xử lý response có cấu trúc phân trang
  const products = productsResponse?.data || [];
  const meta = productsResponse?.meta;
  const totalPages = meta?.last_page || 1;
  const totalItems = meta?.total || 0;
  const currentPage = meta?.current_page || 1;
  const from = meta?.from || 0;
  const to = meta?.to || 0;

  return {
    // Filter parameters
    filters,
    
    // Search input state
    searchInput,
    setSearchInput,
    
    // Update functions
    updateSearchParams,
    clearAllFilters,
    
    // Computed values
    hasActiveFilters,
    activeFiltersCount,
    queryParams,
    
    // Products data
    products,
    meta,
    totalPages,
    totalItems,
    currentPage,
    from,
    to,
    
    // Loading states
    isLoading,
    isError,
    error,
    
    // Categories data
    categories,
    isLoadingCategories,
    isErrorCategories,
    categoriesError,
    
    // Brands data
    brands,
    isLoadingBrands,
    isErrorBrands,
    brandsError,
    
    // Origins data
    origins,
    isLoadingOrigins,
    isErrorOrigins,
    originsError,
  };
};
