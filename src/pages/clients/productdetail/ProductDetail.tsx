import { ChevronRight, Minus, Plus, ShoppingBag, Truck } from "lucide-react"
import { Link, useParams } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getProductById } from "../../../services/productService"
import { addToCart as addToCartApi } from "../../../services/cartService"
import { useCartStore } from "../../../stores/useCartStore"
import { useUserStore } from "../../../stores/useUserStore"
import { toast } from "react-toastify"
import type { IProduct } from "../../../interfaces/product"
import { useState } from "react"

export default function ProductDetailPage() {
  const { id } = useParams()
  const [quantity, setQuantity] = useState(1)
  const queryClient = useQueryClient()
  const isLoggedIn = useUserStore((state) => !!state.user)
  const zustandAddToCart = useCartStore((state) => state.addToCart)

  const {
    data: product,
    isLoading,
    error,
  } = useQuery<IProduct | undefined>({
    queryKey: ["product-detail", id],
    queryFn: () => getProductById(Number(id))
  })

  // Mutation cho user đã đăng nhập
  const addCartMutation = useMutation({
    mutationFn: addToCartApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] })
      toast.success("Đã thêm vào giỏ hàng!")
    },
    onError: () => {
      toast.error("Thêm vào giỏ hàng thất bại!")
    }
  })

  // Placeholder for related products (có thể fetch thêm sau)
  const relatedProducts: IProduct[] = []

  if (isLoading) return <div>Đang tải sản phẩm...</div>
  if (error) return <div>Lỗi khi tải sản phẩm</div>
  if (!product) return <div>Không tìm thấy sản phẩm</div>

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = () => {
    if (product.stock_quantity < 1) {
      toast.error("Sản phẩm đã hết hàng!")
      return
    }
    if (isLoggedIn) {
      addCartMutation.mutate({
        product_id: product.id,
        quantity,
        // Nếu có biến thể, truyền product_variant_id ở đây
      })
    } else {
      // Guest: tạo CartItem tối giản (bạn có thể mở rộng nếu cần)
      zustandAddToCart({
        id: product.id,
        product: {
          id: product.id,
          name: product.product_name,
          slug: product.slug,
          image: product.primary_image?.image_url || "",
          status: product.status,
        },
        variant: null,
        full_product_info: product.product_name,
        quantity,
        unit_price: Number(product.base_price),
        total_price: Number(product.base_price) * quantity,
        formatted_unit_price: Number(product.base_price).toLocaleString() + '₫',
        formatted_total_price: (Number(product.base_price) * quantity).toLocaleString() + '₫',
        stock_info: {
          available_stock: product.stock_quantity,
          in_stock: product.stock_quantity > 0,
          exceeds_stock: false,
        },
        cart_id: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      toast.success("Đã thêm vào giỏ hàng!")
    }
  }

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
        <span className="text-stone-900">{product.product_name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="bg-stone-50 rounded-xl p-8 flex items-center justify-center">
          <img
            src={product.primary_image?.image_url || "/placeholder.svg"}
            alt={product.product_name}
            width={600}
            height={600}
            className="object-contain max-h-[500px]"
          />
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-amber-800 bg-amber-100 px-2 py-1 rounded-full">
                {product.category?.category_name}
              </span>
              <span className="text-xs font-medium text-emerald-800 bg-emerald-100 px-2 py-1 rounded-full">
                {product.stock_quantity > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </div>
            <h1 className="text-3xl font-serif font-bold tracking-tight">{product.product_name}</h1>
            {/* Đánh giá và reviewCount có thể cần fetch thêm nếu backend trả về */}
            {/* <div className="flex items-center gap-2 mt-2">
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
            </div> */}
          </div>

          <div className="text-2xl font-semibold text-amber-800">{product.base_price}₫</div>

          <p className="text-stone-600">{product.short_description || product.description}</p>

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
                <button className="h-10 w-10 flex items-center justify-center text-gray-500 hover:text-gray-700" onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center">{quantity}</span>
                <button className="h-10 w-10 flex items-center justify-center text-gray-500 hover:text-gray-700" onClick={() => setQuantity(q => q + 1)}>
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button
                className="flex-1 bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-md font-medium flex items-center justify-center"
                onClick={handleAddToCart}
                disabled={product.stock_quantity < 1 || addCartMutation.isPending}
              >
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
              <p className="text-stone-600">{product.origin?.origin_name}</p>
            </div>
            {/* <div>
              <h3 className="text-sm font-medium">Process</h3>
              <p className="text-stone-600">{product.process}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Altitude</h3>
              <p className="text-stone-600">{product.altitude}</p>
            </div> */}
            <div>
              <h3 className="text-sm font-medium">Roast Level</h3>
              <p className="text-stone-600">{product.roast_level}</p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h3 className="text-sm font-medium mb-2">Flavor Notes</h3>
            <div className="flex flex-wrap gap-2">
              {/* Nếu flavor_profile là chuỗi, có thể tách ra mảng nếu cần */}
              {product.flavor_profile && product.flavor_profile.split(",").map((note, index) => (
                <span key={index} className="text-xs bg-stone-100 text-stone-800 px-3 py-1 rounded-full">
                  {note.trim()}
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
          {relatedProducts.length === 0 ? (
            <div className="col-span-4 text-center text-stone-500">No related products</div>
          ) : (
            relatedProducts.map((product) => (
              <Link
                to={`/products/${product.id}`}
                key={product.id}
                className="group relative overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-xl"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.primary_image?.image_url || "/placeholder.svg"}
                    alt={product.product_name}
                    width={300}
                    height={300}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <div className="mb-2">
                    <span className="text-xs font-medium text-amber-800 bg-amber-100 px-2 py-1 rounded-full">
                      {product.category?.category_name}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium text-stone-900">{product.product_name}</h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-lg font-semibold text-amber-800">{product.base_price}₫</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
