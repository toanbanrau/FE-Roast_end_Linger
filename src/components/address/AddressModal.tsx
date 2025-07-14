import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { X, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { createAddress, updateAddress } from '../../services/addressUserServices';
import type { UserAddress, CreateAddressRequest, UpdateAddressRequest, AddressType } from '../../interfaces/address';
import { ADDRESS_TYPE_OPTIONS } from '../../interfaces/address';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  address?: UserAddress | null;
  onSuccess: () => void;
}

interface FormData {
  label: string;
  recipient_name: string;
  phone_number: string;
  address_line_1: string;
  address_line_2: string;
  ward: string;
  district: string;
  city: string;
  postal_code: string;
  type: AddressType;
  delivery_notes: string;
  is_default: boolean;
}

export default function AddressModal({ isOpen, onClose, address, onSuccess }: AddressModalProps) {
  const [formData, setFormData] = useState<FormData>({
    label: '',
    recipient_name: '',
    phone_number: '',
    address_line_1: '',
    address_line_2: '',
    ward: '',
    district: '',
    city: '',
    postal_code: '',
    type: 'home',
    delivery_notes: '',
    is_default: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens/closes or address changes
  useEffect(() => {
    if (isOpen) {
      if (address) {
        setFormData({
          label: address.label || '',
          recipient_name: address.recipient_name,
          phone_number: address.phone_number,
          address_line_1: address.address_line_1,
          address_line_2: address.address_line_2 || '',
          ward: address.ward,
          district: address.district,
          city: address.city,
          postal_code: address.postal_code || '',
          type: address.type,
          delivery_notes: address.delivery_notes || '',
          is_default: address.is_default,
        });
      } else {
        setFormData({
          label: '',
          recipient_name: '',
          phone_number: '',
          address_line_1: '',
          address_line_2: '',
          ward: '',
          district: '',
          city: '',
          postal_code: '',
          type: 'home',
          delivery_notes: '',
          is_default: false,
        });
      }
      setErrors({});
    }
  }, [isOpen, address]);

  // Create address mutation
  const createMutation = useMutation({
    mutationFn: createAddress,
    onSuccess: () => {
      toast.success('Đã thêm địa chỉ thành công');
      onSuccess();
    },
    onError: (error: any) => {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi thêm địa chỉ');
      }
    },
  });

  // Update address mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAddressRequest }) =>
      updateAddress(id, data),
    onSuccess: () => {
      toast.success('Đã cập nhật địa chỉ thành công');
      onSuccess();
    },
    onError: (error: any) => {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật địa chỉ');
      }
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.recipient_name.trim()) {
      newErrors.recipient_name = 'Tên người nhận là bắt buộc';
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'Số điện thoại là bắt buộc';
    } else if (!/^[0-9]{10,11}$/.test(formData.phone_number.replace(/\s/g, ''))) {
      newErrors.phone_number = 'Số điện thoại không hợp lệ';
    }

    if (!formData.address_line_1.trim()) {
      newErrors.address_line_1 = 'Địa chỉ là bắt buộc';
    }

    if (!formData.ward.trim()) {
      newErrors.ward = 'Phường/Xã là bắt buộc';
    }

    if (!formData.district.trim()) {
      newErrors.district = 'Quận/Huyện là bắt buộc';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Tỉnh/Thành phố là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData = {
      ...formData,
      label: formData.label || undefined,
      address_line_2: formData.address_line_2 || undefined,
      postal_code: formData.postal_code || undefined,
      delivery_notes: formData.delivery_notes || undefined,
    };

    if (address) {
      updateMutation.mutate({ id: address.id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-medium">
            {address ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Label và Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Nhãn địa chỉ
              </label>
              <input
                type="text"
                name="label"
                value={formData.label}
                onChange={handleInputChange}
                placeholder="Ví dụ: Nhà riêng, Văn phòng..."
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Loại địa chỉ
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
              >
                {ADDRESS_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Recipient Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Tên người nhận <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="recipient_name"
                value={formData.recipient_name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800 ${
                  errors.recipient_name ? 'border-red-500' : ''
                }`}
              />
              {errors.recipient_name && (
                <p className="text-red-500 text-sm mt-1">{errors.recipient_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800 ${
                  errors.phone_number ? 'border-red-500' : ''
                }`}
              />
              {errors.phone_number && (
                <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>
              )}
            </div>
          </div>

          {/* Address Lines */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Địa chỉ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address_line_1"
              value={formData.address_line_1}
              onChange={handleInputChange}
              placeholder="Số nhà, tên đường..."
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800 ${
                errors.address_line_1 ? 'border-red-500' : ''
              }`}
            />
            {errors.address_line_1 && (
              <p className="text-red-500 text-sm mt-1">{errors.address_line_1}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Địa chỉ bổ sung
            </label>
            <input
              type="text"
              name="address_line_2"
              value={formData.address_line_2}
              onChange={handleInputChange}
              placeholder="Tầng, căn hộ, tòa nhà..."
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Phường/Xã <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="ward"
                value={formData.ward}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800 ${
                  errors.ward ? 'border-red-500' : ''
                }`}
              />
              {errors.ward && (
                <p className="text-red-500 text-sm mt-1">{errors.ward}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Quận/Huyện <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800 ${
                  errors.district ? 'border-red-500' : ''
                }`}
              />
              {errors.district && (
                <p className="text-red-500 text-sm mt-1">{errors.district}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Tỉnh/Thành phố <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800 ${
                  errors.city ? 'border-red-500' : ''
                }`}
              />
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">{errors.city}</p>
              )}
            </div>
          </div>

          {/* Postal Code */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Mã bưu điện
            </label>
            <input
              type="text"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
            />
          </div>

          {/* Delivery Notes */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Ghi chú giao hàng
            </label>
            <textarea
              name="delivery_notes"
              value={formData.delivery_notes}
              onChange={handleInputChange}
              rows={3}
              placeholder="Ghi chú đặc biệt cho người giao hàng..."
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
            />
          </div>

          {/* Default Address */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_default"
              name="is_default"
              checked={formData.is_default}
              onChange={handleInputChange}
              className="h-4 w-4 text-amber-800 focus:ring-amber-800 border-gray-300 rounded"
            />
            <label htmlFor="is_default" className="ml-2 text-sm">
              Đặt làm địa chỉ mặc định
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md font-medium"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50"
            >
              {isLoading ? 'Đang xử lý...' : address ? 'Cập nhật' : 'Thêm địa chỉ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
