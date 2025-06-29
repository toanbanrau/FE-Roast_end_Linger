
import { ArrowLeft, Download, Truck, Package, CheckCircle } from "lucide-react"
import { Link } from "react-router-dom"
import AccountNav from "../../../../components/AccountNav"


export default function OrderDetailPage() {
  // In a real app, you would fetch this data based on the order ID

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <div className="flex items-center gap-2 mb-8">
        <Link to="/account/orders" className="text-amber-800 hover:text-amber-900">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-3xl font-serif font-bold tracking-tight">Order {order.id}</h1>
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
                    <h2 className="text-xl font-medium">Order Status</h2>
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
                <div>
                  <Link
                    to={`/account/orders/${order.id}/invoice`}
                    className="inline-flex items-center gap-1 text-amber-800 hover:text-amber-900 font-medium"
                  >
                    <Download className="h-4 w-4" /> Download Invoice
                  </Link>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="relative">
                {order.timeline.map((step, index) => (
                  <div key={index} className="flex mb-8 last:mb-0">
                    <div className="flex flex-col items-center mr-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step.completed ? "bg-green-100 text-green-600" : "bg-stone-100 text-stone-400"
                        }`}
                      >
                        {step.status === "Order Placed" ? (
                          <Package className="h-4 w-4" />
                        ) : step.status === "Processing" ? (
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
                        ) : step.status === "Shipped" ? (
                          <Truck className="h-4 w-4" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                      </div>
                      {index < order.timeline.length - 1 && (
                        <div className={`w-0.5 h-full ${step.completed ? "bg-green-200" : "bg-stone-200"}`}></div>
                      )}
                    </div>
                    <div className="pt-1">
                      <h3 className="font-medium">{step.status}</h3>
                      <p className="text-sm text-stone-500">
                        {step.date} at {step.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {order.status === "Shipped" && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Truck className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-blue-800">Your order is on the way</h3>
                      <p className="text-sm text-blue-700 mb-2">Estimated delivery: {order.estimatedDelivery}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-blue-700">
                          {order.carrier} Tracking: {order.trackingNumber}
                        </span>
                        <Link to="#" className="text-blue-800 hover:text-blue-900 text-sm font-medium underline">
                          Track
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {order.status === "Delivered" && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-green-800">Your order has been delivered</h3>
                      <p className="text-sm text-green-700">Delivered on {order.deliveredDate}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-medium">Order Items</h2>
            </div>
            <div className="divide-y">
              {order.items.map((item) => (
                <div key={item.id} className="p-6 flex items-center">
                  <div className="relative w-16 h-16 flex-shrink-0 bg-stone-50 rounded">
                    <img src={item.image || "/placeholder.svg"} alt={item.name}  className="object-contain p-2" />
                  </div>
                  <div className="ml-4 flex-grow">
                    <Link to={`/products/${item.id}`} className="font-medium hover:text-amber-800">
                      {item.name}
                    </Link>
                    <div className="text-sm text-stone-500 mt-1">
                      {item.size}, {item.grind}
                    </div>
                    <div className="text-sm text-stone-500">
                      Qty: {item.quantity} × {item.price}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{item.total}</div>
                    <Link
                      to={`/products/${item.id}/review`}
                      className="text-amber-800 hover:text-amber-900 text-sm font-medium mt-1 inline-block"
                    >
                      Write a Review
                    </Link>
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
                <h2 className="text-xl font-medium">Shipping Information</h2>
              </div>
              <div className="p-6">
                <div className="space-y-1 mb-4">
                  <p className="font-medium">{order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.street}</p>
                  {order.shippingAddress.apartment && <p>{order.shippingAddress.apartment}</p>}
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
                <div className="mt-4">
                  <h3 className="font-medium mb-1">Shipping Method</h3>
                  <p>Standard Shipping (Free)</p>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-medium">Payment Information</h2>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="font-medium mb-1">Payment Method</h3>
                  <p>{order.paymentMethod}</p>
                </div>
                <div className="space-y-2 border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-stone-600">Subtotal</span>
                    <span>{order.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">Shipping</span>
                    <span>{order.shipping === "$0.00" ? "Free" : order.shipping}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">Tax</span>
                    <span>{order.tax}</span>
                  </div>
                  <div className="flex justify-between font-medium text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>{order.total}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Need Help */}
          <div className="bg-stone-50 p-6 rounded-lg">
            <h2 className="text-lg font-medium mb-4">Need Help With Your Order?</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/contact"
                className="bg-white border hover:bg-stone-50 px-4 py-2 rounded-md font-medium text-center"
              >
                Contact Support
              </Link>
              <Link
                to="/faq"
                className="bg-white border hover:bg-stone-50 px-4 py-2 rounded-md font-medium text-center"
              >
                View FAQs
              </Link>
              <Link
                to="/returns"
                className="bg-white border hover:bg-stone-50 px-4 py-2 rounded-md font-medium text-center"
              >
                Return Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
