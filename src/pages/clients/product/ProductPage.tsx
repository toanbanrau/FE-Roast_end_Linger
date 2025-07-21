import { Filter } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllProductsClient } from "../../../services/productService";
import type { IProduct } from "../../../interfaces/product";
import { getAllCategories } from "../../../services/categoryService";
import type { ICategory } from "../../../interfaces/category";
import { useMemo, useCallback } from "react";

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Lấy các query params theo format API
  const page = parseInt(searchParams.get("page") || "1");
  const perPage = parseInt(searchParams.get("per_page") || "12");
  const categoryId = searchParams.get("category_id") || "";
  const brandId = searchParams.get("brand_id") || "";
  const coffeeType = searchParams.get("coffee_type") || "";
  const isFeatured = searchParams.get("is_featured") || "";
  const sortBy = searchParams.get("sort_by") || "created_at";
  const sortOrder = searchParams.get("sort_order") || "desc";
  const search = searchParams.get("search") || "";

  // Tạo query params cho API
  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", page.toString());
    if (perPage !== 12) params.set("per_page", perPage.toString());
    if (categoryId) params.set("category_id", categoryId);
    if (brandId) params.set("brand_id", brandId);
    if (coffeeType) params.set("coffee_type", coffeeType);
    if (isFeatured) params.set("is_featured", isFeatured);
    if (sortBy !== "created_at") params.set("sort_by", sortBy);
    if (sortOrder !== "desc") params.set("sort_order", sortOrder);
    if (search) params.set("search", search);
    return params;
  }, [
    page,
    perPage,
    categoryId,
    brandId,
    coffeeType,
    isFeatured,
    sortBy,
    sortOrder,
    search,
  ]);

  const {
    data: productsResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products", queryParams.toString()],
    queryFn: () => getAllProductsClient(queryParams),
  });

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

  // Xử lý response có cấu trúc phân trang
  const products = productsResponse?.data || [];
  const meta = productsResponse?.meta;
  const totalPages = meta?.last_page || 1;
  const totalItems = meta?.total || 0;
  const currentPage = meta?.current_page || 1;
  const from = meta?.from || 0;
  const to = meta?.to || 0;

  // Cập nhật query params
  const updateSearchParams = useCallback(
    (updates: Record<string, string | number>) => {
      const newParams = new URLSearchParams(searchParams);
      Object.entries(updates).forEach(([key, value]) => {
        if (value === "" || value === 0) {
          newParams.delete(key);
        } else {
          newParams.set(key, String(value));
        }
      });
      // Reset về trang 1 khi filter thay đổi (trừ khi đang thay đổi page)
      if (updates.page === undefined) {
        newParams.set("page", "1");
      }
      setSearchParams(newParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  // Thêm kiểm tra loading và error cho categories
  if (isLoadingCategories)
    return <div className="text-center py-12">Đang tải danh mục...</div>;
  if (isErrorCategories)
    return (
      <div className="text-center py-12 text-red-500">
        Lỗi tải danh mục:{" "}
        {categoriesError instanceof Error
          ? categoriesError.message
          : "Unknown error"}
      </div>
    );

  if (isLoading)
    return <div className="text-center py-12">Đang tải sản phẩm...</div>;
  if (isError)
    return (
      <div className="text-center py-12 text-red-500">
        Lỗi tải sản phẩm:{" "}
        {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold tracking-tight sm:text-4xl md:text-5xl">
          Our Coffee Collection
        </h1>
        <p className="mt-4 text-lg text-stone-600">
          Explore our curated selection of premium coffee beans from around the
          world.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters - Desktop */}
        <div className="hidden lg:block w-64 space-y-8">
          <div>
            <h3 className="font-medium text-lg mb-4">Danh Mục Sản Phẩm</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={categoryId === ""}
                  onChange={() => updateSearchParams({ category_id: "" })}
                  className="rounded border-gray-300 text-amber-800 focus:ring-amber-800"
                />
                <label className="text-sm font-medium">Tất cả</label>
              </div>
              {categories.map((categoryItem: ICategory) => (
                <div
                  key={categoryItem.id}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    checked={categoryId === categoryItem.id.toString()}
                    onChange={() =>
                      updateSearchParams({
                        category_id: categoryItem.id.toString(),
                      })
                    }
                    className="rounded border-gray-300 text-amber-800 focus:ring-amber-800"
                  />
                  <label className="text-sm font-medium">
                    {categoryItem.category_name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Loại Cà Phê</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={coffeeType === ""}
                  onChange={() => updateSearchParams({ coffee_type: "" })}
                  className="rounded border-gray-300 text-amber-800 focus:ring-amber-800"
                />
                <label className="text-sm font-medium">Tất cả</label>
              </div>
              {["arabica", "robusta", "blend"].map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={coffeeType === type}
                    onChange={() => updateSearchParams({ coffee_type: type })}
                    className="rounded border-gray-300 text-amber-800 focus:ring-amber-800"
                  />
                  <label className="text-sm font-medium">
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Sản Phẩm Nổi Bật</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isFeatured === ""}
                  onChange={() => updateSearchParams({ is_featured: "" })}
                  className="rounded border-gray-300 text-amber-800 focus:ring-amber-800"
                />
                <label className="text-sm font-medium">Tất cả</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isFeatured === "true"}
                  onChange={() => updateSearchParams({ is_featured: "true" })}
                  className="rounded border-gray-300 text-amber-800 focus:ring-amber-800"
                />
                <label className="text-sm font-medium">
                  Chỉ sản phẩm nổi bật
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Filters - Mobile */}
        <div className="lg:hidden w-full mb-6">
          <div className="flex justify-between items-center">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 border rounded-md"
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-stone-600">Sort by:</span>
              <select
                className="border rounded-md px-2 py-1 text-sm"
                value={sortBy}
                onChange={(e) =>
                  updateSearchParams({ sort_by: e.target.value })
                }
              >
                <option value="created_at">Mới nhất</option>
                <option value="product_name">Tên sản phẩm</option>
                <option value="base_price">Giá</option>
                <option value="sold_count">Bán chạy</option>
                <option value="view_count">Xem nhiều</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="hidden lg:flex justify-between items-center mb-6">
            <div className="text-sm text-stone-600">
              Hiển thị {from}-{to} trong tổng số {totalItems} sản phẩm
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-stone-600">Sort by:</span>
              <select
                className="border rounded-md px-2 py-1 text-sm"
                value={sortBy}
                onChange={(e) =>
                  updateSearchParams({ sort_by: e.target.value })
                }
              >
                <option value="created_at">Mới nhất</option>
                <option value="product_name">Tên sản phẩm</option>
                <option value="base_price">Giá</option>
                <option value="sold_count">Bán chạy</option>
                <option value="view_count">Xem nhiều</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product: IProduct) => {
              let variantPrice: number | null = null;
              if (
                product.has_variants &&
                Array.isArray(product.variants) &&
                product.variants.length > 0
              ) {
                const found = product.variants.find(
                  (v) =>
                    v.price && !isNaN(Number(v.price)) && Number(v.price) > 0
                );
                if (found) variantPrice = Number(found.price);
              }
              return (
                <Link
                  to={`/product/${product.id}`}
                  key={product.id}
                  className="group relative overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-xl"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={
                        product.primary_image?.image_url || "/placeholder.svg"
                      }
                      alt={
                        product.primary_image?.alt_text || product.product_name
                      }
                      width={400}
                      height={400}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <div className="mb-2">
                      <span className="text-xs font-medium text-amber-800 bg-amber-100 px-2 py-1 rounded-full">
                        {product.category?.category_name || ""}
                      </span>
                    </div>
                    <h3 className="text-xl font-medium text-stone-900">
                      {product.product_name}
                    </h3>
                    <p className="mt-2 text-stone-600 text-sm">
                      {product.short_description}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      {product.display_price ? (
                        <span className="text-lg font-semibold text-amber-800">
                          {product.display_price}
                        </span>
                      ) : product.has_variants && variantPrice !== null ? (
                        <span className="text-lg font-semibold text-amber-800">
                          {variantPrice.toLocaleString()}₫
                        </span>
                      ) : (
                        <span className="text-lg font-semibold text-amber-800">
                          {Number(product.base_price).toLocaleString()}₫
                        </span>
                      )}
                      <button
                        type="button"
                        className="bg-amber-800 hover:bg-amber-900 text-white px-3 py-1 rounded-md text-sm font-medium"
                      >
                        Xem Chi Tiết
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center gap-1">
                <button
                  type="button"
                  className="h-8 w-8 border rounded-md hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentPage === 1}
                  onClick={() => updateSearchParams({ page: currentPage - 1 })}
                >
                  ←
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      type="button"
                      className={`h-8 w-8 border rounded-md hover:bg-amber-50 ${
                        currentPage === pageNum ? "bg-amber-800 text-white" : ""
                      }`}
                      onClick={() => updateSearchParams({ page: pageNum })}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  type="button"
                  className="h-8 w-8 border rounded-md hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentPage === totalPages}
                  onClick={() => updateSearchParams({ page: currentPage + 1 })}
                >
                  →
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
