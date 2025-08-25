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
  Row,
  Col,
  Divider,
  Image,
  Tooltip,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { OrderItemDetail } from "../../../interfaces/order";
import {
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  getOrderStatuses,
} from "../../../services/adminOrderService";
import { getStatusText } from "../../../utils/orderStatusUtils";
import { toast } from "react-toastify";

const { Option } = Select;

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Lấy chi tiết đơn hàng
  const { data: order, isLoading } = useQuery({
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

  // Mutation cập nhật trạng thái (giống ListOrder)
  const updateStatusMutation = useMutation({
    mutationFn: ({
      orderId,
      statusId,
    }: {
      orderId: number;
      statusId: number;
    }) => {
      console.log("🚀 Mutation function called:", { orderId, statusId });
      return updateOrderStatus(orderId, statusId);
    },
    onSuccess: (data) => {
      console.log("✅ Mutation success:", data);
      toast.success("Cập nhật trạng thái đơn hàng thành công");
      queryClient.invalidateQueries({ queryKey: ["admin-order-detail", id] });
    },
    onError: (error) => {
      console.error("❌ Mutation error:", error);
      toast.error("Cập nhật trạng thái thất bại");
    },
  });

  // Mutation cập nhật trạng thái thanh toán
  const updatePaymentStatusMutation = useMutation({
    mutationFn: ({ orderId, isPaid }: { orderId: number; isPaid: boolean }) =>
      updatePaymentStatus(orderId, isPaid),
    onSuccess: () => {
      toast.success("Cập nhật trạng thái thanh toán thành công");
      queryClient.invalidateQueries({ queryKey: ["admin-order-detail", id] });
    },
    onError: () => {
      toast.error("Cập nhật trạng thái thanh toán thất bại");
    },
  });

  // Định nghĩa thứ tự trạng thái (từ thấp đến cao) - theo database
  const statusOrder = [
    "pending", // 1. Chờ xử lý
    "confirmed", // 2. Đã xác nhận
    "processing", // 3. Đang xử lý
    "shipping", // 4. Đang vận chuyển
    "delivered", // 5. Đã giao hàng
    "completed", // 6. Hoàn thành
  ];

  // Trạng thái cuối (không thể chỉnh sửa)
  const finalStatuses = ["completed", "cancelled", "refunded"];

  // Kiểm tra xem có thể chuyển trạng thái không
  const canChangeStatus = (
    currentStatus: string | undefined | null,
    newStatusId: number
  ) => {
    const newStatus = orderStatuses?.find((s) => s.id === newStatusId);
    if (!newStatus || !newStatus.status_name) return false;

    const newStatusName = newStatus.status_name.toLowerCase();
    const currentStatusName = (currentStatus || "").toLowerCase();

    if (finalStatuses.includes(currentStatusName)) {
      return false;
    }

    if (newStatusName === "cancelled") {
      // Chỉ cho phép hủy khi đơn hàng đang ở trạng thái "Chờ xử lý" (pending)
      return currentStatusName === "pending";
    }

    if (currentStatusName === "cancelled") {
      return false;
    }

    const currentIndex = statusOrder.indexOf(currentStatusName);
    const newIndex = statusOrder.indexOf(newStatusName);

    if (currentIndex === -1 || newIndex === -1) {
      return true;
    }

    // Chỉ cho phép tiến lên một bước
    return newIndex === currentIndex + 1;
  };

  const handleStatusChange = (statusId: number) => {
    if (!order) return;

    const newStatus = orderStatuses?.find((s) => s.id === statusId);

    // Validate: Cannot complete an unpaid order
    if (
      newStatus?.status_name.toLowerCase() === "completed" &&
      !order.is_paid
    ) {
      toast.error("Đơn hàng phải được thanh toán trước khi hoàn thành!");
      return;
    }

    const currentStatusName = order.status.name;

    if (!canChangeStatus(currentStatusName, statusId)) {
      const newStatusText = newStatus
        ? getStatusText(newStatus.status_name)
        : "Unknown";
      const currentStatusText = getStatusText(currentStatusName);

      if (finalStatuses.includes(currentStatusName.toLowerCase())) {
        toast.error(
          `Không thể thay đổi trạng thái từ "${currentStatusText}" vì đơn hàng đã hoàn tất!`
        );
      } else {
        toast.error(
          `Không thể chuyển từ "${currentStatusText}" về "${newStatusText}". Chỉ có thể tiến lên trạng thái tiếp theo!`
        );
      }
      return;
    }

    updateStatusMutation.mutate({ orderId: Number(id), statusId });
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
      render: (_, record) => {
        // Ưu tiên hiển thị ảnh variant nếu có, nếu không thì dùng ảnh product
        const imageUrl =
          record.variant?.image || record.product.image || "/placeholder.svg";
        const altText = record.variant
          ? `${record.product.current_name} - ${record.variant.current_name}`
          : record.product.current_name;

        return (
          <div className="flex items-center space-x-3">
            <Image
              src={imageUrl}
              alt={altText}
              width={60}
              height={60}
              className="rounded-lg object-cover"
              fallback="/placeholder.svg"
            />
            <div>
              <div className="font-medium">{record.product.current_name}</div>
              {record.variant && (
                <div className="text-sm text-gray-500">
                  Biến thể: {record.variant.current_name}
                </div>
              )}
              {record.variant?.sku && (
                <div className="text-xs text-gray-400">
                  SKU: {record.variant.sku}
                </div>
              )}
            </div>
          </div>
        );
      },
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

  const currentStatusName = order.status.name.toLowerCase();
  const isFinalStatus = finalStatuses.includes(currentStatusName);

  // Lọc các trạng thái có thể chuyển đến
  const availableStatuses = orderStatuses?.filter(
    (status) =>
      !["completed", "cancelled", "refunded"].includes(
        status.status_name.toLowerCase()
      ) && canChangeStatus(order.status.name, status.id)
  );

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
                <Tooltip
                  title={
                    isFinalStatus
                      ? "Đơn hàng đã hoàn tất, không thể thay đổi trạng thái"
                      : "Chỉ có thể chuyển lên trạng thái tiếp theo"
                  }
                >
                  <Select
                    value={order.status.id}
                    style={{ width: 180 }}
                    onChange={handleStatusChange}
                    loading={updateStatusMutation.isPending}
                    disabled={
                      isFinalStatus ||
                      !availableStatuses ||
                      availableStatuses.length === 0
                    }
                  >
                    {/* Hiển thị trạng thái hiện tại */}
                    <Option key={order.status.id} value={order.status.id}>
                      <Tag color={getStatusColor(currentStatusName)}>
                        {getStatusText(order.status.name)}
                      </Tag>
                    </Option>

                    {/* Hiển thị các trạng thái có thể chuyển đến */}
                    {availableStatuses?.map((status) => (
                      <Option key={status.id} value={status.id}>
                        <Tag color={status.color}>
                          {getStatusText(status.status_name)}
                        </Tag>
                      </Option>
                    ))}
                  </Select>
                </Tooltip>
              </Descriptions.Item>
              <Descriptions.Item label="Phương thức thanh toán" span={1}>
                {getPaymentMethodText(order.payment_method)}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái thanh toán" span={1}>
                <Select
                  value={order.is_paid}
                  style={{ width: 150 }}
                  loading={updatePaymentStatusMutation.isPending}
                  disabled={updatePaymentStatusMutation.isPending}
                  onChange={(value: boolean) => {
                    updatePaymentStatusMutation.mutate({
                      orderId: order.id,
                      isPaid: value,
                    });
                  }}
                >
                  <Option value={false}>
                    <Tag color="orange">Chưa thanh toán</Tag>
                  </Option>
                  <Option value={true}>
                    <Tag color="green">Đã thanh toán</Tag>
                  </Option>
                </Select>
              </Descriptions.Item>
              <Descriptions.Item label="Phương thức giao hàng" span={1}>
                <div>
                  <div className="font-medium">
                    {order.shipping_method.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {order.shipping_method.description}
                  </div>
                  <div className="text-xs text-gray-400">
                    Thời gian giao hàng:{" "}
                    {order.shipping_method.estimated_delivery}
                  </div>
                </div>
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
                <span>
                  Phí vận chuyển:
                  <div className="text-xs text-gray-500">
                    ({order.shipping_method.name})
                  </div>
                </span>
                <span>
                  {Number(order.order_totals.shipping_fee) === 0
                    ? "Miễn phí"
                    : `${Number(
                        order.order_totals.shipping_fee
                      ).toLocaleString()}₫`}
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
                        {getStatusText(history.new_status.name)}
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
