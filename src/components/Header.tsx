import { useState } from "react";

import {
  Coffee,
  ShoppingBag,
  Menu,
  X,
  LogIn,
  UserPlus,
  User,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import HomeNav from "./HomeNav";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import CartModal from "./CartModal";
import SearchButton from "./SearchButton";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const { user, logout } = useUserStore();
  const { cart } = useCartStore();
  const cartItemCount = cart?.total_items || 0;

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          {/* Left: Logo + Mobile Menu */}
          <div className="flex items-center gap-2 lg:gap-4">
            <button
              className="lg:hidden text-stone-700 hover:text-amber-800"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Mở menu</span>
            </button>

            <Link to="/" className="flex items-center gap-2">
              <img
                src="/z6887861436131_47d6a9f9e86b1d04f1a94932d5b53cad-removebg-preview.png"
                alt="Roast & Linger Logo"
                className="h-10 w-10 object-contain"
              />
              <span className="text-xl font-serif font-bold tracking-tight">
                Roast & Linger
              </span>
            </Link>
          </div>

          {/* Center: Desktop Navigation */}
          <HomeNav />
          {/* Right: Search + Auth + Cart */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <SearchButton />

            {/* Authentication - Desktop */}
            <div className="hidden lg:flex items-center gap-3">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 text-stone-700 hover:text-amber-800 p-1 cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-full overflow-hidden bg-stone-200">
                      <img
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <ChevronDown className="h-3 w-3" />
                  </button>

                  {/* User Dropdown */}
                  {isUserMenuOpen && (
                    <>
                      <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg py-2 z-50 ">
                        <div className="px-4 py-3 border-b">
                          <p className="text-sm font-medium text-stone-900">
                            {user.name}
                          </p>
                          <p className="text-xs text-stone-500">{user.email}</p>
                        </div>
                        <Link
                          to="/account"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User className="h-4 w-4" />
                          Thông Tin Tài Khoản
                        </Link>
                        <Link
                          to="/account/orders"
                          className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Lịch Sử Mua Hàng
                        </Link>
                        <Link
                          to="/account/wishlist"
                          className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Sản Phẩm Yêu Thích
                        </Link>
                        <Link
                          to="/account/settings"
                          className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Cài Đặt
                        </Link>
                        <div className="border-t mt-2 pt-2">
                          <button
                            onClick={logout}
                            className="block w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
                          >
                            Đăng Xuất
                          </button>
                        </div>
                      </div>
                      {/* Backdrop */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsUserMenuOpen(false)}
                      />
                    </>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    to="/auth/login"
                    className="flex items-center gap-1 text-stone-700 hover:text-amber-800 text-sm font-medium px-2 py-1"
                  >
                    <LogIn className="h-4 w-4" />
                    Đăng Nhập
                  </Link>
                  <Link
                    to="/auth/register"
                    className="flex items-center gap-1 bg-amber-800 hover:bg-amber-900 text-white px-3 py-1.5 rounded-md text-sm font-medium"
                  >
                    <UserPlus className="h-4 w-4" />
                    Đăng Ký
                  </Link>
                </>
              )}
            </div>

            {/* Cart */}
            <button
              onClick={() => setIsCartModalOpen(true)}
              className="text-stone-700 hover:text-amber-800 relative p-1 transition-colors cursor-pointer"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-800 text-[10px] font-medium text-white ">
                  {cartItemCount}
                </span>
              )}
              <span className="sr-only">Giỏ hàng</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-white lg:hidden">
            <div className="flex justify-between items-center h-16 px-4 border-b">
              <Link to="/" className="flex items-center gap-2">
                <img
                  src="/z6887861436131_47d6a9f9e86b1d04f1a94932d5b53cad-removebg-preview.png"
                  alt="Roast & Linger Logo"
                  className="h-10 w-10 object-contain"
                />
                <span className="text-xl font-serif font-bold tracking-tight">
                  Roast & Linger
                </span>
              </Link>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex flex-col h-full">
              <nav className="flex flex-col gap-1 p-4 flex-1">
                <Link
                  to="/"
                  className="text-lg font-medium py-3 px-2 rounded-md hover:bg-stone-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Trang Chủ
                </Link>
                <Link
                  to="/products"
                  className="text-lg font-medium py-3 px-2 rounded-md hover:bg-stone-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Cửa Hàng
                </Link>
                <Link
                  to="/about"
                  className="text-lg font-medium py-3 px-2 rounded-md hover:bg-stone-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Giới Thiệu
                </Link>
                <Link
                  to="/blog"
                  className="text-lg font-medium py-3 px-2 rounded-md hover:bg-stone-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Bài Viết
                </Link>
                <Link
                  to="/contact"
                  className="text-lg font-medium py-3 px-2 rounded-md hover:bg-stone-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Liên Hệ
                </Link>

                {/* Mobile Account Links */}
                {user && (
                  <>
                    <div className="border-t my-4"></div>
                    <Link
                      to="/account"
                      className="text-lg font-medium py-3 px-2 rounded-md hover:bg-stone-50"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Tài Khoản Của Tôi
                    </Link>
                    <Link
                      to="/account/orders"
                      className="text-lg font-medium py-3 px-2 rounded-md hover:bg-stone-50"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Đơn Hàng
                    </Link>
                    <Link
                      to="/account/wishlist"
                      className="text-lg font-medium py-3 px-2 rounded-md hover:bg-stone-50"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Danh Sách Yêu Thích
                    </Link>
                  </>
                )}
              </nav>

              {/* Mobile Auth Section */}
              <div className="border-t p-4">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-stone-200">
                        <img
                          src={user.avatar || "/placeholder.svg"}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-stone-900">
                          {user.name}
                        </p>
                        <p className="text-sm text-stone-500">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={logout}
                      className="w-full text-left py-2 px-3 text-stone-700 hover:bg-stone-50 rounded-md"
                    >
                      Đăng Xuất
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link
                      to="/auth/login"
                      className="flex items-center justify-center gap-2 w-full py-3 border border-stone-300 rounded-md font-medium hover:bg-stone-50"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <LogIn className="h-4 w-4" />
                      Đăng Nhập
                    </Link>
                    <Link
                      to="/auth/register"
                      className="flex items-center justify-center gap-2 w-full py-3 bg-amber-800 hover:bg-amber-900 text-white rounded-md font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <UserPlus className="h-4 w-4" />
                      Đăng Ký
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
      <CartModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
      />
    </>
  );
}
