import React from "react";

const HomePageSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      {/* Hero Section Skeleton */}
      <section className="relative h-96 md:h-[500px] bg-gray-200 mb-16">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4 max-w-2xl px-4">
            <div className="h-12 bg-gray-300 rounded w-3/4 mx-auto"></div>
            <div className="h-6 bg-gray-300 rounded w-full"></div>
            <div className="h-6 bg-gray-300 rounded w-2/3 mx-auto"></div>
            <div className="h-12 bg-gray-300 rounded w-40 mx-auto mt-8"></div>
          </div>
        </div>
      </section>

      {/* Categories Section Skeleton */}
      <section className="container mx-auto px-4 mb-16">
        <div className="text-center mb-12">
          <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-64 mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="text-center group">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <div className="h-5 bg-gray-200 rounded w-20 mx-auto"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Section Skeleton */}
      <section className="container mx-auto px-4 mb-16">
        <div className="text-center mb-12">
          <div className="h-8 bg-gray-200 rounded w-56 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-72 mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border overflow-hidden">
              {/* Product Image */}
              <div className="aspect-square bg-gray-200"></div>
              
              {/* Product Info */}
              <div className="p-4 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Section Skeleton */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-3">
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className="h-4 bg-gray-200 rounded"
                    style={{ width: `${Math.random() * 30 + 70}%` }}
                  ></div>
                ))}
              </div>
              <div className="h-12 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="aspect-video bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </section>

      {/* Features Section Skeleton */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="h-8 bg-gray-200 rounded w-40 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-60 mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="text-center space-y-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto"></div>
              <div className="h-6 bg-gray-200 rounded w-32 mx-auto"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Section Skeleton */}
      <section className="bg-amber-800 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="h-8 bg-amber-700 rounded w-64 mx-auto"></div>
            <div className="h-4 bg-amber-700 rounded w-80 mx-auto"></div>
            <div className="flex gap-4 max-w-md mx-auto">
              <div className="flex-1 h-12 bg-amber-700 rounded"></div>
              <div className="h-12 w-24 bg-amber-700 rounded"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePageSkeleton;
