"use client";

import { useState } from "react";

import { Coffee, ShoppingBag, User, Search, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2 lg:gap-4">
          <button
            className="lg:hidden text-stone-700 hover:text-amber-800"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </button>

          <Link to="/" className="flex items-center gap-2">
            <Coffee className="h-6 w-6 text-amber-800" />
            <span className="text-xl font-serif font-bold tracking-tight">
              Élite Coffee
            </span>
          </Link>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-white lg:hidden">
            <div className="flex justify-between items-center h-16 px-4 border-b">
              <Link to="/" className="flex items-center gap-2">
                <Coffee className="h-6 w-6 text-amber-800" />
                <span className="text-xl font-serif font-bold tracking-tight">
                  Élite Coffee
                </span>
              </Link>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex flex-col gap-6 p-6">
              <Link
                to="/"
                className="text-lg font-medium transition-colors hover:text-amber-800"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="text-lg font-medium transition-colors hover:text-amber-800"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                to="/about"
                className="text-lg font-medium transition-colors hover:text-amber-800"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                to="/blog"
                className="text-lg font-medium transition-colors hover:text-amber-800"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                to="/contact"
                className="text-lg font-medium transition-colors hover:text-amber-800"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>
          </div>
        )}

        <nav className="hidden lg:flex items-center gap-6">
          <Link
            to="/"
            className="text-sm font-medium transition-colors hover:text-amber-800"
          >
            Home
          </Link>
          <Link
            to="/products"
            className="text-sm font-medium transition-colors hover:text-amber-800"
          >
            Shop
          </Link>
          <Link
            to="/about"
            className="text-sm font-medium transition-colors hover:text-amber-800"
          >
            About Us
          </Link>
          <Link
            to="/blog"
            className="text-sm font-medium transition-colors hover:text-amber-800"
          >
            Blog
          </Link>
          <Link
            to="/contact"
            className="text-sm font-medium transition-colors hover:text-amber-800"
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {isSearchOpen ? (
            <div className="flex items-center">
              <input
                type="search"
                placeholder="Search..."
                className="w-[200px] md:w-[300px] px-3 py-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800"
              />
              <button
                className="ml-2 text-stone-400 hover:text-stone-700"
                onClick={() => setIsSearchOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <button
              className="text-stone-700 hover:text-amber-800"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </button>
          )}

          <Link to="/profile" className="text-stone-700 hover:text-amber-800">
            <User className="h-5 w-5" />
            <span className="sr-only">Account</span>
          </Link>

          <Link
            to="/cart"
            className="text-stone-700 hover:text-amber-800 relative"
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-800 text-[10px] font-medium text-white">
              3
            </span>
            <span className="sr-only">Cart</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
