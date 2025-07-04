import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Phần mở đầu */}
      <section className="relative h-[60vh] flex items-center">
        <img
          src="/placeholder.svg?height=1080&width=1920"
          alt="Đồn điền cà phê"
          className="object-cover brightness-50"
        />
        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl font-serif font-bold tracking-tighter sm:text-5xl md:text-6xl text-white">
              Câu Chuyện Của Chúng Tôi
            </h1>
            <p className="text-xl text-gray-200 md:text-2xl">
              Hành trình của đam mê, chất lượng và bền vững trong từng tách cà phê.
            </p>
          </div>
        </div>
      </section>

      {/* Lịch sử */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-serif font-bold tracking-tight sm:text-4xl">Hành Trình Của Chúng Tôi</h2>
              <div className="w-20 h-1 bg-amber-800"></div>
              <p className="text-lg text-stone-600">
                Được thành lập vào năm 1992 bởi người đam mê cà phê Maria Rodriguez, Élite Coffee bắt đầu là một xưởng rang nhỏ tại Seattle với sứ mệnh đơn giản: tìm nguồn và rang những hạt cà phê ngon nhất thế giới với sự tận tâm và chân thành.
              </p>
              <p className="text-lg text-stone-600">
                Từ một dự án đam mê, chúng tôi nhanh chóng được công nhận nhờ chất lượng vượt trội và cam kết với việc thu mua đạo đức. Sau hơn ba thập kỷ, chúng tôi đã phát triển từ một thương hiệu địa phương thành một tên tuổi quốc tế, nhưng giá trị cốt lõi thì vẫn vẹn nguyên.
              </p>
              <p className="text-lg text-stone-600">
                Ngày nay, chúng tôi vẫn tiếp tục rong ruổi khắp thế giới để tìm kiếm những hạt cà phê xuất sắc, xây dựng mối quan hệ lâu dài với nông dân có cùng cam kết về chất lượng và phát triển bền vững.
              </p>
            </div>
            <div className="relative h-[500px] rounded-xl overflow-hidden">
              <img
                src="/placeholder.svg?height=1000&width=800"
                alt="Lịch sử quán cà phê"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Giá trị cốt lõi */}
      <section className="py-20 bg-stone-50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl font-serif font-bold tracking-tight sm:text-4xl">Giá Trị Cốt Lõi</h2>
            <div className="w-20 h-1 bg-amber-800 mx-auto my-6"></div>
            <p className="text-lg text-stone-600">
              Tại Élite Coffee, các giá trị là kim chỉ nam cho mọi hoạt động – từ cách chọn hạt cà phê cho đến cách phục vụ khách hàng.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Chất Lượng Không Thỏa Hiệp",
                description:
                  "Chúng tôi chọn lọc và rang những hạt cà phê tốt nhất, đảm bảo mỗi tách đều mang đến trải nghiệm xuất sắc.",
              },
              {
                title: "Thu Mua Có Đạo Đức",
                description:
                  "Chúng tôi trả giá cao cho nông dân, đầu tư vào cộng đồng của họ và ưu tiên các phương pháp canh tác bền vững với môi trường.",
              },
              {
                title: "Tinh Hoa Nghề Rang",
                description:
                  "Những bậc thầy rang của chúng tôi có hàng chục năm kinh nghiệm, tạo ra hồ sơ rang hoàn hảo để làm nổi bật từng đặc trưng của hạt cà phê.",
              },
            ].map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-md">
                <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mb-6 text-xl font-bold">
                  {index + 1}
                </div>
                <h3 className="text-xl font-medium mb-4">{value.title}</h3>
                <p className="text-stone-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Đội ngũ */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl font-serif font-bold tracking-tight sm:text-4xl">Gặp Gỡ Đội Ngũ Của Chúng Tôi</h2>
            <div className="w-20 h-1 bg-amber-800 mx-auto my-6"></div>
            <p className="text-lg text-stone-600">
              Những con người đằng sau Élite Coffee – những người tạo nên sự xuất sắc mỗi ngày.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Maria Rodriguez",
                title: "Người sáng lập & Bậc thầy rang",
                image: "/placeholder.svg?height=400&width=400",
              },
              {
                name: "James Chen",
                title: "Trưởng bộ phận thu mua cà phê",
                image: "/placeholder.svg?height=400&width=400",
              },
              {
                name: "Sophia Williams",
                title: "Giám đốc thử nếm",
                image: "/placeholder.svg?height=400&width=400",
              },
              {
                name: "Michael Johnson",
                title: "Giám đốc phát triển bền vững",
                image: "/placeholder.svg?height=400&width=400",
              },
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="relative h-80 mb-6 rounded-xl overflow-hidden">
                  <img src={member.image || "/placeholder.svg"} alt={member.name} className="object-cover" />
                </div>
                <h3 className="text-xl font-medium">{member.name}</h3>
                <p className="text-stone-600">{member.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Phát triển bền vững */}
      <section className="py-20 bg-stone-900 text-white">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[500px] rounded-xl overflow-hidden">
              <img
                src="/placeholder.svg?height=1000&width=800"
                alt="Canh tác cà phê bền vững"
                className="object-cover"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-serif font-bold tracking-tight sm:text-4xl">
                Cam Kết Của Chúng Tôi Với Sự Bền Vững
              </h2>
              <div className="w-20 h-1 bg-amber-600"></div>
              <p className="text-lg text-stone-300">
                Chúng tôi tin rằng cà phê hảo hạng và trách nhiệm với môi trường luôn song hành. Cam kết bền vững của chúng tôi trải dài trên toàn chuỗi cung ứng.
              </p>
              <p className="text-lg text-stone-300">
                Chúng tôi hợp tác với nông dân sử dụng phương pháp hữu cơ và canh tác dưới bóng râm, giảm thiểu sử dụng phân bón hóa học và bảo tồn hệ sinh thái tự nhiên.
              </p>
              <p className="text-lg text-stone-300">
                Từ bao bì thân thiện với môi trường đến nhà máy rang tiết kiệm năng lượng, chúng tôi không ngừng giảm thiểu dấu chân môi trường trong khi vẫn duy trì chất lượng cà phê tốt nhất.
              </p>
              <Link
                to="/sustainability"
                className="inline-flex items-center justify-center rounded-md bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 mt-4"
              >
                Tìm Hiểu Thêm Về Sáng Kiến Của Chúng Tôi
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tuyển dụng */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-serif font-bold tracking-tight sm:text-4xl">Gia Nhập Đội Ngũ</h2>
            <div className="w-20 h-1 bg-amber-800 mx-auto"></div>
            <p className="text-lg text-stone-600">
              Chúng tôi luôn tìm kiếm những cá nhân đam mê, cùng chia sẻ tình yêu với cà phê và cam kết chất lượng cùng phát triển bền vững.
            </p>
            <Link
              to="/careers"
              className="inline-flex items-center justify-center rounded-md bg-amber-800 px-4 py-2 text-sm font-medium text-white hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            >
              Xem Vị Trí Tuyển Dụng <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
