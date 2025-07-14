import React from "react";
import { RefreshCw, Clock, CheckCircle, XCircle } from "lucide-react";
import {
  formatTime,
  getPaymentStatusColor,
  getPaymentStatusText,
  getPaymentStatusMessage,
} from "../services/paymentService";

interface PhaseInfo {
  name: string;
  interval: number;
  duration: number;
  icon: string;
  description: string;
}

interface PaymentStatusProps {
  status: "pending" | "completed" | "failed";
  phase: number;
  phaseInfo: PhaseInfo;
  checkCount: number;
  timeElapsed: number;
  loading: boolean;
  onManualCheck?: () => void;
  onStatusUpdate?: (data: any) => void;
}

export const PaymentStatus: React.FC<PaymentStatusProps> = ({
  status,
  phase,
  phaseInfo,
  checkCount,
  timeElapsed,
  loading,
  onManualCheck,
  onStatusUpdate,
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case "failed":
        return <XCircle className="w-6 h-6 text-red-600" />;
      case "pending":
        return <Clock className="w-6 h-6 text-yellow-600" />;
      default:
        return <RefreshCw className="w-6 h-6" />;
    }
  };

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg p-4 mb-4 transition-all duration-300 ease-in-out"
      style={{
        opacity: loading && status === "pending" ? 0.9 : 1,
        transform: loading && status === "pending" ? "scale(0.99)" : "scale(1)",
      }}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2 text-2xl">
          <span>{phaseInfo?.icon || "⏳"}</span>
          {getStatusIcon()}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800">
            {getPaymentStatusMessage(status)}
          </h4>
          <p className="text-sm text-gray-600">
            {phaseInfo?.name} Phase - {phaseInfo?.description}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="text-xs text-gray-500 mb-1">Trạng thái</div>
          <div
            className="font-semibold"
            style={{ color: getPaymentStatusColor(status) }}
          >
            {getPaymentStatusText(status)}
          </div>
        </div>

        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="text-xs text-gray-500 mb-1">Lần kiểm tra</div>
          <div className="font-semibold text-gray-800">{checkCount}</div>
        </div>

        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="text-xs text-gray-500 mb-1">Thời gian</div>
          <div className="font-semibold text-gray-800">
            {formatTime(timeElapsed)}
          </div>
        </div>

        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="text-xs text-gray-500 mb-1">Giai đoạn</div>
          <div className="font-semibold text-gray-800">{phase}/4</div>
        </div>
      </div>

      {loading && status === "pending" && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg text-blue-700 mb-4">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span className="text-sm">Đang kiểm tra thanh toán...</span>
        </div>
      )}

      {status === "pending" && (
        <div className="flex flex-col gap-3">
          <button
            onClick={onManualCheck}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Đang kiểm tra..." : "Kiểm tra ngay"}
          </button>

          <div className="text-xs text-amber-700 bg-amber-50 rounded p-2">
            💡 <strong>Debug:</strong> Nếu đã chuyển khoản thành công, click
            "Kiểm tra ngay" để force check API
          </div>

          {/* Temporary debug button */}
          <button
            onClick={() => {
              console.log("🧪 MOCK SUCCESS - For testing only");
              // Mock completed response for testing
              const mockData = {
                payment_id: 123,
                status: "completed",
                completed_at: new Date().toISOString(),
                detection_method: "manual_test",
              };
              onStatusUpdate?.(mockData);
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
          >
            🧪 Mock Success (Test Only)
          </button>

          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <span className="text-green-600 text-lg">💡</span>
              <div className="text-sm text-green-700">
                <p className="font-medium">
                  Hệ thống phát hiện thanh toán siêu nhanh!
                </p>
                <p>Hầu hết thanh toán được phát hiện trong vòng 5-15 giây.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {status === "completed" && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-green-700">⚡ Thời gian phát hiện:</span>
              <span className="font-semibold text-green-800">
                {formatTime(timeElapsed)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">🔍 Số lần kiểm tra:</span>
              <span className="font-semibold text-green-800">{checkCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">🎯 Hiệu suất:</span>
              <span className="font-semibold text-green-800">
                {timeElapsed < 10000
                  ? "Xuất sắc"
                  : timeElapsed < 30000
                  ? "Tốt"
                  : "Bình thường"}
              </span>
            </div>
          </div>
        </div>
      )}

      {status === "failed" && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
          <p className="text-red-700 mb-3">
            Vui lòng kiểm tra lại thông tin chuyển khoản hoặc thử lại.
          </p>
          <button
            onClick={onManualCheck}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <RefreshCw className="w-4 h-4 inline mr-2" />
            Thử lại
          </button>
        </div>
      )}

      {/* Phase Progress Bar */}
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: `${(phase / 4) * 100}%`,
              backgroundColor: getPaymentStatusColor(status),
            }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          {["Lightning", "Rapid", "Fast", "Standard"].map(
            (phaseName, index) => (
              <span
                key={phaseName}
                className={`${
                  index + 1 <= phase ? "text-amber-600 font-medium" : ""
                }`}
              >
                {phaseName}
              </span>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentStatus;
