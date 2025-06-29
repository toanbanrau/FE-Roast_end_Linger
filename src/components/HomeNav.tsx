import { Link } from 'react-router-dom'

const HomeNav = () => {
  return (
    <nav className="hidden lg:flex items-center gap-6">
    <Link to="/" className="text-sm font-medium transition-colors hover:text-amber-800">
      Trang Chủ
    </Link>
    <Link to="/products" className="text-sm font-medium transition-colors hover:text-amber-800">
      Sản Phẩm
    </Link>
    <Link to="/about" className="text-sm font-medium transition-colors hover:text-amber-800">
      Giới Thiệu
    </Link>
    <Link to="/blog" className="text-sm font-medium transition-colors hover:text-amber-800">
       Bài Viết
    </Link>
    <Link to="/contact" className="text-sm font-medium transition-colors hover:text-amber-800">
      Liên Hệ
    </Link>
  </nav>

  )
}

export default HomeNav