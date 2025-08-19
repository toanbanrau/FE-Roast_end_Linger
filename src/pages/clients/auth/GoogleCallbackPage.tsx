import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { handleGoogleCallback } from "../../../services/authService";
import { useUserStore } from "../../../stores/useUserStore";
import { clientAxios } from "../../../configs/config";
import toast from "react-hot-toast";

export default function GoogleCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser, setToken } = useUserStore();
  const [isProcessed, setIsProcessed] = useState(false);

  const mutation = useMutation({
    mutationFn: handleGoogleCallback,
    onSuccess: (data) => {
      console.log("Google callback response:", data);

      if (data.success && data.data) {
        // Save user data and token (response có token thay vì access_token)
        console.log("Saving user:", data.data.user);
        console.log("Saving token:", data.data.token);

        setUser(data.data.user);
        setToken(data.data.token);

        toast.success(data.message || "Đăng nhập Google thành công!");

        // Redirect to intended page or home
        const redirectTo = localStorage.getItem("redirectAfterLogin") || "/";
        localStorage.removeItem("redirectAfterLogin");
        navigate(redirectTo, { replace: true });
      } else {
        throw new Error(data.message || "Đăng nhập Google thất bại");
      }
    },
    onError: (error: any) => {
      console.error("Google callback error:", error);
      toast.error(
        error?.response?.data?.message || 
        "Đăng nhập Google thất bại. Vui lòng thử lại!"
      );
      navigate("/auth/login", { replace: true });
    },
  });

  useEffect(() => {
    if (isProcessed) return; // Prevent multiple executions

    // Check for new backend format: login=success&token=xxx&user_id=xxx&user_name=xxx&user_email=xxx
    const login = searchParams.get("login");
    const token = searchParams.get("token");
    const userId = searchParams.get("user_id");
    const userName = searchParams.get("user_name");
    const userEmail = searchParams.get("user_email");
    const expiresAt = searchParams.get("expires_at");

    if (login === "success" && token && userId && userName && userEmail) {
      console.log("Google login success with new format:", {
        token,
        userId,
        userName: decodeURIComponent(userName),
        userEmail: decodeURIComponent(userEmail),
        expiresAt
      });

      // Save token first
      setToken(token);
      setIsProcessed(true); // Mark as processed

      // Fetch full user data from backend using the token
      const fetchUserData = async () => {
        try {
          // Set token in axios header for this request
          const response = await clientAxios.get("/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (response.data.success && response.data.data) {
            console.log("Full user data from backend:", response.data.data);
            setUser(response.data.data);
            // Chỉ hiển thị toast một lần ở cuối
          } else {
            throw new Error("Không thể lấy thông tin user");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Fallback: use basic user info from URL
          const basicUser = {
            id: parseInt(userId),
            name: decodeURIComponent(userName),
            full_name: decodeURIComponent(userName),
            email: decodeURIComponent(userEmail),
            role: "user",
            status: "active",
            provider: "google",
            email_verified_at: new Date().toISOString(),
          };
          setUser(basicUser);
          // Chỉ hiển thị toast một lần ở cuối
        } finally {
          // Navigate after user data is set (toast đã hiển thị ở mutation)
          setTimeout(() => {
            navigate("/", { replace: true });
          }, 100);
        }
      };

      fetchUserData();
      return;
    }

    // Check for old format: success=true&token=xxx&user=base64
    const success = searchParams.get("success");
    const error = searchParams.get("error");
    const userParam = searchParams.get("user");

    if (success === "true" && token && userParam) {
      try {
        const user = JSON.parse(atob(userParam));
        console.log("Direct success from backend (old format):", { user, token });

        setUser(user);
        setToken(token);
        setIsProcessed(true);

        // Bỏ toast ở đây để tránh duplicate với mutation
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 100);
        return;
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }

    if (success === "false" || error) {
      toast.error(error || "Đăng nhập Google thất bại");
      navigate("/auth/login", { replace: true });
      return;
    }

    // Fallback: handle code from Google (original flow)
    const code = searchParams.get("code");
    const googleError = searchParams.get("error");

    if (googleError) {
      toast.error("Đăng nhập Google bị hủy hoặc có lỗi");
      navigate("/auth/login", { replace: true });
      return;
    }

    if (code) {
      mutation.mutate(code);
    } else {
      toast.error("Không nhận được mã xác thực từ Google");
      navigate("/auth/login", { replace: true });
    }
  }, [searchParams, isProcessed]); // Simplified dependencies

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="text-center">
        <Spin
          indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
          size="large"
        />
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-stone-900 mb-2">
            Đang xử lý đăng nhập Google...
          </h2>
          <p className="text-stone-600 mb-4">
            Vui lòng đợi trong giây lát
          </p>

          {/* Fallback buttons nếu bị stuck */}
          <div className="mt-8 space-y-2">
            <div>
              <button
                onClick={() => {
                  // Thử lấy data từ backend response nếu có
                  const currentUrl = window.location.href;
                  if (currentUrl.includes('127.0.0.1:8000')) {
                    // User đang ở backend URL, redirect về frontend
                    window.location.href = 'http://localhost:5173/auth/google/callback';
                  } else {
                    navigate("/auth/login");
                  }
                }}
                className="bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-md text-sm"
              >
                Hoàn tất đăng nhập
              </button>
            </div>
            <div>
              <button
                onClick={() => navigate("/auth/login")}
                className="text-amber-800 hover:text-amber-900 underline text-sm"
              >
                Quay lại trang đăng nhập
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
