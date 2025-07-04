import { ShoppingBag, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Phần chính (Hero Section) */}
      <section className="relative h-[90vh] flex items-center">
        <img
          src="https://img.freepik.com/premium-psd/banner-template-coffee-sale-social-media-post_268949-63.jpg?semt=ais_items_boosted&w=740"
          alt="Hạt cà phê cao cấp"
          className="object-cover w-full h-full absolute inset-0  brightness-50"
        />
        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl font-serif font-bold tracking-tighter sm:text-5xl md:text-6xl text-white">
              Trải Nghiệm Nghệ Thuật Cà Phê Đỉnh Cao
            </h1>
            <p className="text-xl text-gray-200 md:text-2xl">
              Thưởng thức bộ sưu tập cà phê cao cấp, rang thủ công, có nguồn gốc đạo đức.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/products"
                className="inline-flex items-center justify-center rounded-md bg-amber-800 px-4 py-2 text-sm font-medium text-white hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              >
                Xem Sản Phẩm <ShoppingBag className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center rounded-md border border-white bg-transparent px-4 py-2 text-sm font-medium text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
              >
                Câu Chuyện Của Chúng Tôi <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bộ sưu tập nổi bật */}
      <section className="py-20 bg-stone-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center mb-12">
            <h2 className="text-3xl font-serif font-bold tracking-tight sm:text-4xl md:text-5xl text-stone-900">
              Bộ Sưu Tập Nổi Bật
            </h2>
            <div className="w-20 h-1 bg-amber-800 my-6"></div>
            <p className="text-lg text-stone-600 max-w-2xl">
              Khám phá những hạt cà phê đặc biệt nhất được chúng tôi tuyển chọn kỹ lưỡng từ khắp nơi trên thế giới.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Ethiopian Yirgacheffe",
                price: "$24.95",
                image: "/placeholder.svg?height=400&width=400",
                description: "Hương hoa và cam chanh, hậu vị mượt mà",
              },
              {
                name: "Colombian Supremo",
                price: "$22.95",
                image: "/placeholder.svg?height=400&width=400",
                description: "Ngọt dịu như caramel với chút hương hạt rang",
              },
              {
                name: "Sumatra Mandheling",
                price: "$26.95",
                image: "/placeholder.svg?height=400&width=400",
                description: "Đậm đà, đất và socola đen",
              },
            ].map((product, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-xl"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src="https://product.hstatic.net/1000075078/product/1737357663_cpg-cfsd-tui_f866066067b44f9b9258c2240a54b9ac_large.png"
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-medium text-stone-900">
                    {product.name}
                  </h3>
                  <p className="mt-2 text-stone-600">{product.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-semibold text-amber-800">
                      {product.price}
                    </span>
                    <button className="text-amber-800 hover:text-amber-900 hover:bg-amber-50 px-3 py-1 rounded-md text-sm font-medium">
                      Thêm Vào Giỏ
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/products"
              className="text-amber-800 hover:text-amber-900 text-lg font-medium inline-flex items-center"
            >
              Xem Tất Cả <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Câu chuyện của chúng tôi */}
      <section className="py-20 bg-stone-900 text-white">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[500px] rounded-xl overflow-hidden">
              <img
                src="https://cdn.s99.vn/ss2/prod/product/d30c161f3acc792af11ed594c8942030_1699843641.jpg?at=1701809332"
                alt="Trang trại cà phê"
                className="object-cover"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-serif font-bold tracking-tight sm:text-4xl">
                Niềm Đam Mê Hoàn Hảo
              </h2>
              <div className="w-20 h-1 bg-amber-600"></div>
              <p className="text-lg text-stone-300">
                Trong hơn 30 năm, chúng tôi đã đi khắp thế giới để tìm kiếm những hạt cà phê chất lượng nhất, kết nối với nông dân cùng chia sẻ giá trị bền vững.
              </p>
              <p className="text-lg text-stone-300">
                Mỗi mẻ cà phê được chọn lọc kỹ càng, rang chuẩn xác và giao đến bạn ở độ tươi ngon nhất. Những người thợ rang của chúng tôi mang đến trải nghiệm cà phê đẳng cấp.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center justify-center rounded-md bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 mt-4"
              >
                Khám Phá Hành Trình Của Chúng Tôi
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Nhận xét khách hàng */}
      <section className="py-20 bg-stone-100">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center mb-12">
            <h2 className="text-3xl font-serif font-bold tracking-tight sm:text-4xl md:text-5xl text-stone-900">
              Khách Hàng Nói Gì
            </h2>
            <div className="w-20 h-1 bg-amber-800 my-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "Ly cà phê tuyệt vời nhất tôi từng thưởng thức. Mỗi tách là một hành trình hương vị.",
                author: "Emily Richardson",
                title: "Người Yêu Cà Phê",
              },
              {
                quote:
                  "Sự tỉ mỉ và cam kết chất lượng của họ là không ai sánh kịp trong ngành.",
                author: "Michael Chen",
                title: "Nhà Phê Bình Ẩm Thực",
              },
              {
                quote:
                  "Từ hạt đến ly, họ đã tinh chỉnh mọi công đoạn của hành trình cà phê.",
                author: "Sophia Martinez",
                title: "Chủ Quán Cà Phê",
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-md">
                <div className="text-amber-800 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
                    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
                  </svg>
                </div>
                <p className="text-lg text-stone-700 mb-6">
                  {testimonial.quote}
                </p>
                <div>
                  <p className="font-medium text-stone-900">
                    {testimonial.author}
                  </p>
                  <p className="text-stone-500">{testimonial.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Đăng ký nhận tin */}
      <section className="py-16 bg-amber-800 text-white">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-serif font-bold tracking-tight sm:text-4xl">
              Gia Nhập Câu Lạc Bộ Cà Phê
            </h2>
            <p className="text-lg text-amber-100">
              Đăng ký để nhận ưu đãi độc quyền, mẹo pha chế và thông tin về sản phẩm giới hạn.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="px-4 py-3 rounded-md text-stone-900 w-full focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
              <button className="bg-stone-900 hover:bg-stone-800 text-white whitespace-nowrap px-4 py-3 rounded-md font-medium">
                Đăng Ký
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
