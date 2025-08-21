import { useEffect, useState, useMemo } from "react";
import { ChevronRight, Lock, Plus, MapPin } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../../../stores/useCartStore";
import { useUserStore } from "../../../stores/useUserStore";
import { useForm } from "react-hook-form";
import { checkout } from "../../../services/checkoutService";
import { toast } from "react-toastify";
import type {
  IOrderCreate,
  OrderItem,
  PaymentInfo,
} from "../../../interfaces/order";
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
import { getAvailablePromotions } from "../../../services/promotionService";
import type { IPromotion } from "../../../interfaces/promotion";
import { getShippingMethods } from "../../../services/shippingMethodService";
import type { IShippingMethod } from "../../../interfaces/shippingMethod";

interface IFormCheckout {
  customer_name: string;
  customer_email: string;
  delivery_address: string;
  customer_phone: string;
  shipping_method_id: number;
  payment_method: string;
  city?: string;
  district?: string;
  ward?: string;
  notes?: string;
  promotion_code?: string;
}

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [orderResult, setOrderResult] = useState<{
    order: IOrder;
    payment_info?: PaymentInfo;
  } | null>(null);
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);
  const [showPromotions, setShowPromotions] = useState(false);
  const [appliedPromotion, setAppliedPromotion] = useState<IPromotion | null>(
    null
  );
  const [promotionDiscount, setPromotionDiscount] = useState(0);
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(
    null
  );
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(
    null
  );
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null);
  const [currentShippingFee, setCurrentShippingFee] = useState(0);
  const [renderKey, setRenderKey] = useState(0);

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

  // Fetch available promotions
  const { data: promotionsResponse } = useQuery({
    queryKey: ["available-promotions"],
    queryFn: getAvailablePromotions,
  });

  // Fetch shipping methods
  const { data: shippingMethodsResponse } = useQuery({
    queryKey: ["shipping-methods"],
    queryFn: getShippingMethods,
  });

  const availablePromotions = promotionsResponse?.data || [];
  const shippingMethods = useMemo(
    () => shippingMethodsResponse?.data || [],
    [shippingMethodsResponse?.data]
  );

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    getValues,
    watch,
    formState: { errors },
  } = useForm<IFormCheckout>();

  // Set default shipping method when data loads
  useEffect(() => {
    if (shippingMethods.length > 0 && !watch("shipping_method_id")) {
      setValue("shipping_method_id", shippingMethods[0].id);
      setCurrentShippingFee(shippingMethods[0].cost);
    }
  }, [shippingMethods, setValue, watch, setCurrentShippingFee]);

  // Update shipping fee when method changes
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "shipping_method_id" && value.shipping_method_id) {
        const selectedMethod = shippingMethods.find(
          (method: IShippingMethod) => method.id === value.shipping_method_id
        );
        if (selectedMethod) {
          console.log("🚚 Updating shipping fee:", selectedMethod.cost);
          setCurrentShippingFee(selectedMethod.cost);
          setRenderKey((prev) => prev + 1); // Force re-render
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, shippingMethods]);

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
        "shipping_method_id",
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

  // Use shipping fee from state (updated by onChange)
  // Apply free shipping for orders >= 500,000 VND
  const shippingFee = subtotal >= 500000 ? 0 : currentShippingFee;

  // Get selected shipping method for display purposes
  const selectedShippingMethodId = watch("shipping_method_id");
  const selectedShippingMethod = shippingMethods.find(
    (method: IShippingMethod) => method.id === selectedShippingMethodId
  );

  // Debug logs
  console.log("🔍 Debug shipping:", {
    selectedShippingMethodId,
    selectedShippingMethod,
    shippingFee,
    subtotal,
    currentShippingFee,
  });

  // selectedShippingMethod is already defined above

  const total = (subtotal || 0) + (shippingFee || 0) - (promotionDiscount || 0);

  // Debug log
  console.log(
    "💰 Current shipping fee:",
    shippingFee,
    "Selected method ID:",
    selectedShippingMethodId
  );

  // Function để áp dụng promotion code
  const applyPromotionCode = () => {
    const promotionCode = watch("promotion_code");
    if (!promotionCode?.trim()) {
      toast.error("Vui lòng nhập mã khuyến mãi!");
      return;
    }

    // Kiểm tra nếu mã đã được áp dụng
    if (
      appliedPromotion &&
      appliedPromotion.promotion_code === promotionCode.trim()
    ) {
      toast.info("Mã khuyến mãi này đã được áp dụng!");
      return;
    }

    // Tìm promotion trong danh sách available
    const promotion = availablePromotions.find(
      (promo: IPromotion) => promo.promotion_code === promotionCode.trim()
    );

    if (!promotion) {
      toast.error("Mã khuyến mãi không tồn tại!");
      return;
    }

    if (!promotion.is_usable) {
      toast.error("Mã khuyến mãi không thể sử dụng!");
      return;
    }

    // Kiểm tra đơn hàng tối thiểu
    const minOrderValue = parseFloat(promotion.minimum_order_value);
    if (subtotal < minOrderValue) {
      toast.error(
        `Đơn hàng tối thiểu ${promotion.formatted_minimum_order} để sử dụng mã này!`
      );
      return;
    }

    // Tính toán discount
    let discount = 0;
    if (promotion.discount_type === "percentage") {
      discount = (subtotal * parseFloat(promotion.discount_value)) / 100;
      // Áp dụng giới hạn discount tối đa
      const maxDiscount = parseFloat(promotion.maximum_discount_amount);
      if (discount > maxDiscount) {
        discount = maxDiscount;
      }
    } else {
      discount = parseFloat(promotion.discount_value);
    }

    setAppliedPromotion(promotion);
    setPromotionDiscount(discount);
    toast.success(
      `Áp dụng mã ${
        promotion.promotion_code
      } thành công! Giảm ${discount.toLocaleString("vi-VN")}₫`
    );
  };

  // Function để xóa promotion code
  const removePromotionCode = () => {
    setAppliedPromotion(null);
    setPromotionDiscount(0);
    setValue("promotion_code", "");
    toast.info("Đã xóa mã khuyến mãi");
  };

  // Validate promotion khi subtotal thay đổi
  useEffect(() => {
    if (!appliedPromotion) return;

    const minOrderValue = parseFloat(appliedPromotion.minimum_order_value);

    // Nếu subtotal xuống dưới giá trị tối thiểu, tự động xóa mã
    if (subtotal < minOrderValue) {
      setAppliedPromotion(null);
      setPromotionDiscount(0);
      setValue("promotion_code", "");
      toast.warning(
        `Mã giảm giá đã bị hủy vì đơn hàng dưới ${appliedPromotion.formatted_minimum_order}!`
      );
      return;
    }

    // Tính lại discount khi subtotal thay đổi
    let newDiscount = 0;
    if (appliedPromotion.discount_type === "percentage") {
      newDiscount = (subtotal * parseFloat(appliedPromotion.discount_value)) / 100;
      // Áp dụng giới hạn discount tối đa
      const maxDiscount = parseFloat(appliedPromotion.maximum_discount_amount);
      if (newDiscount > maxDiscount) {
        newDiscount = maxDiscount;
      }
    } else {
      newDiscount = parseFloat(appliedPromotion.discount_value);
    }

    // Cập nhật discount mới
    setPromotionDiscount(newDiscount);
  }, [subtotal, appliedPromotion, setValue]);

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
          shipping_method_id: data.shipping_method_id,
          promotion_code: data.promotion_code,
          notes: data.notes,
          items: orderItems,
        };

        const result = await checkout(orderData);

        // Kiểm tra phương thức thanh toán
        if (data.payment_method === "bank_transfer") {
          // Thanh toán online: KHÔNG clear cart ngay, chờ thanh toán thành công
          setOrderResult(result);
          setShowPaymentInfo(true);
          toast.success(
            "Đặt hàng thành công! Vui lòng thanh toán theo thông tin bên dưới."
          );
        } else {
          // COD: Clear cart ngay vì không cần thanh toán thêm
          clearCart();
          toast.success("Đặt hàng thành công!");

          // Lấy order_number từ result
          const orderNumber = result.order.order_number;

          // Lưu thông tin đơn hàng vào localStorage
          localStorage.setItem(
            `order_${orderNumber}`,
            JSON.stringify(result.order)
          );

          // Chuyển đến trang PaymentSuccess
          navigate(`/payment-success/${orderNumber}`);
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
                  {shippingMethods.map((method, index) => (
                    <div
                      key={method.id}
                      className="flex items-center justify-between border p-4 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id={method.id.toString()}
                          value={method.id}
                          {...register("shipping_method_id", {
                            required: "Vui lòng chọn phương thức vận chuyển",
                            valueAsNumber: true,
                          })}
                          defaultChecked={index === 0} // Set first method as default
                          className="text-amber-800 focus:ring-amber-800"
                          onChange={(e) => {
                            console.log(
                              "📦 Shipping method changed:",
                              e.target.value
                            );
                            const methodId = Number(e.target.value);
                            const selectedMethod = shippingMethods.find(
                              (m) => m.id === methodId
                            );
                            if (selectedMethod) {
                              console.log(
                                "✅ Found method:",
                                selectedMethod.name,
                                "Cost:",
                                selectedMethod.cost
                              );
                              setCurrentShippingFee(
                                Number(selectedMethod.cost) || 0
                              );
                              setRenderKey((prev) => prev + 1);
                            } else {
                              console.log(
                                "❌ Method not found for ID:",
                                methodId
                              );
                            }
                          }}
                        />
                        <div>
                          <label
                            htmlFor={method.id.toString()}
                            className="font-medium block"
                          >
                            {method.name}
                          </label>
                          <p className="text-sm text-stone-600">
                            {method.description}
                          </p>
                          <p className="text-xs text-stone-500">
                            Thời gian: {method.estimated_time}
                          </p>
                        </div>
                      </div>
                      <div className="font-medium">
                        {(method.cost || 0) === 0 ? (
                          "Miễn phí"
                        ) : (subtotal || 0) >= 500000 ? (
                          <div className="text-right">
                            <span className="line-through text-stone-400 text-sm">
                              {(method.cost || 0).toLocaleString("vi-VN")}₫
                            </span>
                            <div className="text-green-600 font-bold">
                              Miễn phí
                            </div>
                          </div>
                        ) : (
                          `${(method.cost || 0).toLocaleString("vi-VN")}₫`
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Thông báo điều kiện miễn phí ship */}
                {subtotal < 500000 && (
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-800">
                      💡{" "}
                      <strong>
                        Mua thêm {(500000 - subtotal).toLocaleString("vi-VN")}₫
                      </strong>{" "}
                      để được miễn phí vận chuyển!
                    </p>
                  </div>
                )}

                {/* Thông báo đã đủ điều kiện miễn phí ship */}
                {subtotal >= 500000 && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      🎉 Chúc mừng! Đơn hàng của bạn được{" "}
                      <strong>miễn phí vận chuyển</strong>
                    </p>
                  </div>
                )}

                {errors.shipping_method_id && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.shipping_method_id.message}
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
                    <p>
                      <strong>Họ tên:</strong> {watch("customer_name")}
                    </p>
                    <p>
                      <strong>Email:</strong> {watch("customer_email")}
                    </p>
                    <p>
                      <strong>Điện thoại:</strong> {watch("customer_phone")}
                    </p>
                    <p>
                      <strong>Địa chỉ:</strong> {watch("delivery_address")}
                    </p>
                    <p>
                      <strong>Phường/Xã:</strong> {watch("ward")}
                    </p>
                    <p>
                      <strong>Quận/Huyện:</strong> {watch("district")}
                    </p>
                    <p>
                      <strong>Tỉnh/Thành phố:</strong> {watch("city")}
                    </p>
                    <div className="mt-3 pt-3 border-t">
                      <p>
                        <strong>Phương thức vận chuyển:</strong>
                      </p>
                      {selectedShippingMethod && (
                        <>
                          <p className="text-sm">
                            🚚 {selectedShippingMethod.name}
                          </p>
                          <p className="text-xs text-stone-500">
                            {selectedShippingMethod.description}
                          </p>
                          <p className="text-xs text-stone-500">
                            Thời gian: {selectedShippingMethod.estimated_time}
                          </p>
                        </>
                      )}
                      <p className="text-sm">
                        <strong>Phí vận chuyển:</strong>{" "}
                        {(shippingFee || 0) === 0
                          ? "Miễn phí"
                          : `${(shippingFee || 0).toLocaleString("vi-VN")}₫`}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Phương Thức Thanh Toán</h3>
                  <div className="text-stone-600">
                    <p>
                      {watch("payment_method") === "cod" &&
                        "💰 Thanh Toán Khi Nhận Hàng (COD)"}
                      {watch("payment_method") === "bank_transfer" &&
                        "🏦 Chuyển Khoản Ngân Hàng"}
                      {watch("payment_method") === "online" &&
                        "💳 Thanh Toán Online (VNPAY)"}
                    </p>
                    {watch("payment_method") === "bank_transfer" && (
                      <div className="mt-2 text-sm">
                        <p>• Nhận QR Code VietQR sau khi đặt hàng</p>
                        <p>• Thông tin tài khoản Techcombank</p>
                      </div>
                    )}
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
          <div
            key={`summary-${renderKey}`}
            className="border rounded-lg p-6 bg-stone-50 space-y-6 sticky top-6"
          >
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
                  {(shippingFee || 0) === 0
                    ? "Miễn phí"
                    : `${(shippingFee || 0).toLocaleString("vi-VN")}₫`}
                </span>
              </div>

              {/* Hiển thị discount nếu có */}
              {appliedPromotion && promotionDiscount > 0 && (
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">
                      Khuyến mãi ({appliedPromotion.promotion_code})
                    </span>
                    <button
                      type="button"
                      onClick={removePromotionCode}
                      className="text-red-500 hover:text-red-700 text-xs"
                      title="Xóa mã khuyến mãi"
                    >
                      ✕
                    </button>
                  </div>
                  <span className="font-medium text-green-600">
                    -{promotionDiscount.toLocaleString("vi-VN")}₫
                  </span>
                </div>
              )}

              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-medium text-lg">
                  <span>Tổng Tiền</span>
                  <span>{(total || 0).toLocaleString("vi-VN")}₫</span>
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
                  onClick={applyPromotionCode}
                  className="border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md font-medium text-sm"
                >
                  Áp dụng
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // Kiểm tra có mã khả dụng không
                    const usablePromotions = availablePromotions.filter(
                      (promo: IPromotion) => promo.is_usable
                    );

                    if (usablePromotions.length === 0) {
                      toast.info("Không có mã khuyến mãi khả dụng");
                      return;
                    }

                    setShowPromotions(!showPromotions);
                  }}
                  className="bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-md font-medium text-sm"
                >
                  Xem mã
                </button>
              </div>

              {/* Danh sách promotion codes */}
              {showPromotions && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-sm mb-3">
                    Mã khuyến mãi có thể sử dụng:
                  </h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {availablePromotions
                      .filter((promo: IPromotion) => promo.is_usable)
                      .map((promo: IPromotion) => (
                        <div
                          key={promo.id}
                          className="border border-gray-200 rounded-lg p-3 bg-white hover:border-amber-300 cursor-pointer transition-colors"
                          onClick={() => {
                            setValue("promotion_code", promo.promotion_code);
                            setShowPromotions(false);
                          }}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono text-sm font-bold text-amber-800 bg-amber-100 px-2 py-1 rounded">
                                  {promo.promotion_code}
                                </span>
                                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                                  {promo.formatted_discount_value}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700 mb-1">
                                {promo.promotion_name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {promo.description}
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                <span>
                                  Đơn tối thiểu: {promo.formatted_minimum_order}
                                </span>
                                <span>
                                  Còn lại: {promo.remaining_usage}/
                                  {promo.usage_limit}
                                </span>
                                {promo.days_remaining !== undefined &&
                                  promo.days_remaining < 7 && (
                                    <span className="text-red-500 font-medium">
                                      Còn {Math.ceil(promo.days_remaining)} ngày
                                    </span>
                                  )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                  {availablePromotions.filter(
                    (promo: IPromotion) => promo.is_usable
                  ).length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      Không có mã khuyến mãi khả dụng
                    </p>
                  )}
                </div>
              )}
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
            orderData={orderResult.order}
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
