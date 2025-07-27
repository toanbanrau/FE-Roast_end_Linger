import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  Button,
  Space,
  Tag,
  Card,
  Tabs,
  InputNumber,
  Alert,
  Modal,
  Statistic,
  Row,
  Col,
} from "antd";
import {
  WarningOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import type { IExpiringProduct, IExpiredProduct } from "../../../interfaces/inventory";
import {
  getExpiringProducts,
  getExpiredProducts,
  processExpiredProducts,
} from "../../../services/inventoryService";
import { toast } from "react-toastify";

const { TabPane } = Tabs;

export default function ExpiryManagement() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [expiringDays, setExpiringDays] = useState(30);

  // Lấy danh sách sản phẩm sắp hết hạn
  const { data: expiringProducts, isLoading: expiringLoading } = useQuery({
    queryKey: ["expiring-products", expiringDays],
    queryFn: () => getExpiringProducts({ days: expiringDays }),
  });

  // Lấy danh sách sản phẩm đã hết hạn
  const { data: expiredProducts, isLoading: expiredLoading } = useQuery({
    queryKey: ["expired-products"],
    queryFn: getExpiredProducts,
  });

  // Mutation xử lý hàng hết hạn
  const processExpiredMutation = useMutation({
    mutationFn: processExpiredProducts,
    onSuccess: (data) => {
      toast.success(`Đã xử lý ${data.total_processed} lô hàng hết hạn!`);
      queryClient.invalidateQueries({ queryKey: ["expired-products"] });
      queryClient.invalidateQueries({ queryKey: ["expiring-products"] });
    },
    onError: () => {
      toast.error("Có lỗi xảy ra khi xử lý hàng hết hạn!");
    },
  });

  const handleProcessExpired = () => {
    Modal.confirm({
      title: "Xác nhận xử lý hàng hết hạn",
      icon: <ExclamationCircleOutlined />,
      content: "Bạn có chắc muốn xử lý tất cả hàng đã hết hạn? Hành động này không thể hoàn tác.",
      okText: "Xử lý",
      cancelText: "Hủy",
      okType: "danger",
      onOk: () => processExpiredMutation.mutate(),
    });
  };

  const expiringColumns: ColumnsType<IExpiringProduct> = [
    {
      title: "STT",
      key: "stt",
      width: 60,
      render: (_: unknown, __: unknown, index: number) => index + 1,
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
      render: (_, record: IExpiringProduct) => (
        <div>
          <div className="font-medium">{record.product_name}</div>
          {record.variant_name && (
            <div className="text-gray-500 text-sm">{record.variant_name}</div>
          )}
        </div>
      ),
    },
    {
      title: "Số lượng còn lại",
      dataIndex: "remaining_quantity",
      key: "remaining_quantity",
      width: 120,
      render: (quantity: number) => (
        <span className="text-orange-600 font-medium">{quantity}</span>
      ),
    },
    {
      title: "Hạn sử dụng",
      dataIndex: "expiry_date",
      key: "expiry_date",
      width: 120,
      render: (date: string) => (
        <span>{new Date(date).toLocaleDateString("vi-VN")}</span>
      ),
    },
    {
      title: "Còn lại (ngày)",
      dataIndex: "days_until_expiry",
      key: "days_until_expiry",
      width: 100,
      render: (days: number) => {
        let color = "orange";
        if (days <= 7) color = "red";
        else if (days <= 15) color = "volcano";
        
        return <Tag color={color}>{days} ngày</Tag>;
      },
    },
    {
      title: "Vị trí",
      dataIndex: "storage_location",
      key: "storage_location",
      width: 100,
      render: (location: string) => location || "-",
    },
    {
      title: "Giá trị",
      dataIndex: "total_value",
      key: "total_value",
      width: 120,
      render: (value: string) => (
        <span className="text-green-600">
          {Number(value).toLocaleString()}₫
        </span>
      ),
    },
  ];

  const expiredColumns: ColumnsType<IExpiredProduct> = [
    {
      title: "STT",
      key: "stt",
      width: 60,
      render: (_: unknown, __: unknown, index: number) => index + 1,
    },
    {
      title: "Mã lô",
      dataIndex: "lot_number",
      key: "lot_number",
      width: 120,
      render: (lotNumber: string) => (
        <span className="font-mono text-red-600">{lotNumber}</span>
      ),
    },
    {
      title: "Sản phẩm",
      key: "product",
      width: 200,
      render: (_, record: IExpiredProduct) => (
        <div>
          <div className="font-medium">{record.product_name}</div>
          {record.variant_name && (
            <div className="text-gray-500 text-sm">{record.variant_name}</div>
          )}
        </div>
      ),
    },
    {
      title: "Số lượng còn lại",
      dataIndex: "remaining_quantity",
      key: "remaining_quantity",
      width: 120,
      render: (quantity: number) => (
        <span className="text-red-600 font-medium">{quantity}</span>
      ),
    },
    {
      title: "Hạn sử dụng",
      dataIndex: "expiry_date",
      key: "expiry_date",
      width: 120,
      render: (date: string) => (
        <span className="text-red-600">
          {new Date(date).toLocaleDateString("vi-VN")}
        </span>
      ),
    },
    {
      title: "Đã hết hạn",
      dataIndex: "days_expired",
      key: "days_expired",
      width: 100,
      render: (days: number) => (
        <Tag color="red">{days} ngày</Tag>
      ),
    },
    {
      title: "Vị trí",
      dataIndex: "storage_location",
      key: "storage_location",
      width: 100,
      render: (location: string) => location || "-",
    },
    {
      title: "Giá trị",
      dataIndex: "total_value",
      key: "total_value",
      width: 120,
      render: (value: string) => (
        <span className="text-red-600">
          {Number(value).toLocaleString()}₫
        </span>
      ),
    },
  ];

  // Tính toán thống kê
  const expiringStats = {
    totalProducts: expiringProducts?.length || 0,
    totalQuantity: expiringProducts?.reduce((sum, item) => sum + item.remaining_quantity, 0) || 0,
    totalValue: expiringProducts?.reduce((sum, item) => sum + Number(item.total_value), 0) || 0,
  };

  const expiredStats = {
    totalProducts: expiredProducts?.length || 0,
    totalQuantity: expiredProducts?.reduce((sum, item) => sum + item.remaining_quantity, 0) || 0,
    totalValue: expiredProducts?.reduce((sum, item) => sum + Number(item.total_value), 0) || 0,
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Quản lý hạn sử dụng</h1>
        <Button onClick={() => navigate("/admin/inventory")}>
          Quay lại danh sách
        </Button>
      </div>

      <Tabs defaultActiveKey="expiring">
        <TabPane
          tab={
            <span>
              <WarningOutlined />
              Sắp hết hạn ({expiringStats.totalProducts})
            </span>
          }
          key="expiring"
        >
          <Card className="mb-4">
            <Row gutter={16}>
              <Col span={6}>
                <Statistic
                  title="Số lô sắp hết hạn"
                  value={expiringStats.totalProducts}
                  valueStyle={{ color: '#fa8c16' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="Tổng số lượng"
                  value={expiringStats.totalQuantity}
                  valueStyle={{ color: '#fa8c16' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="Tổng giá trị"
                  value={expiringStats.totalValue}
                  formatter={(value) => `${Number(value).toLocaleString()}₫`}
                  valueStyle={{ color: '#fa8c16' }}
                />
              </Col>
              <Col span={6}>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Cảnh báo trước (ngày):
                  </label>
                  <InputNumber
                    value={expiringDays}
                    onChange={(value) => setExpiringDays(value || 30)}
                    min={1}
                    max={365}
                    style={{ width: "100%" }}
                  />
                </div>
              </Col>
            </Row>
          </Card>

          <Table
            columns={expiringColumns}
            dataSource={expiringProducts || []}
            rowKey="id"
            loading={expiringLoading}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1000 }}
          />
        </TabPane>

        <TabPane
          tab={
            <span>
              <DeleteOutlined />
              Đã hết hạn ({expiredStats.totalProducts})
            </span>
          }
          key="expired"
        >
          <Card className="mb-4">
            <Row gutter={16}>
              <Col span={6}>
                <Statistic
                  title="Số lô đã hết hạn"
                  value={expiredStats.totalProducts}
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="Tổng số lượng"
                  value={expiredStats.totalQuantity}
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="Tổng giá trị"
                  value={expiredStats.totalValue}
                  formatter={(value) => `${Number(value).toLocaleString()}₫`}
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Col>
              <Col span={6}>
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={handleProcessExpired}
                  loading={processExpiredMutation.isPending}
                  disabled={expiredStats.totalProducts === 0}
                >
                  Xử lý hàng hết hạn
                </Button>
              </Col>
            </Row>
          </Card>

          {expiredStats.totalProducts > 0 && (
            <Alert
              message="Cảnh báo"
              description="Có hàng đã hết hạn cần được xử lý. Vui lòng kiểm tra và xử lý kịp thời để tránh ảnh hưởng đến chất lượng kho hàng."
              type="error"
              showIcon
              className="mb-4"
            />
          )}

          <Table
            columns={expiredColumns}
            dataSource={expiredProducts || []}
            rowKey="id"
            loading={expiredLoading}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1000 }}
          />
        </TabPane>
      </Tabs>
    </div>
  );
}
