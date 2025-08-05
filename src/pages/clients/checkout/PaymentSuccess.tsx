import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { CheckCircle, Package, Home, FileText } from "lucide-react";
import { useCartStore } from "../../../stores/useCartStore";
import type { IOrder } from "../../../interfaces/order";

export default function PaymentSuccess() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const navigate = useNavigate();
  const { clearCart } = useCartStore();
  const [orderInfo, setOrderInfo] = useState<IOrder | null>(null);

  useEffect(() => {
    // Clear cart khi vào trang thành công
    clearCart();

    // Lấy thông tin đơn hàng từ localStorage hoặc API
    const savedOrderInfo = localStorage.getItem(`order_${orderNumber}`);
    if (savedOrderInfo) {
      setOrderInfo(JSON.parse(savedOrderInfo));
      // Xóa thông tin đã lưu sau khi sử dụng
      localStorage.removeItem(`order_${orderNumber}`);
    }
  }, [orderNumber, clearCart]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Thanh toán thành công!
          </h1>
          <p className="text-gray-600">
            Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được xác nhận.
          </p>
        </div>

        {/* Order Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Package className="w-5 h-5 text-amber-600" />
            <h2 className="text-xl font-semibold">Thông tin đơn hàng</h2>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Mã đơn hàng:</span>
              <span className="font-medium">{orderNumber}</span>
            </div>

            {orderInfo && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tổng tiền:</span>
                  <span className="font-medium text-green-600">
                    {orderInfo.order_totals.formatted_total}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Phương thức thanh toán:</span>
                  <span className="font-medium">
                    {orderInfo.payment_method === "bank_transfer"
                      ? "Chuyển khoản ngân hàng"
                      : orderInfo.payment_method === "cod"
                      ? "Thanh toán khi nhận hàng"
                      : orderInfo.payment_method === "online"
                      ? "Thanh toán online"
                      : orderInfo.payment_method}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Người nhận:</span>
                  <span className="font-medium">
                    {orderInfo.customer_info.name}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">
                    {orderInfo.customer_info.email}
                  </span>
                </div>

                <div className="flex justify-between items-start">
                  <span className="text-gray-600">Địa chỉ giao hàng:</span>
                  <span className="font-medium text-right max-w-xs">
                    {orderInfo.delivery_info.full_address}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Thời gian đặt:</span>
                  <span className="font-medium">
                    {new Date(orderInfo.dates.created_at).toLocaleString(
                      "vi-VN"
                    )}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-blue-900 mb-3">Bước tiếp theo:</h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>Chúng tôi sẽ xử lý đơn hàng của bạn trong vòng 24 giờ</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>
                Bạn sẽ nhận được email xác nhận và thông tin vận chuyển
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>Đơn hàng sẽ được giao trong 3-5 ngày làm việc</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-amber-800 hover:bg-amber-900 text-white px-6 py-3 rounded-md font-medium transition-colors"
          >
            <Home className="w-4 h-4" />
            Về trang chủ
          </Link>

          <Link
            to="/account/orders"
            className="inline-flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-md font-medium transition-colors"
          >
            <FileText className="w-4 h-4" />
            Xem đơn hàng
          </Link>
        </div>

        {/* Support Info */}
        <div className="text-center mt-8 text-gray-600">
          <p>Cần hỗ trợ? Liên hệ với chúng tôi:</p>
          <p className="font-medium">
            Email: support@coffee.com | Hotline: 1900-xxxx
          </p>
        </div>
      </div>
    </div>
  );
}
