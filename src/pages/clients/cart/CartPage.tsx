import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCart, updateCartItem, removeFromCart } from "../../../services/cartService";
import { useCartStore } from "../../../stores/useCartStore";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
// Giả sử có hook kiểm tra đăng nhập
import { useUserStore } from "../../../stores/useUserStore";
import type { ICartItem } from '../../../interfaces/cart';

export default function CartPage() {
  const queryClient = useQueryClient();
  const isLoggedIn = useUserStore((state) => !!state.user);

  // Zustand store cho guest
  const {
    cart: guestCart,
    updateQuantity: updateGuestQuantity,
    removeFromCart: removeGuestItem,
  } = useCartStore();

  // React Query cho user đã login
  const { data: cart, isLoading, error } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: isLoggedIn,
  });

  const updateMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) =>
      updateCartItem(itemId, { quantity }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const removeMutation = useMutation({
    mutationFn: (itemId: number) => removeFromCart(itemId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  // Chọn nguồn dữ liệu phù hợp
  const cartItems = isLoggedIn ? cart?.items || [] : guestCart.items || [];
  const subtotal = isLoggedIn ? cart?.subtotal || 0 : guestCart.totalAmount || 0;

  if (isLoggedIn && isLoading) return <div>Đang tải giỏ hàng...</div>;
  if (isLoggedIn && error) return <div>Lỗi khi tải giỏ hàng</div>;

  // Calculate totals
  const shipping = subtotal > 50 ? 0 : 5.95
  const tax = subtotal * 0.08 // 8% tax rate
  const total = subtotal + shipping + tax

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <h1 className="text-3xl font-serif font-bold tracking-tight mb-8">Giỏ Hàng</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-16">
          <div className="flex justify-center mb-6">
            <ShoppingBag className="h-16 w-16 text-stone-300" />
          </div>
          <h2 className="text-2xl font-medium mb-4">Giỏ hàng của bạn đang trống</h2>
          <p className="text-stone-600 mb-8">Bạn chưa thêm sản phẩm nào vào giỏ hàng.</p>
          <Link
            to="/products"
            className="bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-md font-medium"
          >
            Xem sản phẩm
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-stone-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium">Sản phẩm</th>
                    <th className="text-center p-4 font-medium">Số lượng</th>
                    <th className="text-right p-4 font-medium">Giá</th>
                    <th className="p-4 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item: ICartItem) => (
                    <tr key={item.id} className="border-b last:border-b-0">
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 relative flex-shrink-0 bg-stone-50 rounded">
                            <img
                              src={item.product?.image || "/placeholder.svg"}
                              alt={item.product?.name}
                              className="object-contain p-2"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium">{item.product?.name}</h3>
                            <div className="text-sm text-stone-500 mt-1">
                              {item.variant?.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center">
                          <div className="flex items-center border rounded-md">
                            <button
                              className="h-8 w-8 flex items-center justify-center text-gray-500 hover:text-gray-700"
                              onClick={() =>
                                isLoggedIn
                                  ? updateMutation.mutate({ itemId: item.id, quantity: item.quantity - 1 })
                                  : updateGuestQuantity(item.id, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <button
                              className="h-8 w-8 flex items-center justify-center text-gray-500 hover:text-gray-700"
                              onClick={() =>
                                isLoggedIn
                                  ? updateMutation.mutate({ itemId: item.id, quantity: item.quantity + 1 })
                                  : updateGuestQuantity(item.id, item.quantity + 1)
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right font-medium">
                        {isLoggedIn ? item.formatted_total_price : (item.unit_price * item.quantity).toLocaleString() + '₫'}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          className="h-8 w-8 flex items-center justify-center text-stone-400 hover:text-red-500"
                          onClick={() =>
                            isLoggedIn
                              ? removeMutation.mutate(item.id)
                              : removeGuestItem(item.id)
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex flex-wrap gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Mã giảm giá"
                  className="max-w-xs px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                />
              </div>
              <button className="border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md font-medium">
                Áp dụng mã
              </button>
              <button className="ml-auto border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md font-medium">
                Cập nhật giỏ hàng
              </button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6 bg-stone-50 space-y-6">
              <h2 className="text-xl font-medium">Tóm tắt đơn hàng</h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-stone-600">Tổng tiền sản phẩm</span>
                  <span className="font-medium">{subtotal.toLocaleString()}₫</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Phí vận chuyển</span>
                  <span className="font-medium">{shipping === 0 ? "Miễn phí" : `${shipping.toLocaleString()}₫`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Thuế</span>
                  <span className="font-medium">{tax.toLocaleString()}₫</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-medium text-lg">
                    <span>Tổng cộng</span>
                    <span>{total.toLocaleString()}₫</span>
                  </div>
                </div>
              </div>

              <div className="text-sm text-stone-600">
                {shipping === 0 ? (
                  <p className="flex items-center gap-1 text-emerald-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6L9 17l-5-5"></path>
                    </svg>
                    Bạn đã đủ điều kiện miễn phí vận chuyển!
                  </p>
                ) : (
                  <p>Miễn phí vận chuyển cho đơn hàng trên 50.000₫</p>
                )}
              </div>

              <Link
                to="/checkout"
                className="block w-full bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-md font-medium text-center"
              >
                Tiến hành thanh toán
              </Link>

              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium mb-3">Chúng tôi chấp nhận</h3>
                <div className="flex gap-2">
                  {['Visa', 'Mastercard', 'Amex', 'PayPal'].map((method) => (
                    <div key={method} className="bg-white border rounded px-2 py-1 text-xs">
                      {method}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 border rounded-lg p-6">
              <h3 className="text-sm font-medium mb-3">Cần hỗ trợ?</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/shipping" className="text-amber-800 hover:underline">
                    Thông tin vận chuyển
                  </Link>
                </li>
                <li>
                  <Link to="/returns" className="text-amber-800 hover:underline">
                    Đổi trả & Hoàn tiền
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-amber-800 hover:underline">
                    Liên hệ chăm sóc khách hàng
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
