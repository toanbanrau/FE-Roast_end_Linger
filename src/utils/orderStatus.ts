// Utility functions for order status

export interface OrderStatusInfo {
  canCancel: boolean;
  canReorder: boolean;
  canTrack: boolean;
  canDownloadInvoice: boolean;
  statusText: string;
  statusColor: string;
}

// Common order status names (these might vary based on backend)
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed', 
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
} as const;

export const getOrderStatusInfo = (status: any): OrderStatusInfo => {
  const statusName = status?.name?.toLowerCase() || status?.status_name?.toLowerCase() || '';
  
  return {
    canCancel: status?.can_be_cancelled || false,
    canReorder: [ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED].includes(statusName),
    canTrack: [ORDER_STATUS.CONFIRMED, ORDER_STATUS.PROCESSING, ORDER_STATUS.SHIPPED].includes(statusName),
    canDownloadInvoice: ![ORDER_STATUS.PENDING, ORDER_STATUS.CANCELLED].includes(statusName),
    statusText: status?.display_name || status?.name || 'Không xác định',
    statusColor: status?.color || '#666666',
  };
};

export const getOrderStatusDisplay = (status: any) => {
  const info = getOrderStatusInfo(status);
  return {
    text: info.statusText,
    color: info.statusColor,
    backgroundColor: `${info.statusColor}30`,
  };
};

// Check if order can be cancelled based on status
export const canCancelOrder = (status: any): boolean => {
  return status?.can_be_cancelled === true;
};

// Get user-friendly status messages
export const getStatusMessage = (statusName: string): string => {
  const messages: Record<string, string> = {
    [ORDER_STATUS.PENDING]: 'Đơn hàng đang chờ xác nhận',
    [ORDER_STATUS.CONFIRMED]: 'Đơn hàng đã được xác nhận',
    [ORDER_STATUS.PROCESSING]: 'Đang chuẩn bị hàng',
    [ORDER_STATUS.SHIPPED]: 'Đơn hàng đang được giao',
    [ORDER_STATUS.DELIVERED]: 'Đã giao hàng thành công',
    [ORDER_STATUS.CANCELLED]: 'Đơn hàng đã bị hủy',
    [ORDER_STATUS.REFUNDED]: 'Đã hoàn tiền',
  };
  
  return messages[statusName.toLowerCase()] || 'Trạng thái không xác định';
};

// Get next possible actions for an order
export const getOrderActions = (status: any) => {
  const info = getOrderStatusInfo(status);
  const actions = [];
  
  if (info.canCancel) {
    actions.push({
      type: 'cancel',
      label: 'Hủy đơn hàng',
      variant: 'danger',
      icon: 'X'
    });
  }
  
  if (info.canTrack) {
    actions.push({
      type: 'track',
      label: 'Theo dõi đơn hàng',
      variant: 'primary',
      icon: 'Truck'
    });
  }
  
  if (info.canReorder) {
    actions.push({
      type: 'reorder',
      label: 'Đặt lại',
      variant: 'secondary',
      icon: 'RotateCcw'
    });
  }
  
  if (info.canDownloadInvoice) {
    actions.push({
      type: 'invoice',
      label: 'Tải hóa đơn',
      variant: 'secondary',
      icon: 'Download'
    });
  }
  
  return actions;
};
