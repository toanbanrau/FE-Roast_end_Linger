
import { ChevronRight, Minus, Plus, ShoppingBag, Star, Truck } from "lucide-react"
import { Link, useParams } from "react-router-dom"

export default function ProductDetailPage() {

const {id} = useParams()
  // In a real app, you would fetch this d  ata based on the ID
  const product = {
    id: id,
    name: "Ethiopian Yirgacheffe",
    price: "$24.95",
    image: "/placeholder.svg?height=600&width=600",
    description:
      "Our Ethiopian Yirgacheffe is a truly exceptional single-origin coffee, celebrated for its distinctive floral and citrus notes with a silky smooth finish. Grown in the highlands of Ethiopia, the birthplace of coffee, these beans are carefully harvested and processed to preserve their unique characteristics.",
    category: "Single Origin",
    origin: "Ethiopia",
    altitude: "1,800-2,200 meters",
    process: "Washed",
    roastLevel: "Medium",
    flavorNotes: ["Jasmine", "Lemon", "Bergamot", "Honey"],
    rating: 4.8,
    reviewCount: 124,
    inStock: true,
  }

  // Related products
  const relatedProducts = [
    {
      id: 2,
      name: "Colombian Supremo",
      price: "$22.95",
      image: "/placeholder.svg?height=300&width=300",
      category: "Single Origin",
    },
    {
      id: 3,
      name: "Sumatra Mandheling",
      price: "$26.95",
      image: "/placeholder.svg?height=300&width=300",
      category: "Single Origin",
    },
    {
      id: 4,
      name: "Morning Blend",
      price: "$21.95",
      image: "/placeholder.svg?height=300&width=300",
      category: "Blend",
    },
  ]

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      {/* Breadcrumbs */}
      <nav className="flex items-center text-sm text-stone-500 mb-8">
        <Link to="/" className="hover:text-amber-800">
          Home
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link to="/products" className="hover:text-amber-800">
          Products
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-stone-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="bg-stone-50 rounded-xl p-8 flex items-center justify-center">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="object-contain max-h-[500px]"
          />
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-amber-800 bg-amber-100 px-2 py-1 rounded-full">
                {product.category}
              </span>
              <span className="text-xs font-medium text-emerald-800 bg-emerald-100 px-2 py-1 rounded-full">
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>
            <h1 className="text-3xl font-serif font-bold tracking-tight">{product.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.floor(product.rating) ? "text-amber-500 fill-amber-500" : "text-stone-300"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-stone-600">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>
          </div>

          <div className="text-2xl font-semibold text-amber-800">{product.price}</div>

          <p className="text-stone-600">{product.description}</p>

          <div className="space-y-4 pt-4 border-t">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="grind" className="block text-sm font-medium mb-2">
                  Grind
                </label>
                <select
                  id="grind"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                >
                  <option value="whole-bean">Whole Bean</option>
                  <option value="espresso">Espresso</option>
                  <option value="drip">Drip</option>
                  <option value="french-press">French Press</option>
                  <option value="aeropress">AeroPress</option>
                </select>
              </div>
              <div>
                <label htmlFor="size" className="block text-sm font-medium mb-2">
                  Size
                </label>
                <select
                  id="size"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                >
                  <option value="8oz">8 oz</option>
                  <option value="12oz" selected>
                    12 oz
                  </option>
                  <option value="1lb">1 lb</option>
                  <option value="2lb">2 lb</option>
                  <option value="5lb">5 lb</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-md">
                <button className="h-10 w-10 flex items-center justify-center text-gray-500 hover:text-gray-700">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center">1</span>
                <button className="h-10 w-10 flex items-center justify-center text-gray-500 hover:text-gray-700">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button className="flex-1 bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-md font-medium flex items-center justify-center">
                <ShoppingBag className="mr-2 h-5 w-5" /> Add to Cart
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-stone-600 pt-4 border-t">
            <Truck className="h-4 w-4 text-amber-800" />
            <span>Free shipping on orders over $50</span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <h3 className="text-sm font-medium">Origin</h3>
              <p className="text-stone-600">{product.origin}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Process</h3>
              <p className="text-stone-600">{product.process}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Altitude</h3>
              <p className="text-stone-600">{product.altitude}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Roast Level</h3>
              <p className="text-stone-600">{product.roastLevel}</p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h3 className="text-sm font-medium mb-2">Flavor Notes</h3>
            <div className="flex flex-wrap gap-2">
              {product.flavorNotes.map((note, index) => (
                <span key={index} className="text-xs bg-stone-100 text-stone-800 px-3 py-1 rounded-full">
                  {note}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="mt-16">
        <div className="border-b">
          <div className="flex overflow-x-auto">
            <button className="px-4 py-3 text-amber-800 border-b-2 border-amber-800 font-medium">Description</button>
            <button className="px-4 py-3 text-stone-600 hover:text-stone-900 border-b-2 border-transparent">
              Details
            </button>
            <button className="px-4 py-3 text-stone-600 hover:text-stone-900 border-b-2 border-transparent">
              Brewing Guide
            </button>
            <button className="px-4 py-3 text-stone-600 hover:text-stone-900 border-b-2 border-transparent">
              Reviews (124)
            </button>
          </div>
        </div>

        <div className="pt-6">
          <div className="prose max-w-none">
            <p>
              Our Ethiopian Yirgacheffe is a truly exceptional single-origin coffee, celebrated for its distinctive
              floral and citrus notes with a silky smooth finish. Grown in the highlands of Ethiopia, the birthplace of
              coffee, these beans are carefully harvested and processed to preserve their unique characteristics.
            </p>
            <p>
              The Yirgacheffe region is known for producing some of the world's most sought-after coffees, and ours is
              no exception. The high altitude, rich soil, and ideal climate create perfect conditions for growing coffee
              with complex flavor profiles.
            </p>
            <p>
              We roast these beans to a medium level to highlight their natural brightness while developing their
              sweetness. The result is a cup with jasmine and bergamot aromatics, vibrant lemon acidity, and a
              honey-like sweetness that lingers on the palate.
            </p>
            <p>
              Whether you're brewing with a pour-over, French press, or espresso machine, this coffee will delight with
              its complexity and balance. It's perfect for those who appreciate the nuanced flavors of a truly
              exceptional single-origin coffee.
            </p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-20">
        <h2 className="text-2xl font-serif font-bold tracking-tight mb-8">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((product) => (
            <Link
              to={`/products/${product.id}`}
              key={product.id}
              className="group relative overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-xl"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <div className="mb-2">
                  <span className="text-xs font-medium text-amber-800 bg-amber-100 px-2 py-1 rounded-full">
                    {product.category}
                  </span>
                </div>
                <h3 className="text-lg font-medium text-stone-900">{product.name}</h3>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-lg font-semibold text-amber-800">{product.price}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
