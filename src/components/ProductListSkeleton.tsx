import React from "react";

interface ProductListSkeletonProps {
  count?: number; // Số lượng skeleton items
}

const ProductListSkeleton: React.FC<ProductListSkeletonProps> = ({
  count = 12,
}) => {
  return (
    <div className="animate-pulse">
      {/* Header Skeleton */}
      <div className="mb-8 space-y-4">
        <div className="h-8 bg-gray-200 rounded w-48"></div>
        <div className="h-4 bg-gray-200 rounded w-64"></div>
      </div>

      {/* Filter Bar Skeleton */}
      <div className="mb-8 flex flex-wrap gap-4 items-center">
        <div className="h-10 bg-gray-200 rounded w-32"></div>
        <div className="h-10 bg-gray-200 rounded w-40"></div>
        <div className="h-10 bg-gray-200 rounded w-36"></div>
        <div className="h-10 bg-gray-200 rounded w-28"></div>
      </div>

      {/* Products Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(count)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border overflow-hidden"
          >
            {/* Product Image */}
            <div className="aspect-square bg-gray-200"></div>

            {/* Product Info */}
            <div className="p-4 space-y-3">
              {/* Product Name */}
              <div className="space-y-2">
                <div className="h-5 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>

              {/* Category */}
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>

              {/* Price */}
              <div className="space-y-1">
                <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>

              {/* Status Badge */}
              <div className="h-6 bg-gray-200 rounded w-20"></div>

              {/* Action Button */}
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="mt-12 flex justify-center">
        <div className="flex gap-2">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="h-10 w-10 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductListSkeleton;
