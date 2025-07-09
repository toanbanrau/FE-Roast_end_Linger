
import { Coffee, Facebook, Instagram, Twitter } from "lucide-react"
import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300">
      <div className="container px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-6">
              <Coffee className="h-6 w-6 text-amber-600" />
              <span className="text-xl font-serif font-bold tracking-tight text-white">Élite Coffee</span>
            </Link>
            <p className="text-sm">
              Tạo nên những trải nghiệm cà phê tuyệt vời từ năm 1992 — từ hạt đến tách, chúng tôi cam kết về chất lượng và sự bền vững
            </p>
            <div className="flex gap-4 mt-6">
              <Link to="#" className="text-stone-400 hover:text-amber-600">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link to="#" className="text-stone-400 hover:text-amber-600">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link to="#" className="text-stone-400 hover:text-amber-600">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-white mb-6">Cửa Hàng</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/products" className="text-sm hover:text-amber-600 transition-colors">
                  Sản Phẩm 
                </Link>
              </li>
              <li>
                <Link to="/products/single-origin" className="text-sm hover:text-amber-600 transition-colors">
                  Cà phê nguyên bản
                </Link>
              </li>
              <li>
                <Link to="/products/blends" className="text-sm hover:text-amber-600 transition-colors">
                  Dòng pha trộn đặc trưng
                </Link>
              </li>
              <li>
                <Link to="/products/equipment" className="text-sm hover:text-amber-600 transition-colors">
                  Dụng cụ pha cà phê
                </Link>
              </li>
              <li>
                <Link to="/products/gifts" className="text-sm hover:text-amber-600 transition-colors">
                  Bộ quà tặng
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-white mb-6">Công ty</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-sm hover:text-amber-600 transition-colors">
                  Hành trình của chúng tôi
                </Link>
              </li>
              <li>
                <Link to="/sustainability" className="text-sm hover:text-amber-600 transition-colors">
                  Phát triển bền vững
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm hover:text-amber-600 transition-colors">
                  Bài viết & Tin tức
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-sm hover:text-amber-600 transition-colors">
                  Trở thành một phần của chúng tôi
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm hover:text-amber-600 transition-colors">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-white mb-6">Dịch vụ khách hàng</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/shipping" className="text-sm hover:text-amber-600 transition-colors">
                  Vận chuyển & Đổi trả
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm hover:text-amber-600 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm hover:text-amber-600 transition-colors">
                  Điều khoản & Điều kiện
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm hover:text-amber-600 transition-colors">
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link to="/subscription" className="text-sm hover:text-amber-600 transition-colors">
                  Thông tin đăng ký
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-stone-500">&copy; {new Date().getFullYear()} Roast & Linger. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex gap-4">
            <Link to="/terms" className="text-xs text-stone-500 hover:text-amber-600">
              Terms
            </Link>
            <Link to="/privacy" className="text-xs text-stone-500 hover:text-amber-600">
              Privacy
            </Link>
            <Link to="/cookies" className="text-xs text-stone-500 hover:text-amber-600">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
