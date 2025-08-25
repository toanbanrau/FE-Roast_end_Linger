import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-stone-50">
      {/* Phần mở đầu */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <img
          src="https://media.istockphoto.com/id/1371315270/vi/anh/h%E1%BA%A1t-c%C3%A0-ph%C3%AA-trong-tay-m%E1%BB%99t-c%C3%B4ng-nh%C3%A2n.jpg?s=612x612&w=0&k=20&c=U1fYGg5t4WPyKKazgb6YKyiZyM2EwRC6YPM42MLzlxg="
          alt="Đồn điền cà phê"
          className="absolute inset-0 object-cover w-full h-full brightness-50"
        />
        <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <h1 className="text-4xl font-serif font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Câu Chuyện Của Chúng Tôi
            </h1>
            <p className="text-lg text-stone-200 sm:text-xl lg:text-2xl">
              Hành trình của đam mê, chất lượng và bền vững trong từng tách cà
              phê.
            </p>
          </div>
        </div>
      </section>

      {/* Lịch sử */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-serif font-bold tracking-tight text-stone-800 sm:text-4xl">
                Hành Trình Của Chúng Tôi
              </h2>
              <div className="w-16 h-1 bg-amber-700"></div>
              <p className="text-base text-stone-600 leading-relaxed sm:text-lg">
                Được thành lập vào năm 1992 bởi người đam mê cà phê Maria
                Rodriguez, Roast And Linger bắt đầu là một xưởng rang nhỏ tại
                Seattle với sứ mệnh đơn giản: tìm nguồn và rang những hạt cà phê
                ngon nhất thế giới với sự tận tâm và chân thành.
              </p>
              <p className="text-base text-stone-600 leading-relaxed sm:text-lg">
                Từ một dự án đam mê, chúng tôi nhanh chóng được công nhận nhờ
                chất lượng vượt trội và cam kết với việc thu mua đạo đức. Sau
                hơn ba thập kỷ, chúng tôi đã phát triển từ một thương hiệu địa
                phương thành một tên tuổi quốc tế, nhưng giá trị cốt lõi thì vẫn
                vẹn nguyên.
              </p>
              <p className="text-base text-stone-600 leading-relaxed sm:text-lg">
                Ngày nay, chúng tôi vẫn tiếp tục rong ruổi khắp thế giới để tìm
                kiếm những hạt cà phê xuất sắc, xây dựng mối quan hệ lâu dài với
                nông dân có cùng cam kết về chất lượng và phát triển bền vững.
              </p>
            </div>
            <div className="relative h-80 sm:h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-lg">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRguBK4MEdK7oE48pqq9mV_v6GRgjiyhjr5pA&s"
                alt="Lịch sử quán cà phê"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Giá trị cốt lõi */}
      <section className="py-16 sm:py-24 bg-stone-100">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl font-serif font-bold tracking-tight text-stone-800 sm:text-4xl">
              Giá Trị Mang Lại
            </h2>
            <div className="w-16 h-1 bg-amber-700 mx-auto"></div>
            <p className="text-base text-stone-600 sm:text-lg">
              Tại Roast And Linger, các giá trị là kim chỉ nam cho mọi hoạt động
              - từ cách chọn hạt cà phê cho đến cách phục vụ khách hàng.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
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
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-10 h-10 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mb-4 text-lg font-bold">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold text-stone-800 mb-2">
                  {value.title}
                </h3>
                <p className="text-base text-stone-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Đội ngũ */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl font-serif font-bold tracking-tight text-stone-800 sm:text-4xl">
              Gặp Gỡ Đội Ngũ Của Chúng Tôi
            </h2>
            <div className="w-16 h-1 bg-amber-700 mx-auto"></div>
            <p className="text-base text-stone-600 sm:text-lg">
              Những con người đằng sau Roast And Linger - những người tạo nên sự
              xuất sắc mỗi ngày.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              {
                name: "Thiều Văn Hạnh Toàn",
                title: "Người sáng lập & Bậc thầy rang",
                image: "/placeholder.svg?height=400&width=400",
              },
              {
                name: "Cao Thế Anh",
                title: "Trưởng bộ phận thu mua cà phê",
                image: "/placeholder.svg?height=400&width=400",
              },
              {
                name: "Nguyễn Duy",
                title: "Giám đốc thử nếm",
                image: "/placeholder.svg?height=400&width=400",
              },
              {
                name: "Tuấn Ngô",
                title: "Giám đốc phát triển bền vững",
                image: "/placeholder.svg?height=400&width=400",
              },
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden shadow-md mb-4">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-lg font-semibold text-stone-800">
                  {member.name}
                </h3>
                <p className="text-base text-stone-600">{member.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Phát triển bền vững */}
      <section className="py-16 sm:py-24 bg-stone-900 text-white">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="relative h-80 sm:h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-lg">
              <img
                src="/placeholder.svg?height=1000&width=800"
                alt="Canh tác cà phê bền vững"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-serif font-bold tracking-tight sm:text-4xl">
                Cam Đoan Của Chúng Tôi Với Sự Vững Mạnh
              </h2>
              <div className="w-16 h-1 bg-amber-600"></div>
              <p className="text-base text-stone-300 leading-relaxed sm:text-lg">
                Chúng tôi tin rằng cà phê hảo hạng và trách nhiệm với môi trường
                luôn song hành. Cam kết bền vững của chúng tôi trải dài trên
                toàn chuỗi cung ứng.
              </p>
              <p className="text-base text-stone-300 leading-relaxed sm:text-lg">
                Chúng tôi hợp tác với nông dân sử dụng phương pháp hữu cơ và
                canh tác dưới bóng râm, giảm thiểu sử dụng phân bón hóa học và
                bảo tồn hệ sinh thái tự nhiên.
              </p>
              <p className="text-base text-stone-300 leading-relaxed sm:text-lg">
                Từ bao bì thân thiện với môi trường đến nhà máy rang tiết kiệm
                năng lượng, chúng tôi không ngừng giảm thiểu dấu chân môi trường
                trong khi vẫn duy trì chất lượng cà phê tốt nhất.
              </p>
              <Link
                to="/sustainability"
                className="inline-flex items-center justify-center rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Tìm Hiểu Thêm Về Sáng Kiến Của Chúng Tôi
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tuyển dụng */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-serif font-bold tracking-tight text-stone-800 sm:text-4xl">
              Gia Nhập Đội Ngũ
            </h2>
            <div className="w-16 h-1 bg-amber-700 mx-auto"></div>
            <p className="text-base text-stone-600 sm:text-lg">
              Chúng tôi luôn tìm kiếm những cá nhân đam mê, cùng chia sẻ tình
              yêu với cà phê và cam kết chất lượng cùng phát triển bền vững.
            </p>
            <Link
              to="/careers"
              className="inline-flex items-center justify-center rounded-lg bg-amber-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Xem Vị Trí Tuyển Dụng <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
