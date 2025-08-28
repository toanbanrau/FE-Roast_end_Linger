import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import type { IProduct } from "../interfaces/product";
import ProductListSkeleton from "./ProductListSkeleton";

interface ProductGridProps {
  products: IProduct[];
  isLoading: boolean;
  isError: boolean;
  error: any;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  from: number;
  to: number;
  onPageChange: (page: number) => void;
}

export default function ProductGrid({
  products,
  isLoading,
  isError,
  error,
  totalItems,
  currentPage,
  totalPages,
  from,
  to,
  onPageChange,
}: ProductGridProps) {
  // Loading state
  if (isLoading) {
    return <ProductListSkeleton />;
  }

  // Error state
  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">
          Lỗi tải sản phẩm: {error instanceof Error ? error.message : "Unknown error"}
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="text-amber-800 hover:text-amber-900 font-medium"
        >
          Thử lại
        </button>
      </div>
    );
  }

  // Empty state
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Không tìm thấy sản phẩm
        </h3>
        <p className="text-gray-500">
          Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results info */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-700">
          Hiển thị {from}-{to} trong tổng số {totalItems} sản phẩm
        </p>
        <p className="text-sm text-gray-500">
          Trang {currentPage} / {totalPages}
        </p>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
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
              to={`/products/${product.slug}`}
              key={product.id}
              className="group relative overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full"
            >
              <div className="aspect-square overflow-hidden flex-shrink-0">
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
              <div className="p-4 xl:p-3 flex flex-col h-full">
                <div className="mb-2">
                  <span className="text-xs font-medium text-amber-800 bg-amber-100 px-2 py-1 rounded-full">
                    {product.category?.category_name || ""}
                  </span>
                </div>
                <h3 className="text-lg xl:text-base font-medium text-stone-900 line-clamp-2 min-h-[3rem] xl:min-h-[2.5rem]">
                  {product.product_name}
                </h3>
                <p className="mt-2 text-stone-600 text-sm xl:text-xs line-clamp-2 min-h-[2.5rem] xl:min-h-[2rem] flex-grow">
                  {product.short_description}
                </p>
                <div className="mt-auto pt-3 xl:pt-2">
                  <div className="flex items-center justify-between mb-2">
                    {product.display_price ? (
                      <span className="text-base xl:text-sm font-semibold text-amber-800">
                        {product.display_price}
                      </span>
                    ) : product.has_variants && variantPrice !== null ? (
                      <span className="text-base xl:text-sm font-semibold text-amber-800">
                        {variantPrice.toLocaleString()}₫
                      </span>
                    ) : (
                      <span className="text-base xl:text-sm font-semibold text-amber-800">
                        {Number(product.base_price).toLocaleString()}₫
                      </span>
                    )}
                  </div>
                  <div
                   
                    className="w-full flex items-center justify-center bg-amber-800 hover:bg-amber-900 text-amber-50 px-3 py-2 xl:py-1.5 rounded-md text-sm xl:text-xs font-medium transition-colors cursor-pointer"
                  >
                    Xem Chi Tiết
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          {/* Previous button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Trước
          </button>

          {/* Page numbers */}
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
                onClick={() => onPageChange(pageNum)}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  currentPage === pageNum
                    ? "text-white bg-amber-800 border border-amber-800"
                    : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          {/* Next button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
}
