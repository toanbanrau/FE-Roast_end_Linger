import React from "react";

const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden animate-pulse">
      {/* Product Image Skeleton */}
      <div className="aspect-square bg-gray-200 relative">
        {/* Badge Skeleton */}
        <div className="absolute top-2 left-2 h-6 w-16 bg-gray-300 rounded-full"></div>
        
        {/* Wishlist Button Skeleton */}
        <div className="absolute top-2 right-2 h-8 w-8 bg-gray-300 rounded-full"></div>
      </div>
      
      {/* Product Info Skeleton */}
      <div className="p-4 space-y-3">
        {/* Product Name */}
        <div className="space-y-2">
          <div className="h-5 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
        
        {/* Category & Brand */}
        <div className="flex gap-2">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
        
        {/* Price */}
        <div className="space-y-1">
          <div className="h-6 bg-gray-200 rounded w-2/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        
        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-4 w-4 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-4 bg-gray-200 rounded w-12"></div>
        </div>
        
        {/* Status */}
        <div className="h-6 bg-gray-200 rounded w-20"></div>
        
        {/* Action Buttons */}
        <div className="space-y-2">
          <div className="h-10 bg-gray-200 rounded w-full"></div>
          <div className="h-8 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
