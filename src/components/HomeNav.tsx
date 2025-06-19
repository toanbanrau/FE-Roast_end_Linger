import { Link } from 'react-router-dom'

const HomeNav = () => {
  return (
    <nav className="hidden lg:flex items-center gap-6">
    <Link to="/" className="text-sm font-medium transition-colors hover:text-amber-800">
      Home
    </Link>
    <Link to="/products" className="text-sm font-medium transition-colors hover:text-amber-800">
      Shop
    </Link>
    <Link to="/about" className="text-sm font-medium transition-colors hover:text-amber-800">
      About Us
    </Link>
    <Link to="/blog" className="text-sm font-medium transition-colors hover:text-amber-800">
      Blog
    </Link>
    <Link to="/contact" className="text-sm font-medium transition-colors hover:text-amber-800">
      Contact
    </Link>
  </nav>

  )
}

export default HomeNav