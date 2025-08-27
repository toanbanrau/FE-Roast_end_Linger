import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-amber-50 text-center px-4">
      {/* Icon / hình minh hoạ */}
      <div className="mb-6">
        <span className="text-9xl">☕</span>
      </div>

      {/* Tiêu đề */}
      <h1 className="text-4xl font-bold text-amber-900 mb-2">
        404 - Không tìm thấy trang
      </h1>
      <p className="text-gray-600 mb-8">
        Có vẻ như bạn đã lạc vào xưởng rang cà phê của chúng tôi rồi ☕.  
        Hãy quay lại để tiếp tục thưởng thức hương vị tuyệt vời!
      </p>

      {/* Nút điều hướng */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/")}
          className="px-5 py-2 rounded-lg bg-amber-800 hover:bg-amber-900 text-white font-medium shadow-md transition"
        >
          Về Trang Chủ
        </button>
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 rounded-lg border border-amber-800 text-amber-800 hover:bg-amber-100 font-medium shadow-sm transition"
        >
          Quay Lại
        </button>
      </div>
    </div>
  );
}
