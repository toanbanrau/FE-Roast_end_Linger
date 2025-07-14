import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  Tag,
  Button,
  Input,
  Select,
  Space,
  Card,
  Statistic,
  Row,
  Col,
  message,
  Modal,
} from "antd";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import type { IOrder } from "../../../interfaces/order";
import {
  getAllOrders,
  getOrderStats,
  getOrderStatuses,
  updateOrderStatus,
} from "../../../services/adminOrderService";

const { Search } = Input;
const { Option } = Select;

export default function ListOrder() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<number | undefined>();
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<
    string | undefined
  >();

  // Lấy danh sách đơn hàng
  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: [
      "admin-orders",
      currentPage,
      searchQuery,
      statusFilter,
      paymentMethodFilter,
    ],
    queryFn: () => {
      return getAllOrders({
        page: currentPage,
        per_page: 10,
        search: searchQuery || undefined,
        status_id: statusFilter || undefined,
        payment_method: paymentMethodFilter || undefined,
      });
    },
  });

  // Lấy thống kê đơn hàng
  const { data: stats } = useQuery({
    queryKey: ["order-stats"],
    queryFn: () => getOrderStats(),
  });

  // Lấy danh sách trạng thái
  const { data: orderStatuses } = useQuery({
    queryKey: ["order-statuses"],
    queryFn: getOrderStatuses,
  });

  // Mutation cập nhật trạng thái
  const updateStatusMutation = useMutation({
    mutationFn: ({
      orderId,
      statusId,
    }: {
      orderId: number;
      statusId: number;
    }) => updateOrderStatus(orderId, statusId),
    onSuccess: () => {
      message.success("Cập nhật trạng thái đơn hàng thành công");
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["order-stats"] });
    },
    onError: () => {
      message.error("Cập nhật trạng thái thất bại");
    },
  });

  const handleStatusChange = (orderId: number, statusId: number) => {
    Modal.confirm({
      title: "Xác nhận thay đổi trạng thái",
      content: "Bạn có chắc chắn muốn thay đổi trạng thái đơn hàng này?",
      onOk: () => {
        updateStatusMutation.mutate({ orderId, statusId });
      },
    });
  };

  const getStatusColor = (statusName: string) => {
    const colorMap: { [key: string]: string } = {
      pending: "orange",
      confirmed: "blue",
      processing: "cyan",
      shipping: "purple",
      delivered: "green",
      completed: "green",
      cancelled: "red",
      refunded: "magenta",
    };
    return colorMap[statusName] || "default";
  };

  const getPaymentMethodColor = (method: string) => {
    const colorMap: { [key: string]: string } = {
      cash_on_delivery: "orange",
      bank_transfer: "blue",
      credit_card: "green",
      e_wallet: "purple",
    };
    return colorMap[method] || "default";
  };

  const getPaymentMethodText = (method: string) => {
    const textMap: { [key: string]: string } = {
      cash_on_delivery: "Thanh toán khi nhận hàng",
      bank_transfer: "Chuyển khoản ngân hàng",
      credit_card: "Thẻ tín dụng",
      e_wallet: "Ví điện tử",
    };
    return textMap[method] || method;
  };

  const columns: ColumnsType<IOrder> = [
    {
      title: "Mã đơn hàng",
      dataIndex: "order_number",
      key: "order_number",
      width: 150,
      render: (orderNumber: string) => (
        <span className="font-mono text-blue-600">{orderNumber}</span>
      ),
    },
    {
      title: "Khách hàng",
      key: "customer",
      width: 200,
      render: (_, record: IOrder) => (
        <div>
          <div className="font-medium">{record.customer_info.name}</div>
          <div className="text-gray-500 text-sm">
            {record.customer_info.phone}
          </div>
        </div>
      ),
    },
    {
      title: "Tổng tiền",
      key: "total",
      width: 120,
      render: (_, record: IOrder) => (
        <span className="font-semibold text-green-600">
          {Number(record.order_totals.total_amount).toLocaleString()}₫
        </span>
      ),
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "payment_method",
      key: "payment_method",
      width: 180,
      render: (method: string) => (
        <Tag color={getPaymentMethodColor(method)}>
          {getPaymentMethodText(method)}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 150,
      render: (_, record: IOrder) => (
        <Select
          value={record.status.id}
          style={{ width: "100%" }}
          onChange={(statusId) => handleStatusChange(record.id, statusId)}
          loading={updateStatusMutation.isPending}
        >
          {orderStatuses?.map((status) => (
            <Option key={status.id} value={status.id}>
              <Tag color={getStatusColor(status.name)}>
                {status.display_name}
              </Tag>
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Ngày tạo",
      key: "created_at",
      width: 120,
      render: (_, record: IOrder) => (
        <span>
          {new Date(record.dates.created_at).toLocaleDateString("vi-VN")}
        </span>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 100,
      render: (_, record: IOrder) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/admin/order/${record.id}`)}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6">
      {/* Thống kê */}
      {stats && (
        <Row gutter={16} className="mb-6">
          <Col span={6}>
            <Card>
              <Statistic
                title="Tổng đơn hàng"
                value={stats.summary.total_orders}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Tổng sản phẩm đã bán"
                value={stats.summary.total_items_sold}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Doanh thu tổng"
                value={Number(stats.summary.total_revenue).toLocaleString()}
                suffix="₫"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Giá trị đơn hàng trung bình"
                value={Number(
                  stats.summary.average_order_value
                ).toLocaleString()}
                suffix="₫"
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Bộ lọc */}
      <Card className="mb-6">
        <Space size="middle" wrap>
          <Search
            placeholder="Tìm kiếm theo mã đơn hàng, tên khách hàng..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={setSearchQuery}
            style={{ width: 300 }}
          />

          <Select
            placeholder="Lọc theo trạng thái"
            allowClear
            style={{ width: 200 }}
            onChange={setStatusFilter}
          >
            {orderStatuses?.map((status) => (
              <Option key={status.id} value={status.id}>
                {status.display_name}
              </Option>
            ))}
          </Select>

          <Select
            placeholder="Lọc theo phương thức thanh toán"
            allowClear
            style={{ width: 200 }}
            onChange={setPaymentMethodFilter}
          >
            <Option value="cash_on_delivery">Thanh toán khi nhận hàng</Option>
            <Option value="bank_transfer">Chuyển khoản ngân hàng</Option>
            <Option value="credit_card">Thẻ tín dụng</Option>
            <Option value="e_wallet">Ví điện tử</Option>
          </Select>
        </Space>
      </Card>

      {/* Bảng đơn hàng */}
      <Card>
        <Table
          columns={columns}
          dataSource={ordersData?.orders || []}
          rowKey="id"
          loading={ordersLoading}
          pagination={{
            current: currentPage,
            total: ordersData?.pagination.total || 0,
            pageSize: ordersData?.pagination.per_page || 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} đơn hàng`,
            onChange: (page) => setCurrentPage(page),
          }}
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  );
}
