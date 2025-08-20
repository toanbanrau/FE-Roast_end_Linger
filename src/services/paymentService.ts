import { clientAxios } from "../configs/config";

// Payment Status Response Interface
export interface PaymentStatusResponse {
  payment_id: number;
  order_id: number;
  status: 'pending' | 'completed' | 'failed';
  amount: number;
  formatted_amount: string;
  payment_gateway: string;
  transaction_id: string;
  tracking_content: string;
  created_at: string;
  expires_at: string;
  completed_at?: string;
  detection_method?: string;
  sepay_check?: {
    checked_at: string;
    api_response_time_ms: number;
    transactions_found: number;
    matching_transaction: any;
  };
  sepay_transaction?: any;
}

// API Response wrapper
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Kiểm tra trạng thái thanh toán
 * @param paymentId - ID của payment
 * @param checkSepay - Có gọi SePay API để check không (default: true)
 * @param signal - AbortSignal để cancel request
 * @returns Promise<PaymentStatusResponse>
 */
export const getPaymentStatus = async (
  paymentId: number,
  checkSepay: boolean = true,
  signal?: AbortSignal
): Promise<PaymentStatusResponse> => {
  console.log('🔗 Calling Payment Status API:', `/api/payments/${paymentId}/status?check_sepay=${checkSepay}`);

  try {
    const response = await clientAxios.get<ApiResponse<PaymentStatusResponse>>(
      `/payments/${paymentId}/status?check_sepay=${checkSepay}`,
      { signal }
    );

    console.log('📡 Payment API Response Status:', response.status);
    console.log('📦 Payment API Response Data:', response.data);

    if (!response.data.success) {
      console.error('❌ Payment API Error:', response.data.message);
      throw new Error(response.data.message || 'Payment status check failed');
    }

    // Validate response format
    if (!response.data.data) {
      console.error('❌ Missing data field in payment response');
      throw new Error('Invalid response format: missing data field');
    }

    if (!response.data.data.payment_id) {
      console.error('❌ Missing payment_id in payment response');
      throw new Error('Invalid response format: missing payment_id');
    }

    if (!response.data.data.status) {
      console.error('❌ Missing status in payment response');
      throw new Error('Invalid response format: missing status');
    }

    const paymentData = response.data.data;

    // Debug log theo status
    if (paymentData.status === 'completed') {
      console.log('🎉 Payment COMPLETED detected!', {
        payment_id: paymentData.payment_id,
        completed_at: paymentData.completed_at,
        detection_method: paymentData.detection_method,
        sepay_transaction: paymentData.sepay_transaction
      });
    } else {
      console.log('⏳ Payment still pending', {
        payment_id: paymentData.payment_id,
        status: paymentData.status,
        sepay_check: paymentData.sepay_check
      });
    }

    return paymentData;
  } catch (error: any) {
    console.error('❌ Payment status API call failed:', error);
    
    // Log chi tiết lỗi để debug
    if (error.response) {
      console.error('❌ Error Response Status:', error.response.status);
      console.error('❌ Error Response Data:', error.response.data);
    }
    
    throw error;
  }
};

/**
 * Tạo payment SePay cho order
 * @param orderId - ID của order
 * @returns Promise<PaymentStatusResponse>
 */
export const createSepayPayment = async (orderId: number): Promise<PaymentStatusResponse> => {
  console.log('🔗 Creating SePay Payment for order:', orderId);

  try {
    const response = await clientAxios.post<ApiResponse<PaymentStatusResponse>>(
      `/payments/sepay/${orderId}`
    );

    console.log('📡 Create SePay Payment Response:', response.data);

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to create SePay payment');
    }

    return response.data.data;
  } catch (error: any) {
    console.error('❌ Create SePay payment failed:', error);
    throw error;
  }
};

/**
 * Utility function để format thời gian
 * @param ms - Milliseconds
 * @returns Formatted time string
 */
export const formatTime = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  return minutes > 0 ? `${minutes}m ${seconds % 60}s` : `${seconds}s`;
};

/**
 * Utility function để get status color
 * @param status - Payment status
 * @returns Color code
 */
export const getPaymentStatusColor = (status: string): string => {
  const colorMap: { [key: string]: string } = {
    'completed': '#10B981',
    'failed': '#EF4444',
    'pending': '#F59E0B',
  };
  return colorMap[status] || '#6B7280';
};

/**
 * Utility function để get status text
 * @param status - Payment status
 * @returns Vietnamese status text
 */
export const getPaymentStatusText = (status: string): string => {
  const textMap: { [key: string]: string } = {
    'completed': 'Hoàn thành',
    'failed': 'Thất bại',
    'pending': 'Chờ thanh toán',
  };
  return textMap[status] || status;
};

/**
 * Utility function để get status message
 * @param status - Payment status
 * @returns Status message with emoji
 */
export const getPaymentStatusMessage = (status: string): string => {
  const messageMap: { [key: string]: string } = {
    'completed': '🎉 Thanh toán thành công!',
    'failed': '❌ Thanh toán thất bại',
    'pending': '⏳ Đang chờ thanh toán...',
  };
  return messageMap[status] || '🔄 Đang kiểm tra...';
};
