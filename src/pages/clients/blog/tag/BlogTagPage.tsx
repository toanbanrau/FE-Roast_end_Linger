import { Link, useParams } from "react-router-dom";
import { Calendar, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getBlogPostsByTag } from "../../../../services/clientBlogService";
import { Spin, Alert, Pagination } from "antd";
import { useState } from "react";

export default function BlogTagPage() {
  const { tagSlug } = useParams<{ tagSlug: string }>();
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch posts by tag with pagination
  const {
    data: tagPosts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["blog-tag-posts", tagSlug, currentPage],
    queryFn: () =>
      getBlogPostsByTag(tagSlug!, {
        page: currentPage,
        per_page: 12,
        sort: "newest",
      }),
    enabled: !!tagSlug,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format tag name for display
  const formatTagName = (slug: string) => {
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !tagPosts) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert
          message="Lỗi"
          description="Không thể tải bài viết theo tag. Vui lòng thử lại sau."
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      {/* Breadcrumbs */}
      <nav className="flex items-center text-sm text-stone-500 mb-8">
        <Link to="/" className="hover:text-amber-800">
          Trang chủ
        </Link>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mx-2 h-4 w-4"
        >
          <polyline points="9,18 15,12 9,6" />
        </svg>
        <Link to="/blog" className="hover:text-amber-800">
          Blog
        </Link>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mx-2 h-4 w-4"
        >
          <polyline points="9,18 15,12 9,6" />
        </svg>
        <span className="text-stone-800">Tag: {formatTagName(tagSlug!)}</span>
      </nav>

      {/* Tag Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-serif font-bold tracking-tight mb-4">
          Bài viết với tag "{formatTagName(tagSlug!)}"
        </h1>
        <div className="text-sm text-stone-500">
          {tagPosts.total} bài viết được tìm thấy
        </div>
      </div>

      {/* Posts Grid */}
      {tagPosts.data && tagPosts.data.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {tagPosts.data.map((post) => (
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
                  <p className="text-stone-600 text-sm mb-4 line-clamp-3">
                    {post.summary}
                  </p>
                  <div className="flex items-center text-sm text-stone-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="mr-4">{formatDate(post.created_at)}</span>
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{post.view_count} lượt xem</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {tagPosts.total > tagPosts.per_page && (
            <div className="flex justify-center">
              <Pagination
                current={currentPage}
                total={tagPosts.total}
                pageSize={tagPosts.per_page}
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
      ) : (
        <div className="text-center py-12">
          <p className="text-stone-500 text-lg">
            Không tìm thấy bài viết nào với tag này.
          </p>
          <Link
            to="/blog"
            className="inline-block mt-4 bg-amber-800 text-white px-6 py-2 rounded-md hover:bg-amber-900 transition-colors"
          >
            Xem tất cả bài viết
          </Link>
        </div>
      )}
    </div>
  );
}
