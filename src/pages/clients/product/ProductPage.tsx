
import { Filter, ChevronDown } from "lucide-react"
import { Link } from "react-router-dom"

export default function ProductsPage() {
  const products = [
    {
      id: 1,
      name: "Ethiopian Yirgacheffe",
      price: "$24.95",
      image: "/placeholder.svg?height=400&width=400",
      description: "Floral and citrus notes with a silky smooth finish",
      category: "Single Origin",
      origin: "Ethiopia",
    },
    {
      id: 2,
      name: "Colombian Supremo",
      price: "$22.95",
      image: "/placeholder.svg?height=400&width=400",
      description: "Rich caramel sweetness with a hint of toasted nuts",
      category: "Single Origin",
      origin: "Colombia",
    },
    {
      id: 3,
      name: "Sumatra Mandheling",
      price: "$26.95",
      image: "/placeholder.svg?height=400&width=400",
      description: "Earthy, full-bodied with notes of dark chocolate",
      category: "Single Origin",
      origin: "Indonesia",
    },
    {
      id: 4,
      name: "Morning Blend",
      price: "$21.95",
      image: "/placeholder.svg?height=400&width=400",
      description: "Balanced and smooth with notes of chocolate and nuts",
      category: "Blend",
      origin: "Various",
    },
    {
      id: 5,
      name: "Espresso Roast",
      price: "$23.95",
      image: "/placeholder.svg?height=400&width=400",
      description: "Bold and rich with a caramelized sweetness",
      category: "Blend",
      origin: "Various",
    },
    {
      id: 6,
      name: "Decaf Colombian",
      price: "$24.95",
      image: "/placeholder.svg?height=400&width=400",
      description: "All the flavor without the caffeine",
      category: "Decaf",
      origin: "Colombia",
    },
    {
      id: 7,
      name: "Guatemala Antigua",
      price: "$25.95",
      image: "/placeholder.svg?height=400&width=400",
      description: "Complex with notes of chocolate and spice",
      category: "Single Origin",
      origin: "Guatemala",
    },
    {
      id: 8,
      name: "Kenya AA",
      price: "$27.95",
      image: "/placeholder.svg?height=400&width=400",
      description: "Bright and vibrant with berry and citrus notes",
      category: "Single Origin",
      origin: "Kenya",
    },
    {
      id: 9,
      name: "Dark Roast Blend",
      price: "$22.95",
      image: "/placeholder.svg?height=400&width=400",
      description: "Bold and smoky with a lingering finish",
      category: "Blend",
      origin: "Various",
    },
  ]

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
            <h3 className="font-medium text-lg mb-4">Categories</h3>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Link
                to={`/products/${product.id}`}
                key={product.id}
                className="group relative overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-xl"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={400}
                    height={400}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="mb-2">
                    <span className="text-xs font-medium text-amber-800 bg-amber-100 px-2 py-1 rounded-full">
                      {product.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-medium text-stone-900">{product.name}</h3>
                  <p className="mt-2 text-stone-600 text-sm">{product.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-semibold text-amber-800">{product.price}</span>
                    <button className="bg-amber-800 hover:bg-amber-900 text-white px-3 py-1 rounded-md text-sm font-medium">
                      Add to Cart
                    </button>
                  </div>
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
