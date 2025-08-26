import { ChevronRight, Package, Search, ChevronLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useState } from "react";
import AccountNav from "../../../../components/AccountNav";
import {
  getMyOrders,
  type PaginatedOrdersResponse,
} from "../../../../services/checkoutService";
import { getStatusText } from "../../../../utils/orderStatusUtils";

export default function OrdersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const {
    data: ordersData,
    isLoading,
    isError,
  } = useQuery<PaginatedOrdersResponse>({
    queryKey: ["myOrders", currentPage, perPage, searchTerm, statusFilter],
    queryFn: () =>
      getMyOrders({
        page: currentPage,
        per_page: perPage,
        search: searchTerm || undefined,
        status: statusFilter,
      }),
  });

  const orders = ordersData?.orders || [];
  const pagination = ordersData?.pagination;

  // Reset về trang 1 khi search hoặc filter thay đổi
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <h1 className="text-3xl font-serif font-bold tracking-tight mb-8">
        Đơn hàng của bạn
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Điều hướng bên trái */}
        <div className="lg:col-span-1">
          <AccountNav active="orders" />
        </div>

        {/* Nội dung chính */}
        <div className="lg:col-span-3 space-y-8">
          {/* Tìm kiếm và lọc */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative">
              <input
                type="search"
                placeholder="Tìm đơn hàng..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-md w-full sm:w-64 focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400" />
            </div>
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
              >
                <option value="all">Tất cả đơn</option>
                <option value="Pending">Chờ xử lý</option>
                <option value="Confirmed">Đã xác nhận</option>
                <option value="Processing">Đang xử lý</option>
                <option value="Shipped">Đã giao vận</option>
                <option value="Delivered">Đã giao hàng</option>
                <option value="Completed">Hoàn thành</option>
                <option value="Cancelled">Đã hủy</option>
              </select>
            </div>
          </div>

          {/* Danh sách đơn hàng */}
          {isLoading ? (
            <p>Đang tải dữ liệu đơn hàng...</p>
          ) : isError ? (
            <p>Đã xảy ra lỗi khi tải đơn hàng. Vui lòng thử lại sau.</p>
          ) : !orders || orders.length === 0 ? (
            <div className="text-center py-16 bg-white border rounded-lg">
              <div className="flex justify-center mb-6">
                <Package className="h-16 w-16 text-stone-300" />
              </div>
              <h2 className="text-2xl font-medium mb-4">Chưa có đơn hàng</h2>
              <p className="text-stone-600 mb-8">
                Bạn chưa từng đặt đơn hàng nào tại đây.
              </p>
              <Link
                to="/products"
                className="bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-md font-medium"
              >
                Mua sắm ngay
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  to={`/account/orders/${order.id}`}
                  className="block bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6 border-b">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">
                            Đơn #{order.order_number}
                          </h3>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full`}
                            style={{
                              backgroundColor: `${order.status.color}30`,
                              color: order.status.color,
                            }}
                          >
                            {getStatusText(order.status.name)}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              order.payment_status || order.is_paid
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {order.payment_status_text ||
                              (order.is_paid
                                ? "Đã thanh toán"
                                : "Chưa thanh toán")}
                          </span>
                        </div>
                        <p className="text-sm text-stone-500">
                          Ngày đặt: {formatDate(order.dates.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                        <div className="text-right">
                          <p className="font-medium">
                            {order.order_totals.formatted_total}
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-stone-400" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Phân trang */}
          {pagination && pagination.last_page > 1 && (
            <div className="flex items-center justify-between bg-white border rounded-lg p-4">
              <div className="text-sm text-stone-600">
                Hiển thị {pagination.from}-{pagination.to} trong tổng số{" "}
                {pagination.total} đơn hàng
              </div>

              <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-2 text-sm border rounded-md hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Trước
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: Math.min(5, pagination.last_page) },
                    (_, i) => {
                      let pageNum;
                      if (pagination.last_page <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= pagination.last_page - 2) {
                        pageNum = pagination.last_page - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-2 text-sm border rounded-md ${
                            currentPage === pageNum
                              ? "bg-amber-800 text-white border-amber-800"
                              : "hover:bg-stone-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}
                </div>

                {/* Next Button */}
                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, pagination.last_page)
                    )
                  }
                  disabled={currentPage === pagination.last_page}
                  className="flex items-center gap-1 px-3 py-2 text-sm border rounded-md hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
