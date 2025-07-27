import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  Button,
  Space,
  Tag,
  Input,
  Select,
  Card,
  Tooltip,
  Modal,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ExportOutlined,
  ImportOutlined,
  UndoOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import type {
  IInventoryLot,
  IInventoryLotsQuery,
} from "../../../interfaces/inventory";
import {
  getInventoryLots,
  deleteInventoryLot,
} from "../../../services/inventoryService";
import { toast } from "react-toastify";

const { Search } = Input;
const { Option } = Select;

export default function ListInventory() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [storageFilter, setStorageFilter] = useState<string>("");

  // Query parameters
  const queryParams: IInventoryLotsQuery = {
    page: currentPage,
    per_page: 10,
    search: searchQuery || undefined,
    status: statusFilter || undefined,
    storage_location: storageFilter || undefined,
  };

  // Lấy danh sách lô hàng
  const { data: inventoryData, isLoading } = useQuery({
    queryKey: ["inventory-lots", queryParams],
    queryFn: () => getInventoryLots(queryParams),
  });

  // Mutation xóa lô hàng
  const deleteMutation = useMutation({
    mutationFn: deleteInventoryLot,
    onSuccess: () => {
      toast.success("Xóa lô hàng thành công!");
      queryClient.invalidateQueries({ queryKey: ["inventory-lots"] });
    },
    onError: () => {
      toast.error("Có lỗi xảy ra khi xóa lô hàng!");
    },
  });

  const handleDelete = (id: number, lotNumber: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc muốn xóa lô hàng "${lotNumber}"?`,
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: () => deleteMutation.mutate(id),
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "green";
      case "expired":
        return "red";
      case "inactive":
        return "orange";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Hoạt động";
      case "expired":
        return "Hết hạn";
      case "inactive":
        return "Không hoạt động";
      default:
        return status;
    }
  };

  const columns: ColumnsType<IInventoryLot> = [
    {
      title: "STT",
      key: "stt",
      width: 60,
      render: (_: unknown, __: unknown, index: number) =>
        (currentPage - 1) * 10 + index + 1,
    },
    {
      title: "Mã lô",
      dataIndex: "lot_number",
      key: "lot_number",
      width: 120,
      render: (lotNumber: string) => (
        <span className="font-mono text-blue-600">{lotNumber}</span>
      ),
    },
    {
      title: "Sản phẩm",
      key: "product",
      width: 200,
      render: (_, record: IInventoryLot) => (
        <div>
          <div className="font-medium">{record.product.product_name}</div>
          {record.product_variant && (
            <div className="text-gray-500 text-sm">
              {record.product_variant.variant_name}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "supplier_name",
      key: "supplier_name",
      width: 150,
      render: (supplier: string) => supplier || "-",
    },
    {
      title: "Số lượng",
      key: "quantity",
      width: 120,
      render: (_, record: IInventoryLot) => (
        <div>
          <div>Nhập: {record.quantity}</div>
          <div className="text-green-600">Còn: {record.remaining_quantity}</div>
        </div>
      ),
    },
    {
      title: "Giá nhập",
      dataIndex: "unit_cost",
      key: "unit_cost",
      width: 100,
      render: (cost: string) => <span>{Number(cost).toLocaleString()}₫</span>,
    },
    {
      title: "Vị trí",
      dataIndex: "storage_location",
      key: "storage_location",
      width: 100,
      render: (location: string) => location || "-",
    },
    {
      title: "Hạn sử dụng",
      dataIndex: "expiry_date",
      key: "expiry_date",
      width: 120,
      render: (date: string) => {
        if (!date) return "-";
        const expiryDate = new Date(date);
        const today = new Date();
        const diffTime = expiryDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let color = "default";
        if (diffDays < 0) color = "red";
        else if (diffDays <= 30) color = "orange";
        else color = "green";

        return (
          <Tag color={color}>{new Date(date).toLocaleDateString("vi-VN")}</Tag>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 150,
      render: (_, record: IInventoryLot) => (
        <Space size="middle">
          <Tooltip title="Xem chi tiết">
            <Button
              icon={<EyeOutlined />}
              onClick={() => navigate(`/admin/inventory/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              icon={<EditOutlined />}
              onClick={() => navigate(`/admin/inventory/edit/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              icon={<DeleteOutlined />}
              danger
              onClick={() => handleDelete(record.id, record.lot_number)}
              loading={deleteMutation.isPending}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Quản lý tồn kho</h1>
        <Space>
          <Button
            type="primary"
            icon={<ImportOutlined />}
            onClick={() => navigate("/admin/inventory/import")}
          >
            Nhập kho
          </Button>
          <Button
            icon={<ExportOutlined />}
            onClick={() => navigate("/admin/inventory/export")}
          >
            Xuất kho
          </Button>
          <Button
            icon={<UndoOutlined />}
            onClick={() => navigate("/admin/inventory/return")}
          >
            Hoàn trả
          </Button>
        </Space>
      </div>

      {/* Bộ lọc */}
      <Card className="mb-6">
        <Space size="middle" wrap>
          <Search
            placeholder="Tìm kiếm theo mã lô, sản phẩm..."
            allowClear
            style={{ width: 300 }}
            onSearch={setSearchQuery}
          />

          <Select
            placeholder="Lọc theo trạng thái"
            allowClear
            style={{ width: 150 }}
            onChange={setStatusFilter}
          >
            <Option value="active">Hoạt động</Option>
            <Option value="expired">Hết hạn</Option>
            <Option value="inactive">Không hoạt động</Option>
          </Select>

          <Select
            placeholder="Lọc theo vị trí"
            allowClear
            style={{ width: 150 }}
            onChange={setStorageFilter}
          >
            <Option value="Kho A-01">Kho A-01</Option>
            <Option value="Kho A-02">Kho A-02</Option>
            <Option value="Kho B-01">Kho B-01</Option>
            <Option value="Kho B-02">Kho B-02</Option>
          </Select>
        </Space>
      </Card>

      {/* Bảng dữ liệu */}
      <Table
        columns={columns}
        dataSource={inventoryData?.data || []}
        rowKey="id"
        loading={isLoading}
        pagination={{
          current: currentPage,
          total: inventoryData?.total || 0,
          pageSize: inventoryData?.per_page || 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} lô hàng`,
          onChange: (page) => setCurrentPage(page),
        }}
        scroll={{ x: 1400 }}
      />
    </div>
  );
}
