import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, MapPin, Edit2, Trash2, Star, StarOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { 
  getAddresses, 
  deleteAddress, 
  setDefaultAddress,
  addressQueryOptions 
} from '../../services/addressUserServices';
import type { UserAddress } from '../../interfaces/address';
import AddressModal from './AddressModal';

export default function AddressManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null);
  const queryClient = useQueryClient();

  // Fetch addresses
  const { data: addresses = [], isLoading, error } = useQuery(
    addressQueryOptions.getAddresses()
  );

  // Delete address mutation
  const deleteMutation = useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Đã xóa địa chỉ thành công');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi xóa địa chỉ');
    },
  });

  // Set default address mutation
  const setDefaultMutation = useMutation({
    mutationFn: setDefaultAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Đã đặt làm địa chỉ mặc định');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    },
  });

  const handleAddNew = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleEdit = (address: UserAddress) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSetDefault = (id: number) => {
    setDefaultMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="p-6 text-center">
          <p className="text-red-600">Có lỗi xảy ra khi tải danh sách địa chỉ</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-medium">Địa chỉ</h2>
          <button
            onClick={handleAddNew}
            className="text-amber-800 hover:text-amber-900 text-sm font-medium flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Thêm địa chỉ mới
          </button>
        </div>

        <div className="p-6">
          {addresses.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chưa có địa chỉ nào
              </h3>
              <p className="text-gray-500 mb-4">
                Thêm địa chỉ để thuận tiện cho việc giao hàng
              </p>
              <button
                onClick={handleAddNew}
                className="bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-md font-medium"
              >
                Thêm địa chỉ đầu tiên
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={`border rounded-lg p-4 ${
                    address.is_default ? 'border-amber-200 bg-amber-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{address.type_icon}</span>
                        <span className="font-medium">{address.display_label}</span>
                        {address.is_default && (
                          <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                            Mặc định
                          </span>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        <p className="font-medium text-gray-900">{address.recipient_name}</p>
                        <p>{address.phone_number}</p>
                        <p>{address.full_address}</p>
                        {address.delivery_notes && (
                          <p className="text-gray-500 italic">
                            Ghi chú: {address.delivery_notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      {!address.is_default && (
                        <button
                          onClick={() => handleSetDefault(address.id)}
                          disabled={setDefaultMutation.isPending}
                          className="text-gray-400 hover:text-amber-600 p-1"
                          title="Đặt làm mặc định"
                        >
                          <StarOff className="h-4 w-4" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleEdit(address)}
                        className="text-gray-400 hover:text-blue-600 p-1"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDelete(address.id)}
                        disabled={deleteMutation.isPending}
                        className="text-gray-400 hover:text-red-600 p-1"
                        title="Xóa"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Address Modal */}
      <AddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        address={editingAddress}
        onSuccess={() => {
          setIsModalOpen(false);
          queryClient.invalidateQueries({ queryKey: ['addresses'] });
        }}
      />
    </>
  );
}
