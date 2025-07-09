"use client"

import { useState } from "react"
import { Heart, ShoppingBag, Trash2, Filter } from "lucide-react"
import { Link } from "react-router-dom"
import AccountNav from "../../../../components/AccountNav"

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: "Ethiopian Yirgacheffe",
      price: "$24.95",
      originalPrice: null,
      image: "/placeholder.svg?height=300&width=300",
      description: "Hương hoa và cam chanh, hậu vị mượt mà",
      category: "Cà phê nguyên bản",
      inStock: true,
      dateAdded: "10/05/2025",
    },
    {
      id: 4,
      name: "Morning Blend",
      price: "$19.95",
      originalPrice: "$21.95",
      image: "/placeholder.svg?height=300&width=300",
      description: "Cân bằng, mượt mà, vị socola và hạt",
      category: "Pha trộn",
      inStock: true,
      dateAdded: "28/04/2025",
    },
    {
      id: 7,
      name: "Guatemala Antigua",
      price: "$25.95",
      originalPrice: null,
      image: "/placeholder.svg?height=300&width=300",
      description: "Cấu trúc phức hợp, socola và gia vị",
      category: "Cà phê nguyên bản",
      inStock: false,
      dateAdded: "15/04/2025",
    },
    {
      id: 9,
      name: "Dark Roast Blend",
      price: "$22.95",
      originalPrice: null,
      image: "/placeholder.svg?height=300&width=300",
      description: "Đậm đà, khói và hậu vị kéo dài",
      category: "Pha trộn",
      inStock: true,
      dateAdded: "20/03/2025",
    },
  ])

  const removeFromWishlist = (id: number) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== id))
  }

  const addToCart = (id: number) => {
    console.log(`Thêm sản phẩm ${id} vào giỏ`)
  }

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <h1 className="text-3xl font-serif font-bold tracking-tight mb-8">Danh sách yêu thích</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <AccountNav active="wishlist" />
        </div>

        <div className="lg:col-span-3 space-y-8">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex items-center gap-4">
              <p className="text-stone-600">
                {wishlistItems.length} {wishlistItems.length === 1 ? "sản phẩm" : "sản phẩm"}
              </p>
              <select className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800">
                <option value="recent">Mới thêm</option>
                <option value="oldest">Cũ nhất</option>
                <option value="price-low">Giá: Thấp đến Cao</option>
                <option value="price-high">Giá: Cao đến Thấp</option>
                <option value="name">Tên: A-Z</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-1 border border-stone-300 hover:bg-stone-50 px-3 py-2 rounded-md text-sm font-medium">
                <Filter className="h-4 w-4" /> Lọc
              </button>
              <button className="bg-amber-800 hover:bg-amber-900 text-white px-3 py-2 rounded-md text-sm font-medium">
                Thêm tất cả vào giỏ
              </button>
            </div>
          </div>

          {wishlistItems.length === 0 ? (
            <div className="text-center py-16 bg-white border rounded-lg">
              <div className="flex justify-center mb-6">
                <Heart className="h-16 w-16 text-stone-300" />
              </div>
              <h2 className="text-2xl font-medium mb-4">Danh sách yêu thích trống</h2>
              <p className="text-stone-600 mb-8">Hãy lưu lại các loại cà phê bạn yêu thích để dễ truy cập hơn.</p>
              <Link
                to="/products"
                className="bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-md font-medium"
              >
                Khám phá sản phẩm
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative">
                    <Link to={`/products/${item.id}`} className="block">
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover transition-transform hover:scale-105"
                        />
                      </div>
                    </Link>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute top-3 right-3 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-sm"
                    >
                      <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                    </button>
                    {!item.inStock && (
                      <div className="absolute top-3 left-3 bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                        Hết hàng
                      </div>
                    )}
                    {item.originalPrice && (
                      <div className="absolute top-3 left-3 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Giảm giá
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="mb-2">
                      <span className="text-xs font-medium text-amber-800 bg-amber-100 px-2 py-1 rounded-full">
                        {item.category}
                      </span>
                    </div>
                    <Link to={`/products/${item.id}`}>
                      <h3 className="text-lg font-medium text-stone-900 hover:text-amber-800 mb-2">{item.name}</h3>
                    </Link>
                    <p className="text-stone-600 text-sm mb-3">{item.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-amber-800">{item.price}</span>
                        {item.originalPrice && (
                          <span className="text-sm text-stone-500 line-through">{item.originalPrice}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => addToCart(item.id)}
                        disabled={!item.inStock}
                        className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-md text-sm font-medium ${
                          item.inStock
                            ? "bg-amber-800 hover:bg-amber-900 text-white"
                            : "bg-stone-100 text-stone-400 cursor-not-allowed"
                        }`}
                      >
                        <ShoppingBag className="h-4 w-4" />
                        {item.inStock ? "Thêm vào giỏ" : "Hết hàng"}
                      </button>
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="w-10 h-10 flex items-center justify-center border border-stone-300 hover:bg-stone-50 rounded-md"
                      >
                        <Trash2 className="h-4 w-4 text-stone-500" />
                      </button>
                    </div>
                    <p className="text-xs text-stone-500 mt-2">Đã thêm: {item.dateAdded}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {wishlistItems.length > 0 && (
            <div className="bg-stone-50 p-6 rounded-lg">
              <h2 className="text-xl font-medium mb-4">Có thể bạn sẽ thích</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[/* sản phẩm gợi ý */].map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium text-sm mb-1">{product.name}</h4>
                      <p className="text-amber-800 font-semibold">{product.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
