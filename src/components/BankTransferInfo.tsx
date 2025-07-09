import React from 'react';
import { Copy, CheckCircle, Clock, CreditCard } from 'lucide-react';
import { toast } from 'react-toastify';

interface BankInfo {
  name: string;
  account_number: string;
  account_name: string;
  branch: string;
}

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

interface PaymentInfo {
  method: string;
  bank_info: BankInfo;
  transfer_content: string;
  amount: string;
  formatted_amount: string;
  qr_code_enabled: boolean;
  qr_code: QRCodeInfo;
}

interface BankTransferInfoProps {
  paymentInfo: PaymentInfo;
  orderNumber: string;
}

const BankTransferInfo: React.FC<BankTransferInfoProps> = ({ paymentInfo, orderNumber }) => {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`Đã sao chép ${label}!`);
    }).catch(() => {
      toast.error('Không thể sao chép. Vui lòng sao chép thủ công.');
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
        {/* QR Code Section */}
        {paymentInfo.qr_code_enabled && (
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Quét QR Code để thanh toán
            </h3>
            <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg shadow-sm">
              <img
                src={paymentInfo.qr_code.viet_qr_url}
                alt="VietQR Code"
                className="w-64 h-64 mx-auto"
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Sử dụng app ngân hàng để quét mã QR
            </p>
          </div>
        )}

        {/* Bank Information */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Thông Tin Tài Khoản
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Ngân hàng:</span>
              <div className="flex items-center gap-2">
                <span className="font-medium">{paymentInfo.bank_info.name}</span>
                <button
                  onClick={() => copyToClipboard(paymentInfo.bank_info.name, 'tên ngân hàng')}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Số tài khoản:</span>
              <div className="flex items-center gap-2">
                <span className="font-medium font-mono">{paymentInfo.bank_info.account_number}</span>
                <button
                  onClick={() => copyToClipboard(paymentInfo.bank_info.account_number, 'số tài khoản')}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tên tài khoản:</span>
              <div className="flex items-center gap-2">
                <span className="font-medium">{paymentInfo.bank_info.account_name}</span>
                <button
                  onClick={() => copyToClipboard(paymentInfo.bank_info.account_name, 'tên tài khoản')}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Chi nhánh:</span>
              <span className="font-medium">{paymentInfo.bank_info.branch}</span>
            </div>
          </div>
        </div>

        {/* Transfer Details */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Chi Tiết Chuyển Khoản</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Số tiền:</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-red-600">{paymentInfo.formatted_amount}</span>
                <button
                  onClick={() => copyToClipboard(paymentInfo.amount, 'số tiền')}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Nội dung:</span>
              <div className="flex items-center gap-2">
                <span className="font-medium font-mono">{paymentInfo.transfer_content}</span>
                <button
                  onClick={() => copyToClipboard(paymentInfo.transfer_content, 'nội dung chuyển khoản')}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-blue-600" />
            Hướng Dẫn Thanh Toán
          </h3>
          <ol className="space-y-2 text-sm">
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
          </ol>
        </div>

        {/* Warning */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <Clock className="h-5 w-5 text-orange-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-orange-800">Lưu Ý Quan Trọng</h4>
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
