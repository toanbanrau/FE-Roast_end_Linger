// Utility functions for order status formatting

/**
 * Chuyển đổi tên trạng thái từ tiếng Anh sang tiếng Việt
 */
export const getStatusText = (statusName: string | undefined | null): string => {
  if (!statusName) return "Không xác định";

  const statusMap: { [key: string]: string } = {
    pending: "Chờ xử lý",
    confirmed: "Đã xác nhận",
    processing: "Đang xử lý",
    preparing: "Đang chuẩn bị",
    shipping: "Đang vận chuyển",
    shipped: "Đã giao vận",
    out_for_delivery: "Đang giao hàng",
    delivered: "Đã giao hàng",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
    refunded: "Đã hoàn tiền",
    returned: "Đã trả hàng",
  };
  
  return statusMap[statusName.toLowerCase()] || statusName;
};

/**
 * Lấy màu cho trạng thái (dành cho Ant Design Tag)
 */
export const getStatusColor = (statusName: string | undefined | null): string => {
  if (!statusName) return "default";

  const colorMap: { [key: string]: string } = {
    pending: "orange",
    confirmed: "blue", 
    processing: "cyan",
    preparing: "purple",
    shipping: "purple",
    shipped: "geekblue",
    out_for_delivery: "geekblue",
    delivered: "green",
    completed: "success",
    cancelled: "error",
    refunded: "warning",
    returned: "magenta",
  };
  
  return colorMap[statusName.toLowerCase()] || "default";
};

/**
 * Kiểm tra xem trạng thái có phải là trạng thái cuối không
 */
export const isFinalStatus = (statusName: string | undefined | null): boolean => {
  if (!statusName) return false;
  
  const finalStatuses = ['completed', 'cancelled', 'refunded', 'returned'];
  return finalStatuses.includes(statusName.toLowerCase());
};

/**
 * Lấy danh sách trạng thái theo thứ tự tiến triển
 */
export const getStatusOrder = (): string[] => {
  return [
    'pending',        // 1. Chờ xử lý
    'confirmed',      // 2. Đã xác nhận
    'processing',     // 3. Đang xử lý
    'preparing',      // 4. Đang chuẩn bị
    'shipping',       // 5. Đang vận chuyển
    'shipped',        // 6. Đã giao vận
    'out_for_delivery', // 7. Đang giao hàng
    'delivered',      // 8. Đã giao hàng
    'completed',      // 9. Hoàn thành
  ];
};

/**
 * Kiểm tra xem có thể chuyển từ trạng thái hiện tại sang trạng thái mới không
 */
export const canChangeStatus = (
  currentStatus: string | undefined | null,
  newStatus: string | undefined | null
): boolean => {
  if (!currentStatus || !newStatus) return false;

  const currentStatusName = currentStatus.toLowerCase();
  const newStatusName = newStatus.toLowerCase();

  // Nếu trạng thái hiện tại là cuối thì không được chỉnh
  if (isFinalStatus(currentStatusName)) {
    return false;
  }

  // Cho phép chuyển sang cancelled từ bất kỳ trạng thái nào (trừ final statuses)
  if (newStatusName === 'cancelled') {
    return true;
  }

  // Không cho phép chuyển từ cancelled sang trạng thái khác
  if (currentStatusName === 'cancelled') {
    return false;
  }

  // Kiểm tra thứ tự tiến triển (chỉ được tiến lên)
  const statusOrder = getStatusOrder();
  const currentIndex = statusOrder.indexOf(currentStatusName);
  const newIndex = statusOrder.indexOf(newStatusName);

  // Nếu không tìm thấy trong statusOrder, cho phép (có thể là trạng thái đặc biệt)
  if (currentIndex === -1 || newIndex === -1) {
    return true;
  }

  // Chỉ cho phép tiến lên (newIndex >= currentIndex)
  return newIndex >= currentIndex;
};
