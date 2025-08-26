import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Form, Input } from "antd";
import { toast } from "react-toastify";
import { MailOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "../../../services/authService";

export default function ForgotPasswordPage() {
  const [form] = Form.useForm();
  const [isEmailSent, setIsEmailSent] = useState(false);

  const mutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      setIsEmailSent(true);
      toast.success("Email khôi phục mật khẩu đã được gửi!");
    },
    onError: (error: any) => {
      const errors = error?.response?.data?.errors;
      if (errors && typeof errors === 'object') {
        const errorMessages = Object.values(errors).flat();
        if (errorMessages.length > 0) {
          toast.error(errorMessages[0] as string);
          return;
        }
      }
      const errorMessage = error?.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại!";
      toast.error(errorMessage);
    },
  });

  const onFinish = async (values: { email: string }) => {
    mutation.mutate(values.email);
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <MailOutlined className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-stone-900 mb-2">
              Email đã được gửi!
            </h2>
            <p className="text-stone-600 mb-6">
              Chúng tôi đã gửi hướng dẫn khôi phục mật khẩu đến email của bạn.
              Vui lòng kiểm tra hộp thư và làm theo hướng dẫn.
            </p>
            <div className="space-y-4">
              <p className="text-sm text-stone-500">
                Không nhận được email? Kiểm tra thư mục spam hoặc
              </p>
              <Button
                type="link"
                onClick={() => {
                  setIsEmailSent(false);
                  form.resetFields();
                }}
                className="text-amber-800 hover:text-amber-900"
              >
                Gửi lại email
              </Button>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/auth/login"
              className="inline-flex items-center text-amber-800 hover:text-amber-900 font-medium"
            >
              <ArrowLeftOutlined className="mr-2" />
              Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <img
              src="/z6887861436131_47d6a9f9e86b1d04f1a94932d5b53cad-removebg-preview.png"
              alt="Roast & Linger Logo"
              className="h-10 w-10 object-contain"
            />
            <span className="text-2xl font-serif font-bold tracking-tight">
              Roast & Linger
            </span>
          </Link>

          <h2 className="text-3xl font-bold text-stone-900 mb-2">
            Quên mật khẩu?
          </h2>
          <p className="text-stone-600">
            Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn khôi phục mật khẩu
          </p>
        </div>

        <Form
          form={form}
          name="forgot-password"
          onFinish={onFinish}
          layout="vertical"
          size="large"
          className="space-y-6"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập email!",
              },
              {
                type: "email",
                message: "Email không hợp lệ!",
              },
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-stone-400" />}
              placeholder="Nhập email của bạn"
              className="h-12"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={mutation.isPending}
              className="w-full h-12 bg-amber-800 hover:bg-amber-900 border-amber-800 hover:border-amber-900 text-white font-medium"
            >
              {mutation.isPending ? "Đang gửi..." : "Gửi email khôi phục"}
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center space-y-4">
          <Link
            to="/auth/login"
            className="inline-flex items-center text-amber-800 hover:text-amber-900 font-medium"
          >
            <ArrowLeftOutlined className="mr-2" />
            Quay lại đăng nhập
          </Link>

          <div className="text-sm text-stone-500">
            Chưa có tài khoản?{" "}
            <Link
              to="/auth/register"
              className="text-amber-800 hover:text-amber-900 font-medium"
            >
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
