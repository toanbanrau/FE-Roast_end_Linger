import type React from "react";
import { useState } from "react";
import { Edit2 } from "lucide-react";
import AccountNav from "../../../components/AccountNav";

export default function AccountPage() {
  const [isEditing, setIsEditing] = useState(false);

  // Mock user data
  const user = {
    name: "Alexander Thompson",
    email: "alex.thompson@example.com",
    phone: "+1 (555) 123-4567",
    image: "/placeholder.svg?height=200&width=200",
    addresses: [
      {
        id: 1,
        type: "Home",
        default: true,
        street: "123 Coffee Avenue",
        apartment: "Apt 4B",
        city: "Seattle",
        state: "WA",
        zip: "98101",
        country: "United States",
      },
      {
        id: 2,
        type: "Work",
        default: false,
        street: "456 Business Plaza",
        apartment: "Suite 300",
        city: "Seattle",
        state: "WA",
        zip: "98104",
        country: "United States",
      },
    ],
    paymentMethods: [
      {
        id: 1,
        type: "Visa",
        default: true,
        last4: "4242",
        expiry: "05/25",
      },
      {
        id: 2,
        type: "Mastercard",
        default: false,
        last4: "5678",
        expiry: "08/26",
      },
    ],
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would update the user profile here
    setIsEditing(false);
  };

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <h1 className="text-3xl font-serif font-bold tracking-tight mb-8">
        My Account
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <AccountNav active="profile" />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Profile Information */}
          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-medium">Profile Information</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-amber-800 hover:text-amber-900 flex items-center gap-1 text-sm font-medium"
              >
                <Edit2 className="h-4 w-4" />
                {isEditing ? "Cancel" : "Edit"}
              </button>
            </div>
            <div className="p-6">
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden">
                      <img
                        src={user.image || "/placeholder.svg"}
                        alt={user.name}
                        className="object-cover"
                      />
                    </div>
                    <button className="text-amber-800 hover:text-amber-900 text-sm font-medium">
                      Change Photo
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium mb-1"
                      >
                        Full Name
                      </label>
                      <input
                        id="name"
                        defaultValue={user.name}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium mb-1"
                      >
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        defaultValue={user.email}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium mb-1"
                      >
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        defaultValue={user.phone}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-md font-medium"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden">
                      <img
                        src={user.image || "/placeholder.svg"}
                        alt={user.name}
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-grow space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-stone-500">
                        Full Name
                      </h3>
                      <p>{user.name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-stone-500">
                        Email Address
                      </h3>
                      <p>{user.email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-stone-500">
                        Phone Number
                      </h3>
                      <p>{user.phone}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Addresses */}
          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-medium">Addresses</h2>
              <button className="text-amber-800 hover:text-amber-900 text-sm font-medium">
                Add New Address
              </button>
            </div>
            <div className="divide-y">
              {user.addresses.map((address) => (
                <div key={address.id} className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{address.type}</h3>
                      {address.default && (
                        <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="text-amber-800 hover:text-amber-900 text-sm font-medium">
                        Edit
                      </button>
                      {!address.default && (
                        <button className="text-stone-500 hover:text-stone-700 text-sm">
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="text-stone-600">
                    <p>{address.street}</p>
                    {address.apartment && <p>{address.apartment}</p>}
                    <p>
                      {address.city}, {address.state} {address.zip}
                    </p>
                    <p>{address.country}</p>
                  </div>
                  {!address.default && (
                    <button className="mt-3 text-amber-800 hover:text-amber-900 text-sm font-medium">
                      Set as Default
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-medium">Payment Methods</h2>
              <button className="text-amber-800 hover:text-amber-900 text-sm font-medium">
                Add Payment Method
              </button>
            </div>
            <div className="divide-y">
              {user.paymentMethods.map((method) => (
                <div key={method.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-6 bg-stone-100 rounded flex items-center justify-center">
                        {method.type === "Visa" ? (
                          <span className="text-blue-700 font-bold text-xs">
                            VISA
                          </span>
                        ) : method.type === "Mastercard" ? (
                          <span className="text-red-600 font-bold text-xs">
                            MC
                          </span>
                        ) : (
                          <span className="text-stone-700 font-bold text-xs">
                            {method.type}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">
                            {method.type} ending in {method.last4}
                          </p>
                          {method.default && (
                            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-stone-500">
                          Expires {method.expiry}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="text-amber-800 hover:text-amber-900 text-sm font-medium">
                        Edit
                      </button>
                      {!method.default && (
                        <button className="text-stone-500 hover:text-stone-700 text-sm">
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                  {!method.default && (
                    <button className="mt-3 text-amber-800 hover:text-amber-900 text-sm font-medium">
                      Set as Default
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Password */}
          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-medium">Password</h2>
              <button className="text-amber-800 hover:text-amber-900 text-sm font-medium">
                Change Password
              </button>
            </div>
            <div className="p-6">
              <p className="text-stone-600">
                Your password was last changed on May 10, 2025.
              </p>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-medium">Communication Preferences</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-stone-600">
                    Receive order updates and shipping notifications
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-800"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Marketing Emails</h3>
                  <p className="text-sm text-stone-600">
                    Receive promotions, discounts, and coffee tips
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-800"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">SMS Notifications</h3>
                  <p className="text-sm text-stone-600">
                    Receive text messages for order updates
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-800"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
