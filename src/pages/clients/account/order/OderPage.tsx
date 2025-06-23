import { ChevronRight, Package, Search } from "lucide-react"
import AccountNav from "../../../../components/AccountNav"
import { Link } from "react-router-dom"

export default function OrdersPage() {
  // Mock orders data
  const orders = [
    {
      id: "ORD-12345",
      date: "May 15, 2025",
      status: "Delivered",
      total: "$76.85",
      items: [
        {
          id: 1,
          name: "Ethiopian Yirgacheffe",
          image: "/placeholder.svg?height=80&width=80",
          quantity: 2,
          price: "$24.95",
        },
        {
          id: 3,
          name: "Sumatra Mandheling",
          image: "/placeholder.svg?height=80&width=80",
          quantity: 1,
          price: "$26.95",
        },
      ],
    },
    {
      id: "ORD-12344",
      date: "April 28, 2025",
      status: "Delivered",
      total: "$48.90",
      items: [
        {
          id: 2,
          name: "Colombian Supremo",
          image: "/placeholder.svg?height=80&width=80",
          quantity: 1,
          price: "$22.95",
        },
        {
          id: 5,
          name: "Espresso Roast",
          image: "/placeholder.svg?height=80&width=80",
          quantity: 1,
          price: "$23.95",
        },
      ],
    },
    {
      id: "ORD-12343",
      date: "March 17, 2025",
      status: "Delivered",
      total: "$98.75",
      items: [
        {
          id: 4,
          name: "Morning Blend",
          image: "/placeholder.svg?height=80&width=80",
          quantity: 1,
          price: "$21.95",
        },
        {
          id: 7,
          name: "Guatemala Antigua",
          image: "/placeholder.svg?height=80&width=80",
          quantity: 2,
          price: "$25.95",
        },
        {
          id: 9,
          name: "Dark Roast Blend",
          image: "/placeholder.svg?height=80&width=80",
          quantity: 1,
          price: "$22.95",
        },
      ],
    },
    {
      id: "ORD-12342",
      date: "February 5, 2025",
      status: "Delivered",
      total: "$71.85",
      items: [
        {
          id: 8,
          name: "Kenya AA",
          image: "/placeholder.svg?height=80&width=80",
          quantity: 2,
          price: "$27.95",
        },
        {
          id: 6,
          name: "Decaf Colombian",
          image: "/placeholder.svg?height=80&width=80",
          quantity: 1,
          price: "$24.95",
        },
      ],
    },
  ]

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <h1 className="text-3xl font-serif font-bold tracking-tight mb-8">Đơn Hàng Của Bạn</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <AccountNav active="orders" />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative">
              <input
                type="search"
                placeholder="Search orders..."
                className="pl-10 pr-4 py-2 border rounded-md w-full sm:w-64 focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400" />
            </div>
            <div className="flex gap-4">
              <select className="border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800">
                <option value="all">All Orders</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select className="border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800">
                <option value="recent">Most Recent</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Amount</option>
                <option value="lowest">Lowest Amount</option>
              </select>
            </div>
          </div>

          {/* Orders List */}
          {orders.length === 0 ? (
            <div className="text-center py-16 bg-white border rounded-lg">
              <div className="flex justify-center mb-6">
                <Package className="h-16 w-16 text-stone-300" />
              </div>
              <h2 className="text-2xl font-medium mb-4">No orders yet</h2>
              <p className="text-stone-600 mb-8">You haven't placed any orders yet.</p>
              <Link
                to="/products"
                className="bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-md font-medium"
              >
                Start Shopping
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
                          <h3 className="font-medium">Order {order.id}</h3>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              order.status === "Delivered"
                                ? "bg-green-100 text-green-800"
                                : order.status === "Shipped"
                                  ? "bg-blue-100 text-blue-800"
                                  : order.status === "Processing"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-red-100 text-red-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-stone-500">Placed on {order.date}</p>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                        <div className="text-right">
                          <p className="font-medium">{order.total}</p>
                          <p className="text-sm text-stone-500">{order.items.length} items</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-stone-400" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-stone-50">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="relative w-16 h-16 flex-shrink-0 bg-white rounded border">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="object-contain p-2"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center mt-8">
            <nav className="flex items-center gap-1">
              <button className="h-10 w-10 flex items-center justify-center border rounded-md bg-amber-800 text-white">
                1
              </button>
              <button className="h-10 w-10 flex items-center justify-center border rounded-md hover:bg-amber-50">
                2
              </button>
              <button className="h-10 w-10 flex items-center justify-center border rounded-md hover:bg-amber-50">
                <span className="sr-only">Next</span>
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
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}
