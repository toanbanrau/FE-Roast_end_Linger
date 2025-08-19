
import { Coffee, Facebook, Instagram, Twitter } from "lucide-react"
import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300">
      <div className="container px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-6">
              <img
                src="/z6887861436131_47d6a9f9e86b1d04f1a94932d5b53cad-removebg-preview.png"
                alt="Roast & Linger Logo"
                className="h-8 w-8 object-contain"
              />
              <span className="text-xl font-serif font-bold tracking-tight text-white">Roast & Linger</span>
            </Link>
            <p className="text-sm leading-relaxed">
              Tạo nên những trải nghiệm cà phê tuyệt vời từ năm 1992. Từ hạt cà phê đến tách cà phê, chúng tôi cam kết mang đến chất lượng cao nhất và tính bền vững cho cộng đồng.
            </p>
            <div className="flex gap-4 mt-6">
              <Link to="#" className="text-stone-400 hover:text-amber-600">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Theo dõi trên Facebook</span>
              </Link>
              <Link to="#" className="text-stone-400 hover:text-amber-600">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Theo dõi trên Instagram</span>
              </Link>
              <Link to="#" className="text-stone-400 hover:text-amber-600">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Theo dõi trên Twitter</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-white mb-6">Shop</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/products" className="text-sm hover:text-amber-600 transition-colors">
                  Tất Cả Sản Phẩm
                </Link>
              </li>
              <li>
                <Link to="/products/single-origin" className="text-sm hover:text-amber-600 transition-colors">
                  Single Origin
                </Link>
              </li>
              <li>
                <Link to="/products/blends" className="text-sm hover:text-amber-600 transition-colors">
                  Signature Blends
                </Link>
              </li>
              <li>
                <Link to="/products/equipment" className="text-sm hover:text-amber-600 transition-colors">
                  Brewing Equipment
                </Link>
              </li>
              <li>
                <Link to="/products/gifts" className="text-sm hover:text-amber-600 transition-colors">
                  Gift Sets
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-white mb-6">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-sm hover:text-amber-600 transition-colors">
                  Giới Thiệu
                </Link>
              </li>
              <li>
                <Link to="/sustainability" className="text-sm hover:text-amber-600 transition-colors">
                  Tính Bền Vững
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm hover:text-amber-600 transition-colors">
                  Bài Viết
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-sm hover:text-amber-600 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm hover:text-amber-600 transition-colors">
                   Liên Hệ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-white mb-6">Customer Service</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/shipping" className="text-sm hover:text-amber-600 transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm hover:text-amber-600 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm hover:text-amber-600 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm hover:text-amber-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/subscription" className="text-sm hover:text-amber-600 transition-colors">
                  Subscription Info
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-stone-500">&copy; {new Date().getFullYear()} Élite Coffee. All rights reserved.</p>
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
