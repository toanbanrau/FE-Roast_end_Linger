import React from "react";

const ProductDetailSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      {/* Breadcrumb Skeleton */}
      <nav className="flex items-center text-sm text-stone-500 mb-8">
        <div className="h-4 bg-gray-200 rounded w-16"></div>
        <div className="mx-2 h-4 w-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-20"></div>
        <div className="mx-2 h-4 w-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery Skeleton */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square bg-gray-200 rounded-lg"></div>
          
          {/* Thumbnail Images */}
          <div className="flex gap-2 overflow-x-auto">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0"
              ></div>
            ))}
          </div>
        </div>

        {/* Product Info Skeleton */}
        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>

          {/* Status */}
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>

          {/* Attributes */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="h-5 bg-gray-200 rounded w-20"></div>
              <div className="flex gap-2">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="h-10 bg-gray-200 rounded w-16"
                  ></div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="h-5 bg-gray-200 rounded w-24"></div>
              <div className="flex gap-2">
                {[...Array(2)].map((_, index) => (
                  <div
                    key={index}
                    className="h-10 bg-gray-200 rounded w-20"
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-2">
            <div className="h-5 bg-gray-200 rounded w-16"></div>
            <div className="h-12 bg-gray-200 rounded w-32"></div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <div className="h-12 bg-gray-200 rounded w-full"></div>
            <div className="h-12 bg-gray-200 rounded w-full"></div>
          </div>

          {/* Product Info Cards */}
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-2">
                <div className="h-6 bg-gray-200 rounded w-6"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Description Section Skeleton */}
      <div className="mt-16 space-y-8">
        {/* Tabs */}
        <div className="flex border-b">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="h-12 bg-gray-200 rounded-t w-24 mr-4"
            ></div>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="h-4 bg-gray-200 rounded"
                style={{ width: `${Math.random() * 40 + 60}%` }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Products Skeleton */}
      <div className="mt-16 space-y-8">
        <div className="h-8 bg-gray-200 rounded w-48"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="space-y-4">
              {/* Product Image */}
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              
              {/* Product Info */}
              <div className="space-y-2">
                <div className="h-5 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;
