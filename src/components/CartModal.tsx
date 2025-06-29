import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react"
import { Link } from "react-router-dom"
import { useCartStore } from "../stores/useCartStore"
import type { ICartItem } from "../interfaces/cart"

interface CartModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const { cart, updateQuantity, removeFromCart } = useCartStore()
  const cartItems = cart?.items || []

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return
    try {
      await updateQuantity(itemId, newQuantity)
    } catch (error) {
      console.error('Lỗi cập nhật số lượng:', error)
    }
  }

  const handleRemoveItem = async (itemId: number) => {
    try {
      await removeFromCart(itemId)
    } catch (error) {
      console.error('Lỗi xóa sản phẩm:', error)
    }
  }

  const subtotal = cart?.subtotal || 0
  const shipping = subtotal > 50 ? 0 : 5.95
  const total = subtotal + shipping

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium">Giỏ Hàng({cartItems.length})</h2>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <ShoppingBag className="h-16 w-16 text-stone-300 mb-4" />
              <h3 className="text-lg font-medium text-stone-900 mb-2">Giỏ hàng trống</h3>
              <p className="text-stone-600 mb-6">Hãy thêm sản phẩm để bắt đầu!</p>
              <Link
                to="/products"
                onClick={onClose}
                className="bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-md font-medium"
              >
                Xem sản phẩm
              </Link>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {cartItems.map((item: ICartItem) => (
                <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="relative w-16 h-16 flex-shrink-0 bg-stone-50 rounded">
                    <img src={item.product.image || "/placeholder.svg"} alt={item.product.name} className="object-contain p-2" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{item.product.name}</h3>
                    <div className="text-xs text-stone-500 mt-1">
                      {item.variant?.name}
                    </div>
                    <div className="text-sm font-medium text-amber-800 mt-1">{item.formatted_unit_price}</div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1 hover:bg-red-50 hover:text-red-600 rounded transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <div className="flex items-center border rounded">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-stone-50 transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-2 py-1 text-sm min-w-[2rem] text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-stone-50 transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t p-4 space-y-4">
            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-stone-600">Tổng Tiền Hàng</span>
                <span className="font-medium">{subtotal.toLocaleString('vi-VN')}₫</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-600">Phí Giao Hàng</span>
                <span className="font-medium">{shipping === 0 ? "Miễn phí" : `${shipping.toLocaleString('vi-VN')}₫`}</span>
              </div>
              <div className="flex justify-between font-medium text-lg pt-2 border-t">
                <span>Tổng Tiền</span>
                <span>{total.toLocaleString('vi-VN')}₫</span>
              </div>
            </div>

            {/* Free shipping notice */}
            {shipping > 0 && (
              <div className="text-xs text-stone-600 bg-amber-50 p-2 rounded">
                Thêm {(50 - subtotal).toLocaleString('vi-VN')}₫ để được miễn phí vận chuyển!
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2">
              <Link
                to="/checkout"
                onClick={onClose}
                className="block w-full bg-amber-800 hover:bg-amber-900 text-white text-center px-4 py-3 rounded-md font-medium transition-colors"
              >
                Thanh Toán
              </Link>
              <Link
                to="/cart"
                onClick={onClose}
                className="block w-full border border-stone-300 hover:bg-stone-50 text-center px-4 py-2 rounded-md font-medium transition-colors"
              >
                Xem Giỏ Hàng
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
