import { Link, useParams } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getProductById } from "../../../services/productService"
import { useCartStore } from "../../../stores/useCartStore"
import { useUserStore } from "../../../stores/useUserStore"
import { toast } from "react-toastify"
import type { IProduct } from "../../../interfaces/product"
import { useState, useMemo, useEffect } from "react"
import type { IAddProductToCartPayload } from "../../../interfaces/cart"
import { ChevronRight, Minus, Plus, ShoppingBag, Truck } from "lucide-react"
import type { IProductVariant, IProductImage } from '../../../interfaces/product'

export default function ProductDetailPage() {
  const { id } = useParams()
  const [quantity, setQuantity] = useState(1)
  const queryClient = useQueryClient()
  const isLoggedIn = useUserStore((state) => !!state.user)
  const { addToCart } = useCartStore()
  
  const {
    data: product,
    isLoading,
    error,
  } = useQuery<IProduct | undefined>({
    queryKey: ["product-detail", id],
    queryFn: () => getProductById(Number(id))
  })

  type VariantWithAttributes = IProductVariant & { attributes?: { id: number; attribute_name: string; value: string }[] }
  const [selectedVariant, setSelectedVariant] = useState<VariantWithAttributes | null>(null)
  const [selectedAttributes, setSelectedAttributes] = useState<{ [key: string]: number }>({})

  const variants: VariantWithAttributes[] = (product && (product as { variants?: VariantWithAttributes[] }).variants) || []
  const attributeGroups = useMemo(() => {
    if (!variants || variants.length === 0) return []
    const groups: { name: string; values: { id: number; value: string }[] }[] = []
    variants.forEach((variant: VariantWithAttributes) => {
      if (variant.attributes) {
        variant.attributes.forEach((attr) => {
          let group = groups.find(g => g.name === attr.attribute_name)
          if (!group) {
            group = { name: attr.attribute_name, values: [] }
            groups.push(group)
          }
          if (!group.values.find(v => v.id === attr.id)) {
            group.values.push({ id: attr.id, value: attr.value })
          }
        })
      }
    })
    return groups
  }, [variants])

  const handleSelectAttribute = (groupName: string, valueId: number) => {
    const newSelected = { ...selectedAttributes, [groupName]: valueId }
    setSelectedAttributes(newSelected)
    // Tìm variant phù hợp
    if (variants) {
      const found = variants.find((variant) => {
        if (!variant.attributes) return false
        return attributeGroups.every(group => {
          const attr = variant.attributes!.find((a) => a.attribute_name === group.name)
          return attr && newSelected[group.name] === attr.id
        })
      })
      setSelectedVariant(found || null)
    }
  }

  useEffect(() => {
    if (variants && variants.length > 0 && !selectedVariant) {
      setSelectedVariant(variants[0])
      // Set selectedAttributes mặc định
      const defaultAttrs: { [key: string]: number } = {}
      variants[0].attributes?.forEach(attr => {
        defaultAttrs[attr.attribute_name] = attr.id
      })
      setSelectedAttributes(defaultAttrs)
    }
  }, [variants, selectedVariant])

  // Chuẩn bị mảng album không lặp ảnh chính
  const albumImages: IProductImage[] = useMemo(() => {
    if (!product) return [];
    const allImages = (product.images || []) as IProductImage[];
    // Loại bỏ ảnh chính nếu bị lặp trong images
    return allImages.filter(img => img.image_url !== product.primary_image?.image_url);
  }, [product]);

  // Mảng ảnh hiển thị: [ảnh variant nếu có, ảnh chính, ...albumImages]
  const displayImages: { url: string, type: string }[] = useMemo(() => {
    const arr: { url: string, type: string }[] = [];
    const variantImage = selectedVariant?.image || selectedVariant?.image_url;
    if (variantImage) arr.push({ url: variantImage, type: "variant" });
    if (product?.primary_image?.image_url) arr.push({ url: product.primary_image.image_url, type: "primary" });
    albumImages.forEach(img => arr.push({ url: img.image_url, type: "album" }));
    // Loại trùng url
    return arr.filter((img, idx, self) => self.findIndex(i => i.url === img.url) === idx);
  }, [selectedVariant, product, albumImages]);

  // State cho ảnh đang active
  const [activeImage, setActiveImage] = useState<string | undefined>(undefined);
  useEffect(() => {
    const variantImage = selectedVariant?.image || selectedVariant?.image_url;
    if (variantImage) {
      setActiveImage(variantImage);
    } else if (product?.primary_image?.image_url) {
      setActiveImage(product.primary_image.image_url);
    } else if (albumImages.length > 0) {
      setActiveImage(albumImages[0].image_url);
    } else {
      setActiveImage("/placeholder.svg");
    }
  }, [selectedVariant, product, albumImages]);

  // Mutation cho user đã đăng nhập
  const addCartMutation = useMutation({
    mutationFn:(value:IAddProductToCartPayload)=> addToCart(value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] })
      toast.success("Đã thêm vào giỏ hàng!", { position: "top-right" })
    },
    onError: () => {
      toast.error("Thêm vào giỏ hàng thất bại!", { position: "top-right" })
    }
  })
 

  if (isLoading) return <div>Đang tải sản phẩm...</div>
  if (error) return <div>Lỗi khi tải sản phẩm</div>
  if (!product) return <div>Không tìm thấy sản phẩm</div>

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      {/* Breadcrumbs */}
      <nav className="flex items-center text-sm text-stone-500 mb-8">
        <Link to="/" className="hover:text-amber-800">
          Trang Chủ
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link to="/products" className="hover:text-amber-800">
          Sản Phẩm
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-stone-900">{product.product_name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Album ảnh sản phẩm */}
        <div className="flex flex-col gap-4">
          <div className="bg-stone-50 rounded-xl p-8 flex items-center justify-center">
            <img
              src={activeImage}
              alt={product.product_name}
              width={600}
              height={600}
              className="object-contain max-h-[500px]"
            />
          </div>
          <div className="flex gap-2 justify-center">
            {displayImages.map((img, idx) => (
              <img
                key={idx}
                src={img.url}
                alt={img.type}
                className={`w-20 h-20 object-cover rounded cursor-pointer border ${activeImage === img.url ? "border-amber-800" : "border-transparent"}`}
                onClick={() => setActiveImage(img.url)}
              />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-amber-800 bg-amber-100 px-2 py-1 rounded-full">
                {product.category?.category_name}
              </span>
              <span className="text-xs font-medium text-emerald-800 bg-emerald-100 px-2 py-1 rounded-full">
                {product.stock_quantity > 0 ? "Còn Hàng" : "Hết Hàng"}
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

          <div className="text-2xl font-semibold text-amber-800">
            {selectedVariant ? selectedVariant.price?.toLocaleString() : product.base_price?.toLocaleString()}₫
          </div>

          <p className="text-stone-600">{product.short_description || product.description}</p>

          {/* Hiển thị lựa chọn biến thể nếu có */}
          {product.has_variants && attributeGroups.length > 0 && (
            <div className="space-y-2">
              {attributeGroups.map(group => (
                <div key={group.name}>
                  <label className="block text-sm font-medium mb-1">{group.name}</label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                    value={selectedAttributes[group.name] || ''}
                    onChange={e => handleSelectAttribute(group.name, Number(e.target.value))}
                  >
                    <option value="">Chọn {group.name}</option>
                    {group.values.map(v => (
                      <option key={v.id} value={v.id}>{v.value}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}

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
              onClick={() => {
                if (product.stock_quantity < 1) {
                  toast.error("Sản phẩm đã hết hàng!");
                  return;
                }
                if (product.has_variants && attributeGroups.length > 0 && !selectedVariant) {
                  toast.error("Vui lòng chọn đầy đủ thuộc tính sản phẩm!");
                  return;
                }
                if (!isLoggedIn) {
                  toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng!");
                  return;
                }
                addCartMutation.mutate({
                  product_id: product.id,
                  quantity,
                  ...(selectedVariant ? { product_variant_id: selectedVariant.id } : {})
                });
              }}
              disabled={product.stock_quantity < 1 || addCartMutation.isPending}
            >
              <ShoppingBag className="mr-2 h-5 w-5" /> Thêm vào Giỏ Hàng
            </button>
          </div>

          <div className="flex items-center gap-2 text-sm text-stone-600 pt-4 border-t">
            <Truck className="h-4 w-4 text-amber-800" />
            <span>Free shipping on orders over $50</span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <h3 className="text-sm font-medium">Nguồn Gốc</h3>
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
              <h3 className="text-sm font-medium">Mức Độ Rang</h3>
              <p className="text-stone-600">{product.roast_level}</p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h3 className="text-sm font-medium mb-2">Hương Vị</h3>
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
      {/* <div className="mt-20">
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
      </div> */}
    </div>
  )
}
