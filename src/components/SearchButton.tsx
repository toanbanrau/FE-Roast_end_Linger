import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../hooks/useDebounce";
import { getAllProductsClient } from "../services/productService";
import type { IProduct } from "../interfaces/product";

interface SearchButtonProps {
  className?: string;
}

export default function SearchButton({ className = "" }: SearchButtonProps) {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounce search query để giảm số lần gọi API
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Query search products
  const { data: searchResults, isLoading: isSearchLoading } = useQuery({
    queryKey: ["search-products", debouncedSearchQuery],
    queryFn: async () => {
      if (!debouncedSearchQuery.trim()) {
        return { data: [] as IProduct[], meta: {} };
      }
      const params = new URLSearchParams();
      params.set("search", debouncedSearchQuery);
      params.set("per_page", "5"); // Giới hạn 5 kết quả
      return getAllProductsClient(params);
    },
    enabled: !!debouncedSearchQuery.trim(),
  });

  // Handle click outside để đóng search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSearchResults(value.trim().length > 0);
  };

  // Handle search result click
  const handleSearchResultClick = (product: IProduct) => {
    navigate(`/products/${product.slug}`);
    setSearchQuery("");
    setShowSearchResults(false);
    setIsSearchOpen(false);
  };

  // Handle search submit (Enter key)
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setShowSearchResults(false);
      setIsSearchOpen(false);
    }
  };

  // Handle close search
  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setShowSearchResults(false);
  };

  return (
    <div className={`relative ${className}`}>
      {isSearchOpen ? (
        <div className="relative" ref={searchRef}>
          <form onSubmit={handleSearchSubmit} className="flex items-center">
            <input
              type="search"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-[200px] md:w-[300px] px-3 py-1.5 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 text-sm transition-all duration-200"
              autoFocus
            />
            <button
              type="button"
              className="ml-2 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
              onClick={handleCloseSearch}
            >
              <X className="h-4 w-4" />
            </button>
          </form>

          {/* Search Results Dropdown */}
          {showSearchResults && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
              {isSearchLoading ? (
                <div className="p-4 text-center text-stone-500">
                  <div className="animate-spin inline-block w-4 h-4 border-2 border-amber-800 border-t-transparent rounded-full mr-2"></div>
                  Đang tìm kiếm...
                </div>
              ) : searchResults?.data && searchResults.data.length > 0 ? (
                <>
                  {searchResults.data.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleSearchResultClick(product)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-stone-50 text-left border-b last:border-b-0 transition-colors cursor-pointer"
                    >
                      <img
                        src={
                          product.primary_image?.image_url || "/placeholder.svg"
                        }
                        alt={product.product_name}
                        className="w-10 h-10 object-cover rounded"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.svg";
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-stone-900 truncate">
                          {product.product_name}
                        </p>
                        <p className="text-sm text-stone-500 truncate">
                          {product.category?.category_name}
                        </p>
                        <p className="text-sm font-medium text-amber-800">
                          {product.display_price ||
                            `${Number(product.base_price).toLocaleString()}₫`}
                        </p>
                      </div>
                    </button>
                  ))}
                  {searchResults.data.length === 5 && (
                    <button
                      onClick={() => {
                        navigate(
                          `/products?search=${encodeURIComponent(
                            searchQuery.trim()
                          )}`
                        );
                        handleCloseSearch();
                      }}
                      className="w-full p-3 text-center text-amber-800 hover:bg-amber-50 font-medium border-t transition-colors cursor-pointer"
                    >
                      Xem tất cả kết quả
                    </button>
                  )}
                </>
              ) : debouncedSearchQuery.trim() ? (
                <div className="p-4 text-center text-stone-500">
                  Không tìm thấy sản phẩm nào
                </div>
              ) : null}
            </div>
          )}
        </div>
      ) : (
        <button
          className="text-stone-700 hover:text-amber-800 p-1 transition-colors cursor-pointer"
          onClick={() => setIsSearchOpen(true)}
        >
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </button>
      )}
    </div>
  );
}
