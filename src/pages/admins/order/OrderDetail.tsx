import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Descriptions,
  Table,
  Tag,
  Button,
  Select,
  Space,
  Timeline,
  message,
  Modal,
  Row,
  Col,
  Divider,
  Image,
} from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { IOrder, OrderItemDetail } from "../../../interfaces/order";
import {
  getOrderById,
  updateOrderStatus,
  getOrderStatuses,
} from "../../../services/adminOrderService";

const { Option } = Select;

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditingStatus, setIsEditingStatus] = useState(false);

  // Lấy chi tiết đơn hàng
  const {
    data: order,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-order-detail", id],
    queryFn: () => {
      console.log("Fetching order with ID:", id);
      return getOrderById(Number(id));
    },
    enabled: !!id,
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
      queryClient.invalidateQueries({ queryKey: ["admin-order-detail", id] });
      setIsEditingStatus(false);
    },
    onError: () => {
      message.error("Cập nhật trạng thái thất bại");
    },
  });

  const handleStatusChange = (statusId: number) => {
    Modal.confirm({
      title: "Xác nhận thay đổi trạng thái",
      content: "Bạn có chắc chắn muốn thay đổi trạng thái đơn hàng này?",
      onOk: () => {
        updateStatusMutation.mutate({ orderId: Number(id), statusId });
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

  const getPaymentMethodText = (method: string) => {
    const textMap: { [key: string]: string } = {
      cash_on_delivery: "Thanh toán khi nhận hàng",
      bank_transfer: "Chuyển khoản ngân hàng",
      credit_card: "Thẻ tín dụng",
      e_wallet: "Ví điện tử",
    };
    return textMap[method] || method;
  };

  const itemColumns: ColumnsType<OrderItemDetail> = [
    {
      title: "Sản phẩm",
      key: "product",
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <Image
            src={record.product.image || "/placeholder.svg"}
            alt={record.product.current_name}
            width={60}
            height={60}
            className="rounded-lg object-cover"
          />
          <div>
            <div className="font-medium">{record.product.current_name}</div>
            {record.variant && (
              <div className="text-sm text-gray-500">
                Biến thể: {record.variant.current_name}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "unit_price",
      key: "unit_price",
      render: (price: string) => (
        <span className="font-medium">{Number(price).toLocaleString()}₫</span>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity: number) => (
        <span className="font-medium">{quantity}</span>
      ),
    },
    {
      title: "Thành tiền",
      dataIndex: "total_price",
      key: "total_price",
      render: (total: string) => (
        <span className="font-semibold text-green-600">
          {Number(total).toLocaleString()}₫
        </span>
      ),
    },
  ];

  if (isLoading) {
    return <div className="p-6">Đang tải...</div>;
  }

  if (!order) {
    return <div className="p-6">Không tìm thấy đơn hàng</div>;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Space size="middle">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/admin/order")}
          >
            Quay lại
          </Button>
          <h1 className="text-2xl font-bold m-0">
            Chi tiết đơn hàng #{order.order_number}
          </h1>
        </Space>
      </div>

      <Row gutter={24}>
        {/* Cột trái - Thông tin đơn hàng */}
        <Col span={16}>
          {/* Thông tin cơ bản */}
          <Card title="Thông tin đơn hàng" className="mb-6">
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Mã đơn hàng" span={1}>
                <span className="font-mono text-blue-600">
                  {order.order_number}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái" span={1}>
                <div className="flex items-center space-x-2">
                  <Tag color={getStatusColor(order.status.name)}>
                    {order.status.display_name}
                  </Tag>
                  {!isEditingStatus ? (
                    <Button
                      size="small"
                      icon={<EditOutlined />}
                      onClick={() => setIsEditingStatus(true)}
                    >
                      Sửa
                    </Button>
                  ) : (
                    <Space>
                      <Select
                        value={order.status.id}
                        style={{ width: 150 }}
                        onChange={handleStatusChange}
                        loading={updateStatusMutation.isPending}
                      >
                        {orderStatuses?.map((status) => (
                          <Option key={status.id} value={status.id}>
                            {status.display_name}
                          </Option>
                        ))}
                      </Select>
                      <Button
                        size="small"
                        onClick={() => setIsEditingStatus(false)}
                      >
                        Hủy
                      </Button>
                    </Space>
                  )}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Phương thức thanh toán" span={1}>
                {getPaymentMethodText(order.payment_method)}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo" span={1}>
                {new Date(order.dates.created_at).toLocaleString("vi-VN")}
              </Descriptions.Item>
              <Descriptions.Item label="Ghi chú" span={2}>
                {order.notes || "Không có ghi chú"}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Thông tin khách hàng */}
          <Card title="Thông tin khách hàng" className="mb-6">
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Tên khách hàng" span={1}>
                {order.customer_info.name}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại" span={1}>
                {order.customer_info.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Email" span={2}>
                {order.customer_info.email}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Thông tin giao hàng */}
          <Card title="Thông tin giao hàng" className="mb-6">
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Địa chỉ giao hàng">
                {order.delivery_info.full_address}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Danh sách sản phẩm */}
          <Card title="Danh sách sản phẩm">
            <Table
              columns={itemColumns}
              dataSource={order.items}
              rowKey="id"
              pagination={false}
              summary={() => (
                <Table.Summary>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={3}>
                      <strong>Tổng cộng</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                      <strong className="text-green-600">
                        {Number(
                          order.order_totals.total_amount
                        ).toLocaleString()}
                        ₫
                      </strong>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )}
            />
          </Card>
        </Col>

        {/* Cột phải - Thông tin bổ sung */}
        <Col span={8}>
          {/* Tóm tắt đơn hàng */}
          <Card title="Tóm tắt đơn hàng" className="mb-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span>
                  {Number(order.order_totals.subtotal).toLocaleString()}₫
                </span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
                <span>
                  {Number(order.order_totals.shipping_fee).toLocaleString()}₫
                </span>
              </div>
              <div className="flex justify-between">
                <span>Giảm giá:</span>
                <span>
                  -{Number(order.order_totals.discount_amount).toLocaleString()}
                  ₫
                </span>
              </div>
              <Divider className="my-2" />
              <div className="flex justify-between text-lg font-semibold">
                <span>Tổng cộng:</span>
                <span className="text-green-600">
                  {Number(order.order_totals.total_amount).toLocaleString()}₫
                </span>
              </div>
            </div>
          </Card>

          {/* Lịch sử đơn hàng */}
          <Card title="Lịch sử đơn hàng">
            <Timeline
              items={
                order.histories?.map((history) => ({
                  children: (
                    <div>
                      <div className="font-medium">
                        {history.new_status.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(history.created_at).toLocaleString("vi-VN")}
                      </div>
                      {history.notes && (
                        <div className="text-sm text-gray-600 mt-1">
                          {history.notes}
                        </div>
                      )}
                    </div>
                  ),
                  color: getStatusColor(
                    history.new_status.name?.toLowerCase() || "default"
                  ),
                })) || []
              }
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
