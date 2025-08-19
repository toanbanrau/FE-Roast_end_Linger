import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button, Form, Input, message } from "antd";
import { LockOutlined, ArrowLeftOutlined, EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../../../services/authService";

export default function ResetPasswordPage() {
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  useEffect(() => {
    if (!token || !email) {
      message.error("Link khôi phục mật khẩu không hợp lệ!");
      navigate("/auth/forgot-password");
    }
  }, [token, email, navigate]);

  const mutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      setIsSuccess(true);
      message.success("Đặt lại mật khẩu thành công!");
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại!");
    },
  });

  const onFinish = async (values: { password: string; password_confirmation: string }) => {
    if (!token || !email) return;
    
    mutation.mutate({
      token,
      email,
      password: values.password,
      password_confirmation: values.password_confirmation,
    });
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <LockOutlined className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-stone-900 mb-2">
              Đặt lại mật khẩu thành công!
            </h2>
            <p className="text-stone-600 mb-6">
              Mật khẩu của bạn đã được cập nhật thành công. 
              Bây giờ bạn có thể đăng nhập với mật khẩu mới.
            </p>
          </div>
          
          <div className="text-center">
            <Link
              to="/auth/login"
              className="inline-flex items-center justify-center w-full px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white font-medium rounded-md transition-colors"
            >
              Đăng nhập ngay
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
            Đặt lại mật khẩu
          </h2>
          <p className="text-stone-600">
            Nhập mật khẩu mới cho tài khoản của bạn
          </p>
        </div>

        <Form
          form={form}
          name="reset-password"
          onFinish={onFinish}
          layout="vertical"
          size="large"
          className="space-y-6"
        >
          <Form.Item
            name="password"
            label="Mật khẩu mới"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu mới!",
              },
              {
                min: 6,
                message: "Mật khẩu phải có ít nhất 6 ký tự!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-stone-400" />}
              placeholder="Nhập mật khẩu mới"
              className="h-12"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item
            name="password_confirmation"
            label="Xác nhận mật khẩu"
            dependencies={['password']}
            rules={[
              {
                required: true,
                message: "Vui lòng xác nhận mật khẩu!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-stone-400" />}
              placeholder="Nhập lại mật khẩu mới"
              className="h-12"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={mutation.isPending}
              className="w-full h-12 bg-amber-800 hover:bg-amber-900 border-amber-800 hover:border-amber-900 text-white font-medium"
            >
              {mutation.isPending ? "Đang cập nhật..." : "Đặt lại mật khẩu"}
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
        </div>
      </div>
    </div>
  );
}
