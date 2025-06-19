import { useState } from "react"
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import { Link } from "react-router-dom"

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Ethiopian Yirgacheffe",
      price: 24.95,
      image: "/placeholder.svg?height=200&width=200",
      quantity: 2,
      grind: "Whole Bean",
      size: "12 oz",
    },
    {
      id: 3,
      name: "Sumatra Mandheling",
      price: 26.95,
      image: "/placeholder.svg?height=200&width=200",
      quantity: 1,
      grind: "Espresso",
      size: "12 oz",
    },
  ])

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return

    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 50 ? 0 : 5.95
  const tax = subtotal * 0.08 // 8% tax rate
  const total = subtotal + shipping + tax

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <h1 className="text-3xl font-serif font-bold tracking-tight mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-16">
          <div className="flex justify-center mb-6">
            <ShoppingBag className="h-16 w-16 text-stone-300" />
          </div>
          <h2 className="text-2xl font-medium mb-4">Your cart is empty</h2>
          <p className="text-stone-600 mb-8">Looks like you haven't added any coffee to your cart yet.</p>
          <Link
            to="/products"
            className="bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-md font-medium"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-stone-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium">Product</th>
                    <th className="text-center p-4 font-medium">Quantity</th>
                    <th className="text-right p-4 font-medium">Price</th>
                    <th className="p-4 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id} className="border-b last:border-b-0">
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 relative flex-shrink-0 bg-stone-50 rounded">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="object-contain p-2"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            <div className="text-sm text-stone-500 mt-1">
                              {item.size}, {item.grind}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center">
                          <div className="flex items-center border rounded-md">
                            <button
                              className="h-8 w-8 flex items-center justify-center text-gray-500 hover:text-gray-700"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <button
                              className="h-8 w-8 flex items-center justify-center text-gray-500 hover:text-gray-700"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right font-medium">${(item.price * item.quantity).toFixed(2)}</td>
                      <td className="p-4 text-right">
                        <button
                          className="h-8 w-8 flex items-center justify-center text-stone-400 hover:text-red-500"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex flex-wrap gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Coupon code"
                  className="max-w-xs px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                />
              </div>
              <button className="border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md font-medium">
                Apply Coupon
              </button>
              <button className="ml-auto border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md font-medium">
                Update Cart
              </button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6 bg-stone-50 space-y-6">
              <h2 className="text-xl font-medium">Order Summary</h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-stone-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Shipping</span>
                  <span className="font-medium">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="text-sm text-stone-600">
                {shipping === 0 ? (
                  <p className="flex items-center gap-1 text-emerald-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6L9 17l-5-5"></path>
                    </svg>
                    You've qualified for free shipping!
                  </p>
                ) : (
                  <p>Free shipping on orders over $50</p>
                )}
              </div>

              <Link
                to="/checkout"
                className="block w-full bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-md font-medium text-center"
              >
                Proceed to Checkout
              </Link>

              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium mb-3">We Accept</h3>
                <div className="flex gap-2">
                  {["Visa", "Mastercard", "Amex", "PayPal"].map((method) => (
                    <div key={method} className="bg-white border rounded px-2 py-1 text-xs">
                      {method}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 border rounded-lg p-6">
              <h3 className="text-sm font-medium mb-3">Need Help?</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/shipping" className="text-amber-800 hover:underline">
                    Shipping Information
                  </Link>
                </li>
                <li>
                  <Link to="/returns" className="text-amber-800 hover:underline">
                    Returns & Exchanges
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-amber-800 hover:underline">
                    Contact Customer Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
