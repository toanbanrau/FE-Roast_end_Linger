import type React from "react"
import { useState } from "react"

import { Mail, MapPin, Phone } from "lucide-react"
import { Link } from "react-router-dom"

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)
  }

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <h1 className="text-3xl font-serif font-bold tracking-tight mb-8">Liên Hệ Với Chúng Tôi</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {formSubmitted ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <h2 className="text-xl font-medium text-green-800 mb-2">Cảm Ơn!</h2>
              <p className="text-green-700 mb-4">
                Tin nhắn của bạn đã được gửi thành công. Chúng tôi sẽ phản hồi sớm nhất có thể.
              </p>
              <button
                className="border border-green-300 text-green-700 hover:bg-green-100 px-4 py-2 rounded-md font-medium mt-2"
                onClick={() => setFormSubmitted(false)}
              >
                Gửi Tin Nhắn Khác
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="block text-sm font-medium">
                    Tên
                  </label>
                  <input
                    id="firstName"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="block text-sm font-medium">
                    Họ
                  </label>
                  <input
                    id="lastName"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-medium">
                    Số điện thoại (không bắt buộc)
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="block text-sm font-medium">
                  Chủ đề
                </label>
                <select
                  id="subject"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                  required
                >
                  <option value="" disabled selected>
                    Chọn chủ đề
                  </option>
                  <option value="general">Câu hỏi chung</option>
                  <option value="order">Vấn đề đơn hàng</option>
                  <option value="wholesale">Hợp tác phân phối</option>
                  <option value="feedback">Phản hồi sản phẩm</option>
                  <option value="other">Khác</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-medium">
                  Tin nhắn
                </label>
                <textarea
                  id="message"
                  rows={6}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                  required
                />
              </div>

              <button
                type="submit"
                className="bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-md font-medium"
              >
                Gửi Tin Nhắn
              </button>
            </form>
          )}
        </div>

        {/* Thông tin liên hệ */}
        <div className="space-y-8">
          <div className="bg-stone-50 p-6 rounded-lg">
            <h2 className="text-xl font-medium mb-4">Thông Tin Liên Hệ</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-amber-800 mt-1" />
                <div>
                  <p className="font-medium">Trụ Sở Chính Élite Coffee</p>
                  <p className="text-stone-600">123 Coffee Lane</p>
                  <p className="text-stone-600">Seattle, WA 98101</p>
                  <p className="text-stone-600">Hoa Kỳ</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-amber-800" />
                <div>
                  <p className="font-medium">Số điện thoại</p>
                  <p className="text-stone-600">(555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-amber-800" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-stone-600">info@elitecoffee.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Giờ làm việc */}
          <div className="bg-stone-50 p-6 rounded-lg">
            <h2 className="text-xl font-medium mb-4">Giờ Làm Việc</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Thứ Hai - Thứ Sáu</span>
                <span>9:00 - 18:00</span>
              </div>
              <div className="flex justify-between">
                <span>Thứ Bảy</span>
                <span>10:00 - 16:00</span>
              </div>
              <div className="flex justify-between">
                <span>Chủ Nhật</span>
                <span>Nghỉ</span>
              </div>
            </div>
          </div>

          {/* Liên hệ hợp tác */}
          <div className="bg-stone-50 p-6 rounded-lg">
            <h2 className="text-xl font-medium mb-4">Liên Hệ Phân Phối</h2>
            <p className="text-stone-600 mb-4">
              Bạn muốn phục vụ Élite Coffee tại quán hoặc nhà hàng? Chúng tôi có giá ưu đãi và hỗ trợ riêng cho đối tác phân phối.
            </p>
            <Link
              to="/wholesale"
              className="block text-center border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md font-medium w-full"
            >
              Tìm Hiểu Thêm
            </Link>
          </div>
        </div>
      </div>

      {/* Cửa hàng chính */}
      <div className="mt-12">
        <h2 className="text-2xl font-serif font-bold tracking-tight mb-6">Thăm Cửa Hàng Chính Của Chúng Tôi</h2>
        <div className="aspect-video bg-stone-200 rounded-lg">
          <div className="h-full w-full flex items-center justify-center">
            <p className="text-stone-600">Bản đồ sẽ hiển thị ở đây</p>
          </div>
        </div>
      </div>

      {/* Các chi nhánh */}
      <div className="mt-12">
        <h2 className="text-2xl font-serif font-bold tracking-tight mb-6">Các Chi Nhánh</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              name: "Trung tâm Seattle",
              address: "123 Coffee Lane, Seattle, WA 98101",
              phone: "(555) 123-4567",
              hours: "T2-T6: 7:00-19:00, T7-CN: 8:00-18:00",
              image: "/placeholder.svg?height=200&width=300",
            },
            {
              name: "Capitol Hill",
              address: "456 Roast Avenue, Seattle, WA 98102",
              phone: "(555) 234-5678",
              hours: "T2-T6: 7:00-19:00, T7-CN: 8:00-18:00",
              image: "/placeholder.svg?height=200&width=300",
            },
            {
              name: "Bellevue",
              address: "789 Bean Boulevard, Bellevue, WA 98004",
              phone: "(555) 345-6789",
              hours: "T2-T6: 7:00-19:00, T7-CN: 8:00-18:00",
              image: "/placeholder.svg?height=200&width=300",
            },
          ].map((location, index) => (
            <div key={index} className="border rounded-lg overflow-hidden">
              <div className="relative h-48">
                <img
                  src={location.image}
                  alt={location.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium mb-2">{location.name}</h3>
                <p className="text-stone-600 text-sm mb-1">{location.address}</p>
                <p className="text-stone-600 text-sm mb-1">{location.phone}</p>
                <p className="text-stone-600 text-sm">{location.hours}</p>
                <Link
                  to={`/locations/${location.name.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-amber-800 hover:text-amber-900 text-sm font-medium mt-3 inline-block"
                >
                  Xem Chi Tiết
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Câu hỏi thường gặp */}
      <div className="mt-12 bg-stone-50 p-8 rounded-lg">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-serif font-bold tracking-tight mb-4">Câu Hỏi Thường Gặp</h2>
          <p className="text-stone-600 mb-8">
            Tìm câu trả lời nhanh cho các thắc mắc phổ biến. Nếu không tìm thấy, hãy liên hệ với chúng tôi.
          </p>
          <div className="space-y-4 text-left">
            {[
              {
                question: "Phí vận chuyển như thế nào?",
                answer:
                  "Miễn phí vận chuyển với đơn hàng trên $50 trong nội địa Hoa Kỳ. Dưới $50 sẽ tính phí cố định $5.95.",
              },
              {
                question: "Cà phê có tươi mới không?",
                answer:
                  "Tất cả cà phê được rang theo đơn và gửi đi trong vòng 24-48 giờ để đảm bảo độ tươi tối đa.",
              },
              {
                question: "Có vận chuyển quốc tế không?",
                answer:
                  "Có, chúng tôi vận chuyển đến một số quốc gia nhất định. Vui lòng liên hệ để biết thêm chi tiết.",
              },
              {
                question: "Chính sách đổi trả thế nào?",
                answer:
                  "Nếu bạn không hài lòng với sản phẩm, hãy liên hệ trong vòng 14 ngày để được hỗ trợ đổi/trả.",
              },
            ].map((faq, index) => (
              <div key={index} className="border-b pb-4 last:border-b-0">
                <h3 className="font-medium mb-2">{faq.question}</h3>
                <p className="text-stone-600 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
          <Link
            to="/faq"
            className="inline-flex items-center justify-center rounded-md bg-amber-800 px-4 py-2 text-sm font-medium text-white hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 mt-8"
          >
            Xem Tất Cả Câu Hỏi
          </Link>
        </div>
      </div>
    </div>
  )
}
