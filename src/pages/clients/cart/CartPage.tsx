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
          <h2 className="text-2xl font-medium mb-4">Your cart is empty</h2>
          <p className="text-stone-600 mb-8">Looks like you haven't added any coffee to your cart yet.</p>
          <Link
            to="/products"
            className="bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-md font-medium"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-stone-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium">Sản Phẩm</th>
                    <th className="text-center p-4 font-medium">Số Lượng </th>
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
                  placeholder="Coupon code"
                  className="max-w-xs px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                />
              </div>
              <button className="border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md font-medium">
                Apply Coupon
              </button>
              <button className="ml-auto border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md font-medium">
                Update Cart
              </button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6 bg-stone-50 space-y-6">
              <h2 className="text-xl font-medium">Tóm Tắt Đơn Hàng</h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-stone-600">Tổng Tiền Sản Phẩm</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Giá Vận Chuyển</span>
                  <span className="font-medium">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Thuế</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-medium text-lg">
                    <span>Tổng Tiền</span>
                    <span>${total.toFixed(2)}</span>
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
                    You've qualified for free shipping!
                  </p>
                ) : (
                  <p>Free shipping on orders over $50</p>
                )}
              </div>

              <Link
                to="/checkout"
                className="block w-full bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-md font-medium text-center"
              >
                Tiến Hành Thanh Toán
              </Link>

              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium mb-3">We Accept</h3>
                <div className="flex gap-2">
                  {["Visa", "Mastercard", "Amex", "PayPal"].map((method) => (
                    <div key={method} className="bg-white border rounded px-2 py-1 text-xs">
                      {method}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 border rounded-lg p-6">
              <h3 className="text-sm font-medium mb-3">Need Help?</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/shipping" className="text-amber-800 hover:underline">
                    Shipping Information
                  </Link>
                </li>
                <li>
                  <Link to="/returns" className="text-amber-800 hover:underline">
                    Returns & Exchanges
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-amber-800 hover:underline">
                    Contact Customer Service
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
