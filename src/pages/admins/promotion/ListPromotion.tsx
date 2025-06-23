import React from "react";
import { Table, Tag, Button, Space, Popconfirm, message, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined, FileAddOutlined } from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllPromotions, deletePromotion } from "../../../services/promotionService";
import { useNavigate } from "react-router-dom";
import type { IPromotion } from "../../../interfaces/promotion";
import EyeIcon from "../../../components/icons/EyeIcon";
import EditIcon from "../../../components/icons/EditIcon";
import TrashIcon from "../../../components/icons/TrashIcon";

const ListPromotion: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: promotions, isLoading } = useQuery({
    queryKey: ["promotions"],
    queryFn: getAllPromotions,
  });

  // Mutation để xóa promotion
  const deleteMutation = useMutation({
    mutationFn: deletePromotion,
    onSuccess: () => {
      message.success("Xóa khuyến mãi thành công!");
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
    },
    onError: () => {
      message.error("Có lỗi xảy ra khi xóa khuyến mãi!");
    },
  });

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
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
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Tên khuyến mãi",
      dataIndex: "promotion_name",
      key: "promotion_name",
      width: 200,
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
      render: (value: string | null) => value ? formatCurrency(value) : "Không giới hạn",
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
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <EyeIcon style={{color:'yellow',cursor: 'pointer', transition: 'color 0.2s'}} />
       <EditIcon
         style={{ color: '#1677ff', cursor: 'pointer', transition: 'color 0.2s' }}
         onClick={() => navigate(`/admin/promotion/edit/${record.id}`)}
        
       />
       <TrashIcon
         style={{ color: '#ff4d4f', cursor: 'pointer', transition: 'color 0.2s' }}
         onClick={() => handleDelete(record.id)}

       />
      
       
     </div>
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
        scroll={{ x: 1200 }}
        size="middle"
      />
    </>
  );
};

export default ListPromotion;
