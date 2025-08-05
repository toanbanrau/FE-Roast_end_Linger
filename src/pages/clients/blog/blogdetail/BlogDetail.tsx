import { Link, useParams } from "react-router-dom";
import {
  Calendar,
  Clock,
  Facebook,
  Linkedin,
  Tag,
  Twitter,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getBlogPostBySlug } from "../../../../services/clientBlogService";
import { Spin, Alert } from "antd";

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();

  // Fetch blog post data
  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: () => getBlogPostBySlug(slug!),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert
          message="Lỗi"
          description="Không thể tải bài viết. Vui lòng thử lại sau."
          type="error"
          showIcon
        />
      </div>
    );
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
        <span className="text-stone-800">{post.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-3 order-2 lg:order-1">
          {/* Featured Image */}
          {post.featured_image && (
            <div className="relative h-96 mb-8 rounded-xl overflow-hidden">
              <img
                src={post.featured_image}
                alt={post.title}
                className="object-cover w-full h-full"
              />
            </div>
          )}

          {/* Post Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-xs font-medium text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
                {post.category.category_name}
              </span>
              {post.is_featured && (
                <span className="text-xs font-medium text-blue-800 bg-blue-100 px-3 py-1 rounded-full">
                  Nổi bật
                </span>
              )}
            </div>
            <h1 className="text-4xl font-bold text-stone-900 mb-4">
              {post.title}
            </h1>
            <p className="text-lg text-stone-600 mb-6">{post.summary}</p>
            <div className="flex items-center gap-6 text-sm text-stone-500">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.created_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{post.view_count} lượt xem</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Tác giả: {post.user.name}</span>
              </div>
            </div>
          </div>

          {/* Post Content */}
          <div
            className="prose max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex items-center gap-2 mb-8 border-t border-b py-4">
              <Tag className="h-4 w-4 text-stone-500" />
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    to={`/blog/tag/${tag.slug}`}
                    className="text-xs bg-stone-100 hover:bg-stone-200 text-stone-800 px-3 py-1 rounded-full"
                  >
                    {tag.tag_name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Social Share */}
          <div className="flex items-center gap-4 mb-12">
            <span className="text-sm font-medium text-stone-600">Chia sẻ:</span>
            <div className="flex gap-2">
              <button className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                <Facebook className="h-4 w-4" />
              </button>
              <button className="p-2 rounded-full bg-sky-500 text-white hover:bg-sky-600 transition-colors">
                <Twitter className="h-4 w-4" />
              </button>
              <button className="p-2 rounded-full bg-blue-700 text-white hover:bg-blue-800 transition-colors">
                <Linkedin className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Author Info */}
          <div className="bg-stone-50 rounded-xl p-6 mb-12">
            <h3 className="text-lg font-medium mb-4">Về tác giả</h3>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-amber-200 flex items-center justify-center">
                <span className="text-xl font-bold text-amber-800">
                  {post.user.name.charAt(0)}
                </span>
              </div>
              <div>
                <h4 className="font-medium text-stone-900">{post.user.name}</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-8">
            {/* Related Posts */}
            {post.related_posts && post.related_posts.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-4">Bài viết liên quan</h3>
                <div className="space-y-4">
                  {post.related_posts.map((relatedPost) => (
                    <Link
                      key={relatedPost.id}
                      to={`/blog/${relatedPost.slug}`}
                      className="flex items-start gap-3 group"
                    >
                      <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={relatedPost.featured_image || "/placeholder.svg"}
                          alt={relatedPost.title}
                          className="object-cover w-full h-full transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div>
                        <span className="text-xs font-medium text-amber-800">
                          {relatedPost.category.category_name}
                        </span>
                        <h4 className="text-sm font-medium group-hover:text-amber-800 transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
