import { Link } from "react-router-dom"
import { Calendar, Clock, Facebook, Linkedin, Tag, Twitter } from "lucide-react"

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = {
    slug: params.slug,
    title: "Nghệ Thuật Pha Cà Phê: Kỹ Thuật Để Có Ly Cà Phê Hoàn Hảo",
    content: `
      <p>Pha cà phê là sự kết hợp giữa nghệ thuật và khoa học. Một ly cà phê hoàn hảo đòi hỏi sự tỉ mỉ, nguyên liệu chất lượng và kỹ thuật đúng chuẩn. Trong hướng dẫn toàn diện này, chúng ta sẽ khám phá các phương pháp pha khác nhau và chia sẻ mẹo từ chuyên gia để giúp bạn nâng tầm trải nghiệm cà phê tại nhà.</p>
      
      <h2>Hiểu Rõ Những Điều Cơ Bản Về Cà Phê</h2>
      <p>Trước khi tìm hiểu phương pháp pha, bạn cần nắm rõ các yếu tố ảnh hưởng đến hương vị cà phê:</p>
      <ul>
        <li><strong>Hạt Cà Phê:</strong> Luôn dùng hạt tươi và chất lượng. Xuất xứ, cách chế biến và mức độ rang ảnh hưởng lớn đến hương vị.</li>
        <li><strong>Độ Mịn Của Hạt Xay:</strong> Mỗi phương pháp pha yêu cầu độ xay khác nhau. Xay quá mịn hoặc quá thô đều gây chiết xuất không đồng đều.</li>
        <li><strong>Chất Lượng Nước:</strong> Cà phê chiếm 98% là nước, nên hãy dùng nước lọc không mùi lạ.</li>
        <li><strong>Nhiệt Độ Nước:</strong> Nhiệt độ lý tưởng từ 90°C đến 96°C.</li>
        <li><strong>Thời Gian Pha:</strong> Mỗi phương pháp có thời gian pha tối ưu riêng để tránh vị đắng.</li>
      </ul>

      <h2>Phương Pháp Pour-Over</h2>
      <p>Phương pháp pour-over giúp hương vị rõ nét, lý tưởng cho cà phê đơn nguồn (single-origin).</p>

      <h3>Dụng Cụ Cần Có:</h3>
      <ul>
        <li>Phễu pha (Hario V60, Chemex hoặc Kalita Wave)</li>
        <li>Giấy lọc phù hợp</li>
        <li>Hạt cà phê rang mới</li>
        <li>Máy xay burr</li>
        <li>Ấm rót cổ ngỗng</li>
        <li>Cân điện tử</li>
        <li>Đồng hồ bấm giờ</li>
      </ul>

      <h3>Các Bước Thực Hiện:</h3>
      <ol>
        <li>Đun nước sôi, để nguội khoảng 30 giây (khoảng 93°C).</li>
        <li>Xay cà phê ở mức vừa mịn (như cát).</li>
        <li>Rửa giấy lọc bằng nước nóng để loại bỏ mùi giấy và làm nóng thiết bị.</li>
        <li>Cho cà phê vào phễu và tạo hõm nhỏ ở giữa.</li>
        <li>Bắt đầu đổ nước để “nở” cà phê (gấp đôi lượng cà phê) trong 30–45 giây.</li>
        <li>Tiếp tục rót nước theo hình xoắn ốc, đều tay.</li>
        <li>Thời gian pha tổng từ 2:30–3:30 phút (V60) hoặc 4–5 phút (Chemex).</li>
      </ol>

      <h2>Phương Pháp French Press</h2>
      <p>French Press cho hương vị đậm đà, thích hợp với cà phê rang đậm.</p>

      <h3>Dụng Cụ Cần Có:</h3>
      <ul>
        <li>Bình French Press</li>
        <li>Hạt cà phê rang mới</li>
        <li>Máy xay burr</li>
        <li>Ấm nước</li>
        <li>Đồng hồ bấm giờ</li>
      </ul>

      <h3>Các Bước Thực Hiện:</h3>
      <ol>
        <li>Đun nước đến 93°C.</li>
        <li>Xay cà phê ở mức thô (như muối biển).</li>
        <li>Cho cà phê vào bình.</li>
        <li>Rót nước nóng lên cà phê, khuấy nhẹ.</li>
        <li>Đậy nắp, không ấn xuống, để ủ 4 phút.</li>
        <li>Nhấn nhẹ piston xuống từ từ.</li>
        <li>Rót ra ngay để tránh chiết xuất quá mức.</li>
      </ol>

      <h2>Phương Pháp Espresso</h2>
      <p>Espresso là nền tảng cho nhiều loại cà phê khác, yêu cầu độ chính xác cao.</p>

      <h3>Dụng Cụ Cần Có:</h3>
      <ul>
        <li>Máy pha espresso</li>
        <li>Hạt espresso rang mới</li>
        <li>Máy xay burr chuyên dụng espresso</li>
        <li>Đồ nén (tamper)</li>
        <li>Cân (khuyến khích)</li>
        <li>Đồng hồ bấm giờ</li>
      </ul>

      <h3>Các Bước Thực Hiện:</h3>
      <ol>
        <li>Bật máy và chờ đủ nhiệt độ.</li>
        <li>Xay cà phê thật mịn.</li>
        <li>Lấy 18–20g cà phê vào tay pha.</li>
        <li>Dàn đều và nén chặt tay.</li>
        <li>Đặt tay pha vào máy và bắt đầu pha ngay.</li>
        <li>Chiết xuất khoảng 25–30 giây với tỷ lệ 1:2 (ví dụ 18g cà phê → 36g espresso).</li>
        <li>Shot espresso chuẩn có crema vàng nâu và vị cân bằng.</li>
      </ol>

      <h2>Những Lỗi Phổ Biến Khi Pha Cà Phê</h2>
      <ul>
        <li><strong>Dùng cà phê cũ:</strong> Hạt tươi nhất là trong 1–2 tuần sau khi rang.</li>
        <li><strong>Độ xay không đều:</strong> Nên dùng máy xay burr để đảm bảo kích thước hạt đồng đều.</li>
        <li><strong>Nhiệt độ nước sai:</strong> Nóng quá gây đắng, nguội quá gây nhạt.</li>
        <li><strong>Tỷ lệ cà phê - nước không đúng:</strong> Tỷ lệ tham khảo là 1:16 cho hầu hết phương pháp.</li>
        <li><strong>Dụng cụ bẩn:</strong> Dầu cà phê tích tụ làm ảnh hưởng mùi vị.</li>
      </ul>

      <h2>Kết Luận</h2>
      <p>Pha cà phê ngon tại nhà là hành trình thú vị kết hợp giữa khoa học, nghệ thuật và sự kiên nhẫn. Khi hiểu rõ nguyên lý và luyện tập, bạn có thể tạo ra ly cà phê ngon không kém gì quán chuyên nghiệp.</p>
      <p>Đừng ngại thử nghiệm và điều chỉnh các yếu tố như độ xay, tỷ lệ cà phê - nước, hoặc thời gian pha để tìm ra ly cà phê "chân ái" của mình. Chúc bạn thành công!</p>
    `,
    image: "/placeholder.svg?height=600&width=1200",
    date: "15 Tháng 5, 2025",
    readTime: "Đọc trong 8 phút",
    category: "Hướng Dẫn Pha Chế",
    author: {
      name: "James Wilson",
      title: "Barista Trưởng",
      image: "/placeholder.svg?height=100&width=100",
    },
    relatedPosts: [
      {
        slug: "single-origin-vs-blends",
        title: "Cà Phê Đơn Nguồn và Phối Trộn: Khác Biệt Thế Nào?",
        image: "/placeholder.svg?height=200&width=300",
        category: "Giáo Dục Cà Phê",
      },
      {
        slug: "coffee-equipment-guide",
        title: "Thiết Bị Cần Thiết Cho Barista Tại Nhà",
        image: "/placeholder.svg?height=200&width=300",
        category: "Thiết Bị",
      },
      {
        slug: "coffee-tasting-guide",
        title: "Hướng Dẫn Nếm Cà Phê Cho Người Mới Bắt Đầu",
        image: "/placeholder.svg?height=200&width=300",
        category: "Giáo Dục Cà Phê",
      },
    ],
  }

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      {/* Breadcrumbs */}
      <nav className="flex items-center text-sm text-stone-500 mb-8">
        <Link to="/" className="hover:text-amber-800">
          Home
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
          className="h-4 w-4 mx-2"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
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
          className="h-4 w-4 mx-2"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
        <span className="text-stone-900">{post.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          {/* Featured Image */}
          <div className="relative h-[400px] rounded-xl overflow-hidden mb-8">
            <img src={post.image || "/placeholder.svg"} alt={post.title} className="object-cover" />
          </div>

          {/* Post Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Link
                to={`/blog/category/${post.category.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-xs font-medium text-amber-800 bg-amber-100 px-2 py-1 rounded-full"
              >
                {post.category}
              </Link>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight mb-4">{post.title}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src={post.author.image || "/placeholder.svg"}
                    alt={post.author.name}
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">{post.author.name}</p>
                  <p className="text-xs text-stone-500">{post.author.title}</p>
                </div>
              </div>
              <div className="flex items-center text-sm text-stone-500">
                <Calendar className="h-4 w-4 mr-1" />
                <span className="mr-4">{post.date}</span>
                <Clock className="h-4 w-4 mr-1" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>

          {/* Post Content */}
          <div className="prose max-w-none mb-12" dangerouslySetInnerHTML={{ __html: post.content }} />

          {/* Tags */}
          <div className="flex items-center gap-2 mb-8 border-t border-b py-4">
            <Tag className="h-4 w-4 text-stone-500" />
            <div className="flex flex-wrap gap-2">
              {["Coffee", "Brewing", "Pour Over", "French Press", "Espresso"].map((tag, index) => (
                <Link
                  key={index}
                  to={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-xs bg-stone-100 hover:bg-stone-200 text-stone-800 px-3 py-1 rounded-full"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          {/* Share */}
          <div className="flex items-center gap-4 mb-12">
            <span className="text-sm font-medium">Share this post:</span>
            <div className="flex gap-2">
              <button className="h-8 w-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700">
                <Facebook className="h-4 w-4" />
              </button>
              <button className="h-8 w-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700">
                <Twitter className="h-4 w-4" />
              </button>
              <button className="h-8 w-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700">
                <Linkedin className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Author Bio */}
          <div className="bg-stone-50 rounded-xl p-6 mb-12">
            <div className="flex items-start gap-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={post.author.image || "/placeholder.svg"}
                  alt={post.author.name}
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">About {post.author.name}</h3>
                <p className="text-stone-600 text-sm mb-3">
                  James is our Head Barista with over 10 years of experience in specialty coffee. He's a certified Q
                  Grader and has competed in national barista championships. When not brewing coffee, he enjoys hiking
                  and photography.
                </p>
                <Link to="/about/team" className="text-amber-800 hover:text-amber-900 text-sm font-medium">
                  View Profile
                </Link>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div>
            <h3 className="text-xl font-medium mb-6">Comments (3)</h3>
            <div className="space-y-6">
              {[
                {
                  name: "Sarah Johnson",
                  date: "May 16, 2025",
                  content:
                    "This is such a helpful guide! I've been struggling with my pour-over technique, and your tips about water temperature and grind size made a huge difference. Thank you!",
                  image: "/placeholder.svg?height=50&width=50",
                },
                {
                  name: "Michael Chen",
                  date: "May 16, 2025",
                  content:
                    "Great article! I'd love to see more about how different water mineral content affects extraction. Have you found significant differences between various filtered water options?",
                  image: "/placeholder.svg?height=50&width=50",
                },
                {
                  name: "Emma Williams",
                  date: "May 17, 2025",
                  content:
                    "I just got a new espresso machine and this guide is exactly what I needed. The step-by-step instructions are so clear. Looking forward to more brewing guides!",
                  image: "/placeholder.svg?height=50&width=50",
                },
              ].map((comment, index) => (
                <div key={index} className="border-b pb-6 last:border-b-0">
                  <div className="flex items-start gap-4">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      <img
                        src={comment.image || "/placeholder.svg"}
                        alt={comment.name}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{comment.name}</h4>
                        <span className="text-xs text-stone-500">{comment.date}</span>
                      </div>
                      <p className="text-stone-600 text-sm">{comment.content}</p>
                      <button className="text-amber-800 hover:text-amber-900 text-sm font-medium mt-2">Reply</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Comment Form */}
            <div className="mt-8">
              <h3 className="text-xl font-medium mb-4">Leave a Comment</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      Name
                    </label>
                    <input
                      id="name"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="comment" className="block text-sm font-medium mb-1">
                    Comment
                  </label>
                  <textarea
                    id="comment"
                    rows={4}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-md font-medium"
                >
                  Post Comment
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-8">
            {/* Related Posts */}
            <div>
              <h3 className="text-lg font-medium mb-4">Related Posts</h3>
              <div className="space-y-4">
                {post.relatedPosts.map((relatedPost, index) => (
                  <Link key={index} to={`/blog/${relatedPost.slug}`} className="flex items-start gap-3 group">
                    <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={relatedPost.image || "/placeholder.svg"}
                        alt={relatedPost.title}
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div>
                      <span className="text-xs font-medium text-amber-800">{relatedPost.category}</span>
                      <h4 className="text-sm font-medium group-hover:text-amber-800 transition-colors">
                        {relatedPost.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-lg font-medium mb-4">Categories</h3>
              <ul className="space-y-2">
                {[
                  "All Categories",
                  "Brewing Guides",
                  "Coffee Education",
                  "Sustainability",
                  "Recipes",
                  "Origin Stories",
                  "Equipment",
                ].map((category, index) => (
                  <li key={index}>
                    <Link
                      to={index === 0 ? "/blog" : `/blog/category/${category.toLowerCase().replace(/\s+/g, "-")}`}
                      className={`block px-3 py-2 rounded-md hover:bg-stone-100 ${
                        category === post.category ? "bg-amber-100 text-amber-800 font-medium" : ""
                      }`}
                    >
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Popular Tags */}
            <div>
              <h3 className="text-lg font-medium mb-4">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "Coffee",
                  "Brewing",
                  "Espresso",
                  "Pour Over",
                  "French Press",
                  "Ethiopia",
                  "Colombia",
                  "Recipes",
                  "Roasting",
                  "Equipment",
                ].map((tag, index) => (
                  <Link
                    key={index}
                    to={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-xs bg-stone-100 hover:bg-stone-200 text-stone-800 px-3 py-1 rounded-full"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-stone-100 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-3">Subscribe to Our Newsletter</h3>
              <p className="text-sm text-stone-600 mb-4">
                Get the latest coffee insights and stories delivered to your inbox.
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                />
                <button
                  type="submit"
                  className="w-full bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-md font-medium"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
