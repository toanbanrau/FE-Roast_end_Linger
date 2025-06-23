import { Filter, ChevronDown } from "lucide-react"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query";
import { getAllProductsClient } from "../../../services/productService";
import type { IProduct } from "../../../interfaces/product";

export default function ProductsPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products", 1],
    queryFn: () => getAllProductsClient(),
  });

  if (isLoading) return <div className="text-center py-12">Đang tải sản phẩm...</div>;
  if (isError) return <div className="text-center py-12 text-red-500">Lỗi tải sản phẩm: {error instanceof Error ? error.message : "Unknown error"}</div>;

  const products: IProduct[] = data?.data || [];

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold tracking-tight sm:text-4xl md:text-5xl">Our Coffee Collection</h1>
        <p className="mt-4 text-lg text-stone-600">
          Explore our curated selection of premium coffee beans from around the world.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters - Desktop */}
        <div className="hidden lg:block w-64 space-y-8">
          <div>
            <h3 className="font-medium text-lg mb-4">Danh Mục Sản Phẩm</h3>
            <div className="space-y-2">
              {["All", "Single Origin", "Blends", "Decaf", "Limited Edition"].map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`category-${category}`}
                    className="rounded border-gray-300 text-amber-800 focus:ring-amber-800"
                  />
                  <label htmlFor={`category-${category}`} className="text-sm font-medium">
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Origin</h3>
            <div className="space-y-2">
              {["Africa", "Central America", "South America", "Asia", "Various"].map((origin) => (
                <div key={origin} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`origin-${origin}`}
                    className="rounded border-gray-300 text-amber-800 focus:ring-amber-800"
                  />
                  <label htmlFor={`origin-${origin}`} className="text-sm font-medium">
                    {origin}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Roast Level</h3>
            <div className="space-y-2">
              {["Light", "Medium", "Medium-Dark", "Dark"].map((roast) => (
                <div key={roast} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`roast-${roast}`}
                    className="rounded border-gray-300 text-amber-800 focus:ring-amber-800"
                  />
                  <label htmlFor={`roast-${roast}`} className="text-sm font-medium">
                    {roast}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Price Range</h3>
            <input
              type="range"
              min="10"
              max="50"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between mt-2">
              <span className="text-sm text-stone-600">$10</span>
              <span className="text-sm text-stone-600">$50</span>
            </div>
          </div>
        </div>

        {/* Filters - Mobile */}
        <div className="lg:hidden w-full mb-6">
          <div className="flex justify-between items-center">
            <button className="flex items-center gap-2 px-4 py-2 border rounded-md">
              <Filter className="h-4 w-4" />
              Filters
            </button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-stone-600">Sort by:</span>
              <select className="border rounded-md px-2 py-1 text-sm">
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest</option>
                <option value="bestselling">Best Selling</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="hidden lg:flex justify-end mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-stone-600">Sort by:</span>
              <select className="border rounded-md px-2 py-1 text-sm">
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest</option>
                <option value="bestselling">Best Selling</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cls-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Link
                to={`/product/${product.id}`}
                key={product.id}
                className="group relative overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-xl"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.primary_image?.image_url || "/placeholder.svg"}
                    alt={product.primary_image?.alt_text || product.product_name}
                    width={400}
                    height={400}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="mb-2">
                  <span className="text-xs font-medium text-amber-800 bg-amber-100 px-2 py-1 rounded-full">
                    {product.category?.category_name || ""}
                  </span>
                </div>
                <h3 className="text-xl font-medium text-stone-900">{product.product_name}</h3>
                <p className="mt-2 text-stone-600 text-sm">{product.short_description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-semibold text-amber-800">{Number(product.base_price).toLocaleString()}₫</span>
                  <button className="bg-amber-800 hover:bg-amber-900 text-white px-3 py-1 rounded-md text-sm font-medium">
                    Add to Cart
                  </button>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <nav className="flex items-center gap-1">
              <button className="h-8 w-8 border rounded-md hover:bg-amber-50">1</button>
              <button className="h-8 w-8 border rounded-md hover:bg-amber-50">2</button>
              <button className="h-8 w-8 border rounded-md hover:bg-amber-50">3</button>
              <button className="h-8 w-8 border rounded-md hover:bg-amber-50">
                <ChevronDown className="h-4 w-4 mx-auto" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}
