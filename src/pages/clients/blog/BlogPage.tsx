import { Link } from "react-router-dom"
import { Calendar, Clock } from "lucide-react"

export default function BlogPage() {
  // Dữ liệu bài viết mẫu
  const featuredPost = {
    slug: "coffee-brewing-techniques",
    title: "Nghệ Thuật Pha Cà Phê: Kỹ Thuật Cho Một Ly Hoàn Hảo",
    excerpt:
      "Khám phá bí quyết pha cà phê tuyệt vời tại nhà với những kỹ thuật và mẹo từ chuyên gia rang cà phê của chúng tôi.",
    image: "/placeholder.svg?height=600&width=1200",
    date: "15 Tháng 5, 2025",
    readTime: "Đọc trong 8 phút",
    category: "Hướng Dẫn Pha Chế",
  }

  const posts = [
    {
      slug: "single-origin-vs-blends",
      title: "Cà Phê Đơn Nguồn và Phối Trộn: Khác Biệt Thế Nào?",
      excerpt:
        "Khám phá những đặc điểm độc đáo của cà phê đơn nguồn và cách chúng khác biệt so với các loại cà phê phối trộn được chế tác kỹ lưỡng.",
      image: "/placeholder.svg?height=400&width=600",
      date: "10 Tháng 5, 2025",
      readTime: "Đọc trong 6 phút",
      category: "Giáo Dục Cà Phê",
    },
    {
      slug: "sustainable-coffee-farming",
      title: "Tương Lai Của Nông Nghiệp Cà Phê Bền Vững",
      excerpt:
        "Tìm hiểu cách các phương pháp canh tác sáng tạo đang giúp bảo vệ tương lai của cà phê trước biến đổi khí hậu.",
      image: "/placeholder.svg?height=400&width=600",
      date: "5 Tháng 5, 2025",
      readTime: "Đọc trong 7 phút",
      category: "Bền Vững",
    },
    {
      slug: "coffee-tasting-guide",
      title: "Hướng Dẫn Nếm Cà Phê Cho Người Mới",
      excerpt:
        "Phát triển khẩu vị của bạn và học cách nhận diện các hương vị, hương thơm phức tạp trong tách cà phê hằng ngày.",
      image: "/placeholder.svg?height=400&width=600",
      date: "28 Tháng 4, 2025",
      readTime: "Đọc trong 5 phút",
      category: "Giáo Dục Cà Phê",
    },
    {
      slug: "cold-brew-recipes",
      title: "5 Công Thức Cold Brew Giải Nhiệt Mùa Hè",
      excerpt: "Hạ nhiệt với những công thức cold brew thơm ngon, hoàn hảo cho thời tiết nóng.",
      image: "/placeholder.svg?height=400&width=600",
      date: "20 Tháng 4, 2025",
      readTime: "Đọc trong 4 phút",
      category: "Công Thức",
    },
    {
      slug: "coffee-origin-ethiopia",
      title: "Hành Trình Cội Nguồn: Ethiopia - Cái Nôi Của Cà Phê",
      excerpt:
        "Khám phá Ethiopia và tìm hiểu lịch sử phong phú cùng hương vị độc đáo của cà phê từ quê hương tổ tiên của nó.",
      image: "/placeholder.svg?height=400&width=600",
      date: "15 Tháng 4, 2025",
      readTime: "Đọc trong 9 phút",
      category: "Câu Chuyện Xuất Xứ",
    },
    {
      slug: "coffee-equipment-guide",
      title: "Thiết Bị Cần Thiết Cho Barista Tại Nhà",
      excerpt:
        "Đầu tư đúng công cụ để nâng tầm trải nghiệm cà phê tại nhà với hướng dẫn thiết bị toàn diện của chúng tôi.",
      image: "/placeholder.svg?height=400&width=600",
      date: "8 Tháng 4, 2025",
      readTime: "Đọc trong 7 phút",
      category: "Thiết Bị",
    },
  ]

  const categories = [
    "Tất Cả",
    "Hướng Dẫn Pha Chế",
    "Giáo Dục Cà Phê",
    "Bền Vững",
    "Công Thức",
    "Câu Chuyện Xuất Xứ",
    "Thiết Bị",
    "Tin Tức Công Ty",
  ]

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <h1 className="text-3xl font-serif font-bold tracking-tight mb-8">Tạp Chí Cà Phê</h1>

      {/* Bài viết nổi bật */}
      <div className="mb-16">
        <Link
          to={`/blog/${featuredPost.slug}`}
          className="group block overflow-hidden rounded-2xl bg-stone-100 shadow-md hover:shadow-xl transition-all"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="relative h-[300px] lg:h-auto overflow-hidden">
              <img
                src={featuredPost.image}
                alt={featuredPost.title}
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="p-6 lg:p-8 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-medium text-amber-800 bg-amber-100 px-2 py-1 rounded-full">
                  {featuredPost.category}
                </span>
                <span className="text-xs text-stone-500">Nổi bật</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">{featuredPost.title}</h2>
              <p className="text-stone-600 mb-6">{featuredPost.excerpt}</p>
              <div className="flex items-center text-sm text-stone-500 mt-auto">
                <Calendar className="h-4 w-4 mr-1" />
                <span className="mr-4">{featuredPost.date}</span>
                <Clock className="h-4 w-4 mr-1" />
                <span>{featuredPost.readTime}</span>
              </div>
            </div>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="sticky top-24 space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-4">Danh Mục</h3>
              <ul className="space-y-2">
                {categories.map((category, index) => (
                  <li key={index}>
                    <Link
                      to={index === 0 ? "/blog" : `/blog/category/${category.toLowerCase().replace(/\s+/g, "-")}`}
                      className={`block px-3 py-2 rounded-md hover:bg-stone-100 ${
                        index === 0 ? "bg-amber-100 text-amber-800 font-medium" : ""
                      }`}
                    >
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

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
                ].map((tag, index) => (
                  <Link
                    key={index}
                    to={`/blog/tag/${tag.toLowerCase()}`}
                    className="text-xs bg-stone-100 hover:bg-stone-200 text-stone-800 px-3 py-1 rounded-full"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Lưới bài viết */}
        <div className="lg:col-span-3 order-1 lg:order-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post, index) => (
              <Link
                key={index}
                to={`/blog/${post.slug}`}
                className="group block overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-all"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium text-amber-800 bg-amber-100 px-2 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-medium mb-3 group-hover:text-amber-800 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-stone-600 text-sm mb-4">{post.excerpt}</p>
                  <div className="flex items-center text-sm text-stone-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="mr-4">{post.date}</span>
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Phân trang */}
          <div className="mt-12 flex justify-center">
            <nav className="flex items-center gap-1">
              <button className="h-10 w-10 flex items-center justify-center border rounded-md bg-amber-800 text-white">
                1
              </button>
              <button className="h-10 w-10 flex items-center justify-center border rounded-md hover:bg-amber-50">
                2
              </button>
              <button className="h-10 w-10 flex items-center justify-center border rounded-md hover:bg-amber-50">
                3
              </button>
              <button className="h-10 w-10 flex items-center justify-center border rounded-md hover:bg-amber-50">
                <span className="sr-only">Trang tiếp theo</span>
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
                  className="h-4 w-4"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}
