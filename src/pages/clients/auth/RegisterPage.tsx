import { useState } from "react";

import { Coffee } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { register as registerService } from "../../../services/authService";
import type { UserRegister } from "../../../interfaces/user";
import { toast } from "react-toastify";

const RegisterPage = () => {
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UserRegister>();

  const mutation = useMutation({
    mutationFn: registerService,
    onSuccess: () => {
      toast.success(
        "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản."
      );
      setTimeout(() => navigate("/auth/login"), 1500);
    },
    onError: (error: unknown) => {
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as any).response === "object" &&
        (error as any).response !== null &&
        "data" in (error as any).response &&
        typeof (error as any).response.data === "object" &&
        (error as any).response.data !== null &&
        "errors" in (error as any).response.data
      ) {
        const errs = (error as any).response.data.errors as Record<
          string,
          string[]
        >;
        Object.values(errs).forEach((errArr) => alert(errArr[0]));
      } else {
        alert("Đăng ký thất bại. Vui lòng thử lại!");
      }
    },
  });

  const onSubmit = (values: UserRegister) => {
    mutation.mutate({
      ...values,
      date_of_birth: values.date_of_birth || "",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center gap-2 mb-6">
            <Coffee className="h-8 w-8 text-amber-800" />
            <span className="text-2xl font-serif font-bold tracking-tight">
              Roast And Linger
            </span>
          </Link>
          <h2 className="text-3xl font-serif font-bold text-stone-900">
            Đăng ký tài khoản
          </h2>
          <p className="mt-2 text-stone-600">
            Tạo tài khoản để trải nghiệm dịch vụ tốt nhất
          </p>
        </div>

        <form
          className="mt-8 space-y-6 bg-white p-6 rounded shadow"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="space-y-4">

            <div>
              <label className="block text-sm font-medium text-stone-700">
                Họ và tên
              </label>
              <input
                type="text"
                {...register("full_name", {
                  required: "Vui lòng nhập họ tên!",
                })}
                className="mt-1 block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-amber-800 focus:border-amber-800"
                placeholder="Nhập họ tên"
              />
              {errors.full_name && (
                <span className="text-red-500 text-xs">
                  {errors.full_name.message}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700">
                Email
              </label>
              <input
                type="email"
                {...register("email", {
                  required: "Vui lòng nhập email!",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Email không hợp lệ!",
                  },
                })}
                className="mt-1 block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-amber-800 focus:border-amber-800"
                placeholder="Nhập email"
              />
              {errors.email && (
                <span className="text-red-500 text-xs">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700">
                Mật khẩu
              </label>
              <input
                type="password"
                {...register("password", {
                  required: "Vui lòng nhập mật khẩu!",
                  minLength: {
                    value: 8,
                    message: "Mật khẩu phải có ít nhất 8 ký tự!",
                  },
                  validate: {
                    hasUpperCase: (value) =>
                      /[A-Z]/.test(value) ||
                      "Mật khẩu phải chứa ít nhất một chữ hoa.",
                    hasLowerCase: (value) =>
                      /[a-z]/.test(value) ||
                      "Mật khẩu phải chứa ít nhất một chữ thường.",
                    hasNumber: (value) =>
                      /\d/.test(value) || "Mật khẩu phải chứa ít nhất một số.",
                    hasSpecialChar: (value) =>
                      /[!@#$%^&*(),.?\":{}|<>]/.test(value) ||
                      "Mật khẩu phải chứa ít nhất một ký tự đặc biệt.",
                  },
                })}
                className="mt-1 block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-amber-800 focus:border-amber-800"
                placeholder="Nhập mật khẩu"
              />
              {errors.password && (
                <span className="text-red-500 text-xs">
                  {errors.password.message}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700">
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                {...register("password_confirmation", {
                  required: "Vui lòng xác nhận mật khẩu!",
                  validate: (value) =>
                    value === watch("password") ||
                    "Mật khẩu xác nhận không khớp!",
                })}
                className="mt-1 block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-amber-800 focus:border-amber-800"
                placeholder="Nhập lại mật khẩu"
              />
              {errors.password_confirmation && (
                <span className="text-red-500 text-xs">
                  {errors.password_confirmation.message}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700">
                Địa chỉ
              </label>
              <input
                type="text"
                {...register("address")}
                className="mt-1 block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-amber-800 focus:border-amber-800"
                placeholder="Nhập địa chỉ (không bắt buộc)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700">
                Số điện thoại
              </label>
              <input
                type="text"
                {...register("phone_number")}
                className="mt-1 block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-amber-800 focus:border-amber-800"
                placeholder="Nhập số điện thoại (không bắt buộc)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700">
                Ngày sinh
              </label>
              <input
                type="date"
                {...register("date_of_birth")}
                className="mt-1 block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-amber-800 focus:border-amber-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700">
                Giới tính
              </label>
              <select
                {...register("gender")}
                className="mt-1 block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-800 focus:border-amber-800"
                defaultValue=""
              >
                <option value="">Chọn giới tính</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-amber-800 hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-800 mt-4 disabled:bg-amber-600"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang xử lý...
              </>
            ) : (
              "Đăng ký"
            )}
          </button>
          <div className="text-center mt-2">
            Đã có tài khoản?{" "}
            <Link
              to="/auth/login"
              className="text-amber-800 hover:text-amber-900 font-medium"
            >
              Đăng nhập
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
