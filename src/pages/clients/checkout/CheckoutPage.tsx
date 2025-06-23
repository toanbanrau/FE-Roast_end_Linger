

import { useEffect, useState } from "react"
import { ChevronRight, Lock } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useCartStore } from "../../../stores/useCartStore"
import { useUserStore } from "../../../stores/useUserStore"
import { useForm } from "react-hook-form"
import { checkout } from "../../../services/checkoutService"
import { toast } from "react-toastify"
import type { IOrderCreate, OrderItem } from "../../../interfaces/order"

interface IFormCheckout {
  customerName: string
  customerEmail: string
  shippingAddress: string
  phoneNumber: string
  shippingMethod: string
  paymentMethod: string
}

export default function CheckoutPage() {
  const [step, setStep] = useState(1)
  const navigate = useNavigate()

  const { cart, clearCart } = useCartStore()
  const { user } = useUserStore()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IFormCheckout>()

  useEffect(() => {
    if (user) {
      setValue("customerName", user.name)
      setValue("customerEmail", user.email)
    }
  }, [user, setValue])

  const cartItems = cart.items

  const subtotal = cart.totalAmount
  const shippingFee = subtotal > 1000000 ? 0 : 30000 // Free ship for orders > 1,000,000 VND
  const tax = subtotal * 0.08 // 8% tax rate
  const total = subtotal + shippingFee + tax

  const onSubmit = async (data: IFormCheckout) => {
    try {
      if (step === 3) {
        const orderItems: OrderItem[] = cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        }))

        const orderData: IOrderCreate = {
          ...data,
          userId: user?.id,
          totalAmount: total,
          shippingFee: shippingFee,
          items: orderItems,
        }

        await checkout(orderData)
        toast.success("Đặt hàng thành công!")
        clearCart()
        navigate("/")
      }
    } catch (error) {
      toast.error("Đặt hàng thất bại, vui lòng thử lại.")
      console.error(error)
    }
  }

  return (
    <form className="container px-4 py-12 md:px-6 md:py-16" onSubmit={handleSubmit(onSubmit)}>
      <nav className="flex items-center text-sm text-stone-500 mb-8">
        <Link to="/" className="hover:text-amber-800">
           Trang Chủ
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link to="/cart" className="hover:text-amber-800">
          Giỏ Hàng
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-stone-900">Thanh Toán</span>
      </nav>

      <h1 className="text-3xl font-serif font-bold tracking-tight mb-8">Thanh Toán</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Checkout Steps */}
          <div className="flex border-b">
            <div
               onClick={() => setStep(1)}
              className={`cursor-pointer pb-4 px-4 border-b-2 ${step >= 1 ? "border-amber-800 text-amber-800" : "border-transparent"}`}
            >
                
              1. Vận Chuyển
            </div>
            <div
              onClick={() => step > 1 && setStep(2)}
              className={`cursor-pointer pb-4 px-4 border-b-2 ${step >= 2 ? "border-amber-800 text-amber-800" : "border-transparent"}`}
            >
              2. Phương Thức Thanh Toán
            </div>
            <div
               onClick={() => step > 2 && setStep(3)}
              className={`cursor-pointer pb-4 px-4 border-b-2 ${step >= 3 ? "border-amber-800 text-amber-800" : "border-transparent"}`}
            >
              3. Thông Tin Đơn Hàng
            </div>
          </div>

          {/* Step 1: Shipping */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-medium">Thông Tin Liên Lạc</h2>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="customerEmail" className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <input
                      id="customerEmail"
                      type="email"
                      {...register("customerEmail", { required: "Email không được để trống" })}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                    />
                    {errors.customerEmail && <p className="text-red-500 text-sm mt-1">{errors.customerEmail.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium mb-1">
                      Số Điện Thoại
                    </label>
                    <input
                      id="phoneNumber"
                      type="tel"
                      {...register("phoneNumber", { required: "Số điện thoại không được để trống" })}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                    />
                    {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-medium">Địa Chỉ Giao Hàng</h2>
                <div className=" gap-4">
                  <div>
                    <label htmlFor="customerName" className="block text-sm font-medium mb-1">
                      Họ Và Tên
                    </label>
                    <input
                      id="customerName"
                      {...register("customerName", { required: "Họ và tên không được để trống" })}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                    />
                    {errors.customerName && <p className="text-red-500 text-sm mt-1">{errors.customerName.message}</p>}
                  </div>
                </div>
                <div>
                  <label htmlFor="shippingAddress" className="block text-sm font-medium mb-1">
                    Địa Chỉ
                  </label>
                  <input
                    id="shippingAddress"
                    {...register("shippingAddress", { required: "Địa chỉ không được để trống" })}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                  />
                  {errors.shippingAddress && <p className="text-red-500 text-sm mt-1">{errors.shippingAddress.message}</p>}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-medium">Phương Thức Giao Hàng</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between border p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="standard"
                        value="standard"
                        {...register("shippingMethod", { required: true })}
                        defaultChecked
                        className="text-amber-800 focus:ring-amber-800"
                      />
                      <label htmlFor="standard" className="font-medium">
                       Giao Hàng Tiết Kiệm (3-5 Ngày)
                      </label>
                    </div>
                    <div className="font-medium">{shippingFee === 0 ? "Miễn phí" : `${shippingFee.toLocaleString('vi-VN')}₫`}</div>
                  </div>
                  {/* Option for express shipping can be added here */}
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  className="bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-md font-medium"
                  onClick={() => setStep(2)}
                >
                  Tiếp Tục Thanh Toán
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-medium">Phương Thức Thanh Toán</h2>
                <div className="space-y-4">
                  <div className="border p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="online-payment"
                        value="online"
                        {...register("paymentMethod", { required: true })}
                        className="text-amber-800 focus:ring-amber-800"
                      />
                      <label htmlFor="online-payment" className="font-medium">
                         Thanh Toán Online (VNPAY)
                      </label>
                    </div>
           
                  </div>
                  <div className="border p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="cod"
                        value="cod"
                        {...register("paymentMethod", { required: true })}
                        defaultChecked
                        className="text-amber-800 focus:ring-amber-800"
                      />
                      <label htmlFor="cod" className="font-medium">
                       Thanh Toán Khi Nhận Hàng (COD)
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  className="border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md font-medium"
                  onClick={() => setStep(1)}
                >
                  Quay Lại Vận Chuyển
                </button>
                <button
                  type="button"
                  className="bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-md font-medium"
                  onClick={() => setStep(3)}
                >
                  Tiếp Tục Xem Lại
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-medium">Xem Trước Đơn Hàng</h2>
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-stone-50 p-4 border-b">
                    <h3 className="font-medium">Tóm Tắt Đơn Hàng</h3>
                  </div>
                  <div className="divide-y">
                    {cartItems.map((item) => (
                      <div key={item.id} className="p-4 flex items-center gap-4">
                        <div className="w-16 h-16 relative flex-shrink-0 bg-stone-50 rounded">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="object-contain p-2"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <div className="text-sm text-stone-500">
                            {item.size}, {item.grind}
                          </div>
                          <div className="text-sm text-stone-500">Qty: {item.quantity}</div>
                        </div>
                        <div className="font-medium">{(item.price * item.quantity).toLocaleString('vi-VN')}₫</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="font-medium">Thông Tin Vận Chuyển</h3>
                  <div className="text-stone-600">
                    <p>John Doe</p>
                    <p>123 Main St, Apt 4B</p>
                    <p>New York, NY 10001</p>
                    <p>United States</p>
                    <p>johndoe@example.com</p>
                    <p>(555) 123-4567</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Phương Thức Thanh Toán</h3>
                  <div className="text-stone-600">
                    <p>Visa ending in 4242</p>
                    <p>Expires 12/25</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  className="border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md font-medium"
                  onClick={() => setStep(2)}
                >
                  Quay Lại Thanh Toán
                </button>
                <button type="submit" className="bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-md font-medium flex items-center">
                  <Lock className="mr-2 h-4 w-4" /> Đặt Hàng
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 bg-stone-50 space-y-6 sticky top-6">
            <h2 className="text-xl font-medium">Tóm Tắt Đơn Hàng</h2>

            <div className="border-b pb-4">
              <div className="space-y-3 pt-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.quantity} × {item.name}
                    </span>
                    <span className="font-medium">{(item.price * item.quantity).toLocaleString('vi-VN')}₫</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-3">
              <div className="flex justify-between">
                <span className="text-stone-600">Tổng Tiền Sản Phẩm</span>
                <span className="font-medium">{subtotal.toLocaleString('vi-VN')}₫</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Phí Vận Chuyển</span>
                <span className="font-medium">{shippingFee === 0 ? "Miễn phí" : `${shippingFee.toLocaleString('vi-VN')}₫`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Thuế (8%)</span>
                <span className="font-medium">{tax.toLocaleString('vi-VN')}₫</span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-medium text-lg">
                  <span>Tổng Tiền</span>
                  <span>{total.toLocaleString('vi-VN')}₫</span>
                </div>
              </div>
            </div>

            <div className="text-sm text-stone-600 flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span>Thanh toán an toàn</span>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
