// Utility functions for product status

export type ProductStatus = 'active' | 'inactive' | 'out_of_stock';

export interface StatusDisplay {
  text: string;
  color: string;
  bgColor: string;
}

export const getProductStatusDisplay = (status: string): StatusDisplay => {
  switch (status) {
    case 'active':
      return {
        text: 'Đang bán',
        color: '#52c41a',
        bgColor: '#f6ffed'
      };
    case 'inactive':
      return {
        text: 'Ngừng bán',
        color: '#ff4d4f',
        bgColor: '#fff2f0'
      };
    case 'out_of_stock':
      return {
        text: 'Hết hàng',
        color: '#faad14',
        bgColor: '#fffbe6'
      };
    default:
      return {
        text: status,
        color: '#666666',
        bgColor: '#f5f5f5'
      };
  }
};

export const isProductAvailable = (status: string): boolean => {
  return status === 'active';
};

export const getProductStatusOptions = () => [
  { value: 'active', label: 'Đang bán' },
  { value: 'inactive', label: 'Ngừng bán' },
  { value: 'out_of_stock', label: 'Hết hàng' }
];
