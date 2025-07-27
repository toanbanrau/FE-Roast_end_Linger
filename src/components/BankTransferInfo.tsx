import React, { useState } from "react";
import { Copy, CheckCircle, Clock, CreditCard } from "lucide-react";
import { toast } from "react-toastify";
import { useUltraPaymentTracking } from "../hooks/useUltraPaymentTracking";
import PaymentStatus from "./PaymentStatus";

// SEPAY Bank Info Interface
interface SepayBankInfo {
  bank_name: string;
  bank_code: string;
  account_number: string;
  account_name: string;
  // Legacy support
  name?: string;
  branch?: string;
}

// SEPAY Instructions Interface
interface SepayInstructions {
  step_1: string;
  step_2: string;
  step_3: string;
  step_4: string;
}

// Legacy QR Code Info Interface (for backward compatibility)
interface QRCodeInfo {
  viet_qr_url: string;
  instructions: {
    step_1: string;
    step_2: string;
    step_3: string;
    step_4: string;
    step_5: string;
  };
}

// SEPAY Transaction Interface
interface SepayTransaction {
  id: string;
  transaction_date: string;
  amount_in: number;
  transaction_content: string;
  reference_number: string;
  bank_brand_name: string;
  account_number: string;
}

// SEPAY Check Interface
interface SepayCheck {
  checked_at: string;
  api_response_time_ms: number;
  transactions_found: number;
  matching_transaction: SepayTransaction | null;
}

// Enhanced Payment Info Interface (supports both legacy and SEPAY)
interface PaymentInfo {
  // SEPAY fields
  payment_id?: number;
  method: string;
  payment_gateway?: string;
  amount: number | string;
  formatted_amount: string;
  transaction_id?: string;
  tracking_content?: string;
  qr_code?: string | QRCodeInfo;
  bank_info?: SepayBankInfo;
  auto_confirm?: boolean;
  expires_at?: string;
  instructions?: SepayInstructions;
  sepay_check?: SepayCheck;
  sepay_transaction?: SepayTransaction;
  completed_at?: string;
  detection_method?: string;

  // Legacy fields (for backward compatibility)
  transfer_content?: string;
  qr_code_enabled?: boolean;
}

interface BankTransferInfoProps {
  paymentInfo: PaymentInfo;
  orderNumber: string;
}

const BankTransferInfo: React.FC<BankTransferInfoProps> = ({
  paymentInfo,
  orderNumber,
}) => {
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  // Ultra-fast payment tracking nếu có payment_id
  const {
    status: paymentStatus,
    loading: checkingPayment,
    phase,
    phaseInfo,
    checkCount,
    timeElapsed,
    manualCheck,
  } = useUltraPaymentTracking(paymentInfo?.payment_id || null, {
    onPaymentCompleted: () => {
      setPaymentCompleted(true);
      toast.success("🎉 Thanh toán thành công! Đơn hàng đã được xác nhận.");
    },
    onPaymentFailed: () => {
      toast.error("❌ Thanh toán thất bại. Vui lòng thử lại.");
    },
    onStatusUpdate: (data) => {
      console.log("Payment status update:", data);
    },
  });

  // Guard clause - Kiểm tra paymentInfo có tồn tại không
  if (!paymentInfo) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">Không có thông tin thanh toán</p>
      </div>
    );
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success(`Đã sao chép ${label}!`);
      })
      .catch(() => {
        toast.error("Không thể sao chép. Vui lòng sao chép thủ công.");
      });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
        <div className="flex items-center gap-3">
          <CreditCard className="h-8 w-8" />
          <div>
            <h2 className="text-2xl font-bold">Thông Tin Chuyển Khoản</h2>
            <p className="text-green-100">Đơn hàng: {orderNumber}</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Payment Status - Hiển thị khi có payment_id */}
        {paymentInfo.payment_id && (
          <PaymentStatus
            status={paymentStatus}
            phase={phase}
            phaseInfo={phaseInfo}
            checkCount={checkCount}
            timeElapsed={timeElapsed}
            loading={checkingPayment}
            onManualCheck={manualCheck}
            onStatusUpdate={(data) => {
              console.log("Payment status update from PaymentStatus:", data);
              if (data.status === "completed") {
                setPaymentCompleted(true);
                toast.success("🎉 Thanh toán thành công!");
              }
            }}
          />
        )}

        {/* Success Message */}
        {paymentCompleted && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <h4 className="font-semibold text-green-800">
                  Thanh toán thành công!
                </h4>
                <p className="text-sm text-green-700">
                  Đơn hàng {orderNumber} đã được xác nhận và đang được xử lý.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* QR Code Section */}
        {(paymentInfo.qr_code_enabled || paymentInfo.qr_code) &&
          !paymentCompleted && (
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center justify-center gap-2">
                📱 Quét QR Code để thanh toán
                {paymentInfo.payment_id && (
                  <span className="text-sm font-normal text-blue-600">
                    (Tự động phát hiện thanh toán)
                  </span>
                )}
              </h3>
              <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg shadow-sm">
                <img
                  src={
                    typeof paymentInfo.qr_code === "string"
                      ? paymentInfo.qr_code
                      : paymentInfo.qr_code?.viet_qr_url
                  }
                  alt="VietQR Code"
                  className="w-64 h-64 mx-auto"
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Sử dụng app ngân hàng để quét mã QR
              </p>
              {paymentInfo.payment_id && (
                <div className="mt-3 text-xs text-blue-600 bg-blue-50 rounded-lg p-2">
                  💡 Hệ thống sẽ tự động phát hiện thanh toán trong vòng 5-15
                  giây
                </div>
              )}
            </div>
          )}

        {/* Bank Information */}
        {paymentInfo.bank_info && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Thông Tin Tài Khoản
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Ngân hàng:</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {paymentInfo.bank_info?.bank_name ||
                      paymentInfo.bank_info?.name ||
                      "N/A"}
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        paymentInfo.bank_info?.bank_name ||
                          paymentInfo.bank_info?.name ||
                          "",
                        "tên ngân hàng"
                      )
                    }
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Số tài khoản:</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium font-mono">
                    {paymentInfo.bank_info?.account_number || "N/A"}
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        paymentInfo.bank_info?.account_number || "",
                        "số tài khoản"
                      )
                    }
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tên tài khoản:</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {paymentInfo.bank_info?.account_name || "N/A"}
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        paymentInfo.bank_info?.account_name || "",
                        "tên tài khoản"
                      )
                    }
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {paymentInfo.bank_info?.branch && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Chi nhánh:</span>
                  <span className="font-medium">
                    {paymentInfo.bank_info.branch}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Transfer Details */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            Chi Tiết Chuyển Khoản
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Số tiền:</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-red-600">
                  {paymentInfo.formatted_amount}
                </span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      typeof paymentInfo.amount === "number"
                        ? paymentInfo.amount.toString()
                        : paymentInfo.amount,
                      "số tiền"
                    )
                  }
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Nội dung:</span>
              <div className="flex items-center gap-2">
                <span className="font-medium font-mono">
                  {paymentInfo.transfer_content ||
                    paymentInfo.tracking_content ||
                    "N/A"}
                </span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      paymentInfo.transfer_content ||
                        paymentInfo.tracking_content ||
                        "",
                      "nội dung chuyển khoản"
                    )
                  }
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions - Support both SEPAY and legacy format */}
        {(paymentInfo.instructions ||
          (typeof paymentInfo.qr_code === "object" &&
            paymentInfo.qr_code?.instructions)) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              Hướng Dẫn Thanh Toán
            </h3>
            <ol className="space-y-2 text-sm">
              {paymentInfo.instructions ? (
                // SEPAY format (4 steps)
                <>
                  <li className="flex gap-2">
                    <span className="font-semibold text-blue-600">1.</span>
                    <span>{paymentInfo.instructions.step_1}</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-blue-600">2.</span>
                    <span>{paymentInfo.instructions.step_2}</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-blue-600">3.</span>
                    <span>{paymentInfo.instructions.step_3}</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-blue-600">4.</span>
                    <span>{paymentInfo.instructions.step_4}</span>
                  </li>
                </>
              ) : (
                // Legacy format (5 steps)
                typeof paymentInfo.qr_code === "object" &&
                paymentInfo.qr_code?.instructions && (
                  <>
                    <li className="flex gap-2">
                      <span className="font-semibold text-blue-600">1.</span>
                      <span>{paymentInfo.qr_code.instructions.step_1}</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold text-blue-600">2.</span>
                      <span>{paymentInfo.qr_code.instructions.step_2}</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold text-blue-600">3.</span>
                      <span>{paymentInfo.qr_code.instructions.step_3}</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold text-blue-600">4.</span>
                      <span>{paymentInfo.qr_code.instructions.step_4}</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold text-blue-600">5.</span>
                      <span>{paymentInfo.qr_code.instructions.step_5}</span>
                    </li>
                  </>
                )
              )}
            </ol>
          </div>
        )}

        {/* Warning */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <Clock className="h-5 w-5 text-orange-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-orange-800">
                Lưu Ý Quan Trọng
              </h4>
              <ul className="text-sm text-orange-700 mt-1 space-y-1">
                <li>• Vui lòng chuyển khoản đúng số tiền và nội dung</li>
                <li>• Đơn hàng sẽ được xử lý sau khi nhận được thanh toán</li>
                <li>• Liên hệ hotline nếu cần hỗ trợ: 1900-xxxx</li>
                <li>• Lưu lại biên lai để đối chiếu</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankTransferInfo;
