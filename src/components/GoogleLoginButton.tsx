import { useState } from "react";
import { Button, message } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { getGoogleAuthUrl } from "../services/authService";

interface GoogleLoginButtonProps {
  className?: string;
  size?: "small" | "middle" | "large";
  block?: boolean;
  text?: string;
}

export default function GoogleLoginButton({ 
  className = "",
  size = "large",
  block = false,
  text = "Đăng nhập bằng Google"
}: GoogleLoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const mutation = useMutation({
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
      message.error(
        error?.response?.data?.message || 
        "Không thể đăng nhập bằng Google. Vui lòng thử lại!"
      );
      setIsLoading(false);
    },
  });

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    mutation.mutate();
  };

  return (
    <Button
      type="default"
      size={size}
      block={block}
      loading={isLoading || mutation.isPending}
      onClick={handleGoogleLogin}
      className={`flex items-center justify-center gap-2 border-gray-300 hover:border-amber-800 hover:text-amber-800 ${className}`}
      icon={<GoogleOutlined />}
    >
      {isLoading || mutation.isPending ? "Đang xử lý..." : text}
    </Button>
  );
}
