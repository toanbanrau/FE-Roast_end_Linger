import { Filter, Search, X } from "lucide-react";
import type { ICategory } from "../../../interfaces/category";
import type { IBrand } from "../../../interfaces/brand";
import type { IOrigin } from "../../../interfaces/origin";
import { useState } from "react";
import ProductGrid from "../../../components/ProductGrid";
import { useProductFilter } from "../../../hooks/useProductFilter";

export default function ProductsPage() {
  // Sử dụng custom hook để quản lý filter logic
  const {
    filters,
    searchInput,
    setSearchInput,
    updateSearchParams,
    clearAllFilters,
    hasActiveFilters,
    activeFiltersCount,
    products,
    totalPages,
    totalItems,
    currentPage,
    from,
    to,
    isLoading,
    isError,
    error,
    categories,
    isLoadingCategories,
    isErrorCategories,
    categoriesError,
    brands,
    isLoadingBrands,
    isErrorBrands,
    brandsError,
    origins,
    isLoadingOrigins,
    isErrorOrigins,
    originsError,
  } = useProductFilter();

  // State cho mobile filter modal
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Handle page change
  const handlePageChange = (page: number) => {
    updateSearchParams({ page });
  };

  // Thêm kiểm tra loading và error cho categories, brands, origins
  if (isLoadingCategories || isLoadingBrands || isLoadingOrigins)
    return <div className="text-center py-12">Đang tải dữ liệu...</div>;
  if (isErrorCategories || isErrorBrands || isErrorOrigins)
    return (
      <div className="text-center py-12 text-red-500">
        Lỗi tải dữ liệu:{" "}
        {(categoriesError instanceof Error
          ? categoriesError.message
          : brandsError instanceof Error
          ? brandsError.message
          : originsError instanceof Error
          ? originsError.message
          : "Unknown error")}
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

        {/* Search Input */}
        <div className="mt-6 max-w-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-stone-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-stone-300 rounded-md leading-5 bg-white placeholder-stone-500 focus:outline-none focus:placeholder-stone-400 focus:ring-1 focus:ring-amber-800 focus:border-amber-800 sm:text-sm"
            />
            {searchInput && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="button"
                  onClick={() => setSearchInput("")}
                  className="text-stone-400 hover:text-stone-600"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
          {searchInput && (
            <div className="mt-2 text-sm text-stone-500">
              Đang tìm kiếm: "{searchInput}"
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters - Desktop */}
        <div className="hidden lg:block w-64 space-y-8">
          {/* Filter Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Bộ lọc {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </h2>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1 text-sm text-amber-800 hover:text-amber-900 font-medium"
              >
                <X className="h-4 w-4" />
                Xóa tất cả
              </button>
            )}
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Danh Mục Sản Phẩm</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.categoryId === ""}
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
                    checked={filters.categoryId === categoryItem.id.toString()}
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
                  checked={filters.coffeeType === ""}
                  onChange={() => updateSearchParams({ coffee_type: "" })}
                  className="rounded border-gray-300 text-amber-800 focus:ring-amber-800"
                />
                <label className="text-sm font-medium">Tất cả</label>
              </div>
              {["arabica", "robusta", "blend"].map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.coffeeType === type}
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
            <h3 className="font-medium text-lg mb-4">Thương Hiệu</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.brandId === ""}
                  onChange={() => updateSearchParams({ brand_id: "" })}
                  className="rounded border-gray-300 text-amber-800 focus:ring-amber-800"
                />
                <label className="text-sm font-medium">Tất cả</label>
              </div>
              {brands.map((brand: IBrand) => (
                <div key={brand.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.brandId === brand.id.toString()}
                    onChange={() =>
                      updateSearchParams({ brand_id: brand.id.toString() })
                    }
                    className="rounded border-gray-300 text-amber-800 focus:ring-amber-800"
                  />
                  <label className="text-sm font-medium">
                    {brand.brand_name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Xuất Xứ</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.originId === ""}
                  onChange={() => updateSearchParams({ origin_id: "" })}
                  className="rounded border-gray-300 text-amber-800 focus:ring-amber-800"
                />
                <label className="text-sm font-medium">Tất cả</label>
              </div>
              {origins.map((origin: IOrigin) => (
                <div key={origin.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.originId === origin.id.toString()}
                    onChange={() =>
                      updateSearchParams({ origin_id: origin.id.toString() })
                    }
                    className="rounded border-gray-300 text-amber-800 focus:ring-amber-800"
                  />
                  <label className="text-sm font-medium">
                    {origin.origin_name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Độ Rang</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.roastLevel === ""}
                  onChange={() => updateSearchParams({ roast_level: "" })}
                  className="rounded border-gray-300 text-amber-800 focus:ring-amber-800"
                />
                <label className="text-sm font-medium">Tất cả</label>
              </div>
              {["light", "medium", "dark", "extra_dark"].map((level) => (
                <div key={level} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.roastLevel === level}
                    onChange={() => updateSearchParams({ roast_level: level })}
                    className="rounded border-gray-300 text-amber-800 focus:ring-amber-800"
                  />
                  <label className="text-sm font-medium">
                    {level === "light" ? "Rang nhẹ" :
                     level === "medium" ? "Rang vừa" :
                     level === "dark" ? "Rang đậm" : "Rang rất đậm"}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Khoảng Giá</h3>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Giá từ"
                  value={filters.minPrice}
                  onChange={(e) => updateSearchParams({ min_price: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                />
                <input
                  type="number"
                  placeholder="Giá đến"
                  value={filters.maxPrice}
                  onChange={(e) => updateSearchParams({ max_price: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                />
              </div>
              <div className="text-xs text-gray-500">
                Nhập giá theo VND (ví dụ: 100000)
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Sản Phẩm Nổi Bật</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.isFeatured === ""}
                  onChange={() => updateSearchParams({ is_featured: "" })}
                  className="rounded border-gray-300 text-amber-800 focus:ring-amber-800"
                />
                <label className="text-sm font-medium">Tất cả</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.isFeatured === "true"}
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
              <span className="text-sm text-stone-600">Sắp xếp:</span>
              <select
                className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                value={filters.sort}
                onChange={(e) =>
                  updateSearchParams({ sort: e.target.value })
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
          {/* Sort controls - Desktop */}
          <div className="hidden lg:flex justify-end items-center mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-stone-600">Sắp xếp:</span>
              <select
                className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                value={filters.sort}
                onChange={(e) =>
                  updateSearchParams({ sort: e.target.value })
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

          {/* Product Grid Component */}
          <ProductGrid
            products={products}
            isLoading={isLoading}
            isError={isError}
            error={error}
            totalItems={totalItems}
            currentPage={currentPage}
            totalPages={totalPages}
            from={from}
            to={to}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
