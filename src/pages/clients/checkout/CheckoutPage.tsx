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
  customer_name: string
  customer_email: string
  delivery_address: string
  customer_phone: string
  shippingMethod: string
  payment_method: string
  city?: string
  district?: string
  ward?: string
  notes?: string
  promotion_code?: string
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
      setValue("customer_name", user.name)
      setValue("customer_email", user.email)
    }
  }, [user, setValue])


  const cartItems = cart?.items || []

  const subtotal = cart?.subtotal || 0
  const shippingFee = subtotal > 1000000 ? 0 : 30000 // Free ship for orders > 1,000,000 VND
  const tax = subtotal * 0.08 // 8% tax rate
  const total = subtotal + shippingFee + tax

  if (!cart || cartItems.length === 0) {
    return (
      <div className="container px-4 py-12 md:px-6 md:py-16">
        <div className="text-center py-16">
          <h2 className="text-2xl font-medium mb-4">Giỏ hàng trống</h2>
          <p className="text-stone-600 mb-8">Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.</p>
          <Link
            to="/products"
            className="bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-md font-medium"
          >
            Xem sản phẩm
          </Link>
        </div>
      </div>
    )
  }

  const onSubmit = async (data: IFormCheckout) => {
    try {
      if (step === 3) {
        const orderItems: OrderItem[] = cartItems.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.unit_price,
        }))

        const orderData: IOrderCreate = {
          customer_name: data.customer_name,
          customer_email: data.customer_email,
          customer_phone: data.customer_phone,
          delivery_address: `${data.delivery_address}, ${data.ward}, ${data.district}, ${data.city}`,
          payment_method: data.payment_method,
          promotion_code: data.promotion_code,
          notes: data.notes,
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
                    <label htmlFor="customer_email" className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <input
                      id="customer_email"
                      type="email"
                      {...register("customer_email", { required: "Email không được để trống" })}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                    />
                    {errors.customer_email && <p className="text-red-500 text-sm mt-1">{errors.customer_email.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="customer_phone" className="block text-sm font-medium mb-1">
                      Số Điện Thoại
                    </label>
                    <input
                      id="customer_phone"
                      type="tel"
                      {...register("customer_phone", { required: "Số điện thoại không được để trống" })}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                    />
                    {errors.customer_phone && <p className="text-red-500 text-sm mt-1">{errors.customer_phone.message}</p>}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-medium">Địa Chỉ Giao Hàng</h2>
                <div className=" gap-4">
                  <div>
                    <label htmlFor="customer_name" className="block text-sm font-medium mb-1">
                      Họ Và Tên
                    </label>
                    <input
                      id="customer_name"
                      {...register("customer_name", { required: "Họ và tên không được để trống" })}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                    />
                    {errors.customer_name && <p className="text-red-500 text-sm mt-1">{errors.customer_name.message}</p>}
                  </div>
                </div>
                <div>
                  <label htmlFor="delivery_address" className="block text-sm font-medium mb-1">
                    Địa Chỉ
                  </label>
                  <input
                    id="delivery_address"
                    {...register("delivery_address", { required: "Địa chỉ không được để trống" })}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                  />
                  {errors.delivery_address && <p className="text-red-500 text-sm mt-1">{errors.delivery_address.message}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium mb-1">
                      Tỉnh/Thành phố
                    </label>
                    <input
                      id="city"
                      {...register("city")}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                    />
                  </div>
                  <div>
                    <label htmlFor="district" className="block text-sm font-medium mb-1">
                      Quận/Huyện
                    </label>
                    <input
                      id="district"
                      {...register("district")}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                    />
                  </div>
                  <div>
                    <label htmlFor="ward" className="block text-sm font-medium mb-1">
                      Phường/Xã
                    </label>
                    <input
                      id="ward"
                      {...register("ward")}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                    />
                  </div>
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
                        {...register("payment_method", { required: true })}
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
                        {...register("payment_method", { required: true })}
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
                            src={item.product.image || "/placeholder.svg"}
                            alt={item.product.name}
                            className="object-contain p-2"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.product.name}</h4>
                          <div className="text-sm text-stone-500">
                            {item.variant?.name}
                          </div>
                          <div className="text-sm text-stone-500">Số lượng: {item.quantity}</div>
                        </div>
                        <div className="font-medium">{item.total_price.toLocaleString('vi-VN')}₫</div>
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
                      {item.quantity} × {item.product.name}
                    </span>
                    <span className="font-medium">{item.total_price.toLocaleString('vi-VN')}₫</span>
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

            <div className="border-b pb-4">
              <div className="flex items-center gap-2">
                <input
                  id="promotion_code"
                  placeholder="Mã giảm giá"
                  {...register("promotion_code")}
                  className="flex-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800 text-sm"
                />
                <button
                  type="button"
                  className="border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md font-medium text-sm"
                >
                  Áp dụng
                </button>
              </div>
            </div>

            <div className="text-sm text-stone-600 flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span>Thanh toán an toàn</span>
            </div>

            <div className="border-t pt-4">
              <label htmlFor="notes" className="block text-sm font-medium mb-1">
                Ghi chú đơn hàng
              </label>
              <textarea
                id="notes"
                {...register("notes")}
                rows={3}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
