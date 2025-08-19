import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Coffee } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useUserStore } from "../../../stores/useUserStore";
import { FcGoogle } from "react-icons/fc";
import { getGoogleAuthUrl } from "../../../services/authService";

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { login } = useUserStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      toast.success("Đăng nhập thành công!");
      navigate("/");
    },
    onError: (error) => {
      toast.error("Đăng nhập thất bại. Vui lòng thử lại!");
      console.error("Login error:", error);
    },
  });

  const googleLoginMutation = useMutation({
    mutationFn: getGoogleAuthUrl,
    onSuccess: (data) => {
      if (data.success && data.data?.auth_url) {
        // Redirect to Google OAuth
        window.location.href = data.data.auth_url;
      } else {
        throw new Error(data.message || "Không thể lấy URL đăng nhập Google");
      }
    },
    onError: (error: any) => {
      console.error("Google login error:", error);
      toast.error(
        error?.response?.data?.message ||
        "Không thể đăng nhập bằng Google. Vui lòng thử lại!"
      );
      setIsGoogleLoading(false);
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    await mutation.mutateAsync({ email: data.email, password: data.password });
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    googleLoginMutation.mutate();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center gap-2 mb-6">
            <Coffee className="h-8 w-8 text-amber-800" />
            <span className="text-2xl font-serif font-bold tracking-tight">
              Élite Coffee
            </span>
          </Link>
          <h2 className="text-3xl font-serif font-bold text-stone-900">
            Chào mừng trở lại
          </h2>
          <p className="mt-2 text-stone-600">Đăng nhập để tiếp tục</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-stone-700"
              >
                Địa chỉ email
              </label>
              <input
                id="email"
                type="text"
                autoComplete="email"
                {...register("email", {
                  required: "Email là bắt buộc",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email không hợp lệ",
                  },
                })}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-amber-800 focus:border-amber-800 ${
                  errors.email ? "border-red-500" : "border-stone-300"
                }`}
                placeholder="Nhập email của bạn"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-stone-700"
              >
                Mật khẩu
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  {...register("password", {
                    required: "Mật khẩu là bắt buộc",
                    minLength: {
                      value: 6,
                      message: "Mật khẩu phải có ít nhất 6 ký tự",
                    },
                  })}
                  className={`block w-full px-3 py-2 pr-10 border rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-amber-800 focus:border-amber-800 ${
                    errors.password ? "border-red-500" : "border-stone-300"
                  }`}
                  placeholder="Nhập mật khẩu"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-stone-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-stone-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="rememberMe"
                type="checkbox"
                {...register("rememberMe")}
                className="h-4 w-4 text-amber-800 focus:ring-amber-800 border-stone-300 rounded"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 block text-sm text-stone-700"
              >
                Ghi nhớ đăng nhập
              </label>
            </div>

            <div className="text-sm">
              <Link
                to="/auth/forgot-password"
                className="text-amber-800 hover:text-amber-900 font-medium"
              >
                Quên mật khẩu?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting || mutation.isPending}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-amber-800 hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting || mutation.isPending
                ? "Đang đăng nhập..."
                : "Đăng nhập"}
            </button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-stone-50 text-stone-500">
                  Hoặc tiếp tục với
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading || googleLoginMutation.isPending}
                className="w-full inline-flex justify-center py-2 px-4 border border-stone-300 rounded-md shadow-sm bg-white text-sm font-medium text-stone-500 hover:bg-stone-50 hover:border-amber-800 hover:text-amber-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FcGoogle className="h-5 w-5" />
                <span className="ml-2">
                  {isGoogleLoading || googleLoginMutation.isPending
                    ? "Đang xử lý..."
                    : "Đăng nhập bằng Google"
                  }
                </span>
              </button>
            </div>
          </div>

          <div className="text-center">
            <span className="text-stone-600">Chưa có tài khoản? </span>
            <Link
              to="/auth/register"
              className="text-amber-800 hover:text-amber-900 font-medium"
            >
              Đăng ký ngay
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
