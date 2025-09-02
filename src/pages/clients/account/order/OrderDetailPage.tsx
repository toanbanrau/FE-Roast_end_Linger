import { ArrowLeft, Truck, Package, CheckCircle, X } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import AccountNav from "../../../../components/AccountNav";
import {
  getMyOrderById,
  confirmDelivery,
} from "../../../../services/checkoutService";
import { getOrderReviewableProducts } from "../../../../services/reviewService";
import type { IOrder } from "../../../../interfaces/order";
import type { IReviewableProduct } from "../../../../interfaces/review";
import CancelOrderModal from "../../../../components/order/CancelOrderModal";
import CreateReviewModal from "../../../../components/CreateReviewModal";
import ConfirmModal from "../../../../components/ConfirmModal"; // Import the general confirm modal
import { canCancelOrder } from "../../../../utils/orderStatus";
import { getStatusText } from "../../../../utils/orderStatusUtils";
import { toast } from "react-toastify";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<
    number | undefined
  >();
  const [isConfirmDeliveryModalOpen, setIsConfirmDeliveryModalOpen] =
    useState(false);

  // Mutation to confirm delivery
  const confirmDeliveryMutation = useMutation({
    mutationFn: confirmDelivery,
    onSuccess: () => {
      toast.success("Xác nhận đã nhận hàng thành công!");
      queryClient.invalidateQueries({ queryKey: ["order", id] });
    },
    onError: () => {
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
    },
  });

  const {
    data: order,
    isLoading,
    isError,
  } = useQuery<IOrder>({
    queryKey: ["order", id],
    queryFn: () => getMyOrderById(Number(id)),
    enabled: !!id,
  });

  const isOrderCompleted = ["delivered", "completed"].includes(
    order?.status.name?.toLowerCase() || ""
  );

  // Fetch reviewable products when order is completed using useQuery
  const { data: reviewableProducts = [], isLoading: isLoadingReviewable } =
    useQuery({
      queryKey: ["order-reviewable-products", order?.id],
      queryFn: () => getOrderReviewableProducts(order!.id),
      enabled: isOrderCompleted && !!order,
      select: (response) => {
        const orderData = response?.data || response || {};
        return (
          orderData.items?.map((item: any) => ({
            ...item,
            order_id: orderData.order_id,
            order_number: orderData.order_number,
            purchased_at: orderData.purchased_at,
            days_since_purchase: orderData.days_since_purchase,
          })) || []
        );
      },
    });

  // Check if a product can be reviewed or has been reviewed
  const getProductReviewStatus = (productId: number) => {
    // Find all items for this product (could be multiple from different orders)
    const productItems = reviewableProducts.filter(
      (item: IReviewableProduct) => item.product.id === productId
    );

    // Filter items that can be reviewed (can_review = true)
    const reviewableItems = productItems.filter(
      (item: IReviewableProduct) => item.can_review === true
    );

    // Filter items that have been reviewed (has_reviewed = true)
    const reviewedItems = productItems.filter(
      (item: IReviewableProduct) => item.has_reviewed === true
    );

    console.log(`🔍 getProductReviewStatus for productId ${productId}:`, {
      reviewableProductsLength: reviewableProducts.length,
      productItemsFound: productItems.length,
      reviewableItemsFound: reviewableItems.length,
      reviewedItemsFound: reviewedItems.length,
      productItems: productItems.map((item) => ({
        orderItemId: item.order_item_id,
        orderNumber: item.order_number,
        canReview: item.can_review,
        hasReviewed: item.has_reviewed,
      })),
    });

    // If no items found for this product
    if (productItems.length === 0) {
      return { canReview: false, hasReviewed: false, status: "not_eligible" };
    }

    // If has reviewable items (can_review = true)
    if (reviewableItems.length > 0) {
      return {
        canReview: true,
        hasReviewed: reviewedItems.length > 0,
        status: "can_review",
        review: reviewedItems[0]?.review,
        items: productItems,
      };
    }

    // If has reviewed items but no reviewable items
    if (reviewedItems.length > 0) {
      return {
        canReview: false,
        hasReviewed: true,
        status: "already_reviewed",
        review: reviewedItems[0]?.review,
        items: productItems,
      };
    }

    // Product exists but neither can review nor has reviewed
    return {
      canReview: false,
      hasReviewed: false,
      status: "not_eligible",
      items: productItems,
    };
  };

  const handleCreateReview = (productId: number) => {
    setSelectedProductId(productId);
    setShowReviewModal(true);
  };

  // Format date function
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Format time function
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="container px-4 py-12 md:px-6 md:py-16">
        <div className="text-center">Đang tải thông tin đơn hàng...</div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="container px-4 py-12 md:px-6 md:py-16">
        <div className="text-center">Không thể tải thông tin đơn hàng.</div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <div className="flex items-center gap-2 mb-8">
        <Link
          to="/account/orders"
          className="text-amber-800 hover:text-amber-900"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-3xl font-serif font-bold tracking-tight">
          Đơn hàng {order.order_number}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <AccountNav active="orders" />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Order Status */}
          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-medium">Trạng thái đơn hàng</h2>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${order.status.color}30`,
                        color: order.status.color,
                      }}
                    >
                      {getStatusText(order.status.name)}
                    </span>
                  </div>
                  <p className="text-sm text-stone-500">
                    Đặt ngày {formatDate(order.dates.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {canCancelOrder(order.status) && (
                    <button
                      onClick={() => setIsCancelModalOpen(true)}
                      className="inline-flex items-center gap-1 bg-red-500 p-2 rounded-2xl text-red-600 hover:text-red-700 font-medium text-sm cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                      Hủy đơn hàng
                    </button>
                  )}
                  {order.status.name.toLowerCase() === "delivered" &&
                    order.is_paid && (
                      <button
                        onClick={() => setIsConfirmDeliveryModalOpen(true)}
                        className="inline-flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md font-medium text-sm transition-colors"
                        disabled={confirmDeliveryMutation.isPending}
                      >
                        <CheckCircle className="h-4 w-4" />
                        Đã nhận được hàng
                      </button>
                    )}
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="relative">
                {/* Timeline based on order histories */}
                {order.histories.map((history, index) => (
                  <div key={history.id} className="flex mb-8 last:mb-0">
                    <div className="flex flex-col items-center mr-4">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-100 text-green-600">
                        {history.new_status.name.toLowerCase() === "pending" ? (
                          <Package className="h-4 w-4" />
                        ) : history.new_status.name.toLowerCase() ===
                          "processing" ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"></path>
                            <path d="M6 12h12"></path>
                          </svg>
                        ) : history.new_status.name.toLowerCase() ===
                          "shipped" ? (
                          <Truck className="h-4 w-4" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                      </div>
                      {index < order.histories.length - 1 && (
                        <div className="w-0.5 h-full bg-green-200"></div>
                      )}
                    </div>
                    <div className="pt-1">
                      <h3 className="font-medium">
                        {getStatusText(history.new_status.name)}
                      </h3>
                      <p className="text-sm text-stone-500">
                        {formatDate(history.created_at)} lúc{" "}
                        {formatTime(history.created_at)}
                      </p>
                      {history.notes && (
                        <p className="text-sm text-stone-400 mt-1">
                          {history.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {order.status.name.toLowerCase() === "delivered" && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Truck className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-blue-800">
                        Đơn hàng của bạn đang được giao
                      </h3>
                      <p className="text-sm text-blue-700 mb-2">
                        Dự kiến giao:{" "}
                        {order.dates.delivery_date
                          ? formatDate(order.dates.delivery_date)
                          : "Chưa có thông tin"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {order.status.name.toLowerCase() === "delivered" && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-green-800">
                        Đơn hàng đã được giao thành công
                      </h3>
                      <p className="text-sm text-green-700">
                        Giao ngày{" "}
                        {order.dates.completed_date
                          ? formatDate(order.dates.completed_date)
                          : "Chưa có thông tin"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-medium">Sản phẩm đã đặt</h2>
            </div>
            <div className="divide-y">
              {order.items.map((item) => (
                <div key={item.id} className="p-6 flex items-center">
                  <div className="relative w-16 h-16 flex-shrink-0 bg-stone-50 rounded">
                    <img
                      src={item.variant?.image || item.product.image || "/placeholder.svg"}
                      alt={item.product.name}
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="ml-4 flex-grow">
                    <Link
                      to={`/products/${item.product.slug}`}
                      className="font-medium hover:text-amber-800"
                    >
                      {item.full_product_info}
                    </Link>
                    {item.variant && (
                      <div className="text-sm text-stone-500 mt-1">
                        SKU: {item.variant.sku}
                      </div>
                    )}
                    <div className="text-sm text-stone-500">
                      Số lượng: {item.quantity} × {item.formatted_unit_price}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {item.formatted_total_price}
                    </div>
                    {/* Show review status and button if order is completed */}
                    {isOrderCompleted &&
                      !isLoadingReviewable &&
                      (() => {
                        const reviewStatus = getProductReviewStatus(
                          item.product.id
                        );

                        // Ưu tiên canReview trước hasReviewed
                        if (reviewStatus.canReview) {
                          return (
                            <button
                              onClick={() =>
                                handleCreateReview(item.product.id)
                              }
                              className="mt-2 inline-flex items-center gap-1 bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-md font-medium text-sm transition-colors"
                            >
                              ⭐ Viết đánh giá
                            </button>
                          );
                        } else if (reviewStatus.hasReviewed) {
                          return (
                            <button
                              disabled
                              className="mt-2 inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1.5 rounded-md font-medium text-sm cursor-not-allowed"
                            >
                              ✓ Bạn đã đánh giá rồi
                            </button>
                          );
                        } else {
                          return (
                            <button
                              disabled
                              className="mt-2 inline-flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-1.5 rounded-md font-medium text-sm cursor-not-allowed"
                            >
                              ⚪ Không thể đánh giá
                            </button>
                          );
                        }
                      })()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shipping Information */}
            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-medium">Thông tin giao hàng</h2>
              </div>
              <div className="p-6">
                <div className="space-y-1 mb-4">
                  <p className="font-medium">{order.customer_info.name}</p>
                  <p>{order.delivery_info.full_address}</p>
                  <p>Điện thoại: {order.customer_info.phone}</p>
                  <p>Email: {order.customer_info.email}</p>
                </div>
                <div className="mt-4">
                  <h3 className="font-medium mb-1">Phương thức giao hàng</h3>
                  <p>Giao hàng tiêu chuẩn</p>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-medium">Thông tin thanh toán</h2>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="font-medium mb-1">Phương thức thanh toán</h3>
                  <p>
                    {order.payment_method === "cod"
                      ? "Thanh toán khi nhận hàng"
                      : order.payment_method}
                  </p>
                </div>
                <div className="mb-4">
                  <h3 className="font-medium mb-1">Trạng thái thanh toán</h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.payment_status || order.is_paid
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.payment_status_text ||
                      (order.is_paid ? "Đã thanh toán" : "Chưa thanh toán")}
                  </span>
                </div>
                <div className="space-y-2 border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-stone-600">Tạm tính</span>
                    <span>
                      {parseFloat(order.order_totals.subtotal).toLocaleString(
                        "vi-VN"
                      )}
                      đ
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">Phí giao hàng</span>
                    <span>
                      {parseFloat(order.order_totals.shipping_fee) === 0
                        ? "Miễn phí"
                        : `${parseFloat(
                            order.order_totals.shipping_fee
                          ).toLocaleString("vi-VN")}đ`}
                    </span>
                  </div>
                  {parseFloat(order.order_totals.discount_amount) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-stone-600">Giảm giá</span>
                      <span>
                        -
                        {parseFloat(
                          order.order_totals.discount_amount
                        ).toLocaleString("vi-VN")}
                        đ
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between font-medium text-lg pt-2 border-t">
                    <span>Tổng cộng</span>
                    <span>{order.order_totals.formatted_total}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Need Help */}
          <div className="bg-stone-50 p-6 rounded-lg">
            <h2 className="text-lg font-medium mb-4">
              Cần hỗ trợ với đơn hàng?
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/contact"
                className="bg-white border hover:bg-stone-50 px-4 py-2 rounded-md font-medium text-center"
              >
                Liên hệ hỗ trợ
              </Link>
              <Link
                to="/faq"
                className="bg-white border hover:bg-stone-50 px-4 py-2 rounded-md font-medium text-center"
              >
                Xem FAQ
              </Link>

              {/* Confirm Delivery Modal */}
              <ConfirmModal
                isOpen={isConfirmDeliveryModalOpen}
                onClose={() => setIsConfirmDeliveryModalOpen(false)}
                onConfirm={() => {
                  if (order) {
                    confirmDeliveryMutation.mutate(order.id);
                  }
                  setIsConfirmDeliveryModalOpen(false);
                }}
                title="Xác nhận đã nhận hàng"
                message="Bạn có chắc chắn đã nhận được đơn hàng này không? Hành động này sẽ hoàn tất đơn hàng."
                confirmText="Xác nhận"
                cancelText="Hủy"
                isLoading={confirmDeliveryMutation.isPending}
              />
              <Link
                to="/returns"
                className="bg-white border hover:bg-stone-50 px-4 py-2 rounded-md font-medium text-center"
              >
                Chính sách đổi trả
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      <CancelOrderModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        orderId={order.id}
        orderNumber={order.order_number}
        onSuccess={() => {
          // Modal will handle the success toast and query invalidation
        }}
      />

      {/* Create Review Modal */}
      <CreateReviewModal
        visible={showReviewModal}
        onCancel={() => setShowReviewModal(false)}
        productId={selectedProductId}
        orderId={order?.id}
      />
    </div>
  );
}
