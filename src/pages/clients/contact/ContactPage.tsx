import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input } from "antd";
import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import { toast } from "react-hot-toast";
import { sendContactForm } from "../../../services/contactService";
import type { IContactForm } from "../../../interfaces/contact";

const { TextArea } = Input;

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export default function ContactPage() {
  const [form] = Form.useForm();

  const mutation = useMutation<ApiResponse<any>, Error, IContactForm>({
    mutationFn: sendContactForm,
    onSuccess: () => {
      toast.success("Tin nhắn của bạn đã được gửi thành công!");
      form.resetFields();
    },
    onError: (error: any) => {
      if (error.response && error.response.data && error.response.data.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat();
        errorMessages.forEach((msg: any) => toast.error(msg));
      } else {
        toast.error(
          error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại."
        );
      }
    },
  });

  const onFinish = (values: IContactForm) => {
    mutation.mutate(values);
  };

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <h1 className="text-3xl font-serif font-bold tracking-tight mb-8">
        Liên Hệ Với Chúng Tôi
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="space-y-4"
          >
            <Form.Item
              name="name"
              label="Họ và tên"
              rules={[
                { required: true, message: "Vui lòng nhập họ tên!" },
                { max: 255, message: "Họ tên không được vượt quá 255 ký tự." },
              ]}
            >
              <Input placeholder="Nguyễn Văn A" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không đúng định dạng." },
              ]}
            >
              <Input placeholder="nguyenvana@example.com" />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Số điện thoại (không bắt buộc)"
              rules={[
                {
                  max: 20,
                  message: "Số điện thoại không được vượt quá 20 ký tự.",
                },
              ]}
            >
              <Input placeholder="0987654321" />
            </Form.Item>

            <Form.Item
              name="subject"
              label="Chủ đề"
              rules={[
                { required: true, message: "Vui lòng nhập chủ đề!" },
                { max: 255, message: "Chủ đề không được vượt quá 255 ký tự." },
              ]}
            >
              <Input placeholder="Hỏi về chính sách đại lý" />
            </Form.Item>

            <Form.Item
              name="message"
              label="Tin nhắn"
              rules={[
                { required: true, message: "Vui lòng nhập tin nhắn!" },
                { min: 10, message: "Tin nhắn phải có ít nhất 10 ký tự." },
                {
                  max: 2000,
                  message: "Tin nhắn không được vượt quá 2000 ký tự.",
                },
              ]}
            >
              <TextArea rows={6} placeholder="Nội dung tin nhắn của bạn..." />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={mutation.isPending}
                className="bg-amber-800 hover:bg-amber-900"
              >
                {mutation.isPending ? "Đang gửi..." : "Gửi Tin Nhắn"}
              </Button>
            </Form.Item>
          </Form>
        </div>

        {/* Contact Info Section */}
        <div className="space-y-8">
          <div className="bg-stone-50 p-6 rounded-lg">
            <h2 className="text-xl font-medium mb-4">Thông Tin Liên Hệ</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-amber-800 mt-1" />
                <div>
                  <p className="font-medium">Trụ Sở Chính Roast And Linger</p>
                  <p className="text-stone-600">FPT Polytechnic</p>
                  <p className="text-stone-600">Trịnh Văn Bô</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-amber-800" />
                <div>
                  <p className="font-medium">Số điện thoại</p>
                  <p className="text-stone-600">01234567890</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-amber-800" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-stone-600">roastandlinger@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-stone-50 p-6 rounded-lg">
            <h2 className="text-xl font-medium mb-4">Giờ Làm Việc</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Thứ Hai - Thứ Sáu</span>
                <span>9:00 - 18:00</span>
              </div>
              <div className="flex justify-between">
                <span>Thứ Bảy</span>
                <span>10:00 - 16:00</span>
              </div>
              <div className="flex justify-between">
                <span>Chủ Nhật</span>
                <span>Nghỉ</span>
              </div>
            </div>
          </div>
          <div className="bg-stone-50 p-6 rounded-lg">
            <h2 className="text-xl font-medium mb-4">Liên Hệ Phân Phối</h2>
            <p className="text-stone-600 mb-4">
              Bạn muốn phục vụ Élite Coffee tại quán hoặc nhà hàng? Chúng tôi có
              giá ưu đãi và hỗ trợ riêng cho đối tác phân phối.
            </p>
            <Link
              to="/wholesale"
              className="block text-center border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md font-medium w-full"
            >
              Tìm Hiểu Thêm
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-serif font-bold tracking-tight mb-6">
          Thăm Cửa Hàng Chính Của Chúng Tôi
        </h2>
        <div className="aspect-video bg-stone-200 rounded-lg">
          <div className="h-full w-full flex items-center justify-center">
            <iframe
              className="w-full h-full"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3369.902793207364!2d105.74468687471467!3d21.038134787457583!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313455e940879933%3A0xcf10b34e9f1a03df!2zVHLGsOG7nW5nIENhbyDEkeG6s25nIEZQVCBQb2x5dGVjaG5pYw!5e1!3m2!1svi!2s!4v1756116415989!5m2!1svi!2s"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>

      <div className="mt-12 bg-stone-50 p-8 rounded-lg">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-serif font-bold tracking-tight mb-4">
            Câu Hỏi Thường Gặp
          </h2>
          <p className="text-stone-600 mb-8">
            Tìm câu trả lời nhanh cho các thắc mắc phổ biến. Nếu không tìm thấy,
            hãy liên hệ với chúng tôi.
          </p>
          <div className="space-y-4 text-left">
            {[
              {
                question: "Phí vận chuyển như thế nào?",
                answer:
                  "Miễn phí vận chuyển với đơn hàng từ 500,000₫ trở lên. Dưới 500,000₫ sẽ tính phí cố định 30,000₫.",
              },
              {
                question: "Cà phê có tươi mới không?",
                answer:
                  "Tất cả cà phê được rang theo đơn và gửi đi trong vòng 24-48 giờ để đảm bảo độ tươi tối đa.",
              },
              {
                question: "Có vận chuyển quốc tế không?",
                answer:
                  "Có, chúng tôi vận chuyển đến một số quốc gia nhất định. Vui lòng liên hệ để biết thêm chi tiết.",
              },
              {
                question: "Chính sách đổi trả thế nào?",
                answer:
                  "Nếu bạn không hài lòng với sản phẩm, hãy liên hệ trong vòng 14 ngày để được hỗ trợ đổi/trả.",
              },
            ].map((faq, index) => (
              <div key={index} className="border-b pb-4 last:border-b-0">
                <h3 className="font-medium mb-2">{faq.question}</h3>
                <p className="text-stone-600 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
