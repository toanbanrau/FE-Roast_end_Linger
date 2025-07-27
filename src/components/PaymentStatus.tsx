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
  phaseInfo: PhaseInfo;
  checkCount: number;
  timeElapsed: number;
  loading: boolean;
  onManualCheck?: () => void;
}

export const PaymentStatus: React.FC<PaymentStatusProps> = ({
  status,
  phaseInfo,
  checkCount,
  timeElapsed,
  loading,
  onManualCheck,
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

      <div className="flex justify-between text-sm text-gray-600 mb-4">
        <span>
          Trạng thái:{" "}
          <strong style={{ color: getPaymentStatusColor(status) }}>
            {getPaymentStatusText(status)}
          </strong>
        </span>
        <span>
          Thời gian: <strong>{formatTime(timeElapsed)}</strong>
        </span>
        <span>
          Lần kiểm tra: <strong>{checkCount}</strong>
        </span>
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
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
          <p className="text-green-700 font-medium">
            ✅ Thanh toán đã được xác nhận thành công!
          </p>
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
    </div>
  );
};

export default PaymentStatus;
