import { ChevronRight, Package, Search } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import AccountNav from "../../../../components/AccountNav"
import { getMyOrders } from "../../../../services/checkoutService"
import type { IOrder } from "../../../../interfaces/order"

export default function OrdersPage() {
  const {
    data: orders,
    isLoading,
    isError,
  } = useQuery<IOrder[]>({
    queryKey: ["myOrders"],
    queryFn: getMyOrders,
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <h1 className="text-3xl font-serif font-bold tracking-tight mb-8">Đơn hàng của bạn</h1>

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
                className="pl-10 pr-4 py-2 border rounded-md w-full sm:w-64 focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400" />
            </div>
            <div className="flex gap-4">
              <select className="border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800">
                <option value="all">Tất cả đơn</option>
                <option value="pending">Đang xử lý</option>
                <option value="shipped">Đã gửi hàng</option>
                <option value="delivered">Đã giao hàng</option>
                <option value="cancelled">Đã hủy</option>
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
              <p className="text-stone-600 mb-8">Bạn chưa từng đặt đơn hàng nào tại đây.</p>
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
                          <h3 className="font-medium">Đơn #{order.order_number}</h3>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full`}
                            style={{
                              backgroundColor: `${order.status.color}30`,
                              color: order.status.color,
                            }}
                          >
                            {order.status.name}
                          </span>
                        </div>
                        <p className="text-sm text-stone-500">Ngày đặt: {formatDate(order.dates.created_at)}</p>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                        <div className="text-right">
                          <p className="font-medium">{order.order_totals.formatted_total}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-stone-400" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Phân trang nếu cần */}
        </div>
      </div>
    </div>
  )
}
