import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { cancelOrder } from '../../services/checkoutService';
import type { CancelOrderRequest } from '../../interfaces/order';

interface CancelOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number;
  orderNumber: string;
  onSuccess?: () => void;
}

const CANCEL_REASONS = [
  'Đổi ý không muốn mua nữa',
  'Tìm được sản phẩm tốt hơn ở nơi khác',
  'Thời gian giao hàng quá lâu',
  'Thay đổi địa chỉ giao hàng',
  'Vấn đề về thanh toán',
  'Lý do khác'
];

export default function CancelOrderModal({ 
  isOpen, 
  onClose, 
  orderId, 
  orderNumber, 
  onSuccess 
}: CancelOrderModalProps) {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [isCustomReason, setIsCustomReason] = useState(false);
  const queryClient = useQueryClient();

  // Cancel order mutation
  const cancelMutation = useMutation({
    mutationFn: (request: CancelOrderRequest) => cancelOrder(orderId, request),
    onSuccess: (data) => {
      toast.success('Đã hủy đơn hàng thành công');
      queryClient.invalidateQueries({ queryKey: ['myOrders'] });
      queryClient.invalidateQueries({ queryKey: ['order', orderId.toString()] });
      onSuccess?.();
      handleClose();
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi hủy đơn hàng';
      toast.error(errorMessage);
    },
  });

  const handleClose = () => {
    setSelectedReason('');
    setCustomReason('');
    setIsCustomReason(false);
    onClose();
  };

  const handleReasonChange = (reason: string) => {
    setSelectedReason(reason);
    setIsCustomReason(reason === 'Lý do khác');
    if (reason !== 'Lý do khác') {
      setCustomReason('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalReason = isCustomReason ? customReason.trim() : selectedReason;
    
    if (!finalReason) {
      toast.error('Vui lòng chọn hoặc nhập lý do hủy đơn hàng');
      return;
    }

    if (isCustomReason && customReason.trim().length < 10) {
      toast.error('Lý do hủy phải có ít nhất 10 ký tự');
      return;
    }

    cancelMutation.mutate({ reason: finalReason });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-medium text-gray-900">
            Hủy đơn hàng
          </h2>
          <button
            onClick={handleClose}
            disabled={cancelMutation.isPending}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex items-start gap-3 mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-amber-800 mb-1">
                Xác nhận hủy đơn hàng #{orderNumber}
              </p>
              <p className="text-amber-700">
                Hành động này không thể hoàn tác. Đơn hàng sẽ được hủy ngay lập tức.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Lý do hủy đơn hàng <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {CANCEL_REASONS.map((reason) => (
                  <label key={reason} className="flex items-center">
                    <input
                      type="radio"
                      name="cancelReason"
                      value={reason}
                      checked={selectedReason === reason}
                      onChange={(e) => handleReasonChange(e.target.value)}
                      disabled={cancelMutation.isPending}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">{reason}</span>
                  </label>
                ))}
              </div>
            </div>

            {isCustomReason && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nhập lý do cụ thể <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  disabled={cancelMutation.isPending}
                  rows={3}
                  placeholder="Vui lòng mô tả lý do hủy đơn hàng (tối thiểu 10 ký tự)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 disabled:bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {customReason.length}/200 ký tự
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t mt-6">
            <button
              type="button"
              onClick={handleClose}
              disabled={cancelMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
            >
              Đóng
            </button>
            <button
              type="submit"
              disabled={cancelMutation.isPending || (!selectedReason || (isCustomReason && customReason.trim().length < 10))}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelMutation.isPending ? 'Đang hủy...' : 'Xác nhận hủy'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
