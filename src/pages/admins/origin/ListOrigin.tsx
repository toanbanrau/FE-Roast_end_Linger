import { Table, Space, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllOrigins, deleteOrigin } from "../../../services/originService";
import type { IOrigin } from "../../../interfaces/origin";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import ConfirmModal from "../../../components/ConfirmModal";
import { useState } from "react";

const ListOrigin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // State cho confirm modal
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deletingOrigin, setDeletingOrigin] = useState<{id: number, name: string} | null>(null);

  const { data: origins, isLoading } = useQuery({
    queryKey: ["origins"],
    queryFn: getAllOrigins,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOrigin,
    onSuccess: () => {
      toast.success("Xóa xuất xứ thành công!");
      queryClient.invalidateQueries({ queryKey: ["origins"] });
    },
    onError: () => {
      toast.error("Xóa xuất xứ thất bại!");
    },
  });

  // Handle delete - mở confirm modal
  const handleDeleteOrigin = (id: number, name: string) => {
    console.log('Delete button clicked for origin:', id, name); // Debug log
    setDeletingOrigin({ id, name });
    setIsConfirmModalOpen(true);
  };

  // Xử lý xác nhận xóa
  const handleConfirmDelete = () => {
    if (deletingOrigin) {
      console.log('Confirming delete for origin:', deletingOrigin.id); // Debug log
      deleteMutation.mutate(deletingOrigin.id);
      setIsConfirmModalOpen(false);
      setDeletingOrigin(null);
    }
  };

  const columns: ColumnsType<IOrigin> = [
    {
      title: "STT",
      key: "stt",
      render: (_: unknown, __: unknown, index: number) => index + 1,
    },
    {
      title: "Tên xuất xứ",
      dataIndex: "origin_name",
      key: "origin_name",
    },
    {
      title: "Quốc gia",
      dataIndex: "country",
      key: "country",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: unknown, record: IOrigin) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/origin/edit/${record.id}`)}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDeleteOrigin(
              record.id,
              record.origin_name || 'Xuất xứ'
            )}
            loading={deleteMutation.isPending}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <button
        onClick={() => navigate("/admin/origin/add")}
        className="px-4 py-2 mb-3 bg-amber-700 text-white rounded hover:bg-amber-800 transition font-semibold shadow"
      >
        Thêm Xuất Xứ
      </button>
      <Table
        columns={columns}
        loading={isLoading}
        dataSource={origins}
        rowKey="id"
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setDeletingOrigin(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa xuất xứ"
        message={`Bạn có chắc muốn xóa xuất xứ "${deletingOrigin?.name}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
        isLoading={deleteMutation.isPending}
      />
    </>
  );
};

export default ListOrigin;
