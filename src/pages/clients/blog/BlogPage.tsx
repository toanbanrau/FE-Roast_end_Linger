import { Link } from "react-router-dom";
import { Calendar, Clock, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  getBlogPosts,
  getTop5BlogPosts,
  getBlogCategories,
} from "../../../services/clientBlogService";
import { Spin, Alert, Pagination } from "antd";
import { useState, useEffect } from "react";

export default function BlogPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState(""); // Input state cho debounce
  const [searchQuery, setSearchQuery] = useState(""); // Query state cho API
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

  // Debounce search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchQuery(searchInput);
      setIsSearching(!!searchInput);
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  // Fetch blog categories
  const { data: categories } = useQuery({
    queryKey: ["blog-categories"],
    queryFn: () => getBlogCategories({ with_posts: true }),
  });

  // Fetch blog posts with pagination, category filter, and search
  const {
    data: blogData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["blog-posts", currentPage, selectedCategoryId, searchQuery],
    queryFn: () =>
      getBlogPosts({
        page: currentPage,
        per_page: 6,
        category_id: selectedCategoryId || undefined,
        search: searchQuery || undefined, // Thêm search parameter
      }),
  });

  // Fetch top 5 posts for featured section
  const { data: featuredPosts } = useQuery({
    queryKey: ["top5-blog-posts"],
    queryFn: getTop5BlogPosts,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategoryId(categoryId);
    setCurrentPage(1); // Reset to first page when changing category
    setIsSearching(false); // Clear search when selecting category
    setSearchQuery("");
    setSearchInput(""); // Clear search input
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert
          message="Lỗi"
          description="Không thể tải danh sách bài viết. Vui lòng thử lại sau."
          type="error"
          showIcon
        />
      </div>
    );
  }

  const displayPosts = blogData?.data;
  const featuredPost = featuredPosts?.[0];

  const selectedCategory = categories?.find(
    (cat) => cat.id === selectedCategoryId
  );

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <h1 className="text-3xl font-serif font-bold tracking-tight mb-4">
        {selectedCategory ? selectedCategory.category_name : "Tạp Chí Cà Phê"}
      </h1>
      {selectedCategory && selectedCategory.description && (
        <p className="text-lg text-stone-600 mb-6">
          {selectedCategory.description}
        </p>
      )}
      {selectedCategory && (
        <div className="mb-8">
          <button
            onClick={() => handleCategoryChange(null)}
            className="text-sm text-amber-600 hover:text-amber-800"
          >
            ← Quay lại tất cả bài viết
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-8 max-w-md">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-stone-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-stone-300 rounded-md leading-5 bg-white placeholder-stone-500 focus:outline-none focus:placeholder-stone-400 focus:ring-1 focus:ring-amber-800 focus:border-amber-800 sm:text-sm"
          />
          {searchInput && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button
                type="button"
                onClick={() => setSearchInput("")}
                className="text-stone-400 hover:text-stone-600"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
        {searchInput && (
          <div className="mt-2 text-sm text-stone-500">
            Đang tìm kiếm: "{searchInput}"
          </div>
        )}
      </div>

      {/* Featured Post */}
      {featuredPost && !isSearching && (
        <div className="mb-16">
          <Link
            to={`/blog/${featuredPost.slug}`}
            className="group block overflow-hidden rounded-2xl bg-stone-100 shadow-md hover:shadow-xl transition-all"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="relative h-[300px] lg:h-auto overflow-hidden">
                <img
                  src={featuredPost.featured_image || "/placeholder.svg"}
                  alt={featuredPost.title}
                  className="object-cover w-full h-full transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-6 lg:p-8 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium text-amber-800 bg-amber-100 px-2 py-1 rounded-full">
                    {featuredPost.category.category_name}
                  </span>
                  <span className="text-xs text-stone-500">Nổi bật</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">
                  {featuredPost.title}
                </h2>
                <p className="text-stone-600 mb-6">{featuredPost.summary}</p>
                <div className="flex items-center text-sm text-stone-500 mt-auto">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="mr-4">
                    {formatDate(featuredPost.created_at)}
                  </span>
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{featuredPost.view_count} lượt xem</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="sticky top-24 space-y-8">
            {/* Categories */}
            {categories && categories.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-4">Danh Mục</h3>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => handleCategoryChange(null)}
                      className={`block w-full text-left px-3 py-2 rounded-md hover:bg-stone-100 ${
                        selectedCategoryId === null
                          ? "bg-amber-100 text-amber-800 font-medium"
                          : ""
                      }`}
                    >
                      Tất cả ({blogData?.total || 0})
                    </button>
                  </li>
                  {categories.map((category) => (
                    <li key={category.id}>
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => handleCategoryChange(category.id)}
                          className={`flex-1 text-left px-3 py-2 rounded-md hover:bg-stone-100 ${
                            selectedCategoryId === category.id
                              ? "bg-amber-100 text-amber-800 font-medium"
                              : ""
                          }`}
                        >
                          {category.category_name} ({category.posts_count || 0})
                        </button>
                    
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h3 className="text-lg font-medium mb-4">Đăng Ký Nhận Tin</h3>
              <div className="bg-stone-100 p-4 rounded-lg">
                <p className="text-sm text-stone-600 mb-3">
                  Nhận những câu chuyện và mẹo cà phê mới nhất qua email.
                </p>
                <form className="space-y-3">
                  <input
                    type="email"
                    placeholder="Nhập địa chỉ email của bạn"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                  />
                  <button
                    type="submit"
                    className="w-full bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-md font-medium"
                  >
                    Đăng ký
                  </button>
                </form>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Từ Khóa Phổ Biến</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "Cà Phê",
                  "Pha Chế",
                  "Espresso",
                  "Bền Vững",
                  "Pour Over",
                  "Ethiopia",
                  "Colombia",
                  "Công Thức",
                  "Rang",
                  "Thiết Bị",
                ].map((tag) => (
                  <p className="text-xs bg-stone-100 hover:bg-stone-200 text-stone-800 px-3 py-1 rounded-full">
                    {tag}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="lg:col-span-3 order-1 lg:order-2">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Spin size="large" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {displayPosts && displayPosts.length > 0 ? (
                  displayPosts.map((post) => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.slug}`}
                      className="group block overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-all"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={post.featured_image || "/placeholder.svg"}
                          alt={post.title}
                          className="object-cover w-full h-full transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs font-medium text-amber-800 bg-amber-100 px-2 py-1 rounded-full">
                            {post.category.category_name}
                          </span>
                        </div>
                        <h3 className="text-xl font-medium mb-3 group-hover:text-amber-800 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-stone-600 text-sm mb-4">
                          {post.summary}
                        </p>
                        <div className="flex items-center text-sm text-stone-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span className="mr-4">
                            {formatDate(post.created_at)}
                          </span>
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{post.view_count} lượt xem</span>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-8">
                    <p className="text-stone-500">
                      {isSearching
                        ? "Không tìm thấy bài viết nào."
                        : "Chưa có bài viết nào."}
                    </p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {blogData && blogData.total > blogData.per_page && (
                <div className="mt-12 flex justify-center">
                  <Pagination
                    current={currentPage}
                    total={blogData.total}
                    pageSize={blogData.per_page}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    showQuickJumper
                    showTotal={(total, range) =>
                      `${range[0]}-${range[1]} của ${total} bài viết`
                    }
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
