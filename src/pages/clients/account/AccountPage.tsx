import type React from "react"
import { useState } from "react"
import { Edit2 } from "lucide-react"
import AccountNav from "../../../components/AccountNav"
import { useUserStore } from "../../../stores/useUserStore"

export default function AccountPage() {
  const [isEditing, setIsEditing] = useState(false)
  const { user } = useUserStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsEditing(false)
  }

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <h1 className="text-3xl font-serif font-bold tracking-tight mb-8">
        Thông Tin Tài Khoản
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <AccountNav active="profile" />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Profile Info */}
          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-medium">Thông tin cá nhân</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-amber-800 hover:text-amber-900 flex items-center gap-1 text-sm font-medium"
              >
                <Edit2 className="h-4 w-4" />
                {isEditing ? "Hủy" : "Chỉnh sửa"}
              </button>
            </div>
            <div className="p-6">
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden">
                      <img
                        src={user?.avatar || "/placeholder.svg"}
                        alt={user?.name}
                        className="object-cover"
                      />
                    </div>
                    <button className="text-amber-800 hover:text-amber-900 text-sm font-medium">
                      Thay đổi ảnh
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1">
                        Họ và tên
                      </label>
                      <input
                        id="name"
                        defaultValue={user?.name}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">
                        Địa chỉ Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        defaultValue={user?.email}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-1">
                        Số điện thoại
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        defaultValue={user?.phone}
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
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-md font-medium"
                    >
                      Lưu thay đổi
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden">
                      <img
                        src={user?.image || "/placeholder.svg"}
                        alt={user?.name}
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-grow space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-stone-500">
                        Họ và tên
                      </h3>
                      <p>{user?.name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-stone-500">
                        Địa chỉ Email
                      </h3>
                      <p>{user?.email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-stone-500">
                        Số điện thoại
                      </h3>
                      <p>{user?.phone}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Address section - giữ nguyên để bạn tùy chỉnh thêm sau */}
          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-medium">Địa chỉ</h2>
              <button className="text-amber-800 hover:text-amber-900 text-sm font-medium">
                Thêm địa chỉ mới
              </button>
            </div>
          </div>

          {/* Password section */}
          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-medium">Mật khẩu</h2>
              <button className="text-amber-800 hover:text-amber-900 text-sm font-medium">
                Đổi mật khẩu
              </button>
            </div>
            <div className="p-6">
              <p className="text-stone-600">
                Mật khẩu của bạn được thay đổi lần cuối vào ngày 10/05/2025.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
