import React, { useState } from "react";
import { Table, Tag, Button, Space } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllPromotions,
  deletePromotion,
} from "../../../services/promotionService";
import { useNavigate } from "react-router-dom";
import type { IPromotion } from "../../../interfaces/promotion";
import toast from "react-hot-toast";
import ConfirmModal from "../../../components/ConfirmModal";

const ListPromotion: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // State cho confirm modal
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deletingPromotion, setDeletingPromotion] = useState<{id: number, name: string} | null>(null);

  const { data: promotions, isLoading } = useQuery({
    queryKey: ["promotions"],
    queryFn: getAllPromotions,
  });

  // Mutation để xóa promotion
  const deleteMutation = useMutation({
    mutationFn: deletePromotion,
    onSuccess: () => {
      toast.success("Xóa khuyến mãi thành công!");
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
    },
    onError: () => {
      toast.error("Có lỗi xảy ra khi xóa khuyến mãi!");
    },
  });

  // Handle delete - mở confirm modal
  const handleDelete = (id: number, name: string) => {
    console.log('Delete button clicked for promotion:', id, name); // Debug log
    setDeletingPromotion({ id, name });
    setIsConfirmModalOpen(true);
  };

  // Xử lý xác nhận xóa
  const handleConfirmDelete = () => {
    if (deletingPromotion) {
      console.log('Confirming delete for promotion:', deletingPromotion.id); // Debug log
      deleteMutation.mutate(deletingPromotion.id);
      setIsConfirmModalOpen(false);
      setDeletingPromotion(null);
    }
  };

  const formatCurrency = (amount: string) => {
    try {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(parseFloat(amount || "0"));
    } catch {
      return "0 VND";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN");
    } catch {
      return "N/A";
    }
  };

  const columns = [
    {
      title: "STT",
      render: (_: unknown, __: unknown, index: number) => index + 1,
    },
    {
      title: "Tên khuyến mãi",
      dataIndex: "promotion_name",
      key: "promotion_name",
      width: 250,
    },
    {
      title: "Mã khuyến mãi",
      dataIndex: "promotion_code",
      key: "promotion_code",
      width: 120,
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Giảm giá",
      dataIndex: "formatted_discount_value",
      key: "discount",
      width: 120,
    },
    {
      title: "Tối thiểu",
      dataIndex: "minimum_order_value",
      key: "minimum",
      width: 120,
      render: (value: string) => formatCurrency(value),
    },
    {
      title: "Tối đa",
      dataIndex: "maximum_discount_amount",
      key: "maximum",
      width: 120,
      render: (value: string | null) =>
        value ? formatCurrency(value) : "Không giới hạn",
    },
    {
      title: "Từ ngày",
      dataIndex: "start_date",
      key: "start_date",
      width: 100,
      render: (value: string) => formatDate(value),
    },
    {
      title: "Đến ngày",
      dataIndex: "end_date",
      key: "end_date",
      width: 100,
      render: (value: string) => formatDate(value),
    },
    {
      title: "Đã dùng",
      key: "usage",
      width: 80,
      render: (record: IPromotion) => {
        const used = record.used_count || 0;
        const limit = record.usage_limit || 0;
        return limit ? `${used}/${limit}` : `${used}/∞`;
      },
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 120,
      render: (record: IPromotion) => {
        if (record.is_expired) return <Tag color="red">Hết hạn</Tag>;
        if (record.is_used_up) return <Tag color="orange">Hết lượt</Tag>;
        if (record.is_usable) return <Tag color="green">Có thể sử dụng</Tag>;
        return <Tag color="default">Không khả dụng</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 150,
      render: (record: IPromotion) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/promotion/edit/${record.id}`)}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(
              record.id,
              record.promotion_name || 'Khuyến mãi'
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
        onClick={() => navigate("/admin/promotion/add")}
        className="px-4 py-2 mb-3 bg-amber-700 text-white rounded hover:bg-amber-800 transition font-semibold shadow"
      >
        Thêm Khuyến Mãi
      </button>

      <Table
        columns={columns}
        dataSource={promotions || []}
        rowKey="id"
        loading={isLoading}
        pagination={{
          pageSize: 15,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} khuyến mãi`,
        }}
        scroll={{ x: 1000 }}
        size="middle"
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setDeletingPromotion(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa khuyến mãi"
        message={`Bạn có chắc muốn xóa khuyến mãi "${deletingPromotion?.name}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
        isLoading={deleteMutation.isPending}
      />
    </>
  );
};

export default ListPromotion;
