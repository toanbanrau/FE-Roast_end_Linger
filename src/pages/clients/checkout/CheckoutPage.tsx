import { useEffect, useState } from "react";
import { ChevronRight, Lock, Plus, MapPin } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../../../stores/useCartStore";
import { useUserStore } from "../../../stores/useUserStore";
import { useForm } from "react-hook-form";
import { checkout } from "../../../services/checkoutService";
import { toast } from "react-toastify";
import type { IOrderCreate, OrderItem } from "../../../interfaces/order";
import BankTransferInfo from "../../../components/BankTransferInfo";
import LocationSelector from "../../../components/LocationSelector";
import type {
  Province,
  District,
  Ward,
} from "../../../services/locationService";
import { useQuery } from "@tanstack/react-query";
import { addressQueryOptions } from "../../../services/addressUserServices";
import type { UserAddress } from "../../../interfaces/address";

interface IFormCheckout {
  customer_name: string;
  customer_email: string;
  delivery_address: string;
  customer_phone: string;
  shippingMethod: string;
  payment_method: string;
  city?: string;
  district?: string;
  ward?: string;
  notes?: string;
  promotion_code?: string;
}

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [orderResult, setOrderResult] = useState<any>(null);
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(
    null
  );
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(
    null
  );
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null);

  // Address selection states
  const [selectedAddress, setSelectedAddress] = useState<UserAddress | null>(
    null
  );
  const [useNewAddress, setUseNewAddress] = useState(false);

  const navigate = useNavigate();

  const { cart, clearCart } = useCartStore();
  const { user } = useUserStore();

  // Fetch user addresses
  const { data: addresses = [] } = useQuery({
    ...addressQueryOptions.getAddresses(),
    enabled: !!user, // Only fetch if user is logged in
  });

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<IFormCheckout>();

  useEffect(() => {
    if (user) {
      setValue("customer_name", user.name);
      setValue("customer_email", user.email);
    }
  }, [user, setValue]);

  // Handle step navigation
  const handleStepChange = (newStep: number) => {
    if (newStep <= step) {
      setStep(newStep);
    }
  };

  // Validate step before proceeding
  const validateAndProceedToStep = async (nextStep: number) => {
    let fieldsToValidate: (keyof IFormCheckout)[] = [];

    // Define required fields for each step
    if (step === 1) {
      // Step 1: Shipping information
      fieldsToValidate = [
        "customer_name",
        "customer_email",
        "customer_phone",
        "delivery_address",
        "shippingMethod",
      ];
    } else if (step === 2) {
      // Step 2: Payment method
      fieldsToValidate = ["payment_method"];
    }

    // Validate required fields
    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      // Additional validation for location if needed
      if (step === 1) {
        const values = getValues();
        if (!values.delivery_address?.trim()) {
          toast.error("Vui lòng nhập địa chỉ giao hàng");
          return;
        }
      }

      setStep(nextStep);
    } else {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
    }
  };

  // Handle address selection
  const handleAddressSelect = (address: UserAddress) => {
    setSelectedAddress(address);
    setUseNewAddress(false);

    // Fill form with selected address data
    setValue("customer_name", address.recipient_name);
    setValue("customer_phone", address.phone_number);
    setValue("delivery_address", address.address_line_1);
    setValue("city", address.city);
    setValue("district", address.district);
    setValue("ward", address.ward);
  };

  // Handle new address selection
  const handleNewAddress = () => {
    setSelectedAddress(null);
    setUseNewAddress(true);

    // Clear address fields but keep user info
    setValue("delivery_address", "");
    setValue("city", "");
    setValue("district", "");
    setValue("ward", "");
  };

  const cartItems = cart?.items || [];

  const subtotal = cart?.subtotal || 0;
  const shippingFee = subtotal > 1000000 ? 0 : 30000; // Free ship for orders > 1,000,000 VND
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + shippingFee + tax;

  if (!cart || cartItems.length === 0) {
    return (
      <div className="container px-4 py-12 md:px-6 md:py-16">
        <div className="text-center py-16">
          <h2 className="text-2xl font-medium mb-4">Giỏ hàng trống</h2>
          <p className="text-stone-600 mb-8">
            Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.
          </p>
          <Link
            to="/products"
            className="bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-md font-medium"
          >
            Xem sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: IFormCheckout) => {
    try {
      if (step === 3) {
        const orderItems: OrderItem[] = cartItems.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.unit_price,
        }));

        const orderData: IOrderCreate = {
          customer_name: data.customer_name,
          customer_email: data.customer_email,
          customer_phone: data.customer_phone,
          delivery_address: `${data.delivery_address}, ${data.ward}, ${data.district}, ${data.city}`,
          payment_method: data.payment_method,
          promotion_code: data.promotion_code,
          notes: data.notes,
          items: orderItems,
        };

        const result = await checkout(orderData);

        // Kiểm tra nếu là bank_transfer thì hiển thị thông tin thanh toán
        if (data.payment_method === "bank_transfer") {
          setOrderResult(result);
          setShowPaymentInfo(true);
          toast.success(
            "Đặt hàng thành công! Vui lòng thanh toán theo thông tin bên dưới."
          );
        } else {
          toast.success("Đặt hàng thành công!");
          clearCart();
          navigate("/");
        }
      }
    } catch (error) {
      toast.error("Đặt hàng thất bại, vui lòng thử lại.");
      console.error(error);
    }
  };

  return (
    <form
      className="container px-4 py-12 md:px-6 md:py-16"
      onSubmit={handleSubmit(onSubmit)}
    >
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

      <h1 className="text-3xl font-serif font-bold tracking-tight mb-8">
        Thanh Toán
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Checkout Steps */}
          <div className="flex border-b">
            <div
              onClick={() => handleStepChange(1)}
              className={`cursor-pointer pb-4 px-4 border-b-2 ${
                step >= 1
                  ? "border-amber-800 text-amber-800"
                  : "border-transparent"
              }`}
            >
              1. Vận Chuyển
            </div>
            <div
              onClick={() => handleStepChange(2)}
              className={`cursor-pointer pb-4 px-4 border-b-2 ${
                step >= 2
                  ? "border-amber-800 text-amber-800"
                  : "border-transparent"
              }`}
            >
              2. Phương Thức Thanh Toán
            </div>
            <div
              onClick={() => handleStepChange(3)}
              className={`cursor-pointer pb-4 px-4 border-b-2 ${
                step >= 3
                  ? "border-amber-800 text-amber-800"
                  : "border-transparent"
              }`}
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
                    <label
                      htmlFor="customer_email"
                      className="block text-sm font-medium mb-1"
                    >
                      Email
                    </label>
                    <input
                      id="customer_email"
                      type="email"
                      {...register("customer_email", {
                        required: "Email không được để trống",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Email không hợp lệ",
                        },
                      })}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                    />
                    {errors.customer_email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.customer_email.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="customer_phone"
                      className="block text-sm font-medium mb-1"
                    >
                      Số Điện Thoại
                    </label>
                    <input
                      id="customer_phone"
                      type="tel"
                      {...register("customer_phone", {
                        required: "Số điện thoại không được để trống",
                        pattern: {
                          value: /^[0-9]{10,11}$/,
                          message: "Số điện thoại phải có 10-11 chữ số",
                        },
                      })}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                    />
                    {errors.customer_phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.customer_phone.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-medium">Địa Chỉ Giao Hàng</h2>

                {/* Address Selection Options */}
                {user && addresses.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-stone-700">
                      Chọn địa chỉ có sẵn:
                    </h3>
                    <div className="space-y-2">
                      {addresses.map((address) => (
                        <div
                          key={address.id}
                          onClick={() => handleAddressSelect(address)}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedAddress?.id === address.id
                              ? "border-amber-800 bg-amber-50"
                              : "border-stone-200 hover:border-stone-300"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <MapPin className="h-4 w-4 text-stone-500" />
                                <span className="font-medium">
                                  {address.recipient_name}
                                </span>
                                {address.is_default && (
                                  <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                                    Mặc định
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-stone-600">
                                {address.formatted_address}
                              </p>
                              <p className="text-sm text-stone-500">
                                {address.phone_number}
                              </p>
                            </div>
                            <input
                              type="radio"
                              name="address_selection"
                              checked={selectedAddress?.id === address.id}
                              onChange={() => handleAddressSelect(address)}
                              className="text-amber-800 focus:ring-amber-800"
                            />
                          </div>
                        </div>
                      ))}

                      {/* New Address Option */}
                      <div
                        onClick={handleNewAddress}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          useNewAddress
                            ? "border-amber-800 bg-amber-50"
                            : "border-stone-200 hover:border-stone-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Plus className="h-4 w-4 text-stone-500" />
                            <span className="font-medium">
                              Thêm địa chỉ mới
                            </span>
                          </div>
                          <input
                            type="radio"
                            name="address_selection"
                            checked={useNewAddress}
                            onChange={handleNewAddress}
                            className="text-amber-800 focus:ring-amber-800"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Address Form - Show when new address is selected or no saved addresses */}
                {(useNewAddress || !user || addresses.length === 0) && (
                  <div className="space-y-4 p-4 border rounded-lg bg-stone-50">
                    <h3 className="text-sm font-medium text-stone-700">
                      {addresses.length === 0
                        ? "Thông tin giao hàng:"
                        : "Địa chỉ mới:"}
                    </h3>

                    <div className="gap-4">
                      <div>
                        <label
                          htmlFor="customer_name"
                          className="block text-sm font-medium mb-1"
                        >
                          Họ Và Tên
                        </label>
                        <input
                          id="customer_name"
                          {...register("customer_name", {
                            required: "Họ và tên không được để trống",
                          })}
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                        />
                        {errors.customer_name && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.customer_name.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="delivery_address"
                        className="block text-sm font-medium mb-1"
                      >
                        Địa Chỉ
                      </label>
                      <input
                        id="delivery_address"
                        {...register("delivery_address", {
                          required: "Địa chỉ không được để trống",
                        })}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                      />
                      {errors.delivery_address && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.delivery_address.message}
                        </p>
                      )}
                    </div>
                    <LocationSelector
                      onProvinceChange={(province) => {
                        setSelectedProvince(province);
                        setValue("city", province?.name || "");
                      }}
                      onDistrictChange={(district) => {
                        setSelectedDistrict(district);
                        setValue("district", district?.name || "");
                      }}
                      onWardChange={(ward) => {
                        setSelectedWard(ward);
                        setValue("ward", ward?.name || "");
                      }}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    />
                  </div>
                )}
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
                        {...register("shippingMethod", {
                          required: "Vui lòng chọn phương thức vận chuyển",
                        })}
                        defaultChecked
                        className="text-amber-800 focus:ring-amber-800"
                      />
                      <label htmlFor="standard" className="font-medium">
                        Giao Hàng Tiết Kiệm (3-5 Ngày)
                      </label>
                    </div>
                    <div className="font-medium">
                      {shippingFee === 0
                        ? "Miễn phí"
                        : `${shippingFee.toLocaleString("vi-VN")}₫`}
                    </div>
                  </div>
                  {/* Option for express shipping can be added here */}
                </div>
                {errors.shippingMethod && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.shippingMethod.message}
                  </p>
                )}
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  className="bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-md font-medium"
                  onClick={() => validateAndProceedToStep(2)}
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
                        {...register("payment_method", {
                          required: "Vui lòng chọn phương thức thanh toán",
                        })}
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
                        id="bank-transfer"
                        value="bank_transfer"
                        {...register("payment_method", {
                          required: "Vui lòng chọn phương thức thanh toán",
                        })}
                        className="text-amber-800 focus:ring-amber-800"
                      />
                      <label htmlFor="bank-transfer" className="font-medium">
                        Chuyển Khoản Ngân Hàng
                      </label>
                    </div>
                    <div className="mt-2 text-sm text-stone-600">
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                        Nhận QR Code VietQR sau khi đặt hàng
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                        Thông tin tài khoản Techcombank
                      </div>
                    </div>
                  </div>

                  <div className="border p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="cod"
                        value="cod"
                        {...register("payment_method", {
                          required: "Vui lòng chọn phương thức thanh toán",
                        })}
                        defaultChecked
                        className="text-amber-800 focus:ring-amber-800"
                      />
                      <label htmlFor="cod" className="font-medium">
                        Thanh Toán Khi Nhận Hàng (COD)
                      </label>
                    </div>
                  </div>
                </div>
                {errors.payment_method && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.payment_method.message}
                  </p>
                )}
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
                  onClick={() => validateAndProceedToStep(3)}
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
                      <div
                        key={item.id}
                        className="p-4 flex items-center gap-4"
                      >
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
                          <div className="text-sm text-stone-500">
                            Số lượng: {item.quantity}
                          </div>
                        </div>
                        <div className="font-medium">
                          {item.total_price.toLocaleString("vi-VN")}₫
                        </div>
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
                <button
                  type="submit"
                  className="bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-md font-medium flex items-center"
                >
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
                    <span className="font-medium">
                      {item.total_price.toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-3">
              <div className="flex justify-between">
                <span className="text-stone-600">Tổng Tiền Sản Phẩm</span>
                <span className="font-medium">
                  {subtotal.toLocaleString("vi-VN")}₫
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Phí Vận Chuyển</span>
                <span className="font-medium">
                  {shippingFee === 0
                    ? "Miễn phí"
                    : `${shippingFee.toLocaleString("vi-VN")}₫`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Thuế (8%)</span>
                <span className="font-medium">
                  {tax.toLocaleString("vi-VN")}₫
                </span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-medium text-lg">
                  <span>Tổng Tiền</span>
                  <span>{total.toLocaleString("vi-VN")}₫</span>
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

      {/* Hiển thị thông tin thanh toán ngân hàng */}
      {showPaymentInfo && orderResult?.payment_info && (
        <div className="mt-8">
          <BankTransferInfo
            paymentInfo={orderResult.payment_info}
            orderNumber={orderResult.order.order_number}
          />
          <div className="text-center mt-6">
            <button
              onClick={() => {
                clearCart();
                navigate("/");
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium"
            >
              Hoàn Tất Đặt Hàng
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
