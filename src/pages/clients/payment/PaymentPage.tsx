import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BankTransferInfo from "../../../components/BankTransferInfo";
import { getOrderDetail } from "../../../services/checkoutService";
import { toast } from "react-toastify";

export default function PaymentPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchOrder() {
      try {
        setLoading(true);
        const result = await getOrderDetail(orderNumber!);
        setOrder(result.data.order);
      } catch (error) {
        toast.error("Không tìm thấy đơn hàng hoặc lỗi hệ thống!");
        navigate("/");
      } finally {
        setLoading(false);
      }
    }
    if (orderNumber) fetchOrder();
  }, [orderNumber, navigate]);

  if (loading)
    return (
      <div className="p-8 text-center">Đang tải thông tin đơn hàng...</div>
    );
  if (!order) return null;

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <h1 className="text-3xl font-serif font-bold tracking-tight mb-8 text-center">
        Thanh Toán Đơn Hàng
      </h1>
      <BankTransferInfo
        paymentInfo={order.payment_info}
        orderNumber={order.order_number}
        orderData={order}
      />
      <div className="text-center mt-6">
        <button
          onClick={() => navigate("/")}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium"
        >
          Về Trang Chủ
        </button>
      </div>
    </div>
  );
}
